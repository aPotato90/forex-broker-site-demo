import Link from "next/link";
import { cn } from "cn";

export function LogoMark({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 32 32" aria-hidden className={cn("size-8", className)}>
      <rect width="32" height="32" rx="9" className="fill-navy dark:fill-white/10" />
      <path
        d="M8 9.5 14.6 23h2.8L24 9.5"
        fill="none"
        strokeWidth="3"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="stroke-white"
      />
      <path
        d="M19.5 17.5 22.4 14.6 25 17"
        fill="none"
        strokeWidth="2.2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="stroke-brand"
      />
    </svg>
  );
}

export function Logo({ className }: { className?: string }) {
  return (
    <Link
      href="/"
      className={cn("inline-flex items-center gap-2.5 rounded-lg font-heading", className)}
      aria-label="Valtrex Markets (fictional demo) home"
    >
      <LogoMark />
      <span className="flex flex-col leading-none">
        <span className="text-[1.05rem] font-semibold tracking-tight">Valtrex Markets</span>
        <span className="mt-1 text-[0.65rem] font-medium tracking-[0.18em] text-muted-foreground uppercase">
          Fictional demo
        </span>
      </span>
    </Link>
  );
}
