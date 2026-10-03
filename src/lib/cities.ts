export const CITIES = {
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
} as const;

export type CityId = keyof typeof CITIES;
export type City = (typeof CITIES)[CityId];

export const DEFAULT_CITY: CityId = "paris";

export const CITY_IDS: readonly CityId[] = ["paris", "phnom-penh"];
