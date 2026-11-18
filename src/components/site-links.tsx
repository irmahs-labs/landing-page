"use client";

import Link from "next/link";

import { useCopy } from "@/lib/language";
import { LEGAL_NAMES, LEGAL_SLUGS } from "@/lib/legal";

const COPY = {
  en: { legal: "Legal", names: LEGAL_NAMES.en },
  fr: { legal: "Juridique", names: LEGAL_NAMES.fr },
};

/** The legal pages, under the footer, as every irmahs.dev app ends */
export const SiteLinks = () => {
  const t = useCopy(COPY);

  return (
    <nav aria-label={t.legal} className="site-links">
      <ul>
        {LEGAL_SLUGS.map((slug) => (
          <li key={slug}>
            <Link href={`/${slug}`}>{t.names[slug]}</Link>
          </li>
        ))}
      </ul>
    </nav>
  );
};
