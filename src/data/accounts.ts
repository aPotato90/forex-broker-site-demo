/**
 * Fictional account tiers. Every figure is illustrative: there are no real accounts, prices,
 * leverage or fees behind this demo.
 */
export interface AccountTier {
  id: "standard" | "pro" | "institutional";
  name: string;
  summary: string;
  spreadFrom: string;
  minDeposit: string;
  leverageCap: string;
  commission: string;
  platforms: string;
  highlights: string[];
  featured?: boolean;
}

export const ACCOUNT_TIERS: readonly AccountTier[] = [
  {
    id: "standard",
    name: "Standard",
    summary: "A simple, spread-only example account for getting familiar with the layout.",
    spreadFrom: "1.2 pips",
    minDeposit: "$100",
    leverageCap: "1:30",
    commission: "None",
    platforms: "Web, desktop, mobile",
    highlights: [
      "Spread-only pricing (example)",
      "Micro lots from 0.01",
      "Access to every demo calculator",
    ],
  },
  {
    id: "pro",
    name: "Pro",
    summary: "An example of a lower-spread account with a separate per-lot commission.",
    spreadFrom: "0.4 pips",
    minDeposit: "$1,000",
    leverageCap: "1:30",
    commission: "$3.50 per lot, per side",
    platforms: "Web, desktop, mobile",
    highlights: [
      "Raw-style spreads plus commission (example)",
      "Advanced order types in the mockup",
      "Simulated market depth view",
    ],
    featured: true,
  },
  {
    id: "institutional",
    name: "Institutional",
    summary: "A placeholder showing how a bespoke tier could be presented.",
    spreadFrom: "0.1 pips",
    minDeposit: "By arrangement",
    leverageCap: "1:10 to 1:30",
    commission: "Tiered by volume",
    platforms: "Desktop, API (concept only)",
    highlights: [
      "Tiered commission (example)",
      "Dedicated contact (concept only)",
      "Custom reporting (concept only)",
    ],
  },
];

export const COMPARISON_ROWS: readonly { label: string; key: keyof AccountTier }[] = [
  { label: "Spreads from", key: "spreadFrom" },
  { label: "Minimum deposit", key: "minDeposit" },
  { label: "Leverage cap", key: "leverageCap" },
  { label: "Commission", key: "commission" },
  { label: "Platforms", key: "platforms" },
];
