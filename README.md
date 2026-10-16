# irmahs.dev

The landing page of Irma Houver Sing: a little retro desktop in matcha greens, live at [irmahs.dev](https://irmahs.dev). It is built from the **Cute Matcha** design system, and Tokkae, a pixel gecko, lives on it.

## What's on the page

- **Windows you can move.** Every window has the same title bar (its name on the left, the + − × buttons on the right). On desktop and tablet you can drag it by the title bar, and the window you press comes to the front. Only the apps window resizes. On phones the windows stack instead.
- **Weather and clock** for Paris or Phnom Penh: local time and date, sunrise and sunset, and the current weather. The sky follows the time of day there, with the sun or moon rising and setting, stars, rain and night tint.
- **Profile:** name, role, studies, location and languages.
- **Apps:** the Album Cover Maker, the pantry spinner, Alsace Arena and the portfolio, each with a screenshot and opening in a new tab, paged with ← → arrows. The window opens on one app. Resize it from its bottom-right corner and it shows 2, 4 or 6 at once, as many as fit at 380 × 240 px each.
- **Now playing:** what Irma is listening to on Spotify, with the album cover and progress. When nothing is playing, Tokkae sings into a mic stand in the cover, on loop until music plays, and previous and next pick one of its ten songs, each shown as a track by Tokkae: for you, with joy (a little sun), happily (a rainbow), with love (hearts), heartbroken (a breaking heart), angrily (a thunderstorm), in a rage (little flames), under dark clouds, through tears, and peacefully (flowers drifting down). Clicking the song opens it on Spotify. While music plays, the control buttons are for show.
- **Socials,** under the player: GitHub and LinkedIn, each opening in a new tab, and Irma’s CV to download (`public/cv/`).
- **Playmate:** a switch, top left, that brings Tokkae a playmate, a little pixel cube (see below). Off by default, and the page remembers it.
- **Sign in** with Google through the IrmaHS Labs account service ([irmahs-labs/auth](https://github.com/irmahs-labs/auth)). The session is shared by every `*.irmahs.dev` site.
- **Tokkae**, described below.

## Tokkae

Tokkae is a pixel gecko from the brand canvas (a 12 × 13 sprite in an 18 × 17 frame).

- **When someone arrives,** it walks in from one side, waves, and opens `patch_notes.txt` with the latest entry of the in-app changelog.
- **On its own,** it eats bugs, naps, waves, types at a little PC and jumps onto the tops of windows, walking about for 6 to 12 seconds between each, so it does something new only every ten seconds or so.
- **It leaves your cursor alone** unless you bother it.
- **Click it, or pick it up and drop it,** and it gets angry and chases your cursor for ten seconds, jumping up to the window it's over or hopping down off one. Then it gets sleepy for a moment and goes back to its routine.
- **With the playmate switch on,** a cube comes out to play. Every so often, instead of its own routine, Tokkae plays with it. Each of these is equally likely:
  - **Hearts:** side by side, hearts rising from both of them.
  - **A picnic:** the cube at its pet bowl, Tokkae catching bugs.
  - **Tag** for ten seconds, with Tokkae or the cube as "it", 50/50.
  - **A nap together:** Tokkae asleep, the cube circling it.
- **Turning the playmate on** puts a "!" over Tokkae, and it runs to say hello to the cube. **Turning it off** makes it cry for two seconds before it carries on. Both wait while it's announcing, angry or being held.
- **With reduced motion,** it stands still in the corner and only shows the patch notes, and there's no buddy.

The sprite and its animations are in [`src/lib/tokkae.ts`](src/lib/tokkae.ts). Its behaviour is a small class with no React in it, in [`src/lib/tokkae-brain.ts`](src/lib/tokkae-brain.ts), and its buddy's in [`src/lib/tokkae-buddy.ts`](src/lib/tokkae-buddy.ts). [`src/components/tokkae.tsx`](src/components/tokkae.tsx) draws it and runs the animation loop.

## Changelogs

There are two:

- [`CHANGELOG.md`](CHANGELOG.md): a summary of every pull request, for people working on the site.
- [`src/lib/changelog.ts`](src/lib/changelog.ts): the release notes Tokkae announces, written in Tokkae's voice. **Add an entry at the top when you ship something visitors will notice.** Tokkae always reads the first one.

## Stack

- [Next.js 16](https://nextjs.org) (App Router) with React 19 and strict TypeScript. This version of Next.js is newer than most AI assistants know: read the guides in `node_modules/next/dist/docs/` before changing framework code.
- Plain CSS in [`src/app/globals.css`](src/app/globals.css), with Cute Matcha's role tokens (Light Matcha) as CSS custom properties, and the page's own names for them as the design system lists.
- [Ultracite](https://www.ultracite.ai) (oxlint, oxfmt and the anti-slop rules) for linting and formatting.
- Docker for deployment, behind Caddy from [irmahs-labs/proxy](https://github.com/irmahs-labs/proxy).

## Project layout

```
src/
  app/          layout, page, global styles, tab icon, /api/now-playing
  components/   the page's pieces: windows, header controls, scene, Tokkae
  hooks/        clock, viewport, reduced motion, saved choices, session, Spotify
  lib/          apps, socials, cities, sky maths, weather, Spotify, changelog, Tokkae
public/apps/    the apps' screenshots
public/cv/      the CV to download
```

## Running it locally

You need Node 22.18 or newer.

```bash
npm install
```

```bash
cp .env.example .env
```

```bash
npm run dev
```

Then open http://localhost:3000.

### Environment

| Variable | What it's for |
| --- | --- |
| `SPOTIFY_CLIENT_ID`, `SPOTIFY_CLIENT_SECRET`, `SPOTIFY_REFRESH_TOKEN` | Read what's playing on Spotify. Without them the player shows Tokkae singing. |
| `NEXT_PUBLIC_AUTH_URL` | The account service for sign in. Defaults to `https://auth.irmahs.dev`. |

On `localhost` the sign-in check is blocked by CORS, since the account service only allows `*.irmahs.dev`. The button simply doesn't appear, which is expected.

### Scripts

| Command                      | Does                              |
| ---------------------------- | --------------------------------- |
| `npm run dev`                | Development server                |
| `npm run build`, `npm start` | Production build and server       |
| `npm run typecheck`          | `tsc --noEmit`                    |
| `npm test`                   | Unit and component tests (Vitest) |
| `npm run test:watch`         | The same, rerunning on changes    |
| `npm run check`              | Lint and format check (Ultracite) |
| `npm run fix`                | Fix what Ultracite can            |

### Tests

The tests sit next to what they test, as `*.test.ts` and `*.test.tsx` under `src/`, and run with [Vitest](https://vitest.dev) in jsdom, set up as in Next.js's Vitest guide ([`vitest.config.mts`](vitest.config.mts)). They cover:

- **Data:** every app links over https and has a screenshot in `public/`, and the changelog is dated and in order.
- **Pure logic:** the sky maths, weather codes, Spotify's answers and its ten-second cache, the now-playing route and its fallback, and the sign-in link.
- **Tokkae:** its frames, how it reacts and how often it plays each game, and how its buddy moves.
- **Components,** with React Testing Library: the apps window's 1, 2, 4 or 6 apps, the playmate switch, Tokkae and its cube, the player, the singing emote and the windows.

They fake `fetch`, timers and `ResizeObserver` but never mock the app's own modules.

## Working on it

- **Pull before making changes.** Start from the latest `origin/main`. If your branch's PR is already merged, start a new branch.
- **Name branches after what they do:** `<type>/<feature-name>`, for example `feat/contact-form` or `fix/dark-mode-contrast`. Types are `feat`, `fix`, `chore`, `docs` and `refactor`.
- **Test and lint before you commit.** CI runs `npm run check`, `npm run typecheck`, `npm test` and `npm run build` on every pull request to `main`, then starts the server for a smoke test. With Claude Code, a hook runs Ultracite on every file it edits.

## Deployment

Every push to `main` deploys to the server through GitHub Actions ([`deploy.yml`](.github/workflows/deploy.yml)):

1. It writes `.env` from the repository secrets, sent over SSH stdin so the secrets never appear in a command line.
2. It builds the Docker image and starts it on the server's shared `proxy` network.
3. Caddy, from [irmahs-labs/proxy](https://github.com/irmahs-labs/proxy), serves it at irmahs.dev.

## Credits

- Fonts are Fredoka, Nunito and Kantumruy Pro, from Google Fonts.

## Licence

See [LICENSE](LICENSE).
