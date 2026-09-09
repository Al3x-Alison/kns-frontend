import type { DocumentStatus } from "@/lib/types";

const STYLES: Record<string, string> = {
  done: "bg-emerald-500/15 text-emerald-400 border-emerald-500/30",
  processing: "bg-amber-500/15 text-amber-400 border-amber-500/30",
  failed: "bg-red-500/15 text-red-400 border-red-500/30",
};

export function StatusBadge({ status }: { status: DocumentStatus }) {
  const style = STYLES[status] ?? "bg-zinc-500/15 text-zinc-400 border-zinc-500/30";
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-xs font-medium capitalize ${style}`}
    >
      <span className="h-1.5 w-1.5 rounded-full bg-current" />
      {status}
    </span>
  );
}
