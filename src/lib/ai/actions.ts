// Shared by the browser and the /api/ai route. Prompts live on the server only.

export const AI_ENABLED = process.env.NEXT_PUBLIC_AI_ENABLED === "true";

/** Longest text (in characters) one request may send: about 15k tokens. */
export const AI_MAX_INPUT_CHARS = 60_000;

export type AiActionId = "improve" | "grammar" | "shorten" | "explain" | "format";

export interface AiAction {
  id: AiActionId;
  label: string;
  description: string;
  /** False for actions whose result is read, not applied to the document. */
  edits: boolean;
}

export const AI_ACTIONS: AiAction[] = [
  { id: "improve", label: "Improve writing", description: "Clearer wording and flow, same meaning", edits: true },
  { id: "grammar", label: "Fix spelling & grammar", description: "Corrections only, no rewording", edits: true },
  { id: "shorten", label: "Make shorter", description: "About half the length, key points kept", edits: true },
  { id: "format", label: "Format as Markdown", description: "Turn rough notes into structured Markdown", edits: true },
  { id: "explain", label: "Explain", description: "Plain-language explanation; doesn't change the text", edits: false },
];

export function isAiActionId(value: unknown): value is AiActionId {
  return typeof value === "string" && AI_ACTIONS.some((a) => a.id === value);
}

/** Error codes the API returns as `{ error: { code, message, resetsAt? } }`. */
export type AiErrorCode =
  | "disabled"
  | "bad_request"
  | "too_large"
  | "forbidden"
  | "region_unavailable"
  | "rate_limited"
  | "quota_exhausted"
  | "upstream_error";
