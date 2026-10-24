import { useRef } from "react";

import { useCv } from "@/hooks/use-cv";
import type { UploadState } from "@/hooks/use-cv";
import { fmtSize } from "@/lib/format";
import { CV, SOCIALS } from "@/lib/socials";

import { Window } from "./window";

// A page with its corner folded and an arrow down: the CV, to download
const CV_ICON =
  "M6 3 H14 L18 7 V21 H6 Z M14 3 V7 H18 M12 10 V17 M9 14 L12 17 L15 14";

const UPLOAD_NOTE: Record<UploadState, string> = {
  done: "CV replaced",
  failed: "couldn't replace it: is it a PDF under 10 MB?",
  idle: "",
  uploading: "uploading…",
};

/** Where else to find me, each opening in a new tab, and my CV to download */
export const SocialsWindow = () => {
  const { cv, replace, upload } = useCv();
  const picker = useRef<HTMLInputElement>(null);
  const size = cv ? `PDF · ${fmtSize(cv.bytes)}` : "PDF";

  return (
    <Window className="socials-window" label="Socials" title="socials.lnk">
      <ul className="socials">
        {SOCIALS.map((s) => (
          <li key={s.href}>
            <a
              aria-label={`${s.name}, ${s.handle} (opens in a new tab)`}
              className="btn social"
              href={s.href}
              rel="noreferrer"
              target="_blank"
            >
              <span className="social-icon" style={{ backgroundColor: s.bg }}>
                <svg aria-hidden="true" stroke={s.fg} viewBox="0 0 24 24">
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
            aria-label={`Download my CV (${size})`}
            className="btn social"
            download={CV.file}
            href={CV.href}
          >
            <span
              className="social-icon"
              style={{ backgroundColor: "#f2d27a" }}
            >
              <svg aria-hidden="true" stroke="#2f3b34" viewBox="0 0 24 24">
                <path d={CV_ICON} />
              </svg>
            </span>
            <span className="social-text">
              <span className="social-name">My CV</span>
              <span className="social-handle">{size}</span>
            </span>
          </a>
        </li>
        {cv?.canReplace ? (
          <li className="cv-replace">
            <input
              accept="application/pdf"
              aria-label="New CV, as a PDF"
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
              replace my CV
            </button>
            <span aria-live="polite" className="cv-replace__note">
              {UPLOAD_NOTE[upload]}
            </span>
          </li>
        ) : null}
      </ul>
    </Window>
  );
};
