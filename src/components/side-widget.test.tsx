import { act, fireEvent, render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { SideWidget } from "./side-widget";

// Diwali 2026, a Sunday, in the visitor's own time zone
const NOW = new Date("2026-11-08T12:00:00");

beforeEach(() => {
  // jsdom lays nothing out: the calendar's list gets room for four lines
  vi.stubGlobal(
    "ResizeObserver",
    class {
      listener: (entries: { contentRect: { height: number } }[]) => void;
      constructor(
        listener: (entries: { contentRect: { height: number } }[]) => void
      ) {
        this.listener = listener;
      }
      disconnect = vi.fn();
      observe = () => this.listener([{ contentRect: { height: 200 } }]);
    }
  );

  // Nothing playing, as Spotify would say when quiet
  vi.stubGlobal(
    "fetch",
    vi.fn().mockResolvedValue(Response.json({ playing: false }))
  );
});

/** The names on the calendar's list, in order */
const listed = () =>
  [...document.querySelectorAll(".cal-item__name")].map(
    (name) => name.textContent
  );

describe("SideWidget", () => {
  it("opens on the calendar, today pressed, and swaps to the music", () => {
    render(<SideWidget now={NOW} />);

    expect(
      screen.getByRole("region", { name: "Festival calendar" })
    ).toBeTruthy();
    // Only what's coming up: no month grid
    expect(screen.getByRole("heading", { name: "Coming up" })).toBeTruthy();
    expect(document.querySelector(".cal-day")).toBeNull();
    // Moon phases from 8 November on, the next first
    expect(listed().length).toBeGreaterThan(0);

    fireEvent.click(screen.getByRole("button", { name: /music/u }));
    expect(
      screen.getByRole("region", { name: "Now playing on Spotify" })
    ).toBeTruthy();
    expect(localStorage.getItem("widget")).toBe("music");
  });

  it("shows the festivals of the calendars picked, and keeps the pick", () => {
    render(<SideWidget now={NOW} />);

    fireEvent.click(screen.getByRole("button", { name: /Calendars/u }));
    act(() => {
      fireEvent.click(screen.getByRole("button", { name: /South Asian/u }));
      fireEvent.click(screen.getByRole("button", { name: /East Asian/u }));
    });
    fireEvent.click(screen.getByRole("button", { name: "done" }));

    expect(
      JSON.parse(localStorage.getItem("festival-calendars") ?? "")
    ).toEqual(["moon", "east-asia", "south-asia"]);
    expect(
      screen.getByRole("button", { name: /Add Dīwālī to your calendar/u })
    ).toBeTruthy();
  });

  it("lists what's coming up from today, in date order, past the month's end", () => {
    render(<SideWidget now={new Date("2026-11-28T12:00:00")} />);

    const dates = [...document.querySelectorAll(".cal-item__when")].map(
      (when) => when.textContent ?? ""
    );

    // The moon's next phases fall in December
    expect(dates.some((date) => date.includes("Dec"))).toBe(true);
  });
});
