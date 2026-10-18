"use client";

import { useId } from "react";
import { cn } from "cn";
import { useSimulatedMarket } from "@/hooks/use-simulated-market";
import { getInstrument } from "@/lib/forex/instruments";
import { formatPrice, type Quote } from "@/lib/forex/market";
import { PriceChange } from "./price-change";
import { sparklinePoints, Sparkline } from "./sparkline";
import { UpdateControls } from "./update-controls";

const DEFAULT_SYMBOLS = ["EUR/USD", "GBP/USD", "USD/JPY", "XAU/USD", "US 500"] as const;

function AreaChart({ quote }: { quote: Quote }) {
  const id = useId();
  const width = 320;
  const height = 110;
  const points = sparklinePoints(quote.history, width, height, 6);
  const up = quote.history[quote.history.length - 1] >= quote.history[0];
  return (
    <svg
      aria-hidden
      viewBox={`0 0 ${width} ${height}`}
      preserveAspectRatio="none"
      className={cn("h-28 w-full", up ? "text-positive" : "text-negative")}
    >
      <defs>
        <linearGradient id={`${id}-fill`} x1="0" x2="0" y1="0" y2="1">
          <stop offset="0%" stopColor="currentColor" stopOpacity="0.28" />
          <stop offset="100%" stopColor="currentColor" stopOpacity="0" />
        </linearGradient>
      </defs>
      <polygon points={`0,${height} ${points} ${width},${height}`} fill={`url(#${id}-fill)`} />
      <polyline
        points={points}
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinejoin="round"
        vectorEffect="non-scaling-stroke"
      />
    </svg>
  );
}

/**
 * Hero price card: one featured instrument with a mini chart plus a short watchlist.
 * Prices come from the local seeded engine; updates never announce to screen readers.
 */
export function MarketTicker({
  symbols = DEFAULT_SYMBOLS,
  className,
}: {
  symbols?: readonly string[];
  className?: string;
}) {
  const market = useSimulatedMarket({ symbols, historyLength: 60 });
  const [featured, ...rest] = market.quotes;
  const featuredName = getInstrument(featured.symbol)?.name;

  return (
    <section
      aria-label="Simulated prices for selected instruments. Values change every few seconds and are not real market data."
      className={cn(
        "rounded-2xl border bg-card/80 p-4 text-card-foreground shadow-2xl shadow-black/20 backdrop-blur sm:p-5",
        className,
      )}
    >
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-sm font-semibold">{featured.symbol}</p>
          <p className="text-xs text-muted-foreground">{featuredName}</p>
        </div>
        <div className="text-right">
          <p className="tabular font-mono text-2xl font-semibold">
            {formatPrice(featured.mid, featured.digits)}
          </p>
          <PriceChange value={featured.changePercent} />
        </div>
      </div>
      <AreaChart quote={featured} />
      <dl className="grid grid-cols-3 gap-2 border-b pb-3 text-xs">
        <div>
          <dt className="text-muted-foreground">Bid</dt>
          <dd className="tabular font-mono font-medium">
            {formatPrice(featured.bid, featured.digits)}
          </dd>
        </div>
        <div>
          <dt className="text-muted-foreground">Ask</dt>
          <dd className="tabular font-mono font-medium">
            {formatPrice(featured.ask, featured.digits)}
          </dd>
        </div>
        <div>
          <dt className="text-muted-foreground">Spread</dt>
          <dd className="tabular font-mono font-medium">{featured.spreadPips.toFixed(1)}</dd>
        </div>
      </dl>
      <ul className="divide-y">
        {rest.map((quote) => (
          <li key={quote.symbol} className="flex items-center gap-3 py-2.5">
            <span className="w-20 shrink-0 text-sm font-medium">{quote.symbol}</span>
            <Sparkline values={quote.history} width={64} height={22} className="hidden sm:block" />
            <span className="tabular ml-auto font-mono text-sm">
              {formatPrice(quote.mid, quote.digits)}
            </span>
            <PriceChange value={quote.changePercent} className="w-16 justify-end" />
          </li>
        ))}
      </ul>
      <UpdateControls market={market} className="mt-3 border-t pt-3" />
    </section>
  );
}
