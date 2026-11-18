import { describe, expect, it } from "vitest";

import { coverSrc, isSpotifyCover } from "./cover";

describe("album covers", () => {
  it("only fetches Spotify's own covers", () => {
    expect(isSpotifyCover("https://i.scdn.co/image/ab67616d")).toBe(true);
    expect(isSpotifyCover("http://i.scdn.co/image/ab67616d")).toBe(false);
    expect(isSpotifyCover("https://i.scdn.co.evil.example/x")).toBe(false);
    expect(isSpotifyCover("https://evil.example/?u=i.scdn.co")).toBe(false);
    expect(isSpotifyCover("not a url")).toBe(false);
  });

  it("loads covers through irmahs.dev", () => {
    expect(coverSrc("https://i.scdn.co/image/a b")).toBe(
      "/api/now-playing/cover?src=https%3A%2F%2Fi.scdn.co%2Fimage%2Fa%20b"
    );
  });
});
