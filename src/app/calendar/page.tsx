import type { Metadata } from "next";
import { EconomicCalendar } from "@/components/calendar/economic-calendar";
import { PageHero } from "@/components/site/page-hero";
import { Section } from "@/components/site/section";
import { SimulatedBadge } from "@/components/site/simulated-badge";
import { pageMetadata } from "@/lib/metadata";

export const metadata: Metadata = pageMetadata({
  title: "Economic calendar (sample data)",
  description:
    "A simulated economic calendar with fictional events, impact levels and filters. Sample data only, with dates generated relative to today.",
  path: "/calendar",
});

export default function CalendarPage() {
  return (
    <>
      <PageHero
        eyebrow="Economic calendar"
        title="A sample calendar of fictional events"
        description="Shows how a broker might present scheduled announcements. Every event, time and figure is invented sample data, and dates are generated relative to today in your browser."
      >
        <SimulatedBadge label="Sample data · fictional events" />
      </PageHero>
      <Section className="pt-10 sm:pt-12 lg:pt-14">
        <EconomicCalendar />
        <p className="mt-6 text-sm text-muted-foreground">
          Impact levels describe how much attention a type of release typically gets. In real
          markets, scheduled announcements can cause sudden price moves and wider spreads. Nothing
          here reflects a real release schedule.
        </p>
      </Section>
    </>
  );
}
