import { describe, expect, it } from "vitest";

import { ANIMS, FRAMES, GRID_H, GRID_W, HEART, SONGS, runsOf } from "./tokkae";

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

/** Whether a song draws this colour in the three columns left of Tokkae */
const hasProp = (anim: (typeof SONGS)[number]["anim"], key: string) =>
  ANIMS[anim].some((id) =>
    (FRAMES[id] ?? []).some((row) => row.slice(0, 3).includes(key))
  );

describe("Tokkae's songs", () => {
  it("come in Irma's order, plain sing first", () => {
    expect(SONGS.map((song) => song.anim)).toEqual([
      "sing",
      "singJoy",
      "singHappiness",
      "singLove",
      "singHeartbreak",
      "singAnger",
      "singRage",
      "singDepression",
      "singSadness",
      "singPeaceful",
    ]);
  });

  it("are each eight frames at the mic stand, mouthless, all different", () => {
    const looks = new Set<string>();

    for (const { anim } of SONGS) {
      const ids = ANIMS[anim];
      expect(ids).toHaveLength(8);

      for (const id of ids) {
        const rows = FRAMES[id] ?? [];
        // The stand's pole runs down column 14, whatever the song
        expect(rows[12]?.[14]).toBe("k");
        expect(rows[7]).not.toMatch(/g[kt]g/u);
      }

      looks.add(ids.map((id) => FRAMES[id]?.join("/")).join("|"));
    }

    expect(looks.size).toBe(SONGS.length);
  });

  it("show each mood with its own prop", () => {
    // Props sit in the three columns left of Tokkae
    expect(hasProp("singJoy", "O")).toBe(true);
    expect(hasProp("singHappiness", "w")).toBe(true);
    expect(hasProp("singLove", "r")).toBe(true);
    expect(hasProp("singAnger", "O")).toBe(true);
    expect(hasProp("singSadness", "w")).toBe(true);
    expect(hasProp("singPeaceful", "p")).toBe(true);
    expect(hasProp("sing", "r")).toBe(false);
  });
});

describe("props", () => {
  it("draws the heart from known colours", () => {
    for (const row of HEART) {
      expect(row).toMatch(KEYS);
    }
  });
});

describe("runsOf", () => {
  it("merges each row's same-coloured pixels into one rect", () => {
    expect(runsOf(["rr.w", "..ww"])).toEqual([
      { color: "#f0675c", w: 2, x: 0, y: 0 },
      { color: "#4a7fc0", w: 1, x: 3, y: 0 },
      { color: "#4a7fc0", w: 2, x: 2, y: 1 },
    ]);
  });
});
