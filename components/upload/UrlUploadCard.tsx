"use client";

import { useState } from "react";
import { apiErrorMessage, apiFetch } from "@/lib/api";
import { AlertCircleIcon, LinkIcon } from "@/components/ui/icons";

export function UrlUploadCard({
  companyId,
  companyName,
  onUploaded,
}: {
  companyId: string | null;
  companyName?: string;
  onUploaded: (documentId: string, title: string, sourceType: string) => void;
}) {
  const [url, setUrl] = useState("");
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");

  const disabled = !companyId;

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const trimmed = url.trim();
    if (!trimmed || uploading || !companyId) return;

    setError("");
    setUploading(true);
    try {
      const data = await apiFetch("/api/docs/upload/url", {
        method: "POST",
        body: JSON.stringify({ url: trimmed, company_id: companyId }),
      });
      const documentId = data?.document_id ?? data?.id;
      if (!documentId) throw new Error("Upload succeeded but no document_id was returned.");
      onUploaded(documentId, data?.title ?? trimmed, data?.source_type ?? "url");
      setUrl("");
    } catch (err) {
      setError(apiErrorMessage(err));
    } finally {
      setUploading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="rounded-xl border border-border bg-surface p-5">
      <h3 className="flex items-center gap-1.5 text-sm font-semibold text-foreground">
        <LinkIcon className="h-4 w-4 text-foreground-subtle" />
        Ingest a website
      </h3>
      <p className="mt-1 text-xs text-foreground-muted">Enter a URL to crawl and ingest</p>

      <label htmlFor="url-upload-input" className="sr-only">
        Website URL
      </label>
      <input
        id="url-upload-input"
        type="url"
        required
        disabled={disabled}
        placeholder="https://example.com/docs"
        value={url}
        onChange={(e) => setUrl(e.target.value)}
        className="mt-4 w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground placeholder:text-foreground-subtle focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent disabled:cursor-not-allowed disabled:opacity-60"
      />

      {!disabled && url.trim() && (
        <p className="mt-3 text-xs text-foreground-muted">
          Ready to upload for: <span className="font-medium text-foreground">{companyName}</span>
        </p>
      )}

      {error && (
        <p className="mt-2 flex items-center gap-1.5 text-xs text-danger">
          <AlertCircleIcon className="h-3.5 w-3.5 shrink-0" />
          {error}
        </p>
      )}

      <button
        type="submit"
        disabled={!url.trim() || uploading || disabled}
        className="mt-4 flex h-10 w-full items-center justify-center rounded-lg bg-accent text-sm font-medium text-accent-foreground transition-colors hover:bg-accent-hover disabled:cursor-not-allowed disabled:opacity-50"
      >
        {uploading ? "Submitting…" : disabled ? "Select a company first" : "Ingest URL"}
      </button>
    </form>
  );
}
