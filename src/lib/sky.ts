import type { City } from "./cities";

const sunTimes = (date: Date, lat: number, lon: number) => {
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
  const toDate = (j: number) => new Date((j + 0.5 - J1970) * dayMs);
  return { rise: toDate(Jrise), set: toDate(Jset) };
};

const localMinutes = (date: Date, tz: string) => {
  try {
    const parts = new Intl.DateTimeFormat("en-GB", {
      hour: "2-digit",
      hour12: false,
      minute: "2-digit",
      timeZone: tz,
    }).formatToParts(date);
    const h = Number(parts.find((x) => x.type === "hour")?.value) % 24;
    const m = Number(parts.find((x) => x.type === "minute")?.value);
    return h * 60 + m;
  } catch {
    return date.getHours() * 60 + date.getMinutes();
  }
};

export interface SkyPhase {
  /** 0 at dusk, 1 an hour into the night */
  deep: number;
  isDay: boolean;
  /** 0..1 progress through the current day or night */
  prog: number;
  riseM: number;
  setM: number;
  /** 1 right at sunrise/sunset, fading to 0 over 50 minutes */
  twilight: number;
}

// Where we are in the current day or night, and how deep into it
export const skyPhase = (city: City, now: Date): SkyPhase => {
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

export const skyTint = ({ isDay, twilight }: SkyPhase) => {
  if (isDay) {
    return "#f28c5a";
  }
  return twilight > 0.5 ? "#c96a5a" : "#1b2550";
};
