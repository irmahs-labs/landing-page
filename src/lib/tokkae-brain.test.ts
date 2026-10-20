import { afterEach, describe, expect, it, vi } from "vitest";

import { Brain, nextFleeDir } from "./tokkae-brain";
import type { Action, BuddySpot, World } from "./tokkae-brain";

const world: World = { h: 68, vh: 900, vw: 1440, w: 72, windows: [] };
const DT = 1 / 60;

/** A Tokkae and a clock to run it on */
const setup = () => {
  const seen: Action[] = [];
  const brain = new Brain(world, true, (action) => seen.push(action));
  let now = 0;
  let notesOpen = true;
  let buddy: BuddySpot | null = null;

  const run = (ms: number) => {
    const end = now + ms;

    while (now < end) {
      now += DT * 1000;
      const pose = brain.step(now, DT, world, null, notesOpen, buddy);

      if (pose.closeNotes) {
        notesOpen = false;
      }
    }
  };

  return {
    brain,
    closeNotes: () => {
      notesOpen = false;
    },
    get now() {
      return now;
    },
    run,
    seen,
    setBuddy: (spot: BuddySpot | null) => {
      buddy = spot;
      brain.setBuddy(Boolean(spot), now);
    },
  };
};

/** Walked in and past the announcement, on its own routine */
const settled = () => {
  const t = setup();
  t.run(15_000);
  t.closeNotes();
  t.run(100);

  return t;
};

afterEach(() => {
  vi.restoreAllMocks();
});

describe("Brain", () => {
  it("walks in and announces the latest changes", () => {
    const t = setup();
    expect(t.brain.action).toBe("enter");
    t.run(15_000);
    expect(t.brain.action).toBe("announce");
    t.closeNotes();
    t.run(100);
    expect(t.brain.action).not.toBe("announce");
  });

  it("gets angry for ten seconds when poked, then sleepy", () => {
    const t = settled();
    t.brain.poke(t.now);
    t.run(9900);
    expect(t.brain.action).toBe("angry");
    t.run(200);
    expect(t.brain.action).toBe("sleepy");
  });

  it("cries for two seconds when the variations are turned off", () => {
    const t = settled();
    t.brain.react("cry", t.now);
    t.run(50);
    expect(t.brain.action).toBe("cry");
    t.run(1900);
    expect(t.brain.action).toBe("cry");
    t.run(200);
    expect(t.brain.action).not.toBe("cry");
  });

  it("shows a ! and runs over to say hello to a new buddy", () => {
    const t = settled();
    t.setBuddy({ cx: 900, w: 120 });
    t.brain.react("greet", t.now);
    t.run(50);
    expect(t.brain.action).toBe("alert");
    t.run(800);
    expect(t.brain.action).toBe("greet");
    t.run(4000);
    expect(t.seen).toContain("hello");
  });

  it("doesn't greet a buddy that isn't there", () => {
    const t = settled();
    t.brain.react("greet", t.now);
    t.run(2000);
    expect(t.seen).not.toContain("alert");
  });

  it("finishes announcing before it reacts", () => {
    const t = setup();
    t.run(15_000);
    t.brain.react("cry", t.now);
    t.run(3000);
    expect(t.brain.action).toBe("announce");
    t.closeNotes();
    t.run(100);
    expect(t.brain.action).toBe("cry");
  });

  it("stops playing when the buddy leaves", () => {
    const t = settled();
    t.setBuddy({ cx: 900, w: 120 });
    t.brain.react("greet", t.now);
    t.run(300);
    t.setBuddy(null);
    t.run(100);
    expect(["alert", "greet", "hello"]).not.toContain(t.brain.action);
  });

  it("plays the four games equally often, never one twice running", () => {
    const t = settled();
    t.setBuddy({ cx: 900, w: 120 });
    const from = t.seen.length;
    t.run(2 * 60 * 60 * 1000);
    // Every activity picked, in order, leaving out the walks between them
    const picked = t.seen.slice(from).filter((action) => action !== "walk");
    const games = new Set<Action>(["hearts", "napTogether", "picnic", "tag"]);
    const counts: Record<string, number> = {};
    let repeats = 0;

    for (const [i, action] of picked.entries()) {
      counts[action] = (counts[action] ?? 0) + 1;

      if (games.has(action) && picked[i - 1] === action) {
        repeats += 1;
      }
    }

    const played = [...games].map((g) => counts[g] ?? 0);
    const total = played.reduce((a, b) => a + b, 0);
    expect(total).toBeGreaterThan(100);

    for (const n of played) {
      expect(n / total).toBeGreaterThan(0.15);
      expect(n / total).toBeLessThan(0.35);
    }

    expect(repeats).toBe(0);
  });

  it("walks about between everything it does on its own", () => {
    const t = settled();
    const from = t.seen.length;
    t.run(30 * 60 * 1000);
    const started = t.seen.slice(from);

    const backToBack = started.filter(
      (action, i) => i > 0 && action !== "walk" && started[i - 1] !== "walk"
    );

    expect(backToBack).toEqual([]);
  });

  it("gets up to something new only every ten seconds or so", () => {
    const t = settled();
    const from = t.seen.length;
    t.run(30 * 60 * 1000);

    const perMinute =
      t.seen.slice(from).filter((action) => action !== "walk").length / 30;

    expect(perMinute).toBeGreaterThan(3);
    expect(perMinute).toBeLessThan(7);
  });

  it("plays tag for ten seconds, with either one as it", () => {
    const t = settled();
    t.setBuddy({ cx: 900, w: 120 });
    const its = new Set<string>();
    const lengths: number[] = [];
    let start = 0;
    let last: Action = t.brain.action;

    for (let i = 0; i < 60 * 60 * 60 && lengths.length < 12; i += 1) {
      t.run(1000 / 60);
      const { action } = t.brain;

      if (action !== last) {
        if (action === "tag") {
          start = t.now;
          its.add(t.brain.tagIt);
        } else if (last === "tag") {
          lengths.push(t.now - start);
        }

        last = action;
      }
    }

    expect(its).toEqual(new Set(["buddy", "tokkae"]));

    for (const ms of lengths) {
      expect(ms).toBeGreaterThan(9900);
      expect(ms).toBeLessThan(10_100);
    }
  });
});

describe("nextFleeDir", () => {
  const run = { cx: 500, dir: 0, from: 400, hi: 1000, lo: 0, x: 464 } as const;

  it("runs away from the chaser first", () => {
    expect(nextFleeDir(run)).toBe(1);
    expect(nextFleeDir({ ...run, from: 600 })).toBe(-1);
  });

  it("keeps going until it nears an edge, then turns back", () => {
    expect(nextFleeDir({ ...run, dir: 1, x: 900 })).toBe(1);
    expect(nextFleeDir({ ...run, dir: 1, x: 990 })).toBe(-1);
    expect(nextFleeDir({ ...run, dir: -1, x: 10 })).toBe(1);
  });
});
