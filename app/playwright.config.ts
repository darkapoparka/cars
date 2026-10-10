import {defineConfig} from '@playwright/test';

const externalServer = process.env.QA_BASE_URL;
const baseURL = (externalServer ?? 'http://127.0.0.1:6511').replace(/\/?$/, '/');
const visual = process.env.QA_VISUAL === '1';
export default defineConfig({
  testDir: './tests/browser',
  testMatch: visual ? '**/visual.spec.ts' : '**/journeys.spec.ts',
  fullyParallel: false, workers: 1, forbidOnly: Boolean(process.env.CI), retries: 0,
  timeout: 45000,
  outputDir: 'runtime/browser-output/' + (process.env.QA_PHASE ?? 'current'),
  reporter: [['list'], ['json', {outputFile: process.env.QA_REPORT ?? 'runtime/browser-report.json'}]],
  snapshotPathTemplate: '{testDir}/../../runtime/visual-baselines/{projectName}/{arg}{ext}',
  // Keep Playwright's perceptual colour threshold; do not mask or update the reference to hide layout regressions.
  expect: {timeout: 10000, toHaveScreenshot: {animations: 'disabled', maxDiffPixels: 0, threshold: 0.2}},
  use: {
    baseURL, browserName: 'chromium', channel: process.env.QA_BROWSER_CHANNEL || undefined,
    locale: 'en-GB', timezoneId: 'Europe/Sofia', colorScheme: 'light', reducedMotion: 'reduce',
    deviceScaleFactor: 1, trace: 'retain-on-failure', screenshot: 'only-on-failure',
  },
  projects: [
    {name: 'mobile-320', use: {viewport: {width: 320, height: 844}, isMobile: true, hasTouch: true}},
    {name: 'mobile-390', use: {viewport: {width: 390, height: 844}, isMobile: true, hasTouch: true}},
    {name: 'desktop-1100', use: {viewport: {width: 1100, height: 1000}}},
    {name: 'desktop-1440', use: {viewport: {width: 1440, height: 1000}}},
  ],
  webServer: externalServer ? undefined : {
    command: '"' + process.execPath + '" node_modules/next/dist/bin/next start --hostname 127.0.0.1 --port 6511',
    url: baseURL, reuseExistingServer: false, timeout: 60000,
  },
});
