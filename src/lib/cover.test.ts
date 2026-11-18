import { describe, expect, it } from "vitest";

import { coverIdOf, coverSrc, coverUrl, isCoverId } from "./cover";

const ID = "ab67616d0000b2733bc0a1f2d4e5f6a7b8c9d0e1";

describe("album covers", () => {
  it("reads the id of Spotify's own covers only", () => {
    expect(coverIdOf(`https://i.scdn.co/image/${ID}`)).toBe(ID);
    expect(coverIdOf(`http://i.scdn.co/image/${ID}`)).toBeNull();
    expect(coverIdOf(`https://i.scdn.co.evil.example/image/${ID}`)).toBeNull();
    expect(coverIdOf("https://i.scdn.co/image/../../etc")).toBeNull();
    expect(coverIdOf("not a url")).toBeNull();
  });

  it("only takes ids made of letters and digits", () => {
    expect(isCoverId(ID)).toBe(true);
    expect(isCoverId("a/b")).toBe(false);
    expect(isCoverId("")).toBe(false);
  });

  it("loads covers through irmahs.dev, rebuilt on Spotify's host", () => {
    expect(coverSrc(`https://i.scdn.co/image/${ID}`)).toBe(
      `/api/now-playing/cover?id=${ID}`
    );
    expect(coverSrc("https://evil.example/x.jpg")).toBeNull();
    expect(coverUrl(ID)).toBe(`https://i.scdn.co/image/${ID}`);
  });
});
