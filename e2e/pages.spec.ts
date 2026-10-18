import AxeBuilder from "@axe-core/playwright";
import { expect, test, type Page } from "@playwright/test";
import { ROUTES } from "./routes";

const DEMO_NOTICE = "Demo website. Not a real broker. No real trading or deposits.";

function collectErrors(page: Page) {
  const errors: string[] = [];
  page.on("console", (msg) => {
    if (msg.type() === "error") errors.push(msg.text());
  });
  page.on("pageerror", (err) => errors.push(String(err)));
  page.on("response", (res) => {
    if (res.status() >= 400) errors.push(`${res.status()} ${res.url()}`);
  });
  return errors;
}

/** Scroll through the page so scroll-triggered reveals have finished before checks. */
async function scrollThrough(page: Page) {
  await page.evaluate(async () => {
    for (let y = 0; y < document.body.scrollHeight; y += 500) {
      window.scrollTo(0, y);
      await new Promise((r) => setTimeout(r, 40));
    }
    window.scrollTo(0, 0);
  });
  await page.waitForTimeout(700);
}

for (const route of ROUTES) {
  test.describe(route, () => {
    test("renders without errors, overflow or accessibility violations", async ({ page }, info) => {
      const errors = collectErrors(page);
      await page.goto(route, { waitUntil: "networkidle" });

      // Theme applied from the system preference.
      const dark = info.project.name.endsWith("dark");
      await expect(page.locator("html")).toHaveClass(dark ? /\bdark\b/ : /^(?!.*\bdark\b)/);

      await expect(page.getByRole("complementary", { name: "Demo notice" })).toContainText(
        DEMO_NOTICE,
      );
      await expect(page.locator("footer")).toContainText(DEMO_NOTICE);
      await expect(page.getByRole("heading", { level: 1 })).toHaveCount(1);
      await expect(page).toHaveTitle(/Emmy Capital/);

      await scrollThrough(page);

      const overflow = await page.evaluate(
        () => document.documentElement.scrollWidth - document.documentElement.clientWidth,
      );
      expect(overflow, "horizontal overflow in px").toBeLessThanOrEqual(0);

      const results = await new AxeBuilder({ page })
        .withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa", "wcag22aa", "best-practice"])
        .analyze();
      const summary = results.violations.map(
        (v) => `${v.id} (${v.impact}): ${v.nodes.map((n) => n.target.join(" ")).join(", ")}`,
      );
      expect(summary, "axe violations").toEqual([]);

      expect(errors, "console errors / failed requests").toEqual([]);
    });
  });
}

test("simulated price label appears wherever prices are shown", async ({ page }) => {
  for (const route of ["/", "/markets", "/platforms"]) {
    await page.goto(route);
    await expect(page.getByText(/Simulated prices/).first()).toBeVisible();
  }
});

test("pages with leverage or pricing content show the risk warning", async ({ page }) => {
  for (const route of [
    "/",
    "/markets",
    "/accounts",
    "/platforms",
    "/tools",
    "/open-account",
    "/legal",
  ]) {
    await page.goto(route);
    await expect(
      page.locator("main").getByRole("complementary", { name: "Risk warning" }).first(),
    ).toBeVisible();
  }
});

test("unknown routes render the custom 404", async ({ page }) => {
  const response = await page.goto("/this-page-does-not-exist");
  expect(response?.status()).toBe(404);
  await expect(page.getByRole("heading", { level: 1 })).toHaveText("This page went off the chart");
  await expect(page.getByRole("complementary", { name: "Demo notice" })).toBeVisible();
});

test("brand name and initials are consistent across the site", async ({ page, request }) => {
  await page.goto("/legal");
  await expect(page.getByRole("banner").getByRole("link").first()).toHaveText(
    /Emmy Capital\s*Fictional demo/,
  );
  await expect(page.locator("footer")).toContainText("Emmy Capital");
  await expect(page.locator("main")).toContainText("Emmy Capital is a fictional brand");
  await expect(page).toHaveTitle(/\| Emmy Capital \(demo\)$/);

  const ogTitle = await page.locator('meta[property="og:title"]').getAttribute("content");
  expect(ogTitle).toContain("Emmy Capital");
  const siteName = await page.locator('meta[property="og:site_name"]').getAttribute("content");
  expect(siteName).toBe("Emmy Capital (fictional demo)");

  const jsonLd = JSON.parse(
    (await page.locator('script[type="application/ld+json"]').textContent()) ?? "{}",
  );
  expect(jsonLd).toMatchObject({ "@type": "WebSite", name: "Emmy Capital (fictional demo)" });

  // Generated images (favicon, apple icon, social cards) are served as PNGs.
  for (const path of [
    "/icon",
    "/apple-icon",
    "/opengraph-image",
    "/education/order-types/opengraph-image",
  ]) {
    const response = await request.get(path);
    expect(response.status(), path).toBe(200);
    expect(response.headers()["content-type"], path).toContain("image/png");
  }
  const ogAlt = await page.locator('meta[property="og:image:alt"]').getAttribute("content");
  expect(ogAlt).toContain("Emmy Capital");

  // Every page shares a social image; articles use their own generated card.
  for (const [route, image] of [
    ["/", "/opengraph-image"],
    ["/markets", "/opengraph-image"],
    ["/education", "/opengraph-image"],
    ["/education/order-types", "/education/order-types/opengraph-image"],
  ]) {
    await page.goto(route);
    const og = await page.locator('meta[property="og:image"]').first().getAttribute("content");
    expect(new URL(og ?? "").pathname, route).toBe(image);
    await expect(page.locator('meta[name="twitter:image"]').first(), route).toHaveAttribute(
      "content",
      new RegExp(image.replace(/\//g, "\\/")),
    );
  }
});
