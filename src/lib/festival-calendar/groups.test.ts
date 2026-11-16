import { describe, expect, it } from "vitest";

import { FESTIVALS } from "./festivals";
import {
  CALENDARS,
  DEFAULT_CALENDARS,
  calendarsFrom,
  flagOf,
  toggleCalendar,
} from "./groups";

describe("the calendars", () => {
  it("offers every festival group, and the Moon", () => {
    const ids = new Set(CALENDARS.map((calendar) => calendar.id));

    expect(ids.has("moon")).toBe(true);

    for (const festival of FESTIVALS) {
      expect(ids.has(festival.group)).toBe(true);
    }
  });

  it("starts with the Moon, and reads back what was added", () => {
    expect(calendarsFrom(null)).toEqual(DEFAULT_CALENDARS);
    expect(calendarsFrom(JSON.stringify(["moon", "islamic"]))).toEqual([
      "moon",
      "islamic",
    ]);
  });

  it("drops what it doesn't know, and falls back on anything unreadable", () => {
    expect(calendarsFrom(JSON.stringify(["jewish", "atlantis"]))).toEqual([
      "jewish",
    ]);
    expect(calendarsFrom("{not json")).toEqual(DEFAULT_CALENDARS);
    expect(calendarsFrom(JSON.stringify({ calendars: ["moon"] }))).toEqual(
      DEFAULT_CALENDARS
    );
  });

  it("adds and removes, keeping the offered order", () => {
    expect(toggleCalendar(["moon"], "africa")).toEqual(["moon", "africa"]);
    expect(toggleCalendar(["africa"], "moon")).toEqual(["moon", "africa"]);
    expect(toggleCalendar(["moon", "africa"], "moon")).toEqual(["africa"]);
  });

  it("draws a flag from a country code", () => {
    expect(flagOf("KH")).toBe("🇰🇭");
    expect(flagOf("MX")).toBe("🇲🇽");
  });
});
