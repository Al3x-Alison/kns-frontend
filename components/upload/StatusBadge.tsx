import type { DocumentStatus } from "@/lib/types";

const STYLES: Record<string, string> = {
  done: "border-success-soft-border bg-success-soft text-success",
  processing: "border-warning-soft-border bg-warning-soft text-warning",
  pending: "border-warning-soft-border bg-warning-soft text-warning",
  failed: "border-danger-soft-border bg-danger-soft text-danger",
};

export function StatusBadge({ status }: { status: DocumentStatus }) {
  const style = STYLES[status] ?? "border-border-strong bg-surface-secondary text-foreground-muted";
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-xs font-medium capitalize ${style}`}
    >
      <span className="h-1.5 w-1.5 rounded-full bg-current" />
      {status}
    </span>
  );
}
