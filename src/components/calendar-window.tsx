"use client";

import { useMemo, useState, useSyncExternalStore } from "react";
import type { ReactNode } from "react";

import { saveStored, subscribeStored } from "@/hooks/use-stored-choice";
import { addToCalendar } from "@/lib/festival-calendar/add-to-calendar";
import { occasionsIn } from "@/lib/festival-calendar/festivals";
import type { GroupId, Occasion } from "@/lib/festival-calendar/festivals";
import {
  CALENDARS,
  CALENDARS_KEY,
  calendarsFrom,
  toggleCalendar,
} from "@/lib/festival-calendar/groups";
import type { CalendarId } from "@/lib/festival-calendar/groups";
import {
  formatClock,
  formatDay,
  formatMonth,
} from "@/lib/festival-calendar/sky/format";
import { say } from "@/lib/festival-calendar/sky/french";
import { fullMoonName, moonMonth } from "@/lib/festival-calendar/sky/moon";
import type { MoonDay } from "@/lib/festival-calendar/sky/moon";
import { MoonGlyph } from "@/lib/festival-calendar/sky/moon-glyph";
import {
  dayKey,
  daysInMonth,
  keyOf,
  localTimeZone,
  wallTimeAt,
  weekdayOf,
} from "@/lib/festival-calendar/sky/time";
import { useCopy, useLanguage } from "@/lib/language";
import { store } from "@/lib/storage";

import { Window } from "./window";

const COPY = {
  en: {
    add: (name: string) => `Add ${name} to your calendar`,
    back: "Back to this month",
    calendars: "Calendars",
    choose: "Pick your calendars",
    done: "done",
    empty: "Pick a calendar to see its days.",
    label: "Festival calendar",
    next: "Next month",
    nothing: (day: string, more: boolean) =>
      `${day}: nothing on this day.${more ? " Coming up:" : ""}`,
    previous: "Previous month",
    today: "today",
    weekdays: ["M", "T", "W", "T", "F", "S", "S"],
    weekdaysLong: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
  },
  fr: {
    add: (name: string) => `Ajouter ${name} à votre agenda`,
    back: "Revenir à ce mois-ci",
    calendars: "Calendriers",
    choose: "Choisir vos calendriers",
    done: "fini",
    empty: "Choisissez un calendrier pour voir ses jours.",
    label: "Calendrier des fêtes",
    next: "Mois suivant",
    nothing: (day: string, more: boolean) =>
      `${day} : rien ce jour-là.${more ? " À venir :" : ""}`,
    previous: "Mois précédent",
    today: "aujourd’hui",
    weekdays: ["L", "M", "M", "J", "V", "S", "D"],
    weekdaysLong: ["lun.", "mar.", "mer.", "jeu.", "ven.", "sam.", "dim."],
  },
};

/** "Sat 10 Oct" */
const SHORT = { day: "numeric", month: "short", weekday: "short" } as const;

/** How many festivals "coming up" lists when the day picked has none */
const SOON = 3;

const isGroup = (id: CalendarId): id is GroupId => id !== "moon";

const Arrow = ({ d }: { d: string }) => (
  <svg aria-hidden="true" viewBox="0 0 24 24">
    <path d={d} />
  </svg>
);

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
const useCalendars = () => {
  const saved = useSyncExternalStore(
    subscribeStored,
    () => store.get(CALENDARS_KEY),
    () => null
  );

  const chosen = useMemo(() => calendarsFrom(saved), [saved]);

  return { chosen, toggle: toggleSaved };
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

/** The calendars to pick, in place of the month while open */
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

interface Shown {
  month: number;
  year: number;
}

/** The month's days: each with its moon phase or its first festival's mark */
const MonthGrid = ({
  day,
  moons,
  occasions,
  onPick,
  shown,
  today,
}: {
  day: string;
  moons: readonly MoonDay[] | null;
  occasions: readonly Occasion[];
  onPick: (key: string) => void;
  shown: Shown;
  today: string;
}) => {
  const language = useLanguage();
  const t = useCopy(COPY);
  const length = daysInMonth(shown.year, shown.month);
  // Monday is 0: how many blank cells come before the 1st
  const lead = (weekdayOf(keyOf(shown.year, shown.month, 1)) + 6) % 7;

  return (
    <ol className="cal-grid">
      {t.weekdays.map((weekday, i) => (
        <li
          aria-hidden="true"
          className="cal-grid__weekday"
          key={t.weekdaysLong[i]}
          title={t.weekdaysLong[i]}
        >
          {weekday}
        </li>
      ))}
      {Array.from({ length }, (_, i) => {
        const key = keyOf(shown.year, shown.month, i + 1);
        const exact = moons?.[i]?.exact ? moons[i] : null;

        const marks = occasions.filter(
          ({ end, start }) => start <= key && key <= end
        );

        const label = [
          formatDay(key, SHORT),
          key === today ? t.today : "",
          exact ? say(exact.phase) : "",
          ...marks.map((mark) => mark.festival.name[language]),
        ];

        return (
          <li
            key={key}
            style={i === 0 ? { gridColumnStart: lead + 1 } : undefined}
          >
            <button
              aria-current={key === today ? "date" : undefined}
              aria-label={label.filter(Boolean).join(", ")}
              aria-pressed={key === day}
              className="cal-day"
              onClick={() => onPick(key)}
              type="button"
            >
              <span className="cal-day__num">{i + 1}</span>
              <span aria-hidden="true" className="cal-day__mark">
                {exact ? <MoonGlyph angle={exact.angle} size={12} /> : null}
                {!exact && marks[0] ? marks[0].festival.emoji : null}
              </span>
            </button>
          </li>
        );
      })}
    </ol>
  );
};

/** What falls on the day picked; with nothing that day, what's coming up */
const DayList = ({
  chosen,
  day,
  moons,
  occasions,
  timeZone,
}: {
  chosen: readonly CalendarId[];
  day: string;
  moons: readonly MoonDay[] | null;
  occasions: readonly Occasion[];
  timeZone: string;
}) => {
  const t = useCopy(COPY);
  const on = occasions.filter(({ end, start }) => start <= day && day <= end);
  const moon = moons?.find((m) => m.key === day && m.exact);
  const quiet = !moon && on.length === 0;

  const soon = quiet
    ? occasions.filter(({ start }) => start > day).slice(0, SOON)
    : [];

  // On a quiet day, the Moon's next phase this month is coming up too
  const nextMoon = quiet
    ? moons?.find((m) => m.key > day && m.exact)
    : undefined;

  let hint: string | null = null;

  if (chosen.length === 0) {
    hint = t.empty;
  } else if (quiet) {
    hint = t.nothing(
      formatDay(day, SHORT),
      soon.length > 0 || Boolean(nextMoon)
    );
  }

  return (
    <div aria-live="polite" className="cal-list">
      {hint ? <p className="cal-hint">{hint}</p> : null}
      <ul className="cal-items">
        {moon ? <PhaseRow day={moon} timeZone={timeZone} /> : null}
        {nextMoon ? <PhaseRow day={nextMoon} timeZone={timeZone} /> : null}
        {[...on, ...soon].map((occasion) => (
          <OccasionRow
            key={`${occasion.festival.id}|${occasion.start}`}
            occasion={occasion}
          />
        ))}
      </ul>
    </div>
  );
};

/** A month of the calendar, with its arrows, its days and the day's list */
const Month = ({
  atCurrent,
  chosen,
  onBack,
  onChoose,
  onStep,
  shown,
  timeZone,
  today,
}: {
  atCurrent: boolean;
  chosen: readonly CalendarId[];
  onBack: () => void;
  onChoose: () => void;
  onStep: (by: number) => void;
  shown: Shown;
  timeZone: string;
  today: string;
}) => {
  const t = useCopy(COPY);
  const { month, year } = shown;
  const [picked, setPicked] = useState<string | null>(null);
  const withMoon = chosen.includes("moon");

  const groups = useMemo(() => new Set(chosen.filter(isGroup)), [chosen]);

  const occasions = useMemo(
    () => occasionsIn(year, month, groups),
    [year, month, groups]
  );

  const moons = useMemo(
    () => (withMoon ? moonMonth(year, month, timeZone) : null),
    [year, month, withMoon, timeZone]
  );

  // The day the list is about: the one pressed in this month, else today
  // in today's month and the 1st in any other
  const first = keyOf(year, month, 1);
  const inMonth = picked?.startsWith(first.slice(0, 8)) ? picked : null;
  const day = inMonth ?? (atCurrent ? today : first);

  return (
    <>
      <div className="cal-nav">
        <button
          aria-label={t.previous}
          className="btn ctl"
          onClick={() => onStep(-1)}
          type="button"
        >
          <Arrow d="M15 6 L9 12 L15 18" />
        </button>
        <h2 aria-live="polite" className="cal-month">
          {formatMonth(year, month)}
        </h2>
        <button
          aria-label={t.next}
          className="btn ctl"
          onClick={() => onStep(1)}
          type="button"
        >
          <Arrow d="M9 6 L15 12 L9 18" />
        </button>
      </div>

      <MonthGrid
        day={day}
        moons={moons}
        occasions={occasions}
        onPick={setPicked}
        shown={shown}
        today={today}
      />

      <DayList
        chosen={chosen}
        day={day}
        moons={moons}
        occasions={occasions}
        timeZone={timeZone}
      />

      <div className="cal-foot">
        <button className="btn cal-choose" onClick={onChoose} type="button">
          {CALENDARS.filter((c) => chosen.includes(c.id))
            .map((c) => c.emoji)
            .join("")}{" "}
          {t.calendars}
        </button>
        {atCurrent ? null : (
          <button
            className="btn cal-choose"
            onClick={onBack}
            title={t.back}
            type="button"
          >
            {t.today}
          </button>
        )}
      </div>
    </>
  );
};

/**
 * The Festival Calendar, which came over from Mini Games: a month of moons
 * and the festivals of the calendars the visitor picked, in the slot beside
 * the apps. Pressing a day lists what falls on it; with nothing that day, it
 * lists what's coming up.
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
  const { chosen, toggle } = useCalendars();
  const timeZone = useMemo(() => localTimeZone(), []);
  const [picking, setPicking] = useState(false);
  // The month the visitor moved to; until then, today's
  const [moved, setMoved] = useState<Shown | null>(null);

  const current = now ? wallTimeAt(now, timeZone) : null;
  const shown = moved ?? current;

  const step = (by: number) => {
    if (shown) {
      const index = shown.year * 12 + (shown.month - 1) + by;
      setMoved({ month: (index % 12) + 1, year: Math.floor(index / 12) });
    }
  };

  let body: ReactNode = <div aria-busy="true" className="cal-loading" />;

  if (picking) {
    body = (
      <Picker
        chosen={chosen}
        onDone={() => setPicking(false)}
        onToggle={toggle}
      />
    );
  } else if (now && shown && current) {
    body = (
      <Month
        atCurrent={shown.year === current.year && shown.month === current.month}
        chosen={chosen}
        key={`${shown.year}-${shown.month}`}
        onBack={() => setMoved(null)}
        onChoose={() => setPicking(true)}
        onStep={step}
        shown={{ month: shown.month, year: shown.year }}
        timeZone={timeZone}
        today={dayKey(now, timeZone)}
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
