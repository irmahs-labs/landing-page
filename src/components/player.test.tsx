import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import type { NowPlaying } from "@/lib/spotify";

import { Player } from "./player";

/** What /api/now-playing answers, for the player's polling */
const nowPlaying = (body: NowPlaying) =>
  vi.stubGlobal("fetch", () => Promise.resolve(Response.json(body)));

describe("Player", () => {
  it("has Tokkae sing in the cover while nothing plays", async () => {
    nowPlaying({ playing: false });
    const { container } = render(<Player now={null} />);
    expect(await screen.findByText("Nothing playing")).toBeDefined();
    expect(container.querySelector(".cover .emote")).not.toBeNull();
    expect(container.querySelector(".player-window.is-idle")).not.toBeNull();
  });

  it("shows the song, its cover and progress, linking to Spotify", async () => {
    nowPlaying({
      album: "Album",
      artist: "Someone",
      durationMs: 200_000,
      image: "https://i.scdn.co/cover.jpg",
      playing: true,
      progressMs: 65_000,
      title: "A song",
      url: "https://open.spotify.com/track/1",
    });
    const { container } = render(<Player now={null} />);
    const link = await screen.findByRole("link", { name: /A song/u });
    expect(link.getAttribute("href")).toBe("https://open.spotify.com/track/1");
    expect(link.getAttribute("target")).toBe("_blank");
    expect(container.querySelector(".cover img")?.getAttribute("src")).toBe(
      "https://i.scdn.co/cover.jpg"
    );
    expect(screen.getByText("1:05")).toBeDefined();
    expect(screen.getByText("3:20")).toBeDefined();
    expect(container.querySelector(".emote")).toBeNull();
  });

  it("keeps the controls as decorations for now", async () => {
    nowPlaying({ playing: false });
    render(<Player now={null} />);
    await screen.findByText("Nothing playing");
    for (const name of ["Shuffle", "Previous track", "Next track", "Repeat"]) {
      expect(screen.getByRole("button", { name }).getAttribute("title")).toBe(
        "coming soon"
      );
    }
  });
});
