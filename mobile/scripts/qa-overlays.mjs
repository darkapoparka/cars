import { chromium } from 'playwright';
import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import sharp from 'sharp';
const base = process.env.QA_URL || 'http://127.0.0.1:6424';
const out = process.env.QA_OUTPUT || 'reference/web/overlay-repair';
await fs.mkdir(out, { recursive: true });
const browser = await chromium.launch({ headless: true, channel: 'chrome' });
const report = [];
const cases = [
  ['price', 'Price'],
  ['fuel', 'Fuel type'],
  ['condition', 'Condition'],
  ['body', 'Vehicle type'],
  ['power', 'Power'],
  ['color', 'Exterior colour'],
];
const widths = process.env.QA_WIDTHS
  ? process.env.QA_WIDTHS.split(',').map(Number)
  : [427, 375, 320];
try {
  for (const width of widths) {
    const height = width === 427 ? 872 : width === 375 ? 667 : 568;
    const context = await browser.newContext({
      viewport: { width, height },
      deviceScaleFactor: 3,
      isMobile: true,
      hasTouch: true,
    });
    const page = await context.newPage();
    page.setDefaultTimeout(20000);
    const errors = [];
    page.on('pageerror', (e) => errors.push(e.message));
    await page.goto(base + '/search/filters', { waitUntil: 'networkidle', timeout: 90000 });
    await page.locator('[data-hydrated="true"]').waitFor();
    await page.getByRole('button', { name: 'Show all filters', exact: true }).click();
    for (const [id, label] of cases) {
      await page.locator('[data-filter-id="' + id + '"]').click();
      const dialog = page.locator('dialog[open]').last();
      await dialog.waitFor();
      await page.evaluate(() => document.fonts.ready);
      await page.waitForTimeout(200);
      const metrics = await dialog.evaluate((d) => ({
        rect: d.getBoundingClientRect().toJSON(),
        scrollHeight: d.scrollHeight,
        clientHeight: d.clientHeight,
        actions: [...d.querySelectorAll('button')]
          .filter((b) => ['Cancel', 'OK'].includes(b.textContent.trim()))
          .map((b) => ({ text: b.textContent, rect: b.getBoundingClientRect().toJSON() })),
      }));
      await sharp(await page.screenshot())
        .resize(width, height)
        .png()
        .toFile(out + '/' + id + '-' + width + '.png');
      report.push({ id, width, height, ...metrics, errors: [...errors] });
      await page.keyboard.press('Escape');
      await dialog.waitFor({ state: 'hidden' });
    }
    await context.close();
  }
} finally {
  await browser.close();
}
await fs.writeFile(
  out + '/report.json',
  JSON.stringify({ base, at: new Date().toISOString(), report }, null, 2),
);
for (const item of report) {
  const inside = item.actions.every(
    (a) => a.rect.top >= item.rect.top && a.rect.bottom <= item.rect.bottom + 1,
  );
  const bounded =
    item.rect.left >= 0 &&
    item.rect.right <= item.width + 1 &&
    item.rect.top >= 0 &&
    item.rect.bottom <= item.height + 1;
  console.log(
    item.id,
    item.width,
    'footer-visible=' + inside,
    'bounded=' + bounded,
    'dialog-scroll=' + (item.scrollHeight - item.clientHeight),
  );
  if (process.env.QA_ASSERT === '1') {
    assert(inside, item.id + ' footer clipped');
    assert(bounded, item.id + ' exceeds viewport');
    assert.equal(item.errors.length, 0);
  }
}
