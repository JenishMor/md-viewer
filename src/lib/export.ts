import katex from "katex";

/** Turns a document name into a safe, portable file name (without extension). */
export function sanitizeFilename(name: string, fallback = "document"): string {
  const cleaned = name
    .normalize("NFKC")
    .replace(/\.(md|markdown|txt|html?)$/i, "")
    .replace(/[<>:"/\\|?*\u0000-\u001f]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^[.\-]+|[.\-]+$/g, "")
    .slice(0, 80);
  if (!cleaned || /^(con|prn|aux|nul|com\d|lpt\d)$/i.test(cleaned)) return fallback;
  return cleaned;
}

/** The document title: its name, unless that's a placeholder, then its first heading. */
export function documentTitle(name: string, markdown: string): string {
  if (name && !/^Untitled( \d+)?$/.test(name)) return name;
  const heading = /^#{1,6}\s+(.+?)\s*#*\s*$/m.exec(markdown)?.[1];
  return heading?.replace(/[*_`~[\]]/g, "").trim() || name || "document";
}

export function downloadBlob(content: BlobPart, filename: string, type: string) {
  const blob = new Blob([content], { type });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.rel = "noopener";
  document.body.appendChild(a);
  a.click();
  a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}

function escapeHtml(text: string) {
  return text.replace(/[&<>"']/g, (c) => `&#${c.charCodeAt(0)};`);
}

/**
 * Waits until diagrams and charts in the preview have finished rendering.
 * Returns false if some were still rendering when the timeout expired.
 */
export async function waitForRenderedBlocks(article: HTMLElement, timeoutMs = 10000) {
  const start = Date.now();
  while (Date.now() - start < timeoutMs) {
    const pending = article.querySelector(
      '[data-mermaid-block] [aria-label="Rendering diagram"], canvas[data-chart-canvas]:not([data-rendered])',
    );
    if (!pending) return true;
    await new Promise((r) => setTimeout(r, 100));
  }
  return false;
}

/**
 * Clones the rendered preview into portable HTML: charts become static PNG
 * images, UI controls are removed, and checkboxes are made read-only.
 */
export function exportableFragment(article: HTMLElement): { html: string; notes: string[] } {
  const notes = new Set<string>();
  const clone = article.cloneNode(true) as HTMLElement;

  const liveCanvases = article.querySelectorAll<HTMLCanvasElement>("canvas[data-chart-canvas]");
  clone.querySelectorAll<HTMLCanvasElement>("canvas[data-chart-canvas]").forEach((canvas, i) => {
    const live = liveCanvases[i];
    const img = document.createElement("img");
    try {
      img.src = live.toDataURL("image/png");
    } catch {
      notes.add("A chart could not be converted to an image.");
    }
    img.alt = canvas.getAttribute("aria-label") ?? "Chart";
    img.style.maxWidth = "100%";
    canvas.parentElement?.replaceWith(img);
    notes.add("Charts are exported as static images.");
  });

  clone.querySelectorAll("[data-export-ignore], button, [data-chart-table]").forEach((el) => el.remove());
  clone.querySelectorAll("[tabindex]").forEach((el) => el.removeAttribute("tabindex"));
  clone.querySelectorAll("[data-mermaid-svg]").forEach((el) => el.removeAttribute("style"));
  clone.querySelectorAll('input[type="checkbox"]').forEach((el) => el.setAttribute("disabled", ""));
  clone.querySelectorAll("[data-block-error]").forEach(() =>
    notes.add("Blocks with errors are exported as their error message and source."),
  );

  return { html: clone.innerHTML, notes: [...notes] };
}

const EXPORT_CSS = `
:root { color-scheme: light; }
body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif; max-width: 820px; margin: 0 auto; padding: 2rem 1.25rem; color: #1a1a1a; line-height: 1.7; background: #fff; }
h1, h2, h3, h4, h5, h6 { line-height: 1.25; margin: 1.6em 0 0.6em; break-after: avoid; }
h1 { font-size: 2em; border-bottom: 1px solid #e4e4e7; padding-bottom: .3em; }
h2 { font-size: 1.5em; border-bottom: 1px solid #e4e4e7; padding-bottom: .3em; }
p, ul, ol, blockquote, pre, table, figure { margin: 0 0 1em; }
a { color: #2563eb; }
img, svg { max-width: 100%; height: auto; }
pre { background: #f6f8fa; padding: 1rem; border-radius: 6px; overflow-x: auto; font-size: .875rem; line-height: 1.5; break-inside: avoid; white-space: pre-wrap; word-break: break-word; }
code { font-family: ui-monospace, SFMono-Regular, Menlo, Consolas, monospace; font-size: .9em; }
:not(pre) > code { background: #f4f4f5; padding: .15em .4em; border-radius: 4px; }
table { border-collapse: collapse; width: 100%; display: block; overflow-x: auto; }
th, td { border: 1px solid #d4d4d8; padding: 6px 12px; }
th { background: #f4f4f5; font-weight: 600; }
tr { break-inside: avoid; }
blockquote { border-left: 4px solid #d4d4d8; padding: .25em 1em; color: #52525b; margin-left: 0; }
hr { border: none; border-top: 1px solid #d4d4d8; margin: 2em 0; }
ul.contains-task-list { list-style: none; padding-left: 1.2em; }
figure { text-align: center; break-inside: avoid; }
.katex-display { overflow-x: auto; overflow-y: hidden; }
.sr-only { position: absolute; width: 1px; height: 1px; padding: 0; margin: -1px; overflow: hidden; clip: rect(0,0,0,0); border: 0; }
.hljs-comment, .hljs-quote { color: #6a737d; }
.hljs-keyword, .hljs-selector-tag, .hljs-type { color: #d73a49; }
.hljs-string, .hljs-attr, .hljs-regexp { color: #032f62; }
.hljs-number, .hljs-literal, .hljs-variable, .hljs-built_in { color: #005cc5; }
.hljs-title, .hljs-section, .hljs-function { color: #6f42c1; }
.hljs-name, .hljs-tag { color: #22863a; }
[data-block-error] { border: 1px solid #fca5a5; background: #fef2f2; padding: .5em 1em; border-radius: 6px; }
@media print { body { padding: 0; max-width: none; } a { color: inherit; } pre { border: 1px solid #e4e4e7; } }
`;

export function buildStandaloneHtml(title: string, bodyHtml: string): string {
  const katexCss = `https://cdn.jsdelivr.net/npm/katex@${katex.version}/dist/katex.min.css`;
  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<meta name="generator" content="MDViewer (mdviewer.in)">
<title>${escapeHtml(title)}</title>
<link rel="stylesheet" href="${katexCss}" crossorigin="anonymous">
<style>${EXPORT_CSS}</style>
</head>
<body>
<article>
${bodyHtml}
</article>
</body>
</html>
`;
}

/** Opens the browser print dialog for the document. The user chooses "Save as PDF" there. */
export function printHtml(html: string): Promise<void> {
  return new Promise((resolve, reject) => {
    const iframe = document.createElement("iframe");
    iframe.setAttribute("aria-hidden", "true");
    iframe.style.cssText = "position:fixed;right:0;bottom:0;width:0;height:0;border:0;";
    document.body.appendChild(iframe);
    const win = iframe.contentWindow;
    const doc = iframe.contentDocument;
    if (!win || !doc) {
      iframe.remove();
      reject(new Error("Printing is not available in this browser."));
      return;
    }
    doc.open();
    doc.write(html);
    doc.close();

    const images = Array.from(doc.images);
    const ready = Promise.all([
      ...images.map((img) =>
        img.complete
          ? Promise.resolve()
          : new Promise<void>((r) => {
              img.onload = img.onerror = () => r();
            }),
      ),
      doc.fonts?.ready ?? Promise.resolve(),
    ]);
    // Don't hold the dialog hostage to a slow image host.
    const timeout = new Promise((r) => setTimeout(r, 3000));
    Promise.race([ready, timeout]).then(() => {
      try {
        win.focus();
        win.print();
        resolve();
      } catch (err) {
        reject(err);
      } finally {
        setTimeout(() => iframe.remove(), 1000);
      }
    });
  });
}

export async function copyText(text: string) {
  await navigator.clipboard.writeText(text);
}

/** Copies rich HTML (for pasting into WordPress, Blogger, Google Docs) with a plain-text fallback. */
export async function copyRichHtml(html: string, plain: string) {
  if (typeof ClipboardItem !== "undefined" && navigator.clipboard?.write) {
    await navigator.clipboard.write([
      new ClipboardItem({
        "text/html": new Blob([html], { type: "text/html" }),
        "text/plain": new Blob([plain], { type: "text/plain" }),
      }),
    ]);
    return;
  }
  await navigator.clipboard.writeText(html);
}
