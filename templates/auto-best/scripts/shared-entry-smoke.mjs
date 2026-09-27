import assert from 'node:assert/strict';
import { mkdir, writeFile } from 'node:fs/promises';
import { launchBrowser, previewUrl } from './browser.mjs';
const base = previewUrl();
const output = 'artifacts/shared-entry-smoke';
await mkdir(output, { recursive: true });
const browser = await launchBrowser();
const results = [];
const style = (locator) => locator.evaluate(element => {
  const css = getComputedStyle(element), rect = element.getBoundingClientRect();
  return { height: rect.height, font: css.font, background: css.backgroundColor, border: css.border, radius: css.borderRadius, shadow: css.boxShadow, padding: css.padding, gap: css.gap };
});
try {
  for (const locale of ['en', 'bg']) for (const width of [320, 390, 768, 1440]) {
    const page = await browser.newPage({ viewport: { width, height: 900 }, reducedMotion: 'reduce' });
    await page.context().addCookies([{ name: 'cars_locale', value: locale, url: base }, { name: 'cars_prompt', value: 'v1', url: base }]);
    const errors = []; page.on('pageerror', error => errors.push(error.message));
    let baseline;
    const routes = width < 768 ? ['', '/contact?topic=trade-in', '/contact?topic=import'] : ['/contact?topic=trade-in', '/contact?topic=import'];
    for (const [index, route] of routes.entries()) {
      await page.goto(`${base}/${locale}${route}`, { waitUntil: 'networkidle' });
      const card = page.locator('.dn-entry-card:visible');
      const segment = card.locator('.dn-segmented-option').first();
      const action = card.locator('.dn-entry-action:visible');
      const field = card.locator('.dn-entry-field:visible').first();
      const cardStyle = await style(card);
      delete cardStyle.height;
      const fieldStyle = await style(field);
      delete fieldStyle.gap;
      const metrics = { card: cardStyle, segment: await style(segment), action: await style(action), field: fieldStyle };
      assert.equal(metrics.segment.height, 44, 'Every segment is a full 44px target');
      assert.equal(metrics.action.height, 44, 'Every primary action shares the same target');
      assert.equal((await style(field)).height, 44, 'Every single-line entry field shares the same height');
      if (baseline) assert.deepEqual(metrics, baseline, 'Shared entry surfaces and controls must match across routes');
      else baseline = metrics;
      assert(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), 'No horizontal page overflow');
      await segment.focus(); await page.keyboard.press('ArrowRight');
      const second = card.locator('.dn-segmented-option').nth(1);
      assert.equal(await second.getAttribute(route ? 'aria-pressed' : 'aria-selected'), 'true');
      await page.keyboard.press('Home');
      assert.equal(await segment.getAttribute(route ? 'aria-pressed' : 'aria-selected'), 'true');
      await page.screenshot({ path: `${output}/${locale}-${width}-${index}.png` });
      if (!route) {
        await second.click();
        const input = card.locator('input[name="vehicle_url"]');
        assert.equal((await style(input)).height, 44);
        await input.fill('not a link'); await card.locator('.dn-entry-action:visible').click();
        await card.locator('[role="alert"]').waitFor({ state: 'visible' });
        await input.fill('https://example.com/car'); await card.locator('.dn-entry-action:visible').click();
        await page.waitForURL(url => url.pathname.endsWith('/contact'));
        assert.equal(await page.locator('.dn-service-entry input[name="link"]').inputValue(), 'https://example.com/car');
      }
    }
    assert.deepEqual(errors, []);
    results.push({ locale, width, passed: true });
    await page.close();
    console.log(`PASS shared entry controls and keyboard ${locale} ${width}`);
  }
  await writeFile(`${output}/report.json`, JSON.stringify({ passed: true, results }, null, 2));
} finally { await browser.close(); }
