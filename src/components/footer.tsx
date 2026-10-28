import { EyeIcon, SiteIcon } from "./icons";

interface FooterProps {
  /** How many are on the page now, once the server has said */
  online?: number | null;
}

/** The page's last line, as the apps end: the icon, who made it, and who's here */
export const Footer = ({ online = null }: FooterProps) => (
  <footer className="app-footer">
    <SiteIcon size={20} /> Landing Page by Irma HS
    {online === null ? null : (
      <span className="app-footer__online" title="People on the page now">
        <EyeIcon /> {online} online
      </span>
    )}
  </footer>
);
