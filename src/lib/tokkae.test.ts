import { describe, expect, it } from "vitest";

import { ANIMS, BOWL, FRAMES, GRID_H, GRID_W, HEART, runsOf } from "./tokkae";

// Every colour key the palette knows, plus '.' for empty
const KEYS = /^[.OWbdgkprtwxz]+$/u;

describe("Tokkae's frames", () => {
  it("are all one 18 × 17 grid of known colours", () => {
    expect(FRAMES.length).toBeGreaterThan(0);
    for (const rows of FRAMES) {
      expect(rows).toHaveLength(GRID_H);
      for (const row of rows) {
        expect(row).toHaveLength(GRID_W);
        expect(row).toMatch(KEYS);
      }
    }
  });

  it("are each drawn once, however many animations use them", () => {
    const keys = FRAMES.map((rows) => rows.join("/"));
    expect(new Set(keys).size).toBe(keys.length);
  });

  it("only point animations at frames that exist", () => {
    for (const ids of Object.values(ANIMS)) {
      expect(ids.length).toBeGreaterThan(0);
      for (const id of ids) {
        expect(FRAMES[id]).toBeDefined();
      }
    }
  });

  it("have a mouthless Tokkae singing and crying", () => {
    // The standing sprite has no mouth; row 7, under the eyes, stays green
    for (const id of [...ANIMS.sing, ...ANIMS.cry]) {
      expect(FRAMES[id]?.[7]).not.toMatch(/g[kt]g/u);
    }
  });

  it("show a red ! when surprised", () => {
    for (const id of ANIMS.alert) {
      expect(FRAMES[id]?.[0]?.[13]).toBe("r");
    }
  });
});

describe("props", () => {
  it("draws the heart and the bowl from known colours", () => {
    for (const row of [...HEART, ...BOWL]) {
      expect(row).toMatch(KEYS);
    }
  });
});

describe("runsOf", () => {
  it("merges each row's same-coloured pixels into one rect", () => {
    expect(runsOf(["rr.w", "..ww"])).toEqual([
      { color: "#e0574b", w: 2, x: 0, y: 0 },
      { color: "#4a7fc0", w: 1, x: 3, y: 0 },
      { color: "#4a7fc0", w: 2, x: 2, y: 1 },
    ]);
  });
});
