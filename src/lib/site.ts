export const DEMO_NOTICE = "Demo website. Not a real broker. No real trading or deposits.";

export const RISK_WARNING =
  "Trading leveraged products carries a high risk of loss. This is a demo; nothing here is financial advice or an offer.";

function normaliseUrl(value: string | undefined, fallback: string): string {
  const url = value?.trim();
  if (!url) return fallback;
  return url.replace(/\/+$/, "");
}

export const siteConfig = {
  name: "Emmy Capital",
  shortName: "Emmy",
  tagline: "A fictional forex broker website, built as a portfolio demo.",
  description:
    "Emmy Capital is a fictional forex broker demo website by Emmanuel Kelvin. Simulated prices, working calculators and educational guides. No real trading, accounts or deposits.",
  url: normaliseUrl(process.env.NEXT_PUBLIC_SITE_URL, "http://localhost:3000"),
  portfolioUrl: normaliseUrl(
    process.env.NEXT_PUBLIC_PORTFOLIO_URL,
    "https://github.com/apotato90/forex-broker-site-demo",
  ),
  author: "Emmanuel Kelvin",
} as const;

export interface NavItem {
  href: string;
  label: string;
}

export const mainNav: readonly NavItem[] = [
  { href: "/markets", label: "Markets" },
  { href: "/accounts", label: "Accounts" },
  { href: "/platforms", label: "Platforms" },
  { href: "/tools", label: "Tools" },
  { href: "/education", label: "Education" },
  { href: "/calendar", label: "Calendar" },
];

export const footerNav: readonly { title: string; items: readonly NavItem[] }[] = [
  {
    title: "Trading (simulated)",
    items: [
      { href: "/markets", label: "Markets" },
      { href: "/accounts", label: "Account types" },
      { href: "/platforms", label: "Platforms" },
      { href: "/calendar", label: "Economic calendar" },
    ],
  },
  {
    title: "Learn",
    items: [
      { href: "/education", label: "Education" },
      { href: "/tools", label: "Calculators" },
    ],
  },
  {
    title: "About this demo",
    items: [
      { href: "/about", label: "About" },
      { href: "/contact", label: "Contact" },
      { href: "/legal", label: "Legal & privacy" },
      { href: "/open-account", label: "Open a demo account" },
    ],
  },
];
