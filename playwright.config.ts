import { defineConfig, devices } from "@playwright/test";

const PORT = Number(process.env.PORT ?? 3100);
const executablePath = process.env.CHROMIUM_PATH || undefined;

const viewports = { mobile: 375, tablet: 768, desktop: 1280 } as const;
const themes = ["light", "dark"] as const;

/**
 * Runs against a production build (`npm run build` first). Each page is checked at 375, 768
 * and 1280px in light and dark themes. Set CHROMIUM_PATH to use a preinstalled Chromium.
 */
export default defineConfig({
  testDir: "./e2e",
  fullyParallel: true,
  retries: 0,
  reporter: [["list"]],
  use: {
    baseURL: `http://localhost:${PORT}`,
    launchOptions: { executablePath },
  },
  projects: Object.entries(viewports).flatMap(([name, width]) =>
    themes.map((theme) => ({
      name: `${name}-${theme}`,
      use: {
        ...devices["Desktop Chrome"],
        viewport: { width, height: 900 },
        colorScheme: theme,
        hasTouch: name === "mobile",
        isMobile: false,
      },
    })),
  ),
  webServer: {
    command: `npm run start -- -p ${PORT}`,
    url: `http://localhost:${PORT}`,
    reuseExistingServer: true,
    timeout: 60_000,
  },
});
