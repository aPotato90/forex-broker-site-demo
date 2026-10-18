import type { CalendarEvent, Impact } from "@/data/calendar";

export type CalendarRange = "all" | "yesterday" | "today" | "tomorrow" | "next7";

export const RANGE_LABELS: Record<CalendarRange, string> = {
  all: "All dates",
  yesterday: "Yesterday",
  today: "Today",
  tomorrow: "Tomorrow",
  next7: "Next 7 days",
};

export interface CalendarFilters {
  range: CalendarRange;
  impacts: readonly Impact[];
  /** Empty means every currency. */
  currencies: readonly string[];
}

export function inRange(dayOffset: number, range: CalendarRange): boolean {
  switch (range) {
    case "all":
      return true;
    case "yesterday":
      return dayOffset === -1;
    case "today":
      return dayOffset === 0;
    case "tomorrow":
      return dayOffset === 1;
    case "next7":
      return dayOffset >= 0 && dayOffset <= 6;
  }
}

export function filterEvents(
  events: readonly CalendarEvent[],
  { range, impacts, currencies }: CalendarFilters,
): CalendarEvent[] {
  return events
    .filter((e) => inRange(e.dayOffset, range))
    .filter((e) => impacts.includes(e.impact))
    .filter((e) => currencies.length === 0 || currencies.includes(e.currency))
    .toSorted((a, b) => a.dayOffset - b.dayOffset || a.timeUtc.localeCompare(b.timeUtc));
}

/** Groups already-sorted events by day offset, preserving order. */
export function groupByDay(events: readonly CalendarEvent[]): [number, CalendarEvent[]][] {
  const groups = new Map<number, CalendarEvent[]>();
  for (const event of events) {
    const list = groups.get(event.dayOffset) ?? [];
    list.push(event);
    groups.set(event.dayOffset, list);
  }
  return [...groups.entries()];
}

export function relativeDayLabel(offset: number): string {
  if (offset === 0) return "Today";
  if (offset === 1) return "Tomorrow";
  if (offset === -1) return "Yesterday";
  return offset > 0 ? `In ${offset} days` : `${Math.abs(offset)} days ago`;
}

/** Calendar date `offset` days from `today`, at local midnight. */
export function dateFromOffset(today: Date, offset: number): Date {
  return new Date(today.getFullYear(), today.getMonth(), today.getDate() + offset);
}
