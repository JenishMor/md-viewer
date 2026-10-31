import { useCallback, useEffect, useRef, useState } from "react";
import {
  describeStorageFailure,
  isStorageAvailable,
  safeGet,
  safeRemove,
  safeSet,
} from "@/lib/storage";

export interface MdDocument {
  id: string;
  name: string;
  content: string;
  updatedAt: number;
}

export interface TrashedDocument extends MdDocument {
  deletedAt: number;
}

export type SaveStatus =
  | { state: "idle" }
  | { state: "saving" }
  | { state: "saved"; at: number }
  | { state: "error"; message: string };

export const DOCS_KEY = "md-viewer-docs";
export const ACTIVE_KEY = "md-viewer-active-doc";
export const TRASH_KEY = "md-viewer-trash";
const OLD_STORAGE_KEY = "md-viewer-content";

const SAVE_DELAY_MS = 400;
const TRASH_LIMIT = 20;
const TRASH_TTL_MS = 30 * 24 * 60 * 60 * 1000;

export function generateId() {
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 8);
}

function parseDocs(raw: string | null): MdDocument[] | null {
  if (!raw) return null;
  try {
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return null;
    return parsed
      .filter(
        (d) =>
          d && typeof d.id === "string" && typeof d.content === "string",
      )
      .map((d) => ({
        id: d.id,
        name: typeof d.name === "string" && d.name ? d.name : "Untitled",
        content: d.content,
        updatedAt: typeof d.updatedAt === "number" ? d.updatedAt : Date.now(),
      }));
  } catch {
    return null;
  }
}

function parseTrash(raw: string | null): TrashedDocument[] {
  const docs = parseDocs(raw) as TrashedDocument[] | null;
  if (!docs) return [];
  const cutoff = Date.now() - TRASH_TTL_MS;
  return docs.filter((d) => (d.deletedAt ?? 0) > cutoff);
}

export function useDocuments(defaultContent: string) {
  const [documents, setDocuments] = useState<MdDocument[]>([]);
  const [activeId, setActiveId] = useState("");
  const [trash, setTrash] = useState<TrashedDocument[]>([]);
  const [isInitialized, setIsInitialized] = useState(false);
  const [status, setStatus] = useState<SaveStatus>({ state: "idle" });

  const latest = useRef({ documents, activeId, trash });
  useEffect(() => {
    latest.current = { documents, activeId, trash };
  });
  const dirty = useRef(false);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const flush = useCallback(() => {
    if (timer.current) {
      clearTimeout(timer.current);
      timer.current = null;
    }
    if (!dirty.current) return true;
    const { documents, activeId, trash } = latest.current;
    const result = safeSet(DOCS_KEY, JSON.stringify(documents));
    if (!result.ok) {
      setStatus({ state: "error", message: describeStorageFailure(result.reason) });
      return false;
    }
    safeSet(ACTIVE_KEY, activeId);
    safeSet(TRASH_KEY, JSON.stringify(trash));
    dirty.current = false;
    setStatus({ state: "saved", at: Date.now() });
    return true;
  }, []);

  // Load once on mount. Reading storage during render would break hydration.
  /* eslint-disable react-hooks/set-state-in-effect */
  useEffect(() => {
    if (!isStorageAvailable()) {
      setStatus({ state: "error", message: describeStorageFailure("unavailable") });
    }
    const savedDocs = parseDocs(safeGet(DOCS_KEY));
    const savedActive = safeGet(ACTIVE_KEY);
    setTrash(parseTrash(safeGet(TRASH_KEY)));

    if (savedDocs && savedDocs.length > 0) {
      setDocuments(savedDocs);
      setActiveId(
        savedActive && savedDocs.some((d) => d.id === savedActive)
          ? savedActive
          : savedDocs[0].id,
      );
    } else {
      // Migrate from old single-doc storage
      const oldContent = safeGet(OLD_STORAGE_KEY);
      const doc: MdDocument = {
        id: generateId(),
        name: "Untitled",
        content: oldContent ?? defaultContent,
        updatedAt: Date.now(),
      };
      setDocuments([doc]);
      setActiveId(doc.id);
    }
    setIsInitialized(true);
  }, [defaultContent]);
  /* eslint-enable react-hooks/set-state-in-effect */

  // Debounced persistence on any change.
  useEffect(() => {
    if (!isInitialized) return;
    dirty.current = true;
    // eslint-disable-next-line react-hooks/set-state-in-effect -- reflects the pending write
    setStatus((s) => (s.state === "error" ? s : { state: "saving" }));
    if (timer.current) clearTimeout(timer.current);
    timer.current = setTimeout(flush, SAVE_DELAY_MS);
  }, [documents, activeId, trash, isInitialized, flush]);

  // Never lose the last keystrokes when the tab is hidden or closed.
  useEffect(() => {
    const onHide = () => {
      flush();
    };
    const onVisibility = () => {
      if (document.visibilityState === "hidden") flush();
    };
    const onBeforeUnload = (e: BeforeUnloadEvent) => {
      if (!flush()) {
        e.preventDefault();
      }
    };
    window.addEventListener("pagehide", onHide);
    window.addEventListener("beforeunload", onBeforeUnload);
    document.addEventListener("visibilitychange", onVisibility);
    return () => {
      window.removeEventListener("pagehide", onHide);
      window.removeEventListener("beforeunload", onBeforeUnload);
      document.removeEventListener("visibilitychange", onVisibility);
    };
  }, [flush]);

  const setContent = useCallback((id: string, content: string) => {
    setDocuments((prev) =>
      prev.map((d) =>
        d.id === id && d.content !== content
          ? { ...d, content, updatedAt: Date.now() }
          : d,
      ),
    );
  }, []);

  const createDocument = useCallback(
    (name?: string, content = "") => {
      const doc: MdDocument = {
        id: generateId(),
        name: name ?? `Untitled ${latest.current.documents.length + 1}`,
        content,
        updatedAt: Date.now(),
      };
      setDocuments((prev) => [...prev, doc]);
      setActiveId(doc.id);
      return doc.id;
    },
    [],
  );

  const renameDocument = useCallback((id: string, name: string) => {
    const trimmed = name.trim().slice(0, 120);
    if (!trimmed) return;
    setDocuments((prev) =>
      prev.map((d) => (d.id === id ? { ...d, name: trimmed } : d)),
    );
  }, []);

  const duplicateDocument = useCallback((id: string) => {
    const source = latest.current.documents.find((d) => d.id === id);
    if (!source) return;
    const copy: MdDocument = {
      ...source,
      id: generateId(),
      name: `${source.name} (copy)`,
      updatedAt: Date.now(),
    };
    setDocuments((prev) => {
      const index = prev.findIndex((d) => d.id === id);
      const next = [...prev];
      next.splice(index + 1, 0, copy);
      return next;
    });
    setActiveId(copy.id);
  }, []);

  /** Moves a document to "Recently deleted". Always keeps at least one document open. */
  const deleteDocument = useCallback((id: string) => {
    const { documents, activeId } = latest.current;
    const doc = documents.find((d) => d.id === id);
    if (!doc) return;
    let remaining = documents.filter((d) => d.id !== id);
    if (remaining.length === 0) {
      remaining = [
        { id: generateId(), name: "Untitled", content: "", updatedAt: Date.now() },
      ];
    }
    setDocuments(remaining);
    if (activeId === id) {
      const index = documents.findIndex((d) => d.id === id);
      setActiveId(remaining[Math.min(index, remaining.length - 1)].id);
    }
    setTrash((prev) =>
      [{ ...doc, deletedAt: Date.now() }, ...prev].slice(0, TRASH_LIMIT),
    );
  }, []);

  const restoreDocument = useCallback((id: string) => {
    const doc = latest.current.trash.find((d) => d.id === id);
    if (!doc) return;
    setTrash((prev) => prev.filter((d) => d.id !== id));
    const { deletedAt: _deletedAt, ...restored } = doc;
    setDocuments((prev) =>
      prev.some((d) => d.id === id) ? prev : [...prev, restored],
    );
    setActiveId(id);
  }, []);

  const purgeDocument = useCallback((id: string) => {
    setTrash((prev) => prev.filter((d) => d.id !== id));
  }, []);

  /** Removes every document, the trash, and stored preferences from this browser. */
  const clearAllLocalData = useCallback(() => {
    if (timer.current) clearTimeout(timer.current);
    dirty.current = false;
    for (const key of [DOCS_KEY, ACTIVE_KEY, TRASH_KEY, OLD_STORAGE_KEY]) {
      safeRemove(key);
    }
    const doc: MdDocument = {
      id: generateId(),
      name: "Untitled",
      content: "",
      updatedAt: Date.now(),
    };
    setTrash([]);
    setDocuments([doc]);
    setActiveId(doc.id);
  }, []);

  return {
    documents,
    activeId,
    setActiveId,
    trash,
    isInitialized,
    status,
    flush,
    setContent,
    createDocument,
    renameDocument,
    duplicateDocument,
    deleteDocument,
    restoreDocument,
    purgeDocument,
    clearAllLocalData,
  };
}
