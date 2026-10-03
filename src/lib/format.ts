/** Minutes since midnight as HH:MM */
export const fmtMinutes = (x: number) =>
  `${String(Math.floor(x / 60)).padStart(2, "0")}:${String(x % 60).padStart(2, "0")}`;

// The design's reference canvas, used to turn its px positions into %
export const W0 = 1440;
export const H0 = 900;

export const pct = (v: number, of: number) => `${((v / of) * 100).toFixed(2)}%`;

export const rand = (a: number, b: number) => a + Math.random() * (b - a);
