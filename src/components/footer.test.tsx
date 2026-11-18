import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { Footer } from "./footer";

describe("Footer", () => {
  it("says who made the page", () => {
    render(<Footer />);
    expect(
      screen.getByRole("contentinfo").querySelector(".app-footer")?.textContent
    ).toBe(" Landing Page by Irma HS");
  });

  it("links every app and the legal pages", () => {
    render(<Footer />);
    const apps = screen.getByRole("navigation", { name: "Irma HS’s apps" });
    expect(
      [...apps.querySelectorAll("a")].map((link) => link.textContent)
    ).toEqual([
      "Landing Page",
      "Pantry Spinner",
      "Realms",
      "Mini Games",
      "Tools",
      "Alma",
      "Irma in Paris",
    ]);
    expect(
      screen.getByRole("link", { name: "Privacy" }).getAttribute("href")
    ).toBe("/privacy");
    expect(
      screen.getByRole("link", { name: "Legal notice" }).getAttribute("href")
    ).toBe("/legal");
  });

  it("says how many are on the page, once the server has", () => {
    render(<Footer online={3} />);
    expect(screen.getByTitle("People on the page now").textContent).toBe(
      " 3 online"
    );
  });
});
