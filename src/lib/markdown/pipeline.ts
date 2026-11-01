import type { PluggableList } from "unified";
import type { Root as MdastRoot } from "mdast";
import type { Root as HastRoot, Element } from "hast";
import remarkGfm from "remark-gfm";
import remarkMath from "remark-math";
import remarkFrontmatter from "remark-frontmatter";
import rehypeRaw from "rehype-raw";
import rehypeSanitize, { defaultSchema, type Options as SanitizeSchema } from "rehype-sanitize";
import rehypeHighlight from "rehype-highlight";
import { visit } from "unist-util-visit";

/**
 * Fenced code languages that are rendered by a dedicated component instead of
 * being syntax highlighted.
 */
export const DIAGRAM_LANGS = ["mermaid"];
export const CHART_LANGS = ["chartjs"];

/** Shows YAML/TOML frontmatter as a labelled code block instead of an <hr> + heading. */
function remarkFrontmatterBlock() {
  return (tree: MdastRoot) => {
    visit(tree, (node, index, parent) => {
      // "toml" isn't in mdast's node type union, but remark-frontmatter emits it.
      const type = node.type as string;
      if ((type !== "yaml" && type !== "toml") || !parent || index === undefined) {
        return;
      }
      parent.children[index] = {
        type: "code",
        lang: type,
        value: (node as { value: string }).value,
        data: { hProperties: { dataFrontmatter: "true" } },
      };
    });
  };
}

/**
 * Raw HTML policy: HTML in Markdown is parsed and then sanitized with
 * GitHub's allow-list. Scripts, styles, iframes, forms, event handlers and
 * javascript: URLs are removed. Images may use http(s) or data: URLs.
 */
export const sanitizeSchema: SanitizeSchema = {
  ...defaultSchema,
  attributes: {
    ...defaultSchema.attributes,
    code: [
      ["className", /^language-./, "math-inline", "math-display"],
      "dataFrontmatter",
    ],
  },
  protocols: {
    ...defaultSchema.protocols,
    src: ["http", "https", "data"],
  },
};

/**
 * remark-rehype already prefixes footnote ids with "user-content-", and the
 * sanitizer adds the same prefix again. Collapse the duplicate so footnote
 * links keep working.
 */
function rehypeFixClobberedIds() {
  const doubled = "user-content-user-content-";
  return (tree: HastRoot) => {
    visit(tree, "element", (node: Element) => {
      const id = node.properties?.id;
      if (typeof id === "string" && id.startsWith(doubled)) {
        node.properties.id = id.slice("user-content-".length);
      }
    });
  };
}

export const remarkPlugins: PluggableList = [
  remarkGfm,
  remarkMath,
  [remarkFrontmatter, ["yaml", "toml"]],
  remarkFrontmatterBlock,
];

export const rehypePlugins: PluggableList = [
  rehypeRaw,
  [rehypeSanitize, sanitizeSchema],
  rehypeFixClobberedIds,
  [
    rehypeHighlight,
    { plainText: [...DIAGRAM_LANGS, ...CHART_LANGS, "yaml-frontmatter"] },
  ],
];

/** Cheap check for remark-math syntax, so KaTeX is only downloaded when needed. */
export function mayContainMath(markdown: string) {
  return markdown.includes("$");
}

let mathPlugin: PluggableList[number] | null = null;
let mathPluginPromise: Promise<PluggableList[number]> | null = null;

/** The KaTeX plugin if it has already been loaded. */
export function loadedMathPlugin() {
  return mathPlugin;
}

/** Loads KaTeX (~260 KB of JS plus its CSS and fonts) on first use. */
export function loadMathPlugin() {
  mathPluginPromise ??= Promise.all([
    import("rehype-katex"),
    import("katex/dist/katex.min.css"),
  ]).then(([mod]) => {
    mathPlugin = [mod.default, { throwOnError: false, strict: "ignore" }];
    return mathPlugin;
  });
  return mathPluginPromise;
}

export const remarkRehypeOptions = { allowDangerousHtml: true };

/** Extracts the language from a hast <code> element's className. */
export function codeLanguage(node: Element | undefined): string | undefined {
  const cls = node?.properties?.className;
  if (!Array.isArray(cls)) return undefined;
  const lang = cls.find(
    (c) => typeof c === "string" && c.startsWith("language-"),
  ) as string | undefined;
  return lang?.slice("language-".length);
}
