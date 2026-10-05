"use client";

import { useEffect, useRef, useState } from "react";

import { useReducedMotion } from "@/hooks/use-reduced-motion";
import { CHANGELOG } from "@/lib/changelog";
import { BUG, FRAME_NAMES, FRAMES, runsOf } from "@/lib/tokkae";
import { Brain } from "@/lib/tokkae-brain";
import type { Action, Pointer, World } from "@/lib/tokkae-brain";

import { Window } from "./window";

const Sprite = ({
  className,
  rows,
}: {
  className?: string;
  rows: readonly string[];
}) => (
  <svg
    aria-hidden="true"
    className={className}
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
 * waving, typing, jumping onto windows, and running after the cursor.
 * With reduced motion it stands still in the corner and just announces.
 */
export const Tokkae = () => {
  const reduceMotion = useReducedMotion();
  const root = useRef<HTMLDivElement>(null);
  const bugRef = useRef<HTMLDivElement>(null);
  const [action, setAction] = useState<Action>("enter");
  const [notesOpen, setNotesOpen] = useState(true);
  const notesOpenRef = useRef(true);

  const closeNotes = () => {
    notesOpenRef.current = false;
    setNotesOpen(false);
  };

  useEffect(() => {
    const el = root.current;
    const bug = bugRef.current;
    if (!(el && bug)) {
      return;
    }
    if (reduceMotion) {
      const world = measure(el);
      el.style.transform = `translate(16px, ${world.vh - world.h - 4}px)`;
      el.dataset.frame = "idle";
      el.dataset.side = "left";
      return;
    }

    const brain = new Brain(measure(el), Math.random() < 0.5, setAction);
    let pointer: Pointer | null = null;
    let prev = performance.now();
    let frame = 0;

    const tick = (now: number) => {
      const dt = Math.min(0.05, (now - prev) / 1000);
      prev = now;
      const pose = brain.step(
        now,
        dt,
        measure(el),
        pointer,
        notesOpenRef.current
      );
      if (pose.closeNotes) {
        notesOpenRef.current = false;
        setNotesOpen(false);
      }
      el.dataset.frame = pose.frame;
      el.dataset.flip = pose.flip ? "1" : "0";
      el.dataset.side = pose.side;
      el.style.transform = `translate(${pose.x.toFixed(1)}px, ${pose.y.toFixed(1)}px)`;
      bug.hidden = !pose.bug;
      if (pose.bug) {
        bug.style.transform = `translate(${(pose.bug.x - bug.offsetWidth / 2).toFixed(1)}px, ${(pose.bug.y - bug.offsetHeight).toFixed(1)}px)`;
      }
      frame = requestAnimationFrame(tick);
    };

    const onMove = (e: PointerEvent) => {
      if (e.pointerType === "mouse") {
        pointer = { at: performance.now(), x: e.clientX, y: e.clientY };
      }
    };
    window.addEventListener("pointermove", onMove, { passive: true });
    frame = requestAnimationFrame(tick);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("pointermove", onMove);
    };
  }, [reduceMotion]);

  // With reduced motion Tokkae only ever announces
  const shown = reduceMotion ? "announce" : action;

  return (
    <div className="tokkae-layer">
      <div className="tokkae-bug" hidden ref={bugRef}>
        <Sprite rows={BUG} />
      </div>
      <div className="tokkae" data-frame="walk1" ref={root}>
        <div className="tokkae-sprite">
          {FRAME_NAMES.map((name) => (
            <Sprite
              className={`frame frame-${name}`}
              key={name}
              rows={FRAMES[name]}
            />
          ))}
        </div>
        {shown === "type" && <span className="tokkae-keyboard" />}
        {shown === "sleep" && (
          <span aria-hidden="true" className="tokkae-zzz">
            <i>z</i>
            <i>z</i>
            <i>Z</i>
          </span>
        )}
        {shown === "announce" && notesOpen && (
          <PatchNotes onClose={closeNotes} />
        )}
      </div>
    </div>
  );
};
