export interface MarkdownChunk {
  /** Source text rendered for this chunk (plus shared link definitions). */
  text: string;
  /** Offset of the chunk's first character in the full document. */
  offset: number;
}

// Below this size a single render is fast enough and chunking isn't worth it.
const MIN_CHUNKED_LENGTH = 15_000;
const TARGET_CHUNK_LENGTH = 2_000;

const FENCE = /^ {0,3}(`{3,}|~{3,})/;
const MATH_FENCE = /^ {0,3}\$\$/;
const ATX_HEADING = /^#{1,6}(\s|$)/;
const DEFINITION = /^ {0,3}\[[^\]^][^\]]*\]:\s*\S/;
const FOOTNOTE_DEFINITION = /^ {0,3}\[\^[^\]]+\]:/;
// Raw HTML blocks that may legally contain blank lines and headings.
const MULTILINE_HTML = /^ {0,3}<(script|pre|style|textarea|!--)/i;

/**
 * Splits a large document into section-sized chunks so the preview can
 * re-render only the part that changed. Splits happen only before ATX
 * headings that start a line outside fenced code, math and raw HTML blocks,
 * where a new top-level block is guaranteed to begin. Scanning is linear, so
 * it stays cheap on every keystroke.
 *
 * Returns null when the document should be rendered as a whole: it is small,
 * uses footnotes (numbered across the document), or has no safe split points.
 */
export function splitMarkdown(markdown: string): MarkdownChunk[] | null {
  if (markdown.length < MIN_CHUNKED_LENGTH) return null;

  const boundaries: number[] = [0];
  const definitions: string[] = [];
  let fence: string | null = null;
  let inMath = false;
  let lastBoundary = 0;
  let offset = 0;

  for (const line of markdown.split("\n")) {
    const lineStart = offset;
    offset += line.length + 1;

    if (fence) {
      if (line.trimStart().startsWith(fence)) fence = null;
      continue;
    }
    if (inMath) {
      if (MATH_FENCE.test(line)) inMath = false;
      continue;
    }
    const fenceMatch = FENCE.exec(line);
    if (fenceMatch) {
      fence = fenceMatch[1][0].repeat(fenceMatch[1].length);
      continue;
    }
    if (MATH_FENCE.test(line)) {
      // "$$ x $$" on a single line opens and closes; otherwise a block starts.
      inMath = !line.trim().slice(2).includes("$$");
      continue;
    }
    if (FOOTNOTE_DEFINITION.test(line) || MULTILINE_HTML.test(line)) return null;
    if (DEFINITION.test(line)) definitions.push(line);
    if (ATX_HEADING.test(line) && lineStart - lastBoundary >= TARGET_CHUNK_LENGTH) {
      boundaries.push(lineStart);
      lastBoundary = lineStart;
    }
  }
  if (boundaries.length < 2) return null;

  const shared = definitions.join("\n");
  return boundaries.map((start, i) => {
    const end = i + 1 < boundaries.length ? boundaries[i + 1] : markdown.length;
    const text = markdown.slice(start, end);
    return { text: shared ? `${text}\n\n${shared}` : text, offset: start };
  });
}
