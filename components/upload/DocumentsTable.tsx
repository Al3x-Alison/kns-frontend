import type { DocumentItem } from "@/lib/types";
import { StatusBadge } from "./StatusBadge";

export function DocumentsTable({ documents }: { documents: DocumentItem[] }) {
  if (documents.length === 0) {
    return (
      <div className="rounded-xl border border-dashed border-zinc-800 p-10 text-center text-sm text-zinc-500">
        No documents uploaded in this session yet.
      </div>
    );
  }

  return (
    <div className="overflow-x-auto rounded-xl border border-zinc-800">
      <table className="w-full text-left text-sm">
        <thead>
          <tr className="border-b border-zinc-800 bg-zinc-900/60 text-xs uppercase tracking-wide text-zinc-500">
            <th className="px-4 py-3 font-medium">Name / URL</th>
            <th className="px-4 py-3 font-medium">Type</th>
            <th className="px-4 py-3 font-medium">Status</th>
            <th className="px-4 py-3 font-medium">Uploaded</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-zinc-800">
          {documents.map((doc) => (
            <tr key={doc.id} className="text-zinc-200">
              <td className="max-w-xs truncate px-4 py-3" title={doc.name}>
                {doc.name}
              </td>
              <td className="px-4 py-3 capitalize text-zinc-400">{doc.type}</td>
              <td className="px-4 py-3">
                <StatusBadge status={doc.status} />
              </td>
              <td className="px-4 py-3 text-zinc-400">
                {new Date(doc.uploaded_at).toLocaleString()}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
