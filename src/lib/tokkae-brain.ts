import { rand } from "./format";
import { ANIMS } from "./tokkae";
import type { Anim } from "./tokkae";

export type Action =
  | "alert"
  | "angry"
  | "announce"
  | "cry"
  | "eat"
  | "enter"
  | "greet"
  | "hearts"
  | "held"
  | "hello"
  | "idle"
  | "jump"
  | "napTogether"
  | "picnic"
  | "sleep"
  | "sleepy"
  | "tag"
  | "type"
  | "walk"
  | "wave";

/** Who is "it" in a game of tag */
export type Tagger = "buddy" | "tokkae";

/** The visitor turning the theme variations on (greet) or off (cry) */
export type Nudge = "cry" | "greet";

/** Which way a runner in tag is heading; 0 until it picks */
export type FleeDir = -1 | 0 | 1;

/**
 * Tag, for whoever is running away: away from the chaser at first, then
 * edge to edge, turning back within 20px of an edge of [lo, hi]
 */
export const nextFleeDir = (run: {
  cx: number;
  dir: FleeDir;
  from: number;
  hi: number;
  lo: number;
  x: number;
}): FleeDir => {
  let dir: FleeDir = run.dir;
  if (dir === 0) {
    dir = run.cx >= run.from ? 1 : -1;
  }
  const edge = dir > 0 ? run.hi : run.lo;
  if (Math.abs(edge - run.x) < 20) {
    return dir > 0 ? -1 : 1;
  }
  return dir;
};

/** Where the theme's animal is, so Tokkae can run to it or from it */
export interface BuddySpot {
  /** Its centre */
  cx: number;
  w: number;
}

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

/** Where to draw Tokkae this frame, and which frame */
export interface Pose {
  /** True once the announcement should be put away */
  closeNotes: boolean;
  /** True when facing left, so the sprite is mirrored */
  flip: boolean;
  /** Index into FRAMES */
  frame: number;
  side: "left" | "right";
  x: number;
  y: number;
}

const GRAVITY = 2200;
const WALK = 70;
const RUN = 260;
// Chasing the buddy in tag: a little slower than it runs away
const TAG_CHASE = 210;
const ANNOUNCE_MS = 25_000;
const JUMP_GAP_MS = 1500;
const ANGRY_MS = 10_000;
const SLEEPY_MS = 2500;
const FRAME_MS = 200;
// How often, with the theme's animal around, Tokkae picks a game over its
// own routine; each game is then equally likely
const PLAYTIME_ODDS = 0.4;
const GAMES: readonly Action[] = ["hearts", "picnic", "tag", "napTogether"];

/** The things Tokkae gets up to on its own, and how often */
const CHOICES: readonly [Action, number][] = [
  ["walk", 34],
  ["idle", 10],
  ["sleep", 10],
  ["wave", 8],
  ["type", 14],
  ["eat", 14],
  ["jump", 10],
];

/** The routine, or with the buddy around sometimes a game, never twice running */
const pick = (buddy: boolean, last: Action): Action => {
  if (buddy && Math.random() < PLAYTIME_ODDS) {
    const games = GAMES.filter((game) => game !== last);
    return games[Math.floor(Math.random() * games.length)] ?? "hearts";
  }
  let roll = Math.random() * CHOICES.reduce((sum, [, w]) => sum + w, 0);
  for (const [action, w] of CHOICES) {
    roll -= w;
    if (roll < 0) {
      return action;
    }
  }
  return "walk";
};

const MOVING = new Set<Action>(["angry", "enter", "greet", "tag", "walk"]);
// What Tokkae won't drop to greet its buddy or cry; those wait their turn
const BUSY = new Set<Action>(["angry", "announce", "enter", "held"]);
// Everything done with the buddy, dropped if it leaves
const TOGETHER = new Set<Action>([...GAMES, "alert", "greet", "hello"]);

/** How long each action lasts, when it's always the same */
const LASTS: Partial<Record<Action, number>> = {
  alert: 700,
  cry: 2000,
  // One catch: the bug flies in, the tongue goes out
  eat: ANIMS.bug.length * FRAME_MS,
  // Gives up running to the buddy if it can't reach it
  greet: 6000,
  hearts: 5000,
  hello: 1800,
  picnic: ANIMS.bug.length * FRAME_MS * 3,
  sleepy: SLEEPY_MS,
  tag: 10_000,
};

/** What always comes next: anger wears off into sleepiness, and so on */
const FOLLOWS: Partial<Record<Action, Action>> = {
  alert: "greet",
  angry: "sleepy",
  greet: "hello",
};

/** Which animation each action plays, and how fast (ms per frame) */
const PLAYS: Record<Action, [Anim, number]> = {
  alert: ["alert", 150],
  angry: ["angry", FRAME_MS],
  announce: ["wave", FRAME_MS],
  cry: ["cry", 250],
  eat: ["bug", FRAME_MS],
  enter: ["walk", 150],
  greet: ["alertRun", 90],
  hearts: ["love", FRAME_MS],
  held: ["angry", FRAME_MS],
  hello: ["wave", FRAME_MS],
  idle: ["idle", FRAME_MS],
  jump: ["walk", FRAME_MS],
  napTogether: ["nap", FRAME_MS],
  picnic: ["bug", FRAME_MS],
  sleep: ["nap", FRAME_MS],
  sleepy: ["sleepy", 400],
  tag: ["walk", 90],
  type: ["type", FRAME_MS],
  walk: ["walk", 150],
  wave: ["wave", FRAME_MS],
};

/**
 * Tokkae's behaviour, free of React and drawing: it walks in and announces,
 * then picks something to do every few seconds, falls with gravity and lands
 * on the tops of windows. It leaves the cursor alone unless poked or picked
 * up: then it gets angry and chases you for ten seconds, then gets sleepy
 * and carries on. With the theme's animal around, it sometimes plays with
 * it instead: hearts, a picnic, tag or a nap together.
 */
export class Brain {
  action: Action = "enter";
  /** Who is chasing whom, in the current game of tag */
  tagIt: Tagger = "tokkae";
  private buddy = false;
  private face: 1 | -1;
  // Running to one edge while fleeing in tag, then back to the other
  private fleeDir: FleeDir = 0;
  private lastJump = 0;
  private moving = false;
  private readonly onAction: (action: Action) => void;
  // A greeting or a cry waiting for Tokkae to finish what it's doing
  private pending: Nudge | null = null;
  private since = 0;
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

  private static randomWindow(world: World) {
    const reachable = world.windows.filter((win) => {
      const r = win.getBoundingClientRect();
      return r.top > world.h + 20 && r.top < world.vh - 40;
    });
    return reachable[Math.floor(Math.random() * reachable.length)] ?? null;
  }

  /** The window the cursor is near the top of, if any */
  private static windowUnder(world: World, pointer: Pointer) {
    return world.windows.find((win) => {
      const r = win.getBoundingClientRect();
      return (
        pointer.x > r.left &&
        pointer.x < r.right &&
        pointer.y > r.top - 60 &&
        pointer.y < r.top + 40
      );
    });
  }

  /** Clicked: angry, and after you for ten seconds */
  poke(now: number) {
    this.become("angry", now);
    this.until = now + ANGRY_MS;
  }

  /** Picked up: dangles from the cursor until let go */
  grab(now: number) {
    this.surface = null;
    this.vx = 0;
    this.vy = 0;
    this.become("held", now);
  }

  /** Held at the cursor, by the scruff of its neck */
  holdAt(x: number, y: number, world: World) {
    this.x = x - world.w / 2;
    this.y = y - world.h * 0.3;
  }

  /** Let go: it drops, then comes after you, angry */
  release(now: number) {
    this.become("angry", now);
    this.until = now + ANGRY_MS;
  }

  /** The theme's animal came or went, without a word from the visitor */
  setBuddy(present: boolean, now: number) {
    this.buddy = present;
    if (present) {
      return;
    }
    if (this.pending === "greet") {
      this.pending = null;
    }
    if (TOGETHER.has(this.action)) {
      this.until = Math.min(this.until, now);
    }
  }

  /**
   * The visitor turned the theme variations on, so Tokkae runs over to say
   * hello to the animal, or off, so it cries a little. Both wait if it's
   * busy announcing, being held or angry.
   */
  react(kind: Nudge, now: number) {
    this.pending = kind;
    if (!BUSY.has(this.action)) {
      this.until = Math.min(this.until, now);
    }
  }

  /** One frame of life: `dt` in seconds, `now` in ms */
  step(
    now: number,
    dt: number,
    world: World,
    pointer: Pointer | null,
    notesOpen: boolean,
    buddy: BuddySpot | null = null
  ): Pose {
    this.moving = false;
    if (this.action === "held") {
      return this.pose(now, world, false, false);
    }
    this.followSurface(world);
    const airborne = this.isAirborne(world);
    if (airborne) {
      this.fall(world, dt, now);
    } else if (!this.surface) {
      this.y = Brain.floor(world);
    }
    if (!airborne) {
      this.chase(world, now, pointer);
      this.playWith(world, now, buddy);
      this.walk(world, dt, now);
    }
    const closeNotes = !airborne && this.maybeMoveOn(world, now, notesOpen);
    return this.pose(now, world, airborne, closeNotes);
  }

  private pose(
    now: number,
    world: World,
    airborne: boolean,
    closeNotes: boolean
  ): Pose {
    return {
      closeNotes,
      flip: this.face < 0,
      frame: this.frameFor(now, airborne),
      side: this.x + world.w / 2 < world.vw / 2 ? "left" : "right",
      x: this.x,
      y: this.y,
    };
  }

  /** Switch action, telling the page, and restart its animation */
  private become(action: Action, now: number) {
    this.action = action;
    this.since = now;
    this.onAction(action);
  }

  private set(action: Action, world: World, now: number) {
    this.become(action, now);
    this.until = now + (LASTS[action] ?? rand(2500, 6000));
    const [lo, hi] = this.range(world);
    if (action === "walk") {
      this.target = rand(lo, hi);
    } else if (action === "sleep") {
      this.until = now + rand(5000, 9000);
    } else if (action === "napTogether") {
      this.until = now + rand(8000, 11_000);
    } else if (action === "tag") {
      this.tagIt = Math.random() < 0.5 ? "tokkae" : "buddy";
      this.fleeDir = 0;
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
    this.lastJump = now;
    // An angry Tokkae stays angry in the air
    if (this.action !== "angry") {
      this.become("jump", now);
    }
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
    if (this.action === "jump") {
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

  /**
   * Only when angry: run after the cursor, wherever it last was, or jump up
   * to the window it is over
   */
  private chase(world: World, now: number, pointer: Pointer | null) {
    if (!pointer || this.action !== "angry") {
      return;
    }
    const cx = this.x + world.w / 2;
    const over = Brain.windowUnder(world, pointer);
    const canJump = now - this.lastJump > JUMP_GAP_MS;
    if (over && canJump && Math.abs(pointer.x - cx) < 260) {
      this.jumpTo(over, world, now, pointer.x);
      return;
    }
    this.target = pointer.x - world.w / 2;
  }

  /** Running over to say hello, or playing tag */
  private playWith(world: World, now: number, buddy: BuddySpot | null) {
    if (!buddy) {
      return;
    }
    const cx = this.x + world.w / 2;
    if (this.action === "greet") {
      const reach = world.w / 2 + buddy.w / 2 + 12;
      if (Math.abs(buddy.cx - cx) < reach) {
        this.face = buddy.cx >= cx ? 1 : -1;
        this.set("hello", world, now);
      } else {
        this.target = buddy.cx - world.w / 2;
      }
    } else if (this.action === "tag" && this.tagIt === "tokkae") {
      this.target = buddy.cx - world.w / 2;
    } else if (this.action === "tag") {
      this.flee(world, cx, buddy.cx);
    }
  }

  /** Away from the buddy to one edge, then dashing back past it to the other */
  private flee(world: World, cx: number, from: number) {
    const [lo, hi] = this.range(world);
    this.fleeDir = nextFleeDir({
      cx,
      dir: this.fleeDir,
      from,
      hi,
      lo,
      x: this.x,
    });
    this.target = this.fleeDir > 0 ? hi : lo;
  }

  /** Walking, coming in, or stomping after the cursor */
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
      const speed = this.speedFor(entering);
      this.face = dx > 0 ? 1 : -1;
      this.x += Math.sign(dx) * Math.min(Math.abs(dx), speed * dt);
      this.moving = true;
    } else if (entering) {
      this.become("announce", now);
      this.until = now + ANNOUNCE_MS;
    } else if (this.action === "walk") {
      this.until = Math.min(this.until, now);
    } else if (this.surface && Math.abs(this.target - goal) > 40) {
      // Angry, and the cursor is past the edge of this window: hop down
      this.hopDown(Math.sign(this.target - goal));
    }
  }

  private speedFor(entering: boolean) {
    if (this.action === "walk" || entering) {
      return WALK;
    }
    return this.action === "tag" && this.tagIt === "tokkae" ? TAG_CHASE : RUN;
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
    this.set(this.nextAction(), world, now);
    return announcing;
  }

  /** A waiting greeting or cry first, then what follows, then the routine */
  private nextAction(): Action {
    const { pending } = this;
    this.pending = null;
    if (pending === "cry") {
      return "cry";
    }
    if (pending === "greet" && this.buddy) {
      return "alert";
    }
    const follows = FOLLOWS[this.action];
    if (follows && (this.buddy || !TOGETHER.has(follows))) {
      return follows;
    }
    return pick(this.buddy, this.action);
  }

  private frameFor(now: number, airborne: boolean) {
    let [anim, ms] = PLAYS[this.action];
    if (this.action === "angry" && (this.moving || airborne)) {
      anim = "angryRun";
      ms = 90;
    } else if (airborne) {
      anim = "walk";
    }
    const frames = ANIMS[anim];
    const i = Math.floor((now - this.since) / ms) % frames.length;
    return frames[i] ?? 0;
  }
}
