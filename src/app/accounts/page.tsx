import type { Metadata } from "next";
import Link from "next/link";
import { CTA } from "@/components/site/cta";
import { PageHero } from "@/components/site/page-hero";
import { PricingTable } from "@/components/site/pricing-table";
import { RiskWarning } from "@/components/site/risk-warning";
import { Section } from "@/components/site/section";
import { pageMetadata } from "@/lib/metadata";

export const metadata: Metadata = pageMetadata({
  title: "Account types (illustrative)",
  description:
    "Compare three fictional account types, Standard, Pro and Institutional, with illustrative spreads, deposits, leverage caps and commissions. Demo only.",
  path: "/accounts",
});

export default function AccountsPage() {
  return (
    <>
      <PageHero
        eyebrow="Accounts"
        title="Three fictional account types"
        description="A layout study for presenting account tiers clearly. Every spread, deposit, leverage cap and commission below is an illustrative placeholder, not a real price or offer."
      />
      <Section className="pt-10 sm:pt-12 lg:pt-14">
        <RiskWarning className="mb-10" />
        <PricingTable />
        <div className="mt-10 grid gap-6 text-sm text-muted-foreground md:grid-cols-2">
          <div className="rounded-2xl border bg-card p-6">
            <h2 className="text-lg font-semibold text-foreground">About the leverage figures</h2>
            <p className="mt-2">
              Leverage caps are shown as ratios such as 1:30 to demonstrate how a broker site might
              present them. Higher leverage increases both potential losses and potential gains
              relative to the margin used. See{" "}
              <Link
                href="/education/leverage-and-margin"
                className="font-medium text-brand-text underline underline-offset-4"
              >
                leverage and margin explained
              </Link>
              .
            </p>
          </div>
          <div className="rounded-2xl border bg-card p-6">
            <h2 className="text-lg font-semibold text-foreground">No regulatory claims</h2>
            <p className="mt-2">
              Valtrex Markets is not a company and holds no licence, authorisation or registration
              anywhere. A real broker&apos;s account page would include its regulatory details and
              full cost disclosures.
            </p>
          </div>
        </div>
      </Section>
      <CTA
        title="See how the sign-up flow feels"
        description="The demo account form validates each step and then confirms that nothing was submitted."
        secondary={{ href: "/tools", label: "Try the calculators" }}
      />
    </>
  );
}
