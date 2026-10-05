"use client";

import { useEffect, useState } from "react";
import type { CSSProperties } from "react";

import { useReducedMotion } from "@/hooks/use-reduced-motion";
import { APPS } from "@/lib/apps";
import type { AppLink } from "@/lib/apps";
import { BASE_THEME } from "@/lib/themes";
import type { Theme } from "@/lib/themes";

import { Window } from "./window";

const BURST_BITS = Array.from({ length: 12 }, (_, k) => k);

/** A little burst of the theme's flowers and animals */
const Burst = ({ theme }: { theme: Theme }) => (
  <span aria-hidden="true" className="burst-wrap">
    {BURST_BITS.map((k) => {
      const isAnimal = k % 2 === 1 && Boolean(theme.animal);
      const src = isAnimal ? theme.animal : theme.flower;
      const sz = isAnimal ? 30 + ((k * 5) % 12) : 20 + ((k * 7) % 14);
      return (
        <span
          key={k}
          style={{
            animation: `burst${k} .95s cubic-bezier(.2,.7,.3,1) both`,
            height: `${sz}px`,
            left: `${-sz / 2}px`,
            top: `${-sz / 2}px`,
            width: `${sz}px`,
          }}
        >
          {src ? (
            // oxlint-disable-next-line next/no-img-element -- tiny decorative sprite, sized by CSS
            <img alt="" src={src} />
          ) : (
            <span className="pearl" />
          )}
        </span>
      );
    })}
  </span>
);

const Tile = ({ app, theme }: { app: AppLink; theme: Theme }) => {
  const reduceMotion = useReducedMotion();
  // Bumped on every hover so the burst restarts
  const [burst, setBurst] = useState(0);

  useEffect(() => {
    if (!burst) {
      return;
    }
    const t = setTimeout(() => setBurst(0), 1000);
    return () => clearTimeout(t);
  }, [burst]);

  // Cute Matcha has no flower or animal to throw, so its tiles don't burst
  const start = () => {
    if (!reduceMotion && theme.id !== BASE_THEME) {
      setBurst(Date.now());
    }
  };

  return (
    <a className="tile" href={app.href} onFocus={start} onMouseEnter={start}>
      <span
        className="app-shot"
        // SAFETY: CSSProperties has no index signature for custom properties
        style={
          {
            "--ic-bg": app.icon.bg,
            "--ic-fg": app.icon.fg,
          } as CSSProperties
        }
      >
        <span className="app-icon">
          <svg aria-hidden="true" viewBox="0 0 24 24">
            <path d={app.icon.path} />
          </svg>
        </span>
      </span>
      <span className="app-text">
        <span className="app-name">{app.name}</span>
        <span className="app-desc">{app.desc}</span>
      </span>
      {burst > 0 && <Burst key={burst} theme={theme} />}
    </a>
  );
};

const Arrow = ({ d }: { d: string }) => (
  <svg aria-hidden="true" viewBox="0 0 24 24">
    <path d={d} />
  </svg>
);

/** One app at a time, paged with the arrows below it; the pages wrap around */
export const AppsWindow = ({ theme }: { theme: Theme }) => {
  const [page, setPage] = useState(0);
  const app = APPS[page] ?? APPS[0];
  const go = (step: number) =>
    setPage((p) => (p + step + APPS.length) % APPS.length);

  return (
    <Window
      className="apps-window"
      label="My apps"
      meta={`${APPS.length} items`}
      title="my_apps"
    >
      <div className="apps-body">
        {app && <Tile app={app} key={app.href} theme={theme} />}
        <nav aria-label="More apps" className="pager">
          <button
            aria-label="Previous app"
            className="btn pager-btn"
            onClick={() => go(-1)}
            type="button"
          >
            <Arrow d="M19 12 H5 M11 6 L5 12 L11 18" />
          </button>
          <span aria-live="polite" className="pager-label">
            {page + 1} / {APPS.length}
          </span>
          <button
            aria-label="Next app"
            className="btn pager-btn"
            onClick={() => go(1)}
            type="button"
          >
            <Arrow d="M5 12 H19 M13 6 L19 12 L13 18" />
          </button>
        </nav>
      </div>
    </Window>
  );
};
