import { createServer } from "node:http";

const { SPOTIFY_CLIENT_ID, SPOTIFY_CLIENT_SECRET, SPOTIFY_REFRESH_TOKEN } =
  process.env;
if (!SPOTIFY_CLIENT_ID || !SPOTIFY_CLIENT_SECRET || !SPOTIFY_REFRESH_TOKEN) {
  console.error(
    "Missing SPOTIFY_CLIENT_ID, SPOTIFY_CLIENT_SECRET or SPOTIFY_REFRESH_TOKEN"
  );
  process.exit(1);
}

const basic = Buffer.from(
  `${SPOTIFY_CLIENT_ID}:${SPOTIFY_CLIENT_SECRET}`
).toString("base64");
// { value, expiresAt }
let token = null;
// { data, at } — shields Spotify from visitor traffic
let cache = null;
const CACHE_MS = 10_000;

const accessToken = async () => {
  if (token && Date.now() < token.expiresAt) {
    return token.value;
  }
  const res = await fetch("https://accounts.spotify.com/api/token", {
    body: new URLSearchParams({
      grant_type: "refresh_token",
      refresh_token: SPOTIFY_REFRESH_TOKEN,
    }),
    headers: {
      Authorization: `Basic ${basic}`,
      "Content-Type": "application/x-www-form-urlencoded",
    },
    method: "POST",
  });
  if (!res.ok) {
    throw new Error(`token refresh failed: ${res.status} ${await res.text()}`);
  }
  const data = await res.json();
  token = {
    expiresAt: Date.now() + (data.expires_in - 60) * 1000,
    value: data.access_token,
  };
  return token.value;
};

const nowPlaying = async () => {
  const res = await fetch(
    "https://api.spotify.com/v1/me/player/currently-playing",
    {
      headers: { Authorization: `Bearer ${await accessToken()}` },
    }
  );
  if (res.status === 401) {
    token = null;
  }
  if (res.status === 204 || !res.ok) {
    return { playing: false };
  }
  const data = await res.json();
  const { item } = data;
  if (!item) {
    return { playing: false };
  }
  const isTrack = item.type === "track";
  return {
    album: isTrack ? item.album.name : null,
    artist: isTrack
      ? item.artists.map((a) => a.name).join(", ")
      : item.show?.name,
    durationMs: item.duration_ms,
    image: (isTrack ? item.album.images : item.images)?.[0]?.url ?? null,
    playing: data.is_playing,
    progressMs: data.progress_ms,
    title: item.name,
    url: item.external_urls?.spotify ?? null,
  };
};

createServer(async (req, res) => {
  if (req.url !== "/api/now-playing") {
    res.writeHead(404).end();
    return;
  }
  try {
    if (!cache || Date.now() - cache.at > CACHE_MS) {
      cache = { at: Date.now(), data: await nowPlaying() };
    }
    const { data, at } = cache;
    const body = data.playing
      ? { ...data, progressMs: data.progressMs + (Date.now() - at) }
      : data;
    res.writeHead(200, {
      "Cache-Control": "no-store",
      "Content-Type": "application/json",
    });
    res.end(JSON.stringify(body));
  } catch (error) {
    console.error(error);
    res
      .writeHead(502, { "Content-Type": "application/json" })
      .end('{"playing":false}');
  }
}).listen(3000, () => console.log("api listening on :3000"));
