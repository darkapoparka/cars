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
      hasTouch: width < 1000,
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
    await page.waitForFunction(
      () => document.body.dataset.karentoReady === "true",
    );
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
    const photoCount = await gallery.locator(".slick-slide").count();
    await gallery.locator(".slick-current a").focus();
    for (const [key, expected] of [
      ["ArrowLeft", "0"],
      ["ArrowRight", "1"],
      ["End", String(photoCount - 1)],
      ["Home", "0"],
    ] as const) {
      await page.keyboard.press(key);
      await page.waitForFunction(
        (index) =>
          document.activeElement
            ?.closest(".slick-slide")
            ?.getAttribute("data-slick-index") === index,
        expected,
      );
      assert.equal(
        await page.evaluate(
          () =>
            document.activeElement?.closest('[aria-hidden="true"]') !== null,
        ),
        false,
      );
    }
    const photo = gallery.locator(".slick-current img");
    await photo.scrollIntoViewIfNeeded();
    const box = await photo.boundingBox();
    assert.ok(box);
    const gestureY = Math.min(890, Math.max(10, box.y + box.height / 2));
    await page.mouse.move(box.x + box.width * 0.7, gestureY);
    await page.mouse.down();
    await page.mouse.move(box.x + box.width * 0.3, gestureY, { steps: 8 });
    await page.mouse.up();
    await page.waitForFunction(
      () =>
        document
          .querySelector(".banner-activities-detail .slick-current")
          ?.getAttribute("data-slick-index") === "1",
    );
    assert.equal(await viewer.count(), 0);
    await gallery.locator(".slick-current a").click();
    await viewer.waitFor({ state: "visible" });
    await page.keyboard.press("Escape");
    await viewer.waitFor({ state: "detached" });
    if (width < 1000) {
      const touchBox = await photo.boundingBox();
      assert.ok(touchBox);
      const session = await page.context().newCDPSession(page);
      try {
        await session.send("Input.dispatchTouchEvent", {
          type: "touchStart",
          touchPoints: [{ x: touchBox.x + touchBox.width * 0.75, y: gestureY }],
        });
        for (let step = 1; step <= 8; step++) {
          await session.send("Input.dispatchTouchEvent", {
            type: "touchMove",
            touchPoints: [
              {
                x: touchBox.x + touchBox.width * (0.75 - step / 16),
                y: gestureY,
              },
            ],
          });
        }
        await session.send("Input.dispatchTouchEvent", {
          type: "touchEnd",
          touchPoints: [],
        });
      } finally {
        await session.detach();
      }
      await page.waitForFunction(
        () =>
          document
            .querySelector(".banner-activities-detail .slick-current")
            ?.getAttribute("data-slick-index") === "2",
      );
      assert.equal(await viewer.count(), 0);
    }
    for (const index of [NaN, Infinity, -Infinity, 1.5]) {
      await page.evaluate(
        (value) =>
          window.dispatchEvent(
            new CustomEvent("karento-gallery", {
              detail: {
                images: [
                  "/assets/imgs/cars-details/banner.png",
                  "/assets/imgs/cars-details/banner2.png",
                ],
                index: value,
              },
            }),
          ),
        index,
      );
      await viewer.waitFor({ state: "visible" });
      assert.equal(
        await viewer.locator("img").getAttribute("alt"),
        "Photo 1 of 2",
      );
      assert.equal(
        await viewer.locator("img").getAttribute("src"),
        "/assets/imgs/cars-details/banner.png",
      );
      await page.keyboard.press("Escape");
      await viewer.waitFor({ state: "detached" });
    }
    await page.evaluate(() =>
      window.dispatchEvent(
        new CustomEvent("karento-gallery", {
          detail: {
            images: ["/assets/imgs/cars-details/banner.png"],
            index: 0,
          },
        }),
      ),
    );
    await viewer.waitFor({ state: "visible" });
    await page.evaluate(() => {
      const current = document.querySelector<HTMLDialogElement>(
        ".karento-photo-viewer",
      );
      if (!current)
        throw new Error("Photo viewer must be mounted before reopening");
      current.close();
      window.dispatchEvent(
        new CustomEvent("karento-gallery", {
          detail: {
            images: ["/assets/imgs/cars-details/banner2.png"],
            index: 0,
          },
        }),
      );
    });
    await page.evaluate(
      () =>
        new Promise<void>((resolve) =>
          requestAnimationFrame(() => requestAnimationFrame(() => resolve())),
        ),
    );
    assert.equal(
      await viewer.isVisible(),
      true,
      "Queued close must preserve the reopened viewer",
    );
    assert.equal(
      await viewer.locator("img").getAttribute("src"),
      "/assets/imgs/cars-details/banner2.png",
    );
    await page.keyboard.press("Escape");
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
    await date.fill("01/10/2026");
    await date.press("Escape");
    await date.click();
    await date.fill("17/10/2026");
    await page
      .locator(
        '.karento-calendar td[aria-selected="true"] button[aria-label="17 October 2026"]',
      )
      .waitFor();
    await date.press("ArrowDown");
    await page.waitForFunction(
      () =>
        document.activeElement?.getAttribute("aria-label") ===
        "17 October 2026",
    );
    await page.keyboard.press("Escape");
    assert.equal(
      await date.evaluate((element) => document.activeElement === element),
      true,
    );
    for (let attempt = 0; attempt < 3; attempt++) {
      await date.evaluate((element) => {
        const input = element as HTMLInputElement;
        input.blur();
        input.focus();
        input.dispatchEvent(
          new KeyboardEvent("keydown", { key: "Tab", bubbles: true }),
        );
      });
      assert.equal(await page.locator(".karento-calendar").count(), 0);
    }
    await date.click();
    await page.locator(".karento-calendar").waitFor();
    await page
      .locator('header .main-menu a[href="/vehicles"]')
      .evaluate((link) => (link as HTMLAnchorElement).click());
    await page.waitForURL("**/vehicles");
    assert.equal(await page.locator(".karento-calendar").count(), 0);
    await page.goto(base + "/membership");
    await page.waitForFunction(
      () => document.body.dataset.karentoReady === "true",
    );
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
        "visible photo keyboard focus",
        "mouse and mobile touch swipe without accidental viewer opening",
        "invalid viewer index recovery",
        "queued close preserves the reopened photo viewer",
        "calendar keyboard, selection, month/year and invalid date recovery",
        "calendar within viewport",
        "calendar typed selection, rapid closure and route disposal",
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
