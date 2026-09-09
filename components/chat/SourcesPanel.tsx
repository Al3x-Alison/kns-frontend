"use client";

import { useState } from "react";
import type { SourceDoc } from "@/lib/types";
import { ChevronRightIcon, FileIcon } from "@/components/ui/icons";

export function SourcesPanel({ sources }: { sources: SourceDoc[] }) {
  const [open, setOpen] = useState(false);
  if (!sources.length) return null;

  return (
    <div className="mt-2.5 border-t border-border pt-2.5">
      <button
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        className="flex items-center gap-1 text-xs font-medium text-foreground-muted hover:text-foreground"
      >
        <ChevronRightIcon className={`h-3.5 w-3.5 transition-transform ${open ? "rotate-90" : ""}`} />
        Sources ({sources.length})
      </button>

      {open && (
        <div className="mt-2 space-y-2">
          {sources.map((source, i) => (
            <div
              key={`${source.document_id}-${i}`}
              className="rounded-lg border border-border bg-surface-secondary p-3 text-xs"
            >
              <div className="mb-1.5 flex items-center justify-between gap-2">
                <span className="flex min-w-0 items-center gap-1.5 font-medium text-foreground">
                  <FileIcon className="h-3.5 w-3.5 shrink-0 text-foreground-subtle" />
                  <span className="truncate">{source.title}</span>
                </span>
                <span className="shrink-0 rounded-full bg-surface px-2 py-0.5 uppercase tracking-wide text-foreground-subtle">
                  {source.source_type}
                </span>
              </div>

              <div className="mb-1.5 flex items-center gap-2">
                <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-surface">
                  <div
                    className="h-full rounded-full bg-accent"
                    style={{ width: `${Math.round(Math.min(1, Math.max(0, source.score)) * 100)}%` }}
                  />
                </div>
                <span className="shrink-0 text-foreground-subtle">
                  {Math.round(Math.min(1, Math.max(0, source.score)) * 100)}% match
                </span>
              </div>

              {source.snippet && <p className="text-foreground-muted">{source.snippet}</p>}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
