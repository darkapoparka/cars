import assert from "node:assert/strict";
import fs from "node:fs";
import { launchBrowser } from "./browser.ts";
import sharp, { type Metadata } from "sharp";
import pixelmatch from "pixelmatch";
import { sourceKeys } from "../src/lib/routes.ts";
import adjustments from "../provenance/reviewed-reference-adjustments.json" with { type: "json" };
const baselineUrl =
  process.env.KARENTO_BASELINE_URL || "http://127.0.0.1:19478";
const referenceKind = process.env.KARENTO_REFERENCE_KIND || "preserved";
assert.ok(
  ["preserved", "native"].includes(referenceKind),
  "Unknown reference kind",
);
const nativeUrl = process.env.KARENTO_NATIVE_URL || "http://127.0.0.1:6466";
const widths = (process.env.KARENTO_WIDTHS || "320,390,1440")
  .split(",")
  .map(Number);
assert.ok(
  widths.length > 0 &&
    new Set(widths).size === widths.length &&
    widths.every((width) => [320, 390, 768, 1024, 1440].includes(width)),
  "KARENTO_WIDTHS must be a unique subset of 320,390,768,1024,1440",
);
const failures: string[] = [];
const directory = process.env.KARENTO_EVIDENCE_DIR || ".runtime/evidence";
fs.mkdirSync(directory, { recursive: true });
const routes = (
  process.env.KARENTO_ROUTES || sourceKeys.map((key) => "/" + key).join(",")
).split(",");
const browser = await launchBrowser();
const results: unknown[] = [];
const captureBaseline = process.env.KARENTO_CAPTURE_BASELINE === "1";
interface SavedCapture {
  route: string;
  width: number;
  drawer: boolean;
  capture: Awaited<ReturnType<typeof capture>>;
}
const captures: SavedCapture[] = [];
const savedCaptures: SavedCapture[] = process.env.KARENTO_SAVED_BASELINE
  ? JSON.parse(fs.readFileSync(process.env.KARENTO_SAVED_BASELINE, "utf8"))
  : [];
function retainedBaseline(route: string, width: number, drawer = false) {
  const saved = savedCaptures.find(
    (entry) =>
      entry.route === route && entry.width === width && entry.drawer === drawer,
  );
  assert.ok(saved, `Missing saved baseline for ${route} at ${width}px`);
  assert.ok(
    fs.existsSync(saved.capture.file),
    "Saved baseline pixels must exist",
  );
  return saved.capture;
}
async function capture(
  base: string,
  route: string,
  width: number,
  drawer = false,
  side = "",
) {
  const page = await browser.newPage({
    viewport: { width, height: 900 },
    reducedMotion: "reduce",
  });
  const errors: string[] = [];
  page.on("pageerror", (error) => errors.push(error.message));
  page.on("console", (message) => {
    if (
      message.type() === "error" &&
      !/^Failed to load resource:/.test(message.text())
    )
      errors.push(message.text());
  });
  await page.route("**/*", (request) =>
    new URL(request.request().url()).hostname === "127.0.0.1"
      ? request.continue()
      : request.abort(),
  );
  await page.clock.setFixedTime(new Date("2026-10-07T10:00:00Z"));
  const response = await page.goto(`${base}${route}`, {
    waitUntil: "networkidle",
  });
  assert.equal(response?.status(), 200, `${route}: HTTP status`);
  try {
    await page.waitForFunction(
      () => document.body.dataset.karentoReady === "true",
    );
  } catch (cause) {
    const state = await page.evaluate(() => ({
      title: document.title,
      ready: document.body.dataset.karentoReady,
      documentState: document.readyState,
      widgets: [
        ...document.querySelectorAll<HTMLElement>("[data-widget-error]"),
      ].map((node) => node.dataset.widgetError),
    }));
    throw new Error(
      `Readiness failed at ${base}${route}: ${JSON.stringify({ ...state, errors })}`,
      { cause },
    );
  }
  await page.evaluate(() => document.fonts.ready);
  // Compare the range labels in the same stable 2D layer used by the native
  // fix. This changes neither their font nor geometry and masks no pixels.
  if (base === baselineUrl && referenceKind === "preserved") {
    await page.evaluate((styles) => {
      if (!document.querySelector("#slider-range")) return;
      const style = document.createElement("style");
      style.textContent = styles;
      document.head.append(style);
    }, adjustments.ranges.styles);
  }
  // The owner changed Contact after the preserved captured-renderer checkpoint.
  // Apply that declared composition to the reference only; never mask pixels or
  // mutate the hash-locked source. Every native page is captured as delivered.
  if (
    base === baselineUrl &&
    referenceKind === "preserved" &&
    route === "/contact"
  ) {
    await page.evaluate((styles) => {
      const row = document.querySelector("main .karento-contact-layout");
      if (
        !row ||
        row.parentElement?.classList.contains("karento-enquiry-shell")
      )
        return;
      const shell = document.createElement("div");
      shell.className = "karento-enquiry-shell";
      row.replaceWith(shell);
      shell.append(row);
      const style = document.createElement("style");
      style.textContent = styles;
      document.head.append(style);
    }, adjustments.contact.styles);
  }
  // The preserved wallet chart redraws when its own parent height changes,
  // producing a resize feedback loop. Set the same chart option used by the
  // native fix; its data, dimensions, artwork and screenshot pixels stay visible.
  if (
    base === baselineUrl &&
    referenceKind === "preserved" &&
    route === "/user-dashboard-wallet"
  ) {
    await page.evaluate(async (chartOptions) => {
      const reference = window as typeof window & {
        chart?: {
          el: HTMLElement;
          updateOptions: (
            options: unknown,
            redraw: boolean,
            animate: boolean,
          ) => Promise<void>;
        };
      };
      if (reference.chart?.el.id !== "chart-2")
        throw new Error("Preserved wallet chart instance was not found");
      await reference.chart.updateOptions(
        { chart: chartOptions },
        false,
        false,
      );
    }, adjustments.wallet.chartOptions);
  }
  await page.evaluate(async () => {
    await Promise.all(
      Array.from(document.images).map(async (image) => {
        image.loading = "eager";
        try {
          await image.decode();
        } catch {
          /* Recorded with geometry below. */
        }
      }),
    );
  });
  // The reference plugins can measure before their asynchronously loaded CSS.
  // Exercise an actual resize, then compare both pages at the requested width.
  await page.setViewportSize({ width: width - 1, height: 900 });
  await page.waitForTimeout(100);
  await page.setViewportSize({ width, height: 900 });
  await page.waitForTimeout(700);
  await page.evaluate(async () => {
    for (let y = 0; y < document.documentElement.scrollHeight; y += 750) {
      window.scrollTo({ top: y, left: 0, behavior: "instant" });
      await new Promise<void>((resolve) =>
        requestAnimationFrame(() => requestAnimationFrame(() => resolve())),
      );
    }
    await Promise.all(
      [...document.images]
        .filter((image) => image.naturalWidth > 0)
        .map((image) => image.decode().catch(() => {})),
    );
    window.scrollTo({ top: 0, left: 0, behavior: "instant" });
  });
  await page.waitForTimeout(250);
  if (drawer) {
    await page.locator(".karento-menu-toggle").click();
    await page.waitForTimeout(350);
  }
  const name =
    (route === "/" ? "home" : route.slice(1).replaceAll("/", "-")) +
    (drawer ? "-drawer" : "") +
    "-" +
    width;
  const file = `${directory}/${name}-${new URL(base).port}${side ? "-" + side : ""}.png`;
  const pageWidth = await page.evaluate(
    () => document.documentElement.scrollWidth,
  );
  const pageHeight = await page.evaluate(
    () => document.documentElement.scrollHeight,
  );
  const typography = await page.evaluate(() =>
    [
      ...document.querySelectorAll<HTMLElement>(
        ".card-testimonial .card-author .card-info p",
      ),
    ]
      .filter((el) => {
        const rect = el.getBoundingClientRect();
        return rect.x >= 0 && rect.x < window.innerWidth;
      })
      .map((el) => ({
        text: el.textContent,
        rect: el.getBoundingClientRect().toJSON(),
        font: getComputedStyle(el).font,
        color: getComputedStyle(el).color,
        textRect: (() => {
          const range = document.createRange();
          range.selectNodeContents(el);
          return range.getBoundingClientRect().toJSON();
        })(),
        transforms: (() => {
          const list = [];
          let parent: HTMLElement | null = el;
          while (parent && parent.tagName !== "SECTION") {
            const style = getComputedStyle(parent);
            list.push({
              class: parent.className,
              transform: style.transform,
              opacity: style.opacity,
            });
            parent = parent.parentElement;
          }
          return list;
        })(),
      })),
  );
  if (drawer) {
    await page.screenshot({ path: file, animations: "disabled" });
  } else {
    // Compare actual 900px-high browser views throughout the entire document.
    // Overlap keeps content beneath the fixed header covered. Stitch only new
    // rows, avoiding an oversized off-screen screenshot surface.
    const tiles: { input: Buffer; top: number; left: number }[] = [];
    const scrollEvidence: unknown[] = [];
    let written = 0;
    while (written < pageHeight) {
      await page.evaluate(
        (y) => window.scrollTo({ top: y, left: 0, behavior: "instant" }),
        Math.max(0, written - 250),
      );
      await page.evaluate(
        () =>
          new Promise<void>((resolve) =>
            requestAnimationFrame(() => requestAnimationFrame(() => resolve())),
          ),
      );
      await page.waitForTimeout(50);
      // A newly fixed header can trigger one browser scroll-anchoring update.
      // Reapply the requested position after layout has completed.
      await page.evaluate(
        (y) => window.scrollTo({ top: y, left: 0, behavior: "instant" }),
        Math.max(0, written - 250),
      );
      await page.evaluate(
        () =>
          new Promise<void>((resolve) =>
            requestAnimationFrame(() => requestAnimationFrame(() => resolve())),
          ),
      );
      const y = await page.evaluate(() => window.scrollY);
      const scroll = await page.evaluate(() => ({
        y: scrollY,
        height: document.documentElement.scrollHeight,
        header: document.querySelector("header")?.getBoundingClientRect()
          .height,
        chart: document.querySelector("#chart-2")?.getBoundingClientRect()
          .height,
      }));
      scrollEvidence.push(scroll);
      fs.writeFileSync(
        `${directory}/${name}-${new URL(base).port}-scroll.json`,
        JSON.stringify(scrollEvidence, null, 2),
      );
      assert.equal(
        scroll.height,
        pageHeight,
        "Document height must stay stable while scrolling",
      );
      assert.equal(
        y,
        Math.min(Math.max(0, written - 250), Math.max(0, pageHeight - 900)),
        "Capture scroll position must be settled",
      );
      const top = written - y;
      const height = Math.min(900 - top, pageHeight - written);
      assert.ok(
        top >= 0 && height > 0,
        "Viewport capture must cover every document row",
      );
      const screenshot = await page.screenshot({ animations: "disabled" });
      const input = await sharp(screenshot)
        .extract({ left: 0, top, width, height })
        .png()
        .toBuffer();
      tiles.push({ input, top: written, left: 0 });
      written += height;
    }
    await sharp({
      create: { width, height: pageHeight, channels: 4, background: "white" },
    })
      .composite(tiles)
      .png()
      .toFile(file);
    await page.evaluate(() =>
      window.scrollTo({ top: 0, left: 0, behavior: "instant" }),
    );
    await page.waitForTimeout(100);
  }
  const geometry = await page.evaluate(() => ({
    height: document.documentElement.scrollHeight,
    rangeCount: document.querySelectorAll(".noUi-target").length,
    sections: [...document.querySelectorAll<HTMLElement>("main > *")].map(
      (el) => ({
        tag: el.tagName,
        class: el.className,
        rect: el.getBoundingClientRect().toJSON(),
      }),
    ),
    broken: [...document.images]
      .filter(
        (img) =>
          img.complete &&
          img.naturalWidth === 0 &&
          getComputedStyle(img).display !== "none",
      )
      .map((img) => img.getAttribute("src")),
    widgets: [
      ...document.querySelectorAll<HTMLElement>("[data-widget-error]"),
    ].map((el) => el.className),
  }));
  await page.close();
  return { file, name, errors, pageWidth, typography, ...geometry };
}
try {
  for (const width of widths)
    for (const route of routes) {
      if (captureBaseline) {
        captures.push({
          route,
          width,
          drawer: false,
          capture: await capture(nativeUrl, route, width, false, "baseline"),
        });
        fs.writeFileSync(
          directory + "/captures.json",
          JSON.stringify(captures, null, 2),
        );
        console.log("CAPTURE", route, width);
        continue;
      }
      const [baseline, native] = await Promise.all([
        savedCaptures.length
          ? Promise.resolve(retainedBaseline(route, width))
          : capture(
              baselineUrl,
              route,
              width,
              false,
              baselineUrl === nativeUrl ? "baseline" : "",
            ),
        capture(
          nativeUrl,
          route,
          width,
          false,
          baselineUrl === nativeUrl ? "native" : "",
        ),
      ]);
      const metaA = await sharp(baseline.file).metadata(),
        metaB = await sharp(native.file).metadata();
      const height = Math.max(metaA.height!, metaB.height!);
      const rgba = async (file: string, meta: Metadata) =>
        sharp(file)
          .ensureAlpha()
          .extend({
            top: 0,
            left: 0,
            right: 0,
            bottom: height - meta.height!,
            background: "#fff",
          })
          .raw()
          .toBuffer();
      const [a, b] = await Promise.all([
        rgba(baseline.file, metaA),
        rgba(native.file, metaB),
      ]);
      const different = pixelmatch(a, b, undefined, width, height, {
        threshold: 0.1,
      });
      const sectionDeltas = baseline.sections.map((section, index) => {
        const other = native.sections[index];
        return other
          ? {
              class: section.class,
              y: other.rect.y - section.rect.y,
              height: other.rect.height - section.rect.height,
            }
          : null;
      });
      const result = {
        route,
        width,
        heightBaseline: metaA.height!,
        heightNative: metaB.height!,
        horizontalOverflowBaseline: baseline.pageWidth - width,
        horizontalOverflowNative: native.pageWidth - width,
        exactRawMatch: a.equals(b),
        differentPixels: different,
        rangeLayerNormalization:
          referenceKind === "preserved" && baseline.rangeCount
            ? adjustments.ranges.reason
            : undefined,
        reviewedReferenceAdjustment:
          referenceKind === "preserved" && route === "/contact"
            ? adjustments.contact.reason
            : referenceKind === "preserved" &&
                route === "/user-dashboard-wallet"
              ? adjustments.wallet.reason
              : undefined,
        typography: different
          ? { baseline: baseline.typography, native: native.typography }
          : undefined,
        differencePercent: (100 * different) / (width * height),
        sectionDeltas,
        nativeErrors: native.errors,
        baselineErrors: baseline.errors,
        brokenNative: native.broken,
        brokenBaseline: baseline.broken,
        widgetErrors: native.widgets,
      };
      if (
        different > 0 ||
        metaA.height !== metaB.height ||
        native.errors.length ||
        native.broken.length ||
        native.widgets.length ||
        native.pageWidth > width ||
        sectionDeltas.some(
          (delta) => !delta || delta.y !== 0 || delta.height !== 0,
        )
      )
        failures.push(`${route} at ${width}px`);
      results.push(result);
      console.log(
        JSON.stringify({
          route,
          width,
          heights: [metaA.height!, metaB.height!],
          diff: result.differencePercent.toFixed(4),
          errors: native.errors,
        }),
      );
      fs.writeFileSync(
        directory + "/visual.json",
        JSON.stringify(results, null, 2),
      );
    }
  for (const width of widths) {
    if (captureBaseline) {
      captures.push({
        route: "/",
        width,
        drawer: true,
        capture: await capture(nativeUrl, "/", width, true, "baseline"),
      });
      fs.writeFileSync(
        directory + "/captures.json",
        JSON.stringify(captures, null, 2),
      );
      continue;
    }
    const a = savedCaptures.length
        ? retainedBaseline("/", width, true)
        : await capture(
            baselineUrl,
            "/",
            width,
            true,
            baselineUrl === nativeUrl ? "baseline" : "",
          ),
      b = await capture(
        nativeUrl,
        "/",
        width,
        true,
        baselineUrl === nativeUrl ? "native" : "",
      );
    const [pixelsA, pixelsB] = await Promise.all([
      sharp(a.file).ensureAlpha().raw().toBuffer(),
      sharp(b.file).ensureAlpha().raw().toBuffer(),
    ]);
    const differentPixels = pixelmatch(
      pixelsA,
      pixelsB,
      undefined,
      width,
      900,
      {
        threshold: 0.1,
      },
    );
    if (differentPixels > 0 || b.errors.length || b.widgets.length)
      failures.push(`drawer at ${width}px`);
    results.push({
      route: "/#drawer",
      width,
      differentPixels,
      differencePercent: (100 * differentPixels) / (width * 900),
      baseline: a,
      native: b,
    });
  }
  fs.writeFileSync(
    directory + "/visual.json",
    JSON.stringify(results, null, 2),
  );
  assert.deepEqual(
    failures,
    [],
    `Visual differences require review; see ${directory}/visual.json`,
  );
} finally {
  await browser.close();
}
