const TASK_MARKER = /^((?:[-*+]|\d{1,9}[.)])[ \t]+)\[([ xX])\]/;

/**
 * Toggles the GFM task checkbox of the list item that starts at `offset`
 * (the source offset of its list marker). Returns null when the source at
 * that position is not a task list item, e.g. after the text changed.
 */
export function toggleTaskAt(source: string, offset: number): string | null {
  const match = TASK_MARKER.exec(source.slice(offset, offset + 64));
  if (!match) return null;
  const boxIndex = offset + match[1].length + 1;
  const next = match[2] === " " ? "x" : " ";
  return source.slice(0, boxIndex) + next + source.slice(boxIndex + 1);
}
