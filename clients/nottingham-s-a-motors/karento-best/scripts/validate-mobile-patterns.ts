import assert from "node:assert/strict";
import fs from "node:fs";
import sharp from "sharp";
import pixelmatch from "pixelmatch";
import type { Page } from "playwright";
import { launchBrowser, matchesDestination } from "./browser.ts";

const base = process.env.KARENTO_NATIVE_URL || "http://127.0.0.1:6466";
const directory =
  process.env.KARENTO_EVIDENCE_DIR || ".runtime/evidence/mobile-patterns";
const phase = process.env.KARENTO_PATTERN_PHASE || "after";
const baselineDirectory = process.env.KARENTO_PATTERN_BASELINE_DIR || directory;
const desktopEnabled = process.env.KARENTO_PATTERN_DESKTOP !== "0";
const mobileEnabled = process.env.KARENTO_PATTERN_MOBILE !== "0";
assert.ok(["before", "after"].includes(phase));
fs.mkdirSync(directory, { recursive: true });
const browser = await launchBrowser();
console.log("Browser", browser.version());
const results: object[] = [];
const desktopRoutes = [
  "/",
  "/vehicles",
  "/vehicle",
  "/services",
  "/shop",
  "/contact",
  "/index",
  "/index-2",
];

async function prepare(page: Page) {
  await page.route("**/*", (request) =>
    new URL(request.request().url()).hostname === "127.0.0.1"
      ? request.continue()
      : request.abort(),
  );
  await page.clock.setFixedTime(new Date("2026-10-08T12:00:00Z"));
}

async function visit(page: Page, route: string) {
  const response = await page.goto(base + route, { waitUntil: "networkidle" });
  assert.equal(response?.status(), 200);
  await page.waitForFunction(
    () => document.body.dataset.karentoReady === "true",
  );
  await page.evaluate(() => document.fonts.ready);
}

async function assertCompactBrowseActions(page: Page, route: string) {
  const actions = page.locator(".mobile-pill-secondary");
  const measurements = await actions.evaluateAll((nodes) =>
    nodes.map((node) => {
      const bounds = node.getBoundingClientRect();
      const label = node.querySelector(".mobile-pill-label");
      const range = document.createRange();
      if (label) range.selectNodeContents(label);
      return {
        label: label?.textContent?.trim(),
        width: bounds.width,
        height: bounds.height,
        textWidth: range.getBoundingClientRect().width,
        clipped: !!label && label.scrollWidth > label.clientWidth + 1,
        outsideViewport: bounds.left < 0 || bounds.right > innerWidth + 1,
      };
    }),
  );
  assert.ok(measurements.length > 0, `${route}: missing browse CTAs`);
  assert.ok(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= innerWidth + 1,
    ),
    `${route}: the page must not overflow`,
  );
  for (const [index, action] of measurements.entries()) {
    assert.ok(action.height <= 32, `${route}: oversized ${action.label}`);
    assert.ok(
      action.width - action.textWidth <= 16,
      `${route}: ${action.label} must fit its text with a small inset`,
    );
    assert.equal(action.clipped, false, `${route}: clipped ${action.label}`);
    if (action.outsideViewport) {
      // Owned horizontal collections keep all of their actions reachable.
      await actions.nth(index).scrollIntoViewIfNeeded();
      const bounds = await actions.nth(index).boundingBox();
      const width = page.viewportSize()!.width;
      assert.ok(
        bounds && bounds.x >= -1 && bounds.x + bounds.width <= width + 1,
        `${route}: ${action.label} cannot be revealed inside its rail`,
      );
    }
  }

  const first = actions.first();
  await first.focus();
  assert.equal(
    await first.evaluate((node) => node === document.activeElement),
    true,
  );
  const bounds = await first.boundingBox();
  assert.ok(bounds && bounds.y > 5);
  // The transparent touch area extends above the compact painted surface.
  await page.touchscreen.tap(bounds.x + bounds.width / 2, bounds.y - 5);
  await page.waitForURL((url) => matchesDestination(url, `${base}/vehicles`));
  await visit(page, route);
  await actions.first().press("Enter");
  await page.waitForURL((url) => matchesDestination(url, `${base}/vehicles`));
  return measurements;
}

async function assertSheet(page: Page, name: string, height: number) {
  const sheet = page.getByRole("dialog", { name, exact: true });
  await sheet.waitFor({ state: "visible" });
  const geometry = await sheet.evaluate((node) => {
    const bounds = node.getBoundingClientRect();
    const footer = node.querySelector("footer")?.getBoundingClientRect();
    const close = node.querySelector("header button")?.getBoundingClientRect();
    return {
      bounds: bounds.toJSON(),
      footer: footer?.toJSON(),
      close: close?.toJSON(),
      width: innerWidth,
      inlineStyle: node.getAttribute("style"),
      className: node.className,
      computed: {
        bottom: getComputedStyle(node).bottom,
        maxHeight: getComputedStyle(node).maxHeight,
        transition: getComputedStyle(node).transition,
        heightVariable: getComputedStyle(node).getPropertyValue(
          "--mobile-sheet-height",
        ),
        bottomVariable: getComputedStyle(node).getPropertyValue(
          "--mobile-sheet-bottom",
        ),
      },
      viewport: window.visualViewport
        ? {
            height: window.visualViewport.height,
            scale: window.visualViewport.scale,
          }
        : null,
    };
  });
  assert.ok(
    geometry.bounds.left >= 0 && geometry.bounds.right <= geometry.width,
  );
  assert.ok(
    geometry.bounds.top >= -1 && geometry.bounds.bottom <= height + 1,
    `${name}: sheet exceeds ${height}px viewport: ${JSON.stringify(geometry)}`,
  );
  assert.ok(
    geometry.close && geometry.close.width >= 44 && geometry.close.height >= 44,
  );
  if (geometry.footer) {
    assert.ok(geometry.footer.top >= geometry.bounds.top);
    assert.ok(geometry.footer.bottom <= height + 1);
  }
  return sheet;
}

async function swipePhoto(page: Page, direction: "left" | "right") {
  const bounds = await page
    .getByRole("img", { name: /^Photo \d+ of/ })
    .boundingBox();
  assert.ok(bounds);
  await swipeAcross(page, bounds, direction);
}

async function swipeAcross(
  page: Page,
  bounds: { x: number; y: number; width: number; height: number },
  direction: "left" | "right",
) {
  const client = await page.context().newCDPSession(page);
  const y = bounds.y + bounds.height / 2;
  const from = bounds.x + bounds.width * (direction === "left" ? 0.75 : 0.25);
  const to = bounds.x + bounds.width * (direction === "left" ? 0.25 : 0.75);
  try {
    await client.send("Input.dispatchTouchEvent", {
      type: "touchStart",
      touchPoints: [{ x: from, y }],
    });
    for (let step = 1; step <= 6; step++)
      await client.send("Input.dispatchTouchEvent", {
        type: "touchMove",
        touchPoints: [{ x: from + ((to - from) * step) / 6, y }],
      });
    await client.send("Input.dispatchTouchEvent", {
      type: "touchEnd",
      touchPoints: [],
    });
  } finally {
    await client.detach();
  }
}

try {
  const desktop = await browser.newPage({
    viewport: { width: 1440, height: 900 },
    reducedMotion: "reduce",
  });
  await prepare(desktop);
  for (const route of desktopEnabled ? desktopRoutes : []) {
    await visit(desktop, route);
    if (route === "/" || route === "/index-2")
      await desktop
        .getByRole("heading", { name: "Featured Listings", exact: true })
        .scrollIntoViewIfNeeded();
    if (route === "/index")
      await desktop
        .getByRole("heading", { name: "Car Review", exact: true })
        .scrollIntoViewIfNeeded();
    if (route === "/contact")
      await desktop.locator("#contact-enquiry").scrollIntoViewIfNeeded();
    if (route === "/vehicle")
      await desktop.getByRole("link", { name: "See All Photos" }).click();
    const name = route.slice(1) || "home";
    const file = `${phase === "before" ? baselineDirectory : directory}/${phase}-${name}-1440.png`;
    if (phase === "before")
      fs.mkdirSync(baselineDirectory, { recursive: true });
    await desktop.screenshot({
      path: file,
      // Full-page capture resizes the layout viewport and can remeasure carousels.
      // Compare the actual viewport, including the affected desktop surfaces.
      fullPage: false,
      animations: "disabled",
    });
    if (phase === "after") {
      const beforeFile = `${baselineDirectory}/before-${name}-1440.png`;
      assert.ok(
        fs.existsSync(beforeFile),
        `Missing desktop baseline: ${beforeFile}`,
      );
      const before = await sharp(beforeFile)
        .ensureAlpha()
        .raw()
        .toBuffer({ resolveWithObject: true });
      const after = await sharp(file)
        .ensureAlpha()
        .raw()
        .toBuffer({ resolveWithObject: true });
      assert.equal(
        after.info.width,
        before.info.width,
        `${route}: desktop width changed`,
      );
      assert.equal(
        after.info.height,
        before.info.height,
        `${route}: desktop height changed`,
      );
      const pixels = pixelmatch(
        before.data,
        after.data,
        undefined,
        after.info.width,
        after.info.height,
        { threshold: 0.1 },
      );
      results.push({ route, desktopPixelsChanged: pixels });
      assert.equal(pixels, 0, `${route}: desktop pixels changed`);
    }
    console.log("PASS", phase, "desktop", route);
  }
  await desktop.close();

  if (phase === "after" && mobileEnabled) {
    for (const width of [320, 390]) {
      const page = await browser.newPage({
        viewport: { width, height: 844 },
        reducedMotion: "reduce",
        isMobile: true,
        hasTouch: true,
      });
      const errors: string[] = [];
      page.on("pageerror", (error) => errors.push(error.message));
      await prepare(page);
      for (const route of ["/", "/index-2", "/index"]) {
        await visit(page, route);
        const browseActions = await assertCompactBrowseActions(page, route);
        results.push({
          route,
          width,
          browseActions,
          touch: true,
          keyboard: true,
        });
        console.log("PASS", "compact browse CTAs", route, width);
      }
      await visit(page, "/");
      const popular = page.getByRole("region", {
        name: "Popular vehicles",
        exact: true,
      });
      assert.equal(
        await popular.evaluate((node) => node.scrollWidth),
        await popular.evaluate((node) => node.clientWidth),
        "Popular vehicles retains its vertical list",
      );
      const featured = page.getByRole("region", {
        name: "Featured vehicles",
        exact: true,
      });
      await featured.scrollIntoViewIfNeeded();
      assert.equal(await featured.getByRole("article").count(), 3);
      assert.ok(
        await featured.evaluate((node) => node.scrollWidth > node.clientWidth),
        "Only the featured home collection gains horizontal browsing",
      );
      const railBounds = await featured.boundingBox();
      assert.ok(railBounds);
      await swipeAcross(page, railBounds, "left");
      await page.waitForFunction(
        () =>
          (document.querySelector(".mobile-featured-rail")?.scrollLeft ?? 0) >
          20,
        undefined,
        { timeout: 5000 },
      );
      await featured.getByRole("link").last().focus();
      const focused = await featured.getByRole("link").last().boundingBox();
      assert.ok(
        focused &&
          focused.x >= railBounds.x - 1 &&
          focused.x + focused.width <= railBounds.x + railBounds.width + 1,
        "Keyboard focus reveals offscreen featured cards",
      );
      await page.screenshot({
        path: `${directory}/featured-${width}.png`,
        animations: "disabled",
      });
      await page
        .getByRole("search", { name: "Find a vehicle" })
        .scrollIntoViewIfNeeded();
      const opener = page
        .getByRole("search", { name: "Find a vehicle" })
        .getByRole("button", { name: "Make or model", exact: true });
      await opener.click();
      const search = await assertSheet(page, "Make or model", 844);
      await search
        .getByRole("searchbox", { name: "Make or model" })
        .fill("unmatched-example");
      assert.ok(
        await search
          .getByRole("button", { name: "Show 0 vehicles", exact: true })
          .isVisible(),
      );
      assert.ok(
        await search
          .getByRole("button", { name: "Make All makes", exact: true })
          .isVisible(),
      );
      assert.ok(
        await search
          .getByRole("button", {
            name: "Model Choose a make first",
            exact: true,
          })
          .isVisible(),
      );
      assert.equal(
        await search.getByRole("navigation", { name: "Browse makes" }).count(),
        0,
      );
      await search
        .getByRole("button", { name: "Clear search", exact: true })
        .click();
      await page.screenshot({
        path: `${directory}/search-${width}.png`,
        animations: "disabled",
      });
      await search
        .getByRole("button", { name: "Make All makes", exact: true })
        .click();
      const makePicker = await assertSheet(page, "Make", 844);
      await makePicker
        .getByRole("radio", { name: "Subaru", exact: true })
        .check();
      await makePicker
        .getByRole("navigation", { name: "Vehicle search options" })
        .getByRole("button", { name: "Model", exact: true })
        .click();
      const model = await assertSheet(page, "Model", 844);
      assert.ok(await model.getByText("Models for Subaru").isVisible());
      await model
        .getByRole("navigation", { name: "Vehicle search options" })
        .getByRole("button", { name: "Make", exact: true })
        .click();
      const make = await assertSheet(page, "Make", 844);
      await make.locator(".mobile-sheet-content").evaluate((node) => {
        node.scrollTop = node.scrollHeight;
      });
      const makeSearch = await make
        .getByRole("searchbox", { name: "Search makes" })
        .boundingBox();
      const makeHeader = await make.locator("header").boundingBox();
      assert.ok(
        makeSearch &&
          makeHeader &&
          makeSearch.y < makeHeader.y + makeHeader.height,
        "The original make search scrolls with the picker content",
      );
      await page.screenshot({
        path: `${directory}/makes-scrolled-${width}.png`,
        animations: "disabled",
      });
      await make
        .getByRole("searchbox", { name: "Search makes" })
        .fill("nothing-matches");
      assert.ok(await make.getByRole("status").isVisible());
      await make.press("Escape");
      await opener.waitFor({ state: "visible" });
      assert.equal(
        await opener.evaluate((node) => node === document.activeElement),
        true,
      );
      for (let repeat = 0; repeat < 3; repeat++) {
        await opener.click();
        await search
          .getByRole("button", { name: "Close make or model" })
          .click();
        await search.waitFor({ state: "hidden" });
      }
      await opener.click();
      await page.setViewportSize({ width: 1024, height: 844 });
      await search.waitFor({ state: "hidden" });
      await page.setViewportSize({ width, height: 844 });
      assert.equal(
        await search.isVisible(),
        false,
        "A phone sheet does not reopen after crossing its breakpoint",
      );

      await visit(page, "/contact");
      const enquiryOpener = page
        .getByRole("button", { name: "Send an enquiry", exact: true })
        .first();
      await enquiryOpener.click();
      const enquiry = await assertSheet(page, "Send an enquiry", 844);
      const submit = enquiry.getByRole("button", {
        name: "Send message",
        exact: true,
      });
      assert.equal(await enquiry.locator("footer").count(), 0);
      assert.equal(
        await submit.evaluate(
          (node) => !!node.closest(".mobile-sheet-content"),
        ),
        true,
        "The original enquiry action remains inside its form",
      );
      assert.equal(
        await submit.evaluate((node) =>
          (node as HTMLButtonElement).form?.matches("[data-contact-enquiry]"),
        ),
        true,
      );
      await enquiry
        .getByRole("textbox", { name: "Your message" })
        .fill("A demonstration enquiry.");
      await enquiry.locator(".mobile-sheet-content").evaluate((node) => {
        node.scrollTop = 0;
      });
      await page.screenshot({
        path: `${directory}/enquiry-${width}.png`,
        animations: "disabled",
      });
      await enquiry.getByRole("textbox", { name: "Your message" }).focus();
      // Model a keyboard that reduces only VisualViewport, leaving 844px layout height.
      await page.evaluate(() => {
        const viewport = window.visualViewport!;
        Object.defineProperty(viewport, "height", {
          configurable: true,
          value: 420,
        });
        Object.defineProperty(viewport, "offsetTop", {
          configurable: true,
          value: 0,
        });
        viewport.dispatchEvent(new Event("resize"));
      });
      await assertSheet(page, "Send an enquiry", 420);
      const message = await enquiry
        .getByRole("textbox", { name: "Your message" })
        .boundingBox();
      const content = await enquiry
        .locator(".mobile-sheet-content")
        .boundingBox();
      assert.ok(
        message &&
          content &&
          message.y + message.height <= content.y + content.height + 1,
        "Keyboard resizing keeps the focused field in the scrolling body",
      );
      await page.screenshot({
        path: `${directory}/enquiry-keyboard-${width}.png`,
        animations: "disabled",
      });
      await page.evaluate(() => {
        const viewport = window.visualViewport!;
        Reflect.deleteProperty(viewport, "height");
        Reflect.deleteProperty(viewport, "offsetTop");
        viewport.dispatchEvent(new Event("resize"));
      });
      await submit.click();
      assert.ok(
        await enquiry.locator("output[data-demo-feedback]").isVisible(),
        "The original action reaches the existing demo form",
      );
      await enquiry.press("Escape");
      assert.equal(
        await page
          .locator("dialog.mobile-contact-sheet")
          .evaluate((node) =>
            node.style.getPropertyValue("--mobile-sheet-height"),
          ),
        "",
        "Viewport listeners and inline sizing are cleaned up on close",
      );

      for (const height of [844, 480]) {
        await page.setViewportSize({ width, height });
        await visit(page, "/vehicle");
        const photosOpener = page
          .getByRole("button", { name: "Open photo viewer", exact: true })
          .first();
        await photosOpener.click();
        const viewer = page.getByRole("dialog", {
          name: "Photo viewer",
          exact: true,
        });
        await viewer.waitFor({ state: "visible" });
        const bounds = await viewer.boundingBox();
        assert.ok(bounds && bounds.width === width && bounds.height === height);
        const image = viewer.getByRole("img", {
          name: "Photo 1 of 5",
          exact: true,
        });
        const imageBounds = await image.boundingBox();
        assert.ok(
          imageBounds && imageBounds.width >= width - 24,
          "Photo uses the available phone width",
        );
        assert.equal(
          await page.evaluate(() => getComputedStyle(document.body).overflow),
          "hidden",
        );
        await swipePhoto(page, "left");
        await viewer
          .getByRole("img", { name: "Photo 2 of 5", exact: true })
          .waitFor({ state: "visible" });
        await swipePhoto(page, "right");
        await image.waitFor({ state: "visible" });
        await viewer
          .getByRole("button", { name: "Previous photo", exact: true })
          .click();
        await viewer
          .getByRole("img", { name: "Photo 5 of 5", exact: true })
          .waitFor({ state: "visible" });
        await viewer
          .getByRole("button", { name: "Next photo", exact: true })
          .click();
        await image.waitFor({ state: "visible" });
        await viewer.screenshot({
          path: `${directory}/photos-${width}-${height}.png`,
          animations: "disabled",
        });
        await viewer
          .getByRole("button", { name: "Close photo viewer", exact: true })
          .click();
        await viewer.waitFor({ state: "hidden" });
        assert.equal(
          await photosOpener.evaluate(
            (node) => node === document.activeElement,
          ),
          true,
        );
        assert.notEqual(
          await page.evaluate(() => getComputedStyle(document.body).overflow),
          "hidden",
        );
      }
      assert.deepEqual(errors, []);
      results.push({
        width,
        journeys: [
          "selective-featured-rail-touch-and-keyboard",
          "original-make-model-selectors",
          "search-empty-state",
          "original-picker-scroll",
          "repeated-sheet-focus-return",
          "breakpoint-dismissal",
          "original-enquiry-submit",
          "visual-viewport-keyboard",
          "viewport-cleanup",
          "full-width-photos",
          "touch-swipe",
          "photo-wraparound",
          "photo-focus-return",
        ],
      });
      console.log("PASS", "mobile patterns", width);
      await page.close();
    }
  }
} finally {
  fs.writeFileSync(
    `${directory}/${phase}-results.json`,
    JSON.stringify(results, null, 2),
  );
  await browser.close();
}
