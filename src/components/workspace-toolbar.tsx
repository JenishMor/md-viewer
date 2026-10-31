"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import {
  AlertTriangle,
  Check,
  ChevronDown,
  ClipboardCopy,
  Code2,
  Columns2,
  Download,
  Eye,
  FileCode2,
  FileText,
  Files,
  Keyboard,
  Loader2,
  PenLine,
  Printer,
  Send,
  SquarePen,
  Upload,
} from "lucide-react";
import type { SaveStatus } from "@/lib/use-documents";

export type EditorMode = "markdown" | "visual";
export type ViewMode = "split" | "editor" | "preview";

export type ExportAction =
  | "download-md"
  | "download-html"
  | "print-pdf"
  | "copy-md"
  | "copy-html";

const toolBtn =
  "inline-flex items-center gap-1.5 rounded-md px-2 py-1.5 text-sm text-muted-foreground hover:bg-accent hover:text-foreground transition-colors cursor-pointer";

function SaveIndicator({ status }: { status: SaveStatus }) {
  if (status.state === "error") {
    return (
      <span className="inline-flex items-center gap-1 text-xs text-red-600 dark:text-red-400" role="status" title={status.message} data-save-status="error">
        <AlertTriangle className="h-3.5 w-3.5" aria-hidden />
        <span className="max-w-[16rem] truncate">Not saved: {status.message}</span>
      </span>
    );
  }
  if (status.state === "saving") {
    return (
      <span className="inline-flex items-center gap-1 text-xs text-muted-foreground" role="status" data-save-status="saving">
        <Loader2 className="h-3.5 w-3.5 animate-spin" aria-hidden /> Saving…
      </span>
    );
  }
  if (status.state === "saved") {
    return (
      <span
        className="inline-flex items-center gap-1 text-xs text-muted-foreground"
        role="status"
        title={`Saved in this browser at ${new Date(status.at).toLocaleTimeString()}`}
        data-save-status="saved"
      >
        <Check className="h-3.5 w-3.5 text-green-600" aria-hidden /> Saved locally
      </span>
    );
  }
  return null;
}

function Segmented<T extends string>({
  label,
  value,
  onChange,
  options,
}: {
  label: string;
  value: T;
  onChange: (v: T) => void;
  options: { value: T; label: string; icon: ReactNode; hideLabel?: boolean }[];
}) {
  return (
    <div role="radiogroup" aria-label={label} className="inline-flex rounded-md bg-muted p-0.5">
      {options.map((o) => (
        <button
          key={o.value}
          type="button"
          role="radio"
          aria-checked={value === o.value}
          aria-label={o.label}
          title={o.label}
          onClick={() => onChange(o.value)}
          className={`inline-flex items-center gap-1.5 rounded px-2 py-1 text-xs font-medium transition-colors cursor-pointer ${
            value === o.value
              ? "bg-background text-foreground shadow-sm"
              : "text-muted-foreground hover:text-foreground"
          }`}
        >
          {o.icon}
          {!o.hideLabel && <span>{o.label}</span>}
        </button>
      ))}
    </div>
  );
}

function ExportMenu({ onExport }: { onExport: (action: ExportAction) => void }) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const onDown = (e: MouseEvent) => {
      if (!ref.current?.contains(e.target as Node)) setOpen(false);
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("mousedown", onDown);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onDown);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  const item = (action: ExportAction, label: string, hint: string, Icon: typeof Download) => (
    <button
      type="button"
      role="menuitem"
      className="flex w-full items-start gap-3 rounded-md px-3 py-2 text-left text-sm hover:bg-accent cursor-pointer"
      onClick={() => {
        setOpen(false);
        onExport(action);
      }}
    >
      <Icon className="mt-0.5 h-4 w-4 shrink-0 text-muted-foreground" aria-hidden />
      <span>
        <span className="block font-medium">{label}</span>
        <span className="block text-xs text-muted-foreground">{hint}</span>
      </span>
    </button>
  );

  return (
    <div className="relative" ref={ref}>
      <button
        type="button"
        className={toolBtn}
        aria-haspopup="menu"
        aria-expanded={open}
        onClick={() => setOpen((o) => !o)}
      >
        <Download className="h-4 w-4" aria-hidden /> Export
        <ChevronDown className="h-3.5 w-3.5" aria-hidden />
      </button>
      {open && (
        <div
          role="menu"
          aria-label="Export"
          className="absolute right-0 top-full z-50 mt-1 w-72 rounded-lg border border-border bg-card p-1 shadow-xl"
        >
          {item("download-md", "Download Markdown (.md)", "Original source, unchanged", FileText)}
          {item("download-html", "Download HTML (.html)", "Standalone page with styles; charts as images", FileCode2)}
          {item("print-pdf", "Print / Save as PDF…", "Opens your browser's print dialog", Printer)}
          <div className="my-1 h-px bg-border" />
          {item("copy-md", "Copy Markdown", "Source text to clipboard", ClipboardCopy)}
          {item("copy-html", "Copy rendered HTML", "Rich text for docs, email and blogs", Code2)}
        </div>
      )}
    </div>
  );
}

export function WorkspaceToolbar({
  status,
  documentCount,
  editorMode,
  onEditorModeChange,
  viewMode,
  onViewModeChange,
  onOpenDocuments,
  onImport,
  onExport,
  onPublish,
  onShowShortcuts,
}: {
  status: SaveStatus;
  documentCount: number;
  editorMode: EditorMode;
  onEditorModeChange: (m: EditorMode) => void;
  viewMode: ViewMode;
  onViewModeChange: (m: ViewMode) => void;
  onOpenDocuments: () => void;
  onImport: () => void;
  onExport: (action: ExportAction) => void;
  onPublish: () => void;
  onShowShortcuts: () => void;
}) {
  return (
    <div
      className="mb-3 flex flex-wrap items-center gap-x-2 gap-y-2 rounded-xl border border-border bg-card px-2 py-1.5"
      role="toolbar"
      aria-label="Document"
    >
      <button type="button" className={toolBtn} onClick={onOpenDocuments}>
        <Files className="h-4 w-4" aria-hidden /> Documents
        <span className="rounded bg-muted px-1.5 text-xs">{documentCount}</span>
      </button>
      <button type="button" className={toolBtn} onClick={onImport} title="Open a .md, .markdown or .txt file">
        <Upload className="h-4 w-4" aria-hidden /> Open file
      </button>
      <SaveIndicator status={status} />

      <div className="ml-auto flex flex-wrap items-center gap-2">
        <Segmented
          label="Editing mode"
          value={editorMode}
          onChange={onEditorModeChange}
          options={[
            { value: "markdown", label: "Markdown", icon: <PenLine className="h-3.5 w-3.5" aria-hidden /> },
            { value: "visual", label: "Visual", icon: <SquarePen className="h-3.5 w-3.5" aria-hidden /> },
          ]}
        />
        <Segmented
          label="Layout"
          value={viewMode}
          onChange={onViewModeChange}
          options={[
            { value: "editor", label: "Editor only", icon: <PenLine className="h-3.5 w-3.5" aria-hidden />, hideLabel: true },
            { value: "split", label: "Split view", icon: <Columns2 className="h-3.5 w-3.5" aria-hidden />, hideLabel: true },
            { value: "preview", label: "Preview only", icon: <Eye className="h-3.5 w-3.5" aria-hidden />, hideLabel: true },
          ]}
        />
        <ExportMenu onExport={onExport} />
        <button type="button" className={toolBtn} onClick={onPublish}>
          <Send className="h-4 w-4" aria-hidden /> Share
        </button>
        <button
          type="button"
          className={toolBtn}
          onClick={onShowShortcuts}
          aria-label="Keyboard shortcuts"
          title="Keyboard shortcuts"
        >
          <Keyboard className="h-4 w-4" aria-hidden />
        </button>
      </div>
    </div>
  );
}
