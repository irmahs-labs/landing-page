import { useEffect, useState } from "react";

import type { VisitorStats } from "@/lib/visitors";

const POLL_MS = 60_000;

export type VisitorsState =
  | { status: "loading" }
  /** Not an admin: the profile shows without the numbers */
  | { status: "denied" }
  | { status: "failed" }
  | { stats: VisitorStats; status: "ready" };

/**
 * The visitor numbers from /api/visitors while `open`, refreshed every
 * minute. The server answers only an admin; anyone else is "denied".
 */
export const useVisitors = (open: boolean) => {
  const [state, setState] = useState<VisitorsState>({ status: "loading" });

  useEffect(() => {
    if (!open) {
      return;
    }

    let alive = true;
    // Not an admin now means not an admin a minute from now: no more asking
    let denied = false;

    const load = async () => {
      if (denied) {
        return;
      }

      let next: VisitorsState;

      try {
        const res = await fetch("/api/visitors", { cache: "no-store" });

        if (res.status === 403) {
          next = { status: "denied" };
          denied = true;
        } else if (res.ok) {
          // SAFETY: our own /api/visitors answers a VisitorStats on 200
          next = { stats: (await res.json()) as VisitorStats, status: "ready" };
        } else {
          next = { status: "failed" };
        }
      } catch {
        next = { status: "failed" };
      }

      if (alive) {
        // Once the numbers are in, a failed refresh keeps showing them
        setState((prev) =>
          next.status === "failed" && prev.status === "ready" ? prev : next
        );
      }
    };

    load();
    const id = setInterval(load, POLL_MS);

    return () => {
      alive = false;
      clearInterval(id);
    };
  }, [open]);

  return state;
};
