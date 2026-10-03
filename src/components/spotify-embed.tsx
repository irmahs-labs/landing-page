"use client";

import { useEffect, useRef } from "react";

// The parts of Spotify's iFrame API we use:
// https://developer.spotify.com/documentation/embeds/references/iframe-api
interface EmbedController {
  addListener: (
    event: "playback_update" | "ready",
    cb: (e: { data?: { isPaused?: boolean } }) => void
  ) => void;
  destroy: () => void;
  loadUri: (uri: string) => void;
  play: () => void;
}

interface IFrameApi {
  createController: (
    el: HTMLElement,
    opts: { height: number; uri: string; width: string },
    cb: (controller: EmbedController) => void
  ) => void;
}

declare global {
  interface Window {
    onSpotifyIframeApiReady?: (api: IFrameApi) => void;
  }
}

const API_SRC = "https://open.spotify.com/embed/iframe-api/v1";
const HEIGHT = 80;

let api: Promise<IFrameApi> | null = null;

/** Loads Spotify's iFrame API once per page */
const loadApi = () => {
  // oxlint-disable-next-line promise/avoid-new -- the API only announces itself through a global callback
  api ??= new Promise((resolve) => {
    window.onSpotifyIframeApiReady = resolve;
    const script = document.createElement("script");
    script.async = true;
    script.src = API_SRC;
    document.body.append(script);
  });
  return api;
};

/**
 * Spotify's embed player for `uri`. When the track changes it loads the new
 * one, and keeps playing if the visitor was already listening.
 */
export const SpotifyEmbed = ({ uri }: { uri: string }) => {
  const host = useRef<HTMLDivElement>(null);
  const controller = useRef<EmbedController | null>(null);
  const latestUri = useRef(uri);
  const loadedUri = useRef<string | null>(null);
  const listening = useRef(false);
  const playWhenReady = useRef(false);

  useEffect(() => {
    const el = host.current;
    if (!el) {
      return;
    }
    let alive = true;
    // createController replaces the element it's given, so hand it a child
    const target = document.createElement("div");
    el.append(target);

    const mount = async () => {
      const iframeApi = await loadApi();
      if (!alive) {
        return;
      }
      const first = latestUri.current;
      iframeApi.createController(
        target,
        { height: HEIGHT, uri: first, width: "100%" },
        (c) => {
          if (!alive) {
            c.destroy();
            return;
          }
          controller.current = c;
          loadedUri.current = first;
          c.addListener("playback_update", (e) => {
            listening.current = e.data?.isPaused === false;
          });
          c.addListener("ready", () => {
            if (playWhenReady.current) {
              playWhenReady.current = false;
              c.play();
            }
          });
          // The track may have changed while the player was loading
          if (latestUri.current !== first) {
            loadedUri.current = latestUri.current;
            c.loadUri(latestUri.current);
          }
        }
      );
    };
    mount();

    return () => {
      alive = false;
      controller.current?.destroy();
      controller.current = null;
      loadedUri.current = null;
      el.replaceChildren();
    };
  }, []);

  // Follow your track changes
  useEffect(() => {
    latestUri.current = uri;
    const c = controller.current;
    if (!c || loadedUri.current === uri) {
      return;
    }
    playWhenReady.current = listening.current;
    loadedUri.current = uri;
    c.loadUri(uri);
  }, [uri]);

  return <div className="spotify-embed" ref={host} />;
};
