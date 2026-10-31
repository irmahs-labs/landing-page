import { CITIES } from "./cities";
import type { CityId } from "./cities";
import type { Language } from "./language";

export interface Weather {
  at: number;
  /** The sky in words, in each of the site's languages */
  cond: Record<Language, string>;
  rainy: boolean;
  temp: string;
}

// WMO weather interpretation codes, as returned by Open-Meteo
const WEATHER_CODES: readonly [
  readonly number[],
  Record<Language, string>,
  boolean,
][] = [
  [[0], { en: "Clear sky", fr: "Ciel dégagé" }, false],
  [[1], { en: "Mostly clear", fr: "Plutôt dégagé" }, false],
  [[2], { en: "Partly cloudy", fr: "Partiellement nuageux" }, false],
  [[3], { en: "Overcast", fr: "Couvert" }, false],
  [[45, 48], { en: "Foggy", fr: "Brouillard" }, false],
  [[51, 53, 55, 56, 57], { en: "Drizzle", fr: "Bruine" }, true],
  [[61, 63, 65, 66, 67], { en: "Rain", fr: "Pluie" }, true],
  [[71, 73, 75, 77, 85, 86], { en: "Snow", fr: "Neige" }, false],
  [[80, 81, 82], { en: "Rain showers", fr: "Averses" }, true],
  [[95, 96, 99], { en: "Thunderstorms", fr: "Orages" }, true],
];

const UNKNOWN = { en: "—", fr: "—" };

const describe = (code: number): [Record<Language, string>, boolean] => {
  const hit = WEATHER_CODES.find(([codes]) => codes.includes(code));

  return hit ? [hit[1], hit[2]] : [UNKNOWN, false];
};

interface OpenMeteoResponse {
  current: { temperature_2m: number; weather_code: number };
}

export const fetchWeather = async (id: CityId): Promise<Weather | null> => {
  const c = CITIES[id];
  const url = `https://api.open-meteo.com/v1/forecast?latitude=${c.lat}&longitude=${c.lon}&current=temperature_2m,weather_code&timezone=auto`;

  try {
    const res = await fetch(url);

    if (!res.ok) {
      return null;
    }

    // SAFETY: Open-Meteo returns these `current` fields because the URL requests them
    const data = (await res.json()) as OpenMeteoResponse;
    const [cond, rainy] = describe(data.current.weather_code);

    return {
      at: Date.now(),
      cond,
      rainy,
      temp: `${Math.round(data.current.temperature_2m)}°`,
    };
  } catch {
    // offline or blocked: keep the placeholder
    return null;
  }
};
