import type { DocumentItem } from "@/lib/types";
import { StatusBadge } from "./StatusBadge";
import { AlertCircleIcon } from "@/components/ui/icons";

function formatDate(value?: string) {
  if (!value) return "—";
  const d = new Date(value);
  return Number.isNaN(d.getTime()) ? value : d.toLocaleString();
}

export function DocumentsTable({
  documents,
  loading,
  error,
}: {
  documents: DocumentItem[];
  loading?: boolean;
  error?: string;
}) {
  if (loading) {
    return (
      <div className="space-y-2">
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="h-12 animate-pulse rounded-xl bg-surface-secondary" />
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center gap-2 rounded-xl border border-danger-soft-border bg-danger-soft p-4 text-sm text-danger">
        <AlertCircleIcon className="h-4 w-4 shrink-0" />
        {error}
      </div>
    );
  }

  if (documents.length === 0) {
    return (
      <div className="rounded-xl border border-dashed border-border p-10 text-center text-sm text-foreground-muted">
        No documents uploaded yet.
      </div>
    );
  }

  return (
    <div className="overflow-x-auto rounded-xl border border-border">
      <table className="w-full text-left text-sm">
        <thead>
          <tr className="border-b border-border bg-surface-secondary text-xs uppercase tracking-wide text-foreground-muted">
            <th className="px-4 py-3 font-medium">Title</th>
            <th className="px-4 py-3 font-medium">Type</th>
            <th className="px-4 py-3 font-medium">Status</th>
            <th className="px-4 py-3 font-medium">Chunks</th>
            <th className="px-4 py-3 font-medium">Created</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-border">
          {documents.map((doc) => (
            <tr key={doc.id} className="text-foreground">
              <td className="max-w-xs truncate px-4 py-3" title={doc.title}>
                {doc.title}
              </td>
              <td className="px-4 py-3 uppercase text-foreground-muted">{doc.type}</td>
              <td className="px-4 py-3">
                <StatusBadge status={doc.status} />
              </td>
              <td className="px-4 py-3 text-foreground-muted">{doc.chunk_count ?? "—"}</td>
              <td className="px-4 py-3 text-foreground-muted">{formatDate(doc.created)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
