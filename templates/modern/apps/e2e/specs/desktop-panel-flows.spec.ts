import { expect, test } from "@playwright/test";

const dieselResultsPattern = /\/en\/cars\?.*fuel=diesel/;
const fuelQueryPattern = /fuel=/;
const phonePattern = /^tel:/;
const sourceQueryPattern = /sourceUrl=/;
const vehicleQueryPattern = /[?&]vehicle=/;
const moreFiltersPattern = /More filters/;
const desktopHeroSelector =
  '[data-slot="dealer-desktop-home-hero"], [data-slot="dealer-desktop-context-hero"]';

test("desktop follows the Boxcars hero, stock and page proportions", async ({
  page,
}) => {
  test.setTimeout(180_000);
  for (const width of [1024, 1440, 1920]) {
    await page.setViewportSize({ width, height: 1000 });
    for (const locale of ["en", "bg"]) {
      await page.goto(`/${locale}`);
      const header = page.locator(
        '[data-slot="dealer-desktop-header"]:visible'
      );
      const headerBox = await header.boundingBox();
      expect(headerBox?.height).toBe(90);
      expect(
        await page
          .locator("footer")
          .evaluate((element) => getComputedStyle(element).borderRadius)
      ).toBe("30px 30px 0px 0px");
      const hero = page.locator('[data-slot="dealer-desktop-home-hero"]');
      const heroBox = await hero.boundingBox();
      expect(heroBox?.x).toBe(Math.max(24, (width - 1392) / 2));
      expect(heroBox?.y).toBe(90);
      expect(heroBox?.height).toBe(680);
      expect(heroBox?.width).toBe(Math.min(width - 48, 1392));
      expect(
        await hero.evaluate(
          (element) => getComputedStyle(element).backgroundImage
        )
      ).toContain("desktop-boxcars/hero.jpg");
      const search = hero.locator("form");
      expect((await search.boundingBox())?.height).toBe(76);
      const stock = page.locator('[data-slot="home-stock-panel"]');
      expect((await stock.boundingBox())?.y).toBe(834);
      const stockGrid = page.locator('[data-slot="home-stock-grid"]');
      expect(
        await stockGrid.evaluate(
          (element) =>
            getComputedStyle(element).gridTemplateColumns.split(" ").length
        )
      ).toBe(width < 1280 ? 3 : 4);
      await expect(stockGrid.locator("article")).toHaveCount(8);
      if (width === 1440 && locale === "en") {
        expect((await search.boundingBox())?.width).toBe(1090);
        expect(
          await hero
            .locator("h1")
            .evaluate((element) => getComputedStyle(element).fontSize)
        ).toBe("70px");
      }
      for (const path of [
        "/cars",
        "/sell",
        "/lease",
        "/imports",
        "/contact",
        "/guides",
        "/legal/terms",
      ]) {
        await page.goto(`/${locale}${path}`);
        await expect(
          page.locator('[data-slot="public-route-loading-content"]')
        ).toBeHidden();
        await expect(
          page.locator(desktopHeroSelector).locator("h1").first()
        ).toBeVisible();
        expect(await header.boundingBox()).toEqual(headerBox);
        if (path === "/cars") {
          const sidebar = await page
            .locator('[data-slot="dealer-inventory-sidebar"]')
            .boundingBox();
          const grid = page.locator('[data-slot="marketplace-listing-grid"]');
          const gridBox = await grid.boundingBox();
          expect(sidebar?.width).toBe(width < 1280 ? 240 : 280);
          expect(gridBox?.x).toBeGreaterThan(
            (sidebar?.x ?? 0) + (sidebar?.width ?? 0)
          );
          expect(
            await grid.evaluate(
              (element) =>
                getComputedStyle(element).gridTemplateColumns.split(" ").length
            )
          ).toBe(width < 1280 ? 2 : 3);
          if (width === 1440) {
            expect(sidebar?.x).toBe(60);
            expect(sidebar?.y).toBe(300);
          }
        }
        expect(
          await page.evaluate(
            () => document.documentElement.scrollWidth <= innerWidth
          )
        ).toBe(true);
      }
    }
  }
});

test("desktop navigation keeps the header stable through loading", async ({
  page,
}) => {
  await page.setViewportSize({ width: 1440, height: 1000 });
  await page.goto("/en");
  await expect(
    page.locator('[data-slot="public-route-loading-content"]')
  ).toBeHidden();
  const header = page.locator('[data-slot="dealer-desktop-header"]:visible');
  const initial = await header.boundingBox();
  let documents = 0;
  page.on("request", (request) => {
    if (request.isNavigationRequest() && request.frame() === page.mainFrame()) {
      documents += 1;
    }
  });
  for (const [mode, title] of [
    ["buy", "Cars for sale"],
    ["sell", "Sell us your vehicle"],
    ["lease", "Vehicle financing"],
    ["imports", "Import a vehicle"],
    ["home", "Find Your Perfect Car"],
  ]) {
    await header.locator(`[data-marketplace-mode="${mode}"]`).click();
    await expect(
      page.locator(desktopHeroSelector).locator("h1").first()
    ).toHaveText(title);
    await expect(
      page.locator('[data-slot="public-route-loading-content"]')
    ).toBeHidden();
    expect(await header.boundingBox()).toEqual(initial);
  }
  expect(documents).toBe(0);
});

test.beforeEach(async ({ page }) => {
  await page.addInitScript(() => {
    localStorage.setItem("cars.prompt.v1", "dismissed");
  });
});

test("home search and inventory sidebar apply drafts without losing filters", async ({
  page,
}) => {
  test.setTimeout(120_000);
  for (const width of [1024, 1440, 1920]) {
    await page.setViewportSize({ width, height: 1000 });
    await page.goto("/en");
    const home = page.locator('[data-slot="dealer-desktop-toolbar"]:visible');
    for (const slot of ["category", "make", "model", "price"]) {
      await expect(
        home.locator(`[data-slot="desktop-hero-${slot}"]`)
      ).toBeVisible();
    }
    for (const slot of ["year", "mileage"]) {
      await expect(
        home.locator(`[data-slot="desktop-hero-${slot}"]`)
      ).toBeHidden();
    }
    await home.locator('[data-slot="desktop-hero-price"]').click();
    const dialog = page.getByRole("dialog");
    await dialog
      .getByRole("button", { name: "Up to 40,000 BGN", exact: true })
      .click();
    await dialog.getByRole("button", { name: "Apply", exact: true }).click();
    expect(new URL(page.url()).pathname).toBe("/en");
    await home.locator('[data-slot="desktop-hero-submit"]').click();
    await expect.poll(() => new URL(page.url()).pathname).toBe("/en/cars");
    await expect
      .poll(() => new URL(page.url()).searchParams.get("priceMax"))
      .toBe("40000");
    const sidebar = page.locator('[data-slot="dealer-inventory-sidebar"]');
    for (const slot of [
      "category",
      "make",
      "model",
      "price",
      "year",
      "mileage",
    ]) {
      await expect(
        sidebar.locator(`[data-slot="desktop-hero-${slot}"]`)
      ).toBeVisible();
    }
    await sidebar.getByRole("button", { name: moreFiltersPattern }).click();
    await sidebar.locator('[data-slot="desktop-hero-fuel"]').click();
    await dialog.getByRole("button", { name: "Diesel", exact: true }).click();
    await dialog.getByRole("button", { name: "Apply", exact: true }).click();
    await expect(page).not.toHaveURL(fuelQueryPattern);
    await sidebar.locator('[data-slot="desktop-hero-submit"]').click();
    await expect(page).toHaveURL(dieselResultsPattern);
    expect(new URL(page.url()).searchParams.get("priceMax")).toBe("40000");
    await sidebar.getByRole("button", { name: "Reset", exact: true }).click();
    await sidebar.locator('[data-slot="desktop-hero-submit"]').click();
    await expect(page).not.toHaveURL(fuelQueryPattern);
    await expect
      .poll(() => new URL(page.url()).searchParams.get("priceMax"))
      .toBeNull();
    expect(
      await page.evaluate(
        () => document.documentElement.scrollWidth <= innerWidth
      )
    ).toBe(true);
  }
});

test("desktop listing keeps the gallery, information and phone handoff usable", async ({
  page,
}) => {
  for (const width of [1024, 1440, 1920]) {
    await page.setViewportSize({ width, height: 1000 });
    await page.goto("/en/listing/bmw-x5-m50d-sofia-2020");
    const title = page.locator('[data-slot="listing-summary-header"]');
    const gallery = page.locator('[data-slot="listing-gallery"]');
    const transaction = page.locator('[data-slot="listing-transaction-card"]');
    await expect(title.getByRole("heading", { level: 1 })).toHaveText(
      "2020 BMW X5 M50d"
    );
    const titleBox = await title.boundingBox();
    const galleryBox = await gallery.boundingBox();
    const transactionBox = await transaction.boundingBox();
    const purchaseBox = await page
      .locator('[data-slot="listing-purchase-column"]')
      .boundingBox();
    if (!(titleBox && galleryBox && transactionBox)) {
      throw new Error("Desktop vehicle information must be visible");
    }
    expect(titleBox.y + titleBox.height).toBeLessThan(galleryBox.y);
    expect(purchaseBox?.y).toBeCloseTo(galleryBox.y, 0);
    expect(transactionBox.y - (purchaseBox?.y ?? 0)).toBe(31);
    expect(transactionBox.x).toBeGreaterThan(galleryBox.x + galleryBox.width);
    await expect(transaction.locator('a[href^="tel:"]')).toBeVisible();
    const openPhoto = gallery.getByRole("button", {
      name: "Open photo 1 of 1 full screen",
      exact: true,
    });
    await openPhoto.click();
    await expect(page.getByRole("dialog")).toBeVisible();
    await page.keyboard.press("Escape");
    await expect(page.getByRole("dialog")).toBeHidden();
    await expect(openPhoto).toBeFocused();
    const sections = page.locator('[data-slot="listing-details-tabs-desktop"]');
    await sections
      .getByRole("tab", { name: "Information", exact: true })
      .click();
    await expect(sections.locator('[role="tabpanel"]:visible')).toHaveAttribute(
      "id",
      "listing-desktop-panel-information"
    );
    await page.keyboard.press("ArrowRight");
    await expect(sections.locator('[role="tabpanel"]:visible')).toHaveAttribute(
      "id",
      "listing-desktop-panel-specifications"
    );
  }
});

test("financing selection and preferences survive navigation and clearing", async ({
  page,
}) => {
  test.setTimeout(120_000);
  await page.setViewportSize({ width: 1440, height: 1000 });
  await page.goto("/en/lease");
  const selector = page.locator('[data-slot="lease-desktop-vehicle-trigger"]');
  await expect(selector).toHaveAttribute("data-selected", "false");
  await expect(
    page.locator('[data-slot="finance-actions"] button')
  ).toBeDisabled();
  await selector.click();
  const dialog = page.getByRole("dialog");
  const search = dialog.getByRole("searchbox");
  await expect(search).toBeFocused();
  await search.fill("no-such-car-xyz");
  await expect(
    dialog.getByText("No vehicles found. Try another make or model.")
  ).toBeVisible();
  await search.fill("BMW X5");
  await dialog
    .locator('[data-slot="lease-vehicle-option"] button')
    .first()
    .click();
  await expect(dialog).toBeHidden();
  await expect(selector).toBeFocused();
  await expect(selector).toHaveAttribute("data-selected", "true");
  await expect(
    page.getByRole("link", { name: "View vehicle", exact: true })
  ).toHaveCount(0);
  await selector.click();
  await expect(search).toHaveValue("");
  await expect(dialog.locator('[data-vehicle-selected="true"]')).toHaveCount(1);
  const selectedTitle = await dialog
    .locator('[data-slot="lease-selected-vehicle-title"]')
    .nth(1)
    .getAttribute("title");
  await dialog
    .locator('[data-slot="lease-vehicle-option"] button')
    .nth(1)
    .click();
  await expect(
    page.locator('[data-slot="lease-desktop-selected-title"]')
  ).toHaveText(selectedTitle ?? "");
  const deposit = page.locator('[name="desktop-finance-deposit"][value="30"]');
  const term = page.locator('[name="desktop-finance-term"][value="36"]');
  const principal = page.locator('[data-slot="finance-principal"]');
  const initialPrincipal = await principal.textContent();
  await deposit.check();
  await expect(principal).not.toHaveText(initialPrincipal ?? "");
  const updatedPrincipal = await principal.textContent();
  await term.check();
  await expect(principal).toHaveText(updatedPrincipal ?? "");
  await page
    .locator(
      '[data-slot="dealer-desktop-header"] [data-marketplace-mode="home"]'
    )
    .click();
  await expect(page.locator("#desktop-home-title")).toBeVisible();
  await page.goBack();
  await expect(
    page.locator('[data-slot="lease-desktop-selected-title"]')
  ).toHaveText(selectedTitle ?? "");
  await expect(deposit).toBeChecked();
  await expect(term).toBeChecked();
  await page.reload();
  await expect(
    page.locator('[data-slot="lease-desktop-selected-title"]')
  ).toHaveText(selectedTitle ?? "");
  await expect(term).toBeChecked();
  const flexible = page.locator(
    '[name="desktop-finance-deposit"][value="flexible"]'
  );
  await flexible.check();
  await expect(principal).toHaveText("To be agreed");
  await page.reload();
  await expect(flexible).toBeChecked();
  await expect(page.locator('[data-slot="finance-actions"] a')).toHaveAttribute(
    "href",
    phonePattern
  );
  await page
    .getByRole("button", { name: "Clear selection", exact: true })
    .click();
  await expect(selector).toHaveAttribute("data-selected", "false");
  await expect(selector).toBeFocused();
  await expect(page.getByRole("dialog")).toBeHidden();
  await expect(principal).toHaveText("—");
  await expect(
    page.locator('[data-slot="finance-actions"] button')
  ).toBeDisabled();
  await expect(page).not.toHaveURL(vehicleQueryPattern);
  await expect(flexible).toBeChecked();
  await expect(term).toBeChecked();
  await page.reload();
  await expect(selector).toHaveAttribute("data-selected", "false");
});

test("desktop import has one focus treatment and carries the listing into the request", async ({
  page,
}) => {
  await page.goto("/en/imports");
  const input = page.locator('search input[name="sourceUrl"]:visible');
  await input.click();
  const focus = await input.evaluate((element) => {
    const field = element as HTMLInputElement;
    const fieldStyle = getComputedStyle(field);
    if (!field.form) {
      throw new Error("Import link input must belong to a form");
    }
    const formStyle = getComputedStyle(field.form);
    return {
      fieldOutline: fieldStyle.outlineStyle,
      formOutline: formStyle.outlineStyle,
      formColor: formStyle.outlineColor,
    };
  });
  expect(focus.fieldOutline).toBe("none");
  expect(focus.formOutline).toBe("solid");
  expect(focus.formColor).not.toBe("rgb(17, 117, 222)");
  const sourceUrl = "https://example.com/vehicles/test-car";
  await input.fill(sourceUrl);
  await page
    .locator("search:visible")
    .getByRole("button", { name: "Request a quote" })
    .click();
  await expect(page).toHaveURL(sourceQueryPattern);
  await expect(page.locator("#import-request")).toBeVisible();
  await expect(
    page.locator('#import-request input[name="sourceUrl"]')
  ).toHaveValue(sourceUrl);
});
