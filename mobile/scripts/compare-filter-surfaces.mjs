import { chromium } from 'playwright';
import fs from 'node:fs/promises';
import sharp from 'sharp';
const base = process.env.QA_URL || 'http://127.0.0.1:6426';
const out = process.env.QA_OUTPUT || 'reference/web/overlay-after';
await fs.mkdir(out, { recursive: true });
const browser = await chromium.launch({ headless: true, channel: 'chrome' });
const reports = [];
const cases = [
  ['price', '403-price', 'price'],
  ['fuel', '404-fuel', 'fuel'],
  ['condition', '405-condition-dialog', 'condition'],
  ['power', '406-power', 'power'],
  ['color', '407-color', 'color'],
  ['main-condition', '408-main-condition', null, 'Condition'],
  ['main-financial', '409-main-financial', null, 'Financial'],
];
try {
  for (const [name, native, id, group] of cases) {
    const context = await browser.newContext({
      viewport: { width: 427, height: 872 },
      deviceScaleFactor: 3,
      isMobile: true,
      hasTouch: true,
    });
    const page = await context.newPage();
    await page.goto(base + (group ? '/search' : '/search/filters'), {
      waitUntil: 'networkidle',
      timeout: 90000,
    });
    await page.locator('[data-hydrated="true"]').waitFor();
    if (id) {
      if (id === 'color')
        await page.getByRole('button', { name: 'Show all filters', exact: true }).click();
      await page.locator('[data-filter-id="' + id + '"]').click();
    } else await page.getByRole('button', { name: new RegExp('^' + group) }).click();
    await page.evaluate(() => document.fonts.ready);
    await page.waitForTimeout(300);
    const web = await sharp(await page.screenshot())
      .resize(427, 872)
      .png()
      .toBuffer();
    const source = await fs.readFile('reference/android/normalized/' + native + '.png');
    await fs.writeFile(out + '/' + name + '-matched.png', web);
    await sharp({ create: { width: 854, height: 872, channels: 3, background: '#ffffff' } })
      .composite([
        { input: source, left: 0, top: 0 },
        { input: web, left: 427, top: 0 },
      ])
      .png()
      .toFile(out + '/compare-' + name + '.png');
    reports.push({ name, native, url: page.url() });
    await context.close();
  }
} finally {
  await browser.close();
}
await fs.writeFile(out + '/comparison-report.json', JSON.stringify({ base, reports }, null, 2));
console.log('Native-left/browser-right comparison captures:', reports.length);
