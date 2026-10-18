import type { ReactNode } from "react";
import { cn } from "cn";

interface SectionProps {
  id?: string;
  eyebrow?: string;
  title?: ReactNode;
  description?: ReactNode;
  children?: ReactNode;
  className?: string;
  /** "navy" forces the dark palette for a high-contrast band in either theme. */
  tone?: "default" | "muted" | "navy";
  align?: "left" | "center";
  /** Heading level for the section title. Pages own the single h1. */
  as?: "h2" | "h3";
}

export function Section({
  id,
  eyebrow,
  title,
  description,
  children,
  className,
  tone = "default",
  align = "left",
  as: Heading = "h2",
}: SectionProps) {
  const headingId = id ? `${id}-title` : undefined;
  return (
    <section
      id={id}
      aria-labelledby={title ? headingId : undefined}
      className={cn(
        "relative py-16 sm:py-20 lg:py-24",
        tone === "muted" && "bg-muted/60",
        tone === "navy" && "dark bg-background text-foreground",
        className,
      )}
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {(eyebrow || title || description) && (
          <div className={cn("max-w-2xl", align === "center" && "mx-auto text-center")}>
            {eyebrow && (
              <p className="text-sm font-semibold tracking-wide text-brand-text uppercase">
                {eyebrow}
              </p>
            )}
            {title && (
              <Heading
                id={headingId}
                className="mt-2 text-3xl font-semibold text-foreground sm:text-4xl"
              >
                {title}
              </Heading>
            )}
            {description && (
              <div className="mt-4 text-base text-pretty text-muted-foreground sm:text-lg">
                {description}
              </div>
            )}
          </div>
        )}
        {children && <div className={cn(title && "mt-10 sm:mt-12")}>{children}</div>}
      </div>
    </section>
  );
}
