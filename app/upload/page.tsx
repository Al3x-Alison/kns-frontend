"use client";

import { useCallback, useRef, useState } from "react";
import { DocumentsTable } from "@/components/upload/DocumentsTable";
import { FileUploadCard } from "@/components/upload/FileUploadCard";
import { UrlUploadCard } from "@/components/upload/UrlUploadCard";
import { ProtectedPage } from "@/components/layout/ProtectedPage";
import { pollDocumentStatus } from "@/lib/docPolling";
import type { DocumentItem, DocumentSourceType } from "@/lib/types";

// No backend GET /api/docs/list endpoint exists yet, so this table only
// reflects documents uploaded during the current browser session. A list
// endpoint would be needed for persistence across page reloads/sessions.
function UploadPageContent() {
  const [documents, setDocuments] = useState<DocumentItem[]>([]);
  const cancelPollers = useRef<Map<string, () => void>>(new Map());

  const handleUploaded = useCallback((documentId: string, name: string, type: DocumentSourceType) => {
    setDocuments((prev) => [
      {
        id: documentId,
        name,
        type,
        status: "processing",
        uploaded_at: new Date().toISOString(),
      },
      ...prev,
    ]);

    const cancel = pollDocumentStatus(documentId, (status) => {
      setDocuments((prev) =>
        prev.map((doc) => (doc.id === documentId ? { ...doc, status } : doc))
      );
      if (status === "done" || status === "failed") {
        cancelPollers.current.delete(documentId);
      }
    });
    cancelPollers.current.set(documentId, cancel);
  }, []);

  return (
    <div className="mx-auto max-w-5xl p-4 md:p-8">
      <h1 className="text-xl font-semibold text-zinc-50">Upload documents</h1>
      <p className="mt-1 text-sm text-zinc-500">
        Add knowledge base content via file upload or website ingestion.
      </p>

      <div className="mt-6 grid gap-4 md:grid-cols-2">
        <FileUploadCard
          onUploaded={(id, name) => handleUploaded(id, name, "file")}
        />
        <UrlUploadCard
          onUploaded={(id, url) => handleUploaded(id, url, "url")}
        />
      </div>

      <div className="mt-8">
        <h2 className="mb-3 text-sm font-semibold text-zinc-200">
          Documents this session
        </h2>
        <DocumentsTable documents={documents} />
      </div>
    </div>
  );
}

export default function UploadPage() {
  return (
    <ProtectedPage allowedRoles={["admin", "uploader"]}>
      <UploadPageContent />
    </ProtectedPage>
  );
}
