import { useEffect, useRef, useState, useCallback } from "react";
import { cn } from "@/lib/utils";
import { handleKeyboardShortcut } from "@/lib/formatting";
import { cleanPastedHtml, isOfficeHtml } from "@/lib/paste";
import { editorHtmlToMarkdown } from "@/lib/markdown/convert";
import { FormattingToolbar } from "@/components/formatting-toolbar";
import {
  Copy,
  Check,
  X,
  RotateCcw,
  FolderOpen,
  Maximize2,
  LayoutTemplate,
} from "lucide-react";

interface EditorProps
  extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  value: string;
  onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  scrollRatio: number;
  onScrollSync: (ratio: number) => void;
  scrollSourceRef: React.MutableRefObject<"editor" | "preview" | null>;
  isScrollSyncEnabled: boolean;
  onUndo?: () => void;
  onRedo?: () => void;
  canUndo?: boolean;
  canRedo?: boolean;
  onZenMode?: () => void;
  onOpenTemplates?: () => void;
  onTextareaRef?: (el: HTMLTextAreaElement | null) => void;
  /** Opens a dropped or picked file. The parent decides where it goes. */
  onOpenFile: (file: File) => void;
  onRequestImport: () => void;
  onRequestClear: () => void;
  onRequestReset: () => void;
  onNotify?: (message: string, kind?: "success" | "error" | "info") => void;
}

function computeStats(text: string) {
  const chars = text.length;
  const words = text.trim() === "" ? 0 : text.trim().split(/\s+/).length;
  const lines = text.split("\n").length;
  const readingTime = Math.max(1, Math.ceil(words / 200));
  return { chars, words, lines, readingTime };
}

const headerBtn =
  "inline-flex items-center justify-center rounded-md p-1.5 text-muted-foreground hover:bg-background hover:text-foreground transition-colors cursor-pointer";

export function Editor({
  value,
  onChange,
  scrollRatio,
  onScrollSync,
  scrollSourceRef,
  isScrollSyncEnabled,
  onUndo,
  onRedo,
  canUndo,
  canRedo,
  onZenMode,
  onOpenTemplates,
  onTextareaRef,
  onOpenFile,
  onRequestImport,
  onRequestClear,
  onRequestReset,
  onNotify,
  className,
  ...props
}: EditorProps) {
  const [copied, setCopied] = useState(false);
  const [isDragOver, setIsDragOver] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const textareaCallbackRef = useCallback(
    (el: HTMLTextAreaElement | null) => {
      (textareaRef as React.MutableRefObject<HTMLTextAreaElement | null>).current = el;
      onTextareaRef?.(el);
    },
    [onTextareaRef],
  );
  const stats = computeStats(value);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(value);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      onNotify?.("Clipboard access was blocked by the browser.", "error");
    }
  };

  // Rich text from Word / Google Docs becomes Markdown. Everything else
  // (including Ctrl+Shift+V) pastes as plain text, as usual.
  const handlePaste = (e: React.ClipboardEvent<HTMLTextAreaElement>) => {
    const html = e.clipboardData.getData("text/html");
    if (!html || !isOfficeHtml(html)) return;
    e.preventDefault();
    const { html: clean, warnings } = cleanPastedHtml(html);
    const markdown = editorHtmlToMarkdown(clean).trim();
    const ta = e.currentTarget;
    const start = ta.selectionStart;
    const end = ta.selectionEnd;
    const next = value.slice(0, start) + markdown + value.slice(end);
    onChange({ target: { value: next } } as React.ChangeEvent<HTMLTextAreaElement>);
    requestAnimationFrame(() => {
      ta.selectionStart = ta.selectionEnd = start + markdown.length;
    });
    onNotify?.(
      warnings.length
        ? `Converted pasted rich text to Markdown. ${warnings.join(" ")}`
        : "Converted pasted rich text to Markdown. Use Ctrl+Shift+V to paste plain text.",
      warnings.length ? "error" : "info",
    );
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    const file = e.dataTransfer.files[0];
    if (file) onOpenFile(file);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    const mod = e.ctrlKey || e.metaKey;
    const key = e.key.toLowerCase();

    // Undo: Ctrl+Z
    if (mod && key === "z" && !e.shiftKey) {
      e.preventDefault();
      onUndo?.();
      return;
    }
    // Redo: Ctrl+Y or Ctrl+Shift+Z
    if (mod && (key === "y" || (key === "z" && e.shiftKey))) {
      e.preventDefault();
      onRedo?.();
      return;
    }

    if (textareaRef.current) {
      handleKeyboardShortcut(e, textareaRef.current, value, onChange);
    }
  };

  // Editor → Preview scroll sync
  const handleScroll = () => {
    if (!textareaRef.current || !isScrollSyncEnabled) return;
    scrollSourceRef.current = "editor";
    const el = textareaRef.current;
    const ratio = el.scrollTop / (el.scrollHeight - el.clientHeight);
    onScrollSync(ratio);
  };

  // Preview → Editor scroll sync
  useEffect(() => {
    if (
      !textareaRef.current ||
      !isScrollSyncEnabled ||
      scrollSourceRef.current !== "preview"
    )
      return;
    const el = textareaRef.current;
    el.scrollTop = scrollRatio * (el.scrollHeight - el.clientHeight);
  }, [scrollRatio, isScrollSyncEnabled, scrollSourceRef]);

  return (
    <div
      className={`relative h-full w-full flex flex-col ${isDragOver ? "ring-2 ring-primary ring-inset" : ""}`}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-2 border-b border-border bg-muted/50">
        <span className="text-sm font-medium text-muted-foreground">
          Markdown Input
        </span>
        <div className="flex items-center space-x-1">
          <button onClick={onRequestImport} className={headerBtn} title="Open File" aria-label="Open file">
            <FolderOpen className="h-4 w-4" />
          </button>
          {onOpenTemplates && (
            <button onClick={onOpenTemplates} className={headerBtn} title="Templates" aria-label="Templates">
              <LayoutTemplate className="h-4 w-4" />
            </button>
          )}
          {onZenMode && (
            <button onClick={onZenMode} className={headerBtn} title="Zen Mode" aria-label="Zen mode">
              <Maximize2 className="h-4 w-4" />
            </button>
          )}
          <button onClick={onRequestClear} className={headerBtn} title="Clear Markdown" aria-label="Clear Markdown">
            <X className="h-4 w-4" />
          </button>
          <button onClick={onRequestReset} className={headerBtn} title="Reset to Default" aria-label="Reset to default">
            <RotateCcw className="h-4 w-4" />
          </button>
          <button onClick={handleCopy} className={headerBtn} title="Copy Markdown" aria-label="Copy Markdown">
            {copied ? (
              <Check className="h-4 w-4 text-green-500" />
            ) : (
              <Copy className="h-4 w-4" />
            )}
          </button>
        </div>
      </div>

      {/* Formatting Toolbar */}
      <FormattingToolbar
        textareaRef={textareaRef}
        value={value}
        onChange={onChange}
        onUndo={onUndo}
        onRedo={onRedo}
        canUndo={canUndo}
        canRedo={canRedo}
      />

      {/* Textarea */}
      <textarea
        ref={textareaCallbackRef}
        className={cn(
          "flex-1 w-full resize-none bg-transparent p-4 font-mono text-sm leading-relaxed outline-none placeholder:text-muted-foreground",
          className,
        )}
        value={value}
        onChange={onChange}
        onKeyDown={handleKeyDown}
        onPaste={handlePaste}
        aria-label="Markdown editor"
        placeholder="# Type your markdown here..."
        onScroll={handleScroll}
        spellCheck={false}
        {...props}
      />

      {/* Drag overlay */}
      {isDragOver && (
        <div className="absolute inset-0 bg-primary/10 flex items-center justify-center z-10 pointer-events-none">
          <div className="bg-card border border-primary rounded-lg px-6 py-4 shadow-lg">
            <p className="text-sm font-medium text-primary">
              Drop file to open
            </p>
          </div>
        </div>
      )}

      {/* Status Bar */}
      <div className="flex items-center gap-4 px-4 py-1 border-t border-border bg-muted/50 text-xs text-muted-foreground">
        <span>{stats.words} words</span>
        <span>{stats.chars} chars</span>
        <span>{stats.lines} lines</span>
        <span>~{stats.readingTime} min read</span>
      </div>
    </div>
  );
}
