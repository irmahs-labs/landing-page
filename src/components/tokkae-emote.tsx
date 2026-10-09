"use client";

import { useEffect, useRef } from "react";

import { useReducedMotion } from "@/hooks/use-reduced-motion";
import { ANIMS, FRAMES } from "@/lib/tokkae";

import { Sprite } from "./tokkae";

const FRAME_MS = 200;
const SING = ANIMS.sing;
// Each distinct frame drawn once, and the loop as positions in that list
const DRAWN = [...new Set(SING)];
const LOOP = SING.map((id) => DRAWN.indexOf(id));

/**
 * Tokkae singing at a mic stand, on loop, for when there's no music. With
 * reduced motion it holds the first frame.
 */
export const TokkaeEmote = () => {
  const reduceMotion = useReducedMotion();
  const root = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const el = root.current;
    if (!el || reduceMotion) {
      return;
    }
    const frames = [...el.querySelectorAll("svg")];
    let step = 0;
    const timer = setInterval(() => {
      frames[LOOP[step % LOOP.length] ?? 0]?.classList.add("is-off");
      step += 1;
      frames[LOOP[step % LOOP.length] ?? 0]?.classList.remove("is-off");
    }, FRAME_MS);
    return () => clearInterval(timer);
  }, [reduceMotion]);

  return (
    <span aria-hidden="true" className="emote" ref={root}>
      {DRAWN.map((id) => (
        <Sprite hidden={id !== SING[0]} key={id} rows={FRAMES[id] ?? []} />
      ))}
    </span>
  );
};
