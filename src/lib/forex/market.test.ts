import { describe, expect, it } from "vitest";
import { INSTRUMENTS, getInstrument } from "./instruments";
import { roundTo } from "./math";
import {
  createMarket,
  formatPrice,
  formatSigned,
  generateCandles,
  nextRandom,
  stepMarket,
  type MarketState,
} from "./market";

const SEED = 42;

function decimals(value: number): number {
  const [, fraction = ""] = String(value).split(".");
  return fraction.length;
}

function run(state: MarketState, ticks: number): MarketState {
  let s = state;
  for (let i = 0; i < ticks; i++) s = stepMarket(s);
  return s;
}

describe("nextRandom", () => {
  it("is deterministic and returns values in [0, 1)", () => {
    let state = SEED;
    const values: number[] = [];
    for (let i = 0; i < 1000; i++) {
      const r = nextRandom(state);
      state = r.state;
      values.push(r.value);
    }
    expect(values.every((v) => v >= 0 && v < 1)).toBe(true);
    expect(nextRandom(SEED)).toEqual(nextRandom(SEED));
    expect(new Set(values).size).toBeGreaterThan(990);
  });
});

describe("createMarket", () => {
  it("produces identical output for the same seed", () => {
    expect(createMarket({ seed: SEED })).toEqual(createMarket({ seed: SEED }));
  });

  it("produces different output for a different seed", () => {
    const a = createMarket({ seed: SEED }).quotes[0];
    const b = createMarket({ seed: SEED + 1 }).quotes[0];
    expect(a.mid).not.toBe(b.mid);
  });

  it("matches a fixed-seed snapshot for EUR/USD", () => {
    const quote = createMarket({ seed: SEED, symbols: ["EUR/USD"], historyLength: 5 }).quotes[0];
    expect(quote).toMatchInlineSnapshot(`
      {
        "ask": 1.08365,
        "bid": 1.08358,
        "change": -0.00021,
        "changePercent": -0.02,
        "digits": 5,
        "direction": 0,
        "high": 1.08383,
        "history": [
          1.083827,
          1.083817,
          1.083705,
          1.083641,
          1.083618,
        ],
        "low": 1.08362,
        "mid": 1.08362,
        "open": 1.08383,
        "spreadPips": 0.7,
        "symbol": "EUR/USD",
      }
    `);
  });

  it("uses realistic precision per instrument", () => {
    const market = createMarket({ seed: SEED });
    const bySymbol = Object.fromEntries(market.quotes.map((q) => [q.symbol, q]));
    expect(bySymbol["EUR/USD"].digits).toBe(5);
    expect(bySymbol["USD/JPY"].digits).toBe(3);
    expect(bySymbol["GBP/JPY"].digits).toBe(3);
    expect(bySymbol["XAU/USD"].digits).toBe(2);
    expect(bySymbol["US 500"].digits).toBe(2);
    for (const quote of run(market, 25).quotes) {
      expect(decimals(quote.bid)).toBeLessThanOrEqual(quote.digits);
      expect(decimals(quote.ask)).toBeLessThanOrEqual(quote.digits);
    }
  });

  it("keeps ask above bid with a spread near the typical value", () => {
    const market = run(createMarket({ seed: SEED }), 50);
    for (const quote of market.quotes) {
      const instrument = getInstrument(quote.symbol)!;
      expect(quote.ask).toBeGreaterThan(quote.bid);
      expect(quote.spreadPips).toBeGreaterThan(0);
      expect(quote.spreadPips).toBeLessThanOrEqual(instrument.spreadPips * 1.3);
      expect(quote.spreadPips).toBeGreaterThanOrEqual(instrument.spreadPips * 0.5);
    }
  });

  it("builds history of the requested length with the open at the start", () => {
    const market = createMarket({ seed: SEED, historyLength: 30 });
    for (const quote of market.quotes) {
      expect(quote.history).toHaveLength(30);
      expect(quote.open).toBe(roundTo(quote.history[0], quote.digits));
      expect(quote.high).toBeGreaterThanOrEqual(quote.low);
    }
  });

  it("rejects unknown symbols", () => {
    expect(() => createMarket({ symbols: ["ABC/XYZ"] })).toThrow(/Unknown instrument/);
  });
});

describe("stepMarket", () => {
  it("is pure: does not mutate its input", () => {
    const market = createMarket({ seed: SEED });
    const snapshot = structuredClone(market);
    stepMarket(market);
    expect(market).toEqual(snapshot);
  });

  it("is deterministic and advances the tick", () => {
    const market = createMarket({ seed: SEED });
    const a = stepMarket(market);
    expect(a).toEqual(stepMarket(market));
    expect(a.tick).toBe(1);
    expect(a.rngState).not.toBe(market.rngState);
  });

  it("scrolls history and computes daily change from the open", () => {
    const market = createMarket({ seed: SEED, historyLength: 10 });
    const next = stepMarket(market);
    next.quotes.forEach((quote, i) => {
      expect(quote.history).toHaveLength(10);
      expect(quote.history.slice(0, 9)).toEqual(market.quotes[i].history.slice(1));
      expect(quote.open).toBe(market.quotes[i].open);
      expect(quote.change).toBeCloseTo(quote.mid - quote.open, quote.digits);
    });
  });

  it("reports tick direction", () => {
    const next = stepMarket(createMarket({ seed: SEED }));
    for (const quote of next.quotes) {
      const [prev, last] = quote.history.slice(-2);
      expect(quote.direction).toBe(last > prev ? 1 : last < prev ? -1 : 0);
    }
  });

  it("stays within a plausible band of the reference price over many ticks", () => {
    const market = run(createMarket({ seed: SEED }), 2000);
    for (const quote of market.quotes) {
      const base = getInstrument(quote.symbol)!.basePrice;
      expect(Math.abs(quote.mid - base) / base).toBeLessThan(0.02);
    }
  });
});

describe("generateCandles", () => {
  it("creates deterministic, internally consistent candles", () => {
    const candles = generateCandles("EUR/USD", 40, SEED);
    expect(candles).toHaveLength(40);
    expect(candles).toEqual(generateCandles("EUR/USD", 40, SEED));
    for (const c of candles) {
      expect(c.high).toBeGreaterThanOrEqual(Math.max(c.open, c.close));
      expect(c.low).toBeLessThanOrEqual(Math.min(c.open, c.close));
    }
    for (let i = 1; i < candles.length; i++) {
      expect(candles[i].open).toBeCloseTo(candles[i - 1].close, 5);
    }
  });

  it("handles zero and negative counts", () => {
    expect(generateCandles("XAU/USD", 0)).toEqual([]);
    expect(generateCandles("XAU/USD", -5)).toEqual([]);
  });
});

describe("formatting", () => {
  it("formats prices with fixed digits", () => {
    expect(formatPrice(1.2, 5)).toBe("1.20000");
    expect(formatPrice(18187.6, 2)).toBe("18,187.60");
  });

  it("formats signed values with a true minus sign", () => {
    expect(formatSigned(0.12, 2, "%")).toBe("+0.12%");
    expect(formatSigned(-0.5, 1)).toBe("−0.5");
    expect(formatSigned(0, 2)).toBe("0.00");
  });
});

describe("instrument catalogue", () => {
  it("has unique symbols across all categories", () => {
    const symbols = INSTRUMENTS.map((i) => i.symbol);
    expect(new Set(symbols).size).toBe(symbols.length);
    expect(new Set(INSTRUMENTS.map((i) => i.category))).toEqual(
      new Set(["forex", "metals", "indices"]),
    );
  });
});
