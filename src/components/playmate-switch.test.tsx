import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import { PlaymateSwitch } from "./playmate-switch";

describe("PlaymateSwitch", () => {
  it("is a switch called Playmate, off to start with", () => {
    render(<PlaymateSwitch on={false} onToggle={vi.fn()} />);
    const toggle = screen.getByRole("switch", { name: "Playmate" });
    expect(toggle.getAttribute("aria-checked")).toBe("false");
    expect(screen.getByText("Playmate")).toBeDefined();
  });

  it("shows when the playmate is out", () => {
    render(<PlaymateSwitch on onToggle={vi.fn()} />);
    expect(screen.getByRole("switch").getAttribute("aria-checked")).toBe(
      "true"
    );
  });

  it("asks to bring the playmate out or send it home", () => {
    const onToggle = vi.fn();
    render(<PlaymateSwitch on={false} onToggle={onToggle} />);
    fireEvent.click(screen.getByRole("switch"));
    expect(onToggle).toHaveBeenCalledOnce();
  });
});
