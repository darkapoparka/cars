import assert from "node:assert/strict";
import fs from "node:fs";
import { launchBrowser } from "./browser.ts";
const browser = await launchBrowser();
const base = process.env.KARENTO_NATIVE_URL || "http://127.0.0.1:6466";
const results: { width: number; checks: string[] }[] = [];
try {
  for (const width of [320, 390, 1440]) {
    const page = await browser.newPage({
      viewport: { width, height: 900 },
      reducedMotion: "reduce",
    });
    const errors: string[] = [];
    const forbidden: string[] = [];
    page.on("pageerror", (error) => errors.push(error.message));
    page.on("request", (request) => {
      if (
        /jquery|slick\.js|bootstrap-datepicker\.js|\/assets\/js\/main\.js/i.test(
          request.url(),
        )
      )
        forbidden.push(request.url());
    });
    await page.goto(base + "/vehicle");
    const gallery = page.locator(".banner-activities-detail");
    await gallery.locator(".slick-next").waitFor();
    await gallery.getByRole("button", { name: "Next photo" }).click();
    assert.equal(
      await gallery.locator(".slick-current").getAttribute("data-slick-index"),
      "1",
    );
    await gallery
      .getByRole("button", { name: "Next photo" })
      .press("ArrowLeft");
    assert.equal(
      await gallery.locator(".slick-current").getAttribute("data-slick-index"),
      "0",
    );
    await page.locator(".karento-gallery-thumb").nth(1).click();
    assert.equal(
      await gallery.locator(".slick-current").getAttribute("data-slick-index"),
      "1",
    );
    await gallery
      .getByRole("button", { name: "Open photo viewer", exact: true })
      .click();
    const viewer = page.getByRole("dialog", { name: "Photo viewer" });
    await viewer.waitFor({ state: "visible" });
    assert.match(
      (await viewer.locator("img").getAttribute("src")) || "",
      /banner2/,
    );
    await viewer.getByRole("button", { name: "Next photo" }).click();
    assert.match(
      (await viewer.locator("img").getAttribute("src")) || "",
      /banner3/,
    );
    await viewer
      .getByRole("button", { name: "Close photo viewer" })
      .press("Escape");
    await viewer.waitFor({ state: "detached" });
    const date = page.getByRole("combobox", {
      name: "Pick-up date",
      exact: true,
    });
    await date.click();
    await date.press("ArrowDown");
    await page.keyboard.press("ArrowRight");
    await page.keyboard.press("Enter");
    assert.equal(await date.inputValue(), "18/02/2025");
    assert.equal(await page.locator(".datepicker-dropdown").count(), 0);
    await date.click();
    await page.getByRole("button", { name: "Next month", exact: true }).click();
    assert.match(
      await page.locator(".datepicker-switch").innerText(),
      /March 2025/,
    );
    await page.locator(".datepicker-switch button").click();
    await page
      .locator(".karento-calendar-options button")
      .filter({ hasText: /^Oct$/ })
      .click();
    assert.match(
      await page.locator(".datepicker-switch").innerText(),
      /October 2025/,
    );
    await page.locator(".datepicker-switch button").click();
    await page.locator(".datepicker-switch button").click();
    await page.getByRole("button", { name: "2026", exact: true }).click();
    await page.getByRole("button", { name: "Jan", exact: true }).click();
    await page
      .getByRole("button", { name: "12 January 2026", exact: true })
      .click();
    assert.equal(await date.inputValue(), "12/01/2026");
    await date.click();
    await date.press("ArrowDown");
    await page.keyboard.press("Tab");
    const returnDate = page.getByRole("combobox", {
      name: "Drop-off date",
      exact: true,
    });
    assert.equal(
      await returnDate.evaluate((el) => el === document.activeElement),
      true,
    );
    assert.equal(await page.locator(".datepicker-dropdown").count(), 1);
    await returnDate.press("Escape");
    await date.click();
    await page.locator(".datepicker-dropdown").press("Escape");
    assert.equal(await date.getAttribute("aria-expanded"), "false");
    await date.fill("31/02/2025");
    await date.press("ArrowDown");
    assert.ok(
      await page
        .locator('.datepicker-dropdown [data-date][tabindex="0"]')
        .count(),
    );
    const popup = await page.locator(".datepicker-dropdown").boundingBox();
    assert.ok(
      popup && popup.x >= 0 && popup.x + popup.width <= width,
      `calendar fits ${width}px`,
    );
    await date.press("Escape");
    await page.goto(base + "/membership");
    const options = page.locator(".karento-billing-option");
    await options.filter({ hasText: "Annual" }).click();
    assert.deepEqual(
      await page.locator('h3[class*="text-price-"]').allTextContents(),
      ["228", "348", "588", "1,188"],
    );
    await options.filter({ hasText: "Monthly" }).click();
    assert.deepEqual(
      await page.locator('h3[class*="text-price-"]').allTextContents(),
      ["19", "29", "49", "99"],
    );
    await page
      .getByRole("button", { name: "Get Started Now", exact: true })
      .first()
      .click();
    assert.match(
      await page.locator("[data-demo-action]").innerText(),
      /No purchase/,
    );
    assert.deepEqual(errors, []);
    assert.deepEqual(forbidden, []);
    assert.equal(
      await page.evaluate(
        () => typeof (window as Window & { jQuery?: unknown }).jQuery,
      ),
      "undefined",
    );
    results.push({
      width,
      checks: [
        "gallery arrows, keyboard and thumbnails",
        "photo viewer and Escape",
        "calendar keyboard, selection, month/year and invalid date recovery",
        "calendar within viewport",
        "billing amounts and truthful action",
        "no jQuery or legacy widget requests",
      ],
    });
    console.log(`PASS native widgets at ${width}px`);
    await page.close();
  }
  fs.mkdirSync(".runtime/evidence", { recursive: true });
  fs.writeFileSync(
    ".runtime/evidence/native-widgets.json",
    JSON.stringify(results, null, 2),
  );
} finally {
  await browser.close();
}
