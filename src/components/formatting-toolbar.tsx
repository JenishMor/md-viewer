"use client";

import { RefObject } from "react";
import {
  Bold,
  Italic,
  Strikethrough,
  Heading1,
  Heading2,
  Heading3,
  Link,
  Image,
  Code,
  Braces,
  List,
  ListOrdered,
  Quote,
  Table,
  Minus,
  Undo2,
  Redo2,
} from "lucide-react";
import { applyWrap, applyLinePrefix, insertBlock } from "@/lib/formatting";

interface FormattingToolbarProps {
  textareaRef: RefObject<HTMLTextAreaElement | null>;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  onUndo?: () => void;
  onRedo?: () => void;
  canUndo?: boolean;
  canRedo?: boolean;
}

const btnBase =
  "inline-flex items-center justify-center rounded p-1.5 transition-colors cursor-pointer";
const btnActive =
  "text-muted-foreground hover:bg-background hover:text-foreground";
const btnDisabled = "text-muted-foreground/40 cursor-default";
const sepClass = "w-px h-5 bg-border mx-0.5";

export function FormattingToolbar({
  textareaRef,
  value,
  onChange,
  onUndo,
  onRedo,
  canUndo = false,
  canRedo = false,
}: FormattingToolbarProps) {
  const ta = () => textareaRef.current;

  const wrap = (before: string, after: string, ph: string) => {
    const t = ta();
    if (t) applyWrap(t, value, onChange, before, after, ph);
  };

  const prefix = (p: string) => {
    const t = ta();
    if (t) applyLinePrefix(t, value, onChange, p);
  };

  const block = (b: string, offset?: number) => {
    const t = ta();
    if (t) insertBlock(t, value, onChange, b, offset);
  };

  return (
    <div className="flex items-center gap-0.5 px-3 py-1.5 border-b border-border bg-muted/30 flex-wrap">
      <button
        className={`${btnBase} ${canUndo ? btnActive : btnDisabled}`}
        onClick={onUndo}
        disabled={!canUndo}
        title="Undo (Ctrl+Z)"
      >
        <Undo2 className="h-3.5 w-3.5" />
      </button>
      <button
        className={`${btnBase} ${canRedo ? btnActive : btnDisabled}`}
        onClick={onRedo}
        disabled={!canRedo}
        title="Redo (Ctrl+Y)"
      >
        <Redo2 className="h-3.5 w-3.5" />
      </button>

      <div className={sepClass} />

      <button
        className={`${btnBase} ${btnActive}`}
        onClick={() => wrap("**", "**", "bold")}
        title="Bold (Ctrl+B)"
      >
        <Bold className="h-3.5 w-3.5" />
      </button>
      <button
        className={`${btnBase} ${btnActive}`}
        onClick={() => wrap("*", "*", "italic")}
        title="Italic (Ctrl+I)"
      >
        <Italic className="h-3.5 w-3.5" />
      </button>
      <button
        className={`${btnBase} ${btnActive}`}
        onClick={() => wrap("~~", "~~", "strikethrough")}
        title="Strikethrough"
      >
        <Strikethrough className="h-3.5 w-3.5" />
      </button>

      <div className={sepClass} />

      <button
        className={`${btnBase} ${btnActive}`}
        onClick={() => prefix("# ")}
        title="Heading 1"
      >
        <Heading1 className="h-3.5 w-3.5" />
      </button>
      <button
        className={`${btnBase} ${btnActive}`}
        onClick={() => prefix("## ")}
        title="Heading 2"
      >
        <Heading2 className="h-3.5 w-3.5" />
      </button>
      <button
        className={`${btnBase} ${btnActive}`}
        onClick={() => prefix("### ")}
        title="Heading 3"
      >
        <Heading3 className="h-3.5 w-3.5" />
      </button>

      <div className={sepClass} />

      <button
        className={`${btnBase} ${btnActive}`}
        onClick={() => wrap("[", "](url)", "link text")}
        title="Link (Ctrl+K)"
      >
        <Link className="h-3.5 w-3.5" />
      </button>
      <button
        className={`${btnBase} ${btnActive}`}
        onClick={() => wrap("![", "](url)", "alt text")}
        title="Image"
      >
        <Image className="h-3.5 w-3.5" />
      </button>

      <div className={sepClass} />

      <button
        className={`${btnBase} ${btnActive}`}
        onClick={() => wrap("`", "`", "code")}
        title="Inline Code (Ctrl+Shift+K)"
      >
        <Code className="h-3.5 w-3.5" />
      </button>
      <button
        className={`${btnBase} ${btnActive}`}
        onClick={() => block("```\n\n```\n", 4)}
        title="Code Block"
      >
        <Braces className="h-3.5 w-3.5" />
      </button>

      <div className={sepClass} />

      <button
        className={`${btnBase} ${btnActive}`}
        onClick={() => prefix("- ")}
        title="Unordered List"
      >
        <List className="h-3.5 w-3.5" />
      </button>
      <button
        className={`${btnBase} ${btnActive}`}
        onClick={() => prefix("1. ")}
        title="Ordered List"
      >
        <ListOrdered className="h-3.5 w-3.5" />
      </button>
      <button
        className={`${btnBase} ${btnActive}`}
        onClick={() => prefix("> ")}
        title="Blockquote"
      >
        <Quote className="h-3.5 w-3.5" />
      </button>

      <div className={sepClass} />

      <button
        className={`${btnBase} ${btnActive}`}
        onClick={() =>
          block(
            "| Column 1 | Column 2 | Column 3 |\n| --- | --- | --- |\n| Cell | Cell | Cell |\n",
          )
        }
        title="Table"
      >
        <Table className="h-3.5 w-3.5" />
      </button>
      <button
        className={`${btnBase} ${btnActive}`}
        onClick={() => block("---\n")}
        title="Horizontal Rule"
      >
        <Minus className="h-3.5 w-3.5" />
      </button>
    </div>
  );
}
