import { useEffect, useState } from "react";

import type { Deploys } from "@/lib/deploys";

/** When each app was last deployed, fetched once; empty until it arrives */
export const useAppDeploys = () => {
  const [deploys, setDeploys] = useState<Deploys>({});

  useEffect(() => {
    let alive = true;

    const load = async () => {
      try {
        const res = await fetch("/api/app-deploys");

        if (res.ok && alive) {
          // SAFETY: our own /api/app-deploys route always responds with Deploys
          setDeploys((await res.json()) as Deploys);
        }
      } catch {
        // No dates, then: the tiles simply go without
      }
    };

    load();

    return () => {
      alive = false;
    };
  }, []);

  return deploys;
};
