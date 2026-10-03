import "server-only";

export type NowPlaying =
  | { playing: false }
  | {
      album: string | null;
      artist: string | null;
      durationMs: number;
      image: string | null;
      playing: boolean;
      progressMs: number;
      title: string;
      url: string | null;
    };

interface SpotifyImage {
  url: string;
}

interface CurrentlyPlaying {
  is_playing: boolean;
  item:
    | {
        album: { images: SpotifyImage[]; name: string };
        artists: { name: string }[];
        duration_ms: number;
        external_urls?: { spotify?: string };
        name: string;
        type: "track";
      }
    | {
        duration_ms: number;
        external_urls?: { spotify?: string };
        images?: SpotifyImage[];
        name: string;
        show?: { name: string };
        type: "episode";
      }
    | null;
  progress_ms: number;
}

const credentials = () => {
  const { SPOTIFY_CLIENT_ID, SPOTIFY_CLIENT_SECRET, SPOTIFY_REFRESH_TOKEN } =
    process.env;
  if (!(SPOTIFY_CLIENT_ID && SPOTIFY_CLIENT_SECRET && SPOTIFY_REFRESH_TOKEN)) {
    throw new Error(
      "Missing SPOTIFY_CLIENT_ID, SPOTIFY_CLIENT_SECRET or SPOTIFY_REFRESH_TOKEN"
    );
  }
  return {
    basic: Buffer.from(
      `${SPOTIFY_CLIENT_ID}:${SPOTIFY_CLIENT_SECRET}`
    ).toString("base64"),
    refreshToken: SPOTIFY_REFRESH_TOKEN,
  };
};

let token: { expiresAt: number; value: string } | null = null;

const accessToken = async () => {
  if (token && Date.now() < token.expiresAt) {
    return token.value;
  }
  const { basic, refreshToken } = credentials();
  const res = await fetch("https://accounts.spotify.com/api/token", {
    body: new URLSearchParams({
      grant_type: "refresh_token",
      refresh_token: refreshToken,
    }),
    cache: "no-store",
    headers: {
      Authorization: `Basic ${basic}`,
      "Content-Type": "application/x-www-form-urlencoded",
    },
    method: "POST",
  });
  if (!res.ok) {
    throw new Error(`token refresh failed: ${res.status} ${await res.text()}`);
  }
  // SAFETY: a 2xx from Spotify's token endpoint has this documented shape
  const data = (await res.json()) as {
    access_token: string;
    expires_in: number;
  };
  token = {
    expiresAt: Date.now() + (data.expires_in - 60) * 1000,
    value: data.access_token,
  };
  return token.value;
};

const fetchNowPlaying = async (): Promise<NowPlaying> => {
  const res = await fetch(
    "https://api.spotify.com/v1/me/player/currently-playing",
    {
      cache: "no-store",
      headers: { Authorization: `Bearer ${await accessToken()}` },
    }
  );
  if (res.status === 401) {
    token = null;
  }
  if (res.status === 204 || !res.ok) {
    return { playing: false };
  }
  // SAFETY: a 200 (not 204) from currently-playing has this documented shape
  const data = (await res.json()) as CurrentlyPlaying;
  const { item } = data;
  if (!item) {
    return { playing: false };
  }
  const isTrack = item.type === "track";
  return {
    album: isTrack ? item.album.name : null,
    artist: isTrack
      ? item.artists.map((a) => a.name).join(", ")
      : (item.show?.name ?? null),
    durationMs: item.duration_ms,
    image: (isTrack ? item.album.images : item.images)?.[0]?.url ?? null,
    playing: data.is_playing,
    progressMs: data.progress_ms,
    title: item.name,
    url: item.external_urls?.spotify ?? null,
  };
};

const CACHE_MS = 10_000;
// Shields Spotify from visitor traffic: at most one call per CACHE_MS
let cache: { at: number; data: NowPlaying } | null = null;

export const getNowPlaying = async (): Promise<NowPlaying> => {
  if (!cache || Date.now() - cache.at > CACHE_MS) {
    cache = { at: Date.now(), data: await fetchNowPlaying() };
  }
  const { at, data } = cache;
  // Keep progress accurate for responses served from the cache
  return data.playing
    ? { ...data, progressMs: data.progressMs + (Date.now() - at) }
    : data;
};
