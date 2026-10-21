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
  weight: ["400", "500", "600"],
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

export const viewport: Viewport = {
  themeColor: "#f3f1c8",
};

const RootLayout = ({ children }: { children: ReactNode }) => (
  <html
    className={`${fredoka.variable} ${nunitoSans.variable} ${kantumruy.variable}`}
    lang="en"
  >
    <body>{children}</body>
  </html>
);

export default RootLayout;
