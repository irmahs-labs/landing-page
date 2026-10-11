import { describe, expect, it, vi } from "vitest";

import { store } from "./storage";

describe("store", () => {
  it("keeps choices in localStorage", () => {
    store.set("city", "paris");
    expect(store.get("city")).toBe("paris");
    expect(store.get("nothing")).toBeNull();
  });

  it("shrugs when storage is blocked", () => {
    vi.spyOn(Storage.prototype, "getItem").mockImplementation(() => {
      throw new Error("blocked");
    });
    vi.spyOn(Storage.prototype, "setItem").mockImplementation(() => {
      throw new Error("blocked");
    });
    expect(() => store.set("city", "paris")).not.toThrow();
    expect(store.get("city")).toBeNull();
  });
});
