import { useEffect, useState } from "react";

import { AUTH_URL } from "@/lib/auth";
import type { SessionUser } from "@/lib/auth";

/**
 * Who is signed in, asked once of the account service. The session cookie is
 * set for every *.irmahs.dev site, so the browser sends it along.
 * `undefined` while asking, `null` when nobody is signed in.
 */
export const useSession = () => {
  const [user, setUser] = useState<SessionUser | null | undefined>();

  useEffect(() => {
    let alive = true;
    const load = async () => {
      let next: SessionUser | null = null;
      try {
        const res = await fetch(`${AUTH_URL}/api/auth/get-session`, {
          cache: "no-store",
          credentials: "include",
        });
        // SAFETY: Better Auth's get-session answers null or { user, session }
        const body = res.ok
          ? ((await res.json()) as { user?: SessionUser } | null)
          : null;
        next = body?.user ?? null;
      } catch {
        next = null;
      }
      if (alive) {
        setUser(next);
      }
    };
    load();
    return () => {
      alive = false;
    };
  }, []);

  return user;
};
