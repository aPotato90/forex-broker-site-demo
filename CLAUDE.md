@AGENTS.md

# Valtrex Markets — fictional broker demo

This repository is a **portfolio demo** by Emmanuel Kelvin (full-stack developer). It looks like a
forex broker marketing site, but the broker is **entirely fictional**. Nothing here is real: there
is no trading, no deposits, no accounts, no regulation and no market data.

## Non-negotiable content rules

- **Brand:** the only brand name is the invented "Valtrex Markets". Never use a real broker's name,
  logo, slogan, colour scheme or copy. Do not use "Meridian Capital Markets" or any name that
  resembles a real firm.
- **Demo banner:** every page shows "Demo website. Not a real broker. No real trading or deposits."
  (rendered once in the root layout) and the footer repeats it.
- **Risk warning:** relevant pages (home, markets, accounts, platforms, tools, open-account, legal)
  include the neutral warning: "Trading leveraged products carries a high risk of loss. This is a
  demo; nothing here is financial advice or an offer." Use `<RiskWarning />`.
- **No false claims:** never claim guaranteed or likely profits. No testimonials, awards,
  regulatory licence numbers, client counts or audited statistics, fake or otherwise. Use clearly
  illustrative or placeholder wording ("illustrative", "example", "sample data", "simulated").
- **Simulated prices only:** every price is generated locally by the seeded engine in
  `src/lib/forex/market.ts` and labelled "Simulated prices" wherever it appears. No network calls,
  no external data APIs.
- **Forms never send or store anything.** No server actions, no API routes, no analytics, no
  `localStorage` for form data. The only thing persisted is the theme preference in
  `localStorage`.
- **Privacy:** no cookies, no tracking, no third-party scripts, no external fonts beyond
  `next/font`, no stock photos (draw visuals with SVG/CSS). No API keys or secrets; the only env
  vars are `NEXT_PUBLIC_PORTFOLIO_URL` and `NEXT_PUBLIC_SITE_URL` (see `.env.example`).
- **Structured data:** JSON-LD uses `WebSite` only. Never mark the site up as a real
  `FinancialService` or `Organization`.

## Engineering

- Next.js App Router with Cache Components (see `AGENTS.md`: read `node_modules/next/dist/docs/`
  before using an unfamiliar API). TypeScript strict, Tailwind CSS v4, shadcn/ui (Radix), Motion
  (`motion/mini` where possible), Lucide, Zod + React Hook Form, Vitest, Prettier. npm only.
- Server Components by default. Add `"use client"` only for interactive leaves (ticker, tables,
  calculators, forms, theme toggle, mobile menu). Keep dependencies light.
- Under Cache Components, do not call `Date.now()`, `new Date()` or `Math.random()` while
  rendering a Server Component; derive time-relative UI on the client.
- Pure logic lives in `src/lib/` with Vitest tests next to it (`*.test.ts`). Forex maths in
  `src/lib/forex/`, content in `src/data/`.
- Accessibility: semantic HTML, full keyboard support, visible focus, WCAG AA contrast, respect
  `prefers-reduced-motion` (no auto-updating prices or entrance animation when it is set). Live
  prices must not announce every tick: static `aria-label` on the region plus a "Pause updates"
  button.
- Mobile-first. Check layouts at 375, 768 and 1280px in light and dark themes. The theme is set
  by an inline script in `<head>` before first paint, so there must be no flash of the wrong theme.

## Before declaring a task done

Run and make sure all pass:

```bash
npm run lint
npm run format:check
npm test
npm run build
npm run test:e2e   # headless Chromium: layout, behaviour and axe-core audit of every page
```
