import { LotusIcon } from "./icons";
import { Window } from "./window";

const LANGUAGES = [
  { code: "FR", name: "French" },
  { code: "EN", current: true, name: "English" },
  { code: "KH", name: "Khmer" },
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

/** Who runs this desktop: name, role, studies, where and which languages */
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
      </div>
    </div>
  </Window>
);
