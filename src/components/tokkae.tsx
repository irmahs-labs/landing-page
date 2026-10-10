"use client";

import { useEffect, useRef, useState } from "react";
import type { PointerEvent as ReactPointerEvent, RefObject } from "react";

import { useReducedMotion } from "@/hooks/use-reduced-motion";
import { CHANGELOG } from "@/lib/changelog";
import type { Theme } from "@/lib/themes";
import { BOWL, FRAMES, HEART, runsOf } from "@/lib/tokkae";
import { Brain } from "@/lib/tokkae-brain";
import type { Action, Nudge, Pointer, World } from "@/lib/tokkae-brain";
import { Buddy } from "@/lib/tokkae-buddy";
import type { BuddyPose, Room } from "@/lib/tokkae-buddy";

import { Window } from "./window";

/** One frame of Tokkae as pixel runs; `hidden` frames wait their turn */
export const Sprite = ({
  hidden,
  rows,
}: {
  hidden?: boolean;
  rows: readonly string[];
}) => (
  <svg
    aria-hidden="true"
    className={hidden ? "is-off" : undefined}
    viewBox={`0 0 ${rows[0]?.length ?? 0} ${rows.length}`}
  >
    {runsOf(rows).map((r) => (
      <rect
        fill={r.color}
        height="1"
        key={`${r.x}-${r.y}`}
        width={r.w}
        x={r.x}
        y={r.y}
      />
    ))}
  </svg>
);

// The windows Tokkae can stand on; its own patch notes don't count
const measure = (el: HTMLElement): World => ({
  h: el.offsetHeight,
  vh: window.innerHeight,
  vw: window.innerWidth,
  w: el.offsetWidth,
  windows: [...document.querySelectorAll("section.window:not(.patch-notes)")],
});

/** A theme switch by the visitor; a new object each time, for the effect */
export interface ThemeNudge {
  kind: Nudge;
}

/** The screen, and the buddy's size as its CSS box has it, and its pace */
const roomFor = (box: HTMLElement, theme: Theme): Room => ({
  size: box.offsetWidth,
  speed: (theme.cfg?.speed ?? 90) * 1.2,
  vh: window.innerHeight,
  vw: window.innerWidth,
});

/** Bring the buddy in or out to match the theme's animal */
const syncBuddy = (
  brain: Brain,
  buddy: RefObject<Buddy | null>,
  box: HTMLElement | null,
  theme: Theme,
  now: number
) => {
  if (theme.animal && box && !buddy.current) {
    buddy.current = new Buddy(roomFor(box, theme));
    brain.setBuddy(true, now);
  } else if (!theme.animal && buddy.current) {
    buddy.current = null;
    brain.setBuddy(false, now);
  }
};

/**
 * Move the buddy's box; its picture only ever flips to face its way. The
 * facing and layering change rarely, so they're only written when they do.
 */
const placeBuddy = (el: HTMLElement, pose: BuddyPose, native: number) => {
  el.style.transform = `translate(${pose.x.toFixed(1)}px, ${(pose.y + pose.dip).toFixed(1)}px)`;
  const face = pose.face > 0 ? "right" : "left";
  if (el.dataset.face !== face) {
    el.dataset.face = face;
    el.style.setProperty("--face", String(pose.face * native));
  }
  const behind = pose.behind ? "1" : "0";
  if (el.dataset.behind !== behind) {
    el.dataset.behind = behind;
  }
};

/** A pixel heart floating up from the buddy's head, gone once it fades */
const releaseHeart = (
  template: Element,
  layer: Element,
  x: number,
  y: number
) => {
  const heart = template.cloneNode(true);
  if (!(heart instanceof HTMLElement)) {
    return;
  }
  heart.classList.remove("is-off");
  heart.style.left = `${x.toFixed(0)}px`;
  heart.style.top = `${y.toFixed(0)}px`;
  heart.addEventListener("animationend", () => heart.remove());
  heart.addEventListener("animationcancel", () => heart.remove());
  layer.append(heart);
};

const PatchNotes = ({ onClose }: { onClose: () => void }) => {
  const [latest] = CHANGELOG;
  if (!latest) {
    return null;
  }
  return (
    <Window className="patch-notes" label="What's new" title="patch_notes.txt">
      <div className="patch-body">
        <p className="patch-title">
          <span>tok-kae!</span> {latest.title}
        </p>
        <ul>
          {latest.changes.map((change) => (
            <li key={change}>{change}</li>
          ))}
        </ul>
        <button className="btn patch-ok" onClick={onClose} type="button">
          got it!
        </button>
      </div>
    </Window>
  );
};

/**
 * Tokkae, the pixel gecko. It walks in from one side when someone arrives
 * and announces the latest changes, then wanders: eating bugs, napping,
 * waving, typing and jumping onto windows. Click it, or pick it up and drop
 * it, and it gets angry and chases the cursor.
 * With a theme variation on, the theme's animal is its buddy and they play
 * together. Turning the variations on sends Tokkae running to say hello;
 * turning them off makes it cry.
 * With reduced motion it stands still in the corner and just announces, and
 * there's no buddy.
 */
export const Tokkae = ({
  nudge,
  theme,
}: {
  nudge: ThemeNudge | null;
  theme: Theme;
}) => {
  const reduceMotion = useReducedMotion();
  const layer = useRef<HTMLDivElement>(null);
  const root = useRef<HTMLDivElement>(null);
  const buddyEl = useRef<HTMLDivElement>(null);
  const bowlEl = useRef<HTMLSpanElement>(null);
  const heartTpl = useRef<HTMLSpanElement>(null);
  const brainRef = useRef<Brain | null>(null);
  const buddyRef = useRef<Buddy | null>(null);
  const themeRef = useRef(theme);
  const pointerRef = useRef<Pointer | null>(null);
  const [action, setAction] = useState<Action>("enter");
  const [notesOpen, setNotesOpen] = useState(true);
  const notesOpenRef = useRef(true);

  const closeNotes = () => {
    notesOpenRef.current = false;
    setNotesOpen(false);
  };

  useEffect(() => {
    themeRef.current = theme;
  }, [theme]);

  // Only the visitor's own switches; the saved choice on load is no news
  useEffect(() => {
    const brain = brainRef.current;
    if (!(brain && nudge)) {
      return;
    }
    brain.react(nudge.kind, performance.now());
  }, [nudge]);

  useEffect(() => {
    const el = root.current;
    if (!el) {
      return;
    }
    const frames = [...el.querySelectorAll(".tokkae-sprite > svg")];
    let shownFrame = 0;
    const showFrame = (i: number) => {
      if (i === shownFrame) {
        return;
      }
      frames[shownFrame]?.classList.add("is-off");
      frames[i]?.classList.remove("is-off");
      shownFrame = i;
    };

    if (reduceMotion) {
      const world = measure(el);
      el.style.transform = `translate(16px, ${world.vh - world.h - 4}px)`;
      el.dataset.side = "left";
      return;
    }

    const brain = new Brain(measure(el), Math.random() < 0.5, setAction);
    brainRef.current = brain;
    let prev = performance.now();
    let frame = 0;

    const moveBuddy = (dt: number, world: World, x: number, y: number) => {
      const buddy = buddyRef.current;
      const box = buddyEl.current;
      if (!(buddy && box)) {
        return;
      }
      const { current } = themeRef;
      const room = roomFor(box, current);
      const pose = buddy.step(dt, room, {
        action: brain.action,
        h: world.h,
        tagIt: brain.tagIt,
        w: world.w,
        x,
        y,
      });
      placeBuddy(box, pose, current.cfg?.native ?? 1);
      bowlEl.current?.classList.toggle("is-off", !pose.bowl);
      if (pose.heart && heartTpl.current && layer.current) {
        const jitter = (Math.random() - 0.5) * room.size * 0.3;
        const hx = pose.x + room.size / 2 + jitter;
        releaseHeart(heartTpl.current, layer.current, hx, pose.y);
      }
    };

    const tick = (now: number) => {
      const dt = Math.min(0.05, (now - prev) / 1000);
      prev = now;
      syncBuddy(brain, buddyRef, buddyEl.current, themeRef.current, now);
      const world = measure(el);
      const pose = brain.step(
        now,
        dt,
        world,
        pointerRef.current,
        notesOpenRef.current,
        buddyRef.current?.spot() ?? null
      );
      moveBuddy(dt, world, pose.x, pose.y);
      if (pose.closeNotes) {
        notesOpenRef.current = false;
        setNotesOpen(false);
      }
      showFrame(pose.frame);
      el.dataset.flip = pose.flip ? "1" : "0";
      el.dataset.side = pose.side;
      el.style.transform = `translate(${pose.x.toFixed(1)}px, ${pose.y.toFixed(1)}px)`;
      frame = requestAnimationFrame(tick);
    };

    const onMove = (e: PointerEvent) => {
      if (e.pointerType === "mouse") {
        pointerRef.current = {
          at: performance.now(),
          x: e.clientX,
          y: e.clientY,
        };
      }
    };
    window.addEventListener("pointermove", onMove, { passive: true });
    frame = requestAnimationFrame(tick);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("pointermove", onMove);
      brainRef.current = null;
      buddyRef.current = null;
    };
  }, [reduceMotion]);

  // A click makes it angry; a drag picks it up, and dropping it does too
  const onPointerDown = (e: ReactPointerEvent<HTMLDivElement>) => {
    const brain = brainRef.current;
    const el = root.current;
    const onNotes =
      e.target instanceof Element && e.target.closest(".patch-notes");
    if (!(brain && el) || onNotes || e.button !== 0) {
      return;
    }
    e.preventDefault();
    el.setPointerCapture(e.pointerId);
    const start = { x: e.clientX, y: e.clientY };
    let held = false;

    const move = (ev: PointerEvent) => {
      pointerRef.current = {
        at: performance.now(),
        x: ev.clientX,
        y: ev.clientY,
      };
      const far = Math.hypot(ev.clientX - start.x, ev.clientY - start.y) > 6;
      if (!held && far) {
        held = true;
        brain.grab(performance.now());
        el.classList.add("is-held");
      }
      if (held) {
        brain.holdAt(ev.clientX, ev.clientY, measure(el));
      }
    };
    const up = (ev: PointerEvent) => {
      pointerRef.current = {
        at: performance.now(),
        x: ev.clientX,
        y: ev.clientY,
      };
      if (held) {
        brain.release(performance.now());
      } else {
        brain.poke(performance.now());
      }
      el.classList.remove("is-held");
      el.removeEventListener("pointermove", move);
      el.removeEventListener("pointerup", up);
      el.removeEventListener("pointercancel", up);
    };
    el.addEventListener("pointermove", move);
    el.addEventListener("pointerup", up);
    el.addEventListener("pointercancel", up);
  };

  // With reduced motion Tokkae only ever announces
  const shown = reduceMotion ? "announce" : action;
  const showBuddy = Boolean(theme.animal) && !reduceMotion;

  return (
    <div className="tokkae-layer" ref={layer}>
      {showBuddy && (
        <div aria-hidden="true" className="buddy" ref={buddyEl}>
          <div className="buddy-body">
            {/* oxlint-disable-next-line next/no-img-element -- the theme's animal, as the cursor critter had it */}
            <img alt="" className={theme.cls} src={theme.animal ?? ""} />
          </div>
          <span className="buddy-bowl is-off" ref={bowlEl}>
            <Sprite rows={BOWL} />
          </span>
        </div>
      )}
      <span aria-hidden="true" className="buddy-heart is-off" ref={heartTpl}>
        <Sprite rows={HEART} />
      </span>
      <div
        className="tokkae"
        onPointerDown={onPointerDown}
        ref={root}
        title="tokkae"
      >
        <div className="tokkae-sprite">
          {FRAMES.map((rows, i) => (
            <Sprite hidden={i !== 0} key={rows.join("/")} rows={rows} />
          ))}
        </div>
        {shown === "announce" && notesOpen && (
          <PatchNotes onClose={closeNotes} />
        )}
      </div>
    </div>
  );
};
