import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import { BASE_THEME, THEME_ORDER, THEMES } from "@/lib/themes";

import { ThemePicker } from "./theme-picker";

const props = () => ({
  current: THEMES[BASE_THEME],
  enabled: false,
  onPick: vi.fn(),
  onToggle: vi.fn(),
});

describe("ThemePicker", () => {
  it("starts off, with no swatches", () => {
    render(<ThemePicker {...props()} />);
    const toggle = screen.getByRole("switch", { name: "Theme variations" });
    expect(toggle.getAttribute("aria-checked")).toBe("false");
    expect(screen.queryAllByRole("button", { name: / theme$/u })).toHaveLength(
      0
    );
  });

  it("asks to switch the variations on", () => {
    const p = props();
    render(<ThemePicker {...p} />);
    fireEvent.click(screen.getByRole("switch"));
    expect(p.onToggle).toHaveBeenCalledOnce();
  });

  it("offers every variation once on, and names the one picked", () => {
    const p = { ...props(), current: THEMES.amelie, enabled: true };
    render(<ThemePicker {...p} />);
    const swatches = screen.getAllByRole("button", { name: / theme$/u });
    expect(swatches).toHaveLength(THEME_ORDER.length);
    expect(screen.getByText(THEMES.amelie.label)).toBeDefined();
    fireEvent.click(
      screen.getByRole("button", { name: `${THEMES.tevy.label} theme` })
    );
    expect(p.onPick).toHaveBeenCalledWith("tevy");
  });

  it("credits Flaticon for the animals and flowers", () => {
    render(<ThemePicker {...props()} enabled />);
    const credit = screen.getByRole("link", { name: /flaticon/u });
    expect(credit.getAttribute("href")).toBe("https://www.flaticon.com");
  });

  it("has no hide button while the variations are off", () => {
    render(<ThemePicker {...props()} />);
    expect(screen.queryByRole("button", { name: /theme colours/u })).toBeNull();
  });

  it("hides the colours, keeping the variation on, and remembers it", () => {
    const { unmount } = render(<ThemePicker {...props()} enabled />);
    const hide = screen.getByRole("button", { name: "Hide theme colours" });
    expect(hide.getAttribute("aria-expanded")).toBe("true");
    fireEvent.click(hide);
    expect(screen.queryAllByRole("button", { name: / theme$/u })).toHaveLength(
      0
    );
    expect(screen.getByRole("switch").getAttribute("aria-checked")).toBe(
      "true"
    );
    expect(localStorage.getItem("themeDrawer")).toBe("hidden");
    unmount();
    render(<ThemePicker {...props()} enabled />);
    const show = screen.getByRole("button", { name: "Show theme colours" });
    expect(show.getAttribute("aria-expanded")).toBe("false");
    fireEvent.click(show);
    expect(screen.getAllByRole("button", { name: / theme$/u })).toHaveLength(
      THEME_ORDER.length
    );
  });
});
