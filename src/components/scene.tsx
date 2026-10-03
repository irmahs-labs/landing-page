"use client";

import { useEffect, useState } from "react";
import type { CSSProperties } from "react";

import { useViewport } from "@/hooks/use-viewport";
import { H0, pct, W0 } from "@/lib/format";
import { skyTint } from "@/lib/sky";
import type { SkyPhase } from "@/lib/sky";
import { PATTERN_IMG } from "@/lib/themes";
import type { Theme } from "@/lib/themes";

import { Wave } from "./wave";

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

const FLOWER_SIZES = [22, 48, 30, 60, 26, 40, 54, 20, 36, 58, 28, 44, 32, 50];
const FLOWER_FALLS = [11, 24, 15, 30, 9, 19, 27, 13, 22, 33, 10, 17, 25, 14];
const FLOWERS = FLOWER_SIZES.map((size, i) => {
  const fall = FLOWER_FALLS[i] ?? 20;
  return {
    animationDelay: `${(-((i * 7.3) % fall)).toFixed(1)}s`,
    animationDuration: `${fall}s`,
    height: `${size}px`,
    left: pct(6 + i * 102 + ((i * 37) % 40), W0),
    spin: `${17 + ((i * 5) % 12)}s`,
    width: `${size}px`,
  };
});

const PEARLS = Array.from({ length: 28 }, (_, i) => {
  const size = `${8 + ((i * 5) % 7)}px`;
  return {
    animationDelay: `${(-((i * 1.7) % 16)).toFixed(1)}s`,
    animationDuration: `${9 + ((i * 7) % 9)}s`,
    height: size,
    left: pct(10 + i * 51 + ((i * 23) % 30), W0),
    width: size,
  };
});

const BOBA_LAYERS = [
  { animation: "slosh 3.4s linear infinite reverse", color: "#e3c9b0" },
  { animation: "slosh 2.4s linear infinite", color: "#fbf3e6" },
];

interface PatternLayer {
  id: number;
  state: "in" | "out" | "still";
  theme: Theme;
}

interface PatternsProps {
  animate: boolean;
  night: boolean;
  theme: Theme;
}

/**
 * Background pattern; crossfades to the new theme's when `animate` is set.
 * At night it turns to light lines so it still shows against the dark sky.
 */
const Patterns = ({ animate, night, theme }: PatternsProps) => {
  const [layers, setLayers] = useState<PatternLayer[]>([
    { id: 0, state: "still", theme },
  ]);

  // Add a layer as soon as the theme changes, during render
  const top = layers.at(-1);
  if (top && top.theme.id !== theme.id) {
    const added: PatternLayer = {
      id: top.id + 1,
      state: animate ? "in" : "still",
      theme,
    };
    setLayers(
      animate
        ? [...layers.map((l) => ({ ...l, state: "out" as const })), added]
        : [added]
    );
  }

  // Drop faded-out layers once their animation is over
  const fading = layers.some((l) => l.state === "out");
  useEffect(() => {
    if (!fading) {
      return;
    }
    const t = setTimeout(
      () => setLayers((prev) => prev.filter((l) => l.state !== "out")),
      850
    );
    return () => clearTimeout(t);
  }, [fading]);

  return (
    <div className={`patterns${night ? " is-night" : ""}`}>
      {layers.map(({ id, state, theme: th }) => {
        const img = th.patternImg ? PATTERN_IMG[th.patternImg] : null;
        return (
          <div
            className={state === "still" ? undefined : `pattern-${state}`}
            key={id}
          >
            <div style={{ background: th.pattern ?? "transparent" }} />
            {img && (
              <div
                style={{
                  backgroundImage: `url(/assets/patterns/${img.file})`,
                  backgroundRepeat: "repeat",
                  backgroundSize: `${img.size}px auto`,
                }}
              />
            )}
          </div>
        );
      })}
    </div>
  );
};

/** Falling flowers; the image fades out and back in when the theme changes */
const Flowers = ({ src }: { src: string | null }) => {
  const [shown, setShown] = useState(src);
  const swapping = Boolean(src && shown && src !== shown);

  useEffect(() => {
    if (!swapping) {
      return;
    }
    const t = setTimeout(() => setShown(src), 400);
    return () => clearTimeout(t);
  }, [swapping, src]);

  const img = shown ?? src;
  return (
    <div className="flowers" hidden={!src}>
      {FLOWERS.map((f) => (
        <span
          className="flower"
          key={f.left}
          style={{
            animationDelay: f.animationDelay,
            animationDuration: f.animationDuration,
            height: f.height,
            left: f.left,
            width: f.width,
          }}
        >
          <span style={{ animationDuration: f.spin }}>
            {img && (
              // oxlint-disable-next-line next/no-img-element -- decorative sprite, sized by CSS
              <img
                alt=""
                className={swapping ? "swap" : undefined}
                decoding="async"
                src={img}
              />
            )}
          </span>
        </span>
      ))}
    </div>
  );
};

const BobaScene = () => (
  <div className="boba-scene">
    {PEARLS.map((p) => (
      <span className="tiny-pearl" key={p.left} style={p} />
    ))}
    <div className="fill-up">
      {BOBA_LAYERS.map(({ animation, color }) => (
        <div className="swell" key={color}>
          <Wave fill={color} style={{ animation }} />
          <div style={{ backgroundColor: color }} />
        </div>
      ))}
    </div>
  </div>
);

interface SceneProps {
  animatePattern: boolean;
  phase: SkyPhase | null;
  rainy: boolean;
  theme: Theme;
}

export const Scene = ({ animatePattern, phase, rainy, theme }: SceneProps) => {
  const viewport = useViewport();

  let bodyStyle: CSSProperties | undefined;
  if (phase && viewport) {
    const wide = viewport.w >= 900;
    const rising = phase.prog < 0.5;
    const yFrac = rising
      ? 0.8 - (phase.prog / 0.5) * 0.556
      : 0.244 + ((phase.prog - 0.5) / 0.5) * 0.556;
    let left = wide ? 110 : 15;
    if (rising) {
      left = viewport.w - (wide ? 210 : 115);
    }
    bodyStyle = {
      left: `${left}px`,
      top: `${Math.round(viewport.h * yFrac)}px`,
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
      {/* Above the tint, so the night sky doesn't hide it */}
      <Patterns animate={animatePattern} night={!isDay} theme={theme} />
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
      {theme.id === "boba" && <BobaScene />}
      <Flowers src={theme.flower} />
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
