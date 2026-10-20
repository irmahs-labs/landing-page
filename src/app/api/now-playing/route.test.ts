import { beforeEach, describe, expect, it, vi } from "vitest";

/** A fresh route, so the Spotify module's token and cache start empty */
const load = () => {
  vi.resetModules();

  return import("./route");
};

beforeEach(() => {
  vi.stubEnv("SPOTIFY_CLIENT_ID", "id");
  vi.stubEnv("SPOTIFY_CLIENT_SECRET", "secret");
  vi.stubEnv("SPOTIFY_REFRESH_TOKEN", "refresh");
});

describe("GET /api/now-playing", () => {
  it("answers with what's playing, never cached", async () => {
    vi.stubGlobal(
      "fetch",
      vi
        .fn()
        .mockResolvedValueOnce(
          Response.json({ access_token: "abc", expires_in: 3600 })
        )
        .mockResolvedValueOnce(new Response(null, { status: 204 }))
    );
    const { GET } = await load();
    const res = await GET();
    expect(res.status).toBe(200);
    expect(res.headers.get("Cache-Control")).toBe("no-store");
    expect(await res.json()).toEqual({ playing: false });
  });

  it("falls back to nothing playing, with a 502, when Spotify fails", async () => {
    vi.spyOn(console, "error").mockImplementation(vi.fn());
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue(new Response("nope", { status: 400 }))
    );
    const { GET } = await load();
    const res = await GET();
    expect(res.status).toBe(502);
    expect(await res.json()).toEqual({ playing: false });
  });
});
