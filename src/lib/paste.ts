// Cleans clipboard HTML from Word, Google Docs and web pages before it reaches
// the editor. Clipboard HTML is untrusted: everything outside a small
// structural allow-list is unwrapped or removed. Runs entirely in the browser.

export interface CleanPasteResult {
  html: string;
  warnings: string[];
}

const DROP_TAGS = new Set([
  "SCRIPT", "STYLE", "META", "LINK", "TITLE", "HEAD", "XML", "O:P", "IFRAME",
  "OBJECT", "EMBED", "FORM", "INPUT", "BUTTON", "SELECT", "TEXTAREA", "SVG",
  "CANVAS", "NOSCRIPT", "TEMPLATE", "VIDEO", "AUDIO", "MATH",
]);

const KEEP_TAGS = new Set([
  "P", "BR", "H1", "H2", "H3", "H4", "H5", "H6", "STRONG", "B", "EM", "I",
  "S", "DEL", "STRIKE", "CODE", "PRE", "BLOCKQUOTE", "UL", "OL", "LI", "A",
  "IMG", "TABLE", "THEAD", "TBODY", "TR", "TH", "TD", "HR",
]);

const MAX_DATA_IMAGE_BYTES = 512 * 1024;

export function isOfficeHtml(html: string): boolean {
  return /urn:schemas-microsoft-com:office|docs-internal-guid|mso-|class="?Mso/i.test(html);
}

function styleOf(el: Element) {
  return (el.getAttribute("style") ?? "").toLowerCase().replace(/\s+/g, "");
}

function wrap(el: Element, tag: string) {
  const doc = el.ownerDocument;
  const wrapper = doc.createElement(tag);
  while (el.firstChild) wrapper.appendChild(el.firstChild);
  el.appendChild(wrapper);
}

function unwrap(el: Element) {
  const parent = el.parentNode;
  if (!parent) return;
  while (el.firstChild) parent.insertBefore(el.firstChild, el);
  parent.removeChild(el);
}

/** Maps Google Docs / Word inline styles to semantic tags before styles are stripped. */
function convertStyledSpans(root: HTMLElement) {
  for (const el of Array.from(root.querySelectorAll("span, font"))) {
    const style = styleOf(el);
    if (/font-weight:(bold|[6-9]00)/.test(style)) wrap(el, "strong");
    if (/font-style:italic/.test(style)) wrap(el, "em");
    if (/text-decoration[^;]*line-through/.test(style)) wrap(el, "s");
    if (/font-family:[^;]*(courier|consolas|monospace|menlo)/.test(style)) wrap(el, "code");
  }
  // Google Docs wraps the whole fragment in a non-bold <b>.
  for (const el of Array.from(root.querySelectorAll('b[id^="docs-internal-guid"]'))) {
    unwrap(el);
  }
  for (const el of Array.from(root.querySelectorAll("b, strong"))) {
    if (/font-weight:(normal|[1-4]00)/.test(styleOf(el))) unwrap(el);
  }
}

/** Word exports lists as styled paragraphs; rebuild real nested lists. */
function convertWordLists(root: HTMLElement) {
  const doc = root.ownerDocument;
  const paragraphs = Array.from(root.querySelectorAll("p")).filter((p) =>
    /mso-list:l\d+level\d+/.test(styleOf(p)),
  );
  if (paragraphs.length === 0) return;

  let stack: { list: HTMLElement; level: number }[] = [];
  let lastParagraph: Element | null = null;

  for (const p of paragraphs) {
    const level = Number(/level(\d+)/.exec(styleOf(p))?.[1] ?? 1);
    const marker = p.querySelector('span[style*="mso-list:Ignore"], span[style*="mso-list: Ignore"]');
    const markerText = (marker?.textContent ?? "").trim();
    marker?.remove();
    const ordered = /^(\d+|[a-z]|[ivxlc]+)[.)]/i.test(markerText);

    // A paragraph that does not directly follow the previous item starts a new list.
    if (!lastParagraph || p.previousElementSibling !== lastParagraph) stack = [];
    while (stack.length && stack[stack.length - 1].level > level) stack.pop();

    let top = stack[stack.length - 1];
    if (!top || top.level < level) {
      const list = doc.createElement(ordered ? "ol" : "ul");
      if (top) {
        const parentItem = top.list.lastElementChild ?? top.list.appendChild(doc.createElement("li"));
        parentItem.appendChild(list);
      } else {
        p.parentNode?.insertBefore(list, p);
      }
      top = { list, level };
      stack.push(top);
    }
    const li = doc.createElement("li");
    while (p.firstChild) li.appendChild(p.firstChild);
    top.list.appendChild(li);
    lastParagraph = p;
    // Keep the emptied paragraph as an adjacency marker until the end.
    p.setAttribute("data-removed-list-paragraph", "");
  }
  // Paragraphs must stay in place while grouping so sibling checks work.
  for (const p of Array.from(root.querySelectorAll("[data-removed-list-paragraph]"))) p.remove();
}

function safeHref(value: string | null) {
  if (!value) return null;
  const v = value.trim();
  if (/^(https?:|mailto:|#)/i.test(v)) return v;
  return null;
}

function cleanAttributes(el: Element, warnings: Set<string>) {
  const tag = el.tagName;
  const keep: Record<string, string> = {};
  if (tag === "A") {
    const href = safeHref(el.getAttribute("href"));
    if (href) keep.href = href;
  } else if (tag === "IMG") {
    const src = el.getAttribute("src") ?? "";
    const alt = el.getAttribute("alt") ?? "";
    const isRemote = /^https?:\/\//i.test(src);
    const isSmallData =
      /^data:image\/(png|jpe?g|gif|webp);base64,/i.test(src) &&
      src.length * 0.75 <= MAX_DATA_IMAGE_BYTES;
    if (!isRemote && !isSmallData) {
      warnings.add(
        "Some images could not be pasted (local or oversized images). Upload them somewhere public and insert them by URL.",
      );
      const note = el.ownerDocument.createTextNode(`[image omitted${alt ? `: ${alt}` : ""}]`);
      el.replaceWith(note);
      return;
    }
    keep.src = src;
    if (alt) keep.alt = alt;
  } else if (tag === "TD" || tag === "TH") {
    for (const name of ["colspan", "rowspan"]) {
      const v = el.getAttribute(name);
      if (v && /^\d+$/.test(v) && v !== "1") keep[name] = v;
    }
  } else if (tag === "OL") {
    const start = el.getAttribute("start");
    if (start && /^\d+$/.test(start)) keep.start = start;
  }
  for (const attr of Array.from(el.attributes)) el.removeAttribute(attr.name);
  for (const [name, value] of Object.entries(keep)) el.setAttribute(name, value);
}

function isBlank(el: Element) {
  return (
    (el.textContent ?? "").replace(/[\s ]/g, "") === "" &&
    !el.querySelector("img, br, hr, table")
  );
}

export function cleanPastedHtml(html: string): CleanPasteResult {
  const warnings = new Set<string>();
  const doc = new DOMParser().parseFromString(html, "text/html");
  const root = doc.body;

  // Comments, including Word's conditional comments.
  const walker = doc.createTreeWalker(root, NodeFilter.SHOW_COMMENT);
  const comments: Node[] = [];
  while (walker.nextNode()) comments.push(walker.currentNode);
  comments.forEach((c) => c.parentNode?.removeChild(c));

  for (const el of Array.from(root.querySelectorAll("*"))) {
    if (DROP_TAGS.has(el.tagName) || el.tagName.includes(":")) {
      if (el.tagName === "SVG" || el.tagName === "CANVAS" || el.tagName === "VIDEO") {
        warnings.add("Embedded graphics or media were removed; only text, tables, links and images are pasted.");
      }
      el.remove();
    }
  }

  convertStyledSpans(root);
  convertWordLists(root);

  // Unwrap everything outside the allow-list, deepest first.
  for (const el of Array.from(root.querySelectorAll("*")).reverse()) {
    if (!KEEP_TAGS.has(el.tagName)) {
      if (el.tagName === "DIV" || el.tagName === "SECTION" || el.tagName === "ARTICLE") {
        // Keep block boundaries: block containers become paragraphs if they only hold inline content.
        const hasBlock = el.querySelector("p, h1, h2, h3, h4, h5, h6, ul, ol, table, pre, blockquote");
        if (!hasBlock && !isBlank(el)) {
          const p = doc.createElement("p");
          while (el.firstChild) p.appendChild(el.firstChild);
          el.replaceWith(p);
          continue;
        }
      }
      unwrap(el);
    }
  }

  for (const el of Array.from(root.querySelectorAll("*"))) cleanAttributes(el, warnings);

  // Empty formatting and Word's spacer paragraphs.
  for (const el of Array.from(root.querySelectorAll("strong, b, em, i, s, del, strike, code, a, p, li, h1, h2, h3, h4, h5, h6")).reverse()) {
    if (el.tagName === "LI" && el.querySelector("ul, ol")) continue;
    if (isBlank(el)) el.remove();
  }

  return { html: root.innerHTML.trim(), warnings: [...warnings] };
}
