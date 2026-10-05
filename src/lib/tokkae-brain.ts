import type { TokkaeFrame } from "./tokkae";

export type Action =
  | "announce"
  | "eat"
  | "enter"
  | "idle"
  | "jump"
  | "run"
  | "sleep"
  | "type"
  | "walk"
  | "wave";

export interface Pointer {
  at: number;
  x: number;
  y: number;
}

/** What the page gives Tokkae each frame: its size, the screen, the windows */
export interface World {
  h: number;
  vh: number;
  vw: number;
  w: number;
  windows: readonly Element[];
}

/** Where to draw Tokkae and its bug this frame */
export interface Pose {
  bug: { x: number; y: number } | null;
  /** True once the announcement should be put away */
  closeNotes: boolean;
  flip: boolean;
  frame: TokkaeFrame;
  side: "left" | "right";
  x: number;
  y: number;
}

const GRAVITY = 2200;
const WALK = 70;
const RUN = 260;
const ANNOUNCE_MS = 25_000;
const CHASE_MS = 2000;
const JUMP_GAP_MS = 1500;

const rand = (a: number, b: number) => a + Math.random() * (b - a);

/** The other things Tokkae gets up to, and how often */
const CHOICES: readonly [Action, number][] = [
  ["walk", 34],
  ["idle", 10],
  ["sleep", 10],
  ["wave", 8],
  ["type", 14],
  ["eat", 14],
  ["jump", 10],
];

const pick = (): Action => {
  let roll = Math.random() * CHOICES.reduce((sum, [, w]) => sum + w, 0);
  for (const [action, w] of CHOICES) {
    roll -= w;
    if (roll < 0) {
      return action;
    }
  }
  return "walk";
};

const MOVING = new Set<Action>(["eat", "enter", "run", "walk"]);

/** The steady pose for each action, two frames swapped on a beat */
const LOOPS: Partial<Record<Action, [TokkaeFrame, TokkaeFrame, number]>> = {
  announce: ["wave1", "wave2", 260],
  enter: ["walk1", "walk2", 150],
  run: ["walk1", "walk2", 80],
  sleep: ["blink", "blink", 1000],
  type: ["type1", "type2", 120],
  walk: ["walk1", "walk2", 150],
  wave: ["wave1", "wave2", 260],
};

/**
 * Tokkae's behaviour, free of React and the DOM's drawing: it walks in and
 * announces, then picks something to do every few seconds, falls with
 * gravity, lands on the tops of windows, and runs after the cursor.
 */
export class Brain {
  action: Action = "enter";
  private bugX: number | null = null;
  private face: 1 | -1;
  private lastJump = 0;
  private readonly onAction: (action: Action) => void;
  private surface: Element | null = null;
  private target: number;
  private until = Number.POSITIVE_INFINITY;
  private vx = 0;
  private vy = 0;
  private x: number;
  private y: number;

  constructor(
    world: World,
    fromLeft: boolean,
    onAction: (action: Action) => void
  ) {
    this.onAction = onAction;
    this.face = fromLeft ? 1 : -1;
    this.x = fromLeft ? -world.w - 10 : world.vw + 10;
    this.y = Brain.floor(world);
    this.target = fromLeft ? world.vw * 0.08 : world.vw * 0.92 - world.w;
  }

  private static floor(world: World) {
    return world.vh - world.h - 4;
  }

  /** One frame of life: `dt` in seconds, `now` in ms */
  step(
    now: number,
    dt: number,
    world: World,
    pointer: Pointer | null,
    notesOpen: boolean
  ): Pose {
    this.followSurface(world);
    const airborne = this.isAirborne(world);
    if (airborne) {
      this.fall(world, dt, now);
    } else if (!this.surface) {
      this.y = Brain.floor(world);
    }
    if (!airborne) {
      this.chase(world, now, pointer);
      this.walk(world, dt, now);
    }
    const closeNotes = !airborne && this.maybeMoveOn(world, now, notesOpen);
    return {
      bug: this.bugPose(world, now),
      closeNotes,
      flip: this.face > 0,
      frame: this.frameFor(now, airborne),
      side: this.x + world.w / 2 < world.vw / 2 ? "left" : "right",
      x: this.x,
      y: this.y,
    };
  }

  private set(action: Action, world: World, now: number) {
    this.action = action;
    this.onAction(action);
    this.bugX = null;
    this.until = now + rand(2500, 6000);
    const [lo, hi] = this.range(world);
    if (action === "walk") {
      this.target = rand(lo, hi);
    } else if (action === "eat") {
      const side = Math.random() < 0.5 ? -1 : 1;
      this.bugX = Math.min(hi, Math.max(lo, this.x + side * rand(60, 160)));
      this.target = this.bugX;
      this.until = now + 9000;
    } else if (action === "sleep") {
      this.until = now + rand(5000, 9000);
    } else if (
      action === "jump" &&
      !this.jumpTo(Brain.randomWindow(world), world, now)
    ) {
      this.set("walk", world, now);
    }
  }

  /** The x range Tokkae can walk on where it stands */
  private range(world: World): [number, number] {
    if (this.surface) {
      const r = this.surface.getBoundingClientRect();
      return [r.left, Math.max(r.left, r.right - world.w)];
    }
    return [0, Math.max(0, world.vw - world.w)];
  }

  private static randomWindow(world: World) {
    const reachable = world.windows.filter((win) => {
      const r = win.getBoundingClientRect();
      return r.top > world.h + 20 && r.top < world.vh - 40;
    });
    return reachable[Math.floor(Math.random() * reachable.length)] ?? null;
  }

  /** Leap onto the top of a window, landing near `aimX` if given */
  private jumpTo(
    win: Element | null,
    world: World,
    now: number,
    aimX?: number
  ) {
    if (!win || win === this.surface) {
      return false;
    }
    const r = win.getBoundingClientRect();
    const landY = r.top - world.h + 2;
    const aim = aimX ?? rand(r.left, r.right);
    const x = Math.min(
      r.right - world.w - 4,
      Math.max(r.left + 4, aim - world.w / 2)
    );
    // Up to the top of an arc 50px above the landing, then down onto it
    const rise = Math.max(60, this.y - landY + 50);
    this.vy = -Math.sqrt(2 * GRAVITY * rise);
    const up = -this.vy / GRAVITY;
    const down = Math.sqrt(
      (2 * Math.max(0, rise - (this.y - landY))) / GRAVITY
    );
    this.vx = (x - this.x) / (up + down);
    this.face = this.vx >= 0 ? 1 : -1;
    this.surface = null;
    this.action = "jump";
    this.onAction("jump");
    this.lastJump = now;
    return true;
  }

  /** Stay on the window stood on, or start falling when it goes away */
  private followSurface(world: World) {
    if (!this.surface) {
      return;
    }
    const r = this.surface.getBoundingClientRect();
    const cx = this.x + world.w / 2;
    const gone =
      r.top - world.h < 0 || r.top > world.vh || cx < r.left || cx > r.right;
    if (gone) {
      this.surface = null;
    } else {
      this.y = r.top - world.h + 2;
    }
  }

  private isAirborne(world: World) {
    return !this.surface && (this.y < Brain.floor(world) - 0.5 || this.vy < 0);
  }

  private fall(world: World, dt: number, now: number) {
    const before = this.y + world.h;
    this.vy += GRAVITY * dt;
    this.x += this.vx * dt;
    this.y += this.vy * dt;
    const landed = this.vy > 0 ? this.windowBelow(world, before) : null;
    if (landed) {
      this.surface = landed;
      this.y = landed.getBoundingClientRect().top - world.h + 2;
    } else if (this.y >= Brain.floor(world)) {
      this.y = Brain.floor(world);
    } else {
      return;
    }
    this.vx = 0;
    this.vy = 0;
    if (this.action === "jump" || landed) {
      this.set("idle", world, now);
      this.until = now + rand(600, 1500);
    }
  }

  /** The window whose top Tokkae's feet just passed through, if any */
  private windowBelow(world: World, before: number) {
    const cx = this.x + world.w / 2;
    const after = this.y + world.h;
    return (
      world.windows.find((win) => {
        const r = win.getBoundingClientRect();
        return (
          before - 2 <= r.top &&
          after >= r.top &&
          cx > r.left + 6 &&
          cx < r.right - 6
        );
      }) ?? null
    );
  }

  /** Run after the cursor, or jump up to the window it is over */
  private chase(world: World, now: number, pointer: Pointer | null) {
    const busy = this.action === "enter" || this.action === "announce";
    if (!pointer || busy || now - pointer.at > CHASE_MS) {
      return;
    }
    const cx = this.x + world.w / 2;
    const over = world.windows.find((win) => {
      const r = win.getBoundingClientRect();
      return (
        pointer.x > r.left &&
        pointer.x < r.right &&
        pointer.y > r.top - 60 &&
        pointer.y < r.top + 40
      );
    });
    const canJump = now - this.lastJump > JUMP_GAP_MS;
    if (over && canJump && Math.abs(pointer.x - cx) < 260) {
      this.jumpTo(over, world, now, pointer.x);
    } else if (Math.abs(pointer.x - cx) > 90) {
      if (this.action !== "run") {
        this.action = "run";
        this.onAction("run");
      }
      this.target = pointer.x - world.w / 2;
      this.until = now + 1200;
    }
  }

  /** Walking, running, coming in, or heading for a bug */
  private walk(world: World, dt: number, now: number) {
    if (!MOVING.has(this.action)) {
      return;
    }
    const entering = this.action === "enter";
    const [lo, hi] = entering
      ? [-world.w - 20, world.vw + 20]
      : this.range(world);
    const goal = Math.min(hi, Math.max(lo, this.target));
    const dx = goal - this.x;
    if (Math.abs(dx) > 4) {
      const speed = this.action === "run" ? RUN : WALK;
      this.face = dx > 0 ? 1 : -1;
      this.x += Math.sign(dx) * Math.min(Math.abs(dx), speed * dt);
    } else if (entering) {
      this.action = "announce";
      this.onAction("announce");
      this.until = now + ANNOUNCE_MS;
    } else if (this.action === "run" && this.surface) {
      // The cursor is past the edge of this window: hop down after it
      if (Math.abs(this.target - goal) > 40) {
        this.hopDown(Math.sign(this.target - goal));
      }
    } else if (this.action === "walk") {
      this.until = Math.min(this.until, now);
    }
  }

  private hopDown(dir: number) {
    this.surface = null;
    this.vy = -380;
    this.vx = dir * 200;
    this.face = dir >= 0 ? 1 : -1;
  }

  /** Time for something else; says whether the announcement is over */
  private maybeMoveOn(world: World, now: number, notesOpen: boolean) {
    if (this.action === "enter") {
      return false;
    }
    const announcing = this.action === "announce";
    if (now < this.until && !(announcing && !notesOpen)) {
      return false;
    }
    this.set(pick(), world, now);
    return announcing;
  }

  private nearBug() {
    return this.bugX !== null && Math.abs(this.bugX - this.x) < 8;
  }

  /** The bug sits where it was dropped until it gets eaten */
  private bugPose(world: World, now: number) {
    if (this.action !== "eat" || this.bugX === null) {
      return null;
    }
    // Close enough to chomp: the bug lasts a moment longer
    if (this.nearBug() && this.until > now + 900) {
      this.until = now + 900;
    }
    const top = this.surface
      ? this.surface.getBoundingClientRect().top
      : world.vh - 4;
    return { x: this.bugX + world.w / 2, y: top };
  }

  private frameFor(now: number, airborne: boolean): TokkaeFrame {
    const beat = (ms: number) => Math.floor(now / ms) % 2 === 0;
    if (airborne) {
      return "jump";
    }
    if (this.action === "eat") {
      if (this.nearBug()) {
        return beat(160) ? "chomp" : "idle";
      }
      return beat(150) ? "walk1" : "walk2";
    }
    const loop = LOOPS[this.action];
    if (loop) {
      return beat(loop[2]) ? loop[0] : loop[1];
    }
    return now % 3600 < 150 ? "blink" : "idle";
  }
}
