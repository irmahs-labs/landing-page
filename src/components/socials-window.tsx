import { useRef } from "react";

import { useCv } from "@/hooks/use-cv";
import type { UploadState } from "@/hooks/use-cv";
import { fmtSize } from "@/lib/format";
import { useCopy } from "@/lib/language";
import { CV, SOCIALS } from "@/lib/socials";

import { Window } from "./window";

// A page with its corner folded and an arrow down: the CV, to download
const CV_ICON =
  "M6 3 H14 L18 7 V21 H6 Z M14 3 V7 H18 M12 10 V17 M9 14 L12 17 L15 14";

const COPY = {
  en: {
    cv: "My CV",
    download: (size: string) => `Download my CV (${size})`,
    label: "Socials",
    link: (name: string, handle: string) =>
      `${name}, ${handle} (opens in a new tab)`,
    newCv: "New CV, as a PDF",
    note: {
      done: "CV replaced",
      failed: "couldn't replace it: is it a PDF under 10 MB?",
      idle: "",
      uploading: "uploading…",
    } satisfies Record<UploadState, string>,
    replace: "replace my CV",
  },
  fr: {
    cv: "Mon CV",
    download: (size: string) => `Télécharger mon CV (${size})`,
    label: "Réseaux",
    link: (name: string, handle: string) =>
      `${name}, ${handle} (s’ouvre dans un nouvel onglet)`,
    newCv: "Nouveau CV, en PDF",
    note: {
      done: "CV remplacé",
      failed: "impossible de le remplacer : est-ce un PDF de moins de 10 Mo ?",
      idle: "",
      uploading: "envoi…",
    } satisfies Record<UploadState, string>,
    replace: "remplacer mon CV",
  },
};

/** Where else to find me, each opening in a new tab, and my CV to download */
export const SocialsWindow = () => {
  const { cv, replace, upload } = useCv();
  const t = useCopy(COPY);
  const picker = useRef<HTMLInputElement>(null);
  const size = cv ? `PDF · ${fmtSize(cv.bytes)}` : "PDF";

  return (
    <Window className="socials-window" label={t.label} title="socials.lnk">
      <ul className="socials">
        {SOCIALS.map((s) => (
          <li key={s.href}>
            <a
              aria-label={t.link(s.name, s.handle)}
              className="btn social"
              href={s.href}
              rel="noreferrer"
              target="_blank"
            >
              <span className="social-icon">
                <svg aria-hidden="true" viewBox="0 0 24 24">
                  <path d={s.path} />
                </svg>
              </span>
              <span className="social-text">
                <span className="social-name">{s.name}</span>
                <span className="social-handle">{s.handle}</span>
              </span>
            </a>
          </li>
        ))}
        <li>
          <a
            aria-label={t.download(size)}
            className="btn social"
            download={CV.file}
            href={CV.href}
          >
            <span className="social-icon">
              <svg aria-hidden="true" viewBox="0 0 24 24">
                <path d={CV_ICON} />
              </svg>
            </span>
            <span className="social-text">
              <span className="social-name">{t.cv}</span>
              <span className="social-handle">{size}</span>
            </span>
          </a>
        </li>
        {cv?.canReplace ? (
          <li className="cv-replace">
            <input
              accept="application/pdf"
              aria-label={t.newCv}
              hidden
              onChange={(event) => {
                const file = event.target.files?.[0];
                event.target.value = "";

                if (file) {
                  replace(file);
                }
              }}
              ref={picker}
              type="file"
            />
            <button
              className="btn btn--pill"
              disabled={upload === "uploading"}
              onClick={() => picker.current?.click()}
              type="button"
            >
              {t.replace}
            </button>
            <span aria-live="polite" className="cv-replace__note">
              {t.note[upload]}
            </span>
          </li>
        ) : null}
      </ul>
    </Window>
  );
};
