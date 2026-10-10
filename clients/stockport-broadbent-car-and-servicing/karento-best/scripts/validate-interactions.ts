import assert from "node:assert/strict";
import fs from "node:fs";
import { launchBrowser } from "./browser.ts";
import { dealer } from "../src/lib/content.ts";
const browser = await launchBrowser();
try {
  const context = await browser.newContext({
    viewport: { width: 1440, height: 900 },
    reducedMotion: "reduce",
  });
  const page = await context.newPage();
  const errors: string[] = [];
  page.on("pageerror", (e) => errors.push(e.message));
  const results: string[] = [];
  const base = process.env.KARENTO_NATIVE_URL || "http://127.0.0.1:6466";
  async function record(name: string, fn: () => Promise<void>) {
    await fn();
    results.push(name);
    console.log("PASS", name);
  }
  async function ready() {
    await page.waitForFunction(
      () => document.body.dataset.karentoReady === "true",
    );
  }
  await page.goto(base);
  await ready();
  await record(
    "drawer opens, focuses close button, traps Tab, closes on Escape and returns focus",
    async () => {
      await page.locator(".karento-menu-toggle").click();
      const drawer = page.locator("#karento-account-drawer");
      await assert.doesNotReject(() =>
        drawer.locator(".close-canvas").waitFor({ state: "visible" }),
      );
      await page.waitForFunction(() =>
        document.activeElement?.matches(".close-canvas"),
      );
      assert.equal(await drawer.getAttribute("aria-hidden"), "false");
      assert.equal(
        await drawer.evaluate((el) => (el as HTMLElement).inert),
        false,
      );
      assert.equal(
        await page.evaluate(() =>
          document.activeElement?.matches(".close-canvas"),
        ),
        true,
      );
      await drawer.locator("summary").focus();
      await page.keyboard.press("Tab");
      assert.equal(
        await page.evaluate(
          () =>
            document.activeElement?.closest("#karento-account-drawer") !== null,
        ),
        true,
      );
      await page.keyboard.press("Shift+Tab");
      assert.equal(
        await page.evaluate(() => document.activeElement?.tagName),
        "SUMMARY",
      );
      await page.keyboard.press("Escape");
      assert.equal(await drawer.getAttribute("aria-hidden"), "true");
      assert.equal(
        await page.evaluate(() =>
          document.activeElement?.classList.contains("karento-menu-toggle"),
        ),
        true,
      );
    },
  );
  await record(
    "overlay closes drawer and only one overlay is mounted",
    async () => {
      await page.locator(".karento-menu-toggle").click();
      assert.equal(await page.locator(".body-overlay-1").count(), 1);
      await page
        .locator(".body-overlay-1")
        .click({ position: { x: 10, y: 300 } });
      assert.equal(await page.locator(".body-overlay-1").count(), 0);
    },
  );
  await record("native dropdown selects and dismisses", async () => {
    const dropdown = page.locator(".box-search-advance .dropdown").first();
    await dropdown.locator("button").click();
    await dropdown.locator(".dropdown-item").first().click();
    assert.match(await dropdown.locator("button").innerText(), /Paris/);
    assert.match(
      (await dropdown.locator("button").getAttribute("aria-label")) || "",
      /Paris/,
    );
    assert.equal(
      await dropdown.locator("button").getAttribute("aria-expanded"),
      "false",
    );
    await dropdown.locator("button").click();
    await page.keyboard.press("Escape");
    assert.equal(
      await dropdown.locator("button").getAttribute("aria-expanded"),
      "false",
    );
  });
  await record("dropdown arrow keys open, wrap and restore focus", async () => {
    const dropdown = page.locator(".box-search-advance .dropdown").first();
    const toggle = dropdown.locator("button");
    const items = dropdown.locator(".dropdown-item");
    await toggle.focus();
    await page.keyboard.press("ArrowUp");
    assert.equal(await toggle.getAttribute("aria-expanded"), "true");
    await page.waitForFunction(
      () =>
        document.activeElement?.textContent?.trim() === "New York City, USA",
    );
    assert.equal(
      await items.last().evaluate((el) => el === document.activeElement),
      true,
    );
    await page.keyboard.press("ArrowDown");
    assert.equal(
      await items.first().evaluate((el) => el === document.activeElement),
      true,
    );
    await page.keyboard.press("Escape");
    assert.equal(await toggle.getAttribute("aria-expanded"), "false");
    assert.equal(
      await toggle.evaluate((el) => el === document.activeElement),
      true,
    );
    await page.keyboard.press("ArrowDown");
    await page.waitForFunction(
      () => document.activeElement?.textContent?.trim() === "Paris, France",
    );
    assert.equal(
      await items.first().evaluate((el) => el === document.activeElement),
      true,
    );
    await page.keyboard.press("Enter");
    assert.equal(await toggle.getAttribute("aria-expanded"), "false");
    assert.equal(
      await toggle.evaluate((el) => el === document.activeElement),
      true,
    );
  });
  await record(
    "category selections use local state and support Space",
    async () => {
      for (const route of ["/", "/index", "/index-2"]) {
        await page.goto(base + route);
        await ready();
        const categories = page.locator(".box-search-advance .btn-click");
        assert.equal(await categories.count(), 3);
        await categories.nth(1).focus();
        await page.keyboard.press("Space");
        assert.equal(
          await categories.nth(1).getAttribute("aria-pressed"),
          "true",
        );
        assert.equal(
          await categories.nth(0).getAttribute("aria-pressed"),
          "false",
        );
        assert.equal(
          await page.locator(".box-search-advance .btn-click.active").count(),
          1,
        );
        await categories.nth(2).click();
        assert.equal(
          await categories.nth(1).getAttribute("aria-pressed"),
          "false",
        );
        assert.equal(
          await categories.nth(2).getAttribute("aria-pressed"),
          "true",
        );
      }
    },
  );
  await record(
    "owner demo login and sign-out do not imply saved authentication",
    async () => {
      await page.goto(base + "/login");
      await ready();
      await page.locator("[data-demo-signin] select").selectOption("owner");
      await page.locator("[data-demo-signin] button").click();
      await page.waitForURL("**/dashboard");
      await page.locator(".karento-menu-toggle").click();
      await page.waitForFunction(
        () =>
          document
            .querySelector("#karento-account-drawer")
            ?.getAttribute("aria-hidden") === "false",
      );
      assert.equal(
        (
          await page.locator("[data-demo-account-heading]").textContent()
        )?.trim(),
        "Dealership owner",
      );
      assert.equal(
        await page.locator("[data-demo-settings-link]").getAttribute("href"),
        "/dashboard/settings",
      );
      await page.locator(".karento-demo-signout").click();
      await page.waitForURL("**/login");
      assert.equal(
        await page.locator(".karento-header-cta").getAttribute("href"),
        "/login",
      );
    },
  );
  await record(
    "member demo role persists across routes and reload",
    async () => {
      await page.locator("[data-demo-signin] select").selectOption("member");
      await page.locator("[data-demo-signin] button").click();
      await page.waitForURL("**/account");
      await page.reload();
      await ready();
      assert.equal(
        await page.locator(".karento-header-cta").getAttribute("href"),
        "/account",
      );
      await page.locator(".karento-menu-toggle").click();
      assert.equal(
        (
          await page.locator("[data-demo-account-heading]").textContent()
        )?.trim(),
        "Member account",
      );
      await page.keyboard.press("Escape");
    },
  );
  await record(
    "route transitions, back/forward and repeated gallery disposal",
    async () => {
      await page.goto(base + "/vehicle");
      await ready();
      await page.waitForSelector(
        ".banner-activities-detail[data-widget-ready]",
      );
      for (let i = 0; i < 3; i++) {
        assert.equal(
          await page.locator(".banner-activities-detail > .slick-list").count(),
          1,
        );
        await page.locator('header .main-menu a[href="/vehicles"]').click();
        await page.waitForURL("**/vehicles");
        await page.goBack();
        await page.waitForURL("**/vehicle");
        await page.waitForSelector(
          ".banner-activities-detail[data-widget-ready]",
        );
        await page.goForward();
        await page.waitForURL("**/vehicles");
        await page.goBack();
        await page.waitForURL("**/vehicle");
        await page.waitForSelector(
          ".banner-activities-detail[data-widget-ready]",
        );
      }
      assert.equal(await page.locator(".body-overlay-1").count(), 0);
      assert.equal(await page.locator(".sidebar-canvas-wrapper").count(), 1);
    },
  );
  await record("gallery arrows change the active slide", async () => {
    const gallery = page.locator(".banner-activities-detail");
    const before = await gallery
      .locator(".slick-active")
      .getAttribute("data-slick-index");
    await gallery.locator(".slick-next").click();
    await page.waitForTimeout(350);
    assert.notEqual(
      await gallery.locator(".slick-active").getAttribute("data-slick-index"),
      before,
    );
  });
  await record(
    "quantity stays positive and contact form truthfully reports preview-only behavior",
    async () => {
      await page.goto(base + "/shop/product");
      await ready();
      await page.waitForSelector(".detail-qty");
      const qty = page.locator(".detail-qty");
      const input = qty.locator(".qty-val");
      const before = Number(await input.inputValue());
      await qty.locator(".qty-up").click();
      assert.equal(Number(await input.inputValue()), before + 1);
      await input.fill("1");
      await qty.locator(".qty-down").click();
      assert.equal(await input.inputValue(), "1");
      await page.goto(base + "/contact");
      await ready();
      const form = page.locator("[data-contact-enquiry]");
      await form.evaluate((el) => {
        (el as HTMLFormElement).noValidate = true;
        (el as HTMLFormElement).requestSubmit();
      });
      await form.locator("[data-demo-feedback]").waitFor();
      assert.match(
        await form.locator("[data-demo-feedback]").innerText(),
        /does not send or save/,
      );
    },
  );
  await record("accordion state and native tab selection", async () => {
    await page.goto(base + "/faq");
    await ready();
    const button = page.locator('main [data-bs-toggle="collapse"]').first();
    const target =
      (await button.getAttribute("data-bs-target")) ||
      (await button.getAttribute("href"));
    assert.ok(target);
    const before = await button.getAttribute("aria-expanded");
    await button.click();
    assert.notEqual(await button.getAttribute("aria-expanded"), before);
    await button.click();
    assert.equal(await button.getAttribute("aria-expanded"), before);
    await page.goto(base);
    await ready();
    const tab = page.locator(".box-search-advance .btn-click").nth(1);
    await tab.click();
    assert.equal(
      await tab.evaluate((el) => el.classList.contains("active")),
      true,
    );
  });
  await record(
    "calendar opens, selects and disposes on navigation",
    async () => {
      await page.goto(base);
      await ready();
      const calendar = page.locator(".datepicker[data-widget-ready]").first();
      await calendar.waitFor();
      await calendar.click();
      const picker = page.locator(".datepicker-dropdown").last();
      await picker.waitFor({ state: "visible" });
      await picker.locator("td.day:not(.old):not(.new) button").first().click();
      await page.locator('header .main-menu a[href="/vehicles"]').click();
      await page.waitForURL("**/vehicles");
      assert.equal(await page.locator(".datepicker-dropdown").count(), 0);
    },
  );
  await record(
    "membership period and catalog filter sections toggle",
    async () => {
      await page.goto(base + "/membership");
      await ready();
      const monthly = page.getByRole("radio", { name: "Monthly", exact: true });
      const annual = page.getByRole("radio", { name: "Annual", exact: true });
      assert.equal(
        await page.locator(".text-price-standard").first().innerText(),
        "19",
      );
      await monthly.check();
      assert.equal(
        await page.locator(".text-price-standard").first().innerText(),
        "19",
      );
      await page
        .locator(".karento-billing-option")
        .filter({ has: annual })
        .click();
      assert.equal(
        await page.locator(".text-price-standard").first().innerText(),
        "228",
      );
      await page
        .locator(".karento-billing-option")
        .filter({ has: monthly })
        .click();
      assert.equal(
        await page.locator(".text-price-standard").first().innerText(),
        "19",
      );
      await page.goto(base + "/vehicles");
      await ready();
      await page.goto(base + "/cars-list-1");
      await ready();
      const filter = page.locator("main .block-filter:visible").first();
      const toggle = filter.locator(".item-collapse [role=button]");
      await toggle.click();
      assert.equal(await toggle.getAttribute("aria-expanded"), "false");
      await toggle.click();
      assert.equal(await toggle.getAttribute("aria-expanded"), "true");
    },
  );
  await record(
    "guest and member previews are isolated between browser contexts",
    async () => {
      const guest = await browser.newContext();
      try {
        const other = await guest.newPage();
        await other.goto(base);
        await other.waitForFunction(
          () => document.body.dataset.karentoReady === "true",
        );
        assert.equal(
          await other.locator(".karento-header-cta").getAttribute("href"),
          "/login",
        );
      } finally {
        await guest.close();
      }
    },
  );
  await record(
    "SPA mounts preserve the document and do not accumulate global listeners",
    async () => {
      await page.setViewportSize({ width: 1440, height: 900 });
      await page.goto(base + "/vehicle");
      await ready();
      await page.waitForSelector(
        ".banner-activities-detail[data-widget-ready]",
      );
      await page.evaluate(() =>
        Object.defineProperty(window, "__karentoJourneyToken", {
          value: "native-navigation-proof",
        }),
      );
      const client = await context.newCDPSession(page);
      const count = async (expression: string) => {
        const evaluated = await client.send("Runtime.evaluate", {
          expression,
          objectGroup: "karento-validation",
        });
        assert.ok(evaluated.result.objectId);
        const data = await client.send("DOMDebugger.getEventListeners", {
          objectId: evaluated.result.objectId,
        });
        return data.listeners.reduce<Record<string, number>>(
          (result, listener) => {
            result[listener.type] = (result[listener.type] || 0) + 1;
            return result;
          },
          {},
        );
      };
      const before = {
        window: await count("window"),
        document: await count("document"),
      };
      for (let index = 0; index < 4; index++) {
        await page.locator('header .main-menu a[href="/vehicles"]').click();
        await page.waitForURL("**/vehicles");
        await page.goBack();
        await page.waitForURL("**/vehicle");
        await page.waitForSelector(
          ".banner-activities-detail[data-widget-ready]",
        );
      }
      assert.equal(
        await page.evaluate(() => Reflect.get(window, "__karentoJourneyToken")),
        "native-navigation-proof",
      );
      assert.deepEqual(
        { window: await count("window"), document: await count("document") },
        before,
      );
      await client.detach();
    },
  );
  await record(
    "Explore is keyboard reachable without hash navigation",
    async () => {
      await page.setViewportSize({ width: 1440, height: 900 });
      await page.goto(base);
      await ready();
      const explore = page.locator(".header .main-menu > .has-children > a");
      await explore.focus();
      const initial = page.url();
      await page.keyboard.press("Enter");
      assert.equal(page.url(), initial);
      await page.keyboard.press("Space");
      assert.equal(page.url(), initial);
      // The preserved submenu animates visibility; wait for its links before Tab.
      await page
        .locator('.header .sub-menu a[href="/about"]')
        .waitFor({ state: "visible" });
      await page.keyboard.press("Tab");
      assert.equal(
        await page
          .locator('.header .sub-menu a[href="/about"]')
          .evaluate((el) => el === document.activeElement),
        true,
      );
    },
  );
  await record(
    "preserved tablet navigation supports Space without scrolling",
    async () => {
      await page.setViewportSize({ width: 1024, height: 900 });
      await page.goto(base);
      await ready();
      const toggle = page.locator("header .burger-icon");
      await toggle.focus();
      const initial = await page.evaluate(() => scrollY);
      await page.keyboard.press("Space");
      await page.waitForFunction(
        () =>
          document
            .querySelector(".mobile-header-active")
            ?.getAttribute("aria-hidden") === "false",
      );
      assert.equal(await page.evaluate(() => scrollY), initial);
      const close = page.locator('.mobile-header-logo [role="button"]');
      await close.focus();
      await page.keyboard.press("Space");
      assert.equal(
        await page
          .locator(".mobile-header-active")
          .evaluate((el) => el instanceof HTMLElement && el.inert),
        true,
      );
    },
  );
  await record(
    "preserved tablet navigation opens and closes with Escape",
    async () => {
      await page.setViewportSize({ width: 1024, height: 900 });
      await page.goto(base);
      await page.locator("header .burger-icon").click();
      assert.equal(
        await page
          .locator(".mobile-header-active")
          .evaluate((el) => (el as HTMLElement).inert),
        false,
      );
      await page.keyboard.press("Escape");
      assert.equal(
        await page
          .locator(".mobile-header-active")
          .evaluate((el) => (el as HTMLElement).inert),
        true,
      );
    },
  );
  await record(
    "FAQ groups, review forms and settings labels control their own targets",
    async () => {
      await page.setViewportSize({ width: 1440, height: 900 });
      await page.goto(base + "/faq");
      await ready();
      const questions = page.locator('main [data-bs-toggle="collapse"]');
      const panels = await questions.evaluateAll((buttons) =>
        buttons.map((button) => ({
          target: button.getAttribute("aria-controls"),
          open: button.getAttribute("aria-expanded"),
        })),
      );
      await questions.nth(1).click();
      const repeated = panels.findIndex(
        (panel, index) => index > 1 && panel.target?.endsWith("collapse02"),
      );
      assert.ok(repeated > 1);
      assert.equal(
        await questions.nth(repeated).getAttribute("aria-expanded"),
        panels[repeated].open,
      );
      await questions.nth(repeated).click();
      assert.equal(
        await questions.nth(1).getAttribute("aria-expanded"),
        "true",
      );
      for (const route of [
        "/vehicle",
        "/cars-details-2",
        "/cars-details-4",
        "/shop-details",
      ]) {
        await page.goto(base + route);
        await ready();
        const review = page
          .locator('main [data-bs-target*="collapseAddReview"]:visible')
          .first();
        const target = await review.getAttribute("aria-controls");
        assert.ok(target);
        const reviewPanel = page.locator(`[id="${target}"]`);
        const calculator = page.locator(
          'main [data-bs-target*="collapseCalculator"]:visible',
        );
        assert.equal(await review.getAttribute("aria-expanded"), "true");
        await review.click();
        await reviewPanel.waitFor({ state: "hidden" });
        if (await calculator.count()) {
          assert.equal(await calculator.getAttribute("aria-expanded"), "true");
        }
        await review.click();
        await reviewPanel.waitFor({ state: "visible" });
        if (await calculator.count()) {
          await calculator.click();
          assert.equal(await calculator.getAttribute("aria-expanded"), "false");
          await reviewPanel.waitFor({ state: "visible" });
        }
      }
      await page.goto(base + "/account/settings");
      await ready();
      const label = page
        .locator("label[for]")
        .filter({ hasText: "SMS" })
        .nth(1);
      const checkboxId = await label.getAttribute("for");
      assert.ok(checkboxId);
      const checkbox = page.locator(`[id="${checkboxId}"]`);
      const firstCheckbox = page.locator('input[type="checkbox"]').first();
      const before = await checkbox.isChecked();
      const firstBefore = await firstCheckbox.isChecked();
      await label.click();
      assert.equal(await checkbox.isChecked(), !before);
      assert.equal(await firstCheckbox.isChecked(), firstBefore);
    },
  );
  await record(
    "internal page failures show their status instead of a false 404",
    async () => {
      const failedPage = await context.newPage();
      try {
        await failedPage.goto(base + "/404");
        await failedPage.waitForFunction(
          () => document.body.dataset.karentoReady === "true",
        );
        // Simulate a failed lazy page import after the shared shell has loaded.
        await failedPage.route("**/_app/immutable/chunks/*.js", (request) =>
          request.abort(),
        );
        await failedPage
          .locator('header .main-menu a[href="/vehicles"]')
          .click();
        await failedPage.waitForURL("**/vehicles");
        await failedPage
          .getByRole("heading", { name: "500", exact: true })
          .waitFor();
        assert.equal(
          await failedPage.title(),
          `Something went wrong | ${dealer.name}`,
        );
        assert.equal(await failedPage.locator("header.header").count(), 1);
        assert.equal(await failedPage.locator("main").count(), 1);
      } finally {
        await failedPage.close();
      }
    },
  );
  await record(
    "compiled demo feedback is singular and resets after client navigation",
    async () => {
      await page.goto(base + "/membership");
      await ready();
      const action = page
        .getByRole("button", { name: "Get Started Now", exact: true })
        .first();
      await action.click();
      await action.click();
      assert.equal(await page.locator("output[data-demo-action]").count(), 1);
      assert.equal(
        await page.locator("output[data-demo-action]").innerText(),
        "Template preview only. No purchase or saved account change is made.",
      );
      await page.locator('header .main-menu a[href="/contact"]').click();
      await page.waitForURL("**/contact");
      await page.locator('header .main-menu a[href="/membership"]').click();
      await page.waitForURL("**/membership");
      assert.equal(await page.locator("output[data-demo-action]").count(), 0);
      await page
        .getByRole("button", { name: "Get Started Now", exact: true })
        .first()
        .click();
      assert.equal(await page.locator("output[data-demo-action]").count(), 1);
    },
  );
  assert.deepEqual(errors, []);
  fs.mkdirSync(".runtime/evidence", { recursive: true });
  fs.writeFileSync(
    ".runtime/evidence/interactions.json",
    JSON.stringify({ passed: results, errors }, null, 2),
  );
} finally {
  await browser.close();
}
