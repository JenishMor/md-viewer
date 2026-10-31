"use client";

import { useCallback, useRef, useState } from "react";
import { AlertTriangle, CheckCircle2, Info, X } from "lucide-react";

export type ToastKind = "success" | "error" | "info";

export interface ToastOptions {
  kind?: ToastKind;
  action?: { label: string; onClick: () => void };
  durationMs?: number;
}

interface ToastItem extends ToastOptions {
  id: number;
  message: string;
}

export function useToasts() {
  const [toasts, setToasts] = useState<ToastItem[]>([]);
  const nextId = useRef(1);

  const dismiss = useCallback((id: number) => {
    setToasts((t) => t.filter((x) => x.id !== id));
  }, []);

  const toast = useCallback(
    (message: string, options: ToastOptions = {}) => {
      const id = nextId.current++;
      setToasts((t) => [...t.slice(-3), { id, message, ...options }]);
      const duration = options.durationMs ?? (options.action || options.kind === "error" ? 8000 : 3500);
      setTimeout(() => dismiss(id), duration);
    },
    [dismiss],
  );

  return { toasts, toast, dismiss };
}

const ICONS = { success: CheckCircle2, error: AlertTriangle, info: Info };
const COLORS = {
  success: "text-green-600 dark:text-green-400",
  error: "text-red-600 dark:text-red-400",
  info: "text-blue-600 dark:text-blue-400",
};

export function Toaster({
  toasts,
  onDismiss,
}: {
  toasts: ToastItem[];
  onDismiss: (id: number) => void;
}) {
  return (
    <div
      className="fixed bottom-4 left-1/2 z-[60] flex w-[calc(100%-2rem)] max-w-md -translate-x-1/2 flex-col gap-2"
      role="status"
      aria-live="polite"
    >
      {toasts.map((t) => {
        const kind = t.kind ?? "info";
        const Icon = ICONS[kind];
        return (
          <div
            key={t.id}
            className="flex items-start gap-3 rounded-lg border border-border bg-card px-4 py-3 text-sm text-card-foreground shadow-lg"
            data-toast={kind}
          >
            <Icon className={`mt-0.5 h-4 w-4 shrink-0 ${COLORS[kind]}`} aria-hidden />
            <p className="flex-1 break-words">{t.message}</p>
            {t.action && (
              <button
                type="button"
                className="shrink-0 rounded px-2 py-0.5 font-medium text-primary hover:bg-accent cursor-pointer"
                onClick={() => {
                  t.action?.onClick();
                  onDismiss(t.id);
                }}
              >
                {t.action.label}
              </button>
            )}
            <button
              type="button"
              className="shrink-0 rounded p-0.5 text-muted-foreground hover:text-foreground cursor-pointer"
              onClick={() => onDismiss(t.id)}
              aria-label="Dismiss notification"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        );
      })}
    </div>
  );
}
