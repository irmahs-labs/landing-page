import type { Language } from "./language";

/** Where else to find me, in the socials window */
export interface Social {
  handle: string;
  href: string;
  name: string;
  /** Its icon, a 24-grid path drawn at 2px on the yellow accent */
  path: string;
}

export const SOCIALS: readonly Social[] = [
  {
    handle: "@irmahs",
    href: "https://github.com/irmahs",
    name: "GitHub",
    path: "M8 7 L3 12 L8 17 M16 7 L21 12 L16 17 M13.5 5 L10.5 19",
  },
  {
    handle: "in/irma-hs",
    href: "https://www.linkedin.com/in/irma-hs/",
    name: "LinkedIn",
    path: "M12 11.5 A3.5 3.5 0 1 0 12 4.5 A3.5 3.5 0 1 0 12 11.5 Z M5 20 C5 16 8 14 12 14 C16 14 19 16 19 20",
  },
];

/**
 * My CV in each language, downloaded under these names: the page offers the
 * one in the language it is read in. The built-in ones are in cv/, and I can
 * replace either from the page once signed in (src/app/api/cv)
 */
export const CVS = {
  en: {
    file: "Irma_Houver_Sing_CV.pdf",
    href: "/cv/Irma_Houver_Sing_CV.pdf",
  },
  fr: {
    file: "Irma_Houver_Sing_CV_FR.pdf",
    href: "/cv/Irma_Houver_Sing_CV_FR.pdf",
  },
} as const satisfies Record<Language, { file: string; href: string }>;

/** The English one, where only one can be named */
export const CV = CVS.en;
