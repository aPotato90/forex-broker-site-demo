import { FlaskConicalIcon } from "lucide-react";
import { DEMO_NOTICE } from "@/lib/site";

export function DemoBanner() {
  return (
    <div
      role="note"
      aria-label="Demo notice"
      className="dark relative z-50 bg-navy text-foreground"
    >
      <p className="mx-auto flex max-w-7xl items-center justify-center gap-2 px-4 py-2 text-center text-xs font-medium sm:text-sm">
        <FlaskConicalIcon aria-hidden className="size-4 shrink-0 text-brand" />
        <span>{DEMO_NOTICE}</span>
      </p>
    </div>
  );
}
