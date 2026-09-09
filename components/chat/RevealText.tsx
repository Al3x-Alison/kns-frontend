"use client";

import { useEffect, useMemo, useState } from "react";

/**
 * Client-side illusion of progressive reveal for an answer that already
 * arrived in full (the backend has no streaming). Skipped entirely for
 * cache hits (~15ms) so fast answers don't feel artificially padded.
 */
export function RevealText({ text, instant, className }: { text: string; instant?: boolean; className?: string }) {
  const words = useMemo(() => text.split(/(\s+)/), [text]);
  const [count, setCount] = useState(() => (instant ? words.length : 0));

  useEffect(() => {
    if (instant || words.length === 0) return;
    const totalMs = Math.min(900, Math.max(150, words.length * 18));
    const stepMs = totalMs / words.length;
    let i = 0;
    const id = setInterval(() => {
      i += 1;
      setCount(i);
      if (i >= words.length) clearInterval(id);
    }, stepMs);
    return () => clearInterval(id);
  }, [instant, words]);

  return <p className={`whitespace-pre-wrap ${className ?? ""}`}>{words.slice(0, count).join("")}</p>;
}
