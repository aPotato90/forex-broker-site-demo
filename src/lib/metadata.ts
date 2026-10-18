import type { Metadata } from "next";
import { siteConfig } from "./site";

export const DEFAULT_OG_IMAGE_ALT = `${siteConfig.name}, a fictional forex broker demo website`;

/*
 * A page-level `openGraph`/`twitter` object replaces the inherited one, which would drop the
 * site-wide generated image (app/opengraph-image.tsx), so re-attach it here. Articles leave
 * `images` unset so their own education/[slug]/opengraph-image card is used instead.
 */
const DEFAULT_OG_IMAGE = {
  url: "/opengraph-image",
  width: 1200,
  height: 630,
  alt: DEFAULT_OG_IMAGE_ALT,
  type: "image/png",
};

interface PageMetadataInput {
  title: string;
  description: string;
  path: string;
  type?: "website" | "article";
}

/** Unique title, description, canonical URL and social tags for a page. */
export function pageMetadata({
  title,
  description,
  path,
  type = "website",
}: PageMetadataInput): Metadata {
  // Omit the key entirely for articles: even `images: undefined` suppresses the file-based card.
  const images = type === "article" ? {} : { images: [DEFAULT_OG_IMAGE] };
  return {
    title,
    description,
    alternates: { canonical: path },
    openGraph: {
      title: `${title} | ${siteConfig.name} (demo)`,
      description,
      url: path,
      siteName: `${siteConfig.name} (fictional demo)`,
      type,
      locale: "en_GB",
      ...images,
    },
    twitter: {
      card: "summary_large_image",
      title: `${title} | ${siteConfig.name} (demo)`,
      description,
      ...images,
    },
  };
}
