/**
 * Simulated market engine.
 *
 * A pure, seeded random walk: the same seed always produces the same prices, nothing touches the
 * network, and every function returns new state instead of mutating its input. All output is
 * SIMULATED and must be labelled "Simulated prices" wherever it is shown.
 */
import { INSTRUMENTS, type Instrument } from "./instruments";
import { roundTo } from "./math";

export const DEFAULT_SEED = 20_240_611;
export const DEFAULT_HISTORY_LENGTH = 48;

/** Pull back towards the reference price per tick, so the walk stays plausible indefinitely. */
const MEAN_REVERSION = 0.02;

export interface Quote {
  symbol: string;
  digits: number;
  bid: number;
  ask: number;
  /** Spread in pips (forex/metals) or points (indices), one decimal. */
  spreadPips: number;
  mid: number;
  /** Simulated session open, used for the daily change. */
  open: number;
  high: number;
  low: number;
  change: number;
  changePercent: number;
  /** +1 if the last tick moved up, -1 if down, 0 if unchanged or initial. */
  direction: -1 | 0 | 1;
  /** Recent mid prices, oldest first, for sparklines. */
  history: number[];
}

export interface MarketState {
  rngState: number;
  tick: number;
  quotes: Quote[];
}

export interface Candle {
  open: number;
  high: number;
  low: number;
  close: number;
}

/* ------------------------------------------------------------------------------------------ */
/* Seeded PRNG (mulberry32) with explicit state so the engine stays pure.                      */
/* ------------------------------------------------------------------------------------------ */

export function nextRandom(state: number): { value: number; state: number } {
  const nextState = (state + 0x6d2b79f5) | 0;
  let t = nextState;
  t = Math.imul(t ^ (t >>> 15), t | 1);
  t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
  const value = ((t ^ (t >>> 14)) >>> 0) / 4_294_967_296;
  return { value, state: nextState };
}

/** Standard normal sample via Box-Muller, consuming two uniform draws. */
export function nextGaussian(state: number): { value: number; state: number } {
  const a = nextRandom(state);
  const b = nextRandom(a.state);
  const u = Math.max(a.value, Number.EPSILON);
  const value = Math.sqrt(-2 * Math.log(u)) * Math.cos(2 * Math.PI * b.value);
  return { value, state: b.state };
}

/* ------------------------------------------------------------------------------------------ */

function stepMid(
  instrument: Instrument,
  mid: number,
  rngState: number,
): { mid: number; state: number } {
  const g = nextGaussian(rngState);
  const reversion = (MEAN_REVERSION * (instrument.basePrice - mid)) / instrument.basePrice;
  const next = mid * (1 + reversion + g.value * instrument.volatility);
  return { mid: roundTo(next, instrument.digits + 1), state: g.state };
}

function simulateSpread(
  instrument: Instrument,
  rngState: number,
): { spread: number; state: number } {
  const r = nextRandom(rngState);
  // Gentle +/-20% jitter around the typical spread, never below half of it.
  const factor = Math.max(0.5, 1 + (r.value - 0.5) * 0.4);
  return { spread: instrument.spreadPips * factor, state: r.state };
}

function buildQuote(
  instrument: Instrument,
  history: number[],
  open: number,
  high: number,
  low: number,
  spreadPips: number,
  previousMid: number | null,
): Quote {
  const mid = history[history.length - 1];
  const spread = roundTo(spreadPips * instrument.pipSize, instrument.digits);
  const bid = roundTo(mid - spread / 2, instrument.digits);
  const ask = roundTo(bid + Math.max(spread, 10 ** -instrument.digits), instrument.digits);
  const change = roundTo(mid - open, instrument.digits);
  return {
    symbol: instrument.symbol,
    digits: instrument.digits,
    bid,
    ask,
    spreadPips: roundTo((ask - bid) / instrument.pipSize, 1),
    mid: roundTo(mid, instrument.digits),
    open: roundTo(open, instrument.digits),
    high: roundTo(Math.max(high, mid), instrument.digits),
    low: roundTo(Math.min(low, mid), instrument.digits),
    change,
    changePercent: roundTo(((mid - open) / open) * 100, 2),
    direction: previousMid === null || mid === previousMid ? 0 : mid > previousMid ? 1 : -1,
    history,
  };
}

function findInstrument(symbol: string): Instrument {
  const instrument = INSTRUMENTS.find((i) => i.symbol === symbol);
  if (!instrument) throw new Error(`Unknown instrument: ${symbol}`);
  return instrument;
}

export interface CreateMarketOptions {
  seed?: number;
  symbols?: readonly string[];
  historyLength?: number;
}

/** Builds an initial market with a pre-generated history for each instrument. */
export function createMarket({
  seed = DEFAULT_SEED,
  symbols = INSTRUMENTS.map((i) => i.symbol),
  historyLength = DEFAULT_HISTORY_LENGTH,
}: CreateMarketOptions = {}): MarketState {
  let rngState = seed | 0;
  const length = Math.max(2, Math.floor(historyLength));

  const quotes = symbols.map((symbol) => {
    const instrument = findInstrument(symbol);
    // Start each instrument slightly away from its reference price.
    const offset = nextGaussian(rngState);
    rngState = offset.state;
    let mid = instrument.basePrice * (1 + offset.value * instrument.volatility * 6);
    const history: number[] = [roundTo(mid, instrument.digits + 1)];
    for (let i = 1; i < length; i++) {
      const step = stepMid(instrument, mid, rngState);
      rngState = step.state;
      mid = step.mid;
      history.push(mid);
    }
    const spread = simulateSpread(instrument, rngState);
    rngState = spread.state;
    return buildQuote(
      instrument,
      history,
      history[0],
      Math.max(...history),
      Math.min(...history),
      spread.spread,
      null,
    );
  });

  return { rngState, tick: 0, quotes };
}

/** Advances every quote by one simulated tick. Pure: returns a new state. */
export function stepMarket(state: MarketState): MarketState {
  let rngState = state.rngState;
  const quotes = state.quotes.map((quote) => {
    const instrument = findInstrument(quote.symbol);
    const previousMid = quote.history[quote.history.length - 1];
    const step = stepMid(instrument, previousMid, rngState);
    rngState = step.state;
    const spread = simulateSpread(instrument, rngState);
    rngState = spread.state;
    const history = [...quote.history.slice(1), step.mid];
    return buildQuote(
      instrument,
      history,
      quote.open,
      quote.high,
      quote.low,
      spread.spread,
      previousMid,
    );
  });
  return { rngState, tick: state.tick + 1, quotes };
}

/** Deterministic OHLC candles for illustrative chart mockups. */
export function generateCandles(symbol: string, count: number, seed = DEFAULT_SEED): Candle[] {
  const instrument = findInstrument(symbol);
  const ticksPerCandle = 6;
  let rngState = seed | 0;
  let mid = instrument.basePrice;
  const candles: Candle[] = [];
  for (let c = 0; c < Math.max(0, Math.floor(count)); c++) {
    const open = mid;
    let high = mid;
    let low = mid;
    for (let t = 0; t < ticksPerCandle; t++) {
      // Candles use a wider step so the mockup chart has visible structure.
      const g = nextGaussian(rngState);
      rngState = g.state;
      const reversion = (MEAN_REVERSION * (instrument.basePrice - mid)) / instrument.basePrice;
      mid = mid * (1 + reversion + g.value * instrument.volatility * 3);
      high = Math.max(high, mid);
      low = Math.min(low, mid);
    }
    candles.push({
      open: roundTo(open, instrument.digits),
      high: roundTo(high, instrument.digits),
      low: roundTo(low, instrument.digits),
      close: roundTo(mid, instrument.digits),
    });
  }
  return candles;
}

export function formatPrice(value: number, digits: number): string {
  return value.toLocaleString("en-US", {
    minimumFractionDigits: digits,
    maximumFractionDigits: digits,
  });
}

export function formatSigned(value: number, digits: number, suffix = ""): string {
  const sign = value > 0 ? "+" : value < 0 ? "−" : "";
  return `${sign}${Math.abs(value).toFixed(digits)}${suffix}`;
}
