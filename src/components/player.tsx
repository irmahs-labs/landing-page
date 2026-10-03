"use client";

import { useNowPlaying } from "@/hooks/use-now-playing";

import { WindowDots } from "./icons";
import { SpotifyEmbed } from "./spotify-embed";

/** Spotify's player for whatever I'm listening to; hidden when nothing is playing */
export const Player = () => {
  const { data } = useNowPlaying();
  const track = data && "uri" in data && data.playing ? data : null;

  if (!track) {
    return null;
  }

  return (
    <section aria-label="Now playing on Spotify" className="window player">
      <div className="titlebar small">
        <WindowDots />
        <span className="titlebar-text">now_playing.mp3</span>
        <span className="spacer" />
      </div>
      <div className="player-body">
        <SpotifyEmbed uri={track.uri} />
      </div>
    </section>
  );
};
