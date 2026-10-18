import { ArrowRightIcon } from "lucide-react";
import Link from "next/link";
import type { ReactNode } from "react";
import { Button } from "@/components/ui/button";

interface CTAProps {
  title: ReactNode;
  description: ReactNode;
  primary?: { href: string; label: string };
  secondary?: { href: string; label: string };
}

export function CTA({
  title,
  description,
  primary = { href: "/open-account", label: "Open a demo account" },
  secondary = { href: "/markets", label: "Explore markets" },
}: CTAProps) {
  return (
    <section aria-labelledby="cta-title" className="px-4 py-16 sm:px-6 sm:py-20 lg:px-8">
      <div className="dark relative mx-auto max-w-6xl overflow-hidden rounded-3xl bg-background px-6 py-14 text-center text-foreground sm:px-12 sm:py-16">
        <div aria-hidden className="bg-grid mask-fade-b absolute inset-0" />
        <div
          aria-hidden
          className="absolute -bottom-32 left-1/2 h-64 w-[40rem] -translate-x-1/2 rounded-full bg-brand/20 blur-3xl"
        />
        <div className="relative">
          <h2 id="cta-title" className="mx-auto max-w-2xl text-3xl font-semibold sm:text-4xl">
            {title}
          </h2>
          <div className="mx-auto mt-4 max-w-xl text-pretty text-muted-foreground">
            {description}
          </div>
          <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
            <Button asChild size="xl">
              <Link href={primary.href}>
                {primary.label}
                <ArrowRightIcon aria-hidden data-icon="inline-end" />
              </Link>
            </Button>
            <Button asChild size="xl" variant="outline">
              <Link href={secondary.href}>{secondary.label}</Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
