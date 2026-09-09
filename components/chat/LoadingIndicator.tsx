"use client";

import { useEffect, useState } from "react";

/**
 * No real streaming exists on POST /api/query/search — it's one blocking
 * JSON response after ~5s uncached / ~15ms cached. This fakes perceived
 * progress client-side with elapsed-time-scaled status phrases instead of
 * a generic spinner. Purely cosmetic; not a claim of real progress.
 */
export function LoadingIndicator({ companyLabel }: { companyLabel?: string }) {
  const [elapsed, setElapsed] = useState(0);

  useEffect(() => {
    const start = Date.now();
    const id = setInterval(() => setElapsed(Date.now() - start), 200);
    return () => clearInterval(id);
  }, []);

  const target = companyLabel ? `${companyLabel}'s knowledge base` : "the knowledge base";
  let phrase = `Checking ${target}…`;
  if (elapsed > 5000) phrase = "This one's taking a bit longer…";
  else if (elapsed > 2000) phrase = "Still thinking…";

  return (
    <div className="flex items-center gap-2.5 rounded-2xl border border-border bg-surface px-4 py-3 text-sm text-foreground-muted">
      <span className="flex gap-1">
        <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-accent [animation-delay:-0.3s]" />
        <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-accent [animation-delay:-0.15s]" />
        <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-accent" />
      </span>
      {phrase}
    </div>
  );
}
