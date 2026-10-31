import { useVisitors } from "@/hooks/use-visitors";
import type { SessionUser } from "@/lib/auth";
import { useCopy, useLanguage } from "@/lib/language";
import { countryName, dayLabel, fmtShare } from "@/lib/visitors";
import type { VisitorStats } from "@/lib/visitors";

import { EyeIcon, SignOutIcon } from "./icons";
import { VisitorMap } from "./visitor-map";
import { Window } from "./window";

const COPY = {
  en: {
    admin: "admin",
    countries: "where they came from",
    days: "7 days",
    label: "Your profile",
    lastWeek: "last 7 days",
    lastWeekLabel: "Last 7 days",
    noNumbers:
      "No numbers from Cloudflare yet: check CLOUDFLARE_API_TOKEN and CLOUDFLARE_ZONE_ID.",
    online: "online",
    signOut: "sign out",
    today: "today",
    visitors: (day: string, n: number) => `${day}: ${n} visitors`,
    whereLabel: "Where they came from",
  },
  fr: {
    admin: "admin",
    countries: "d’où ils viennent",
    days: "7 jours",
    label: "Votre profil",
    lastWeek: "les 7 derniers jours",
    lastWeekLabel: "Les 7 derniers jours",
    noNumbers:
      "Pas encore de chiffres de Cloudflare : vérifiez CLOUDFLARE_API_TOKEN et CLOUDFLARE_ZONE_ID.",
    online: "en ligne",
    signOut: "se déconnecter",
    today: "aujourd’hui",
    visitors: (day: string, n: number) => `${day} : ${n} visiteurs`,
    whereLabel: "D’où ils viennent",
  },
};

interface AccountWindowProps {
  onSignOut: () => void;
  user: SessionUser;
}

/** The signed-in visitor's picture, or their initial in its place */
export const Avatar = ({ user }: { user: SessionUser }) => {
  const initial = (user.name || user.email).charAt(0).toUpperCase();

  return (
    <span className="account__icon">
      {user.image ? (
        // Google's picture host refuses requests that carry a referrer, and
        // next/image would proxy a small avatar through the server for nothing
        // oxlint-disable-next-line next/no-img-element -- remote avatar, sized by CSS
        <img
          alt=""
          height={30}
          referrerPolicy="no-referrer"
          src={user.image}
          width={30}
        />
      ) : (
        <span aria-hidden="true">{initial}</span>
      )}
    </span>
  );
};

/** Online now, today and the week, the last seven days as bars, and the map */
const VisitorNumbers = ({ stats }: { stats: VisitorStats }) => {
  const { history, online } = stats;
  const language = useLanguage();
  const t = COPY[language];
  const days = history?.days ?? [];
  const most = Math.max(1, ...days.map((d) => d.visitors));
  const week = days.reduce((sum, d) => sum + d.visitors, 0);

  return (
    <>
      <div className="visitor-tiles">
        <div className="visitor-tile">
          <span className="visitor-label">
            <EyeIcon size={13} /> {t.online}
          </span>
          <span className="visitor-num">{online}</span>
        </div>
        <div className="visitor-tile">
          <span className="visitor-label">{t.today}</span>
          <span className="visitor-num">
            {history ? (days.at(-1)?.visitors ?? 0) : "–"}
          </span>
        </div>
        <div className="visitor-tile">
          <span className="visitor-label">{t.days}</span>
          <span className="visitor-num">{history ? week : "–"}</span>
        </div>
      </div>

      {history ? (
        <>
          <section aria-label={t.lastWeekLabel} className="visitor-box">
            <span className="visitor-label">{t.lastWeek}</span>
            <ol className="visitor-bars">
              {days.map((d, i) => {
                const today = i === days.length - 1;
                const day = dayLabel(d.date, today, language);

                return (
                  <li
                    aria-label={t.visitors(day, d.visitors)}
                    className={today ? "visitor-bar is-today" : "visitor-bar"}
                    key={d.date}
                  >
                    <span className="visitor-bar__count">{d.visitors}</span>
                    <span
                      className="visitor-bar__fill"
                      style={{ height: `${(d.visitors / most) * 100}%` }}
                    />
                    <span className="visitor-bar__day">{day}</span>
                  </li>
                );
              })}
            </ol>
          </section>

          <section aria-label={t.whereLabel} className="visitor-box">
            <span className="visitor-label">{t.countries}</span>
            <VisitorMap countries={history.countries} />
            <ul className="visitor-countries">
              {history.countries.map((c) => (
                <li key={c.code}>
                  <span className="visitor-code">{c.code}</span>
                  <span className="visitor-country">
                    {countryName(c.code, language)}
                  </span>
                  <span className="visitor-share">{fmtShare(c.share)}</span>
                </li>
              ))}
            </ul>
          </section>
        </>
      ) : (
        <p className="visitor-note">{t.noNumbers}</p>
      )}
    </>
  );
};

/**
 * profile.txt, the pop-up the account pill opens: who is signed in and a
 * sign-out button. For an admin, the visitor numbers come between them.
 */
export const AccountWindow = ({ onSignOut, user }: AccountWindowProps) => {
  const visitors = useVisitors(true);
  const admin = visitors.status === "ready";
  const t = useCopy(COPY);

  return (
    <Window className="account-window" label={t.label} title="profile.txt">
      <div className="account-window__body">
        <div className="account-who">
          <Avatar user={user} />
          <span className="account-who__text">
            <span className="account-who__name">{user.name}</span>
            <span className="account-who__email">{user.email}</span>
          </span>
          {admin ? <span className="visitor-code">{t.admin}</span> : null}
        </div>

        {admin ? <VisitorNumbers stats={visitors.stats} /> : null}

        <button
          className="btn btn--pill account-signout"
          onClick={onSignOut}
          type="button"
        >
          <SignOutIcon /> {t.signOut}
        </button>
      </div>
    </Window>
  );
};
