import { createServer } from "node:http";

const { SPOTIFY_CLIENT_ID, SPOTIFY_CLIENT_SECRET, SPOTIFY_REFRESH_TOKEN } = process.env;
if (!SPOTIFY_CLIENT_ID || !SPOTIFY_CLIENT_SECRET || !SPOTIFY_REFRESH_TOKEN) {
  console.error("Missing SPOTIFY_CLIENT_ID, SPOTIFY_CLIENT_SECRET or SPOTIFY_REFRESH_TOKEN");
  process.exit(1);
}

const basic = Buffer.from(`${SPOTIFY_CLIENT_ID}:${SPOTIFY_CLIENT_SECRET}`).toString("base64");
let token = null;      // { value, expiresAt }
let cache = null;      // { body, at } — shields Spotify from visitor traffic
const CACHE_MS = 10_000;

async function accessToken() {
  if (token && Date.now() < token.expiresAt) return token.value;
  const res = await fetch("https://accounts.spotify.com/api/token", {
    method: "POST",
    headers: { Authorization: `Basic ${basic}`, "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({ grant_type: "refresh_token", refresh_token: SPOTIFY_REFRESH_TOKEN }),
  });
  if (!res.ok) throw new Error(`token refresh failed: ${res.status} ${await res.text()}`);
  const data = await res.json();
  token = { value: data.access_token, expiresAt: Date.now() + (data.expires_in - 60) * 1000 };
  return token.value;
}

async function nowPlaying() {
  const res = await fetch("https://api.spotify.com/v1/me/player/currently-playing", {
    headers: { Authorization: `Bearer ${await accessToken()}` },
  });
  if (res.status === 401) token = null;
  if (res.status === 204 || !res.ok) return { playing: false };
  const data = await res.json();
  const item = data.item;
  if (!item) return { playing: false };
  const isTrack = item.type === "track";
  return {
    playing: data.is_playing,
    title: item.name,
    artist: isTrack ? item.artists.map((a) => a.name).join(", ") : item.show?.name,
    album: isTrack ? item.album.name : null,
    image: (isTrack ? item.album.images : item.images)?.[0]?.url ?? null,
    url: item.external_urls?.spotify ?? null,
    progressMs: data.progress_ms,
    durationMs: item.duration_ms,
  };
}

createServer(async (req, res) => {
  if (req.url !== "/api/now-playing") {
    res.writeHead(404).end();
    return;
  }
  try {
    if (!cache || Date.now() - cache.at > CACHE_MS) {
      cache = { data: await nowPlaying(), at: Date.now() };
    }
    const { data, at } = cache;
    const body = data.playing ? { ...data, progressMs: data.progressMs + (Date.now() - at) } : data;
    res.writeHead(200, { "Content-Type": "application/json", "Cache-Control": "no-store" });
    res.end(JSON.stringify(body));
  } catch (err) {
    console.error(err);
    res.writeHead(502, { "Content-Type": "application/json" }).end('{"playing":false}');
  }
}).listen(3000, () => console.log("api listening on :3000"));
