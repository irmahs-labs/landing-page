import { useVisitors } from "@/hooks/use-visitors";
import type { SessionUser } from "@/lib/auth";
import { countryName, dayLabel, fmtShare } from "@/lib/visitors";
import type { VisitorStats } from "@/lib/visitors";

import { EyeIcon, SignOutIcon } from "./icons";
import { VisitorMap } from "./visitor-map";
import { Window } from "./window";

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
  const days = history?.days ?? [];
  const most = Math.max(1, ...days.map((d) => d.visitors));
  const week = days.reduce((sum, d) => sum + d.visitors, 0);

  return (
    <>
      <div className="visitor-tiles">
        <div className="visitor-tile">
          <span className="visitor-label">
            <EyeIcon size={13} /> online
          </span>
          <span className="visitor-num">{online}</span>
        </div>
        <div className="visitor-tile">
          <span className="visitor-label">today</span>
          <span className="visitor-num">
            {history ? (days.at(-1)?.visitors ?? 0) : "–"}
          </span>
        </div>
        <div className="visitor-tile">
          <span className="visitor-label">7 days</span>
          <span className="visitor-num">{history ? week : "–"}</span>
        </div>
      </div>

      {history ? (
        <>
          <section aria-label="Last 7 days" className="visitor-box">
            <span className="visitor-label">last 7 days</span>
            <ol className="visitor-bars">
              {days.map((d, i) => {
                const today = i === days.length - 1;

                return (
                  <li
                    aria-label={`${dayLabel(d.date, today)}: ${d.visitors} visitors`}
                    className={today ? "visitor-bar is-today" : "visitor-bar"}
                    key={d.date}
                  >
                    <span className="visitor-bar__count">{d.visitors}</span>
                    <span
                      className="visitor-bar__fill"
                      style={{ height: `${(d.visitors / most) * 100}%` }}
                    />
                    <span className="visitor-bar__day">
                      {dayLabel(d.date, today)}
                    </span>
                  </li>
                );
              })}
            </ol>
          </section>

          <section aria-label="Where they came from" className="visitor-box">
            <span className="visitor-label">where they came from</span>
            <VisitorMap countries={history.countries} />
            <ul className="visitor-countries">
              {history.countries.map((c) => (
                <li key={c.code}>
                  <span className="visitor-code">{c.code}</span>
                  <span className="visitor-country">{countryName(c.code)}</span>
                  <span className="visitor-share">{fmtShare(c.share)}</span>
                </li>
              ))}
            </ul>
          </section>
        </>
      ) : (
        <p className="visitor-note">
          No numbers from Cloudflare yet: check CLOUDFLARE_API_TOKEN and
          CLOUDFLARE_ZONE_ID.
        </p>
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

  return (
    <Window className="account-window" label="Your profile" title="profile.txt">
      <div className="account-window__body">
        <div className="account-who">
          <Avatar user={user} />
          <span className="account-who__text">
            <span className="account-who__name">{user.name}</span>
            <span className="account-who__email">{user.email}</span>
          </span>
          {admin ? <span className="visitor-code">admin</span> : null}
        </div>

        {admin ? <VisitorNumbers stats={visitors.stats} /> : null}

        <button
          className="btn btn--pill account-signout"
          onClick={onSignOut}
          type="button"
        >
          <SignOutIcon /> sign out
        </button>
      </div>
    </Window>
  );
};
