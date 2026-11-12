import { act, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";

import { chooseLanguage } from "@/lib/language";

import { LanguageToggle } from "./language-toggle";
import { ProfileWindow } from "./profile-window";

afterEach(() => {
  act(() => chooseLanguage("en"));
  localStorage.clear();
});

const pressed = (name: string) =>
  screen
    .getAllByRole("button", { name })
    .map((b) => b.getAttribute("aria-pressed"));

describe("LanguageToggle", () => {
  it("shows English pressed until French is picked", () => {
    render(<LanguageToggle />);
    expect(pressed("English")).toEqual(["true"]);
    fireEvent.click(screen.getByRole("button", { name: "Français" }));
    expect(pressed("Français")).toEqual(["true"]);
    expect(pressed("English")).toEqual(["false"]);
    expect(screen.getByRole("group", { name: "Langue" })).toBeDefined();
  });

  it("follows the profile's language pills, and they follow it", () => {
    render(
      <>
        <LanguageToggle />
        <ProfileWindow />
      </>
    );
    // The profile's French pill puts the page, the header included, in French
    fireEvent.click(screen.getByRole("button", { name: "French" }));
    expect(pressed("Français")).toEqual(["true", "true"]);
    expect(screen.getByText("Développeuse fullstack")).toBeDefined();
    // And the header's English button brings the profile back to English
    fireEvent.click(screen.getByRole("button", { name: "English" }));
    expect(pressed("English")).toEqual(["true", "true"]);
    expect(screen.getByText("Fullstack Software Engineer")).toBeDefined();
  });
});
