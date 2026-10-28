import {
  addressOf,
  isBot,
  markGone,
  markOnline,
  MAX_PINGS,
  onlineCount,
  visitorKey,
} from "@/lib/presence";
import { createRateLimit } from "@/lib/rate-limit";

const NO_STORE = { "Cache-Control": "no-store" };

const allowPing = createRateLimit(MAX_PINGS);

const answer = (online: number, status = 200) =>
  Response.json({ online }, { headers: NO_STORE, status });

/**
 * Counts the visitor among those online, or with `gone`, stops counting
 * them, then says how many are. Bots are never counted, and an address that
 * pings too often is told the count without changing it.
 */
const handle = (request: Request, gone: boolean) => {
  const userAgent = request.headers.get("user-agent") ?? "";

  if (isBot(userAgent)) {
    return answer(onlineCount());
  }

  const address = addressOf(request);

  if (!allowPing(address)) {
    return answer(onlineCount(), 429);
  }

  const key = visitorKey(address, userAgent);

  return answer(gone ? markGone(key) : markOnline(key));
};

/** The page is open and visible: a ping every 30 seconds */
export const POST = (request: Request) => handle(request, false);

/** The tab was closed or hidden */
export const DELETE = (request: Request) => handle(request, true);
