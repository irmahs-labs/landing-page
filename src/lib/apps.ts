export interface AppLink {
  desc: string;
  href: string;
  /** Icon background and stroke colours */
  icon: { bg: string; fg: string; path: string };
  name: string;
  /** A screenshot of the app in public/apps, when there is one to show */
  shot?: string;
  status: string;
}

export const APPS: readonly AppLink[] = [
  {
    desc: "Drop in a photo, add a title, export a 3000 × 3000 cover",
    href: "https://album-cover-maker.irmahs.dev",
    icon: {
      bg: "#b8d970",
      fg: "#2f3b34",
      // A record in its sleeve
      path: "M3 3 H21 V21 H3 Z M12 7 A5 5 0 1 0 12 17 A5 5 0 1 0 12 7 Z M12 11 A1 1 0 1 0 12 13 A1 1 0 1 0 12 11 Z",
    },
    name: "Album Cover Maker",
    shot: "/apps/album-cover-maker.jpg",
    status: "live",
  },
  {
    desc: "Pull the lever and let it pick what's for dinner",
    href: "https://pantry-spinner.irmahs.dev",
    icon: {
      bg: "#b8d970",
      fg: "#2f3b34",
      // The app's own logo: a little slot machine, its lever on the right
      path: "M5 4 H15 A2 2 0 0 1 17 6 V18 A2 2 0 0 1 15 20 H5 A2 2 0 0 1 3 18 V6 A2 2 0 0 1 5 4 Z M5.5 9 H14.5 V14 H5.5 Z M8.5 9 V14 M11.5 9 V14 M7 6.5 H13 M7 17 H13 M17 13 H20 V7 M20 3 A1.5 1.5 0 1 0 20 6 A1.5 1.5 0 1 0 20 3 Z",
    },
    name: "What's in my pantry?",
    shot: "/apps/pantry-spinner.jpg",
    status: "live",
  },
  {
    desc: "Pick a game and play, starting with a Wheel of Fortune",
    href: "https://minigames.irmahs.dev",
    icon: {
      bg: "#dde87e",
      fg: "#2f3b34",
      // The app's own logo: a die showing five
      path: "M7 3 H17 A4 4 0 0 1 21 7 V17 A4 4 0 0 1 17 21 H7 A4 4 0 0 1 3 17 V7 A4 4 0 0 1 7 3 Z M8 8 H8.01 M16 8 H16.01 M12 12 H12.01 M8 16 H8.01 M16 16 H16.01",
    },
    name: "Mini Games",
    shot: "/apps/minigames.jpg",
    status: "live",
  },
  {
    desc: "Seasons, matches and standings for a spike tournament",
    href: "https://alsace-arena-spike-tournament.vercel.app/",
    icon: {
      bg: "#f0675c",
      fg: "#fff3cf",
      path: "M8 4 H16 V10 A4 4 0 0 1 8 10 Z M8 6 H5 A3 3 0 0 0 8 11 M16 6 H19 A3 3 0 0 1 16 11 M12 14 V18 M8 20 H16",
    },
    name: "Alsace Arena",
    shot: "/apps/alsace-arena.jpg",
    status: "live",
  },
  {
    desc: "Selected projects, all in one place",
    href: "https://irmahs.github.io/Portfolio/",
    icon: {
      bg: "#5c8f48",
      fg: "#fff3cf",
      path: "M4 5 A2 2 0 0 1 6 3 H20 V19 H6 A2 2 0 0 0 4 21 Z M4 19 A2 2 0 0 1 6 17 H20",
    },
    name: "Portfolio",
    shot: "/apps/portfolio.jpg",
    status: "site",
  },
];
