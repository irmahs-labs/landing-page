const $ = (sel) => document.querySelector(sel);

const el = (tag, cls, attrs = {}) => {
  const node = document.createElement(tag);
  if (cls) {
    node.className = cls;
  }
  for (const [k, v] of Object.entries(attrs)) {
    node.setAttribute(k, v);
  }
  return node;
};

const svgEl = (tag, attrs) => {
  const node = document.createElementNS("http://www.w3.org/2000/svg", tag);
  for (const [k, v] of Object.entries(attrs)) {
    node.setAttribute(k, v);
  }
  return node;
};

const store = {
  get(k) {
    try {
      return localStorage.getItem(k);
    } catch {
      return null;
    }
  },
  set(k, v) {
    try {
      localStorage.setItem(k, v);
    } catch {
      // storage unavailable: preferences just won't persist
    }
  },
};

const reduceMotion = window.matchMedia(
  "(prefers-reduced-motion: reduce)"
).matches;
const pct = (v, of) => `${((v / of) * 100).toFixed(2)}%`;
const rand = (a, b) => a + Math.random() * (b - a);
const pick = (cond, yes, no) => (cond ? yes : no);
const fmtM = (x) =>
  `${String(Math.floor(x / 60)).padStart(2, "0")}:${String(x % 60).padStart(2, "0")}`;
const fmtS = (s) => `${Math.floor(s / 60)}:${String(s % 60).padStart(2, "0")}`;
const darken = (hex, k) =>
  `#${[1, 3, 5]
    .map((i) =>
      Math.round(Number.parseInt(hex.slice(i, i + 2), 16) * k)
        .toString(16)
        .padStart(2, "0")
    )
    .join("")}`;

/* ------------------------------------------------------------------
 * Themes
 * ------------------------------------------------------------------ */
const ASSETS = "assets/";
const PATTERN_IMG = {
  coinLattice: ["coin-lattice.svg", 96],
  fairisle: ["fairisle.svg", 48],
  jogakbo: ["jogakbo.svg", 120],
  kawung: ["kawung.svg", 72],
  kikko: ["kikko.svg", 72],
  treillage: ["treillage.svg", 60],
};
const stripes = (a, b) =>
  `repeating-linear-gradient(-45deg, ${a} 0 10px, ${b} 10px 20px)`;
const THEMES = {
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
};
// Swatch order in the picker, as in the design
const THEME_ORDER = [
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
for (const [id, th] of Object.entries(THEMES)) {
  th.flower = th.special ? null : `${ASSETS}flowers/${id}.png`;
  th.animal = th.special ? null : `${ASSETS}animals/${id}.png`;
}
const DEFAULT_THEME = "amelie";
const savedTheme = store.get("theme");
let themeId = THEME_ORDER.includes(savedTheme) ? savedTheme : DEFAULT_THEME;

/* ------------------------------------------------------------------
 * Scenery builders
 * ------------------------------------------------------------------ */
// The design's reference canvas, used to turn its px positions into %
const W0 = 1440;
const H0 = 900;

const buildStars = () => {
  const box = $("#stars");
  for (let i = 0; i < 40; i += 1) {
    const size = 7 + ((i * 7) % 9);
    const s = svgEl("svg", {
      class: "star",
      height: size,
      viewBox: "0 0 12 12",
      width: size,
    });
    s.style.left = pct((i * 197 + 53) % 1420, W0);
    s.style.top = pct(((i * 131 + 29) % 560) + 10, H0);
    s.style.animationDuration = `${2.2 + (i % 5) * 0.7}s`;
    s.style.animationDelay = `${-(i % 7) * 0.6}s`;
    s.append(
      svgEl("path", {
        d: "M6 0 L7.2 4.8 L12 6 L7.2 7.2 L6 12 L4.8 7.2 L0 6 L4.8 4.8 Z",
        fill: "#fff3cf",
        stroke: "#2f3b34",
        "stroke-width": "0.6",
      })
    );
    box.append(s);
  }
};

const CLOUDS = [
  { delay: -20, dur: 90, top: 250, w: 200 },
  { delay: -75, dur: 120, top: 120, w: 150 },
  { delay: -100, dur: 150, top: 470, w: 240 },
  { delay: -40, dur: 105, top: 370, w: 120 },
  { delay: -60, dur: 110, top: 60, w: 210 },
  { delay: -10, dur: 95, top: 180, w: 170 },
];
const cloudEls = [];
const buildClouds = () => {
  const box = $("#clouds");
  for (const c of CLOUDS) {
    const s = svgEl("svg", {
      class: "cloud",
      height: Math.round(c.w * 0.45),
      viewBox: "0 0 200 90",
      width: c.w,
    });
    s.style.top = pct(c.top, H0);
    s.style.animationDuration = `${c.dur}s`;
    s.style.animationDelay = `${c.delay}s`;
    s.append(
      svgEl("path", {
        d: "M40 82 H165 A25 25 0 0 0 160 34 A38 38 0 0 0 88 24 A30 30 0 0 0 40 47 A18 18 0 0 0 40 82 Z",
      })
    );
    box.append(s);
    cloudEls.push(s);
  }
};

const buildRain = () => {
  const box = $("#rain");
  for (let i = 0; i < 60; i += 1) {
    const d = el("div", "drop");
    d.style.left = pct((i * 89 + 17) % 1500, W0);
    d.style.height = `${16 + ((i * 7) % 18)}px`;
    d.style.animationDuration = `${(0.7 + (i % 5) * 0.12).toFixed(2)}s`;
    d.style.animationDelay = `${(-((i * 0.137) % 1.2)).toFixed(2)}s`;
    box.append(d);
  }
  box.append(el("div", "flash"));
};

const FLOWER_SIZES = [22, 48, 30, 60, 26, 40, 54, 20, 36, 58, 28, 44, 32, 50];
const FLOWER_FALLS = [11, 24, 15, 30, 9, 19, 27, 13, 22, 33, 10, 17, 25, 14];
const flowerImgs = [];
const buildFlowers = () => {
  const box = $("#flowers");
  for (let i = 0; i < 14; i += 1) {
    const f = el("span", "flower");
    f.style.left = pct(6 + i * 102 + ((i * 37) % 40), W0);
    f.style.width = `${FLOWER_SIZES[i]}px`;
    f.style.height = `${FLOWER_SIZES[i]}px`;
    f.style.animationDuration = `${FLOWER_FALLS[i]}s`;
    f.style.animationDelay = `${(-((i * 7.3) % FLOWER_FALLS[i])).toFixed(1)}s`;
    const spin = el("span");
    spin.style.animationDuration = `${17 + ((i * 5) % 12)}s`;
    const img = el("img", "", { alt: "", decoding: "async" });
    spin.append(img);
    f.append(spin);
    box.append(f);
    flowerImgs.push(img);
  }
};

const wavePath = (segments) => {
  let d = "M0 32";
  for (let k = 0; k < segments; k += 1) {
    d += ` Q${k * 240 + 120} ${k % 2 ? 60 : 4} ${(k + 1) * 240} 32`;
  }
  return `${d} V64 H0 Z`;
};
const WAVE = wavePath(14);
const waveSvg = (fill) => {
  const s = svgEl("svg", {
    class: "wave",
    preserveAspectRatio: "none",
    viewBox: "0 0 3360 64",
  });
  s.append(svgEl("path", { d: WAVE, fill }));
  return s;
};

const buildBobaScene = () => {
  const box = $("#bobaScene");
  box.textContent = "";
  for (let i = 0; i < 28; i += 1) {
    const p = el("span", "tiny-pearl");
    const size = `${8 + ((i * 5) % 7)}px`;
    p.style.left = pct(10 + i * 51 + ((i * 23) % 30), W0);
    p.style.width = size;
    p.style.height = size;
    p.style.animationDuration = `${9 + ((i * 7) % 9)}s`;
    p.style.animationDelay = `${(-((i * 1.7) % 16)).toFixed(1)}s`;
    box.append(p);
  }
  const fill = el("div", "fill-up");
  const layers = [
    ["#e3c9b0", "slosh 3.4s linear infinite reverse"],
    ["#fbf3e6", "slosh 2.4s linear infinite"],
  ];
  for (const [color, animation] of layers) {
    const swell = el("div", "swell");
    const wave = waveSvg(color);
    wave.style.animation = animation;
    const body = el("div");
    body.style.backgroundColor = color;
    swell.append(wave, body);
    fill.append(swell);
  }
  box.append(fill);
};

/* ------------------------------------------------------------------
 * Wandering animals (one follows the pointer)
 * ------------------------------------------------------------------ */
const roam = (a, W, H) => {
  if (Math.hypot(a.vx, a.vy) < a.sp * 0.5) {
    const ang = Math.random() * Math.PI * 2;
    a.vx = Math.cos(ang) * a.sp;
    a.vy = Math.sin(ang) * a.sp;
  }
  if ((a.x < 0 && a.vx < 0) || (a.x > W - a.s && a.vx > 0)) {
    a.vx = -a.vx;
  }
  if ((a.y < 0 && a.vy < 0) || (a.y > H - a.s && a.vy > 0)) {
    a.vy = -a.vy;
  }
  if (Math.abs(a.vx) > 4) {
    a.face = a.vx >= 0 ? 1 : -1;
  }
};

const critters = (() => {
  const box = $("#critters");
  let list = [];
  let mouse = null;
  let prev = performance.now();
  let nextSpawn = 0;
  let cur = null;

  const spawn = (follower) => {
    const W = window.innerWidth;
    const H = window.innerHeight;
    const s = follower ? 120 : rand(50, 120);
    const fromLeft = Math.random() < 0.5;
    const sp = follower ? cur.cfg.speed * 1.2 : rand(40, 190) * (85 / s) ** 0.3;
    const a = {
      bob: Math.random() * 6.28,
      face: fromLeft ? 1 : -1,
      follower: Boolean(follower),
      s,
      sp,
      vx: fromLeft ? sp : -sp,
      vy: 0,
      x: fromLeft ? -s - 10 : W + 10,
      y: follower
        ? rand(H * 0.22, H * 0.67)
        : rand(60, Math.max(80, H - s - 20)),
    };
    const wrap = el("div", "critter");
    const img = el("img", cur.cls, {
      alt: "",
      decoding: "async",
      src: cur.animal,
    });
    wrap.style.width = `${Math.round(s)}px`;
    wrap.style.height = `${Math.round(s)}px`;
    wrap.append(img);
    box.append(wrap);
    a.el = wrap;
    a.img = img;
    list.push(a);
  };

  const chase = (a) => {
    const dx = mouse.x + 24 - a.x;
    const dy = mouse.y + 18 - a.y;
    const d = Math.hypot(dx, dy);
    const sp = Math.min(a.sp * 2.2, d * 3);
    a.vx = d > 1 ? (dx / d) * sp : 0;
    a.vy = d > 1 ? (dy / d) * sp : 0;
    const fx = mouse.x - (a.x + a.s / 2);
    if (Math.abs(fx) > 8) {
      a.face = fx > 0 ? 1 : -1;
    }
  };

  const step = (dt, now) => {
    const W = window.innerWidth;
    const H = window.innerHeight;
    if (!list.some((a) => a.follower)) {
      spawn(true);
    }
    if (list.length < 10 && now > nextSpawn) {
      spawn(false);
      nextSpawn = now + rand(900, 2600);
    }
    const keep = [];
    for (const a of list) {
      if (a.follower) {
        if (mouse) {
          chase(a);
        } else {
          roam(a, W, H);
        }
        a.x += a.vx * dt;
        a.y += a.vy * dt;
        keep.push(a);
      } else {
        a.bob += dt * 3;
        a.x += a.vx * dt;
        a.y += Math.sin(a.bob) * 0.3;
        if (a.x > -a.s - 40 && a.x < W + 40) {
          keep.push(a);
        } else {
          a.el.remove();
        }
      }
    }
    list = keep;
    for (const a of list) {
      a.el.style.transform = `translate(${a.x.toFixed(1)}px, ${a.y.toFixed(1)}px) scaleX(${a.face * cur.cfg.native})`;
    }
  };

  const tick = (now) => {
    const dt = Math.min(0.05, (now - prev) / 1000);
    prev = now;
    if (cur) {
      step(dt, now);
    }
    requestAnimationFrame(tick);
  };

  window.addEventListener(
    "pointermove",
    (e) => {
      if (e.pointerType === "mouse") {
        mouse = { x: e.clientX, y: e.clientY };
      }
    },
    { passive: true }
  );
  document.addEventListener("mouseout", (e) => {
    if (!e.relatedTarget) {
      mouse = null;
    }
  });

  return {
    retheme(th) {
      if (!th.animal) {
        cur = null;
        for (const a of list) {
          a.el.remove();
        }
        list = [];
        return;
      }
      cur = th;
      for (const a of list) {
        a.img.src = th.animal;
        a.img.className = th.cls;
      }
    },
    start() {
      if (!reduceMotion) {
        requestAnimationFrame(tick);
      }
    },
  };
})();

/* ------------------------------------------------------------------
 * Cities, clock, sky and weather
 * ------------------------------------------------------------------ */
const CITIES = {
  paris: {
    host: "paris.local",
    lat: 48.8566,
    lon: 2.3522,
    tz: "Europe/Paris",
  },
  "phnom-penh": {
    host: "phnom_penh.local",
    lat: 11.5564,
    lon: 104.9282,
    tz: "Asia/Phnom_Penh",
  },
};
const savedCity = store.get("city");
let cityId = Object.hasOwn(CITIES, savedCity) ? savedCity : "paris";
// cityId -> { temp, cond, rainy, at }
const weather = {};

const sunTimes = (date, lat, lon) => {
  const rad = Math.PI / 180;
  const dayMs = 86_400_000;
  const J1970 = 2_440_588;
  const J2000 = 2_451_545;
  const d = date.valueOf() / dayMs - 0.5 + J1970 - J2000;
  const lw = rad * -lon;
  const phi = rad * lat;
  const n = Math.round(d - 0.0009 - lw / (2 * Math.PI));
  const ds = 0.0009 + lw / (2 * Math.PI) + n;
  const M = rad * (357.5291 + 0.98560028 * ds);
  const C =
    rad *
    (1.9148 * Math.sin(M) + 0.02 * Math.sin(2 * M) + 0.0003 * Math.sin(3 * M));
  const L = M + C + rad * 102.9372 + Math.PI;
  const dec = Math.asin(Math.sin(rad * 23.4397) * Math.sin(L));
  const Jnoon = J2000 + ds + 0.0053 * Math.sin(M) - 0.0069 * Math.sin(2 * L);
  const w = Math.acos(
    (Math.sin(-0.833 * rad) - Math.sin(phi) * Math.sin(dec)) /
      (Math.cos(phi) * Math.cos(dec))
  );
  const a = 0.0009 + (w + lw) / (2 * Math.PI) + n;
  const Jset = J2000 + a + 0.0053 * Math.sin(M) - 0.0069 * Math.sin(2 * L);
  const Jrise = Jnoon - (Jset - Jnoon);
  const toDate = (j) => new Date((j + 0.5 - J1970) * dayMs);
  return { rise: toDate(Jrise), set: toDate(Jset) };
};

const localMinutes = (date, tz) => {
  try {
    const parts = new Intl.DateTimeFormat("en-GB", {
      hour: "2-digit",
      hour12: false,
      minute: "2-digit",
      timeZone: tz,
    }).formatToParts(date);
    const h = Number(parts.find((x) => x.type === "hour").value) % 24;
    const m = Number(parts.find((x) => x.type === "minute").value);
    return h * 60 + m;
  } catch {
    return date.getHours() * 60 + date.getMinutes();
  }
};

const updateClock = (city, now) => {
  try {
    $("#time").textContent = new Intl.DateTimeFormat("en-GB", {
      hour: "2-digit",
      hour12: false,
      minute: "2-digit",
      timeZone: city.tz,
    }).format(now);
    $("#date").textContent = new Intl.DateTimeFormat("en-GB", {
      day: "numeric",
      month: "long",
      timeZone: city.tz,
      weekday: "long",
      year: "numeric",
    }).format(now);
  } catch {
    // very old browser: leave the placeholders
  }
};

// Where we are in the current day or night, and how deep into it
const skyPhase = (city, now) => {
  const times = sunTimes(now, city.lat, city.lon);
  const riseM = localMinutes(times.rise, city.tz);
  const setM = localMinutes(times.set, city.tz);
  const m = localMinutes(now, city.tz);
  const isDay = m >= riseM && m < setM;
  const dayLen = setM - riseM;
  const span = isDay ? dayLen : 1440 - dayLen;
  let into = m - riseM;
  if (!isDay) {
    into = m >= setM ? m - setM : m + 1440 - setM;
  }
  const edge = Math.min(into, span - into);
  return {
    deep: isDay ? 0 : Math.min(1, edge / 60),
    isDay,
    prog: into / span,
    riseM,
    setM,
    twilight: Math.max(0, 1 - edge / 50),
  };
};

const skyTint = ({ isDay, twilight }) => {
  if (isDay) {
    return "#f28c5a";
  }
  return twilight > 0.5 ? "#c96a5a" : "#1b2550";
};

const paintSky = (ph) => {
  const W = window.innerWidth;
  const H = window.innerHeight;
  const wide = W >= 900;
  const rising = ph.prog < 0.5;
  const body = $("#skyBody");
  body.style.left = `${rising ? W - pick(wide, 210, 115) : pick(wide, 110, 15)}px`;
  const yFrac = rising
    ? 0.8 - (ph.prog / 0.5) * 0.556
    : 0.244 + ((ph.prog - 0.5) / 0.5) * 0.556;
  body.style.top = `${Math.round(H * yFrac)}px`;
  $("#sun").toggleAttribute("hidden", !ph.isDay);
  $("#moon").toggleAttribute("hidden", ph.isDay);
  document.documentElement.style.setProperty(
    "--sun",
    ph.twilight > 0.3 ? "#f2a65a" : "#f2d27a"
  );

  const tint = $("#skyTint");
  tint.style.backgroundColor = skyTint(ph);
  tint.style.opacity = ph.isDay
    ? (ph.twilight * 0.28).toFixed(2)
    : (0.22 + ph.deep * 0.38).toFixed(2);
  $("#skyDim").style.opacity = (ph.deep * 0.28).toFixed(2);
  const stars = $("#stars");
  stars.hidden = ph.isDay;
  stars.style.opacity = (0.3 + ph.deep * 0.7).toFixed(2);

  $("#sunLine").textContent = ph.isDay
    ? `sunrise ${fmtM(ph.riseM)} · sunset ${fmtM(ph.setM)}`
    : `moonrise ${fmtM(ph.setM)} · moonset ${fmtM(ph.riseM)}`;
};

const cloudFill = (rainy, isDay) => {
  if (rainy) {
    return isDay ? "#aeb8b4" : "#5d6863";
  }
  return isDay ? THEMES[themeId].c.panel : "#8b9590";
};

const paintWeather = (isDay) => {
  const rainy = Boolean(weather[cityId]?.rainy);
  $("#rain").hidden = !rainy;
  for (const [i, c] of cloudEls.entries()) {
    c.style.display = i < (rainy ? 6 : 4) ? "" : "none";
    c.style.opacity = isDay ? "1" : "0.8";
  }
  document.documentElement.style.setProperty(
    "--cloud-fill",
    cloudFill(rainy, isDay)
  );
  $("#wxRain").toggleAttribute("hidden", !rainy);
  $("#wxDay").toggleAttribute("hidden", rainy || !isDay);
  $("#wxNight").toggleAttribute("hidden", rainy || isDay);
};

const updateSky = () => {
  const city = CITIES[cityId];
  const now = new Date();
  updateClock(city, now);
  const ph = skyPhase(city, now);
  paintSky(ph);
  paintWeather(ph.isDay);
};

// WMO weather interpretation codes, as returned by Open-Meteo
const WEATHER_CODES = [
  [[0], "Clear sky", false],
  [[1], "Mostly clear", false],
  [[2], "Partly cloudy", false],
  [[3], "Overcast", false],
  [[45, 48], "Foggy", false],
  [[51, 53, 55, 56, 57], "Drizzle", true],
  [[61, 63, 65, 66, 67], "Rain", true],
  [[71, 73, 75, 77, 85, 86], "Snow", false],
  [[80, 81, 82], "Rain showers", true],
  [[95, 96, 99], "Thunderstorms", true],
];
const describe = (code) => {
  const hit = WEATHER_CODES.find(([codes]) => codes.includes(code));
  return hit ? [hit[1], hit[2]] : ["—", false];
};

const renderWeather = () => {
  const wx = weather[cityId];
  $("#temp").textContent = wx ? wx.temp : "--°";
  $("#cond").textContent = wx ? wx.cond : " ";
  updateSky();
};

const loadWeather = async (id) => {
  const cached = weather[id];
  if (cached && Date.now() - cached.at < 15 * 60 * 1000) {
    return;
  }
  const c = CITIES[id];
  const url = `https://api.open-meteo.com/v1/forecast?latitude=${c.lat}&longitude=${c.lon}&current=temperature_2m,weather_code&timezone=auto`;
  try {
    const res = await fetch(url);
    if (!res.ok) {
      return;
    }
    const data = await res.json();
    const [cond, rainy] = describe(data.current.weather_code);
    weather[id] = {
      at: Date.now(),
      cond,
      rainy,
      temp: `${Math.round(data.current.temperature_2m)}°`,
    };
    if (id === cityId) {
      renderWeather();
    }
  } catch {
    // offline or blocked: keep the placeholder
  }
};

const setCity = (id) => {
  cityId = id;
  store.set("city", id);
  for (const b of document.querySelectorAll(".seg")) {
    b.setAttribute("aria-pressed", String(b.dataset.city === id));
  }
  $("#cityHost").textContent = CITIES[id].host;
  $("#cityKhmer").hidden = id !== "phnom-penh";
  renderWeather();
  loadWeather(id);
};

/* ------------------------------------------------------------------
 * Milk tea pour overlay
 * ------------------------------------------------------------------ */
const milkLayer = $("#milkLayer");
let milkTimers = [];
let bobaReturn = null;

const showMilk = () => {
  milkLayer.textContent = "";
  const milk = el("div", "milk");
  milk.append(waveSvg("#fbf3e6"));
  milkLayer.append(milk);
  for (let i = 0; i < 30; i += 1) {
    const p = el("div", "milk-pearl");
    const size = `${26 + ((i * 11) % 18)}px`;
    p.style.left = pct((i * 173 + 41) % 1400, W0);
    p.style.width = size;
    p.style.height = size;
    p.style.animationName = i % 2 ? "pearlA" : "pearlB";
    p.style.animationDuration = `${1.8 + (i % 5) * 0.25}s`;
    p.style.animationDelay = `${(0.1 + ((i * 0.13) % 1.3)).toFixed(2)}s`;
    milkLayer.append(p);
  }
  milkLayer.hidden = false;
};

const hideMilk = () => {
  milkLayer.hidden = true;
  milkLayer.textContent = "";
};

const cancelMilk = () => {
  for (const t of milkTimers) {
    clearTimeout(t);
  }
  milkTimers = [];
  hideMilk();
};

/* ------------------------------------------------------------------
 * Theme application
 * ------------------------------------------------------------------ */
const swatchBtns = {};

const setPattern = (th, animate) => {
  const box = $("#patterns");
  const old = [...box.children];
  const layer = el("div", animate ? "pattern-in" : "");
  const bg = el("div");
  bg.style.background = th.pattern || "transparent";
  layer.append(bg);
  if (th.patternImg) {
    const [file, size] = PATTERN_IMG[th.patternImg];
    const img = el("div");
    img.style.backgroundImage = `url(${ASSETS}patterns/${file})`;
    img.style.backgroundSize = `${size}px auto`;
    img.style.backgroundRepeat = "repeat";
    layer.append(img);
  }
  box.append(layer);
  for (const o of old) {
    if (animate) {
      o.className = "pattern-out";
      setTimeout(() => o.remove(), 850);
    } else {
      o.remove();
    }
  }
};

const setFlowers = (th) => {
  $("#flowers").hidden = !th.flower;
  if (!th.flower) {
    return;
  }
  for (const img of flowerImgs) {
    if (img.getAttribute("src")) {
      img.classList.add("swap");
      setTimeout(() => {
        img.src = th.flower;
        img.classList.remove("swap");
      }, 400);
    } else {
      img.src = th.flower;
    }
  }
};

const setBobaScene = (on) => {
  const boba = $("#bobaScene");
  if (on && boba.hidden) {
    buildBobaScene();
    boba.hidden = false;
  }
  if (!on) {
    boba.hidden = true;
    boba.textContent = "";
  }
};

const setTheme = (id, animate) => {
  themeId = id;
  const th = THEMES[id];
  const ground = darken(th.c.body, 0.92);
  const vars = {
    "--alt": th.c.alt,
    "--bar": th.c.bar || "#3b4a42",
    "--bar-grid": th.c.barGrid || "#4e6152",
    "--body": th.c.body,
    "--ground": ground,
    "--muted": th.c.muted,
    "--panel": th.c.panel,
    "--stripes": th.stripes,
  };
  for (const [k, v] of Object.entries(vars)) {
    document.documentElement.style.setProperty(k, v);
  }
  $('meta[name="theme-color"]')?.setAttribute("content", ground);

  setPattern(th, animate);
  setFlowers(th);
  critters.retheme(th);
  setBobaScene(id === "boba");

  for (const [k, b] of Object.entries(swatchBtns)) {
    b.setAttribute("aria-pressed", String(k === id));
  }
  $("#themeName").textContent = th.label;
  $("#surprise").setAttribute("aria-pressed", String(id === "boba"));
  updateSky();
};

/* ------------------------------------------------------------------
 * "surprise me": milk tea pour, 20 s of boba, then back
 * ------------------------------------------------------------------ */
const pourBoba = () => {
  cancelMilk();
  const back = themeId === "boba" ? bobaReturn || DEFAULT_THEME : themeId;
  bobaReturn = back;
  if (reduceMotion) {
    setTheme("boba", true);
    milkTimers = [setTimeout(() => setTheme(back, true), 20_000)];
    return;
  }
  milkTimers = [
    setTimeout(showMilk, 30),
    setTimeout(() => setTheme("boba", false), 1550),
    setTimeout(hideMilk, 3450),
    setTimeout(showMilk, 20_000),
    setTimeout(() => setTheme(back, false), 21_550),
    setTimeout(hideMilk, 23_450),
  ];
};

const pickTheme = (id) => {
  if (id === themeId) {
    return;
  }
  cancelMilk();
  bobaReturn = null;
  setTheme(id, true);
  store.set("theme", id);
};

const buildSwatches = () => {
  const box = $("#swatches");
  for (const id of THEME_ORDER) {
    const th = THEMES[id];
    const b = el("button", "btn swatch", {
      "aria-label": `${th.label} theme`,
      "aria-pressed": "false",
      title: th.label,
      type: "button",
    });
    const dot = el("span");
    dot.style.backgroundColor = th.swatch;
    b.append(dot);
    b.addEventListener("click", () => pickTheme(id));
    box.append(b);
    swatchBtns[id] = b;
  }
};

/* ------------------------------------------------------------------
 * App tiles: a little burst of flowers and animals on hover
 * ------------------------------------------------------------------ */
const burst = (tile) => {
  if (reduceMotion) {
    return;
  }
  tile.querySelector(".burst-wrap")?.remove();
  const th = THEMES[themeId];
  const wrap = el("span", "burst-wrap", { "aria-hidden": "true" });
  for (let k = 0; k < 12; k += 1) {
    const isAnimal = k % 2 === 1 && Boolean(th.animal);
    const src = isAnimal ? th.animal : th.flower;
    const sz = isAnimal ? 30 + ((k * 5) % 12) : 20 + ((k * 7) % 14);
    const bit = el("span");
    bit.style.width = `${sz}px`;
    bit.style.height = `${sz}px`;
    bit.style.left = `${-sz / 2}px`;
    bit.style.top = `${-sz / 2}px`;
    bit.style.animation = `burst${k} .95s cubic-bezier(.2,.7,.3,1) both`;
    bit.append(src ? el("img", "", { alt: "", src }) : el("span", "pearl"));
    wrap.append(bit);
  }
  tile.append(wrap);
  setTimeout(() => wrap.remove(), 1000);
};

/* ------------------------------------------------------------------
 * Music player: what's playing on Spotify right now (via /api/now-playing)
 * ------------------------------------------------------------------ */
let nowPlaying = null;
let fetchedAt = 0;

const renderTrack = () => {
  const player = $(".player");
  const link = $("#trackLink");
  const t = nowPlaying?.title ? nowPlaying : null;
  player.classList.toggle("is-paused", !t?.playing);
  if (!t) {
    link.removeAttribute("href");
    $("#trackTitle").textContent = "Nothing playing";
    $("#trackArtist").textContent = "Spotify is quiet";
    $("#elapsed").textContent = fmtS(0);
    $("#duration").textContent = fmtS(0);
    $("#barFill").style.width = "0%";
    return;
  }
  link.href = t.url ?? "https://open.spotify.com";
  $("#trackTitle").textContent = t.title;
  $("#trackArtist").textContent = t.artist ?? "";
  const dur = Math.floor(t.durationMs / 1000);
  const elapsedMs = t.progressMs + (t.playing ? Date.now() - fetchedAt : 0);
  const pos = Math.min(dur, Math.floor(elapsedMs / 1000));
  $("#elapsed").textContent = fmtS(pos);
  $("#duration").textContent = fmtS(dur);
  $("#barFill").style.width = `${((pos / dur) * 100).toFixed(1)}%`;
};

const loadNowPlaying = async () => {
  try {
    const res = await fetch("/api/now-playing", { cache: "no-store" });
    nowPlaying = res.ok ? await res.json() : null;
  } catch {
    nowPlaying = null;
  }
  fetchedAt = Date.now();
  renderTrack();
};

/* ------------------------------------------------------------------
 * Boot
 * ------------------------------------------------------------------ */
buildStars();
buildClouds();
buildRain();
buildFlowers();
buildSwatches();
critters.start();
setTheme(themeId, false);
setCity(cityId);
loadNowPlaying();

for (const b of document.querySelectorAll(".seg")) {
  b.addEventListener("click", () => setCity(b.dataset.city));
}
$("#surprise").addEventListener("click", pourBoba);
for (const t of document.querySelectorAll(".tile")) {
  t.addEventListener("mouseenter", () => burst(t));
  t.addEventListener("focus", () => burst(t));
}

setInterval(() => {
  updateSky();
  renderTrack();
}, 1000);
setInterval(loadNowPlaying, 15 * 1000);
setInterval(() => loadWeather(cityId), 15 * 60 * 1000);
window.addEventListener("resize", updateSky);
