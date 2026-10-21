import type { Metadata, Viewport } from "next";
import { Fredoka, Kantumruy_Pro, Nunito_Sans } from "next/font/google";
import type { ReactNode } from "react";

import "./globals.css";

const fredoka = Fredoka({
  subsets: ["latin"],
  variable: "--font-fredoka",
  weight: ["400", "500", "600", "700"],
});

// Reading text: links, bubbles and supporting lines
const nunitoSans = Nunito_Sans({
  subsets: ["latin"],
  variable: "--font-nunito-sans",
  weight: ["400", "500", "600", "700"],
});

const kantumruy = Kantumruy_Pro({
  subsets: ["khmer"],
  variable: "--font-kantumruy",
  weight: ["400", "500", "600"],
});

export const metadata: Metadata = {
  description:
    "Irma Houver Sing, fullstack developer based in Paris. Pick an app to try.",
  title: "Irma Houver Sing",
};

// The browser's bar in the page's colours: Light Matcha's ground, and Dark
// Matcha's header
export const viewport: Viewport = {
  themeColor: [
    { color: "#f3f1c8", media: "(prefers-color-scheme: light)" },
    { color: "#2f3d34", media: "(prefers-color-scheme: dark)" },
  ],
};

// Light or Dark Matcha before the first paint: the saved choice, or else the
// device's setting. src/lib/theme.ts takes over from here.
const THEME_SCRIPT = `try {
  var saved = localStorage.getItem("theme");
  document.documentElement.dataset.theme =
    saved === "light" || saved === "dark"
      ? saved
      : matchMedia("(prefers-color-scheme: dark)").matches
        ? "dark"
        : "light";
} catch (e) {
  document.documentElement.dataset.theme = "light";
}`;

// The script sets data-theme on <html> before React hydrates, hence
// suppressHydrationWarning there
const RootLayout = ({ children }: { children: ReactNode }) => (
  <html
    className={`${fredoka.variable} ${nunitoSans.variable} ${kantumruy.variable}`}
    lang="en"
    suppressHydrationWarning
  >
    <head>
      <script
        // oxlint-disable-next-line react/no-danger -- a fixed string of ours, not user input
        dangerouslySetInnerHTML={{ __html: THEME_SCRIPT }}
      />
    </head>
    <body>{children}</body>
  </html>
);

export default RootLayout;
