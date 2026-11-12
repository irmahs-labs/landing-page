import type { Language } from "./language";

/**
 * Where GitHub records the app's deploys: the successful runs of a deploy
 * workflow, or the deployments to an environment (as Vercel makes them)
 */
export type DeploySource = { repo: string } & (
  | { workflow: string }
  | { environment: string }
);

export interface AppLink {
  /** Where its last deploy is read from, for the date on its tile */
  deploys: DeploySource;
  /** What it does, in each of the site's languages */
  desc: Record<Language, string>;
  href: string;
  /** Its icon, a 24-grid path drawn at 2px on the yellow accent */
  icon: string;
  name: string;
  /** A screenshot of the app in public/apps, when there is one to show */
  shot?: string;
}

/**
 * An app on its own irmahs.dev subdomain: its repo in irmahs-labs, its
 * Deploy workflow and its screenshot all go by the same name
 */
const hosted = (
  slug: string,
  app: Pick<AppLink, "desc" | "icon" | "name">
): AppLink => ({
  ...app,
  deploys: { repo: `irmahs-labs/${slug}`, workflow: "deploy.yml" },
  href: `https://${slug}.irmahs.dev`,
  shot: `/apps/${slug}.jpg`,
});

export const APPS: readonly AppLink[] = [
  hosted("irma-in-paris", {
    desc: {
      en: "Paris right now: the weather, the next train, and where I've eaten",
      fr: "Paris en ce moment : la météo, le prochain train, et où j’ai mangé",
    },
    // The app's own logo: a little metro train, seen from the front
    icon: "M7 3 H17 A3 3 0 0 1 20 6 V15 A3 3 0 0 1 17 18 H7 A3 3 0 0 1 4 15 V6 A3 3 0 0 1 7 3 Z M7 7 H17 V11 H7 Z M8 14.5 H8.01 M16 14.5 H16.01 M8 18 L6 21 M16 18 L18 21",
    name: "Irma in Paris",
  }),
  hosted("minigames", {
    desc: {
      en: "Little browser games to play alone or with friends",
      fr: "De petits jeux dans le navigateur, seul ou entre amis",
    },
    // The app's own logo: a die showing five
    icon: "M7 3 H17 A4 4 0 0 1 21 7 V17 A4 4 0 0 1 17 21 H7 A4 4 0 0 1 3 17 V7 A4 4 0 0 1 7 3 Z M8 8 H8.01 M16 8 H16.01 M12 12 H12.01 M8 16 H8.01 M16 16 H16.01",
    name: "Mini Games",
  }),
  hosted("album-cover-maker", {
    desc: {
      en: "Drop in a photo, add a title, export a 3000 × 3000 cover",
      fr: "Glissez une photo, ajoutez un titre, exportez une pochette de 3000 × 3000",
    },
    // A record in its sleeve
    icon: "M3 3 H21 V21 H3 Z M12 7 A5 5 0 1 0 12 17 A5 5 0 1 0 12 7 Z M12 11 A1 1 0 1 0 12 13 A1 1 0 1 0 12 11 Z",
    name: "Album Cover Maker",
  }),
  hosted("pantry-spinner", {
    desc: {
      en: "Pull the lever and let it pick what's for dinner",
      fr: "Tirez le levier et laissez-le choisir le dîner",
    },
    // The app's own logo: a little slot machine, its lever on the right
    icon: "M5 4 H15 A2 2 0 0 1 17 6 V18 A2 2 0 0 1 15 20 H5 A2 2 0 0 1 3 18 V6 A2 2 0 0 1 5 4 Z M5.5 9 H14.5 V14 H5.5 Z M8.5 9 V14 M11.5 9 V14 M7 6.5 H13 M7 17 H13 M17 13 H20 V7 M20 3 A1.5 1.5 0 1 0 20 6 A1.5 1.5 0 1 0 20 3 Z",
    name: "What's in my pantry?",
  }),
  {
    deploys: {
      environment: "Production",
      repo: "irmahs/alsace-arena-spike-tournament",
    },
    desc: {
      en: "Seasons, matches and standings for a spike tournament",
      fr: "Saisons, matchs et classements d’un tournoi Spike",
    },
    href: "https://alsace-arena-spike-tournament.vercel.app/",
    icon: "M8 4 H16 V10 A4 4 0 0 1 8 10 Z M8 6 H5 A3 3 0 0 0 8 11 M16 6 H19 A3 3 0 0 1 16 11 M12 14 V18 M8 20 H16",
    name: "Alsace Arena",
    shot: "/apps/alsace-arena.jpg",
  },
  {
    deploys: { repo: "irmahs/Portfolio", workflow: "deploy.yml" },
    desc: {
      en: "Selected projects, all in one place",
      fr: "Une sélection de projets, réunis au même endroit",
    },
    href: "https://irmahs.github.io/Portfolio/",
    icon: "M4 5 A2 2 0 0 1 6 3 H20 V19 H6 A2 2 0 0 0 4 21 Z M4 19 A2 2 0 0 1 6 17 H20",
    name: "Portfolio",
    shot: "/apps/portfolio.jpg",
  },
];
