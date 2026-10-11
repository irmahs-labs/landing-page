import { describe, expect, it, vi } from "vitest";

import { fetchWeather } from "./weather";

const answer = (temperature: number, code: number) =>
  Response.json({
    current: { temperature_2m: temperature, weather_code: code },
  });

describe("fetchWeather", () => {
  it("asks Open-Meteo for the city and rounds the temperature", async () => {
    const fetch = vi.fn(() => Promise.resolve(answer(16.6, 3)));
    vi.stubGlobal("fetch", fetch);
    const wx = await fetchWeather("paris");
    expect(String(fetch.mock.calls[0]?.at(0))).toContain("api.open-meteo.com");
    expect(wx).toMatchObject({ cond: "Overcast", rainy: false, temp: "17°" });
  });

  it("knows rain when it sees it", async () => {
    vi.stubGlobal("fetch", () => Promise.resolve(answer(12, 63)));
    expect(await fetchWeather("paris")).toMatchObject({
      cond: "Rain",
      rainy: true,
    });
  });

  it("shows a dash for a code it doesn't know", async () => {
    vi.stubGlobal("fetch", () => Promise.resolve(answer(30, 1234)));
    const wx = await fetchWeather("phnom-penh");
    expect(wx?.cond).toBe("—");
  });

  it("gives up quietly when the request fails", async () => {
    vi.stubGlobal("fetch", () =>
      Promise.resolve(new Response("", { status: 500 }))
    );
    expect(await fetchWeather("paris")).toBeNull();
    vi.stubGlobal("fetch", () => Promise.reject(new TypeError("offline")));
    expect(await fetchWeather("paris")).toBeNull();
  });
});
