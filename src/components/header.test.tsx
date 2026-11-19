import { fireEvent, render, screen } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { Header } from "./header";

beforeEach(() => {
  // Nobody signed in, as the account service answers
  vi.stubGlobal(
    "fetch",
    vi.fn().mockResolvedValue({ json: () => Promise.resolve(null), ok: true })
  );
});

afterEach(() => {
  delete document.documentElement.dataset.theme;
});

describe("Header", () => {
  it("names the site as the page's heading, by Irma HS", () => {
    render(<Header />);
    expect(
      screen.getByRole("heading", { level: 1, name: "irmahs.dev" })
    ).toBeDefined();
    expect(screen.getByText("by Irma HS")).toBeDefined();
  });

  it("puts the page's controls in the middle", () => {
    render(
      <Header>
        <button type="button">Paris</button>
      </Header>
    );
    expect(screen.getByRole("button", { name: "Paris" })).toBeDefined();
  });

  it("ends with the sign-in pill once the session is known", async () => {
    render(<Header />);
    const signIn = await screen.findByRole("link", { name: "sign in" });
    expect(signIn.className).toBe("account");
    expect(signIn.getAttribute("href")).toContain("/sign-in?redirect=");
  });
});

describe("ThemeToggle", () => {
  it("is a light switch: on for Light Matcha, off for Dark Matcha", () => {
    document.documentElement.dataset.theme = "light";
    render(<Header />);

    const toggle = screen.getByRole("switch", { name: "Light mode" });
    expect(toggle.getAttribute("aria-checked")).toBe("true");

    fireEvent.click(toggle);
    expect(document.documentElement.dataset.theme).toBe("dark");
    expect(localStorage.getItem("theme")).toBe("dark");
    expect(toggle.getAttribute("aria-checked")).toBe("false");

    fireEvent.click(toggle);
    expect(document.documentElement.dataset.theme).toBe("light");
  });

  it("starts from the theme the page already has", () => {
    document.documentElement.dataset.theme = "dark";
    render(<Header />);
    expect(
      screen
        .getByRole("switch", { name: "Light mode" })
        .getAttribute("aria-checked")
    ).toBe("false");
  });
});
