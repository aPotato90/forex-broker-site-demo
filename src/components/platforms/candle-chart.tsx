import { cn } from "cn";
import { generateCandles } from "@/lib/forex/market";

interface CandleChartProps {
  symbol: string;
  count?: number;
  seed?: number;
  width?: number;
  height?: number;
  className?: string;
  showGrid?: boolean;
}

/** Static SVG candlestick chart from deterministic simulated candles (prerenders to HTML). */
export function CandleChart({
  symbol,
  count = 48,
  seed,
  width = 640,
  height = 280,
  className,
  showGrid = true,
}: CandleChartProps) {
  const candles = generateCandles(symbol, count, seed);
  const highs = candles.map((c) => c.high);
  const lows = candles.map((c) => c.low);
  const max = Math.max(...highs);
  const min = Math.min(...lows);
  const range = max - min || 1;
  const pad = 10;
  const y = (v: number) => pad + (1 - (v - min) / range) * (height - pad * 2);
  const slot = width / candles.length;
  const body = Math.max(2, slot * 0.6);

  return (
    <svg
      aria-hidden
      viewBox={`0 0 ${width} ${height}`}
      preserveAspectRatio="none"
      className={cn("h-full w-full", className)}
    >
      {showGrid &&
        [0.2, 0.4, 0.6, 0.8].map((f) => (
          <line
            key={f}
            x1="0"
            x2={width}
            y1={height * f}
            y2={height * f}
            className="stroke-border"
            strokeDasharray="3 5"
            vectorEffect="non-scaling-stroke"
          />
        ))}
      {candles.map((c, i) => {
        const x = i * slot + slot / 2;
        const up = c.close >= c.open;
        const top = y(Math.max(c.open, c.close));
        const bottom = y(Math.min(c.open, c.close));
        return (
          <g key={i} className={up ? "text-positive" : "text-negative"}>
            <line
              x1={x}
              x2={x}
              y1={y(c.high)}
              y2={y(c.low)}
              stroke="currentColor"
              vectorEffect="non-scaling-stroke"
            />
            <rect
              x={x - body / 2}
              y={top}
              width={body}
              height={Math.max(1, bottom - top)}
              fill="currentColor"
              rx="1"
            />
          </g>
        );
      })}
    </svg>
  );
}
