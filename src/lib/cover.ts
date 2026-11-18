/**
 * Album covers come from Spotify's image host. The page asks irmahs.dev for
 * them instead, and the server fetches them, so a visitor's browser never
 * contacts Spotify (see the privacy policy, src/lib/legal.ts).
 */
const COVER_HOST = "i.scdn.co";

/** Whether a URL is a Spotify cover, the only kind the server will fetch */
export const isSpotifyCover = (src: string) => {
  try {
    const url = new URL(src);

    return url.protocol === "https:" && url.hostname === COVER_HOST;
  } catch {
    return false;
  }
};

/** Where the page loads a cover from: through irmahs.dev */
export const coverSrc = (src: string) =>
  `/api/now-playing/cover?src=${encodeURIComponent(src)}`;
