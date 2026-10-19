import { rand } from "./format";
import { nextFleeDir } from "./tokkae-brain";
import type { Action, FleeDir, Tagger } from "./tokkae-brain";

/** Where Tokkae is and what it's up to, as the buddy sees it */
export interface Mate {
  action: Action;
  h: number;
  tagIt: Tagger;
  w: number;
  x: number;
  y: number;
}

/** The screen, and the playmate's box size and pace */
export interface Room {
  /** Coq's frame's height in px, as the CSS sizes it (17 sprite pixels) */
  height: number;
  /** Coq's frame's width in px, as the CSS sizes it (18 sprite pixels) */
  size: number;
  speed: number;
  vh: number;
  vw: number;
}

/** Where to draw the buddy this frame, and what to show with it */
export interface BuddyPose {
  /** True while circling behind Tokkae, so it's drawn behind it */
  behind: boolean;
  /** True at a picnic once it's by Tokkae: it pecks at its seeds */
  eating: boolean;
  /** 1 facing right, -1 facing left */
  face: 1 | -1;
  /** True on the frames a heart should float up from it */
  heart: boolean;
  /** True while it gets about, so it struts */
  moving: boolean;
  x: number;
  y: number;
}

type Mode = "beside" | "chase" | "flee" | "orbit" | "roam";

// Faster than roaming when it has somewhere to be
const HURRY = 2.6;
const CHASE = 230;
const FLEE = 250;
// How fast its height follows the leap's arc, per second
const LEAP_EASE = 12;
const ORBIT_RAD_PER_S = 1.3;
// A heart every so often while they trade hearts or say hello
const HEART_GAP_S = 0.45;

/** How the buddy moves while Tokkae does each thing */
const MODES: Partial<Record<Action, Mode>> = {
  alert: "beside",
  greet: "beside",
  hearts: "beside",
  hello: "beside",
  napTogether: "orbit",
  picnic: "beside",
};

const modeFor = (mate: Mate): Mode => {
  if (mate.action === "tag") {
    return mate.tagIt === "buddy" ? "chase" : "flee";
  }
  return MODES[mate.action] ?? "roam";
};

// Below this many px a frame, it's standing still
const STILL_PX = 0.2;

/**
 * Tokkae's playmate, Coq the rooster: it roams the lower half of the
 * screen, comes to stand on Tokkae's right for hearts and picnics, circles
 * it while it naps, and chases it or runs from it in tag. Whenever the two
 * play it faces Tokkae, except while it runs from it.
 */
export class Buddy {
  private angle = 0;
  // Seconds it has been around, for the eating dip and the hearts
  private clock = 0;
  private face: 1 | -1;
  private fleeDir: FleeDir = 0;
  private lastHeart = 0;
  private mode: Mode = "roam";
  private height: number;
  private size: number;
  private speed: number;
  private vx: number;
  private vy = 0;
  private x: number;
  private y: number;

  constructor(room: Room) {
    this.size = room.size;
    this.height = room.height;
    this.speed = room.speed;
    const fromLeft = Math.random() < 0.5;
    this.face = fromLeft ? 1 : -1;
    this.vx = fromLeft ? room.speed : -room.speed;
    this.x = fromLeft ? -room.size - 10 : room.vw + 10;
    this.y = rand(room.vh * 0.5, room.vh - room.height);
  }

  /** Its centre and width, for Tokkae to run to or from */
  spot() {
    return { cx: this.x + this.size / 2, w: this.size };
  }

  /** One frame: `dt` in seconds */
  step(dt: number, room: Room, mate: Mate): BuddyPose {
    ({ height: this.height, size: this.size, speed: this.speed } = room);
    this.clock += dt;
    const mode = modeFor(mate);
    if (mode !== this.mode) {
      this.fleeDir = 0;
      this.angle = this.x + this.size / 2 < mate.x + mate.w / 2 ? Math.PI : 0;
      this.mode = mode;
    }
    const [fromX, fromY] = [this.x, this.y];
    let near = false;
    if (mode === "beside") {
      near = this.beside(dt, room.vw, mate);
    } else if (mode === "orbit") {
      near = this.orbit(dt, mate);
    } else if (mode === "chase") {
      const [gx, gy] = this.ground(mate, mate.x + mate.w / 2);
      near = this.moveTo(gx, gy, CHASE, dt);
    } else if (mode === "flee") {
      this.flee(dt, room.vw, mate);
    } else {
      this.roam(dt, room);
    }
    return {
      behind: mode === "orbit" && Math.sin(this.angle) < 0,
      eating: mate.action === "picnic" && near,
      face: this.face,
      heart: near && this.heartDue(mate.action),
      moving: Math.hypot(this.x - fromX, this.y - fromY) > STILL_PX,
      x: this.x,
      y: this.y,
    };
  }

  /** Where its box goes to stand on Tokkae's ground, centred on `cx` */
  private ground(mate: Mate, cx: number) {
    return [cx - this.size / 2, mate.y + mate.h - this.height] as const;
  }

  private heartDue(action: Action) {
    const sharing = action === "hearts" || action === "hello";
    if (!sharing || this.clock - this.lastHeart < HEART_GAP_S) {
      return false;
    }
    this.lastHeart = this.clock;
    return true;
  }

  /** Head for a point; says whether it's there */
  private moveTo(tx: number, ty: number, speed: number, dt: number) {
    const dx = tx - this.x;
    const dy = ty - this.y;
    const d = Math.hypot(dx, dy);
    if (Math.abs(dx) > 2) {
      this.face = dx > 0 ? 1 : -1;
    }
    if (d < 3) {
      this.x = tx;
      this.y = ty;
      return true;
    }
    const move = Math.min(d, speed * dt);
    this.x += (dx / d) * move;
    this.y += (dy / d) * move;
    return false;
  }

  /**
   * On Tokkae's right, two sprite pixels from it, facing it once there; on
   * its left only when the screen's edge leaves no room
   */
  private beside(dt: number, vw: number, mate: Mate) {
    const tokkaeCx = mate.x + mate.w / 2;
    // Tokkae's body ends 14 sprite pixels into its frame and Coq's starts 2
    // into its own, so two pixels apart puts their frames 14 pixels apart
    const gap = 14 * (this.size / 18);
    const side = tokkaeCx + gap + this.size / 2 > vw ? -1 : 1;
    const [gx, gy] = this.ground(mate, tokkaeCx + side * gap);
    const there = this.moveTo(gx, gy, this.speed * HURRY, dt);
    if (there) {
      this.face = side > 0 ? -1 : 1;
    }
    return there;
  }

  /** Where on its circle round Tokkae the buddy's box sits at `angle` */
  private orbitAt(mate: Mate, angle: number) {
    const rx = mate.w / 2 + this.size * 0.6;
    const ry = this.height * 0.22;
    // Its lowest point just on Tokkae's ground, its highest behind Tokkae
    const cy = mate.y + mate.h + 6 - ry - this.height / 2;
    return [
      mate.x + mate.w / 2 + Math.cos(angle) * rx - this.size / 2,
      cy + Math.sin(angle) * ry - this.height / 2,
    ] as const;
  }

  /** Round and round the sleeping Tokkae, on a flat ellipse */
  private orbit(dt: number, mate: Mate) {
    const [px, py] = this.orbitAt(mate, this.angle);
    if (Math.hypot(px - this.x, py - this.y) > 12) {
      this.moveTo(px, py, this.speed * HURRY, dt);
      return false;
    }
    this.angle += ORBIT_RAD_PER_S * dt;
    const [nx, ny] = this.orbitAt(mate, this.angle);
    // Strutting round, it keeps its eyes on the sleeping Tokkae
    this.face = nx + this.size / 2 <= mate.x + mate.w / 2 ? 1 : -1;
    this.x = nx;
    this.y = ny;
    return true;
  }

  /**
   * Away from Tokkae along its ground to one edge, then back the other way,
   * leaping over Tokkae as it passes
   */
  private flee(dt: number, vw: number, mate: Mate) {
    const tokkaeCx = mate.x + mate.w / 2;
    const cx = this.x + this.size / 2;
    const hi = vw - this.size;
    this.fleeDir = nextFleeDir({
      cx,
      dir: this.fleeDir,
      from: tokkaeCx,
      hi,
      lo: 0,
      x: this.x,
    });
    // Full speed along the ground to the edge
    const dx = (this.fleeDir > 0 ? hi : 0) - this.x;
    this.x += Math.sign(dx) * Math.min(Math.abs(dx), FLEE * dt);
    if (Math.abs(dx) > 2) {
      this.face = dx > 0 ? 1 : -1;
    }
    // Over Tokkae on an arc while passing it, settling back down after
    const [, gy] = this.ground(mate, cx);
    const reach = mate.w / 2 + this.size / 2;
    const across = (cx - tokkaeCx + reach) / (2 * reach);
    const lift =
      across > 0 && across < 1
        ? Math.sin(Math.PI * across) * this.size * 0.8
        : 0;
    this.y += (gy - lift - this.y) * Math.min(1, dt * LEAP_EASE);
  }

  /** Drifting about the lower half of the screen, bouncing off its edges */
  private roam(dt: number, room: Room) {
    if (Math.hypot(this.vx, this.vy) < this.speed * 0.5) {
      const ang = Math.random() * Math.PI * 2;
      this.vx = Math.cos(ang) * this.speed;
      this.vy = Math.sin(ang) * this.speed;
    }
    const top = room.vh * 0.45;
    const bottom = room.vh - this.height;
    if (
      (this.x < 0 && this.vx < 0) ||
      (this.x > room.vw - this.size && this.vx > 0)
    ) {
      this.vx = -this.vx;
    }
    if ((this.y < top && this.vy < 0) || (this.y > bottom && this.vy > 0)) {
      this.vy = -this.vy;
    }
    if (Math.abs(this.vx) > 4) {
      this.face = this.vx > 0 ? 1 : -1;
    }
    this.x += this.vx * dt;
    this.y += this.vy * dt;
  }
}
