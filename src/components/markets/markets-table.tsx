"use client";

import { ArrowDownIcon, ArrowUpDownIcon, ArrowUpIcon, SearchIcon } from "lucide-react";
import { useMemo, useState } from "react";
import { cn } from "cn";
import { Input } from "@/components/ui/input";
import { useSimulatedMarket } from "@/hooks/use-simulated-market";
import {
  CATEGORY_LABELS,
  INSTRUMENTS,
  type Instrument,
  type InstrumentCategory,
} from "@/lib/forex/instruments";
import { formatPrice, type Quote } from "@/lib/forex/market";
import { PriceChange } from "./price-change";
import { Sparkline } from "./sparkline";
import { UpdateControls } from "./update-controls";

type SortKey = "symbol" | "bid" | "spread" | "change";
type SortDirection = "ascending" | "descending";
type CategoryFilter = InstrumentCategory | "all";

const FILTERS: { value: CategoryFilter; label: string }[] = [
  { value: "all", label: "All" },
  ...(Object.keys(CATEGORY_LABELS) as InstrumentCategory[]).map((value) => ({
    value,
    label: CATEGORY_LABELS[value],
  })),
];

const instrumentBySymbol = new Map(INSTRUMENTS.map((i) => [i.symbol, i]));

interface Row {
  quote: Quote;
  instrument: Instrument;
}

function compareRows(a: Row, b: Row, key: SortKey): number {
  switch (key) {
    case "symbol":
      return a.quote.symbol.localeCompare(b.quote.symbol);
    case "bid":
      return a.quote.bid - b.quote.bid;
    case "spread":
      return a.quote.spreadPips - b.quote.spreadPips;
    case "change":
      return a.quote.changePercent - b.quote.changePercent;
  }
}

function SortHeader({
  label,
  sortKey,
  sort,
  onSort,
  className,
}: {
  label: string;
  sortKey: SortKey;
  sort: { key: SortKey; direction: SortDirection } | null;
  onSort: (key: SortKey) => void;
  className?: string;
}) {
  const active = sort?.key === sortKey;
  const Icon = !active
    ? ArrowUpDownIcon
    : sort.direction === "ascending"
      ? ArrowUpIcon
      : ArrowDownIcon;
  return (
    <th
      scope="col"
      aria-sort={active ? sort.direction : "none"}
      className={cn("px-3 py-2 font-medium", className)}
    >
      <button
        type="button"
        onClick={() => onSort(sortKey)}
        className={cn(
          "inline-flex min-h-9 items-center gap-1 rounded-md px-1 hover:text-foreground",
          active ? "text-foreground" : "text-muted-foreground",
        )}
      >
        {label}
        <Icon aria-hidden className="size-3.5" />
        <span className="sr-only">
          {active
            ? `, sorted ${sort.direction}. Activate to reverse.`
            : ", not sorted. Activate to sort."}
        </span>
      </button>
    </th>
  );
}

export function MarketsTable() {
  const market = useSimulatedMarket({ historyLength: 40 });
  const [category, setCategory] = useState<CategoryFilter>("all");
  const [query, setQuery] = useState("");
  const [sort, setSort] = useState<{ key: SortKey; direction: SortDirection } | null>(null);

  const rows = useMemo(() => {
    const q = query.trim().toLowerCase();
    const filtered: Row[] = market.quotes
      .map((quote) => ({ quote, instrument: instrumentBySymbol.get(quote.symbol)! }))
      .filter(({ instrument }) => category === "all" || instrument.category === category)
      .filter(
        ({ instrument }) =>
          !q ||
          instrument.symbol.toLowerCase().includes(q) ||
          instrument.name.toLowerCase().includes(q),
      );
    if (!sort) return filtered;
    const factor = sort.direction === "ascending" ? 1 : -1;
    return [...filtered].sort((a, b) => compareRows(a, b, sort.key) * factor);
  }, [market.quotes, category, query, sort]);

  function onSort(key: SortKey) {
    setSort((current) =>
      current?.key === key
        ? { key, direction: current.direction === "ascending" ? "descending" : "ascending" }
        : { key, direction: key === "symbol" ? "ascending" : "descending" },
    );
  }

  return (
    <div className="rounded-2xl border bg-card text-card-foreground shadow-xs">
      <div className="flex flex-col gap-4 border-b p-4 sm:p-5 lg:flex-row lg:items-center lg:justify-between">
        <div
          role="group"
          aria-label="Filter by category"
          className="inline-flex w-full flex-wrap gap-1 rounded-xl bg-muted p-1 sm:w-auto"
        >
          {FILTERS.map((filter) => (
            <button
              key={filter.value}
              type="button"
              aria-pressed={category === filter.value}
              onClick={() => setCategory(filter.value)}
              className="min-h-9 flex-1 rounded-lg px-3 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground aria-pressed:bg-background aria-pressed:text-foreground aria-pressed:shadow-sm sm:flex-none"
            >
              {filter.label}
            </button>
          ))}
        </div>
        <div className="relative w-full lg:max-w-xs">
          <label htmlFor="market-search" className="sr-only">
            Search instruments
          </label>
          <SearchIcon
            aria-hidden
            className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground"
          />
          <Input
            id="market-search"
            type="search"
            placeholder="Search, e.g. EUR or gold"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="h-10 pl-9"
          />
        </div>
      </div>

      <div
        role="region"
        aria-label="Simulated instruments table (scrolls horizontally on small screens)"
        tabIndex={0}
        className="relative overflow-x-auto focus-visible:outline-offset-[-2px]"
      >
        <table className="w-full min-w-[640px] text-sm">
          <caption className="sr-only">
            Simulated prices for fictional demo instruments. Values update every few seconds and are
            not real market data. Use the column buttons to sort.
          </caption>
          <thead className="border-b bg-muted/40 text-left text-xs tracking-wide">
            <tr>
              <SortHeader
                label="Instrument"
                sortKey="symbol"
                sort={sort}
                onSort={onSort}
                className="sticky left-0 z-10 bg-[color-mix(in_oklch,var(--muted)_40%,var(--card))]"
              />
              <SortHeader
                label="Bid"
                sortKey="bid"
                sort={sort}
                onSort={onSort}
                className="text-right"
              />
              <th scope="col" className="px-3 py-2 text-right font-medium text-muted-foreground">
                Ask
              </th>
              <SortHeader
                label="Spread"
                sortKey="spread"
                sort={sort}
                onSort={onSort}
                className="text-right"
              />
              <SortHeader
                label="Change"
                sortKey="change"
                sort={sort}
                onSort={onSort}
                className="text-right"
              />
              <th scope="col" className="px-3 py-2 font-medium text-muted-foreground">
                Trend
              </th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {rows.map(({ quote, instrument }) => (
              <tr key={quote.symbol} className="transition-colors hover:bg-muted/40">
                <th
                  scope="row"
                  className="sticky left-0 z-10 bg-card px-3 py-3 text-left font-normal"
                >
                  <span className="block font-semibold">{quote.symbol}</span>
                  <span className="block max-w-[11rem] truncate text-xs text-muted-foreground sm:max-w-none">
                    {instrument.name}
                  </span>
                </th>
                <td className="tabular px-3 py-3 text-right font-mono">
                  {formatPrice(quote.bid, quote.digits)}
                </td>
                <td className="tabular px-3 py-3 text-right font-mono">
                  {formatPrice(quote.ask, quote.digits)}
                </td>
                <td className="tabular px-3 py-3 text-right font-mono">
                  {quote.spreadPips.toFixed(1)}
                  <span className="sr-only">
                    {" "}
                    {instrument.category === "indices" ? "points" : "pips"}
                  </span>
                </td>
                <td className="px-3 py-3 text-right">
                  <PriceChange value={quote.changePercent} className="justify-end" />
                </td>
                <td className="px-3 py-3">
                  <Sparkline values={quote.history} />
                </td>
              </tr>
            ))}
            {rows.length === 0 && (
              <tr>
                <td colSpan={6} className="px-3 py-10 text-center text-muted-foreground">
                  No simulated instruments match “{query}”.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <div className="flex flex-col gap-3 border-t p-4 sm:p-5">
        <UpdateControls market={market} />
        <p className="text-xs text-muted-foreground">
          Showing {rows.length} of {market.quotes.length} instruments. Spread is in pips for forex
          and metals and in points for indices. Change is measured from the simulated session open.
        </p>
      </div>
    </div>
  );
}
