// Conversion layer between the canonical Markdown source and the visual
// (TipTap) editor's HTML. Markdown stays the single source of truth: the
// visual editor is loaded from it and writes Markdown back only when the user
// edits there.
//
// Syntax the visual editor cannot represent (math, frontmatter, raw HTML,
// footnotes) is never dropped. It is carried through verbatim: blocks become
// "preserved source" code blocks and inline fragments become atomic chips, and
// both are written back exactly as they were.

import { unified } from "unified";
import remarkParse from "remark-parse";
import remarkGfm from "remark-gfm";
import remarkMath from "remark-math";
import remarkFrontmatter from "remark-frontmatter";
import remarkRehype from "remark-rehype";
import rehypeStringify from "rehype-stringify";
import rehypeParse from "rehype-parse";
import rehypeRemark from "rehype-remark";
import remarkStringify from "remark-stringify";
import { visit, SKIP } from "unist-util-visit";
import type { Root as MdastRoot, Nodes as MdastNodes, Parent as MdastParent } from "mdast";
import type { Root as HastRoot, Element, ElementContent } from "hast";
import type { State } from "hast-util-to-mdast";

export const PRESERVED_LANG = "md-preserved";

const BLOCK_PRESERVE = new Set(["yaml", "toml", "math", "html", "footnoteDefinition"]);
const INLINE_PRESERVE = new Set(["inlineMath", "html", "footnoteReference"]);
const FLOW_PARENTS = new Set(["root", "blockquote", "listItem", "footnoteDefinition"]);

export interface PreservedSummary {
  blocks: number;
  inline: number;
  kinds: string[];
}

const KIND_LABELS: Record<string, string> = {
  yaml: "frontmatter",
  toml: "frontmatter",
  math: "math",
  inlineMath: "math",
  html: "raw HTML",
  footnoteDefinition: "footnotes",
  footnoteReference: "footnotes",
};

function slice(source: string, node: MdastNodes) {
  const start = node.position?.start.offset;
  const end = node.position?.end.offset;
  if (start === undefined || end === undefined) return null;
  return source.slice(start, end);
}

function remarkProtectUnsupported(source: string, summary: PreservedSummary) {
  return () => (tree: MdastRoot) => {
    const kinds = new Set<string>();
    visit(tree, (node, index, parent) => {
      if (!parent || index === undefined) return;
      const isFlow = FLOW_PARENTS.has((parent as MdastParent).type);
      const preserveBlock = isFlow && BLOCK_PRESERVE.has(node.type);
      const preserveInline = !isFlow && INLINE_PRESERVE.has(node.type);
      if (!preserveBlock && !preserveInline) return;
      const raw = slice(source, node as MdastNodes);
      if (raw === null) return;
      kinds.add(KIND_LABELS[node.type] ?? node.type);
      if (preserveBlock) {
        summary.blocks++;
        (parent as MdastParent).children[index] = {
          type: "code",
          lang: PRESERVED_LANG,
          value: raw,
        };
      } else {
        summary.inline++;
        (parent as MdastParent).children[index] = {
          type: "text",
          value: raw,
          data: {
            hName: "span",
            hProperties: { dataMdRaw: raw },
            hChildren: [{ type: "text", value: raw }],
          },
        } as never;
      }
      return SKIP;
    });
    summary.kinds = [...kinds];
  };
}

function isElement(node: unknown, tag?: string): node is Element {
  return (
    typeof node === "object" &&
    node !== null &&
    (node as Element).type === "element" &&
    (tag === undefined || (node as Element).tagName === tag)
  );
}

function hasClass(node: Element, cls: string) {
  const c = node.properties?.className;
  return Array.isArray(c) && c.includes(cls);
}

/** Adapts remark-rehype output to the HTML shapes TipTap's schema parses. */
function rehypeToTiptap() {
  return (tree: HastRoot) => {
    visit(tree, "element", (node: Element) => {
      if (node.tagName === "ul" && hasClass(node, "contains-task-list")) {
        node.properties = { dataType: "taskList" };
      }
      if (node.tagName === "li" && hasClass(node, "task-list-item")) {
        let checked = false;
        const strip = (children: ElementContent[]): ElementContent[] =>
          children.filter((c) => {
            if (isElement(c, "input")) {
              checked = Boolean(c.properties?.checked);
              return false;
            }
            return true;
          });
        node.children = strip(node.children);
        const first = node.children.find((c) => isElement(c));
        if (isElement(first, "p")) first.children = strip(first.children);
        // Tight items have bare text; TipTap task items need a paragraph.
        const inline: ElementContent[] = [];
        const rest: ElementContent[] = [];
        for (const c of node.children) {
          if (rest.length === 0 && (c.type === "text" || (isElement(c) && !["p", "ul", "ol", "pre", "blockquote", "table"].includes(c.tagName)))) {
            inline.push(c);
          } else {
            rest.push(c);
          }
        }
        const firstText = inline[0];
        if (firstText?.type === "text") firstText.value = firstText.value.replace(/^\s+/, "");
        const hasContent = inline.some((c) => c.type !== "text" || c.value.trim());
        node.children = hasContent
          ? [{ type: "element", tagName: "p", properties: {}, children: inline }, ...rest]
          : rest;
        node.properties = { dataType: "taskItem", dataChecked: String(checked) };
      }
    });
  };
}

/** Adapts TipTap's HTML to the shapes hast-util-to-mdast understands. */
function rehypeFromTiptap() {
  const unwrapSingleParagraph = (node: Element) => {
    const paragraphs = node.children.filter((c) => isElement(c, "p"));
    const otherBlocks = node.children.filter(
      (c) => isElement(c) && !["p", "ul", "ol"].includes(c.tagName),
    );
    if (paragraphs.length === 1 && otherBlocks.length === 0) {
      node.children = node.children.flatMap((c) =>
        isElement(c, "p") ? c.children : [c],
      );
    }
  };

  return (tree: HastRoot) => {
    visit(tree, "element", (node: Element) => {
      if (node.tagName === "li" && node.properties?.dataType === "taskItem") {
        const checked = node.properties.dataChecked === "true";
        const content = node.children.find(
          (c): c is Element => isElement(c, "div"),
        );
        const body = content
          ? content.children
          : node.children.filter((c) => !isElement(c, "label"));
        const checkbox: Element = {
          type: "element",
          tagName: "input",
          properties: { type: "checkbox", checked },
          children: [],
        };
        const firstP = body.find((c): c is Element => isElement(c, "p"));
        if (firstP && body.indexOf(firstP) === 0) {
          firstP.children = [checkbox, { type: "text", value: " " }, ...firstP.children];
          node.children = body;
        } else {
          node.children = [checkbox, ...body];
        }
        node.properties = {};
        unwrapSingleParagraph(node);
      } else if (node.tagName === "li") {
        unwrapSingleParagraph(node);
      }
      if (node.tagName === "td" || node.tagName === "th") {
        // Markdown table cells are single-line: join paragraphs with <br>.
        const out: ElementContent[] = [];
        node.children.forEach((c, i) => {
          if (isElement(c, "p")) {
            if (i > 0 && out.length) out.push({ type: "element", tagName: "br", properties: {}, children: [] });
            out.push(...c.children);
          } else {
            out.push(c);
          }
        });
        node.children = out;
      }
    });
  };
}

/** Writes preserved blocks back out verbatim. */
function remarkRestorePreserved() {
  return (tree: MdastRoot) => {
    visit(tree, "code", (node, index, parent) => {
      if (node.lang !== PRESERVED_LANG || !parent || index === undefined) return;
      parent.children[index] = { type: "html", value: node.value.replace(/\n$/, "") };
    });
  };
}

export function markdownToEditorHtml(markdown: string): {
  html: string;
  preserved: PreservedSummary;
} {
  const preserved: PreservedSummary = { blocks: 0, inline: 0, kinds: [] };
  const file = unified()
    .use(remarkParse)
    .use(remarkGfm)
    .use(remarkMath)
    .use(remarkFrontmatter, ["yaml", "toml"])
    .use(remarkProtectUnsupported(markdown, preserved))
    .use(remarkRehype)
    .use(rehypeToTiptap)
    .use(rehypeStringify)
    .processSync(markdown);
  return { html: String(file), preserved };
}

export function editorHtmlToMarkdown(html: string): string {
  const file = unified()
    .use(rehypeParse, { fragment: true })
    .use(rehypeFromTiptap)
    .use(rehypeRemark, {
      handlers: {
        span(state: State, node: Element) {
          const raw = node.properties?.dataMdRaw;
          if (typeof raw === "string") {
            const result = { type: "html" as const, value: raw };
            state.patch(node, result);
            return result;
          }
          return state.all(node);
        },
      },
    })
    .use(remarkRestorePreserved)
    .use(remarkGfm)
    .use(remarkStringify, {
      bullet: "-",
      emphasis: "*",
      strong: "*",
      fence: "`",
      fences: true,
      rule: "-",
      listItemIndent: "one",
    })
    .processSync(html);
  return String(file);
}
