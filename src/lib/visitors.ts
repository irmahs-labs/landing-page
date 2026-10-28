/** One day of visits, as Cloudflare counts them (UTC days) */
export interface VisitorDay {
  /** ISO date, such as 2026-10-28 */
  date: string;
  pageViews: number;
  /** Unique visitors that day, by IP address */
  visitors: number;
}

/** A country and its share of the week's requests */
export interface VisitorCountry {
  /** ISO 3166-1 alpha-2 code, or Cloudflare's T1 (Tor) and XX (unknown) */
  code: string;
  /** Between 0 and 1 */
  share: number;
}

export interface VisitorHistory {
  /** The last seven days, oldest first, today last */
  days: VisitorDay[];
  /** The top countries, most first */
  countries: VisitorCountry[];
}

/** What /api/visitors tells an admin */
export interface VisitorStats {
  /** Null when Cloudflare isn't set up or doesn't answer */
  history: VisitorHistory | null;
  online: number;
}

const REGION = new Intl.DisplayNames(["en"], { type: "region" });

/** A country's name in English, from Cloudflare's code */
export const countryName = (code: string) => {
  if (code === "T1") {
    return "Tor";
  }

  if (code === "XX") {
    return "Unknown";
  }

  try {
    return REGION.of(code) ?? code;
  } catch {
    return code;
  }
};

const WEEKDAY = new Intl.DateTimeFormat("en-GB", {
  timeZone: "UTC",
  weekday: "short",
});

/** A day's label under its bar: "Mon", or "today" for the last one */
export const dayLabel = (date: string, isToday: boolean) =>
  isToday ? "today" : WEEKDAY.format(new Date(`${date}T00:00:00Z`));

/** How strongly to shade a country on the map, 1 to 3, by its share of the top one's */
export const shadeOf = (share: number, top: number) => {
  const ratio = top > 0 ? share / top : 0;

  if (ratio > 0.6) {
    return 3;
  }

  return ratio > 0.25 ? 2 : 1;
};

/** The world map's paths, only fetched when the map first shows */
export const loadWorldMap = () => import("./world-map");

/** A share as a whole percentage, never "0%" for a country that has some */
export const fmtShare = (share: number) =>
  `${Math.max(1, Math.round(share * 100))}%`;
