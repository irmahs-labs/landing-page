import { useEffect, useState } from "react";

const PING_MS = 30_000;

const ping = async (method: "DELETE" | "POST") => {
  // keepalive lets the last one leave even as the page closes
  const res = await fetch("/api/presence", {
    cache: "no-store",
    keepalive: method === "DELETE",
    method,
  });

  // SAFETY: /api/presence answers { online } on 200 and 429
  return res.ok || res.status === 429
    ? ((await res.json()) as { online: number }).online
    : null;
};

/**
 * Tells the server this visitor is here, every 30 s while the tab is open
 * and visible, and that they've gone when it's hidden or closed. Answers how
 * many are online, null until the first answer.
 */
export const usePresence = () => {
  const [online, setOnline] = useState<number | null>(null);

  useEffect(() => {
    let alive = true;
    let timer: ReturnType<typeof setInterval> | undefined;

    const here = async () => {
      try {
        const next = await ping("POST");

        if (alive && next !== null) {
          setOnline(next);
        }
      } catch {
        // Offline for a moment: the next ping tries again
      }
    };

    const start = () => {
      clearInterval(timer);
      here();
      timer = setInterval(here, PING_MS);
    };

    const leave = async () => {
      clearInterval(timer);

      try {
        await ping("DELETE");
      } catch {
        // Gone anyway: the server forgets them after ONLINE_MS
      }
    };

    const onVisibility = () => {
      if (document.visibilityState === "visible") {
        start();
      } else {
        leave();
      }
    };

    if (document.visibilityState === "visible") {
      start();
    }

    document.addEventListener("visibilitychange", onVisibility);
    window.addEventListener("pagehide", leave);

    return () => {
      alive = false;
      clearInterval(timer);
      document.removeEventListener("visibilitychange", onVisibility);
      window.removeEventListener("pagehide", leave);
    };
  }, []);

  return online;
};
