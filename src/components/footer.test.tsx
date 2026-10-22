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
});
