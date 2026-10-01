import { defineConfig } from "@playwright/test";
import { modernMobileStatePath } from "./fixtures/modern-session.setup";

export default defineConfig({
  testDir: "./specs",
  testMatch: "modern-desktop.spec.ts",
  fullyParallel: false,
  workers: 1,
  retries: 0,
  timeout: 120_000,
  expect: { timeout: 15_000 },
  globalSetup: "./fixtures/modern-session.setup.ts",
  reporter: "list",
  outputDir: "test-results/modern-desktop",
  use: {
    baseURL: process.env.E2E_BASE_URL ?? "http://127.0.0.1:6462",
    browserName: "chromium",
    viewport: { width: 1440, height: 1000 },
    locale: "bg-BG",
    reducedMotion: "reduce",
    storageState: modernMobileStatePath,
    screenshot: "only-on-failure",
    trace: "retain-on-failure",
  },
});
