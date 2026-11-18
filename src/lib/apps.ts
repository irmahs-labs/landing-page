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
  /**
   * Where its last deploy is read from, for the date on its tile. None for
   * an app in a private repo, which GitHub won't tell a stranger about.
   */
  deploys?: DeploySource;
  /** What it does, in each of the site's languages */
  desc: Record<Language, string>;
  href: string;
  /**
   * Only its admins get in. It still has a tile, but the chat bot never
   * names it (src/lib/about-me.ts).
   */
  private?: boolean;
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
  hosted("realms", {
    desc: {
      en: "Worlds to step into: the Book of Shadows and the Court of Draconia",
      fr: "Des mondes où entrer : le Livre des ombres et la Cour de Draconia",
    },
    // The app's own logo: an arched portal, a star shining through it
    icon: "M6 21 V11 A6 6 0 0 1 18 11 V21 M4 21 H20 M12 11 L12.9 13.1 L15 14 L12.9 14.9 L12 17 L11.1 14.9 L9 14 L11.1 13.1 Z",
    name: "Realms",
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
  hosted("tools", {
    desc: {
      en: "Handy little makers, starting with album covers in 3000 × 3000",
      fr: "De petits outils pratiques, à commencer par des pochettes en 3000 × 3000",
    },
    // The app's own logo: a toolbox, its handle on top and its latch in front
    icon: "M9 7 V5.5 A1.5 1.5 0 0 1 10.5 4 H13.5 A1.5 1.5 0 0 1 15 5.5 V7 M6 7 H18 A2 2 0 0 1 20 9 V18 A2 2 0 0 1 18 20 H6 A2 2 0 0 1 4 18 V9 A2 2 0 0 1 6 7 Z M4 12 H20 M10.5 11 H13.5 V14 H10.5 Z",
    name: "Tools",
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
  // Private: only the two people it is for get past the sign-in, everyone
  // else sees "This app is private" (irmahs-labs/auth). So no screenshot,
  // and no deploy date: its repo is private too.
  {
    desc: {
      en: "A Paris love story, private: only the two of us get in",
      fr: "Une histoire d’amour à Paris, privée : nous deux seulement",
    },
    href: "https://alma-housila.irmahs.dev",
    // The app's own logo: our story as a book, with a heart on the cover
    icon: "M6 3 H18 A1 1 0 0 1 19 4 V21 H7 A2 2 0 0 1 5 19 V4 A1 1 0 0 1 6 3 Z M5 19 A2 2 0 0 1 7 17 H19 M12 13.5 L9.2 10.7 A1.9 1.9 0 0 1 12 8.2 A1.9 1.9 0 0 1 14.8 10.7 Z",
    name: "Alma",
    private: true,
  },
];
