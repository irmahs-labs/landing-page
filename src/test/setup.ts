import { cleanup } from "@testing-library/react";
import { afterEach, beforeEach, vi } from "vitest";

/** Set before a render to pretend the visitor asked for reduced motion */
export const motion = { reduced: false };

// jsdom has no matchMedia: answer media queries from `motion`, else no match
beforeEach(() => {
  motion.reduced = false;
  vi.stubGlobal("matchMedia", (query: string) => ({
    addEventListener: vi.fn(),
    matches: query.includes("prefers-reduced-motion") && motion.reduced,
    media: query,
    removeEventListener: vi.fn(),
  }));
});

afterEach(() => {
  cleanup();
  localStorage.clear();
  vi.unstubAllGlobals();
  vi.unstubAllEnvs();
  vi.restoreAllMocks();
  vi.useRealTimers();
});
