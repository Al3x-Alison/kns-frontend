import { apiFetch } from "./api";
import type { DocumentStatus } from "./types";

/**
 * Polls GET /api/docs/status/{id} every `intervalMs` until the backend
 * reports "done" or "failed". Returns a cancel function for cleanup.
 */
export function pollDocumentStatus(
  id: string,
  onUpdate: (status: DocumentStatus) => void,
  intervalMs = 3000
) {
  let cancelled = false;

  async function tick() {
    if (cancelled) return;
    try {
      const data = await apiFetch(`/api/docs/status/${id}`);
      const status: DocumentStatus = data?.status ?? "processing";
      if (cancelled) return;
      onUpdate(status);
      if (status === "done" || status === "failed") return;
    } catch {
      if (!cancelled) onUpdate("failed");
      return;
    }
    if (!cancelled) setTimeout(tick, intervalMs);
  }

  tick();
  return () => {
    cancelled = true;
  };
}
