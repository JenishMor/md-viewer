import {
  Component,
  memo,
  useDeferredValue,
  useMemo,
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from "react";
import ReactMarkdown, { type Components } from "react-markdown";
import type { PluggableList } from "unified";
import type { Element, ElementContent } from "hast";
import "highlight.js/styles/github-dark.css";
import { FileCode2, List } from "lucide-react";
import { TableOfContents } from "@/components/table-of-contents";
import { MermaidBlock } from "@/components/mermaid-block";
import { ChartBlock } from "@/components/chart-block";
import {
  CHART_LANGS,
  DIAGRAM_LANGS,
  codeLanguage,
  loadMathPlugin,
  loadedMathPlugin,
  mayContainMath,
  rehypePlugins,
  remarkPlugins,
  remarkRehypeOptions,
} from "@/lib/markdown/pipeline";
import { splitMarkdown } from "@/lib/markdown/chunks";

interface PreviewProps {
  content: string;
  scrollRatio: number;
  onScrollSync: (ratio: number) => void;
  scrollSourceRef: React.MutableRefObject<"editor" | "preview" | null>;
  isScrollSyncEnabled: boolean;
  /** Called with the source offset of a task list item whose checkbox was clicked. */
  onToggleTask?: (offset: number) => void;
  onArticleRef?: (el: HTMLElement | null) => void;
}

function textOf(node: ElementContent | Element): string {
  if (node.type === "text") return node.value;
  if (node.type === "element") return node.children.map(textOf).join("");
  return "";
}

function buildComponents(onToggleTask?: (offset: number) => void): Components {
  return {
    a: ({ node: _node, href, ...props }) => {
      const internal = href?.startsWith("#");
      return (
        <a
          href={href}
          {...(internal ? {} : { target: "_blank", rel: "noopener noreferrer" })}
          {...props}
        />
      );
    },
    code: ({ node: _node, className, children, ...props }) => {
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
    pre: ({ node, children, ...props }) => {
      const code = node?.children.find(
        (c): c is Element => c.type === "element" && c.tagName === "code",
      );
      const lang = codeLanguage(code);
      if (code && lang && DIAGRAM_LANGS.includes(lang)) {
        return <MermaidBlock code={textOf(code)} />;
      }
      if (code && lang && CHART_LANGS.includes(lang)) {
        return <ChartBlock source={textOf(code)} />;
      }
      if (code?.properties?.dataFrontmatter) {
        return (
          <div className="not-prose my-4 rounded-lg border border-border bg-muted/40 text-sm" data-frontmatter-block>
            <div className="flex items-center gap-1.5 border-b border-border px-3 py-1.5 text-xs text-muted-foreground">
              <FileCode2 className="h-3.5 w-3.5" aria-hidden />
              Frontmatter ({lang})
            </div>
            <pre className="m-0 overflow-x-auto px-3 py-2 font-mono text-xs">{children}</pre>
          </div>
        );
      }
      return <pre {...props}>{children}</pre>;
    },
    table: ({ node: _node, ...props }) => (
      <div className="overflow-x-auto" data-table-wrapper>
        <table {...props} />
      </div>
    ),
    img: ({ node: _node, alt, ...props }) => (
      // eslint-disable-next-line @next/next/no-img-element
      <img alt={alt ?? ""} loading="lazy" {...props} />
    ),
    li: ({ node, className, ...props }) => {
      const isTask = typeof className === "string" && className.includes("task-list-item");
      const offset = node?.position?.start.offset;
      return (
        <li
          className={className}
          data-task-offset={isTask && offset !== undefined ? offset : undefined}
          {...props}
        />
      );
    },
    input: ({ node: _node, type, checked, disabled, ...props }) => {
      if (type !== "checkbox" || !onToggleTask) {
        return <input type={type} checked={checked} disabled={disabled} readOnly {...props} />;
      }
      return (
        <input
          type="checkbox"
          checked={Boolean(checked)}
          aria-label={checked ? "Mark task as not done" : "Mark task as done"}
          className="cursor-pointer"
          onChange={(e) => {
            const li = e.currentTarget.closest<HTMLElement>("li[data-task-offset]");
            // Offsets are relative to the chunk that rendered this item.
            const chunk = li?.closest<HTMLElement>("[data-chunk-offset]");
            const offset = Number(li?.dataset.taskOffset) + Number(chunk?.dataset.chunkOffset ?? 0);
            if (Number.isFinite(offset)) onToggleTask(offset);
          }}
          {...props}
        />
      );
    },
  };
}

const MarkdownRenderer = memo(function MarkdownRenderer({
  content,
  plugins,
  onToggleTask,
}: {
  content: string;
  plugins: PluggableList;
  onToggleTask?: (offset: number) => void;
}) {
  return (
    <ReactMarkdown
      remarkPlugins={remarkPlugins}
      rehypePlugins={plugins}
      remarkRehypeOptions={remarkRehypeOptions}
      components={buildComponents(onToggleTask)}
    >
      {content}
    </ReactMarkdown>
  );
});

/**
 * Large documents render as independently memoized chunks of top-level
 * blocks, so typing re-renders only the chunk being edited.
 */
function ChunkedMarkdown({
  content,
  plugins,
  onToggleTask,
}: {
  content: string;
  plugins: PluggableList;
  onToggleTask?: (offset: number) => void;
}) {
  const chunks = useMemo(() => splitMarkdown(content), [content]);
  if (!chunks) return <MarkdownRenderer content={content} plugins={plugins} onToggleTask={onToggleTask} />;
  return (
    <>
      {chunks.map((chunk, i) => (
        <div key={i} className="contents" data-chunk-offset={chunk.offset}>
          <MarkdownRenderer content={chunk.text} plugins={plugins} onToggleTask={onToggleTask} />
        </div>
      ))}
    </>
  );
}

/** Keeps a rendering failure from blanking the editor; recovers on the next edit. */
class PreviewErrorBoundary extends Component<
  { resetKey: string; children: ReactNode },
  { error: Error | null; key: string }
> {
  state = { error: null as Error | null, key: this.props.resetKey };

  static getDerivedStateFromProps(
    props: { resetKey: string },
    state: { error: Error | null; key: string },
  ) {
    return props.resetKey !== state.key ? { error: null, key: props.resetKey } : null;
  }

  static getDerivedStateFromError(error: Error) {
    return { error };
  }

  render() {
    if (this.state.error) {
      return (
        <div role="alert" className="not-prose rounded-lg border border-red-300 bg-red-50 p-4 text-sm text-red-900 dark:border-red-900 dark:bg-red-950/40 dark:text-red-100">
          The preview could not be rendered: {this.state.error.message}. Your
          Markdown is unchanged — keep editing and the preview will retry.
        </div>
      );
    }
    return this.props.children;
  }
}

export function Preview({
  content,
  scrollRatio,
  onScrollSync,
  scrollSourceRef,
  isScrollSyncEnabled,
  onToggleTask,
  onArticleRef,
}: PreviewProps) {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const previewRef = useRef<HTMLElement | null>(null);
  const [tocOpen, setTocOpen] = useState(false);
  // Rendering lags behind typing on large documents instead of blocking it.
  const deferredContent = useDeferredValue(content);
  const [mathPlugin, setMathPlugin] = useState(loadedMathPlugin);
  const needsMath = !mathPlugin && mayContainMath(deferredContent);
  useEffect(() => {
    if (needsMath) loadMathPlugin().then(setMathPlugin);
  }, [needsMath]);
  const plugins = useMemo(
    () => (mathPlugin ? [...rehypePlugins, mathPlugin] : rehypePlugins),
    [mathPlugin],
  );

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
              aria-label="Table of Contents"
              aria-expanded={tocOpen}
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
          ref={(el) => {
            previewRef.current = el;
            onArticleRef?.(el);
          }}
          className="markdown-preview prose dark:prose-invert max-w-none prose-headings:scroll-mt-20 prose-headings:text-foreground prose-p:text-foreground prose-strong:text-foreground prose-code:text-foreground prose-li:text-foreground prose-a:text-blue-600 dark:prose-a:text-blue-400 hover:prose-a:underline prose-pre:bg-slate-900 prose-pre:border prose-pre:border-border [&_pre_code]:text-slate-50 text-foreground"
        >
          <PreviewErrorBoundary resetKey={deferredContent}>
            <ChunkedMarkdown content={deferredContent} plugins={plugins} onToggleTask={onToggleTask} />
          </PreviewErrorBoundary>
        </article>
      </div>
    </div>
  );
}
