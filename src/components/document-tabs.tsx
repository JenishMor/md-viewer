"use client";

import { useState, useRef, useEffect } from "react";
import { Plus, X, Pencil } from "lucide-react";

export interface DocTab {
  id: string;
  name: string;
}

interface DocumentTabsProps {
  tabs: DocTab[];
  activeId: string;
  onSwitch: (id: string) => void;
  onNew: () => void;
  onClose: (id: string) => void;
  onRename: (id: string, name: string) => void;
}

export function DocumentTabs({
  tabs,
  activeId,
  onSwitch,
  onNew,
  onClose,
  onRename,
}: DocumentTabsProps) {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editValue, setEditValue] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (editingId && inputRef.current) {
      inputRef.current.focus();
      inputRef.current.select();
    }
  }, [editingId]);

  const startRename = (id: string, name: string) => {
    setEditingId(id);
    setEditValue(name);
  };

  const commitRename = () => {
    if (editingId && editValue.trim()) {
      onRename(editingId, editValue.trim());
    }
    setEditingId(null);
  };

  return (
    <div className="flex items-end gap-1 overflow-x-auto pb-0 scrollbar-thin mb-[-1px] relative z-10">
      {tabs.map((tab) => {
        const isActive = tab.id === activeId;
        return (
          <div
            key={tab.id}
            className={`flex items-center gap-1 px-3 py-1.5 rounded-t-lg border text-sm cursor-pointer transition-colors shrink-0 ${
              isActive
                ? "bg-card border-border border-b-card text-foreground font-medium"
                : "bg-muted/50 border-transparent text-muted-foreground hover:bg-muted hover:text-foreground"
            }`}
            onClick={() => onSwitch(tab.id)}
            onDoubleClick={() => startRename(tab.id, tab.name)}
          >
            {editingId === tab.id ? (
              <input
                ref={inputRef}
                className="bg-transparent outline-none text-sm w-24 border-b border-primary"
                value={editValue}
                onChange={(e) => setEditValue(e.target.value)}
                onBlur={commitRename}
                onKeyDown={(e) => {
                  if (e.key === "Enter") commitRename();
                  if (e.key === "Escape") setEditingId(null);
                }}
                onClick={(e) => e.stopPropagation()}
              />
            ) : (
              <span className="max-w-[120px] truncate">{tab.name}</span>
            )}
            {editingId !== tab.id && (
              <button
                className="hover:bg-background rounded p-0.5 text-muted-foreground hover:text-foreground transition-colors"
                onClick={(e) => {
                  e.stopPropagation();
                  startRename(tab.id, tab.name);
                }}
                title="Rename"
              >
                <Pencil className="h-3 w-3" />
              </button>
            )}
            {tabs.length > 1 && (
              <button
                className="hover:bg-background rounded p-0.5 text-muted-foreground hover:text-foreground transition-colors"
                onClick={(e) => {
                  e.stopPropagation();
                  onClose(tab.id);
                }}
                title="Close tab"
              >
                <X className="h-3 w-3" />
              </button>
            )}
          </div>
        );
      })}
      <button
        className="flex items-center justify-center p-1.5 rounded-t-lg text-muted-foreground hover:bg-muted hover:text-foreground transition-colors cursor-pointer shrink-0"
        onClick={onNew}
        title="New document"
      >
        <Plus className="h-4 w-4" />
      </button>
    </div>
  );
}
