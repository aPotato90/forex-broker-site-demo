import { CompassIcon } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export const metadata: Metadata = {
  title: "Page not found",
  description: "This page does not exist on the Emmy Capital demo.",
  robots: { index: false },
};

export default function NotFound() {
  return (
    <div className="dark relative flex flex-1 items-center overflow-hidden bg-background text-foreground">
      <div aria-hidden className="bg-grid mask-fade-b absolute inset-0" />
      <div className="relative mx-auto max-w-xl px-4 py-24 text-center sm:py-32">
        <CompassIcon aria-hidden className="mx-auto size-12 text-brand-text" />
        <p className="mt-6 font-mono text-sm font-semibold text-brand-text">Error 404</p>
        <h1 className="mt-2 text-4xl font-semibold sm:text-5xl">This page went off the chart</h1>
        <p className="mt-4 text-muted-foreground">
          The page you were looking for does not exist. Like everything else here, it was never real
          to begin with.
        </p>
        <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
          <Button asChild size="lg">
            <Link href="/">Back to home</Link>
          </Button>
          <Button asChild size="lg" variant="outline">
            <Link href="/markets">Explore markets</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
