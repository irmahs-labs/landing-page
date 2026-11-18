"use client";

import { useCopy } from "@/lib/language";

import { EyeIcon, SiteIcon } from "./icons";
import { SiteLinks } from "./site-links";

const COPY = {
  en: {
    by: "Landing Page by Irma HS",
    here: "People on the page now",
    online: (n: number) => `${n} online`,
  },
  fr: {
    by: "Landing Page par Irma HS",
    here: "Personnes sur la page en ce moment",
    online: (n: number) => `${n} en ligne`,
  },
};

interface FooterProps {
  /** How many are on the page now, once the server has said */
  online?: number | null;
}

/**
 * The page's end, as the apps end: the icon, who made it, and who's here,
 * then the legal pages
 */
export const Footer = ({ online = null }: FooterProps) => {
  const t = useCopy(COPY);

  return (
    <footer className="site-footer">
      <p className="app-footer">
        <SiteIcon size={20} /> {t.by}
        {online === null ? null : (
          <span className="app-footer__online" title={t.here}>
            <EyeIcon /> {t.online(online)}
          </span>
        )}
      </p>
      <SiteLinks />
    </footer>
  );
};
