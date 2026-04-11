import { useEffect, useRef, useState } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import remarkMath from "remark-math";
import rehypeHighlight from "rehype-highlight";
import rehypeKatex from "rehype-katex";
import "highlight.js/styles/github-dark.css";
import "katex/dist/katex.min.css";
import { Download, FileText, Printer, List, Share2, Check } from "lucide-react";
import { TableOfContents } from "@/components/table-of-contents";

interface PreviewProps {
  content: string;
  scrollRatio: number;
  onScrollSync: (ratio: number) => void;
  scrollSourceRef: React.MutableRefObject<"editor" | "preview" | null>;
  isScrollSyncEnabled: boolean;
  onShare?: () => Promise<void>;
}

export function Preview({
  content,
  scrollRatio,
  onScrollSync,
  scrollSourceRef,
  isScrollSyncEnabled,
  onShare,
}: PreviewProps) {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const previewRef = useRef<HTMLElement>(null);
  const [tocOpen, setTocOpen] = useState(false);
  const [shared, setShared] = useState(false);

  const handleShare = async () => {
    if (onShare) {
      await onShare();
      setShared(true);
      setTimeout(() => setShared(false), 2000);
    }
  };

  const handleHeadingClick = (index: number) => {
    const headings = previewRef.current?.querySelectorAll(
      "h1, h2, h3, h4, h5, h6",
    );
    if (headings?.[index]) {
      headings[index].scrollIntoView({ behavior: "smooth", block: "start" });
    }
    setTocOpen(false);
  };

  // Editor → Preview scroll sync
  useEffect(() => {
    if (
      !scrollContainerRef.current ||
      !isScrollSyncEnabled ||
      scrollSourceRef.current !== "editor"
    )
      return;
    const el = scrollContainerRef.current;
    el.scrollTop = scrollRatio * (el.scrollHeight - el.clientHeight);
  }, [scrollRatio, isScrollSyncEnabled, scrollSourceRef]);

  // Preview → Editor scroll sync
  const handleScroll = () => {
    if (!scrollContainerRef.current || !isScrollSyncEnabled) return;
    scrollSourceRef.current = "preview";
    const el = scrollContainerRef.current;
    const ratio = el.scrollTop / (el.scrollHeight - el.clientHeight);
    onScrollSync(ratio);
  };

  const handleDownloadHtml = () => {
    if (previewRef.current) {
      const blob = new Blob([previewRef.current.innerHTML], {
        type: "text/html",
      });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "preview.html";
      a.click();
      URL.revokeObjectURL(url);
    }
  };

  const handleDownloadMd = () => {
    const blob = new Blob([content], { type: "text/markdown" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "document.md";
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleExportPdf = () => {
    if (!previewRef.current) return;
    const iframe = document.createElement("iframe");
    iframe.style.position = "fixed";
    iframe.style.right = "0";
    iframe.style.bottom = "0";
    iframe.style.width = "0";
    iframe.style.height = "0";
    iframe.style.border = "none";
    document.body.appendChild(iframe);

    const doc = iframe.contentDocument;
    if (!doc) return;

    doc.open();
    doc.write(`<!DOCTYPE html>
<html>
<head>
  <title>MDViewer Export</title>
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; padding: 2rem; max-width: 800px; margin: 0 auto; color: #1a1a1a; line-height: 1.7; }
    h1, h2, h3, h4, h5, h6 { margin-top: 1.5em; margin-bottom: 0.5em; }
    pre { background: #f4f4f5; padding: 1rem; border-radius: 6px; overflow-x: auto; font-size: 0.875rem; }
    code { font-family: 'SF Mono', Monaco, 'Cascadia Code', monospace; font-size: 0.875em; }
    p code { background: #f4f4f5; padding: 0.15em 0.4em; border-radius: 3px; }
    table { border-collapse: collapse; width: 100%; margin: 1em 0; }
    th, td { border: 1px solid #d4d4d8; padding: 8px 12px; text-align: left; }
    th { background: #f4f4f5; font-weight: 600; }
    img { max-width: 100%; height: auto; }
    blockquote { border-left: 4px solid #d4d4d8; margin: 1em 0; padding: 0.5em 1em; color: #52525b; }
    hr { border: none; border-top: 1px solid #d4d4d8; margin: 2em 0; }
    a { color: #2563eb; }
    @media print { body { padding: 0; } }
  </style>
</head>
<body>${previewRef.current.innerHTML}</body>
</html>`);
    doc.close();

    iframe.contentWindow?.focus();
    iframe.contentWindow?.print();

    setTimeout(() => document.body.removeChild(iframe), 1000);
  };

  const previewBtn =
    "inline-flex items-center justify-center rounded-md p-1.5 text-muted-foreground hover:bg-background hover:text-foreground transition-colors cursor-pointer";

  return (
    <div className="h-full w-full flex flex-col">
      <div className="flex items-center justify-between px-4 py-2 border-b border-border bg-muted/50">
        <span className="text-sm font-medium text-muted-foreground">
          Preview
        </span>
        <div className="flex items-center space-x-1">
          <div className="relative">
            <button
              onClick={() => setTocOpen((p) => !p)}
              className={`${previewBtn} ${tocOpen ? "bg-accent text-foreground" : ""}`}
              title="Table of Contents"
            >
              <List className="h-4 w-4" />
            </button>
            {tocOpen && (
              <div className="absolute right-0 top-full mt-1 w-64 bg-card border border-border rounded-lg shadow-xl z-50">
                <TableOfContents
                  markdown={content}
                  onHeadingClick={handleHeadingClick}
                />
              </div>
            )}
          </div>
          {onShare && (
            <button
              onClick={handleShare}
              className={previewBtn}
              title="Share Link"
            >
              {shared ? (
                <Check className="h-4 w-4 text-green-500" />
              ) : (
                <Share2 className="h-4 w-4" />
              )}
            </button>
          )}
          <button
            onClick={handleDownloadMd}
            aria-label="Download Markdown"
            className={previewBtn}
            title="Download .md"
          >
            <FileText className="h-4 w-4" />
          </button>
          <button
            onClick={handleDownloadHtml}
            aria-label="Download HTML"
            className={previewBtn}
            title="Download HTML"
          >
            <Download className="h-4 w-4" />
          </button>
          <button
            onClick={handleExportPdf}
            aria-label="Export PDF"
            className={previewBtn}
            title="Export PDF"
          >
            <Printer className="h-4 w-4" />
          </button>
        </div>
      </div>
      <div
        className="flex-1 overflow-auto p-4 focus:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
        ref={scrollContainerRef}
        onScroll={handleScroll}
        // Make the scrollable region focusable so keyboard users can scroll
        tabIndex={0}
        role="region"
        aria-label="Markdown preview"
      >
        <article
          ref={previewRef}
          className="prose dark:prose-invert max-w-none prose-headings:scroll-mt-20 prose-headings:text-foreground prose-p:text-foreground prose-strong:text-foreground prose-code:text-foreground prose-li:text-foreground prose-a:text-blue-600 dark:prose-a:text-blue-400 hover:prose-a:underline prose-pre:bg-slate-900 prose-pre:border prose-pre:border-border [&_pre_code]:text-slate-50 text-foreground"
        >
          <ReactMarkdown
            remarkPlugins={[remarkGfm, remarkMath]}
            rehypePlugins={[rehypeHighlight, rehypeKatex]}
            components={{
              a: ({ ...props }) => (
                <a target="_blank" rel="noopener noreferrer" {...props} />
              ),
              code: ({ className, children, ...props }) => {
                const isHighlighted = className?.includes("hljs");
                return (
                  <code
                    className={className}
                    tabIndex={isHighlighted ? 0 : undefined}
                    {...props}
                  >
                    {children}
                  </code>
                );
              },
            }}
          >
            {content}
          </ReactMarkdown>
        </article>
      </div>
    </div>
  );
}
