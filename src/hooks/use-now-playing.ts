import { useEffect, useRef, useState } from "react";

import type { NowPlaying } from "@/lib/spotify";

const POLL_MS = 15_000;

export interface NowPlayingState {
  data: NowPlaying | null;
  /** When Spotify last answered; 0 until it first has */
  fetchedAt: number;
}

/**
 * What's playing on Spotify: asked once when the page opens, then every
 * 15 s while `active` (the player is showing). Switching away keeps the last
 * answer, so the player comes back with it at once, and asks again if it is
 * older than a poll.
 */
export const useNowPlaying = (active: boolean): NowPlayingState => {
  const [state, setState] = useState<NowPlayingState>({
    data: null,
    fetchedAt: 0,
  });

  const last = useRef(0);

  useEffect(() => {
    let alive = true;

    const load = async () => {
      let data: NowPlaying | null = null;

      try {
        const res = await fetch("/api/now-playing", { cache: "no-store" });
        // SAFETY: our own /api/now-playing route always responds with a NowPlaying
        data = res.ok ? ((await res.json()) as NowPlaying) : null;
      } catch {
        data = null;
      }

      if (alive) {
        last.current = Date.now();
        setState({ data, fetchedAt: last.current });
      }
    };

    if (
      last.current === 0 ||
      (active && Date.now() - last.current >= POLL_MS)
    ) {
      void load();
    }

    const id = active ? setInterval(load, POLL_MS) : undefined;

    return () => {
      alive = false;
      clearInterval(id);
    };
  }, [active]);

  return state;
};
