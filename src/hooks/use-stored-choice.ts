import { useCallback, useSyncExternalStore } from "react";

import { store } from "@/lib/storage";

const EVENT = "stored-choice";

/** Listens for a saved choice changing, in this tab or another */
export const subscribeStored = (onChange: () => void) => {
  window.addEventListener("storage", onChange);
  window.addEventListener(EVENT, onChange);

  return () => {
    window.removeEventListener("storage", onChange);
    window.removeEventListener(EVENT, onChange);
  };
};

/** Saves a choice, and tells every hook reading it in this tab */
export const saveStored = (key: string, value: string) => {
  store.set(key, value);
  window.dispatchEvent(new Event(EVENT));
};

/**
 * One of `options`, remembered in localStorage. Renders `fallback` on the
 * server and until hydration, then the saved value.
 */
export const useStoredChoice = <T extends string>(
  key: string,
  options: readonly T[],
  fallback: T
) => {
  const value = useSyncExternalStore(
    subscribeStored,
    () => options.find((o) => o === store.get(key)) ?? fallback,
    () => fallback
  );

  const set = useCallback((next: T) => saveStored(key, next), [key]);

  return [value, set] as const;
};
