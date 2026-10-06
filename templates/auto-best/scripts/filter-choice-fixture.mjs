import assert from 'node:assert/strict';

export async function chooseListingOption(page, scope, field, value) {
  await scope.locator(`[data-field="${field}"] button`).click();
  const menu = page.locator('.dn-filter-picker');
  await menu.locator(`input[value="${value}"]`).click();
  if (field === 'make' || field === 'model') await page.keyboard.press('Escape');
  await menu.waitFor({ state: 'hidden' });
  assert.equal(await scope.locator(`[data-field="${field}"] button`).evaluate(node => node === document.activeElement), true, 'Choosing a value returns focus to its field');
}

export const listingFormValue = (scope, field) => scope.evaluate((node, field) => {
  const form = node instanceof HTMLFormElement ? node : node.querySelector('form');
  return new FormData(form).get(field) ?? '';
}, field);
