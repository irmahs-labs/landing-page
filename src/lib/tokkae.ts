/**
 * Tokkae, the pixel gecko, drawn from the 11 × 13 sprite in the personal
 * brand canvas. Each frame is one row of characters per pixel row; the base
 * faces left, with its tail on the right.
 */

const PALETTE = {
  O: "#f2d27a",
  Y: "#fff3cf",
  b: "#f3f1c8",
  d: "#5c8f48",
  g: "#b8d970",
  k: "#2f3b34",
  p: "#d9786a",
  r: "#e0574b",
} satisfies Record<string, string>;

const BASE = [
  "..ggggY....",
  ".ggdgYOY...",
  "gdggggYgg..",
  "ggkgggkgg..",
  "ppgggggpp..",
  ".pgggggp...",
  "..dgggd....",
  "dggbbbggd..",
  "..gbbbg...g",
  "..gbbbg..g.",
  "..ggbgggg..",
  "..ggggg....",
  ".dd...dd...",
];

/** The base with some rows swapped out, by row index */
const variant = (rows: Record<number, string>) =>
  BASE.map((row, y) => rows[y] ?? row);

export const FRAMES = {
  blink: variant({ 3: "ggggggggg.." }),
  chomp: variant({ 5: ".pgkkkgp...", 6: "..dgkgd...." }),
  idle: BASE,
  jump: variant({
    12: "..d.....d..",
    6: "d.dgggd.d..",
    7: ".ggbbbgg...",
  }),
  type1: variant({ 7: ".ggbbbggd..", 8: ".dgbbbg...g" }),
  type2: variant({ 7: "dggbbbgg...", 8: "..gbbbgd..g" }),
  walk1: BASE,
  walk2: variant({
    12: "..dd.dd....",
    7: ".ggbbbgg...",
    8: "d.gbbbg.d.g",
  }),
  wave1: variant({
    4: "ppgggggppd.",
    5: ".pgggggp.d.",
    6: "..dgggd.d..",
    7: "dggbbbgg...",
  }),
  wave2: variant({
    4: "ppgggggpp.d",
    5: ".pgggggp.d.",
    6: "..dgggd.d..",
    7: "dggbbbgg...",
  }),
};

export type TokkaeFrame = keyof typeof FRAMES;

export const FRAME_NAMES: readonly TokkaeFrame[] = [
  "blink",
  "chomp",
  "idle",
  "jump",
  "type1",
  "type2",
  "walk1",
  "walk2",
  "wave1",
  "wave2",
];

const isPaletteKey = (ch: string): ch is keyof typeof PALETTE =>
  Object.hasOwn(PALETTE, ch);

export const BUG = [".k.k.", "krrrk", ".rrr.", "k.k.k"];

export const SPRITE_W = 11;
export const SPRITE_H = 13;

export interface PixelRun {
  color: string;
  w: number;
  x: number;
  y: number;
}

/** A frame as horizontal runs of one colour, ready to draw as SVG rects */
export const runsOf = (rows: readonly string[]) => {
  const runs: PixelRun[] = [];
  for (const [y, row] of rows.entries()) {
    let x = 0;
    while (x < row.length) {
      const ch = row.charAt(x);
      let end = x;
      while (row.charAt(end + 1) === ch) {
        end += 1;
      }
      if (isPaletteKey(ch)) {
        runs.push({ color: PALETTE[ch], w: end - x + 1, x, y });
      }
      x = end + 1;
    }
  }
  return runs;
};
