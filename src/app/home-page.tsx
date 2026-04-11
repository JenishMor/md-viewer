"use client";

import { useState, useEffect, useRef, useCallback, useMemo } from "react";
import dynamic from "next/dynamic";
import { Layout } from "@/components/layout";
import { Panel, PanelGroup, PanelResizeHandle } from "react-resizable-panels";
import { Link2, Link2Off } from "lucide-react";
import { DEFAULT_MARKDOWN } from "@/data/default-markdown";
import { DocumentTabs } from "@/components/document-tabs";
import { useUndoRedo } from "@/lib/use-undo-redo";
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
import LZString from "lz-string";

interface Document {
  id: string;
  name: string;
  content: string;
}

const DOCS_KEY = "md-viewer-docs";
const ACTIVE_KEY = "md-viewer-active-doc";
const OLD_STORAGE_KEY = "md-viewer-content";

function generateId() {
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 8);
}

const Editor = dynamic(
  () => import("@/components/editor").then((mod) => mod.Editor),
  {
    ssr: false,
    loading: () => (
      <div className="flex-1 rounded-xl border border-border bg-card text-card-foreground shadow-sm animate-pulse" />
    ),
  },
);

const Preview = dynamic(
  () => import("@/components/preview").then((mod) => mod.Preview),
  {
    ssr: false,
    loading: () => (
      <div className="flex-1 rounded-xl border border-border bg-card text-card-foreground shadow-sm animate-pulse" />
    ),
  },
);

export default function HomePage() {
  const [documents, setDocuments] = useState<Document[]>([]);
  const [activeDocId, setActiveDocId] = useState("");
  const [isInitialized, setIsInitialized] = useState(false);
  const [isDesktop, setIsDesktop] = useState(false);
  const [scrollRatio, setScrollRatio] = useState(0);
  const scrollSourceRef = useRef<"editor" | "preview" | null>(null);
  const [isScrollSyncEnabled, setIsScrollSyncEnabled] = useState(true);
  const history = useUndoRedo();
  const [zenMode, setZenMode] = useState(false);
  const [templatesOpen, setTemplatesOpen] = useState(false);
  const [commandPaletteOpen, setCommandPaletteOpen] = useState(false);
  const editorTextareaRef = useRef<HTMLTextAreaElement | null>(null);
  const markdownRef = useRef("");

  // Derive current markdown from active document
  const activeDoc = documents.find((d) => d.id === activeDocId);
  const markdown = activeDoc?.content ?? "";

  const setMarkdown = useCallback(
    (content: string) => {
      setDocuments((prev) => {
        const current = prev.find((d) => d.id === activeDocId)?.content ?? "";
        if (current !== content) {
          history.push(current);
        }
        return prev.map((d) =>
          d.id === activeDocId ? { ...d, content } : d,
        );
      });
    },
    [activeDocId, history],
  );

  const handleUndo = useCallback(() => {
    const prev = history.undo(markdown);
    if (prev !== null) {
      setDocuments((docs) =>
        docs.map((d) => (d.id === activeDocId ? { ...d, content: prev } : d)),
      );
    }
  }, [activeDocId, markdown, history]);

  const handleRedo = useCallback(() => {
    const next = history.redo(markdown);
    if (next !== null) {
      setDocuments((docs) =>
        docs.map((d) => (d.id === activeDocId ? { ...d, content: next } : d)),
      );
    }
  }, [activeDocId, markdown, history]);

  // Keep ref in sync for command palette
  markdownRef.current = markdown;

  // Share handler
  const handleShare = useCallback(async () => {
    const compressed = LZString.compressToEncodedURIComponent(markdownRef.current);
    const url = `${window.location.origin}${window.location.pathname}#lz=${compressed}`;
    if (url.length > 8000) {
      alert(
        "Document is too large to share via URL. Try a shorter document.",
      );
      return;
    }
    await navigator.clipboard.writeText(url);
  }, []);

  // Template insertion
  const handleTemplateInsert = useCallback(
    (content: string) => {
      const ta = editorTextareaRef.current;
      if (ta) {
        insertBlock(
          ta,
          markdownRef.current,
          (e: React.ChangeEvent<HTMLTextAreaElement>) =>
            setMarkdown(e.target.value),
          content,
        );
      } else {
        setMarkdown(markdownRef.current + "\n" + content);
      }
    },
    [setMarkdown],
  );

  // onChange wrapper for command palette formatting
  const onChangeHandler = useCallback(
    (e: React.ChangeEvent<HTMLTextAreaElement>) => {
      setMarkdown(e.target.value);
    },
    [setMarkdown],
  );

  // Tab operations (defined before palette actions which reference handleNewTab)
  const handleNewTab = useCallback(() => {
    const newDoc: Document = {
      id: generateId(),
      name: `Untitled ${documents.length + 1}`,
      content: "",
    };
    setDocuments((prev) => [...prev, newDoc]);
    setActiveDocId(newDoc.id);
  }, [documents.length]);

  // Command palette actions
  const paletteActions: PaletteAction[] = useMemo(() => {
    const ta = () => editorTextareaRef.current;
    const val = () => markdownRef.current;

    const fmt = (
      id: string,
      name: string,
      fn: () => void,
      shortcut?: string,
    ): PaletteAction => ({
      id,
      name,
      shortcut,
      section: "Format",
      handler: fn,
    });

    return [
      // Format
      fmt("bold", "Bold", () => { const t = ta(); if (t) applyWrap(t, val(), onChangeHandler, "**", "**", "bold"); }, "Ctrl+B"),
      fmt("italic", "Italic", () => { const t = ta(); if (t) applyWrap(t, val(), onChangeHandler, "*", "*", "italic"); }, "Ctrl+I"),
      fmt("strikethrough", "Strikethrough", () => { const t = ta(); if (t) applyWrap(t, val(), onChangeHandler, "~~", "~~", "text"); }),
      fmt("h1", "Heading 1", () => { const t = ta(); if (t) applyLinePrefix(t, val(), onChangeHandler, "# "); }),
      fmt("h2", "Heading 2", () => { const t = ta(); if (t) applyLinePrefix(t, val(), onChangeHandler, "## "); }),
      fmt("h3", "Heading 3", () => { const t = ta(); if (t) applyLinePrefix(t, val(), onChangeHandler, "### "); }),
      fmt("link", "Insert Link", () => { const t = ta(); if (t) applyWrap(t, val(), onChangeHandler, "[", "](url)", "link text"); }, "Ctrl+K"),
      fmt("image", "Insert Image", () => { const t = ta(); if (t) applyWrap(t, val(), onChangeHandler, "![", "](url)", "alt text"); }),
      fmt("code", "Inline Code", () => { const t = ta(); if (t) applyWrap(t, val(), onChangeHandler, "`", "`", "code"); }),
      fmt("codeblock", "Code Block", () => { const t = ta(); if (t) insertBlock(t, val(), onChangeHandler, "```\n\n```\n", 4); }),
      fmt("ul", "Unordered List", () => { const t = ta(); if (t) applyLinePrefix(t, val(), onChangeHandler, "- "); }),
      fmt("ol", "Ordered List", () => { const t = ta(); if (t) applyLinePrefix(t, val(), onChangeHandler, "1. "); }),
      fmt("quote", "Blockquote", () => { const t = ta(); if (t) applyLinePrefix(t, val(), onChangeHandler, "> "); }),
      fmt("table", "Insert Table", () => { const t = ta(); if (t) insertBlock(t, val(), onChangeHandler, "| Col 1 | Col 2 | Col 3 |\n| --- | --- | --- |\n| Cell | Cell | Cell |\n"); }),
      fmt("hr", "Horizontal Rule", () => { const t = ta(); if (t) insertBlock(t, val(), onChangeHandler, "---\n"); }),
      // Edit
      { id: "undo", name: "Undo", shortcut: "Ctrl+Z", section: "Edit", handler: handleUndo },
      { id: "redo", name: "Redo", shortcut: "Ctrl+Y", section: "Edit", handler: handleRedo },
      // File
      { id: "new-doc", name: "New Document", section: "File", handler: handleNewTab },
      { id: "share", name: "Share Link", section: "File", handler: handleShare },
      // View
      { id: "zen", name: "Zen Mode", section: "View", handler: () => setZenMode(true) },
      { id: "templates", name: "Open Templates", section: "View", handler: () => setTemplatesOpen(true) },
    ];
  }, [onChangeHandler, handleUndo, handleRedo, handleShare, handleNewTab]);

  // Global keyboard shortcut for command palette
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === "p") {
        e.preventDefault();
        setCommandPaletteOpen((p) => !p);
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, []);

  // Initialize: check URL share first, then localStorage
  useEffect(() => {
    // Check for shared content in URL hash
    const hash = window.location.hash;
    let sharedContent: string | null = null;

    if (hash.startsWith("#lz=")) {
      sharedContent = LZString.decompressFromEncodedURIComponent(hash.slice(4));
    } else if (hash.startsWith("#md=")) {
      // Backward compat with old base64 links
      try {
        sharedContent = new TextDecoder().decode(
          Uint8Array.from(atob(hash.slice(4)), (c) => c.charCodeAt(0)),
        );
      } catch { /* ignore */ }
    }

    if (sharedContent) {
      const sharedDoc: Document = {
        id: generateId(),
        name: "Shared Document",
        content: sharedContent,
      };
      setDocuments([sharedDoc]);
      setActiveDocId(sharedDoc.id);
      setIsInitialized(true);
      window.history.replaceState(null, "", window.location.pathname);
      return;
    }

    const savedDocs = localStorage.getItem(DOCS_KEY);
    const savedActive = localStorage.getItem(ACTIVE_KEY);

    if (savedDocs) {
      try {
        const docs: Document[] = JSON.parse(savedDocs);
        if (docs.length > 0) {
          setDocuments(docs);
          setActiveDocId(
            savedActive && docs.some((d) => d.id === savedActive)
              ? savedActive
              : docs[0].id,
          );
          setIsInitialized(true);
          return;
        }
      } catch {
        // Fall through to default
      }
    }

    // Migrate from old single-doc storage
    const oldContent = localStorage.getItem(OLD_STORAGE_KEY);
    const defaultDoc: Document = {
      id: generateId(),
      name: "Untitled",
      content: oldContent ?? DEFAULT_MARKDOWN,
    };
    setDocuments([defaultDoc]);
    setActiveDocId(defaultDoc.id);
    setIsInitialized(true);
  }, []);

  // Persist to localStorage
  useEffect(() => {
    if (!isInitialized) return;
    localStorage.setItem(DOCS_KEY, JSON.stringify(documents));
    localStorage.setItem(ACTIVE_KEY, activeDocId);
  }, [documents, activeDocId, isInitialized]);

  // Responsive layout detection
  useEffect(() => {
    const media = window.matchMedia("(min-width: 1024px)");
    setIsDesktop(media.matches);
    const listener = (e: MediaQueryListEvent) => setIsDesktop(e.matches);
    media.addEventListener("change", listener);
    return () => media.removeEventListener("change", listener);
  }, []);

  const handleCloseTab = (id: string) => {
    if (documents.length <= 1) return;
    const newDocs = documents.filter((d) => d.id !== id);
    setDocuments(newDocs);
    if (activeDocId === id) {
      setActiveDocId(newDocs[0].id);
    }
  };

  const handleRenameTab = (id: string, name: string) => {
    setDocuments((prev) =>
      prev.map((d) => (d.id === id ? { ...d, name } : d)),
    );
  };

  const handleSwitchTab = (id: string) => {
    setActiveDocId(id);
    setScrollRatio(0);
    history.reset();
  };

  const tabs = documents.map((d) => ({ id: d.id, name: d.name }));

  return (
    <Layout>
      {/* Hero / Crawlable Intro */}
      <section className="text-center max-w-3xl mx-auto mb-6">
        <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight mb-3">
          Free Online Markdown Editor &amp; Viewer
        </h1>
        <p className="text-muted-foreground text-base md:text-lg leading-relaxed">
          Write, preview, and perfect your Markdown in real time. MDViewer
          supports GitHub Flavored Markdown (GFM), syntax highlighting for 100+
          languages, LaTeX math, tables, and task lists — all processed locally
          in your browser with zero server uploads.
        </p>
      </section>

      {/* Tool Section */}
      <section
        className="w-full mb-6"
        aria-label="Markdown Editor and Preview"
      >
        {/* Document Tabs */}
        <DocumentTabs
          tabs={tabs}
          activeId={activeDocId}
          onSwitch={handleSwitchTab}
          onNew={handleNewTab}
          onClose={handleCloseTab}
          onRename={handleRenameTab}
        />

        <div className="h-[750px] flex flex-col">
          {isDesktop ? (
            // Desktop: Horizontal resizable panels
            <PanelGroup
              direction="horizontal"
              className="flex-1 h-full min-h-0 gap-2"
            >
              <Panel defaultSize={50} minSize={20} className="flex flex-col">
                <div className="flex-1 rounded-xl rounded-tl-none border border-border bg-card text-card-foreground shadow-sm overflow-hidden flex flex-col">
                  <Editor
                    value={markdown}
                    onChange={(e) => setMarkdown(e.target.value)}
                    initialValue={DEFAULT_MARKDOWN}
                    scrollRatio={scrollRatio}
                    onScrollSync={setScrollRatio}
                    scrollSourceRef={scrollSourceRef}
                    isScrollSyncEnabled={isScrollSyncEnabled}
                    onUndo={handleUndo}
                    onRedo={handleRedo}
                    canUndo={history.canUndo}
                    canRedo={history.canRedo}
                    onZenMode={() => setZenMode(true)}
                    onOpenTemplates={() => setTemplatesOpen(true)}
                    onTextareaRef={(el) => { editorTextareaRef.current = el; }}
                    className="flex-1"
                  />
                </div>
              </Panel>

              <div className="w-2 flex flex-col items-center justify-center space-y-2">
                <button
                  title="Toggle scroll sync"
                  onClick={() => setIsScrollSyncEnabled((prev) => !prev)}
                  className="inline-flex items-center justify-center rounded-md py-2 mt-12 border transition cursor-pointer"
                >
                  {isScrollSyncEnabled ? (
                    <Link2 className="rotate-90" />
                  ) : (
                    <Link2Off className="rotate-90" />
                  )}
                </button>

                <PanelResizeHandle className="h-full flex items-center justify-center transition-colors hover:bg-accent/50">
                  <div className="w-1 h-12 bg-border rounded-full" />
                </PanelResizeHandle>
              </div>

              <Panel
                defaultSize={50}
                minSize={50}
                maxSize={90}
                className="flex flex-col"
              >
                <div className="flex-1 rounded-xl border border-border bg-card text-card-foreground shadow-sm overflow-hidden flex flex-col">
                  <Preview
                    content={markdown}
                    scrollRatio={scrollRatio}
                    onScrollSync={setScrollRatio}
                    scrollSourceRef={scrollSourceRef}
                    isScrollSyncEnabled={isScrollSyncEnabled}
                    onShare={handleShare}
                  />
                </div>
              </Panel>
            </PanelGroup>
          ) : (
            // Mobile: Vertical stacked layout (no resize)
            <div className="flex flex-col gap-6 flex-1 h-full min-h-0">
              <div className="h-[400px] shrink-0 rounded-xl border border-border bg-card text-card-foreground shadow-sm overflow-hidden flex flex-col">
                <Editor
                  value={markdown}
                  onChange={(e) => setMarkdown(e.target.value)}
                  initialValue={DEFAULT_MARKDOWN}
                  scrollRatio={scrollRatio}
                  onScrollSync={setScrollRatio}
                  scrollSourceRef={scrollSourceRef}
                  isScrollSyncEnabled={isScrollSyncEnabled}
                  onUndo={handleUndo}
                  onRedo={handleRedo}
                  canUndo={history.canUndo}
                  canRedo={history.canRedo}
                  onZenMode={() => setZenMode(true)}
                  onOpenTemplates={() => setTemplatesOpen(true)}
                  onTextareaRef={(el) => { editorTextareaRef.current = el; }}
                  className="flex-1"
                />
              </div>
              <div className="flex-1 rounded-xl border border-border bg-card text-card-foreground shadow-sm overflow-hidden flex flex-col">
                <Preview
                  content={markdown}
                  scrollRatio={scrollRatio}
                  onScrollSync={setScrollRatio}
                  scrollSourceRef={scrollSourceRef}
                  isScrollSyncEnabled={isScrollSyncEnabled}
                  onShare={handleShare}
                />
              </div>
            </div>
          )}
        </div>
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
                  <span className="text-green-500 font-bold">✅</span> Inline
                  HTML Compatibility
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
                We utilize <strong>IndexedDB and LocalStorage</strong>{" "}
                technologies within your own browser. This means that if you
                refresh the page or even close your laptop, your progress is
                saved locally. We never transmit your markdown content to our
                servers, ensuring 100% privacy.
              </p>
            </div>
            <div className="py-8 space-y-3">
              <h3 className="text-xl font-bold">
                How does the real-time sync work?
              </h3>
              <p className="text-muted-foreground leading-relaxed">
                Our editor is built on the same core as VS Code (Monaco). When
                you type, our diffing algorithm identifies changes and updates
                the <strong>rehype-based preview engine</strong>, ensuring that
                only the changed parts of the document are re-rendered for
                maximum performance.
              </p>
            </div>
            <div className="py-8 space-y-3">
              <h3 className="text-xl font-bold">
                Does it support export to PDF or HTML?
              </h3>
              <p className="text-muted-foreground leading-relaxed">
                Yes! You can export your document as HTML, download it as a .md
                file, or use the PDF export button which opens your browser&apos;s
                print dialog for saving as PDF. All export options are available
                in the preview toolbar.
              </p>
            </div>
          </div>
        </section>
      </div>

      {/* Zen Mode Overlay */}
      {zenMode && (
        <ZenMode
          value={markdown}
          onChange={(e) => setMarkdown(e.target.value)}
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
    </Layout>
  );
}
