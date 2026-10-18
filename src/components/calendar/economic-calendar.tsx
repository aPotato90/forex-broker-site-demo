"use client";

import { useMemo, useState, useSyncExternalStore } from "react";
import { cn } from "cn";
import { CALENDAR_EVENTS, IMPACT_LABELS, type Impact } from "@/data/calendar";
import {
  RANGE_LABELS,
  dateFromOffset,
  filterEvents,
  groupByDay,
  relativeDayLabel,
  type CalendarRange,
} from "@/lib/calendar";

const CURRENCIES = [...new Set(CALENDAR_EVENTS.map((e) => e.currency))].sort();
const IMPACTS: Impact[] = ["high", "medium", "low"];

const noopSubscribe = () => () => {};
/** Today's date as a stable string in the browser; null during server prerender. */
function useTodayKey(): string | null {
  return useSyncExternalStore(
    noopSubscribe,
    () => new Date().toDateString(),
    () => null,
  );
}

function ImpactBadge({ impact }: { impact: Impact }) {
  const bars = impact === "high" ? 3 : impact === "medium" ? 2 : 1;
  return (
    <span className="inline-flex items-center gap-1.5 text-xs font-medium">
      <span aria-hidden className="flex items-end gap-0.5">
        {[1, 2, 3].map((n) => (
          <span
            key={n}
            className={cn(
              "w-1 rounded-sm",
              n === 1 ? "h-2" : n === 2 ? "h-3" : "h-4",
              n <= bars
                ? impact === "high"
                  ? "bg-negative"
                  : impact === "medium"
                    ? "bg-brand"
                    : "bg-muted-foreground"
                : "bg-border",
            )}
          />
        ))}
      </span>
      {IMPACT_LABELS[impact]}
    </span>
  );
}

export function EconomicCalendar() {
  const todayKey = useTodayKey();
  const [range, setRange] = useState<CalendarRange>("next7");
  const [impacts, setImpacts] = useState<Impact[]>(IMPACTS);
  const [currency, setCurrency] = useState<string>("all");

  const groups = useMemo(
    () =>
      groupByDay(
        filterEvents(CALENDAR_EVENTS, {
          range,
          impacts,
          currencies: currency === "all" ? [] : [currency],
        }),
      ),
    [range, impacts, currency],
  );
  const total = groups.reduce((n, [, events]) => n + events.length, 0);

  function formatDay(offset: number) {
    if (!todayKey) return null;
    return dateFromOffset(new Date(todayKey), offset).toLocaleDateString(undefined, {
      weekday: "long",
      day: "numeric",
      month: "long",
    });
  }

  function toggleImpact(impact: Impact) {
    setImpacts((current) =>
      current.includes(impact) ? current.filter((i) => i !== impact) : [...current, impact],
    );
  }

  return (
    <div className="rounded-2xl border bg-card text-card-foreground shadow-xs">
      <div className="grid gap-5 border-b p-4 sm:p-5 lg:grid-cols-[1fr_auto_auto] lg:items-end">
        <fieldset>
          <legend className="mb-2 text-sm font-medium">Date range</legend>
          <div className="flex flex-wrap gap-1 rounded-xl bg-muted p-1">
            {(Object.keys(RANGE_LABELS) as CalendarRange[]).map((r) => (
              <label
                key={r}
                className="flex min-h-9 flex-1 cursor-pointer items-center justify-center rounded-lg px-3 text-sm font-medium whitespace-nowrap text-muted-foreground has-checked:bg-background has-checked:text-foreground has-checked:shadow-sm has-focus-visible:outline-2 has-focus-visible:outline-ring sm:flex-none"
              >
                <input
                  type="radio"
                  name="calendar-range"
                  value={r}
                  checked={range === r}
                  onChange={() => setRange(r)}
                  className="sr-only"
                />
                {RANGE_LABELS[r]}
              </label>
            ))}
          </div>
        </fieldset>
        <fieldset>
          <legend className="mb-2 text-sm font-medium">Impact</legend>
          <div className="flex gap-3">
            {IMPACTS.map((impact) => (
              <label key={impact} className="flex min-h-9 items-center gap-2 text-sm">
                <input
                  type="checkbox"
                  checked={impacts.includes(impact)}
                  onChange={() => toggleImpact(impact)}
                  className="size-4 accent-[var(--brand)]"
                />
                {IMPACT_LABELS[impact]}
              </label>
            ))}
          </div>
        </fieldset>
        <div>
          <label htmlFor="calendar-currency" className="mb-2 block text-sm font-medium">
            Currency
          </label>
          <select
            id="calendar-currency"
            value={currency}
            onChange={(e) => setCurrency(e.target.value)}
            className="h-10 w-full rounded-lg border border-input bg-background px-3 text-sm lg:w-36 dark:bg-input/30"
          >
            <option value="all">All currencies</option>
            {CURRENCIES.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </div>
      </div>

      <p className="border-b px-4 py-3 text-sm text-muted-foreground sm:px-5" role="status">
        {total} sample {total === 1 ? "event" : "events"} shown. Times are in UTC.
      </p>

      {groups.length === 0 ? (
        <p className="px-5 py-12 text-center text-muted-foreground">
          No sample events match these filters.
        </p>
      ) : (
        <div className="divide-y">
          {groups.map(([offset, events]) => (
            <section key={offset} aria-labelledby={`day-${offset}`}>
              <h2
                id={`day-${offset}`}
                className="flex flex-wrap items-baseline gap-x-2 bg-muted/50 px-4 py-2.5 font-sans text-sm font-semibold sm:px-5"
              >
                {relativeDayLabel(offset)}
                <span className="font-normal text-muted-foreground">{formatDay(offset)}</span>
              </h2>
              <div
                role="region"
                aria-label={`Sample events, ${relativeDayLabel(offset)}`}
                tabIndex={0}
                className="relative overflow-x-auto"
              >
                <table className="w-full min-w-[600px] text-sm">
                  <thead className="sr-only">
                    <tr>
                      <th scope="col">Time (UTC)</th>
                      <th scope="col">Currency</th>
                      <th scope="col">Event</th>
                      <th scope="col">Impact</th>
                      <th scope="col">Actual</th>
                      <th scope="col">Forecast</th>
                      <th scope="col">Previous</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y">
                    {events.map((e) => (
                      <tr key={e.id}>
                        <td className="tabular w-16 px-4 py-3 font-mono text-xs sm:px-5">
                          {e.timeUtc}
                        </td>
                        <td className="w-14 px-2 py-3 font-semibold">{e.currency}</td>
                        <th scope="row" className="px-2 py-3 text-left font-normal">
                          {e.title}
                        </th>
                        <td className="w-24 px-2 py-3">
                          <ImpactBadge impact={e.impact} />
                        </td>
                        <td className="tabular w-24 px-2 py-3 text-right font-mono text-xs">
                          <span aria-hidden className="block text-[0.65rem] text-muted-foreground">
                            Actual
                          </span>
                          {e.actual ?? "—"}
                        </td>
                        <td className="tabular w-24 px-2 py-3 text-right font-mono text-xs">
                          <span aria-hidden className="block text-[0.65rem] text-muted-foreground">
                            Forecast
                          </span>
                          {e.forecast}
                        </td>
                        <td className="tabular w-24 px-4 py-3 text-right font-mono text-xs sm:px-5">
                          <span aria-hidden className="block text-[0.65rem] text-muted-foreground">
                            Previous
                          </span>
                          {e.previous}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>
          ))}
        </div>
      )}
    </div>
  );
}
