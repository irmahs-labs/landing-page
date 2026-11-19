"use client";

import { useLayoutEffect } from "react";

import { useCopy } from "@/lib/language";
import { chooseTheme, restoreTheme, useTheme } from "@/lib/theme";

const COPY = {
  en: { label: "Light mode" },
  fr: { label: "Mode clair" },
};

// Line glyphs on a 24 × 24 grid, drawn in the knob's colour
const GLYPHS = {
  dark: ["M20 14.5A8.5 8.5 0 1 1 9.5 4a7 7 0 0 0 10.5 10.5z"],
  light: [
    "M12 8a4 4 0 1 0 0 8 4 4 0 1 0 0-8z",
    "M12 2v2M12 20v2M2 12h2M20 12h2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4",
  ],
} as const;

const Glyph = ({ name }: { name: keyof typeof GLYPHS }) => (
  <svg
    aria-hidden="true"
    className={`theme-switch__glyph theme-switch__glyph--${name}`}
    fill="none"
    height="16"
    stroke="currentColor"
    strokeLinecap="round"
    strokeLinejoin="round"
    strokeWidth="2.4"
    viewBox="0 0 24 24"
    width="16"
  >
    {GLYPHS[name].map((d) => (
      <path d={d} key={d} />
    ))}
  </svg>
);

/**
 * The header's light switch: on is light mode, the knob on the left with the
 * sun in it; off is dark mode, the knob on the right with the moon
 */
export const ThemeToggle = () => {
  const theme = useTheme();
  const on = theme !== "dark";
  const t = useCopy(COPY);

  useLayoutEffect(restoreTheme, []);

  return (
    <button
      aria-checked={on}
      aria-label={t.label}
      className="theme-switch"
      onClick={() => chooseTheme(on ? "dark" : "light")}
      role="switch"
      type="button"
    >
      <span className="theme-switch__knob">
        <Glyph name={on ? "light" : "dark"} />
      </span>
    </button>
  );
};
