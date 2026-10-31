"use client";

import { useState } from "react";
import { Copy, FilePlus2, FolderOpen, Pencil, RotateCcw, Trash2 } from "lucide-react";
import { Modal, buttonStyles } from "@/components/modal";
import type { MdDocument, TrashedDocument } from "@/lib/use-documents";

function formatTime(ts: number) {
  return new Date(ts).toLocaleString(undefined, {
    dateStyle: "medium",
    timeStyle: "short",
  });
}

function formatSize(text: string) {
  const bytes = new Blob([text]).size;
  return bytes < 1024 ? `${bytes} B` : `${(bytes / 1024).toFixed(1)} KB`;
}

const iconBtn =
  "inline-flex items-center justify-center rounded p-1.5 text-muted-foreground hover:bg-accent hover:text-foreground cursor-pointer";

export function DocumentsDialog({
  open,
  onClose,
  documents,
  activeId,
  trash,
  onOpen,
  onCreate,
  onRename,
  onDuplicate,
  onDelete,
  onRestore,
  onPurge,
  onClearAll,
}: {
  open: boolean;
  onClose: () => void;
  documents: MdDocument[];
  activeId: string;
  trash: TrashedDocument[];
  onOpen: (id: string) => void;
  onCreate: () => void;
  onRename: (id: string, name: string) => void;
  onDuplicate: (id: string) => void;
  onDelete: (id: string) => void;
  onRestore: (id: string) => void;
  onPurge: (id: string) => void;
  onClearAll: () => void;
}) {
  const [editing, setEditing] = useState<{ id: string; value: string } | null>(null);

  const commit = () => {
    if (editing) onRename(editing.id, editing.value);
    setEditing(null);
  };

  return (
    <Modal open={open} onClose={onClose} title="Local documents" size="lg">
      <p className="mb-4 text-muted-foreground">
        Documents are saved automatically in this browser only. They are not
        backed up or synced to other devices — export anything important.
      </p>

      <div className="mb-3 flex items-center justify-between">
        <h3 className="font-semibold">Documents ({documents.length})</h3>
        <button type="button" className={buttonStyles.secondary} onClick={onCreate}>
          <FilePlus2 className="h-4 w-4" /> New document
        </button>
      </div>
      <ul className="divide-y divide-border rounded-lg border border-border" aria-label="Documents">
        {documents.map((doc) => (
          <li key={doc.id} className="flex items-center gap-2 px-3 py-2" data-doc-row={doc.name}>
            <div className="min-w-0 flex-1">
              {editing?.id === doc.id ? (
                <input
                  autoFocus
                  aria-label="Document name"
                  className="w-full rounded border border-border bg-background px-2 py-1"
                  value={editing.value}
                  onChange={(e) => setEditing({ id: doc.id, value: e.target.value })}
                  onBlur={commit}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") commit();
                    if (e.key === "Escape") {
                      e.stopPropagation();
                      setEditing(null);
                    }
                  }}
                />
              ) : (
                <button
                  type="button"
                  className="block max-w-full truncate text-left font-medium hover:underline cursor-pointer"
                  onClick={() => onOpen(doc.id)}
                >
                  {doc.name}
                  {doc.id === activeId && (
                    <span className="ml-2 rounded bg-accent px-1.5 py-0.5 text-xs font-normal">open</span>
                  )}
                </button>
              )}
              <div className="text-xs text-muted-foreground">
                Edited {formatTime(doc.updatedAt)} · {formatSize(doc.content)}
              </div>
            </div>
            <button type="button" className={iconBtn} onClick={() => onOpen(doc.id)} aria-label={`Open ${doc.name}`} title="Open">
              <FolderOpen className="h-4 w-4" />
            </button>
            <button type="button" className={iconBtn} onClick={() => setEditing({ id: doc.id, value: doc.name })} aria-label={`Rename ${doc.name}`} title="Rename">
              <Pencil className="h-4 w-4" />
            </button>
            <button type="button" className={iconBtn} onClick={() => onDuplicate(doc.id)} aria-label={`Duplicate ${doc.name}`} title="Duplicate">
              <Copy className="h-4 w-4" />
            </button>
            <button type="button" className={iconBtn} onClick={() => onDelete(doc.id)} aria-label={`Delete ${doc.name}`} title="Delete">
              <Trash2 className="h-4 w-4" />
            </button>
          </li>
        ))}
      </ul>

      <h3 className="mb-2 mt-6 font-semibold">Recently deleted ({trash.length})</h3>
      {trash.length === 0 ? (
        <p className="text-muted-foreground">Deleted documents stay here for 30 days.</p>
      ) : (
        <ul className="divide-y divide-border rounded-lg border border-border" aria-label="Recently deleted">
          {trash.map((doc) => (
            <li key={doc.id} className="flex items-center gap-2 px-3 py-2" data-trash-row={doc.name}>
              <div className="min-w-0 flex-1">
                <div className="truncate font-medium">{doc.name}</div>
                <div className="text-xs text-muted-foreground">Deleted {formatTime(doc.deletedAt)}</div>
              </div>
              <button type="button" className={buttonStyles.secondary} onClick={() => onRestore(doc.id)}>
                <RotateCcw className="h-4 w-4" /> Restore
              </button>
              <button type="button" className={iconBtn} onClick={() => onPurge(doc.id)} aria-label={`Delete ${doc.name} permanently`} title="Delete permanently">
                <Trash2 className="h-4 w-4" />
              </button>
            </li>
          ))}
        </ul>
      )}

      <div className="mt-6 rounded-lg border border-red-200 p-4 dark:border-red-900">
        <h3 className="font-semibold">Clear local data</h3>
        <p className="mb-3 text-muted-foreground">
          Permanently removes every document, the recently deleted list, and
          editor preferences stored by MDViewer in this browser.
        </p>
        <button type="button" className={buttonStyles.danger} onClick={onClearAll}>
          <Trash2 className="h-4 w-4" /> Clear all local data
        </button>
      </div>
    </Modal>
  );
}
