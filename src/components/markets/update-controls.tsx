"use client";

import { PauseIcon, PlayIcon } from "lucide-react";
import { cn } from "cn";
import { SimulatedBadge } from "@/components/site/simulated-badge";
import type { SimulatedMarket } from "@/hooks/use-simulated-market";

const statusText: Record<NonNullable<SimulatedMarket["pauseReason"]> | "running", string> = {
  running: "Updating gently",
  user: "Updates paused",
  hidden: "Paused while tab is hidden",
  "reduced-motion": "Paused (reduced motion is on)",
};

export function UpdateControls({
  market,
  className,
}: {
  market: Pick<SimulatedMarket, "paused" | "togglePaused" | "pauseReason" | "intervalMs">;
  className?: string;
}) {
  const status = statusText[market.pauseReason ?? "running"];
  return (
    <div className={cn("flex flex-wrap items-center gap-x-3 gap-y-2", className)}>
      <SimulatedBadge />
      <span className="inline-flex items-center gap-1.5 text-xs text-muted-foreground">
        <span
          aria-hidden
          className={cn(
            "size-2 rounded-full",
            market.pauseReason ? "bg-muted-foreground/60" : "bg-positive",
          )}
        />
        {status}
      </span>
      <button
        type="button"
        aria-pressed={market.paused}
        onClick={market.togglePaused}
        className="ml-auto inline-flex min-h-9 items-center gap-1.5 rounded-lg border px-3 text-xs font-semibold transition-colors hover:bg-muted aria-pressed:border-brand/60 aria-pressed:bg-brand/15"
      >
        {market.paused ? (
          <PlayIcon aria-hidden className="size-3.5" />
        ) : (
          <PauseIcon aria-hidden className="size-3.5" />
        )}
        Pause updates
      </button>
    </div>
  );
}
