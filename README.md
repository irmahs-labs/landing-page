# irmahs.dev

The landing page of Irma Houver Sing: a little retro desktop in matcha greens, live at [irmahs.dev](https://irmahs.dev). It is built from the **Cute Matcha** design system, and Tokkae, a pixel gecko, lives on it.

## What's on the page

- **Windows you can move and resize.** Every window has the same title bar (its name on the left, the + − × buttons on the right). On desktop and tablet you can drag it by the title bar and resize it from its bottom-right corner. On phones the windows stack instead.
- **Weather and clock** for Paris or Phnom Penh: local time and date, sunrise and sunset, and the current weather. The sky follows the time of day there, with the sun or moon rising and setting, stars, rain and night tint.
- **Profile:** name, role, studies, location, languages, and links to GitHub and LinkedIn.
- **Apps:** one app at a time, with ← → arrows to flip through them.
- **Now playing:** what Irma is listening to on Spotify, with the album cover and progress. Clicking the song opens it on Spotify. The control buttons are for show for now.
- **Theme variations:** off by default, so the page is Cute Matcha. Turned on, twelve colour variations appear, each with its own animal following the cursor, falling flowers and background pattern.
- **Surprise me:** pours milk tea over the screen and turns the page into boba for 20 seconds.
- **Sign in** with Google through the IrmaHS Labs account service ([irmahs-labs/auth](https://github.com/irmahs-labs/auth)). The session is shared by every `*.irmahs.dev` site.
- **Tokkae**, described below.

## Tokkae

Tokkae is a pixel gecko from the brand canvas (a 12 × 13 sprite in an 18 × 17 frame).

- **When someone arrives,** it walks in from one side, waves, and opens `patch_notes.txt` with the latest entry of the in-app changelog.
- **On its own,** it walks around, eats bugs, naps, waves, types at a little PC, and jumps onto the tops of windows.
- **When the cursor moves away,** it runs after it, jumping up to the window the cursor is over or hopping down off one.
- **Click it, or pick it up and drop it,** and it gets angry and chases you for five seconds. Then it gets sleepy for a moment and goes back to its routine.
- **With reduced motion,** it stands still in the corner and only shows the patch notes.

The sprite and its animations are in [`src/lib/tokkae.ts`](src/lib/tokkae.ts). Its behaviour is a small class with no React in it, in [`src/lib/tokkae-brain.ts`](src/lib/tokkae-brain.ts). [`src/components/tokkae.tsx`](src/components/tokkae.tsx) draws it and runs the animation loop.

## Changelogs

There are two:

- [`CHANGELOG.md`](CHANGELOG.md): a summary of every pull request, for people working on the site.
- [`src/lib/changelog.ts`](src/lib/changelog.ts): the release notes Tokkae announces, written in Tokkae's voice. **Add an entry at the top when you ship something visitors will notice.** Tokkae always reads the first one.

## Stack

- [Next.js 16](https://nextjs.org) (App Router) with React 19 and strict TypeScript. This version of Next.js is newer than most AI assistants know: read the guides in `node_modules/next/dist/docs/` before changing framework code.
- Plain CSS in [`src/app/globals.css`](src/app/globals.css), with the theme colours as CSS custom properties.
- [Ultracite](https://www.ultracite.ai) (oxlint, oxfmt and the anti-slop rules) for linting and formatting.
- Docker for deployment, behind Caddy from [irmahs-labs/proxy](https://github.com/irmahs-labs/proxy).

## Project layout

```
src/
  app/          layout, page, global styles, tab icon, /api/now-playing
  components/   the page's pieces: windows, header controls, scene, Tokkae
  hooks/        clock, viewport, reduced motion, saved choices, session, Spotify
  lib/          themes, apps, cities, sky maths, weather, Spotify, changelog, Tokkae
public/assets/  theme animals, flowers and background patterns
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
| `SPOTIFY_CLIENT_ID`, `SPOTIFY_CLIENT_SECRET`, `SPOTIFY_REFRESH_TOKEN` | Read what's playing on Spotify. Without them the player shows "Nothing playing". |
| `NEXT_PUBLIC_AUTH_URL` | The account service for sign in. Defaults to `https://auth.irmahs.dev`. |

On `localhost` the sign-in check is blocked by CORS, since the account service only allows `*.irmahs.dev`. The button simply doesn't appear, which is expected.

### Scripts

| Command                      | Does                              |
| ---------------------------- | --------------------------------- |
| `npm run dev`                | Development server                |
| `npm run build`, `npm start` | Production build and server       |
| `npm run typecheck`          | `tsc --noEmit`                    |
| `npm run check`              | Lint and format check (Ultracite) |
| `npm run fix`                | Fix what Ultracite can            |

## Working on it

- **Pull before making changes.** Start from the latest `origin/main`. If your branch's PR is already merged, start a new branch.
- **Name branches after what they do:** `<type>/<feature-name>`, for example `feat/contact-form` or `fix/dark-mode-contrast`. Types are `feat`, `fix`, `chore`, `docs` and `refactor`.
- **Lint before you commit.** CI runs `npm run check`, `npm run typecheck` and `npm run build` on every pull request to `main`, then starts the server for a smoke test. With Claude Code, a hook runs Ultracite on every file it edits.

## Deployment

Every push to `main` deploys to the server through GitHub Actions ([`deploy.yml`](.github/workflows/deploy.yml)):

1. It writes `.env` from the repository secrets, sent over SSH stdin so the secrets never appear in a command line.
2. It builds the Docker image and starts it on the server's shared `proxy` network.
3. Caddy, from [irmahs-labs/proxy](https://github.com/irmahs-labs/proxy), serves it at irmahs.dev.

## Credits

- The theme variations' animal and flower icons come from [Flaticon](https://www.flaticon.com).
- Fonts are Fredoka and Kantumruy Pro, from Google Fonts.

## Licence

See [LICENSE](LICENSE).
