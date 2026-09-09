"use client";

import { useState } from "react";
import { apiErrorMessage, apiFetch } from "@/lib/api";

export function UrlUploadCard({
  onUploaded,
}: {
  onUploaded: (documentId: string, url: string) => void;
}) {
  const [url, setUrl] = useState("");
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const trimmed = url.trim();
    if (!trimmed || uploading) return;

    setError("");
    setUploading(true);
    try {
      const data = await apiFetch("/api/docs/upload/url", {
        method: "POST",
        body: JSON.stringify({ url: trimmed }),
      });
      const documentId = data?.document_id ?? data?.id;
      if (!documentId) throw new Error("Upload succeeded but no document_id was returned.");
      onUploaded(documentId, trimmed);
      setUrl("");
    } catch (err) {
      setError(apiErrorMessage(err));
    } finally {
      setUploading(false);
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="rounded-xl border border-zinc-800 bg-zinc-900/60 p-5"
    >
      <h3 className="text-sm font-semibold text-zinc-100">Ingest a website</h3>
      <p className="mt-1 text-xs text-zinc-500">Enter a URL to crawl and ingest</p>

      <input
        type="url"
        required
        placeholder="https://example.com/docs"
        value={url}
        onChange={(e) => setUrl(e.target.value)}
        className="mt-4 w-full rounded-lg border border-zinc-800 bg-zinc-900 px-3 py-2 text-sm text-zinc-100 placeholder:text-zinc-600 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
      />

      {error && <p className="mt-2 text-xs text-red-400">{error}</p>}

      <button
        type="submit"
        disabled={!url.trim() || uploading}
        className="mt-4 flex h-10 w-full items-center justify-center rounded-lg bg-indigo-500 text-sm font-medium text-white transition-colors hover:bg-indigo-400 disabled:cursor-not-allowed disabled:opacity-50"
      >
        {uploading ? "Submitting…" : "Ingest URL"}
      </button>
    </form>
  );
}
