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
test('Rental dates validate and survive review, Back and reopening', async ({page}) => {
  const locale = locales.includes('en') ? 'en' : locales[0];
  const copy = locale === 'bg'
    ? {plan: 'Планирай наем', pickup: 'Вземане', returning: 'Връщане', preference: 'Предпочитан автомобил', review: 'Прегледайте запитването', close: 'Затвори запитването за наем'}
    : {plan: 'Plan your rental', pickup: 'Pick-up date', returning: 'Return date', preference: 'Vehicle preference', review: 'Review enquiry', close: 'Close rental enquiry'};
  await open(page, locale + '/cars?purpose=rent&filters=1&sort=1&open=BRAND');
  await expect(page.getByRole('dialog')).toHaveCount(0);
  await expect.poll(() => page.locator('body').evaluate(body => body.style.overflow)).not.toBe('hidden');
  await page.getByRole('button', {name: copy.plan, exact: true}).click();
  const sheet = page.locator('[data-rental-sheet]');
  await sheet.getByRole('button', {name: copy.review, exact: true}).click();
  await expect(sheet).toHaveAttribute('data-rental-view', 'dates');
  const today = await sheet.getByLabel(copy.pickup, {exact: true}).getAttribute('min');
  const day = (offset: number) => {const date = new Date(today + 'T00:00:00Z'); date.setUTCDate(date.getUTCDate() + offset); return date.toISOString().slice(0, 10);};
  await sheet.getByLabel(copy.pickup, {exact: true}).fill(day(5));
  await sheet.getByLabel(copy.returning, {exact: true}).fill(day(3));
  await sheet.getByRole('button', {name: copy.review, exact: true}).click();
  await expect(sheet).toHaveAttribute('data-rental-view', 'dates');
  await sheet.getByLabel(copy.returning, {exact: true}).fill(day(8));
  await sheet.getByLabel(copy.preference, {exact: true}).fill('BMW X3');
  await sheet.getByRole('button', {name: copy.review, exact: true}).click();
  await expect(sheet).toHaveAttribute('data-rental-view', 'review');
  await expect(sheet.locator('a[href^="tel:"]')).toHaveAttribute('href', 'tel:' + dealer.phoneE164);
  await page.goBack();
  await expect(sheet).toHaveAttribute('data-rental-view', 'dates');
  await expect(sheet.getByLabel(copy.pickup, {exact: true})).toHaveValue(day(5));
  await sheet.getByRole('button', {name: copy.close, exact: true}).click();
  await page.getByRole('button', {name: copy.plan, exact: true}).click();
  await expect(sheet.getByLabel(copy.preference, {exact: true})).toHaveValue('BMW X3');
});

test('Buy sorting remains portable after switching out of a direct Rent URL', async ({page, viewport}) => {
  test.skip(!viewport || viewport.width >= 768 || !vehicles.some(vehicle => vehicle.make === 'BMW'), 'Requires phone sorting and stocked BMW vehicles.');
  const locale = locales.includes('en') ? 'en' : locales[0];
  const buy = locale === 'bg' ? 'Купи' : 'Buy', rent = locale === 'bg' ? 'Наеми' : 'Rent';
  await open(page, locale + '/cars?purpose=rent&filters=1&campaign=owner&brand=BMW&order=price-asc');
  await page.getByRole('button', {name: buy, exact: true}).click();
  await page.locator('[data-inventory-sort-action]').click();
  await page.getByRole('radio', {name: locale === 'bg' ? 'Цена: От висока към ниска' : 'Price: High to low', exact: true}).click();
  await page.getByRole('button', {name: rent, exact: true}).click();
  await page.getByRole('button', {name: buy, exact: true}).click();
  await expect(page).toHaveURL(/order=price-desc/);
  await expect(page).toHaveURL(/campaign=owner/);
  await expect(page).not.toHaveURL(/filters=1/);
  await page.reload();
  await expect(page.getByRole('dialog')).toHaveCount(0);
  const prices = await page.locator('article[data-price]').evaluateAll(cards => cards.map(card => Number(card.getAttribute('data-price'))));
  expect(prices.length).toBeGreaterThan(0);
  expect(prices).toEqual([...prices].sort((a, b) => b - a));
});

test('service drafts survive Back and refresh only when vehicle details change', async ({page}) => {
  const locale = locales.includes('en') ? 'en' : locales[0];
  const labels = locale === 'bg'
    ? {enquire: 'Запитване', make: 'Марка', model: 'Модел', prepare: 'Подготви запитване', back: 'Към запитването', draft: 'Чернова на запитването'}
    : {enquire: 'Enquire', make: 'Make', model: 'Model', prepare: 'Prepare enquiry', back: 'Back to enquiry', draft: 'Your enquiry draft'};
  await open(page, locale + '/service');
  await page.locator('[data-service-card="diagnostics"]').click();
  const sheet = page.locator('[data-service-detail-sheet]');
  await sheet.getByRole('button', {name: labels.enquire, exact: true}).click();
  await sheet.getByLabel(labels.make, {exact: true}).fill('BMW');
  await sheet.getByLabel(labels.model, {exact: true}).fill('X3');
  await sheet.getByRole('button', {name: labels.prepare, exact: true}).click();
  const draft = sheet.getByLabel(labels.draft, {exact: true});
  await draft.fill('My edited enquiry');
  await sheet.getByRole('button', {name: labels.back, exact: true}).click();
  await sheet.getByRole('button', {name: labels.prepare, exact: true}).click();
  await expect(draft).toHaveValue('My edited enquiry');
  await page.goBack();
  await expect(sheet).toHaveAttribute('data-service-view', 'enquiry');
  await expect(sheet.getByLabel(labels.make, {exact: true})).toHaveValue('BMW');
  await expect(sheet.getByLabel(labels.model, {exact: true})).toHaveValue('X3');
  await sheet.getByLabel(labels.model, {exact: true}).fill('X5');
  await sheet.getByRole('button', {name: labels.prepare, exact: true}).click();
  await expect(draft).toHaveValue(/BMW X5/);
  await expect(draft).not.toHaveValue('My edited enquiry');
  for (const view of ['enquiry', 'details']) {
    await page.goBack();
    await expect(sheet).toHaveAttribute('data-service-view', view);
  }
  await page.goBack();
  await expect(sheet).toHaveCount(0);
  await expect.poll(() => page.locator('body').evaluate(body => body.style.overflow)).not.toBe('hidden');
});

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
    await expect(rail.getByRole('button', {name: 'Filter', exact: true})).toBeFocused();
  });
}
test('vehicle navigation returns to the exact filtered collection', async ({page}) => {
  test.skip(!firstVehicle, 'The configured dealer has no stock.');
  const query = '?brand=' + encodeURIComponent(firstVehicle.make) + '&order=price-asc';
  await open(page, locales[0] + '/cars' + query);
  await expect(page.locator('[data-vehicle-drawers-ready]')).toHaveAttribute('data-vehicle-drawers-ready', 'true');
  const detail = page.locator('article[data-price] a[href*="/cars/"]').first();
  await detail.focus();
  const collectionUrl = page.url();
  const permanentUrl = await detail.evaluate(element => (element as HTMLAnchorElement).href);
  const collectionScroll = await page.evaluate(() => scrollY);
  await detail.click();
  await expect(page).toHaveURL(/#vehicle=/);
  await expect(page.locator('[data-vehicle-drawer]')).toBeVisible();
  await expect(page.locator('[data-keyboard-navigation]')).toHaveJSProperty('inert', true);
  await page.evaluate(() => Object.defineProperty(navigator, 'share', {configurable: true, value: async (data: ShareData) => {document.documentElement.dataset.sharedVehicle = data.url;}}));
  await page.locator('[data-vehicle-drawer]').getByRole('button', {name: 'Share car', exact: true}).filter({visible: true}).click();
  await expect(page.locator('html')).toHaveAttribute('data-shared-vehicle', permanentUrl);
  await page.keyboard.press('Escape');
  await expect(page.locator('[data-vehicle-drawer]')).toHaveCount(0);
  await expect(page).toHaveURL(collectionUrl);
  await expect(detail).toBeFocused();
  expect(await page.evaluate(() => scrollY)).toBe(collectionScroll);
  await page.goForward();
  await expect(page.locator('[data-vehicle-drawer]')).toBeVisible();
  await page.reload();
  await expect(page.locator('[data-vehicle-drawer]')).toBeVisible();
  await page.goBack();
  await expect(page.locator('[data-vehicle-drawer]')).toHaveCount(0);
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

test('vehicle drawer unwinds child sheets and replaces a similar car without stacking', async ({page}) => {
  test.skip(!firstVehicle || !locales.includes('en') || vehicles.length < 2, 'Requires two stocked English vehicles.');
  await open(page, 'en/2/cars');
  await expect(page.locator('[data-vehicle-drawers-ready]')).toHaveAttribute('data-vehicle-drawers-ready', 'true');
  const collectionUrl = page.url();
  await page.locator('article[data-price] a[href*="/cars/"]').first().click();
  const drawer = page.locator('[data-vehicle-drawer]');
  await expect(drawer).toBeVisible();
  const originalUrl = page.url();
  await drawer.getByRole('button', {name: 'Price information', exact: true}).filter({visible: true}).click();
  await expect(page.getByRole('dialog')).toHaveCount(2);
  await page.goBack();
  await expect(page.getByRole('dialog')).toHaveCount(1);
  await expect(page).toHaveURL(originalUrl);
  await drawer.getByRole('button', {name: 'Similar Cars', exact: true}).filter({visible: true}).click();
  const similar = page.getByRole('dialog', {name: 'Similar vehicles', exact: true});
  const target = similar.locator('article a[href*="/cars/"]').first();
  const targetSlug = (await target.getAttribute('href'))!.split('/').at(-1)!;
  await target.click();
  await expect(page).toHaveURL(new RegExp('#vehicle=' + targetSlug + '$'));
  await expect(similar).toHaveCount(0);
  await expect(drawer).toBeVisible();
  await page.keyboard.press('Escape');
  await expect(drawer).toHaveCount(0);
  await expect(page).toHaveURL(collectionUrl);
});

for (const locale of locales) for (const variant of ['', '/2']) {
  test(locale + variant + ' vehicle Back returns to the originating Home', async ({page, viewport, baseURL}) => {
    test.skip(!vehicles.length, 'The configured dealer has no stock.');
    const home = locale + variant;
    await open(page, home);
    await expect(page.locator('[data-vehicle-drawers-ready]')).toHaveAttribute('data-vehicle-drawers-ready', 'true');
    await page.locator('article:visible a[href*="/cars/"]').first().click();
    await expect(page).toHaveURL(/#vehicle=/);
    const back = viewport && viewport.width >= 1100
      ? page.locator('[data-desktop-vehicle-hero] button').first()
      : page.getByRole('button', {name: locale === 'bg' ? 'Назад' : 'Back', exact: true});
    await back.click();
    await expect(page).toHaveURL(new URL(home, baseURL!).href);
  });

  test(locale + variant + ' first visit stays unobstructed and menu language controls work', async ({page, viewport, baseURL}) => {
    await open(page, locale + variant);
    await expect(page.getByRole('dialog')).toHaveCount(0);
    // An old welcome-preview link must not bring the rejected interruption back.
    await open(page, locale + variant + '?welcome=1');
    await expect(page.getByRole('dialog')).toHaveCount(0);
    const target = locales.find(value => value !== locale);
    if (!target) return;
    const desktop = viewport && viewport.width >= 1100;
    if (desktop) await page.getByRole('button', {name: locale === 'bg' ? 'Отворете менюто' : 'Open menu', exact: true}).click();
    else await page.getByRole('link', {name: locale === 'bg' ? 'Меню' : 'Menu', exact: true}).filter({visible: true}).click();
    await page.locator('[data-menu-language]:visible').getByRole('link', {name: target === 'bg' ? 'Български' : 'English', exact: true}).click();
    await expect(page).toHaveURL(new URL(target + variant + (desktop ? '?welcome=1' : '/more'), baseURL!).href);
    await expect(page.locator('[data-welcome-sheet]')).toHaveCount(0);
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
