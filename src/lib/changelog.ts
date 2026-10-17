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
      "a new app moved in: mini games! spin a wheel of fortune",
      "and my ten songs are really here this time, press next to hear them",
    ],
    date: "2026-10-17",
    title: "mini games",
  },
  {
    changes: [
      "no music? i know ten songs now! press next or previous to pick one",
      "i sing with joy, happily, with love, heartbroken, angrily, in a rage…",
      "…under dark clouds, through tears, or peacefully, with flowers falling",
      "my cheeks got a warmer pink, and the page its new matcha colours",
    ],
    date: "2026-10-16",
    title: "ten songs for you",
  },
  {
    changes: [
      "theme variations are gone… goodbye little animals, you'll be missed",
      "but i have a new playmate! flip the switch and a cube comes out to play",
      "we still trade hearts, picnic, play tag and nap together",
      "surprise me went home too",
    ],
    date: "2026-10-15",
    title: "a cube to play with",
  },
  {
    changes: [
      "i take a little walk between everything i do now, no more rushing",
      "the apps open in a new tab, so you don't lose me",
      "paris got its proper fleur-de-lys",
    ],
    date: "2026-10-12",
    title: "a slower stroll",
  },
  {
    changes: [
      "a socials window, under the music: github, linkedin and irma's cv to download",
      "github and linkedin left my_apps to live there",
    ],
    date: "2026-10-11",
    title: "say hi elsewhere",
  },
  {
    changes: [
      "the theme colours can hide now: tap the little arrow by the switch",
      "your theme stays on, and i'll remember you hid them",
    ],
    date: "2026-10-11",
    title: "tidy colours",
  },
  {
    changes: [
      "new app in my_apps: the album cover maker!",
      "drop in a photo, add a title, and download your cover",
    ],
    date: "2026-10-11",
    title: "make an album cover",
  },
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
