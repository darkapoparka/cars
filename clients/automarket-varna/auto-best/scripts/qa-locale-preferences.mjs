import fs from 'node:fs';
import path from 'node:path';
import assert from 'node:assert/strict';
import { chromium } from 'playwright';
const root = path.resolve(import.meta.dirname, '..');
const base = process.env.DEALER_BASE_URL || process.env.BASE_URL;
const out = process.env.LOCALE_QA_OUT || path.join(root, 'runtime/phase2/preferences-' + Date.now());
fs.mkdirSync(out, { recursive: true });
const browser = await chromium.launch({ channel: 'chrome', headless: true });
const results = [];
const save = () => fs.writeFileSync(path.join(out, 'RESULTS.json'), JSON.stringify({ base, checkedAt: new Date().toISOString(), scope: 'Native preferences and URL retention; not catalog or full-design completion.', results }, null, 2));
async function check(name, run) {
  try { const evidence = await run(); results.push({ name, pass: true, ...evidence }); console.log('PASS ' + name); }
  catch (error) { results.push({ name, pass: false, error: error.message }); console.error('FAIL ' + name + ': ' + error.message); }
  save();
}
try {
  await check('Auto Best preserves trade-in query and anchor when saving country and language', async () => {
    const context = await browser.newContext({ locale: 'en-US', viewport: { width: 390, height: 844 } });
    try {
      const page = await context.newPage(); const errors = []; page.on('pageerror', error => errors.push(error.message));
      await page.goto(base + '/en/contact?topic=trade-in&probe=keep#trade-in-enquiry');
      const dialog = page.locator('[data-locale-dialog]'); console.log('Preference stage: first visit', page.url()); await dialog.waitFor({ state: 'visible' });
      const suggested = await dialog.locator('select[name=country] option').first().getAttribute('value');
      assert.equal(await dialog.locator('select[name=country]').inputValue(), suggested);
      if (['localhost', '127.0.0.1'].includes(new URL(base).hostname)) assert.equal(suggested, 'BG');
      assert.equal(await dialog.locator('select[name=locale] option').count(), 2);
      await dialog.locator('select[name=country]').selectOption('BG');
      await dialog.locator('select[name=locale]').selectOption('bg');
      await dialog.locator('button[type=submit]').click();
      await page.waitForURL('**/bg/contact?topic=trade-in&probe=keep#trade-in-enquiry'); console.log('Preference stage: saved', page.url());
      await dialog.waitFor({ state: 'hidden' });
      assert.equal(await page.locator('html').getAttribute('lang'), 'bg');
      const cookies = (await context.cookies()).filter(cookie => cookie.name.startsWith('cars_'));
      assert.equal(cookies.find(cookie => cookie.name === 'cars_locale')?.value, 'bg');
      assert.equal(cookies.find(cookie => cookie.name === 'cars_country')?.value, 'BG');
      assert.equal(cookies.find(cookie => cookie.name === 'cars_prompt')?.value, 'v1');
      for (const cookie of cookies) { assert.equal(cookie.path, '/'); assert.equal(cookie.httpOnly, true); assert.equal(cookie.sameSite, 'Lax'); assert.equal(cookie.secure, base.startsWith('https:')); assert(!cookie.domain.startsWith('.')); }
      await page.reload(); await dialog.waitFor({ state: 'hidden' }); console.log('Preference stage: reload', page.url());
      await page.locator('[data-locale-ready="true"]').waitFor({ state: 'attached' }); await page.locator('[data-locale-selector]:visible').first().click(); console.log('Preference stage: manual selector', page.url()); await dialog.waitFor({ state: 'visible' });
      assert.equal(await dialog.locator('select[name=country]').inputValue(), 'BG');
      assert.equal(await dialog.locator('select[name=locale]').inputValue(), 'bg');
      await page.screenshot({ path: path.join(out, 'saved-bg-mobile.png') });
      const geometry = await dialog.boundingBox(); assert(geometry.x >= 0 && geometry.y >= 0 && geometry.width <= 390 && geometry.y + geometry.height <= 844);
      await page.keyboard.press('Escape'); await dialog.waitFor({ state: 'hidden' });
      await page.goto(base + '/en/contact?topic=trade-in&probe=keep#trade-in-enquiry');
      assert.equal(await page.locator('html').getAttribute('lang'), 'en');
      const response = await page.request.get(base + '/contact?topic=trade-in', { maxRedirects: 0 });
      assert.equal(response.status(), 307); assert.match(response.headers().location, /^\/bg\/contact\?topic=trade-in$/);
      assert.match(response.headers()['cache-control'], /private.*no-store/);
      assert.deepEqual(errors, []);
      return { cookies, geometry, finalUrl: page.url(), errors };
    } finally { await context.close(); }
  });
  await check('Escape dismissal is persisted without accepting a country or language', async () => {
    const context = await browser.newContext({ viewport: { width: 320, height: 844 } });
    try {
      const page = await context.newPage(); await page.goto(base + '/en');
      const dialog = page.locator('[data-locale-dialog]'); await dialog.waitFor({ state: 'visible' });
      const dismissed = page.waitForResponse(response => response.url() === new URL('/api/preferences', base).href && response.request().method() === 'POST');
      await page.keyboard.press('Escape'); await dialog.waitFor({ state: 'hidden' });
      assert.equal((await dismissed).status(), 200); // Closing is immediate; cookie assertions wait for the acknowledged response.
      const cookies = (await context.cookies()).filter(cookie => cookie.name.startsWith('cars_'));
      assert.deepEqual(cookies.map(cookie => cookie.name), ['cars_prompt']);
      await page.reload(); await page.waitForTimeout(300); assert.equal(await dialog.isVisible(), false);
      await page.locator('[data-locale-ready="true"]').waitFor({ state: 'attached' }); await page.locator('[data-locale-selector]:visible').first().click(); await dialog.waitFor({ state: 'visible' });
      await dialog.locator('button[type=button]').first().click(); await dialog.waitFor({ state: 'hidden' });
      return { cookies, promptReopenedOnReload: false };
    } finally { await context.close(); }
  });
  await check('No-JavaScript form uses server-set preferences and preserves the return route', async () => {
    const context = await browser.newContext({ javaScriptEnabled: false });
    try {
      const page = await context.newPage();
      const returnTo = '/en/contact?topic=import&probe=no-js#form';
      await page.goto(base + '/en/locale-settings?returnTo=' + encodeURIComponent(returnTo));
      await page.locator('#settings-country').selectOption('DE');
      await page.locator('#settings-language').selectOption('bg');
      await page.locator('button[name=action][value=save]').click();
      await page.waitForURL('**/bg/contact?topic=import&probe=no-js#form');
      assert.equal(await page.locator('html').getAttribute('lang'), 'bg');
      const cookies = await context.cookies(); assert.equal(cookies.find(cookie => cookie.name === 'cars_country')?.value, 'DE');
      return { finalUrl: page.url(), cookies };
    } finally { await context.close(); }
  });
  await check('Explicit locale works when browser storage is unavailable', async () => {
    const context = await browser.newContext({ locale: 'en-US' });
    try {
      await context.addInitScript(() => {
        Storage.prototype.getItem = () => { throw new DOMException('Disabled for this test', 'SecurityError'); };
        Storage.prototype.setItem = () => { throw new DOMException('Disabled for this test', 'SecurityError'); };
      });
      const page = await context.newPage(); const errors = []; page.on('pageerror', error => errors.push(error.message));
      await page.goto(base + '/bg/contact?topic=trade-in');
      assert.equal(await page.locator('html').getAttribute('lang'), 'bg');
      const dialog = page.locator('[data-locale-dialog]'); await dialog.waitFor({ state: 'visible' });
      await page.keyboard.press('Escape'); await dialog.waitFor({ state: 'hidden' });
      assert.deepEqual(errors, []);
      return { finalUrl: page.url(), errors };
    } finally { await context.close(); }
  });
} finally { await browser.close(); save(); }
const summary = { out, checks: results.length, passed: results.filter(result => result.pass).length, failed: results.filter(result => !result.pass).length };
console.log(JSON.stringify(summary));
if (summary.failed) process.exitCode = 1;
