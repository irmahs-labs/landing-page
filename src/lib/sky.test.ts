import { describe, expect, it } from "vitest";

import { CITIES } from "./cities";
import { skyPhase } from "./sky";

const { paris } = CITIES;

describe("skyPhase", () => {
  it("has the sun up at midday in Paris in June", () => {
    const sky = skyPhase(paris, new Date("2026-06-21T12:00:00+02:00"));
    expect(sky.isDay).toBe(true);
    expect(sky.deep).toBe(0);
    expect(sky.prog).toBeGreaterThan(0.3);
    expect(sky.prog).toBeLessThan(0.7);
  });

  it("has it dark and deep at midnight", () => {
    const sky = skyPhase(paris, new Date("2026-06-21T00:30:00+02:00"));
    expect(sky.isDay).toBe(false);
    expect(sky.deep).toBe(1);
    expect(sky.twilight).toBe(0);
  });

  it("puts a June sunrise in Paris around six and sunset around ten", () => {
    const sky = skyPhase(paris, new Date("2026-06-21T12:00:00+02:00"));
    expect(sky.riseM).toBeGreaterThan(5 * 60);
    expect(sky.riseM).toBeLessThan(6 * 60 + 30);
    expect(sky.setM).toBeGreaterThan(21 * 60 + 30);
    expect(sky.setM).toBeLessThan(22 * 60 + 30);
  });

  it("glows at full twilight right at sunset", () => {
    const noon = skyPhase(paris, new Date("2026-06-21T12:00:00+02:00"));
    const h = Math.floor(noon.setM / 60);
    const m = noon.setM % 60;
    const at = `2026-06-21T${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}:00+02:00`;
    expect(skyPhase(paris, new Date(at)).twilight).toBeGreaterThan(0.9);
  });

  it("keeps progress between 0 and 1 all day", () => {
    for (let h = 0; h < 24; h += 1) {
      const at = `2026-01-15T${String(h).padStart(2, "0")}:00:00+07:00`;
      const { prog } = skyPhase(CITIES["phnom-penh"], new Date(at));
      expect(prog).toBeGreaterThanOrEqual(0);
      expect(prog).toBeLessThanOrEqual(1);
    }
  });
});
