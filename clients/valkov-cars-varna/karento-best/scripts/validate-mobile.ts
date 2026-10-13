import assert from "node:assert/strict";
import fs from "node:fs";
import { launchBrowser, matchesDestination } from "./browser.ts";
import { canonicalRoutes, sourceKeys } from "../src/lib/routes.ts";
import { listingProducts } from "../src/lib/data/vehicle-listing.ts";

const base = process.env.KARENTO_NATIVE_URL || "http://127.0.0.1:6466";
const directory =
  process.env.KARENTO_EVIDENCE_DIR || ".runtime/evidence/mobile";
fs.mkdirSync(directory, { recursive: true });
const routes = sourceKeys.map((key) => {
  const canonical = Object.entries(canonicalRoutes).find(
    ([, value]) => value === key,
  );
  return "/" + (canonical?.[0] ?? key);
});
const browser = await launchBrowser();
const results: unknown[] = [];
const failures: string[] = [];

try {
  for (const width of [320, 390]) {
    const page = await browser.newPage({
      viewport: { width, height: 844 },
      reducedMotion: "reduce",
      isMobile: true,
      hasTouch: true,
    });
    const errors: string[] = [];
    page.on("pageerror", (error) => errors.push(error.message));
    await page.route("**/*", (request) =>
      new URL(request.request().url()).hostname === "127.0.0.1"
        ? request.continue()
        : request.abort(),
    );
    if (process.env.KARENTO_BASELINE_URL) {
      for (const route of [
        "/",
        "/vehicles",
        "/vehicle",
        "/services",
        "/shop",
        "/contact",
      ]) {
        await page.goto(process.env.KARENTO_BASELINE_URL + route, {
          waitUntil: "networkidle",
        });
        await page.evaluate(() => document.fonts.ready);
        const name = route.slice(1) || "home";
        await page.screenshot({
          path: `${directory}/before-${name}-${width}.png`,
          animations: "disabled",
        });
      }
    }
    for (const route of routes) {
      try {
        const response = await page.goto(base + route, {
          waitUntil: "networkidle",
        });
        assert.equal(response?.status(), 200, "HTTP response");
        await page.waitForFunction(
          () => document.body.dataset.karentoReady === "true",
        );
        await page.evaluate(() => document.fonts.ready);
        const geometry = await page.evaluate(() => {
          const nav = document.querySelector(".karento-mobile-navigation")!;
          return {
            immersiveDetail: !!document.querySelector(".karento-mobile-detail"),
            width: innerWidth,
            scrollWidth: document.documentElement.scrollWidth,
            height: document.documentElement.scrollHeight,
            nav: nav.getBoundingClientRect().toJSON(),
            targets: [...nav.querySelectorAll("a,button")].map((el) => ({
              label: el.textContent?.trim(),
              ...el.getBoundingClientRect().toJSON(),
            })),
            widgetErrors: [
              ...document.querySelectorAll("[data-widget-error]"),
            ].map((el) => el.getAttribute("data-widget-error")),
          };
        });
        assert.equal(geometry.width, width);
        assert.ok(
          geometry.scrollWidth <= width + 1,
          `Page overflow: ${geometry.scrollWidth}px at ${width}px`,
        );
        assert.equal(geometry.targets.length, 5);
        if (geometry.immersiveDetail) {
          assert.equal(
            geometry.nav.height,
            0,
            "PDP hides the global mobile navigation",
          );
          assert.equal(
            await page.locator(".header").isVisible(),
            false,
            "PDP hides the global header",
          );
          const enquiry = await page
            .getByRole("complementary", { name: "Vehicle enquiry" })
            .boundingBox();
          assert.ok(
            enquiry && enquiry.y + enquiry.height === 844,
            "PDP enquiry remains at the viewport bottom",
          );
        } else {
          assert.ok(
            geometry.targets.every(
              (target) => target.width >= 44 && target.height >= 44,
            ),
            "Navigation touch targets",
          );
          assert.equal(
            geometry.nav.bottom,
            844,
            "Bottom navigation is anchored to the viewport",
          );
        }
        assert.deepEqual(geometry.widgetErrors, []);
        assert.deepEqual(errors, []);
        if (route === "/vehicles") {
          const firstPhoto = await page
            .locator(
              ".box-grid-tours .mobile-vehicle-card .mobile-vehicle-photo",
            )
            .first()
            .boundingBox();
          assert.ok(
            firstPhoto && firstPhoto.y < geometry.nav.top - 96,
            "The first vehicle photo is visible before scrolling",
          );
        }
        if (route === "/vehicle") {
          const photo = await page.locator(".mobile-pdp-gallery").boundingBox();
          const title = await page
            .locator(".karento-enquiry-detail .tour-title-main")
            .boundingBox();
          assert.ok(
            photo && title && photo.y < title.y && photo.y < 200,
            "Vehicle details lead with the existing photo gallery",
          );
          const photoActions = await page
            .getByRole("navigation", { name: "Vehicle page actions" })
            .locator("a,button")
            .evaluateAll((buttons) =>
              buttons.map((button) => {
                const bounds = button.getBoundingClientRect();
                return {
                  width: bounds.width,
                  height: bounds.height,
                  left: bounds.left,
                  right: bounds.right,
                };
              }),
            );
          assert.equal(photoActions.length, 3);
          assert.ok(
            photoActions.every(
              (target) =>
                target.width >= 44 &&
                target.height >= 44 &&
                target.left >= 0 &&
                target.right <= width,
            ),
            "Back, Wishlist and Share have 44px targets on the photo",
          );
          assert.ok(
            await page
              .getByRole("button", { name: "Open photo viewer", exact: true })
              .first()
              .isVisible(),
            "The full photo viewer action is reachable on a phone",
          );
          const thumbnails = await page
            .locator(".mobile-pdp-gallery .karento-gallery-thumb")
            .evaluateAll((nodes) =>
              nodes
                .filter((node) => {
                  const bounds = node.getBoundingClientRect();
                  return bounds.left >= 0 && bounds.right <= innerWidth;
                })
                .map((node) => node.getBoundingClientRect().toJSON()),
            );
          assert.equal(
            thumbnails.length,
            4,
            "Four photo thumbnails remain visible",
          );
          assert.ok(
            thumbnails.every((bounds) => bounds.height >= 44),
            "Photo thumbnails remain tappable",
          );
          const panel = await page.locator(".mobile-pdp-panel").boundingBox();
          assert.ok(
            photo &&
              panel &&
              panel.y < photo.y + photo.height &&
              title &&
              title.y >= panel.y,
            "The title panel meets the photo with a rounded overlapping edge",
          );
        }
        const name =
          (route.slice(1).replaceAll("/", "-") || "home") + "-" + width;
        await page.screenshot({
          path: `${directory}/${name}.png`,
          animations: "disabled",
        });
        results.push({ route, ...geometry });
        console.log("PASS", route, width);
      } catch (error) {
        failures.push(`${route} at ${width}: ${String(error)}`);
        console.error("FAIL", failures.at(-1));
      }
    }

    await page.goto(base + "/services", { waitUntil: "networkidle" });
    const serviceSearch = page.getByRole("searchbox", {
      name: "Search services",
    });
    const serviceResultsTop = () =>
      page
        .locator(".mobile-service-list, .mobile-service-empty")
        .evaluate(
          (node) =>
            node.getBoundingClientRect().top -
            node.closest(".karento-service-benefits")!.getBoundingClientRect()
              .top,
        );
    await page.locator(".mobile-service-list").waitFor({ state: "visible" });
    const initialServiceResultsTop = await serviceResultsTop();
    const visibleServiceCount = async (label: string) => {
      const status = await page
        .locator("[data-service-count]")
        .evaluate((node) => ({
          text: node.textContent?.trim(),
          height: node.getBoundingClientRect().height,
          lineHeight: parseFloat(getComputedStyle(node).lineHeight),
          clip: getComputedStyle(node).clip,
        }));
      assert.equal(status.text, label);
      assert.equal(status.height, status.lineHeight);
      assert.equal(status.clip, "auto");
    };
    await visibleServiceCount("9 services");
    const categoryChips = page.locator(".service-results").getByRole("button");
    assert.equal(await categoryChips.count(), 0, "No inactive filter chip");
    assert.equal(
      await page.getByRole("button", { name: "Clear filters" }).count(),
      0,
      "Mobile filters use individual removable chips",
    );
    for (const category of [
      "Rentals",
      "Transfers",
      "Concierge",
      "Assistance",
    ]) {
      await page
        .getByRole("button", { name: category, exact: true })
        .press("Enter");
      assert.equal(
        await serviceResultsTop(),
        initialServiceResultsTop,
        `Selecting ${category} keeps the results in place`,
      );
      assert.ok(
        (
          await page.locator("[data-service-count]").getAttribute("aria-label")
        )?.startsWith(category + " · "),
        "The results row includes the selected category",
      );
      const tagAlignment = await page
        .locator(".service-results")
        .evaluate((row) => ({
          rowLeft: row.getBoundingClientRect().left,
          tagLeft: row.querySelector("button")?.getBoundingClientRect().left,
        }));
      assert.equal(tagAlignment.tagLeft, tagAlignment.rowLeft);
    }
    await serviceSearch.fill("A deliberately long unmatched search ".repeat(5));
    assert.equal(
      await serviceResultsTop(),
      initialServiceResultsTop,
      "Long searches and empty results do not add a row",
    );
    const resultStatus = await page
      .locator("[data-service-count]")
      .evaluate((node) => ({
        height: node.getBoundingClientRect().height,
        position: getComputedStyle(node).position,
        clip: getComputedStyle(node).clip,
        text: node.textContent?.trim(),
        title: node.getAttribute("title"),
        accessibleLabel: node.getAttribute("aria-label"),
      }));
    assert.equal(resultStatus.position, "absolute");
    assert.equal(resultStatus.height, 1);
    assert.notEqual(resultStatus.clip, "auto");
    assert.equal(resultStatus.text, resultStatus.accessibleLabel);
    assert.equal(resultStatus.title, resultStatus.accessibleLabel);
    await page
      .getByRole("button", { name: "Remove Assistance filter", exact: true })
      .press("Enter");
    assert.equal(await serviceResultsTop(), initialServiceResultsTop);
    assert.ok((await serviceSearch.inputValue()).length > 0);
    assert.equal(await categoryChips.count(), 0);
    await visibleServiceCount("0 services");
    assert.equal(
      await page
        .getByRole("button", { name: "Assistance", exact: true })
        .evaluate((node) => document.activeElement === node),
      true,
      "Removing a category returns focus to its selector",
    );
    await page.getByRole("button", { name: "Clear search" }).press("Enter");
    assert.equal(await serviceResultsTop(), initialServiceResultsTop);
    assert.equal(await serviceSearch.inputValue(), "");
    await visibleServiceCount("9 services");
    assert.equal(
      await serviceSearch.evaluate((node) => document.activeElement === node),
      true,
      "Clearing search returns focus to Services search",
    );
    await serviceSearch.fill("Airport");
    await visibleServiceCount("1 service");
    assert.equal(await serviceResultsTop(), initialServiceResultsTop);
    await page.getByRole("button", { name: "Clear search" }).click();
    results.push({ width, journey: "stable-service-filter-results" });

    await page.goto(base, { waitUntil: "networkidle" });
    const navigation = page.getByRole("navigation", {
      name: "Mobile navigation",
    });
    const menu = navigation.getByRole("button", { name: "Open menu" });
    await menu.focus();
    const initialScroll = await page.evaluate(() => scrollY);
    await menu.press("Space");
    await page.waitForFunction(() =>
      document.activeElement?.matches(".close-canvas"),
    );
    assert.equal(
      await page.evaluate(() => scrollY),
      initialScroll,
      "Menu Space activation does not scroll",
    );
    await page
      .locator("#karento-account-drawer")
      .getByRole("button", { name: "Close menu" })
      .press("Space");
    assert.equal(
      await page.locator("#karento-account-drawer").getAttribute("aria-hidden"),
      "true",
    );
    await navigation.getByRole("button", { name: "Open menu" }).click();
    const drawer = page.getByRole("dialog", { name: "Menu and account" });
    await drawer.waitFor({ state: "visible" });
    await page.waitForFunction(() =>
      document.activeElement?.matches(".close-canvas"),
    );
    await page.screenshot({
      path: `${directory}/menu-${width}.png`,
      animations: "disabled",
    });
    await page.keyboard.press("Escape");
    assert.equal(
      await page.locator("#karento-account-drawer").getAttribute("aria-hidden"),
      "true",
    );
    assert.equal(
      await page.evaluate(
        () =>
          document.activeElement?.closest(".karento-mobile-navigation") !==
          null,
      ),
      true,
      "Menu focus returns to its opener",
    );
    await navigation
      .getByRole("link", { name: "Vehicles", exact: true })
      .click();
    await page.waitForURL((url) => matchesDestination(url, base + "/vehicles"));
    assert.equal(
      await navigation
        .getByRole("link", { name: "Vehicles", exact: true })
        .getAttribute("aria-current"),
      "page",
    );
    await navigation.getByRole("link", { name: "Home", exact: true }).click();
    await page.waitForURL((url) => matchesDestination(url, base + "/"));

    const search = page.getByRole("search", { name: "Find a vehicle" });
    const compactSearch = await search.boundingBox();
    assert.ok(
      compactSearch && compactSearch.height <= 72,
      "Mobile search is a single compact row",
    );
    await search
      .getByRole("button", { name: "Make or model", exact: true })
      .click();
    const searchSheet = page.getByRole("dialog", {
      name: "Make or model",
      exact: true,
    });
    await searchSheet.waitFor({ state: "visible" });
    assert.equal(
      new URL(page.url()).pathname,
      "/",
      "Search opens in place on Home",
    );
    await searchSheet
      .getByRole("searchbox", { name: "Make or model" })
      .fill("Toyota");
    await searchSheet
      .getByRole("button", { name: "Show 1 vehicle", exact: true })
      .click();
    await page.waitForURL(
      (url) =>
        url.pathname === "/vehicles" && url.searchParams.get("q") === "Toyota",
    );
    assert.equal(
      await page.locator(".box-grid-tours .mobile-vehicle-card").count(),
      1,
    );
    const tools = page.getByRole("navigation", {
      name: "Vehicle filters and sorting",
    });
    const pills = await tools
      .getByRole("button")
      .evaluateAll((buttons) =>
        buttons.map((button) => button.getBoundingClientRect().toJSON()),
      );
    assert.ok(
      pills.every((pill) => Math.abs(pill.y - pills[0].y) < 1),
      "Sort shares the horizontal filter row",
    );
    assert.ok(
      pills[1].right <= width && pills[1].height >= 36,
      "Sort stays visible with a compact selector surface",
    );
    const sort = tools.getByRole("button", { name: /^Sort vehicles:/ });
    assert.ok(
      await sort.evaluate(
        (button) =>
          Number.parseFloat(getComputedStyle(button, "::before").height) >= 44,
      ),
      "Sort retains at least 44px of touch coverage",
    );
    await page.touchscreen.tap(pills[1].x + pills[1].width / 2, pills[1].y - 3);
    const touchSortSheet = page.getByRole("dialog", {
      name: "Sort by",
      exact: true,
    });
    await touchSortSheet.waitFor({ state: "visible" });
    await touchSortSheet.press("Escape");
    assert.equal(
      await sort.evaluate((button) => button === document.activeElement),
      true,
      "Sort returns focus after a tap on its transparent touch area",
    );
    await page.getByRole("button", { name: "Make", exact: true }).click();
    const makeSheet = page.getByRole("dialog", { name: "Make", exact: true });
    await makeSheet.waitFor({ state: "visible" });
    await makeSheet.press("Escape");
    const filters = page.getByRole("button", {
      name: "Vehicle filters",
      exact: true,
    });
    await filters.click();
    const sheet = page.getByRole("dialog", {
      name: "Vehicle filters",
      exact: true,
    });
    await sheet.waitFor({ state: "visible" });
    await sheet.getByRole("searchbox", { name: "Make or model" }).fill("");
    await sheet
      .getByRole("navigation", { name: "Vehicle search options" })
      .getByRole("button", { name: "Make", exact: true })
      .click();
    await makeSheet.waitFor({ state: "visible" });
    await makeSheet
      .getByRole("searchbox", { name: "Search makes" })
      .fill("Subaru");
    await makeSheet.getByRole("radio", { name: "Subaru", exact: true }).check();
    await makeSheet
      .getByRole("navigation", { name: "Vehicle search options" })
      .getByRole("button", { name: "Filters", exact: true })
      .click();
    await sheet.waitFor({ state: "visible" });
    await sheet
      .getByRole("textbox", { name: "Maximum daily price (USD)" })
      .fill("80");
    const sheetBox = await sheet.boundingBox();
    assert.ok(
      sheetBox &&
        sheetBox.x >= 0 &&
        sheetBox.x + sheetBox.width <= width &&
        sheetBox.y >= 0 &&
        sheetBox.y + sheetBox.height <= 845,
      "Filter sheet fits the viewport",
    );
    await page.screenshot({
      path: `${directory}/vehicle-filters-${width}.png`,
      animations: "disabled",
    });
    await sheet
      .getByRole("button", { name: "Show 2 vehicles", exact: true })
      .click();
    await page.waitForURL(
      (url) =>
        url.searchParams.get("make") === "Subaru" &&
        url.searchParams.get("budget") === "80",
    );
    assert.equal(
      await page.locator(".box-grid-tours .mobile-vehicle-card").count(),
      2,
    );
    assert.ok(
      (
        await page
          .locator(".box-grid-tours .mobile-vehicle-title")
          .allTextContents()
      ).every((title) => title.startsWith("Subaru")),
    );
    await page.reload({ waitUntil: "networkidle" });
    assert.equal(
      await page.locator(".box-grid-tours .mobile-vehicle-card").count(),
      2,
      "Filters survive reload",
    );
    await page
      .getByRole("button", { name: "Remove budget", exact: true })
      .click();
    await page.waitForURL((url) => !url.searchParams.has("budget"));
    assert.equal(
      await page.locator(".box-grid-tours .mobile-vehicle-card").count(),
      4,
    );
    await page.goBack({ waitUntil: "networkidle" });
    await page.waitForURL((url) => url.searchParams.get("budget") === "80");
    await page.waitForFunction(
      () =>
        document.querySelectorAll(".box-grid-tours .mobile-vehicle-card")
          .length === 2,
    );
    assert.equal(
      await page.locator(".box-grid-tours .mobile-vehicle-card").count(),
      2,
      "Back restores the previous selection",
    );
    await page.getByRole("button", { name: /^Sort vehicles:/ }).click();
    const sortSheet = page.getByRole("dialog", {
      name: "Sort by",
      exact: true,
    });
    await sortSheet
      .getByRole("radio", { name: "Price: low first", exact: true })
      .check();
    await sortSheet
      .getByRole("button", { name: /^Show \d+ vehicles$/ })
      .click();
    await page.waitForURL(
      (url) => url.searchParams.get("sort") === "price-asc",
    );
    const prices = (
      await page
        .locator(".box-grid-tours .mobile-vehicle-price")
        .allTextContents()
    ).map((price) => Number(price.replace(/[^\d.]/g, "")));
    assert.deepEqual(
      prices,
      prices.toSorted((a, b) => a - b),
    );
    await page
      .getByRole("button", { name: "Vehicle filters", exact: true })
      .click();
    await sheet.press("Escape");
    assert.equal(
      await page.evaluate(() =>
        document.activeElement?.getAttribute("aria-label"),
      ),
      "Vehicle filters",
      "Filter sheet returns focus",
    );
    await search
      .getByRole("button", { name: "Make or model", exact: true })
      .click();
    await searchSheet
      .getByRole("searchbox", { name: "Make or model" })
      .fill("Outback");
    await searchSheet
      .getByRole("button", { name: "Show 2 vehicles", exact: true })
      .click();
    await page.waitForURL((url) => url.searchParams.get("q") === "Outback");
    assert.equal(new URL(page.url()).searchParams.get("make"), "Subaru");
    assert.equal(new URL(page.url()).searchParams.get("budget"), "80");
    assert.equal(new URL(page.url()).searchParams.get("sort"), "price-asc");
    await page.waitForFunction(
      () =>
        document.querySelectorAll(".box-grid-tours .mobile-vehicle-card")
          .length === 2,
    );
    await page.getByRole("button", { name: "Clear all", exact: true }).click();
    await page.waitForURL((url) => !url.searchParams.has("make"));
    assert.equal(
      await page.locator(".box-grid-tours .mobile-vehicle-card").count(),
      16,
    );
    const allPrices = (
      await page
        .locator(".box-grid-tours .mobile-vehicle-price")
        .allTextContents()
    ).map((price) => Number(price.replace(/[^\d.]/g, "")));
    assert.ok(
      new Set(allPrices).size > 1,
      "Price ordering uses varied inventory prices",
    );
    assert.deepEqual(
      allPrices,
      allPrices.toSorted((a, b) => a - b),
    );
    await page.getByRole("button", { name: /^Sort vehicles:/ }).click();
    await sortSheet
      .getByRole("radio", { name: "Price: high first", exact: true })
      .check();
    await sortSheet
      .getByRole("button", { name: /^Show \d+ vehicles$/ })
      .click();
    await page.waitForURL(
      (url) => url.searchParams.get("sort") === "price-desc",
    );
    await page.waitForFunction(() => {
      const values = [
        ...document.querySelectorAll(".box-grid-tours .mobile-vehicle-price"),
      ].map((element) => Number(element.textContent?.replace(/[^\d.]/g, "")));
      return values.every(
        (value, index) => index === 0 || values[index - 1] >= value,
      );
    });
    const descendingPrices = (
      await page
        .locator(".box-grid-tours .mobile-vehicle-price")
        .allTextContents()
    ).map((price) => Number(price.replace(/[^\d.]/g, "")));
    assert.deepEqual(
      descendingPrices,
      allPrices.toSorted((a, b) => b - a),
    );
    await navigation.getByRole("link", { name: "Home", exact: true }).click();
    await page.waitForURL((url) => matchesDestination(url, base + "/"));

    await page
      .getByRole("search", { name: "Find a vehicle" })
      .getByRole("button", { name: "Make or model", exact: true })
      .click();
    await searchSheet.waitFor({ state: "visible" });
    await searchSheet
      .getByRole("navigation", { name: "Vehicle search options" })
      .getByRole("button", { name: "Filters", exact: true })
      .click();
    await sheet.waitFor({ state: "visible" });
    assert.equal(
      new URL(page.url()).pathname,
      "/",
      "Home filters open in place",
    );
    await sheet.getByRole("button", { name: "Close vehicle filters" }).click();
    await navigation.getByRole("link", { name: "Home", exact: true }).click();
    await page.waitForURL((url) => matchesDestination(url, base + "/"));

    const homeVehicles = page.getByRole("region", { name: "Popular vehicles" });
    const compactCards = await homeVehicles
      .locator(".mobile-vehicle-card")
      .evaluateAll((cards) =>
        cards.map((card) => ({
          ...card.getBoundingClientRect().toJSON(),
          photo: card
            .querySelector(".mobile-vehicle-photo")!
            .getBoundingClientRect()
            .toJSON(),
          details: card
            .querySelector(".mobile-vehicle-copy")!
            .getBoundingClientRect()
            .toJSON(),
        })),
      );
    assert.equal(compactCards.length, 3);
    assert.ok(
      compactCards.every(
        (card) =>
          card.x >= 0 &&
          card.right <= width &&
          card.height < 230 &&
          card.photo.width >= 100 &&
          card.photo.right <= card.details.x + 1,
      ),
      "Home cards fit as readable photo-left rows",
    );
    await homeVehicles.scrollIntoViewIfNeeded();
    await page.screenshot({
      path: `${directory}/compact-home-cards-${width}.png`,
      animations: "disabled",
    });
    await page.setViewportSize({ width: 1024, height: 844 });
    await page.waitForFunction(
      () =>
        document.querySelectorAll(".mobile-home-vehicles").length === 0 &&
        document.querySelectorAll(".mobile-vehicle-rail .card-journey-small")
          .length >= 8,
    );
    assert.equal(
      await navigation.isVisible(),
      false,
      "Phone navigation is absent above its breakpoint",
    );
    await page.setViewportSize({ width, height: 844 });
    await page.waitForFunction(
      () =>
        document.querySelectorAll(".mobile-home-vehicles .mobile-vehicle-card")
          .length >= 3,
    );
    await page.locator(".header .karento-header-cta").click();
    await page.waitForURL((url) => matchesDestination(url, base + "/login"));

    await page.goto(base + "/shop", { waitUntil: "networkidle" });
    await page.waitForFunction(
      () => document.body.dataset.karentoReady === "true",
    );
    const productCards = page.locator(".box-grid-tours .mobile-product-card");
    await productCards.first().waitFor({ state: "visible" });
    const productRows = await productCards.evaluateAll((cards) =>
      cards.slice(0, 2).map((card) => ({
        ...card.getBoundingClientRect().toJSON(),
        photo: card
          .querySelector(".media-row-photo")!
          .getBoundingClientRect()
          .toJSON(),
        summary: card
          .querySelector(".product-summary")!
          .getBoundingClientRect()
          .toJSON(),
        rating: card
          .querySelector(".product-rating")!
          .getBoundingClientRect()
          .toJSON(),
        title: card.querySelector("h3")!.getBoundingClientRect().toJSON(),
      })),
    );
    assert.ok(
      productRows.length === 2 &&
        Math.abs(productRows[0].x - productRows[1].x) < 1 &&
        productRows[1].top > productRows[0].bottom &&
        productRows.every(
          (card) =>
            card.left >= 0 &&
            card.right <= width &&
            card.photo.right <= card.summary.left + 1 &&
            Math.abs(card.photo.top - card.summary.top) < 1 &&
            Math.abs(card.photo.height - card.summary.height) < 1 &&
            card.rating.bottom <= card.title.top &&
            card.summary.right <= card.right &&
            card.height >= 44,
        ),
      "Shop keeps photo/copy heights aligned and ratings above complete titles",
    );
    assert.equal(await productCards.locator(".product-arrow").count(), 0);
    assert.deepEqual(
      await productCards.locator("h3").allTextContents(),
      listingProducts.map((product) => product.title),
      "Shop preserves every complete product name",
    );
    const productSearch = page.getByRole("search", { name: "Find a product" });
    await productSearch
      .getByRole("searchbox", { name: "Search parts" })
      .fill("Thinkware");
    await productSearch
      .getByRole("button", { name: "Search products" })
      .click();
    await page.waitForURL(
      (url) =>
        url.pathname === "/shop" && url.searchParams.get("q") === "Thinkware",
    );
    assert.equal(
      await productCards.count(),
      1,
      "Product search filters the displayed products",
    );
    const selectedProduct = listingProducts.find((product) =>
      product.title.includes("Thinkware"),
    )!;
    await productCards.first().press("Enter");
    await page.waitForURL(
      (url) =>
        url.pathname === "/shop/product" &&
        url.searchParams.get("product") === selectedProduct.id,
    );
    assert.equal(
      (
        await page
          .locator(".karento-product-buybox .tour-title-main h5")
          .innerText()
      ).trim(),
      selectedProduct.title,
      "Product details retain the selected catalogue record",
    );
    assert.equal(
      await page
        .locator(".karento-product-purchase .slick-current img")
        .getAttribute("src"),
      selectedProduct.image,
    );
    assert.equal(
      await page.locator(".karento-product-purchase .slick-arrow").count(),
      0,
      "A single supplied product photograph has no carousel arrows",
    );
    await page.getByRole("button", { name: "Open photo viewer" }).click();
    const productViewer = page.getByRole("dialog", { name: "Photo viewer" });
    await productViewer.waitFor({ state: "visible" });
    assert.equal(
      await productViewer.getByRole("img").getAttribute("src"),
      selectedProduct.image,
    );
    assert.equal(
      await productViewer
        .getByRole("button", { name: /^(Next|Previous) photo$/ })
        .count(),
      0,
    );
    await productViewer
      .getByRole("button", { name: "Close photo viewer" })
      .click();
    await page.goBack({ waitUntil: "networkidle" });
    await page.waitForURL(
      (url) =>
        url.pathname === "/shop" && url.searchParams.get("q") === "Thinkware",
    );
    await productCards.first().waitFor({ state: "visible" });
    assert.equal(
      await productCards.count(),
      1,
      "Back retains the filtered catalogue",
    );
    await page.getByRole("button", { name: "Clear all", exact: true }).click();
    await page.waitForURL((url) => !url.searchParams.has("q"));
    assert.equal(await productCards.count(), listingProducts.length);

    await page.goto(base + "/vehicle", { waitUntil: "networkidle" });
    await page
      .getByRole("button", { name: "Open photo viewer", exact: true })
      .first()
      .click();
    const photoViewer = page.getByRole("dialog", { name: "Photo viewer" });
    await photoViewer.waitFor({ state: "visible" });
    await photoViewer.getByRole("button", { name: "Next photo" }).click();
    assert.ok(
      await photoViewer.getByRole("img", { name: "Photo 2 of 5" }).isVisible(),
      "The full viewer advances through the existing photos",
    );
    await photoViewer
      .getByRole("button", { name: "Close photo viewer" })
      .click();
    assert.equal(
      await page.locator(".box-button-abs [data-demo-action]").count(),
      0,
      "Opening real photos does not produce unrelated demo feedback",
    );
    await page.locator(".mobile-enquiry-link").click();
    await page.waitForURL(
      (url) =>
        url.origin === new URL(base).origin &&
        url.pathname === "/contact" &&
        url.hash === "#contact-enquiry",
    );
    assert.ok(await page.locator("#contact-enquiry").isVisible());
    results.push({
      width,
      journeys: [
        "drawer-focus-return",
        "navigation-active-state",
        "horizontal-filter-pills",
        "compact-photo-left-home-cards",
        "direct-account",
        "vehicle-contact-destination",
        "in-place-make-model-search-sheet",
        "query-preserves-applied-filters",
        "working-make-budget-filters",
        "filter-url-reload-back",
        "filter-sheet-focus-return",
        "home-filter-shortcut",
        "filtered-price-order",
        "desktop-card-composition-preserved-on-resize",
        "full-photo-viewer",
        "compact-product-list-search-and-selected-detail",
      ],
    });
    await page.close();
  }
} finally {
  fs.writeFileSync(
    `${directory}/mobile-results.json`,
    JSON.stringify({ results, failures }, null, 2),
  );
  await browser.close();
}
assert.deepEqual(failures, []);
