"use client";

import { useStoredChoice } from "@/hooks/use-stored-choice";
import { useCopy } from "@/lib/language";

import { CalendarWindow } from "./calendar-window";
import { Player } from "./player";

/** What a visitor keeps beside the apps: the festival calendar, or what Irma is listening to */
export const WIDGETS = ["calendar", "music"] as const;

export type Widget = (typeof WIDGETS)[number];

const COPY = {
  en: { calendar: "calendar", label: "Show beside the apps", music: "music" },
  fr: {
    calendar: "calendrier",
    label: "À afficher à côté des apps",
    music: "musique",
  },
};

const ICONS: Record<Widget, string> = {
  calendar:
    "M5 5 H19 A1 1 0 0 1 20 6 V19 A1 1 0 0 1 19 20 H5 A1 1 0 0 1 4 19 V6 A1 1 0 0 1 5 5 Z M4 10 H20 M8 3 V7 M16 3 V7",
  music:
    "M9 17 V5 L19 3 V15 M9 17 A2.5 2.5 0 1 1 4 17 A2.5 2.5 0 1 1 9 17 Z M19 15 A2.5 2.5 0 1 1 14 15 A2.5 2.5 0 1 1 19 15 Z",
};

/** The two-way switch at the top of the slot */
export const WidgetSwitch = ({
  current,
  onPick,
}: {
  current: Widget;
  onPick: (widget: Widget) => void;
}) => {
  const t = useCopy(COPY);

  return (
    <fieldset aria-label={t.label} className="widget-switch">
      {WIDGETS.map((widget) => (
        <button
          aria-pressed={widget === current}
          className="btn widget-switch__option"
          key={widget}
          onClick={() => onPick(widget)}
          type="button"
        >
          <svg aria-hidden="true" viewBox="0 0 24 24">
            <path d={ICONS[widget]} />
          </svg>
          {t[widget]}
        </button>
      ))}
    </fieldset>
  );
};

/**
 * The slot beside the apps, which each visitor fills with the widget they
 * pick: the festival calendar to start with, or Spotify's now playing
 */
export const SideWidget = ({ now }: { now: Date | null }) => {
  const [widget, saveWidget] = useStoredChoice("widget", WIDGETS, "calendar");
  const pick = <WidgetSwitch current={widget} onPick={saveWidget} />;

  return widget === "music" ? (
    <Player now={now} pick={pick} />
  ) : (
    <CalendarWindow now={now} pick={pick} />
  );
};
