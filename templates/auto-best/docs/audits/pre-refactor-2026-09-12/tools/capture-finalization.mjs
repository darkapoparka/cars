import { mkdir, writeFile } from 'node:fs/promises';
import { launchBrowser, previewUrl } from './browser.mjs';
const output = 'artifacts/mobile-finalization';
await mkdir(output, { recursive: true });
const browser = await launchBrowser();
const results = [];
try {
  for (const width of [320, 390, 430, 1440]) {
    const page = await browser.newPage({ viewport: { width, height: 844 }, reducedMotion: 'reduce' });
    const errors = []; page.on('pageerror', error => errors.push(error.message));
    for (const [name, route] of [['home','/'],['pdp','/listing-detail-v1/1'],['sell','/contact?topic=trade-in'],['import','/contact?topic=import']]) {
      await page.goto(previewUrl() + route, { waitUntil: 'networkidle' });
      await page.evaluate(() => document.fonts.ready);
      await page.screenshot({ path: `${output}/${name}-${width}.png`, fullPage: true });
      if (name === 'pdp') {
        await page.locator('.dn-financing button').click();
        await page.locator('.dn-finance-dialog[open]').waitFor();
        await page.screenshot({ path: `${output}/finance-${width}.png` });
        await page.keyboard.press('Escape');
      }
      if (name === 'sell') {
        await page.locator('.dn-enquiry-entry-field:visible, .dn-enquiry-desktop-start.dn-enquiry-primary:visible').click();
        await page.locator('.dn-enquiry[open]').waitFor();
        await page.screenshot({ path: `${output}/enquiry-${width}.png` });
        await page.keyboard.press('Escape');
      }
      results.push({ width, route, errors: [...errors], overflow: await page.evaluate(() => document.documentElement.scrollWidth - innerWidth) });
    }
    await page.close();
  }
} finally { await browser.close(); await writeFile(`${output}/capture.json`, JSON.stringify(results,null,2)); }
