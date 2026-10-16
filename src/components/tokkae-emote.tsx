"use client";

import { useEffect, useMemo, useRef } from "react";

import { useReducedMotion } from "@/hooks/use-reduced-motion";
import type { Anim } from "@/lib/tokkae";
import { ANIMS, FRAMES } from "@/lib/tokkae";

import { Sprite } from "./tokkae";

const FRAME_MS = 200;

/**
 * Tokkae singing at a mic stand, on loop, for when there's no music: plain
 * sing by default, or one of its other songs. With reduced motion it holds
 * the first frame.
 */
export const TokkaeEmote = ({ anim = "sing" }: { anim?: Anim }) => {
  const reduceMotion = useReducedMotion();
  const root = useRef<HTMLSpanElement>(null);
  // Each distinct frame drawn once, and the loop as positions in that list
  const { drawn, loop } = useMemo(() => {
    const frames = ANIMS[anim];
    const unique = [...new Set(frames)];
    return { drawn: unique, loop: frames.map((id) => unique.indexOf(id)) };
  }, [anim]);

  useEffect(() => {
    const el = root.current;
    if (!el || reduceMotion) {
      return;
    }
    const frames = [...el.querySelectorAll("svg")];
    let step = 0;
    const timer = setInterval(() => {
      frames[loop[step % loop.length] ?? 0]?.classList.add("is-off");
      step += 1;
      frames[loop[step % loop.length] ?? 0]?.classList.remove("is-off");
    }, FRAME_MS);
    return () => clearInterval(timer);
  }, [loop, reduceMotion]);

  return (
    <span aria-hidden="true" className="emote" key={anim} ref={root}>
      {drawn.map((id, i) => (
        <Sprite hidden={i !== loop[0]} key={id} rows={FRAMES[id] ?? []} />
      ))}
    </span>
  );
};
