export type ThemeMode = "light" | "dark";

const STORAGE_KEY = "wisabi_theme";

export function getStoredTheme(): ThemeMode | null {
  if (typeof window === "undefined") return null;
  const value = localStorage.getItem(STORAGE_KEY);
  return value === "light" || value === "dark" ? value : null;
}

export function getSystemTheme(): ThemeMode {
  if (typeof window === "undefined") return "light";
  return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
}

export function getCurrentTheme(): ThemeMode {
  return getStoredTheme() ?? getSystemTheme();
}

export function applyTheme(mode: ThemeMode) {
  document.documentElement.classList.toggle("dark", mode === "dark");
  document.documentElement.setAttribute("data-theme", mode);
}

export function setStoredTheme(mode: ThemeMode) {
  localStorage.setItem(STORAGE_KEY, mode);
  applyTheme(mode);
}

/** Inline, string form of getCurrentTheme+applyTheme for a beforeInteractive
 * boot script — keeps the first paint from flashing the wrong theme. */
export const THEME_BOOT_SCRIPT = `(function(){try{var s=localStorage.getItem('${STORAGE_KEY}');var d=s?s==='dark':window.matchMedia('(prefers-color-scheme: dark)').matches;var r=document.documentElement;if(d)r.classList.add('dark');r.setAttribute('data-theme',d?'dark':'light');}catch(e){}})();`;
