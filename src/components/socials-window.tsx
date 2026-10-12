import { CV, SOCIALS } from "@/lib/socials";

import { Window } from "./window";

// A page with its corner folded and an arrow down: the CV, to download
const CV_ICON =
  "M6 3 H14 L18 7 V21 H6 Z M14 3 V7 H18 M12 10 V17 M9 14 L12 17 L15 14";

/** Where else to find me, each opening in a new tab, and my CV to download */
export const SocialsWindow = () => (
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
          aria-label={`Download my CV (${CV.size})`}
          className="btn social"
          download={CV.file}
          href={CV.href}
        >
          <span className="social-icon" style={{ backgroundColor: "#f2d27a" }}>
            <svg aria-hidden="true" stroke="#2f3b34" viewBox="0 0 24 24">
              <path d={CV_ICON} />
            </svg>
          </span>
          <span className="social-text">
            <span className="social-name">My CV</span>
            <span className="social-handle">{CV.size}</span>
          </span>
        </a>
      </li>
    </ul>
  </Window>
);
