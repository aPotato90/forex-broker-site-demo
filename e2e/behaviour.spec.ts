import { expect, test, type Locator, type Page } from "@playwright/test";

// Interaction tests run once per viewport in the light theme; theme specifics are tested below.
test.beforeEach(async ({ page }, info) => {
  test.skip(info.project.name.endsWith("dark"), "behaviour is theme-independent");
  // Interact only once the client bundle has loaded and hydrated.
  const goto = page.goto.bind(page);
  page.goto = (url, options) => goto(url, { waitUntil: "networkidle", ...options });
});

const firstBid = (page: Page) =>
  page.locator("table tbody tr").first().locator("td").first().innerText();

async function bids(table: Locator) {
  return table.locator("tbody tr td:nth-child(2)").allInnerTexts();
}

test.describe("markets table", () => {
  test("filters by category and search", async ({ page }) => {
    await page.goto("/markets");
    const table = page.getByRole("region", { name: /Simulated instruments table/ });
    await expect(table.locator("tbody tr")).toHaveCount(17);

    await page.getByRole("button", { name: "Metals" }).click();
    await expect(page.getByRole("button", { name: "Metals" })).toHaveAttribute(
      "aria-pressed",
      "true",
    );
    await expect(table.locator("tbody tr th")).toHaveText([/XAU\/USD/, /XAG\/USD/]);

    await page.getByRole("button", { name: "All" }).click();
    await page.getByRole("searchbox", { name: "Search instruments" }).fill("jpy");
    await expect(table.locator("tbody tr")).toHaveCount(3);

    await page.getByRole("searchbox", { name: "Search instruments" }).fill("zzz");
    await expect(table).toContainText("No simulated instruments match");
  });

  test("sorts columns with aria-sort", async ({ page }) => {
    await page.goto("/markets");
    await page.getByRole("button", { name: "Pause updates" }).click();
    const spreadHeader = page.getByRole("columnheader", { name: /Spread/ });
    await spreadHeader.getByRole("button").click();
    await expect(spreadHeader).toHaveAttribute("aria-sort", "descending");
    const table = page.getByRole("region", { name: /Simulated instruments table/ });
    const spreads = (await table.locator("tbody tr td:nth-child(4)").allInnerTexts()).map((t) =>
      parseFloat(t),
    );
    expect(spreads).toEqual([...spreads].sort((a, b) => b - a));

    await spreadHeader.getByRole("button").click();
    await expect(spreadHeader).toHaveAttribute("aria-sort", "ascending");

    const instrumentHeader = page.getByRole("columnheader", { name: /Instrument/ });
    await instrumentHeader.getByRole("button").click();
    await expect(instrumentHeader).toHaveAttribute("aria-sort", "ascending");
    const symbols = await table.locator("tbody tr th span:first-child").allInnerTexts();
    expect(symbols).toEqual([...symbols].sort((a, b) => a.localeCompare(b)));
  });

  test("updates over time and pauses on request", async ({ page }) => {
    await page.goto("/markets");
    const table = page.getByRole("region", { name: /Simulated instruments table/ });
    const initial = await bids(table);
    await expect.poll(() => bids(table), { timeout: 8000 }).not.toEqual(initial);

    const pause = page.getByRole("button", { name: "Pause updates" });
    await pause.click();
    await expect(pause).toHaveAttribute("aria-pressed", "true");
    await expect(page.getByText("Updates paused")).toBeVisible();
    const paused = await bids(table);
    await page.waitForTimeout(4500);
    expect(await bids(table)).toEqual(paused);

    await pause.click();
    await expect(pause).toHaveAttribute("aria-pressed", "false");
    await expect.poll(() => bids(table), { timeout: 8000 }).not.toEqual(paused);
  });

  test("pauses while the tab is hidden", async ({ page }) => {
    await page.goto("/markets");
    await page.evaluate(() => {
      Object.defineProperty(document, "visibilityState", {
        configurable: true,
        get: () => "hidden",
      });
      document.dispatchEvent(new Event("visibilitychange"));
    });
    await expect(page.getByText("Paused while tab is hidden")).toBeVisible();
    const table = page.getByRole("region", { name: /Simulated instruments table/ });
    const before = await bids(table);
    await page.waitForTimeout(4500);
    expect(await bids(table)).toEqual(before);
  });

  test("the live region is not announced on every tick", async ({ page }) => {
    await page.goto("/markets");
    await expect(page.locator("table [aria-live]")).toHaveCount(0);
    await page.goto("/");
    const ticker = page.getByRole("region", { name: /Simulated prices for selected instruments/ });
    await expect(ticker.locator("[aria-live]")).toHaveCount(0);
  });
});

test.describe("reduced motion", () => {
  test.use({ reducedMotion: "reduce" });

  test("prices stay still until the user opts in", async ({ page }) => {
    await page.goto("/markets");
    await expect(page.getByText("Paused (reduced motion is on)")).toBeVisible();
    await expect(page.getByRole("button", { name: "Pause updates" })).toHaveAttribute(
      "aria-pressed",
      "true",
    );
    const before = await firstBid(page);
    await page.waitForTimeout(4500);
    expect(await firstBid(page)).toBe(before);
  });

  test("the home ticker is also paused", async ({ page }) => {
    await page.goto("/");
    await expect(page.getByText("Paused (reduced motion is on)")).toBeVisible();
  });
});

test.describe("calculators", () => {
  test("show validation errors and compute results", async ({ page }) => {
    await page.goto("/tools");
    const section = page.locator("#position-size");
    await section.getByLabel("Stop-loss distance").fill("0");
    await section.getByLabel("Account balance").fill("");
    await section.getByRole("button", { name: "Calculate position size" }).click();
    await expect(section.getByText("Stop-loss must be more than 0 pips")).toBeVisible();
    await expect(section.getByText("Enter an account balance")).toBeVisible();
    await expect(section.getByLabel("Stop-loss distance")).toHaveAttribute("aria-invalid", "true");

    await section.getByLabel("Account balance").fill("5000");
    await section.getByLabel("Stop-loss distance").fill("30");
    await section.getByRole("button", { name: "Calculate position size" }).click();
    await expect(section.getByTestId("calculator-result")).toContainText("$50.00");
    await expect(section.getByTestId("calculator-result")).toContainText("0.16 lots");
  });

  test("handles JPY pairs and prefills reference prices", async ({ page }) => {
    await page.goto("/tools");
    const section = page.locator("#pip-value");
    await section.getByLabel("Currency pair").selectOption("EUR/USD");
    await expect(section.getByLabel("Current price")).toHaveValue("1.0842");
    await section.getByLabel("Currency pair").selectOption("USD/JPY");
    await section.getByLabel("Current price").fill("150");
    await section.getByRole("button", { name: "Calculate pip value" }).click();
    await expect(section.getByTestId("calculator-result")).toContainText("$6.67");
  });

  test("computes margin and profit/loss", async ({ page }) => {
    await page.goto("/tools");
    const margin = page.locator("#margin");
    await margin.getByLabel("Current price").fill("1.1");
    await margin.getByRole("button", { name: "Calculate margin" }).click();
    await expect(margin.getByTestId("calculator-result")).toContainText("$3,666.67");

    const pl = page.locator("#profit-loss");
    await pl.locator("label", { hasText: "Sell" }).click();
    await pl.getByRole("button", { name: "Calculate P/L" }).click();
    await expect(pl.getByTestId("calculator-result")).toContainText("-$250.00");
    await pl.getByLabel("Position size").fill("-1");
    await pl.getByRole("button", { name: "Calculate P/L" }).click();
    await expect(pl.getByText("Minimum is 0.01 lots")).toBeVisible();
  });
});

test.describe("open a demo account", () => {
  test("validates each step and never submits", async ({ page }) => {
    const requests: string[] = [];
    page.on("request", (r) => {
      if (r.method() !== "GET") requests.push(`${r.method()} ${r.url()}`);
    });
    await page.goto("/open-account");
    await page.getByRole("button", { name: "Continue" }).click();
    await expect(page.getByText("Enter your first name")).toBeVisible();
    await expect(page.getByText("Select a country")).toHaveCount(2); // option + error
    await page.getByLabel("First name").fill("Ada");
    await page.getByLabel("Last name").fill("Lovelace");
    await page.getByLabel("Email").fill("not-an-email");
    await page.getByLabel("Country of residence").selectOption("Ghana");
    await page.getByRole("button", { name: "Continue" }).click();
    await expect(page.getByText(/Enter a valid email address/)).toBeVisible();
    await page.getByLabel("Email").fill("ada@example.com");
    await expect(page.getByText(/Enter a valid email address/)).toHaveCount(0);
    await page.getByRole("button", { name: "Continue" }).click();

    await expect(page.getByRole("heading", { name: "Preferences" })).toBeFocused();
    await page.getByRole("button", { name: "Continue" }).click();
    await expect(page.getByText("Choose your experience level")).toBeVisible();
    await page.getByText("Some experience").click();
    await expect(page.getByText("Choose your experience level")).toHaveCount(0);
    await page.getByText("Pro", { exact: true }).click();
    await expect(page.getByText("Choose an account type")).toHaveCount(0);
    await page.getByRole("button", { name: "Continue" }).click();

    await expect(page.getByRole("heading", { name: "Review" })).toBeVisible();
    // Arriving on the review step must not trigger an early submit.
    await expect(page.getByText("Please confirm you understand this is a demo")).toHaveCount(0);
    await expect(page.locator("dl")).toContainText("Ada Lovelace");
    await expect(page.locator("dl")).toContainText("Pro");
    await page.getByRole("button", { name: "Finish demo sign-up" }).click();
    await expect(page.getByText("Please confirm you understand this is a demo")).toBeVisible();
    await page.getByLabel(/I understand this is a demo website/).check();
    await page.getByRole("button", { name: "Finish demo sign-up" }).click();

    await expect(
      page.getByRole("heading", { name: "This is a demo. Nothing was submitted or stored." }),
    ).toBeVisible();
    expect(requests).toEqual([]);
  });
});

test.describe("contact", () => {
  test("validates and shows a demo success message", async ({ page }) => {
    await page.goto("/contact");
    await page.getByRole("button", { name: "Send (demo)" }).click();
    await expect(page.getByText("Enter your name (at least 2 characters)")).toBeVisible();
    await expect(page.getByText("Write at least 20 characters")).toBeVisible();
    await page.getByLabel("Name").fill("Grace");
    await page.getByLabel("Email").fill("grace@example.com");
    await page.getByLabel("Topic").selectOption("tools");
    await page.getByLabel("Message").fill("Just testing the demo contact form validation.");
    await page.getByRole("button", { name: "Send (demo)" }).click();
    await expect(page.getByRole("status")).toContainText("nothing was sent or stored");
  });
});

test.describe("calendar", () => {
  test("filters by impact, currency and date", async ({ page }) => {
    await page.goto("/calendar");
    await expect(page.getByText("Sample data · fictional events")).toBeVisible();
    await page.getByLabel("High", { exact: true }).uncheck();
    await expect(page.locator("main tbody").filter({ hasText: "High" })).toHaveCount(0);
    await page.getByLabel("Currency").selectOption("USD");
    const currencies = await page.locator("main tbody tr td:nth-child(2)").allInnerTexts();
    expect(currencies.length).toBeGreaterThan(0);
    expect(new Set(currencies)).toEqual(new Set(["USD"]));
    await page.getByText("All dates").click();
    await page.getByLabel("Low", { exact: true }).uncheck();
    await page.getByLabel("Medium", { exact: true }).uncheck();
    await expect(page.getByText("No sample events match these filters.")).toBeVisible();
  });
});

test.describe("navigation and FAQ", () => {
  test("FAQ accordion works with the keyboard", async ({ page }) => {
    await page.goto("/");
    const trigger = page.getByRole("button", { name: "Is Valtrex Markets a real broker?" });
    await trigger.focus();
    await page.keyboard.press("Enter");
    await expect(trigger).toHaveAttribute("aria-expanded", "true");
    await expect(page.getByText(/Valtrex Markets is a fictional brand created/)).toBeVisible();
    await page.keyboard.press("Space");
    await expect(trigger).toHaveAttribute("aria-expanded", "false");
  });

  test("skip link moves focus to the main content", async ({ page }) => {
    await page.goto("/about");
    await page.keyboard.press("Tab");
    const skip = page.getByRole("link", { name: "Skip to content" });
    await expect(skip).toBeFocused();
    await page.keyboard.press("Enter");
    await expect(page.locator("main")).toBeFocused();
  });

  test("mobile menu opens in a sheet and navigates", async ({ page }, info) => {
    test.skip(!info.project.name.startsWith("mobile"), "mobile only");
    await page.goto("/");
    await page.getByRole("button", { name: "Open menu" }).click();
    const dialog = page.getByRole("dialog");
    await expect(dialog).toBeVisible();
    await dialog.getByRole("link", { name: "Calendar" }).click();
    await expect(page).toHaveURL(/\/calendar$/);
    await expect(dialog).toBeHidden();
  });
});

test.describe("theme", () => {
  test("toggle persists and applies before first paint", async ({ page }) => {
    await page.goto("/");
    const html = page.locator("html");
    await expect(html).not.toHaveClass(/\bdark\b/);
    await page.getByRole("button", { name: "Switch to dark theme" }).click();
    await expect(html).toHaveClass(/\bdark\b/);

    // Record the <html> class at the moment <body> is first parsed, before any paint.
    await page.addInitScript(() => {
      const observer = new MutationObserver(() => {
        if (document.body) {
          (window as unknown as { __themeAtBody: string }).__themeAtBody =
            document.documentElement.className;
          observer.disconnect();
        }
      });
      observer.observe(document, { childList: true, subtree: true });
    });
    await page.reload();
    const atBody = await page.evaluate(
      () => (window as unknown as { __themeAtBody: string }).__themeAtBody,
    );
    expect(atBody).toMatch(/\bdark\b/);
    await expect(page.getByRole("button", { name: "Switch to light theme" })).toBeVisible();
  });
});
