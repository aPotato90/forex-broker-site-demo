import type { Metadata } from "next";
import { PageHero } from "@/components/site/page-hero";
import { RiskWarning } from "@/components/site/risk-warning";
import { pageMetadata } from "@/lib/metadata";
import { DEMO_NOTICE, RISK_WARNING, siteConfig } from "@/lib/site";

export const metadata: Metadata = pageMetadata({
  title: "Legal: disclaimer, risk warning and privacy",
  description:
    "Demo disclaimer, general risk warning and a plain privacy statement for the fictional Valtrex Markets website: it collects nothing.",
  path: "/legal",
});

export default function LegalPage() {
  return (
    <>
      <PageHero
        eyebrow="Legal"
        title="Disclaimer, risk warning and privacy"
        description="Plain-language statements about what this website is and is not."
      />
      <div className="mx-auto max-w-3xl space-y-12 px-4 py-12 text-[1.02rem] leading-relaxed sm:px-6 sm:py-16">
        <section id="disclaimer" aria-labelledby="disclaimer-title" className="space-y-4">
          <h2 id="disclaimer-title" className="text-2xl font-semibold">
            Demo disclaimer
          </h2>
          <p className="font-medium">{DEMO_NOTICE}</p>
          <p>
            Valtrex Markets is a fictional brand created by {siteConfig.author} for a software
            development portfolio. It is not a company, broker, dealer, adviser or financial
            institution, and it is not authorised, licensed or registered by any regulator.
          </p>
          <ul className="list-disc space-y-2 pl-6">
            <li>No accounts can be opened and no money can be deposited or withdrawn.</li>
            <li>No orders are placed and no trades are executed.</li>
            <li>
              All prices are simulated in your browser by a random-number generator. They are not
              market data and must not be relied on.
            </li>
            <li>
              Spreads, deposits, leverage, commissions and other figures are illustrative
              placeholders, not offers.
            </li>
            <li>Economic calendar events are fictional sample data.</li>
            <li>
              Any resemblance to a real company&apos;s name, branding or products is unintended.
            </li>
          </ul>
        </section>

        <section id="risk" aria-labelledby="risk-title" className="space-y-4">
          <h2 id="risk-title" className="text-2xl font-semibold">
            Risk warning
          </h2>
          <p>{RISK_WARNING}</p>
          <p>
            In general, leveraged products such as contracts for difference and margin foreign
            exchange can result in losses that build quickly, because profit and loss are calculated
            on the full position size rather than the margin used. The educational content and
            calculators on this site are general information only and do not take anyone&apos;s
            circumstances into account.
          </p>
          <RiskWarning />
        </section>

        <section id="privacy" aria-labelledby="privacy-title" className="space-y-4">
          <h2 id="privacy-title" className="text-2xl font-semibold">
            Privacy statement
          </h2>
          <p>
            <strong>This website collects nothing.</strong>
          </p>
          <ul className="list-disc space-y-2 pl-6">
            <li>No cookies are set.</li>
            <li>No analytics, tracking pixels, advertising or third-party scripts are loaded.</li>
            <li>
              Forms validate in your browser only. Nothing you type is sent to a server, emailed or
              stored.
            </li>
            <li>
              Fonts are self-hosted with the site, so no requests go to font providers while you
              browse.
            </li>
            <li>
              Your light or dark theme choice is saved in your own browser&apos;s local storage so
              it persists between visits. It never leaves your device, and you can clear it at any
              time through your browser settings.
            </li>
          </ul>
          <p>
            The hosting provider that serves these pages may keep standard technical server logs
            under its own policies. This demo does not access or use them.
          </p>
        </section>
      </div>
    </>
  );
}
