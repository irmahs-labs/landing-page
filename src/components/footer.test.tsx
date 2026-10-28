import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { Footer } from "./footer";

describe("Footer", () => {
  it("says who made the page", () => {
    render(<Footer />);
    expect(screen.getByRole("contentinfo").textContent?.trim()).toBe(
      "Landing Page by Irma HS"
    );
  });

  it("says how many are on the page, once the server has", () => {
    render(<Footer online={3} />);
    expect(screen.getByTitle("People on the page now").textContent).toBe(
      " 3 online"
    );
  });
});
