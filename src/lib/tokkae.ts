/**
 * Tokkae, the pixel gecko, from the Tokkae design system: a 12 × 13 sprite
 * drawn into an 18 × 17 frame that leaves room for its props (the bug, the
 * pc, the z's). Every frame is composed from a base sprite plus pixel edits
 * and props, never a new drawing. The base faces right.
 */

// Tokkae's colours, every one a Cute Matcha colour (its token in brackets)
const PALETTE = {
  // Romduol (gold)
  O: "#f2d27a",
  // Bubble (white)
  W: "#ffffff",
  // Belly (cream)
  b: "#fff3cf",
  // Spots (moss)
  d: "#5c8f48",
  // Body (accent-soft)
  g: "#b8d970",
  // Eyes (on-accent)
  k: "#2f3b34",
  // Blush (terracotta)
  p: "#d9786a",
  // Heart (danger)
  r: "#f0675c",
  // Tongue (terracotta)
  t: "#d9786a",
  // Screen (focus)
  w: "#4a7fc0",
  // The bug and the mic, drawn in eyes
  x: "#2f3b34",
  // Z's, sparkles and keys (belly)
  z: "#fff3cf",
} satisfies Record<string, string>;

export const GRID_W = 18;
export const GRID_H = 17;

const STAND = [
  "..gggggbg...",
  ".gggdgbObg..",
  ".gdggggbgg..",
  ".ggkgggkgg..",
  ".ppgggggpp..",
  "..pgggggp...",
  "...ddOdd....",
  ".dggbbbggd..",
  "...gbbbg...g",
  "...gbbbg..g.",
  "...ggbgggg..",
  "...ggggg....",
  "..dd...dd...",
];

// Lying down, for naps
const LIE = [
  "...........g..",
  "............g.",
  "..gggggbg....g",
  ".gggdgbObg...g",
  ".gdggggbgggggg",
  ".gkkgggkkggggg",
  ".ppgggggppgggg",
  "..pgggggpggggg",
  "..ggd.dgggddg.",
];

// Side on, facing the pc, for typing
const SIDE = [
  "....gbggg..",
  "...gbObggg.",
  "..gggbggggg",
  "..ggggggkgg",
  "..gggppgggg",
  "...gggpggg.",
  "....ddddO..",
  "....gggbbgd",
  "g...gggggd.",
  ".g..gggbb..",
  "..ggggggb..",
  "....gggggdd",
];

const SIDE_B = [
  ...SIDE.slice(0, 7),
  "....gggggd.",
  "g...gggbbgd",
  ...SIDE.slice(9),
];

export const HEART = ["rr.rr", "rrrrr", ".rrr.", "..r.."];

// An eighth note: flag top right, head bottom left
const NOTE = [".kk", ".k.", ".k.", "kk."];

/** A pixel: row, column, colour key */
type Px = readonly [number, number, string];

interface FrameSpec {
  dx?: number;
  dy?: number;
  /** Pixels changed on the sprite, in sprite coordinates */
  edits?: readonly Px[];
  /** Props drawn over everything, in frame coordinates */
  extra?: readonly Px[];
  sprite?: readonly string[];
  /** Props drawn behind the sprite, in frame coordinates */
  under?: readonly Px[];
}

const box = (y: number, x: number, w: number, h: number, ch: string) => {
  const out: Px[] = [];

  for (let j = 0; j < h; j += 1) {
    for (let i = 0; i < w; i += 1) {
      out.push([y + j, x + i, ch]);
    }
  }

  return out;
};

const stamp = (sprite: readonly string[], x0: number, y0: number) => {
  const out: Px[] = [];

  for (const [y, row] of sprite.entries()) {
    for (const [x, ch] of [...row].entries()) {
      if (ch !== ".") {
        out.push([y0 + y, x0 + x, ch]);
      }
    }
  }

  return out;
};

const rep = (f: FrameSpec, n: number): FrameSpec[] =>
  Array.from({ length: n }, () => f);

const paint = (pts: readonly (readonly [number, number])[], ch: string) =>
  pts.map(([y, x]): Px => [y, x, ch]);

const z = (pts: readonly (readonly [number, number])[]) => paint(pts, "z");

const bubble = (y: number, x: number, n: number): Px[] => {
  if (n === 1) {
    return [[y, x, "W"]];
  }

  if (n === 2) {
    return box(y, x, 2, 2, "W");
  }

  return [
    [y, x + 1, "W"],
    [y + 1, x, "W"],
    [y + 1, x + 2, "W"],
    [y + 2, x + 1, "W"],
  ];
};

const blink: Px[] = [
  [3, 3, "g"],
  [3, 7, "g"],
];

const shut: Px[] = [
  [3, 2, "k"],
  [3, 3, "k"],
  [3, 7, "k"],
  [3, 8, "k"],
];

const raisedArm: Px[] = [
  [7, 8, "."],
  [7, 9, "."],
  [6, 8, "g"],
  [5, 9, "d"],
];

const tailSwung: Px[] = [
  [10, 9, "g"],
  [9, 10, "."],
  [8, 11, "."],
  [10, 10, "g"],
  [10, 11, "g"],
];

const stepping: Px[] = [
  [12, 2, "."],
  [12, 4, "d"],
  [12, 8, "."],
  [12, 6, "d"],
];

const tongue = (n: number): Px[] =>
  Array.from({ length: n }, (_, i): Px => [5, 9 + i, "t"]);

const bug = (y: number, x: number): Px[] => [[y, x, "x"]];
const heart = (x: number, y: number) => stamp(HEART, x, y);

const note = (x: number, y: number, ch: string): Px[] =>
  stamp(NOTE, x, y).map(([py, px]): Px => [py, px, ch]);

// The angry emote, on the standing sprite: slanted brows, red cheeks, a mark
const fuming: Px[] = [
  [2, 2, "k"],
  [3, 3, "k"],
  [2, 8, "k"],
  [3, 7, "k"],
  [4, 1, "r"],
  [4, 2, "r"],
  [4, 8, "r"],
  [4, 9, "r"],
  [5, 2, "r"],
  [5, 8, "r"],
];

const angerMark: Px[] = [
  [0, 13, "r"],
  [0, 15, "r"],
  [1, 14, "r"],
  [2, 13, "r"],
  [2, 15, "r"],
];

const pc = [
  ...box(5, 13, 5, 7, "k"),
  ...box(6, 14, 3, 5, "w"),
  ...box(12, 15, 1, 3, "k"),
  ...box(15, 14, 3, 1, "k"),
];

const keys = box(12, 9, 4, 1, "k");

// Singing, in frame coordinates: a mic stand to the right of Tokkae's face
const micStand: Px[] = [
  ...box(6, 13, 2, 2, "x"),
  [6, 13, "W"],
  ...box(8, 14, 1, 7, "k"),
  ...box(15, 12, 5, 1, "k"),
];

// The right arm reaching out to hold the stand, in sprite coordinates
const holdingStand: Px[] = [
  [7, 9, "g"],
  [7, 10, "g"],
  [7, 11, "d"],
];

const singing = (eyes: readonly Px[] = []): Px[] => [...holdingStand, ...eyes];

// Surprise, in frame coordinates: a red "!" up by the top of its head
const bang: Px[] = [...box(0, 13, 1, 3, "r"), [4, 13, "r"]];

// Crying, on the standing sprite: eyes squeezed shut, tears on its cheeks
const sobbing: Px[] = [...shut, [4, 3, "w"], [4, 7, "w"]];

// Tears spraying out to both sides, in frame coordinates, in three stages
const tearsA = paint(
  [
    [5, 2],
    [5, 12],
  ],
  "w"
);

const tearsB = paint(
  [
    [5, 2],
    [6, 1],
    [5, 12],
    [6, 13],
  ],
  "w"
);

const tearsC = paint(
  [
    [6, 1],
    [8, 0],
    [6, 13],
    [8, 14],
  ],
  "w"
);

const screen = (pts: readonly (readonly [number, number])[]): Px[] => [
  ...pc,
  ...z(pts),
];

// ---------- songs ----------
// Every song is sing's eight frames: the mic stand and two notes rising on
// the right, and its own props in the free space on the left and along the
// top of the frame, in frame coordinates.

/** Where sing's two notes float, one per frame */
const NOTE_PATH = [
  [15, 2],
  [15, 1],
  [15, 0],
  [15, -1],
  [14, 2],
  [14, 1],
  [14, 0],
  [14, -1],
] as const;

interface SongStyle {
  /** Bobs up on frames 4 and 5, as plain sing does */
  bounce?: boolean;
  /** The face for frame i, as edits on the standing sprite */
  face?: (i: number) => readonly Px[];
  /** The first note's colour, then the second's */
  notes?: readonly [string, string];
  /** The props for frame i, in frame coordinates */
  props?: (i: number) => readonly Px[];
}

/** Eyes shut while it holds the long note, as in plain sing */
const singFace = (i: number) => (i >= 4 && i <= 6 ? shut : []);

const song = ({
  bounce = true,
  face = singFace,
  notes = ["w", "r"],
  props = () => [],
}: SongStyle): FrameSpec[] =>
  NOTE_PATH.map(([x, y], i) => ({
    dy: bounce && (i === 4 || i === 5) ? -1 : 0,
    edits: singing(face(i)),
    extra: [
      ...props(i),
      ...micStand,
      ...note(x, y, i < 4 ? notes[0] : notes[1]),
    ],
  }));

// joy: a little sun in the corner, its rays twinkling round a warm centre
const SUN_PLUS = [".O.", "OtO", ".O."];
const SUN_CROSS = ["O.O", ".t.", "O.O"];

// happiness: a little rainbow, drawn band by band, and a sparkle
const RAINBOW = [".rrr", "rOOO", "rOww", "rOw."];
const RAINBOW_BANDS = ["r", "O", "w"];

const rainbow = (bands: number) =>
  stamp(RAINBOW, 0, 0).filter((px) =>
    RAINBOW_BANDS.slice(0, bands).includes(px[2])
  );

// love: small hearts floating up the left
const MINI_HEART = ["r.r", "rrr", ".r."];
const floatingUp = (i: number, offset: number) => 8 - ((i + offset) % 8);

// heartbreak: a heart that cracks, then falls apart
const HEART_LEFT = ["rr.", "rrr", ".r.", "..r"];
const HEART_RIGHT = ["...rr", "...rr", "..rr."];

const crack: Px[] = [
  [1, 2, "k"],
  [2, 2, "k"],
];

// anger: a storm cloud, and lightning striking the ground
const CLOUD = [".kkk.", "kkkkk"];

const bolt: Px[] = [
  ...paint(
    [
      [2, 1],
      [3, 1],
      [4, 2],
      [5, 2],
      [6, 1],
      [7, 1],
      [8, 0],
      [9, 0],
      [10, 1],
      [11, 1],
      [12, 2],
      [13, 2],
      [14, 1],
      [15, 1],
    ],
    "O"
  ),
  ...paint(
    [
      [16, 0],
      [16, 2],
    ],
    "W"
  ),
  [16, 1, "O"],
];

const STRIKES = new Set([2, 3, 6]);

// rage: little flames floating around, flickering
const FLAME_A = [".r.", "rr.", "rOr", ".r."];
const FLAME_B = [".r.", ".rr", "rOr", ".r."];
const flame = (i: number, y: number) => stamp(i % 2 ? FLAME_B : FLAME_A, 0, y);

// sadness: tears spraying from its left cheek
const leftTears = [tearsA, tearsB, tearsC, tearsB].map((tears) =>
  tears.filter(([, x]) => x < 3)
);

// peaceful: flowers drifting down, blush petals round a gold centre, so they
// show on the cream cover
const FLOWER = [".p.", "pOp", ".p."];

const ANIM_SPECS = {
  alert: [{ extra: bang }, { dy: -1, extra: bang }],
  alertRun: [{ extra: bang }, { edits: stepping, extra: bang }],
  angry: [
    { edits: fuming, extra: angerMark },
    { dy: -1, edits: fuming, extra: angerMark },
  ],
  angryRun: [
    { edits: fuming, extra: angerMark },
    { edits: [...fuming, ...stepping], extra: angerMark },
  ],
  bug: [
    { extra: bug(5, 17) },
    { extra: bug(6, 17) },
    { extra: bug(5, 16) },
    { extra: bug(6, 16) },
    { extra: bug(7, 16) },
    { edits: tongue(5), extra: bug(7, 16) },
    { edits: tongue(2) },
    { edits: blink },
    { edits: blink },
    {},
    {},
    {},
    {},
  ],
  cry: [
    { edits: sobbing, extra: tearsA },
    { edits: sobbing, extra: tearsB },
    { edits: sobbing, extra: tearsC },
    { edits: sobbing, extra: tearsB },
  ],
  hop: [{}, {}, { dy: -1 }, { dy: -2 }, { dy: -2 }, { dy: -1 }, {}, {}],
  idle: [...rep({}, 14), { edits: blink }, ...rep({}, 6), { edits: blink }],
  love: [
    { extra: heart(13, 5) },
    { extra: heart(13, 4) },
    { dy: -1, edits: blink, extra: heart(13, 3) },
    { dy: -1, edits: blink, extra: heart(13, 2) },
    { edits: blink, extra: heart(13, 1) },
    { extra: heart(13, 0) },
    {},
    {},
  ],
  nap: [
    ...rep({ extra: [...z([[5, 6]]), ...bubble(13, 7, 1)], sprite: LIE }, 3),
    ...rep({ extra: [...z([[4, 7]]), ...bubble(13, 7, 2)], sprite: LIE }, 3),
    ...rep(
      {
        extra: [
          ...z([
            [3, 8],
            [5, 6],
          ]),
          ...bubble(12, 7, 3),
        ],
        sprite: LIE,
      },
      3
    ),
    ...rep(
      {
        extra: z([
          [2, 9],
          [4, 7],
        ]),
        sprite: LIE,
      },
      3
    ),
  ],
  // Two notes, one after the other, float up from the mic
  sing: song({}),
  singAnger: song({
    bounce: false,
    face: () => fuming,
    notes: ["r", "r"],
    props: (i) => [...stamp(CLOUD, 0, 0), ...(STRIKES.has(i) ? bolt : [])],
  }),
  singDepression: song({
    bounce: false,
    face: () => shut,
    notes: ["k", "k"],
    props: (i) => [...stamp(CLOUD, i, 0), ...stamp(CLOUD, (i + 5) % 8, 0)],
  }),
  singHappiness: song({
    notes: ["O", "w"],
    props: (i) => [
      ...rainbow(Math.min(i + 1, 3)),
      [i % 2 ? 6 : 5, i % 2 ? 0 : 1, "b"],
    ],
  }),
  singHeartbreak: song({
    bounce: false,
    face: (i) => (i >= 4 ? sobbing : []),
    notes: ["w", "w"],
    props: (i) => {
      if (i < 3) {
        return stamp(HEART, 0, 0);
      }

      if (i === 3) {
        return [...stamp(HEART, 0, 0), ...crack];
      }

      return [
        ...stamp(HEART_LEFT, 0, i >= 6 ? 2 : 1),
        ...stamp(HEART_RIGHT, 0, 0),
      ];
    },
  }),
  singJoy: song({
    notes: ["O", "r"],
    props: (i) => stamp(i % 2 ? SUN_CROSS : SUN_PLUS, 0, 0),
  }),
  singLove: song({
    face: (i) => (i === 2 || i === 3 ? blink : singFace(i)),
    notes: ["r", "r"],
    props: (i) => [
      ...stamp(MINI_HEART, 0, floatingUp(i, 0)),
      ...stamp(MINI_HEART, 0, floatingUp(i, 4) + 4),
    ],
  }),
  singPeaceful: song({
    bounce: false,
    face: (i) => (i < 2 ? [] : shut),
    notes: ["w", "d"],
    props: (i) => [
      ...stamp(FLOWER, 0, i * 2 - 2),
      ...stamp(FLOWER, 0, ((i + 4) % 8) * 2 - 2),
    ],
  }),
  singRage: song({
    face: () => fuming,
    notes: ["r", "O"],
    props: (i) => [...flame(i, 11 - (i % 4) * 3), ...flame(i + 1, (i % 4) * 2)],
  }),
  singSadness: song({
    bounce: false,
    face: () => sobbing,
    notes: ["w", "w"],
    props: (i) => leftTears[i % 4] ?? [],
  }),
  sleepy: [
    { edits: shut, extra: z([[2, 13]]) },
    { edits: shut, extra: z([[1, 14]]) },
  ],
  type: [
    { dx: -1, extra: screen([[7, 14]]), sprite: SIDE, under: keys },
    {
      dx: -1,
      extra: screen([
        [7, 14],
        [7, 15],
      ]),
      sprite: SIDE_B,
      under: keys,
    },
    {
      dx: -1,
      extra: screen([
        [7, 14],
        [7, 15],
        [9, 14],
      ]),
      sprite: SIDE,
      under: keys,
    },
    {
      dx: -1,
      extra: screen([
        [7, 14],
        [7, 15],
        [9, 14],
        [9, 15],
      ]),
      sprite: SIDE_B,
      under: keys,
    },
  ],
  wag: [{}, {}, { edits: tailSwung }, { edits: tailSwung }],
  walk: [{}, { edits: stepping }],
  wave: [{ edits: raisedArm }, { edits: raisedArm }, {}, {}],
} satisfies Record<string, FrameSpec[]>;

export type Anim = keyof typeof ANIM_SPECS;

const inFrame = (y: number, x: number) =>
  y >= 0 && y < GRID_H && x >= 0 && x < GRID_W;

/** One frame as GRID_H rows of GRID_W colour keys ('.' is empty) */
const compose = (f: FrameSpec) => {
  const sprite = f.sprite ?? STAND;
  const body = sprite.map((row) => [...row]);

  for (const [r, c, ch] of f.edits ?? []) {
    const row = body[r];

    if (row) {
      row[c] = ch;
    }
  }

  const grid = Array.from({ length: GRID_H }, () =>
    Array.from({ length: GRID_W }, () => ".")
  );

  const put = ([y, x, ch]: Px) => {
    const row = grid[y];

    if (row && inFrame(y, x)) {
      row[x] = ch;
    }
  };

  const dx = 2 + (f.dx ?? 0);
  const dy = (f.sprite ? GRID_H - sprite.length - 1 : 2) + (f.dy ?? 0);

  for (const px of f.under ?? []) {
    put(px);
  }

  for (const [r, row] of body.entries()) {
    for (const [c, ch] of row.entries()) {
      if (ch !== ".") {
        put([r + dy, c + dx, ch]);
      }
    }
  }

  for (const px of f.extra ?? []) {
    put(px);
  }

  return grid.map((row) => row.join(""));
};

/** Every distinct frame, drawn once; animations point into this list */
export const FRAMES: string[][] = [];
const frameIds = new Map<string, number>();

const idOf = (rows: string[]) => {
  const key = rows.join("/");
  const known = frameIds.get(key);

  if (known !== undefined) {
    return known;
  }

  FRAMES.push(rows);
  frameIds.set(key, FRAMES.length - 1);

  return FRAMES.length - 1;
};

const animIds = (specs: readonly FrameSpec[]) =>
  specs.map((f) => idOf(compose(f)));

/** Each animation as a list of indexes into FRAMES */
export const ANIMS: Record<Anim, number[]> = {
  alert: animIds(ANIM_SPECS.alert),
  alertRun: animIds(ANIM_SPECS.alertRun),
  angry: animIds(ANIM_SPECS.angry),
  angryRun: animIds(ANIM_SPECS.angryRun),
  bug: animIds(ANIM_SPECS.bug),
  cry: animIds(ANIM_SPECS.cry),
  hop: animIds(ANIM_SPECS.hop),
  idle: animIds(ANIM_SPECS.idle),
  love: animIds(ANIM_SPECS.love),
  nap: animIds(ANIM_SPECS.nap),
  sing: animIds(ANIM_SPECS.sing),
  singAnger: animIds(ANIM_SPECS.singAnger),
  singDepression: animIds(ANIM_SPECS.singDepression),
  singHappiness: animIds(ANIM_SPECS.singHappiness),
  singHeartbreak: animIds(ANIM_SPECS.singHeartbreak),
  singJoy: animIds(ANIM_SPECS.singJoy),
  singLove: animIds(ANIM_SPECS.singLove),
  singPeaceful: animIds(ANIM_SPECS.singPeaceful),
  singRage: animIds(ANIM_SPECS.singRage),
  singSadness: animIds(ANIM_SPECS.singSadness),
  sleepy: animIds(ANIM_SPECS.sleepy),
  type: animIds(ANIM_SPECS.type),
  wag: animIds(ANIM_SPECS.wag),
  walk: animIds(ANIM_SPECS.walk),
  wave: animIds(ANIM_SPECS.wave),
};

/**
 * Tokkae's songs for the music window while Spotify is quiet, in the order
 * previous and next step through them, each with how it sings.
 */
export const SONGS = [
  { anim: "sing", mood: "for you" },
  { anim: "singJoy", mood: "with joy" },
  { anim: "singHappiness", mood: "happily" },
  { anim: "singLove", mood: "with love" },
  { anim: "singHeartbreak", mood: "heartbroken" },
  { anim: "singAnger", mood: "angrily" },
  { anim: "singRage", mood: "in a rage" },
  { anim: "singDepression", mood: "under dark clouds" },
  { anim: "singSadness", mood: "through tears" },
  { anim: "singPeaceful", mood: "peacefully" },
] as const satisfies readonly { anim: Anim; mood: string }[];

const isPaletteKey = (ch: string): ch is keyof typeof PALETTE =>
  Object.hasOwn(PALETTE, ch);

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
