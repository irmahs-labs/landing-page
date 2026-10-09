"use client";

import { useEffect, useRef, useState } from "react";
import type { PointerEvent as ReactPointerEvent } from "react";

import { useReducedMotion } from "@/hooks/use-reduced-motion";
import { CHANGELOG } from "@/lib/changelog";
import { FRAMES, runsOf } from "@/lib/tokkae";
import { Brain } from "@/lib/tokkae-brain";
import type { Action, Pointer, World } from "@/lib/tokkae-brain";

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
 * With reduced motion it stands still in the corner and just announces.
 */
export const Tokkae = () => {
  const reduceMotion = useReducedMotion();
  const root = useRef<HTMLDivElement>(null);
  const brainRef = useRef<Brain | null>(null);
  const pointerRef = useRef<Pointer | null>(null);
  const [action, setAction] = useState<Action>("enter");
  const [notesOpen, setNotesOpen] = useState(true);
  const notesOpenRef = useRef(true);

  const closeNotes = () => {
    notesOpenRef.current = false;
    setNotesOpen(false);
  };

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

    const tick = (now: number) => {
      const dt = Math.min(0.05, (now - prev) / 1000);
      prev = now;
      const pose = brain.step(
        now,
        dt,
        measure(el),
        pointerRef.current,
        notesOpenRef.current
      );
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

  return (
    <div className="tokkae-layer">
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
