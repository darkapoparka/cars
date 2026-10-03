import { expect, test } from "@playwright/test";

test("desktop shortlist persists, updates across tabs and closes below its breakpoint", async ({
  page,
  context,
}) => {
  await page.goto("/en");
  const bookmark = page
    .locator('[data-slot="home-stock-grid"] [data-slot="desktop-save-car"]')
    .first();
  await expect(bookmark).toHaveAttribute("aria-pressed", "false");
  await bookmark.click();
  await expect(bookmark).toHaveAttribute("aria-pressed", "true");
  const saved = page.locator('header [data-slot="desktop-saved-cars"]');
  await expect(saved).toHaveText("Saved (1)");
  await page.reload();
  await expect(saved).toHaveText("Saved (1)");
  await saved.click();
  const dialog = page.getByRole("dialog", { name: "Saved cars", exact: true });
  await expect(dialog.locator("article")).toHaveCount(1);
  await page.keyboard.press("Escape");
  await expect(dialog).toBeHidden();
  await expect(saved).toBeFocused();
  const second = await context.newPage();
  await second.goto("/en");
  await second
    .locator('[data-slot="home-stock-grid"] [data-slot="desktop-save-car"]')
    .first()
    .click();
  await expect(saved).toHaveText("Saved");
  await second.close();
  await saved.click();
  await expect(
    dialog.getByText("Bookmark a car to keep your shortlist here.")
  ).toBeVisible();
  await page.setViewportSize({ width: 390, height: 844 });
  await expect(page.locator("dialog[open]")).toHaveCount(0);
  await expect(
    page.locator('[data-slot="dealer-desktop-header"]')
  ).toBeHidden();
  await expect(page.locator('[data-slot="dealer-bottom-nav"]')).toBeVisible();
});

test("desktop enquiry previews locally, preserves viewing intent and clears stale feedback", async ({
  page,
}) => {
  await page.goto("/en/contact?intent=viewing");
  const form = page.locator('[data-slot="desktop-contact-preview-form"]');
  await expect(form.locator('[name="interest"]')).toHaveValue("viewing");
  await form
    .getByRole("button", { name: "Preview enquiry", exact: true })
    .click();
  await expect(form.locator("output")).toHaveCount(0);
  await form.getByLabel("Full name", { exact: true }).fill("Preview visitor");
  await form
    .getByLabel("Email address", { exact: true })
    .fill("preview@example.com");
  await form
    .getByLabel("Your message", { exact: true })
    .fill("I would like to arrange a viewing.");
  const posts: string[] = [];
  page.on("request", (request) => {
    if (request.method() === "POST") {
      posts.push(request.url());
    }
  });
  await form
    .getByRole("button", { name: "Preview enquiry", exact: true })
    .click();
  await expect(form.locator("output")).toContainText("No message was sent.");
  await expect(form.locator('output a[href^="tel:"]')).toBeVisible();
  expect(posts).toEqual([]);
  await form
    .getByLabel("Your message", { exact: true })
    .fill("A different viewing question.");
  await expect(form.locator("output")).toHaveCount(0);
  const action = page.locator('footer a[data-slot="button"]');
  expect(
    await action.evaluate((element) => {
      const style = getComputedStyle(element);
      return style.color !== style.backgroundColor;
    })
  ).toBe(true);
});
