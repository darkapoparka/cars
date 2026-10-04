import { expect, test } from "@playwright/test";

test.beforeEach(async ({ context, baseURL, page }) => {
  // biome-ignore lint/suspicious/noSkippedTests: This control is hidden below the desktop breakpoint.
  test.skip(
    (page.viewportSize()?.width ?? 0) < 1024,
    "Desktop inventory search"
  );
  if (!baseURL) {
    throw new Error("Inventory search requires a preview origin");
  }
  const response = await context.request.post("/api/preferences", {
    headers: { origin: new URL(baseURL).origin },
    data: { action: "dismiss", locale: "bg", country: "BG", returnTo: "/cars" },
  });
  expect(response.status()).toBe(200);
});

for (const locale of ["bg", "en"] as const) {
  test(`inventory search box shares filters, cancels drafts and restores focus (${locale})`, async ({
    page,
  }) => {
    const isBg = locale === "bg";
    await page.goto(
      `/${locale}/cars?fuel=diesel&priceMax=150000&sort=price_asc`
    );
    const bar = page.locator('[data-slot="dealer-inventory-filters"]');
    const hero = page.locator('[data-slot="dealer-desktop-inventory-hero"]');
    const searchBox = hero.locator('[data-slot="dealer-inventory-search"]');
    await expect(searchBox).toBeVisible();
    await expect(
      bar.locator('[data-slot="dealer-inventory-search"]')
    ).toHaveCount(0);
    const heroBounds = await hero.boundingBox();
    const searchBounds = await searchBox.boundingBox();
    expect(
      heroBounds &&
        searchBounds &&
        searchBounds.y + searchBounds.height <= heroBounds.y + heroBounds.height
    ).toBeTruthy();
    await expect(
      searchBox.locator('[data-slot="dealer-inventory-search-field"]')
    ).toHaveCount(3);
    await expect(
      searchBox.getByRole("button", {
        name: isBg ? "Цена" : "Price",
        exact: true,
      })
    ).toContainText("150");
    const trigger = searchBox.locator(
      '[data-slot="dealer-inventory-search-open"]'
    );
    const originalUrl = page.url();
    await trigger.click();
    const dialog = page.locator('[data-slot="desktop-full-filter-dialog"]');
    await expect(page.getByRole("dialog")).toHaveCount(1);
    await expect(
      dialog.locator(
        '[data-slot="desktop-full-filter-navigation"] [role="tab"]'
      )
    ).toHaveCount(13);
    const keyword = dialog.getByRole("searchbox");
    await expect(keyword).toBeFocused();
    await keyword.fill("X5");
    expect(page.url()).toBe(originalUrl);
    await page.keyboard.press("Escape");
    await expect(dialog).toBeHidden();
    await expect(trigger).toBeFocused();
    expect(
      await trigger.evaluate((button) => {
        const style = getComputedStyle(button);
        return style.outlineStyle !== "none" || style.boxShadow !== "none";
      })
    ).toBe(true);
    await trigger.click();
    await expect(keyword).toHaveValue("");
    await keyword.fill("X5");
    await dialog
      .getByRole("button", {
        name: isBg ? "Покажи обявите" : "Show results",
        exact: true,
      })
      .click();
    await expect
      .poll(() => new URL(page.url()).searchParams.get("q"))
      .toBe("X5");
    expect(new URL(page.url()).searchParams.get("priceMax")).toBe("150000");
    expect(new URL(page.url()).searchParams.get("fuel")).toBe("diesel");
    expect(new URL(page.url()).searchParams.get("sort")).toBe("price_asc");
    await bar
      .locator(
        '[data-slot="dealer-inventory-active-filter"][data-filter-id="q"]'
      )
      .click();
    await expect
      .poll(() => new URL(page.url()).searchParams.get("q"))
      .toBeNull();
    expect(new URL(page.url()).searchParams.get("priceMax")).toBe("150000");
    expect(new URL(page.url()).searchParams.get("fuel")).toBe("diesel");
    const allFilters = hero.locator('[data-slot="desktop-primary-control"]');
    await allFilters.click();
    await expect(
      dialog.getByRole("tab", {
        name: isBg ? "Филтър: Марка и модел" : "Filter: Make and model",
        exact: true,
      })
    ).toHaveAttribute("data-state", "active");
    await page.keyboard.press("Escape");
    await expect(allFilters).toBeFocused();
  });
}
