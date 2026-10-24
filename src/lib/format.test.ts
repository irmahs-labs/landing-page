import { describe, expect, it, vi } from "vitest";

import { fmtMinutes, fmtSeconds, fmtSize, pct, rand } from "./format";

describe("fmtMinutes", () => {
  it("writes minutes since midnight as HH:MM", () => {
    expect(fmtMinutes(0)).toBe("00:00");
    expect(fmtMinutes(7 * 60 + 5)).toBe("07:05");
    expect(fmtMinutes(23 * 60 + 59)).toBe("23:59");
  });
});

describe("fmtSize", () => {
  it("writes a file's size in KB, then in MB", () => {
    expect(fmtSize(200)).toBe("1 KB");
    expect(fmtSize(112_640)).toBe("110 KB");
    expect(fmtSize(1_258_291)).toBe("1.2 MB");
  });
});

describe("fmtSeconds", () => {
  it("writes seconds as M:SS", () => {
    expect(fmtSeconds(0)).toBe("0:00");
    expect(fmtSeconds(65)).toBe("1:05");
    expect(fmtSeconds(3 * 60 + 41)).toBe("3:41");
  });
});

describe("pct", () => {
  it("turns a px position on the design canvas into a percentage", () => {
    expect(pct(720, 1440)).toBe("50.00%");
    expect(pct(1, 3)).toBe("33.33%");
  });
});

describe("rand", () => {
  it("stays between its bounds", () => {
    vi.spyOn(Math, "random").mockReturnValueOnce(0).mockReturnValueOnce(0.999);
    expect(rand(10, 20)).toBe(10);
    expect(rand(10, 20)).toBeCloseTo(19.99);
  });
});
