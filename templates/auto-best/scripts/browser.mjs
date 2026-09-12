import { chromium, webkit, firefox } from 'playwright';

export function previewUrl() {
  if (!process.env.BASE_URL) throw new Error('Set BASE_URL to the confirmed template preview (for example http://127.0.0.1:6461).');
  return new URL(process.env.BASE_URL).origin;
}

export function launchBrowser() {
  const engine = process.env.PLAYWRIGHT_ENGINE || 'chromium';
  if (engine === 'webkit') return webkit.launch({ headless: true });
  if (engine === 'firefox') return firefox.launch({ headless: true });
  if (engine !== 'chromium') throw new Error(`Unsupported browser engine: ${engine}`);
  return chromium.launch({ headless: true, ...(process.env.PLAYWRIGHT_EXECUTABLE_PATH
    ? { executablePath: process.env.PLAYWRIGHT_EXECUTABLE_PATH }
    : { channel: process.env.PLAYWRIGHT_CHANNEL || 'chrome' }) });
}

// App-state suites must not depend on Google's continuing RPCs or cross-origin frame scripts.
// A fixture is not evidence of a live provider; inspect that separately before publication.
export async function isolateMapProvider(page) {
  await page.route('https://maps.google.com/**', route => route.fulfill({
    status: 200, contentType: 'text/html',
    body: '<!doctype html><html lang="en"><title>Map test fixture</title><body>Map provider isolated by test harness. This test does not verify the live provider.</body></html>'
  }));
}
