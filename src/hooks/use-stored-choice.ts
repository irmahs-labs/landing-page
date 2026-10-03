import { useCallback, useSyncExternalStore } from "react";

import { store } from "@/lib/storage";

const EVENT = "stored-choice";

const subscribe = (onChange: () => void) => {
  window.addEventListener("storage", onChange);
  window.addEventListener(EVENT, onChange);
  return () => {
    window.removeEventListener("storage", onChange);
    window.removeEventListener(EVENT, onChange);
  };
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
    subscribe,
    () => options.find((o) => o === store.get(key)) ?? fallback,
    () => fallback
  );
  const set = useCallback(
    (next: T) => {
      store.set(key, next);
      window.dispatchEvent(new Event(EVENT));
    },
    [key]
  );
  return [value, set] as const;
};
