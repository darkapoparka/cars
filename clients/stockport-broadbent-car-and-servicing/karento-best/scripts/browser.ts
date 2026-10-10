import fs from "node:fs";
import path from "node:path";
import type { Browser } from "playwright";

/** Locale selection is retained on links without changing their destination. */
export function matchesDestination(actual: URL, destination: string): boolean {
  const current = new URL(actual);
  const expected = new URL(destination);
  current.searchParams.delete("lang");
  expected.searchParams.delete("lang");
  return current.href === expected.href;
}

/** Keep this test process's temporary browser profiles inside the checkout. */
export async function launchBrowser(): Promise<Browser> {
  const temporary = path.resolve(".runtime/browser-temp");
  fs.mkdirSync(temporary, { recursive: true });
  process.env.TEMP = temporary;
  process.env.TMP = temporary;
  process.env.TMPDIR = temporary;
  const { chromium } = await import("playwright");
  const channel = process.env.KARENTO_BROWSER_CHANNEL;
  return chromium.launch({
    headless: true,
    // Use the same software/font rasterizer on both sides of pixel comparisons.
    args: ["--disable-gpu", "--disable-lcd-text", "--font-render-hinting=none"],
    ...(channel ? { channel } : {}),
  });
}
