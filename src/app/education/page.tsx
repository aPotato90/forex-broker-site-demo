import { ArrowRightIcon, ClockIcon } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import { PageHero } from "@/components/site/page-hero";
import { Section } from "@/components/site/section";
import { ARTICLES, articleText } from "@/data/articles";
import { pageMetadata } from "@/lib/metadata";
import { readingTimeMinutes } from "@/lib/reading-time";

export const metadata: Metadata = pageMetadata({
  title: "Education: forex basics explained",
  description:
    "Six short, neutral guides on pips and lots, leverage and margin, risk management, order types, candlestick charts and trading psychology.",
  path: "/education",
});

export default function EducationPage() {
  return (
    <>
      <PageHero
        eyebrow="Education"
        title="Plain-English guides to the basics"
        description="Short, original articles that explain how forex trading works. They are general education, not advice, and they never promise results."
      />
      <Section className="pt-10 sm:pt-12 lg:pt-14">
        <ul className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {ARTICLES.map((article) => (
            <li key={article.slug}>
              <article className="group relative flex h-full flex-col rounded-2xl border bg-card p-6 text-card-foreground shadow-xs transition-shadow hover:shadow-md">
                <div className="flex items-center gap-2 text-xs font-medium">
                  <span className="rounded-full bg-brand/15 px-2.5 py-0.5 text-brand-text">
                    {article.topic}
                  </span>
                  <span className="text-muted-foreground">{article.level}</span>
                </div>
                <h2 className="mt-4 text-xl font-semibold">
                  <Link
                    href={`/education/${article.slug}`}
                    className="after:absolute after:inset-0 after:rounded-2xl"
                  >
                    {article.title}
                  </Link>
                </h2>
                <p className="mt-2 flex-1 text-sm text-muted-foreground">{article.description}</p>
                <p className="mt-5 flex items-center justify-between text-sm">
                  <span className="inline-flex items-center gap-1.5 text-muted-foreground">
                    <ClockIcon aria-hidden className="size-4" />
                    {readingTimeMinutes(articleText(article))} min read
                  </span>
                  <ArrowRightIcon
                    aria-hidden
                    className="size-4 text-brand-text transition-transform group-hover:translate-x-0.5"
                  />
                </p>
              </article>
            </li>
          ))}
        </ul>
      </Section>
    </>
  );
}
