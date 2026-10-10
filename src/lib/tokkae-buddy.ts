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

/** The screen, and the buddy's box size and pace, which the theme can change */
export interface Room {
  /** The animal's box, square, in px, as the CSS sizes it */
  size: number;
  speed: number;
  vh: number;
  vw: number;
}

/** Where to draw the buddy this frame, and what to show with it */
export interface BuddyPose {
  /** True while circling behind Tokkae, so it's drawn behind it */
  behind: boolean;
  /** True at a picnic once it's by Tokkae: its bowl is out */
  bowl: boolean;
  /** Pixels to dip, as if eating from its bowl */
  dip: number;
  /** 1 facing right, -1 facing left */
  face: 1 | -1;
  /** True on the frames a heart should float up from it */
  heart: boolean;
  x: number;
  y: number;
}

type Mode = "beside" | "chase" | "flee" | "orbit" | "roam";

// Faster than roaming when it has somewhere to be
const HURRY = 2.6;
const CHASE = 230;
const FLEE = 250;
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

/**
 * The theme's animal, as Tokkae's buddy: it roams the lower half of the
 * screen, comes to stand beside Tokkae for hearts and picnics, circles it
 * while it naps, and chases it or runs from it in tag. Only its position
 * and facing change; the animal's picture is never touched.
 */
export class Buddy {
  private angle = 0;
  // Seconds it has been around, for the eating dip and the hearts
  private clock = 0;
  private face: 1 | -1;
  private fleeDir: FleeDir = 0;
  private lastHeart = 0;
  private mode: Mode = "roam";
  private size: number;
  private speed: number;
  private vx: number;
  private vy = 0;
  private x: number;
  private y: number;

  constructor(room: Room) {
    this.size = room.size;
    this.speed = room.speed;
    const fromLeft = Math.random() < 0.5;
    this.face = fromLeft ? 1 : -1;
    this.vx = fromLeft ? room.speed : -room.speed;
    this.x = fromLeft ? -room.size - 10 : room.vw + 10;
    this.y = rand(room.vh * 0.5, room.vh - room.size);
  }

  /** Its centre and width, for Tokkae to run to or from */
  spot() {
    return { cx: this.x + this.size / 2, w: this.size };
  }

  /** One frame: `dt` in seconds */
  step(dt: number, room: Room, mate: Mate): BuddyPose {
    ({ size: this.size, speed: this.speed } = room);
    this.clock += dt;
    const mode = modeFor(mate);
    if (mode !== this.mode) {
      this.fleeDir = 0;
      this.angle = this.x + this.size / 2 < mate.x + mate.w / 2 ? Math.PI : 0;
      this.mode = mode;
    }
    let near = false;
    if (mode === "beside") {
      near = this.beside(dt, room.vw, mate);
    } else if (mode === "orbit") {
      near = this.orbit(dt, mate);
    } else if (mode === "chase") {
      const [gx, gy] = Buddy.ground(mate, this.size, mate.x + mate.w / 2);
      near = this.moveTo(gx, gy, CHASE, dt);
    } else if (mode === "flee") {
      this.flee(dt, room.vw, mate);
    } else {
      this.roam(dt, room);
    }
    const bowl = mate.action === "picnic" && near;
    return {
      behind: mode === "orbit" && Math.sin(this.angle) < 0,
      bowl,
      dip: bowl && this.clock % 0.6 < 0.3 ? 4 : 0,
      face: this.face,
      heart: near && this.heartDue(mate.action),
      x: this.x,
      y: this.y,
    };
  }

  /** Where its box goes to stand on Tokkae's ground, centred on `cx` */
  private static ground(mate: Mate, size: number, cx: number) {
    return [cx - size / 2, mate.y + mate.h - size] as const;
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

  /** Next to Tokkae, on whichever side it's on, facing it once there */
  private beside(dt: number, vw: number, mate: Mate) {
    const tokkaeCx = mate.x + mate.w / 2;
    let side = this.x + this.size / 2 >= tokkaeCx ? 1 : -1;
    const gap = mate.w / 2 + this.size / 2 + 4;
    if (tokkaeCx + side * gap - this.size / 2 < 0) {
      side = 1;
    } else if (tokkaeCx + side * gap + this.size / 2 > vw) {
      side = -1;
    }
    const [gx, gy] = Buddy.ground(mate, this.size, tokkaeCx + side * gap);
    const there = this.moveTo(gx, gy, this.speed * HURRY, dt);
    if (there) {
      this.face = side > 0 ? -1 : 1;
    }
    return there;
  }

  /** Where on its circle round Tokkae the buddy's box sits at `angle` */
  private orbitAt(mate: Mate, angle: number) {
    const rx = mate.w / 2 + this.size * 0.6;
    const ry = this.size * 0.22;
    // Its lowest point just on Tokkae's ground, its highest behind Tokkae
    const cy = mate.y + mate.h + 6 - ry - this.size / 2;
    return [
      mate.x + mate.w / 2 + Math.cos(angle) * rx - this.size / 2,
      cy + Math.sin(angle) * ry - this.size / 2,
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
    this.face = nx >= this.x ? 1 : -1;
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
    const [, gy] = Buddy.ground(mate, this.size, cx);
    const passing = Math.abs(cx - tokkaeCx) < mate.w / 2 + this.size / 2;
    const ty = passing ? gy - this.size * 0.8 : gy;
    this.moveTo(this.fleeDir > 0 ? hi : 0, ty, FLEE, dt);
  }

  /** Drifting about the lower half of the screen, bouncing off its edges */
  private roam(dt: number, room: Room) {
    if (Math.hypot(this.vx, this.vy) < this.speed * 0.5) {
      const ang = Math.random() * Math.PI * 2;
      this.vx = Math.cos(ang) * this.speed;
      this.vy = Math.sin(ang) * this.speed;
    }
    const top = room.vh * 0.45;
    const bottom = room.vh - this.size;
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
