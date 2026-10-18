import type { Metadata } from "next";
import {
  MarginCalculator,
  PipValueCalculator,
  PositionSizeCalculator,
  ProfitLossCalculator,
} from "@/components/tools/calculators";
import { PageHero } from "@/components/site/page-hero";
import { RiskWarning } from "@/components/site/risk-warning";
import { pageMetadata } from "@/lib/metadata";

export const metadata: Metadata = pageMetadata({
  title: "Forex calculators (educational)",
  description:
    "Educational position size, pip value, margin and profit/loss calculators with formulas and assumptions shown. Part of the fictional Emmy Capital demo.",
  path: "/tools",
});

const LINKS = [
  ["#position-size", "Position size"],
  ["#pip-value", "Pip value"],
  ["#margin", "Margin"],
  ["#profit-loss", "Profit/loss"],
];

export default function ToolsPage() {
  return (
    <>
      <PageHero
        eyebrow="Tools"
        title="Educational trading calculators"
        description="Four working calculators with their formulas and assumptions beside them. They are for learning only: results are approximate and are not advice."
      >
        <nav aria-label="Calculators">
          <ul className="flex flex-wrap gap-2">
            {LINKS.map(([href, label]) => (
              <li key={href}>
                <a
                  href={href}
                  className="inline-flex min-h-10 items-center rounded-full border px-4 text-sm font-medium hover:bg-muted"
                >
                  {label}
                </a>
              </li>
            ))}
          </ul>
        </nav>
      </PageHero>
      <div className="mx-auto max-w-7xl space-y-8 px-4 py-12 sm:px-6 sm:py-16 lg:px-8">
        <RiskWarning />
        <PositionSizeCalculator />
        <PipValueCalculator />
        <MarginCalculator />
        <ProfitLossCalculator />
        <p className="text-sm text-muted-foreground">
          The maths lives in pure, unit-tested functions. Reference prices are illustrative
          constants from the demo&apos;s simulation engine, not live quotes.
        </p>
      </div>
    </>
  );
}
