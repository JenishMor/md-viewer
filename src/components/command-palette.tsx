"use client";

import { useState, useEffect, useRef, useMemo } from "react";
import { Search } from "lucide-react";

export interface PaletteAction {
  id: string;
  name: string;
  shortcut?: string;
  section: string;
  handler: () => void;
}

interface CommandPaletteProps {
  isOpen: boolean;
  onClose: () => void;
  actions: PaletteAction[];
}

export function CommandPalette({
  isOpen,
  onClose,
  actions,
}: CommandPaletteProps) {
  const [query, setQuery] = useState("");
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLDivElement>(null);

  const filtered = useMemo(() => {
    if (!query) return actions;
    const lower = query.toLowerCase();
    return actions.filter(
      (a) =>
        a.name.toLowerCase().includes(lower) ||
        a.section.toLowerCase().includes(lower),
    );
  }, [query, actions]);

  // Group by section
  const grouped = useMemo(() => {
    const groups: { section: string; items: PaletteAction[] }[] = [];
    const sectionMap = new Map<string, PaletteAction[]>();
    for (const action of filtered) {
      if (!sectionMap.has(action.section)) {
        sectionMap.set(action.section, []);
      }
      sectionMap.get(action.section)!.push(action);
    }
    for (const [section, items] of sectionMap) {
      groups.push({ section, items });
    }
    return groups;
  }, [filtered]);

  useEffect(() => {
    if (isOpen) {
      setQuery("");
      setSelectedIndex(0);
      setTimeout(() => inputRef.current?.focus(), 0);
    }
  }, [isOpen]);

  useEffect(() => {
    setSelectedIndex(0);
  }, [query]);

  // Scroll selected item into view
  useEffect(() => {
    const el = listRef.current?.querySelector("[data-selected='true']");
    el?.scrollIntoView({ block: "nearest" });
  }, [selectedIndex]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Escape") {
      onClose();
      return;
    }
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setSelectedIndex((i) => Math.min(i + 1, filtered.length - 1));
      return;
    }
    if (e.key === "ArrowUp") {
      e.preventDefault();
      setSelectedIndex((i) => Math.max(i - 1, 0));
      return;
    }
    if (e.key === "Enter" && filtered[selectedIndex]) {
      e.preventDefault();
      filtered[selectedIndex].handler();
      onClose();
      return;
    }
  };

  if (!isOpen) return null;

  let flatIndex = -1;

  return (
    <div
      className="fixed inset-0 z-50 flex items-start justify-center pt-[15vh] bg-black/50"
      onClick={onClose}
    >
      <div
        className="bg-card border border-border rounded-xl shadow-2xl w-full max-w-lg mx-4 overflow-hidden"
        onClick={(e) => e.stopPropagation()}
        onKeyDown={handleKeyDown}
      >
        {/* Search */}
        <div className="flex items-center gap-3 px-4 py-3 border-b border-border">
          <Search className="h-4 w-4 text-muted-foreground shrink-0" />
          <input
            ref={inputRef}
            type="text"
            placeholder="Type a command..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="flex-1 bg-transparent text-sm outline-none placeholder:text-muted-foreground"
          />
          <kbd className="hidden sm:inline text-xs text-muted-foreground bg-muted px-1.5 py-0.5 rounded border border-border">
            ESC
          </kbd>
        </div>

        {/* Results */}
        <div ref={listRef} className="max-h-72 overflow-y-auto py-1">
          {filtered.length === 0 ? (
            <div className="px-4 py-6 text-sm text-muted-foreground text-center">
              No matching commands
            </div>
          ) : (
            grouped.map((group) => (
              <div key={group.section}>
                <div className="px-4 pt-2 pb-1 text-xs font-medium text-muted-foreground uppercase tracking-wider">
                  {group.section}
                </div>
                {group.items.map((action) => {
                  flatIndex++;
                  const isSelected = flatIndex === selectedIndex;
                  return (
                    <button
                      key={action.id}
                      data-selected={isSelected}
                      onClick={() => {
                        action.handler();
                        onClose();
                      }}
                      className={`w-full flex items-center justify-between px-4 py-2 text-sm cursor-pointer transition-colors ${
                        isSelected
                          ? "bg-accent text-accent-foreground"
                          : "text-foreground hover:bg-accent/50"
                      }`}
                    >
                      <span>{action.name}</span>
                      {action.shortcut && (
                        <kbd className="text-xs text-muted-foreground bg-muted px-1.5 py-0.5 rounded border border-border">
                          {action.shortcut}
                        </kbd>
                      )}
                    </button>
                  );
                })}
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
