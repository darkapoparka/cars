import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { launchBrowser } from "./browser.ts";
import { canonicalRoutes, sourceKeys } from "../src/lib/routes.ts";

const phase = process.env.KARENTO_TYPOGRAPHY_PHASE ?? "after";
assert.ok(["before", "after"].includes(phase));
const base = process.env.KARENTO_NATIVE_URL ?? "http://127.0.0.1:6466";
const expectedFamily = process.env.KARENTO_TYPOGRAPHY_FONT ?? "Urbanist";
// Optionally apply the maintained typography layer to a comparison server.
const isolate = process.env.KARENTO_TYPOGRAPHY_ISOLATE === "1";
const directory = path.resolve(
  process.env.KARENTO_EVIDENCE_DIR ?? ".runtime/evidence/typography",
  phase,
);
fs.mkdirSync(directory, { recursive: true });
const widths = (process.env.KARENTO_WIDTHS ?? "320,390,1440")
  .split(",")
  .map(Number);
const keys = process.env.KARENTO_ROUTES
  ? process.env.KARENTO_ROUTES.split(",")
  : sourceKeys;
const screenshots = new Set([
  "/",
  "/vehicles",
  "/vehicle",
  "/services",
  "/shop",
  "/membership",
  "/contact",
  "/news/article",
  "/account",
  "/dashboard",
]);
const results: unknown[] = [];
const failures: string[] = [];
const browser = await launchBrowser();

try {
  for (const width of widths) {
    const page = await browser.newPage({
      viewport: { width, height: 900 },
      reducedMotion: "reduce",
    });
    await page.clock.setFixedTime(new Date("2026-10-08T08:00:00Z"));
    await page.route("**/*", (request) =>
      new URL(request.request().url()).hostname === "127.0.0.1"
        ? request.continue()
        : request.abort(),
    );
    const errors: string[] = [];
    page.on("pageerror", (error) => errors.push(error.message));
    for (const key of keys) {
      const route = key.startsWith("/")
        ? key
        : "/" +
          (Object.entries(canonicalRoutes).find(
            ([, value]) => value === key,
          )?.[0] ?? key);
      errors.length = 0;
      try {
        const response = await page.goto(base + route, {
          waitUntil: "networkidle",
        });
        assert.equal(response?.status(), 200, "HTTP response");
        await page.waitForFunction(
          () => document.body.dataset.karentoReady === "true",
        );
        if (isolate) await page.addStyleTag({ path: "static/typography.css" });
        await page.evaluate(() => document.fonts.ready);
        // Scroll every section into view so lazy images and widgets are exercised.
        await page.evaluate(async () => {
          for (const section of document.querySelectorAll("main section")) {
            section.scrollIntoView({ behavior: "instant" });
            await new Promise<void>((resolve) =>
              requestAnimationFrame(() => resolve()),
            );
          }
          scrollTo({ top: 0, behavior: "instant" });
        });
        await page.waitForTimeout(150);
        const metrics = await page.evaluate(() => {
          const sizes: Record<string, number> = {};
          const families: Record<string, number> = {};
          const small: { text: string; size: string; className: string }[] = [];
          const clipped: { text: string; className: string }[] = [];
          const elements = [
            ...document.querySelectorAll<HTMLElement>("body *"),
          ];
          for (const element of elements) {
            if (
              ![...element.childNodes].some(
                (node) =>
                  node.nodeType === Node.TEXT_NODE && node.textContent?.trim(),
              )
            )
              continue;
            const rect = element.getBoundingClientRect();
            const style = getComputedStyle(element);
            if (
              !rect.width ||
              !rect.height ||
              style.visibility === "hidden" ||
              style.display === "none"
            )
              continue;
            if (element.closest("svg, .apexcharts-canvas")) continue;
            sizes[style.fontSize] = (sizes[style.fontSize] ?? 0) + 1;
            families[style.fontFamily] = (families[style.fontFamily] ?? 0) + 1;
            if (
              parseFloat(style.fontSize) > 0 &&
              parseFloat(style.fontSize) < 14
            )
              small.push({
                text: element.textContent?.trim().slice(0, 80) ?? "",
                size: style.fontSize,
                className: element.className,
              });
            if (
              element.scrollWidth > element.clientWidth + 2 &&
              ["hidden", "clip"].includes(style.overflowX) &&
              style.textOverflow !== "ellipsis"
            )
              clipped.push({
                text: element.textContent?.trim().slice(0, 80) ?? "",
                className: element.className,
              });
          }
          return {
            width: innerWidth,
            scrollWidth: document.documentElement.scrollWidth,
            height: document.documentElement.scrollHeight,
            lang: document.documentElement.lang,
            sizes,
            families,
            small,
            clipped,
            headings: [
              ...document.querySelectorAll("main h1, main h2, main h3"),
            ].map((element) => ({
              text: element.textContent?.trim(),
              font: getComputedStyle(element).font,
              rect: element.getBoundingClientRect().toJSON(),
            })),
            sections: [...document.querySelectorAll("main > section")].map(
              (element) => ({
                className: element.className,
                rect: element.getBoundingClientRect().toJSON(),
              }),
            ),
            broken: [...document.images]
              .filter(
                (image) =>
                  image.complete &&
                  image.naturalWidth === 0 &&
                  image.getBoundingClientRect().width > 0,
              )
              .map((image) => image.src),
            widgets: [...document.querySelectorAll("[data-widget-error]")].map(
              (element) => element.getAttribute("data-widget-error"),
            ),
          };
        });
        if (phase === "after") {
          assert.ok(
            metrics.scrollWidth <= width + 1,
            `Overflow ${metrics.scrollWidth}px at ${width}px`,
          );
          assert.ok(
            Object.keys(metrics.families).every((family) =>
              family.includes(expectedFamily),
            ),
            `Unexpected font: ${JSON.stringify(metrics.families)}`,
          );
          assert.deepEqual(metrics.broken, [], "Broken images");
          assert.deepEqual(metrics.widgets, [], "Widget failures");
          assert.deepEqual(errors, [], "Browser errors");
        }
        results.push({ route, ...metrics, errors: [...errors] });
        if (screenshots.has(route)) {
          const name = route.slice(1).replaceAll("/", "-") || "home";
          await page.screenshot({
            path: `${directory}/${name}-${width}.png`,
            animations: "disabled",
          });
          if (route === "/vehicles" || route === "/contact") {
            const selector =
              route === "/vehicles"
                ? ".card-journey-small"
                : "#contact-enquiry";
            const detail = page.locator(selector).first();
            if (await detail.count()) {
              await detail.scrollIntoViewIfNeeded();
              await page.screenshot({
                path: `${directory}/${name}-detail-${width}.png`,
                animations: "disabled",
              });
            }
          }
        }
      } catch (error) {
        failures.push(`${route} at ${width}: ${String(error)}`);
        results.push({ route, width, error: String(error) });
      }
      fs.writeFileSync(
        `${directory}/audit.json`,
        JSON.stringify({ phase, results, failures }, null, 2),
      );
    }
    await page.goto(base, { waitUntil: "networkidle" });
    if (isolate) await page.addStyleTag({ path: "static/typography.css" });
    await page.locator(".karento-menu-toggle").click();
    await page.evaluate(() => document.fonts.ready);
    await page.screenshot({
      path: `${directory}/drawer-${width}.png`,
      animations: "disabled",
    });
    await page.close();
    console.log(
      `${phase}: ${keys.length} variants at ${width}px; ${failures.length} failures`,
    );
  }
  assert.deepEqual(failures, [], `See ${directory}/audit.json`);
} finally {
  await browser.close();
}
