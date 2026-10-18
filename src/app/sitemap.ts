import type { MetadataRoute } from "next";
import { ARTICLES } from "@/data/articles";
import { siteConfig } from "@/lib/site";

const ROUTES = [
  "",
  "/markets",
  "/accounts",
  "/platforms",
  "/tools",
  "/education",
  "/calendar",
  "/open-account",
  "/contact",
  "/about",
  "/legal",
];

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    ...ROUTES.map((route) => ({
      url: `${siteConfig.url}${route}`,
      changeFrequency: "monthly" as const,
      priority: route === "" ? 1 : 0.7,
    })),
    ...ARTICLES.map((article) => ({
      url: `${siteConfig.url}/education/${article.slug}`,
      changeFrequency: "yearly" as const,
      priority: 0.5,
    })),
  ];
}
