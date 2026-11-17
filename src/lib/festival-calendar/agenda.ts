import type { Occasion } from "./festivals";
import type { MoonDay } from "./sky/moon";

/** One line of the calendar's list: an exact moon phase, or a festival. */
export type AgendaEntry =
  | { kind: "moon"; key: string; moon: MoonDay }
  | { kind: "occasion"; key: string; occasion: Occasion };

/**
 * What the calendar lists from `day` on: what falls on that day first (a
 * festival that began before it included), then what's coming up, in date
 * order, festivals and the Moon's exact phases together. Days are keys
 * ("2026-11-16"), so they sort as text.
 */
export const agendaFrom = (
  day: string,
  occasions: readonly Occasion[],
  moons: readonly MoonDay[]
): AgendaEntry[] => {
  const seen = new Set<string>();

  const festivals = occasions.flatMap((occasion): AgendaEntry[] => {
    const id = `${occasion.festival.id}|${occasion.start}`;

    if (occasion.end < day || seen.has(id)) {
      return [];
    }

    seen.add(id);

    // A festival under way sorts on the day itself
    return [
      {
        key: occasion.start < day ? day : occasion.start,
        kind: "occasion",
        occasion,
      },
    ];
  });

  const phases = moons.flatMap((moon): AgendaEntry[] =>
    moon.exact && moon.key >= day ? [{ key: moon.key, kind: "moon", moon }] : []
  );

  // oxlint-disable-next-line unicorn/no-array-sort -- sorts a fresh array built just above
  return [...festivals, ...phases].sort((a, b) => a.key.localeCompare(b.key));
};
