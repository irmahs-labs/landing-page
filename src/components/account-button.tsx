import { useEffect, useRef, useState } from "react";
import type { CSSProperties } from "react";

import { useSession } from "@/hooks/use-session";
import { AUTH_URL, signInUrl } from "@/lib/auth";

import { AccountWindow, Avatar } from "./account-window";

// Google's own four-colour mark: never recoloured or redrawn
const GoogleMark = () => (
  <svg aria-hidden="true" height="16" viewBox="0 0 48 48" width="16">
    <path
      d="M43.6 20.5H42V20H24v8h11.3C33.7 32.7 29.2 36 24 36c-6.6 0-12-5.4-12-12s5.4-12 12-12c3.1 0 5.8 1.2 7.9 3.1l5.7-5.7C34 6.1 29.3 4 24 4 13 4 4 13 4 24s9 20 20 20 20-9 20-20c0-1.3-.1-2.4-.4-3.5z"
      fill="#FFC107"
    />
    <path
      d="M6.3 14.7l6.6 4.8C14.7 15.1 19 12 24 12c3.1 0 5.8 1.2 7.9 3.1l5.7-5.7C34 6.1 29.3 4 24 4 16.3 4 9.7 8.3 6.3 14.7z"
      fill="#FF3D00"
    />
    <path
      d="M24 44c5.2 0 9.9-2 13.4-5.2l-6.2-5.2C29.2 35.1 26.7 36 24 36c-5.2 0-9.6-3.3-11.3-7.9l-6.5 5C9.5 39.6 16.2 44 24 44z"
      fill="#4CAF50"
    />
    <path
      d="M43.6 20.5H42V20H24v8h11.3c-.8 2.2-2.2 4.2-4.1 5.6l6.2 5.2C37 39.2 44 34 44 24c0-1.3-.1-2.4-.4-3.5z"
      fill="#1976D2"
    />
  </svg>
);

/** Ends the session on the account service, then starts the page afresh */
const signOut = async () => {
  try {
    await fetch(`${AUTH_URL}/api/auth/sign-out`, {
      body: "{}",
      credentials: "include",
      headers: { "content-type": "application/json" },
      method: "POST",
    });
  } finally {
    window.location.reload();
  }
};

/**
 * Cute Matcha's AccountButton, as a header pill: "sign in" with Google's
 * mark, which opens the IrmaHS Labs account page to sign in and comes back
 * here; or once signed in, your picture and first name, which opens
 * profile.txt on top of the desk. Escape or a click outside closes it.
 */
export const AccountButton = () => {
  const user = useSession();
  const [open, setOpen] = useState(false);
  // How far the pop-up moves left on a phone to sit inside the page's gutters
  const [shift, setShift] = useState(0);
  const menu = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) {
      return;
    }

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setOpen(false);
      }
    };

    const onPointer = (e: PointerEvent) => {
      // SAFETY: a pointer event's target is always a DOM node
      if (!menu.current?.contains(e.target as Node)) {
        setOpen(false);
      }
    };

    document.addEventListener("keydown", onKey);
    document.addEventListener("pointerdown", onPointer);

    return () => {
      document.removeEventListener("keydown", onKey);
      document.removeEventListener("pointerdown", onPointer);
    };
  }, [open]);

  // Nothing until the answer arrives, so the button never flickers between
  // states. The answer only comes in the browser, so `window` is there below.
  if (user === undefined) {
    return null;
  }

  if (user === null) {
    return (
      <a
        className="account"
        href={signInUrl(window.location.href)}
        title="sign in with Google"
      >
        <span className="account__icon">
          <GoogleMark />
        </span>
        <span className="account__text">sign in</span>
      </a>
    );
  }

  const firstName = user.name.split(" ")[0] || user.email;

  const toggle = () => {
    setShift(16 - (menu.current?.getBoundingClientRect().left ?? 16));
    setOpen((was) => !was);
  };

  return (
    <div
      className="account-menu"
      ref={menu}
      // SAFETY: CSSProperties has no index signature for custom properties
      style={{ "--account-shift": `${shift}px` } as CSSProperties}
    >
      <button
        aria-expanded={open}
        aria-haspopup="dialog"
        className="account"
        onClick={toggle}
        title={`Signed in as ${user.email}`}
        type="button"
      >
        <Avatar user={user} />
        <span className="account__text">{firstName}</span>
      </button>
      {open ? <AccountWindow onSignOut={signOut} user={user} /> : null}
    </div>
  );
};
