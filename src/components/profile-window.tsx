"use client";

import { chooseLanguage, useCopy, useLanguage } from "@/lib/language";
import type { Language } from "@/lib/language";

import { LotusIcon } from "./icons";
import { Window } from "./window";

const COPY = {
  en: {
    khmer: "Khmer",
    label: "Profile",
    languages: "Languages",
    names: { en: "English", fr: "French" },
    role: "Software Engineer",
    studies: "Master’s in Business Informatics",
    switchTo: (name: string) => `Show the site in ${name}`,
  },
  fr: {
    khmer: "Khmer",
    label: "Profil",
    languages: "Langues",
    names: { en: "Anglais", fr: "Français" },
    role: "Ingénieure logiciel",
    studies: "Master en informatique de gestion",
    switchTo: (name: string) => `Afficher le site en ${name.toLowerCase()}`,
  },
};

/** The languages Irma speaks; the site can be read in the first two */
const SPOKEN: readonly (Language | "km")[] = ["fr", "en", "km"];

const CODES = { en: "EN", fr: "FR", km: "KH" } as const;

const PinIcon = () => (
  <svg aria-hidden="true" height="16" viewBox="0 0 24 24" width="16">
    <path
      d="M12 21.5 C12 21.5 4.5 14.5 4.5 9.5 A7.5 7.5 0 0 1 19.5 9.5 C19.5 14.5 12 21.5 12 21.5 Z"
      fill="#f0675c"
      stroke="#2f3b34"
      strokeLinejoin="round"
      strokeWidth="1.6"
    />
    <circle cx="12" cy="9.5" fill="#fff" r="2.6" />
  </svg>
);

/**
 * Who runs this desktop: name, role, studies, where and which languages.
 * English and French are buttons that put the site in that language, as the
 * header's pill does; Khmer is only spoken.
 */
export const ProfileWindow = () => {
  const t = useCopy(COPY);
  const current = useLanguage();

  return (
    <Window className="profile-window" label={t.label} title="profile.exe">
      <div className="profile-body">
        <div className="profile-photo">
          <LotusIcon size={70} />
        </div>
        <div className="profile-text">
          <h2 className="profile-name">Irma Houver Sing</h2>
          <span className="profile-role">{t.role}</span>
          <span className="profile-line">{t.studies}</span>
          <span className="profile-line">
            <PinIcon />
            Courbevoie, Île-de-France
          </span>
          <ul aria-label={t.languages} className="languages">
            {SPOKEN.map((code) => {
              if (code === "km") {
                return (
                  <li className="lang" key={code} title={t.khmer}>
                    <span aria-hidden="true">{CODES[code]}</span>
                    <span className="sr-only">{t.khmer}</span>
                  </li>
                );
              }

              const name = t.names[code];

              return (
                <li key={code}>
                  <button
                    aria-label={name}
                    aria-pressed={code === current}
                    className={code === current ? "lang is-current" : "lang"}
                    onClick={() => chooseLanguage(code)}
                    title={t.switchTo(name)}
                    type="button"
                  >
                    {CODES[code]}
                  </button>
                </li>
              );
            })}
          </ul>
        </div>
      </div>
    </Window>
  );
};
