import type { Metadata } from "next";
import { siteConfig } from "./site";

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
    },
    twitter: {
      card: "summary_large_image",
      title: `${title} | ${siteConfig.name} (demo)`,
      description,
    },
  };
}
