import { act, renderHook } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";

import {
  chooseLanguage,
  restoreLanguage,
  savedLanguage,
  useLanguage,
} from "./language";

afterEach(() => {
  act(() => chooseLanguage("en"));
  localStorage.clear();
  document.documentElement.lang = "";
});

describe("language", () => {
  it("is English until a visitor picks", () => {
    expect(savedLanguage()).toBeNull();
    const { result } = renderHook(() => useLanguage());
    expect(result.current).toBe("en");
  });

  it("switches the page, remembers the choice and labels <html>", () => {
    const { result } = renderHook(() => useLanguage());
    act(() => chooseLanguage("fr"));
    expect(result.current).toBe("fr");
    expect(localStorage.getItem("lang")).toBe("fr");
    expect(document.documentElement.lang).toBe("fr");
    expect(savedLanguage()).toBe("fr");
  });

  it("puts the language back on <html> once in the browser", () => {
    act(() => chooseLanguage("fr"));
    document.documentElement.lang = "en";
    restoreLanguage();
    expect(document.documentElement.lang).toBe("fr");
  });

  it("only writes the shared cookie on irmahs.dev", () => {
    act(() => chooseLanguage("fr"));
    // jsdom runs on localhost, where a cookie for irmahs.dev can't be set
    expect(document.cookie).not.toContain("lang=");
  });
});
