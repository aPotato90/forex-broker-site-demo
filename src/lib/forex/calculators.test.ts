import { describe, expect, it } from "vitest";
import {
  getPipSize,
  marginRequired,
  pipValue,
  positionSize,
  profitLoss,
  splitPair,
  usdPerUnit,
} from "./calculators";
import { floorTo, roundTo } from "./math";

describe("roundTo / floorTo", () => {
  it("rounds half away from zero without float drift", () => {
    expect(roundTo(1.005, 2)).toBe(1.01);
    expect(roundTo(2.675, 2)).toBe(2.68);
    expect(roundTo(-1.005, 2)).toBe(-1.01);
    expect(roundTo(0.1 + 0.2, 2)).toBe(0.3);
    expect(roundTo(1.23456, 0)).toBe(1);
  });

  it("floors towards zero", () => {
    expect(floorTo(1.239, 2)).toBe(1.23);
    expect(floorTo(0.29, 2)).toBe(0.29);
    expect(floorTo(-1.239, 2)).toBe(-1.23);
  });

  it("passes through non-finite values", () => {
    expect(roundTo(Number.NaN, 2)).toBeNaN();
    expect(floorTo(Number.POSITIVE_INFINITY, 2)).toBe(Number.POSITIVE_INFINITY);
  });
});

describe("pairs and pip sizes", () => {
  it("splits valid pairs only", () => {
    expect(splitPair("EUR/USD")).toEqual({ base: "EUR", quote: "USD" });
    expect(splitPair("EURUSD")).toBeNull();
    expect(splitPair("eur/usd")).toBeNull();
  });

  it("uses 0.01 for JPY-quoted pairs and 0.0001 otherwise", () => {
    expect(getPipSize("EUR/USD")).toBe(0.0001);
    expect(getPipSize("USD/JPY")).toBe(0.01);
    expect(getPipSize("GBP/JPY")).toBe(0.01);
    expect(getPipSize("bad")).toBeNull();
  });

  it("converts currencies to USD from the pair price or reference rates", () => {
    expect(usdPerUnit("USD", "USD/JPY", 150)).toBe(1);
    expect(usdPerUnit("EUR", "EUR/USD", 1.1)).toBe(1.1);
    expect(usdPerUnit("JPY", "USD/JPY", 150)).toBeCloseTo(1 / 150, 10);
    expect(usdPerUnit("GBP", "EUR/GBP", 0.85)).toBe(1.2671);
    expect(usdPerUnit("EUR", "EUR/USD", 0)).toBeNull();
    expect(usdPerUnit("XXX", "EUR/GBP", 0.85)).toBeNull();
  });
});

describe("pipValue", () => {
  it("is $10 per standard lot on USD-quoted pairs", () => {
    expect(pipValue({ pair: "EUR/USD", lots: 1, price: 1.0842 })).toBe(10);
    expect(pipValue({ pair: "GBP/USD", lots: 0.1, price: 1.27 })).toBe(1);
  });

  it("converts JPY-quoted pip values through the price", () => {
    // 0.01 * 100,000 = 1,000 JPY per pip; at 150.00 that is $6.67.
    expect(pipValue({ pair: "USD/JPY", lots: 1, price: 150 })).toBe(6.67);
  });

  it("converts USD-base pairs through the price", () => {
    // 10 CAD per pip at 1.35 CAD per USD.
    expect(pipValue({ pair: "USD/CAD", lots: 1, price: 1.35 })).toBe(7.41);
  });

  it("uses reference rates for crosses", () => {
    expect(pipValue({ pair: "EUR/GBP", lots: 1, price: 0.85 })).toBe(12.67);
    expect(pipValue({ pair: "GBP/JPY", lots: 1, price: 190 })).toBe(6.6);
  });

  it("handles zero and invalid inputs", () => {
    expect(pipValue({ pair: "EUR/USD", lots: 0, price: 1.08 })).toBe(0);
    expect(pipValue({ pair: "EUR/USD", lots: -1, price: 1.08 })).toBeNull();
    expect(pipValue({ pair: "USD/JPY", lots: 1, price: 0 })).toBeNull();
    expect(pipValue({ pair: "EUR/USD", lots: Number.NaN, price: 1.08 })).toBeNull();
    expect(pipValue({ pair: "NOPE", lots: 1, price: 1 })).toBeNull();
  });
});

describe("positionSize", () => {
  it("sizes a USD-quoted trade from risk and stop distance", () => {
    // Risk $100 (1% of $10,000) over 20 pips at $10/pip/lot = 0.5 lots.
    expect(
      positionSize({
        balance: 10_000,
        riskPercent: 1,
        stopLossPips: 20,
        pair: "EUR/USD",
        price: 1.08,
      }),
    ).toEqual({ riskAmount: 100, lots: 0.5, units: 50_000, pipValue: 5 });
  });

  it("sizes a JPY-quoted trade with the 0.01 pip", () => {
    // $6.6667 per pip per lot at 150; $200 / (25 * 6.6667) = 1.2 lots.
    const result = positionSize({
      balance: 20_000,
      riskPercent: 1,
      stopLossPips: 25,
      pair: "USD/JPY",
      price: 150,
    });
    expect(result).toEqual({ riskAmount: 200, lots: 1.2, units: 120_000, pipValue: 8 });
  });

  it("rounds down to micro lots so risk is never exceeded", () => {
    // $50 / (30 pips * $10) = 0.1666… -> 0.16 lots.
    const result = positionSize({
      balance: 5_000,
      riskPercent: 1,
      stopLossPips: 30,
      pair: "EUR/USD",
      price: 1.08,
    })!;
    expect(result.lots).toBe(0.16);
    expect(result.lots * 30 * 10).toBeLessThanOrEqual(result.riskAmount);
  });

  it("returns zero size for a zero balance or zero risk", () => {
    expect(
      positionSize({ balance: 0, riskPercent: 1, stopLossPips: 10, pair: "EUR/USD", price: 1.08 })
        ?.lots,
    ).toBe(0);
    expect(
      positionSize({
        balance: 1000,
        riskPercent: 0,
        stopLossPips: 10,
        pair: "EUR/USD",
        price: 1.08,
      })?.lots,
    ).toBe(0);
  });

  it("rejects invalid inputs", () => {
    const base = { balance: 1000, riskPercent: 1, stopLossPips: 10, pair: "EUR/USD", price: 1.08 };
    expect(positionSize({ ...base, stopLossPips: 0 })).toBeNull();
    expect(positionSize({ ...base, stopLossPips: -5 })).toBeNull();
    expect(positionSize({ ...base, balance: -1 })).toBeNull();
    expect(positionSize({ ...base, riskPercent: 101 })).toBeNull();
    expect(positionSize({ ...base, riskPercent: Number.NaN })).toBeNull();
    expect(positionSize({ ...base, price: 0 })).toBeNull();
    expect(positionSize({ ...base, pair: "BAD" })).toBeNull();
  });
});

describe("marginRequired", () => {
  it("uses the price for base-currency notional on USD-quoted pairs", () => {
    // 1 lot EUR/USD at 1.10 = $110,000 notional; 1:30 -> $3,666.67.
    expect(marginRequired({ pair: "EUR/USD", lots: 1, price: 1.1, leverage: 30 })).toEqual({
      notional: 110_000,
      margin: 3666.67,
    });
  });

  it("needs no conversion for USD-base pairs, including JPY", () => {
    expect(marginRequired({ pair: "USD/JPY", lots: 0.5, price: 150, leverage: 20 })).toEqual({
      notional: 50_000,
      margin: 2500,
    });
  });

  it("uses reference rates for crosses", () => {
    expect(marginRequired({ pair: "EUR/JPY", lots: 1, price: 164, leverage: 30 })?.notional).toBe(
      108_420,
    );
  });

  it("handles zero and invalid inputs", () => {
    expect(marginRequired({ pair: "EUR/USD", lots: 0, price: 1.1, leverage: 30 })?.margin).toBe(0);
    expect(marginRequired({ pair: "EUR/USD", lots: 1, price: 1.1, leverage: 0 })).toBeNull();
    expect(marginRequired({ pair: "EUR/USD", lots: -1, price: 1.1, leverage: 30 })).toBeNull();
    expect(marginRequired({ pair: "EUR/USD", lots: 1, price: -1, leverage: 30 })).toBeNull();
  });
});

describe("profitLoss", () => {
  it("computes a winning buy and a losing sell on EUR/USD", () => {
    expect(
      profitLoss({ pair: "EUR/USD", direction: "buy", entry: 1.08, exit: 1.085, lots: 1 }),
    ).toEqual({ pips: 50, profit: 500 });
    expect(
      profitLoss({ pair: "EUR/USD", direction: "sell", entry: 1.08, exit: 1.085, lots: 1 }),
    ).toEqual({ pips: -50, profit: -500 });
  });

  it("uses the 0.01 pip and converts JPY profit at the exit price", () => {
    // 0.5 yen move = 50 pips; 0.5 * 100,000 = 50,000 JPY / 150.5 = $332.23.
    expect(
      profitLoss({ pair: "USD/JPY", direction: "buy", entry: 150, exit: 150.5, lots: 1 }),
    ).toEqual({ pips: 50, profit: 332.23 });
  });

  it("returns zero when entry equals exit or size is zero", () => {
    expect(
      profitLoss({ pair: "EUR/USD", direction: "sell", entry: 1.08, exit: 1.08, lots: 1 }),
    ).toEqual({ pips: 0, profit: 0 });
    expect(
      profitLoss({ pair: "EUR/USD", direction: "buy", entry: 1.08, exit: 1.09, lots: 0 })?.profit,
    ).toBe(0);
  });

  it("rejects invalid inputs", () => {
    const base = { pair: "EUR/USD", direction: "buy" as const, entry: 1.08, exit: 1.09, lots: 1 };
    expect(profitLoss({ ...base, entry: 0 })).toBeNull();
    expect(profitLoss({ ...base, exit: Number.NaN })).toBeNull();
    expect(profitLoss({ ...base, lots: -0.1 })).toBeNull();
    expect(profitLoss({ ...base, pair: "XAUUSD" })).toBeNull();
    // @ts-expect-error -- runtime guard for an invalid direction
    expect(profitLoss({ ...base, direction: "hold" })).toBeNull();
  });
});
