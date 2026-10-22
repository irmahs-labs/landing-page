export const CITIES = {
  paris: {
    file: "paris.ics",
    lat: 48.8566,
    lon: 2.3522,
    tz: "Europe/Paris",
  },
  "phnom-penh": {
    file: "phnom_penh.ics",
    lat: 11.5564,
    lon: 104.9282,
    tz: "Asia/Phnom_Penh",
  },
} as const;

export type CityId = keyof typeof CITIES;

export type City = (typeof CITIES)[CityId];

export const DEFAULT_CITY: CityId = "paris";

export const CITY_IDS: readonly CityId[] = ["paris", "phnom-penh"];
