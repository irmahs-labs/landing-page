"use client";

import { useEffect, useState } from "react";

// Matches the opening animation in globals.css
const OPEN_MS = 1600;

/**
 * Theme-coloured stage curtains over the page. Tapping them draws them apart,
 * and that tap is also what lets the browser start the music.
 */
export const Curtain = ({ onOpen }: { onOpen: () => void }) => {
  const [opening, setOpening] = useState(false);
  const [gone, setGone] = useState(false);

  useEffect(() => {
    if (!opening) {
      return;
    }
    const t = setTimeout(() => setGone(true), OPEN_MS);
    return () => clearTimeout(t);
  }, [opening]);

  if (gone) {
    return null;
  }

  const open = () => {
    if (opening) {
      return;
    }
    setOpening(true);
    onOpen();
  };

  return (
    <div className={`curtain${opening ? " is-opening" : ""}`}>
      <div aria-hidden="true" className="drape drape-left" />
      <div aria-hidden="true" className="drape drape-right" />
      <div aria-hidden="true" className="valance" />
      {/* The whole curtain is the button, so a tap anywhere opens it */}
      <button
        className="btn curtain-open"
        disabled={opening}
        onClick={open}
        type="button"
      >
        <span className="panel curtain-label">tap to open</span>
      </button>
    </div>
  );
};
