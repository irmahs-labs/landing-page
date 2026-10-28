import { describe, expect, it } from "vitest";

import { countryName, dayLabel, fmtShare, shadeOf } from "./visitors";

describe("countryName", () => {
  it("names countries, Tor and the unknown", () => {
    expect(countryName("FR")).toBe("France");
    expect(countryName("NL")).toBe("Netherlands");
    expect(countryName("T1")).toBe("Tor");
    expect(countryName("XX")).toBe("Unknown");
    expect(countryName("not a code")).toBe("not a code");
  });
});

describe("dayLabel", () => {
  it("names the weekday, in UTC as Cloudflare counts days, and today as today", () => {
    expect(dayLabel("2026-10-26", false)).toBe("Mon");
    expect(dayLabel("2026-10-28", true)).toBe("today");
  });
});

describe("shadeOf", () => {
  it("shades a country deeper the closer it comes to the top one", () => {
    expect(shadeOf(0.4, 0.4)).toBe(3);
    expect(shadeOf(0.2, 0.4)).toBe(2);
    expect(shadeOf(0.05, 0.4)).toBe(1);
  });
});

describe("fmtShare", () => {
  it("rounds to a whole percentage, never down to nothing", () => {
    expect(fmtShare(0.344)).toBe("34%");
    expect(fmtShare(0.001)).toBe("1%");
  });
});
