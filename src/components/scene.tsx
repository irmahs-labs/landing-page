"use client";

import type { CSSProperties } from "react";

import { useViewport } from "@/hooks/use-viewport";
import { H0, pct, W0 } from "@/lib/format";
import { skyTint } from "@/lib/sky";
import type { SkyPhase } from "@/lib/sky";

const STARS = Array.from({ length: 40 }, (_, i) => ({
  delay: `${-(i % 7) * 0.6}s`,
  duration: `${2.2 + (i % 5) * 0.7}s`,
  left: pct((i * 197 + 53) % 1420, W0),
  size: 7 + ((i * 7) % 9),
  top: pct(((i * 131 + 29) % 560) + 10, H0),
}));

const CLOUDS = [
  { delay: -20, dur: 90, top: 250, w: 200 },
  { delay: -75, dur: 120, top: 120, w: 150 },
  { delay: -100, dur: 150, top: 470, w: 240 },
  { delay: -40, dur: 105, top: 370, w: 120 },
  { delay: -60, dur: 110, top: 60, w: 210 },
  { delay: -10, dur: 95, top: 180, w: 170 },
];

const DROPS = Array.from({ length: 60 }, (_, i) => ({
  animationDelay: `${(-((i * 0.137) % 1.2)).toFixed(2)}s`,
  animationDuration: `${(0.7 + (i % 5) * 0.12).toFixed(2)}s`,
  height: `${16 + ((i * 7) % 18)}px`,
  left: pct((i * 89 + 17) % 1500, W0),
}));

interface SceneProps {
  phase: SkyPhase | null;
  rainy: boolean;
}

export const Scene = ({ phase, rainy }: SceneProps) => {
  const viewport = useViewport();

  let bodyStyle: CSSProperties | undefined;
  if (phase && viewport) {
    // The sun and moon scale with the screen: 15.5% of its short side
    const size = Math.round(
      Math.min(180, Math.max(60, Math.min(viewport.w, viewport.h) * 0.155))
    );
    const margin = viewport.w >= 900 ? size * 0.8 : 15;
    const rising = phase.prog < 0.5;
    const yFrac = rising
      ? 0.85 - (phase.prog / 0.5) * 0.556
      : 0.294 + ((phase.prog - 0.5) / 0.5) * 0.556;
    const left = rising ? viewport.w - margin - size : margin;
    bodyStyle = {
      height: `${size}px`,
      left: `${Math.round(left)}px`,
      // yFrac places the centre, so the arc stays put whatever the size
      top: `${Math.round(viewport.h * yFrac - size / 2)}px`,
      width: `${size}px`,
    };
  }

  let tintOpacity = 0;
  if (phase) {
    tintOpacity = phase.isDay
      ? phase.twilight * 0.28
      : 0.22 + phase.deep * 0.38;
  }

  const isDay = phase?.isDay ?? true;
  const visibleClouds = rainy ? 6 : 4;

  return (
    <div aria-hidden="true" className="scene">
      <div
        className="sky-tint"
        style={{
          backgroundColor: phase ? skyTint(phase) : undefined,
          opacity: tintOpacity.toFixed(2),
        }}
      />
      <div
        className="stars"
        hidden={isDay}
        style={{ opacity: (0.3 + (phase?.deep ?? 0) * 0.7).toFixed(2) }}
      >
        {STARS.map((s) => (
          <svg
            className="star"
            height={s.size}
            key={s.left}
            style={{
              animationDelay: s.delay,
              animationDuration: s.duration,
              left: s.left,
              top: s.top,
            }}
            viewBox="0 0 12 12"
            width={s.size}
          >
            <path
              d="M6 0 L7.2 4.8 L12 6 L7.2 7.2 L6 12 L4.8 7.2 L0 6 L4.8 4.8 Z"
              fill="#fff3cf"
              stroke="#2f3b34"
              strokeWidth="0.6"
            />
          </svg>
        ))}
      </div>
      <div className="sky-body" hidden={!bodyStyle} style={bodyStyle}>
        <div className="bob">
          {isDay ? (
            <svg className="sun" viewBox="0 0 100 100">
              <g className="rays" strokeLinecap="round" strokeWidth="5">
                <path d="M50 4 V16 M50 84 V96 M4 50 H16 M84 50 H96 M17.5 17.5 L26 26 M74 74 L82.5 82.5 M17.5 82.5 L26 74 M74 26 L82.5 17.5" />
              </g>
              <circle cx="50" cy="50" r="24" />
            </svg>
          ) : (
            <svg className="moon" viewBox="0 0 100 100">
              <path
                d="M62 16 A34 34 0 1 0 86 66 A27 27 0 1 1 62 16 Z"
                fill="#fff3cf"
              />
              <circle cx="40" cy="56" fill="#efe2b0" r="4" />
              <circle cx="52" cy="74" fill="#efe2b0" r="3" />
            </svg>
          )}
        </div>
      </div>
      <div className="clouds">
        {CLOUDS.map((c, i) => (
          <svg
            className="cloud"
            height={Math.round(c.w * 0.45)}
            key={c.top}
            style={{
              animationDelay: `${c.delay}s`,
              animationDuration: `${c.dur}s`,
              display: i < visibleClouds ? undefined : "none",
              opacity: isDay ? 1 : 0.8,
              top: pct(c.top, H0),
            }}
            viewBox="0 0 200 90"
            width={c.w}
          >
            <path d="M40 82 H165 A25 25 0 0 0 160 34 A38 38 0 0 0 88 24 A30 30 0 0 0 40 47 A18 18 0 0 0 40 82 Z" />
          </svg>
        ))}
      </div>
      <div className="rain" hidden={!rainy}>
        {DROPS.map((d) => (
          <div className="drop" key={d.left} style={d} />
        ))}
        <div className="flash" />
      </div>
      <div
        className="sky-dim"
        style={{ opacity: ((phase?.deep ?? 0) * 0.28).toFixed(2) }}
      />
    </div>
  );
};
