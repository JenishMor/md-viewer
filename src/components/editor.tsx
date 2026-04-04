import { useEffect, useRef, useState, useCallback } from "react";
import { cn } from "@/lib/utils";
import { handleKeyboardShortcut } from "@/lib/formatting";
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
  initialValue: string;
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
  initialValue,
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
  const fileInputRef = useRef<HTMLInputElement>(null);

  const stats = computeStats(value);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(value);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleClear = () => {
    onChange({
      target: { value: "" },
    } as React.ChangeEvent<HTMLTextAreaElement>);
  };

  const handleReset = () => {
    onChange({
      target: { value: initialValue },
    } as React.ChangeEvent<HTMLTextAreaElement>);
  };

  const readFile = useCallback(
    (file: File) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        const content = e.target?.result;
        if (typeof content === "string") {
          onChange({
            target: { value: content },
          } as React.ChangeEvent<HTMLTextAreaElement>);
        }
      };
      reader.readAsText(file);
    },
    [onChange],
  );

  const handleFileImport = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) readFile(file);
    e.target.value = "";
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
    if (file) readFile(file);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    const mod = e.ctrlKey || e.metaKey;

    // Undo: Ctrl+Z
    if (mod && e.key === "z" && !e.shiftKey) {
      e.preventDefault();
      onUndo?.();
      return;
    }
    // Redo: Ctrl+Y or Ctrl+Shift+Z
    if (mod && (e.key === "y" || (e.key === "z" && e.shiftKey))) {
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
      <input
        ref={fileInputRef}
        type="file"
        accept=".md,.markdown,.mdx,.txt,.text"
        className="hidden"
        onChange={handleFileChange}
      />

      {/* Header */}
      <div className="flex items-center justify-between px-4 py-2 border-b border-border bg-muted/50">
        <span className="text-sm font-medium text-muted-foreground">
          Markdown Input
        </span>
        <div className="flex items-center space-x-1">
          <button onClick={handleFileImport} className={headerBtn} title="Open File">
            <FolderOpen className="h-4 w-4" />
          </button>
          {onOpenTemplates && (
            <button onClick={onOpenTemplates} className={headerBtn} title="Templates">
              <LayoutTemplate className="h-4 w-4" />
            </button>
          )}
          {onZenMode && (
            <button onClick={onZenMode} className={headerBtn} title="Zen Mode">
              <Maximize2 className="h-4 w-4" />
            </button>
          )}
          <button onClick={handleClear} className={headerBtn} title="Clear Markdown">
            <X className="h-4 w-4" />
          </button>
          <button onClick={handleReset} className={headerBtn} title="Reset to Default">
            <RotateCcw className="h-4 w-4" />
          </button>
          <button onClick={handleCopy} className={headerBtn} title="Copy Markdown">
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
