/** The text an AI action works on, and how to put the result back. */
export interface AiTarget {
  text: string;
  scope: "selection" | "document";
  /** Applies the result. Returns false if the document changed after the text was captured. */
  apply(result: string, mode: "replace" | "insert"): boolean;
}

/** Target for a range of the Markdown source (or the whole source when the range is empty). */
export function sourceTarget(
  getMarkdown: () => string,
  setMarkdown: (next: string) => void,
  start: number,
  end: number,
): AiTarget {
  const source = getMarkdown();
  if (start === end) {
    return {
      text: source,
      scope: "document",
      apply(result, mode) {
        const current = getMarkdown();
        if (current !== source) return false;
        setMarkdown(mode === "replace" ? `${result}\n` : `${current.trimEnd()}\n\n${result}\n`);
        return true;
      },
    };
  }
  const text = source.slice(start, end);
  return {
    text,
    scope: "selection",
    apply(result, mode) {
      const current = getMarkdown();
      if (current.slice(start, end) !== text) return false;
      if (mode === "replace") {
        setMarkdown(current.slice(0, start) + result + current.slice(end));
      } else {
        // Insert as a new block after the line the selection ends on.
        const lineEnd = current.indexOf("\n", end);
        const at = lineEnd === -1 ? current.length : lineEnd;
        setMarkdown(`${current.slice(0, at)}\n\n${result}\n${current.slice(at)}`);
      }
      return true;
    },
  };
}
