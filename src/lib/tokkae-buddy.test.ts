import { describe, expect, it } from "vitest";

import type { Action } from "./tokkae-brain";
import { Buddy } from "./tokkae-buddy";
import type { BuddyPose, Mate, Room } from "./tokkae-buddy";

// Coq's 18 × 17 frame at 4px a pixel
const room: Room = { height: 68, size: 72, speed: 108, vh: 900, vw: 1440 };
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
    expect(last?.y).toBeLessThanOrEqual(room.vh - room.height + 5);
  });

  it("stands on Tokkae's right, two pixels off, facing it, on the same ground", () => {
    const buddy = new Buddy(room);
    const poses = run(buddy, tokkae("hearts"), 8);
    const pose = poses.at(-1);
    const mate = tokkae("hearts");
    // Its feet on Tokkae's: both frames are 68px tall
    expect(pose?.y).toBeCloseTo(mate.y, 0);
    // Frame centres 14 sprite pixels (4px each) apart, Coq to the right
    expect((pose?.x ?? 0) - mate.x).toBeCloseTo(56, 0);
    expect(pose?.face).toBe(-1);
    expect(pose?.moving).toBe(false);
    expect(poses.slice(0, 30).some((p) => p.moving)).toBe(true);
  });

  it("stands on Tokkae's left when the screen's edge leaves no room", () => {
    const buddy = new Buddy(room);
    const nearEdge = tokkae("hearts", { x: room.vw - 100 });
    const pose = run(buddy, nearEdge, 8).at(-1);
    expect(pose?.x ?? 0).toBeLessThan(nearEdge.x);
    expect(pose?.face).toBe(1);
  });

  it("sends up hearts while they trade them, not too fast", () => {
    const buddy = new Buddy(room);
    run(buddy, tokkae("hearts"), 8);
    const hearts = run(buddy, tokkae("hearts"), 3).filter((p) => p.heart);
    expect(hearts.length).toBeGreaterThanOrEqual(5);
    expect(hearts.length).toBeLessThanOrEqual(7);
  });

  it("pecks at its seeds at a picnic, and only then", () => {
    const buddy = new Buddy(room);
    run(buddy, tokkae("picnic"), 8);
    const picnic = run(buddy, tokkae("picnic"), 2);
    expect(picnic.every((p) => p.eating)).toBe(true);
    expect(run(buddy, tokkae("walk"), 1).some((p) => p.eating)).toBe(false);
  });

  it("circles a napping Tokkae, behind it half the time, never below the floor", () => {
    const buddy = new Buddy(room);
    run(buddy, tokkae("napTogether"), 8);
    const poses = run(buddy, tokkae("napTogether"), 6);
    const behind = poses.filter((p) => p.behind).length / poses.length;
    expect(behind).toBeGreaterThan(0.3);
    expect(behind).toBeLessThan(0.7);
    const floor = 828 + 68;
    const mid = 684 + 72 / 2;
    for (const p of poses) {
      expect(p.y + room.height).toBeLessThanOrEqual(floor + 7);
      // Round and round, it keeps facing the sleeping Tokkae
      expect(p.face).toBe(p.x + room.size / 2 <= mid ? 1 : -1);
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
    const ground = 828 + 68 - room.height;
    // A real hop over Tokkae, at least half its own height, wherever it starts
    expect(poses.some((p) => p.y < ground - room.size / 2)).toBe(true);
    const xs = poses.map((p) => p.x);
    expect(Math.min(...xs)).toBeLessThan(40);
    expect(Math.max(...xs)).toBeGreaterThan(room.vw - room.size - 40);
  });
});
