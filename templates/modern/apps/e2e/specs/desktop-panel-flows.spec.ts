import { expect, test } from "@playwright/test";

const dieselResultsPattern = /\/en\/cars\?.*fuel=diesel/;
const fuelQueryPattern = /fuel=/;
const phonePattern = /^tel:/;
const sourceQueryPattern = /sourceUrl=/;
const vehicleQueryPattern = /[?&]vehicle=/;
const moreFiltersPattern = /More filters/;
const desktopHeroSelector =
  '[data-slot="dealer-desktop-home-hero"], [data-slot="dealer-desktop-context-hero"]';

test("desktop home has a photographic hero and inner routes align their content", async ({
  page,
}) => {
  test.setTimeout(120_000);
  for (const width of [1024, 1440, 1920]) {
    await page.setViewportSize({ width, height: 1000 });
    for (const locale of ["en", "bg"]) {
      let reference: { x: number; width: number } | undefined;
      let headerReference: { x: number; width: number } | undefined;
      for (const path of ["", "/cars", "/sell", "/lease", "/imports"]) {
        await page.goto(`/${locale}${path}`);
        await expect(
          page.locator('[data-slot="public-route-loading-content"]')
        ).toBeHidden();
        const hero = page.locator(desktopHeroSelector);
        const panel = await hero
          .locator("[data-desktop-action-panel]")
          .boundingBox();
        const headerFrame = await page
          .locator('[data-slot="dealer-desktop-header"] > div')
          .boundingBox();
        const heading = await hero
          .locator("h1")
          .first()
          .evaluate((element) => {
            const box = element.parentElement?.getBoundingClientRect();
            return box ? { x: box.x, width: box.width } : null;
          });
        if (!(panel && heading && headerFrame)) {
          throw new Error(
            "The desktop heading and action panel must be visible"
          );
        }
        expect(panel.width).toBeLessThanOrEqual(1280);
        expect(panel.x).toBeGreaterThanOrEqual(24);
        expect(panel.height).toBeGreaterThan(0);
        expect(panel.height).toBeLessThan(600);
        expect(panel.x).toBeGreaterThanOrEqual(headerFrame.x);
        expect(panel.x + panel.width).toBeLessThanOrEqual(
          headerFrame.x + headerFrame.width
        );
        if (path === "") {
          await expect(hero.locator("h1").first()).toBeVisible();
          expect(
            await hero.evaluate(
              (element) => getComputedStyle(element).backgroundImage
            )
          ).toContain("url(");
          await expect(
            page.locator('[data-slot="dealer-desktop-discovery-content"]')
          ).toBeVisible();
          await expect(
            page.locator('[data-slot="dealer-inventory-summary"]')
          ).toBeHidden();
        } else if (path === "/cars") {
          const inventoryTitle = page.locator(
            '[data-slot="dealer-inventory-summary"] h2'
          );
          await expect(inventoryTitle).toBeVisible();
          expect((await inventoryTitle.boundingBox())?.x).toBeCloseTo(
            panel.x,
            0
          );
        } else {
          await expect(hero.locator("h1").first()).toBeVisible();
          expect(heading.x).toBeCloseTo(panel.x, 0);
          expect(heading.width).toBeCloseTo(panel.width, 0);
        }
        if (path !== "" && reference) {
          expect(panel.x).toBeCloseTo(reference.x, 0);
          expect(panel.width).toBeCloseTo(reference.width, 0);
        } else if (path !== "") {
          reference = { x: panel.x, width: panel.width };
        }
        if (headerReference) {
          expect(headerFrame.x).toBeCloseTo(headerReference.x, 0);
          expect(headerFrame.width).toBeCloseTo(headerReference.width, 0);
        } else {
          headerReference = headerFrame;
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
    ["home", "Find your next car"],
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

test("home and inventory keep the same quick filters and submit their draft", async ({
  page,
}) => {
  for (const width of [1024, 1440, 1920]) {
    await page.setViewportSize({ width, height: 1000 });
    await page.goto("/en");
    await expect(
      page.locator('[data-slot="public-route-loading-content"]')
    ).toBeHidden();
    const panel = page.locator('[data-slot="dealer-desktop-toolbar"]');
    const home = await panel.boundingBox();
    await expect(
      page.locator('[data-slot="dealer-desktop-home-hero"] h1')
    ).toBeVisible();
    for (const slot of ["make", "model", "price", "year", "mileage"]) {
      await expect(
        panel.locator(`[data-slot="desktop-hero-${slot}"]`)
      ).toBeVisible();
    }
    await page.goto("/en/cars");
    await expect(
      page.locator('[data-slot="public-route-loading-content"]')
    ).toBeHidden();
    const inventory = await panel.boundingBox();
    expect(home?.width).toBeGreaterThan(0);
    expect(inventory?.width).toBeGreaterThan(0);
    expect(inventory?.height).not.toBe(home?.height);
    const controls = page.locator('[data-slot="desktop-results-controls"]');
    await expect(controls).toBeVisible();
    await expect(
      panel.locator('[data-slot="desktop-results-controls"]')
    ).toHaveCount(0);
    const controlBox = await controls.boundingBox();
    expect(controlBox?.y).toBeGreaterThan(
      (inventory?.y ?? 0) + (inventory?.height ?? 0)
    );
    const summaryBox = await page
      .locator('[data-slot="dealer-inventory-summary"]')
      .boundingBox();
    if (!(controlBox && summaryBox)) {
      throw new Error("Inventory filter and sort controls must be visible");
    }
    expect(controlBox.x).toBeGreaterThanOrEqual(summaryBox.x);
    expect(controlBox.x + controlBox.width).toBeLessThanOrEqual(
      summaryBox.x + summaryBox.width
    );
    expect(
      Math.abs(
        controlBox.y +
          controlBox.height / 2 -
          summaryBox.y -
          summaryBox.height / 2
      )
    ).toBeLessThan(1);
    const inputBox = await panel.locator("label").first().boundingBox();
    const submitBox = await panel
      .locator('[data-slot="desktop-hero-submit"]')
      .boundingBox();
    if (!(inputBox && submitBox)) {
      throw new Error("Search input and submit action must be visible");
    }
    expect(submitBox.x).toBeGreaterThanOrEqual(inputBox.x);
    expect(submitBox.x + submitBox.width).toBeLessThanOrEqual(
      inputBox.x + inputBox.width
    );
    expect(submitBox.y).toBeGreaterThanOrEqual(inputBox.y);
    expect(submitBox.y + submitBox.height).toBeLessThanOrEqual(
      inputBox.y + inputBox.height
    );
    const bodyBox = await page.locator("body").boundingBox();
    expect(bodyBox?.width).toBeCloseTo(
      await page.evaluate(() =>
        Number.parseFloat(getComputedStyle(document.documentElement).width)
      ),
      0
    );
    expect(bodyBox?.x).toBe(0);
    expect(
      await page
        .locator("body")
        .evaluate((element) => getComputedStyle(element).boxShadow)
    ).toBe("none");
    const grid = page.locator('[data-slot="marketplace-listing-grid"]');
    expect(
      await grid.evaluate(
        (element) =>
          getComputedStyle(element).gridTemplateColumns.split(" ").length
      )
    ).toBe(width < 1200 ? 2 : 3);
  }

  await page.goto("/en");
  await page.getByRole("button", { name: "More filters", exact: true }).click();
  await page.locator('[data-slot="desktop-hero-fuel"]').click();
  const dialog = page.getByRole("dialog");
  await dialog.getByRole("button", { name: "Diesel", exact: true }).click();
  await dialog.getByRole("button", { name: "Apply", exact: true }).click();
  await page.locator('[data-slot="desktop-hero-submit"]').click();
  await expect(page).toHaveURL(dieselResultsPattern);
  await page.getByRole("button", { name: moreFiltersPattern }).click();
  await expect(page.locator('[data-slot="desktop-hero-fuel"]')).toHaveText(
    "Diesel"
  );
  await page.getByRole("button", { name: "Reset", exact: true }).click();
  await page.locator('[data-slot="desktop-hero-submit"]').click();
  await expect(page).not.toHaveURL(fuelQueryPattern);
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
    if (!(titleBox && galleryBox && transactionBox)) {
      throw new Error("Desktop vehicle information must be visible");
    }
    expect(titleBox.y + titleBox.height).toBeLessThan(galleryBox.y);
    expect(transactionBox.y).toBeCloseTo(galleryBox.y, 0);
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
