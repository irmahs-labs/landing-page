import { act, render } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";

import { motion } from "@/test/setup";

import { TokkaeEmote } from "./tokkae-emote";

const shown = (root: HTMLElement) =>
  [...root.querySelectorAll("svg")].findIndex(
    (svg) => !svg.classList.contains("is-off")
  );

afterEach(() => {
  vi.useRealTimers();
});

describe("TokkaeEmote", () => {
  it("loops the singing frames, one at a time", () => {
    vi.useFakeTimers();
    const { container } = render(<TokkaeEmote />);
    const seen = new Set<number>();
    for (let i = 0; i < 16; i += 1) {
      expect(container.querySelectorAll("svg:not(.is-off)")).toHaveLength(1);
      seen.add(shown(container));
      act(() => {
        vi.advanceTimersByTime(200);
      });
    }
    expect(seen.size).toBe(container.querySelectorAll("svg").length);
  });

  it("holds still with reduced motion", () => {
    motion.reduced = true;
    vi.useFakeTimers();
    const { container } = render(<TokkaeEmote />);
    const first = shown(container);
    act(() => {
      vi.advanceTimersByTime(2000);
    });
    expect(shown(container)).toBe(first);
  });
});
