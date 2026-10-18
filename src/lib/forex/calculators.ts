/**
 * Educational forex calculators. Pure functions: every input is explicit and nothing is fetched.
 *
 * Conventions and assumptions (shown to users beside each calculator):
 * - The account currency is USD.
 * - One standard lot is 100,000 units of the base currency.
 * - A pip is 0.0001 for most pairs and 0.01 for JPY-quoted pairs.
 * - Functions return `null` when the inputs cannot produce a meaningful result
 *   (non-finite numbers, negative sizes, zero divisors, unknown pairs).
 */
import { floorTo, isPositiveNumber, roundTo } from "./math";

export const STANDARD_LOT_UNITS = 100_000;
export const ACCOUNT_CURRENCY = "USD";

/** Major and cross pairs supported by the calculators. */
export const CALCULATOR_PAIRS = [
  "EUR/USD",
  "GBP/USD",
  "AUD/USD",
  "NZD/USD",
  "USD/JPY",
  "USD/CHF",
  "USD/CAD",
  "EUR/GBP",
  "EUR/JPY",
  "GBP/JPY",
] as const;

export type CalculatorPair = (typeof CALCULATOR_PAIRS)[number];

/**
 * Illustrative USD value of one unit of each currency, used only to convert crosses into the
 * account currency. Fixed, fictional reference rates — not market data.
 */
export const REFERENCE_USD_RATES: Readonly<Record<string, number>> = {
  USD: 1,
  EUR: 1.0842,
  GBP: 1.2671,
  AUD: 0.6578,
  NZD: 0.6043,
  JPY: 1 / 151.42,
  CHF: 1 / 0.8836,
  CAD: 1 / 1.3592,
};

export function splitPair(pair: string): { base: string; quote: string } | null {
  const match = /^([A-Z]{3})\/([A-Z]{3})$/.exec(pair);
  if (!match) return null;
  return { base: match[1], quote: match[2] };
}

export function getPipSize(pair: string): number | null {
  const parts = splitPair(pair);
  if (!parts) return null;
  return parts.quote === "JPY" ? 0.01 : 0.0001;
}

/**
 * USD value of one unit of `currency`, given the pair's current price.
 * The pair's own price is used when it involves USD; otherwise the reference table is used.
 */
export function usdPerUnit(currency: string, pair: string, price: number): number | null {
  const parts = splitPair(pair);
  if (!parts || !isPositiveNumber(price)) return null;
  if (currency === "USD") return 1;
  if (parts.quote === "USD" && currency === parts.base) return price;
  if (parts.base === "USD" && currency === parts.quote) return 1 / price;
  return REFERENCE_USD_RATES[currency] ?? null;
}

export interface PipValueInput {
  pair: string;
  /** Position size in lots (1 = 100,000 units). */
  lots: number;
  /** Current price of the pair, used for USD conversion. */
  price: number;
}

/** Value of a one-pip move in the account currency (USD), rounded to cents. */
export function pipValue({ pair, lots, price }: PipValueInput): number | null {
  const parts = splitPair(pair);
  const pip = getPipSize(pair);
  if (!parts || pip === null || !Number.isFinite(lots) || lots < 0) return null;
  const quoteUsd = usdPerUnit(parts.quote, pair, price);
  if (quoteUsd === null) return null;
  return roundTo(pip * lots * STANDARD_LOT_UNITS * quoteUsd, 2);
}

/** Unrounded pip value of one standard lot, used internally for sizing. */
function pipValuePerLot(pair: string, price: number): number | null {
  const parts = splitPair(pair);
  const pip = getPipSize(pair);
  if (!parts || pip === null) return null;
  const quoteUsd = usdPerUnit(parts.quote, pair, price);
  if (quoteUsd === null) return null;
  return pip * STANDARD_LOT_UNITS * quoteUsd;
}

export interface PositionSizeInput {
  /** Account balance in USD. */
  balance: number;
  /** Percentage of the balance to risk on the trade, e.g. 1 for 1%. */
  riskPercent: number;
  /** Distance from entry to stop-loss in pips. */
  stopLossPips: number;
  pair: string;
  price: number;
}

export interface PositionSizeResult {
  /** Amount at risk in USD. */
  riskAmount: number;
  /** Position size in lots, rounded down to 0.01 (a micro lot) so the risk is not exceeded. */
  lots: number;
  units: number;
  /** Pip value of the suggested position in USD. */
  pipValue: number;
}

export function positionSize({
  balance,
  riskPercent,
  stopLossPips,
  pair,
  price,
}: PositionSizeInput): PositionSizeResult | null {
  if (!Number.isFinite(balance) || balance < 0) return null;
  if (!Number.isFinite(riskPercent) || riskPercent < 0 || riskPercent > 100) return null;
  if (!isPositiveNumber(stopLossPips)) return null;
  const perLot = pipValuePerLot(pair, price);
  if (perLot === null) return null;

  const riskAmount = (balance * riskPercent) / 100;
  const lots = floorTo(riskAmount / (stopLossPips * perLot), 2);
  return {
    riskAmount: roundTo(riskAmount, 2),
    lots,
    units: Math.round(lots * STANDARD_LOT_UNITS),
    pipValue: roundTo(lots * perLot, 2),
  };
}

export interface MarginInput {
  pair: string;
  lots: number;
  price: number;
  /** Leverage ratio expressed as the multiplier, e.g. 30 for 1:30. */
  leverage: number;
}

export interface MarginResult {
  /** Notional value of the position in USD. */
  notional: number;
  /** Margin required in USD. */
  margin: number;
}

export function marginRequired({ pair, lots, price, leverage }: MarginInput): MarginResult | null {
  const parts = splitPair(pair);
  if (!parts || !Number.isFinite(lots) || lots < 0 || !isPositiveNumber(leverage)) return null;
  const baseUsd = usdPerUnit(parts.base, pair, price);
  if (baseUsd === null) return null;
  const notional = lots * STANDARD_LOT_UNITS * baseUsd;
  return { notional: roundTo(notional, 2), margin: roundTo(notional / leverage, 2) };
}

export type TradeDirection = "buy" | "sell";

export interface ProfitLossInput {
  pair: string;
  direction: TradeDirection;
  entry: number;
  exit: number;
  lots: number;
}

export interface ProfitLossResult {
  /** Signed price movement in pips, from the trade's point of view. */
  pips: number;
  /** Signed profit (positive) or loss (negative) in USD. */
  profit: number;
}

export function profitLoss({
  pair,
  direction,
  entry,
  exit,
  lots,
}: ProfitLossInput): ProfitLossResult | null {
  const parts = splitPair(pair);
  const pip = getPipSize(pair);
  if (!parts || pip === null) return null;
  if (!isPositiveNumber(entry) || !isPositiveNumber(exit)) return null;
  if (!Number.isFinite(lots) || lots < 0) return null;
  if (direction !== "buy" && direction !== "sell") return null;

  const sign = direction === "buy" ? 1 : -1;
  const move = (exit - entry) * sign;
  // Convert the quote-currency result at the exit price, as a position is closed at that rate.
  const quoteUsd = usdPerUnit(parts.quote, pair, exit);
  if (quoteUsd === null) return null;
  return {
    pips: roundTo(move / pip, 1),
    profit: roundTo(move * lots * STANDARD_LOT_UNITS * quoteUsd, 2),
  };
}
