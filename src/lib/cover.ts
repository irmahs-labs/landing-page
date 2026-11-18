/**
 * Album covers come from Spotify's image host. The page asks irmahs.dev for
 * them instead, and the server fetches them, so a visitor's browser never
 * contacts Spotify (see the privacy policy, src/lib/legal.ts).
 *
 * Only a cover's id travels: the server rebuilds the address on Spotify's
 * host itself, so the route can fetch nothing else.
 */
const COVER_PREFIX = "https://i.scdn.co/image/";

/** A Spotify image id: letters and digits only */
const COVER_ID = /^[0-9a-z]{16,64}$/iu;

export const isCoverId = (id: string) => COVER_ID.test(id);

/** The cover's id, when the address is one of Spotify's covers */
export const coverIdOf = (src: string): string | null => {
  if (!src.startsWith(COVER_PREFIX)) {
    return null;
  }

  const id = src.slice(COVER_PREFIX.length);

  return isCoverId(id) ? id : null;
};

/** Spotify's address for a cover, from its id */
export const coverUrl = (id: string) => `${COVER_PREFIX}${id}`;

/** Where the page loads a cover from: through irmahs.dev, or nowhere */
export const coverSrc = (src: string): string | null => {
  const id = coverIdOf(src);

  return id ? `/api/now-playing/cover?id=${id}` : null;
};
