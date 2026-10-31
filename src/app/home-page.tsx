"use client";

import {
  useState,
  useEffect,
  useRef,
  useCallback,
  useMemo,
  useSyncExternalStore,
} from "react";
import dynamic from "next/dynamic";
import { Layout } from "@/components/layout";
import { Panel, PanelGroup, PanelResizeHandle } from "react-resizable-panels";
import { Link2, Link2Off } from "lucide-react";
import { DEFAULT_MARKDOWN } from "@/data/default-markdown";
import { DocumentTabs } from "@/components/document-tabs";
import { useUndoRedo } from "@/lib/use-undo-redo";
import { useDocuments } from "@/lib/use-documents";
import { ZenMode } from "@/components/zen-mode";
import { TemplateBuilder } from "@/components/template-builder";
import {
  CommandPalette,
  type PaletteAction,
} from "@/components/command-palette";
import {
  applyWrap,
  applyLinePrefix,
  insertBlock,
} from "@/lib/formatting";
import {
  WorkspaceToolbar,
  type EditorMode,
  type ExportAction,
  type ViewMode,
} from "@/components/workspace-toolbar";
import { DocumentsDialog } from "@/components/documents-dialog";
import { PublishDialog } from "@/components/publish-dialog";
import { ShortcutsDialog } from "@/components/shortcuts-dialog";
import { useConfirm } from "@/components/modal";
import { Toaster, useToasts } from "@/components/toast";
import { toggleTaskAt } from "@/lib/markdown/tasks";
import {
  buildStandaloneHtml,
  copyRichHtml,
  copyText,
  documentTitle,
  downloadBlob,
  exportableFragment,
  printHtml,
  sanitizeFilename,
  waitForRenderedBlocks,
} from "@/lib/export";
import { safeGet, safeRemove, safeSet } from "@/lib/storage";
import LZString from "lz-string";

const PREFS_KEY = "md-viewer-prefs";
const MAX_IMPORT_BYTES = 10 * 1024 * 1024;
const LARGE_IMPORT_BYTES = 2 * 1024 * 1024;
type ChangeHandler = (e: React.ChangeEvent<HTMLTextAreaElement>) => void;

// Markdown-mode formatting actions offered in the command palette.
const SOURCE_FORMATS: Record<
  string,
  {
    name: string;
    shortcut?: string;
    apply: (ta: HTMLTextAreaElement, value: string, onChange: ChangeHandler) => void;
  }
> = {
  "bold": { name: "Bold", shortcut: "Ctrl+B", apply: (t, v, onChange) => applyWrap(t, v, onChange, "**", "**", "bold") },
  "italic": { name: "Italic", shortcut: "Ctrl+I", apply: (t, v, onChange) => applyWrap(t, v, onChange, "*", "*", "italic") },
  "strikethrough": { name: "Strikethrough", apply: (t, v, onChange) => applyWrap(t, v, onChange, "~~", "~~", "text") },
  "h1": { name: "Heading 1", apply: (t, v, onChange) => applyLinePrefix(t, v, onChange, "# ") },
  "h2": { name: "Heading 2", apply: (t, v, onChange) => applyLinePrefix(t, v, onChange, "## ") },
  "h3": { name: "Heading 3", apply: (t, v, onChange) => applyLinePrefix(t, v, onChange, "### ") },
  "link": { name: "Insert Link", shortcut: "Ctrl+K", apply: (t, v, onChange) => applyWrap(t, v, onChange, "[", "](url)", "link text") },
  "image": { name: "Insert Image", apply: (t, v, onChange) => applyWrap(t, v, onChange, "![", "](url)", "alt text") },
  "code": { name: "Inline Code", apply: (t, v, onChange) => applyWrap(t, v, onChange, "`", "`", "code") },
  "codeblock": { name: "Code Block", apply: (t, v, onChange) => insertBlock(t, v, onChange, "```\n\n```\n", 4) },
  "ul": { name: "Unordered List", apply: (t, v, onChange) => applyLinePrefix(t, v, onChange, "- ") },
  "ol": { name: "Ordered List", apply: (t, v, onChange) => applyLinePrefix(t, v, onChange, "1. ") },
  "quote": { name: "Blockquote", apply: (t, v, onChange) => applyLinePrefix(t, v, onChange, "> ") },
  "table": { name: "Insert Table", apply: (t, v, onChange) => insertBlock(t, v, onChange, "| Col 1 | Col 2 | Col 3 |\n| --- | --- | --- |\n| Cell | Cell | Cell |\n") },
  "hr": { name: "Horizontal Rule", apply: (t, v, onChange) => insertBlock(t, v, onChange, "---\n") },
};

const IMPORT_EXTENSIONS = /\.(md|markdown|mdown|mkd|mdx|txt|text)$/i;

// Responsive layout detection
const DESKTOP_QUERY = "(min-width: 1024px)";
function subscribeDesktop(onChange: () => void) {
  const media = window.matchMedia(DESKTOP_QUERY);
  media.addEventListener("change", onChange);
  return () => media.removeEventListener("change", onChange);
}
function getIsDesktop() {
  return window.matchMedia(DESKTOP_QUERY).matches;
}

const paneSkeleton = (
  <div className="flex-1 rounded-xl border border-border bg-card text-card-foreground shadow-sm animate-pulse" />
);

const Editor = dynamic(
  () => import("@/components/editor").then((mod) => mod.Editor),
  { ssr: false, loading: () => paneSkeleton },
);

const Preview = dynamic(
  () => import("@/components/preview").then((mod) => mod.Preview),
  { ssr: false, loading: () => paneSkeleton },
);

const VisualEditor = dynamic(
  () => import("@/components/visual-editor").then((mod) => mod.VisualEditor),
  { ssr: false, loading: () => paneSkeleton },
);

export default function HomePage() {
  const docs = useDocuments(DEFAULT_MARKDOWN);
  const {
    documents,
    activeId: activeDocId,
    setActiveId,
    setContent,
    createDocument,
    renameDocument,
    duplicateDocument,
    deleteDocument,
    restoreDocument,
    purgeDocument,
    clearAllLocalData,
    flush,
    isInitialized,
  } = docs;
  const isDesktop = useSyncExternalStore(subscribeDesktop, getIsDesktop, () => false);
  const [scrollRatio, setScrollRatio] = useState(0);
  const scrollSourceRef = useRef<"editor" | "preview" | null>(null);
  const [isScrollSyncEnabled, setIsScrollSyncEnabled] = useState(true);
  const {
    push: pushHistory,
    undo: undoHistory,
    redo: redoHistory,
    reset: resetHistory,
    canUndo,
    canRedo,
  } = useUndoRedo();
  const [zenMode, setZenMode] = useState(false);
  const [templatesOpen, setTemplatesOpen] = useState(false);
  const [commandPaletteOpen, setCommandPaletteOpen] = useState(false);
  const [documentsOpen, setDocumentsOpen] = useState(false);
  const [publishOpen, setPublishOpen] = useState(false);
  const [shortcutsOpen, setShortcutsOpen] = useState(false);
  const [editorMode, setEditorMode] = useState<EditorMode>("markdown");
  const [viewMode, setViewMode] = useState<ViewMode>("split");
  const [offscreenPreview, setOffscreenPreview] = useState(false);
  const editorTextareaRef = useRef<HTMLTextAreaElement | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const articleRef = useRef<HTMLElement | null>(null);
  const { toasts, toast, dismiss } = useToasts();
  const { confirm, dialog: confirmDialog } = useConfirm();

  const activeDoc = documents.find((d) => d.id === activeDocId);
  const markdown = activeDoc?.content ?? "";
  const title = documentTitle(activeDoc?.name ?? "", markdown);

  // Latest values for callbacks that run outside React's render cycle.
  const markdownRef = useRef(markdown);
  const activeIdRef = useRef(activeDocId);
  useEffect(() => {
    markdownRef.current = markdown;
    activeIdRef.current = activeDocId;
  });

  const setMarkdown = useCallback(
    (content: string) => {
      const current = markdownRef.current;
      if (current === content) return;
      pushHistory(current);
      markdownRef.current = content;
      setContent(activeIdRef.current, content);
    },
    [pushHistory, setContent],
  );

  const handleUndo = useCallback(() => {
    const prev = undoHistory(markdownRef.current);
    if (prev !== null) {
      markdownRef.current = prev;
      setContent(activeIdRef.current, prev);
    }
  }, [undoHistory, setContent]);

  const handleRedo = useCallback(() => {
    const next = redoHistory(markdownRef.current);
    if (next !== null) {
      markdownRef.current = next;
      setContent(activeIdRef.current, next);
    }
  }, [redoHistory, setContent]);

  const notify = useCallback(
    (message: string, kind: "success" | "error" | "info" = "info") =>
      toast(message, { kind }),
    [toast],
  );

  // Preferences
  useEffect(() => {
    try {
      const prefs = JSON.parse(safeGet(PREFS_KEY) ?? "{}");
      if (prefs.editorMode === "visual" || prefs.editorMode === "markdown") {
        // Stored preferences can only be read after hydration.
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setEditorMode(prefs.editorMode);
      }
      if (["split", "editor", "preview"].includes(prefs.viewMode)) {
        setViewMode(prefs.viewMode);
      }
    } catch {
      /* ignore malformed prefs */
    }
  }, []);

  useEffect(() => {
    if (!isInitialized) return;
    safeSet(PREFS_KEY, JSON.stringify({ editorMode, viewMode }));
  }, [editorMode, viewMode, isInitialized]);

  const switchDocument = useCallback(
    (id: string) => {
      setActiveId(id);
      setScrollRatio(0);
      resetHistory();
    },
    [setActiveId, resetHistory],
  );

  const handleNewTab = useCallback(() => {
    createDocument();
    resetHistory();
  }, [createDocument, resetHistory]);

  // Shared links open as an additional document; existing documents are never replaced.
  // Links are handled on load and when pasted into a tab that already has MDViewer open.
  useEffect(() => {
    if (!isInitialized) return;
    const openSharedLink = () => {
      const hash = window.location.hash;
      if (!hash.startsWith("#lz=") && !hash.startsWith("#md=")) return;
      let sharedContent: string | null = null;
      if (hash.startsWith("#lz=")) {
        sharedContent = LZString.decompressFromEncodedURIComponent(hash.slice(4));
      } else {
        // Backward compat with old base64 links
        try {
          sharedContent = new TextDecoder().decode(
            Uint8Array.from(atob(hash.slice(4)), (c) => c.charCodeAt(0)),
          );
        } catch {
          /* ignore */
        }
      }
      window.history.replaceState(null, "", window.location.pathname);
      if (sharedContent) {
        createDocument("Shared document", sharedContent);
        resetHistory();
        toast("Opened the shared document as a new local document. Your other documents are unchanged.", { kind: "info" });
      } else {
        toast("This share link is damaged or incomplete and could not be opened.", { kind: "error" });
      }
    };
    openSharedLink();
    window.addEventListener("hashchange", openSharedLink);
    return () => window.removeEventListener("hashchange", openSharedLink);
  }, [isInitialized, createDocument, resetHistory, toast]);

  // Import
  const openFile = useCallback(
    async (file: File) => {
      if (!IMPORT_EXTENSIONS.test(file.name) && !(file.type || "").startsWith("text/")) {
        toast(`"${file.name}" isn't a Markdown or text file. Supported: .md, .markdown, .txt`, { kind: "error" });
        return;
      }
      if (file.size > MAX_IMPORT_BYTES) {
        toast(`"${file.name}" is larger than 10 MB and can't be opened in the browser editor.`, { kind: "error" });
        return;
      }
      if (
        file.size > LARGE_IMPORT_BYTES &&
        !(await confirm({
          title: "Open a large file?",
          message: `"${file.name}" is ${(file.size / 1024 / 1024).toFixed(1)} MB. Editing and preview may be slow, and it may not fit in browser storage.`,
          confirmLabel: "Open anyway",
        }))
      ) {
        return;
      }
      let text: string;
      try {
        text = (await file.text()).replace(/^﻿/, "");
      } catch {
        toast(`Could not read "${file.name}".`, { kind: "error" });
        return;
      }
      const name = file.name.replace(IMPORT_EXTENSIONS, "") || "Imported";
      const current = documents.find((d) => d.id === activeIdRef.current);
      if (current && current.content.trim() === "") {
        // Nothing to lose: reuse the empty document.
        renameDocument(current.id, name);
        setContent(current.id, text);
        resetHistory();
      } else {
        createDocument(name, text);
        resetHistory();
      }
      toast(`Opened "${file.name}". Your other documents are unchanged.`, { kind: "success" });
    },
    [documents, confirm, toast, renameDocument, setContent, createDocument, resetHistory],
  );

  const requestImport = useCallback(() => fileInputRef.current?.click(), []);

  // Export
  const getArticle = useCallback(async () => {
    const isRendered = () =>
      Boolean(articleRef.current?.isConnected && articleRef.current.getClientRects().length > 0);
    if (!isRendered()) {
      setOffscreenPreview(true);
      const start = Date.now();
      while (!isRendered() && Date.now() - start < 5000) {
        await new Promise((r) => setTimeout(r, 50));
      }
    }
    const article = articleRef.current;
    const complete = article ? await waitForRenderedBlocks(article) : false;
    return { article, complete };
  }, []);

  const getFragment = useCallback(async () => {
    const { article, complete } = await getArticle();
    const result = article ? exportableFragment(article) : { html: "", notes: [] };
    if (article && !complete) {
      result.notes.push("Some diagrams or charts were still rendering and are missing from this export. Try again in a moment.");
    }
    setOffscreenPreview(false);
    return result;
  }, [getArticle]);

  const handleExport = useCallback(
    async (action: ExportAction) => {
      const filename = sanitizeFilename(title);
      try {
        switch (action) {
          case "download-md":
            downloadBlob(markdownRef.current, `${filename}.md`, "text/markdown;charset=utf-8");
            toast(`Downloaded ${filename}.md`, { kind: "success" });
            break;
          case "copy-md":
            await copyText(markdownRef.current);
            toast("Markdown copied to clipboard.", { kind: "success" });
            break;
          case "download-html": {
            const { html, notes } = await getFragment();
            downloadBlob(buildStandaloneHtml(title, html), `${filename}.html`, "text/html;charset=utf-8");
            toast(`Downloaded ${filename}.html. ${notes.join(" ")}`.trim(), { kind: "success" });
            break;
          }
          case "copy-html": {
            const { html } = await getFragment();
            await copyRichHtml(html, markdownRef.current);
            toast("Rendered HTML copied. Paste it into a rich-text editor.", { kind: "success" });
            break;
          }
          case "print-pdf": {
            const { html } = await getFragment();
            await printHtml(buildStandaloneHtml(title, html));
            toast('Print dialog opened. Choose "Save as PDF" as the destination to create a PDF.', { kind: "info" });
            break;
          }
        }
      } catch (err) {
        const blocked = err instanceof DOMException && err.name === "NotAllowedError";
        toast(
          blocked
            ? "The browser blocked clipboard access. Allow clipboard permissions or use a download option."
            : `Export failed: ${err instanceof Error ? err.message : String(err)}`,
          { kind: "error" },
        );
      }
    },
    [title, getFragment, toast],
  );

  // Destructive actions
  const requestDelete = useCallback(
    async (id: string) => {
      const doc = documents.find((d) => d.id === id);
      if (!doc) return;
      if (
        doc.content.trim() &&
        !(await confirm({
          title: `Delete "${doc.name}"?`,
          message: "The document moves to Recently deleted (in Documents), where you can restore it for 30 days.",
          confirmLabel: "Delete",
          danger: true,
        }))
      ) {
        return;
      }
      deleteDocument(id);
      resetHistory();
      toast(`Deleted "${doc.name}".`, {
        kind: "info",
        action: { label: "Undo", onClick: () => restoreDocument(id) },
      });
    },
    [documents, confirm, deleteDocument, restoreDocument, resetHistory, toast],
  );

  const requestClear = useCallback(async () => {
    if (
      markdownRef.current &&
      (await confirm({
        title: "Clear this document?",
        message: "All text in the current document will be removed. You can undo this with Ctrl+Z.",
        confirmLabel: "Clear",
        danger: true,
      }))
    ) {
      setMarkdown("");
    }
  }, [confirm, setMarkdown]);

  const requestReset = useCallback(async () => {
    if (
      await confirm({
        title: "Replace with the sample document?",
        message: "The current text will be replaced by the MDViewer sample. You can undo this with Ctrl+Z.",
        confirmLabel: "Replace",
        danger: true,
      })
    ) {
      setMarkdown(DEFAULT_MARKDOWN);
    }
  }, [confirm, setMarkdown]);

  const requestClearAll = useCallback(async () => {
    if (
      await confirm({
        title: "Clear all local data?",
        message: `This permanently deletes all ${documents.length} documents, the Recently deleted list and preferences from this browser. Export anything you want to keep first. This cannot be undone.`,
        confirmLabel: "Delete everything",
        danger: true,
      })
    ) {
      clearAllLocalData();
      safeRemove(PREFS_KEY);
      resetHistory();
      setDocumentsOpen(false);
      toast("All local MDViewer data was removed from this browser.", { kind: "success" });
    }
  }, [confirm, documents.length, clearAllLocalData, resetHistory, toast]);

  const handleToggleTask = useCallback(
    (offset: number) => {
      const next = toggleTaskAt(markdownRef.current, offset);
      if (next !== null) setMarkdown(next);
    },
    [setMarkdown],
  );

  const toggleEditorMode = useCallback(() => {
    setEditorMode((m) => (m === "markdown" ? "visual" : "markdown"));
  }, []);

  // Template insertion
  const handleTemplateInsert = useCallback(
    (content: string) => {
      const ta = editorTextareaRef.current;
      if (ta && editorMode === "markdown") {
        insertBlock(
          ta,
          markdownRef.current,
          (e: React.ChangeEvent<HTMLTextAreaElement>) =>
            setMarkdown(e.target.value),
          content,
        );
      } else {
        setMarkdown(markdownRef.current.replace(/\n*$/, "\n\n") + content);
      }
    },
    [setMarkdown, editorMode],
  );

  // onChange wrapper for command palette formatting
  const onChangeHandler = useCallback(
    (e: React.ChangeEvent<HTMLTextAreaElement>) => {
      setMarkdown(e.target.value);
    },
    [setMarkdown],
  );

  const runSourceFormat = useCallback(
    (id: string) => {
      const ta = editorTextareaRef.current;
      if (ta) SOURCE_FORMATS[id].apply(ta, markdownRef.current, onChangeHandler);
    },
    [onChangeHandler],
  );

  // Command palette actions
  const paletteActions: PaletteAction[] = useMemo(() => {
    return [
      // Format (Markdown mode)
      ...Object.entries(SOURCE_FORMATS).map(([id, f]) => ({
        id,
        name: f.name,
        shortcut: f.shortcut,
        section: "Format",
        handler: () => runSourceFormat(id),
      })),
      // Edit
      { id: "undo", name: "Undo", shortcut: "Ctrl+Z", section: "Edit", handler: handleUndo },
      { id: "redo", name: "Redo", shortcut: "Ctrl+Y", section: "Edit", handler: handleRedo },
      // File
      { id: "new-doc", name: "New Document", section: "File", handler: handleNewTab },
      { id: "documents", name: "Manage Documents", section: "File", handler: () => setDocumentsOpen(true) },
      { id: "open-file", name: "Open File…", section: "File", handler: requestImport },
      { id: "export-md", name: "Download Markdown", section: "File", handler: () => handleExport("download-md") },
      { id: "export-html", name: "Download HTML", section: "File", handler: () => handleExport("download-html") },
      { id: "export-pdf", name: "Print / Save as PDF", section: "File", handler: () => handleExport("print-pdf") },
      { id: "share", name: "Publish / Share…", section: "File", handler: () => setPublishOpen(true) },
      // View
      { id: "mode", name: "Switch Markdown / Visual Mode", shortcut: "Ctrl+Shift+M", section: "View", handler: toggleEditorMode },
      { id: "zen", name: "Zen Mode", section: "View", handler: () => setZenMode(true) },
      { id: "templates", name: "Open Templates", section: "View", handler: () => setTemplatesOpen(true) },
      { id: "shortcuts", name: "Keyboard Shortcuts", section: "View", handler: () => setShortcutsOpen(true) },
    ];
  }, [runSourceFormat, handleUndo, handleRedo, handleNewTab, requestImport, handleExport, toggleEditorMode]);

  // Global keyboard shortcuts
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      const mod = e.ctrlKey || e.metaKey;
      if (!mod) return;
      const key = e.key.toLowerCase();
      if (key === "p" && !e.shiftKey) {
        e.preventDefault();
        setCommandPaletteOpen((p) => !p);
      } else if (key === "s" && !e.shiftKey) {
        e.preventDefault();
        if (flush()) toast("Saved in this browser.", { kind: "success", durationMs: 1500 });
      } else if (key === "m" && e.shiftKey) {
        e.preventDefault();
        toggleEditorMode();
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [flush, toast, toggleEditorMode]);


  const tabs = documents.map((d) => ({ id: d.id, name: d.name }));

  const editorPane = (roundedTopLeft: boolean) => (
    <div
      className={`flex-1 min-h-0 rounded-xl ${roundedTopLeft ? "" : "rounded-tl-none"} border border-border bg-card text-card-foreground shadow-sm overflow-hidden flex flex-col`}
    >
      {editorMode === "markdown" ? (
        <Editor
          value={markdown}
          onChange={onChangeHandler}
          scrollRatio={scrollRatio}
          onScrollSync={setScrollRatio}
          scrollSourceRef={scrollSourceRef}
          isScrollSyncEnabled={isScrollSyncEnabled}
          onUndo={handleUndo}
          onRedo={handleRedo}
          canUndo={canUndo}
          canRedo={canRedo}
          onZenMode={() => setZenMode(true)}
          onOpenTemplates={() => setTemplatesOpen(true)}
          onTextareaRef={(el) => { editorTextareaRef.current = el; }}
          onOpenFile={openFile}
          onRequestImport={requestImport}
          onRequestClear={requestClear}
          onRequestReset={requestReset}
          onNotify={notify}
          className="flex-1"
        />
      ) : (
        <div
          className="flex h-full flex-col"
          onDragOver={(e) => e.preventDefault()}
          onDrop={(e) => {
            const file = e.dataTransfer.files[0];
            if (file) {
              e.preventDefault();
              openFile(file);
            }
          }}
        >
          <div className="flex items-center justify-between px-4 py-2 border-b border-border bg-muted/50">
            <span className="text-sm font-medium text-muted-foreground">Visual Editor</span>
            <button
              type="button"
              className="text-xs text-muted-foreground hover:text-foreground underline cursor-pointer"
              onClick={() => setEditorMode("markdown")}
            >
              Edit Markdown source
            </button>
          </div>
          {activeDoc && (
            <VisualEditor
              key={activeDocId}
              markdown={markdown}
              onChange={setMarkdown}
              onPasteWarnings={(w) => toast(w.join(" "), { kind: "error" })}
            />
          )}
        </div>
      )}
    </div>
  );

  const previewPane = (
    <div className="flex-1 min-h-0 rounded-xl border border-border bg-card text-card-foreground shadow-sm overflow-hidden flex flex-col">
      <Preview
        content={markdown}
        scrollRatio={scrollRatio}
        onScrollSync={setScrollRatio}
        scrollSourceRef={scrollSourceRef}
        isScrollSyncEnabled={isScrollSyncEnabled && editorMode === "markdown"}
        onToggleTask={handleToggleTask}
        onArticleRef={(el) => { articleRef.current = el; }}
      />
    </div>
  );

  return (
    <Layout>
      {/* Hero / Crawlable Intro */}
      <section className="text-center max-w-3xl mx-auto mb-6">
        <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight mb-3">
          Free Online Markdown Editor &amp; Viewer
        </h1>
        <p className="text-muted-foreground text-base md:text-lg leading-relaxed">
          Write, preview, and perfect your Markdown in real time. MDViewer
          supports GitHub Flavored Markdown (GFM), syntax highlighting, LaTeX
          math, Mermaid diagrams, Chart.js charts and a visual editor — with
          your documents saved locally in your browser, not on our servers.
        </p>
      </section>

      {/* Tool Section */}
      <section
        className="w-full mb-6"
        aria-label="Markdown Editor and Preview"
      >
        <input
          ref={fileInputRef}
          type="file"
          accept=".md,.markdown,.mdown,.mkd,.mdx,.txt,.text,text/markdown,text/plain"
          className="hidden"
          aria-hidden="true"
          tabIndex={-1}
          data-testid="file-input"
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (file) openFile(file);
            e.target.value = "";
          }}
        />

        <WorkspaceToolbar
          status={docs.status}
          documentCount={documents.length}
          editorMode={editorMode}
          onEditorModeChange={setEditorMode}
          viewMode={viewMode}
          onViewModeChange={setViewMode}
          onOpenDocuments={() => setDocumentsOpen(true)}
          onImport={requestImport}
          onExport={handleExport}
          onPublish={() => setPublishOpen(true)}
          onShowShortcuts={() => setShortcutsOpen(true)}
        />

        {/* Document Tabs */}
        <DocumentTabs
          tabs={tabs}
          activeId={activeDocId}
          onSwitch={switchDocument}
          onNew={handleNewTab}
          onClose={requestDelete}
          onRename={renameDocument}
        />

        <div className="h-[750px] flex flex-col">
          {viewMode === "editor" ? (
            editorPane(false)
          ) : viewMode === "preview" ? (
            previewPane
          ) : isDesktop ? (
            // Desktop: Horizontal resizable panels
            <PanelGroup
              direction="horizontal"
              className="flex-1 h-full min-h-0 gap-2"
              autoSaveId="md-viewer-split"
            >
              <Panel defaultSize={50} minSize={20} className="flex flex-col">
                {editorPane(false)}
              </Panel>

              <div className="w-2 flex flex-col items-center justify-center space-y-2">
                <button
                  title="Toggle scroll sync"
                  aria-label="Toggle scroll sync"
                  aria-pressed={isScrollSyncEnabled}
                  onClick={() => setIsScrollSyncEnabled((prev) => !prev)}
                  className="inline-flex items-center justify-center rounded-md py-2 mt-12 border transition cursor-pointer"
                >
                  {isScrollSyncEnabled ? (
                    <Link2 className="rotate-90" />
                  ) : (
                    <Link2Off className="rotate-90" />
                  )}
                </button>

                <PanelResizeHandle
                  className="h-full flex items-center justify-center transition-colors hover:bg-accent/50"
                  aria-label="Resize editor and preview"
                >
                  <div className="w-1 h-12 bg-border rounded-full" />
                </PanelResizeHandle>
              </div>

              <Panel
                defaultSize={50}
                minSize={20}
                className="flex flex-col"
              >
                {previewPane}
              </Panel>
            </PanelGroup>
          ) : (
            // Mobile: Vertical stacked layout (no resize)
            <div className="flex flex-col gap-6 flex-1 h-full min-h-0">
              <div className="h-[400px] shrink-0 flex flex-col">{editorPane(false)}</div>
              {previewPane}
            </div>
          )}
        </div>

        {/* Off-screen preview used only while exporting from editor-only view. */}
        {offscreenPreview && viewMode === "editor" && (
          <div
            className="fixed top-0 -left-[10000px] h-[600px] w-[820px]"
            aria-hidden="true"
            inert
          >
            <Preview
              content={markdown}
              scrollRatio={0}
              onScrollSync={() => {}}
              scrollSourceRef={scrollSourceRef}
              isScrollSyncEnabled={false}
              onArticleRef={(el) => { articleRef.current = el; }}
            />
          </div>
        )}
      </section>

      {/* Content Sections */}
      <div className="space-y-16 py-8 border-t border-border">
        {/* Intro Section */}
        <section className="max-w-4xl mx-auto text-center space-y-8">
          <h2 className="text-4xl md:text-6xl font-extrabold tracking-tight bg-gradient-to-r from-blue-600 via-blue-500 to-indigo-600 dark:from-blue-400 dark:via-blue-300 dark:to-indigo-400 bg-clip-text text-transparent py-2">
            The Professional Choice for Online Markdown Viewing
          </h2>
          <p className="text-xl md:text-2xl text-muted-foreground leading-relaxed">
            Stop guessing what your documentation looks like.{" "}
            <strong>MDViewer</strong> provides a polished, high-performance{" "}
            <strong>live markdown editor</strong> and real-time renderer that
            helps you craft perfect content every time. Built for developers,
            technical writers, and students who demand precision and speed.
          </p>
        </section>

        {/* Value Proposition Grid */}
        <section className="grid md:grid-cols-3 gap-10">
          <div className="p-10 rounded-3xl border bg-card hover:shadow-xl transition-all duration-300 space-y-6 group">
            <div className="h-14 w-14 bg-primary/10 rounded-2xl flex items-center justify-center text-3xl group-hover:scale-110 transition-transform font-bold">
              ⚡
            </div>
            <h2 className="text-2xl font-bold">Instant Render Engine</h2>
            <p className="text-muted-foreground leading-relaxed text-lg">
              Our bespoke rendering pipeline processes every keystroke in
              milliseconds. Experience true{" "}
              <strong>live markdown preview</strong> without lag, even with
              complex GFM tables and large documents.
            </p>
          </div>
          <div className="p-10 rounded-3xl border bg-card hover:shadow-xl transition-all duration-300 space-y-6 group">
            <div className="h-14 w-14 bg-primary/10 rounded-2xl flex items-center justify-center text-3xl group-hover:scale-110 transition-transform font-bold">
              🐙
            </div>
            <h2 className="text-2xl font-bold">GitHub Native Support</h2>
            <p className="text-muted-foreground leading-relaxed text-lg">
              We fully support the{" "}
              <strong>GitHub Flavored Markdown (GFM)</strong> specification. If
              it works on GitHub, it should render consistently here for common
              use cases. Useful for drafting READMEs, wikis, and issue comments.
            </p>
          </div>
          <div className="p-10 rounded-3xl border bg-card hover:shadow-xl transition-all duration-300 space-y-6 group">
            <div className="h-14 w-14 bg-primary/10 rounded-2xl flex items-center justify-center text-3xl group-hover:scale-110 transition-transform font-bold">
              🔒
            </div>
            <h2 className="text-2xl font-bold">Privacy-Focused Editing</h2>
            <p className="text-muted-foreground leading-relaxed text-lg">
              MDViewer stores your draft content in your browser using
              <strong> local browser storage</strong> so your writing can persist
              between visits on the same device.
            </p>
          </div>
        </section>

        {/* Markdown for Professionals Section */}
        <section className="space-y-12">
          <div className="text-center space-y-4 max-w-3xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold">
              Built for Modern Workflows
            </h2>
            <p className="text-lg text-muted-foreground">
              Whether you&apos;re a software engineer or a creative writer,
              MDViewer adapts to your needs.
            </p>
          </div>
          <div className="grid md:grid-cols-2 gap-12">
            <div className="space-y-6 p-8 bg-muted/30 rounded-3xl border">
              <h3 className="text-2xl font-bold flex items-center gap-3">
                <span className="text-blue-700 dark:text-blue-400 underline decoration-blue-500/30 underline-offset-8">
                  Developers & Engineers
                </span>
              </h3>
              <p className="text-muted-foreground leading-relaxed">
                Markdown has become the standard for software documentation. Use
                MDViewer to draft high-quality README files that impress on
                GitHub and GitLab. With <strong>syntax highlighting</strong> for
                over 100 languages, you can verify your code blocks are properly
                formatted before you commit. Our tool supports task lists, nested
                structures, and complex tables essential for technical specs.
              </p>
              <ul className="space-y-3">
                <li className="flex items-center gap-2 text-sm">
                  <span className="text-green-500 font-bold">✅</span> YAML
                  Frontmatter Support
                </li>
                <li className="flex items-center gap-2 text-sm">
                  <span className="text-green-500 font-bold">✅</span> Sanitized
                  Inline HTML
                </li>
                <li className="flex items-center gap-2 text-sm">
                  <span className="text-green-500 font-bold">✅</span>{" "}
                  Multi-line Code Block Preview
                </li>
              </ul>
            </div>
            <div className="space-y-6 p-8 bg-muted/30 rounded-3xl border">
              <h3 className="text-2xl font-bold flex items-center gap-3">
                <span className="text-purple-700 dark:text-purple-400 underline decoration-purple-500/30 underline-offset-8">
                  Content Creators & Bloggers
                </span>
              </h3>
              <p className="text-muted-foreground leading-relaxed">
                Focus on the narrative, not the tags. Markdown allows writers to
                stay in the &quot;flow state&quot; without reaching for
                formatting buttons. MDViewer acts as your{" "}
                <strong>distraction-free writing environment</strong>. Convert
                your thoughts into clean, semantically correct HTML that can be
                pasted directly into Medium, Dev.to, or your personal WordPress
                or Hugo blog.
              </p>
              <ul className="space-y-3">
                <li className="flex items-center gap-2 text-sm">
                  <span className="text-green-500 font-bold">✅</span>{" "}
                  Typographically Correct Rendering
                </li>
                <li className="flex items-center gap-2 text-sm">
                  <span className="text-green-500 font-bold">✅</span> Automatic
                  Link Identification
                </li>
                <li className="flex items-center gap-2 text-sm">
                  <span className="text-green-500 font-bold">✅</span> Image
                  Preview Support
                </li>
              </ul>
            </div>
          </div>
        </section>

        {/* Detailed Education Section */}
        <section className="bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white rounded-3xl p-8 md:p-12 overflow-hidden relative border border-slate-200 dark:border-slate-800">
          <div className="absolute top-0 right-0 p-10 opacity-10 blur-2xl bg-blue-500 h-64 w-64 rounded-full"></div>
          <div className="grid md:grid-cols-2 gap-16 items-center relative z-10">
            <div className="space-y-8">
              <h2 className="text-4xl font-bold">Master the Markdown Syntax</h2>
              <div className="space-y-6 text-slate-700 dark:text-slate-200 text-lg leading-relaxed">
                <p>
                  Markdown is more than just a writing format; it is a philosophy
                  of simplicity. By using plain-text characters to represent
                  formatting, you ensure that your documents remain readable now
                  and 50 years into the future.
                </p>
                <p>
                  From simple <strong>headers</strong> and{" "}
                  <strong>bold text</strong> to advanced{" "}
                  <strong>LaTeX mathematical formulas</strong>, Markdown can
                  handle almost any structural requirement. MDViewer bridges the
                  gap between the speed of plain text and the beauty of rich
                  media.
                </p>
              </div>
              <div className="flex flex-wrap gap-4">
                <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 p-4 rounded-xl shadow-sm">
                  <div className="text-sm font-bold text-blue-700 dark:text-blue-400 mb-1">
                    Text Emphasis
                  </div>
                  <code className="text-sm text-slate-800 dark:text-slate-200">
                    **bold**, *italic*
                  </code>
                </div>
                <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 p-4 rounded-xl shadow-sm">
                  <div className="text-sm font-bold text-green-700 dark:text-green-400 mb-1">
                    Code Links
                  </div>
                  <code className="text-sm text-slate-800 dark:text-slate-200">
                    [label](url)
                  </code>
                </div>
                <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 p-4 rounded-xl shadow-sm">
                  <div className="text-sm font-bold text-purple-700 dark:text-purple-400 mb-1">
                    Lists
                  </div>
                  <code className="text-sm text-slate-800 dark:text-slate-200">
                    - item, 1. item
                  </code>
                </div>
              </div>
            </div>
            <div className="bg-white dark:bg-slate-800/50 backdrop-blur rounded-3xl p-8 border border-slate-200 dark:border-slate-700 shadow-xl dark:shadow-2xl">
              <h3 className="text-xl font-bold mb-6 text-center text-slate-900 dark:text-white">
                Frequently Asked Syntax
              </h3>
              <div className="space-y-4">
                <div className="p-4 bg-slate-100 dark:bg-slate-900/50 rounded-xl space-y-2">
                  <div className="font-bold flex justify-between items-center text-slate-900 dark:text-slate-100">
                    <span>How to create tables?</span>
                    <span className="text-xs text-slate-700 dark:text-slate-300 font-medium">
                      Advanced
                    </span>
                  </div>
                  <p className="text-sm text-slate-700 dark:text-slate-300">
                    Use pipes (|) to separate columns and hyphens (-) to create
                    the header row. Alignment can be controlled with colons (:).
                  </p>
                </div>
                <div className="p-4 bg-slate-100 dark:bg-slate-900/50 rounded-xl space-y-2">
                  <div className="font-bold flex justify-between items-center text-slate-900 dark:text-slate-100">
                    <span>How to add images?</span>
                    <span className="text-xs text-slate-700 dark:text-slate-300 font-medium">
                      Essential
                    </span>
                  </div>
                  <p className="text-sm text-slate-700 dark:text-slate-300">
                    Use the syntax <code>![Alt Text](Image Link)</code>. In
                    MDViewer, images will render instantly in the preview panel.
                  </p>
                </div>
                <div className="p-4 bg-slate-100 dark:bg-slate-900/50 rounded-xl space-y-2">
                  <div className="font-bold flex justify-between items-center text-slate-900 dark:text-slate-100">
                    <span>Can I use HTML tags?</span>
                    <span className="text-xs text-slate-700 dark:text-slate-300 font-medium">
                      Pro
                    </span>
                  </div>
                  <p className="text-sm text-slate-700 dark:text-slate-300">
                    Yes! Markdown allows you to drop into raw HTML for
                    unsupported styles like <code>&lt;kbd&gt;</code> or{" "}
                    <code>&lt;details&gt;</code>.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Best Practices Section */}
        <section className="max-w-4xl mx-auto space-y-8 py-6">
          <h2 className="text-3xl font-bold text-center">
            Best Practices for Productive Writing
          </h2>
          <div className="grid gap-6">
            <div className="flex gap-6 items-start">
              <div className="h-8 w-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center shrink-0 font-bold mt-1">
                1
              </div>
              <div className="space-y-2">
                <h4 className="text-xl font-bold">Hierarchy Matters</h4>
                <p className="text-muted-foreground leading-relaxed">
                  Always start with a single H1 for your title. Use H2 for main
                  sections and H3 for sub-points. This isn&apos;t just for
                  looks—it&apos;s critical for{" "}
                  <strong>SEO and screen-reader accessibility</strong>.
                </p>
              </div>
            </div>
            <div className="flex gap-6 items-start">
              <div className="h-8 w-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center shrink-0 font-bold mt-1">
                2
              </div>
              <div className="space-y-2">
                <h4 className="text-xl font-bold">Meaningful Alt Text</h4>
                <p className="text-muted-foreground leading-relaxed">
                  When adding images using Markdown, provide descriptive text
                  inside the brackets. It helps search engines understand your
                  content and improves the experience for users with vision
                  impairments.
                </p>
              </div>
            </div>
            <div className="flex gap-6 items-start">
              <div className="h-8 w-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center shrink-0 font-bold mt-1">
                3
              </div>
              <div className="space-y-2">
                <h4 className="text-xl font-bold">Consistent Code Blocks</h4>
                <p className="text-muted-foreground leading-relaxed">
                  Always specify the language after the triple backticks (e.g.,
                  ```javascript). This enables the{" "}
                  <strong>syntax highlighting engine</strong> in MDViewer to
                  color your code correctly, making it easier to read.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* FAQ Section */}
        <section className="max-w-3xl mx-auto space-y-8">
          <div className="text-center space-y-4">
            <h2 className="text-4xl font-bold">Frequently Asked Questions</h2>
            <p className="text-muted-foreground text-lg">
              Everything you need to know about our Markdown tool.
            </p>
          </div>
          <div className="divide-y divide-border">
            <div className="py-8 space-y-3">
              <h3 className="text-xl font-bold">
                Is MDViewer free to use forever?
              </h3>
              <p className="text-muted-foreground leading-relaxed">
                Absolutely. Our core mission is to empower the global developer
                and writing community with free, high-quality tools. There are no
                plans to add paywalls or premium subscriptions for the markdown
                viewer.
              </p>
            </div>
            <div className="py-8 space-y-3">
              <h3 className="text-xl font-bold">Where is my data stored?</h3>
              <p className="text-muted-foreground leading-relaxed">
                Your documents are saved automatically in your browser&apos;s{" "}
                <strong>localStorage</strong>, so they survive a refresh or a
                closed tab on the same browser and device. Your Markdown is not
                uploaded to our servers. Local storage is not a backup and is
                not synced between devices, so export anything important — and
                you can delete everything from <em>Documents → Clear all local
                data</em>.
              </p>
            </div>
            <div className="py-8 space-y-3">
              <h3 className="text-xl font-bold">
                How does the live preview work?
              </h3>
              <p className="text-muted-foreground leading-relaxed">
                Your Markdown is parsed in the browser with the{" "}
                <strong>remark/rehype</strong> toolchain. Preview rendering runs
                at a lower priority than typing, so the editor stays responsive
                on large documents, and heavy features such as Mermaid diagrams
                and charts are only loaded when a document uses them. You can
                also switch to the <strong>Visual</strong> editor to format text
                without writing Markdown syntax.
              </p>
            </div>
            <div className="py-8 space-y-3">
              <h3 className="text-xl font-bold">
                Does it support export to PDF or HTML?
              </h3>
              <p className="text-muted-foreground leading-relaxed">
                Yes. The <strong>Export</strong> menu downloads the original
                Markdown (.md) or a standalone HTML page, copies Markdown or
                rendered HTML to the clipboard, and opens your browser&apos;s
                print dialog, where you can choose &quot;Save as PDF&quot;.
                MDViewer does not generate PDF files itself. In HTML and PDF
                output, charts become static images and diagrams are kept as
                vector graphics.
              </p>
            </div>
          </div>
        </section>
      </div>

      {/* Zen Mode Overlay */}
      {zenMode && (
        <ZenMode
          value={markdown}
          onChange={onChangeHandler}
          onExit={() => setZenMode(false)}
          onUndo={handleUndo}
          onRedo={handleRedo}
        />
      )}

      {/* Template Builder Modal */}
      {templatesOpen && (
        <TemplateBuilder
          onInsert={handleTemplateInsert}
          onClose={() => setTemplatesOpen(false)}
        />
      )}

      {/* Command Palette */}
      <CommandPalette
        isOpen={commandPaletteOpen}
        onClose={() => setCommandPaletteOpen(false)}
        actions={paletteActions}
      />

      <DocumentsDialog
        open={documentsOpen}
        onClose={() => setDocumentsOpen(false)}
        documents={documents}
        activeId={activeDocId}
        trash={docs.trash}
        onOpen={(id) => {
          switchDocument(id);
          setDocumentsOpen(false);
        }}
        onCreate={() => {
          handleNewTab();
          setDocumentsOpen(false);
        }}
        onRename={renameDocument}
        onDuplicate={(id) => {
          duplicateDocument(id);
          resetHistory();
          toast("Document duplicated.", { kind: "success" });
        }}
        onDelete={requestDelete}
        onRestore={(id) => {
          restoreDocument(id);
          resetHistory();
          toast("Document restored.", { kind: "success" });
        }}
        onPurge={async (id) => {
          const doc = docs.trash.find((d) => d.id === id);
          if (
            await confirm({
              title: `Permanently delete "${doc?.name ?? "document"}"?`,
              message: "This cannot be undone.",
              confirmLabel: "Delete permanently",
              danger: true,
            })
          ) {
            purgeDocument(id);
          }
        }}
        onClearAll={requestClearAll}
      />

      <PublishDialog
        open={publishOpen}
        onClose={() => setPublishOpen(false)}
        markdown={markdown}
        title={title}
        getFragment={getFragment}
        notify={notify}
      />

      <ShortcutsDialog open={shortcutsOpen} onClose={() => setShortcutsOpen(false)} />

      {confirmDialog}
      <Toaster toasts={toasts} onDismiss={dismiss} />
    </Layout>
  );
}
