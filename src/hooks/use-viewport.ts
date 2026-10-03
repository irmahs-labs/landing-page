import { useSyncExternalStore } from "react";

const subscribe = (onChange: () => void) => {
  window.addEventListener("resize", onChange);
  return () => window.removeEventListener("resize", onChange);
};

let last = { h: 0, w: 0 };
const snapshot = () => {
  if (last.w !== window.innerWidth || last.h !== window.innerHeight) {
    last = { h: window.innerHeight, w: window.innerWidth };
  }
  return last;
};
const serverSnapshot = () => null;

/** Window size, or null while rendering on the server */
export const useViewport = () =>
  useSyncExternalStore(subscribe, snapshot, serverSnapshot);
