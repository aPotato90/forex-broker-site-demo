import { ExternalLinkIcon } from "lucide-react";
import Link from "next/link";
import { DEMO_NOTICE, RISK_WARNING, footerNav, siteConfig } from "@/lib/site";
import { LogoMark } from "./logo";

export function Footer() {
  return (
    <footer className="dark border-t bg-background text-foreground">
      <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
        <div className="grid gap-10 lg:grid-cols-[1.3fr_2fr]">
          <div className="max-w-sm">
            <div className="flex items-center gap-2.5 font-heading text-lg font-semibold">
              <LogoMark />
              Valtrex Markets
            </div>
            <p className="mt-4 text-sm text-muted-foreground">
              A fictional broker brand created for a portfolio project. There is no company, no
              licence and no trading behind this website.
            </p>
            <p className="mt-6 text-sm">
              Built by{" "}
              <a
                href={siteConfig.portfolioUrl}
                className="inline-flex items-center gap-1 font-medium text-brand-text underline-offset-4 hover:underline"
              >
                {siteConfig.author}
                <ExternalLinkIcon aria-hidden className="size-3.5" />
                <span className="sr-only">(portfolio, opens external site)</span>
              </a>
            </p>
          </div>
          <div className="grid grid-cols-2 gap-8 sm:grid-cols-3">
            {footerNav.map((group) => (
              <nav key={group.title} aria-label={group.title}>
                <h2 className="font-sans text-sm font-semibold">{group.title}</h2>
                <ul className="mt-3 space-y-2">
                  {group.items.map((item) => (
                    <li key={item.href}>
                      <Link
                        href={item.href}
                        className="text-sm text-muted-foreground underline-offset-4 hover:text-foreground hover:underline"
                      >
                        {item.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </nav>
            ))}
          </div>
        </div>
        <div className="mt-12 space-y-3 border-t pt-8 text-xs leading-relaxed text-muted-foreground">
          <p>
            <strong className="font-semibold text-foreground">Demo notice:</strong> {DEMO_NOTICE}{" "}
            Valtrex Markets is invented. All prices are simulated in your browser, all figures are
            illustrative, and no form on this site sends or stores data.
          </p>
          <p>
            <strong className="font-semibold text-foreground">Risk warning:</strong> {RISK_WARNING}
          </p>
          <p>
            Portfolio project by {siteConfig.author}.{" "}
            <a
              href={siteConfig.portfolioUrl}
              className="font-medium text-brand-text underline underline-offset-4"
            >
              View the portfolio
            </a>
            .
          </p>
        </div>
      </div>
    </footer>
  );
}
