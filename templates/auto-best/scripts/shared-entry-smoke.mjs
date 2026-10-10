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
const selectorFrame = (locator) => locator.evaluate(track => {
  const css = getComputedStyle(track);
  const options = [...track.querySelectorAll('.dn-segmented-option')];
  const selected = options.find(el => el.getAttribute('aria-selected') === 'true' || el.getAttribute('aria-pressed') === 'true');
  const selectedCss = getComputedStyle(selected);
  return {
    width: track.getBoundingClientRect().width, height: track.getBoundingClientRect().height,
    background: css.backgroundColor,
    optionWidths: options.map(el => el.getBoundingClientRect().width),
    selectedPaintHeight: selected.getBoundingClientRect().height - parseFloat(selectedCss.borderTopWidth) - parseFloat(selectedCss.borderBottomWidth),
    selectedInsets: [selectedCss.borderTopWidth, selectedCss.borderRightWidth, selectedCss.borderBottomWidth, selectedCss.borderLeftWidth],
    selectedClip: selectedCss.backgroundClip
  };
});
try {
  for (const locale of ['en', 'bg']) for (const width of [320, 390, 768, 1440]) {
    const page = await browser.newPage({ viewport: { width, height: 900 }, reducedMotion: 'reduce' });
    await page.context().addCookies([{ name: 'cars_locale', value: locale, url: base }, { name: 'cars_prompt', value: 'v1', url: base }]);
    const errors = []; page.on('pageerror', error => errors.push(error.message));
    let baseline;
    const entries = [];
    const routes = width < 768 ? ['', '/contact?topic=trade-in', '/contact?topic=import'] : ['/contact?topic=trade-in', '/contact?topic=import'];
    for (const [index, route] of routes.entries()) {
      await page.goto(`${base}/${locale}${route}`, { waitUntil: 'networkidle' });
      await page.evaluate(() => document.fonts.ready);
      const card = page.locator('.dn-entry-card:visible');
      const segment = card.locator('.dn-segmented-option:visible').first();
      const action = card.locator('.dn-entry-action:visible');
      const field = card.locator('.dn-entry-field:visible').first();
      const cardStyle = await style(card);
      delete cardStyle.height;
      const fieldStyle = await style(field);
      delete fieldStyle.gap;
      delete fieldStyle.radius;
      const metrics = { card: cardStyle, segment: await style(segment), action: await style(action), field: fieldStyle };
      assert.equal(metrics.card.background, 'rgb(255, 255, 255)', 'Every entry retains its white card surface');
      assert.equal(metrics.segment.height, 44, 'Every segment is a full 44px target');
      const segmentTrack = card.locator('.dn-segmented-control:visible');
      assert.equal((await style(segmentTrack)).height, 44, 'The selector retains its full touch height');
      assert.equal(await segment.evaluate(element => { const css = getComputedStyle(element); return element.getBoundingClientRect().height - parseFloat(css.borderTopWidth) - parseFloat(css.borderBottomWidth); }), 40, 'Selected segment paint stays inset inside its full touch target');
      assert.equal(metrics.action.height, 44, 'Every primary action shares the same target');
      assert.equal(await action.evaluate(element => parseFloat(getComputedStyle(element, '::before').height)), 40, 'Primary action paint stays compact');
      assert.equal(metrics.field.height, width < 768 ? 48 : 44, 'Mobile entry fields are slightly taller than the selector and CTA');
      if (width < 768) assert.equal(await field.evaluate(el => getComputedStyle(el).fontSize), '16px', 'Entry prompts share the readable 16px field role with the surrounding controls');
      const roles = { segment: metrics.segment, action: metrics.action, field: metrics.field };
      if (baseline) assert.deepEqual(roles, baseline, 'Shared control roles match across routes while card composition is retained');
      else baseline = roles;
      const geometry = await card.evaluate(element => {
        const track = [...element.querySelectorAll('.dn-segmented-control')].find(el => el.getBoundingClientRect().width > 0), field = [...element.querySelectorAll('.dn-entry-field')].find(el => el.getBoundingClientRect().width > 0);
        return { selectorWidth: track.getBoundingClientRect().width, fieldWidth: field.getBoundingClientRect().width,
          labelsFit: [...track.querySelectorAll('.dn-segmented-option')].every(el => el.getBoundingClientRect().width >= 44 && el.scrollWidth <= el.clientWidth + 1 && el.scrollHeight <= el.clientHeight + 1) };
      });
      assert(geometry.labelsFit, 'Localized selector labels fit inside usable targets');
      if (width < 768) {
        assert(geometry.selectorWidth <= Math.min(240, geometry.fieldWidth) + 1, 'The balanced selector stays inside the entry field width');
      }
      const firstFrame = await selectorFrame(segmentTrack);
      assert.equal(firstFrame.height, 44);
      assert.notEqual(firstFrame.background, 'rgba(0, 0, 0, 0)', 'The gray surround remains visible around the selected pill');
      assert.equal(firstFrame.selectedPaintHeight, 40);
      assert.deepEqual(firstFrame.selectedInsets, ['2px', '2px', '2px', '2px'], 'The selected pill stays inset on every side');
      assert.equal(firstFrame.selectedClip, 'padding-box');
      assert(Math.abs(firstFrame.optionWidths[0] - firstFrame.optionWidths[1]) < 1, 'Both segments share an equal width');
      assert(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), 'No horizontal page overflow');
      await segment.focus(); await page.keyboard.press('ArrowRight');
      const second = card.locator('.dn-segmented-option:visible').nth(1);
      const selectedAttribute = route ? 'aria-pressed' : 'aria-selected';
      await page.waitForFunction(attribute => [...document.querySelectorAll('.dn-entry-card .dn-segmented-option')].filter(el => el.getBoundingClientRect().width > 0)[1]?.getAttribute(attribute) === 'true', selectedAttribute);
      assert.equal(await second.getAttribute(route ? 'aria-pressed' : 'aria-selected'), 'true');
      if (route.endsWith('import') && width < 768) {
        await page.locator('.dn-service-editor[open]').waitFor({ state: 'visible' });
        await page.keyboard.press('Escape');
        await page.locator('.dn-service-editor[open]').waitFor({ state: 'hidden' });
        assert(await second.evaluate(element => element === document.activeElement), 'Closing the mode editor returns focus to the selected option');
      }
      const secondFrame = await selectorFrame(segmentTrack);
      assert.deepEqual(secondFrame, firstFrame, 'Switching selections preserves the frame and pill geometry');
      entries.push({ route: route || '/', fieldHeight: metrics.field.height, ...geometry, firstFrame, secondFrame });
      await page.keyboard.press('Home');
      await page.waitForFunction(attribute => [...document.querySelectorAll('.dn-entry-card .dn-segmented-option')].filter(el => el.getBoundingClientRect().width > 0)[0]?.getAttribute(attribute) === 'true', selectedAttribute);
      assert.equal(await segment.getAttribute(route ? 'aria-pressed' : 'aria-selected'), 'true');
      if (route.endsWith('import') && width < 768) {
        await page.locator('.dn-service-editor[open]').waitFor({ state: 'visible' });
        await page.keyboard.press('Escape');
        await page.locator('.dn-service-editor[open]').waitFor({ state: 'hidden' });
      }
      await page.screenshot({ path: `${output}/${locale}-${width}-${index}.png` });
      if (!route) {
        await second.click();
        const input = card.locator('input[name="vehicle_url"]');
        assert.equal((await style(input)).height, 48);
        await input.fill('not a link'); await card.locator('.dn-entry-action:visible').click();
        await card.locator('[role="alert"]').waitFor({ state: 'visible' });
        await input.fill('https://example.com/car'); await card.locator('.dn-entry-action:visible').click();
        await page.waitForURL(url => url.pathname.endsWith('/contact'));
        assert.equal(await page.locator('.dn-service-entry input[name="link"]').inputValue(), 'https://example.com/car');
      }
    }
    assert.deepEqual(errors, []);
    results.push({ locale, width, passed: true, entries });
    await page.close();
    console.log(`PASS shared entry controls and keyboard ${locale} ${width}`);
  }
  await writeFile(`${output}/report.json`, JSON.stringify({ passed: true, results }, null, 2));
} finally { await browser.close(); }
