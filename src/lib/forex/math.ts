/**
 * Rounds half away from zero to a fixed number of decimals, avoiding the classic
 * floating-point drift (e.g. 1.005 -> 1.01, not 1).
 */
export function roundTo(value: number, decimals: number): number {
  if (!Number.isFinite(value)) return value;
  const factor = 10 ** decimals;
  const rounded = Math.round(Math.abs(value) * factor * (1 + Number.EPSILON)) / factor;
  return value < 0 ? -rounded : rounded;
}

/** Rounds towards zero to a fixed number of decimals (used so risk is never exceeded). */
export function floorTo(value: number, decimals: number): number {
  if (!Number.isFinite(value)) return value;
  const factor = 10 ** decimals;
  const floored = Math.floor(Math.abs(value) * factor * (1 + Number.EPSILON)) / factor;
  return value < 0 ? -floored : floored;
}

export function isPositiveNumber(value: number): boolean {
  return Number.isFinite(value) && value > 0;
}
