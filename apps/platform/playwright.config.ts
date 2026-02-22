import { defineConfig, devices } from "@playwright/test";

const baseURL = process.env.PLAYWRIGHT_BASE_URL ?? "http://localhost:3000";
const webServerURL =
  process.env.PLAYWRIGHT_WEB_SERVER_URL ?? `${baseURL}/sign-in`;

/**
 * Read environment variables from file.
 * https://github.com/motdotla/dotenv
 */
// import dotenv from 'dotenv';
// import path from 'path';
// dotenv.config({ path: path.resolve(__dirname, '.env') });

/**
 * See https://playwright.dev/docs/test-configuration.
 */
export default defineConfig({
  timeout: 20_000,
  expect: {
    timeout: 3_000,
  },
  // We keep Playwright state (storageState) under `playwright/.auth`,
  // but we want test discovery to include multiple test roots.
  // Playwright only supports a single `testDir`, so we set it to the repo
  // root and constrain discovery via `testMatch`.
  testDir: ".",
  testMatch: [
    // Existing suite
    "tests/**/*.e2e.ts",
    "tests/**/*.e2e.tsx",
    "tests/**/*.spec.ts",
    "tests/**/*.spec.tsx",

    // Additional suites (requested)
    "@playwright/**/*.e2e.ts",
    "@playwright/**/*.e2e.tsx",
    "@playwright/**/*.spec.ts",
    "@playwright/**/*.spec.tsx",
    "playwright/**/*.e2e.ts",
    "playwright/**/*.e2e.tsx",
    "playwright/**/*.spec.ts",
    "playwright/**/*.spec.tsx",
  ],
  /* Run tests in files in parallel */
  fullyParallel: true,
  /* Fail the build on CI if you accidentally left test.only in the source code. */
  forbidOnly: !!process.env.CI,
  /* Retry on CI only */
  retries: process.env.CI ? 2 : 0,
  /* Opt out of parallel tests on CI. */
  workers: process.env.CI ? 1 : 2,
  /* Reporter to use. See https://playwright.dev/docs/test-reporters */
  reporter: [["line"], ["html", { open: "never" }]],
  /* Shared settings for all the projects below. See https://playwright.dev/docs/api/class-testoptions. */
  use: {
    /* Base URL to use in actions like `await page.goto('')`. */
    baseURL,
    actionTimeout: 5_000,
    navigationTimeout: 10_000,

    /* Collect trace when retrying the failed test. See https://playwright.dev/docs/trace-viewer */
    trace: "on-first-retry",
  },

  /* Configure projects for major browsers */
  projects: [
    {
      name: "setup-admin",
      testMatch: /site-admin\.setup\.ts/,
    },
    {
      name: "setup-user",
      testMatch: /user\.setup\.ts/,
    },

    {
      name: "admin",
      dependencies: ["setup-admin"],
      testMatch: [
        /tests\/applications\/.*\.e2e\.ts$/,
        /tests\/workspaces\/.*\.e2e\.ts$/,
        /tests\/templates\/.*\.e2e\.ts$/,
      ],
      use: {
        storageState: "playwright/.auth/siteAdmin.json",
        ...devices["Desktop Chrome"],
      },
    },
    {
      name: "user",
      dependencies: ["setup-user"],
      testMatch: [/tests\/apply\/.*\.e2e\.ts$/, /tests\/apply-form\.e2e\.ts$/],
      use: {
        storageState: "playwright/.auth/user.json",
        ...devices["Desktop Chrome"],
      },
    },
  ],

  /* Run the local app server before starting tests */
  webServer: {
    command:
      process.env.PLAYWRIGHT_WEB_SERVER_COMMAND ??
      "pnpm with-env next dev -p 3000",
    url: webServerURL,
    reuseExistingServer: false,
    timeout: 90_000,
  },
});
