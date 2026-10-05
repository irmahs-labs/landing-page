"use client";

import { useRef } from "react";
import type { PointerEvent as ReactPointerEvent, ReactNode } from "react";

import { WindowButtons } from "./icons";

interface WindowProps {
  children: ReactNode;
  /** Extra classes for this window's size and body layout */
  className?: string;
  label: string;
  /** Small text before the buttons, such as an item count */
  meta?: ReactNode;
  title: ReactNode;
}

// Each drag lifts its window above the others on the desk
let topLayer = 1;

const clamp = (v: number, lo: number, hi: number) =>
  Math.min(hi, Math.max(lo, v));

/**
 * An outlined desktop window: a title bar with its name on the left and the
 * three buttons on the right, over a body that scrolls if the window is
 * resized smaller than its content. On bigger screens every window can be
 * dragged by its title bar and resized from its bottom-right corner.
 */
export const Window = ({
  children,
  className,
  label,
  meta,
  title,
}: WindowProps) => {
  const ref = useRef<HTMLElement>(null);
  // How far the window has been dragged from its place in the layout
  const offset = useRef({ x: 0, y: 0 });

  const startDrag = (e: ReactPointerEvent<HTMLDivElement>) => {
    const el = ref.current;
    // Phones scroll the page with the title bar instead
    const phone = window.matchMedia("(max-width: 600px)").matches;
    if (!el || phone || e.button !== 0) {
      return;
    }
    e.preventDefault();
    const bar = e.currentTarget;
    bar.setPointerCapture(e.pointerId);
    topLayer += 1;
    el.style.zIndex = String(topLayer);
    el.classList.add("is-dragging");

    const rect = el.getBoundingClientRect();
    // Where the window would sit undragged, and where the grab started
    const home = {
      left: rect.left - offset.current.x,
      top: rect.top - offset.current.y,
    };
    const grab = {
      x: e.clientX - offset.current.x,
      y: e.clientY - offset.current.y,
    };

    const move = (ev: PointerEvent) => {
      // Keep the title bar on screen, so the window can always be grabbed again
      const x = clamp(
        ev.clientX - grab.x,
        80 - rect.width - home.left,
        window.innerWidth - 80 - home.left
      );
      const y = clamp(
        ev.clientY - grab.y,
        -home.top,
        window.innerHeight - 32 - home.top
      );
      offset.current = { x, y };
      el.style.translate = `${x}px ${y}px`;
    };
    const end = () => {
      bar.removeEventListener("pointermove", move);
      bar.removeEventListener("pointerup", end);
      bar.removeEventListener("pointercancel", end);
      el.classList.remove("is-dragging");
    };
    bar.addEventListener("pointermove", move);
    bar.addEventListener("pointerup", end);
    bar.addEventListener("pointercancel", end);
  };

  return (
    <section
      aria-label={label}
      className={className ? `window ${className}` : "window"}
      ref={ref}
    >
      <div className="titlebar" onPointerDown={startDrag}>
        <span className="titlebar-text">{title}</span>
        <span className="titlebar-end">
          {meta && <span className="titlebar-meta">{meta}</span>}
          <WindowButtons />
        </span>
      </div>
      <div className="window-body">{children}</div>
    </section>
  );
};
