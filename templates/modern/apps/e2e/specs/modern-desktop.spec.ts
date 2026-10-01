import { mkdir } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import AxeBuilder from "@axe-core/playwright";
import { expect, type Page, test } from "@playwright/test";

const evidencePath = fileURLToPath(
  new URL("../../../docs/desktop-2026-10-01/", import.meta.url)
);
const filteredInventoryPattern = /\/bg\/cars\?.*make=BMW/;
const inventoryPattern = /\/bg\/cars$/;
const ascendingPricePattern = /sort=price_asc/;
const listingPattern = /\/listing\//;
const routes = [
  "",
  "/cars",
  "/listing/bmw-x5-m50d-sofia-2020",
  "/imports",
  "/sell",
  "/lease",
  "/contact",
  "/guides",
];

async function expectDesktopReflow(page: Page) {
  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth - window.innerWidth
    )
  ).toBeLessThanOrEqual(1);
  const header = page.locator('[data-slot="dealer-desktop-header"]');
  await expect(header).toBeVisible();
  expect(
    await header.locator("a").evaluateAll((links) =>
      links.every((link) => {
        const box = link.getBoundingClientRect();
        return (
          box.width === 0 || (box.left >= 0 && box.right <= window.innerWidth)
        );
      })
    )
  ).toBe(true);
}

test.beforeEach(async ({ page }) => {
  // Exercise the static preview without contacting an enquiry recipient.
  await page.route("**/api/contact", (route) => route.abort());
  await page.route("**/api/finance", (route) => route.abort());
});

for (const locale of ["bg", "en"]) {
  for (const width of [1024, 1280, 1440, 1920]) {
    test(`${locale} desktop routes reflow at ${width}px`, async ({ page }) => {
      await page.setViewportSize({ width, height: 1000 });
      const pageErrors: string[] = [];
      page.on("pageerror", (error) => pageErrors.push(error.message));
      for (const route of routes) {
        const response = await page.goto(`/${locale}${route}`);
        expect(response?.status()).toBe(200);
        await expect(page.locator("h1:visible")).toHaveCount(1);
        await expectDesktopReflow(page);
        if (locale === "bg" && width === 1440 && route === "") {
          await expect
            .poll(() =>
              page
                .locator('[data-slot="desktop-featured-vehicle"] img')
                .evaluate(
                  (image: HTMLImageElement) =>
                    image.complete && image.naturalWidth > 0
                )
            )
            .toBe(true);
          await mkdir(evidencePath, { recursive: true });
          await page.screenshot({ path: `${evidencePath}/home-1440.png` });
          await page.screenshot({
            path: `${evidencePath}/home-full-1440.png`,
            fullPage: true,
          });
        }
        if (
          locale === "bg" &&
          width === 1440 &&
          route === "/listing/bmw-x5-m50d-sofia-2020"
        ) {
          await expect
            .poll(() =>
              page
                .locator('[data-slot="listing-gallery-stage"] img')
                .first()
                .evaluate(
                  (image: HTMLImageElement) =>
                    image.complete && image.naturalWidth > 0
                )
            )
            .toBe(true);
          await page.screenshot({ path: `${evidencePath}/listing-1440.png` });
        }
      }
      expect(pageErrors).toEqual([]);
    });
  }
}

test("search submits one draft with make, model and advanced filters", async ({
  page,
}) => {
  await page.goto("/bg");
  const advanced = page.locator('[data-slot="desktop-advanced-filters"]');
  await expect(advanced).not.toHaveAttribute("open");
  await advanced.locator("summary").press("Enter");
  await expect(advanced).toHaveAttribute("open", "");
  await page.locator('[data-slot="desktop-hero-fuel"]').click();
  await page
    .getByRole("dialog")
    .getByRole("button", { name: "Дизел", exact: true })
    .click();
  await page
    .getByRole("dialog")
    .getByRole("button", { name: "Приложи", exact: true })
    .click();
  await page.locator('[data-slot="desktop-hero-make"]').click();
  const picker = page.getByRole("dialog");
  await picker.getByRole("button", { name: "BMW", exact: true }).click();
  await picker.getByRole("button", { name: "X5", exact: true }).click();
  await picker.getByRole("button", { name: "Приложи", exact: true }).click();
  expect(new URL(page.url()).search).toBe("");
  await page.locator('[data-slot="desktop-hero-submit"]').click();
  await expect(page).toHaveURL(filteredInventoryPattern);
  const query = new URL(page.url()).searchParams;
  expect(query.get("model")).toBe("X5");
  expect(query.get("fuel")).toBe("diesel");
  await expect(
    page.locator('[data-slot="desktop-advanced-filters"]')
  ).toHaveAttribute("open", "");
  await expect(page.locator('[data-slot="dealer-inventory-count"]')).toHaveText(
    "2 автомобила"
  );
  await page
    .locator('[data-slot="dealer-desktop-toolbar"]')
    .getByRole("button", { name: "Изчисти", exact: true })
    .click();
  await page.locator('[data-slot="desktop-hero-submit"]').click();
  await expect(page).toHaveURL(inventoryPattern);
  await expect(page.locator('[data-slot="dealer-inventory-count"]')).toHaveText(
    "12 автомобила"
  );
});

test("inventory preserves sort and chosen grid or list layout", async ({
  page,
}) => {
  await page.goto("/bg/cars");
  await page
    .getByRole("button", { name: "Изглед в решетка", exact: true })
    .click();
  await expect(
    page.locator('[data-slot="marketplace-listing-grid"]')
  ).toHaveAttribute("data-view", "grid");
  await page
    .getByLabel("Подреждане", { exact: true })
    .selectOption("price_asc");
  await expect(page).toHaveURL(ascendingPricePattern);
  await page
    .getByRole("button", { name: "Списъчен изглед", exact: true })
    .click();
  await expect(
    page.locator('[data-slot="marketplace-listing-grid"]')
  ).toHaveAttribute("data-view", "list");
  await page.reload();
  await expect(
    page.locator('[data-slot="marketplace-listing-grid"]')
  ).toHaveAttribute("data-view", "list");
  await expectDesktopReflow(page);
});

test("vehicle spotlight, gallery, keyboard tabs and return navigation work", async ({
  page,
}) => {
  await page.goto("/bg");
  await page.locator('[data-slot="desktop-featured-vehicle"]').click();
  await expect(page).toHaveURL(listingPattern);
  await expect(
    page.locator('[data-slot="listing-transaction-card"]')
  ).toBeVisible();
  await expect(
    page.locator('dl[aria-label="Основни характеристики"]')
  ).toContainText("167 000 км");
  await page
    .locator('[data-slot="listing-gallery-stage"] button')
    .first()
    .click();
  await expect(page.getByRole("dialog")).toBeVisible();
  await page.keyboard.press("Escape");
  await expect(page.getByRole("dialog")).toHaveCount(0);
  const tabs = page.locator('[data-slot="listing-details-tabs-desktop"]');
  await tabs.getByRole("tab", { name: "Обзор", exact: true }).focus();
  await page.keyboard.press("ArrowRight");
  await expect(
    tabs.getByRole("tab", { name: "Информация", exact: true })
  ).toHaveAttribute("aria-selected", "true");
  await page.keyboard.press("End");
  await expect(
    tabs.getByRole("tab", { name: "Екстри", exact: true })
  ).toHaveAttribute("aria-selected", "true");
  await page
    .getByRole("link", { name: "Назад към търсенето", exact: true })
    .click();
  await expect(page).toHaveURL(inventoryPattern);
});

test("home and inventory meet the focused accessibility gate", async ({
  page,
}) => {
  for (const path of ["/bg", "/bg/cars"]) {
    await page.goto(path);
    const scan = await new AxeBuilder({ page })
      .withTags(["wcag2a", "wcag2aa", "wcag21aa"])
      .analyze();
    expect(scan.violations).toEqual([]);
  }
});
