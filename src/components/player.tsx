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

  return (
    <section
      aria-label="Now playing on Spotify"
      className={`window player${track?.playing ? "" : " is-paused"}`}
    >
      <div className="titlebar small">
        <WindowDots />
        <span className="titlebar-text">now_playing.mp3</span>
        <span className="spacer" />
      </div>
      <div className="player-body">
        <div aria-hidden="true" className="eq-box">
          <span className="eq" />
          <span className="eq" />
          <span className="eq" />
          <span className="eq" />
        </div>
        <a
          className="track"
          href={track ? (track.url ?? "https://open.spotify.com") : undefined}
          rel="noreferrer"
          target="_blank"
          title="Open in Spotify"
        >
          <span className="track-title">
            {track ? track.title : "Nothing playing"}
          </span>
          <span className="track-artist">
            {track ? (track.artist ?? "") : "Spotify is quiet"}
          </span>
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
        <label className="volume">
          <svg
            aria-hidden="true"
            fill="none"
            height="20"
            stroke="currentColor"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            viewBox="0 0 24 24"
            width="20"
          >
            <path d="M4 9 H8 L13 5 V19 L8 15 H4 Z M16 9 C17.5 10.5 17.5 13.5 16 15 M18.5 6.5 C21.5 9.5 21.5 14.5 18.5 17.5" />
          </svg>
          <input
            aria-label="Volume"
            defaultValue={70}
            max={100}
            min={0}
            type="range"
          />
        </label>
      </div>
    </section>
  );
};
