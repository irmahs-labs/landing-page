import { useEffect, useState } from "react";

import type { NowPlaying } from "@/lib/spotify";

const POLL_MS = 15_000;

/** What's playing on Spotify, refreshed every 15 s */
export const useNowPlaying = () => {
  const [state, setState] = useState<{
    data: NowPlaying | null;
    fetchedAt: number;
  }>({ data: null, fetchedAt: 0 });

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
        setState({ data, fetchedAt: Date.now() });
      }
    };
    load();
    const id = setInterval(load, POLL_MS);
    return () => {
      alive = false;
      clearInterval(id);
    };
  }, []);

  return state;
};
