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
      "every window has a new title bar, and you can resize it from its corner",
      "one app at a time now: flip through them with the arrows",
      "the music player got a big album cover; click the song to open it on spotify",
      "say hi to the new profile and socials windows",
    ],
    date: "2026-10-05",
    title: "new windows!",
  },
];
