import type { ReactNode } from "react";

import { AccountButton } from "./account-button";
import { SiteIcon } from "./icons";
import { ThemeToggle } from "./theme-toggle";

interface HeaderProps {
  /** The page's own controls, in the middle */
  children?: ReactNode;
}

/**
 * Cute Matcha's app Header, as every irmahs.dev app opens with: the icon,
 * the name with "by Irma HS" under it, the page's controls in the middle,
 * and the theme toggle and the account pill at the end. The name is the
 * page's heading.
 */
export const Header = ({ children }: HeaderProps) => (
  <header className="app-header">
    <div className="app-header__home">
      <SiteIcon />
      <span>
        <h1 className="app-header__name">irmahs.dev</h1>
        <span className="app-header__by">by Irma HS</span>
      </span>
    </div>
    {children ? <div className="app-header__actions">{children}</div> : null}
    <div className="app-header__end">
      <ThemeToggle />
      <AccountButton />
    </div>
  </header>
);
