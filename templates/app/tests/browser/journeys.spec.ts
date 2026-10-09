import {test, expect, open, dismissDialog, locales, firstVehicle} from './support';

for (const locale of locales) for (const variant of ['', '/2']) {
  test(locale + variant + ' journeys are navigable and fit the viewport', async ({page}) => {
    for (const section of ['', '/cars', '/saved', '/sell', '/finance', '/service']) await open(page, locale + variant + section);
  });
}
test('sorting survives reload without mutating the source catalogue', async ({page}) => {
  await open(page, locales[0] + '/cars?order=price-asc');
  const prices = await page.locator('article[data-price]').evaluateAll(cards => cards.map(card => Number(card.getAttribute('data-price'))).filter(price => price > 0));
  expect(prices).toEqual([...prices].sort((a, b) => a - b));
  await page.reload();
  await expect(page).toHaveURL(/order=price-asc/);
  expect(await page.locator('article[data-price]').evaluateAll(cards => cards.map(card => Number(card.getAttribute('data-price'))).filter(price => price > 0))).toEqual(prices);
});
test('unknown searches produce an empty state instead of a route error', async ({page}) => {
  await open(page, locales[0] + '/cars?q=definitely-no-such-vehicle-pro-review');
  await expect(page.locator('article[data-price]')).toHaveCount(0);
});
test('filter dialogs are keyboard-dismissable and restore page interaction', async ({page}) => {
  test.skip(!locales.includes('en'), 'This interaction asserts English accessible labels.');
  await open(page, 'en/cars');
  const trigger = page.getByRole('button', {name: 'Filter', exact: true});
  await trigger.click();
  await expect(page.getByRole('dialog')).toBeVisible();
  await dismissDialog(page);
  await trigger.click();
  await expect(page.getByRole('dialog')).toBeVisible();
  await dismissDialog(page);
});
test('vehicle navigation returns to the exact filtered collection', async ({page}) => {
  test.skip(!firstVehicle, 'The configured dealer has no stock.');
  const query = '?brand=' + encodeURIComponent(firstVehicle.make) + '&order=price-asc';
  await open(page, locales[0] + '/cars' + query);
  const detail = page.locator('article[data-price] a[href*="/cars/"]').first();
  await detail.click();
  await expect(page).toHaveURL(/\/cars\/[^/?]+$/);
  await page.goBack();
  await expect(page).toHaveURL(new RegExp('brand=' + encodeURIComponent(firstVehicle.make)));
  await expect(page).toHaveURL(/order=price-asc/);
  await expect(page.locator('article[data-price]').first()).toBeVisible();
});
test('saved vehicles survive reload and enquiry actions remain drafts', async ({page}) => {
  test.skip(!firstVehicle || !locales.includes('en'), 'Requires a stocked English journey.');
  await open(page, 'en/cars/' + firstVehicle.slug);
  const save = page.getByRole('button', {name: /save/i}).first();
  await save.click();
  await page.reload();
  await open(page, 'en/saved');
  await expect(page.locator('a[href*="/cars/' + firstVehicle.slug + '"]').first()).toBeVisible();
  await open(page, 'en/cars/' + firstVehicle.slug);
  await page.getByRole('button', {name: 'Arrange a viewing', exact: true}).first().click();
  await page.getByRole('button', {name: /Request a viewing/}).click();
  await expect(page.getByRole('dialog')).toBeVisible();
  await expect(page.getByRole('dialog')).toContainText(/No booking, purchase or message is submitted here/);
  await expect(page.getByRole('textbox', {name: 'Your enquiry draft'})).toBeVisible();
  await dismissDialog(page);
});
