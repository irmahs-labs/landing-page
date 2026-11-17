import { describe, expect, it } from "vitest";

import { agendaFrom } from "./agenda";
import { FESTIVALS } from "./festivals";
import type { Occasion } from "./festivals";
import type { MoonDay } from "./sky/moon";

const [festival] = FESTIVALS;

const occasion = (start: string, end = start): Occasion => {
  if (!festival) {
    throw new Error("no festivals");
  }

  return { end, festival, start };
};

const moon = (key: string, exact: boolean): MoonDay => ({
  angle: 0,
  day: Number(key.slice(8)),
  exact: exact ? new Date(`${key}T12:00:00Z`) : null,
  key,
  phase: "New Moon",
});

describe("agendaFrom", () => {
  it("lists the day's own first, then what's coming up, in date order", () => {
    const entries = agendaFrom(
      "2026-11-16",
      [
        occasion("2026-11-20"),
        occasion("2026-11-14", "2026-11-17"),
        occasion("2026-11-01"),
      ],
      [
        moon("2026-11-17", true),
        moon("2026-11-18", false),
        moon("2026-11-09", true),
      ]
    );

    expect(entries.map((entry) => [entry.kind, entry.key])).toEqual([
      ["occasion", "2026-11-16"],
      ["moon", "2026-11-17"],
      ["occasion", "2026-11-20"],
    ]);
  });

  it("lists a festival met in two months only once", () => {
    const twice = [
      occasion("2026-12-30", "2027-01-02"),
      occasion("2026-12-30", "2027-01-02"),
    ];

    expect(agendaFrom("2026-12-01", twice, [])).toHaveLength(1);
  });
});
