import assert from 'node:assert/strict';
import { mkdir, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { chromium, webkit } from 'playwright';

const base = process.env.QA_URL || 'http://127.0.0.1:6474';
const output = path.resolve(
  process.env.QA_OUTPUT || '../../runtime/mobile-showroom-20261002/final',
);
await mkdir(output, { recursive: true });
const report = { at: new Date().toISOString(), base, checks: [], errors: [], captures: [] };
const engines =
  process.env.QA_ENGINE === 'chromium'
    ? [['chromium', chromium]]
    : [
        ['chromium', chromium],
        ['webkit', webkit],
      ];

async function run(name, engine) {
  const browser = await engine.launch({
    headless: true,
    ...(name === 'chromium' ? { channel: 'chrome' } : {}),
  });
  const context = await browser.newContext({
    viewport: { width: 390, height: 844 },
    isMobile: true,
    hasTouch: true,
  });
  const page = await context.newPage();
  page.setDefaultTimeout(12000);
  const pending = new Set();
  page.on('request', (request) => pending.add(request));
  page.on('requestfinished', (request) => pending.delete(request));
  page.on('requestfailed', (request) => pending.delete(request));
  page.on('pageerror', (error) =>
    report.errors.push({ engine: name, url: page.url(), message: error.message }),
  );
  page.on('console', (message) => {
    if (message.type() === 'error')
      report.errors.push({
        engine: name,
        url: page.url(),
        message: message.text(),
        location: message.location(),
      });
  });
  const check = (description) => report.checks.push({ engine: name, description });
  async function settle() {
    // Let Next's visible-link prefetches finish before the harness replaces the document.
    // WebKit can otherwise report cancelled same-origin fetches as access-control errors.
    // Track requests directly: a cached SPA Back has no new document-load idle event.
    const deadline = Date.now() + 20000;
    let quietSince = null;
    while (Date.now() < deadline) {
      if (pending.size) quietSince = null;
      else {
        quietSince ??= Date.now();
        if (Date.now() - quietSince >= 500) return;
      }
      await new Promise((resolve) => setTimeout(resolve, 50));
    }
    assert.fail(
      'Requests did not settle: ' + [...pending].map((request) => request.url()).join(', '),
    );
  }
  async function go(route) {
    await settle();
    const response = await page.goto(base + route, { waitUntil: 'load', timeout: 30000 });
    assert.equal(response.status(), 200, route);
    await page.locator('[data-hydrated="true"]').waitFor();
    await page.evaluate(() => document.fonts.ready);
  }
  async function cars(count) {
    await page.waitForFunction(
      (expected) => document.querySelectorAll('[data-showroom-vehicle]').length === expected,
      count,
    );
  }
  async function geometry(label) {
    const imageFailures = await page.locator('img').evaluateAll(async (images) => {
      // Below-fold showroom cards load lazily. Verify the assets after requesting them.
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
    assert.deepEqual(imageFailures, [], label + ' image decoding failures');
    const result = await page.evaluate(() => ({
      width: innerWidth,
      overflow: document.documentElement.scrollWidth > innerWidth + 1,
      brokenImages: [...document.images]
        .filter((image) => !image.complete || !image.naturalWidth)
        .map((image) => image.src),
    }));
    assert.equal(result.overflow, false, label + ' horizontal overflow');
    assert.deepEqual(result.brokenImages, [], label + ' broken images');
    check(label + ': no horizontal overflow or broken images');
  }
  async function capture(label) {
    await page.screenshot({ path: path.join(output, name + '-' + label + '.png') });
    report.captures.push(name + '-' + label + '.png');
  }
  try {
    await go('/');
    await cars(4);
    assert.deepEqual(
      await page
        .getByRole('navigation', { name: 'Main navigation' })
        .getByRole('link')
        .allTextContents(),
      ['Cars', 'Services', 'Contact'],
    );
    assert.equal(await page.getByRole('link', { name: 'Profile', exact: true }).count(), 0);
    const firstPhoto = await page
      .locator('[data-showroom-vehicle]')
      .first()
      .locator('img')
      .boundingBox();
    assert.ok(firstPhoto.y < 340, 'A car is visible below the compact controls');
    check('Cars is Home; three navigation destinations; stock visible on entry');
    const sortControl = page.getByRole('button', { name: 'Sort cars: Recommended', exact: true });
    assert.match(await sortControl.innerText(), /Recommended/);
    check('The sort control visibly names the current ordering');
    await capture('cars-390');
    await page
      .locator('[data-showroom-vehicle]')
      .first()
      .click({ position: { x: 30, y: 40 } });
    await page.locator('header').getByRole('heading', { name: 'BMW X6', exact: true }).waitFor();
    await page.getByRole('button', { name: 'Go back', exact: true }).click();
    await cars(4);
    check('The photo area opens the car through the single card link');
    await page.getByRole('searchbox', { name: 'Search make or model' }).fill('BMW X6');
    await cars(1);
    assert.equal(
      await page.locator('[data-showroom-vehicle]').getAttribute('data-showroom-vehicle'),
      'bmw-x6',
    );
    await settle();
    await page.reload({ waitUntil: 'load' });
    await cars(1);
    await page.getByRole('button', { name: 'Clear search', exact: true }).click();
    await cars(4);
    check('Search, reload and clear filter the same inventory');
    const tabs = page.getByRole('tablist', { name: 'Vehicle category' });
    assert.deepEqual(
      await tabs
        .getByRole('tab')
        .evaluateAll((elements) => elements.map((element) => element.getAttribute('aria-label'))),
      ['Cars', 'Motorbikes', 'E-bikes', 'Motorhomes', 'Trucks & more'],
    );
    assert.equal(await page.getByRole('button', { name: 'Used', exact: true }).count(), 0);
    for (const [label, value] of [
      ['Motorbikes', 'bike'],
      ['E-bikes', 'electric-bike'],
      ['Motorhomes', 'motorhome'],
      ['Trucks & more', 'truck'],
    ]) {
      await tabs.getByRole('tab', { name: label, exact: true }).click();
      await cars(0);
      assert.equal(new URL(page.url()).searchParams.get('category'), value);
      assert.equal(
        await tabs.getByRole('tab', { name: label, exact: true }).getAttribute('aria-selected'),
        'true',
      );
      assert.equal(
        await page.getByRole('button', { name: 'Clear filters', exact: true }).count(),
        0,
      );
      await page.getByRole('heading', { name: /^No .+ listed yet$/ }).waitFor();
      await geometry(label + ' empty inventory');
    }
    await tabs.getByRole('tab', { name: 'Cars', exact: true }).click();
    await cars(4);
    await tabs.getByRole('tab', { name: 'Cars', exact: true }).focus();
    await page.keyboard.press('ArrowRight');
    await cars(0);
    assert.equal(
      await page.evaluate(() => document.activeElement?.getAttribute('aria-label')),
      'Motorbikes',
    );
    await page.keyboard.press('End');
    assert.equal(
      await page.evaluate(() => document.activeElement?.getAttribute('aria-label')),
      'Trucks & more',
    );
    await page.keyboard.press('Home');
    await cars(4);
    check(
      'All five native category tabs select real categories; empty stock never shows cars; keyboard navigation works',
    );

    await page.getByRole('searchbox', { name: 'Search make or model' }).fill('BMW X6');
    await cars(1);
    await tabs.getByRole('tab', { name: 'Motorbikes', exact: true }).click();
    await cars(0);
    await page.locator('[data-quick-filter="make"]').click();
    await page.getByRole('button', { name: 'Add vehicle', exact: true }).click();
    await page.getByRole('button', { name: 'Honda', exact: true }).click();
    await page.getByRole('textbox', { name: 'Model for Honda', exact: true }).fill('CBR');
    await page.getByRole('button', { name: 'OK', exact: true }).click();
    assert.equal(new URL(page.url()).searchParams.get('makes'), 'Honda');
    await tabs.getByRole('tab', { name: 'Cars', exact: true }).click();
    await cars(1);
    assert.equal(
      await page.getByRole('searchbox', { name: 'Search make or model' }).inputValue(),
      'BMW X6',
    );
    await tabs.getByRole('tab', { name: 'Motorbikes', exact: true }).click();
    assert.equal(new URL(page.url()).searchParams.get('makes'), 'Honda');
    await settle();
    await page.reload({ waitUntil: 'load' });
    await page.getByRole('tab', { name: 'Motorbikes', exact: true, selected: true }).waitFor();
    await page.getByRole('link', { name: 'Services', exact: true }).click();
    await page.getByRole('heading', { name: 'Services', exact: true }).waitFor();
    await page.getByRole('link', { name: 'Cars', exact: true }).click();
    await page.getByRole('tab', { name: 'Motorbikes', exact: true, selected: true }).waitFor();
    await page.locator('[data-quick-filter="make"]').click();
    assert.equal(
      await page.getByRole('textbox', { name: 'Model for Honda', exact: true }).inputValue(),
      'CBR',
    );
    await page.keyboard.press('Escape');
    await page.getByRole('button', { name: 'Filters', exact: true }).click();
    await page.getByRole('button', { name: 'Reset', exact: true }).click();
    await page.getByRole('button', { name: 'Show 0 motorbikes', exact: true }).click();
    assert.equal(new URL(page.url()).searchParams.get('category'), 'bike');
    assert.equal(new URL(page.url()).searchParams.has('makes'), false);
    await page.getByRole('button', { name: 'View cars', exact: true }).click();
    await cars(1);
    await page.getByRole('button', { name: 'Clear search', exact: true }).click();
    await cars(4);
    check(
      'Category-specific make/model and filter snapshots survive switching, reload and navigation; Reset keeps the category',
    );

    await page.getByRole('button', { name: 'Filters', exact: true }).click();
    await page.getByRole('checkbox', { name: 'Used', exact: true }).check();
    await page.getByRole('button', { name: 'Show 2 cars', exact: true }).click();
    await cars(2);
    assert.equal(
      (await page.locator('#showroom-filter-count').textContent()).trim(),
      '1 active filter',
    );
    await page.getByRole('button', { name: 'Filters', exact: true }).click();
    await page.getByRole('checkbox', { name: 'Used', exact: true }).uncheck();
    await page.getByRole('checkbox', { name: 'New', exact: true }).check();
    await page.getByRole('button', { name: 'Show 2 cars', exact: true }).click();
    await cars(2);
    await page.getByRole('button', { name: 'Filters', exact: true }).click();
    await page.getByRole('checkbox', { name: 'Used', exact: true }).check();
    await page.getByRole('button', { name: 'Show 4 cars', exact: true }).click();
    await cars(4);
    await page.getByRole('button', { name: 'Clear filters', exact: true }).click();
    await cars(4);
    assert.equal(
      await page
        .getByRole('button', { name: 'Filters', exact: true })
        .getAttribute('aria-describedby'),
      null,
    );
    check('Filter count reflects an applied condition and clears with Reset');
    check('Used/New condition choices live in Filters and work separately or together');

    await page.locator('[data-quick-filter="price"]').click();
    await page.getByRole('textbox', { name: 'Price to', exact: true }).fill('50000');
    await page.getByRole('button', { name: 'Show 1 car', exact: true }).click();
    await cars(1);
    assert.equal(new URL(page.url()).pathname, '/');
    await page.getByRole('button', { name: 'Clear filters', exact: true }).click();
    await cars(4);
    await page.locator('[data-quick-filter="fuel"]').click();
    await page.getByRole('checkbox', { name: 'Petrol', exact: true }).check();
    await page.getByRole('button', { name: 'Show 1 car', exact: true }).click();
    await cars(1);
    await page.getByRole('button', { name: 'Clear filters', exact: true }).click();
    await page.locator('[data-quick-filter="year"]').click();
    await page.getByRole('textbox', { name: 'Year from', exact: true }).fill('2025');
    await page.getByRole('button', { name: /^Show \d+ cars?$/ }).click();
    const years = await page.locator('[data-showroom-vehicle]').locator('p').allTextContents();
    assert.ok(years.some((text) => text.includes('2025') || text.includes('2026')));
    await page.getByRole('button', { name: 'Clear filters', exact: true }).click();
    check('Price, year and fuel sheets update listings without a results-page step');

    await page.getByRole('button', { name: 'Filters', exact: true }).click();
    await page.getByRole('button', { name: 'Any make', exact: true }).click();
    await page.getByRole('button', { name: 'BMW', exact: true }).first().click();
    await page.getByRole('button', { name: 'OK', exact: true }).click();
    await page.getByRole('dialog', { name: 'Filters', exact: true }).waitFor();
    await page.getByRole('button', { name: 'Show 4 cars', exact: true }).click();
    await cars(4);
    await page.getByRole('button', { name: 'Clear filters', exact: true }).click();
    for (const key of ['price', 'year', 'fuel']) {
      await page.locator('[data-quick-filter="' + key + '"]').click();
      await page.keyboard.press('Escape');
      assert.equal(await page.locator('dialog[open]').count(), 0);
      assert.equal(
        await page.evaluate(() => document.activeElement?.getAttribute('data-quick-filter')),
        key,
      );
    }
    check('Existing make picker returns to all filters; Escape restores each opener');

    await page.locator('[data-quick-filter="make"]').click();
    await page.getByRole('button', { name: 'BMW', exact: true }).first().click();
    await page.getByRole('textbox', { name: 'Search models', exact: true }).fill('X6');
    await page.getByRole('checkbox', { name: 'X6', exact: true }).check();
    await page.getByRole('button', { name: 'OK', exact: true }).click();
    await cars(1);
    assert.equal(
      await page.locator('[data-showroom-vehicle]').getAttribute('data-showroom-vehicle'),
      'bmw-x6',
    );
    await page.getByRole('button', { name: 'Clear filters', exact: true }).click();
    check('Make and model selections filter the showroom stock');

    await page.getByRole('button', { name: /^Sort cars:/ }).click();
    await page.getByRole('radio', { name: 'Price: low to high', exact: true }).click();
    assert.match(
      await page
        .getByRole('button', { name: 'Sort cars: Price: low to high', exact: true })
        .innerText(),
      /Price ↑/,
    );
    assert.equal(
      await page.locator('[data-showroom-vehicle]').first().getAttribute('data-showroom-vehicle'),
      'bmw-120',
    );
    await page.getByRole('link', { name: 'Services', exact: true }).click();
    await page.getByRole('heading', { name: 'Services', exact: true }).waitFor();
    await page.getByRole('link', { name: 'Cars', exact: true }).click();
    await cars(4);
    assert.equal(new URL(page.url()).searchParams.get('sort'), 'price-asc');
    const link = page.getByRole('link', { name: 'BMW 540', exact: true });
    // Center the target clear of the sticky controls before measuring Back's scroll context.
    await link.evaluate((element) =>
      element.scrollIntoView({ block: 'center', inline: 'nearest' }),
    );
    const scrollBefore = await page.evaluate(() => scrollY);
    const urlBefore = page.url();
    await link.click();
    await page.locator('header').getByRole('heading', { name: 'BMW 540', exact: true }).waitFor();
    await page.getByRole('link', { name: 'BMW X6', exact: true }).click();
    await page.locator('header').getByRole('heading', { name: 'BMW X6', exact: true }).waitFor();
    const detailHistoryLength = await page.evaluate(() => history.length);
    await page.getByRole('button', { name: 'Go back', exact: true }).click();
    await page.locator('header').getByRole('heading', { name: 'BMW 540', exact: true }).waitFor();
    await page.getByRole('button', { name: 'Go back', exact: true }).click();
    await cars(4);
    assert.equal(page.url(), urlBefore);
    try {
      await page.waitForFunction((expected) => Math.abs(scrollY - expected) < 4, scrollBefore);
    } catch (error) {
      report.scrollRestoreFailure = await page.evaluate(
        (expected) => ({
          expected,
          actual: scrollY,
          titleTop: document
            .querySelector('[data-showroom-vehicle="bmw-540"] h2 a')
            ?.getBoundingClientRect().top,
          controlsBottom: document
            .querySelector('section[aria-label="Find a vehicle"]')
            ?.getBoundingClientRect().bottom,
        }),
        scrollBefore,
      );
      console.error(JSON.stringify(report.scrollRestoreFailure));
      await capture('scroll-restore-failure');
      throw error;
    }
    assert.ok((await page.evaluate(() => history.length)) <= detailHistoryLength);
    await settle();
    await page.goForward({ waitUntil: 'load' });
    await page.getByRole('button', { name: 'Go back', exact: true }).waitFor();
    await settle();
    await page.goBack({ waitUntil: 'load' });
    await cars(4);
    assert.equal(page.url(), urlBefore);
    check('Sort survives tabs; Back through related cars restores inventory URL and scroll');

    await go('/');
    await page.getByRole('button', { name: 'Save BMW X6', exact: true }).click();
    await page.getByRole('link', { name: /^Saved cars/ }).click();
    await cars(1);
    await settle();
    await page.reload({ waitUntil: 'load' });
    await cars(1);
    assert.equal(await page.getByRole('link', { name: /Log in|Sign in/ }).count(), 0);
    await page.getByRole('button', { name: 'Remove BMW X6 from saved cars', exact: true }).click();
    await cars(0);
    await page.getByRole('heading', { name: 'Your shortlist starts here' }).waitFor();
    check('Saved cars persist on reload and can be removed without registration');

    await go('/services');
    await page.getByRole('link', { name: 'Ask about financing', exact: true }).click();
    await page.getByRole('textbox', { name: 'Enquiry message' }).waitFor();
    assert.match(
      await page.getByRole('textbox', { name: 'Enquiry message' }).inputValue(),
      /financing/,
    );
    let sentRequests = 0;
    page.on('request', (request) => {
      if (request.method() === 'POST') sentRequests++;
    });
    await page.getByRole('button', { name: 'Save enquiry draft', exact: true }).click();
    await page
      .getByText('Draft saved on this device. Nothing was sent.', { exact: true })
      .waitFor();
    assert.equal(sentRequests, 0);
    await go('/vehicle/bmw-x6');
    await page.getByRole('link', { name: 'Enquire', exact: true }).click();
    assert.match(
      await page.getByRole('textbox', { name: 'Enquiry message' }).inputValue(),
      /BMW X6/,
    );
    check('Service and vehicle enquiries retain context; draft save sends no request');
    await go('/results?maxPrice=50000');
    await cars(1);
    assert.equal(new URL(page.url()).pathname, '/');
    await go('/search');
    await cars(4);
    await page.getByRole('searchbox', { name: 'Search make or model' }).fill('nonexistent car');
    await cars(0);
    await page.getByRole('button', { name: 'Show all cars', exact: true }).click();
    await cars(4);
    check('Old search/results links resolve to Cars; empty results offer recovery');

    if (name === 'chromium') {
      for (const width of [320, 390, 1440]) {
        await page.setViewportSize({ width, height: width === 1440 ? 1000 : 844 });
        for (const route of ['/', '/services', '/contact', '/car-park', '/vehicle/bmw-x6']) {
          await go(route);
          await geometry(width + 'px ' + route);
          await capture(
            (route === '/' ? 'cars' : route.replaceAll('/', '-').slice(1)) + '-' + width,
          );
        }
      }
      await page.setViewportSize({ width: 320, height: 480 });
      await go('/');
      for (const label of ['Filters', 'Price filters', 'Sort cars: Recommended']) {
        await page.getByRole('button', { name: label, exact: true }).click();
        const dialog = page.locator('dialog[open]');
        const box = await dialog.boundingBox();
        assert.ok(
          box.x >= -1 && box.y >= -1 && box.x + box.width <= 321 && box.y + box.height <= 481,
        );
        const footer = dialog.getByRole('button', { name: /^Show \d+ cars?$/ });
        if (await footer.count()) {
          const bounds = await footer.boundingBox();
          assert.ok(
            bounds.y >= 0 && bounds.y + bounds.height <= 481,
            label + ' apply control reachable',
          );
        }
        await capture('short-' + label.split(' ')[0].toLowerCase());
        await page.keyboard.press('Escape');
      }
      await page.setViewportSize({ width: 320, height: 700 });
      for (const route of ['/', '/services', '/contact']) {
        await go(route);
        await page.evaluate(() => {
          const sizes = [...document.querySelectorAll('body *')].map((element) => [
            element,
            getComputedStyle(element).fontSize,
            getComputedStyle(element).lineHeight,
          ]);
          for (const [element, font, line] of sizes) {
            element.style.fontSize = parseFloat(font) * 2 + 'px';
            if (line.endsWith('px')) element.style.lineHeight = parseFloat(line) * 2 + 'px';
          }
        });
        await geometry('320px 200% text ' + route);
        await capture((route === '/' ? 'cars' : route.slice(1)) + '-320-text200');
      }
      check('320/390/1440px routes, short-height sheets and 200% text reflow');
    }
    await settle();
    console.log(
      name + ': ' + report.checks.filter((item) => item.engine === name).length + ' checks passed',
    );
  } finally {
    await browser.close();
  }
}

try {
  for (const [name, engine] of engines) await run(name, engine);
  assert.deepEqual(report.errors, [], 'Browser console/page errors');
  report.passed = true;
} catch (error) {
  report.passed = false;
  report.failure = error.stack;
  console.error(error.stack);
  process.exitCode = 1;
} finally {
  await writeFile(path.join(output, 'report.json'), JSON.stringify(report, null, 2));
}
