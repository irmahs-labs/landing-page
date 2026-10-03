import { useSyncExternalStore } from "react";

const subscribe = (onTick: () => void) => {
  const id = setInterval(onTick, 1000);
  return () => clearInterval(id);
};

// Whole seconds, so the snapshot only changes once per tick
const snapshot = () => Math.floor(Date.now() / 1000);
const serverSnapshot = () => null;

/** The current time, ticking every second; null while rendering on the server */
export const useNow = () => {
  const seconds = useSyncExternalStore(subscribe, snapshot, serverSnapshot);
  return seconds === null ? null : new Date(seconds * 1000);
};
