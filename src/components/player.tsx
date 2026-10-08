"use client";

import { useNowPlaying } from "@/hooks/use-now-playing";
import { fmtSeconds } from "@/lib/format";

import { Window } from "./window";

const ICONS = {
  heart:
    "M12 20 C12 20 3.5 14.5 3.5 8.8 A4.3 4.3 0 0 1 12 7 A4.3 4.3 0 0 1 20.5 8.8 C20.5 14.5 12 20 12 20 Z",
  next: "M6 6 L15 12 L6 18 Z M18 6 V18",
  pause: "M9 6 V18 M15 6 V18",
  play: "M8 5.5 L18.5 12 L8 18.5 Z",
  prev: "M18 6 L9 12 L18 18 Z M6 6 V18",
  repeat:
    "M4 11 V9 A3 3 0 0 1 7 6 H19 M16 3 L19 6 L16 9 M20 13 V15 A3 3 0 0 1 17 18 H5 M8 21 L5 18 L8 15",
  shuffle:
    "M3 7 H7 C11 7 13 17 17 17 H21 M18 14 L21 17 L18 20 M3 17 H7 C8.5 17 9.6 15.6 10.6 14 M13.4 10 C14.4 8.4 15.5 7 17 7 H21 M18 4 L21 7 L18 10",
  volume: "M4 9 H8 L13 5 V19 L8 15 H4 Z M16 9 C17.5 10.5 17.5 13.5 16 15",
};

// The controls are for show for now: they press, but don't change playback
const SOON = "coming soon";

const Icon = ({ d, filled }: { d: string; filled?: boolean }) => (
  <svg
    aria-hidden="true"
    className={filled ? "is-filled" : undefined}
    viewBox="0 0 24 24"
  >
    <path d={d} />
  </svg>
);

/** A control button that presses but does nothing yet */
const Control = ({
  className = "btn ctl",
  d,
  filled,
  label,
}: {
  className?: string;
  d: string;
  filled?: boolean;
  label: string;
}) => (
  <button aria-label={label} className={className} title={SOON} type="button">
    <Icon d={d} filled={filled} />
  </button>
);

const Controls = ({ playing }: { playing: boolean }) => (
  <div className="controls">
    <Control d={ICONS.shuffle} label="Shuffle" />
    <Control d={ICONS.prev} filled label="Previous track" />
    <Control
      className="btn ctl ctl-main"
      d={playing ? ICONS.pause : ICONS.play}
      filled={!playing}
      label={playing ? "Pause" : "Play"}
    />
    <Control d={ICONS.next} filled label="Next track" />
    <Control d={ICONS.repeat} label="Repeat" />
  </div>
);

const Record = () => (
  <svg aria-hidden="true" className="record" viewBox="0 0 24 24">
    <circle cx="12" cy="12" r="9.5" />
    <circle className="record-label" cx="12" cy="12" r="3" />
    <circle className="record-hole" cx="12" cy="12" r="0.6" />
  </svg>
);

/** The album cover, or a record when there is none; links to the song if any */
const Cover = ({
  image,
  url,
}: {
  image: string | null;
  url: string | null;
}) => {
  const inside = (
    <>
      {image ? (
        // Spotify's image host is remote and the cover is small, so plain imgs:
        // the whole cover, over a blurred copy filling the rest of the box
        <>
          {/* oxlint-disable-next-line next/no-img-element -- remote album cover, sized by CSS */}
          <img alt="" className="cover-blur" src={image} />
          {/* oxlint-disable-next-line next/no-img-element -- remote album cover, sized by CSS */}
          <img alt="" src={image} />
        </>
      ) : (
        <Record />
      )}
      <span aria-hidden="true" className="eq">
        <i />
        <i />
        <i />
      </span>
    </>
  );
  if (!url) {
    return <div className="cover">{inside}</div>;
  }
  // The title beside it is the accessible link, so this one stays out of the tab order
  return (
    <a
      aria-hidden="true"
      className="cover"
      href={url}
      rel="noreferrer"
      tabIndex={-1}
      target="_blank"
    >
      {inside}
    </a>
  );
};

/**
 * What's playing on Spotify right now; `now` drives the progress between
 * polls. The cover and the title open the song on Spotify in a new tab.
 */
export const Player = ({ now }: { now: Date | null }) => {
  const { data, fetchedAt } = useNowPlaying();
  const track = data && "title" in data ? data : null;
  const playing = Boolean(track?.playing);
  const url = track ? (track.url ?? "https://open.spotify.com") : null;

  let pos = 0;
  let dur = 0;
  if (track) {
    dur = Math.floor(track.durationMs / 1000);
    const sincePoll = playing && now ? now.getTime() - fetchedAt : 0;
    pos = Math.min(dur, Math.floor((track.progressMs + sincePoll) / 1000));
  }

  let state = " is-idle";
  if (track) {
    state = playing ? "" : " is-paused";
  }

  return (
    <Window
      className={`player-window${state}`}
      label="Now playing on Spotify"
      title="now_playing.mp3"
    >
      <div className="player-body">
        <Cover image={track?.image ?? null} url={url} />

        <div className="track-row">
          {track && url ? (
            <a
              className="track"
              href={url}
              rel="noreferrer"
              target="_blank"
              title="Open in Spotify"
            >
              <span className="track-title">{track.title}</span>
              <span className="track-artist">{track.artist ?? ""}</span>
            </a>
          ) : (
            <div className="track">
              <span className="track-title">Nothing playing</span>
              <span className="track-artist">Spotify is quiet</span>
            </div>
          )}
          <Control className="btn ctl like" d={ICONS.heart} label="Like" />
        </div>

        <div className="progress">
          <div className="bar">
            <div
              className="bar-fill stripes"
              style={
                track
                  ? { width: `${dur ? ((pos / dur) * 100).toFixed(1) : 0}%` }
                  : undefined
              }
            />
          </div>
          <div className="times">
            <span>{track ? fmtSeconds(pos) : "-:--"}</span>
            <span>{track ? fmtSeconds(dur) : "-:--"}</span>
          </div>
        </div>

        <Controls playing={playing} />

        <label className="volume" title={SOON}>
          <Icon d={ICONS.volume} />
          <span className="sr-only">Volume</span>
          <input defaultValue={70} max={100} min={0} type="range" />
        </label>
      </div>
    </Window>
  );
};
