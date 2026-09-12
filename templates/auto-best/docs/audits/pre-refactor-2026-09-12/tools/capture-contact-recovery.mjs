import { mkdir, writeFile } from 'node:fs/promises';
import { launchBrowser } from './browser.mjs';
const base = 'http://127.0.0.1:6461';
const out = process.env.RECOVERY_OUT;
if (!out) throw new Error('RECOVERY_OUT is required');
await mkdir(out, { recursive: true });
const browser = await launchBrowser();
const rows = [];
try {
  for (const width of [390, 1440]) {
    const page = await browser.newPage({ viewport: { width, height: 844 }, deviceScaleFactor: 1 });
    for (const [name, route] of [['contact', '/contact'], ['sell', '/contact?topic=trade-in'], ['import', '/contact?topic=import']]) {
      const errors = []; const onError = error => errors.push(error.message); page.on('pageerror', onError);
      const response = await page.goto(base + route, { waitUntil: 'networkidle' });
      await page.screenshot({ path: `${out}/${name}-${width}.png`, fullPage: true });
      const location = page.locator('.dn-contact-location');
      await location.scrollIntoViewIfNeeded(); await page.waitForTimeout(1500);
      await location.screenshot({ path: `${out}/${name}-map-${width}.png` });
      rows.push({ route, width, status: response.status(), errors, overflow: await page.evaluate(() => document.documentElement.scrollWidth > innerWidth) });
      page.off('pageerror', onError);
    }
    await page.close();
  }
} finally { await browser.close(); }
await writeFile(`${out}/routes.json`, JSON.stringify(rows, null, 2));
console.log(JSON.stringify(rows));