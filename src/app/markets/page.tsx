import type { Metadata } from "next";
import { MarketsTable } from "@/components/markets/markets-table";
import { PageHero } from "@/components/site/page-hero";
import { RiskWarning } from "@/components/site/risk-warning";
import { Section } from "@/components/site/section";
import { SimulatedBadge } from "@/components/site/simulated-badge";
import { INSTRUMENTS } from "@/lib/forex/instruments";
import { pageMetadata } from "@/lib/metadata";

export const metadata: Metadata = pageMetadata({
  title: "Markets (simulated prices)",
  description:
    "Browse simulated prices for major forex pairs, metals and indices on the Emmy Capital demo. Sort, filter and pause updates. Not real market data.",
  path: "/markets",
});

export default function MarketsPage() {
  return (
    <>
      <PageHero
        eyebrow="Markets"
        title="Simulated prices across forex, metals and indices"
        description={
          <>
            {INSTRUMENTS.length} fictional instruments driven by a seeded random walk that runs in
            your browser. Prices update gently every two seconds, pause when the tab is hidden and
            stay still if you prefer reduced motion.
          </>
        }
      >
        <SimulatedBadge />
      </PageHero>
      <Section className="pt-10 sm:pt-12 lg:pt-14">
        <MarketsTable />
        <div className="mt-8 grid gap-4 text-sm text-muted-foreground md:grid-cols-3">
          <p>
            <strong className="text-foreground">Bid and ask.</strong> The bid is the simulated price
            to sell, the ask is the simulated price to buy. The difference is the spread.
          </p>
          <p>
            <strong className="text-foreground">Precision.</strong> Most pairs show 5 decimals, JPY
            pairs 3, gold and indices 2, matching common quoting conventions.
          </p>
          <p>
            <strong className="text-foreground">Not data.</strong> Nothing here comes from a market
            feed. Do not use these numbers for any decision.
          </p>
        </div>
        <RiskWarning className="mt-10" />
      </Section>
    </>
  );
}
