type ChangeHandler = (e: React.ChangeEvent<HTMLTextAreaElement>) => void;

function fireChange(onChange: ChangeHandler, value: string) {
  onChange({ target: { value } } as React.ChangeEvent<HTMLTextAreaElement>);
}

export function applyWrap(
  textarea: HTMLTextAreaElement,
  value: string,
  onChange: ChangeHandler,
  before: string,
  after: string,
  placeholder: string = "text",
) {
  const start = textarea.selectionStart;
  const end = textarea.selectionEnd;
  const selected = value.substring(start, end);
  const insert = selected || placeholder;
  const newValue =
    value.substring(0, start) + before + insert + after + value.substring(end);

  fireChange(onChange, newValue);

  requestAnimationFrame(() => {
    textarea.selectionStart = start + before.length;
    textarea.selectionEnd = start + before.length + insert.length;
    textarea.focus();
  });
}

export function applyLinePrefix(
  textarea: HTMLTextAreaElement,
  value: string,
  onChange: ChangeHandler,
  prefix: string,
) {
  const start = textarea.selectionStart;
  const lineStart = value.lastIndexOf("\n", start - 1) + 1;
  const newValue =
    value.substring(0, lineStart) + prefix + value.substring(lineStart);

  fireChange(onChange, newValue);

  requestAnimationFrame(() => {
    textarea.selectionStart = start + prefix.length;
    textarea.selectionEnd = start + prefix.length;
    textarea.focus();
  });
}

export function insertBlock(
  textarea: HTMLTextAreaElement,
  value: string,
  onChange: ChangeHandler,
  block: string,
  cursorOffset?: number,
) {
  const start = textarea.selectionStart;
  const end = textarea.selectionEnd;
  const needsNewline = start > 0 && value[start - 1] !== "\n";
  const prefix = needsNewline ? "\n\n" : "";
  const newValue =
    value.substring(0, start) + prefix + block + value.substring(end);

  fireChange(onChange, newValue);

  const offset =
    cursorOffset !== undefined
      ? prefix.length + cursorOffset
      : prefix.length + block.length;
  requestAnimationFrame(() => {
    textarea.selectionStart = start + offset;
    textarea.selectionEnd = start + offset;
    textarea.focus();
  });
}

export function handleKeyboardShortcut(
  e: React.KeyboardEvent<HTMLTextAreaElement>,
  textarea: HTMLTextAreaElement,
  value: string,
  onChange: ChangeHandler,
): boolean {
  const mod = e.ctrlKey || e.metaKey;
  if (!mod) return false;

  if (e.key === "b") {
    e.preventDefault();
    applyWrap(textarea, value, onChange, "**", "**", "bold text");
    return true;
  }
  if (e.key === "i") {
    e.preventDefault();
    applyWrap(textarea, value, onChange, "*", "*", "italic text");
    return true;
  }
  if (e.key === "k") {
    e.preventDefault();
    if (e.shiftKey) {
      applyWrap(textarea, value, onChange, "`", "`", "code");
    } else {
      applyWrap(textarea, value, onChange, "[", "](url)", "link text");
    }
    return true;
  }

  return false;
}
