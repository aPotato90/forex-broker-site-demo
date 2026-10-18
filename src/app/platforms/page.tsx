import { GlobeIcon, MonitorIcon, SmartphoneIcon } from "lucide-react";
import type { Metadata } from "next";
import { DesktopMockup, MobileMockup, WebTerminalMockup } from "@/components/platforms/mockups";
import { CTA } from "@/components/site/cta";
import { FeatureCard } from "@/components/site/feature-card";
import { PageHero } from "@/components/site/page-hero";
import { RiskWarning } from "@/components/site/risk-warning";
import { Section } from "@/components/site/section";
import { SimulatedBadge } from "@/components/site/simulated-badge";
import { pageMetadata } from "@/lib/metadata";

export const metadata: Metadata = pageMetadata({
  title: "Platforms (illustrative mockups)",
  description:
    "Web, desktop and mobile trading platform concepts for the fictional Valtrex Markets, drawn in code with simulated data. Original mockups, not working software.",
  path: "/platforms",
});

export default function PlatformsPage() {
  return (
    <>
      <PageHero
        eyebrow="Platforms"
        title="One trading experience, three illustrative screens"
        description="Original interface concepts drawn entirely with SVG and CSS from the simulation engine. They show layout and information design; none of them places orders or connects to a market."
      >
        <SimulatedBadge />
      </PageHero>

      <Section
        id="web"
        eyebrow="Web platform"
        title="A browser terminal concept"
        description="Watchlist, chart and order ticket arranged for fast scanning. On small screens the ticket moves under the chart."
      >
        <WebTerminalMockup />
      </Section>

      <Section
        id="desktop-mobile"
        tone="muted"
        eyebrow="Desktop and mobile"
        title="Same data, different contexts"
      >
        <div className="grid items-center gap-12 lg:grid-cols-[1.4fr_1fr]">
          <DesktopMockup />
          <MobileMockup />
        </div>
      </Section>

      <Section id="principles" title="Design principles behind the mockups">
        <div className="grid gap-6 md:grid-cols-3">
          <FeatureCard icon={GlobeIcon} title="Web">
            Server-rendered layout with client JavaScript only where prices update, so pages load
            quickly on modest connections.
          </FeatureCard>
          <FeatureCard icon={MonitorIcon} title="Desktop">
            Dense multi-chart grids for large screens, with consistent colours for direction and
            text labels so meaning never depends on colour alone.
          </FeatureCard>
          <FeatureCard icon={SmartphoneIcon} title="Mobile">
            Large touch targets, a single column and clear separation between viewing prices and any
            action.
          </FeatureCard>
        </div>
        <RiskWarning className="mt-10" />
      </Section>
      <CTA
        title="Explore the simulated markets"
        description="See every instrument with gently updating simulated prices, sorting and filters."
        primary={{ href: "/markets", label: "Explore markets" }}
        secondary={{ href: "/open-account", label: "Open a demo account" }}
      />
    </>
  );
}
