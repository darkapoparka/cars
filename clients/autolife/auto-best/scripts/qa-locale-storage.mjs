/** Exercise unavailable browser storage and progressive-enhancement fallback on all three public designs. */
import fs from 'node:fs';
import path from 'node:path';
import assert from 'node:assert/strict';
import { chromium } from 'playwright';
const base = new URL(process.env.DEALER_BASE_URL || process.env.BASE_URL);
const out = process.env.LOCALE_QA_OUT || path.resolve('runtime/phase2/storage-' + Date.now());
fs.mkdirSync(out, { recursive: true });
const browser = await chromium.launch({ channel: 'chrome', headless: true });
const results = [];
const save = () => fs.writeFileSync(path.join(out, 'RESULTS.json'), JSON.stringify({ checkedAt: new Date().toISOString(), base: base.origin, scope: 'Storage-denied and cookie-rejection simulation, plus native no-JavaScript preference forms; all business writes blocked.', results }, null, 2));
try {
  for (const [design, mount] of Object.entries({ 'auto-best': process.env.LOCALE_QA_MOUNT ?? '' })) for (const locale of ['en', 'bg']) for (const mode of ['storage-unavailable', 'cookies-and-storage-unavailable', 'no-javascript']) {
    const name = [design, locale, mode].join(' ');
    const context = await browser.newContext({ javaScriptEnabled: mode !== 'no-javascript', locale: locale === 'bg' ? 'en-US' : 'bg-BG', viewport: { width: 390, height: 844 } });
    const errors = [], prohibitedWrites = [], blockedExternalReads = [];
    const cookiesBlocked = mode === 'cookies-and-storage-unavailable';
    await context.route('**/*', async route => {
      const request = route.request(), url = new URL(request.url());
      if (['GET', 'HEAD', 'OPTIONS'].includes(request.method())) return route.continue();
      if (request.method() !== 'POST' || url.origin !== base.origin || url.pathname !== '/api/preferences' || url.search) {
        const record = { method: request.method(), url: request.url() };
        if (url.hostname === 'maps.googleapis.com' && url.pathname.endsWith('/GetViewportInfo')) blockedExternalReads.push(record);
        else prohibitedWrites.push(record);
        return route.abort();
      }
      if (!cookiesBlocked) return route.continue();
      // Node fetch has no browser cookie jar. Dropping Set-Cookie before fulfilment
      // simulates a browser rejecting cookies without accidentally accepting them
      // into Playwright's shared APIRequestContext jar via route.fetch().
      const response = await fetch(url, { method: 'POST', headers: { origin: base.origin, 'content-type': 'application/json' }, body: request.postData(), redirect: 'manual', signal: AbortSignal.timeout(15000) });
      const headers = Object.fromEntries([...response.headers].filter(([key]) => !['set-cookie', 'content-encoding', 'content-length'].includes(key)));
      await route.fulfill({ status: response.status, headers, body: Buffer.from(await response.arrayBuffer()) });
    });
    if (mode !== 'no-javascript') await context.addInitScript(({ cookiesBlocked }) => {
      Storage.prototype.getItem = () => { throw new DOMException('Storage unavailable in acceptance fixture', 'SecurityError'); };
      Storage.prototype.setItem = () => { throw new DOMException('Storage unavailable in acceptance fixture', 'SecurityError'); };
      if (cookiesBlocked) Object.defineProperty(document, 'cookie', { configurable: true, get: () => '', set: () => {} });
    }, { cookiesBlocked });
    const page = await context.newPage();
    page.on('pageerror', error => errors.push(error.message));
    try {
      const next = locale === 'en' ? 'bg' : 'en';
      const original = mount + '/' + locale + '/contact?topic=trade-in&intent=import&probe=storage#form';
      const destination = base.origin + original.replace('/' + locale + '/', '/' + next + '/');
      if (mode === 'no-javascript') {
        await page.goto(base.origin + '/' + locale + '/locale-settings?returnTo=' + encodeURIComponent(original), { waitUntil: 'domcontentloaded' });
        await page.locator('#settings-country').selectOption('DE');
        await page.locator('#settings-language').selectOption(next);
        await page.locator('button[name=action][value=save]').click();
      } else {
        await page.goto(base.origin + original, { waitUntil: 'domcontentloaded' });
        await page.locator('[data-locale-ready="true"]').waitFor({ state: 'attached' });
        assert.equal(await page.locator('html').getAttribute('lang'), locale);
        const dialog = page.locator('[data-locale-dialog]');
        await dialog.waitFor({ state: 'visible' });
        await dialog.locator('[name=country]').selectOption('DE');
        assert.equal(await dialog.locator('[name=locale]').inputValue(), locale, 'Country must not silently select another language');
        await dialog.locator('[name=locale]').selectOption(next);
        await dialog.locator('button[type=submit]').click();
      }
      await page.waitForURL(destination);
      assert.equal(await page.locator('html').getAttribute('lang'), next);
      const cookies = (await context.cookies()).filter(cookie => cookie.name.startsWith('cars_'));
      if (cookiesBlocked) assert.deepEqual(cookies, [], 'Cookie-rejection fixture accidentally stored a cookie');
      else {
        assert.equal(cookies.find(cookie => cookie.name === 'cars_locale')?.value, next);
        assert.equal(cookies.find(cookie => cookie.name === 'cars_country')?.value, 'DE');
        assert.equal(cookies.find(cookie => cookie.name === 'cars_prompt')?.value, 'v1');
      }
      await page.reload({ waitUntil: 'domcontentloaded' });
      assert.equal(page.url(), destination);
      assert.equal(await page.locator('html').getAttribute('lang'), next);
      if (mode !== 'no-javascript') {
        await page.locator('[data-locale-ready="true"]').waitFor({ state: 'attached' });
        if (cookiesBlocked) await page.locator('[data-locale-dialog]').waitFor({ state: 'visible' });
        else await page.locator('[data-locale-dialog]').waitFor({ state: 'hidden' });
      }
      assert.deepEqual(errors, []);
      assert.deepEqual(prohibitedWrites, []);
      results.push({ name, pass: true, url: page.url(), cookies, errors, blockedExternalReads, limitation: cookiesBlocked ? 'Without cookies or browser storage, country and prompt completion cannot persist. Explicit URL language and query/hash still survive save and reload.' : null });
      console.log('PASS ' + name);
    } catch (error) {
      results.push({ name, pass: false, error: error.message, url: page.url(), errors, prohibitedWrites, blockedExternalReads });
      console.error('FAIL ' + name + ': ' + error.message);
      await page.screenshot({ path: path.join(out, name.replaceAll(' ', '-') + '.png') }).catch(() => {});
    } finally { await context.close(); save(); }
  }
} finally { await browser.close(); save(); }
const summary = { out, checks: results.length, passed: results.filter(result => result.pass).length, failed: results.filter(result => !result.pass).length };
console.log(JSON.stringify(summary));
if (summary.failed) process.exitCode = 1;
