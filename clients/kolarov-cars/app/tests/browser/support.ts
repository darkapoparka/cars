import {test as base, expect, type Page} from '@playwright/test';
import dealer from '../../lib/dealer.json';
import stock from '../../lib/dealer-inventory.json';
import type {Vehicle} from '../../lib/vehicle';

export {expect};
export const locales = dealer.enabledLocales;
export const firstVehicle = dealer.mode === 'dealer' ? (stock as Vehicle[])[0] : {slug: '2024-toyota-fortuner-exr', make: 'Toyota', model: 'Fortuner'};
export const test = base.extend({
  page: async ({page, baseURL}, run) => {
    const errors: string[] = [];
    page.on('pageerror', error => errors.push(error.message));
    page.on('console', message => {if (message.type() === 'error') errors.push(message.text());});
    const mount = new URL(baseURL!).pathname.replace(/\/$/, '');
    await page.addInitScript(key => {try {localStorage.setItem(key, '1');} catch { /* Storage may be disabled in a browser policy. */ }}, 'cars-app:welcome:v1:' + dealer.id + ':' + (mount || '/'));
    await run(page);
    expect(errors, 'No hydration errors, uncaught exceptions or browser console errors').toEqual([]);
  },
});
export async function open(page: Page, route: string) {
  const response = await page.goto(route);
  expect(response?.status(), route).toBe(200);
  await expect(page.locator('main:visible').first()).toBeVisible();
  await page.evaluate(() => document.fonts.ready);
  await expect(page.locator('[data-welcome-sheet]')).toHaveCount(0);
  await expect.poll(() => page.evaluate(() => document.documentElement.scrollWidth - innerWidth), {message: 'No horizontal page overflow'}).toBeLessThanOrEqual(1);
  await waitForVisibleImages(page);
}
export async function waitForVisibleImages(page: Page) {
  await page.waitForFunction(() => [...document.images].filter(image => {
    const box = image.getBoundingClientRect();
    return box.width > 0 && box.height > 0 && box.bottom > 0 && box.top < innerHeight && box.right > 0 && box.left < innerWidth;
  }).every(image => image.complete && image.naturalWidth > 0));
}
export async function dismissDialog(page: Page) {
  await page.keyboard.press('Escape');
  await expect(page.getByRole('dialog')).toHaveCount(0);
}
