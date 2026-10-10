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
      "turn on theme variations and i'll run over to meet my new buddy!",
      "we trade hearts, have picnics, play tag and nap together",
      "turn them off and i'll cry a little… but i'll be ok",
    ],
    date: "2026-10-09",
    title: "i made a friend",
  },
  {
    changes: [
      "no music? i'll sing for you instead",
      "i got a real mic stand and everything!",
    ],
    date: "2026-10-09",
    title: "tokkae sings",
  },
  {
    changes: [
      "when there's no music, i hang out in the player instead",
      "i might be napping, hunting bugs, typing… you never know!",
    ],
    date: "2026-10-09",
    title: "tokkae dj",
  },
  {
    changes: [
      "pull the corner of my_apps and it shows 2, 4 or 6 apps at once",
      "the apps have little screenshots now!",
      "the other windows don't stretch any more, but you can still drag them around",
    ],
    date: "2026-10-08",
    title: "my apps got roomier",
  },
  {
    changes: [
      "i don't follow your cursor around any more… unless you make me mad",
      "click me or drop me and i'll chase you for 10 whole seconds",
    ],
    date: "2026-10-06",
    title: "tokkae minds its own business",
  },
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
