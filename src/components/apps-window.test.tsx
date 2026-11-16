import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { APPS } from "@/lib/apps";

import { AppsWindow } from "./apps-window";

beforeEach(() => {
  // No dates from /api/app-deploys unless a test gives some
  vi.stubGlobal(
    "fetch",
    vi.fn().mockResolvedValue(new Response(null, { status: 502 }))
  );
});

const tiles = () => screen.getAllByRole("link");
const label = () => screen.getByText(/\d+ \/ \d+/u).textContent;

describe("AppsWindow", () => {
  it("opens on one app, with a screenshot", () => {
    render(<AppsWindow />);
    expect(tiles()).toHaveLength(1);
    expect(label()).toBe(`1 / ${APPS.length}`);
    expect(tiles()[0]?.querySelector("img")).not.toBeNull();
  });

  it("flips through the apps one at a time, wrapping round", () => {
    render(<AppsWindow />);
    fireEvent.click(screen.getByRole("button", { name: "Next app" }));
    expect(tiles()).toHaveLength(1);
    expect(tiles()[0]?.getAttribute("href")).toBe(APPS[1]?.href);
    expect(label()).toBe(`2 / ${APPS.length}`);
    fireEvent.click(screen.getByRole("button", { name: "Previous app" }));
    fireEvent.click(screen.getByRole("button", { name: "Previous app" }));
    expect(tiles()).toHaveLength(1);
    expect(tiles()[0]?.getAttribute("href")).toBe(APPS.at(-1)?.href);
  });

  it("is titled like a file, as every window is", () => {
    render(<AppsWindow />);
    const region = screen.getByRole("region", { name: "My apps" });
    expect(region.querySelector(".titlebar-text")?.textContent).toBe(
      "launcher.exe"
    );
  });

  it("opens every app in a new tab, showing only that one", () => {
    render(<AppsWindow />);

    for (const app of APPS) {
      const shown = tiles();

      expect(shown).toHaveLength(1);
      expect(shown[0]?.getAttribute("href")).toBe(app.href);
      expect(shown[0]?.getAttribute("target")).toBe("_blank");
      expect(shown[0]?.getAttribute("rel")).toBe("noreferrer");
      expect(shown[0]?.textContent).toContain("(opens in a new tab)");
      fireEvent.click(screen.getByRole("button", { name: "Next app" }));
    }
  });

  it("dates each app by its last deploy, once GitHub has said", async () => {
    const [first] = APPS;
    vi.stubGlobal(
      "fetch",
      vi
        .fn()
        .mockResolvedValue(
          Response.json({ [first?.href ?? ""]: "2026-10-27T20:58:31Z" })
        )
    );
    render(<AppsWindow />);
    await waitFor(() =>
      expect(tiles()[0]?.textContent).toContain("Updated 27 Oct 2026")
    );
    expect(tiles()[0]?.querySelector("time")?.getAttribute("dateTime")).toBe(
      "2026-10-27T20:58:31Z"
    );
  });

  it("leaves the date off when there is none", async () => {
    render(<AppsWindow />);
    await waitFor(() => expect(fetch).toHaveBeenCalled());
    expect(tiles()[0]?.textContent).not.toContain("Updated");
  });
});
