import { describe, expect, it } from "vitest";

import { COQ_ANIMS, COQ_FRAMES, coqAnim, coqFrame } from "./coq";
import { GRID_H, GRID_W } from "./tokkae";

// Coq's colours, all Tokkae's: feathers, wing, comb, tail, beak, eye, cheek
const KEYS = /^[.WbrwOkp]+$/u;

describe("Coq's frames", () => {
  it("are each one 18 × 17 frame, like Tokkae's, in Tokkae's colours", () => {
    for (const rows of COQ_FRAMES) {
      expect(rows).toHaveLength(GRID_H);

      for (const row of rows) {
        expect(row).toHaveLength(GRID_W);
        expect(row).toMatch(KEYS);
      }
    }
  });

  it("are each drawn once", () => {
    const keys = COQ_FRAMES.map((rows) => rows.join("/"));
    expect(new Set(keys).size).toBe(keys.length);
  });

  it("play the design system's animations, at its frame times", () => {
    expect(COQ_ANIMS.idle.seq).toHaveLength(22);
    expect(COQ_ANIMS.walk.seq).toHaveLength(2);
    expect(COQ_ANIMS.peck.seq).toHaveLength(6);
    expect(COQ_ANIMS.crow.seq).toHaveLength(8);
    expect(COQ_ANIMS.hop.seq).toHaveLength(8);
    expect(COQ_ANIMS.walk.ms).toBe(150);

    for (const { seq } of Object.values(COQ_ANIMS)) {
      for (const id of seq) {
        expect(COQ_FRAMES[id]).toBeDefined();
      }
    }
  });

  it("stands with its feet on Tokkae's bottom row, a red comb on top", () => {
    const [stand] = COQ_FRAMES;
    expect(stand?.[14]).toMatch(/O/u);
    expect(stand?.[15]).toMatch(/^\.+$/u);
    expect(stand?.slice(0, 4).join("")).toMatch(/r/u);
  });
});

describe("coqAnim", () => {
  const doing = { action: "walk" as const, eating: false, moving: false };

  it("pecks while eating and struts while moving", () => {
    expect(coqAnim({ ...doing, eating: true })).toBe("peck");
    expect(coqAnim({ ...doing, moving: true })).toBe("walk");
  });

  it("crows hello, hops for hearts, and otherwise stands about", () => {
    expect(coqAnim({ ...doing, action: "hello" })).toBe("crow");
    expect(coqAnim({ ...doing, action: "greet" })).toBe("crow");
    expect(coqAnim({ ...doing, action: "hearts" })).toBe("hop");
    expect(coqAnim(doing)).toBe("idle");
  });
});

describe("coqFrame", () => {
  it("steps through an animation at its frame time, and loops", () => {
    const { ms, seq } = COQ_ANIMS.peck;
    expect(coqFrame("peck", 0)).toBe(seq[0]);
    expect(coqFrame("peck", ms)).toBe(seq[1]);
    expect(coqFrame("peck", ms * seq.length)).toBe(seq[0]);
  });
});
