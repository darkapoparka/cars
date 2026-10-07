import assert from 'node:assert/strict';
import { mkdir, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { chromium, webkit } from 'playwright';

await import('./prepare-domain-tests.mjs');
const { storageKeys, showroomTitle } = await import('../.qa/domain/showroom-config.mjs');
const { translate } = await import('../.qa/domain/locale.mjs');

const base = process.env.QA_URL || 'http://127.0.0.1:6474';
const output = path.resolve(process.env.QA_OUTPUT || '.qa/architecture');
const engines = Object.entries({ chromium, webkit }).filter(
  ([name]) => !process.env.QA_ENGINE || process.env.QA_ENGINE === name,
);
assert.ok(engines.length, 'QA_ENGINE must be chromium or webkit');
const report = { at: new Date().toISOString(), base, checks: [], errors: [] };
await mkdir(output, { recursive: true });

async function run(name, engine) {
  const browser = await engine.launch({ headless: true });
  const posts = [];
  const check = (description) => report.checks.push({ engine: name, description });
  async function context(width = 390, options = {}) {
    const context = await browser.newContext({
      viewport: { width, height: width < 700 ? 844 : 900 },
      isMobile: width < 700,
      hasTouch: width < 700,
      reducedMotion: 'reduce',
    });
    await context.addInitScript(
      ({ locale = 'en', corrupt = false, denied = false, full = false, origin, keys }) => {
        if (location.origin !== origin) return;
        window.__qaStorageEvents = [];
        window.addEventListener('storage', (event) => window.__qaStorageEvents.push(event.key));
        if (denied) {
          Object.defineProperty(window, 'localStorage', {
            get() {
              throw new DOMException('Storage denied', 'SecurityError');
            },
          });
        } else {
          if (localStorage.getItem(keys.language) === null)
            localStorage.setItem(keys.language, locale);
          if (corrupt) localStorage.setItem(keys.appState, '{invalid-json');
          if (full)
            Storage.prototype.setItem = function () {
              throw new DOMException('Storage full', 'QuotaExceededError');
            };
        }
      },
      { ...options, origin: new URL(base).origin, keys: storageKeys },
    );
    context.on('page', (page) => {
      page.setDefaultTimeout(15000);
      page.on('pageerror', (error) =>
        report.errors.push({ engine: name, url: page.url(), message: error.message }),
      );
      page.on('request', (request) => {
        // Ignore a third-party map frame's telemetry, not application submissions.
        if (request.method() === 'POST' && request.frame() === page.mainFrame())
          posts.push(request.url());
      });
    });
    return context;
  }
  async function closeContext(context) {
    // Finish background route prefetches before deliberately destroying their pages.
    for (const page of context.pages()) await page.waitForLoadState('networkidle');
    await context.close();
  }
  async function go(page, route, locale = 'en') {
    if (page.url().startsWith(base)) await page.waitForLoadState('networkidle', { timeout: 45000 });
    const response = await page.goto(base + route, {
      waitUntil: 'domcontentloaded',
      timeout: 45000,
    });
    assert.ok(response, route + ' must perform a document navigation');
    assert.equal(response.status(), 200, route + ' HTTP status');
    await page.locator('[data-hydrated="true"]').waitFor();
    await page.waitForFunction((locale) => document.documentElement.lang === locale, locale);
    await page.evaluate(() => document.fonts.ready);
  }
  async function cars(page, expected) {
    await page.waitForFunction(
      (expected) => document.querySelectorAll('[data-showroom-vehicle]').length === expected,
      expected,
    );
  }
  async function visibleVehicleFacts(page, label) {
    const failures = await page.locator('[data-showroom-vehicle]').evaluateAll((cards) =>
      cards.flatMap((card) => {
        const facts = [...card.querySelectorAll('[data-vehicle-fact]')];
        const missing = ['year', 'mileage', 'fuel'].filter(
          (key) => !facts.some((fact) => fact.dataset.vehicleFact === key),
        );
        const unreadable = facts
          .filter((fact) => {
            const css = getComputedStyle(fact);
            return (
              css.display === 'none' ||
              css.visibility === 'hidden' ||
              fact.clientWidth === 0 ||
              fact.scrollWidth > fact.clientWidth + 1
            );
          })
          .map((fact) => fact.dataset.vehicleFact);
        const rows = new Set(facts.map((fact) => Math.round(fact.getBoundingClientRect().top)));
        const title = getComputedStyle(card.querySelector('h2'));
        const price = getComputedStyle(card.querySelector('strong'));
        const hierarchy =
          parseFloat(price.fontSize) >= parseFloat(title.fontSize) + 2 &&
          Number(price.fontWeight) >= Number(title.fontWeight) + 100;
        return missing.length || unreadable.length || rows.size !== 1 || !hierarchy
          ? [
              {
                vehicle: card.dataset.showroomVehicle,
                missing,
                unreadable,
                rows: rows.size,
                hierarchy,
              },
            ]
          : [];
      }),
    );
    assert.deepEqual(failures, [], label + ' must retain readable vehicle facts');
    check(label + ': compact readable facts and distinct title/price hierarchy');
  }
  async function serviceSegment(page, label) {
    const bounds = await page.getByRole('tablist').evaluate((rail) => {
      const outer = rail.getBoundingClientRect();
      return [...rail.querySelectorAll('[role="tab"]')].map((tab) => {
        const rect = tab.getBoundingClientRect();
        return {
          width: rect.width,
          height: rect.height,
          top: rect.top - outer.top,
          bottom: outer.bottom - rect.bottom,
          left: rect.left - outer.left,
          right: outer.right - rect.right,
        };
      });
    });
    assert.ok(
      Math.max(...bounds.map((b) => b.width)) - Math.min(...bounds.map((b) => b.width)) < 1,
      label + ' service segments must have equal widths',
    );
    assert.ok(
      bounds.every(
        (b) => b.height >= 44 && b.top >= 0 && b.bottom >= 0 && Math.abs(b.top - b.bottom) < 1,
      ),
      label + ' service segments must be centered with comfortable hit targets',
    );
    assert.ok(
      Math.abs(bounds[0].left - bounds[0].top) < 1 &&
        Math.abs(bounds.at(-1).right - bounds.at(-1).top) < 1,
      label + ' service segments must retain uniform insets at both rounded ends',
    );
    check(label + ': service segments stay equal and centered');
    return bounds.reduce((sum, bound) => sum + bound.width, 0);
  }
  async function geometry(page, label) {
    const failures = await page.locator('img').evaluateAll(async (images) => {
      for (const image of images) image.loading = 'eager';
      return (
        await Promise.all(
          images.map((image) =>
            image.decode().then(
              () => null,
              () => image.currentSrc || image.src,
            ),
          ),
        )
      ).filter(Boolean);
    });
    assert.deepEqual(failures, [], label + ' broken images');
    assert.equal(
      await page.evaluate(() => document.documentElement.scrollWidth > innerWidth + 1),
      false,
      label + ' horizontal overflow',
    );
    check(label + ': images and viewport geometry');
    if (process.env.QA_CAPTURE === '1') {
      const filename = name + '-' + label.replace(/[^a-z0-9-]+/gi, '-');
      await page.screenshot({
        path: path.join(output, filename + '.png'),
        animations: 'disabled',
      });
      await writeFile(
        path.join(output, filename + '.json'),
        JSON.stringify(
          await page.locator('img').evaluateAll((images) =>
            images.map((image) => {
              const { x, y, width, height } = image.getBoundingClientRect();
              return { x, y, width, height, src: image.currentSrc };
            }),
          ),
          null,
          2,
        ) + '\n',
      );
    }
  }
  async function openContact(page) {
    await page.locator('[data-hydrated="true"]').waitFor();
    await page.waitForLoadState('networkidle');
    await page.evaluate(
      () => new Promise((resolve) => requestAnimationFrame(() => requestAnimationFrame(resolve))),
    );
    const message = page.getByRole('textbox', { name: 'Enquiry message', exact: true });
    if (!(await message.isVisible()))
      await page.getByRole('button', { name: 'Write to us', exact: true }).click();
    await message.waitFor();
    return message;
  }
  try {
    for (const width of [320, 390, 1440]) {
      for (const locale of ['en', 'bg']) {
        const t = (text) => translate(text, locale);
        const ctx = await context(width, { locale });
        const page = await ctx.newPage();
        await go(page, '/', locale);
        await page.waitForFunction(
          (title) => document.title === title,
          showroomTitle('Cars', locale),
        );
        const first = page.locator('[data-showroom-vehicle]').first();
        await first.waitFor();
        const detail = await first.locator('a[href^="/vehicle/"]').first().getAttribute('href');
        await geometry(page, 'Cars ' + width + ' ' + locale);
        await visibleVehicleFacts(page, 'Cars ' + width + ' ' + locale);
        const savedColor = await page
          .getByRole('link', { name: t('Saved cars'), exact: true })
          .evaluate((link) => getComputedStyle(link).color.match(/\d+/g).slice(0, 3).map(Number));
        assert.ok(
          savedColor.every((channel) => (width === 1440 ? channel >= 200 : channel <= 100)),
          'Saved-car action must contrast with the Home header',
        );
        const categoryFrames = await page
          .getByRole('tablist', { name: t('Vehicle category'), exact: true })
          .locator('img')
          .evaluateAll((images) =>
            images
              .filter((image) => {
                const css = getComputedStyle(image);
                return (
                  !['transparent', 'rgba(0, 0, 0, 0)'].includes(css.backgroundColor) ||
                  parseFloat(css.borderRadius) !== 0 ||
                  parseFloat(css.borderWidth) !== 0
                );
              })
              .map((image) => image.src),
          );
        assert.deepEqual(categoryFrames, [], 'Original category artwork must remain unboxed');
        check('Home header contrast and unboxed category artwork: ' + width + ' ' + locale);
        if (width === 1440) {
          const menu = page.getByRole('button', { name: t('Open menu'), exact: true });
          await menu.click();
          const navigation = page.getByRole('navigation', {
            name: t('Main navigation'),
            exact: true,
          });
          await navigation.waitFor();
          const menuLinks = navigation.getByRole('link');
          assert.deepEqual(
            await menuLinks.evaluateAll((links) =>
              links.map((link) => new URL(link.href).pathname),
            ),
            ['/', '/services', '/contact'],
          );
          // Safari does not focus every button after a pointer click. Escape
          // must also dismiss a pointer-opened menu while focus is elsewhere.
          await page.evaluate(
            () =>
              new Promise((resolve) => requestAnimationFrame(() => requestAnimationFrame(resolve))),
          );
          await page.keyboard.press('Escape');
          await navigation.waitFor({ state: 'hidden' });
          assert.equal(await menu.evaluate((el) => el === document.activeElement), true);
          check('Desktop menu destinations, Escape and focus return: ' + locale);
          await menu.press('ArrowDown');
          await menuLinks.first().waitFor();
          await page.waitForFunction(() =>
            Boolean(document.activeElement?.closest('[data-desktop-navigation]')),
          );
          await page.keyboard.press('End');
          assert.equal(
            await menuLinks.last().evaluate((el) => el === document.activeElement),
            true,
          );
          await page.keyboard.press('Home');
          assert.equal(
            await menuLinks.first().evaluate((el) => el === document.activeElement),
            true,
          );
          await page.keyboard.press('ArrowUp');
          assert.equal(
            await menuLinks.last().evaluate((el) => el === document.activeElement),
            true,
          );
          await page.keyboard.press('Escape');
          await navigation.waitFor({ state: 'hidden' });
          assert.equal(await menu.evaluate((el) => el === document.activeElement), true);
          check('Desktop menu keyboard navigation wraps and restores focus: ' + locale);
          const opener = page.getByRole('button', { name: new RegExp('^' + t('All filters')) });
          await opener.click();
          await page.locator('dialog[open]').waitFor();
          await page.keyboard.press('Escape');
          await page.locator('dialog[open]').waitFor({ state: 'hidden' });
          assert.equal(await opener.evaluate((el) => el === document.activeElement), true);
          check('Desktop filters open, dismiss and restore focus: ' + locale);
        }
        for (const [label, route] of [
          ['Services', '/services'],
          ['Contact', '/contact'],
          ['Vehicle', detail],
        ]) {
          await go(page, route, locale);
          await geometry(page, label + ' ' + width + ' ' + locale);
          if (label === 'Services') {
            const segmentWidth =
              width === 1440 ? await serviceSegment(page, 'Services ' + locale) : null;
            for (const tab of ['Import', 'Sell', 'All']) {
              await page.getByRole('tab', { name: t(tab), exact: true }).click();
              await geometry(page, 'Services ' + tab + ' ' + width + ' ' + locale);
              if (width === 1440) {
                const selectedWidth = await serviceSegment(page, 'Services ' + tab + ' ' + locale);
                assert.ok(
                  Math.abs(selectedWidth - segmentWidth) < 1,
                  'Service segments must not resize when switching tabs',
                );
              }
            }
          }
        }
        {
          const historyLength = await page.evaluate(() => history.length);
          for (const section of ['Photos', 'Features', 'Details']) {
            // The preserved native tab uses "Екстри", while the content heading
            // uses the longer Bulgarian translation of "Features".
            const tabName = locale === 'bg' && section === 'Features' ? 'Екстри' : t(section);
            await page.getByRole('tab', { name: tabName, exact: true }).click();
            await page.getByRole('tabpanel', { name: tabName, exact: true }).waitFor();
            await geometry(page, 'Vehicle ' + section + ' ' + width + ' ' + locale);
          }
          assert.equal(await page.evaluate(() => history.length), historyLength);
          check('Vehicle sections preserve Back history: ' + width + ' ' + locale);
        }
        await closeContext(ctx);
      }
    }

    const languageContext = await context();
    const shared = await languageContext.newPage();
    await go(shared, '/?lang=en');
    const other = await languageContext.newPage();
    await go(other, '/');
    await other.evaluate((key) => localStorage.setItem(key, 'bg'), storageKeys.language);
    await shared.waitForFunction(
      (key) => window.__qaStorageEvents.includes(key),
      storageKeys.language,
    );
    assert.equal(await shared.evaluate(() => document.documentElement.lang), 'en');
    assert.equal(
      await shared.evaluate((key) => localStorage.getItem(key), storageKeys.language),
      'bg',
    );
    check('Shared-link language stays explicit without echoing cross-tab preference writes');
    await shared.goto(base + '/');
    await shared.waitForFunction(() => document.documentElement.lang === 'bg');
    await shared.waitForLoadState('networkidle');
    await other.evaluate((key) => localStorage.setItem(key, 'en'), storageKeys.language);
    await shared.waitForFunction(() => document.documentElement.lang === 'en');
    assert.equal(await shared.title(), showroomTitle('Cars', 'en'));
    check('Language changes synchronize between tabs when no link override applies');
    await closeContext(languageContext);

    const ctx = await context();
    const page = await ctx.newPage();
    await go(page, '/');
    const stock = await page.locator('[data-showroom-vehicle]').count();
    assert.ok(stock > 0, 'The template sample inventory is available');
    const card = page.locator('[data-showroom-vehicle]').first();
    const title = await card.locator('h2').innerText();
    const save = card.getByRole('button', { name: /^Save / });
    const savedPage = await ctx.newPage();
    await go(savedPage, '/car-park');
    await cars(savedPage, 0);
    await save.click();
    await cars(savedPage, 1);
    // A cross-tab update mounts a new Link and schedules its background prefetch.
    // Do not interrupt that request with the test's deliberate hard reload.
    await savedPage.evaluate(
      () => new Promise((resolve) => requestAnimationFrame(() => requestAnimationFrame(resolve))),
    );
    await savedPage.waitForLoadState('networkidle');
    await savedPage.reload({ waitUntil: 'load' });
    await savedPage.waitForLoadState('networkidle');
    await cars(savedPage, 1);
    await savedPage
      .locator('[data-showroom-vehicle]')
      .getByRole('button', { name: /^Remove .* from saved cars/ })
      .click();
    await save.waitFor();
    await savedPage.waitForLoadState('networkidle');
    await savedPage.close();
    check('Saved cars synchronize both ways between tabs and survive reload');

    const search = page.getByRole('button', { name: 'Search make or model', exact: true });
    await search.click();
    const dialog = page.getByRole('dialog', { name: 'Search and filters', exact: true });
    await dialog.getByRole('searchbox').fill('unapplied draft');
    await page.keyboard.press('Escape');
    await dialog.waitFor({ state: 'hidden' });
    await cars(page, stock);
    assert.equal(new URL(page.url()).searchParams.get('query'), null);
    assert.equal(await search.evaluate((el) => el === document.activeElement), true);
    await search.click();
    await dialog.getByRole('searchbox').fill(title);
    await dialog.getByRole('button', { name: /^Show \d+/ }).click();
    await dialog.waitFor({ state: 'hidden' });
    await page.waitForFunction(
      (value) => new URL(location.href).searchParams.get('query') === value,
      title,
    );
    const filtered = await page.locator('[data-showroom-vehicle]').count();
    assert.ok(filtered > 0 && filtered <= stock);
    // Newly mounted filtered cards schedule prefetches on the next frame.
    // Let those settle before the deliberate document reload.
    await page.evaluate(
      () => new Promise((resolve) => requestAnimationFrame(() => requestAnimationFrame(resolve))),
    );
    await page.waitForLoadState('networkidle');
    await page.reload({ waitUntil: 'load' });
    await cars(page, filtered);
    check('Filter cancellation preserves state/focus; applying search survives reload');

    await go(page, '/services');
    await page.getByRole('tab', { name: 'Import', exact: true }).click();
    await page.getByRole('button', { name: 'Start import enquiry', exact: true }).click();
    await page.locator('dialog[open]').waitFor();
    // Let the dialog's initial focus frames finish before synthetic keyboard input.
    await page.evaluate(
      () => new Promise((resolve) => requestAnimationFrame(() => requestAnimationFrame(resolve))),
    );
    await page.getByLabel('Make', { exact: true }).fill('BMW');
    await page.getByLabel('Model', { exact: true }).fill('X3');
    assert.equal(await page.getByLabel('Make', { exact: true }).inputValue(), 'BMW');
    assert.equal(await page.getByLabel('Model', { exact: true }).inputValue(), 'X3');
    await page.getByRole('button', { name: 'Continue', exact: true }).click();
    await page.getByLabel('Maximum budget (€)', { exact: true }).fill('35000');
    await page.getByRole('button', { name: 'Continue', exact: true }).click();
    await page.getByRole('button', { name: 'Save draft', exact: true }).click();
    await page
      .getByText('Import draft saved on this device. Nothing was sent.', { exact: true })
      .waitFor();
    await page.reload({ waitUntil: 'load' });
    await page.getByLabel('Model', { exact: true }).waitFor();
    assert.equal(await page.getByLabel('Model', { exact: true }).inputValue(), 'X3');
    await page.keyboard.press('Escape');
    await page.locator('dialog[open]').waitFor({ state: 'hidden' });
    await page.waitForFunction(() => !new URL(location.href).searchParams.has('request'));
    await page.waitForLoadState('networkidle');
    check('The import wizard validates, saves locally and restores its draft');

    await go(page, '/contact');
    const draft = 'Architecture QA: keep this enquiry as a local draft only.';
    await (await openContact(page)).fill(draft);
    await page.getByRole('button', { name: 'Save enquiry draft', exact: true }).click();
    await page
      .getByText('Message saved as a local draft. Nothing was sent.', { exact: true })
      .first()
      .waitFor();
    await page.reload({ waitUntil: 'load' });
    assert.equal(await (await openContact(page)).inputValue(), draft);
    check('Contact drafts survive overlay dismissal and reload');
    await closeContext(ctx);

    const fullContext = await context(390, { full: true });
    const fullPage = await fullContext.newPage();
    await go(fullPage, '/contact?lang=en');
    const sessionDraft = 'Keep this enquiry in the current session when storage is full.';
    await (await openContact(fullPage)).fill(sessionDraft);
    await fullPage.getByRole('button', { name: 'Save enquiry draft', exact: true }).click();
    await fullPage
      .getByText(
        'Saving is unavailable. Your draft is kept for this session only. Nothing was sent.',
        { exact: true },
      )
      .first()
      .waitFor();
    assert.equal(await (await openContact(fullPage)).inputValue(), sessionDraft);
    check('Full storage reports session-only retention and keeps the enquiry editable');
    await closeContext(fullContext);

    for (const [label, options, route, locale] of [
      ['Bulgarian locale', { locale: 'bg' }, '/', 'bg'],
      ['Corrupt storage', { corrupt: true }, '/', 'en'],
      ['Denied storage', { denied: true }, '/?lang=en', 'en'],
    ]) {
      const ctx = await context(390, options);
      const page = await ctx.newPage();
      await go(page, route, locale);
      await cars(page, stock);
      await geometry(page, label);
      if (options.denied) {
        await page
          .locator('[data-showroom-vehicle]')
          .first()
          .getByRole('button', { name: /^Save / })
          .click();
        await page.getByRole('link', { name: /^Saved cars/ }).click();
        await cars(page, 1);
        check('Saving remains usable for the current session without localStorage');
      }
      await closeContext(ctx);
    }
    assert.deepEqual(posts, [], 'Application forms must not transmit demo enquiries');
    check('No application POST submissions');
  } catch (error) {
    // Keep one current failure image per engine, not an accumulating dated dump.
    const page = browser
      .contexts()
      .flatMap((context) => context.pages())
      .at(-1);
    if (page) {
      try {
        await page.screenshot({ path: path.join(output, name + '-failure.png') });
      } catch {
        // The original assertion remains authoritative if the page already closed.
      }
    }
    throw error;
  } finally {
    await browser.close();
  }
}
for (const [name, engine] of engines) {
  try {
    await run(name, engine);
  } catch (error) {
    report.errors.push({ engine: name, message: error.stack || String(error) });
  }
}
await writeFile(path.join(output, 'report.json'), JSON.stringify(report, null, 2) + '\n');
console.log(
  JSON.stringify(
    {
      checks: report.checks.length,
      errors: report.errors,
      report: path.join(output, 'report.json'),
    },
    null,
    2,
  ),
);
if (report.errors.length) process.exitCode = 1;
