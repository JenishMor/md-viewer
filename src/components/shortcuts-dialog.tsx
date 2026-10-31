"use client";

import { Modal } from "@/components/modal";

const GROUPS: { title: string; items: [string, string][] }[] = [
  {
    title: "General",
    items: [
      ["Ctrl/⌘ + P", "Command palette"],
      ["Ctrl/⌘ + S", "Save now (documents also save automatically)"],
      ["Ctrl/⌘ + Shift + M", "Switch Markdown / Visual mode"],
      ["Esc", "Close dialogs and Zen mode"],
    ],
  },
  {
    title: "Both modes",
    items: [
      ["Ctrl/⌘ + Z", "Undo"],
      ["Ctrl/⌘ + Y  or  Ctrl/⌘ + Shift + Z", "Redo"],
      ["Ctrl/⌘ + B", "Bold"],
      ["Ctrl/⌘ + I", "Italic"],
      ["Ctrl/⌘ + K", "Link"],
    ],
  },
  {
    title: "Markdown mode",
    items: [["Ctrl/⌘ + Shift + K", "Inline code"]],
  },
  {
    title: "Visual mode",
    items: [
      ["Ctrl/⌘ + E", "Inline code"],
      ["Ctrl/⌘ + Shift + S", "Strikethrough"],
      ["Ctrl/⌘ + Alt + 0 … 3", "Paragraph, heading 1–3"],
      ["Ctrl/⌘ + Shift + 7 / 8 / 9", "Numbered, bulleted, task list"],
      ["Ctrl/⌘ + Shift + B", "Blockquote"],
      ["Ctrl/⌘ + Alt + C", "Code block"],
      ["Ctrl/⌘ + Shift + V", "Paste as plain text"],
    ],
  },
];

export function ShortcutsDialog({ open, onClose }: { open: boolean; onClose: () => void }) {
  return (
    <Modal open={open} onClose={onClose} title="Keyboard shortcuts">
      <div className="space-y-5">
        {GROUPS.map((g) => (
          <section key={g.title}>
            <h3 className="mb-2 font-semibold">{g.title}</h3>
            <table className="w-full text-sm">
              <tbody>
                {g.items.map(([keys, action]) => (
                  <tr key={keys} className="border-b border-border last:border-0">
                    <td className="py-1.5 pr-4 align-top">
                      <kbd className="rounded border border-border bg-muted px-1.5 py-0.5 font-mono text-xs">{keys}</kbd>
                    </td>
                    <td className="py-1.5 text-muted-foreground">{action}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </section>
        ))}
      </div>
    </Modal>
  );
}
