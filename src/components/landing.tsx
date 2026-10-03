"use client";

import { useCallback, useEffect, useRef, useState } from "react";

import { useNow } from "@/hooks/use-now";
import { useReducedMotion } from "@/hooks/use-reduced-motion";
import { useStoredChoice } from "@/hooks/use-stored-choice";
import { CITIES, CITY_IDS, DEFAULT_CITY } from "@/lib/cities";
import type { CityId } from "@/lib/cities";
import { skyPhase } from "@/lib/sky";
import { DEFAULT_THEME, THEME_ORDER, THEMES, themeVars } from "@/lib/themes";
import type { ThemeId } from "@/lib/themes";
import { fetchWeather } from "@/lib/weather";
import type { Weather } from "@/lib/weather";

import { AppsWindow } from "./apps-window";
import { CityToggle } from "./city-toggle";
import { ClockWindow } from "./clock-window";
import { Critters } from "./critters";
import { MilkLayer } from "./milk-layer";
import { Player } from "./player";
import { Scene } from "./scene";
import { SurpriseButton } from "./surprise-button";
import { ThemePicker } from "./theme-picker";

const WEATHER_TTL = 15 * 60 * 1000;
const BOBA_MS = 20_000;

const setRootVar = (k: string, v: string) =>
  document.documentElement.style.setProperty(k, v);

export const Landing = () => {
  const reduceMotion = useReducedMotion();
  const now = useNow();
  const [savedTheme, saveTheme] = useStoredChoice(
    "theme",
    THEME_ORDER,
    DEFAULT_THEME
  );
  const [cityId, saveCity] = useStoredChoice("city", CITY_IDS, DEFAULT_CITY);
  // Boba is never saved: it's a temporary override from "surprise me"
  const [boba, setBoba] = useState(false);
  const [animatePattern, setAnimatePattern] = useState(false);
  const [weather, setWeather] = useState<Partial<Record<CityId, Weather>>>({});
  // Mirrors `weather` so the fetch effect can check freshness without depending on it
  const weatherCache = useRef(weather);
  const [milk, setMilk] = useState(false);
  const milkTimers = useRef<ReturnType<typeof setTimeout>[]>([]);

  const themeId: ThemeId = boba ? "boba" : savedTheme;
  const th = THEMES[themeId];
  const city = CITIES[cityId];
  const phase = now ? skyPhase(city, now) : null;
  const wx = weather[cityId];
  const rainy = Boolean(wx?.rainy);
  const isDay = phase?.isDay ?? true;

  useEffect(() => {
    for (const [k, v] of Object.entries(themeVars(th))) {
      setRootVar(k, v);
    }
    document
      .querySelector('meta[name="theme-color"]')
      ?.setAttribute("content", themeVars(th)["--ground"] ?? "");
  }, [th]);

  useEffect(() => {
    let fill = isDay ? th.c.panel : "#8b9590";
    if (rainy) {
      fill = isDay ? "#aeb8b4" : "#5d6863";
    }
    setRootVar("--cloud-fill", fill);
  }, [isDay, rainy, th]);

  const sunColor = (phase?.twilight ?? 0) > 0.3 ? "#f2a65a" : "#f2d27a";
  useEffect(() => setRootVar("--sun", sunColor), [sunColor]);

  // Weather for the current city, refreshed every 15 minutes
  useEffect(() => {
    let alive = true;
    const load = async () => {
      const fresh = await fetchWeather(cityId);
      if (alive && fresh) {
        weatherCache.current = { ...weatherCache.current, [cityId]: fresh };
        setWeather(weatherCache.current);
      }
    };
    const cached = weatherCache.current[cityId];
    if (!cached || Date.now() - cached.at >= WEATHER_TTL) {
      load();
    }
    const id = setInterval(load, WEATHER_TTL);
    return () => {
      alive = false;
      clearInterval(id);
    };
  }, [cityId]);

  const cancelMilk = useCallback(() => {
    for (const t of milkTimers.current) {
      clearTimeout(t);
    }
    milkTimers.current = [];
    setMilk(false);
  }, []);

  useEffect(() => cancelMilk, [cancelMilk]);

  const pickTheme = (id: ThemeId) => {
    if (id === themeId) {
      return;
    }
    cancelMilk();
    setBoba(false);
    setAnimatePattern(true);
    saveTheme(id);
  };

  // "surprise me": milk tea pour, 20 s of boba, then back
  const pourBoba = () => {
    cancelMilk();
    if (reduceMotion) {
      setAnimatePattern(true);
      setBoba(true);
      milkTimers.current = [setTimeout(() => setBoba(false), BOBA_MS)];
      return;
    }
    setAnimatePattern(false);
    milkTimers.current = [
      setTimeout(() => setMilk(true), 30),
      setTimeout(() => setBoba(true), 1550),
      setTimeout(() => setMilk(false), 3450),
      setTimeout(() => setMilk(true), BOBA_MS),
      setTimeout(() => setBoba(false), BOBA_MS + 1550),
      setTimeout(() => setMilk(false), BOBA_MS + 3450),
    ];
  };

  return (
    <>
      <Scene
        animatePattern={animatePattern}
        phase={phase}
        rainy={rainy}
        theme={th}
      />
      <Critters theme={th} />

      <div className="page">
        <header className="top">
          <ThemePicker current={th} onPick={pickTheme} />
          <div className="center-col">
            <CityToggle current={cityId} onPick={saveCity} />
            <ClockWindow cityId={cityId} now={now} phase={phase} weather={wx} />
          </div>
          <SurpriseButton active={boba} onClick={pourBoba} />
        </header>

        <main>
          <AppsWindow theme={th} />
        </main>

        <Player now={now} />

        <footer className="credits">
          <a href="https://www.flaticon.com">icons from flaticons</a>
        </footer>
      </div>

      {milk && <MilkLayer />}
    </>
  );
};
