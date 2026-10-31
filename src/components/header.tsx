"use client";

import type { ReactNode } from "react";

import { useCopy } from "@/lib/language";

import { AccountButton } from "./account-button";
import { SiteIcon } from "./icons";
import { LanguageToggle } from "./language-toggle";
import { ThemeToggle } from "./theme-toggle";

const COPY = {
  en: { by: "by Irma HS" },
  fr: { by: "par Irma HS" },
};

interface HeaderProps {
  /** The page's own controls, in the middle */
  children?: ReactNode;
}

/**
 * Cute Matcha's app Header, as every irmahs.dev app opens with: the icon,
 * the name with "by Irma HS" under it, the page's controls in the middle,
 * and the language pill, the theme toggle and the account pill at the end.
 * The name is the page's heading.
 */
export const Header = ({ children }: HeaderProps) => {
  const t = useCopy(COPY);

  return (
    <header className="app-header">
      <div className="app-header__home">
        <SiteIcon />
        <span>
          <h1 className="app-header__name">irmahs.dev</h1>
          <span className="app-header__by">{t.by}</span>
        </span>
      </div>
      {children ? <div className="app-header__actions">{children}</div> : null}
      <div className="app-header__end">
        <LanguageToggle />
        <ThemeToggle />
        <AccountButton />
      </div>
    </header>
  );
};
