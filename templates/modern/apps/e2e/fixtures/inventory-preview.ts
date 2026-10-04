import { expect, type Page } from "@playwright/test";

export async function selectInventoryFilterLayout(
  page: Page,
  layout: "quick" | "sidebar",
  locale = "en"
) {
  const isBg = locale === "bg";
  const names = {
    quick: isBg ? "Бързи филтри" : "Quick filters",
    sidebar: isBg ? "Страничен панел" : "Sidebar",
  };
  await expect(
    page.locator('[data-slot="dropdown-menu-content"]')
  ).toBeHidden();
  await page.locator('[data-slot="dealer-inventory-preview"]').click();
  await page
    .getByRole("menuitemradio", { name: names[layout], exact: true })
    .click();
  await expect(
    page.locator('[data-slot="dropdown-menu-content"]')
  ).toBeHidden();
  await expect(
    page.locator('[data-slot="dealer-inventory-filters"]')
  ).toHaveAttribute("data-filter-layout", layout);
}
