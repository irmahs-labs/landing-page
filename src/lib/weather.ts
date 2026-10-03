import { CITIES } from "./cities";
import type { CityId } from "./cities";

export interface Weather {
  at: number;
  cond: string;
  rainy: boolean;
  temp: string;
}

// WMO weather interpretation codes, as returned by Open-Meteo
const WEATHER_CODES: readonly [readonly number[], string, boolean][] = [
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

const describe = (code: number): [string, boolean] => {
  const hit = WEATHER_CODES.find(([codes]) => codes.includes(code));
  return hit ? [hit[1], hit[2]] : ["—", false];
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
