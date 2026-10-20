import { beforeEach, describe, expect, it, vi } from "vitest";

/** A fresh module, so no visitor has asked anything yet */
const load = () => import("./rate-limit");

beforeEach(() => {
  vi.resetModules();
});

describe("allowRequest", () => {
  it("lets each visitor ask a few questions a minute, then waits", async () => {
    const { MAX_PER_WINDOW, allowRequest } = await load();
    for (let i = 0; i < MAX_PER_WINDOW; i += 1) {
      expect(allowRequest("a", 1000 + i)).toBe(true);
    }
    expect(allowRequest("a", 2000)).toBe(false);
    // Someone else is counted on their own
    expect(allowRequest("b", 2000)).toBe(true);
    // A minute after their first question, they can ask again
    expect(allowRequest("a", 61_000)).toBe(true);
  });
});
