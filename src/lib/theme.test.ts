import { act, renderHook } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";

import { chooseTheme, preferredTheme, restoreTheme, useTheme } from "./theme";

/** Pretends the device asks for dark mode, or not */
const deviceDark = (dark: boolean) =>
  vi.stubGlobal("matchMedia", (query: string) => ({
    addEventListener: vi.fn(),
    matches: dark && query.includes("prefers-color-scheme: dark"),
    media: query,
    removeEventListener: vi.fn(),
  }));

const blockStorage = () => {
  vi.spyOn(Storage.prototype, "getItem").mockImplementation(() => {
    throw new Error("blocked");
  });
  vi.spyOn(Storage.prototype, "setItem").mockImplementation(() => {
    throw new Error("blocked");
  });
};

afterEach(() => {
  delete document.documentElement.dataset.theme;
});

describe("preferredTheme", () => {
  it("follows the device while nothing is saved", () => {
    deviceDark(true);
    expect(preferredTheme()).toBe("dark");
    deviceDark(false);
    expect(preferredTheme()).toBe("light");
  });

  it("puts the saved choice before the device", () => {
    deviceDark(true);
    localStorage.setItem("theme", "light");
    expect(preferredTheme()).toBe("light");
  });

  it("ignores a saved value that isn't a theme", () => {
    deviceDark(true);
    localStorage.setItem("theme", "sepia");
    expect(preferredTheme()).toBe("dark");
  });

  it("follows the device when storage is blocked", () => {
    deviceDark(true);
    blockStorage();
    expect(preferredTheme()).toBe("dark");
  });
});

describe("chooseTheme", () => {
  it("switches the page and saves the choice", () => {
    chooseTheme("dark");
    expect(document.documentElement.dataset.theme).toBe("dark");
    expect(localStorage.getItem("theme")).toBe("dark");
  });

  it("still switches the page when storage is blocked", () => {
    blockStorage();
    expect(() => chooseTheme("dark")).not.toThrow();
    expect(document.documentElement.dataset.theme).toBe("dark");
  });
});

describe("restoreTheme", () => {
  it("puts back a theme that went missing from the page", () => {
    localStorage.setItem("theme", "dark");
    restoreTheme();
    expect(document.documentElement.dataset.theme).toBe("dark");
  });

  it("leaves the page's theme alone when it has one", () => {
    document.documentElement.dataset.theme = "light";
    localStorage.setItem("theme", "dark");
    restoreTheme();
    expect(document.documentElement.dataset.theme).toBe("light");
  });
});

describe("useTheme", () => {
  it("reads the page's theme and follows a new choice", () => {
    document.documentElement.dataset.theme = "dark";
    const { result } = renderHook(() => useTheme());
    expect(result.current).toBe("dark");

    act(() => chooseTheme("light"));
    expect(result.current).toBe("light");
  });
});
