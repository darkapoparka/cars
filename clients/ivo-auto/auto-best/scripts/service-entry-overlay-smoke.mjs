import assert from 'node:assert/strict';
import { mkdir } from 'node:fs/promises';
import { launchBrowser, previewUrl } from './browser.mjs';
import { smokeReport } from './smoke-report.mjs';
import { serviceEntry, serviceAction, fillServiceEntry } from './service-entry-fixture.mjs';

const base = previewUrl(), output = 'artifacts/service-entry-overlays';
await mkdir(output, { recursive: true });
const suite = await smokeReport(output, base), browser = await launchBrowser();
async function fullscreen(page, selector) {
  await page.evaluate(() => new Promise(resolve => requestAnimationFrame(() => requestAnimationFrame(resolve))));
  const geometry = await page.locator(selector).evaluate(dialog => {
    const box = dialog.getBoundingClientRect();
    return { x: box.x, y: box.y, width: box.width, height: box.height, viewportWidth: innerWidth, viewportHeight: innerHeight, radius: getComputedStyle(dialog).borderRadius };
  });
  assert(Math.abs(geometry.x) <= 1 && Math.abs(geometry.y) <= 1 && Math.abs(geometry.width - geometry.viewportWidth) <= 1 && Math.abs(geometry.height - geometry.viewportHeight) <= 1, JSON.stringify(geometry));
  assert.equal(geometry.radius, '0px');
}
async function editorReflow(page) {
  for (const content of ['html { font-size: 200% !important; }', '* { line-height: 1.5 !important; letter-spacing: .12em !important; word-spacing: .16em !important; }']) {
    const style = await page.addStyleTag({ content });
    try {
      await fullscreen(page, '.dn-service-editor[open]');
      const clipped = await page.locator('.dn-service-editor[open]').evaluate(dialog => {
        return [...dialog.querySelectorAll('button,label,h2')].filter(element => element.checkVisibility() && (element.scrollWidth > element.clientWidth + 2 || element.scrollHeight > element.clientHeight + 2)).map(element => element.textContent.trim());
      });
      assert.deepEqual(clipped, []);
    } finally { await style.evaluate(element => element.remove()); }
  }
}
try {
  for (const locale of ['bg', 'en']) for (const width of [320, 390, 430]) await suite.check(`${locale} ${width} service entry overlays`, async () => {
    const page = await browser.newPage({ viewport: { width, height: 844 }, reducedMotion: 'reduce' });
    const errors = [], posts = [];
    page.on('pageerror', error => errors.push(error.message));
    page.on('request', request => { if (!['GET', 'HEAD'].includes(request.method())) posts.push(request.url()); });
    await page.context().addCookies([{ name: 'cars_prompt', value: 'v1', url: base }, { name: 'cars_locale', value: locale, url: base }]);
    try {
      await page.goto(`${base}/${locale}/contact?topic=trade-in`, { waitUntil: 'networkidle' });
      const sell = serviceEntry(page), sellField = sell.locator('.dn-service-entry__field');
      assert.equal(await sell.locator('input:visible,textarea:visible').count(), 0);
      assert.equal(await sellField.count(), 1);
      await sellField.click();
      await fullscreen(page, '.dn-service-editor[open]');
      const editor = page.locator('.dn-service-editor[open]');
      await editorReflow(page);
      const close = await editor.locator('.dn-overlay-close').evaluate(button => ({ width: button.getBoundingClientRect().width, height: button.getBoundingClientRect().height, target: parseFloat(getComputedStyle(button).getPropertyValue('--dn-control-hit-height')) }));
      assert.equal(close.width, close.target); assert.equal(close.height, close.target); assert(close.target >= 44);
      assert(await editor.locator('[name=make]').evaluate(input => input === document.activeElement));
      await editor.locator('[name=make]').fill('Cancelled');
      await page.keyboard.press('Escape');
      assert(await sellField.evaluate(field => field === document.activeElement));
      assert.doesNotMatch(await sellField.innerText(), /Cancelled/);
      await fillServiceEntry(page, { make: 'Audi', model: 'A6' });
      assert.match(await sellField.innerText(), /Audi A6/);
      await sellField.click();
      assert.equal(await editor.locator('[name=make]').inputValue(), 'Audi');
      await editor.locator('[name=model]').fill('Discarded');
      await editor.locator('.dn-service-editor__cancel').click();
      assert.match(await sellField.innerText(), /Audi A6/);
      await page.screenshot({ path: `${output}/${locale}-${width}-sell.png` });
      await serviceAction(page).click();
      await fullscreen(page, '.dn-tradein-dialog[open]');
      await page.locator('.dn-tradein-back').click();
      assert.equal(await page.locator('.dn-tradein-dialog [name=year]').evaluate(input => input.required), false);
      await page.locator('.dn-tradein-primary').click();
      await page.locator('.dn-tradein-primary').click();
      assert.match(await page.locator('.dn-tradein-review-card').innerText(), /Audi A6/);
      await page.keyboard.press('Escape');
      assert(await serviceAction(page).evaluate(action => action === document.activeElement));

      await page.goto(`${base}/${locale}/contact?topic=import`, { waitUntil: 'networkidle' });
      const entry = serviceEntry(page), field = entry.locator('.dn-service-entry__field');
      assert.equal(await entry.locator('input:visible,textarea:visible').count(), 0);
      await field.click();
      await editor.locator('[name=reference]').fill('javascript:alert(1)');
      await editor.locator('.dn-service-editor__save').click();
      assert(await editor.locator('[role=alert]').isVisible());
      await fillServiceEntry(page, { link: 'https://example.com/car?id=7' });
      assert.match(await field.innerText(), /id=7/);
      await entry.locator('.dn-service-entry__choices button').nth(1).click();
      await fullscreen(page, '.dn-service-editor[open]');
      await editorReflow(page);
      await page.setViewportSize({ width, height: 420 });
      await fullscreen(page, '.dn-service-editor[open]');
      const footer = await editor.locator('footer').boundingBox();
      assert(footer.y >= 0 && footer.y + footer.height <= 421);
      await fillServiceEntry(page, { make: 'BMW', model: 'X5', budget: '40000', year: '2022' });
      assert.match(await field.innerText(), /BMW X5 2022/);
      await page.setViewportSize({ width, height: 844 });
      await page.screenshot({ path: `${output}/${locale}-${width}-import.png` });
      await field.click();
      await fullscreen(page, '.dn-service-editor[open]');
      await page.screenshot({ path: `${output}/${locale}-${width}-editor.png` });
      await page.keyboard.press('Escape');
      await serviceAction(page).click();
      await fullscreen(page, '.dn-enquiry[open]');
      await page.locator('.dn-enquiry-primary').click();
      const summary = await page.locator('.dn-enquiry-summary').innerText();
      assert.match(summary, /BMW X5/); assert.match(summary, /40000/); assert.doesNotMatch(summary, /example.com/);
      await page.keyboard.press('Escape');
      assert(await serviceAction(page).evaluate(action => action === document.activeElement));
      assert.deepEqual(errors, []); assert.deepEqual(posts, []);
    } finally { await page.close(); }
  });
} finally { await browser.close(); await suite.finish(); }
