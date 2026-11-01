import { Redis } from "@upstash/redis";

/**
 * Request counters for fair use and the site-wide daily budget.
 *
 * With Upstash Redis configured, counts are shared by every serverless
 * instance. Without it, each instance counts on its own, which is fine for
 * local development but only approximate in production.
 */
interface Counter {
  /** Increments `key` and returns the new count. The key expires after `ttlSeconds`. */
  incr(key: string, ttlSeconds: number): Promise<number>;
}

function memoryCounter(): Counter {
  const counts = new Map<string, { value: number; expires: number }>();
  return {
    async incr(key, ttlSeconds) {
      const now = Date.now();
      if (counts.size > 10_000) {
        for (const [k, v] of counts) if (v.expires <= now) counts.delete(k);
      }
      const entry = counts.get(key);
      const next = entry && entry.expires > now
        ? { value: entry.value + 1, expires: entry.expires }
        : { value: 1, expires: now + ttlSeconds * 1000 };
      counts.set(key, next);
      return next.value;
    },
  };
}

function redisCounter(redis: Redis): Counter {
  return {
    async incr(key, ttlSeconds) {
      const [value] = await redis.multi().incr(key).expire(key, ttlSeconds, "NX").exec<[number, number]>();
      return value;
    },
  };
}

let counter: Counter | undefined;
function getCounter() {
  if (!counter) {
    const url = process.env.UPSTASH_REDIS_REST_URL;
    const token = process.env.UPSTASH_REDIS_REST_TOKEN;
    counter = url && token ? redisCounter(new Redis({ url, token })) : memoryCounter();
  }
  return counter;
}

function intEnv(name: string, fallback: number) {
  const value = Number.parseInt(process.env[name] ?? "", 10);
  return Number.isFinite(value) && value > 0 ? value : fallback;
}

/** Gemini's daily quotas reset at midnight Pacific time, so ours do too. */
function pacificDay(now: Date) {
  const parts = new Intl.DateTimeFormat("en-US", {
    timeZone: "America/Los_Angeles",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hourCycle: "h23",
  }).formatToParts(now);
  const get = (type: string) => Number(parts.find((p) => p.type === type)?.value);
  const elapsed = get("hour") * 3600 + get("minute") * 60 + get("second");
  return {
    key: `${get("year")}-${get("month")}-${get("day")}`,
    resetsAt: new Date(now.getTime() + (86_400 - elapsed) * 1000).toISOString(),
  };
}

export type LimitResult =
  | { ok: true; remainingToday: number }
  | { ok: false; reason: "rate_limited" | "quota_exhausted"; message: string; resetsAt?: string };

export async function checkLimits(clientId: string, now = new Date()): Promise<LimitResult> {
  const perMinute = intEnv("AI_USER_MINUTE_LIMIT", 5);
  const perDay = intEnv("AI_USER_DAILY_LIMIT", 10);
  const budget = intEnv("AI_DAILY_BUDGET", 450);
  const day = pacificDay(now);
  const c = getCounter();

  const minuteCount = await c.incr(`ai:m:${clientId}:${Math.floor(now.getTime() / 60_000)}`, 60);
  if (minuteCount > perMinute) {
    return { ok: false, reason: "rate_limited", message: "Too many AI requests at once. Wait a minute and try again." };
  }
  const userCount = await c.incr(`ai:d:${clientId}:${day.key}`, 86_400);
  if (userCount > perDay) {
    return {
      ok: false,
      reason: "rate_limited",
      message: `You've used today's ${perDay} AI requests.`,
      resetsAt: day.resetsAt,
    };
  }
  const globalCount = await c.incr(`ai:g:${day.key}`, 86_400);
  if (globalCount > budget) {
    return {
      ok: false,
      reason: "quota_exhausted",
      message: "MDViewer's free AI allowance for today has been used up.",
      resetsAt: day.resetsAt,
    };
  }
  return { ok: true, remainingToday: perDay - userCount };
}

export function nextQuotaReset(now = new Date()) {
  return pacificDay(now).resetsAt;
}

// The free Gemini tier may only serve users outside the EEA, the UK and Switzerland.
const PAID_ONLY_COUNTRIES = new Set([
  "AT", "BE", "BG", "HR", "CY", "CZ", "DK", "EE", "FI", "FR", "DE", "GR", "HU", "IE", "IT", "LV", "LT",
  "LU", "MT", "NL", "PL", "PT", "RO", "SK", "SI", "ES", "SE", "IS", "LI", "NO", "GB", "CH",
]);

export function isRegionAllowed(country: string | null) {
  if (process.env.AI_PAID_TIER === "true" || !country) return true;
  return !PAID_ONLY_COUNTRIES.has(country.toUpperCase());
}
