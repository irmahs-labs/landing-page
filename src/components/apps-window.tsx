"use client";

import { useEffect, useRef, useState } from "react";
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
        className={app.shot ? "app-shot has-shot" : "app-shot"}
        // SAFETY: CSSProperties has no index signature for custom properties
        style={
          {
            "--ic-bg": app.icon.bg,
            "--ic-fg": app.icon.fg,
          } as CSSProperties
        }
      >
        {app.shot && (
          // oxlint-disable-next-line next/no-img-element -- pre-sized screenshot, cropped by CSS
          <img alt="" height={600} src={app.shot} width={960} />
        )}
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

/** The smallest a tile gets before the window shows fewer apps */
const TILE = { h: 240, w: 380 };
const GAP = 12;

interface Layout {
  cols: number;
  count: 1 | 2 | 4 | 6;
}

const fit = (room: number, min: number) =>
  Math.floor((room + GAP) / (min + GAP));

/** As many apps as fit at their smallest: 1, 2, 4 or 6 */
const layoutFor = (w: number, h: number): Layout => {
  const cols = fit(w, TILE.w);
  const rows = fit(h, TILE.h);
  if ((cols >= 3 && rows >= 2) || (cols >= 2 && rows >= 3)) {
    return { cols: cols >= 3 ? 3 : 2, count: 6 };
  }
  if (cols >= 2 && rows >= 2) {
    return { cols: 2, count: 4 };
  }
  if (cols >= 2 || rows >= 2) {
    return { cols: cols >= 2 ? 2 : 1, count: 2 };
  }
  return { cols: 1, count: 1 };
};

/**
 * The apps, a page at a time, paged with the arrows below; the pages wrap
 * around. It opens on one app, and resizing the window shows 2, 4 or 6.
 */
export const AppsWindow = ({ theme }: { theme: Theme }) => {
  const grid = useRef<HTMLDivElement>(null);
  const [layout, setLayout] = useState<Layout>({ cols: 1, count: 1 });
  // The first app shown, so a new page size keeps it in view
  const [first, setFirst] = useState(0);
  const { cols, count } = layout;
  const pages = Math.ceil(APPS.length / count);
  const page = Math.floor(first / count);
  const shown = APPS.slice(page * count, page * count + count);
  const go = (step: number) =>
    setFirst(((page + step + pages) % pages) * count);

  useEffect(() => {
    const el = grid.current;
    if (!el) {
      return;
    }
    const observer = new ResizeObserver(([entry]) => {
      if (!entry) {
        return;
      }
      const next = layoutFor(entry.contentRect.width, entry.contentRect.height);
      setLayout((prev) =>
        prev.cols === next.cols && prev.count === next.count ? prev : next
      );
    });
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <Window
      className="apps-window"
      label="My apps"
      meta={`${APPS.length} items`}
      title="my_apps"
    >
      <div className="apps-body">
        <div
          className="apps-grid"
          data-count={count}
          ref={grid}
          // SAFETY: CSSProperties has no index signature for custom properties
          style={
            {
              "--cols": cols,
              "--rows": Math.ceil(count / cols),
            } as CSSProperties
          }
        >
          {shown.map((app) => (
            <Tile app={app} key={app.href} theme={theme} />
          ))}
        </div>
        <nav aria-label="More apps" className="pager">
          <button
            aria-label="Previous apps"
            className="btn pager-btn"
            disabled={pages < 2}
            onClick={() => go(-1)}
            type="button"
          >
            <Arrow d="M19 12 H5 M11 6 L5 12 L11 18" />
          </button>
          <span aria-live="polite" className="pager-label">
            {page + 1} / {pages}
          </span>
          <button
            aria-label="Next apps"
            className="btn pager-btn"
            disabled={pages < 2}
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
