import {test, expect, open, dismissDialog, locales, firstVehicle} from './support';
import dealer from '../../lib/dealer.json';
import {formatPrice, vehicles} from '../../lib/data';
import {currency} from '../../lib/currency';
import {capturedRelatedVehicles} from '../../lib/captured-related';
import {vehicleStorageKeys} from '../../lib/vehicle-storage';

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

for (const variant of ['', '/2']) {
  test(variant + ' clearing the last phone filter preserves visible keyboard focus', async ({page, viewport}) => {
    test.skip(!locales.includes('en') || !firstVehicle || !viewport || viewport.width >= 768, 'Requires a stocked English phone filter rail.');
    await open(page, 'en' + variant + '/cars?brand=' + encodeURIComponent(firstVehicle.make));
    const rail = page.getByRole('navigation', {name: 'Inventory filters', exact: true});
    const clear = rail.locator('[data-mobile-applied-filters] button').first();
    await clear.focus();
    await page.keyboard.press('Enter');
    await expect(rail.locator('[data-mobile-applied-filters]')).toHaveCount(0);
    await expect(rail.getByRole('button', {name: 'Brand', exact: true})).toBeFocused();
  });
}
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
  await expect(page.getByRole('dialog')).toContainText(/Copy the draft to send it separately|Nothing is sent automatically/);
  await expect(page.getByRole('textbox', {name: 'Your enquiry draft'})).toBeVisible();
  await dismissDialog(page);
});

for (const locale of locales) for (const variant of ['', '/2']) {
  test(locale + variant + ' vehicle Back returns to the originating Home', async ({page, viewport, baseURL}) => {
    test.skip(!vehicles.length, 'The configured dealer has no stock.');
    const home = locale + variant;
    await open(page, home);
    await page.locator('article:visible a[href*="/cars/"]').first().click();
    await expect(page).toHaveURL(/\/cars\/[^/?]+$/);
    const back = viewport && viewport.width >= 1100
      ? page.locator('[data-desktop-vehicle-hero] button').first()
      : page.getByRole('button', {name: locale === 'bg' ? 'Назад' : 'Back', exact: true});
    await back.click();
    await expect(page).toHaveURL(new URL(home, baseURL!).href);
  });

  test(locale + variant + ' welcome language change preserves the journey', async ({page, baseURL}) => {
    const target = locales.find(value => value !== locale);
    test.skip(!dealer.welcomeEnabled || !target, 'Requires welcome and two enabled languages.');
    await page.goto(locale + variant + '?welcome=1');
    const welcome = page.locator('[data-welcome-sheet]');
    await expect(welcome).toBeVisible();
    await welcome.getByRole('link', {name: target === 'bg' ? 'Български' : 'English', exact: true}).click();
    await expect(page).toHaveURL(new URL(target + variant + '?welcome=1', baseURL!).href);
    await expect(page.locator('[data-welcome-sheet]')).toBeVisible();
  });
}

for (const variant of ['', '/2']) {
  test(variant + ' Saved removal preserves keyboard focus through the empty state', async ({page, baseURL}) => {
    test.skip(!locales.includes('en') || vehicles.length < 2, 'Requires two stocked English vehicles.');
    const key = vehicleStorageKeys(dealer.id, dealer.mode as 'template' | 'dealer', new URL(baseURL!).pathname.replace(/\/$/, '')).saved;
    await page.addInitScript(({key, slugs}) => localStorage.setItem(key, JSON.stringify(slugs)), {key, slugs: vehicles.slice(0, 2).map(vehicle => vehicle.slug)});
    await open(page, 'en' + variant + '/saved');
    const buttons = page.locator('[data-saved-remove]:visible');
    await expect(buttons).toHaveCount(2);
    await buttons.first().focus();
    await page.keyboard.press('Enter');
    await expect(buttons).toHaveCount(1);
    await expect(buttons.first()).toBeFocused();
    await page.keyboard.press('Enter');
    await expect(buttons).toHaveCount(0);
    await expect(page.locator('[data-saved-explore]')).toBeFocused();
  });
}

test('calculator keeps a tiny positive annual rate finite', async ({page}) => {
  test.skip(!locales.includes('en'), 'This interaction asserts English accessible labels.');
  await open(page, 'en/finance');
  await page.getByRole('button', {name: 'Choose your car', exact: true}).filter({visible: true}).first().click();
  await page.getByRole('button', {name: 'Enter a price', exact: true}).click();
  await page.getByRole('spinbutton', {name: /^Annual (interest|rate)\b/}).fill('1e-20');
  await page.getByRole('spinbutton', {name: /^Annual (interest|rate)\b/}).press('Tab');
  await expect(page.getByRole('dialog').locator('output').first()).toHaveText(`${currency.symbol} ${formatPrice(333)}`);
  await expect(page.getByRole('dialog')).not.toContainText('∞');
});

test('Similar cars displays exact recorded mileage', async ({page}) => {
  test.skip(dealer.mode !== 'template' || !locales.includes('en'), 'Requires the retained English comparison records.');
  await open(page, 'en/cars/2024-toyota-fortuner-exr');
  await page.getByRole('button', {name: 'Similar Cars', exact: true}).click();
  const cards = page.getByRole('dialog').locator('article');
  await expect(cards).toHaveCount(capturedRelatedVehicles.length);
  for (const [index, car] of capturedRelatedVehicles.entries()) {
    await expect(cards.nth(index).locator('[data-vehicle-facts]')).toContainText(`${formatPrice(car.mileage)} km`);
  }
});

test('Saved removal retains the card and focus when storage is unavailable', async ({page, baseURL}) => {
  test.skip(!locales.includes('en') || !vehicles.length, 'Requires a stocked English journey.');
  const key = vehicleStorageKeys(dealer.id, dealer.mode as 'template' | 'dealer', new URL(baseURL!).pathname.replace(/\/$/, '')).saved;
  await page.addInitScript(({key, slug}) => localStorage.setItem(key, JSON.stringify([slug])), {key, slug: vehicles[0].slug});
  await open(page, 'en/saved');
  await page.evaluate(key => {
    const write = Storage.prototype.setItem;
    Storage.prototype.setItem = function (name: string, value: string) {
      if (name === key) throw new DOMException('Storage blocked for this regression', 'QuotaExceededError');
      write.call(this, name, value);
    };
  }, key);
  const remove = page.locator('[data-saved-remove]:visible');
  await remove.focus();
  await page.keyboard.press('Enter');
  await expect(page.locator('article:visible')).toHaveCount(1);
  await expect(remove).toBeFocused();
  await expect(page.locator('[data-saved-list]').getByRole('alert')).toContainText('could not update saved cars');
});
for (const variant of ['', '/2']) {
  test(variant + ' calculator controls match their visible labels and selected car', async ({page, viewport}) => {
    test.skip(!locales.includes('en') || !vehicles.length, 'Requires a stocked English journey.');
    await open(page, 'en' + variant + '/finance');
    await page.getByRole('button', {name: 'Choose your car', exact: true}).filter({visible: true}).first().click();
    await page.getByRole('button', {name: 'Enter a price', exact: true}).click();
    const dialog = page.getByRole('dialog');
    const mobile = Boolean(viewport && viewport.width < 768);
    await expect(dialog.getByRole('spinbutton', {name: /^Vehicle price\b/})).toBeVisible();
    await expect(dialog.getByRole('spinbutton', {name: mobile ? /^Annual rate\b/ : /^Annual interest\b/})).toBeVisible();
    await expect(dialog.getByRole('combobox', {name: mobile ? 'Term' : 'Repayment term', exact: true})).toBeVisible();
    const deposit = dialog.getByRole('slider', {name: mobile ? 'Down payment' : 'Deposit', exact: true});
    await deposit.focus();
    await page.keyboard.press('ArrowRight');
    await expect(deposit).toHaveValue('21');
    await dialog.getByRole('button', {name: 'Choose your car', exact: true}).click();
    await page.locator('[data-finance-car-choice]').first().click();
    const selected = page.getByRole('dialog').getByRole('button', {name: /^Change car:/});
    await expect(selected.locator('img')).toBeVisible();
    const identity = (await selected.locator('span').first().innerText()).split('\n')[0].trim();
    await expect(selected).toHaveAccessibleName('Change car: ' + identity);
    await page.getByRole('dialog').getByRole('button', {name: 'Close calculator', exact: true}).click();
    await expect(page.getByRole('dialog')).toHaveCount(0);
  });
}
