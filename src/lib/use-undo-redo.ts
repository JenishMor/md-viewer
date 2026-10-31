import { useRef, useState, useCallback } from "react";

export function useUndoRedo() {
  const undoStack = useRef<string[]>([]);
  const redoStack = useRef<string[]>([]);
  const lastPushTime = useRef(0);
  const [sizes, setSizes] = useState({ undo: 0, redo: 0 });

  const sync = useCallback(() => {
    setSizes({
      undo: undoStack.current.length,
      redo: redoStack.current.length,
    });
  }, []);

  const push = useCallback(
    (current: string) => {
      const now = Date.now();
      if (now - lastPushTime.current > 400) {
        undoStack.current.push(current);
        if (undoStack.current.length > 100) undoStack.current.shift();
        lastPushTime.current = now;
      }
      redoStack.current = [];
      sync();
    },
    [sync],
  );

  const undo = useCallback(
    (current: string): string | null => {
      if (undoStack.current.length === 0) return null;
      redoStack.current.push(current);
      const val = undoStack.current.pop()!;
      // Typing straight after an undo must start a new undo step.
      lastPushTime.current = 0;
      sync();
      return val;
    },
    [sync],
  );

  const redo = useCallback(
    (current: string): string | null => {
      if (redoStack.current.length === 0) return null;
      undoStack.current.push(current);
      const val = redoStack.current.pop()!;
      lastPushTime.current = 0;
      sync();
      return val;
    },
    [sync],
  );

  const reset = useCallback(() => {
    undoStack.current = [];
    redoStack.current = [];
    lastPushTime.current = 0;
    sync();
  }, [sync]);

  return {
    push,
    undo,
    redo,
    reset,
    canUndo: sizes.undo > 0,
    canRedo: sizes.redo > 0,
  };
}
