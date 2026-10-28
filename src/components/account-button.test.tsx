import { fireEvent, render, screen, within } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { AUTH_URL } from "@/lib/auth";
import type { VisitorStats } from "@/lib/visitors";

import { AccountButton } from "./account-button";

const USER = {
  email: "irma@example.com",
  id: "1",
  image: null,
  name: "Irma HS",
};

const STATS: VisitorStats = {
  history: {
    countries: [
      { code: "FR", share: 0.6 },
      { code: "NL", share: 0.4 },
    ],
    days: [
      { date: "2026-10-27", pageViews: 30, visitors: 12 },
      { date: "2026-10-28", pageViews: 20, visitors: 8 },
    ],
  },
  online: 3,
};

/**
 * The account service and this site's API: who is signed in, and what
 * /api/visitors answers them (403 for anyone but an admin)
 */
const serve = (user: typeof USER | null, visitors: VisitorStats | null) => {
  const fetch = vi.fn((url: string) => {
    if (url === `${AUTH_URL}/api/auth/get-session`) {
      return Promise.resolve(Response.json(user ? { user } : null));
    }

    if (url === "/api/visitors") {
      return Promise.resolve(
        visitors
          ? Response.json(visitors)
          : Response.json({ error: "not allowed" }, { status: 403 })
      );
    }

    return Promise.resolve(Response.json({}));
  });

  vi.stubGlobal("fetch", fetch);

  return fetch;
};

const openProfile = async () => {
  fireEvent.click(await screen.findByRole("button", { name: /Irma/u }));

  return screen.getByRole("region", { name: "Your profile" });
};

beforeEach(() => {
  vi.stubGlobal("location", { href: "https://irmahs.dev/", reload: vi.fn() });
});

describe("AccountButton", () => {
  it("signs in on the account service when nobody is signed in", async () => {
    serve(null, null);
    render(<AccountButton />);

    const link = await screen.findByRole("link", { name: /sign in/u });
    expect(link.getAttribute("href")).toBe(
      `${AUTH_URL}/sign-in?redirect=${encodeURIComponent("https://irmahs.dev/")}`
    );
  });

  it("opens profile.txt with just the profile and sign out for anyone but an admin", async () => {
    const fetch = serve(USER, null);
    render(<AccountButton />);
    const profile = await openProfile();

    expect(within(profile).getByText("profile.txt")).toBeTruthy();
    expect(within(profile).getByText("irma@example.com")).toBeTruthy();
    expect(
      within(profile).getByRole("button", { name: /sign out/u })
    ).toBeTruthy();
    await vi.waitFor(() =>
      expect(fetch).toHaveBeenCalledWith("/api/visitors", { cache: "no-store" })
    );
    expect(within(profile).queryByText("online")).toBeNull();
    expect(within(profile).queryByText("admin")).toBeNull();
  });

  it("shows an admin who's online, the week and where they came from", async () => {
    serve(USER, STATS);
    render(<AccountButton />);
    const profile = await openProfile();

    expect(await within(profile).findByText("admin")).toBeTruthy();
    expect(within(profile).getByText("online").parentElement?.textContent).toBe(
      " online3"
    );
    expect(
      within(profile).getByText("today", { selector: ".visitor-label" })
        .nextSibling?.textContent
    ).toBe("8");
    expect(within(profile).getByText("7 days").nextSibling?.textContent).toBe(
      "20"
    );
    expect(within(profile).getByLabelText("Tue: 12 visitors")).toBeTruthy();
    expect(within(profile).getByText("France")).toBeTruthy();
    expect(within(profile).getByText("60%")).toBeTruthy();
  });

  it("closes on Escape and on a click outside", async () => {
    serve(USER, null);
    render(<AccountButton />);

    await openProfile();
    fireEvent.keyDown(document, { key: "Escape" });
    expect(screen.queryByRole("region", { name: "Your profile" })).toBeNull();

    await openProfile();
    fireEvent.pointerDown(document.body);
    expect(screen.queryByRole("region", { name: "Your profile" })).toBeNull();
  });

  it("signs out on the account service, then reloads the page", async () => {
    const fetch = serve(USER, null);
    render(<AccountButton />);
    const profile = await openProfile();

    fireEvent.click(within(profile).getByRole("button", { name: /sign out/u }));

    await vi.waitFor(() => expect(window.location.reload).toHaveBeenCalled());
    expect(fetch).toHaveBeenCalledWith(
      `${AUTH_URL}/api/auth/sign-out`,
      expect.objectContaining({ credentials: "include", method: "POST" })
    );
  });
});
