import {test, expect, open, waitForVisibleImages, locales, firstVehicle} from './support';

for (const locale of locales) {
  const routes = [
    ['home', locale], ['alternative-home', locale + '/2'],
    ['inventory', locale + '/cars'], ['alternative-inventory', locale + '/2/cars'],
    ['sell', locale + '/sell'], ['finance', locale + '/finance'], ['service', locale + '/service'],
    ...(firstVehicle ? [['vehicle', locale + '/cars/' + firstVehicle.slug]] : []),
  ];
  for (const [name, route] of routes) test(locale + ' ' + name + ' retains its appearance', async ({page}, info) => {
    await open(page, route);
    await expect(page).toHaveScreenshot(locale + '-' + name + '.png');
    await page.screenshot({path: info.outputPath('capture.png'), animations: 'disabled'});
  });
}

for (const label of ['Brand', 'Budget']) test('en ' + label + ' filter preserves its appearance', async ({page}, info) => {
  test.skip(!locales.includes('en'));
  await open(page, 'en/cars');
  await page.getByRole('button', {name: label, exact: true}).first().click();
  await expect(page.locator('input[type=checkbox], input[type=number]').first()).toBeAttached();
  await waitForVisibleImages(page);
  await expect(page).toHaveScreenshot('en-filter-' + label.toLowerCase() + '.png');
  await page.screenshot({path: info.outputPath('capture.png'), animations: 'disabled'});
});
