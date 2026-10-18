import { ArrowDownRightIcon, ArrowUpRightIcon, MinusIcon } from "lucide-react";
import { cn } from "cn";
import { formatSigned } from "@/lib/forex/market";

/** Signed percentage with an icon, so meaning never relies on colour alone. */
export function PriceChange({ value, className }: { value: number; className?: string }) {
  const Icon = value > 0 ? ArrowUpRightIcon : value < 0 ? ArrowDownRightIcon : MinusIcon;
  return (
    <span
      className={cn(
        "tabular inline-flex items-center gap-0.5 font-mono text-xs font-medium",
        value > 0 ? "text-positive" : value < 0 ? "text-negative" : "text-muted-foreground",
        className,
      )}
    >
      <Icon aria-hidden className="size-3.5" />
      {formatSigned(value, 2, "%")}
    </span>
  );
}
