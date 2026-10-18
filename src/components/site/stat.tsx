import { cn } from "cn";

interface StatProps {
  value: string;
  label: string;
  note?: string;
  className?: string;
}

/** A single honest figure about the demo itself (never a fake business statistic). */
export function Stat({ value, label, note, className }: StatProps) {
  return (
    <div className={cn("flex flex-col gap-1 border-l-2 border-brand pl-4", className)}>
      <dt className="order-2 text-sm font-medium text-muted-foreground">{label}</dt>
      <dd className="tabular order-1 font-heading text-3xl font-semibold tracking-tight text-foreground">
        {value}
      </dd>
      {note && <dd className="order-3 text-xs text-muted-foreground">{note}</dd>}
    </div>
  );
}
