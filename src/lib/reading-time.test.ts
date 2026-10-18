import { describe, expect, it } from "vitest";
import { ARTICLES, articleText, getArticle } from "@/data/articles";
import { countWords, readingTimeMinutes } from "./reading-time";

describe("countWords", () => {
  it("counts words, numbers and contractions", () => {
    expect(countWords("A pip is 0.0001 for EUR/USD, isn't it?")).toBe(9);
    expect(countWords("   ")).toBe(0);
  });
});

describe("readingTimeMinutes", () => {
  it("rounds up and never returns zero", () => {
    expect(readingTimeMinutes("")).toBe(1);
    expect(readingTimeMinutes(Array(200).fill("word").join(" "))).toBe(1);
    expect(readingTimeMinutes(Array(201).fill("word").join(" "))).toBe(2);
  });

  it("rejects a non-positive reading speed", () => {
    expect(() => readingTimeMinutes("text", 0)).toThrow(RangeError);
  });
});

describe("articles", () => {
  it("has six articles with unique slugs, titles and descriptions", () => {
    expect(ARTICLES).toHaveLength(6);
    for (const key of ["slug", "title", "description"] as const) {
      expect(new Set(ARTICLES.map((a) => a[key])).size).toBe(6);
    }
    expect(getArticle("order-types")?.title).toMatch(/Order types/);
    expect(getArticle("missing")).toBeUndefined();
  });

  it("has URL-safe slugs and a realistic reading time", () => {
    for (const article of ARTICLES) {
      expect(article.slug).toMatch(/^[a-z0-9]+(-[a-z0-9]+)*$/);
      const minutes = readingTimeMinutes(articleText(article));
      expect(minutes).toBeGreaterThanOrEqual(2);
      expect(minutes).toBeLessThanOrEqual(8);
    }
  });

  it("never promises profits", () => {
    const banned = /guarantee(d)? (profit|return)|risk[- ]free|get rich|easy money/i;
    for (const article of ARTICLES) expect(articleText(article)).not.toMatch(banned);
  });
});
