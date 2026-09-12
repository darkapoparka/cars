import assert from 'node:assert/strict';
import { mkdir, writeFile } from 'node:fs/promises';
import { launchBrowser, previewUrl, isolateMapProvider } from './browser.mjs';
const base = previewUrl();
const out = process.env.RECOVERY_OUT || 'artifacts/contact-restoration';
await mkdir(out, { recursive: true });
const browser = await launchBrowser();
const results = [];
async function close(page) {
  await page.keyboard.press('Escape');
  await page.waitForFunction(() => document.body.style.position !== 'fixed');
}
try {
  for (const width of [320, 390, 430]) {
    const page = await browser.newPage({ viewport: { width, height: 844 }, deviceScaleFactor: 1 });
    if (process.env.MAP_PROVIDER_FIXTURE === '1') await isolateMapProvider(page);
    const errors = []; page.on('pageerror', error => errors.push(error.message));
    const geometry = [];
    for (const [kind, name] of [['trade-in', 'sell'], ['import', 'import']]) {
      await page.goto(`${base}/contact?topic=${kind}`, { waitUntil: 'networkidle' });
      await page.locator('.dn-hero-vehicles__front').evaluate(img => img.decode());
      const scene = await page.locator('.dn-hero-vehicles__front').getAttribute('data-scene');
      assert.equal(scene, name, 'Use the whole original generated scene, not repeated support objects');
      assert.equal(await page.locator('.dn-hero-vehicles__support').count(), 0);
      assert.equal(await page.locator('.dn-enquiry-mode:visible').count(), 1);
      const entry = page.locator(kind === 'trade-in' ? '.dn-enquiry-entry-field' : '.dn-enquiry-link-row');
      const box = await entry.boundingBox(); assert.equal(box.height, 44);
      geometry.push(await page.locator('.dn-contact-intent__main').boundingBox());
      await page.screenshot({ path: `${out}/${name}-entry-${width}.png` });
      const help = page.locator('.dn-enquiry-how-trigger'); await help.click();
      const sheet = page.locator('.dn-enquiry-how-dialog'); await sheet.waitFor({ state: 'visible' });
      assert.equal(await sheet.evaluate(el => el.matches(':modal')), true);
      assert.equal(await sheet.evaluate(el => getComputedStyle(el).backgroundColor), 'rgb(20, 23, 29)');
      assert.equal(await sheet.locator('.dn-enquiry-how-panel').evaluate(el => getComputedStyle(el).backgroundColor), 'rgb(20, 23, 29)');
      assert.equal(await sheet.locator('li').count(), 3);
      const locked = await page.evaluate(() => ({ y: scrollY, top: document.body.style.top }));
      await page.mouse.wheel(0, 900);
      assert.deepEqual(await page.evaluate(() => ({ y: scrollY, top: document.body.style.top })), locked);
      await page.screenshot({ path: `${out}/${name}-how-${width}.png` });
      await close(page); assert(await help.evaluate(el => el === document.activeElement));
      if (kind === 'trade-in') {
        await page.locator('.dn-enquiry-mode').getByText('Бартер', { exact: true }).click();
        await entry.click();
        assert.equal(await page.locator('.dn-enquiry-purpose input:checked').inputValue(), 'Бартер');
      } else {
        const linkTab = page.getByRole('tab', { name: 'Линк', exact: true }); await linkTab.focus();
        await page.keyboard.press('ArrowRight');
        assert.equal(await page.getByRole('tab', { name: 'Информация', exact: true }).getAttribute('aria-selected'), 'true');
        assert.equal(await page.locator('.dn-enquiry-link-row').isVisible(), false);
        await page.screenshot({ path: `${out}/import-information-${width}.png` });
        await page.getByRole('button', { name: 'Опиши автомобила', exact: true }).click();
      }
      const enquiry = page.locator('.dn-enquiry'); await enquiry.waitFor({ state: 'visible' });
      assert.equal(await enquiry.evaluate(el => el.matches(':modal')), true);
      assert.equal(await enquiry.evaluate(el => getComputedStyle(el).backgroundColor), 'rgb(20, 23, 29)');
      await page.screenshot({ path: `${out}/${name}-drawer-${width}.png` });
      await close(page);
      assert.equal(await page.evaluate(() => document.documentElement.scrollWidth > innerWidth), false);
    }
    assert(Math.abs(geometry[0].height - geometry[1].height) <= 1, 'Sell and Import entry cards must match');
    await page.goto(`${base}/contact`, { waitUntil: 'networkidle' });
    assert.equal(await page.locator('.dn-showroom-map__preview').count(), 0);
    assert.equal(await page.locator('.dn-showroom-map iframe').count(), 1);
    assert.equal(await page.locator('.dn-contact-location').evaluate(el => getComputedStyle(el).backgroundColor), 'rgb(255, 255, 255)');
    await page.locator('.dn-contact-location').scrollIntoViewIfNeeded();
    await page.waitForTimeout(1500);
    await page.locator('.dn-contact-location').screenshot({ path: `${out}/contact-map-${width}.png` });
    assert.deepEqual(errors, []);
    results.push({ width, passed: true, geometry, pageErrors: errors });
    console.log(`PASS restored Sell/Import controls, dark dialogs, complete scene artwork, real map at ${width}px`);
    await page.close();
  }
} catch (error) {
  results.push({ passed: false, error: error.stack });
  throw error;
} finally {
  await browser.close();
  await writeFile(`${out}/report.json`, JSON.stringify({ base, mapProvider: process.env.MAP_PROVIDER_FIXTURE === '1' ? 'fixture' : 'live', engine: process.env.PLAYWRIGHT_ENGINE || 'chromium', results }, null, 2));
}
