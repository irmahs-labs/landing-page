export interface AppLink {
  desc: string;
  href: string;
  /** Icon background and stroke colours */
  icon: { bg: string; fg: string; path: string };
  name: string;
  status: string;
}

export const APPS: readonly AppLink[] = [
  {
    desc: "Repos, side projects and experiments",
    href: "https://github.com/irmahs",
    icon: {
      bg: "#4a7fc0",
      fg: "#fff3cf",
      path: "M8 7 L3 12 L8 17 M16 7 L21 12 L16 17 M14 5 L10 19",
    },
    name: "GitHub",
    status: "code",
  },
  {
    desc: "Pull the lever and let it pick what's for dinner",
    href: "https://slot-machine-meal-planner.vercel.app",
    icon: {
      bg: "#3b4a42",
      fg: "#fff3cf",
      path: "M6 9 H18 A4 4 0 0 1 18 17 H16 L14 15 H10 L8 17 H6 A4 4 0 0 1 6 9 Z M8 11 V15 M6 13 H10",
    },
    name: "Slot Machine Meal Planner",
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
    status: "live",
  },
  {
    desc: "Experience, background and how to reach me",
    href: "https://www.linkedin.com/in/irma-hs/",
    icon: {
      bg: "#f2d27a",
      fg: "#2f3b34",
      path: "M3 8 H21 V20 H3 Z M9 8 V5 H15 V8 M3 13 H21 M11 13 V15 H13 V13",
    },
    name: "LinkedIn",
    status: "profile",
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
    status: "site",
  },
  {
    desc: "Placeholder text for when the words aren't ready",
    href: "https://www.lipsum.com",
    icon: {
      bg: "#d9786a",
      fg: "#2f3b34",
      path: "M12 3 L14 10 L21 12 L14 14 L12 21 L10 14 L3 12 L10 10 Z",
    },
    name: "Lorem Ipsum",
    status: "tool",
  },
];
