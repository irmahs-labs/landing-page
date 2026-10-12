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
      bg: "#3b4a42",
      fg: "#fff3cf",
      path: "M6 9 H18 A4 4 0 0 1 18 17 H16 L14 15 H10 L8 17 H6 A4 4 0 0 1 6 9 Z M8 11 V15 M6 13 H10",
    },
    name: "What's in my pantry?",
    shot: "/apps/sleepy-spinner.jpg",
    status: "live",
  },
  {
    desc: "Seasons, matches and standings for a spike tournament",
    href: "https://alsace-arena-spike-tournament.vercel.app/",
    icon: {
      bg: "#e0574b",
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
