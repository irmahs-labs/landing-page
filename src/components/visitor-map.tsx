import { useEffect, useState } from "react";

import { countryName, fmtShare, loadWorldMap, shadeOf } from "@/lib/visitors";
import type { VisitorCountry } from "@/lib/visitors";

type World = Awaited<ReturnType<typeof loadWorldMap>>;

/**
 * The world, with the week's top countries shaded deeper the more requests
 * came from them; pointing at one names it. The list under it says the same
 * for screen readers. The map's paths are loaded only when it first shows,
 * so nobody but an admin downloads them.
 */
export const VisitorMap = ({ countries }: { countries: VisitorCountry[] }) => {
  const [world, setWorld] = useState<World | null>(null);

  useEffect(() => {
    let alive = true;

    const load = async () => {
      try {
        const loaded = await loadWorldMap();

        if (alive) {
          setWorld(loaded);
        }
      } catch {
        // Without the map, the list of countries still says it all
      }
    };

    load();

    return () => {
      alive = false;
    };
  }, []);

  const top = countries[0]?.share ?? 0;
  const byCode = new Map(countries.map((c) => [c.code, c.share]));

  return (
    <svg
      aria-hidden="true"
      className="visitor-map"
      viewBox={world?.WORLD_VIEWBOX ?? "0 0 800 400"}
    >
      {world?.WORLD.map(([code, d], i) => {
        const share = byCode.get(code);

        return (
          <path
            className={
              share === undefined
                ? "visitor-map__land"
                : `visitor-map__land visitor-map__land--${shadeOf(share, top)}`
            }
            d={d}
            // Some countries have more than one shape, and the list never changes order
            // oxlint-disable-next-line react/no-array-index-key -- see above
            key={`${code}-${i}`}
          >
            {share === undefined ? null : (
              <title>{`${countryName(code)} · ${fmtShare(share)}`}</title>
            )}
          </path>
        );
      })}
    </svg>
  );
};
