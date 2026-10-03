import { CITIES } from "@/lib/cities";
import type { CityId } from "@/lib/cities";
import { fmtMinutes } from "@/lib/format";
import type { SkyPhase } from "@/lib/sky";
import type { Weather } from "@/lib/weather";

import { WindowDots } from "./icons";

const CLOUD =
  "M7 20 H17 A4 4 0 0 0 16.5 12 A5.5 5.5 0 0 0 6 13.5 A3.3 3.3 0 0 0 7 20 Z";

const WeatherIcon = ({ isDay, rainy }: { isDay: boolean; rainy: boolean }) => {
  const common = {
    "aria-hidden": true,
    className: "wx",
    stroke: "#2f3b34",
    strokeLinejoin: "round",
    strokeWidth: 1.2,
    viewBox: "0 0 24 24",
  } as const;
  if (rainy) {
    return (
      <svg {...common} strokeLinecap="round">
        <path
          d="M6 14 H17 A4 4 0 0 0 16.5 6 A5.5 5.5 0 0 0 6 7.5 A3.3 3.3 0 0 0 6 14 Z"
          fill="#f7f8de"
        />
        <path
          d="M8 17 L7 20 M12 17 L11 20 M16 17 L15 20"
          stroke="#4a7fc0"
          strokeWidth="1.8"
        />
        <path
          d="M12.5 9 L10.5 12 H13 L11.5 14.5"
          fill="none"
          stroke="#e0574b"
          strokeWidth="1.2"
        />
      </svg>
    );
  }
  if (isDay) {
    return (
      <svg {...common}>
        <circle cx="9" cy="9" fill="#f2d27a" r="4.5" />
        <path d={CLOUD} fill="#f7f8de" />
      </svg>
    );
  }
  return (
    <svg {...common}>
      <path
        d="M10 3.5 A5.5 5.5 0 1 0 15 10.5 A4.4 4.4 0 1 1 10 3.5 Z"
        fill="#fff3cf"
      />
      <path d={CLOUD} fill="#f7f8de" />
    </svg>
  );
};

const formatIn = (tz: string, opts: Intl.DateTimeFormatOptions, d: Date) => {
  try {
    return new Intl.DateTimeFormat("en-GB", { ...opts, timeZone: tz }).format(
      d
    );
  } catch {
    return "";
  }
};

interface ClockWindowProps {
  cityId: CityId;
  now: Date | null;
  phase: SkyPhase | null;
  weather: Weather | undefined;
}

export const ClockWindow = ({
  cityId,
  now,
  phase,
  weather,
}: ClockWindowProps) => {
  const city = CITIES[cityId];
  let sunLine = "";
  if (phase) {
    sunLine = phase.isDay
      ? `sunrise ${fmtMinutes(phase.riseM)} · sunset ${fmtMinutes(phase.setM)}`
      : `moonrise ${fmtMinutes(phase.setM)} · moonset ${fmtMinutes(phase.riseM)}`;
  }

  return (
    <section aria-label="Date and weather" className="window clock-window">
      <div className="titlebar small">
        <WindowDots />
        <span className="titlebar-text">
          <span>{city.host}</span>
          <span className="km" hidden={cityId !== "phnom-penh"}>
            {" "}
            · ភ្នំពេញ
          </span>
        </span>
        <span className="spacer" />
      </div>
      <div className="clock-body">
        <div className="clock-text">
          <span className="clock-time">
            {now
              ? formatIn(
                  city.tz,
                  { hour: "2-digit", hour12: false, minute: "2-digit" },
                  now
                )
              : "--:--"}
          </span>
          <span className="clock-date">
            {now
              ? formatIn(
                  city.tz,
                  {
                    day: "numeric",
                    month: "long",
                    weekday: "long",
                    year: "numeric",
                  },
                  now
                )
              : ""}
          </span>
          <span className="clock-sun">{sunLine}</span>
        </div>
        <div className="weather">
          <WeatherIcon
            isDay={phase?.isDay ?? true}
            rainy={Boolean(weather?.rainy)}
          />
          <div className="weather-text">
            <span className="temp">{weather?.temp ?? "--°"}</span>
            <span className="cond">{weather?.cond ?? " "}</span>
          </div>
        </div>
      </div>
    </section>
  );
};
