import { beforeEach, describe, expect, it, vi } from "vitest";

const NOW = Date.parse("2026-10-28T15:00:00Z");

/** A day as Cloudflare's httpRequests1dGroups answers it */
const group = (
  date: string,
  uniques: number,
  countries: Record<string, number>
) => ({
  dimensions: { date },
  sum: {
    countryMap: Object.entries(countries).map(([code, requests]) => ({
      clientCountryName: code,
      requests,
    })),
    pageViews: uniques * 3,
  },
  uniq: { uniques },
});

const GROUPS = [
  group("2026-10-23", 4, { FR: 30, NL: 10 }),
  group("2026-10-28", 7, { DE: 5, FR: 40, ID: 15 }),
];

interface Answer {
  data: { viewer: { zones: { httpRequests1dGroups: typeof GROUPS }[] } } | null;
  errors: { message: string }[] | null;
}

const cloudflare = (body: Answer, status = 200) => {
  const fetch = vi
    .fn()
    .mockImplementation(() => Promise.resolve(Response.json(body, { status })));

  vi.stubGlobal("fetch", fetch);

  return fetch;
};

const answer: Answer = {
  data: { viewer: { zones: [{ httpRequests1dGroups: GROUPS }] } },
  errors: null,
};

/** A fresh copy of the module, so its cache starts empty */
const load = () => {
  vi.resetModules();

  return import("./visitor-history");
};

beforeEach(() => {
  vi.stubEnv("CLOUDFLARE_API_TOKEN", "token");
  vi.stubEnv("CLOUDFLARE_ZONE_ID", "zone");
});

describe("lastDays", () => {
  it("is the seven UTC days ending today", async () => {
    const { lastDays } = await load();

    expect(lastDays(NOW)).toEqual([
      "2026-10-22",
      "2026-10-23",
      "2026-10-24",
      "2026-10-25",
      "2026-10-26",
      "2026-10-27",
      "2026-10-28",
    ]);
  });
});

describe("toHistory", () => {
  it("fills quiet days with zeros and ranks countries by their share", async () => {
    const { lastDays, toHistory } = await load();
    const history = toHistory(GROUPS, lastDays(NOW));

    expect(history.days.map((d) => d.visitors)).toEqual([0, 4, 0, 0, 0, 0, 7]);
    expect(history.days[1]).toEqual({
      date: "2026-10-23",
      pageViews: 12,
      visitors: 4,
    });
    expect(history.countries).toEqual([
      { code: "FR", share: 0.7 },
      { code: "ID", share: 0.15 },
      { code: "NL", share: 0.1 },
      { code: "DE", share: 0.05 },
    ]);
  });

  it("lists the top six countries at most", async () => {
    const { TOP_COUNTRIES, toHistory } = await load();

    const many = Object.fromEntries(
      ["FR", "NL", "DE", "ID", "US", "GB", "JP", "KH"].map((c, i) => [c, i + 1])
    );

    expect(
      toHistory([group("2026-10-28", 1, many)], []).countries
    ).toHaveLength(TOP_COUNTRIES);
  });
});

describe("getVisitorHistory", () => {
  it("is null until Cloudflare is set up", async () => {
    vi.stubEnv("CLOUDFLARE_API_TOKEN", "");
    const { getVisitorHistory } = await load();

    expect(getVisitorHistory(NOW)).toBeNull();
  });

  it("asks Cloudflare for the zone's last seven days, and keeps the answer five minutes", async () => {
    const fetch = cloudflare(answer);
    const { getVisitorHistory } = await load();

    const history = await getVisitorHistory(NOW);
    expect(history?.days.at(-1)?.visitors).toBe(7);

    // SAFETY: the module calls fetch(url, init), and it was called once
    const [url, init] = fetch.mock.calls[0] as [string, RequestInit];
    expect(url).toBe("https://api.cloudflare.com/client/v4/graphql");
    expect(new Headers(init.headers).get("authorization")).toBe("Bearer token");

    // SAFETY: the body is the JSON the module sends
    const { variables } = JSON.parse(String(init.body)) as {
      variables: Record<string, string>;
    };

    expect(variables).toEqual({
      since: "2026-10-22",
      until: "2026-10-28",
      zone: "zone",
    });

    await getVisitorHistory(NOW + 60_000);
    expect(fetch).toHaveBeenCalledTimes(1);
    await getVisitorHistory(NOW + 5 * 60_000);
    expect(fetch).toHaveBeenCalledTimes(2);
  });

  it("fails on Cloudflare's errors, and asks again next time", async () => {
    const fetch = cloudflare({
      data: null,
      errors: [{ message: "bad token" }],
    });

    const { getVisitorHistory } = await load();

    await expect(getVisitorHistory(NOW)).rejects.toThrow("bad token");
    fetch.mockImplementation(() => Promise.resolve(Response.json(answer)));
    await expect(getVisitorHistory(NOW + 1000)).resolves.toBeTruthy();
  });
});
