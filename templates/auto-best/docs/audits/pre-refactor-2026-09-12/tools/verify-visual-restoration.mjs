import assert from 'node:assert/strict';
import { mkdir, writeFile } from 'node:fs/promises';
import { launchBrowser, previewUrl } from './browser.mjs';
const out = process.env.OUTPUT_DIR || 'artifacts/home-presentation';
await mkdir(out, { recursive: true });
const browser = await launchBrowser();
const results = [];
try {
  for (const width of [320, 360, 390, 430, 767, 768, 1440]) {
    const page = await browser.newPage({ viewport: { width, height: 900 }, reducedMotion: 'reduce' });
    const errors = []; page.on('pageerror', error => errors.push(error.message));
    await page.goto(previewUrl(), { waitUntil: 'networkidle' });
    await page.evaluate(() => document.fonts.ready);
    assert.equal(await page.locator('vite-error-overlay').count(), 0);
    assert.equal(await page.locator('.dn-body-type__baked-art, .dn-discovery-toggle__baked-art').count(), 0);
    for (const [section, item, grid] of [['.dn-body-types','.dn-body-type','#body-types-grid'],['.dn-brand-section','.dn-brand-card','#brands-grid']]) {
      const initial = Number(await page.locator(grid).getAttribute('data-initial-count'));
      const total = Number(await page.locator(grid).getAttribute('data-total-count'));
      await page.locator(section).evaluate(node => node.scrollIntoView({ block: 'center', behavior: 'instant' }));
      assert.equal(await page.locator(`${section} ${item}:visible`).count(), width < 768 ? initial : total);
      await page.waitForFunction(selector => [...document.querySelectorAll(selector)].filter(image => image.getClientRects().length).every(image => image.complete && image.naturalWidth > 0), `${section} ${item} img`);
      await page.locator(section).screenshot({ path: `${out}/${width}-${section.slice(1)}.png` });
      if (width < 768) {
        assert.equal(await page.locator(`${section} .dn-home-section-action:visible`).count(), 0);
        const toggle = page.locator(`${section} .dn-discovery-toggle`);
        const cards = page.locator(`${section} ${item}:visible, ${section} .dn-discovery-toggle`);
        const styles = await cards.evaluateAll(nodes => nodes.map(node => { const label = node.querySelector('strong'); const style = getComputedStyle(label); return { height: node.getBoundingClientRect().height, radius: getComputedStyle(node).borderRadius, font: style.fontSize, weight: style.fontWeight, labelBottom: label.getBoundingClientRect().bottom - node.getBoundingClientRect().top }; }));
        assert(styles.every(style => style.font === '15px' && style.weight === '600' && style.radius === '14px'));
        assert(Math.max(...styles.map(s => s.height)) - Math.min(...styles.map(s => s.height)) < 2);
        assert(Math.max(...styles.map(s => s.labelBottom)) - Math.min(...styles.map(s => s.labelBottom)) < 2);
        await toggle.click(); assert.equal(await toggle.getAttribute('aria-expanded'), 'true');
        assert.equal(await page.locator(`${section} ${item}:visible`).count(), total);
        assert.equal((await toggle.innerText()).trim(), 'Покажи по-малко');
        await toggle.click(); assert.equal(await toggle.getAttribute('aria-expanded'), 'false');
      }
    }
    const quick = page.locator('.dn-mobile-core-actions');
    assert.equal(await quick.isVisible(), width < 768);
    assert.equal(await page.locator('.dn-trust-actions[data-banner-group="browse"]').isVisible(), width >= 768);
    if (width < 768) {
      await quick.evaluate(node => node.scrollIntoView({ block: 'center', behavior: 'instant' }));
      const links = await quick.locator('.dn-mobile-core-card').evaluateAll(nodes => nodes.map(node => node.getAttribute('href')));
      assert.deepEqual(links, ['/listing-grid', '/contact?topic=trade-in', '/contact?topic=import', '/contact?topic=leasing']);
      assert(await quick.locator('img').evaluateAll(images => images.filter(image => image.getClientRects().length).every(image => image.complete && image.naturalWidth > 0)));
      await quick.screenshot({ path: `${out}/${width}-under-hero.png` });
      assert.equal(await page.locator('.dn-videos__intro').isVisible(), false);
      const youtube = await page.locator('.dn-videos > .container').evaluate(node => ({ background: getComputedStyle(node).backgroundColor, radius: getComputedStyle(node).borderRadius }));
      assert.equal(youtube.background, 'rgb(16, 17, 20)'); assert.equal(youtube.radius, '20px');
      await page.locator('.dn-video-card__play').first().click();
      await page.locator('.dn-video-card iframe').waitFor();
      await page.locator('.dn-video-card__close').click();
      assert.equal(await page.locator('.dn-video-card iframe').count(), 0);
      await page.locator('.dn-quick-search__trigger').click();
      const search = page.locator('#dn-quick-search-dialog');
      await page.locator('#dn-quick-search-dialog[open]').waitFor();
      assert.equal(await search.locator('.dn-quick-search__filter-row').count(), 6);
      assert.equal(await page.evaluate(() => document.body.style.position), 'fixed');
      await search.locator('.dn-quick-search__filter-row').first().click();
      await search.getByRole('button', { name: 'Audi', exact: true }).click();
      await page.keyboard.press('Escape'); await page.keyboard.press('Escape');
      await page.keyboard.press('Escape');
      await page.waitForFunction(() => document.body.style.position === '');
      assert(await page.locator('.dn-quick-search__trigger').evaluate(node => node === document.activeElement));
    }
    const duplicateIds = await page.locator('[id]').evaluateAll(nodes => { const ids = nodes.map(node => node.id); return ids.filter((id, index) => ids.indexOf(id) !== index); });
    assert.deepEqual(duplicateIds, []);
    assert.equal(await page.evaluate(() => document.documentElement.scrollWidth > innerWidth), false);
    assert.deepEqual(errors, []);
    results.push({ width, passed: true, errors });
    await page.close();
  }
} catch (error) {
  results.push({ passed: false, error: error.message });
  throw error;
} finally {
  await browser.close();
  await writeFile(`${out}/results.json`, JSON.stringify(results, null, 2));
}
console.log('PASS coded discovery, matching controls, expansion, mobile banners, desktop isolation, YouTube and home-search regression checks:', results);
