/** Slow-network preference regression suite. All preference responses are mocked; no business writes leave the browser. */
import fs from 'node:fs';
import path from 'node:path';
import assert from 'node:assert/strict';
import { chromium } from 'playwright';
const base = new URL(process.env.DEALER_BASE_URL || process.env.BASE_URL);
const out = process.env.LOCALE_QA_OUT || path.resolve('runtime/phase2/preference-races-' + Date.now());
const designs = (process.env.LOCALE_QA_DESIGNS || 'auto-best').split(',');
const scenarios = (process.env.LOCALE_QA_SCENARIOS || 'cancel-pending-save,immediate-dismiss,reject-external-destination,reopen-pending-dismiss').split(',');
const entries = { 'auto-best': '', modern: '/variant-2', carwow: '/variant-3' };
assert(designs.every(design => Object.hasOwn(entries, design)));
fs.mkdirSync(out, { recursive: true });
const browser = await chromium.launch({ channel: 'chrome', headless: true });
const results = [];
const save = () => fs.writeFileSync(path.join(out, 'RESULTS.json'), JSON.stringify({ checkedAt: new Date().toISOString(), base: base.origin, scope: 'Mocked preference latency and redirect-validation regression; no business requests sent.', results }, null, 2));
try {
  for (const design of designs) for (const locale of ['en', 'bg']) for (const scenario of scenarios) {
    const name = [design, locale, scenario].join(' ');
    const context = await browser.newContext({ viewport: { width: scenario === 'reopen-pending-dismiss' ? 1440 : 390, height: 844 }, locale: locale === 'bg' ? 'en-US' : 'bg-BG' });
    const page = await context.newPage();
    const errors = [], writes = [], navigation = [], blockedExternalReads = [];
    let releasePending;
    let pendingSeen;
    const pending = new Promise(resolve => { pendingSeen = resolve; });
    const held = new Promise(resolve => { releasePending = resolve; });
    page.on('pageerror', error => errors.push(error.message));
    page.on('framenavigated', frame => { if (frame === page.mainFrame()) navigation.push(frame.url()); });
    await context.route('**/*', async route => {
      const request = route.request();
      if (['GET', 'HEAD', 'OPTIONS'].includes(request.method())) return route.continue();
      const target = new URL(request.url());
      if (target.origin !== base.origin || target.pathname !== '/api/preferences') {
        const record = { method: request.method(), url: request.url() };
        if (target.hostname === 'maps.googleapis.com' && target.pathname.endsWith('/GetViewportInfo')) blockedExternalReads.push(record);
        else writes.push(record);
        return route.abort();
      }
      const body = request.postDataJSON();
      const delay = (scenario === 'cancel-pending-save' && body.action === 'save') || scenario === 'immediate-dismiss' || (scenario === 'reopen-pending-dismiss' && body.action === 'dismiss');
      if (delay) { pendingSeen(); await held; }
      const destination = scenario === 'reject-external-destination' ? 'https://invalid.example/forbidden' : body.action === 'save' ? body.returnTo.replace('/' + locale + '/', '/' + (locale === 'en' ? 'bg' : 'en') + '/') : body.returnTo;
      try { await route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify({ destination }) }); } catch { /* Aborted requests cannot be fulfilled. */ }
    });
    const started = Date.now();
    try {
      const original = base.origin + entries[design] + '/' + locale + '/contact?topic=trade-in&race=keep#form';
      await page.goto(original, { waitUntil: 'domcontentloaded', timeout: 60000 });
      const dialog = page.locator('[data-locale-dialog]');
      await page.locator('[data-locale-ready="true"]').waitFor({ state: 'attached' });
      await dialog.waitFor({ state: 'visible' });
      if (!['immediate-dismiss', 'reopen-pending-dismiss'].includes(scenario)) {
        await dialog.locator('select[name=locale]').selectOption(locale === 'en' ? 'bg' : 'en');
        await dialog.locator('button[type=submit]').click();
      }
      if (scenario === 'reject-external-destination') {
        await dialog.locator('[role=alert]').waitFor({ state: 'visible', timeout: 4000 });
        assert.equal(page.url(), original);
        assert.equal(await dialog.isVisible(), true);
        const feedback = await dialog.locator('[role=alert]').innerText();
        assert.equal(/[\u0400-\u04ff]/.test(feedback), locale === 'bg', 'Preference error must use the URL language');
      } else {
        if (scenario === 'cancel-pending-save') await pending;
        await page.keyboard.press('Escape');
        if (['immediate-dismiss', 'reopen-pending-dismiss'].includes(scenario)) await pending;
        await dialog.waitFor({ state: 'hidden', timeout: 700 });
        if (scenario === 'reopen-pending-dismiss') {
          await page.locator('header [data-locale-selector]:visible').first().click();
          await dialog.waitFor({ state: 'visible' });
          assert.equal(await dialog.locator('button[type=submit]').isEnabled(), true, 'Reopening must clear a stale pending dismissal');
          await dialog.locator('select[name=locale]').selectOption(locale === 'en' ? 'bg' : 'en');
          await dialog.locator('button[type=submit]').click();
          await page.waitForURL(original.replace('/' + locale + '/', '/' + (locale === 'en' ? 'bg' : 'en') + '/'));
        }
        releasePending();
        await page.waitForTimeout(1000); // Allow the deliberately late response to attempt stale navigation.
        assert.equal(page.url(), scenario === 'reopen-pending-dismiss' ? original.replace('/' + locale + '/', '/' + (locale === 'en' ? 'bg' : 'en') + '/') : original, 'Only the latest explicit save may navigate');
        assert.equal(await page.evaluate(() => localStorage.getItem('cars.prompt.v1')), 'dismissed');
      }
      assert.deepEqual(errors, []);
      assert.deepEqual(writes, []);
      results.push({ name, pass: true, durationMs: Date.now() - started, url: page.url(), errors, navigation, blockedExternalReads });
      console.log('PASS ' + name);
    } catch (error) {
      results.push({ name, pass: false, error: error.message, durationMs: Date.now() - started, url: page.url(), errors, navigation });
      console.error('FAIL ' + name + ': ' + error.message);
      await page.screenshot({ path: path.join(out, name.replaceAll(' ', '-') + '.png') }).catch(() => {});
    } finally { releasePending(); await context.close(); save(); }
  }
} finally { await browser.close(); save(); }
const summary = { checks: results.length, passed: results.filter(result => result.pass).length, failed: results.filter(result => !result.pass).length, out };
console.log(JSON.stringify(summary));
if (summary.failed) process.exitCode = 1;
