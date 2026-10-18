import { CheckIcon } from "lucide-react";
import Link from "next/link";
import { cn } from "cn";
import { Button } from "@/components/ui/button";
import { ACCOUNT_TIERS, COMPARISON_ROWS, type AccountTier } from "@/data/accounts";

function TierCard({ tier }: { tier: AccountTier }) {
  return (
    <article
      aria-labelledby={`tier-${tier.id}`}
      className={cn(
        "relative flex flex-col rounded-2xl border bg-card p-6 text-card-foreground shadow-xs",
        tier.featured && "border-brand/70 shadow-lg ring-1 ring-brand/40",
      )}
    >
      {tier.featured && (
        <p className="absolute -top-3 left-6 rounded-full bg-primary px-3 py-0.5 text-xs font-semibold text-primary-foreground">
          Example highlight
        </p>
      )}
      <h3 id={`tier-${tier.id}`} className="text-xl font-semibold">
        {tier.name}
      </h3>
      <p className="mt-2 text-sm text-muted-foreground">{tier.summary}</p>
      <p className="mt-6">
        <span className="text-sm text-muted-foreground">Spreads from </span>
        <span className="tabular font-heading text-3xl font-semibold">{tier.spreadFrom}</span>
        <span className="mt-1 block text-xs font-medium text-brand-text">Illustrative only</span>
      </p>
      <ul className="mt-6 flex-1 space-y-2.5 text-sm">
        {tier.highlights.map((item) => (
          <li key={item} className="flex gap-2">
            <CheckIcon aria-hidden className="mt-0.5 size-4 shrink-0 text-brand-text" />
            {item}
          </li>
        ))}
      </ul>
      <Button asChild size="lg" variant={tier.featured ? "default" : "outline"} className="mt-8">
        <Link href="/open-account">Try the {tier.name} demo form</Link>
      </Button>
    </article>
  );
}

/** Tier cards plus a full comparison table. All values are fictional and illustrative. */
export function PricingTable() {
  return (
    <div className="space-y-12">
      <div className="grid gap-6 pt-3 md:grid-cols-3">
        {ACCOUNT_TIERS.map((tier) => (
          <TierCard key={tier.id} tier={tier} />
        ))}
      </div>

      <div
        role="region"
        aria-labelledby="comparison-caption"
        tabIndex={0}
        className="relative overflow-x-auto rounded-2xl border bg-card text-card-foreground"
      >
        <table className="w-full min-w-[640px] text-sm">
          <caption id="comparison-caption" className="p-5 text-left">
            <span className="block font-heading text-lg font-semibold">
              Account comparison (illustrative)
            </span>
            <span className="mt-1 block text-sm text-muted-foreground">
              Fictional figures for a demo website. They are not real prices, fees or leverage and
              are not an offer.
            </span>
          </caption>
          <thead className="border-y bg-muted/50">
            <tr>
              <th scope="col" className="px-5 py-3 text-left font-medium text-muted-foreground">
                Feature
              </th>
              {ACCOUNT_TIERS.map((tier) => (
                <th key={tier.id} scope="col" className="px-5 py-3 text-left font-semibold">
                  {tier.name}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y">
            {COMPARISON_ROWS.map((row) => (
              <tr key={row.key}>
                <th scope="row" className="px-5 py-3.5 text-left font-medium">
                  {row.label}
                </th>
                {ACCOUNT_TIERS.map((tier) => (
                  <td key={tier.id} className="tabular px-5 py-3.5">
                    {String(tier[row.key])}
                  </td>
                ))}
              </tr>
            ))}
            <tr>
              <th scope="row" className="px-5 py-3.5 text-left font-medium">
                Real money
              </th>
              {ACCOUNT_TIERS.map((tier) => (
                <td key={tier.id} className="px-5 py-3.5 text-muted-foreground">
                  None. Demo only
                </td>
              ))}
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}
