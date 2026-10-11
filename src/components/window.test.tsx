import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { Window } from "./window";

describe("Window", () => {
  it("is a labelled region with its title in the bar", () => {
    render(
      <Window label="Profile" meta="2 items" title="profile.exe">
        <p>hello</p>
      </Window>
    );
    const region = screen.getByRole("region", { name: "Profile" });
    expect(region.querySelector(".titlebar")?.textContent).toContain(
      "profile.exe"
    );
    expect(region.querySelector(".titlebar-meta")?.textContent).toBe("2 items");
    expect(screen.getByText("hello")).toBeDefined();
  });

  it("comes to the front when pressed", () => {
    render(
      <>
        <Window label="One" title="one">
          <p>1</p>
        </Window>
        <Window label="Two" title="two">
          <p>2</p>
        </Window>
      </>
    );
    const one = screen.getByRole("region", { name: "One" });
    const two = screen.getByRole("region", { name: "Two" });
    fireEvent.pointerDown(one);
    fireEvent.pointerDown(two);
    expect(Number(two.style.zIndex)).toBeGreaterThan(Number(one.style.zIndex));
    fireEvent.pointerDown(one);
    expect(Number(one.style.zIndex)).toBeGreaterThan(Number(two.style.zIndex));
  });
});
