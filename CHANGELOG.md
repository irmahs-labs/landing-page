# Changelog

Every change to irmahs.dev, newest first, one entry per pull request. The release notes Tokkae announces on the page live in [`src/lib/changelog.ts`](src/lib/changelog.ts).

## 9 October 2026

- **#29 Point the pantry card at pantry-spinner.irmahs.dev under its new name:** the meal planner card is now called What's in my pantry? and links to pantry-spinner.irmahs.dev, the name its DNS records use.

## 8 October 2026

- **#28 Put the player back to its own size:** the player is no longer stretched to the height of the profile and apps windows together, which made it too big. Its cover is square again.
- **#27 An apps window that shows 1, 2, 4 or 6 apps, with screenshots:**
  - Only the apps window resizes now. The others can still be dragged, and the window you press comes to the front.
  - The apps window opens on one app and shows 2, 4 or 6 at once as it's resized, as many as fit at 380 × 240 px each, paging by that many.
  - Each app shows a screenshot with its icon in the corner. LinkedIn keeps its icon alone, since it only shows visitors a sign-in wall.
  - The player is as tall as the profile and apps windows together, its cover filling the room over a blurred copy (undone in #28).

## 6 October 2026

- **#26 Have Tokkae chase the cursor only when angry, for ten seconds:** Tokkae no longer follows a moving cursor. It only chases you once clicked, or picked up and dropped, and stays angry for ten seconds before getting sleepy.

## 5 October 2026

- **#25 Draggable windows, Tokkae's moods, and a README and changelog:**
  - Windows can be dragged by their title bar on desktop and tablet. The dragged window comes to the front, and its title bar can't leave the screen.
  - The sun and moon scale with the screen.
  - The theme panel is just its label and switch. Its swatches, the variation's name and the Flaticon credit (moved from the footer) float below it when it's on.
  - Sign in and surprise me sit side by side top right.
  - The socials window is replaced by GitHub and LinkedIn icon links in the profile window.
  - Tokkae moves to the brand canvas's 12 × 13 sprite, with the canvas's own animations: bug hunt with its tongue, a nap lying down, typing at a PC, waving.
  - Clicking Tokkae, or picking it up and dropping it, makes it angry: it chases you for five seconds, then gets sleepy and goes back to its routine.
  - Adds this changelog and a README.
- **#24 Have Tokkae introduce itself in the patch notes:** the release notes now open with "hi, i'm tokkae!".
- **#23 Resizable windows from the canvas, and Tokkae the pixel gecko:**
  - The page becomes a desktop of windows matching the landing page canvas: a shared title bar, resizable from the corner, weather and profile side by side over the apps.
  - The apps window shows one app at a time, the player gets a big album cover, and a socials window is added.
  - Tokkae arrives on every visit to announce the latest changes, then wanders, eats bugs, naps, types, jumps onto windows and chases the cursor.
- **#22 Call it "Theme variations" and leave Cute Matcha unnamed:**
  - The theme panel is renamed.
  - The default theme's name no longer shows.
  - Hovering an app in the default theme no longer bursts boba pearls.
- **#21 Opt-in colour themes, Cute Matcha by default, and a Tokkae tab icon:**
  - Theme variations get an on/off switch, off by default, and the page opens on Cute Matcha's own palette.
  - The intro's flower, name, title and speech bubble are gone.
  - App descriptions show at every tile size.
  - Lorem Ipsum is removed, and the meal planner becomes Sleepy Spinner.
  - The pixel Tokkae head becomes the tab icon.
- **#20 Pull before making changes:** CLAUDE.md asks to start every change from the latest `origin/main`.
- **#19 Tint the selected app tile with the theme's colour:** a hovered or focused tile fills with a light wash of the theme's colour.

## 4 October 2026

- **#18 Fill the window on desktop and tablet; no animal on phones:**
  - On desktop and tablet the page is exactly the window's height, with tiles that adapt to the room they get.
  - The cursor animal is hidden on phones.
- **#17 Keep the Next.js agent rules in CLAUDE.md:** commits the block `next dev` writes into CLAUDE.md, so the working tree stays clean.
- **#16 Point the meal planner card at sleepy-spinner.irmahs.dev:** the app moved from Vercel to the irmahs.dev server, where it shares the sign-in session.

## 3 October 2026

- **#15 Add a Google sign-in button above "surprise me":**
  - The page becomes the first site on the IrmaHS Labs account service.
  - The button shows "sign in", or your picture and first name once you're signed in.
- **#14 Run workflows on Node 24 actions and a pinned Ubuntu:** moves the GitHub Actions to `checkout` and `setup-node` v7, and pins the runner to `ubuntu-24.04`.
- **#13 Hand Caddy over to the shared proxy repo:** Caddy moves to irmahs-labs/proxy so other apps can live on irmahs.dev subdomains. The app joins the shared `proxy` network.
- **#12 Remove the Spotify player and fix background patterns:**
  - The player goes back to showing what's playing, without sound.
  - Background patterns, which never rendered, now fill the screen, and they show as light lines at night.
- **#11 Start the Spotify player on the visitor's first interaction:** the embed starts on the visitor's first tap, click or key press (since removed in #12).
- **#10 Play my current Spotify track with the embed player:**
  - The now-playing window shows Spotify's player for the current track (since removed in #12).
  - The API also returns the track's URI.
- **#9 Match the phone layout to the mobile design:**
  - City and surprise share the top row, and the theme panel spans the width.
  - The clock, apps and player are compact.
- **#8 Keep only the cursor-following animal:** removes the animals that kept crossing the screen. One animal follows the cursor and wanders when it leaves.
- **#7 Rewrite the site as a Next.js + TypeScript app:**
  - The static site is ported to the Next.js 16 App Router with strict TypeScript, with the same look and behaviour.
  - The Spotify API becomes a route handler instead of a separate container.
- **#6 Add CI checks on pull requests to main:** lint and format, a smoke test of the API, and validation of the compose file and Caddy config.
- **#5 Write the server .env from GitHub secrets on deploy:** the deploy writes the Spotify credentials from repository secrets, sent over SSH stdin.

## 2 October 2026

- **#4 Show live Spotify "now playing" in the music player:**
  - A small server keeps the Spotify credentials and exposes `/api/now-playing`.
  - The player polls it, fills in progress between polls, and shows an empty state when nothing plays.
- **#3 Build interactive portfolio site with themed scenery and apps:** the first version of the desktop:
  - twelve colour themes
  - Paris and Phnom Penh clocks with weather
  - a sky that follows the time of day
  - app tiles and a music player
  - the boba surprise
- **#2 Add Claude Code hook running Ultracite:**
  - A Claude Code hook formats and lints every file it edits with Ultracite (oxlint, oxfmt, anti-slop).
  - CLAUDE.md gets the branch naming rule.
- **#1 Add Claude Code hook running Ultracite:** the first attempt at #2, from a generated branch name.
