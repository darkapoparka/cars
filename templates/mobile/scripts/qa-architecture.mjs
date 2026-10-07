import assert from 'node:assert/strict';
import { mkdir, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { chromium, webkit } from 'playwright';

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
      ({ locale = 'en', corrupt = false, denied = false, origin }) => {
        if (location.origin !== origin) return;
        if (denied) {
          Object.defineProperty(window, 'localStorage', {
            get() {
              throw new DOMException('Storage denied', 'SecurityError');
            },
          });
        } else {
          localStorage.setItem('cars-mobile-language', locale);
          if (corrupt) localStorage.setItem('mobile-reference-v1', '{invalid-json');
        }
      },
      { ...options, origin: new URL(base).origin },
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
    if (page.url().startsWith(base)) await page.waitForLoadState('networkidle');
    const response = await page.goto(base + route, { waitUntil: 'load', timeout: 45000 });
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
      const ctx = await context(width);
      const page = await ctx.newPage();
      await go(page, '/');
      const first = page.locator('[data-showroom-vehicle]').first();
      await first.waitFor();
      const detail = await first.locator('a[href^="/vehicle/"]').first().getAttribute('href');
      await geometry(page, 'Cars ' + width);
      if (width === 1440) {
        const opener = page.getByRole('button', { name: /^All filters/ });
        await opener.click();
        await page.locator('dialog[open]').waitFor();
        await page.keyboard.press('Escape');
        await page.locator('dialog[open]').waitFor({ state: 'hidden' });
        assert.equal(await opener.evaluate((el) => el === document.activeElement), true);
        check('Desktop filters open, dismiss and restore focus');
      }
      for (const [label, route] of [
        ['Services', '/services'],
        ['Contact', '/contact'],
        ['Vehicle', detail],
      ]) {
        await go(page, route);
        await geometry(page, label + ' ' + width);
      }
      if (width === 390) {
        const historyLength = await page.evaluate(() => history.length);
        for (const section of ['Photos', 'Features', 'Details']) {
          await page.getByRole('tab', { name: section, exact: true }).click();
          await page.getByRole('tabpanel', { name: section, exact: true }).waitFor();
        }
        assert.equal(await page.evaluate(() => history.length), historyLength);
        check('Vehicle sections switch without adding Back-history entries');
      }
      await closeContext(ctx);
    }

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
