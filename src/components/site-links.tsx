"use client";

import { useCopy } from "@/lib/language";
import { LEGAL_NAMES, LEGAL_SLUGS } from "@/lib/legal";
import { SITE_APPS } from "@/lib/site-links";

const COPY = {
  en: { apps: "Irma HS’s apps", legal: "Legal", names: LEGAL_NAMES.en },
  fr: {
    apps: "Les applications d’Irma HS",
    legal: "Juridique",
    names: LEGAL_NAMES.fr,
  },
};

/**
 * The two rows under every app's footer: every irmahs.dev app, then the
 * legal pages, which live here on irmahs.dev.
 */
export const SiteLinks = () => {
  const t = useCopy(COPY);

  return (
    <div className="site-links">
      <nav aria-label={t.apps}>
        <ul>
          {SITE_APPS.map((app) => (
            <li key={app.href}>
              <a href={app.href}>{app.name}</a>
            </li>
          ))}
        </ul>
      </nav>
      <nav aria-label={t.legal}>
        <ul>
          {LEGAL_SLUGS.map((slug) => (
            <li key={slug}>
              <a href={`/${slug}`}>{t.names[slug]}</a>
            </li>
          ))}
        </ul>
      </nav>
    </div>
  );
};
