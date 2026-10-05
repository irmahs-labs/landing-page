import { Window } from "./window";

const SOCIALS = [
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

/** Where else to find me, each link opening in a new tab */
export const SocialsWindow = () => (
  <Window className="socials-window" label="Socials" title="socials">
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
    </ul>
  </Window>
);
