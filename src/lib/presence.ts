import "server-only";
import { createHash, randomBytes } from "node:crypto";

/** How long after their last ping someone still counts as online */
export const ONLINE_MS = 75_000;

/** Pings one address may send a minute: a tab pings twice, so this allows a few */
export const MAX_PINGS = 12;

// Crawlers, link previews and scripts, which never sit on the page
const BOT =
  /bot|crawl|spider|slurp|preview|headless|lighthouse|facebookexternalhit|curl|wget|python|go-http|node-fetch/iu;

/** Whether this user agent is a bot rather than someone reading the page */
export const isBot = (userAgent: string) => !userAgent || BOT.test(userAgent);

/**
 * The visitor's address. Cloudflare, in front of Caddy, names it in
 * CF-Connecting-IP; Caddy only knows Cloudflare's own address.
 */
export const addressOf = (request: Request) =>
  request.headers.get("cf-connecting-ip") ??
  request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ??
  "unknown";

interface Presence {
  /** When each visitor last pinged */
  lastSeen: Map<string, number>;
  salt: { day: string; value: string };
}

/** Where the process keeps who's online, under globalThis */
export const PRESENCE = Symbol.for("irmahs.dev presence");

// Next bundles each route on its own, each with its own copy of this module,
// so what /api/presence counts and /api/visitors reads lives on globalThis.
// It is only ever in memory.
const presence = () => {
  // SAFETY: only this module sets PRESENCE, always to a Presence
  const store = globalThis as typeof globalThis & { [PRESENCE]?: Presence };

  store[PRESENCE] ??= { lastSeen: new Map(), salt: { day: "", value: "" } };

  return store[PRESENCE];
};

// A random salt that changes every day (UTC) and is never saved, so a
// visitor's key can't be traced back to them, or followed from one day to
// the next
const saltFor = (now: number) => {
  const day = new Date(now).toISOString().slice(0, 10);
  const state = presence();

  if (state.salt.day !== day) {
    state.salt = { day, value: randomBytes(16).toString("hex") };
  }

  return state.salt.value;
};

/** One visitor's key for today: their address and browser, hashed with the day's salt */
export const visitorKey = (
  address: string,
  userAgent: string,
  now = Date.now()
) =>
  createHash("sha256")
    .update(`${saltFor(now)}|${address}|${userAgent}`)
    .digest("base64url");

/** How many visitors pinged within the last ONLINE_MS */
export const onlineCount = (now = Date.now()) => {
  const { lastSeen } = presence();

  // Forget whoever has gone quiet, so the map doesn't grow forever
  for (const [key, seen] of lastSeen) {
    if (now - seen >= ONLINE_MS) {
      lastSeen.delete(key);
    }
  }

  return lastSeen.size;
};

/** Counts this visitor as online now, and says how many are */
export const markOnline = (key: string, now = Date.now()) => {
  presence().lastSeen.set(key, now);

  return onlineCount(now);
};

// A reload sends the old page's goodbye and the new page's hello together,
// and the goodbye can arrive second: one this soon after a hello is ignored
const RELOAD_MS = 5000;

/** Stops counting this visitor, who has left or hidden the tab */
export const markGone = (key: string, now = Date.now()) => {
  const { lastSeen } = presence();
  const seen = lastSeen.get(key);

  if (seen !== undefined && now - seen >= RELOAD_MS) {
    lastSeen.delete(key);
  }

  return onlineCount(now);
};
