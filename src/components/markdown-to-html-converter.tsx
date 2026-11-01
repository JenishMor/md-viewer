"use client";

import { useDeferredValue, useEffect, useState } from "react";
import { Check, ClipboardCopy, Download, Eraser } from "lucide-react";
import { downloadBlob } from "@/lib/export";

const SAMPLE = `# Release notes

Version **2.1** adds *faster* exports and fixes [two bugs](https://example.com).

- [x] Tables
- [ ] Dark mode

| Option | Default |
| ------ | ------- |
| theme  | auto    |

\`\`\`js
console.log("Hello");
\`\`\`
`;

type Converter = typeof import("@/lib/markdown/to-html");

const btn =
  "inline-flex items-center gap-1.5 rounded-md border border-border px-3 py-1.5 text-sm font-medium hover:bg-accent cursor-pointer disabled:opacity-50";

export function MarkdownToHtmlConverter() {
  const [markdown, setMarkdown] = useState(SAMPLE);
  const [highlight, setHighlight] = useState(false);
  const [fullDocument, setFullDocument] = useState(false);
  const [view, setView] = useState<"html" | "preview">("html");
  const [converter, setConverter] = useState<Converter | null>(null);
  const [copied, setCopied] = useState<"idle" | "copied" | "failed">("idle");
  const deferred = useDeferredValue(markdown);

  // The Markdown toolchain loads after the page is interactive.
  useEffect(() => {
    import("@/lib/markdown/to-html").then(setConverter);
  }, []);

  const fragment = converter ? converter.markdownToHtml(deferred, { highlight }) : "";
  const output = converter && fullDocument ? converter.wrapHtmlDocument(fragment) : fragment;

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(output);
      setCopied("copied");
    } catch {
      setCopied("failed");
    }
    setTimeout(() => setCopied("idle"), 2000);
  };

  const tab = (id: "html" | "preview", label: string) => (
    <button
      type="button"
      role="tab"
      aria-selected={view === id}
      onClick={() => setView(id)}
      className={`rounded px-2.5 py-1 text-sm font-medium cursor-pointer ${
        view === id ? "bg-background text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"
      }`}
    >
      {label}
    </button>
  );

  return (
    <div className="grid gap-4 lg:grid-cols-2">
      <div className="flex min-h-[28rem] flex-col overflow-hidden rounded-xl border border-border bg-card">
        <div className="flex items-center justify-between border-b border-border bg-muted/50 px-4 py-2">
          <label htmlFor="md-input" className="text-sm font-medium text-muted-foreground">
            Markdown
          </label>
          <button type="button" className="inline-flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground cursor-pointer" onClick={() => setMarkdown("")}>
            <Eraser className="h-3.5 w-3.5" aria-hidden /> Clear
          </button>
        </div>
        <textarea
          id="md-input"
          value={markdown}
          onChange={(e) => setMarkdown(e.target.value)}
          spellCheck={false}
          placeholder="Paste or type Markdown here…"
          className="flex-1 resize-none bg-transparent p-4 font-mono text-sm leading-relaxed outline-none"
        />
      </div>

      <div className="flex min-h-[28rem] flex-col overflow-hidden rounded-xl border border-border bg-card">
        <div className="flex flex-wrap items-center justify-between gap-2 border-b border-border bg-muted/50 px-4 py-2">
          <div role="tablist" aria-label="Output" className="inline-flex rounded-md bg-muted p-0.5">
            {tab("html", "HTML")}
            {tab("preview", "Preview")}
          </div>
          <div className="flex items-center gap-2">
            <button type="button" className={btn} onClick={copy} disabled={!converter}>
              {copied === "copied" ? <Check className="h-4 w-4 text-green-600" aria-hidden /> : <ClipboardCopy className="h-4 w-4" aria-hidden />}
              {copied === "copied" ? "Copied" : copied === "failed" ? "Copy failed" : "Copy HTML"}
            </button>
            <button
              type="button"
              className={btn}
              disabled={!converter}
              onClick={() => downloadBlob(output, "document.html", "text/html;charset=utf-8")}
            >
              <Download className="h-4 w-4" aria-hidden /> Download
            </button>
          </div>
        </div>
        {view === "html" ? (
          <textarea
            readOnly
            aria-label="HTML output"
            value={converter ? output : "Loading converter…"}
            className="flex-1 resize-none bg-transparent p-4 font-mono text-sm leading-relaxed outline-none"
          />
        ) : (
          <div
            className="prose dark:prose-invert max-w-none flex-1 overflow-auto p-4"
            // Output is sanitized with GitHub's allow-list before rendering.
            dangerouslySetInnerHTML={{ __html: fragment }}
          />
        )}
        <div className="flex flex-wrap gap-4 border-t border-border px-4 py-2 text-sm text-muted-foreground">
          <label className="inline-flex items-center gap-2">
            <input type="checkbox" checked={fullDocument} onChange={(e) => setFullDocument(e.target.checked)} />
            Full HTML document
          </label>
          <label className="inline-flex items-center gap-2">
            <input type="checkbox" checked={highlight} onChange={(e) => setHighlight(e.target.checked)} />
            Syntax-highlighting classes
          </label>
        </div>
      </div>
    </div>
  );
}
