import { LotusIcon } from "./icons";
import { Window } from "./window";

const LANGUAGES = [
  { code: "FR", name: "French" },
  { code: "EN", current: true, name: "English" },
  { code: "KH", name: "Khmer" },
];

const LINKS = [
  {
    bg: "#3b4a42",
    fg: "#fff3cf",
    handle: "@irmahs",
    href: "https://github.com/irmahs",
    name: "GitHub",
    path: "M8 7 L3 12 L8 17 M16 7 L21 12 L16 17 M13.5 5 L10.5 19",
  },
  {
    bg: "#4a7fc0",
    fg: "#fff",
    handle: "in/irma-hs",
    href: "https://www.linkedin.com/in/irma-hs/",
    name: "LinkedIn",
    path: "M12 11.5 A3.5 3.5 0 1 0 12 4.5 A3.5 3.5 0 1 0 12 11.5 Z M5 20 C5 16 8 14 12 14 C16 14 19 16 19 20",
  },
];

const PinIcon = () => (
  <svg aria-hidden="true" height="16" viewBox="0 0 24 24" width="16">
    <path
      d="M12 21.5 C12 21.5 4.5 14.5 4.5 9.5 A7.5 7.5 0 0 1 19.5 9.5 C19.5 14.5 12 21.5 12 21.5 Z"
      fill="#e0574b"
      stroke="#2f3b34"
      strokeLinejoin="round"
      strokeWidth="1.6"
    />
    <circle cx="12" cy="9.5" fill="#fff" r="2.6" />
  </svg>
);

/**
 * Who runs this desktop: name, role, studies, where, which languages, and
 * where else to find me
 */
export const ProfileWindow = () => (
  <Window className="profile-window" label="Profile" title="profile.exe">
    <div className="profile-body">
      <div className="profile-photo">
        <LotusIcon size={70} />
      </div>
      <div className="profile-text">
        <h1 className="profile-name">Irma Houver Sing</h1>
        <span className="profile-role">Software Engineer</span>
        <span className="profile-line">Master’s in Business Informatics</span>
        <span className="profile-line">
          <PinIcon />
          Courbevoie, Île-de-France
        </span>
        <div className="profile-foot">
          <ul aria-label="Languages" className="languages">
            {LANGUAGES.map((lang) => (
              <li
                className={lang.current ? "lang is-current" : "lang"}
                key={lang.code}
                title={lang.name}
              >
                <span aria-hidden="true">{lang.code}</span>
                <span className="sr-only">{lang.name}</span>
              </li>
            ))}
          </ul>
          <ul aria-label="Elsewhere" className="profile-links">
            {LINKS.map((link) => (
              <li key={link.href}>
                <a
                  aria-label={`${link.name}, ${link.handle} (opens in a new tab)`}
                  className="btn profile-link"
                  href={link.href}
                  rel="noreferrer"
                  style={{ backgroundColor: link.bg }}
                  target="_blank"
                  title={`${link.name} · ${link.handle}`}
                >
                  <svg aria-hidden="true" stroke={link.fg} viewBox="0 0 24 24">
                    <path d={link.path} />
                  </svg>
                </a>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  </Window>
);
