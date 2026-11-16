import { act, fireEvent, render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { SideWidget } from "./side-widget";

// Diwali 2026, a Sunday, in the visitor's own time zone
const NOW = new Date("2026-11-08T12:00:00");

beforeEach(() => {
  // Nothing playing, as Spotify would say when quiet
  vi.stubGlobal(
    "fetch",
    vi.fn().mockResolvedValue(Response.json({ playing: false }))
  );
});

const days = () =>
  screen
    .getAllByRole("button")
    .filter((button) => button.classList.contains("cal-day"));

describe("SideWidget", () => {
  it("opens on the calendar, today pressed, and swaps to the music", () => {
    render(<SideWidget now={NOW} />);

    expect(
      screen.getByRole("region", { name: "Festival calendar" })
    ).toBeTruthy();
    expect(screen.getByText("November 2026")).toBeTruthy();
    expect(days()).toHaveLength(30);
    // Six whole weeks under the weekdays, blanks around the month, so every
    // month draws the same grid
    expect(document.querySelectorAll(".cal-grid > li")).toHaveLength(7 + 42);

    const today = days().find(
      (day) => day.getAttribute("aria-current") === "date"
    );

    expect(today?.getAttribute("aria-pressed")).toBe("true");

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

  it("moves a month on, and back to this one", () => {
    render(<SideWidget now={NOW} />);

    fireEvent.click(screen.getByRole("button", { name: "Next month" }));
    expect(screen.getByText("December 2026")).toBeTruthy();
    expect(days()).toHaveLength(31);

    fireEvent.click(screen.getByRole("button", { name: "today" }));
    expect(screen.getByText("November 2026")).toBeTruthy();
  });
});
