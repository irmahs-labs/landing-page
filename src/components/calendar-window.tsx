"use client";

import {
  useEffect,
  useMemo,
  useRef,
  useState,
  useSyncExternalStore,
} from "react";
import type { ReactNode } from "react";

import { saveStored, subscribeStored } from "@/hooks/use-stored-choice";
import { addToCalendar } from "@/lib/festival-calendar/add-to-calendar";
import { agendaFrom } from "@/lib/festival-calendar/agenda";
import { occasionsIn } from "@/lib/festival-calendar/festivals";
import type { GroupId, Occasion } from "@/lib/festival-calendar/festivals";
import {
  CALENDARS,
  CALENDARS_KEY,
  calendarsFrom,
  toggleCalendar,
} from "@/lib/festival-calendar/groups";
import type { CalendarId } from "@/lib/festival-calendar/groups";
import { formatClock, formatDay } from "@/lib/festival-calendar/sky/format";
import { say } from "@/lib/festival-calendar/sky/french";
import { fullMoonName, moonMonth } from "@/lib/festival-calendar/sky/moon";
import type { MoonDay } from "@/lib/festival-calendar/sky/moon";
import { MoonGlyph } from "@/lib/festival-calendar/sky/moon-glyph";
import {
  dayKey,
  localTimeZone,
  wallTimeAt,
} from "@/lib/festival-calendar/sky/time";
import { useCopy, useLanguage } from "@/lib/language";
import { store } from "@/lib/storage";

import { Window } from "./window";

const COPY = {
  en: {
    add: (name: string) => `Add ${name} to your calendar`,
    calendars: "Calendars",
    choose: "Pick your calendars",
    done: "done",
    empty: "Pick a calendar to see what's coming up.",
    nothing: "Nothing coming up in your calendars.",
    soon: "Coming up",
    label: "Festival calendar",
  },
  fr: {
    add: (name: string) => `Ajouter ${name} à votre agenda`,
    calendars: "Calendriers",
    choose: "Choisir vos calendriers",
    done: "fini",
    empty: "Choisissez un calendrier pour voir ce qui arrive.",
    nothing: "Rien à venir dans vos calendriers.",
    soon: "À venir",
    label: "Calendrier des fêtes",
  },
};

/** "Sat 10 Oct" */
const SHORT = { day: "numeric", month: "short", weekday: "short" } as const;

/** How many months ahead the list looks, so there's always enough to fill it */
const MONTHS_AHEAD = 3;

const isGroup = (id: CalendarId): id is GroupId => id !== "moon";

const CalendarIcon = () => (
  <svg aria-hidden="true" viewBox="0 0 24 24">
    <path d="M5 5 H19 A1 1 0 0 1 20 6 V19 A1 1 0 0 1 19 20 H5 A1 1 0 0 1 4 19 V6 A1 1 0 0 1 5 5 Z M4 10 H20 M8 3 V7 M16 3 V7 M12 13 V17 M10 15 H14" />
  </svg>
);

/** Adds or takes off a calendar, from what is saved right now, so presses quicker than a render all count */
const toggleSaved = (id: CalendarId) => {
  const latest = calendarsFrom(store.get(CALENDARS_KEY));
  saveStored(CALENDARS_KEY, JSON.stringify(toggleCalendar(latest, id)));
};

/** The calendars the visitor picked, kept in this browser */
const useChosenCalendars = () => {
  const saved = useSyncExternalStore(
    subscribeStored,
    () => store.get(CALENDARS_KEY),
    () => null
  );

  return useMemo(() => calendarsFrom(saved), [saved]);
};

/** A festival on the list: its mark, name, days, and a way to add it */
const OccasionRow = ({ occasion }: { occasion: Occasion }) => {
  const language = useLanguage();
  const t = useCopy(COPY);
  const { end, festival, start } = occasion;
  const name = festival.name[language];

  return (
    <li className="cal-item">
      <span aria-hidden="true" className="cal-item__mark">
        {festival.emoji}
      </span>
      <span className="cal-item__text">
        <span className="cal-item__name">{name}</span>
        <span className="cal-item__when">
          {start === end
            ? formatDay(start, SHORT)
            : `${formatDay(start)} – ${formatDay(end)}`}
        </span>
      </span>
      <button
        aria-label={t.add(name)}
        className="btn ctl cal-item__add"
        onClick={() => addToCalendar(occasion, language)}
        title={t.add(name)}
        type="button"
      >
        <CalendarIcon />
      </button>
    </li>
  );
};

/** A moon phase on the list: the Moon as it looks, its name and its time */
const PhaseRow = ({ day, timeZone }: { day: MoonDay; timeZone: string }) => (
  <li className="cal-item">
    <span className="cal-item__mark">
      <MoonGlyph angle={day.angle} size={22} />
    </span>
    <span className="cal-item__text">
      <span className="cal-item__name">
        {say(
          day.phase === "Full Moon" && day.exact
            ? fullMoonName(day.exact, timeZone)
            : day.phase
        )}
      </span>
      <span className="cal-item__when">
        {formatDay(day.key, SHORT)}
        {day.exact ? `, ${formatClock(day.exact, timeZone)}` : ""}
      </span>
    </span>
  </li>
);

/** The calendars to pick, in place of the list while open */
const Picker = ({
  chosen,
  onDone,
  onToggle,
}: {
  chosen: readonly CalendarId[];
  onDone: () => void;
  onToggle: (id: CalendarId) => void;
}) => {
  const language = useLanguage();
  const t = useCopy(COPY);

  return (
    <fieldset className="cal-picker">
      <legend className="cal-picker__title">{t.choose}</legend>
      <ul className="cal-picker__list">
        {CALENDARS.map((calendar) => (
          <li key={calendar.id}>
            <button
              aria-pressed={chosen.includes(calendar.id)}
              className="btn cal-chip"
              onClick={() => onToggle(calendar.id)}
              type="button"
            >
              <span aria-hidden="true">{calendar.emoji}</span>
              {calendar.name[language]}
            </button>
          </li>
        ))}
      </ul>
      <button className="btn cal-done" onClick={onDone} type="button">
        {t.done}
      </button>
    </fieldset>
  );
};

/** How tall one line of the list is, and the gap between two, in pixels (see .cal-item) */
const ITEM_H = 44;
const ITEM_GAP = 6;

/** How many list lines fit in the element's height, as it changes */
const useLinesThatFit = () => {
  const ref = useRef<HTMLDivElement>(null);
  const [lines, setLines] = useState(1);

  useEffect(() => {
    const element = ref.current;

    if (!element) {
      return;
    }

    const observer = new ResizeObserver(([entry]) => {
      if (entry) {
        setLines(
          Math.max(
            1,
            Math.floor(
              (entry.contentRect.height + ITEM_GAP) / (ITEM_H + ITEM_GAP)
            )
          )
        );
      }
    });

    observer.observe(element);

    return () => observer.disconnect();
  }, []);

  return { lines, ref };
};

/** The months from this one on, as year and month */
const monthsFrom = (year: number, month: number, count: number) =>
  Array.from({ length: count }, (_, i) => {
    const index = year * 12 + (month - 1) + i;

    return { month: (index % 12) + 1, year: Math.floor(index / 12) };
  });

/**
 * What's coming up in the calendars picked, from today: festivals and the
 * Moon's exact phases in date order, today's first, only as many as fit the
 * window, which is the player's size.
 */
const Upcoming = ({
  chosen,
  now,
  onChoose,
  timeZone,
}: {
  chosen: readonly CalendarId[];
  now: Date;
  onChoose: () => void;
  timeZone: string;
}) => {
  const t = useCopy(COPY);
  const { lines, ref } = useLinesThatFit();
  const today = dayKey(now, timeZone);
  const { month, year } = wallTimeAt(now, timeZone);
  const withMoon = chosen.includes("moon");
  const groups = useMemo(() => new Set(chosen.filter(isGroup)), [chosen]);

  const entries = useMemo(() => {
    const months = monthsFrom(year, month, MONTHS_AHEAD);

    return agendaFrom(
      today,
      months.flatMap((m) => occasionsIn(m.year, m.month, groups)),
      withMoon
        ? months.flatMap((m) => moonMonth(m.year, m.month, timeZone))
        : []
    );
  }, [today, year, month, groups, withMoon, timeZone]);

  let hint: string | null = null;

  if (chosen.length === 0) {
    hint = t.empty;
  } else if (entries.length === 0) {
    hint = t.nothing;
  }

  return (
    <>
      <h2 className="cal-heading">{t.soon}</h2>
      <div aria-live="polite" className="cal-list" ref={ref}>
        {hint ? <p className="cal-hint">{hint}</p> : null}
        <ul className="cal-items">
          {entries
            .slice(0, lines)
            .map((entry) =>
              entry.kind === "moon" ? (
                <PhaseRow
                  day={entry.moon}
                  key={`moon|${entry.key}`}
                  timeZone={timeZone}
                />
              ) : (
                <OccasionRow
                  key={`${entry.occasion.festival.id}|${entry.occasion.start}`}
                  occasion={entry.occasion}
                />
              )
            )}
        </ul>
      </div>
      <div className="cal-foot">
        <button className="btn cal-choose" onClick={onChoose} type="button">
          {t.calendars}
        </button>
      </div>
    </>
  );
};

/**
 * The Festival Calendar, which came over from Mini Games: what's coming up
 * in the calendars the visitor picked (moons and festivals), in the slot
 * beside the apps, as many as fit.
 */
export const CalendarWindow = ({
  now,
  pick,
}: {
  now: Date | null;
  /** The switch back to the player, at the top of the window */
  pick: ReactNode;
}) => {
  const t = useCopy(COPY);
  const chosen = useChosenCalendars();
  const timeZone = useMemo(() => localTimeZone(), []);
  const [picking, setPicking] = useState(false);

  let body: ReactNode = <div aria-busy="true" className="cal-loading" />;

  if (picking) {
    body = (
      <Picker
        chosen={chosen}
        onDone={() => setPicking(false)}
        onToggle={toggleSaved}
      />
    );
  } else if (now) {
    body = (
      <Upcoming
        chosen={chosen}
        now={now}
        onChoose={() => setPicking(true)}
        timeZone={timeZone}
      />
    );
  }

  return (
    <Window className="calendar-window" label={t.label} title="calendar.ics">
      <div className="side-body">
        {pick}
        {body}
      </div>
    </Window>
  );
};
