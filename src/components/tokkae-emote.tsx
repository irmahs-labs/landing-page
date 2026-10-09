"use client";

import { useEffect, useRef } from "react";

import { useReducedMotion } from "@/hooks/use-reduced-motion";
import { ANIMS, FRAMES } from "@/lib/tokkae";
import type { Anim } from "@/lib/tokkae";

import { Sprite } from "./tokkae";

// The calm ones; no anger or walking off inside the player
const EMOTES = [
  "bug",
  "hop",
  "idle",
  "love",
  "nap",
  "sleepy",
  "type",
  "wag",
  "wave",
] as const satisfies readonly Anim[];

const FRAME_MS = 200;
// A new emote every 40 frames
const EMOTE_FRAMES = 40;

/** Any emote but the one playing, so it never seems to stall */
const pickAfter = (last: Anim | null): Anim => {
  const options = EMOTES.filter((e) => e !== last);
  return options[Math.floor(Math.random() * options.length)] ?? "idle";
};

/**
 * Tokkae doing something at random, a new emote every eight seconds, for
 * when there's no music. With reduced motion it holds one still frame.
 */
export const TokkaeEmote = () => {
  const reduceMotion = useReducedMotion();
  const root = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const el = root.current;
    if (!el) {
      return;
    }
    const frames = [...el.querySelectorAll("svg")];
    let shown = 0;
    const show = (i: number) => {
      if (i === shown) {
        return;
      }
      frames[shown]?.classList.add("is-off");
      frames[i]?.classList.remove("is-off");
      shown = i;
    };

    // Picked after hydration, so the server and the browser agree
    let emote = pickAfter(null);
    show(ANIMS[emote][0] ?? 0);
    if (reduceMotion) {
      return;
    }
    let step = 0;
    const timer = setInterval(() => {
      step += 1;
      if (step % EMOTE_FRAMES === 0) {
        emote = pickAfter(emote);
      }
      const anim = ANIMS[emote];
      show(anim[step % anim.length] ?? 0);
    }, FRAME_MS);
    return () => clearInterval(timer);
  }, [reduceMotion]);

  return (
    <span aria-hidden="true" className="emote" ref={root}>
      {FRAMES.map((rows, i) => (
        <Sprite hidden={i !== 0} key={rows.join("/")} rows={rows} />
      ))}
    </span>
  );
};
