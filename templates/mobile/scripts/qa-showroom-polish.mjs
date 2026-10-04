import assert from 'node:assert/strict';
import { mkdir, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { chromium, webkit } from 'playwright';

const base = process.env.QA_URL || 'http://127.0.0.1:6474';
const output = path.resolve(process.env.QA_OUTPUT || '../../runtime/mobile-showroom-polish');
await mkdir(output, { recursive: true });
const report = { at: new Date().toISOString(), base, checks: [], errors: [] };
const engines = [
  ['chromium', chromium],
  ['webkit', webkit],
].filter(([name]) => !process.env.QA_ENGINE || process.env.QA_ENGINE === name);
assert.ok(engines.length, 'QA_ENGINE must be chromium or webkit');

async function run(name, engine) {
  const browser = await engine.launch({
    headless: true,
    ...(name === 'chromium' ? { channel: 'chrome' } : {}),
  });
  const context = await browser.newContext({ viewport: { width: 390, height: 844 } });
  let page;
  let viewport = { width: 390, height: 844 };
  const closing = new WeakSet();
  let submissions = 0;
  async function go(route, locale = 'en') {
    // Independent route renders use fresh documents. This avoids carrying pending
    // prefetches into a forced navigation; SPA and reload journeys below keep one page.
    if (page) {
      closing.add(page);
      await page.close();
    }
    page = await context.newPage();
    const current = page;
    current.setDefaultTimeout(12000);
    await current.setViewportSize(viewport);
    current.on('pageerror', (error) => {
      if (!closing.has(current)) report.errors.push({ engine: name, message: error.message });
    });
    current.on('console', (message) => {
      if (!closing.has(current) && message.type() === 'error')
        report.errors.push({ engine: name, message: message.text() });
    });
    current.on('request', (request) => {
      if (['POST', 'PUT', 'PATCH', 'DELETE'].includes(request.method())) submissions += 1;
    });
    const response = await page.goto(
      base + route + (route.includes('?') ? '&' : '?') + 'lang=' + locale,
      { waitUntil: 'networkidle' },
    );
    assert.ok([200, 304].includes(response.status()), route + ' HTTP status');
    await page.locator('[data-hydrated="true"]').waitFor();
    await page.waitForFunction((expected) => document.documentElement.lang === expected, locale);
    await page.evaluate(() => document.fonts.ready);
  }
  const check = (description) => report.checks.push({ engine: name, description });
  async function dockGeometry(locale, enlarged = false) {
    const labels =
      locale === 'bg' ? ['Коли', 'Услуги', 'Контакт'] : ['Cars', 'Services', 'Contact'];
    const navigation = page.getByRole('navigation', {
      name: locale === 'bg' ? 'Основна навигация' : 'Main navigation',
      exact: true,
    });
    const bounds = await navigation.getByRole('link').evaluateAll((links) =>
      links.map((link) => {
        const rect = link.getBoundingClientRect();
        const icon = link.querySelector('svg');
        const label = link.querySelector('span');
        const iconRect = icon.getBoundingClientRect();
        const labelRect = label.getBoundingClientRect();
        const contained = (box) =>
          box.width > 0 &&
          box.height > 0 &&
          box.left >= rect.left &&
          box.right <= rect.right &&
          box.top >= rect.top &&
          box.bottom <= rect.bottom;
        return {
          x: rect.x,
          width: rect.width,
          height: rect.height,
          text: link.innerText,
          decorative: icon.getAttribute('aria-hidden') === 'true',
          labelHeight: labelRect.height,
          labelLineHeight: parseFloat(getComputedStyle(label).lineHeight),
          contained:
            contained(iconRect) && contained(labelRect) && label.scrollWidth <= label.clientWidth,
        };
      }),
    );
    assert.equal(bounds.length, 3);
    assert.deepEqual(
      bounds.map(({ text }) => text),
      labels,
      'Every destination has a visible localized label',
    );
    for (const label of labels)
      assert.equal(await navigation.getByRole('link', { name: label, exact: true }).count(), 1);
    for (const bound of bounds) {
      assert.ok(bound.width >= 44 && bound.height >= 44, 'Dock touch targets');
      assert.ok(bound.decorative, 'Icons supplement the accessible labels');
      assert.ok(bound.contained, 'Dock icons and labels stay inside their targets');
      assert.ok(Math.abs(bound.width - bounds[0].width) < 1, 'Equal destination widths');
      if (!enlarged)
        assert.ok(
          bound.labelHeight <= bound.labelLineHeight + 1,
          'Normal dock labels stay on one line',
        );
    }
    return bounds.map(({ x }) => x);
  }
  const unavailable =
    'Saving is unavailable. Your draft is kept for this session only. Nothing was sent.';
  const enquiry = 'Synthetic QA enquiry: can I view this sample vehicle?';
  try {
    const favicon = await context.request.get(base + '/favicon.ico');
    assert.equal(favicon.status(), 200);
    assert.match(favicon.headers()['content-type'], /image\/(?:x-icon|vnd.microsoft.icon)/);
    check('The standard favicon URL serves a real icon');
    for (const locale of ['bg', 'en']) {
      for (const width of [320, 390, 1440]) {
        viewport = { width, height: 844 };
        let dockPositions;
        for (const route of [
          '/',
          '/?condition=Used',
          '/services',
          '/services?tab=import',
          '/contact',
          '/vehicle/bmw-x6',
        ]) {
          await go(route, locale);
          assert.equal(
            await page.evaluate(() => document.documentElement.scrollWidth > innerWidth),
            false,
            `${locale} ${width} ${route} overflow`,
          );
          assert.equal(
            await page
              .locator('img')
              .evaluateAll(
                (images) =>
                  images.filter(
                    (image) =>
                      image.getBoundingClientRect().top < innerHeight &&
                      (!image.complete || !image.naturalWidth),
                  ).length,
              ),
            0,
            `${locale} ${width} ${route} visible images`,
          );
          if (!route.startsWith('/vehicle/')) {
            const positions = await dockGeometry(locale);
            if (dockPositions)
              assert.ok(
                positions.every((x, index) => Math.abs(x - dockPositions[index]) < 1),
                'Dock destinations keep their positions when the active route changes',
              );
            dockPositions = positions;
          }
        }
      }
      check(`${locale}: main routes render with images and without overflow at 320/390/1440px`);
      for (const width of [320, 390]) {
        viewport = { width, height: 844 };
        for (const [route, searchLabel] of [
          ['/', locale === 'bg' ? 'Марка или модел' : 'Search make or model'],
          ['/services', locale === 'bg' ? 'Търсене на услуга' : 'Search services'],
        ]) {
          await go(route, locale);
          const search = page.getByRole('button', { name: searchLabel, exact: true });
          await page.evaluate(() => window.scrollTo(0, 250));
          await page.waitForFunction(
            () =>
              Math.abs(
                document.querySelector('[data-showroom-controls]').getBoundingClientRect().top,
              ) < 1,
          );
          assert.ok(
            await page
              .locator('header')
              .evaluate((element) => element.getBoundingClientRect().bottom <= 0),
            'The showroom brand header scrolls away',
          );
          assert.ok(
            await search.evaluate((element) => element.getBoundingClientRect().bottom <= 0),
            'Search scrolls away while category tabs and filters remain available',
          );
          if (route === '/') {
            const price = page.locator('[data-quick-filter="price"]');
            const scrollPosition = await page.evaluate(() => scrollY);
            await price.click();
            await page.getByRole('dialog').waitFor();
            await page.keyboard.press('Escape');
            await page.getByRole('dialog').waitFor({ state: 'hidden' });
            assert.equal(
              await price.evaluate((element) => element === document.activeElement),
              true,
            );
            assert.ok(Math.abs((await page.evaluate(() => scrollY)) - scrollPosition) < 1);
          }
        }
      }
      check(
        `${locale}: only showroom tabs and pills stay pinned; filter dismissal preserves scroll and focus`,
      );
      viewport = { width: 320, height: 700 };
      await go('/', locale);
      await page.addStyleTag({ content: 'html { font-size: 200%; }' });
      await dockGeometry(locale, true);
      check(`${locale}: dock labels stay visible, equal and contained at 200% text size`);
    }
    viewport = { width: 320, height: 700 };
    await go('/', 'bg');
    await page.addStyleTag({ content: 'html { scrollbar-gutter: stable; }' });
    const facts = await page
      .locator('[data-showroom-vehicle]')
      .first()
      .locator('p[title]')
      .last()
      .locator('span')
      .allTextContents();
    assert.deepEqual(facts, ['2025 · 18 500 км', 'Дизел · Автоматик']);
    const search = page.getByRole('button', { name: 'Марка или модел', exact: true });
    assert.equal(
      await search
        .locator('span:not([aria-hidden])')
        .evaluate((element) => element.scrollWidth > element.clientWidth),
      false,
    );
    await search.click();
    await page.getByRole('searchbox', { name: 'Марка или модел' }).fill('BMW X6');
    await page
      .getByRole('searchbox', { name: 'Марка или модел' })
      .dispatchEvent('keydown', { key: 'Escape', bubbles: true, isComposing: true });
    assert.equal(
      await page.locator('dialog[open]').count(),
      1,
      'IME composition keeps the editor open',
    );
    await page.keyboard.press('Escape');
    await page.getByRole('dialog').waitFor({ state: 'hidden' });
    assert.equal(new URL(page.url()).searchParams.get('query'), null);
    assert.equal(new URL(page.url()).searchParams.get('lang'), 'bg');
    assert.equal(await search.evaluate((element) => element === document.activeElement), true);
    check(
      'Narrow BG cards keep paired facts; search fits and Escape cancels the draft and returns focus',
    );

    viewport = { width: 390, height: 844 };
    await go('/vehicle/bmw-540');
    const inlineEnquiry = page.getByRole('link', { name: 'Enquire', exact: true });
    assert.ok((await inlineEnquiry.boundingBox()).height >= 44, 'Comfortable enquiry target');
    const details = page.getByRole('tab', { name: 'Details', exact: true });
    await details.focus();
    await page.keyboard.press('ArrowRight');
    await page.getByRole('tab', { name: 'Photos', exact: true, selected: true }).waitFor();
    const fixedEnquiry = page.locator('[data-vehicle-contact-dock] a');
    assert.ok((await fixedEnquiry.boundingBox()).height >= 44);
    assert.equal(await fixedEnquiry.getAttribute('href'), '/contact?vehicle=bmw-540');
    await page.keyboard.press('ArrowRight');
    const extras = page.getByRole('tab', { name: 'Features', exact: true, selected: true });
    await extras.waitFor();
    assert.equal(
      await page.locator('header').evaluate((element) => element.getBoundingClientRect().top),
      0,
    );
    check('PDP enquiry targets and vehicle context survive detail-tab keyboard navigation');
    viewport = { width: 390, height: 844 };
    await go('/vehicle/bmw-x6');
    await page.getByRole('tab', { name: 'Details', exact: true }).focus();
    await page.getByRole('button', { name: 'Show more technical data', exact: true }).click();
    await page.getByRole('dialog', { name: 'Technical data', exact: true }).waitFor();
    await page.keyboard.press('Escape');
    await page
      .getByRole('dialog', { name: 'Technical data', exact: true })
      .waitFor({ state: 'hidden' });
    await page.waitForFunction(
      () => document.activeElement?.getAttribute('aria-label') === 'Show more technical data',
    );
    check('Specifications return focus to their pointer opener in both browser engines');

    await go('/contact');
    await page.evaluate(() => {
      window.__qaOriginalSetItem = Storage.prototype.setItem;
      Storage.prototype.setItem = () => {
        throw new DOMException('QA storage denied', 'QuotaExceededError');
      };
    });
    const message = page.getByRole('textbox', { name: 'Enquiry message' });
    await message.fill(enquiry);
    await page.getByRole('button', { name: 'Save enquiry draft', exact: true }).click();
    await page.getByRole('status').filter({ hasText: unavailable }).first().waitFor();
    assert.equal(
      await page
        .getByText('Draft saved on this device. Nothing was sent.', { exact: true })
        .count(),
      0,
    );
    assert.equal(await message.inputValue(), enquiry);
    await page.getByRole('navigation').getByRole('link', { name: 'Cars', exact: true }).click();
    await page.getByRole('navigation').getByRole('link', { name: 'Contact', exact: true }).click();
    assert.equal(await message.inputValue(), enquiry);
    await page.evaluate(() => {
      window.__qaWrites = [];
      Storage.prototype.setItem = function (key, value) {
        window.__qaWrites.push(key);
        return window.__qaOriginalSetItem.call(this, key, value);
      };
    });
    await page.getByRole('button', { name: 'Save enquiry draft', exact: true }).click();
    await page
      .getByText('Draft saved on this device. Nothing was sent.', { exact: true })
      .waitFor();
    assert.deepEqual(await page.evaluate(() => window.__qaWrites), ['mobile-reference-v1']);
    await page.reload({ waitUntil: 'networkidle' });
    assert.equal(await message.inputValue(), enquiry);
    check(
      'Contact reports denied storage, retains session edits across navigation, and retries with one write that survives reload',
    );

    await go('/services?tab=import&request=1');
    await page.getByRole('button', { name: 'Continue', exact: true }).click();
    await page.getByText('Enter a make.', { exact: true }).waitFor();
    assert.equal(
      await page.getByRole('textbox', { name: 'Make', exact: true }).getAttribute('aria-invalid'),
      'true',
    );
    check('Validation keeps field names stable and exposes errors as descriptions');
    await page.getByLabel('Make', { exact: true }).fill('BMW');
    await page.getByLabel('Model', { exact: true }).fill('X6');
    await page.getByRole('button', { name: 'Continue', exact: true }).click();
    await page.getByLabel('Maximum budget (€)', { exact: true }).fill('50000');
    await page.getByRole('button', { name: 'Continue', exact: true }).click();
    await page.evaluate(() => {
      const original = Storage.prototype.setItem;
      Storage.prototype.setItem = function (key, value) {
        if (key === 'mobile-reference-v1')
          throw new DOMException('QA storage denied', 'QuotaExceededError');
        return original.call(this, key, value);
      };
    });
    await page.getByRole('button', { name: 'Save import draft', exact: true }).click();
    await page
      .getByText('Saving is unavailable. Keep this sheet open to retain your details.', {
        exact: true,
      })
      .waitFor();
    assert.equal(await page.getByRole('heading', { name: 'Draft saved', exact: true }).count(), 0);
    check(
      'The service stepper cannot claim a ready Contact draft when only its own form storage succeeds',
    );

    await go('/vehicle/bmw-x6/message');
    await page.getByRole('textbox', { name: 'Your message', exact: true }).fill(enquiry);
    await page.evaluate(() => {
      Storage.prototype.setItem = () => {
        throw new DOMException('QA storage denied', 'QuotaExceededError');
      };
    });
    await page.getByRole('button', { name: 'Send', exact: true }).click();
    await page.getByRole('status').filter({ hasText: unavailable }).waitFor();
    assert.equal(
      await page.getByRole('dialog', { name: 'Local draft saved', exact: true }).count(),
      0,
    );
    assert.equal(submissions, 0);
    check('Reference message screen suppresses false success; all enquiry actions stay local');
  } catch (error) {
    await page?.screenshot({
      path: path.join(output, name + '-failure.jpg'),
      type: 'jpeg',
      fullPage: true,
    });
    throw error;
  } finally {
    // Closing the test browser intentionally cancels any remaining background prefetches.
    if (page) closing.add(page);
    await browser.close();
  }
}
try {
  for (const [name, engine] of engines) await run(name, engine);
  assert.deepEqual(report.errors, []);
  report.passed = true;
} catch (error) {
  report.passed = false;
  report.failure = error.stack;
  process.exitCode = 1;
} finally {
  await writeFile(path.join(output, 'report.json'), JSON.stringify(report, null, 2));
  console.log(JSON.stringify(report, null, 2));
}
