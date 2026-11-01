import { unified } from "unified";
import remarkParse from "remark-parse";
import remarkGfm from "remark-gfm";
import remarkFrontmatter from "remark-frontmatter";
import remarkRehype from "remark-rehype";
import rehypeRaw from "rehype-raw";
import rehypeSanitize from "rehype-sanitize";
import rehypeHighlight from "rehype-highlight";
import rehypeStringify from "rehype-stringify";
import type { Root, Element } from "hast";
import { visit } from "unist-util-visit";
import { sanitizeSchema } from "@/lib/markdown/pipeline";

const TABLE_PARTS = new Set(["table", "thead", "tbody", "tfoot", "tr"]);

/**
 * Drops the newline text nodes remark-rehype puts between table rows. The HTML
 * parser in rehype-raw would otherwise move them in front of the table,
 * leaving a run of blank lines in the output.
 */
function rehypeTrimTableWhitespace() {
  return (tree: Root) => {
    visit(tree, "element", (node: Element) => {
      if (!TABLE_PARTS.has(node.tagName)) return;
      node.children = node.children.filter(
        (child) => !(child.type === "text" && child.value.trim() === ""),
      );
    });
  };
}

export interface ToHtmlOptions {
  /** Add highlight.js classes to fenced code (needs a highlight.js theme on the page). */
  highlight: boolean;
}

/**
 * Converts Markdown (GFM) to an HTML fragment. Raw HTML is kept but sanitized
 * with the same allow-list as the editor preview; frontmatter is dropped.
 */
export function markdownToHtml(markdown: string, { highlight }: ToHtmlOptions): string {
  const processor = unified()
    .use(remarkParse)
    .use(remarkGfm)
    .use(remarkFrontmatter, ["yaml", "toml"])
    .use(remarkRehype, { allowDangerousHtml: true })
    .use(rehypeTrimTableWhitespace)
    .use(rehypeRaw)
    .use(rehypeSanitize, sanitizeSchema);
  if (highlight) processor.use(rehypeHighlight, { plainText: ["mermaid", "chartjs"] });
  return String(processor.use(rehypeStringify).processSync(markdown)).trim();
}

export function wrapHtmlDocument(body: string, title = "Document") {
  const safeTitle = title.replace(/[&<>"']/g, (c) => `&#${c.charCodeAt(0)};`);
  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${safeTitle}</title>
</head>
<body>
${body}
</body>
</html>
`;
}
