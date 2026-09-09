"use client";

import { useRef, useState } from "react";
import { apiErrorMessage, apiFetch } from "@/lib/api";

const ACCEPTED_EXTENSIONS = ".pdf,.docx,.xlsx";

export function FileUploadCard({
  onUploaded,
}: {
  onUploaded: (documentId: string, filename: string) => void;
}) {
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!file || uploading) return;

    setError("");
    setUploading(true);
    try {
      const formData = new FormData();
      formData.append("file", file);
      const data = await apiFetch("/api/docs/upload/file", {
        method: "POST",
        body: formData,
      });
      const documentId = data?.document_id ?? data?.id;
      if (!documentId) throw new Error("Upload succeeded but no document_id was returned.");
      onUploaded(documentId, file.name);
      setFile(null);
      if (inputRef.current) inputRef.current.value = "";
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
      <h3 className="text-sm font-semibold text-zinc-100">Upload a file</h3>
      <p className="mt-1 text-xs text-zinc-500">PDF, DOCX, or XLSX</p>

      <input
        ref={inputRef}
        type="file"
        accept={ACCEPTED_EXTENSIONS}
        onChange={(e) => setFile(e.target.files?.[0] ?? null)}
        className="mt-4 block w-full text-sm text-zinc-300 file:mr-4 file:rounded-lg file:border-0 file:bg-zinc-800 file:px-3 file:py-2 file:text-sm file:font-medium file:text-zinc-200 hover:file:bg-zinc-700"
      />

      {error && <p className="mt-2 text-xs text-red-400">{error}</p>}

      <button
        type="submit"
        disabled={!file || uploading}
        className="mt-4 flex h-10 w-full items-center justify-center rounded-lg bg-indigo-500 text-sm font-medium text-white transition-colors hover:bg-indigo-400 disabled:cursor-not-allowed disabled:opacity-50"
      >
        {uploading ? "Uploading…" : "Upload file"}
      </button>
    </form>
  );
}
