import { TriangleAlertIcon } from "lucide-react";
import { cn } from "cn";
import { RISK_WARNING } from "@/lib/site";

export function RiskWarning({ className }: { className?: string }) {
  return (
    <aside
      aria-label="Risk warning"
      className={cn(
        "flex gap-3 rounded-xl border border-brand/40 bg-brand/10 p-4 text-sm text-foreground",
        className,
      )}
    >
      <TriangleAlertIcon aria-hidden className="mt-0.5 size-5 shrink-0 text-brand-text" />
      <p>
        <strong className="font-semibold">Risk warning: </strong>
        {RISK_WARNING}
      </p>
    </aside>
  );
}
