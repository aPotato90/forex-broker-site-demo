import { ARTICLES, getArticle } from "@/data/articles";
import { brandImage, OG_SIZE } from "@/lib/og/brand-image";

export const alt = "Emmy Capital education guide (fictional demo)";
export const size = OG_SIZE;
export const contentType = "image/png";

export function generateStaticParams() {
  return ARTICLES.map((article) => ({ slug: article.slug }));
}

export default async function Image({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  return brandImage({
    eyebrow: "Education guide",
    title: getArticle(slug)?.title ?? "Education",
  });
}
