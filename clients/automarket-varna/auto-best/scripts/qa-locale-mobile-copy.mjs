import fs from 'node:fs';
import path from 'node:path';
import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import { launchBrowser, previewUrl } from './browser.mjs';
const base = previewUrl();
const root = path.resolve(import.meta.dirname, '..');
const output = path.resolve(root, process.env.ARTIFACT_DIR || 'artifacts/localization/mobile-copy-browser');
assert.ok(output.startsWith(root + path.sep), 'Evidence must remain in this checkout');
fs.mkdirSync(output, { recursive: true });
const sources = ['src/lib/locale/catalog.ts', 'src/lib/components/home/SearchBox.svelte', 'src/lib/components/company/ImportHowItWorks.svelte', 'src/lib/components/company/VehicleEnquiry.svelte', 'src/lib/styles/tokens.css'];
const hashes = () => Object.fromEntries(sources.map(p => [p, createHash('sha256').update(fs.readFileSync(path.join(root, p))).digest('hex')]));
const before = hashes();
const results = [];
async function labelFit(locator, expected) {
  assert.equal((await locator.innerText()).trim(), expected);
  const geometry = await locator.evaluate(el => {
    const box = el.getBoundingClientRect();
    const walker = document.createTreeWalker(el, NodeFilter.SHOW_TEXT);
    const rects = [];
    while (walker.nextNode()) if (walker.currentNode.textContent.trim()) {
      const range = document.createRange(); range.selectNodeContents(walker.currentNode);
      for (const r of range.getClientRects()) if (r.width && r.height) rects.push({ x: r.x, y: r.y, right: r.right, bottom: r.bottom });
    }
    return { lines: new Set(rects.map(r => Math.round(r.y))).size, fits: rects.every(r => r.x >= box.x - 1 && r.right <= box.right + 1 && r.y >= box.y - 1 && r.bottom <= box.bottom + 1), width: box.width, height: box.height };
  });
  assert.ok(geometry.fits, JSON.stringify({ expected, geometry }));
  assert.equal(geometry.lines, 1, `${expected} must fit without wrapping`);
  return { text: expected, ...geometry };
}
const browser = await launchBrowser();
try {
  for (const locale of ['bg', 'en']) for (const width of [320, 390, 430]) {
    const page = await browser.newPage({ viewport: { width, height: 650 }, isMobile: true, hasTouch: true, reducedMotion: 'reduce' });
    const errors = [], writes = [], labels = [];
    const result = { locale, width, pass: false, labels, errors, writes };
    page.on('pageerror', error => errors.push(error.message));
    await page.route('**/*', route => {
      const req = route.request();
      if (new URL(req.url()).origin !== base) return route.abort();
      if (!['GET', 'HEAD'].includes(req.method())) { writes.push({ method: req.method(), url: req.url() }); return route.abort(); }
      return route.continue();
    });
    await page.context().addCookies([{ name: 'cars_locale', value: locale, url: base }, { name: 'cars_prompt', value: 'v1', url: base }]);
    try {
      const expected = locale === 'bg' ? ['Внос', 'Заяви внос', 'Как работи', 'За вноса (демо)', 'Към запитването'] : ['Import', 'Request import', 'How it works', 'Import guide (demo)', 'Back to enquiry'];
      assert.equal((await page.goto(`${base}/${locale}/`, { waitUntil: 'networkidle' })).status(), 200);
      await page.evaluate(() => document.fonts.ready);
      await page.locator('#home-import-tab').click();
      labels.push(await labelFit(page.locator('.dn-search__import-form button[type=submit]'), expected[0]));
      assert.equal((await page.goto(`${base}/${locale}/contact?topic=import`, { waitUntil: 'networkidle' })).status(), 200);
      await page.evaluate(() => document.fonts.ready);
      labels.push(await labelFit(page.locator('.dn-enquiry-import-go'), expected[1]));
      const trigger = page.locator('.dn-import-info-drawer__peek');
      labels.push(await labelFit(trigger.locator('span:not([aria-hidden])'), expected[2]));
      await trigger.click();
      labels.push(await labelFit(page.locator('#import-info-title'), expected[3]));
      labels.push(await labelFit(page.locator('.dn-import-info-actions button'), expected[4]));
      await page.screenshot({ path: path.join(output, `${locale}-${width}-import-guide.png`) });
      await page.locator('.dn-import-info-actions button').click();
      assert.equal(await page.locator('.dn-import-info-dialog[open]').count(), 0);
      assert.ok(await trigger.evaluate(el => document.activeElement === el), 'Closing returns focus to guide trigger');
      assert.ok(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth));
      assert.equal(await page.locator('html').getAttribute('lang'), locale);
      assert.deepEqual(errors, []);
      assert.deepEqual(writes, []);
      result.pass = true;
    } catch (error) { result.failure = String(error.stack || error); }
    finally { await page.close(); results.push(result); console.log(JSON.stringify(result)); }
  }
} finally {
  await browser.close();
  const after = hashes();
  const stable = JSON.stringify(before) === JSON.stringify(after);
  fs.writeFileSync(path.join(output, 'report.json'), JSON.stringify({ at: new Date().toISOString(), base, scope: 'Native mobile EN/BG import labels, one-line text fit, drawer close/focus and disabled writes; not full localization release acceptance', sourceBefore: before, sourceAfter: after, stable, results }, null, 2) + '\n');
  if (!stable || results.some(r => !r.pass)) process.exitCode = 1;
}
