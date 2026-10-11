import { existsSync } from "node:fs";
import path from "node:path";

import { describe, expect, it } from "vitest";

import {
  BASE_THEME,
  DEFAULT_THEME,
  THEME_ORDER,
  THEMES,
  themeVars,
} from "./themes";

const inPublic = (file: string) =>
  existsSync(path.join(process.cwd(), "public", file));

describe("THEMES", () => {
  it("offers twelve variations, each once, and not the base theme", () => {
    expect(THEME_ORDER).toHaveLength(12);
    expect(new Set(THEME_ORDER).size).toBe(12);
    expect(THEME_ORDER).not.toContain(BASE_THEME);
    expect(THEME_ORDER).toContain(DEFAULT_THEME);
  });

  it("gives every variation an animal and a flower that exist", () => {
    for (const id of THEME_ORDER) {
      const { animal, flower } = THEMES[id];
      expect(animal && inPublic(animal)).toBe(true);
      expect(flower && inPublic(flower)).toBe(true);
    }
  });

  it("knows its own id", () => {
    for (const [id, theme] of Object.entries(THEMES)) {
      expect(theme.id).toBe(id);
    }
  });
});

describe("themeVars", () => {
  it("fills the bar colours and darkens the body for the ground", () => {
    const vars = themeVars({
      ...THEMES[BASE_THEME],
      c: {
        alt: "#000000",
        body: "#646464",
        muted: "#000000",
        panel: "#000000",
      },
    });
    expect(vars["--bar"]).toBe("#3b4a42");
    expect(vars["--bar-grid"]).toBe("#4e6152");
    // 0x64 × 0.92 = 92 = 0x5c
    expect(vars["--ground"]).toBe("#5c5c5c");
  });

  it("uses a theme's own ground when it has one", () => {
    const vars = themeVars({
      ...THEMES[BASE_THEME],
      c: { ...THEMES[BASE_THEME].c, ground: "#123456" },
    });
    expect(vars["--ground"]).toBe("#123456");
  });
});
