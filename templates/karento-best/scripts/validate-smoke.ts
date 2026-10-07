import assert from "node:assert/strict";
import fs from "node:fs";
import { launchBrowser } from "./browser.ts";
import { canonicalRoutes } from "../src/lib/routes.ts";
const browser = await launchBrowser();
const page = await browser.newPage({
  viewport: { width: 1440, height: 900 },
  reducedMotion: "reduce",
});
const errors: { route: string; message: string }[] = [];
let current = "";
page.on("pageerror", (error) =>
  errors.push({ route: current, message: error.message }),
);
await page.route("**/*", (request) =>
  new URL(request.request().url()).hostname === "127.0.0.1"
    ? request.continue()
    : request.abort(),
);
fs.mkdirSync(".runtime/evidence", { recursive: true });
const results: { route: string; widgetErrors: string[] }[] = [];
try {
  for (const route of Object.keys(canonicalRoutes)) {
    current = "/" + route;
    await page.goto(
      (process.env.KARENTO_NATIVE_URL || "http://127.0.0.1:6466") + current,
      {
        waitUntil: "networkidle",
      },
    );
    await page.waitForFunction(
      () => document.body.dataset.karentoReady === "true",
    );
    await page.waitForTimeout(250);
    const widgetErrors = await page
      .locator("[data-widget-error]")
      .evaluateAll((els) => els.map((el) => el.className || el.id));
    results.push({ route: current, widgetErrors });
    assert.deepEqual(widgetErrors, [], current);
    assert.equal(await page.locator("header.header").count(), 1, current);
    assert.equal(await page.locator("main").count(), 1, current);
  }
  assert.deepEqual(errors, []);
  fs.writeFileSync(
    ".runtime/evidence/browser-smoke.json",
    JSON.stringify({ results, errors }, null, 2),
  );
  console.log(
    `${results.length} canonical pages hydrated without page/widget errors.`,
  );
} finally {
  await browser.close();
}
