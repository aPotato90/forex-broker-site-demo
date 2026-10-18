import type { ReactNode } from "react";
import { cn } from "cn";

interface PageHeroProps {
  eyebrow: string;
  title: ReactNode;
  description: ReactNode;
  children?: ReactNode;
  className?: string;
}

/** Compact navy header used at the top of inner pages. */
export function PageHero({ eyebrow, title, description, children, className }: PageHeroProps) {
  return (
    <div className={cn("dark relative overflow-hidden bg-background text-foreground", className)}>
      <div aria-hidden className="bg-grid mask-fade-b absolute inset-0" />
      <div
        aria-hidden
        className="absolute -top-40 right-0 h-80 w-[36rem] rounded-full bg-brand/15 blur-3xl"
      />
      <div className="relative mx-auto max-w-7xl px-4 py-14 sm:px-6 sm:py-20 lg:px-8">
        <p className="text-sm font-semibold tracking-wide text-brand-text uppercase">{eyebrow}</p>
        <h1 className="mt-3 max-w-3xl text-4xl font-semibold sm:text-5xl">{title}</h1>
        <div className="mt-5 max-w-2xl text-base text-pretty text-muted-foreground sm:text-lg">
          {description}
        </div>
        {children && <div className="mt-8">{children}</div>}
      </div>
    </div>
  );
}
