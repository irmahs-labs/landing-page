import { describe, expect, it } from "vitest";

import { CHANGELOG } from "./changelog";

describe("CHANGELOG", () => {
  it("has an entry for Tokkae to announce", () => {
    expect(CHANGELOG[0]?.changes.length).toBeGreaterThan(0);
  });

  it("lists releases newest first, with real ISO dates", () => {
    const dates = CHANGELOG.map((entry) => entry.date);

    for (const date of dates) {
      expect(date).toMatch(/^\d{4}-\d{2}-\d{2}$/u);
      expect(Number.isNaN(Date.parse(date))).toBe(false);
    }

    expect(dates.toSorted().toReversed()).toEqual(dates);
  });

  it("speaks in Tokkae's lowercase voice", () => {
    for (const entry of CHANGELOG) {
      for (const line of [entry.title, ...entry.changes]) {
        expect(line).toBe(line.toLowerCase());
      }
    }
  });
});
