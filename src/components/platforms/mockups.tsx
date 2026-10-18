import type { ReactNode } from "react";
import { cn } from "cn";
import { Sparkline } from "@/components/markets/sparkline";
import { createMarket, formatPrice, formatSigned } from "@/lib/forex/market";
import { CandleChart } from "./candle-chart";

/*
 * Illustrative, non-functional terminal mockups. They are original layouts drawn in code from
 * the simulated engine, not copies of any real platform. Each one is a single labelled image
 * for assistive technology; nothing inside is focusable.
 */

const WATCHLIST = ["EUR/USD", "GBP/USD", "USD/JPY", "AUD/USD", "XAU/USD", "US 500", "Germany 40"];

function snapshot(symbols: readonly string[]) {
  return createMarket({ symbols, historyLength: 24 }).quotes;
}

function Chip({ children, active }: { children: ReactNode; active?: boolean }) {
  return (
    <span
      className={cn(
        "rounded-md px-2 py-0.5",
        active ? "bg-brand/20 text-brand-text" : "text-muted-foreground",
      )}
    >
      {children}
    </span>
  );
}

function MockupFigure({
  label,
  caption,
  children,
  className,
}: {
  label: string;
  caption: ReactNode;
  children: ReactNode;
  className?: string;
}) {
  return (
    <figure className={className}>
      <div role="img" aria-label={label}>
        <div aria-hidden className="pointer-events-none select-none">
          {children}
        </div>
      </div>
      <figcaption className="mt-3 text-center text-xs text-muted-foreground">{caption}</figcaption>
    </figure>
  );
}

export function WebTerminalMockup() {
  const quotes = snapshot(WATCHLIST);
  const eur = quotes[0];
  return (
    <MockupFigure
      label="Illustrative web trading terminal: a watchlist of simulated prices, a candlestick chart for EUR/USD and a non-functional order ticket."
      caption="Illustrative mockup built with SVG and CSS from simulated data. Not a working platform."
    >
      <div className="dark overflow-hidden rounded-2xl border bg-background text-foreground shadow-2xl shadow-black/30">
        <div className="flex items-center gap-2 border-b px-4 py-2.5">
          <span className="size-2.5 rounded-full bg-negative/80" />
          <span className="size-2.5 rounded-full bg-brand/80" />
          <span className="size-2.5 rounded-full bg-positive/80" />
          <span className="ml-3 truncate rounded-md bg-muted px-3 py-0.5 font-mono text-[0.65rem] text-muted-foreground">
            web-terminal.emmy-capital.example / demo
          </span>
        </div>
        <div className="grid text-xs md:grid-cols-[180px_1fr_200px]">
          <div className="hidden border-r md:block">
            <p className="border-b px-3 py-2 font-semibold">Watchlist</p>
            <ul>
              {quotes.map((q, i) => (
                <li
                  key={q.symbol}
                  className={cn(
                    "flex items-center justify-between px-3 py-1.5",
                    i === 0 && "bg-brand/10",
                  )}
                >
                  <span>{q.symbol}</span>
                  <span
                    className={cn(
                      "tabular font-mono",
                      q.change >= 0 ? "text-positive" : "text-negative",
                    )}
                  >
                    {formatPrice(q.mid, q.digits)}
                  </span>
                </li>
              ))}
            </ul>
          </div>
          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-1 border-b px-3 py-2">
              <span className="mr-2 font-semibold">EUR/USD</span>
              {["1m", "5m", "15m", "1h", "4h", "1D"].map((tf) => (
                <Chip key={tf} active={tf === "1h"}>
                  {tf}
                </Chip>
              ))}
              <span className="tabular ml-auto font-mono text-muted-foreground">
                {formatPrice(eur.mid, eur.digits)}
              </span>
            </div>
            <div className="h-52 p-2 sm:h-64">
              <CandleChart symbol="EUR/USD" count={56} />
            </div>
          </div>
          <div className="space-y-3 border-t p-3 md:border-t-0 md:border-l">
            <p className="font-semibold">Order ticket (demo)</p>
            <div className="grid grid-cols-2 gap-2">
              <span className="rounded-lg bg-negative/20 p-2 text-center">
                <span className="block text-[0.65rem] text-muted-foreground">Sell</span>
                <span className="tabular font-mono text-sm font-semibold">
                  {formatPrice(eur.bid, eur.digits)}
                </span>
              </span>
              <span className="rounded-lg bg-positive/20 p-2 text-center">
                <span className="block text-[0.65rem] text-muted-foreground">Buy</span>
                <span className="tabular font-mono text-sm font-semibold">
                  {formatPrice(eur.ask, eur.digits)}
                </span>
              </span>
            </div>
            {[
              ["Volume", "0.10 lots"],
              ["Stop-loss", "25 pips"],
              ["Take-profit", "50 pips"],
            ].map(([k, v]) => (
              <div key={k} className="flex justify-between rounded-md border px-2 py-1.5">
                <span className="text-muted-foreground">{k}</span>
                <span className="font-mono">{v}</span>
              </div>
            ))}
            <span className="block rounded-lg bg-muted py-2 text-center font-semibold text-muted-foreground">
              Orders disabled in demo
            </span>
          </div>
        </div>
      </div>
    </MockupFigure>
  );
}

export function DesktopMockup() {
  const charts = ["GBP/USD", "USD/JPY", "XAU/USD", "US 500"];
  return (
    <MockupFigure
      label="Illustrative desktop application: four simulated candlestick charts in a grid above a sample positions panel."
      caption="Illustrative desktop layout. Sample positions are invented."
    >
      <div className="dark overflow-hidden rounded-xl border bg-background text-foreground shadow-xl shadow-black/20">
        <div className="flex items-center justify-between border-b px-3 py-2 text-[0.65rem] text-muted-foreground">
          <span>Emmy Capital Desktop (concept)</span>
          <span>— ▢ ✕</span>
        </div>
        <div className="grid grid-cols-2 gap-px bg-border">
          {charts.map((symbol, i) => (
            <div key={symbol} className="bg-background p-2">
              <p className="text-[0.65rem] font-semibold">{symbol}</p>
              <div className="h-20 sm:h-24">
                <CandleChart symbol={symbol} count={32} seed={1000 + i} showGrid={false} />
              </div>
            </div>
          ))}
        </div>
        <table className="w-full border-t text-[0.65rem]">
          <thead className="text-muted-foreground">
            <tr>
              <th className="px-3 py-1.5 text-left font-medium">Sample position</th>
              <th className="px-3 py-1.5 text-right font-medium">Size</th>
              <th className="px-3 py-1.5 text-right font-medium">P/L (sim.)</th>
            </tr>
          </thead>
          <tbody>
            {[
              ["EUR/USD buy", "0.10", 12.4],
              ["XAU/USD sell", "0.02", -6.1],
            ].map(([name, size, pl]) => (
              <tr key={String(name)} className="border-t">
                <td className="px-3 py-1.5">{name}</td>
                <td className="px-3 py-1.5 text-right font-mono">{size}</td>
                <td
                  className={cn(
                    "px-3 py-1.5 text-right font-mono",
                    Number(pl) >= 0 ? "text-positive" : "text-negative",
                  )}
                >
                  {formatSigned(Number(pl), 2)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </MockupFigure>
  );
}

export function MobileMockup() {
  const quotes = snapshot(["EUR/USD", "GBP/USD", "USD/JPY", "XAU/USD", "UK 100"]);
  return (
    <MockupFigure
      label="Illustrative mobile app: a phone showing a list of simulated quotes with small trend lines and a chart."
      caption="Illustrative mobile layout."
      className="mx-auto w-full max-w-[260px]"
    >
      <div className="dark rounded-[2.2rem] border-4 border-zinc-700 bg-background p-3 text-foreground shadow-xl shadow-black/30">
        <div className="mx-auto mb-3 h-1.5 w-16 rounded-full bg-muted" />
        <p className="px-1 text-sm font-semibold">Quotes</p>
        <p className="px-1 text-[0.6rem] text-brand-text">Simulated prices</p>
        <ul className="mt-2 divide-y text-xs">
          {quotes.map((q) => (
            <li key={q.symbol} className="flex items-center gap-2 px-1 py-2">
              <span className="w-14 font-medium">{q.symbol}</span>
              <Sparkline values={q.history} width={48} height={18} />
              <span className="tabular ml-auto font-mono">{formatPrice(q.mid, q.digits)}</span>
            </li>
          ))}
        </ul>
        <div className="mt-2 h-24 rounded-xl bg-muted/50 p-1">
          <CandleChart symbol="EUR/USD" count={24} seed={77} showGrid={false} />
        </div>
        <div className="mt-3 grid grid-cols-2 gap-2 text-center text-xs font-semibold">
          <span className="rounded-lg bg-negative/25 py-2">Sell</span>
          <span className="rounded-lg bg-positive/25 py-2">Buy</span>
        </div>
      </div>
    </MockupFigure>
  );
}
