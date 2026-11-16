import { useSyncExternalStore } from "react";

import { serverSnapshot, snapshot, subscribe } from "./language-state";
import type { Language } from "./language-state";

export * from "./language-state";

export const useLanguage = () =>
  useSyncExternalStore(subscribe, snapshot, serverSnapshot);

/** The copy for the page's language, from one object per language */
export const useCopy = <T>(copy: Record<Language, T>): T => copy[useLanguage()];
