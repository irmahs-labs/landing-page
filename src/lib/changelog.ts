/** One release of the landing page, newest first in CHANGELOG */
export interface ChangelogEntry {
  /** Lowercase and friendly, as Tokkae would say it */
  changes: readonly string[];
  /** ISO date the release went out */
  date: string;
  title: string;
}

export const CHANGELOG: readonly ChangelogEntry[] = [
  {
    changes: [
      "click me, or pick me up and drop me, and i'll get mad and chase you… then i get sleepy",
      "new moves: i type at my pc, catch bugs with my tongue, and nap lying down",
      "drag the windows around by their title bars",
      "the theme panel is smaller: its colours float underneath when you turn it on",
      "github and linkedin moved into my human's profile",
      "the sun and moon now fit your screen",
    ],
    date: "2026-10-05",
    title: "tokkae has moods!",
  },
  {
    changes: [
      "hi, i'm tokkae! i live here now: i eat bugs, nap, and chase your cursor",
      "every window has a new title bar, and you can resize it from its corner",
      "one app at a time now: flip through them with the arrows",
      "the music player got a big album cover; click the song to open it on spotify",
      "say hi to the new profile and socials windows",
    ],
    date: "2026-10-05",
    title: "new windows!",
  },
];
