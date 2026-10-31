// Thin, failure-tolerant wrappers around localStorage. Private browsing modes,
// disabled site data and quota limits all surface here instead of crashing.

export type StorageFailure = "quota" | "unavailable" | "unknown";

export type StorageResult = { ok: true } | { ok: false; reason: StorageFailure };

export function isStorageAvailable(): boolean {
  try {
    const probe = "__md_viewer_probe__";
    window.localStorage.setItem(probe, probe);
    window.localStorage.removeItem(probe);
    return true;
  } catch {
    return false;
  }
}

export function safeGet(key: string): string | null {
  try {
    return window.localStorage.getItem(key);
  } catch {
    return null;
  }
}

export function safeSet(key: string, value: string): StorageResult {
  try {
    window.localStorage.setItem(key, value);
    return { ok: true };
  } catch (err) {
    return { ok: false, reason: classifyError(err) };
  }
}

export function safeRemove(key: string) {
  try {
    window.localStorage.removeItem(key);
  } catch {
    /* ignore */
  }
}

function classifyError(err: unknown): StorageFailure {
  if (err instanceof DOMException) {
    if (
      err.name === "QuotaExceededError" ||
      err.name === "NS_ERROR_DOM_QUOTA_REACHED" ||
      err.code === 22
    ) {
      return "quota";
    }
    if (err.name === "SecurityError") return "unavailable";
  }
  return "unknown";
}

export function describeStorageFailure(reason: StorageFailure): string {
  switch (reason) {
    case "quota":
      return "Browser storage is full. Delete unused documents or export this one.";
    case "unavailable":
      return "Browser storage is blocked (private mode or site data disabled). Changes will be lost when this tab closes.";
    default:
      return "Could not save to browser storage.";
  }
}
