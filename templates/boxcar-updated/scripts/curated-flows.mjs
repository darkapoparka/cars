import { chromium, webkit } from "playwright";
import assert from "node:assert/strict";
import fs from "node:fs/promises";
import path from "node:path";
import { createHash } from "node:crypto";

const base = process.env.BOXCAR_URL || "http://127.0.0.1:6455";
const engine = process.env.BOXCAR_BROWSER || "chromium";
const out = path.resolve("../../runtime/boxcar-updated-parity/curated");
const evidence = path.resolve("../../docs/boxcar-updated");
const catalog = JSON.parse(await fs.readFile("src/data/vehicles.json", "utf8"));
await fs.mkdir(out, { recursive: true });
const browser = await (engine === "webkit" ? webkit : chromium).launch(
  engine === "webkit" ? {} : { channel: "chrome" },
);
const page = await browser.newPage({ viewport: { width: 1440, height: 950 } });
const errors = [],
  passed = [],
  layouts = [],
  headers = [];
page.on("pageerror", (error) => errors.push(error.message));
page.on("response", (response) => {
  if (response.status() >= 400 && response.url().startsWith(base))
    errors.push(`${response.status()} ${response.url()}`);
});
const home = async (width = 1440) => {
  await page.setViewportSize({ width, height: width < 768 ? 844 : 950 });
  await page.goto(base + "/", { waitUntil: "networkidle" });
  await page.locator(".curated-home[data-ready=true]").waitFor();
};
const step = async (name, work) => {
  await work();
  passed.push(name);
  console.log("PASS", name);
};
const select = async (index, value) => {
  const menu = page.locator(".curated-banner .drop-menu").nth(index);
  await menu.locator(".select").click();
  await menu.getByRole("option", { name: value, exact: true }).click();
};
const assertStock = async (expected) => {
  await page.locator(".inventory-page").waitFor();
  assert.deepEqual(
    (
      await page
        .locator("main [data-vehicle-id]")
        .evaluateAll((nodes) => nodes.map((node) => node.dataset.vehicleId))
    ).sort(),
    expected.map((v) => v.id).sort(),
  );
};

try {
  await step("Original ten homepage sources remain intact", async () => {
    const receipt = JSON.parse(
      await fs.readFile(".template/port.json", "utf8"),
    );
    for (const item of receipt.pages) {
      const source = await fs.readFile(`src/reference/Home${item.home}.svelte`);
      assert.equal(
        createHash("sha256").update(source).digest("hex"),
        item.svelteSHA256,
      );
    }
  });
  await step("Curated layout at 1440, 1024, 768, 390 and 320px", async () => {
    for (const width of [1440, 1024, 768, 390, 320]) {
      await home(width);
      // Exercise lazy sections as a visitor scrolls, after the page is already ready.
      for (const section of [".curated-stock", ".curated-journal"]) {
        await page.locator(section).scrollIntoViewIfNeeded();
        await page.waitForFunction(
          (selector) =>
            Array.from(document.querySelectorAll(`${selector} img`)).every(
              (img) => img.complete && img.naturalWidth > 0,
            ),
          section,
        );
      }
      await page.locator("header").scrollIntoViewIfNeeded();
      const state = await page.evaluate(() => {
        const root = document.querySelector(".curated-home");
        const rect = (el) => {
          const r = el.getBoundingClientRect();
          return {
            left: r.left,
            right: r.right,
            width: r.width,
            height: r.height,
          };
        };
        return {
          client: document.documentElement.clientWidth,
          scroll: document.documentElement.scrollWidth,
          clones: root.querySelectorAll(".curated-stock .slick-cloned").length,
          images: Array.from(root.querySelectorAll("img"))
            .filter((image) => !image.complete || !image.naturalWidth)
            .map((image) => image.src),
          form: rect(root.querySelector(".curated-banner form")),
          controls: Array.from(
            root.querySelectorAll(
              ".curated-banner .select,.curated-banner .form-submit button",
            ),
          ).map(rect),
          defaultLabels: Array.from(
            root.querySelectorAll(".curated-banner .select > span"),
          ).map((el) => ({
            text: el.textContent,
            height: el.getBoundingClientRect().height,
          })),
          badges: Array.from(
            root.querySelectorAll(".curated-journal .date"),
          ).map((el) => ({
            ...rect(el),
            scroll: el.scrollWidth,
            client: el.clientWidth,
            text: el.textContent,
          })),
          footer: Array.from(document.querySelectorAll(".dealer-footer p")).map(
            (el) => ({
              text: el.textContent,
              color: getComputedStyle(el).color,
            }),
          ),
          headings: Array.from(
            root.querySelectorAll(
              "section > .boxcar-container > .boxcar-title",
            ),
          ).map((el) => {
            const r = el.getBoundingClientRect();
            return Math.abs(
              r.left + r.width / 2 - document.documentElement.clientWidth / 2,
            );
          }),
        };
      });
      assert.ok(
        state.scroll <= state.client + 1,
        `${width}px horizontal overflow`,
      );
      assert.deepEqual(state.images, [], `${width}px failed images`);
      assert.equal(
        state.clones,
        0,
        `${width}px dealer stock contains cloned Svelte buttons`,
      );
      assert.ok(state.form.left >= 0 && state.form.right <= state.client + 1);
      for (const control of state.controls) {
        assert.ok(
          control.width >= 100 && control.height >= 44,
          `${width}px search control is too small`,
        );
        assert.ok(control.left >= 0 && control.right <= state.client + 1);
      }
      for (const label of state.defaultLabels)
        assert.ok(
          label.height <= 23,
          `${width}px default filter wraps: ${label.text}`,
        );
      for (const badge of state.badges)
        assert.ok(
          badge.scroll <= badge.client + 1 && badge.height >= 22,
          `${width}px broken badge: ${badge.text}`,
        );
      for (const line of state.footer)
        assert.equal(
          line.color,
          "rgb(255, 255, 255)",
          `${width}px blue footer text must be white`,
        );
      for (const distance of state.headings)
        assert.ok(distance <= 2, `${width}px heading is not centered`);
      assert.equal(
        await page
          .locator(
            ".curated-stock .slick-arrow,.curated-stock .slick-initialized",
          )
          .count(),
        0,
      );
      const stock = await page
        .locator("#stock-all .car-block-ten")
        .evaluateAll((nodes) =>
          nodes
            .filter((el) => el.getBoundingClientRect().width > 0)
            .map((el) => {
              const card = el.getBoundingClientRect();
              const price = el
                .querySelector(".btn-box small")
                .getBoundingClientRect();
              const detail = el
                .querySelector(".details")
                .getBoundingClientRect();
              return {
                top: card.top,
                bottom: card.bottom,
                width: card.width,
                left: card.left,
                right: card.right,
                footerFits:
                  price.left >= card.left &&
                  detail.right <= card.right &&
                  price.right + 4 <= detail.left,
              };
            }),
        );
      assert.equal(
        stock.length,
        width <= 575 ? 4 : 8,
        `${width}px visible stock count`,
      );
      const columns =
        width >= 1200 ? 4 : width >= 992 ? 3 : width >= 576 ? 2 : 1;
      const firstRow = stock.filter(
        (card) => Math.abs(card.top - stock[0].top) < 2,
      );
      assert.equal(firstRow.length, columns, `${width}px stock columns`);
      if (width === 1440)
        assert.equal(
          new Set(stock.map((card) => Math.round(card.top))).size,
          2,
          "Desktop stock must have two rows",
        );
      for (const card of stock)
        assert.ok(card.footerFits, `${width}px price and details collide`);
      assert.ok(
        Math.max(...firstRow.map((card) => card.bottom)) -
          Math.min(...firstRow.map((card) => card.bottom)) <=
          1,
        `${width}px stock row is uneven`,
      );
      const browse = await page
        .locator(".curated-stock-more a")
        .evaluate((el) => {
          const r = el.getBoundingClientRect(),
            style = getComputedStyle(el);
          return {
            height: r.height,
            top: r.top,
            center: r.left + r.width / 2,
            background: style.backgroundColor,
            color: style.color,
            icons: el.querySelectorAll("svg,i").length,
          };
        });
      assert.ok(
        browse.height >= 44 && Math.abs(browse.center - state.client / 2) < 2,
        `${width}px stock CTA alignment`,
      );
      assert.ok(
        browse.top >= Math.max(...stock.map((card) => card.bottom)) + 24,
        `${width}px stock CTA touches cards`,
      );
      assert.equal(browse.icons, 0, "Stock CTA should have a simple label");
      assert.equal(browse.color, "rgb(255, 255, 255)");
      assert.notEqual(browse.background, "rgba(0, 0, 0, 0)");
      assert.equal(await page.locator("h1").count(), 1);
      if (width >= 1024)
        assert.equal(
          await page
            .locator("header nav")
            .getByRole("link", { name: "Cars", exact: true })
            .isVisible(),
          true,
        );
      layouts.push({
        width,
        document: state.scroll,
        controls: state.controls,
        images: "loaded",
        footer: "readable",
        badges: "fit",
      });
      await page.screenshot({
        path: path.join(out, `${engine}-${width}.png`),
        fullPage: true,
      });
      if (width === 320)
        await page.screenshot({
          path: path.join(out, `${engine}-320-top.png`),
        });
      if (engine === "chromium" && [1440, 390].includes(width))
        await page.screenshot({
          path: path.join(
            evidence,
            width === 1440 ? "curated-desktop.png" : "curated-mobile.png",
          ),
        });
      if (engine === "chromium" && width === 1440) {
        await page.locator(".curated-stock h2").click();
        await page
          .locator(".curated-stock")
          .screenshot({ path: path.join(evidence, "curated-stock.png") });
      }
    }
  });
  await step(
    "Long selected filters stay within their rows at 390 and 320px",
    async () => {
      const combinations = [
        ...new Map(
          catalog.map((vehicle) => [
            `${vehicle.make}/${vehicle.model}`,
            { make: vehicle.make, model: vehicle.model },
          ]),
        ).values(),
      ];
      for (const width of [390, 320]) {
        await home(width);
        await select(0, "Used Cars");
        await select(3, "$100,000");
        for (const vehicle of combinations) {
          await select(1, vehicle.make);
          await select(2, vehicle.model);
          const filters = await page
            .locator(".curated-banner .select")
            .evaluateAll((nodes) =>
              nodes.map((control) => {
                const label = control.querySelector("span");
                const arrow = control.querySelector("svg");
                const box = control
                  .closest(".form_boxes")
                  .getBoundingClientRect();
                const fits = (node) => {
                  const rect = node.getBoundingClientRect();
                  return (
                    rect.top >= box.top - 1 &&
                    rect.bottom <= box.bottom + 1 &&
                    rect.left >= box.left - 1 &&
                    rect.right <= box.right + 1
                  );
                };
                return {
                  text: label.textContent,
                  fits:
                    fits(label) &&
                    fits(arrow) &&
                    label.scrollHeight <= label.clientHeight + 1,
                };
              }),
            );
          for (const filter of filters)
            assert.ok(
              filter.fits,
              `${width}px selected filter spills into another field: ${filter.text}`,
            );
        }
        await page.screenshot({
          path: path.join(out, `${engine}-${width}-selected.png`),
        });
      }
    },
  );
  await step(
    "Search conditions, make/model resets, price and inventory URLs",
    async () => {
      await home();
      await select(1, "Audi");
      await select(2, "A8");
      await select(1, "BMW");
      assert.equal(
        await page
          .locator(".curated-banner .drop-menu")
          .nth(2)
          .locator(".select span")
          .innerText(),
        "All Models",
      );
      await select(1, "All Makes");
      await page
        .locator(".curated-banner .drop-menu")
        .nth(2)
        .locator(".select")
        .click();
      assert.equal(
        await page
          .getByRole("option", { name: "Qashqai", exact: true })
          .isVisible(),
        true,
      );
      await page
        .getByRole("option", { name: "All Models", exact: true })
        .click();
      await select(1, "Audi");
      await select(2, "A8");
      await select(0, "Used Cars");
      await select(3, "$75,000");
      await page
        .getByRole("button", { name: "Search cars", exact: true })
        .click();
      await page.waitForURL("**/inventory/**");
      const query = new URL(page.url()).searchParams;
      assert.equal(query.get("make"), "Audi");
      assert.equal(query.get("model"), "A8");
      assert.equal(query.get("condition"), "Used");
      assert.equal(query.get("max"), "75000");
      await assertStock(
        catalog.filter(
          (v) =>
            v.make === "Audi" &&
            v.model === "A8" &&
            v.condition === "Used" &&
            v.price <= 75000,
        ),
      );
      await home(320);
      await select(0, "New Cars");
      await select(0, "All Cars");
      await select(3, "$25,000");
      await select(3, "Any Price");
      await page
        .getByRole("button", { name: "Search cars", exact: true })
        .click();
      await page.waitForURL("**/inventory/");
      assert.equal(new URL(page.url()).search, "");
      assert.equal(await page.locator("main [data-vehicle-id]").count(), 9);
    },
  );
  await step("Keyboard dropdowns, Escape and outside dismissal", async () => {
    await home(320);
    const menu = page.locator(".curated-banner .drop-menu").nth(1),
      control = menu.locator(".select");
    await control.press("ArrowDown");
    assert.equal(await control.getAttribute("aria-expanded"), "true");
    assert.equal(
      await menu
        .getByRole("option", { name: "All Makes", exact: true })
        .evaluate((el) => el === document.activeElement),
      true,
    );
    await menu
      .getByRole("option", { name: "All Makes", exact: true })
      .press("ArrowDown");
    await menu
      .getByRole("option", { name: "Audi", exact: true })
      .press("Enter");
    assert.equal(await control.getAttribute("aria-label"), "Make: Audi");
    assert.equal(await control.getAttribute("aria-expanded"), "false");
    await control.press("ArrowUp");
    assert.equal(
      await menu
        .getByRole("option")
        .last()
        .evaluate((el) => el === document.activeElement),
      true,
    );
    await menu.getByRole("option").last().press("Escape");
    assert.equal(
      await control.evaluate((el) => el === document.activeElement),
      true,
    );
    await control.click();
    await page
      .getByRole("heading", { name: "Find Your Perfect Car", exact: true })
      .click();
    assert.equal(await control.getAttribute("aria-expanded"), "false");
  });
  await step(
    "Stock tabs, grid, saved state and detail/Back context",
    async () => {
      await home();
      const used = page.getByRole("tab", { name: "Used cars", exact: true });
      await used.click();
      const shelf = page.locator("#stock-used");
      assert.equal(await used.getAttribute("aria-selected"), "true");
      const ids = await shelf
        .locator(".car-block-ten")
        .evaluateAll((nodes) => nodes.map((node) => node.dataset.vehicleId));
      assert.ok(
        ids.every(
          (id) => catalog.find((v) => v.id === id)?.condition === "Used",
        ),
      );
      await used.press("ArrowLeft");
      assert.equal(
        await page
          .getByRole("tab", { name: "New cars", exact: true })
          .getAttribute("aria-selected"),
        "true",
      );
      // Wait for the selected source tab's fade before interacting with its grid.
      await page.waitForFunction(() => {
        const panel = document.querySelector("#stock-new");
        const card = panel.querySelector(".car-block-ten");
        const list = panel.querySelector(".curated-stock-grid");
        const bounds = card?.getBoundingClientRect();
        const shelf = list?.getBoundingClientRect();
        return (
          getComputedStyle(panel).opacity === "1" &&
          bounds?.width > 0 &&
          bounds.left >= shelf.left - 1 &&
          bounds.right <= shelf.right + 1
        );
      });
      const visibleCard = page.locator("#stock-new .car-block-ten").first();
      const id = await visibleCard.getAttribute("data-vehicle-id"),
        vehicle = catalog.find((v) => v.id === id);
      // Keep assertions on the chosen vehicle after scrolling or navigation.
      const card = page.locator(
        `#stock-new .car-block-ten[data-vehicle-id="${id}"]`,
      );
      const save = card.getByRole("button", {
        name: `Save ${vehicle.title}`,
        exact: true,
      });
      await save.click();
      assert.equal(
        await card
          .getByRole("button", { name: `Unsave ${vehicle.title}`, exact: true })
          .getAttribute("aria-pressed"),
        "true",
      );
      assert.ok(
        await page.evaluate(
          (id) =>
            JSON.parse(
              localStorage.getItem("boxcar-updated-favorites"),
            ).includes(id),
          id,
        ),
      );
      const savedButton = card.getByRole("button", {
        name: `Unsave ${vehicle.title}`,
        exact: true,
      });
      await savedButton.press("Space");
      const unsavedButton = card.getByRole("button", {
        name: `Save ${vehicle.title}`,
        exact: true,
      });
      assert.equal(await unsavedButton.getAttribute("aria-pressed"), "false");
      await unsavedButton.press("Space");
      assert.equal(await savedButton.getAttribute("aria-pressed"), "true");
      await card
        .getByRole("link", { name: "View details", exact: true })
        .scrollIntoViewIfNeeded();
      const scroll = await page.evaluate(() => scrollY);
      await card
        .getByRole("link", { name: "View details", exact: true })
        .click();
      await page.waitForURL(`**/vehicle/${vehicle.slug}/**`);
      assert.equal(new URL(page.url()).searchParams.get("return"), "/");
      assert.equal(await page.locator("main h1").innerText(), vehicle.title);
      assert.equal(
        await page
          .locator("header")
          .getByText("Home designs", { exact: true })
          .count(),
        0,
      );
      await page.goBack();
      await page.locator(".curated-home[data-ready=true]").waitFor();
      await page.waitForFunction(
        (y) => Math.abs(window.scrollY - y) < 50,
        scroll,
      );
      assert.ok(Math.abs((await page.evaluate(() => scrollY)) - scroll) < 50);
      await page
        .locator("header")
        .getByRole("link", { name: "Saved cars", exact: true })
        .click();
      await page.waitForURL("**/favorites/");
      await assertStock([vehicle]);
    },
  );
  await step(
    "Search is centered in the hero below its headline, with visible dropdowns",
    async () => {
      for (const width of [1440, 1024, 768, 390, 320]) {
        await home(width);
        assert.equal(await page.locator("header .layout-search").count(), 0);
        assert.equal(await page.locator(".curated-banner form").count(), 1);
        const appearance = await page.evaluate(() => {
          const luminance = (color) => {
            const channels = color
              .match(/[\d.]+/g)
              .slice(0, 3)
              .map(Number)
              .map((n) => {
                const value = n / 255;
                return value <= 0.04045
                  ? value / 12.92
                  : ((value + 0.055) / 1.055) ** 2.4;
              });
            return (
              channels[0] * 0.2126 + channels[1] * 0.7152 + channels[2] * 0.0722
            );
          };
          const contrast = (element) => {
            const style = getComputedStyle(element);
            const background = luminance(style.backgroundColor);
            const text = luminance(style.color);
            return (
              (Math.max(text, background) + 0.05) /
              (Math.min(text, background) + 0.05)
            );
          };
          const root = document.querySelector(".curated-home");
          const headline = root.querySelector("h1").getBoundingClientRect();
          const form = root.querySelector(".curated-banner form");
          const bounds = form.getBoundingClientRect();
          const photo = root
            .querySelector(".curated-banner .banner-slide > img")
            .getBoundingClientRect();
          const contact = document.querySelector("header .dealer-contact");
          const navigation = document
            .querySelector("header .dealer-navigation")
            .getBoundingClientRect();
          return {
            gap: bounds.top - headline.bottom,
            centered: Math.abs(
              (bounds.left + bounds.right) / 2 -
                document.documentElement.clientWidth / 2,
            ),
            verticallyCentered: Math.abs(
              (bounds.top + bounds.bottom) / 2 - (photo.top + photo.bottom) / 2,
            ),
            background: getComputedStyle(form).backgroundColor,
            searchContrast: contrast(form.querySelector(".form-submit button")),
            contactContrast: contact.getBoundingClientRect().width
              ? contrast(contact)
              : null,
            headerHeight: document
              .querySelector("header")
              .getBoundingClientRect().height,
            navigationCentered: navigation.width
              ? Math.abs(
                  (navigation.left + navigation.right) / 2 -
                    document.documentElement.clientWidth / 2,
                )
              : null,
          };
        });
        assert.ok(
          appearance.gap >= 20 && appearance.gap <= 40,
          `${width}px search is disconnected from the headline`,
        );
        assert.ok(
          appearance.centered <= 2,
          `${width}px search is not centered`,
        );
        if (width >= 768)
          assert.ok(
            appearance.verticallyCentered <= 2,
            `${width}px hero search sits above the photograph's center`,
          );
        assert.equal(appearance.background, "rgb(255, 255, 255)");
        assert.ok(
          appearance.searchContrast >= 4.5,
          `${width}px unreadable search button`,
        );
        if (appearance.contactContrast !== null)
          assert.ok(
            appearance.contactContrast >= 4.5,
            `${width}px unreadable header action`,
          );
        assert.ok(
          appearance.headerHeight <= 104,
          `${width}px header is too tall`,
        );
        if (width >= 1024)
          assert.ok(
            appearance.navigationCentered <= 2,
            `${width}px header navigation is not centered`,
          );
        for (let index = 0; index < 4; index++) {
          const menu = page.locator(".curated-banner .drop-menu").nth(index);
          await menu.locator(".select").click();
          const popup = menu.locator(".dropdown");
          await popup.waitFor({ state: "visible" });
          const visible = await popup.evaluate((el) => {
            const style = getComputedStyle(el),
              r = el.getBoundingClientRect();
            const first = [...el.children].find((item) => !item.hidden);
            const item = first.getBoundingClientRect();
            const hit = document.elementFromPoint(
              item.left + item.width / 2,
              Math.max(0, item.top) +
                Math.min(item.height, innerHeight - item.top) / 2,
            );
            return {
              background: style.backgroundColor,
              left: r.left,
              right: r.right,
              hit: first.contains(hit),
            };
          });
          assert.equal(visible.background, "rgb(255, 255, 255)");
          assert.ok(
            visible.left >= 0 && visible.right <= width + 1,
            `${width}px dropdown clips outside the page`,
          );
          assert.equal(visible.hit, true, `${width}px dropdown is covered`);
          if (engine === "chromium" && width === 1440 && index === 1)
            await page.screenshot({
              path: path.join(evidence, "curated-hero-search.png"),
            });
          await page
            .getByRole("heading", {
              name: "Find Your Perfect Car",
              exact: true,
            })
            .click();
          assert.equal(
            await menu.locator(".select").getAttribute("aria-expanded"),
            "false",
          );
        }
      }
    },
  );
  await step(
    "Home shows stock directly after the hero and footer links filter inventory",
    async () => {
      for (const width of [1440, 320]) {
        for (const condition of ["New", "Used"]) {
          await home(width);
          assert.equal(
            await page.locator(".curated-types, .curated-brands").count(),
            0,
          );
          assert.equal(
            await page.locator(".curated-banner + .curated-stock").count(),
            1,
          );
          const choice = page.locator(".dealer-footer").getByRole("link", {
            name: `${condition} cars`,
            exact: true,
          });
          await choice.click();
          await page.waitForURL(`**/inventory/?condition=${condition}`);
          const matches = catalog.filter((v) => v.condition === condition);
          await assertStock(matches.slice(0, 9));
          if (matches.length > 9) {
            await page
              .getByRole("button", { name: "Next page", exact: true })
              .click();
            await page.waitForURL("**&page=2");
            await assertStock(matches.slice(9));
          }
        }
      }
    },
  );
  await step(
    "Aligned button icons and four source service cards at desktop, tablet and phone widths",
    async () => {
      for (const width of [1440, 1024, 768, 390, 320, 304]) {
        await home(width);
        const geometry = await page.evaluate(() => {
          const rect = (el) => {
            const r = el.getBoundingClientRect();
            return {
              left: r.left,
              right: r.right,
              top: r.top,
              bottom: r.bottom,
              width: r.width,
              height: r.height,
              cx: r.x + r.width / 2,
              cy: r.y + r.height / 2,
            };
          };
          const buttons = Array.from(
            document.querySelectorAll(
              ".curated-banner .form-submit button, #stock-all .car-block-ten .details, .curated-services .read-more, .curated-next-car .btn",
            ),
          )
            .filter((el) => el.getBoundingClientRect().width > 0)
            .map((el) => ({
              name: el.textContent.trim(),
              button: rect(el),
              icon: rect(el.querySelector("svg")),
              label: rect(el.querySelector("span")),
            }));
          const cards = Array.from(
            document.querySelectorAll(".curated-service-card"),
          ).map((el) => ({
            card: rect(el),
            icon: rect(el.querySelector(".hover-img")),
            title: rect(el.querySelector(".title")),
            button: rect(el.querySelector(".read-more")),
          }));
          const banner = document.querySelector(".curated-next-car");
          return {
            client: document.documentElement.clientWidth,
            scroll: document.documentElement.scrollWidth,
            buttons,
            cards,
            banner: rect(banner),
            bannerTitle: rect(banner.querySelector("h2")),
            oldReviewCards: document.querySelectorAll(
              ".curated-home .testimonial-block-four",
            ).length,
          };
        });
        assert.ok(
          geometry.scroll <= geometry.client + 1,
          `${width}px document overflow`,
        );
        for (const { name, button, icon, label } of geometry.buttons) {
          assert.ok(button.height >= 44, `${width}px ${name} button too small`);
          assert.ok(
            icon.width >= 20 && icon.height >= 20,
            `${width}px ${name} icon too small`,
          );
          assert.ok(
            Math.abs(icon.cy - label.cy) <= 1,
            `${width}px ${name} icon misaligned`,
          );
          assert.ok(
            icon.left >= button.left - 1 && icon.right <= button.right + 1,
            `${width}px ${name} icon outside button`,
          );
          assert.ok(
            label.left >= button.left - 1 && label.right <= button.right + 1,
            `${width}px ${name} label outside button`,
          );
          assert.ok(
            button.right <= geometry.client + 1 && button.left >= 0,
            `${width}px ${name} outside viewport`,
          );
        }
        assert.equal(geometry.cards.length, 4);
        const firstRow = geometry.cards.filter(
          ({ card }) => Math.abs(card.top - geometry.cards[0].card.top) < 2,
        );
        assert.equal(
          firstRow.length,
          width >= 1200 ? 4 : width >= 576 ? 2 : 1,
          `${width}px service grid`,
        );
        for (const { card, icon, title, button } of geometry.cards) {
          assert.ok(
            Math.abs(card.cx - icon.cx) <= 1 &&
              Math.abs(card.cx - title.cx) <= 1 &&
              Math.abs(card.cx - button.cx) <= 1,
            `${width}px service content is off center`,
          );
          assert.ok(
            icon.bottom + 20 <= title.top,
            `${width}px service icon touches title`,
          );
          assert.ok(
            button.left >= card.left && button.right <= card.right,
            `${width}px service button escapes card`,
          );
        }
        assert.ok(
          Math.max(...firstRow.map(({ button }) => button.bottom)) -
            Math.min(...firstRow.map(({ button }) => button.bottom)) <=
            1,
          `${width}px service CTA row misaligned`,
        );
        assert.equal(geometry.oldReviewCards, 0);
        assert.ok(
          Math.abs(geometry.banner.cx - geometry.bannerTitle.cx) <= 1,
          `${width}px next-car title misaligned`,
        );
        assert.ok(
          geometry.banner.left >= 0 &&
            geometry.banner.right <= geometry.client + 1,
        );
        if (engine === "chromium" && width === 1440) {
          await page
            .locator(".curated-services")
            .screenshot({ path: path.join(evidence, "curated-services.png") });
          await page
            .locator(".curated-next-car")
            .screenshot({ path: path.join(evidence, "curated-next-car.png") });
        }
      }
    },
  );
  await step(
    "Service cards and showroom CTA open their intended destinations",
    async () => {
      for (const width of [1440, 320]) {
        for (const [selector, name, route] of [
          [".curated-stock-more", "View all cars", "/inventory/"],
          [".curated-services", "Explore cars", "/inventory/"],
          [".curated-services", "Get in touch", "/contact/?intent=sell"],
          [".curated-services", "Compare cars", "/compare/"],
          [".curated-services", "Calculate payments", "/calculator/"],
          [
            ".curated-next-car",
            "Arrange a viewing",
            "/contact/?intent=viewing",
          ],
        ]) {
          await home(width);
          await page
            .locator(selector)
            .getByRole("link", { name, exact: true })
            .click();
          await page.waitForURL(base + route);
          assert.equal(await page.locator("main h1").count(), 1);
          if (route.includes("intent=")) {
            assert.equal(
              await page
                .getByRole("form", { name: "Enquiry form" })
                .isVisible(),
              true,
            );
            if (route.includes("sell")) {
              assert.equal(
                await page.locator("main h1").innerText(),
                "Sell Your Car",
              );
              assert.equal(
                await page.getByLabel("Car make and model").isVisible(),
                true,
              );
            } else {
              assert.equal(
                await page.getByLabel("Your message").isVisible(),
                true,
              );
            }
          }
        }
      }
    },
  );
  await step("Mobile dealer navigation and inner routes", async () => {
    await home(320);
    await page.getByRole("button", { name: "Open menu", exact: true }).click();
    const menu = page.getByRole("dialog", { name: "Explore Boxcars" });
    await menu.waitFor();
    assert.equal(
      await menu.getByRole("link", { name: "Home 01", exact: true }).count(),
      0,
    );
    await menu.getByRole("link", { name: "Cars", exact: true }).click();
    await page.waitForURL("**/inventory/");
    await page.getByRole("button", { name: "Open menu", exact: true }).click();
    const drawer = page.getByRole("dialog", { name: "Explore Boxcars" });
    await drawer.waitFor();
    assert.equal(
      await drawer.getByText("Home designs", { exact: true }).count(),
      0,
    );
    await drawer.getByRole("link", { name: "Home", exact: true }).click();
    await page.waitForURL(base + "/");
    await page.locator(".curated-home[data-ready=true]").waitFor();
    for (const width of [1440, 320]) {
      await page.setViewportSize({ width, height: 950 });
      for (const route of [
        "/about/",
        "/contact/",
        "/blog/choosing-your-next-car/",
      ]) {
        await page.goto(base + route, { waitUntil: "networkidle" });
        assert.equal(await page.locator("main h1").count(), 1);
        assert.ok(
          await page.evaluate(
            () =>
              document.documentElement.scrollWidth <=
              document.documentElement.clientWidth + 1,
          ),
          `${route} ${width}px overflow`,
        );
        assert.equal(
          await page.locator('footer [aria-label="Homepage designs"]').count(),
          0,
        );
      }
    }
  });
  await step(
    "One consistent dealer header across direct loads and navigation",
    async () => {
      const appearance = async () => {
        await page.evaluate(() => document.fonts.ready);
        assert.equal(await page.locator("header").count(), 1);
        assert.equal(await page.locator("header.dealer-header").count(), 1);
        return page.locator("header").evaluate((header) => {
          const rect = (element) => {
            const box = element.getBoundingClientRect();
            return [box.x, box.y, box.width, box.height].map(
              (value) => Math.round(value * 100) / 100,
            );
          };
          const navigation = header.querySelector(".dealer-navigation");
          const contact = header.querySelector(".dealer-contact");
          const logo = header.querySelector("img");
          const style = getComputedStyle(header);
          const contactStyle = getComputedStyle(contact);
          return {
            header: rect(header),
            logo: rect(logo),
            logoSource: logo.getAttribute("src"),
            navigation: rect(navigation),
            links: Array.from(navigation.querySelectorAll("a"), (link) => [
              link.textContent.trim(),
              link.getAttribute("href"),
            ]),
            saved: rect(header.querySelector(".dealer-saved")),
            contact: rect(contact),
            contactLabel: contact.textContent.trim(),
            contactStyle: [
              contactStyle.color,
              contactStyle.backgroundColor,
              contactStyle.borderRadius,
              contactStyle.fontSize,
              contactStyle.fontWeight,
            ],
            menu: rect(header.querySelector(".dealer-menu-trigger")),
            font: [style.fontFamily, style.fontSize, style.lineHeight],
          };
        });
      };
      const routes = [
        ["Cars", "/inventory/"],
        ["About us", "/about/"],
        ["Contact", "/contact/"],
        ["Home", "/"],
      ];
      for (const width of [1440, 1024, 768, 390, 320]) {
        await home(width);
        const expected = await appearance();
        assert.deepEqual(expected.links, [
          ["Home", "/"],
          ["Cars", "/inventory/"],
          ["About us", "/about/"],
          ["Contact", "/contact/"],
        ]);
        assert.equal(expected.contactLabel, "Contact us");
        assert.equal(expected.header[3], width < 768 ? 76 : 90);
        if (width >= 992) {
          assert.ok(
            Math.abs(
              expected.navigation[0] +
                expected.navigation[2] / 2 -
                expected.header[2] / 2,
            ) <= 1,
          );
          assert.equal(expected.menu[2], 0);
        } else {
          assert.equal(expected.navigation[2], 0);
          assert.ok(expected.menu[2] >= 44 && expected.menu[3] >= 44);
          await page
            .getByRole("button", { name: "Open menu", exact: true })
            .click();
          const drawer = page.getByRole("dialog", { name: "Explore Boxcars" });
          await drawer.waitFor();
          await drawer.press("Escape");
          await drawer.waitFor({ state: "hidden" });
          assert.equal(
            await page
              .getByRole("button", { name: "Open menu", exact: true })
              .evaluate((button) => button === document.activeElement),
            true,
          );
        }
        for (const [label, destination] of routes) {
          if (width >= 992) {
            await page
              .locator("header nav")
              .getByRole("link", { name: label, exact: true })
              .click();
          } else {
            await page
              .getByRole("button", { name: "Open menu", exact: true })
              .click();
            await page
              .getByRole("dialog", { name: "Explore Boxcars" })
              .getByRole("link", { name: label, exact: true })
              .click();
          }
          await page.waitForURL(base + destination);
          if (destination === "/")
            await page.locator(".curated-home[data-ready=true]").waitFor();
          else await page.locator("main h1").waitFor();
          assert.deepEqual(
            await appearance(),
            expected,
            `${width}px header changed after navigating to ${destination}`,
          );
          assert.equal(
            (
              await page.locator('header [aria-current="page"]').textContent()
            ).trim(),
            label,
          );
          assert.equal(await page.locator("dialog[open]").count(), 0);
          headers.push({
            width,
            destination,
            load: "navigation",
            layout: "matches home",
          });
          if (
            engine === "chromium" &&
            destination === "/contact/" &&
            [1440, 320].includes(width)
          ) {
            await page.screenshot({
              path: path.join(
                evidence,
                width === 1440
                  ? "curated-contact-header.png"
                  : "curated-mobile-header.png",
              ),
            });
          }
        }
        if ([1440, 320].includes(width)) {
          for (const destination of [
            "/inventory/",
            "/about/",
            "/contact/",
            "/favorites/",
            "/compare/",
            "/calculator/",
            "/blog/",
            "/blog/choosing-your-next-car/",
            "/faq/",
            "/terms/",
            `/vehicle/${catalog[0].slug}/`,
          ]) {
            await page.goto(base + destination, { waitUntil: "networkidle" });
            assert.deepEqual(
              await appearance(),
              expected,
              `${width}px direct-load header differs on ${destination}`,
            );
            headers.push({
              width,
              destination,
              load: "direct",
              layout: "matches home",
            });
          }
        }
      }
    },
  );
  assert.deepEqual(errors, []);
  await fs.writeFile(
    path.join(out, `${engine}-results.json`),
    JSON.stringify(
      {
        engine,
        checkedAt: new Date().toISOString(),
        passed,
        layouts,
        headers,
        errors,
      },
      null,
      2,
    ) + "\n",
  );
  console.log(
    `PASS ${passed.length} curated journeys; no browser or asset errors`,
  );
} catch (error) {
  await page.screenshot({ path: path.join(out, `${engine}-failed.png`) });
  await fs.writeFile(
    path.join(out, `${engine}-failed.json`),
    JSON.stringify(
      { passed, errors, url: page.url(), error: String(error) },
      null,
      2,
    ),
  );
  throw error;
} finally {
  await browser.close();
}
