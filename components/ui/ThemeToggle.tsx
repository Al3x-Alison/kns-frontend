"use client";

import { useEffect, useState } from "react";
import { getCurrentTheme, setStoredTheme, type ThemeMode } from "@/lib/theme";
import { MoonIcon, SunIcon } from "./icons";

export function ThemeToggle() {
  const [mode, setMode] = useState<ThemeMode | null>(null);

  useEffect(() => {
    // Read the class the boot script already applied — first client read of
    // theme state, not a derive-from-props cascade.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMode(getCurrentTheme());
  }, []);

  function toggle() {
    const next: ThemeMode = mode === "dark" ? "light" : "dark";
    setMode(next);
    setStoredTheme(next);
  }

  return (
    <button
      type="button"
      onClick={toggle}
      aria-label={mode === "dark" ? "Switch to light mode" : "Switch to dark mode"}
      className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-border text-foreground-muted transition-colors hover:bg-surface-secondary hover:text-foreground"
    >
      {mode === null ? null : mode === "dark" ? (
        <SunIcon className="h-4.5 w-4.5" />
      ) : (
        <MoonIcon className="h-4.5 w-4.5" />
      )}
    </button>
  );
}
