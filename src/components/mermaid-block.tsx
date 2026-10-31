"use client";

import { useEffect, useId, useState } from "react";
import { useTheme } from "next-themes";
import { Minus, Plus, RotateCcw, Workflow } from "lucide-react";
import { BlockError, CopySourceButton } from "@/components/block-chrome";

type MermaidApi = typeof import("mermaid").default;

let mermaidPromise: Promise<MermaidApi> | null = null;
function loadMermaid() {
  mermaidPromise ??= import("mermaid").then((m) => m.default);
  return mermaidPromise;
}

// Mermaid keeps global state, so renders must not overlap.
let queue: Promise<unknown> = Promise.resolve();
function enqueue<T>(task: () => Promise<T>): Promise<T> {
  const run = queue.then(task, task);
  queue = run.catch(() => undefined);
  return run;
}

const cache = new Map<string, string>();
const CACHE_LIMIT = 50;

async function renderDiagram(id: string, code: string, theme: "dark" | "default") {
  const key = `${theme}\n${code}`;
  const cached = cache.get(key);
  if (cached) return cached;

  return enqueue(async () => {
    const mermaid = await loadMermaid();
    mermaid.initialize({
      startOnLoad: false,
      securityLevel: "strict",
      theme,
      fontFamily: "inherit",
    });
    try {
      await mermaid.parse(code);
      const { svg } = await mermaid.render(id, code);
      if (cache.size >= CACHE_LIMIT) cache.delete(cache.keys().next().value!);
      cache.set(key, svg);
      return svg;
    } finally {
      // Failed renders leave temporary nodes behind in <body>.
      document.getElementById(id)?.remove();
      document.getElementById(`d${id}`)?.remove();
    }
  });
}

const zoomBtn =
  "inline-flex items-center justify-center rounded p-1 hover:bg-accent hover:text-foreground transition-colors cursor-pointer";

export function MermaidBlock({ code }: { code: string }) {
  const rawId = useId();
  const id = `mermaid-${rawId.replace(/[^a-zA-Z0-9-]/g, "")}`;
  const { resolvedTheme } = useTheme();
  const theme = resolvedTheme === "dark" ? "dark" : "default";
  const source = code.trim();
  const [result, setResult] = useState<
    { svg: string; error?: undefined } | { error: string; svg?: undefined } | null
  >(() => {
    const cached = cache.get(`${theme}\n${source}`);
    return cached ? { svg: cached } : null;
  });
  const [scale, setScale] = useState(1);

  useEffect(() => {
    let cancelled = false;
    // Debounce so diagrams don't re-render on every keystroke.
    const timer = setTimeout(() => {
      renderDiagram(id, source, theme).then(
        (svg) => !cancelled && setResult({ svg }),
        (err) => {
          if (cancelled) return;
          const message = err instanceof Error ? err.message : String(err);
          setResult({ error: message });
        },
      );
    }, 250);
    return () => {
      cancelled = true;
      clearTimeout(timer);
    };
  }, [id, source, theme]);

  if (!source) return null;

  if (result?.error) {
    return (
      <BlockError
        title="Mermaid diagram has a syntax error"
        message={result.error}
        source={source}
        kind="mermaid"
      />
    );
  }

  return (
    <figure
      className="not-prose my-6 rounded-lg border border-border bg-card"
      data-mermaid-block
    >
      <div
        className="flex items-center justify-between gap-2 border-b border-border px-3 py-1.5 text-xs text-muted-foreground"
        data-export-ignore
      >
        <span className="inline-flex items-center gap-1.5">
          <Workflow className="h-3.5 w-3.5" aria-hidden />
          Diagram
        </span>
        <span className="inline-flex items-center gap-0.5">
          <button
            type="button"
            className={zoomBtn}
            onClick={() => setScale((s) => Math.max(0.5, s - 0.25))}
            aria-label="Zoom out diagram"
            title="Zoom out"
          >
            <Minus className="h-3.5 w-3.5" aria-hidden />
          </button>
          <span className="w-10 text-center tabular-nums">{Math.round(scale * 100)}%</span>
          <button
            type="button"
            className={zoomBtn}
            onClick={() => setScale((s) => Math.min(3, s + 0.25))}
            aria-label="Zoom in diagram"
            title="Zoom in"
          >
            <Plus className="h-3.5 w-3.5" aria-hidden />
          </button>
          <button
            type="button"
            className={zoomBtn}
            onClick={() => setScale(1)}
            aria-label="Reset diagram zoom"
            title="Reset zoom"
          >
            <RotateCcw className="h-3.5 w-3.5" aria-hidden />
          </button>
          <CopySourceButton source={source} />
        </span>
      </div>
      <div className="overflow-auto p-4" tabIndex={0} aria-label="Diagram (scrollable)">
        {result?.svg ? (
          <div
            className={`mx-auto [&_svg]:h-auto ${scale !== 1 ? "[&_svg]:!max-w-none [&_svg]:w-full" : "[&_svg]:max-w-full"}`}
            style={scale !== 1 ? { width: `${scale * 100}%` } : undefined}
            data-mermaid-svg
            dangerouslySetInnerHTML={{ __html: result.svg }}
          />
        ) : (
          <div className="h-32 animate-pulse rounded bg-muted" aria-label="Rendering diagram" />
        )}
      </div>
    </figure>
  );
}
