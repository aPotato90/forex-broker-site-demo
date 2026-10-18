import { cn } from "cn";

/** The mandatory label shown wherever simulated prices appear. */
export function SimulatedBadge({
  className,
  label = "Simulated prices",
}: {
  className?: string;
  label?: string;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full border border-brand/40 bg-brand/10 px-2.5 py-0.5 text-xs font-semibold text-brand-text",
        className,
      )}
    >
      <span aria-hidden className="size-1.5 rounded-full bg-brand" />
      {label}
    </span>
  );
}
