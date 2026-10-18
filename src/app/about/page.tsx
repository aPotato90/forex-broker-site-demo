import { BoxesIcon, GaugeIcon, ShieldCheckIcon, TestTubeDiagonalIcon } from "lucide-react";
import type { Metadata } from "next";
import { CTA } from "@/components/site/cta";
import { FeatureCard } from "@/components/site/feature-card";
import { PageHero } from "@/components/site/page-hero";
import { Section } from "@/components/site/section";
import { pageMetadata } from "@/lib/metadata";
import { siteConfig } from "@/lib/site";

export const metadata: Metadata = pageMetadata({
  title: "About this demo",
  description:
    "Why Emmy Capital exists: a fictional forex broker website built by full-stack developer Emmanuel Kelvin to demonstrate design, accessibility and engineering.",
  path: "/about",
});

const STACK = [
  "Next.js App Router with Cache Components",
  "TypeScript (strict)",
  "Tailwind CSS v4 and shadcn/ui",
  "Motion (mini) for restrained animation",
  "Zod and React Hook Form",
  "Vitest, Playwright and axe-core",
];

export default function AboutPage() {
  return (
    <>
      <PageHero
        eyebrow="About"
        title="A broker website with no broker behind it"
        description={
          <>
            Emmy Capital is a portfolio project by {siteConfig.author}, a full-stack developer. The
            brand, products and figures are invented so the work can be shown without pretending to
            be, or resembling, any real firm.
          </>
        }
      />
      <Section
        id="goals"
        title="What the project demonstrates"
        description="Financial websites have to be fast, clear and careful with what they claim. This demo applies those constraints to a fictional brand."
      >
        <div className="grid gap-6 sm:grid-cols-2">
          <FeatureCard icon={GaugeIcon} title="Performance">
            Static pages by default, with client JavaScript limited to the price ticker, tables,
            calculators and forms.
          </FeatureCard>
          <FeatureCard icon={ShieldCheckIcon} title="Accessibility">
            Semantic HTML, keyboard support, visible focus, AA contrast in both themes, and live
            prices that respect reduced motion and never spam screen readers.
          </FeatureCard>
          <FeatureCard icon={TestTubeDiagonalIcon} title="Tested logic">
            The price engine and every calculator are pure functions with unit tests, including JPY
            pairs, rounding and invalid inputs.
          </FeatureCard>
          <FeatureCard icon={BoxesIcon} title="Honest content">
            No fake testimonials, awards, licences or statistics. Placeholders are labelled as
            illustrative, simulated or sample data.
          </FeatureCard>
        </div>
      </Section>
      <Section id="stack" tone="muted" title="Built with">
        <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {STACK.map((item) => (
            <li key={item} className="rounded-xl border bg-card px-4 py-3 text-sm font-medium">
              {item}
            </li>
          ))}
        </ul>
      </Section>
      <CTA
        title="Want to work together?"
        description="Real enquiries go to the developer's portfolio, not this fictional broker."
        primary={{ href: siteConfig.portfolioUrl, label: "View the portfolio" }}
        secondary={{ href: "/", label: "Back to the demo" }}
      />
    </>
  );
}
