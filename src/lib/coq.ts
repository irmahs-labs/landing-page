import type { Action } from "./tokkae-brain";

/**
 * Coq, Tokkae's friend, from the Tokkae design system: a white French
 * rooster with a blue tail and a red comb, in the same 18 × 17 frame as
 * Tokkae with its feet on the same row, facing right. Every frame is copied
 * from the system's sheets (coq-idle, coq-walk, coq-peck, coq-crow and
 * coq-hop) in Tokkae's colour keys, and drawn once however often it plays.
 */
export const COQ_FRAMES: readonly (readonly string[])[] = [
  [
    "..................",
    "..................",
    "........r.r.......",
    "..w.w..rrrr.......",
    "..www.WWWWWW......",
    "...ww.WWWWkWOO....",
    "...wwwWWWpWWO.....",
    "....wwWWWWWr......",
    "....wWWWWWWr......",
    "....WWWbbWWW......",
    "....WWbbbWWW......",
    "....WWWbbWWW......",
    ".....WWWWWW.......",
    ".......O..O.......",
    ".......OO.OO......",
    "..................",
    "..................",
  ],
  [
    "..................",
    "..................",
    "........r.r.......",
    "..w.w..rrrr.......",
    "..www.WWWWWW......",
    "...ww.WWWWWWOO....",
    "...wwwWWWpWWO.....",
    "....wwWWWWWr......",
    "....wWWWWWWr......",
    "....WWWbbWWW......",
    "....WWbbbWWW......",
    "....WWWbbWWW......",
    ".....WWWWWW.......",
    ".......O..O.......",
    ".......OO.OO......",
    "..................",
    "..................",
  ],
  [
    "..................",
    "..................",
    "........r.r.......",
    "..w.w..rrrr.......",
    "..www.WWWWWW......",
    "...ww.WWWWkWOO....",
    "...wwwWWWpWWO.....",
    "....wwWWWWWr......",
    "....wWWWWWWr......",
    "....WWWbbWWW......",
    "....WWbbbWWW......",
    "....WWWbbWWW......",
    ".....WWWWWW.......",
    "........O..O......",
    "........OO.OO.....",
    "..................",
    "..................",
  ],
  [
    "..................",
    "..................",
    "........r.r.......",
    "..w.w..rrrr.......",
    "..www.WWWWWW......",
    "...ww.WWWWkWOO....",
    "...wwwWWWpWWO.....",
    "....wwWWWWWr......",
    "....wWWWWWWr......",
    "....WWWbbWWW......",
    "....WWbbbWWW......",
    "....WWWbbWWW......",
    ".....WWWWWW.......",
    ".......O..O....O..",
    ".......OO.OO..O.O.",
    "..................",
    "..................",
  ],
  [
    "..................",
    "..................",
    "..................",
    "..w.w...r.r.......",
    "..www..rrrr.......",
    "...ww.WWWWWW......",
    "...wwwWWWWkWOO....",
    "....wwWWWpWWO.....",
    "....wWWWWWWr......",
    "....WWWWWWWr......",
    "....WWbbbWWW......",
    "....WWWbbWWW......",
    ".....WWWWWW.......",
    ".......O..O....O..",
    ".......OO.OO..O.O.",
    "..................",
    "..................",
  ],
  [
    "..................",
    "..................",
    "..................",
    "..w.w.............",
    "..www....r.r......",
    "...ww...rrrr......",
    "...www.WWWWWW.....",
    "....ww.WWWWkWOO...",
    "....wW.WWWpWWO....",
    "....WWWWWWWWr.....",
    "....WWbWWWWWr.....",
    "....WWWbbWWW......",
    ".....WWWWWW.......",
    ".......O..O....O..",
    ".......OO.OO....O.",
    "..................",
    "..................",
  ],
  [
    "..................",
    "..................",
    "..................",
    "..w.w...r.r.......",
    "..www..rrrr.......",
    "...ww.WWWWWW......",
    "...wwwWWWWkWOO....",
    "....wwWWWpWWO.....",
    "....wWWWWWWr......",
    "....WWWWWWWr......",
    "....WWbbbWWW......",
    "....WWWbbWWW......",
    ".....WWWWWW.......",
    ".......O..O....O..",
    ".......OO.OO....O.",
    "..................",
    "..................",
  ],
  [
    "..................",
    "..................",
    "........r.r.......",
    "..w.w..rrrr.......",
    "..www.WWWWWW......",
    "...ww.WWWWkWOO....",
    "...wwwWWWpWWO.....",
    "....wwWWWWWr......",
    "....wWWWWWWr......",
    "....WWWbbWWW......",
    "....WWbbbWWW......",
    "....WWWbbWWW......",
    ".....WWWWWW.......",
    ".......O..O....O..",
    ".......OO.OO....O.",
    "..................",
    "..................",
  ],
  [
    "..................",
    "..................",
    "........r.r.......",
    "..w.w..rrrr.......",
    "..www.WWWWWW......",
    "...ww.WWWWWWOO....",
    "...wwwWWWpWWO.....",
    "....wwWWWWWr......",
    "....wWWWWWWr......",
    "....WWWbbWWW......",
    "....WWbbbWWW......",
    "....WWWbbWWW......",
    ".....WWWWWW.......",
    ".......O..O....O..",
    ".......OO.OO....O.",
    "..................",
    "..................",
  ],
  [
    "..................",
    "........r.r.......",
    "..w.w..rrrr.......",
    "..www.WWWWWW...r..",
    "...ww.WWWWkWOO.rr.",
    "...wwwWWWpWW...r..",
    "....wwWWWWWrOO....",
    "....wWWWWWWr......",
    "....WWWbbWWW......",
    "....WWbbbWWW......",
    "....WWWbbWWW......",
    ".....WWWWWW.......",
    ".......O..O.......",
    ".......OO.OO......",
    "..................",
    "..................",
    "..................",
  ],
  [
    "..................",
    "........r.r......r",
    "..w.w..rrrr....rr.",
    "..www.WWWWWW......",
    "...ww.WWWWkWOO.rrr",
    "...wwwWWWpWW......",
    "....wwWWWWWrOO.rr.",
    "....wWWWWWWr.....r",
    "....WWWbbWWW......",
    "....WWbbbWWW......",
    "....WWWbbWWW......",
    ".....WWWWWW.......",
    ".......O..O.......",
    ".......OO.OO......",
    "..................",
    "..................",
    "..................",
  ],
  [
    "..................",
    "..................",
    "........r.r.......",
    "..w.w..rrrr....r..",
    "..www.WWWWWW...rr.",
    "...ww.WWWWkWOO.r..",
    "...wwwWWWpWW......",
    "....wwWWWWWrOO....",
    "....wWWWWWWr......",
    "....WWWbbWWW......",
    "....WWbbbWWW......",
    "....WWWbbWWW......",
    ".....WWWWWW.......",
    ".......O..O.......",
    ".......OO.OO......",
    "..................",
    "..................",
  ],
  [
    "..................",
    "........r.r.......",
    "..w.w..rrrr.......",
    "..www.WWWWWW......",
    "...ww.WWWWkWOO....",
    "...wwwWWWpWWO.....",
    "....wwWWWWWr......",
    "....wWWWWWWr......",
    "....WWWbbWWW......",
    "....WWbbbWWW......",
    "....WWWbbWWW......",
    ".....WWWWWW.......",
    ".......O..O.......",
    ".......OO.OO......",
    "..................",
    "..................",
    "..................",
  ],
  [
    "........r.r.......",
    "..w.w..rrrr.......",
    "..www.WWWWWW......",
    "...ww.WWWWkWOO....",
    "...wwwWWWpWWO.....",
    "....wwWWWWWr......",
    "....wWWWWWWr......",
    "....WWWbbWWW......",
    "....WWbbbWWW......",
    "....WWWbbWWW......",
    ".....WWWWWW.......",
    ".......O..O.......",
    ".......OO.OO......",
    "..................",
    "..................",
    "..................",
    "..................",
  ],
];

/** Each animation: its frames, as indexes into COQ_FRAMES, and frame time */
export const COQ_ANIMS = {
  crow: { ms: 200, seq: [0, 9, 10, 10, 11, 0, 0, 0] },
  hop: { ms: 200, seq: [0, 0, 12, 13, 13, 12, 0, 0] },
  idle: {
    ms: 200,
    seq: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 1],
  },
  peck: { ms: 200, seq: [3, 4, 5, 6, 7, 8] },
  walk: { ms: 150, seq: [0, 2] },
} as const satisfies Record<string, { ms: number; seq: readonly number[] }>;

export type CoqAnim = keyof typeof COQ_ANIMS;

/** What Coq is up to, as its animation needs it */
export interface CoqDoing {
  /** What Tokkae is doing, which Coq joins in with */
  action: Action;
  /** Pecking at seeds beside Tokkae, at a picnic */
  eating: boolean;
  moving: boolean;
}

/**
 * Which animation Coq plays: it pecks at a picnic and struts while it
 * moves; standing beside Tokkae, it crows hello and hops while they trade
 * hearts, and otherwise stands about, blinking.
 */
export const coqAnim = ({ action, eating, moving }: CoqDoing): CoqAnim => {
  if (eating) {
    return "peck";
  }
  if (moving) {
    return "walk";
  }
  if (action === "hello" || action === "greet") {
    return "crow";
  }
  return action === "hearts" ? "hop" : "idle";
};

/** The frame of `anim` to show `elapsed` ms after it started */
export const coqFrame = (anim: CoqAnim, elapsed: number) => {
  const { ms, seq } = COQ_ANIMS[anim];
  return seq[Math.floor(elapsed / ms) % seq.length] ?? 0;
};
