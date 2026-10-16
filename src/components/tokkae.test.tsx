import { render } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { motion } from "@/test/setup";

import { Tokkae } from "./tokkae";

describe("Tokkae", () => {
  it("brings its playmate, the cube, out when the switch is on", () => {
    const { container } = render(<Tokkae nudge={null} playmate />);
    expect(container.querySelector(".buddy .buddy-cube svg")).not.toBeNull();
  });

  it("plays alone when the switch is off", () => {
    const { container } = render(<Tokkae nudge={null} playmate={false} />);
    expect(container.querySelector(".buddy")).toBeNull();
  });

  it("keeps the cube home with reduced motion", () => {
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
