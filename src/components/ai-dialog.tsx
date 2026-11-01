"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { AlertTriangle, Copy, Loader2, RotateCcw, Sparkles, Square } from "lucide-react";
import { Modal, buttonStyles } from "@/components/modal";
import { AI_ACTIONS, AI_MAX_INPUT_CHARS, type AiAction, type AiActionId } from "@/lib/ai/actions";
import { AiRequestError, formatResetTime, runAiAction } from "@/lib/ai/client";
import type { AiTarget } from "@/lib/ai/target";
import { safeGet, safeSet } from "@/lib/storage";

const CONSENT_KEY = "md-viewer-ai-consent";

type Status =
  | { state: "idle" }
  | { state: "running"; text: string }
  | { state: "done"; text: string; cached: boolean }
  | { state: "error"; message: string };

function countWords(text: string) {
  const trimmed = text.trim();
  return trimmed ? trimmed.split(/\s+/).length : 0;
}

function Disclosure() {
  return (
    <p className="text-xs text-muted-foreground">
      Text is sent to Google Gemini only when you choose an action, and MDViewer doesn&apos;t
      store it. On Gemini&apos;s free tier Google may use it to improve its products, so
      don&apos;t include sensitive information.{" "}
      <a href="/privacy-policy#ai-features" target="_blank" rel="noopener" className="underline underline-offset-2 hover:text-foreground">
        Privacy details
      </a>
    </p>
  );
}

export function AiDialog({
  open,
  target,
  initialAction,
  onClose,
  onApplied,
  onCopy,
}: {
  open: boolean;
  /** Captured when the dialog opened; null when there is no text to work on. */
  target: AiTarget | null;
  initialAction?: AiActionId;
  onClose: () => void;
  onApplied: (message: string) => void;
  onCopy: (text: string) => void;
}) {
  const [consented, setConsented] = useState(() => safeGet(CONSENT_KEY) === "1");
  const [action, setAction] = useState<AiAction | null>(null);
  const [status, setStatus] = useState<Status>({ state: "idle" });
  const [notice, setNotice] = useState<string | null>(null);
  const controller = useRef<AbortController | null>(null);
  const autoRan = useRef(false);

  const text = target?.text ?? "";
  const tooLarge = text.length > AI_MAX_INPUT_CHARS;
  const words = countWords(text);
  const subject = target?.scope === "selection" ? "selection" : "document";

  const run = useCallback(
    async (next: AiAction, fresh = false) => {
      if (!target || tooLarge) return;
      controller.current?.abort();
      const abort = new AbortController();
      controller.current = abort;
      setAction(next);
      setNotice(null);
      setStatus({ state: "running", text: "" });
      try {
        const result = await runAiAction(next.id, target.text, {
          fresh,
          signal: abort.signal,
          onText: (soFar) => setStatus({ state: "running", text: soFar }),
        });
        setStatus({ state: "done", text: result.text, cached: result.cached });
        if (result.remainingToday !== undefined && result.remainingToday <= 3) {
          setNotice(`${result.remainingToday} AI ${result.remainingToday === 1 ? "request" : "requests"} left today.`);
        }
      } catch (err) {
        if (abort.signal.aborted) return;
        let message = err instanceof Error ? err.message : "The AI request failed.";
        if (err instanceof AiRequestError && err.resetsAt) {
          message += ` AI is available again at ${formatResetTime(err.resetsAt)}. Everything else keeps working.`;
        }
        setStatus({ state: "error", message });
      }
    },
    [target, tooLarge],
  );

  // Command-palette entries open the dialog with an action already chosen.
  useEffect(() => {
    if (!open || !consented || autoRan.current || !initialAction) return;
    const next = AI_ACTIONS.find((a) => a.id === initialAction);
    if (!next) return;
    const timer = setTimeout(() => {
      autoRan.current = true;
      void run(next);
    });
    return () => clearTimeout(timer);
  }, [open, consented, initialAction, run]);

  useEffect(() => () => controller.current?.abort(), []);

  const stop = () => {
    controller.current?.abort();
    setStatus({ state: "idle" });
    setAction(null);
  };

  const apply = (mode: "replace" | "insert") => {
    if (status.state !== "done" || !target) return;
    if (!target.apply(status.text, mode)) {
      setNotice("The document changed after you opened this. Copy the result instead, or run the action again.");
      return;
    }
    onApplied(mode === "replace" ? "Applied the AI suggestion. Use Undo to revert it." : "Inserted the AI result.");
    onClose();
  };

  const accept = () => {
    safeSet(CONSENT_KEY, "1");
    setConsented(true);
  };

  let body: React.ReactNode;
  let footer: React.ReactNode;

  if (!consented) {
    body = (
      <div className="space-y-3">
        <p>
          AI actions can improve, correct, shorten, explain or format your text. Before you use
          them, here&apos;s what happens to your text:
        </p>
        <ul className="list-disc space-y-1 pl-5">
          <li>Nothing is sent until you click an action.</li>
          <li>
            Only the {target?.scope === "selection" ? "text you selected" : "current document"} is
            sent, through MDViewer&apos;s server, to Google Gemini.
          </li>
          <li>MDViewer doesn&apos;t store or log your text. Your documents still live in this browser.</li>
          <li>
            MDViewer uses Gemini&apos;s free tier, where Google may use requests to improve its
            products and human reviewers may read them. Don&apos;t send passwords, personal data or
            confidential work.
          </li>
          <li>Results can be wrong. You review every suggestion before it changes your document.</li>
        </ul>
      </div>
    );
    footer = (
      <>
        <button type="button" className={buttonStyles.secondary} onClick={onClose}>
          Not now
        </button>
        <button type="button" className={buttonStyles.primary} onClick={accept} autoFocus>
          I understand, continue
        </button>
      </>
    );
  } else if (!target || !text.trim()) {
    body = <p>Select some text in the editor, or write something first, then open AI again.</p>;
    footer = (
      <button type="button" className={buttonStyles.secondary} onClick={onClose}>
        Close
      </button>
    );
  } else if (status.state === "idle" || !action) {
    body = (
      <div className="space-y-4">
        <p className="text-muted-foreground">
          Working on {target.scope === "selection" ? "the selected text" : "the whole document"} (
          {words.toLocaleString()} {words === 1 ? "word" : "words"}).
          {target.scope === "document" && " Select text first to work on part of it."}
        </p>
        {tooLarge ? (
          <p className="flex items-start gap-2 rounded-md bg-amber-50 px-3 py-2 text-amber-900 dark:bg-amber-950/40 dark:text-amber-100" role="alert">
            <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0" aria-hidden />
            This {subject} is too long for AI ({text.length.toLocaleString()} characters; the limit is{" "}
            {AI_MAX_INPUT_CHARS.toLocaleString()}). Select a smaller part.
          </p>
        ) : (
          <div className="grid gap-2 sm:grid-cols-2">
            {AI_ACTIONS.map((a) => (
              <button
                key={a.id}
                type="button"
                className="flex flex-col items-start rounded-lg border border-border px-3 py-2 text-left hover:bg-accent cursor-pointer"
                onClick={() => run(a)}
              >
                <span className="font-medium">{a.label}</span>
                <span className="text-xs text-muted-foreground">{a.description}</span>
              </button>
            ))}
          </div>
        )}
        <Disclosure />
      </div>
    );
    footer = (
      <button type="button" className={buttonStyles.secondary} onClick={onClose}>
        Close
      </button>
    );
  } else {
    const result = status.state === "running" || status.state === "done" ? status.text : "";
    body = (
      <div className="space-y-3">
        <div className="flex items-center gap-2 font-medium">
          <Sparkles className="h-4 w-4 text-primary" aria-hidden />
          {action.label}
          {status.state === "running" && (
            <span className="inline-flex items-center gap-1 text-xs font-normal text-muted-foreground">
              <Loader2 className="h-3.5 w-3.5 animate-spin" aria-hidden /> Writing…
            </span>
          )}
          {status.state === "done" && status.cached && (
            <span className="text-xs font-normal text-muted-foreground">(saved result, no new request)</span>
          )}
        </div>
        {status.state === "error" ? (
          <p className="flex items-start gap-2 rounded-md bg-red-50 px-3 py-2 text-red-800 dark:bg-red-950/40 dark:text-red-200" role="alert">
            <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0" aria-hidden />
            {status.message}
          </p>
        ) : action.edits ? (
          <pre
            className="max-h-[45vh] overflow-auto whitespace-pre-wrap break-words rounded-md border border-border bg-muted/40 p-3 font-mono text-[13px] leading-relaxed"
            aria-live="polite"
            aria-label="AI result"
            data-testid="ai-result"
          >
            {result}
          </pre>
        ) : (
          <div
            className="prose prose-sm dark:prose-invert max-h-[45vh] max-w-none overflow-auto rounded-md border border-border bg-muted/40 p-3"
            aria-live="polite"
            aria-label="AI result"
            data-testid="ai-result"
          >
            <ReactMarkdown remarkPlugins={[remarkGfm]}>{result}</ReactMarkdown>
          </div>
        )}
        {action.edits && status.state === "done" && (
          <details className="text-xs">
            <summary className="cursor-pointer text-muted-foreground hover:text-foreground">Show original</summary>
            <pre className="mt-2 max-h-48 overflow-auto whitespace-pre-wrap break-words rounded-md border border-border p-3 font-mono">
              {text}
            </pre>
          </details>
        )}
        {notice && (
          <p className="text-xs text-amber-700 dark:text-amber-300" role="status">
            {notice}
          </p>
        )}
        <Disclosure />
      </div>
    );
    footer =
      status.state === "running" ? (
        <button type="button" className={buttonStyles.secondary} onClick={stop}>
          <Square className="h-3.5 w-3.5" aria-hidden /> Stop
        </button>
      ) : (
        <>
          <button type="button" className={`${buttonStyles.secondary} mr-auto`} onClick={stop}>
            Back
          </button>
          <button type="button" className={buttonStyles.secondary} onClick={() => run(action, true)}>
            <RotateCcw className="h-3.5 w-3.5" aria-hidden /> Retry
          </button>
          {status.state === "done" && (
            <>
              <button type="button" className={buttonStyles.secondary} onClick={() => onCopy(status.text)}>
                <Copy className="h-3.5 w-3.5" aria-hidden /> Copy
              </button>
              <button
                type="button"
                className={action.edits ? buttonStyles.secondary : buttonStyles.primary}
                onClick={() => apply("insert")}
              >
                Insert below
              </button>
              {action.edits && (
                <button type="button" className={buttonStyles.primary} onClick={() => apply("replace")} autoFocus>
                  Replace {subject}
                </button>
              )}
            </>
          )}
        </>
      );
  }

  return (
    <Modal open={open} onClose={onClose} title={consented ? "AI assist" : "Before you use AI"} size="lg" footer={footer}>
      {body}
    </Modal>
  );
}
