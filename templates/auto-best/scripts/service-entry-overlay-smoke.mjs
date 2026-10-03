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
async function guideCheck(page, locale, width, topic) {
  const header = await page.locator('.dn-mobile-control').evaluateAll(actions => actions.map(action => {
    const box = action.getBoundingClientRect(), icon = action.querySelector('svg').getBoundingClientRect();
    return { width: box.width, height: box.height, icon: icon.width };
  }));
  assert.deepEqual(header, [{ width: 44, height: 44, icon: 26 }, { width: 44, height: 44, icon: 26 }]);
  const trigger = page.locator('.dn-service-guide button[aria-haspopup=dialog]');
  const draft = await serviceEntry(page).locator('.dn-service-entry__field').innerText();
  assert.equal(await trigger.evaluate(button => getComputedStyle(button).backgroundColor), 'rgb(255, 255, 255)');
  assert.equal(await trigger.locator('[data-icon-family="fluent-system-regular"]').count(), 1);
  const cardLayout = await trigger.evaluate(button => {
    const box = button.getBoundingClientRect(), arrow = button.querySelector('svg').getBoundingClientRect();
    return { corner: parseFloat(getComputedStyle(button).borderRadius), arrowOffset: arrow.y + arrow.height / 2 - box.y - box.height / 2 };
  });
  assert(cardLayout.corner >= 16 && Math.abs(cardLayout.arrowOffset) <= 1, 'The white guide card centers its arrow beside both copy lines');
  const entryLayout = await serviceEntry(page).evaluate(entry => {
    const tabs = entry.querySelector('.dn-service-entry__choices').getBoundingClientRect();
    const field = entry.querySelector('.dn-service-entry__field').getBoundingClientRect();
    const title = document.querySelector('#service-form-title');
    return { tabWidth: tabs.width, fieldWidth: field.width, centerOffset: tabs.x + tabs.width / 2 - field.x - field.width / 2, titleClip: getComputedStyle(title).clipPath };
  });
  assert(entryLayout.tabWidth < entryLayout.fieldWidth && Math.abs(entryLayout.centerOffset) <= 1, 'Mobile service tabs stay compact and centered above the field');
  assert.equal(entryLayout.titleClip, 'inset(50%)', 'The form keeps its accessible title without a visible mobile heading');
  const preview = await trigger.locator('.dn-service-process-preview__copy').evaluate(copy => {
    const box = copy.getBoundingClientRect();
    return { height: box.height, lineHeight: parseFloat(getComputedStyle(copy).lineHeight), fits: copy.scrollWidth <= copy.clientWidth + 1 };
  });
  assert(preview.fits && preview.height <= preview.lineHeight + 1, 'The supporting explanation fits one complete line at phone widths');
  await trigger.click();
  const info = page.locator(topic === 'trade-in' ? '#tradein-info-dialog' : '#import-info-dialog');
  assert(await info.isVisible());
  assert.equal(await info.locator('li').count(), 6);
  assert(await info.locator('h2').evaluate(heading => heading === document.activeElement));
  assert.equal(await page.locator('.dn-mobile-bottom-nav').isVisible(), false);
  assert.equal(await page.evaluate(() => getComputedStyle(document.body).overflow), 'hidden');
  await page.keyboard.press('Tab');
  await page.keyboard.press('Shift+Tab');
  assert(await info.evaluate(dialog => dialog.contains(document.activeElement)));
  await page.screenshot({ path: `${output}/${locale}-${width}-${topic}-guide.png` });
  await page.keyboard.press('Escape');
  assert.equal(await info.isVisible(), false);
  assert(await trigger.evaluate(button => button === document.activeElement));
  assert(await page.locator('.dn-mobile-bottom-nav').isVisible());
  await trigger.click();
  await info.locator('header button').click();
  assert.equal(await info.isVisible(), false);
  await trigger.click();
  await info.locator('footer button').click();
  assert.equal(await info.isVisible(), false);
  await trigger.click();
  const box = await info.boundingBox();
  assert(box.y > 24);
  await page.mouse.click(8, 8);
  assert.equal(await info.isVisible(), false, 'Tapping the backdrop dismisses the guide');
  await trigger.click();
  const handle = await info.locator('[class*="__grabber"]').boundingBox();
  await page.mouse.move(handle.x + handle.width / 2, handle.y + handle.height / 2);
  await page.mouse.down();
  await page.mouse.move(handle.x + handle.width / 2, handle.y + handle.height / 2 + 100, { steps: 5 });
  await page.mouse.up();
  assert.equal(await info.isVisible(), false, 'Dragging down dismisses the guide');
  await trigger.click();
  await info.locator('[class*="__grabber"]').press('Enter');
  assert.equal(await info.isVisible(), false, 'The drag handle also supports keyboard dismissal');
  await trigger.click();
  await page.setViewportSize({ width: 768, height: 844 });
  assert.equal(await info.isVisible(), false, 'Entering the desktop service layout releases the modal');
  await page.setViewportSize({ width, height: 844 });
  assert.equal(await serviceEntry(page).locator('.dn-service-entry__field').innerText(), draft, 'Reading guidance preserves saved car details');
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
      await page.locator('[data-locale-ready="true"]').waitFor({ state: 'attached' });
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
      await guideCheck(page, locale, width, 'trade-in');
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
      await page.locator('[data-locale-ready="true"]').waitFor({ state: 'attached' });
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
      await guideCheck(page, locale, width, 'import');
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
