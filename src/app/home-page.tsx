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

export default function HomePage({ children }: { children?: React.ReactNode }) {
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
          Online Markdown Viewer &amp; Editor
        </h1>
        <p className="text-muted-foreground text-base md:text-lg leading-relaxed">
          Open, edit and preview Markdown files instantly — with GitHub
          Flavored Markdown, diagrams and math. Free, no sign-up, and your
          documents stay in your browser.
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

      {/* Explanatory content (server-rendered, passed in from page.tsx) */}
      {children}

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
