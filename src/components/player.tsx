"use client";

import { useNowPlaying } from "@/hooks/use-now-playing";

import { WindowDots } from "./icons";
import { SpotifyEmbed } from "./spotify-embed";

/** Spotify's player for whatever I'm listening to, or our own idle player when nothing is */
export const Player = () => {
  const { data } = useNowPlaying();
  const track = data && "uri" in data && data.playing ? data : null;

  return (
    <section aria-label="Now playing on Spotify" className="window player">
      <div className="titlebar small">
        <WindowDots />
        <span className="titlebar-text">now_playing.mp3</span>
        <span className="spacer" />
      </div>
      {track ? (
        <div className="player-body">
          <SpotifyEmbed uri={track.uri} />
        </div>
      ) : (
        <div className="player-idle">
          <div aria-hidden="true" className="eq-box">
            <span className="eq" />
            <span className="eq" />
            <span className="eq" />
            <span className="eq" />
          </div>
          <div className="track">
            <span className="track-title">Nothing playing</span>
            <span className="track-artist">Spotify is quiet</span>
          </div>
          <div aria-hidden="true" className="loader" />
        </div>
      )}
    </section>
  );
};
