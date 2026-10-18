import type { LucideIcon } from "lucide-react";
import Link from "next/link";
import type { ReactNode } from "react";
import { ArrowRightIcon } from "lucide-react";
import { cn } from "cn";

interface FeatureCardProps {
  icon: LucideIcon;
  title: string;
  children: ReactNode;
  href?: string;
  linkLabel?: string;
  className?: string;
}

export function FeatureCard({
  icon: Icon,
  title,
  children,
  href,
  linkLabel = "Learn more",
  className,
}: FeatureCardProps) {
  return (
    <article
      className={cn(
        "group relative flex flex-col rounded-2xl border bg-card p-6 shadow-xs transition-shadow hover:shadow-md",
        className,
      )}
    >
      <span className="inline-flex size-11 items-center justify-center rounded-xl bg-brand/15 text-brand-text ring-1 ring-brand/25">
        <Icon aria-hidden className="size-5" />
      </span>
      <h3 className="mt-5 text-lg font-semibold text-card-foreground">{title}</h3>
      <div className="mt-2 flex-1 text-sm leading-relaxed text-muted-foreground">{children}</div>
      {href && (
        <Link
          href={href}
          className="mt-5 inline-flex items-center gap-1.5 text-sm font-semibold text-brand-text underline-offset-4 after:absolute after:inset-0 after:rounded-2xl hover:underline"
        >
          {linkLabel}
          <span className="sr-only">: {title}</span>
          <ArrowRightIcon
            aria-hidden
            className="size-4 transition-transform group-hover:translate-x-0.5"
          />
        </Link>
      )}
    </article>
  );
}
