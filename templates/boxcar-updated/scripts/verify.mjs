import { chromium, webkit } from "playwright";
import sharp from "sharp";
import assert from "node:assert/strict";
import fs from "node:fs/promises";
import path from "node:path";
const base = process.env.BOXCAR_URL || "http://127.0.0.1:6455";
const engine = process.env.BOXCAR_BROWSER || "chromium";
const viewsOnly = process.argv.includes("--views");
const flowsOnly = process.argv.includes("--flows");
const textOnly = process.argv.includes("--text");
const innerOnly = process.argv.includes("--inner");
const dir = path.resolve("qa", engine);
await fs.mkdir(dir, { recursive: true });
const catalog = JSON.parse(await fs.readFile("src/data/vehicles.json", "utf8"));
const browser = await (engine === "webkit"
  ? webkit.launch({ headless: true })
  : chromium.launch({ channel: "chrome", headless: true }));
const context = await browser.newContext({
  viewport: { width: 1440, height: 950 },
  deviceScaleFactor: 1,
  reducedMotion: "reduce",
});
const page = await context.newPage();
const errors = [],
  reports = [],
  journeys = [];
page.on("pageerror", (error) =>
  errors.push({ url: page.url(), error: error.message }),
);
page.on("console", (msg) => {
  if (msg.type() === "error")
    errors.push({ url: page.url(), error: msg.text() });
});
page.on("response", (response) => {
  if (response.status() >= 400 && response.url().startsWith(base))
    errors.push({
      url: page.url(),
      error: `${response.status()} ${response.url()}`,
    });
});
async function ready(route) {
  await page.goto(base + route, { waitUntil: "networkidle" });
  await page.locator("main h1, main section h2").first().waitFor();
  if (await page.locator(".reference-home").count())
    await page.locator(".reference-home[data-ready=true]").waitFor();
  if (textOnly)
    await page.addStyleTag({ content: "html { font-size: 200% !important; }" });
  await page.evaluate(() => document.fonts.ready);
}
async function assertLayout(label) {
  const result = await page.evaluate(async () => {
    const images = [...document.images];
    images.forEach((img) => {
      img.loading = "eager";
    });
    await Promise.all(images.map((img) => img.decode().catch(() => {})));
    const width = window.innerWidth;
    const usableWidth = document.documentElement.clientWidth;
    const controls = [
      ...document.querySelectorAll(
        "main button, main input, main select, main textarea, header button",
      ),
    ].filter((el) => {
      const r = el.getBoundingClientRect();
      return (
        r.width &&
        r.height &&
        !el.closest("dialog:not([open])") &&
        !el.closest(".gallery-thumbs,.city-body-tabs,.comparison-scroll")
      );
    });
    return {
      width,
      usableWidth,
      documentWidth: document.documentElement.scrollWidth,
      heading: document.querySelector("main h1")?.textContent,
      brokenImages: images
        .filter((img) => !img.complete || !img.naturalWidth)
        .map((img) => img.getAttribute("src")),
      clippedControls: controls
        .filter((el) => {
          const r = el.getBoundingClientRect();
          return r.x < -1 || r.right > usableWidth + 1;
        })
        .map((el) => ({
          text:
            el.textContent?.trim().slice(0, 80) ||
            el.getAttribute("aria-label") ||
            el.tagName,
          x: el.getBoundingClientRect().x,
          right: el.getBoundingClientRect().right,
        })),
      overlay: !!document.querySelector("vite-error-overlay"),
    };
  });
  reports.push({ label, ...result });
  assert.ok(
    result.documentWidth <= result.width + 1,
    `${label}: document overflow ${JSON.stringify(result)}`,
  );
  assert.deepEqual(result.brokenImages, [], `${label}: broken images`);
  assert.deepEqual(result.clippedControls, [], `${label}: clipped controls`);
  assert.equal(result.overlay, false, `${label}: error overlay`);
  return result;
}
async function journey(name, work) {
  await work();
  journeys.push(name);
  console.log(`PASS ${name}`);
}
async function mosaic(width) {
  const tileWidth = width === 1440 ? 360 : 195;
  const tileHeight = width === 1440 ? 238 : 422;
  const cols = width === 1440 ? 5 : 5;
  const tiles = [];
  for (let n = 1; n <= 10; n++) {
    tiles.push({
      input: await sharp(path.join(dir, `home-${n}-${width}.png`))
        .resize(tileWidth, tileHeight)
        .png()
        .toBuffer(),
      left: ((n - 1) % cols) * tileWidth,
      top: Math.floor((n - 1) / cols) * (tileHeight + 32),
    });
    tiles.push({
      input: Buffer.from(
        `<svg width="${tileWidth}" height="32"><rect width="${tileWidth}" height="32" fill="#ffffff"/><text x="12" y="22" font-family="Arial" font-size="15" fill="#050b20">Home ${String(n).padStart(2, "0")}</text></svg>`,
      ),
      left: ((n - 1) % cols) * tileWidth,
      top: Math.floor((n - 1) / cols) * (tileHeight + 32) + tileHeight,
    });
  }
  await sharp({
    create: {
      width: tileWidth * cols,
      height: (tileHeight + 32) * 2,
      channels: 3,
      background: "#ffffff",
    },
  })
    .composite(tiles)
    .png()
    .toFile(path.join(dir, `homes-${width}.png`));
}
try {
  if (!flowsOnly && !textOnly) {
    for (const width of [1440, 390, 320]) {
      await page.setViewportSize({ width, height: width === 1440 ? 950 : 844 });
      for (let n = 1; n <= (innerOnly ? 0 : 10); n++) {
        await ready(n === 1 ? "/" : `/home-${n}/`);
        assert.equal(
          await page.locator("[data-home]").getAttribute("data-home"),
          String(n),
        );
        await assertLayout(`home-${n}-${width}`);
        await page.screenshot({
          path: path.join(dir, `home-${n}-${width}.png`),
        });
      }
      for (const route of [
        "/inventory/",
        "/vehicle/volvo-xc90-recharge/",
        "/contact/",
        "/calculator/",
        "/about/",
        "/compare/",
        "/favorites/",
        "/blog/",
        "/faq/",
      ]) {
        await ready(route);
        await assertLayout(`${route}-${width}`);
        if (
          width !== 390 &&
          ["/inventory/", "/vehicle/volvo-xc90-recharge/"].includes(route)
        )
          await page.screenshot({
            path: path.join(
              dir,
              `${route.includes("vehicle") ? "detail" : "inventory"}-${width}.png`,
            ),
            fullPage: true,
          });
      }
      if (width !== 390) {
        for (const vehicle of catalog) {
          if (vehicle.slug === "volvo-xc90-recharge") continue;
          await ready(`/vehicle/${vehicle.slug}/`);
          assert.equal(
            await page.locator("main h1").innerText(),
            vehicle.title,
          );
          await assertLayout(`vehicle-${vehicle.slug}-${width}`);
        }
      }
      console.log(
        `PASS ${width}px: ${innerOnly ? "nine supporting routes" : "ten homepages and nine supporting routes"}`,
      );
    }
    if (!innerOnly) {
      await mosaic(1440);
      await mosaic(390);
    }
  }
  if (textOnly) {
    await page.setViewportSize({ width: 320, height: 844 });
    await ready("/");
    await page.evaluate(
      (ids) => {
        localStorage.setItem(
          "boxcar-updated-compare",
          JSON.stringify(ids.slice(0, 4)),
        );
        localStorage.setItem(
          "boxcar-updated-favorites",
          JSON.stringify(ids.slice(0, 2)),
        );
      },
      catalog.map((v) => v.id),
    );
    for (const route of [
      "/",
      ...Array.from({ length: 9 }, (_, i) => `/home-${i + 2}/`),
      "/inventory/",
      "/vehicle/volvo-xc90-recharge/",
      "/contact/",
      "/calculator/",
      "/about/",
      "/compare/",
      "/favorites/",
      "/blog/",
      "/faq/",
    ]) {
      await ready(route);
      if (route === "/inventory/")
        await page.locator(".inventory-filters summary").click();
      await assertLayout(`${route}-320-200-percent-text`);
      if (
        [
          "/",
          "/home-2/",
          "/home-7/",
          "/inventory/",
          "/vehicle/volvo-xc90-recharge/",
          "/calculator/",
        ].includes(route)
      )
        await page.screenshot({
          path: path.join(
            dir,
            `large-text-${route.replaceAll("/", "").replaceAll("-", "") || "home1"}.png`,
          ),
          fullPage: true,
        });
    }
    await ready("/");
    await page.getByRole("button", { name: "Open menu", exact: true }).click();
    const drawer = page.getByRole("dialog", { name: "Explore Boxcars" });
    assert.ok(
      (await drawer.boundingBox()).width <= 320,
      "Large-text menu fits 320px",
    );
    await drawer.getByRole("link", { name: "06 Showroom" }).click();
    await page.waitForURL("**/home-6/");
    journeys.push("200% text menu navigation");
    console.log(
      "PASS 320px at 200% text: ten homes and nine supporting routes",
    );
  }
  if (!viewsOnly && !textOnly) {
    await page.setViewportSize({ width: 1440, height: 950 });
    await journey(
      "Homepage make/model dependency and search carry-through",
      async () => {
        await ready("/");
        const search = page.getByRole("form", { name: "Find a car" });
        await search.getByLabel("Make", { exact: true }).selectOption("Audi");
        await search.getByLabel("Model", { exact: true }).selectOption("A5");
        await search
          .getByLabel("Make", { exact: true })
          .selectOption("Mercedes-Benz");
        assert.equal(
          await search.getByLabel("Model", { exact: true }).inputValue(),
          "",
        );
        await search.getByRole("button", { name: "Search cars" }).click();
        await page.waitForURL("**/inventory/?make=Mercedes-Benz");
        const ids = await page
          .locator("main [data-vehicle-id]")
          .evaluateAll((cards) =>
            cards.map((c) => c.getAttribute("data-vehicle-id")),
          );
        assert.equal(ids.length, 3);
        assert.ok(
          ids.every(
            (id) => catalog.find((v) => v.id === id)?.make === "Mercedes-Benz",
          ),
        );
      },
    );
    await journey(
      "Filtered detail return and browser Back preserve result context",
      async () => {
        await ready("/inventory/?make=Audi&sort=price-low");
        const first = page.locator("main [data-vehicle-id]").first();
        const title = await first.locator("h3").innerText();
        await first.getByRole("link", { name: "View Details" }).click();
        await page.waitForURL("**/vehicle/**");
        assert.equal(await page.locator("main h1").innerText(), title);
        await page.goBack();
        await page.waitForURL("**/inventory/?make=Audi&sort=price-low");
        assert.equal(
          await page.getByLabel("Make", { exact: true }).inputValue(),
          "Audi",
        );
        await page
          .locator("main [data-vehicle-id]")
          .first()
          .getByRole("link", { name: "View Details" })
          .click();
        await page.getByRole("link", { name: "Back to results" }).click();
        await page.waitForURL("**/inventory/?make=Audi&sort=price-low");
      },
    );
    await journey("Sorting, pagination, empty results and reset", async () => {
      await ready("/inventory/");
      const pageOne = await page
        .locator("main [data-vehicle-id]")
        .evaluateAll((cards) =>
          cards.map((c) => c.getAttribute("data-vehicle-id")),
        );
      await page
        .getByRole("button", { name: "Next page", exact: true })
        .click();
      await page.waitForURL("**?page=2");
      const pageTwo = await page
        .locator("main [data-vehicle-id]")
        .evaluateAll((cards) =>
          cards.map((c) => c.getAttribute("data-vehicle-id")),
        );
      assert.equal(pageOne.length, 9);
      assert.equal(pageTwo.length, 8);
      assert.ok(pageTwo.every((id) => !pageOne.includes(id)));
      await page.getByLabel("Sort by").selectOption("price-low");
      await page.waitForURL("**?sort=price-low");
      const ids = await page
        .locator("main [data-vehicle-id]")
        .evaluateAll((cards) =>
          cards.map((c) => c.getAttribute("data-vehicle-id")),
        );
      const prices = ids.map((id) => catalog.find((v) => v.id === id).price);
      assert.ok(prices.every((price, i) => !i || price >= prices[i - 1]));
      const filters = page.getByRole("form", { name: "Inventory filters" });
      await filters.getByLabel("Keyword").fill("no-such-vehicle");
      await filters.getByRole("button", { name: "Search cars" }).click();
      await page
        .getByRole("heading", { name: "No cars match these filters" })
        .waitFor();
      await page
        .locator(".empty-state")
        .getByRole("button", { name: "Reset filters" })
        .click();
      assert.equal(await page.locator("main [data-vehicle-id]").count(), 9);
    });
    await journey(
      "Saved cars persist across reload and can be removed",
      async () => {
        await ready("/inventory/");
        const save = page
          .locator("main [data-vehicle-id]")
          .first()
          .getByRole("button", { name: /^Save / });
        await save.click();
        await ready("/favorites/");
        assert.equal(await page.locator("main [data-vehicle-id]").count(), 1);
        await page.reload({ waitUntil: "networkidle" });
        assert.equal(await page.locator("main [data-vehicle-id]").count(), 1);
        await page
          .locator("main [data-vehicle-id]")
          .getByRole("button", { name: /^Unsave / })
          .click();
        await page
          .getByRole("heading", { name: "Your shortlist starts here" })
          .waitFor();
        assert.equal(
          await page.evaluate(
            () =>
              JSON.parse(localStorage.getItem("boxcar-updated-favorites"))
                .length,
          ),
          0,
        );
      },
    );
    await journey(
      "Comparison enforces four-car maximum, removal and clear",
      async () => {
        await ready("/inventory/");
        for (let i = 0; i < 4; i++)
          await page
            .locator("main [data-vehicle-id]")
            .nth(i)
            .getByRole("button", { name: "Compare", exact: true })
            .click();
        await page
          .locator("main [data-vehicle-id]")
          .nth(4)
          .getByRole("button", { name: "Compare", exact: true })
          .click();
        await page
          .getByRole("status")
          .filter({ hasText: "Compare up to four cars" })
          .waitFor();
        assert.equal(
          await page.evaluate(
            () =>
              JSON.parse(localStorage.getItem("boxcar-updated-compare")).length,
          ),
          4,
        );
        await ready("/compare/");
        assert.equal(await page.locator("thead img").count(), 4);
        await page
          .locator("thead")
          .getByRole("button", { name: /^Remove / })
          .first()
          .click();
        assert.equal(await page.locator("thead img").count(), 3);
        await page.getByRole("button", { name: "Clear comparison" }).click();
        await page
          .getByRole("heading", { name: "Build your comparison" })
          .waitFor();
        assert.equal(
          await page.evaluate(
            () =>
              JSON.parse(localStorage.getItem("boxcar-updated-compare")).length,
          ),
          0,
        );
      },
    );
    await journey(
      "Zero-interest calculator and invalid deposit validation",
      async () => {
        await ready("/calculator/?price=10000");
        const form = page.getByRole("form", { name: "Loan calculator" });
        await form
          .getByLabel("Vehicle price ($)", { exact: true })
          .fill("10000");
        await form.getByLabel("Deposit ($)", { exact: true }).fill("1000");
        await form.getByLabel("Annual interest (%)").fill("0");
        await form.getByLabel("Loan term (months)").fill("36");
        await form
          .getByRole("button", { name: "Calculate", exact: true })
          .click();
        assert.equal(
          await page.locator(".loan-result>strong").innerText(),
          "$250.00",
        );
        await form.getByLabel("Deposit ($)", { exact: true }).fill("10001");
        assert.equal(
          await form
            .getByLabel("Deposit ($)", { exact: true })
            .evaluate((el) => el.checkValidity()),
          false,
        );
        assert.equal(await page.locator(".loan-result").count(), 0);
      },
    );
    await journey("Contact form is an honest local preview", async () => {
      await ready("/contact/");
      const form = page.getByRole("form", { name: "Enquiry form" });
      await form.getByLabel("Full name").fill("Demo visitor");
      await form.getByLabel("Email address").fill("visitor@example.com");
      await form
        .getByLabel("Your message")
        .fill("I would like to preview this enquiry.");
      await form.getByRole("button", { name: "Preview enquiry" }).click();
      await form
        .getByRole("status")
        .filter({ hasText: "No message was sent" })
        .waitFor();
    });
    await page.setViewportSize({ width: 320, height: 844 });
    await journey(
      "320px menu dismissal, focus return and real home navigation",
      async () => {
        await ready("/");
        const trigger = page.getByRole("button", {
          name: "Open menu",
          exact: true,
        });
        await trigger.click();
        await page.getByRole("dialog", { name: "Explore Boxcars" }).waitFor();
        await page.keyboard.press("Escape");
        assert.equal(await page.locator("dialog[open]").count(), 0);
        assert.equal(
          await trigger.evaluate((el) => el === document.activeElement),
          true,
        );
        await trigger.click();
        await page
          .locator(".nav-drawer")
          .getByRole("link", { name: "06 Showroom" })
          .click();
        await page.waitForURL("**/home-6/");
        assert.equal(await page.locator("dialog[open]").count(), 0);
        assert.match(await page.locator("main h1").innerText(), /17 Vehicles/);
        await assertLayout("mobile-home-navigation");
      },
    );
    await journey(
      "320px gallery and enquiry dialog are usable and restore focus",
      async () => {
        await ready("/vehicle/volvo-xc90-recharge/");
        const opener = page.getByRole("button", { name: /^Enlarge photo/ });
        await opener.click();
        await page.getByRole("dialog", { name: /photo gallery/ }).waitFor();
        const first = await page
          .locator(".photo-dialog>img")
          .getAttribute("src");
        await page.getByRole("button", { name: "Next enlarged photo" }).click();
        assert.notEqual(
          await page.locator(".photo-dialog>img").getAttribute("src"),
          first,
        );
        await page.keyboard.press("Escape");
        assert.equal(
          await opener.evaluate((el) => el === document.activeElement),
          true,
        );
        const enquire = page.getByRole("button", {
          name: "Enquire about this car",
          exact: true,
        });
        await enquire.click();
        const dialog = page.getByRole("dialog", {
          name: "Enquire about this car",
        });
        await dialog.waitFor();
        assert.ok((await dialog.boundingBox()).width <= 320);
        await page.keyboard.press("Escape");
        assert.equal(
          await enquire.evaluate((el) => el === document.activeElement),
          true,
        );
      },
    );
    await journey(
      "320px filters close after applying and reveal the results",
      async () => {
        await ready("/inventory/");
        await page.locator(".inventory-filters summary").click();
        await page
          .getByLabel("Make", { exact: true })
          .selectOption("Mercedes-Benz");
        await page
          .getByRole("form", { name: "Inventory filters" })
          .getByRole("button", { name: "Search cars" })
          .click();
        await page.waitForURL("**?make=Mercedes-Benz");
        assert.equal(
          await page.locator(".inventory-filters").getAttribute("open"),
          null,
        );
        assert.equal(await page.locator("main [data-vehicle-id]").count(), 3);
        await assertLayout("mobile-filter-results");
      },
    );
    await journey(
      "Featured car controls update the actual vehicle destination",
      async () => {
        await ready("/home-2/");
        await page
          .locator(".hero-slide-controls")
          .getByRole("button", { name: "Volvo XC90 Recharge" })
          .click();
        assert.equal(
          await page.locator("main h1").innerText(),
          "Volvo XC90 Recharge",
        );
        await page
          .locator(".hero")
          .getByRole("link", { name: "View Details" })
          .click();
        await page.waitForURL("**/vehicle/volvo-xc90-recharge/**");
      },
    );
  }
  assert.deepEqual(errors, [], "Browser console, page or HTTP errors");
  await fs.writeFile(
    path.join(
      dir,
      `report-${engine}${textOnly ? "-text" : flowsOnly ? "-flows" : viewsOnly ? "-views" : ""}.json`,
    ),
    JSON.stringify(
      {
        date: new Date().toISOString(),
        base,
        engine,
        views: reports,
        journeys,
        errors,
      },
      null,
      2,
    ),
  );
  console.log(
    `PASS ${reports.length} rendered checks; ${journeys.length} journeys; no browser errors.`,
  );
} catch (error) {
  await page
    .screenshot({ path: path.join(dir, "failure.png"), fullPage: true })
    .catch(() => {});
  await fs.writeFile(
    path.join(dir, "failure.json"),
    JSON.stringify(
      { error: error.message, url: page.url(), reports, journeys, errors },
      null,
      2,
    ),
  );
  throw error;
} finally {
  await browser.close();
}
