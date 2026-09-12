import assert from 'node:assert/strict';
import { mkdir, writeFile } from 'node:fs/promises';
import { launchBrowser, previewUrl, isolateMapProvider } from './browser.mjs';
const base = previewUrl();
const engine = process.env.PLAYWRIGHT_ENGINE || 'chromium';
const out = `artifacts/mobile-resilience-${engine}`;
await mkdir(out, { recursive: true });
const results = [];
const save = () => writeFile(`${out}/report.json`, JSON.stringify({ mapProvider: 'fixture; live rendering checked separately', generatedAt: new Date().toISOString(), base, engine, results }, null, 2));
await save();
const browser = await launchBrowser();
async function check(name, run) {
  const page = await browser.newPage({ viewport: { width: 390, height: 844 }, reducedMotion: 'reduce' });
  await isolateMapProvider(page);
  page.setDefaultTimeout(10000);
  page.setDefaultNavigationTimeout(30000);
  try { results.push({ name, passed: true, evidence: await run(page) }); console.log(`PASS ${name}`); }
  catch (error) { results.push({ name, passed: false, error: error.stack }); console.error(`FAIL ${name}: ${error.message}`); }
  finally { await page.close(); await save(); }
}
async function visit(page, route) {
  await page.goto(base + route, { waitUntil: 'networkidle' });
  await page.evaluate(() => document.fonts.ready);
}
async function shot(page, name) { await page.screenshot({ path: `${out}/${name}.png` }); }
async function geometry(page) {
  assert(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1), 'Document must reflow');
}
try {
  await check('finance round trip and invalid URL', async page => {
    await visit(page, '/listing-detail-v1/1');
    await page.locator('.dn-detail-finance-trigger').click();
    await page.locator('.dn-detail-finance-dialog:modal').waitFor();
    await page.locator('.dn-finance-calculator:visible input').fill('10000');
    await page.locator('.dn-finance-calculator:visible select').selectOption('24');
    await page.locator('.dn-finance-calculator:visible a').click();
    await page.waitForURL(url => url.pathname === '/contact');
    await page.locator('.dn-contact-vehicle').click();
    await page.waitForURL(url => url.pathname === '/listing-detail-v1/1');
    await page.locator('.dn-detail-finance-trigger').click();
    assert.equal(await page.locator('.dn-finance-calculator:visible input').inputValue(), '10000');
    assert.equal(await page.locator('.dn-finance-calculator:visible select').inputValue(), '24');
    await shot(page, 'finance-restored');
    await visit(page, '/contact?topic=leasing&vehicle=1&down_payment=999999999&term=6');
    assert(!(await page.locator('.dn-contact-vehicle').getAttribute('href')).includes('down_payment'));
    return { amount: 10000, months: 24, malformedSelectionRejected: true };
  });
  await check('failed stock images retain navigation and layout', async page => {
    await page.route('**/*', route => route.request().resourceType() === 'image' && route.request().url().includes('stock-') ? route.abort() : route.continue());
    await visit(page, '/listing-grid?make=BMW');
    await page.locator('.dn-vehicle-image-fallback').first().waitFor();
    await page.locator('.dn-vehicle-card__link').first().click();
    await page.waitForURL(url => url.pathname.startsWith('/listing-detail-v1/'));
    await page.locator('.dn-detail-gallery .dn-vehicle-image-fallback').waitFor();
    await geometry(page); await shot(page, 'image-unavailable');
    await page.locator('.dn-detail-mobile-back').click();
    await page.waitForURL(url => url.searchParams.get('make') === 'BMW');
  });
  for (const [width, height] of [[320, 568], [390, 400], [700, 390]]) {
    await check(`short viewport and scroll restoration ${width}x${height}`, async page => {
      await page.setViewportSize({ width, height });
      await visit(page, '/');
      await page.evaluate(() => scrollTo({ top: 160, behavior: 'instant' }));
      const trigger = page.locator('.dn-quick-search__trigger');
      await trigger.scrollIntoViewIfNeeded();
      const before = await page.evaluate(() => scrollY);
      await trigger.click(); await page.locator('#dn-quick-search-dialog:modal').waitFor();
      assert(await page.locator('#quick-search-title').evaluate(node => node === document.activeElement));
      await page.locator('#quick-search-input').fill('Audi');
      const footer = await page.locator('.dn-quick-search__mobile-footer').boundingBox();
      assert(footer && footer.y >= 0 && footer.y + footer.height <= height + 1);
      await geometry(page); await shot(page, `short-search-${width}`);
      await page.keyboard.press('Escape');
      // WebKit dispatches the native close event asynchronously. Wait for the owner's cleanup, not an arbitrary delay.
      await page.waitForFunction(() => getComputedStyle(document.body).position !== 'fixed');
      await page.waitForFunction(y => Math.abs(scrollY - y) <= 1, before);
      assert(Math.abs(await page.evaluate(() => scrollY) - before) <= 1);
      assert(await trigger.evaluate(node => node === document.activeElement));
      return { width, height, scrollBefore: before, footer };
    });
  }
  await check('clipboard denial and share cancellation', async page => {
    await page.addInitScript(() => {
      Object.defineProperty(navigator, 'clipboard', { configurable: true, value: { writeText: async () => { throw new DOMException('Denied', 'NotAllowedError'); } } });
      Object.defineProperty(navigator, 'share', { configurable: true, value: async () => { throw new DOMException('Cancelled', 'AbortError'); } });
    });
    const posts = []; page.on('request', req => { if (req.method() === 'POST' && req.frame() === page.mainFrame()) posts.push(req.url()); });
    await visit(page, '/contact?topic=trade-in');
    await page.locator('.dn-tradein-start').click();
    await page.locator('.dn-tradein-dialog:modal').waitFor();
    const dialog = page.locator('.dn-tradein-dialog');
    await dialog.locator('[name=make]').fill('Audi'); await dialog.locator('[name=model]').fill('A6');
    await dialog.locator('[name=year]').fill('2020'); await dialog.locator('[name=mileage]').fill('85000');
    await dialog.getByRole('button', { name: 'Към снимките', exact: true }).click();
    await dialog.getByRole('button', { name: 'Прегледай заявката', exact: true }).click();
    await dialog.getByRole('button', { name: 'Копирай текста', exact: true }).click();
    assert.match(await dialog.locator('[role=status]').innerText(), /Копирането не е достъпно/);
    await dialog.getByRole('button', { name: 'Сподели заявката', exact: true }).click();
    assert.equal(await dialog.locator('[role=status]').count(), 0, 'Cancellation is not a successful submission');
    assert(await dialog.locator('.dn-tradein-review-card').isVisible()); assert.deepEqual(posts, []);
    await shot(page, 'cancelled-share-draft-retained');
    return { externalSubmissions: posts.length, cancelledShareRetainsDraft: true };
  });
  if (process.env.PRODUCTION_ASSERTIONS === '1') await check('production CSP and preview indexing guard', async page => {
    const response = await page.goto(base, { waitUntil: 'networkidle' });
    const policy = response.headers()['content-security-policy'];
    assert(policy); const scripts = policy.match(/(?:^|;)\s*script-src\s+([^;]+)/)?.[1] || '';
    assert(!scripts.includes('unsafe-inline')); assert(/nonce-|sha256-/.test(scripts));
    assert(!policy.match(/connect-src[^;]*(?:ws:|wss:)/));
    let blocked = false;
    try { await page.addScriptTag({ content: 'window.__unexpectedInlineScript = true;' }); } catch { blocked = true; }
    assert(blocked); assert.equal(await page.evaluate(() => window.__unexpectedInlineScript), undefined);
    assert.match(await page.locator('meta[name=robots]').first().getAttribute('content'), /noindex/);
    assert.match(await (await fetch(`${base}/robots.txt`)).text(), /Disallow: \//);
    return { csp: policy, arbitraryInlineScriptBlocked: blocked, previewNoindex: true };
  });
} finally { await browser.close(); await save(); }
if (results.some(result => !result.passed)) process.exitCode = 1;
