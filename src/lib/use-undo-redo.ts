import { useRef, useState, useCallback } from "react";

export function useUndoRedo() {
  const undoStack = useRef<string[]>([]);
  const redoStack = useRef<string[]>([]);
  const lastPushTime = useRef(0);
  const [, bump] = useState(0);

  const push = useCallback((current: string) => {
    const now = Date.now();
    if (now - lastPushTime.current > 400) {
      undoStack.current.push(current);
      if (undoStack.current.length > 100) undoStack.current.shift();
      lastPushTime.current = now;
    }
    redoStack.current = [];
    bump((n) => n + 1);
  }, []);

  const undo = useCallback((current: string): string | null => {
    if (undoStack.current.length === 0) return null;
    redoStack.current.push(current);
    const val = undoStack.current.pop()!;
    bump((n) => n + 1);
    return val;
  }, []);

  const redo = useCallback((current: string): string | null => {
    if (redoStack.current.length === 0) return null;
    undoStack.current.push(current);
    const val = redoStack.current.pop()!;
    bump((n) => n + 1);
    return val;
  }, []);

  const reset = useCallback(() => {
    undoStack.current = [];
    redoStack.current = [];
    lastPushTime.current = 0;
    bump((n) => n + 1);
  }, []);

  return {
    push,
    undo,
    redo,
    reset,
    canUndo: undoStack.current.length > 0,
    canRedo: redoStack.current.length > 0,
  };
}
