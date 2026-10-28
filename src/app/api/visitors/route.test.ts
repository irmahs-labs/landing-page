import { beforeEach, describe, expect, it, vi } from "vitest";

import { AUTH_URL } from "@/lib/auth";
import type { VisitorStats } from "@/lib/visitors";

const GROUPS = [
  {
    dimensions: { date: new Date().toISOString().slice(0, 10) },
    sum: {
      countryMap: [{ clientCountryName: "FR", requests: 10 }],
      pageViews: 9,
    },
    uniq: { uniques: 3 },
  },
];

/**
 * The account service, saying yes only to Irma's cookie, and Cloudflare,
 * answering with GROUPS or with `cloudflareStatus`
 */
const serve = (cloudflareStatus = 200) => {
  const fetch = vi.fn((url: string, init?: RequestInit) => {
    if (url === `${AUTH_URL}/api/access/alma-housila`) {
      const cookie = new Headers(init?.headers).get("cookie");

      return Promise.resolve(
        new Response(null, { status: cookie === "session=irma" ? 204 : 403 })
      );
    }

    return Promise.resolve(
      Response.json(
        { data: { viewer: { zones: [{ httpRequests1dGroups: GROUPS }] } } },
        { status: cloudflareStatus }
      )
    );
  });

  vi.stubGlobal("fetch", fetch);
};

/** A fresh route, so nothing is cached and nobody is online */
const ask = async (cookie?: string) => {
  const { GET } = await import("./route");

  return GET(
    new Request("https://irmahs.dev/api/visitors", {
      headers: cookie ? { cookie } : {},
    })
  );
};

/** What the route tells Irma */
const statsForIrma = async () => {
  const res = await ask("session=irma");

  // SAFETY: the route answers a VisitorStats to an admin
  return (await res.json()) as VisitorStats;
};

/** Forgets everyone online and the day's salt, as a restart would */
const restart = () => {
  Reflect.deleteProperty(globalThis, Symbol.for("irmahs.dev presence"));
  vi.resetModules();
};

beforeEach(() => {
  restart();
  vi.stubEnv("CLOUDFLARE_API_TOKEN", "token");
  vi.stubEnv("CLOUDFLARE_ZONE_ID", "zone");
  vi.spyOn(console, "error").mockImplementation(() => {});
});

describe("/api/visitors", () => {
  it("tells nobody but an admin", async () => {
    serve();
    const signedOut = await ask();
    const someone = await ask("session=someone");

    expect(signedOut.status).toBe(403);
    expect(someone.status).toBe(403);
  });

  it("gives an admin the week from Cloudflare and who's online", async () => {
    serve();
    const res = await ask("session=irma");

    expect(res.status).toBe(200);
    expect(res.headers.get("cache-control")).toBe("no-store");

    // SAFETY: as in statsForIrma
    const stats = (await res.json()) as VisitorStats;
    expect(stats.online).toBe(0);
    expect(stats.history?.days.at(-1)?.visitors).toBe(3);
    expect(stats.history?.countries).toEqual([{ code: "FR", share: 1 }]);
  });

  it("counts who /api/presence counts, though Next bundles the routes apart", async () => {
    serve();
    const presence = await import("../presence/route");
    presence.POST(
      new Request("https://irmahs.dev/api/presence", {
        headers: { "cf-connecting-ip": "203.0.113.7", "user-agent": "Firefox" },
        method: "POST",
      })
    );
    vi.resetModules();

    expect(await statsForIrma()).toMatchObject({ online: 1 });
  });

  it("still gives the online count when Cloudflare fails", async () => {
    serve(500);
    expect(await statsForIrma()).toEqual({ history: null, online: 0 });
  });

  it("still gives the online count when Cloudflare isn't set up", async () => {
    serve();
    vi.stubEnv("CLOUDFLARE_ZONE_ID", "");
    expect(await statsForIrma()).toEqual({ history: null, online: 0 });
  });
});
