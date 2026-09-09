"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { DocumentsTable } from "@/components/upload/DocumentsTable";
import { FileUploadCard } from "@/components/upload/FileUploadCard";
import { UrlUploadCard } from "@/components/upload/UrlUploadCard";
import { ProtectedPage } from "@/components/layout/ProtectedPage";
import { CompanySelect } from "@/components/company/CompanySelect";
import { useCompanies } from "@/hooks/useCompanies";
import { pollDocumentStatus } from "@/lib/docPolling";
import { apiErrorMessage, apiFetch } from "@/lib/api";
import type { DocumentItem } from "@/lib/types";

const LAST_COMPANY_KEY = "wisabi_upload_company_id";

function UploadPageContent() {
  const { companies, loading: companiesLoading, error: companiesError } = useCompanies();
  const [companyId, setCompanyId] = useState<string | null>(null);
  const [documents, setDocuments] = useState<DocumentItem[]>([]);
  const [docsLoading, setDocsLoading] = useState(true);
  const [docsError, setDocsError] = useState("");
  const cancelPollers = useRef<Map<string, () => void>>(new Map());

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setCompanyId(localStorage.getItem(LAST_COMPANY_KEY));
  }, []);

  function selectCompany(id: string | null) {
    setCompanyId(id);
    if (id) localStorage.setItem(LAST_COMPANY_KEY, id);
    else localStorage.removeItem(LAST_COMPANY_KEY);
  }

  useEffect(() => {
    let cancelled = false;
    apiFetch("/api/docs/documents?limit=50&offset=0")
      .then((data) => {
        if (cancelled) return;
        const docs: DocumentItem[] = Array.isArray(data?.documents) ? data.documents : [];
        setDocuments(docs);
      })
      .catch((err) => {
        if (!cancelled) setDocsError(apiErrorMessage(err));
      })
      .finally(() => {
        if (!cancelled) setDocsLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    const pollers = cancelPollers.current;
    return () => {
      pollers.forEach((cancel) => cancel());
      pollers.clear();
    };
  }, []);

  const handleUploaded = useCallback((documentId: string, title: string, sourceType: string) => {
    setDocuments((prev) => [{ id: documentId, title, type: sourceType, status: "pending" }, ...prev]);

    const cancel = pollDocumentStatus(documentId, (status) => {
      setDocuments((prev) => prev.map((doc) => (doc.id === documentId ? { ...doc, status } : doc)));
      if (status === "done" || status === "failed") {
        cancelPollers.current.delete(documentId);
        apiFetch(`/api/docs/status/${documentId}`)
          .then((detail) => {
            setDocuments((prev) =>
              prev.map((doc) =>
                doc.id === documentId
                  ? {
                      ...doc,
                      title: detail?.title ?? doc.title,
                      type: detail?.source_type ?? doc.type,
                      chunk_count: detail?.chunk_count ?? doc.chunk_count,
                      error: detail?.error ?? null,
                    }
                  : doc
              )
            );
          })
          .catch(() => {});
      }
    });
    cancelPollers.current.set(documentId, cancel);
  }, []);

  const selectedCompany = companies.find((c) => c.id === companyId);

  return (
    <div className="mx-auto max-w-5xl p-4 md:p-8">
      <h1 className="text-xl font-semibold text-foreground">Upload documents</h1>
      <p className="mt-1 text-sm text-foreground-muted">
        Add knowledge base content via file upload or website ingestion.
      </p>

      <div className="mt-6 max-w-xs">
        <CompanySelect
          id="upload-company"
          label="Company"
          companies={companies}
          value={companyId}
          onChange={selectCompany}
          loading={companiesLoading}
          error={companiesError}
          required
        />
      </div>

      <div className="mt-4 grid gap-4 md:grid-cols-2">
        <FileUploadCard companyId={companyId} companyName={selectedCompany?.name} onUploaded={handleUploaded} />
        <UrlUploadCard companyId={companyId} companyName={selectedCompany?.name} onUploaded={handleUploaded} />
      </div>

      <div className="mt-8">
        <h2 className="mb-3 text-sm font-semibold text-foreground">Documents</h2>
        <DocumentsTable documents={documents} loading={docsLoading} error={docsError} />
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
