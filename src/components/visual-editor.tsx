"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { EditorContent, useEditor, useEditorState, type Editor as TiptapEditor } from "@tiptap/react";
import { Extension, Node, mergeAttributes } from "@tiptap/core";
import type { EditorProps } from "@tiptap/pm/view";
import StarterKit from "@tiptap/starter-kit";
import Image from "@tiptap/extension-image";
import { Table, TableCell, TableHeader, TableRow } from "@tiptap/extension-table";
import { TaskItem, TaskList } from "@tiptap/extension-list";
import {
  Bold,
  Braces,
  Code,
  Columns3,
  Heading1,
  Heading2,
  Heading3,
  Image as ImageIcon,
  Info,
  Italic,
  Link as LinkIcon,
  List,
  ListChecks,
  ListOrdered,
  Minus,
  Pilcrow,
  Quote,
  Redo2,
  Rows3,
  Strikethrough,
  Table as TableIcon,
  Trash2,
  Undo2,
} from "lucide-react";
import {
  PRESERVED_LANG,
  editorHtmlToMarkdown,
  markdownToEditorHtml,
  type PreservedSummary,
} from "@/lib/markdown/convert";
import { cleanPastedHtml } from "@/lib/paste";

/** Inline Markdown the visual editor can't represent (math, raw HTML, footnote refs), kept verbatim. */
const RawInline = Node.create({
  name: "rawInline",
  group: "inline",
  inline: true,
  atom: true,
  selectable: true,
  addAttributes() {
    return {
      source: {
        default: "",
        parseHTML: (el) => el.getAttribute("data-md-raw") ?? "",
        renderHTML: (attrs) => ({ "data-md-raw": attrs.source }),
      },
    };
  },
  parseHTML() {
    return [{ tag: "span[data-md-raw]" }];
  },
  renderHTML({ HTMLAttributes, node }) {
    return [
      "span",
      mergeAttributes(HTMLAttributes, {
        class: "md-raw-inline",
        title: "Markdown source kept as-is (double-click to edit)",
      }),
      node.attrs.source,
    ];
  },
});

const alignAttribute = {
  align: {
    default: null,
    parseHTML: (el: HTMLElement) => el.getAttribute("align") || el.style.textAlign || null,
    renderHTML: (attrs: { align?: string | null }) =>
      attrs.align ? { align: attrs.align, style: `text-align: ${attrs.align}` } : {},
  },
};

const AlignedTableCell = TableCell.extend({
  addAttributes() {
    return { ...this.parent?.(), ...alignAttribute };
  },
});

const AlignedTableHeader = TableHeader.extend({
  addAttributes() {
    return { ...this.parent?.(), ...alignAttribute };
  },
});

function isSafeUrl(url: string) {
  return /^(https?:\/\/|mailto:|#|\/|\.\/|\.\.\/)/i.test(url) || /^[\w.-]+\.[a-z]{2,}(\/|$)/i.test(url);
}

function promptLink(editor: TiptapEditor) {
  const previous = editor.getAttributes("link").href ?? "";
  const url = window.prompt("Link URL (leave empty to remove the link)", previous);
  if (url === null) return;
  const trimmed = url.trim();
  if (!trimmed) {
    editor.chain().focus().extendMarkRange("link").unsetLink().run();
    return;
  }
  if (!isSafeUrl(trimmed)) {
    window.alert("Only http(s), mailto, relative and #anchor links are allowed.");
    return;
  }
  if (editor.state.selection.empty && !editor.isActive("link")) {
    editor
      .chain()
      .focus()
      .insertContent({ type: "text", text: trimmed, marks: [{ type: "link", attrs: { href: trimmed } }] })
      .run();
  } else {
    editor.chain().focus().extendMarkRange("link").setLink({ href: trimmed }).run();
  }
}

function promptImage(editor: TiptapEditor) {
  const src = window.prompt("Image URL (https://…)");
  if (!src) return;
  if (!/^https?:\/\//i.test(src.trim())) {
    window.alert("Images must use an http(s) URL.");
    return;
  }
  const alt = window.prompt("Alternative text (describe the image)") ?? "";
  editor.chain().focus().setImage({ src: src.trim(), alt }).run();
}

const LinkShortcut = Extension.create({
  name: "linkShortcut",
  addKeyboardShortcuts() {
    return {
      "Mod-k": () => {
        promptLink(this.editor as TiptapEditor);
        return true;
      },
    };
  },
});

const EXTENSIONS = [
  StarterKit.configure({
    link: { openOnClick: false, autolink: true, defaultProtocol: "https" },
    underline: false,
  }),
  Image.configure({ allowBase64: true }),
  Table.configure({ resizable: false }),
  TableRow,
  AlignedTableHeader,
  AlignedTableCell,
  TaskList,
  TaskItem.configure({ nested: true }),
  RawInline,
  LinkShortcut,
];

const btnBase =
  "inline-flex items-center justify-center rounded p-1.5 transition-colors cursor-pointer disabled:cursor-default disabled:text-muted-foreground/40";
const btnIdle = "text-muted-foreground hover:bg-background hover:text-foreground";
const btnOn = "bg-background text-foreground ring-1 ring-border";
const sepClass = "w-px h-5 bg-border mx-0.5";

function ToolButton({
  label,
  shortcut,
  active,
  disabled,
  onClick,
  children,
}: {
  label: string;
  shortcut?: string;
  active?: boolean;
  disabled?: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  const title = shortcut ? `${label} (${shortcut})` : label;
  return (
    <button
      type="button"
      className={`${btnBase} ${active ? btnOn : btnIdle}`}
      onMouseDown={(e) => e.preventDefault()}
      onClick={onClick}
      disabled={disabled}
      aria-label={label}
      aria-pressed={active === undefined ? undefined : active}
      title={title}
    >
      {children}
    </button>
  );
}

function VisualToolbar({ editor }: { editor: TiptapEditor }) {
  const s = useEditorState({
    editor,
    selector: ({ editor: e }) => ({
      bold: e.isActive("bold"),
      italic: e.isActive("italic"),
      strike: e.isActive("strike"),
      code: e.isActive("code"),
      h1: e.isActive("heading", { level: 1 }),
      h2: e.isActive("heading", { level: 2 }),
      h3: e.isActive("heading", { level: 3 }),
      paragraph: e.isActive("paragraph"),
      link: e.isActive("link"),
      bulletList: e.isActive("bulletList"),
      orderedList: e.isActive("orderedList"),
      taskList: e.isActive("taskList"),
      blockquote: e.isActive("blockquote"),
      codeBlock: e.isActive("codeBlock"),
      codeLanguage: (e.getAttributes("codeBlock").language as string | null) ?? "",
      table: e.isActive("table"),
      canUndo: e.can().undo(),
      canRedo: e.can().redo(),
    }),
  });
  const chain = () => editor.chain().focus();

  return (
    <div
      className="flex items-center gap-0.5 px-3 py-1.5 border-b border-border bg-muted/30 flex-wrap"
      role="toolbar"
      aria-label="Visual formatting"
    >
      <ToolButton label="Undo" shortcut="Ctrl+Z" disabled={!s.canUndo} onClick={() => chain().undo().run()}>
        <Undo2 className="h-3.5 w-3.5" />
      </ToolButton>
      <ToolButton label="Redo" shortcut="Ctrl+Shift+Z" disabled={!s.canRedo} onClick={() => chain().redo().run()}>
        <Redo2 className="h-3.5 w-3.5" />
      </ToolButton>
      <div className={sepClass} />
      <ToolButton label="Bold" shortcut="Ctrl+B" active={s.bold} onClick={() => chain().toggleBold().run()}>
        <Bold className="h-3.5 w-3.5" />
      </ToolButton>
      <ToolButton label="Italic" shortcut="Ctrl+I" active={s.italic} onClick={() => chain().toggleItalic().run()}>
        <Italic className="h-3.5 w-3.5" />
      </ToolButton>
      <ToolButton label="Strikethrough" shortcut="Ctrl+Shift+S" active={s.strike} onClick={() => chain().toggleStrike().run()}>
        <Strikethrough className="h-3.5 w-3.5" />
      </ToolButton>
      <ToolButton label="Inline code" shortcut="Ctrl+E" active={s.code} onClick={() => chain().toggleCode().run()}>
        <Code className="h-3.5 w-3.5" />
      </ToolButton>
      <div className={sepClass} />
      <ToolButton label="Paragraph" shortcut="Ctrl+Alt+0" active={s.paragraph && !s.bulletList && !s.orderedList && !s.taskList} onClick={() => chain().setParagraph().run()}>
        <Pilcrow className="h-3.5 w-3.5" />
      </ToolButton>
      <ToolButton label="Heading 1" shortcut="Ctrl+Alt+1" active={s.h1} onClick={() => chain().toggleHeading({ level: 1 }).run()}>
        <Heading1 className="h-3.5 w-3.5" />
      </ToolButton>
      <ToolButton label="Heading 2" shortcut="Ctrl+Alt+2" active={s.h2} onClick={() => chain().toggleHeading({ level: 2 }).run()}>
        <Heading2 className="h-3.5 w-3.5" />
      </ToolButton>
      <ToolButton label="Heading 3" shortcut="Ctrl+Alt+3" active={s.h3} onClick={() => chain().toggleHeading({ level: 3 }).run()}>
        <Heading3 className="h-3.5 w-3.5" />
      </ToolButton>
      <div className={sepClass} />
      <ToolButton label="Link" shortcut="Ctrl+K" active={s.link} onClick={() => promptLink(editor)}>
        <LinkIcon className="h-3.5 w-3.5" />
      </ToolButton>
      <ToolButton label="Image" onClick={() => promptImage(editor)}>
        <ImageIcon className="h-3.5 w-3.5" />
      </ToolButton>
      <div className={sepClass} />
      <ToolButton label="Bulleted list" shortcut="Ctrl+Shift+8" active={s.bulletList} onClick={() => chain().toggleBulletList().run()}>
        <List className="h-3.5 w-3.5" />
      </ToolButton>
      <ToolButton label="Numbered list" shortcut="Ctrl+Shift+7" active={s.orderedList} onClick={() => chain().toggleOrderedList().run()}>
        <ListOrdered className="h-3.5 w-3.5" />
      </ToolButton>
      <ToolButton label="Task list" shortcut="Ctrl+Shift+9" active={s.taskList} onClick={() => chain().toggleTaskList().run()}>
        <ListChecks className="h-3.5 w-3.5" />
      </ToolButton>
      <ToolButton label="Blockquote" shortcut="Ctrl+Shift+B" active={s.blockquote} onClick={() => chain().toggleBlockquote().run()}>
        <Quote className="h-3.5 w-3.5" />
      </ToolButton>
      <ToolButton label="Code block" shortcut="Ctrl+Alt+C" active={s.codeBlock} onClick={() => chain().toggleCodeBlock().run()}>
        <Braces className="h-3.5 w-3.5" />
      </ToolButton>
      {s.codeBlock && s.codeLanguage !== PRESERVED_LANG && (
        <input
          aria-label="Code block language"
          placeholder="language"
          list="visual-code-languages"
          className="h-7 w-28 rounded border border-border bg-background px-2 text-xs"
          value={s.codeLanguage}
          onChange={(e) =>
            editor
              .chain()
              .updateAttributes("codeBlock", {
                language: e.target.value.replace(/[^\w+#-]/g, "") || null,
              })
              .run()
          }
        />
      )}
      <datalist id="visual-code-languages">
        {["mermaid", "chartjs", "javascript", "typescript", "python", "bash", "json", "html", "css", "sql", "yaml", "go", "rust", "java"].map((l) => (
          <option key={l} value={l} />
        ))}
      </datalist>
      <ToolButton label="Horizontal rule" onClick={() => chain().setHorizontalRule().run()}>
        <Minus className="h-3.5 w-3.5" />
      </ToolButton>
      <div className={sepClass} />
      <ToolButton
        label="Insert table"
        disabled={s.table}
        onClick={() => chain().insertTable({ rows: 3, cols: 3, withHeaderRow: true }).run()}
      >
        <TableIcon className="h-3.5 w-3.5" />
      </ToolButton>
      {s.table && (
        <>
          <ToolButton label="Add row below" onClick={() => chain().addRowAfter().run()}>
            <Rows3 className="h-3.5 w-3.5" />
          </ToolButton>
          <ToolButton label="Add column right" onClick={() => chain().addColumnAfter().run()}>
            <Columns3 className="h-3.5 w-3.5" />
          </ToolButton>
          <ToolButton label="Delete row" onClick={() => chain().deleteRow().run()}>
            <Rows3 className="h-3.5 w-3.5 text-red-600" />
          </ToolButton>
          <ToolButton label="Delete column" onClick={() => chain().deleteColumn().run()}>
            <Columns3 className="h-3.5 w-3.5 text-red-600" />
          </ToolButton>
          <ToolButton label="Delete table" onClick={() => chain().deleteTable().run()}>
            <Trash2 className="h-3.5 w-3.5 text-red-600" />
          </ToolButton>
        </>
      )}
    </div>
  );
}

interface VisualEditorProps {
  markdown: string;
  onChange: (markdown: string) => void;
  onPasteWarnings?: (warnings: string[]) => void;
}

const EMIT_DELAY_MS = 200;

export function VisualEditor({ markdown, onChange, onPasteWarnings }: VisualEditorProps) {
  const [initial] = useState(() => markdownToEditorHtml(markdown));
  const [preserved, setPreserved] = useState<PreservedSummary>(initial.preserved);
  const lastMarkdown = useRef(markdown);
  const pending = useRef<ReturnType<typeof setTimeout> | null>(null);
  const onChangeRef = useRef(onChange);
  const onPasteWarningsRef = useRef(onPasteWarnings);
  useEffect(() => {
    onChangeRef.current = onChange;
    onPasteWarningsRef.current = onPasteWarnings;
  });

  const editorRef = useRef<TiptapEditor | null>(null);

  const emit = useCallback(() => {
    if (pending.current) {
      clearTimeout(pending.current);
      pending.current = null;
    }
    const ed = editorRef.current;
    if (!ed) return;
    // Serializing the last state still works after TipTap tore down its view,
    // which can happen before this flush runs when the editor unmounts.
    let html: string;
    try {
      html = ed.getHTML();
    } catch {
      return;
    }
    const md = editorHtmlToMarkdown(html);
    if (md === lastMarkdown.current) return;
    lastMarkdown.current = md;
    onChangeRef.current(md);
  }, []);

  // Stable options: TipTap re-applies options whose identity changes on every
  // render, which would disturb the selection while the user is editing.
  const editorProps = useMemo<EditorProps>(
    () => ({
      attributes: {
        class:
          "visual-editor prose dark:prose-invert max-w-none min-h-full p-4 outline-none prose-pre:bg-slate-900 [&_pre_code]:text-slate-50",
        "aria-label": "Visual editor",
        role: "textbox",
        "aria-multiline": "true",
        spellcheck: "true",
      },
      transformPastedHTML(html) {
        const result = cleanPastedHtml(html);
        if (result.warnings.length) onPasteWarningsRef.current?.(result.warnings);
        return result.html;
      },
      handleDoubleClickOn(view, _pos, node, nodePos) {
        if (node.type.name !== "rawInline") return false;
        const next = window.prompt("Edit Markdown source", node.attrs.source);
        if (next === null) return true;
        const tr = next
          ? view.state.tr.setNodeMarkup(nodePos, undefined, { source: next })
          : view.state.tr.delete(nodePos, nodePos + node.nodeSize);
        view.dispatch(tr);
        return true;
      },
    }),
    [],
  );

  const editor = useEditor({
    immediatelyRender: false,
    shouldRerenderOnTransaction: false,
    extensions: EXTENSIONS,
    content: initial.html,
    editorProps,
    onUpdate: () => {
      if (pending.current) clearTimeout(pending.current);
      pending.current = setTimeout(emit, EMIT_DELAY_MS);
    },
    onBlur: () => emit(),
  });

  useEffect(() => {
    editorRef.current = editor;
  }, [editor]);

  // Flush the last edit when leaving visual mode.
  useEffect(() => () => {
    if (pending.current) emit();
  }, [emit]);

  // Reload when the Markdown changes from outside (undo in Markdown history, import, task toggles).
  useEffect(() => {
    if (!editor || markdown === lastMarkdown.current || pending.current) return;
    const next = markdownToEditorHtml(markdown);
    lastMarkdown.current = markdown;
    editor.commands.setContent(next.html, { emitUpdate: false });
    // Syncing an external editor instance from props is what effects are for.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setPreserved(next.preserved);
  }, [editor, markdown]);

  const preservedCount = preserved.blocks + preserved.inline;

  return (
    <div className="flex flex-1 min-h-0 flex-col" data-visual-editor>
      {editor && <VisualToolbar editor={editor} />}
      {preservedCount > 0 && (
        <div className="flex items-start gap-2 border-b border-border bg-amber-50 px-4 py-1.5 text-xs text-amber-900 dark:bg-amber-950/40 dark:text-amber-100" role="note">
          <Info className="mt-0.5 h-3.5 w-3.5 shrink-0" aria-hidden />
          <span>
            {preservedCount} {preservedCount === 1 ? "part" : "parts"} of this document (
            {preserved.kinds.join(", ")}) can&apos;t be edited visually. They are kept
            exactly as written — shown as grey source blocks and chips. Double-click a chip
            to edit it, or switch to Markdown mode.
          </span>
        </div>
      )}
      <div className="flex-1 min-h-0 overflow-auto">
        <EditorContent editor={editor} className="h-full" />
      </div>
    </div>
  );
}
