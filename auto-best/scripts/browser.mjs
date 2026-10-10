import { chromium } from 'playwright';

export function previewUrl() {
  if (!process.env.BASE_URL) throw new Error('Set BASE_URL to the confirmed template preview (for example http://127.0.0.1:6461).');
  return new URL(process.env.BASE_URL).origin;
}

export function launchBrowser() {
  return chromium.launch({ headless: true, ...(process.env.PLAYWRIGHT_EXECUTABLE_PATH
    ? { executablePath: process.env.PLAYWRIGHT_EXECUTABLE_PATH }
    : { channel: process.env.PLAYWRIGHT_CHANNEL || 'chrome' }) });
}
