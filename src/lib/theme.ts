import { useSyncExternalStore } from "react";

import { store } from "@/lib/storage";

/**
 * Light or Dark Matcha. The page always carries one on <html data-theme>:
 * the inline script in the root layout sets it before the first paint, from
 * the visitor's saved choice or else their device's setting. Until they pick
 * one with the toggle, the page keeps following the device.
 */
export type Theme = "light" | "dark";

const STORAGE_KEY = "theme";

const darkQuery = () => window.matchMedia?.("(prefers-color-scheme: dark)");

const savedTheme = (): Theme | null => {
  const saved = store.get(STORAGE_KEY);

  return saved === "light" || saved === "dark" ? saved : null;
};

/** The saved choice, or else the device's setting */
export const preferredTheme = (): Theme => {
  const saved = savedTheme();

  if (saved) {
    return saved;
  }

  return darkQuery()?.matches ? "dark" : "light";
};

const currentTheme = (): Theme =>
  document.documentElement.dataset.theme === "dark" ? "dark" : "light";

// The server can't know the visitor's theme; the inline script fixes the page
// before it paints, and the toggle catches up as it hydrates
const serverTheme = (): Theme => "light";

const listeners = new Set<() => void>();

const apply = (theme: Theme) => {
  document.documentElement.dataset.theme = theme;

  for (const listener of listeners) {
    listener();
  }
};

// The device setting only leads while no choice has been saved
const followDevice = (event: MediaQueryListEvent) => {
  if (savedTheme() === null) {
    apply(event.matches ? "dark" : "light");
  }
};

const subscribe = (onChange: () => void) => {
  listeners.add(onChange);

  const query = darkQuery();

  query?.addEventListener("change", followDevice);

  return () => {
    listeners.delete(onChange);
    query?.removeEventListener("change", followDevice);
  };
};

export const useTheme = () =>
  useSyncExternalStore(subscribe, currentTheme, serverTheme);

/**
 * Puts the theme back on <html> if it went missing: in development, React's
 * Strict Mode remount resets <html> to the attributes the layout gives it,
 * dropping the one the inline script set. Does nothing otherwise.
 */
export const restoreTheme = () => {
  if (!document.documentElement.dataset.theme) {
    apply(preferredTheme());
  }
};

/** Switches the page and remembers the choice in this browser */
export const chooseTheme = (theme: Theme) => {
  // If it isn't saved, the page still switches for this visit
  store.set(STORAGE_KEY, theme);
  apply(theme);
};
