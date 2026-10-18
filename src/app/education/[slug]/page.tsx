import { ArrowLeftIcon, ArrowRightIcon, ClockIcon } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { RiskWarning } from "@/components/site/risk-warning";
import { ARTICLES, articleText, getArticle, type ArticleBlock } from "@/data/articles";
import { pageMetadata } from "@/lib/metadata";
import { readingTimeMinutes } from "@/lib/reading-time";

export function generateStaticParams() {
  return ARTICLES.map((article) => ({ slug: article.slug }));
}

export async function generateMetadata({
  params,
}: PageProps<"/education/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const article = getArticle(slug);
  if (!article) return { title: "Article not found" };
  return pageMetadata({
    title: article.title,
    description: article.description,
    path: `/education/${article.slug}`,
    type: "article",
  });
}

function Block({ block }: { block: ArticleBlock }) {
  switch (block.type) {
    case "p":
      return <p>{block.text}</p>;
    case "list":
      return (
        <ul className="list-disc space-y-2 pl-6 marker:text-brand-text">
          {block.items.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      );
    case "formula":
      return (
        <figure className="rounded-xl border bg-muted/60 p-4">
          <code className="block font-mono text-sm text-foreground">{block.expression}</code>
          <figcaption className="mt-2 text-sm text-muted-foreground">{block.caption}</figcaption>
        </figure>
      );
    case "example":
      return (
        <div className="rounded-xl border-l-4 border-brand bg-brand/10 p-4">
          <p className="font-semibold text-foreground">{block.title}</p>
          <p className="mt-1">{block.text}</p>
        </div>
      );
  }
}

export default async function ArticlePage({ params }: PageProps<"/education/[slug]">) {
  const { slug } = await params;
  const article = getArticle(slug);
  if (!article) notFound();

  const index = ARTICLES.indexOf(article);
  const next = ARTICLES[(index + 1) % ARTICLES.length];
  const minutes = readingTimeMinutes(articleText(article));

  return (
    <article className="pb-16">
      <header className="dark relative overflow-hidden bg-background text-foreground">
        <div aria-hidden className="bg-grid mask-fade-b absolute inset-0" />
        <div className="relative mx-auto max-w-3xl px-4 py-14 sm:px-6 sm:py-20">
          <nav aria-label="Breadcrumb">
            <Link
              href="/education"
              className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground"
            >
              <ArrowLeftIcon aria-hidden className="size-4" />
              All guides
            </Link>
          </nav>
          <p className="mt-6 flex flex-wrap items-center gap-x-3 gap-y-1 text-sm">
            <span className="font-semibold text-brand-text">{article.topic}</span>
            <span className="text-muted-foreground">{article.level}</span>
            <span className="inline-flex items-center gap-1.5 text-muted-foreground">
              <ClockIcon aria-hidden className="size-4" />
              {minutes} min read
            </span>
          </p>
          <h1 className="mt-3 text-3xl font-semibold sm:text-5xl">{article.title}</h1>
          <p className="mt-5 text-lg text-pretty text-muted-foreground">{article.description}</p>
        </div>
      </header>

      <div className="mx-auto max-w-3xl px-4 sm:px-6">
        <aside
          aria-labelledby="key-points"
          className="-mt-6 rounded-2xl border bg-card p-6 shadow-sm"
        >
          <h2 id="key-points" className="text-base font-semibold">
            Key points
          </h2>
          <ul className="mt-3 space-y-2 text-[0.95rem]">
            {article.keyPoints.map((point) => (
              <li key={point} className="flex gap-2">
                <span aria-hidden className="mt-2 size-1.5 shrink-0 rounded-full bg-brand" />
                {point}
              </li>
            ))}
          </ul>
        </aside>

        <div className="mt-10 space-y-10 text-[1.05rem] leading-relaxed text-foreground/90">
          {article.sections.map((section) => (
            <section key={section.heading} className="space-y-4">
              <h2 className="text-2xl font-semibold text-foreground">{section.heading}</h2>
              {section.blocks.map((block, i) => (
                <Block key={i} block={block} />
              ))}
            </section>
          ))}
        </div>

        <RiskWarning className="mt-12" />
        <p className="mt-4 text-sm text-muted-foreground">
          Written for the Emmy Capital demo as general education. It is not financial advice.
        </p>

        <nav aria-label="Next guide" className="mt-10 border-t pt-8">
          <Link
            href={`/education/${next.slug}`}
            className="group flex items-center justify-between gap-4 rounded-2xl border bg-card p-5 hover:shadow-md"
          >
            <span>
              <span className="block text-xs font-semibold tracking-wide text-muted-foreground uppercase">
                Next guide
              </span>
              <span className="mt-1 block font-heading text-lg font-semibold">{next.title}</span>
            </span>
            <ArrowRightIcon
              aria-hidden
              className="size-5 shrink-0 text-brand-text transition-transform group-hover:translate-x-1"
            />
          </Link>
        </nav>
      </div>
    </article>
  );
}
