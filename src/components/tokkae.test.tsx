import { render } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { motion } from "@/test/setup";

import { Tokkae } from "./tokkae";

describe("Tokkae", () => {
  it("brings its playmate, Coq, out when the switch is on", () => {
    const { container } = render(<Tokkae nudge={null} playmate />);
    const frames = container.querySelectorAll(".buddy .buddy-coq > svg");
    expect(frames.length).toBeGreaterThan(1);
    // One frame on show at a time
    expect(
      container.querySelectorAll(".buddy-coq > svg:not(.is-off)")
    ).toHaveLength(1);
  });

  it("plays alone when the switch is off", () => {
    const { container } = render(<Tokkae nudge={null} playmate={false} />);
    expect(container.querySelector(".buddy")).toBeNull();
  });

  it("keeps Coq home with reduced motion", () => {
    motion.reduced = true;
    const { container } = render(<Tokkae nudge={null} playmate />);
    expect(container.querySelector(".buddy")).toBeNull();
  });

  it("shows its patch notes straight away with reduced motion", () => {
    motion.reduced = true;
    const { getByRole } = render(<Tokkae nudge={null} playmate={false} />);
    expect(getByRole("region", { name: "What's new" })).toBeDefined();
  });
});
