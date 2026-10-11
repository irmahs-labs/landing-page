import { beforeEach, describe, expect, it, vi } from "vitest";

const token = () => Response.json({ access_token: "abc", expires_in: 3600 });
const track = {
  is_playing: true,
  item: {
    album: { images: [{ url: "https://i.scdn.co/cover.jpg" }], name: "Album" },
    artists: [{ name: "A" }, { name: "B" }],
    duration_ms: 200_000,
    external_urls: { spotify: "https://open.spotify.com/track/1" },
    name: "Song",
    type: "track",
  },
  progress_ms: 50_000,
};

/** A fresh copy of the module, so its token and cache start empty */
const load = () => {
  vi.resetModules();
  return import("./spotify");
};

beforeEach(() => {
  vi.stubEnv("SPOTIFY_CLIENT_ID", "id");
  vi.stubEnv("SPOTIFY_CLIENT_SECRET", "secret");
  vi.stubEnv("SPOTIFY_REFRESH_TOKEN", "refresh");
});

describe("getNowPlaying", () => {
  it("turns Spotify's current track into the player's shape", async () => {
    vi.stubGlobal(
      "fetch",
      vi
        .fn()
        .mockResolvedValueOnce(token())
        .mockResolvedValueOnce(Response.json(track))
    );
    const { getNowPlaying } = await load();
    expect(await getNowPlaying()).toMatchObject({
      album: "Album",
      artist: "A, B",
      durationMs: 200_000,
      image: "https://i.scdn.co/cover.jpg",
      playing: true,
      title: "Song",
      url: "https://open.spotify.com/track/1",
    });
  });

  it("says nothing is playing when Spotify has nothing (204)", async () => {
    vi.stubGlobal(
      "fetch",
      vi
        .fn()
        .mockResolvedValueOnce(token())
        .mockResolvedValueOnce(new Response(null, { status: 204 }))
    );
    const { getNowPlaying } = await load();
    expect(await getNowPlaying()).toEqual({ playing: false });
  });

  it("asks Spotify at most once every ten seconds, moving the progress on", async () => {
    vi.useFakeTimers({ now: 1_000_000 });
    const fetch = vi
      .fn()
      .mockResolvedValueOnce(token())
      .mockResolvedValueOnce(Response.json(track));
    vi.stubGlobal("fetch", fetch);
    const { getNowPlaying } = await load();
    await getNowPlaying();
    vi.setSystemTime(1_004_000);
    const again = await getNowPlaying();
    expect(fetch).toHaveBeenCalledTimes(2);
    expect(again).toMatchObject({ progressMs: 54_000 });
  });

  it("fails loudly without credentials", async () => {
    vi.stubEnv("SPOTIFY_REFRESH_TOKEN", "");
    const { getNowPlaying } = await load();
    await expect(getNowPlaying()).rejects.toThrow(/SPOTIFY_REFRESH_TOKEN/u);
  });
});
