import Link from "next/link";
import { cn } from "cn";
import { MARK_C_PATH, MARK_E_PATH, MARK_STROKE_WIDTH, MARK_VIEWBOX } from "@/lib/brand-mark";

export function LogoMark({ className }: { className?: string }) {
  return (
    <svg viewBox={MARK_VIEWBOX} aria-hidden className={cn("size-8", className)}>
      <rect width="32" height="32" rx="9" className="fill-navy dark:fill-white/10" />
      <g fill="none" strokeWidth={MARK_STROKE_WIDTH} strokeLinecap="round" strokeLinejoin="round">
        <path d={MARK_E_PATH} className="stroke-white" />
        <path d={MARK_C_PATH} className="stroke-brand" />
      </g>
    </svg>
  );
}

export function Logo({ className }: { className?: string }) {
  return (
    <Link
      href="/"
      className={cn("inline-flex items-center gap-2.5 rounded-lg font-heading", className)}
    >
      <LogoMark />
      <span className="flex flex-col leading-none">
        <span className="text-[1.05rem] font-semibold tracking-tight">Emmy Capital</span>
        <span className="mt-1 text-[0.65rem] font-medium tracking-[0.18em] text-muted-foreground uppercase">
          Fictional demo
        </span>
      </span>
    </Link>
  );
}
