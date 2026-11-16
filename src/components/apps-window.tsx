"use client";

import { useState } from "react";

import { useAppDeploys } from "@/hooks/use-app-deploys";
import { APPS } from "@/lib/apps";
import type { AppLink } from "@/lib/apps";
import { fmtDate } from "@/lib/format";
import { useCopy, useLanguage } from "@/lib/language";

import { Window } from "./window";

const COPY = {
  en: {
    items: (n: number) => `${n} items`,
    label: "My apps",
    more: "More apps",
    newTab: "(opens in a new tab)",
    next: "Next app",
    previous: "Previous app",
    updated: "Updated",
  },
  fr: {
    items: (n: number) => `${n} éléments`,
    label: "Mes apps",
    more: "Plus d’apps",
    newTab: "(s’ouvre dans un nouvel onglet)",
    next: "App suivante",
    previous: "App précédente",
    updated: "Mise à jour le",
  },
};

const Arrow = ({ d }: { d: string }) => (
  <svg aria-hidden="true" viewBox="0 0 24 24">
    <path d={d} />
  </svg>
);

const Tile = ({
  app,
  deployed,
}: {
  app: AppLink;
  /** When it was last deployed, as an ISO date, once GitHub has said */
  deployed: string | null | undefined;
}) => {
  const language = useLanguage();
  const t = COPY[language];

  return (
    <a className="tile" href={app.href} rel="noreferrer" target="_blank">
      <span className={app.shot ? "app-shot has-shot" : "app-shot"}>
        {app.shot && (
          // oxlint-disable-next-line next/no-img-element -- pre-sized screenshot, cropped by CSS
          <img alt="" height={600} src={app.shot} width={960} />
        )}
        <span className="app-icon">
          <svg aria-hidden="true" viewBox="0 0 24 24">
            <path d={app.icon} />
          </svg>
        </span>
        {deployed && (
          <span className="app-updated">
            {t.updated}{" "}
            <time dateTime={deployed}>{fmtDate(deployed, language)}</time>
          </span>
        )}
      </span>
      <span className="app-text">
        <span className="app-name">
          <span className="app-name__text">{app.name}</span>
          <Arrow d="M5 12 H19 M13 6 L19 12 L13 18" />
        </span>
        <span className="app-desc">{app.desc[language]}</span>
        <span className="sr-only">{t.newTab}</span>
      </span>
    </a>
  );
};

/**
 * The apps one at a time, paged with the arrows below; the pages wrap
 * around. One app always fills the window, whatever its size: resizing it
 * only makes that one bigger.
 */
export const AppsWindow = () => {
  const deploys = useAppDeploys();
  const t = useCopy(COPY);
  const [index, setIndex] = useState(0);
  const app = APPS[index] ?? APPS[0];

  const go = (step: number) =>
    setIndex((current) => (current + step + APPS.length) % APPS.length);

  return (
    <Window
      className="apps-window"
      label={t.label}
      meta={t.items(APPS.length)}
      title="launcher.exe"
    >
      <div className="apps-body">
        <div className="apps-grid">
          {app ? (
            <Tile app={app} deployed={deploys[app.href]} key={app.href} />
          ) : null}
        </div>
        <nav aria-label={t.more} className="pager">
          <button
            aria-label={t.previous}
            className="btn pager-btn"
            disabled={APPS.length < 2}
            onClick={() => go(-1)}
            type="button"
          >
            <Arrow d="M19 12 H5 M11 6 L5 12 L11 18" />
          </button>
          <span aria-live="polite" className="pager-label">
            {index + 1} / {APPS.length}
          </span>
          <button
            aria-label={t.next}
            className="btn pager-btn"
            disabled={APPS.length < 2}
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
