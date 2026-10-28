import { beforeEach, describe, expect, it, vi } from "vitest";

import { APPS } from "./apps";

const RUN = "2026-10-27T20:58:31Z";
const VERCEL = "2026-09-15T14:21:30Z";

/** GitHub as the apps' repos see it: a deploy run each, a Vercel deployment */
const github = (url: string) => {
  if (url.includes("/actions/workflows/")) {
    return Response.json({ workflow_runs: [{ updated_at: RUN }] });
  }

  if (url.includes("/deployments?")) {
    return Response.json([
      { statuses_url: "https://api.github.com/statuses/2" },
      { statuses_url: "https://api.github.com/statuses/1" },
    ]);
  }

  // The newest deployment failed, the one before it went out
  return url.includes("/statuses/2")
    ? Response.json([{ created_at: "2026-09-16T10:00:00Z", state: "failure" }])
    : Response.json([{ created_at: VERCEL, state: "success" }]);
};

/** A fresh copy of the module, so its cache starts empty */
const load = () => {
  vi.resetModules();

  return import("./deploys");
};

const vercelApp = APPS.find((app) => "environment" in app.deploys);

beforeEach(() => {
  vi.useRealTimers();
  vi.spyOn(console, "error").mockImplementation(() => {});
});

describe("getDeploys", () => {
  it("dates every app by its last successful deploy", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn(async (url: string) => await Promise.resolve(github(url)))
    );
    const { getDeploys } = await load();
    const deploys = await getDeploys();

    for (const app of APPS) {
      expect(deploys[app.href]).toBe(app === vercelApp ? VERCEL : RUN);
    }
  });

  it("asks GitHub again only after 15 minutes", async () => {
    vi.useFakeTimers({ toFake: ["Date"] });
    const fetch = vi.fn(
      async (url: string) => await Promise.resolve(github(url))
    );
    vi.stubGlobal("fetch", fetch);
    const { getDeploys } = await load();
    await getDeploys();
    const calls = fetch.mock.calls.length;
    await getDeploys();
    expect(fetch).toHaveBeenCalledTimes(calls);
    vi.advanceTimersByTime(16 * 60 * 1000);
    await getDeploys();
    expect(fetch).toHaveBeenCalledTimes(calls * 2);
  });

  it("keeps the dates it had while GitHub is down", async () => {
    vi.useFakeTimers({ toFake: ["Date"] });
    const fetch = vi.fn(
      async (url: string) => await Promise.resolve(github(url))
    );
    vi.stubGlobal("fetch", fetch);
    const { getDeploys } = await load();
    const before = await getDeploys();
    fetch.mockResolvedValue(new Response(null, { status: 403 }));
    vi.advanceTimersByTime(16 * 60 * 1000);
    expect(await getDeploys()).toEqual(before);
  });

  it("has no date for an app GitHub never answered for", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue(new Response(null, { status: 500 }))
    );
    const { getDeploys } = await load();
    const deploys = await getDeploys();

    for (const app of APPS) {
      expect(deploys[app.href]).toBeNull();
    }
  });

  it("has no date when nothing ever deployed", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn(async (url: string) => {
        await Promise.resolve();

        return url.includes("/actions/")
          ? Response.json({ workflow_runs: [] })
          : Response.json([]);
      })
    );
    const { getDeploys } = await load();
    expect(Object.values(await getDeploys()).every((d) => d === null)).toBe(
      true
    );
  });
});
