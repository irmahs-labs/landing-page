# Changelog

Every change to irmahs.dev, newest first, one entry per pull request. The release notes Tokkae announces on the page live in [`src/lib/changelog.ts`](src/lib/changelog.ts).

## 20 October 2026

- **#52 Ask about me, a chat bot:** a chat button in the bottom-right corner opens `ask_me.chat`, where visitors ask about Irma's work, studies, skills and apps. `POST /api/chat` checks the conversation, allows each visitor 8 questions a minute and asks OpenRouter (`openai/gpt-4o`) with a profile built from the CV, the apps and the socials. The key stays on the server as `OPENROUTER_API_KEY`, a new repository secret that the deploy writes to `.env`.
- **#48 CodeQL and Dependabot:** CodeQL code scanning from irmahs-labs/workflows checks the code and the workflows on each pull request and every week, with findings in the Security tab. Dependabot opens monthly pull requests for npm packages and GitHub Actions, minor and patch updates grouped.
- **#47 CI from the shared irmahs-labs workflow:** Lint and format, Type-check, Tests and Docker build now come from irmahs-labs/workflows, shared with every other repo, and show as `app / …` on a pull request. The Build and smoke test job stays this repo's own.
- **#46 One CI job per check:** CI's single "checks" job becomes Lint and format, Type-check, Tests, Build and smoke test, and Docker build, so each pull request lists every check with its own result. The steps are the same, and the jobs run side by side. A last job keeps the name `checks`, which the branch rules require, and passes only when all the others did.

## 19 October 2026

- **#45 Coq instead of the cube, and Mini Games first:**
  - Tokkae's playmate is now Coq, its friend from the Tokkae design system: a pixel French rooster in white, blue and red. Its frames are copied from the system's sheets, and it struts while it moves, pecks at seeds at a picnic (in place of the cube's bowl), crows when Tokkae says hello, hops while they trade hearts, and otherwise stands about blinking. As the system asks, it stands on Tokkae's right, two pixels off (on its left only at the screen's edge), and faces Tokkae whenever they play, even circling it during a nap; only when it runs from Tokkae in tag does it face the way it runs.
  - The apps are in a new order: Mini Games, Album Cover Maker, the pantry spinner, then Alsace Arena and the portfolio.

## 17 October 2026

- **#44 Mini Games in the apps, and #43 onto `main`:**
  - Mini Games (minigames.irmahs.dev) joins the apps after the pantry spinner, with a screenshot of the Wheel of Fortune and its die icon on lime, making five.
  - #43 was merged into `feat/playmate` seconds after #42 had merged that branch into `main`, so its songs and colours never reached `main`. Its commits come across here as they were, with the 44px tap area for the player's round buttons (previous and next now do something, so phones need a real target).

## 16 October 2026

- **#43 Tokkae's ten songs, and the updated Cute Matcha and Tokkae colours:**
  - While Spotify is quiet, previous and next in the player step through Tokkae's songs, in this order: plain singing, then with joy (a little sun), happiness (a rainbow), love (hearts), heartbreak (a heart breaking), anger (a thunderstorm with lightning), rage (little flames), depression (dark clouds), sadness (tears) and peace (flowers drifting down). Each song shows as a track: its title says how Tokkae sings ("Sings with joy"), and the artist is Tokkae. Each song is sing's eight frames with its own props, drawn in Tokkae's colours.
  - Tokkae takes its new colours from the Tokkae design system: terracotta cheeks, danger red for hearts and marks, and the bug and mic in its eye colour.
  - The page's colours are Cute Matcha's role tokens, with the page's own names as aliases. Window titles are set in `on-strong`, hovered tiles and links fill with `raised-hover`, the window buttons are moss, gold and danger, and reading text (app descriptions, profile lines, the patch notes, social handles) is set in Nunito.

## 14 October 2026

- **#41 Give the pantry app its slot machine icon and a fresh screenshot:** the pantry app's badge becomes a line drawing of its own logo, a little slot machine with its lever, on lime, instead of the icon left over from Sleepy Spinner. Its screenshot is retaken from the app's current Cute Matcha design, as `pantry-spinner.jpg`.

## 12 October 2026

- **#40 Apps in a new tab and a new order, a walk between Tokkae's activities, and the design system's fleur-de-lys:**
  - Every app opens in a new tab, in the order Album Cover Maker, the pantry spinner, Alsace Arena, Portfolio.
  - Tokkae walks about for 6 to 12 seconds between everything it does on its own, instead of going straight from one thing to the next, so it does something new about every ten seconds rather than six times as often.
  - The Paris button uses Cute Matcha's own fleur-de-lys motif instead of a drawing of our own.
- **#39 Make my_apps end level with the socials window:** on desktop the apps window grows to the bottom of the side column, so it lines up with the socials window under the player (505px tall instead of 480px at 1440 × 900). It can still be resized larger, and tablets and phones are unchanged.
- **#37 Give my_apps and socials a file suffix, and update the CV:** the two windows are titled `my_apps.app` and `socials.lnk`, like the others (`paris.local`, `profile.exe`, `now_playing.mp3`, `patch_notes.txt`), and the CV to download is replaced with the latest version.
- **#36 Move GitHub and LinkedIn to a socials window, with a CV to download:**
  - A socials window under the player has GitHub and LinkedIn, each opening in a new tab, and Irma's CV to download (`public/cv/Irma_Houver_Sing_CV.pdf`).
  - GitHub and LinkedIn leave the apps, which are now the pantry spinner, the Album Cover Maker, Alsace Arena and the portfolio. GitHub's unused screenshot is deleted.
  - The profile window loses its two icon links, so each link is on the page once.

## 11 October 2026

- **#35 Add a button to hide the theme colours:** with theme variations on, a chevron next to the switch tucks away the swatches, the variation's name and the Flaticon credit, keeping the variation on. The choice is remembered like the theme. On phones the switch and the chevron sit together on the right of the panel.
- **#34 Keep the patch notes popup its own width on phones:** on screens 600px wide or less the patch notes were squeezed to Tokkae's 63px width, since the phone rule stretching every window to full width caught them too. Only the desk's windows go full width now, so the notes pop up at their usual 290px.
- **#33 Add the Album Cover Maker to the apps, and a test suite:**
  - The Album Cover Maker (album-cover-maker.irmahs.dev) joins the apps with a screenshot and a record icon, making six, one full page at the biggest size.
  - Adds Vitest and React Testing Library, set up as in Next.js's Vitest guide. `npm test` covers the data, the sky maths, weather and Spotify, the now-playing route, Tokkae and its buddy, and the apps window, theme picker, player and windows. CI runs it on every pull request.

## 10 October 2026

- **#32 Make the theme animal Tokkae's buddy instead of a cursor follower:**
  - The theme variations' animal no longer follows the cursor. It roams the lower half of the screen and plays with Tokkae instead, each game equally likely: trading hearts, a picnic (the animal at a pet bowl, Tokkae catching bugs), ten seconds of tag with either one as "it", or a nap together with the animal circling the sleeping Tokkae.
  - Turning the variations on puts a "!" over Tokkae and it runs to say hello. Turning them off makes it cry for two seconds.
  - The animal is only moved and turned; its picture is never changed. It now shows on phones too.
  - Tokkae's singing and crying lose their mouth, to match its sprite.

## 9 October 2026

- **#31 Have Tokkae sing at a mic stand when nothing is playing:** the random emotes in the empty player are replaced by one new animation, Tokkae holding a mic stand and singing, with blue and red notes floating up. It loops until music plays.
- **#30 Show Tokkae in the music player when nothing is playing:** instead of the record, the cover shows Tokkae doing a random calm emote (bug hunting, hopping, napping, typing, waving and more), a new one every eight seconds, on cream so its green stands out. With reduced motion it holds one frame.
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
