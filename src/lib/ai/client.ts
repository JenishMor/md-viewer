import type { AiActionId, AiErrorCode } from "@/lib/ai/actions";

export class AiRequestError extends Error {
  constructor(
    message: string,
    readonly code: AiErrorCode | "network",
    readonly resetsAt?: string,
  ) {
    super(message);
  }
}

// Same action on the same text returns the earlier answer instead of a new request.
const cache = new Map<string, string>();
const MAX_CACHE = 30;

function cacheKey(action: AiActionId, text: string) {
  return `${action}\u0000${text}`;
}

/** Models sometimes wrap the whole answer in a Markdown fence despite the instructions. */
export function unwrapFence(result: string, input: string) {
  const match = /^```(?:markdown|md)?[ \t]*\n([\s\S]*?)\n```\s*$/.exec(result.trim());
  return match && !input.trimStart().startsWith("```") ? match[1] : result;
}

export interface AiRunResult {
  text: string;
  cached: boolean;
  remainingToday?: number;
}

/**
 * Sends `text` to the AI endpoint and streams the answer through `onText`.
 * Nothing is sent unless this is called, which only happens on a user click.
 */
export async function runAiAction(
  action: AiActionId,
  text: string,
  { onText, signal, fresh = false }: { onText: (soFar: string) => void; signal?: AbortSignal; fresh?: boolean },
): Promise<AiRunResult> {
  const key = cacheKey(action, text);
  const hit = cache.get(key);
  if (hit !== undefined && !fresh) {
    onText(hit);
    return { text: hit, cached: true };
  }

  let res: Response;
  try {
    res = await fetch("/api/ai", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action, text }),
      signal,
    });
  } catch (err) {
    if (signal?.aborted) throw err;
    throw new AiRequestError("Couldn't reach MDViewer. Check your connection and try again.", "network");
  }

  if (!res.ok || !res.body) {
    const data = await res.json().catch(() => null);
    const error = data?.error;
    throw new AiRequestError(
      error?.message ?? "The AI request failed. Try again in a moment.",
      error?.code ?? "upstream_error",
      error?.resetsAt,
    );
  }

  const remaining = Number.parseInt(res.headers.get("X-AI-Remaining") ?? "", 10);
  const reader = res.body.pipeThrough(new TextDecoderStream()).getReader();
  let result = "";
  try {
    for (;;) {
      const { done, value } = await reader.read();
      if (done) break;
      result += value;
      onText(result);
    }
  } catch (err) {
    if (signal?.aborted) throw err;
    throw new AiRequestError("The answer was cut off. Try again.", "upstream_error");
  }

  result = unwrapFence(result, text).trim();
  if (!result) throw new AiRequestError("The AI returned an empty answer. Try again.", "upstream_error");
  onText(result);
  if (cache.size >= MAX_CACHE) cache.delete(cache.keys().next().value!);
  cache.set(key, result);
  return { text: result, cached: false, remainingToday: Number.isFinite(remaining) ? remaining : undefined };
}

export function formatResetTime(resetsAt?: string) {
  if (!resetsAt) return "";
  const date = new Date(resetsAt);
  if (Number.isNaN(date.getTime())) return "";
  return date.toLocaleTimeString([], { hour: "numeric", minute: "2-digit" });
}
