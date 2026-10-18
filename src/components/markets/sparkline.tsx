import { cn } from "cn";

interface SparklineProps {
  values: readonly number[];
  width?: number;
  height?: number;
  className?: string;
}

export function sparklinePoints(values: readonly number[], width: number, height: number, pad = 2) {
  if (values.length < 2) return "";
  const min = Math.min(...values);
  const max = Math.max(...values);
  const range = max - min || 1;
  const step = width / (values.length - 1);
  return values
    .map((v, i) => {
      const x = i * step;
      const y = pad + (1 - (v - min) / range) * (height - pad * 2);
      return `${x.toFixed(2)},${y.toFixed(2)}`;
    })
    .join(" ");
}

/** Decorative trend line; the numbers it summarises are always shown as text nearby. */
export function Sparkline({ values, width = 96, height = 28, className }: SparklineProps) {
  const up = values.length > 1 && values[values.length - 1] >= values[0];
  return (
    <svg
      aria-hidden
      viewBox={`0 0 ${width} ${height}`}
      width={width}
      height={height}
      preserveAspectRatio="none"
      className={cn("overflow-visible", up ? "text-positive" : "text-negative", className)}
    >
      <polyline
        points={sparklinePoints(values, width, height)}
        fill="none"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinejoin="round"
        strokeLinecap="round"
        vectorEffect="non-scaling-stroke"
      />
    </svg>
  );
}
