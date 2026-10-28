/** Minutes since midnight as HH:MM */
export const fmtMinutes = (x: number) =>
  `${String(Math.floor(x / 60)).padStart(2, "0")}:${String(x % 60).padStart(2, "0")}`;

/** Seconds as M:SS */
export const fmtSeconds = (s: number) =>
  `${Math.floor(s / 60)}:${String(s % 60).padStart(2, "0")}`;

/** A file's size as people read it: 110 KB, 1.2 MB */
export const fmtSize = (bytes: number) =>
  bytes < 1024 * 1024
    ? `${Math.max(1, Math.round(bytes / 1024))} KB`
    : `${(bytes / (1024 * 1024)).toFixed(1)} MB`;

// The design's reference canvas, used to turn its px positions into %
export const W0 = 1440;
export const H0 = 900;

export const pct = (v: number, of: number) => `${((v / of) * 100).toFixed(2)}%`;

export const rand = (a: number, b: number) => a + Math.random() * (b - a);

const DAY = new Intl.DateTimeFormat("en-GB", {
  day: "numeric",
  month: "short",
  year: "numeric",
});

/** An ISO date as "27 Oct 2026", in the visitor's time zone */
export const fmtDate = (iso: string) => DAY.format(new Date(iso));
