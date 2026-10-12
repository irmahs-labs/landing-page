/** Where else to find me, in the socials window */
export interface Social {
  /** Icon background and stroke colours */
  bg: string;
  fg: string;
  handle: string;
  href: string;
  name: string;
  path: string;
}

export const SOCIALS: readonly Social[] = [
  {
    bg: "#3b4a42",
    fg: "#fff3cf",
    handle: "@irmahs",
    href: "https://github.com/irmahs",
    name: "GitHub",
    path: "M8 7 L3 12 L8 17 M16 7 L21 12 L16 17 M13.5 5 L10.5 19",
  },
  {
    bg: "#4a7fc0",
    fg: "#fff",
    handle: "in/irma-hs",
    href: "https://www.linkedin.com/in/irma-hs/",
    name: "LinkedIn",
    path: "M12 11.5 A3.5 3.5 0 1 0 12 4.5 A3.5 3.5 0 1 0 12 11.5 Z M5 20 C5 16 8 14 12 14 C16 14 19 16 19 20",
  },
];

/** My CV, served from public/ and downloaded under this name */
export const CV = {
  file: "Irma_Houver_Sing_CV.pdf",
  href: "/cv/Irma_Houver_Sing_CV.pdf",
  size: "PDF · 110 KB",
} as const;
