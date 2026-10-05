import type { Metadata, Viewport } from "next";
import { Fredoka, Kantumruy_Pro } from "next/font/google";
import Script from "next/script";
import type { ReactNode } from "react";

import { themeInitScript } from "@/lib/theme-script";

import "./globals.css";

const fredoka = Fredoka({
  subsets: ["latin"],
  variable: "--font-fredoka",
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

export const viewport: Viewport = {
  themeColor: "#f3f1c8",
};

const RootLayout = ({ children }: { children: ReactNode }) => (
  <html
    className={`${fredoka.variable} ${kantumruy.variable}`}
    lang="en"
    suppressHydrationWarning
  >
    <body>
      <Script id="theme-init" strategy="beforeInteractive">
        {themeInitScript()}
      </Script>
      {children}
    </body>
  </html>
);

export default RootLayout;
