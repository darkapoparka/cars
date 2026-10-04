import { expect, test } from "@playwright/test";

const modelStage = { bg: /^Модел/, en: /^Model/ };

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
  test(`inventory controls center Filters and Sort and keep preview choices secondary (${locale})`, async ({
    page,
  }) => {
    const isBg = locale === "bg";
    for (const width of [1024, 1440, 1920]) {
      await page.setViewportSize({ width, height: 1000 });
      await page.goto(`/${locale}/cars`);
      const hero = page.locator('[data-slot="dealer-desktop-inventory-hero"]');
      const bar = page.locator('[data-slot="dealer-inventory-filters"]');
      const controls = bar.locator('[data-slot="desktop-results-controls"]');
      const filters = controls.locator('[data-slot="desktop-primary-control"]');
      await expect(filters).toBeVisible();
      await expect(controls.getByRole("combobox")).toBeVisible();
      await expect(
        hero.locator('[data-slot="desktop-primary-control"]')
      ).toHaveCount(0);
      const frame = await bar.boundingBox();
      const box = await controls.boundingBox();
      expect(
        frame &&
          box &&
          Math.abs(box.x + box.width / 2 - frame.x - frame.width / 2)
      ).toBeLessThan(1);
      const view = await bar
        .getByRole("button", {
          name: isBg ? "Изглед в решетка" : "Grid view",
          exact: true,
        })
        .boundingBox();
      expect(view?.x).toBeGreaterThan((box?.x ?? 0) + (box?.width ?? 0));
      await bar.locator('[data-slot="dealer-inventory-preview"]').click();
      await expect(
        page.getByRole("menuitemradio", {
          name: isBg ? "Бързи филтри" : "Quick filters",
          exact: true,
        })
      ).toHaveAttribute("aria-checked", "true");
      await expect(
        page.getByRole("menuitemradio", {
          name: isBg ? "Страничен панел" : "Sidebar",
          exact: true,
        })
      ).toBeVisible();
      await page.keyboard.press("Escape");
      await expect(
        bar.locator('[data-slot="dealer-inventory-preview"]')
      ).toBeFocused();
      expect(
        await page.evaluate(
          () => document.documentElement.scrollWidth <= innerWidth
        )
      ).toBe(true);
    }
  });

  test(`focused Model and Price dialogs preserve unrelated filters when applying and clearing (${locale})`, async ({
    page,
  }) => {
    const isBg = locale === "bg";
    await page.goto(
      `/${locale}/cars?make=BMW&fuel=diesel&priceMax=150000&sort=price_asc`
    );
    const hero = page.locator('[data-slot="dealer-desktop-inventory-hero"]');
    const model = hero.getByRole("button", {
      name: isBg ? "Модел" : "Model",
      exact: true,
    });
    await model.click();
    const dialog = page.locator('[data-slot="desktop-focused-filter-dialog"]');
    await expect(dialog).toHaveAttribute("data-filter-entry", "model");
    await expect(
      dialog.getByRole("tab", { name: modelStage[locale] })
    ).toHaveAttribute("data-state", "active");
    await expect(
      dialog.locator('[data-slot="desktop-full-filter-navigation"]')
    ).toHaveCount(0);
    await dialog.getByRole("searchbox").fill("X5");
    await dialog.locator('[data-slot="model-option"]').click();
    const apply = dialog.getByRole("button", {
      name: isBg ? "Покажи обявите" : "Show results",
      exact: true,
    });
    await apply.click();
    await expect
      .poll(() => new URL(page.url()).searchParams.get("model"))
      .toBe("X5");
    const price = hero.getByRole("button", {
      name: isBg ? "Цена" : "Price",
      exact: true,
    });
    await price.click();
    await expect(dialog).toHaveAttribute("data-filter-entry", "price");
    const maximum = dialog.getByRole("spinbutton", {
      name: isBg ? "Максимална цена" : "Maximum price",
      exact: true,
    });
    await expect(dialog.getByRole("spinbutton").first()).toBeFocused();
    await maximum.fill("100000");
    await page.keyboard.press("Escape");
    await expect(price).toBeFocused();
    expect(new URL(page.url()).searchParams.get("priceMax")).toBe("150000");
    await price.click();
    await expect(maximum).toHaveValue("150000");
    await dialog.locator('[data-slot="desktop-full-filter-reset"]').click();
    await apply.click();
    await expect
      .poll(() => new URL(page.url()).searchParams.get("priceMax"))
      .toBeNull();
    const selected = new URL(page.url()).searchParams;
    // The URL serializer keeps the catalogue's default currency without a range.
    expect(selected.get("currency")).toBe("BGN");
    expect(selected.get("priceMin")).toBeNull();
    expect(selected.get("make")).toBe("BMW");
    expect(selected.get("model")).toBe("X5");
    expect(selected.get("fuel")).toBe("diesel");
    expect(selected.get("sort")).toBe("price_asc");
  });

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
    const dialog = page.locator('[data-slot="desktop-focused-filter-dialog"]');
    await expect(page.getByRole("dialog")).toHaveCount(1);
    await expect(
      dialog.locator(
        '[data-slot="desktop-full-filter-navigation"] [role="tab"]'
      )
    ).toHaveCount(0);
    await expect(dialog).toHaveAttribute("data-filter-entry", "search");
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
    const allFilters = bar.locator('[data-slot="desktop-primary-control"]');
    await allFilters.click();
    const fullDialog = page.locator('[data-slot="desktop-full-filter-dialog"]');
    await expect(
      fullDialog.getByRole("tab", {
        name: isBg ? "Автомобил" : "Vehicle",
        exact: true,
      })
    ).toHaveAttribute("data-state", "active");
    await expect(
      fullDialog
        .locator('[data-slot="desktop-full-filter-navigation"]')
        .getByRole("tab")
    ).toHaveCount(4);
    await page.keyboard.press("Escape");
    await expect(allFilters).toBeFocused();
  });
}
