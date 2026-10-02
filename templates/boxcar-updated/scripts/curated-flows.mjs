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
  layouts = [];
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
      for (const section of [".curated-brands", ".curated-journal"]) {
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
          badges: Array.from(
            root.querySelectorAll(".curated-journal .date"),
          ).map((el) => ({
            ...rect(el),
            scroll: el.scrollWidth,
            client: el.clientWidth,
            text: el.textContent,
          })),
          footer: Array.from(root.querySelectorAll("footer .text")).map(
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
      for (const badge of state.badges)
        assert.ok(
          badge.scroll <= badge.client + 1 && badge.height >= 22,
          `${width}px broken badge: ${badge.text}`,
        );
      for (const line of state.footer)
        assert.notEqual(
          line.color,
          "rgb(255, 255, 255)",
          `${width}px invisible footer text`,
        );
      for (const distance of state.headings)
        assert.ok(distance <= 2, `${width}px heading is not centered`);
      const stockControls = await page
        .locator("#stock-all .slick-arrow,.curated-stock-more a")
        .evaluateAll((nodes) =>
          nodes.map((el) => {
            const rect = el.getBoundingClientRect();
            return {
              text: el.textContent.trim(),
              left: rect.left,
              right: rect.right,
              top: rect.top,
              bottom: rect.bottom,
              height: rect.height,
            };
          }),
        );
      assert.equal(stockControls.length, 3);
      const [previous, next, browse] = stockControls;
      for (const arrow of [previous, next]) {
        assert.ok(
          arrow.height >= 44,
          `${width}px carousel control is too short`,
        );
        assert.ok(
          arrow.bottom + 12 <= browse.top,
          `${width}px carousel overlaps View all cars`,
        );
      }
      assert.ok(
        previous.right + 12 <= next.left,
        `${width}px carousel arrows overlap`,
      );
      assert.ok(
        Math.abs((previous.left + next.right) / 2 - state.client / 2) < 2,
        `${width}px carousel controls are not centered`,
      );
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
                const arrow = control.querySelector("i");
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
        "Any Models",
      );
      await select(1, "Any Makes");
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
        .getByRole("option", { name: "Any Models", exact: true })
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
        .getByRole("option", { name: "Any Makes", exact: true })
        .evaluate((el) => el === document.activeElement),
      true,
    );
    await menu
      .getByRole("option", { name: "Any Makes", exact: true })
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
    "Stock tabs, slider, saved state and detail/Back context",
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
      const before = await shelf
        .locator(".slick-active")
        .first()
        .getAttribute("data-vehicle-id");
      await shelf.locator(".slick-next").click();
      await page.waitForFunction(
        (previous) =>
          document
            .querySelector("#stock-used .slick-active")
            ?.getAttribute("data-vehicle-id") !== previous,
        before,
      );
      await used.press("ArrowLeft");
      assert.equal(
        await page
          .getByRole("tab", { name: "New cars", exact: true })
          .getAttribute("aria-selected"),
        "true",
      );
      // The newly selected stock panel fades in while Slick lays out its cards.
      // Click the save control after that visible transition has completed.
      await page.waitForFunction(() => {
        const panel = document.querySelector("#stock-new");
        const card = panel.querySelector(".car-block-ten.slick-active");
        const list = panel.querySelector(".slick-list");
        const bounds = card?.getBoundingClientRect();
        const shelf = list?.getBoundingClientRect();
        return (
          getComputedStyle(panel).opacity === "1" &&
          bounds?.width > 0 &&
          bounds.left >= shelf.left - 1 &&
          bounds.right <= shelf.right + 1
        );
      });
      const visibleCard = page
        .locator("#stock-new .car-block-ten.slick-active")
        .first();
      const id = await visibleCard.getAttribute("data-vehicle-id"),
        vehicle = catalog.find((v) => v.id === id);
      // Keep the assertions on the chosen car if focus or scrolling changes the visible slide.
      const card = page.locator(
        `#stock-new .car-block-ten:not(.slick-cloned)[data-vehicle-id="${id}"]`,
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
      assert.equal(
        await card.evaluate((el) => el.closest(".slick-list").scrollLeft),
        0,
      );
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
    "Header search stays visible and readable before and during use at 1440px",
    async () => {
      await home();
      const input = page.getByRole("combobox", {
        name: "Search cars",
        exact: true,
      });
      const appearance = () =>
        input.evaluate((el) => {
          const style = getComputedStyle(el);
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
          const background = luminance(style.backgroundColor);
          const contrast = (color) => {
            const text = luminance(color);
            return (
              (Math.max(text, background) + 0.05) /
              (Math.min(text, background) + 0.05)
            );
          };
          return {
            width: el.getBoundingClientRect().width,
            height: el.getBoundingClientRect().height,
            border: Number.parseFloat(style.borderTopWidth),
            textContrast: contrast(style.color),
            placeholderContrast: contrast(
              getComputedStyle(el, "::placeholder").color,
            ),
          };
        });
      const idle = await appearance();
      assert.ok(idle.border >= 1 && idle.width >= 250 && idle.height >= 44);
      assert.ok(
        idle.textContrast >= 4.5 && idle.placeholderContrast >= 4.5,
        "Header search is unreadable before focus",
      );
      await input.click();
      const popup = page.locator(".box-content-search.active");
      await popup.waitFor();
      assert.equal(await popup.getByRole("option").count(), 6);
      assert.equal(
        await input.evaluate((el) => getComputedStyle(el).outlineStyle),
        "none",
      );
      await input.fill("Audi A8");
      const active = await appearance();
      assert.ok(
        active.textContrast >= 4.5,
        "Typed header search is unreadable",
      );
      assert.ok(
        Math.abs(active.width - idle.width) <= 1,
        "Header shifts on focus",
      );
      assert.equal(await popup.getByRole("option").count(), 1);
      if (engine === "chromium")
        await page.screenshot({
          path: path.join(evidence, "curated-header-search.png"),
        });
      await input.press("ArrowDown");
      await input.press("Enter");
      await page.waitForURL("**/vehicle/audi-a8/**");
      assert.equal(await page.locator("main h1").innerText(), "Audi A8");
    },
  );
  await step(
    "Photographic lifestyle choices open matching inventory",
    async () => {
      for (const width of [1440, 320]) {
        for (const body of ["Sedan", "Coupe", "SUV", "Hatchback"]) {
          await home(width);
          const choice = page.locator(".curated-types").getByRole("link", {
            name: `Browse ${body} cars`,
            exact: true,
          });
          assert.equal(await choice.locator("img").count(), 1);
          await choice.click();
          await page.waitForURL(`**/inventory/?body=${body}`);
          const matches = catalog.filter((v) => v.body === body);
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
    "Mobile dealer navigation, buyer links and inner routes",
    async () => {
      await home(320);
      await page.getByRole("link", { name: "Open menu", exact: true }).click();
      const menu = page.getByRole("dialog", { name: "Main menu" });
      await menu.waitFor();
      assert.equal(
        await menu.getByRole("link", { name: "Home 01", exact: true }).count(),
        0,
      );
      await menu.getByRole("link", { name: "Cars", exact: true }).click();
      await page.waitForURL("**/inventory/");
      await page
        .getByRole("button", { name: "Open menu", exact: true })
        .click();
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
            await page
              .locator('footer [aria-label="Homepage designs"]')
              .count(),
            0,
          );
        }
      }
    },
  );
  assert.deepEqual(errors, []);
  await fs.writeFile(
    path.join(out, `${engine}-results.json`),
    JSON.stringify(
      { engine, checkedAt: new Date().toISOString(), passed, layouts, errors },
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
