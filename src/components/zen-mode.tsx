"use client";

import { useEffect, useRef, useMemo } from "react";
import { X } from "lucide-react";
import { handleKeyboardShortcut } from "@/lib/formatting";

interface ZenModeProps {
  value: string;
  onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  onExit: () => void;
  onUndo: () => void;
  onRedo: () => void;
}

function computeStats(text: string) {
  const words = text.trim() === "" ? 0 : text.trim().split(/\s+/).length;
  const readingTime = Math.max(1, Math.ceil(words / 200));
  return { words, readingTime };
}

export function ZenMode({
  value,
  onChange,
  onExit,
  onUndo,
  onRedo,
}: ZenModeProps) {
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const stats = useMemo(() => computeStats(value), [value]);

  useEffect(() => {
    textareaRef.current?.focus();
  }, []);

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onExit();
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [onExit]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    const mod = e.ctrlKey || e.metaKey;
    if (mod && e.key === "z" && !e.shiftKey) {
      e.preventDefault();
      onUndo();
      return;
    }
    if (mod && (e.key === "y" || (e.key === "z" && e.shiftKey))) {
      e.preventDefault();
      onRedo();
      return;
    }
    if (textareaRef.current) {
      handleKeyboardShortcut(e, textareaRef.current, value, onChange);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-background flex flex-col">
      <div className="flex items-center justify-between px-6 py-3 border-b border-border/50">
        <span className="text-sm text-muted-foreground">
          Zen Mode — {stats.words} words — ~{stats.readingTime} min read
        </span>
        <button
          onClick={onExit}
          className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
          title="Exit Zen Mode (Esc)"
        >
          <span className="hidden sm:inline">ESC to exit</span>
          <X className="h-4 w-4" />
        </button>
      </div>
      <div className="flex-1 flex justify-center overflow-hidden">
        <textarea
          ref={textareaRef}
          className="w-full max-w-3xl px-8 py-8 bg-transparent font-mono text-base leading-loose outline-none resize-none"
          value={value}
          onChange={onChange}
          onKeyDown={handleKeyDown}
          spellCheck={false}
          placeholder="Start writing..."
        />
      </div>
    </div>
  );
}
