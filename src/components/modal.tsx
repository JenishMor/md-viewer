"use client";

import { useCallback, useEffect, useRef, useState, type ReactNode } from "react";
import { X } from "lucide-react";

/** Accessible modal built on <dialog>: focus trap, Esc to close, and backdrop. */
export function Modal({
  open,
  onClose,
  title,
  children,
  footer,
  size = "md",
}: {
  open: boolean;
  onClose: () => void;
  title: string;
  children: ReactNode;
  footer?: ReactNode;
  size?: "sm" | "md" | "lg";
}) {
  const ref = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const dialog = ref.current;
    if (!dialog) return;
    if (open && !dialog.open) dialog.showModal();
    if (!open && dialog.open) dialog.close();
  }, [open]);

  const width = size === "sm" ? "max-w-md" : size === "lg" ? "max-w-3xl" : "max-w-xl";

  return (
    <dialog
      ref={ref}
      onClose={onClose}
      onCancel={(e) => {
        e.preventDefault();
        onClose();
      }}
      onClick={(e) => {
        if (e.target === ref.current) onClose();
      }}
      aria-label={title}
      className={`m-auto w-[calc(100%-2rem)] ${width} rounded-xl border border-border bg-card p-0 text-card-foreground shadow-2xl backdrop:bg-black/50`}
    >
      {open && (
        <div className="flex max-h-[85vh] flex-col">
          <div className="flex items-center justify-between border-b border-border px-5 py-3">
            <h2 className="text-base font-semibold">
              {title}
            </h2>
            <button
              type="button"
              onClick={onClose}
              className="rounded p-1.5 hover:bg-accent cursor-pointer"
              aria-label="Close dialog"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
          <div className="flex-1 overflow-y-auto px-5 py-4 text-sm">{children}</div>
          {footer && (
            <div className="flex flex-wrap items-center justify-end gap-2 border-t border-border px-5 py-3">
              {footer}
            </div>
          )}
        </div>
      )}
    </dialog>
  );
}

export const buttonStyles = {
  primary:
    "inline-flex items-center justify-center gap-2 rounded-md bg-primary px-3 py-1.5 text-sm font-medium text-primary-foreground hover:opacity-90 disabled:opacity-50 cursor-pointer disabled:cursor-default",
  secondary:
    "inline-flex items-center justify-center gap-2 rounded-md border border-border px-3 py-1.5 text-sm font-medium hover:bg-accent disabled:opacity-50 cursor-pointer disabled:cursor-default",
  danger:
    "inline-flex items-center justify-center gap-2 rounded-md bg-red-600 px-3 py-1.5 text-sm font-medium text-white hover:bg-red-700 cursor-pointer",
};

interface ConfirmRequest {
  title: string;
  message: ReactNode;
  confirmLabel?: string;
  danger?: boolean;
  resolve: (ok: boolean) => void;
}

/** Promise-based confirmation dialog: `if (await confirm({...})) { ... }`. */
export function useConfirm() {
  const [request, setRequest] = useState<ConfirmRequest | null>(null);

  const confirm = useCallback(
    (opts: Omit<ConfirmRequest, "resolve">) =>
      new Promise<boolean>((resolve) => setRequest({ ...opts, resolve })),
    [],
  );

  const close = (ok: boolean) => {
    request?.resolve(ok);
    setRequest(null);
  };

  const dialog = (
    <Modal
      open={request !== null}
      onClose={() => close(false)}
      title={request?.title ?? ""}
      size="sm"
      footer={
        <>
          <button type="button" className={buttonStyles.secondary} onClick={() => close(false)}>
            Cancel
          </button>
          <button
            type="button"
            className={request?.danger ? buttonStyles.danger : buttonStyles.primary}
            onClick={() => close(true)}
            autoFocus
          >
            {request?.confirmLabel ?? "Confirm"}
          </button>
        </>
      }
    >
      {request?.message}
    </Modal>
  );

  return { confirm, dialog };
}
