export type InstrumentCategory = "forex" | "metals" | "indices";

export interface Instrument {
  symbol: string;
  name: string;
  category: InstrumentCategory;
  /** Reference mid price the simulation starts from and slowly reverts to. Not real data. */
  basePrice: number;
  /** Decimal places shown for prices. */
  digits: number;
  /** Size of one pip (forex/metals) or point (indices) in price units. */
  pipSize: number;
  /** Typical simulated spread, in pips/points. */
  spreadPips: number;
  /** Standard deviation of one simulated tick, as a fraction of price. */
  volatility: number;
}

export const CATEGORY_LABELS: Record<InstrumentCategory, string> = {
  forex: "Forex",
  metals: "Metals",
  indices: "Indices",
};

/**
 * Fictional, illustrative instrument definitions. Prices are starting points for the local
 * random walk only and do not reflect any real market.
 */
export const INSTRUMENTS: readonly Instrument[] = [
  fx("EUR/USD", "Euro / US Dollar", 1.0842, 0.8),
  fx("GBP/USD", "British Pound / US Dollar", 1.2671, 1.1),
  fx("USD/JPY", "US Dollar / Japanese Yen", 151.42, 1.0),
  fx("USD/CHF", "US Dollar / Swiss Franc", 0.8836, 1.3),
  fx("AUD/USD", "Australian Dollar / US Dollar", 0.6578, 1.0),
  fx("USD/CAD", "US Dollar / Canadian Dollar", 1.3592, 1.4),
  fx("NZD/USD", "New Zealand Dollar / US Dollar", 0.6043, 1.5),
  fx("EUR/GBP", "Euro / British Pound", 0.8557, 1.2),
  fx("EUR/JPY", "Euro / Japanese Yen", 164.17, 1.6),
  fx("GBP/JPY", "British Pound / Japanese Yen", 191.86, 2.2),
  {
    symbol: "XAU/USD",
    name: "Gold / US Dollar",
    category: "metals",
    basePrice: 2341.5,
    digits: 2,
    pipSize: 0.01,
    spreadPips: 25,
    volatility: 0.00018,
  },
  {
    symbol: "XAG/USD",
    name: "Silver / US Dollar",
    category: "metals",
    basePrice: 27.845,
    digits: 3,
    pipSize: 0.001,
    spreadPips: 20,
    volatility: 0.00025,
  },
  index("US 500", "US large-cap index (simulated)", 5214.3, 0.5),
  index("US Tech 100", "US technology index (simulated)", 18187.6, 1.2),
  index("Germany 40", "German blue-chip index (simulated)", 18342.1, 1.0),
  index("UK 100", "UK blue-chip index (simulated)", 8121.4, 1.0),
  index("Japan 225", "Japanese equity index (simulated)", 38912.0, 7.0),
];

export function getInstrument(symbol: string): Instrument | undefined {
  return INSTRUMENTS.find((instrument) => instrument.symbol === symbol);
}

export function isJpyQuoted(symbol: string): boolean {
  return symbol.endsWith("/JPY");
}

function fx(symbol: string, name: string, basePrice: number, spreadPips: number): Instrument {
  const jpy = isJpyQuoted(symbol);
  return {
    symbol,
    name,
    category: "forex",
    basePrice,
    digits: jpy ? 3 : 5,
    pipSize: jpy ? 0.01 : 0.0001,
    spreadPips,
    volatility: 0.00006,
  };
}

function index(symbol: string, name: string, basePrice: number, spreadPips: number): Instrument {
  return {
    symbol,
    name,
    category: "indices",
    basePrice,
    digits: 2,
    pipSize: 1,
    spreadPips,
    volatility: 0.00012,
  };
}
