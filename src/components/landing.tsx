"use client";

import { useEffect, useRef, useState } from "react";

import { useNow } from "@/hooks/use-now";
import { useStoredChoice } from "@/hooks/use-stored-choice";
import { CITIES, CITY_IDS, DEFAULT_CITY } from "@/lib/cities";
import type { CityId } from "@/lib/cities";
import { skyPhase } from "@/lib/sky";
import { fetchWeather } from "@/lib/weather";
import type { Weather } from "@/lib/weather";

import { AppsWindow } from "./apps-window";
import { ChatWindow } from "./chat-window";
import { CityToggle } from "./city-toggle";
import { ClockWindow } from "./clock-window";
import { Header } from "./header";
import { Player } from "./player";
import { PlaymateSwitch } from "./playmate-switch";
import { ProfileWindow } from "./profile-window";
import { Scene } from "./scene";
import { SocialsWindow } from "./socials-window";
import { Tokkae } from "./tokkae";
import type { PlaymateNudge } from "./tokkae";

const WEATHER_TTL = 15 * 60 * 1000;

// Whether the visitor has brought Tokkae's playmate out; it starts at home
const PLAYMATE_SWITCH = ["off", "on"] as const;

const setRootVar = (k: string, v: string) =>
  document.documentElement.style.setProperty(k, v);

export const Landing = () => {
  const now = useNow();

  const [playmate, savePlaymate] = useStoredChoice(
    "playmate",
    PLAYMATE_SWITCH,
    "off"
  );

  const playmateOn = playmate === "on";
  const [cityId, saveCity] = useStoredChoice("city", CITY_IDS, DEFAULT_CITY);
  const [weather, setWeather] = useState<Partial<Record<CityId, Weather>>>({});
  // Mirrors `weather` so the fetch effect can check freshness without depending on it
  const weatherCache = useRef(weather);
  // The visitor's own switches, for Tokkae to greet or miss its playmate
  const [nudge, setNudge] = useState<PlaymateNudge | null>(null);

  const city = CITIES[cityId];
  const phase = now ? skyPhase(city, now) : null;
  const wx = weather[cityId];
  const rainy = Boolean(wx?.rainy);
  const isDay = phase?.isDay ?? true;

  // Clouds are part of the sky, so they keep their own colours in both
  // themes: daytime ones the light cloud white, not the (themed) panel
  useEffect(() => {
    let fill = isDay ? "#f7f8de" : "#8b9590";

    if (rainy) {
      fill = isDay ? "#aeb8b4" : "#5d6863";
    }

    setRootVar("--cloud-fill", fill);
  }, [isDay, rainy]);

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

  const togglePlaymate = () => {
    savePlaymate(playmateOn ? "off" : "on");
    setNudge({ kind: playmateOn ? "cry" : "greet" });
  };

  return (
    <>
      <Scene phase={phase} rainy={rainy} />

      <div className="page">
        <Header>
          <PlaymateSwitch on={playmateOn} onToggle={togglePlaymate} />
          <CityToggle current={cityId} onPick={saveCity} />
        </Header>

        <main className="desk">
          <div className="desk-main">
            <div className="desk-row">
              <ClockWindow
                cityId={cityId}
                now={now}
                phase={phase}
                weather={wx}
              />
              <ProfileWindow />
            </div>
            <AppsWindow />
          </div>
          <div className="desk-side">
            <Player now={now} />
            <SocialsWindow />
          </div>
        </main>
      </div>

      <ChatWindow />
      <Tokkae nudge={nudge} playmate={playmateOn} />
    </>
  );
};
