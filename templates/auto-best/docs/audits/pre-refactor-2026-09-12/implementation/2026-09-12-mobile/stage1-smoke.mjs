import assert from 'node:assert/strict';
import { mkdir, writeFile } from 'node:fs/promises';
import { launchBrowser } from '../../../scripts/browser.mjs';
const base = 'http://127.0.0.1:6461';
const out = 'artifacts/mobile-finalization'; await mkdir(out, { recursive: true });
const browser = await launchBrowser(); const results = [];
try {
 const page = await browser.newPage({ viewport: { width: 390, height: 844 }, reducedMotion: 'reduce' });
 const cdp = await page.context().newCDPSession(page); await cdp.send('Network.enable'); await cdp.send('Network.setCacheDisabled', { cacheDisabled: true });
 await page.goto(base, { waitUntil: 'networkidle' });
 const images = await page.evaluate(() => performance.getEntriesByType('resource').filter(r => r.name.includes('/assets/images/')).map(r => ({ url: r.name, bytes: r.transferSize })));
 const imageBytes = images.reduce((sum, r) => sum + r.bytes, 0); assert(imageBytes < 1_500_000, `Initial image budget: ${imageBytes}`);
 assert(!images.some(r => /(?:service-(?:car|sell-euros|import|leasing)-v1|menu-(?:import|leasing)-v2)\.png/.test(r.url)));
 await page.screenshot({ path: `${out}/home-390-phase1.png` });
 await page.locator('.dn-quick-search__trigger').click(); await page.locator('dialog:modal').waitFor();
 assert.equal(await page.evaluate(() => getComputedStyle(document.body).position), 'fixed');
 await page.evaluate(() => scrollTo({ top: 1200, behavior: 'instant' })); assert.equal(await page.evaluate(() => scrollY), 0);
 await page.keyboard.press('Escape'); assert.equal(await page.evaluate(() => document.body.style.position), ''); results.push({ check: 'home media and scroll lock', imageBytes, images });
 for (const width of [320, 390, 430, 768, 1440]) {
  await page.setViewportSize({ width, height: 844 }); await page.goto(base, { waitUntil: 'networkidle' });
  for (const image of await page.locator('.dn-body-type__baked-art:visible').all()) { const bounds = await image.boundingBox(); const parent = await image.locator('..').boundingBox(); assert(bounds.width <= parent.width + 1); assert(width < 768, 'Baked mobile art must not render on desktop'); }
  await page.locator('.dn-body-types').screenshot({ path: `${out}/types-${width}.png` });
 }
 await page.goto(`${base}/contact?topic=trade-in`, { waitUntil: 'domcontentloaded' }); await page.waitForTimeout(500); await page.getByRole('button', { name: 'Предложи автомобил', exact: true }).click(); await page.locator('.dn-enquiry:modal').waitFor();
 await page.locator('input[name=make]').fill('   '); await page.locator('input[name=model]').fill('   '); await page.getByRole('button', { name: 'Продължи', exact: true }).click(); assert(await page.locator('#enquiry-make-error').isVisible()); assert(await page.locator('input[name=make]').isVisible()); results.push({ check: 'trimmed required fields', passed: true });
 await page.screenshot({ path: `${out}/sell-invalid-phase1.png` });
} finally { await browser.close(); await writeFile(`${out}/phase1.json`, JSON.stringify(results, null, 2)); }
console.log('PASS phase 1:', results.map(r => ({ check: r.check, imageBytes: r.imageBytes })));
