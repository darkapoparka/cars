import assert from 'node:assert/strict';
import { writeFile } from 'node:fs/promises';
import { launchBrowser } from '../../../scripts/browser.mjs';
const browser = await launchBrowser(), results = [];
try {
  for (const base of ['http://127.0.0.1:6461', 'http://127.0.0.1:6462']) {
    const page = await browser.newPage({ viewport: { width: 390, height: 844 } });
    const errors = []; page.on('pageerror', error => errors.push(error.message));
    for (const route of ['/', '/listing-detail-v1/1']) {
      const response = await page.goto(base + route, { waitUntil: 'networkidle' });
      assert.equal(response.status(), 200);
      assert.equal(await page.locator('vite-error-overlay').count(), 0);
      assert(await page.locator('main').innerText());
      assert.deepEqual(errors, []);
      results.push({ base, route, status: response.status(), errors: [...errors], title: await page.title() });
    }
    await page.close();
  }
} finally { await browser.close(); }
await writeFile('docs/implementation/2026-09-12-mobile/preview-final.json', JSON.stringify({ checkedAt: new Date().toISOString(), results }, null, 2));
console.log('Live dev 6461 and built preview 6462 verified: homepage and PDP render with no application exceptions or framework overlays.');
