import { beforeEach, describe, expect, it, vi } from "vitest";

const FIREFOX = "Mozilla/5.0 (Macintosh) Firefox/140.0";

/** A fresh route, so nobody is online yet */
/** Forgets everyone online and the day's salt, as a restart would */
const restart = () => {
  Reflect.deleteProperty(globalThis, Symbol.for("irmahs.dev presence"));
  vi.resetModules();
};

const load = () => {
  restart();

  return import("./route");
};

const request = (
  method: "DELETE" | "POST",
  { agent = FIREFOX, ip = "203.0.113.7" } = {}
) =>
  new Request("https://irmahs.dev/api/presence", {
    headers: { "cf-connecting-ip": ip, "user-agent": agent },
    method,
  });

/** The status and count the route answers */
const send = async (res: Response) => ({
  // SAFETY: the route answers { online } every time
  online: ((await res.json()) as { online: number }).online,
  status: res.status,
});

let route: Awaited<ReturnType<typeof load>>;

beforeEach(async () => {
  route = await load();
});

describe("/api/presence", () => {
  it("counts each visitor once while they ping, and not once they've gone", async () => {
    expect(await send(route.POST(request("POST")))).toEqual({
      online: 1,
      status: 200,
    });
    expect(await send(route.POST(request("POST")))).toMatchObject({
      online: 1,
    });
    expect(
      await send(route.POST(request("POST", { ip: "198.51.100.2" })))
    ).toMatchObject({ online: 2 });
    // Their goodbye, a while after their last hello
    vi.useFakeTimers({ now: Date.now() + 10_000 });
    expect(await send(route.DELETE(request("DELETE")))).toMatchObject({
      online: 1,
    });
  });

  it("never counts a bot", async () => {
    expect(
      await send(route.POST(request("POST", { agent: "Googlebot/2.1" })))
    ).toEqual({ online: 0, status: 200 });
  });

  it("tells an address that pings too often the count, without changing it", async () => {
    const { MAX_PINGS } = await import("@/lib/presence");

    for (let i = 0; i < MAX_PINGS; i += 1) {
      route.POST(request("POST"));
    }

    expect(
      await send(route.POST(request("POST", { agent: "Another browser" })))
    ).toEqual({ online: 1, status: 429 });
  });
});
