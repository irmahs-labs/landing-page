import type { ReactNode } from "react";

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

/**
 * An outlined desktop window: a title bar with its name on the left and the
 * three buttons on the right, over a body that scrolls if the window is
 * resized smaller than its content. On bigger screens every window can be
 * resized from its bottom-right corner.
 */
export const Window = ({
  children,
  className,
  label,
  meta,
  title,
}: WindowProps) => (
  <section
    aria-label={label}
    className={className ? `window ${className}` : "window"}
  >
    <div className="titlebar">
      <span className="titlebar-text">{title}</span>
      <span className="titlebar-end">
        {meta && <span className="titlebar-meta">{meta}</span>}
        <WindowButtons />
      </span>
    </div>
    <div className="window-body">{children}</div>
  </section>
);
