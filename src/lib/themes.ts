const stripes = (a: string, b: string) =>
  `repeating-linear-gradient(-45deg, ${a} 0 10px, ${b} 10px 20px)`;

export const PATTERN_IMG = {
  coinLattice: { file: "coin-lattice.svg", size: 96 },
  fairisle: { file: "fairisle.svg", size: 48 },
  jogakbo: { file: "jogakbo.svg", size: 120 },
  kawung: { file: "kawung.svg", size: 72 },
  kikko: { file: "kikko.svg", size: 72 },
  treillage: { file: "treillage.svg", size: 60 },
} as const;

type PatternImg = keyof typeof PATTERN_IMG;

interface ThemeColors {
  alt: string;
  bar?: string;
  barGrid?: string;
  body: string;
  muted: string;
  panel: string;
}

/** How the theme's animal moves: which way its image faces, its size and speed */
interface CritterConfig {
  native: 1 | -1;
  size: number;
  speed: number;
}

interface ThemeDef {
  c: ThemeColors;
  cfg?: CritterConfig;
  cls?: "flap" | "hop";
  label: string;
  pattern?: string;
  patternImg?: PatternImg;
  special?: true;
  stripes: string;
  swatch: string;
}

const DEFS = {
  amaterasu: {
    c: { alt: "#e18c86", body: "#f2cdc9", muted: "#743630", panel: "#fae9e7" },
    cfg: { native: -1, size: 96, speed: 120 },
    cls: "flap",
    label: "Amaterasu · red",
    patternImg: "kikko",
    stripes: stripes("#c8312b", "#f2c9c3"),
    swatch: "#c8312b",
  },
  amelie: {
    c: { alt: "#abcf9b", body: "#d4e7cb", muted: "#455745", panel: "#ecf5e7" },
    cfg: { native: -1, size: 96, speed: 90 },
    cls: "hop",
    label: "Amélie · green",
    patternImg: "treillage",
    stripes: stripes("#9cc58a", "#cfe5c2"),
    swatch: "#9cc58a",
  },
  aurore: {
    c: { alt: "#f4cd53", body: "#fae6aa", muted: "#605d33", panel: "#fdf5db" },
    cfg: { native: 1, size: 96, speed: 120 },
    cls: "flap",
    label: "Aurore · yellow",
    pattern:
      "linear-gradient(135deg, #3b4a42 25%, transparent 25%) -36px 0 / 72px 72px, linear-gradient(225deg, #3b4a42 25%, transparent 25%) -36px 0 / 72px 72px, linear-gradient(315deg, #3b4a42 25%, transparent 25%) 0 0 / 72px 72px, linear-gradient(45deg, #3b4a42 25%, transparent 25%) 0 0 / 72px 72px, transparent",
    stripes: stripes("#f2c230", "#f9e7a6"),
    swatch: "#f2c230",
  },
  boba: {
    c: {
      alt: "#c9a585",
      bar: "#2b1d17",
      barGrid: "#3f2c23",
      body: "#f2e6db",
      muted: "#6a4430",
      panel: "#fcf7f2",
    },
    label: "boba tea",
    special: true,
    stripes: stripes("#2b1d17", "#c9a585"),
    swatch: "#e9d5c3",
  },
  cailleach: {
    c: { alt: "#a4a9a4", body: "#d3d7d3", muted: "#3a403c", panel: "#e9ece9" },
    cfg: { native: 1, size: 96, speed: 120 },
    cls: "flap",
    label: "The Cailleach Bheur · black",
    patternImg: "fairisle",
    stripes: stripes("#0f1110", "#4e6152"),
    swatch: "#0f1110",
  },
  dewisri: {
    c: { alt: "#f5a351", body: "#fad3ab", muted: "#564b32", panel: "#fdf0df" },
    cfg: { native: 1, size: 130, speed: 70 },
    cls: "hop",
    label: "Dewi Sri · orange",
    patternImg: "kawung",
    stripes: stripes("#f28c28", "#fbd9b0"),
    swatch: "#f28c28",
  },
  hafdis: {
    c: { alt: "#7ea6d2", body: "#c4d8ec", muted: "#344d5b", panel: "#e4eef8" },
    cfg: { native: -1, size: 96, speed: 90 },
    cls: "hop",
    label: "Hafdís · blue",
    pattern:
      "linear-gradient(45deg, #3b4a42 25%, transparent 25%) 0 0 / 56px 56px, linear-gradient(-45deg, #3b4a42 25%, transparent 25%) 0 0 / 56px 56px, transparent",
    stripes: stripes("#3f78b5", "#bcd5ee"),
    swatch: "#3f78b5",
  },
  longxi: {
    c: { alt: "#ddb84f", body: "#efdca7", muted: "#505132", panel: "#faf2d9" },
    cfg: { native: -1, size: 130, speed: 70 },
    cls: "hop",
    label: "Empress Longxi · gold",
    patternImg: "coinLattice",
    stripes: stripes("#d4a72c", "#f3dea0"),
    swatch: "#d4a72c",
  },
  manasa: {
    c: { alt: "#c5ccd2", body: "#e3e6e9", muted: "#525c65", panel: "#f4f5f7" },
    cfg: { native: 1, size: 96, speed: 90 },
    cls: "hop",
    label: "Manasa Devi · silver",
    pattern:
      "radial-gradient(circle at 50% 100%, transparent 0 20px, #3b4a42 22px 28px, transparent 30px) 0 0 / 56px 40px, radial-gradient(circle at 50% 100%, transparent 0 20px, #3b4a42 22px 28px, transparent 30px) 28px 20px / 56px 40px, transparent",
    stripes: stripes("#b8c0c8", "#e3e7ea"),
    swatch: "#b8c0c8",
  },
  odette: {
    c: { alt: "#e995b3", body: "#f5cddb", muted: "#53484a", panel: "#fcedf3" },
    cfg: { native: 1, size: 96, speed: 90 },
    cls: "hop",
    label: "Odette · pink",
    pattern:
      "radial-gradient(circle at 50% 100%, #3b4a42 0 24px, transparent 26px) 0 0 / 56px 48px, radial-gradient(circle, #3b4a42 0 6.4px, transparent 8px) 28px 12px / 56px 48px, transparent",
    stripes: stripes("#e27aa0", "#f8d3e0"),
    swatch: "#e27aa0",
  },
  siewlan: {
    c: { alt: "#add6be", body: "#ddeee4", muted: "#3a674d", panel: "#fbfdfb" },
    cfg: { native: -1, size: 96, speed: 90 },
    cls: "hop",
    label: "Siew Lan · white",
    pattern:
      "radial-gradient(circle, #3b4a42 0 8px, transparent 10px) 0 0 / 40px 40px, radial-gradient(circle, transparent 0 20px, #3b4a42 20px 26px, transparent 28px) 20px 20px / 80px 80px, transparent",
    stripes: stripes("#ffffff", "#cfe7d8"),
    swatch: "#ffffff",
  },
  tevy: {
    c: { alt: "#c3a489", body: "#e5d4c6", muted: "#584937", panel: "#f1e7dd" },
    cfg: { native: -1, size: 130, speed: 70 },
    cls: "hop",
    label: "Tevy · brown",
    pattern:
      "linear-gradient(90deg, #3b4a4299 50%, transparent 50%) 0 0 / 64px 64px, linear-gradient(#3b4a4299 50%, transparent 50%) 0 0 / 64px 64px, transparent",
    stripes: stripes("#8a5a3b", "#dcc3ab"),
    swatch: "#8a5a3b",
  },
  yeonhwa: {
    c: { alt: "#bb9ed9", body: "#e0d3ef", muted: "#4f4662", panel: "#f1eaf9" },
    cfg: { native: -1, size: 96, speed: 90 },
    cls: "hop",
    label: "Yeon-hwa · purple",
    patternImg: "jogakbo",
    stripes: stripes("#8a5bb8", "#dccbef"),
    swatch: "#8a5bb8",
  },
} satisfies Record<string, ThemeDef>;

export type ThemeId = keyof typeof DEFS;

export interface Theme extends ThemeDef {
  animal: string | null;
  flower: string | null;
  id: ThemeId;
}

// SAFETY: built from Object.entries(DEFS), so there is exactly one entry per ThemeId
export const THEMES = Object.fromEntries(
  Object.entries(DEFS).map(([id, def]: [string, ThemeDef]) => [
    id,
    {
      ...def,
      animal: def.special ? null : `/assets/animals/${id}.png`,
      flower: def.special ? null : `/assets/flowers/${id}.png`,
      id,
    },
  ])
) as Record<ThemeId, Theme>;

// Swatch order in the picker, as in the design
export const THEME_ORDER: readonly ThemeId[] = [
  "siewlan",
  "cailleach",
  "amaterasu",
  "dewisri",
  "aurore",
  "amelie",
  "hafdis",
  "yeonhwa",
  "odette",
  "tevy",
  "longxi",
  "manasa",
];

export const DEFAULT_THEME: ThemeId = "amelie";

const darken = (hex: string, k: number) =>
  `#${[1, 3, 5]
    .map((i) =>
      Math.round(Number.parseInt(hex.slice(i, i + 2), 16) * k)
        .toString(16)
        .padStart(2, "0")
    )
    .join("")}`;

/** The CSS custom properties a theme sets on <html> */
export const themeVars = (th: Theme) => ({
  "--alt": th.c.alt,
  "--bar": th.c.bar ?? "#3b4a42",
  "--bar-grid": th.c.barGrid ?? "#4e6152",
  "--body": th.c.body,
  "--ground": darken(th.c.body, 0.92),
  "--muted": th.c.muted,
  "--panel": th.c.panel,
  "--stripes": th.stripes,
});
