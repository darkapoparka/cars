import { chromium, webkit } from "playwright";
import assert from "node:assert/strict";
import fs from "node:fs/promises";
import path from "node:path";
const base = process.env.BOXCAR_URL || "http://127.0.0.1:6455";
const engine = process.env.BOXCAR_BROWSER || "chromium";
const out = path.resolve("../../runtime/boxcar-updated-parity");
const browser = await (engine === "webkit" ? webkit : chromium).launch(
  engine === "webkit" ? {} : { channel: "chrome" },
);
const page = await browser.newPage({ viewport: { width: 1440, height: 950 } });
const failures = [],
  passed = [];
page.on("pageerror", (e) => failures.push(e.message));
const home = async (n = 1) => {
  await page.goto(base + (n === 1 ? "/" : `/home-${n}/`), {
    waitUntil: "networkidle",
  });
  await page.locator(".reference-home[data-ready=true]").waitFor();
};
const step = async (name, work) => {
  try {
    await work();
  } catch (error) {
    await page.screenshot({ path: path.join(out, `${engine}-failed.png`) });
    await fs.writeFile(
      path.join(out, `${engine}-failed.json`),
      JSON.stringify(
        { name, url: page.url(), passed, failures, error: String(error) },
        null,
        2,
      ),
    );
    throw error;
  }
  passed.push(name);
  console.log("PASS", name);
};
try {
  await step(
    "Header search: all ten homes, matching cars, keyboard, dismissal and inventory URLs",
    async () => {
      await page.setViewportSize({ width: 1920, height: 950 });
      for (let n = 1; n <= 10; n += 1) {
        await home(n);
        const input = page.locator(".layout-search .show-search");
        await input.fill("Audi");
        const popup = page.locator(".box-content-search.active");
        await popup.waitFor({ state: "visible" });
        const options = popup.getByRole("option");
        assert.deepEqual(await options.locator(".name").allTextContents(), [
          "Audi A8",
          "Audi A5 Cabriolet",
        ]);
        await page.waitForFunction(() =>
          Array.from(
            document.querySelectorAll(".box-content-search.active img"),
          ).every((image) => image.complete && image.naturalWidth > 0),
        );
        await input.press("ArrowDown");
        assert.equal(
          await options.first().getAttribute("aria-selected"),
          "true",
        );
        assert.equal(
          await input.getAttribute("aria-activedescendant"),
          await options.first().getAttribute("id"),
        );
        await input.press("Escape");
        assert.equal(await input.getAttribute("aria-expanded"), "false");
        assert.equal(await input.inputValue(), "Audi");
        await input.click();
        await popup.waitFor({ state: "visible" });
        await input.fill("");
        assert.equal(await input.getAttribute("aria-expanded"), "false");
      }
      await home();
      let input = page.locator(".layout-search .show-search");
      await input.fill("Audi");
      await page
        .getByRole("heading", { name: "Find Your Perfect Car", exact: true })
        .click();
      assert.equal(await input.getAttribute("aria-expanded"), "false");
      await input.click();
      await page.screenshot({
        path: path.join(out, `${engine}-header-search.png`),
      });
      await input.press("Enter");
      await page.waitForURL("**/inventory/?q=Audi");
      await page.locator(".vehicle-card").first().waitFor();
      assert.equal(await page.locator(".vehicle-card").count(), 2);
      await home();
      input = page.locator(".layout-search .show-search");
      await input.fill("Audi");
      await input.press("ArrowUp");
      await input.press("Enter");
      await page.waitForURL("**/vehicle/audi-a5-cabriolet/**");
      await page.locator("main h1").waitFor();
      await page.goBack();
      await page.locator(".reference-home[data-ready=true]").waitFor();
      input = page.locator(".layout-search .show-search");
      await input.fill("Volvo");
      await page.locator(".box-content-search.active .btn-view-search").click();
      await page.waitForURL("**/inventory/?q=Volvo");
      await page.locator(".vehicle-card").first().waitFor();
      assert.equal(await page.locator(".vehicle-card").count(), 2);
      await home();
      input = page.locator(".layout-search .show-search");
      await input.fill("Audi");
      await page
        .locator(".box-content-search")
        .getByRole("option", { name: /Audi A8/ })
        .click();
      await page.waitForURL("**/vehicle/audi-a8/**");
      await page.locator("main h1").waitFor();
      await home();
      input = page.locator(".layout-search .show-search");
      await input.fill("NoSuchModel");
      assert.equal(
        await page.locator(".box-content-search [role=option]").count(),
        0,
      );
      assert.match(
        await page.locator(".reference-search-empty").innerText(),
        /No matching cars/,
      );
      await input.press("Enter");
      await page.waitForURL("**/inventory/?q=NoSuchModel");
      await page
        .getByText("No cars match these filters", { exact: true })
        .waitFor();
      await home();
      input = page.locator(".layout-search .show-search");
      await input.fill("Audi");
      await input.press("Tab");
      assert.equal(
        await page
          .locator(".btn-view-search")
          .evaluate((link) => document.activeElement === link),
        true,
      );
      await page.keyboard.press("Escape");
      assert.equal(await input.getAttribute("aria-expanded"), "false");
      await input.click();
      await input.press("Tab");
      await page.keyboard.press("Tab");
      assert.equal(await input.getAttribute("aria-expanded"), "false");
      await page.setViewportSize({ width: 1440, height: 950 });
      assert.equal(await input.isVisible(), false);
      await page.setViewportSize({ width: 320, height: 844 });
      assert.equal(await input.isVisible(), false);
      assert.equal(
        await page
          .locator(".form-tab-pane.current form .select")
          .first()
          .isVisible(),
        true,
      );
      await page.setViewportSize({ width: 1440, height: 950 });
    },
  );
  await step(
    "Source search: make change resets model and URL selects real inventory",
    async () => {
      await home();
      const form = page.locator(".form-tab-pane.current form").first();
      await form.locator(".select").nth(0).click();
      await form.getByRole("option", { name: "Audi", exact: true }).click();
      await form.locator(".select").nth(1).click();
      await form.getByRole("option", { name: "A8", exact: true }).click();
      await form.locator(".select").nth(0).click();
      await form.getByRole("option", { name: "BMW", exact: true }).click();
      assert.equal(
        (await form.locator(".select").nth(1).innerText()).trim(),
        "Any Models",
      );
      await form.getByRole("button", { name: /Search/ }).click();
      await page.waitForURL("**/inventory/?make=BMW");
      await page.locator(".vehicle-card").first().waitFor();
      assert.ok((await page.locator("main").innerText()).includes("BMW"));
    },
  );
  await step(
    "Source tabs and dropdowns support keyboard selection and Escape",
    async () => {
      await home();
      const tabs = page.locator(".form-tabs-list").first();
      await tabs.getByRole("tab", { name: "Used", exact: true }).focus();
      await page.keyboard.press("Enter");
      assert.equal(
        await tabs
          .getByRole("tab", { name: "Used", exact: true })
          .getAttribute("aria-selected"),
        "true",
      );
      const menu = page.locator(".form-tab-pane.current .select").first();
      await menu.focus();
      await page.keyboard.press("Enter");
      assert.equal(await menu.getAttribute("aria-expanded"), "true");
      await page.keyboard.press("Escape");
      assert.equal(await menu.getAttribute("aria-expanded"), "false");
    },
  );
  await step(
    "Carousel changes visible cars and vehicle tabs retain source geometry",
    async () => {
      await home();
      const shelf = page.locator(".cars-section-three").first(),
        active = shelf.locator(".tab-pane.active .car-slider-three");
      const before = await active
        .locator(":scope > .slick-list > .slick-track")
        .getAttribute("style");
      await active.locator(":scope > .slick-next").click();
      assert.notEqual(
        await active
          .locator(":scope > .slick-list > .slick-track")
          .getAttribute("style"),
        before,
      );
      await shelf.getByRole("tab", { name: "Used Cars", exact: true }).click();
      assert.equal(await shelf.locator(".tab-pane.active").count(), 1);
    },
  );
  await step(
    "Featured sliders and the correct Mercedes/Volvo detail routes",
    async () => {
      await home(2);
      await page
        .locator(".banner-slider-thumbs .slick-slide:not(.slick-cloned)")
        .nth(1)
        .click();
      await page.waitForFunction(
        () => !document.querySelector(".banner-slider").slick.animating,
      );
      assert.equal(
        await page
          .locator(".banner-slider .slick-current")
          .getAttribute("data-slick-index"),
        "1",
      );
      await page
        .locator(".banner-slider .slick-current")
        .getByRole("link", { name: /Learn More/ })
        .click();
      await page.waitForURL("**/vehicle/mercedes-e-class/");
      await page.locator("main h1").waitFor();
      await home(4);
      await page.locator(".banner-slider-v4 > .slick-next").click();
      await page.waitForFunction(
        () => !document.querySelector(".banner-slider-v4").slick.animating,
      );
      assert.equal(
        await page
          .locator(".banner-slider-v4 .slick-current")
          .getAttribute("data-slick-index"),
        "1",
      );
      await page
        .locator(".banner-slider-v4 .slick-current")
        .getByRole("link", { name: /More Info/ })
        .click();
      await page.waitForURL("**/vehicle/volvo-xc90-recharge/");
      await page.locator("main h1").waitFor();
    },
  );
  await step(
    "Back restores the previous homepage scroll after lazy loading",
    async () => {
      await home();
      await page.locator(".cars-section-three").scrollIntoViewIfNeeded();
      const y = await page.evaluate(() => window.scrollY);
      await page
        .locator(".cars-section-three .tab-pane.active .slick-current .title a")
        .first()
        .click();
      await page.waitForURL("**/vehicle/mercedes-e-class/");
      await page.goBack();
      await page.locator(".reference-home[data-ready=true]").waitFor();
      await page.waitForFunction((y) => Math.abs(window.scrollY - y) < 3, y);
    },
  );
  await step(
    "Mobile source menu: nested Home choices, Escape and focus return",
    async () => {
      await page.setViewportSize({ width: 320, height: 844 });
      await home();
      const opener = page.getByRole("link", { name: "Open menu", exact: true });
      await opener.click();
      const dialog = page.getByRole("dialog", { name: "Main menu" });
      await dialog.waitFor();
      await page.screenshot({ path: path.join(out, `${engine}-menu.png`) });
      await dialog.getByRole("link", { name: "Home", exact: true }).click();
      await dialog.getByRole("link", { name: "Home 06", exact: true }).click();
      await page.waitForURL("**/home-6/");
      await page.locator(".reference-home[data-ready=true]").waitFor();
      await page.getByRole("link", { name: "Open menu", exact: true }).click();
      await page.keyboard.press("Escape");
      await page.getByRole("dialog").waitFor({ state: "detached" });
      assert.equal(
        await page
          .getByRole("link", { name: "Open menu", exact: true })
          .evaluate((el) => document.activeElement === el),
        true,
      );
    },
  );
  await step(
    "Newsletter is a local preview, with no fake send result",
    async () => {
      await home();
      const form = page.locator("footer form").first();
      await form.locator("input").fill("preview@example.com");
      await form.locator("button").click();
      const dialog = page.getByRole("dialog");
      await dialog.waitFor();
      assert.match(await dialog.innerText(), /No email or enquiry was sent/);
      await dialog.getByRole("button", { name: "Close", exact: true }).click();
    },
  );
  assert.deepEqual(failures, []);
  await fs.writeFile(
    path.join(out, `${engine}-flows.json`),
    JSON.stringify({ engine, passed, failures }, null, 2),
  );
} finally {
  await browser.close();
}
