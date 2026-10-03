"use client";

import { useEffect, useState } from "react";
import type { CSSProperties } from "react";

import { useReducedMotion } from "@/hooks/use-reduced-motion";
import { APPS } from "@/lib/apps";
import type { AppLink } from "@/lib/apps";
import type { Theme } from "@/lib/themes";

import { LotusIcon, WindowDots } from "./icons";

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

  const start = () => {
    if (!reduceMotion) {
      setBurst(Date.now());
    }
  };

  return (
    <li>
      <a className="tile" href={app.href} onFocus={start} onMouseEnter={start}>
        <span className="tile-head">
          <span
            className="app-icon"
            // SAFETY: CSSProperties has no index signature for custom properties
            style={
              {
                "--ic-bg": app.icon.bg,
                "--ic-fg": app.icon.fg,
              } as CSSProperties
            }
          >
            <svg aria-hidden="true" viewBox="0 0 24 24">
              <path d={app.icon.path} />
            </svg>
          </span>
          <span className="status">{app.status}</span>
        </span>
        <span className="app-name">{app.name}</span>
        <span className="app-desc">{app.desc}</span>
        <span className="open">
          open
          <svg aria-hidden="true" viewBox="0 0 24 24">
            <path d="M5 12 H19 M13 6 L19 12 L13 18" />
          </svg>
        </span>
        {burst > 0 && <Burst key={burst} theme={theme} />}
      </a>
    </li>
  );
};

export const AppsWindow = ({ theme }: { theme: Theme }) => (
  <section aria-label="My apps" className="window apps-window">
    <div className="titlebar">
      <WindowDots />
      <span className="titlebar-text">my_apps</span>
      <span className="titlebar-text titlebar-meta">{APPS.length} items</span>
    </div>
    <div className="apps-body">
      <div className="intro">
        <div className="avatar">
          <LotusIcon size={38} />
        </div>
        <div className="intro-name">
          <h1>Irma Houver Sing</h1>
          <span className="role">Fullstack developer</span>
        </div>
        <div className="bubble">hello! pick an app to try</div>
      </div>
      <ul className="apps">
        {APPS.map((app) => (
          <Tile app={app} key={app.href} theme={theme} />
        ))}
      </ul>
    </div>
  </section>
);
