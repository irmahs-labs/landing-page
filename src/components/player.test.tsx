import { fireEvent, render, screen } from "@testing-library/react";
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

  it("keeps the controls as decorations while music plays", async () => {
    nowPlaying({
      album: null,
      artist: "Someone",
      durationMs: 200_000,
      image: null,
      playing: true,
      progressMs: 0,
      title: "A song",
      url: "https://open.spotify.com/track/1",
    });
    render(<Player now={null} />);
    await screen.findByText("A song");
    for (const name of ["Shuffle", "Previous track", "Next track", "Repeat"]) {
      expect(screen.getByRole("button", { name }).getAttribute("title")).toBe(
        "coming soon"
      );
    }
  });

  it("steps through Tokkae's songs with previous and next while it's quiet", async () => {
    nowPlaying({ playing: false });
    render(<Player now={null} />);
    expect(await screen.findByText("Tokkae sings for you")).toBeDefined();

    const next = screen.getByRole("button", { name: "Next song" });
    const moods = [];
    for (let i = 0; i < 9; i += 1) {
      fireEvent.click(next);
      moods.push(screen.getByText(/^Tokkae sings /u).textContent);
    }
    expect(moods).toEqual([
      "Tokkae sings with joy",
      "Tokkae sings happily",
      "Tokkae sings with love",
      "Tokkae sings heartbroken",
      "Tokkae sings angrily",
      "Tokkae sings in a rage",
      "Tokkae sings under dark clouds",
      "Tokkae sings through tears",
      "Tokkae sings peacefully",
    ]);

    // Round the end, and back again
    fireEvent.click(next);
    expect(screen.getByText("Tokkae sings for you")).toBeDefined();
    fireEvent.click(screen.getByRole("button", { name: "Previous song" }));
    expect(screen.getByText("Tokkae sings peacefully")).toBeDefined();
  });
});
