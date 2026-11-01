import { ApiError, GoogleGenAI, ThinkingLevel } from "@google/genai";
import { AI_MAX_INPUT_CHARS, isAiActionId, type AiActionId, type AiErrorCode } from "@/lib/ai/actions";
import { ACTION_PROMPTS, SYSTEM_INSTRUCTION, buildUserPrompt } from "@/lib/ai/server/prompts";
import { checkLimits, isRegionAllowed, nextQuotaReset } from "@/lib/ai/server/limits";

// Requests carry the user's text, so nothing here may be cached or logged.
export const dynamic = "force-dynamic";
export const maxDuration = 60;

function fail(status: number, code: AiErrorCode, message: string, resetsAt?: string) {
  return Response.json({ error: { code, message, resetsAt } }, { status, headers: { "Cache-Control": "no-store" } });
}

function clientId(req: Request) {
  return req.headers.get("x-forwarded-for")?.split(",")[0].trim() || req.headers.get("x-real-ip") || "local";
}

/** Only MDViewer's own pages may call this endpoint from a browser. */
function isSameOrigin(req: Request) {
  const origin = req.headers.get("origin");
  if (!origin) return false;
  try {
    return new URL(origin).host === req.headers.get("host");
  } catch {
    return false;
  }
}

function isQuotaError(err: unknown) {
  return err instanceof ApiError && err.status === 429;
}

async function startStream(ai: GoogleGenAI, model: string, action: AiActionId, text: string, signal: AbortSignal) {
  const { temperature, maxOutputTokens } = ACTION_PROMPTS[action];
  return ai.models.generateContentStream({
    model,
    contents: [{ role: "user", parts: [{ text: buildUserPrompt(action, text) }] }],
    config: {
      systemInstruction: SYSTEM_INSTRUCTION,
      temperature,
      maxOutputTokens,
      thinkingConfig: { thinkingLevel: ThinkingLevel.MINIMAL },
      abortSignal: signal,
    },
  });
}

export async function POST(req: Request) {
  const apiKey = process.env.GEMINI_API_KEY;
  if (process.env.NEXT_PUBLIC_AI_ENABLED !== "true" || !apiKey) {
    return fail(503, "disabled", "AI features aren't available on this site.");
  }
  if (!isSameOrigin(req)) return fail(403, "forbidden", "Requests must come from MDViewer.");
  if (!isRegionAllowed(req.headers.get("x-vercel-ip-country"))) {
    return fail(451, "region_unavailable", "AI features aren't available in your region yet.");
  }

  let body: { action?: unknown; text?: unknown };
  try {
    body = await req.json();
  } catch {
    return fail(400, "bad_request", "Invalid request.");
  }
  const { action, text } = body;
  if (!isAiActionId(action) || typeof text !== "string" || !text.trim()) {
    return fail(400, "bad_request", "Choose an action and some text.");
  }
  if (text.length > AI_MAX_INPUT_CHARS) {
    return fail(413, "too_large", `Select at most ${AI_MAX_INPUT_CHARS.toLocaleString("en-US")} characters.`);
  }

  const limit = await checkLimits(clientId(req));
  if (!limit.ok) return fail(429, limit.reason, limit.message, limit.resetsAt);

  const ai = new GoogleGenAI({ apiKey });
  const models = [
    process.env.GEMINI_MODEL || "gemini-3.5-flash-lite",
    process.env.GEMINI_FALLBACK_MODEL,
  ].filter((m): m is string => Boolean(m));

  let stream: Awaited<ReturnType<typeof startStream>> | undefined;
  let model = models[0];
  for (const candidate of models) {
    model = candidate;
    try {
      stream = await startStream(ai, candidate, action, text, req.signal);
      break;
    } catch (err) {
      if (isQuotaError(err)) continue; // Each model has its own free quota.
      console.error(`[ai] ${action} via ${candidate} failed:`, err instanceof ApiError ? err.status : "error");
      return fail(502, "upstream_error", "The AI service didn't respond. Try again in a moment.");
    }
  }
  if (!stream) {
    return fail(429, "quota_exhausted", "MDViewer's free AI allowance for today has been used up.", nextQuotaReset());
  }

  const started = Date.now();
  const encoder = new TextEncoder();
  const source = stream;
  const output = new ReadableStream<Uint8Array>({
    async start(controller) {
      let outputTokens = 0;
      try {
        for await (const chunk of source) {
          const piece = chunk.text;
          if (piece) controller.enqueue(encoder.encode(piece));
          outputTokens = chunk.usageMetadata?.candidatesTokenCount ?? outputTokens;
        }
        controller.close();
      } catch (err) {
        controller.error(err);
      } finally {
        // Metadata only: never the user's text or the model's answer.
        console.info(`[ai] ${action} via ${model}: ${text.length} chars in, ${outputTokens} tokens out, ${Date.now() - started} ms`);
      }
    },
  });

  return new Response(output, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "no-store",
      "X-AI-Remaining": String(limit.remainingToday),
    },
  });
}
