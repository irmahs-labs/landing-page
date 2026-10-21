"use client";

import { useLayoutEffect } from "react";

import { chooseTheme, restoreTheme, useTheme } from "@/lib/theme";

// Line glyphs on a 24 × 24 grid, drawn in the pill's text colour
const GLYPHS = {
  dark: ["M20 14.5A8.5 8.5 0 1 1 9.5 4a7 7 0 0 0 10.5 10.5z"],
  light: [
    "M12 8a4 4 0 1 0 0 8 4 4 0 1 0 0-8z",
    "M12 2v2M12 20v2M2 12h2M20 12h2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4",
  ],
} as const;

/** The header's sun/moon pill: names and shows the theme it switches to */
export const ThemeToggle = () => {
  const theme = useTheme();
  const next = theme === "dark" ? "light" : "dark";

  useLayoutEffect(restoreTheme, []);

  return (
    <button
      aria-label={`Switch to ${next} mode`}
      className="btn btn--pill"
      onClick={() => chooseTheme(next)}
      type="button"
    >
      <svg
        aria-hidden="true"
        fill="none"
        height="16"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2.4"
        viewBox="0 0 24 24"
        width="16"
      >
        {GLYPHS[next].map((d) => (
          <path d={d} key={d} />
        ))}
      </svg>
      {next}
    </button>
  );
};
