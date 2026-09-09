"use client";

import { useRef, useState } from "react";
import { apiErrorMessage, apiFetch } from "@/lib/api";
import { AlertCircleIcon, CloudUploadIcon, FileIcon } from "@/components/ui/icons";

const ACCEPTED_EXTENSIONS = ".pdf,.docx,.doc,.xlsx,.xls";

export function FileUploadCard({
  companyId,
  companyName,
  onUploaded,
}: {
  companyId: string | null;
  companyName?: string;
  onUploaded: (documentId: string, title: string, sourceType: string) => void;
}) {
  const [file, setFile] = useState<File | null>(null);
  const [dragging, setDragging] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  const disabled = !companyId;

  function pickFile(f: File | null | undefined) {
    if (!f) return;
    setError("");
    setFile(f);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!file || uploading || !companyId) return;

    setError("");
    setUploading(true);
    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("company_id", companyId);
      formData.append("title", file.name);
      const data = await apiFetch("/api/docs/upload/file", {
        method: "POST",
        body: formData,
      });
      const documentId = data?.document_id ?? data?.id;
      if (!documentId) throw new Error("Upload succeeded but no document_id was returned.");
      onUploaded(documentId, data?.title ?? file.name, data?.source_type ?? "file");
      setFile(null);
      if (inputRef.current) inputRef.current.value = "";
    } catch (err) {
      setError(apiErrorMessage(err));
    } finally {
      setUploading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="rounded-xl border border-border bg-surface p-5">
      <h3 className="text-sm font-semibold text-foreground">Upload a file</h3>
      <p className="mt-1 text-xs text-foreground-muted">PDF, DOC, DOCX, XLS, or XLSX</p>

      <label
        htmlFor="file-upload-input"
        onDragOver={(e) => {
          e.preventDefault();
          if (!disabled) setDragging(true);
        }}
        onDragLeave={() => setDragging(false)}
        onDrop={(e) => {
          e.preventDefault();
          setDragging(false);
          if (!disabled) pickFile(e.dataTransfer.files?.[0]);
        }}
        className={`mt-4 flex flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed px-4 py-8 text-center transition-colors ${
          disabled
            ? "cursor-not-allowed border-border bg-surface-secondary/40 opacity-60"
            : dragging
              ? "cursor-pointer border-accent bg-accent-soft"
              : "cursor-pointer border-border-strong hover:border-accent hover:bg-surface-secondary"
        }`}
      >
        {file ? (
          <>
            <FileIcon className="h-6 w-6 text-accent-text" />
            <span className="max-w-full truncate text-sm font-medium text-foreground">{file.name}</span>
            <span className="text-xs text-foreground-subtle">Click or drop to replace</span>
          </>
        ) : (
          <>
            <CloudUploadIcon className="h-6 w-6 text-foreground-subtle" />
            <span className="text-sm font-medium text-foreground">Drag and drop a file, or click to browse</span>
            <span className="text-xs text-foreground-subtle">{ACCEPTED_EXTENSIONS.replaceAll(",", ", ")}</span>
          </>
        )}
        <input
          id="file-upload-input"
          ref={inputRef}
          type="file"
          disabled={disabled}
          accept={ACCEPTED_EXTENSIONS}
          onChange={(e) => pickFile(e.target.files?.[0])}
          className="sr-only"
        />
      </label>

      {!disabled && file && (
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
        disabled={!file || uploading || disabled}
        className="mt-4 flex h-10 w-full items-center justify-center rounded-lg bg-accent text-sm font-medium text-accent-foreground transition-colors hover:bg-accent-hover disabled:cursor-not-allowed disabled:opacity-50"
      >
        {uploading ? "Uploading…" : disabled ? "Select a company first" : "Upload file"}
      </button>
    </form>
  );
}
