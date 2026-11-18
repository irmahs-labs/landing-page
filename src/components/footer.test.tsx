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

  it("links the legal pages", () => {
    render(<Footer />);
    const legal = screen.getByRole("navigation", { name: "Legal" });
    expect(
      [...legal.querySelectorAll("a")].map((link) => [
        link.textContent,
        link.getAttribute("href"),
      ])
    ).toEqual([
      ["Legal notice", "/legal"],
      ["Privacy", "/privacy"],
      ["Terms of use", "/terms"],
      ["Cookies", "/cookies"],
    ]);
  });

  it("says how many are on the page, once the server has", () => {
    render(<Footer online={3} />);
    expect(screen.getByTitle("People on the page now").textContent).toBe(
      " 3 online"
    );
  });
});
