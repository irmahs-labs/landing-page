"use client";

import { useNowPlaying } from "@/hooks/use-now-playing";
import { fmtSeconds } from "@/lib/format";

import { WindowDots } from "./icons";

/** What's playing on Spotify right now; `now` drives the progress between polls */
export const Player = ({ now }: { now: Date | null }) => {
  const { data, fetchedAt } = useNowPlaying();
  const track = data && "title" in data ? data : null;

  let pos = 0;
  let dur = 0;
  if (track) {
    dur = Math.floor(track.durationMs / 1000);
    const sincePoll = track.playing && now ? now.getTime() - fetchedAt : 0;
    pos = Math.min(dur, Math.floor((track.progressMs + sincePoll) / 1000));
  }

  let state = " is-idle";
  if (track) {
    state = track.playing ? "" : " is-paused";
  }

  return (
    <section
      aria-label="Now playing on Spotify"
      className={`window player${state}`}
    >
      <div className="titlebar small">
        <WindowDots />
        <span className="titlebar-text">now_playing.mp3</span>
        <span className="spacer" />
      </div>
      {track ? (
        <div className="player-body">
          <a
            className="track"
            href={track.url ?? "https://open.spotify.com"}
            rel="noreferrer"
            target="_blank"
            title="Open in Spotify"
          >
            <span className="track-title">{track.title}</span>
            <span className="track-artist">{track.artist ?? ""}</span>
          </a>
          <div className="progress">
            <span>{fmtSeconds(pos)}</span>
            <div className="bar">
              <div
                className="bar-fill stripes"
                style={{
                  width: `${dur ? ((pos / dur) * 100).toFixed(1) : 0}%`,
                }}
              />
            </div>
            <span>{fmtSeconds(dur)}</span>
          </div>
        </div>
      ) : (
        <div className="player-body">
          <div className="track">
            <span className="track-title">Nothing playing</span>
            <span className="track-artist">Spotify is quiet</span>
          </div>
          <div aria-hidden="true" className="progress">
            <div className="bar">
              <div className="bar-fill stripes" />
            </div>
          </div>
        </div>
      )}
    </section>
  );
};
