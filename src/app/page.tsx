import {
  AccessibilityIcon,
  ArrowRightIcon,
  BookOpenIcon,
  CalculatorIcon,
  CalendarDaysIcon,
  CodeXmlIcon,
  CpuIcon,
  EyeOffIcon,
  GaugeIcon,
  LayersIcon,
  LifeBuoyIcon,
  MonitorSmartphoneIcon,
} from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import { MarketTicker } from "@/components/markets/market-ticker";
import { PriceChange } from "@/components/markets/price-change";
import { Sparkline } from "@/components/markets/sparkline";
import { CTA } from "@/components/site/cta";
import { FAQ } from "@/components/site/faq";
import { FeatureCard } from "@/components/site/feature-card";
import { Reveal } from "@/components/site/reveal";
import { RiskWarning } from "@/components/site/risk-warning";
import { Section } from "@/components/site/section";
import { SimulatedBadge } from "@/components/site/simulated-badge";
import { Stat } from "@/components/site/stat";
import { Button } from "@/components/ui/button";
import { ARTICLES } from "@/data/articles";
import { HOME_FAQ } from "@/data/faq";
import { CATEGORY_LABELS, INSTRUMENTS, type InstrumentCategory } from "@/lib/forex/instruments";
import { createMarket, formatPrice } from "@/lib/forex/market";
import { pageMetadata } from "@/lib/metadata";
import { siteConfig } from "@/lib/site";

export const metadata: Metadata = {
  ...pageMetadata({
    title: "Fictional forex broker demo",
    description: siteConfig.description,
    path: "/",
  }),
  title: { absolute: `${siteConfig.name} | Fictional forex broker demo` },
};

const TRUST_ITEMS = [
  { icon: GaugeIcon, label: "Simulated execution speed demo" },
  { icon: CpuIcon, label: "Prices generated in your browser" },
  { icon: EyeOffIcon, label: "No sign-up, no cookies, no tracking" },
  { icon: AccessibilityIcon, label: "Built to WCAG AA contrast" },
  { icon: CodeXmlIcon, label: "Portfolio engineering project" },
];

const STEPS = [
  {
    title: "Open a demo account",
    text: "Walk through a short, validated form. Nothing you type is sent or stored.",
  },
  {
    title: "Explore simulated markets",
    text: "Browse forex pairs, metals and indices with prices generated locally in your browser.",
  },
  {
    title: "Learn and practise",
    text: "Read plain-English guides and test ideas with position size, pip, margin and P/L calculators.",
  },
];

const OVERVIEW_SYMBOLS: Record<InstrumentCategory, string[]> = {
  forex: ["EUR/USD", "GBP/USD", "USD/JPY", "AUD/USD"],
  metals: ["XAU/USD", "XAG/USD"],
  indices: ["US 500", "US Tech 100", "Germany 40", "Japan 225"],
};

export default function HomePage() {
  // Deterministic snapshot from the seeded engine, so it can be prerendered as static HTML.
  const snapshot = createMarket({ historyLength: 32 });
  const quoteBySymbol = new Map(snapshot.quotes.map((q) => [q.symbol, q]));

  return (
    <>
      {/* Hero */}
      <section
        aria-labelledby="hero-title"
        className="dark relative overflow-hidden bg-background text-foreground"
      >
        <div aria-hidden className="bg-grid mask-fade-b absolute inset-0" />
        <div
          aria-hidden
          className="absolute -top-32 -left-32 h-[28rem] w-[28rem] rounded-full bg-brand/15 blur-3xl"
        />
        <div
          aria-hidden
          className="absolute right-0 bottom-0 h-80 w-[40rem] rounded-full bg-sky-500/10 blur-3xl"
        />
        <div className="relative mx-auto grid max-w-7xl gap-12 px-4 py-16 sm:px-6 sm:py-20 lg:grid-cols-[1.1fr_0.9fr] lg:items-center lg:gap-16 lg:px-8 lg:py-28">
          <div>
            <p className="inline-flex items-center gap-2 rounded-full border border-brand/40 bg-brand/10 px-3 py-1 text-xs font-semibold text-brand-text">
              Fictional broker · Portfolio demo
            </p>
            <h1
              id="hero-title"
              className="mt-6 text-4xl leading-[1.08] font-semibold sm:text-5xl lg:text-6xl"
            >
              Global markets, <span className="text-brand-text">simulated</span> end to end.
            </h1>
            <p className="mt-6 max-w-xl text-lg text-pretty text-muted-foreground">
              Valtrex Markets is an invented forex broker that shows what a modern trading website
              can feel like: live-looking simulated prices, working risk calculators and clear
              education. No real money, accounts or trading.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Button asChild size="xl">
                <Link href="/open-account">
                  Open a demo account
                  <ArrowRightIcon aria-hidden data-icon="inline-end" />
                </Link>
              </Button>
              <Button asChild size="xl" variant="outline">
                <Link href="/markets">Explore markets</Link>
              </Button>
            </div>
            <p className="mt-6 text-sm text-muted-foreground">
              Prices on this site are simulated and are not market data.
            </p>
          </div>
          <MarketTicker className="lg:ml-auto lg:w-full lg:max-w-md" />
        </div>
      </section>

      {/* Trust strip */}
      <section aria-label="About this demo" className="border-b bg-card">
        <ul className="mx-auto grid max-w-7xl grid-cols-1 gap-x-6 gap-y-3 px-4 py-6 text-sm font-medium text-muted-foreground sm:grid-cols-2 sm:px-6 lg:grid-cols-5 lg:px-8">
          {TRUST_ITEMS.map(({ icon: Icon, label }) => (
            <li key={label} className="flex items-center gap-2.5">
              <Icon aria-hidden className="size-4 shrink-0 text-brand-text" />
              {label}
            </li>
          ))}
        </ul>
      </section>

      {/* Features */}
      <Section
        id="features"
        eyebrow="What you can explore"
        title="Everything a broker site needs, none of the real-world risk"
        description="Each part of this demo is built to production standards, using simulated data and illustrative figures in place of real services."
      >
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {[
            {
              icon: MonitorSmartphoneIcon,
              title: "Platforms",
              text: "Web, desktop and mobile terminal mockups drawn in code from simulated data.",
              href: "/platforms",
            },
            {
              icon: LayersIcon,
              title: "Example spreads",
              text: "Three fictional account types with clearly illustrative spreads, fees and leverage caps.",
              href: "/accounts",
            },
            {
              icon: BookOpenIcon,
              title: "Education",
              text: `${ARTICLES.length} original, neutral guides covering pips, leverage, risk, orders, charts and psychology.`,
              href: "/education",
            },
            {
              icon: CalculatorIcon,
              title: "Calculators",
              text: "Position size, pip value, margin and profit/loss tools with the formulas shown.",
              href: "/tools",
            },
            {
              icon: CalendarDaysIcon,
              title: "Economic calendar",
              text: "A sample calendar of fictional events with impact levels and filters.",
              href: "/calendar",
            },
            {
              icon: LifeBuoyIcon,
              title: "Support",
              text: "A demo contact form with validation. Real enquiries go to the developer's portfolio.",
              href: "/contact",
            },
          ].map((feature, i) => (
            <Reveal key={feature.title} delay={(i % 3) * 0.06}>
              <FeatureCard icon={feature.icon} title={feature.title} href={feature.href}>
                {feature.text}
              </FeatureCard>
            </Reveal>
          ))}
        </div>
      </Section>

      {/* Honest numbers about the demo itself */}
      <section aria-label="This demo in numbers" className="border-y bg-muted/60">
        <dl className="mx-auto grid max-w-7xl grid-cols-2 gap-8 px-4 py-12 sm:px-6 lg:grid-cols-4 lg:px-8">
          <Stat value={String(INSTRUMENTS.length)} label="Simulated instruments" />
          <Stat value="4" label="Working calculators" />
          <Stat value={String(ARTICLES.length)} label="Educational guides" />
          <Stat value="0" label="Cookies or trackers" />
        </dl>
      </section>

      {/* Markets overview */}
      <Section
        id="markets"
        eyebrow="Markets overview"
        title="Forex, metals and indices"
        description={
          <>
            A snapshot from the simulation engine. The{" "}
            <Link
              href="/markets"
              className="font-medium text-brand-text underline underline-offset-4"
            >
              markets page
            </Link>{" "}
            shows every instrument with gently updating simulated prices.
          </>
        }
      >
        <div className="mb-6">
          <SimulatedBadge label="Simulated prices · static snapshot" />
        </div>
        <div className="grid gap-6 lg:grid-cols-3">
          {(Object.keys(OVERVIEW_SYMBOLS) as InstrumentCategory[]).map((category) => (
            <Reveal key={category}>
              <article className="h-full rounded-2xl border bg-card p-5 text-card-foreground">
                <h3 className="text-lg font-semibold">{CATEGORY_LABELS[category]}</h3>
                <ul className="mt-3 divide-y">
                  {OVERVIEW_SYMBOLS[category].map((symbol) => {
                    const quote = quoteBySymbol.get(symbol)!;
                    return (
                      <li key={symbol} className="flex items-center gap-3 py-3">
                        <span className="w-24 shrink-0 text-sm font-medium">{symbol}</span>
                        <Sparkline values={quote.history} width={72} height={24} />
                        <span className="ml-auto text-right">
                          <span className="tabular block font-mono text-sm">
                            {formatPrice(quote.mid, quote.digits)}
                          </span>
                          <PriceChange value={quote.changePercent} />
                        </span>
                      </li>
                    );
                  })}
                </ul>
              </article>
            </Reveal>
          ))}
        </div>
      </Section>

      {/* How it works */}
      <Section
        id="how-it-works"
        tone="muted"
        eyebrow="How it works"
        title="Three steps, zero risk"
        align="center"
      >
        <ol className="grid gap-6 md:grid-cols-3">
          {STEPS.map((step, index) => (
            <li key={step.title} className="relative rounded-2xl border bg-card p-6">
              <span
                aria-hidden
                className="inline-flex size-10 items-center justify-center rounded-full bg-primary font-heading font-semibold text-primary-foreground"
              >
                {index + 1}
              </span>
              <h3 className="mt-4 text-lg font-semibold">
                <span className="sr-only">Step {index + 1}: </span>
                {step.title}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{step.text}</p>
            </li>
          ))}
        </ol>
      </Section>

      {/* FAQ */}
      <Section
        id="faq"
        eyebrow="FAQ"
        title="Questions about this demo"
        align="center"
        description="Short answers about what is real here (the code) and what is not (everything else)."
      >
        <FAQ items={HOME_FAQ} />
      </Section>

      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <RiskWarning />
      </div>
      <CTA
        title="Take the simulated tour"
        description="Open a demo account in under a minute. Nothing is submitted, stored or traded."
      />
    </>
  );
}
