"use client";

import { useState } from "react";
import { AlertTriangle, Check, Copy } from "lucide-react";

export function CopySourceButton({ source }: { source: string }) {
  const [state, setState] = useState<"idle" | "copied" | "failed">("idle");

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(source);
      setState("copied");
    } catch {
      setState("failed");
    }
    setTimeout(() => setState("idle"), 2000);
  };

  return (
    <button
      type="button"
      onClick={copy}
      className="inline-flex items-center gap-1 rounded px-1.5 py-0.5 hover:bg-accent hover:text-foreground transition-colors cursor-pointer"
      aria-label="Copy source"
      title="Copy source"
    >
      {state === "copied" ? (
        <Check className="h-3.5 w-3.5 text-green-600" aria-hidden />
      ) : (
        <Copy className="h-3.5 w-3.5" aria-hidden />
      )}
      <span>{state === "copied" ? "Copied" : state === "failed" ? "Copy failed" : "Copy source"}</span>
    </button>
  );
}

/** A local error state for a single block; the rest of the preview keeps rendering. */
export function BlockError({
  title,
  message,
  source,
  kind,
}: {
  title: string;
  message: string;
  source: string;
  kind: string;
}) {
  return (
    <div
      className="not-prose my-4 rounded-lg border border-red-300 bg-red-50 text-red-900 dark:border-red-900 dark:bg-red-950/40 dark:text-red-100"
      role="alert"
      data-block-error={kind}
    >
      <div className="flex items-center justify-between gap-2 px-3 py-2 text-sm font-medium">
        <span className="inline-flex items-center gap-2">
          <AlertTriangle className="h-4 w-4 shrink-0" aria-hidden />
          {title}
        </span>
        <span className="text-xs font-normal">
          <CopySourceButton source={source} />
        </span>
      </div>
      <p className="px-3 pb-2 text-xs font-mono whitespace-pre-wrap break-words">{message}</p>
      <pre className="m-0 max-h-48 overflow-auto border-t border-red-200 bg-transparent px-3 py-2 text-xs dark:border-red-900">
        <code className="!text-red-950 dark:!text-red-100">{source}</code>
      </pre>
    </div>
  );
}
