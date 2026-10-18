import { describe, expect, it } from "vitest";
import { CALENDAR_EVENTS } from "@/data/calendar";
import { dateFromOffset, filterEvents, groupByDay, inRange, relativeDayLabel } from "./calendar";

const ALL_IMPACTS = ["high", "medium", "low"] as const;

describe("calendar helpers", () => {
  it("matches ranges by day offset", () => {
    expect(inRange(0, "today")).toBe(true);
    expect(inRange(1, "today")).toBe(false);
    expect(inRange(-1, "yesterday")).toBe(true);
    expect(inRange(6, "next7")).toBe(true);
    expect(inRange(7, "next7")).toBe(false);
    expect(inRange(-30, "all")).toBe(true);
  });

  it("filters by range, impact and currency and sorts chronologically", () => {
    const result = filterEvents(CALENDAR_EVENTS, {
      range: "next7",
      impacts: ["high"],
      currencies: ["USD"],
    });
    expect(result.length).toBeGreaterThan(0);
    expect(result.every((e) => e.impact === "high" && e.currency === "USD")).toBe(true);
    const keys = result.map((e) => `${e.dayOffset}-${e.timeUtc}`);
    expect(keys).toEqual([...keys].sort((a, b) => parseInt(a) - parseInt(b) || a.localeCompare(b)));
  });

  it("treats an empty currency list as all currencies", () => {
    expect(
      filterEvents(CALENDAR_EVENTS, { range: "all", impacts: ALL_IMPACTS, currencies: [] }),
    ).toHaveLength(CALENDAR_EVENTS.length);
    expect(
      filterEvents(CALENDAR_EVENTS, { range: "all", impacts: [], currencies: [] }),
    ).toHaveLength(0);
  });

  it("groups by day in order", () => {
    const sorted = filterEvents(CALENDAR_EVENTS, {
      range: "all",
      impacts: ALL_IMPACTS,
      currencies: [],
    });
    const offsets = groupByDay(sorted).map(([offset]) => offset);
    expect(offsets).toEqual([...new Set(sorted.map((e) => e.dayOffset))]);
  });

  it("labels days relative to today", () => {
    expect(relativeDayLabel(0)).toBe("Today");
    expect(relativeDayLabel(1)).toBe("Tomorrow");
    expect(relativeDayLabel(-1)).toBe("Yesterday");
    expect(relativeDayLabel(4)).toBe("In 4 days");
    expect(relativeDayLabel(-3)).toBe("3 days ago");
  });

  it("computes dates across month boundaries", () => {
    const d = dateFromOffset(new Date(2026, 0, 30), 3);
    expect([d.getFullYear(), d.getMonth(), d.getDate()]).toEqual([2026, 1, 2]);
  });

  it("only gives past events an actual value", () => {
    for (const e of CALENDAR_EVENTS) {
      if (e.actual !== undefined) expect(e.dayOffset).toBeLessThan(0);
    }
  });
});
