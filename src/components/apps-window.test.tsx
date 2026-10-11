import { act, fireEvent, render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { APPS } from "@/lib/apps";
import { BASE_THEME, THEMES } from "@/lib/themes";

import { AppsWindow } from "./apps-window";

// jsdom never lays anything out, so the grid's size comes from here
interface Size {
  height: number;
  width: number;
}
let resize: (width: number, height: number) => void = vi.fn();

beforeEach(() => {
  vi.stubGlobal(
    "ResizeObserver",
    class {
      disconnect = vi.fn();
      observe = vi.fn();
      constructor(listener: (entries: { contentRect: Size }[]) => void) {
        resize = (width, height) =>
          act(() => listener([{ contentRect: { height, width } }]));
      }
    }
  );
});

const tiles = () => screen.getAllByRole("link");
const label = () => screen.getByText(/\d+ \/ \d+/u).textContent;

describe("AppsWindow", () => {
  it("opens on one app, with a screenshot", () => {
    render(<AppsWindow theme={THEMES[BASE_THEME]} />);
    expect(tiles()).toHaveLength(1);
    expect(label()).toBe(`1 / ${APPS.length}`);
    expect(tiles()[0]?.querySelector("img")).not.toBeNull();
  });

  it("flips through the apps with the arrows, wrapping round", () => {
    render(<AppsWindow theme={THEMES[BASE_THEME]} />);
    fireEvent.click(screen.getByRole("button", { name: "Next apps" }));
    expect(tiles()[0]?.getAttribute("href")).toBe(APPS[1]?.href);
    fireEvent.click(screen.getByRole("button", { name: "Previous apps" }));
    fireEvent.click(screen.getByRole("button", { name: "Previous apps" }));
    expect(tiles()[0]?.getAttribute("href")).toBe(APPS.at(-1)?.href);
  });

  it("shows 2, 4 or 6 apps as the window grows", () => {
    render(<AppsWindow theme={THEMES[BASE_THEME]} />);
    resize(745, 375);
    expect(tiles()).toHaveLength(1);
    resize(800, 375);
    expect(tiles()).toHaveLength(2);
    resize(800, 500);
    expect(tiles()).toHaveLength(4);
    resize(1200, 500);
    expect(tiles()).toHaveLength(Math.min(6, APPS.length));
  });

  it("stacks two apps in a tall, narrow window", () => {
    render(<AppsWindow theme={THEMES[BASE_THEME]} />);
    resize(400, 500);
    expect(tiles()).toHaveLength(2);
  });

  it("turns off the arrows when every app fits", () => {
    render(<AppsWindow theme={THEMES[BASE_THEME]} />);
    resize(1200, 500);
    expect(label()).toBe("1 / 1");
    expect(screen.getByRole("button", { name: "Next apps" })).toHaveProperty(
      "disabled",
      true
    );
  });

  it("keeps the first app in view when the page size changes", () => {
    render(<AppsWindow theme={THEMES[BASE_THEME]} />);
    for (let i = 0; i < 3; i += 1) {
      fireEvent.click(screen.getByRole("button", { name: "Next apps" }));
    }
    resize(800, 375);
    expect(tiles().map((a) => a.getAttribute("href"))).toContain(APPS[3]?.href);
  });
});
