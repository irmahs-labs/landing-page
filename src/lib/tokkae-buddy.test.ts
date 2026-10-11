import { describe, expect, it } from "vitest";

import type { Action } from "./tokkae-brain";
import { Buddy } from "./tokkae-buddy";
import type { BuddyPose, Mate, Room } from "./tokkae-buddy";

const room: Room = { size: 120, speed: 108, vh: 900, vw: 1440 };
const DT = 1 / 60;
// Tokkae standing on the floor in the middle of the screen
const tokkae = (action: Action, extra: Partial<Mate> = {}): Mate => ({
  action,
  h: 68,
  tagIt: "tokkae",
  w: 72,
  x: 684,
  y: 828,
  ...extra,
});

const run = (buddy: Buddy, mate: Mate, seconds: number) => {
  const poses: BuddyPose[] = [];
  for (let t = 0; t < seconds; t += DT) {
    poses.push(buddy.step(DT, room, mate));
  }
  return poses;
};

describe("Buddy", () => {
  it("comes in from off screen and roams the lower half", () => {
    const buddy = new Buddy(room);
    const poses = run(buddy, tokkae("walk"), 20);
    const last = poses.at(-1);
    expect(last?.y).toBeGreaterThan(room.vh * 0.4);
    expect(last?.y).toBeLessThanOrEqual(room.vh - room.size + 5);
  });

  it("stands beside Tokkae, facing it, on the same ground", () => {
    const buddy = new Buddy(room);
    const pose = run(buddy, tokkae("hearts"), 8).at(-1);
    const mate = tokkae("hearts");
    expect(pose?.y).toBeCloseTo(mate.y + mate.h - room.size, 0);
    const side = (pose?.x ?? 0) + room.size / 2 > mate.x + mate.w / 2 ? 1 : -1;
    expect(pose?.face).toBe(-side);
  });

  it("sends up hearts while they trade them, not too fast", () => {
    const buddy = new Buddy(room);
    run(buddy, tokkae("hearts"), 8);
    const hearts = run(buddy, tokkae("hearts"), 3).filter((p) => p.heart);
    expect(hearts.length).toBeGreaterThanOrEqual(5);
    expect(hearts.length).toBeLessThanOrEqual(7);
  });

  it("brings out its bowl and eats at a picnic, and only then", () => {
    const buddy = new Buddy(room);
    run(buddy, tokkae("picnic"), 8);
    const picnic = run(buddy, tokkae("picnic"), 2);
    expect(picnic.every((p) => p.bowl)).toBe(true);
    expect(new Set(picnic.map((p) => p.dip))).toEqual(new Set([0, 4]));
    expect(run(buddy, tokkae("walk"), 1).some((p) => p.bowl)).toBe(false);
  });

  it("circles a napping Tokkae, behind it half the time, never below the floor", () => {
    const buddy = new Buddy(room);
    run(buddy, tokkae("napTogether"), 8);
    const poses = run(buddy, tokkae("napTogether"), 6);
    const behind = poses.filter((p) => p.behind).length / poses.length;
    expect(behind).toBeGreaterThan(0.3);
    expect(behind).toBeLessThan(0.7);
    const floor = 828 + 68;
    for (const p of poses) {
      expect(p.y + room.size).toBeLessThanOrEqual(floor + 7);
    }
  });

  it("catches up with Tokkae when it's it", () => {
    const buddy = new Buddy(room);
    const mate = tokkae("tag", { tagIt: "buddy" });
    const pose = run(buddy, mate, 10).at(-1);
    expect(
      Math.abs((pose?.x ?? 0) + room.size / 2 - (mate.x + mate.w / 2))
    ).toBeLessThan(5);
  });

  it("runs from Tokkae when Tokkae is it, leaping over it to get past", () => {
    const buddy = new Buddy(room);
    const poses = run(buddy, tokkae("tag", { tagIt: "tokkae" }), 15);
    const ground = 828 + 68 - room.size;
    // A real hop over Tokkae, at least half its own height, wherever it starts
    expect(poses.some((p) => p.y < ground - room.size / 2)).toBe(true);
    const xs = poses.map((p) => p.x);
    expect(Math.min(...xs)).toBeLessThan(40);
    expect(Math.max(...xs)).toBeGreaterThan(room.vw - room.size - 40);
  });
});
