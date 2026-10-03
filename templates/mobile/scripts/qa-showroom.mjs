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
  async function searchCars(value) {
    await page.getByRole('button', { name: 'Search make or model', exact: true }).click();
    const dialog = page.getByRole('dialog', { name: 'Search and filters', exact: true });
    await dialog.getByRole('searchbox', { name: 'Search make or model' }).fill(value);
    await dialog.getByRole('button', { name: /^Show \d+ / }).click();
    await dialog.waitFor({ state: 'hidden' });
  }
  async function searchServices(value) {
    await page.getByRole('button', { name: 'Search services', exact: true }).click();
    const dialog = page.getByRole('dialog', { name: 'Search services', exact: true });
    await dialog.getByRole('searchbox', { name: 'Search services' }).fill(value);
    await dialog.getByRole('button', { name: /^Show \d+ / }).click();
    await dialog.waitFor({ state: 'hidden' });
  }
  async function selectedServiceTab(label) {
    await page.getByRole('tab', { name: label, exact: true, selected: true }).waitFor();
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
  async function requestGeometry(label) {
    await geometry(label);
    const bounds = await page.locator('dialog[open]').evaluate((dialog) => {
      const rect = dialog.getBoundingClientRect();
      const footer = dialog.querySelector('[data-service-request-footer]').getBoundingClientRect();
      const body = dialog.querySelector('[data-service-request-body]');
      const content = body.getBoundingClientRect();
      return {
        contained:
          rect.left >= -1 &&
          rect.top >= -1 &&
          rect.right <= innerWidth + 1 &&
          rect.bottom <= innerHeight + 1,
        footerVisible: footer.top >= rect.top && footer.bottom <= innerHeight + 1,
        bodyHeight: body.clientHeight,
        overflow: body.scrollWidth > body.clientWidth + 1,
        fieldsContained: [...body.querySelectorAll('input,select,textarea')].every((field) => {
          const box = field.getBoundingClientRect();
          return box.left >= content.left - 1 && box.right <= content.right + 1;
        }),
      };
    });
    assert.equal(bounds.contained, true, label + ' dialog inside viewport');
    assert.equal(bounds.footerVisible, true, label + ' actions visible');
    assert.ok(bounds.bodyHeight > 0, label + ' scroll area available');
    assert.equal(bounds.overflow, false, label + ' sheet horizontal overflow');
    assert.equal(bounds.fieldsContained, true, label + ' fields inside sheet');
  }
  async function enlargeText() {
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
  }
  async function filterGeometry(label) {
    await geometry(label);
    const bounds = await page.locator('dialog[open]').evaluate((dialog) => {
      const rect = dialog.getBoundingClientRect();
      const footer = dialog.querySelector('[data-filter-footer]').getBoundingClientRect();
      const panel = dialog.querySelector('#showroom-filter-options');
      return {
        contained:
          rect.left >= -1 &&
          rect.top >= -1 &&
          rect.right <= innerWidth + 1 &&
          rect.bottom <= innerHeight + 1,
        actions: footer.top >= rect.top && footer.bottom <= innerHeight + 1,
        scrollArea: panel.clientHeight > 0,
        overflow: panel.scrollWidth > panel.clientWidth + 1,
        fieldsContained: [...panel.querySelectorAll('input,select,textarea')]
          .filter((field) => field.getClientRects().length)
          .every((field) => {
            const box = field.getBoundingClientRect();
            return box.left >= rect.left - 1 && box.right <= rect.right + 1;
          }),
      };
    });
    for (const field of ['contained', 'actions', 'scrollArea', 'fieldsContained'])
      assert.equal(bounds[field], true, label + ' ' + field);
    assert.equal(bounds.overflow, false, label + ' options horizontal overflow');
  }
  try {
    await go('/');
    await cars(4);
    assert.equal(await page.getByRole('button', { name: 'Filters', exact: true }).count(), 0);
    assert.equal(await page.locator('[data-quick-filter]').count(), 5);
    const quickPillSizes = await page.locator('[data-quick-filter]').evaluateAll((buttons) =>
      buttons.map((button) => ({
        target: button.getBoundingClientRect().height,
        face: button.querySelector('[data-pill-surface]').getBoundingClientRect().height,
      })),
    );
    assert(
      quickPillSizes.every(
        ({ target, face }) => target >= 48 && face >= 32 && face <= 36 && face < target,
      ),
    );
    assert.deepEqual(
      await page
        .getByRole('navigation', { name: 'Main navigation' })
        .getByRole('link')
        .allTextContents(),
      ['Cars', 'Services', 'Contact'],
    );
    const navigation = page.getByRole('navigation', { name: 'Main navigation' });
    assert.equal(await navigation.locator('svg[data-icon-family="lucide"]').count(), 3);
    assert.equal(
      await navigation
        .getByRole('link', { name: 'Cars', exact: true })
        .getAttribute('aria-current'),
      'page',
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
    assert.equal(await sortControl.innerText(), 'Sort');
    check('The default Sort action keeps the full current ordering in its accessible label');
    await capture('cars-390');
    await page
      .locator('[data-showroom-vehicle]')
      .first()
      .click({ position: { x: 30, y: 40 } });
    await page.locator('header').getByRole('heading', { name: 'BMW X6', exact: true }).waitFor();
    await page.getByRole('button', { name: 'Go back', exact: true }).click();
    await cars(4);
    check('The photo area opens the car through the single card link');
    await page.getByRole('button', { name: 'Search make or model', exact: true }).click();
    await page.getByRole('searchbox', { name: 'Search make or model' }).fill('BMW X6');
    await cars(4);
    await page.getByRole('button', { name: 'Close filters', exact: true }).click();
    await page.getByRole('dialog').waitFor({ state: 'hidden' });
    assert.equal(new URL(page.url()).searchParams.get('query'), null);
    await searchCars('BMW X6');
    await cars(1);
    assert.equal(
      await page.locator('[data-showroom-vehicle]').getAttribute('data-showroom-vehicle'),
      'bmw-x6',
    );
    await settle();
    await page.reload({ waitUntil: 'load' });
    await cars(1);
    await searchCars('');
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

    await searchCars('BMW X6');
    await cars(1);
    await tabs.getByRole('tab', { name: 'Motorbikes', exact: true }).click();
    await cars(0);
    await page.locator('[data-quick-filter="make"]').click();
    await page.getByRole('button', { name: 'Add vehicle', exact: true }).click();
    await page.getByRole('button', { name: 'Honda', exact: true }).click();
    await page.getByRole('textbox', { name: 'Model for Honda', exact: true }).fill('CBR');
    await page.getByRole('button', { name: 'Show 0 motorbikes', exact: true }).click();
    assert.equal(new URL(page.url()).searchParams.get('makes'), 'Honda');
    await tabs.getByRole('tab', { name: 'Cars', exact: true }).click();
    await cars(1);
    assert.equal(
      await page.getByRole('button', { name: 'Search make or model', exact: true }).innerText(),
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
    await page.locator('[data-quick-filter="more"]').click();
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

    await page.locator('[data-quick-filter="more"]').click();
    await page.getByRole('tab', { name: 'Condition', exact: true }).click();
    await page.getByRole('checkbox', { name: 'Used', exact: true }).check();
    await page.getByRole('button', { name: 'Show 2 cars', exact: true }).click();
    await cars(2);
    assert.equal(
      (await page.locator('#showroom-filter-count').textContent()).trim(),
      '1 active filter',
    );
    await page.locator('[data-quick-filter="more"]').click();
    await page.getByRole('tab', { name: 'Condition', exact: true }).click();
    await page.getByRole('checkbox', { name: 'Used', exact: true }).uncheck();
    await page.getByRole('checkbox', { name: 'New', exact: true }).check();
    await page.getByRole('button', { name: 'Show 2 cars', exact: true }).click();
    await cars(2);
    await page.locator('[data-quick-filter="more"]').click();
    await page.getByRole('tab', { name: 'Condition', exact: true }).click();
    await page.getByRole('checkbox', { name: 'Used', exact: true }).check();
    await page.getByRole('button', { name: 'Show 4 cars', exact: true }).click();
    await cars(4);
    await page.getByRole('button', { name: 'Clear filters', exact: true }).click();
    await cars(4);
    assert.equal(
      await page.locator('[data-quick-filter="more"]').getAttribute('aria-describedby'),
      null,
    );
    check('Filter count reflects an applied condition and clears with Reset');
    check('Used/New condition choices live in Filters and work separately or together');

    await page.locator('[data-quick-filter="price"]').click();
    await page.getByRole('textbox', { name: 'Price to', exact: true }).fill('50000');
    await cars(4);
    assert.equal(new URL(page.url()).searchParams.get('maxPrice'), null);
    await page.getByRole('tab', { name: 'Year', exact: true }).click();
    await page.getByRole('textbox', { name: 'Year from', exact: true }).fill('2000');
    await page.getByRole('tab', { name: 'Price', exact: true }).click();
    assert.equal(
      await page.getByRole('textbox', { name: 'Price to', exact: true }).inputValue(),
      '50000',
    );
    await page.goBack();
    await page.locator('dialog[open]').waitFor({ state: 'hidden' });
    await cars(4);
    assert.equal(new URL(page.url()).searchParams.get('maxPrice'), null);
    await page.locator('[data-quick-filter="price"]').click();
    assert.equal(
      await page.getByRole('textbox', { name: 'Price to', exact: true }).inputValue(),
      '',
    );
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
    check(
      'Filter tabs retain drafts; browser Back cancels; Show cars applies price/year/fuel to Home',
    );

    await page.locator('[data-quick-filter="more"]').click();
    await page.getByRole('tab', { name: 'Make & model', exact: true }).click();
    await page.getByRole('button', { name: 'BMW', exact: true }).first().click();
    await page.getByRole('tab', { name: 'Price', exact: true }).click();
    await page.getByRole('tab', { name: 'Make & model', exact: true }).click();
    await page.getByRole('textbox', { name: 'Search models', exact: true }).waitFor();
    assert.equal(await page.locator('dialog[open]').count(), 1);
    await page.getByRole('dialog', { name: 'Search and filters', exact: true }).waitFor();
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
    check('Make/model stays inside one editor across tabs; Escape restores each opener');

    await page.locator('[data-quick-filter="make"]').click();
    assert.equal(await page.getByRole('button', { name: /^Model:/ }).isDisabled(), true);
    await page.getByRole('button', { name: 'BMW', exact: true }).first().click();
    const modelOptions = page.locator('[data-showroom-model-options]');
    assert.equal(
      await modelOptions.getByRole('checkbox', { name: 'Any model', exact: true }).count(),
      1,
    );
    assert.equal(
      await modelOptions.getByRole('textbox', { name: 'Variant', exact: true }).isVisible(),
      false,
    );
    const anyText = await modelOptions.getByText('Any model', { exact: true }).boundingBox();
    const familyText = await modelOptions.getByText('1 Series', { exact: true }).boundingBox();
    assert(anyText && familyText && Math.abs(anyText.x - familyText.x) < 1);
    await modelOptions.locator('summary').click();
    await modelOptions.getByRole('textbox', { name: 'Variant', exact: true }).waitFor();
    await modelOptions.locator('summary').click();
    assert.equal(
      await modelOptions.getByRole('textbox', { name: 'Variant', exact: true }).isVisible(),
      false,
    );
    await modelOptions.getByRole('button', { name: 'Expand 1 Series', exact: true }).click();
    await modelOptions.getByRole('checkbox', { name: '120', exact: true }).check();
    assert.equal(
      await modelOptions
        .getByRole('checkbox', { name: '1 Series', exact: true })
        .evaluate((input) => input.indeterminate),
      true,
    );
    await modelOptions.getByRole('checkbox', { name: 'Any model', exact: true }).check();
    assert.equal(
      await modelOptions.getByRole('checkbox', { name: '120', exact: true }).isChecked(),
      false,
    );
    await modelOptions.getByRole('button', { name: 'Collapse 1 Series', exact: true }).click();
    await page.getByRole('textbox', { name: 'Search models', exact: true }).fill('X6');
    await modelOptions.getByRole('button', { name: 'Collapse X Series', exact: true }).click();
    assert.equal(
      await modelOptions.getByRole('checkbox', { name: 'X6', exact: true }).isVisible(),
      false,
    );
    await modelOptions.getByRole('button', { name: 'Expand X Series', exact: true }).click();
    await page.getByRole('checkbox', { name: 'X6', exact: true }).check();
    await page.getByRole('button', { name: 'Make: BMW', exact: true }).click();
    assert.equal(await page.locator('[data-make-option="BMW"]').count(), 1);
    await page
      .locator('[data-make-option="BMW"]')
      .getByRole('button', { name: /BMW.*X6/ })
      .waitFor();
    await page.getByRole('button', { name: 'Model: X6', exact: true }).click();
    await page.getByRole('textbox', { name: 'Search models', exact: true }).fill('X6');
    assert.equal(await page.getByRole('checkbox', { name: 'X6', exact: true }).isChecked(), true);
    await page.getByRole('button', { name: 'Make: BMW', exact: true }).click();
    await page.getByRole('button', { name: 'Remove BMW', exact: true }).click();
    assert.equal(await page.getByRole('button', { name: /^Model:/ }).isDisabled(), true);
    await page
      .locator('[data-make-option="BMW"]')
      .getByRole('button', { name: 'BMW', exact: true })
      .click();
    await page.getByRole('textbox', { name: 'Search models', exact: true }).fill('X6');
    await page.getByRole('checkbox', { name: 'X6', exact: true }).check();
    await page.getByRole('button', { name: 'Show 1 car', exact: true }).click();
    await cars(1);
    assert.equal(
      await page.locator('[data-showroom-vehicle]').getAttribute('data-showroom-vehicle'),
      'bmw-x6',
    );
    await page.getByRole('button', { name: 'Clear filters', exact: true }).click();
    check('Linked Make/Model selectors retain model choices and filter the showroom stock');
    await page.locator('[data-quick-filter="make"]').click();
    await page.getByRole('button', { name: 'BMW', exact: true }).first().click();
    await page.locator('[data-showroom-model-options] summary').click();
    await page.getByRole('switch', { name: 'Exclude make', exact: true }).click();
    await page.getByRole('textbox', { name: 'Search models', exact: true }).fill('X6');
    await page.getByRole('checkbox', { name: 'X6', exact: true }).check();
    await page.getByRole('button', { name: 'Show 3 cars', exact: true }).waitFor();
    await page.getByRole('switch', { name: 'Exclude make', exact: true }).click();
    await page.getByRole('button', { name: 'Show 1 car', exact: true }).waitFor();
    await page.getByRole('switch', { name: 'Exclude make', exact: true }).click();
    await page.getByRole('button', { name: 'Show 3 cars', exact: true }).click();
    await cars(3);
    assert.match(
      await page.locator('[data-quick-filter="make"]').getAttribute('aria-label'),
      /Exclude BMW/,
    );
    await page.getByRole('button', { name: 'Clear filters', exact: true }).click();
    await cars(4);
    check(
      'Include/exclude switching clears the opposite scope and exclusions remain visible on Home',
    );

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
    await page.getByRole('tab', { name: 'Photos', exact: true }).click();
    await page.getByRole('tabpanel', { name: 'Photos', exact: true }).waitFor();
    await page.getByRole('tab', { name: 'Features', exact: true }).click();
    await page.getByRole('tabpanel', { name: 'Features', exact: true }).waitFor();
    assert.equal(await page.evaluate(() => history.length), detailHistoryLength);
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
    assert.deepEqual(
      await page
        .getByRole('tablist', { name: 'Service category' })
        .getByRole('tab')
        .allTextContents(),
      ['All', 'Import', 'Sell'],
    );
    assert.equal(await page.locator('[data-showroom-service]').count(), 8);
    assert.equal(await page.locator('[data-showroom-service] dl').count(), 0);
    await page
      .getByRole('group', { name: 'Service filters', exact: true })
      .getByRole('button', { name: 'Viewings', exact: true })
      .click();
    await page.waitForFunction(
      () => document.querySelectorAll('[data-showroom-service]').length === 1,
    );
    assert.equal(await page.locator('[data-showroom-service="viewing"]').count(), 1);
    assert.equal(new URL(page.url()).searchParams.get('topic'), 'viewing');
    await page.reload({ waitUntil: 'load' });
    assert.equal(
      await page
        .getByRole('button', { name: 'Viewings', exact: true })
        .getAttribute('aria-pressed'),
      'true',
    );
    await page.getByRole('button', { name: 'All services (8)', exact: true }).click();
    await page.waitForFunction(
      () => document.querySelectorAll('[data-showroom-service]').length === 8,
    );
    await page.getByRole('button', { name: 'Search services', exact: true }).click();
    await page.getByRole('searchbox', { name: 'Search services' }).fill('buy out');
    assert.equal(await page.locator('[data-showroom-service]').count(), 8);
    await page.keyboard.press('Escape');
    await page.getByRole('dialog').waitFor({ state: 'hidden' });
    assert.equal(new URL(page.url()).searchParams.get('q'), null);
    await searchServices('buy out');
    await page.waitForFunction(
      () => document.querySelectorAll('[data-showroom-service]').length === 1,
    );
    assert.equal(await page.locator('[data-showroom-service="sell"]').count(), 1);
    await page.reload({ waitUntil: 'load' });
    assert.equal(
      await page.getByRole('button', { name: 'Search services', exact: true }).innerText(),
      'buy out',
    );
    await searchServices('');
    await page.waitForFunction(
      () => document.querySelectorAll('[data-showroom-service]').length === 8,
    );
    await searchServices('nonexistent service');
    await page.getByRole('heading', { name: 'No services found', exact: true }).waitFor();
    await page.getByRole('button', { name: 'Show all services', exact: true }).click();
    await selectedServiceTab('All');
    check('Service search finds buyout, persists in the URL and recovers from empty results');
    await page.getByRole('tab', { name: 'All', exact: true }).press('ArrowRight');
    await selectedServiceTab('Import');
    await page.getByRole('button', { name: 'Start import enquiry', exact: true }).waitFor();
    assert.equal(await page.getByRole('form', { name: 'Car import enquiry' }).count(), 0);
    assert.equal(await page.locator('[data-import-example]').count(), 4);
    const countryPills = page.getByRole('group', { name: 'Import countries', exact: true });
    await countryPills.getByRole('button', { name: 'Canada', exact: true }).click();
    await page.waitForFunction(
      () => document.querySelectorAll('[data-import-example]').length === 1,
    );
    assert.equal(
      await page.locator('[data-import-example][data-import-country="canada"]').count(),
      1,
    );
    assert.equal(new URL(page.url()).searchParams.get('country'), 'canada');
    await page.reload({ waitUntil: 'load' });
    assert.equal(
      await countryPills
        .getByRole('button', { name: 'Canada', exact: true })
        .getAttribute('aria-pressed'),
      'true',
    );
    await page.getByRole('button', { name: 'Start import enquiry', exact: true }).click();
    await page.waitForFunction(() => document.activeElement?.getAttribute('name') === 'vin');
    await page.getByLabel('Make', { exact: true }).fill('BMW');
    await page.getByLabel('Model', { exact: true }).fill('X3');
    await page.getByRole('button', { name: 'Continue', exact: true }).click();
    assert.equal(
      await page
        .getByRole('group', { name: 'Import country preference', exact: true })
        .getByRole('button', { name: 'Canada', exact: true })
        .getAttribute('aria-pressed'),
      'true',
    );
    await page.keyboard.press('Escape');
    await page.locator('dialog[open]').waitFor({ state: 'hidden' });
    await countryPills.getByRole('button', { name: 'All countries', exact: true }).click();
    await page.waitForFunction(
      () => document.querySelectorAll('[data-import-example]').length === 4,
    );
    await page.evaluate(() => localStorage.removeItem('cars-mobile-service-request-v1:import'));
    await page.getByRole('tab', { name: 'Import', exact: true }).press('ArrowRight');
    await selectedServiceTab('Sell');
    assert.equal(
      await page.getByRole('tab', { name: 'Sell', exact: true }).getAttribute('aria-selected'),
      'true',
    );
    assert.equal(await page.locator(':focus').getAttribute('id'), 'service-category-sell');
    await page.reload({ waitUntil: 'load' });
    await page.getByRole('heading', { name: 'Sell your car', exact: true }).waitFor();
    await settle();
    await page.goBack();
    await page.waitForFunction(
      () =>
        document.querySelector('#service-category-import')?.getAttribute('aria-selected') ===
        'true',
    );
    await page.goForward();
    await page.waitForFunction(
      () =>
        document.querySelector('#service-category-sell')?.getAttribute('aria-selected') === 'true',
    );
    await page.getByRole('tab', { name: 'Sell', exact: true }).press('Home');
    await selectedServiceTab('All');
    assert.equal(
      await page.getByRole('tab', { name: 'All', exact: true }).getAttribute('aria-selected'),
      'true',
    );
    await page.getByRole('tab', { name: 'All', exact: true }).press('End');
    await selectedServiceTab('Sell');
    assert.equal(
      await page.getByRole('tab', { name: 'Sell', exact: true }).getAttribute('aria-selected'),
      'true',
    );
    check('All/Import/Sell tabs support keyboard focus, deep links, reload and Back/Forward');
    await page
      .getByRole('group', { name: 'Sale type', exact: true })
      .getByRole('button', { name: 'Part exchange', exact: true })
      .click();
    assert.equal(new URL(page.url()).searchParams.get('saleType'), 'part-exchange');
    await page.getByRole('button', { name: 'Start sale enquiry', exact: true }).click();
    await page.waitForFunction(() => document.activeElement?.getAttribute('name') === 'vin');
    assert.equal(await page.getByRole('form', { name: 'Car sale enquiry' }).count(), 1);
    await page.getByLabel('Make', { exact: true }).fill('BMW');
    await page.getByLabel('Model', { exact: true }).fill('X3');
    await page.getByLabel('Year', { exact: true }).fill('2020');
    await page.getByRole('button', { name: 'Continue', exact: true }).click();
    assert.equal(
      await page
        .getByRole('group', { name: 'Sale preference', exact: true })
        .getByRole('button', { name: 'Part exchange', exact: true })
        .getAttribute('aria-pressed'),
      'true',
    );
    await page.keyboard.press('Escape');
    await page.locator('dialog[open]').waitFor({ state: 'hidden' });
    await page.evaluate(() => localStorage.removeItem('cars-mobile-service-request-v1:sell'));
    check(
      'Secondary service/country/purpose pills persist their URLs and banner entries open VIN-ready overlays',
    );
    await go('/services?tab=unrecognized');
    assert.equal(
      await page.getByRole('tab', { name: 'All', exact: true }).getAttribute('aria-selected'),
      'true',
    );
    await page.getByRole('link', { name: 'Arrange a viewing', exact: true }).click();
    await page.getByRole('textbox', { name: 'Enquiry message' }).waitFor();
    assert.equal(new URL(page.url()).searchParams.get('service'), 'viewing');
    await page.getByRole('link', { name: 'View service', exact: true }).click();
    await selectedServiceTab('All');
    await page.getByRole('tab', { name: 'All', exact: true }).waitFor();
    check('Service buttons open the matching enquiry; unknown categories fall back safely');
    await page.getByRole('link', { name: 'View financing', exact: true }).click();
    await selectedServiceTab('All');
    assert.equal(await page.locator('[data-showroom-service]').count(), 1);
    assert.equal(await page.locator('[data-showroom-service] dt').count(), 3);
    assert.equal(new URL(page.url()).searchParams.get('tab'), 'financing');
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
    const financingDraft = 'Please discuss a deposit and payment options for my next car.';
    await page.getByRole('textbox', { name: 'Enquiry message' }).fill(financingDraft);
    await page.getByRole('button', { name: 'Save enquiry draft', exact: true }).click();
    await page.reload({ waitUntil: 'load' });
    await page.waitForFunction(
      (expected) =>
        document.querySelector('textarea[aria-label="Enquiry message"]')?.value === expected,
      financingDraft,
    );
    assert.equal(
      await page.getByRole('textbox', { name: 'Enquiry message' }).inputValue(),
      financingDraft,
    );
    await page.getByRole('link', { name: 'View service', exact: true }).click();
    await selectedServiceTab('All');
    assert.equal(
      await page.getByRole('tab', { name: 'All', exact: true }).getAttribute('aria-selected'),
      'true',
    );
    assert.equal(new URL(page.url()).searchParams.get('tab'), 'financing');
    await page.getByRole('tab', { name: 'All', exact: true }).click();
    await page.getByRole('link', { name: 'View parts & accessories', exact: true }).click();
    await page.getByRole('link', { name: 'Ask about parts', exact: true }).click();
    await page.getByRole('textbox', { name: 'Enquiry message' }).waitFor();
    assert.match(
      await page.getByRole('textbox', { name: 'Enquiry message' }).inputValue(),
      /parts & accessories/,
    );
    await page
      .getByRole('textbox', { name: 'Enquiry message' })
      .fill('Please check availability of replacement parts for my car.');
    await page.getByRole('button', { name: 'Save enquiry draft', exact: true }).click();
    await page.getByRole('link', { name: 'View service', exact: true }).click();
    assert.equal(new URL(page.url()).searchParams.get('tab'), 'parts');
    await page.getByRole('tab', { name: 'All', exact: true }).click();
    await page.getByRole('link', { name: 'View financing', exact: true }).click();
    await page.getByRole('link', { name: 'Ask about financing', exact: true }).click();
    assert.equal(
      await page.getByRole('textbox', { name: 'Enquiry message' }).inputValue(),
      financingDraft,
    );
    assert.equal(sentRequests, 0);
    check(
      'Finance and parts drafts persist independently; View service retains their existing deep links',
    );
    await go('/services?tab=import');
    await selectedServiceTab('Import');
    const importStart = page.getByRole('button', { name: 'Start import enquiry', exact: true });
    const saleStart = page.getByRole('button', { name: 'Start sale enquiry', exact: true });
    const continueRequest = () =>
      page.getByRole('button', { name: 'Continue', exact: true }).click();
    const enquiry = page.locator('dialog[open]');
    assert.equal(await page.getByRole('form', { name: 'Car import enquiry' }).count(), 0);
    await importStart.click();
    await page.getByRole('dialog', { name: 'Import a car', exact: true }).waitFor();
    await page.waitForFunction(() => document.activeElement?.getAttribute('name') === 'vin');
    await page.getByLabel('VIN (optional)', { exact: true }).fill('WBA12345678901234');
    await page.getByRole('button', { name: 'Continue', exact: true }).focus();
    await page.keyboard.press('Tab');
    assert.equal(await page.locator(':focus').getAttribute('aria-label'), 'Close enquiry');
    await page.keyboard.press('Shift+Tab');
    assert.equal(await page.locator(':focus').innerText(), 'Continue');
    assert.equal(new URL(page.url()).searchParams.get('request'), '1');
    assert.equal(
      await enquiry.getByRole('list', { name: 'Enquiry progress' }).getByRole('listitem').count(),
      3,
    );
    await continueRequest();
    await page.getByText('Enter a make.', { exact: true }).waitFor();
    assert.equal(await page.locator(':focus').getAttribute('name'), 'make');
    await page.getByLabel('Make', { exact: true }).fill('BMW');
    await page.getByLabel('Model', { exact: true }).fill('X3');
    await continueRequest();
    await page.getByRole('heading', { name: 'Budget & preferences', exact: true }).waitFor();
    assert.equal(await page.getByLabel('Email (optional)', { exact: true }).count(), 0);
    await continueRequest();
    await page.getByText('Enter a budget greater than zero.', { exact: true }).waitFor();
    assert.equal(await page.locator(':focus').getAttribute('name'), 'budget');
    await page.getByLabel('Maximum budget (€)', { exact: true }).fill('35000');
    await page.getByRole('button', { name: 'Back', exact: true }).click();
    assert.equal(await page.getByLabel('Model', { exact: true }).inputValue(), 'X3');
    assert.equal(
      await page.getByLabel('VIN (optional)', { exact: true }).inputValue(),
      'WBA12345678901234',
    );
    await page.goBack();
    await enquiry.waitFor({ state: 'hidden' });
    assert.equal(new URL(page.url()).searchParams.get('tab'), 'import');
    assert.equal(new URL(page.url()).searchParams.get('request'), null);
    assert.equal(await importStart.evaluate((button) => button === document.activeElement), true);
    await importStart.press('Enter');
    await enquiry.waitFor();
    assert.equal(await page.getByLabel('Model', { exact: true }).inputValue(), 'X3');
    await page.keyboard.press('Escape');
    await enquiry.waitFor({ state: 'hidden' });
    assert.equal(await importStart.evaluate((button) => button === document.activeElement), true);
    await importStart.click();
    await continueRequest();
    assert.equal(
      await page.getByLabel('Maximum budget (€)', { exact: true }).inputValue(),
      '35000',
    );
    await continueRequest();
    await page.getByRole('heading', { name: 'Contact & review', exact: true }).waitFor();
    assert.match(
      await page.getByRole('region', { name: 'Car details summary' }).innerText(),
      /BMW X3/,
    );
    await page.getByLabel('Email (optional)', { exact: true }).fill('invalid');
    await page.getByRole('button', { name: 'Save import draft', exact: true }).click();
    await page.getByText('Enter a valid email address.', { exact: true }).waitFor();
    assert.equal(await page.locator(':focus').getAttribute('name'), 'email');
    await page.getByLabel('Email (optional)', { exact: true }).fill('');
    await page.getByRole('button', { name: 'Save import draft', exact: true }).click();
    await page
      .getByText('Import draft saved on this device. Nothing was sent.', { exact: true })
      .waitFor();
    assert.equal(sentRequests, 0);
    await page.reload({ waitUntil: 'load' });
    await enquiry.waitFor();
    await page.waitForFunction(() => document.querySelector('input[name="model"]')?.value === 'X3');
    await continueRequest();
    assert.equal(
      await page.getByLabel('Maximum budget (€)', { exact: true }).inputValue(),
      '35000',
    );
    await continueRequest();
    await page.getByRole('button', { name: 'Save import draft', exact: true }).click();
    await page.getByRole('link', { name: 'View enquiry draft', exact: true }).click();
    assert.equal(new URL(page.url()).searchParams.get('service'), 'import');
    assert.match(
      await page.getByRole('textbox', { name: 'Enquiry message' }).inputValue(),
      /Maximum budget \(EUR\): 35000/,
    );
    await page.getByRole('link', { name: 'View service', exact: true }).click();
    await selectedServiceTab('Import');
    await page.getByRole('tab', { name: 'Sell', exact: true }).click();
    await selectedServiceTab('Sell');
    assert.equal(await page.getByRole('form', { name: 'Car sale enquiry' }).count(), 0);
    await saleStart.click();
    await page.getByRole('dialog', { name: 'Sell your car', exact: true }).waitFor();
    assert.equal(await page.getByLabel('Model', { exact: true }).inputValue(), '');
    await page.getByLabel('Make', { exact: true }).fill('Toyota');
    await page.getByLabel('Model', { exact: true }).fill('Corolla');
    await page.getByLabel('Year', { exact: true }).fill('2020');
    await continueRequest();
    await continueRequest();
    await page.getByText('Enter the mileage in kilometres.', { exact: true }).waitFor();
    await page.getByLabel('Mileage (km)', { exact: true }).fill('82000');
    await continueRequest();
    await page.getByRole('button', { name: 'Save sale draft', exact: true }).click();
    await page
      .getByText('Sale draft saved on this device. Nothing was sent.', { exact: true })
      .waitFor();
    await page.getByRole('button', { name: 'Done', exact: true }).click();
    await enquiry.waitFor({ state: 'hidden' });
    await page.reload({ waitUntil: 'load' });
    await saleStart.click();
    await page.waitForFunction(
      () => document.querySelector('input[name="model"]')?.value === 'Corolla',
    );
    await page.getByRole('button', { name: 'Close enquiry', exact: true }).click();
    await enquiry.waitFor({ state: 'hidden' });
    await page.getByRole('tab', { name: 'Import', exact: true }).click();
    await importStart.click();
    await page.waitForFunction(() => document.querySelector('input[name="model"]')?.value === 'X3');
    await continueRequest();
    assert.equal(
      await page.getByLabel('Maximum budget (€)', { exact: true }).inputValue(),
      '35000',
    );
    assert.equal(sentRequests, 0);
    check(
      'Import/sale steppers validate each stage, recover drafts, restore focus, retain context and send no request',
    );
    await page.keyboard.press('Escape');
    await enquiry.waitFor({ state: 'hidden' });
    await go('/services?tab=sell&request=1');
    await enquiry.waitFor();
    const directHistoryLength = await page.evaluate(() => history.length);
    await page.getByRole('button', { name: 'Close enquiry', exact: true }).click();
    await enquiry.waitFor({ state: 'hidden' });
    assert.equal(new URL(page.url()).searchParams.get('tab'), 'sell');
    assert.equal(new URL(page.url()).searchParams.get('request'), null);
    assert.equal(await page.evaluate(() => history.length), directHistoryLength);
    check('Direct overlay links dismiss in place without leaving the service route');
    await go('/services?tab=import');
    await importStart.click();
    await page.evaluate(() => {
      window.__qaStorageSetItem = Storage.prototype.setItem;
      Storage.prototype.setItem = function (key, value) {
        if (key.startsWith('cars-mobile-service-request-v1:'))
          throw new Error('Storage unavailable in QA');
        return window.__qaStorageSetItem.call(this, key, value);
      };
    });
    await page.getByLabel('Make', { exact: true }).fill('BMW draft');
    await page
      .getByText('Saving is unavailable. Keep this sheet open to retain your details.', {
        exact: true,
      })
      .waitFor();
    await continueRequest();
    await continueRequest();
    await page.getByRole('button', { name: 'Save import draft', exact: true }).click();
    assert.equal(await page.getByRole('heading', { name: 'Draft saved', exact: true }).count(), 0);
    await page.evaluate(() => {
      Storage.prototype.setItem = window.__qaStorageSetItem;
      delete window.__qaStorageSetItem;
    });
    assert.equal(sentRequests, 0);
    await page.keyboard.press('Escape');
    await enquiry.waitFor({ state: 'hidden' });
    check('Unavailable draft storage retains in-memory values and never reports a successful save');
    await go('/vehicle/bmw-x6');
    const detailTabs = page.getByRole('tablist', { name: 'Vehicle information', exact: true });
    assert.deepEqual(await detailTabs.getByRole('tab').allTextContents(), [
      'Details',
      'Photos',
      'Features',
    ]);
    await page.getByRole('tabpanel', { name: 'Details', exact: true }).waitFor();
    const pdpHistoryLength = await page.evaluate(() => history.length);
    await detailTabs.getByRole('tab', { name: 'Details', exact: true }).press('PageDown');
    await detailTabs.getByRole('tab', { name: 'Photos', exact: true }).click();
    const photosPanel = page.getByRole('tabpanel', { name: 'Photos', exact: true });
    await photosPanel.waitFor();
    await page.waitForFunction(() => {
      const rail = document.querySelector('[data-vehicle-detail-nav]');
      const firstPhoto = document.querySelector('[aria-label="Open vehicle image 1"]');
      if (!rail || !firstPhoto) return false;
      const gap = firstPhoto.getBoundingClientRect().top - rail.getBoundingClientRect().bottom;
      return gap >= 0 && gap <= 24;
    });
    assert.equal(new URL(page.url()).hash, '#photos');
    assert.equal(await page.evaluate(() => history.length), pdpHistoryLength);
    const photoCount = await photosPanel
      .getByRole('button', { name: /^Open vehicle image / })
      .count();
    assert.ok(photoCount > 2);
    const secondPhoto = photosPanel.getByRole('button', {
      name: 'Open vehicle image 2',
      exact: true,
    });
    await secondPhoto.click();
    const photoViewer = page.getByRole('dialog', { name: 'Vehicle photo viewer', exact: true });
    await photoViewer.waitFor();
    assert.equal(await photoViewer.locator('output').innerText(), '2 / ' + photoCount);
    await photoViewer.getByRole('button', { name: 'Next photo', exact: true }).click();
    await page.waitForFunction(() => history.state?.carsMobilePhotoViewer?.index === 2);
    assert.equal(await photoViewer.locator('output').innerText(), '3 / ' + photoCount);
    await page.goBack();
    await photoViewer.waitFor({ state: 'hidden' });
    assert.equal(new URL(page.url()).hash, '#photos');
    await page.waitForFunction(
      () => document.activeElement?.getAttribute('aria-label') === 'Open vehicle image 2',
    );
    await page.goForward();
    await photoViewer.waitFor();
    assert.equal(await photoViewer.locator('output').innerText(), '3 / ' + photoCount);
    await page.keyboard.press('Escape');
    await photoViewer.waitFor({ state: 'hidden' });
    assert.equal(await page.evaluate(() => document.body.style.overflow), '');
    await detailTabs.getByRole('tab', { name: 'Photos', exact: true }).focus();
    await page.keyboard.press('End');
    const featuresPanel = page.getByRole('tabpanel', { name: 'Features', exact: true });
    await featuresPanel.waitFor();
    assert.equal(new URL(page.url()).hash, '#features');
    assert.ok((await featuresPanel.locator('table tbody tr').count()) > 6);
    assert.equal(
      await featuresPanel.getByRole('button', { name: /All features|Show more features/ }).count(),
      0,
    );
    await page.reload({ waitUntil: 'load' });
    await page.getByRole('tab', { name: 'Features', exact: true, selected: true }).waitFor();
    await detailTabs.getByRole('tab', { name: 'Features', exact: true }).focus();
    await page.keyboard.press('Home');
    await page.getByRole('tabpanel', { name: 'Details', exact: true }).waitFor();
    assert.equal(new URL(page.url()).hash, '');
    const specifications = page.getByRole('button', {
      name: 'Show more technical data',
      exact: true,
    });
    await specifications.click();
    const technicalDialog = page.getByRole('dialog', { name: 'Technical data', exact: true });
    await technicalDialog.waitFor();
    await page.keyboard.press('Escape');
    await technicalDialog.waitFor({ state: 'hidden' });
    await page.waitForFunction(
      () => document.activeElement?.getAttribute('aria-label') === 'Show more technical data',
    );
    await page.locator('[data-vehicle-contact-dock]').waitFor();
    await page.getByRole('link', { name: 'Enquire about BMW X6', exact: true }).click();
    assert.match(
      await page.getByRole('textbox', { name: 'Enquiry message' }).inputValue(),
      /BMW X6/,
    );
    check(
      'PDP sections preserve inventory Back; inline photos support Back/Forward, Escape and focus return; equipment stays inline and the dock keeps vehicle context',
    );
    await go('/vehicle/bmw-x6#photos');
    await page.getByRole('tab', { name: 'Photos', exact: true, selected: true }).waitFor();
    await page.getByRole('link', { name: 'Vehicle image', exact: true }).click();
    assert.equal(new URL(page.url()).searchParams.get('returnSection'), 'photos');
    await page.getByRole('link', { name: 'Go back', exact: true }).click();
    await page.getByRole('tabpanel', { name: 'Photos', exact: true }).waitFor();
    check('Standalone gallery returns to the selected PDP section');
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
    await searchCars('nonexistent car');
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
        for (const section of ['details', 'photos', 'features']) {
          await go('/vehicle/bmw-x6' + (section === 'details' ? '' : '#' + section));
          await page.locator('[data-vehicle-detail-panel="' + section + '"]').waitFor();
          await page.locator('[data-vehicle-detail-sheet]').evaluate((element) =>
            window.scrollTo({
              top: Math.max(0, scrollY + element.getBoundingClientRect().top - 60),
              behavior: 'instant',
            }),
          );
          if (section !== 'details') await page.locator('[data-vehicle-contact-dock]').waitFor();
          await geometry(width + 'px PDP ' + section);
          const tabs = await page
            .getByRole('tablist', { name: 'Vehicle information' })
            .getByRole('tab')
            .evaluateAll((elements) =>
              elements.map((element) => {
                const rect = element.getBoundingClientRect();
                return {
                  left: rect.left,
                  right: rect.right,
                  width: rect.width,
                  height: rect.height,
                };
              }),
            );
          assert.ok(tabs.every((tab) => tab.left >= 0 && tab.right <= width && tab.height >= 48));
          assert.ok(
            Math.max(...tabs.map((tab) => tab.width)) - Math.min(...tabs.map((tab) => tab.width)) <
              1,
          );
          await capture('pdp-' + section + '-' + width);
        }
        if (width < 800) {
          await page.setViewportSize({ width, height: 568 });
          await go('/vehicle/bmw-x6');
          const drawerEntry = await page
            .locator('[data-vehicle-detail-sheet]')
            .evaluate((sheet) => {
              const photo = document
                .querySelector('a[aria-label="Vehicle image"]')
                .getBoundingClientRect();
              const bounds = sheet.getBoundingClientRect();
              const rail = sheet.querySelector('[role="tablist"]').getBoundingClientRect();
              const facts = sheet.querySelector('section[aria-label="Vehicle overview"]');
              return {
                overlap: bounds.top < photo.bottom,
                tabsVisible: rail.top >= 60 && rail.bottom < innerHeight,
                flatFacts: getComputedStyle(facts).borderRadius === '0px',
              };
            });
          assert.deepEqual(drawerEntry, { overlap: true, tabsVisible: true, flatFacts: true });
          await capture('pdp-drawer-entry-' + width + 'x568');
          await page.setViewportSize({ width, height: 844 });
        }
        for (const tab of ['import', 'sell', 'financing', 'parts']) {
          await go('/services?tab=' + tab);
          await geometry(width + 'px service ' + tab);
          await capture('services-' + tab + '-' + width);
          if (tab === 'import' || tab === 'sell') {
            await page
              .getByRole('button', {
                name: tab === 'import' ? 'Start import enquiry' : 'Start sale enquiry',
                exact: true,
              })
              .click();
            for (let step = 0; step < 3; step++) {
              await page
                .locator('dialog[open] [aria-current="step"]')
                .filter({ hasText: ['Car', 'Details', 'Review'][step] })
                .waitFor();
              await requestGeometry(width + 'px ' + tab + ' step ' + (step + 1));
              await capture('services-' + tab + '-step' + (step + 1) + '-' + width);
              if (step < 2) await continueRequest();
            }
            await page.keyboard.press('Escape');
            await enquiry.waitFor({ state: 'hidden' });
          }
        }
      }
      for (const width of [320, 390, 1440]) {
        await page.setViewportSize({ width, height: width === 1440 ? 1000 : 844 });
        await go('/');
        await page.locator('[data-quick-filter="make"]').click();
        for (const section of [
          'Search',
          'Make & model',
          'Price',
          'Year',
          'Fuel',
          'Condition',
          'More',
        ]) {
          await page.getByRole('tab', { name: section, exact: true }).click();
          assert.equal(await page.locator('dialog[open]').count(), 1);
          await filterGeometry(width + 'px filter ' + section);
          await capture(
            'filters-' +
              section.toLowerCase().replaceAll(' ', '-').replaceAll('&', 'and') +
              '-' +
              width,
          );
        }
        await page.keyboard.press('Escape');
        await page.locator('dialog[open]').waitFor({ state: 'hidden' });
      }
      await page.setViewportSize({ width: 320, height: 480 });
      await go('/');
      for (const label of ['More filters', 'Price filters', 'Sort cars: Recommended']) {
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
      for (const tab of ['search', 'make', 'price', 'year', 'fuel', 'condition', 'more']) {
        await go('/?filter=' + tab);
        await page.getByRole('dialog', { name: 'Search and filters', exact: true }).waitFor();
        await filterGeometry('320x480 filter ' + tab);
        await capture('short-filters-' + tab);
        await page.getByRole('button', { name: 'Close filters', exact: true }).click();
        await page.locator('dialog[open]').waitFor({ state: 'hidden' });
        assert.equal(new URL(page.url()).searchParams.get('filter'), null);
      }
      for (const tab of ['import', 'sell']) {
        await page.setViewportSize({ width: 320, height: 480 });
        await go('/services?tab=' + tab + '&request=1');
        await enquiry.waitFor();
        for (let step = 0; step < 3; step++) {
          await page
            .locator('dialog[open] [aria-current="step"]')
            .filter({ hasText: ['Car', 'Details', 'Review'][step] })
            .waitFor();
          await requestGeometry('320x480 ' + tab + ' step ' + (step + 1));
          await capture('short-' + tab + '-step' + (step + 1));
          if (step < 2) await continueRequest();
        }
        await page.keyboard.press('Escape');
        await enquiry.waitFor({ state: 'hidden' });
      }
      await page.setViewportSize({ width: 320, height: 700 });
      for (const route of [
        '/',
        '/services',
        '/services?tab=import',
        '/services?tab=sell',
        '/services?tab=financing',
        '/services?tab=parts',
        '/contact',
        '/contact?service=parts',
      ]) {
        await go(route);
        await enlargeText();
        await geometry('320px 200% text ' + route);
        await capture(
          (route === '/' ? 'cars' : route.slice(1).replaceAll('?', '-').replaceAll('=', '-')) +
            '-320-text200',
        );
      }
      for (const tab of ['import', 'sell']) {
        for (let step = 0; step < 3; step++) {
          await go('/services?tab=' + tab + '&request=1');
          await enquiry.waitFor();
          for (let previous = 0; previous < step; previous++) await continueRequest();
          await page
            .locator('dialog[open] [aria-current="step"]')
            .filter({ hasText: ['Car', 'Details', 'Review'][step] })
            .waitFor();
          await enlargeText();
          await requestGeometry('320px 200% ' + tab + ' step ' + (step + 1));
          await capture('services-' + tab + '-step' + (step + 1) + '-320-text200');
        }
      }
      for (const tab of ['search', 'make', 'price', 'year', 'fuel', 'condition', 'more']) {
        await go('/?filter=' + tab);
        await page.getByRole('dialog', { name: 'Search and filters', exact: true }).waitFor();
        await enlargeText();
        await filterGeometry('320px 200% filter ' + tab);
        await capture('filters-' + tab + '-320-text200');
      }
      check(
        '320/390/1440px routes, short-height editors/steppers, reachable actions and 200% text reflow',
      );
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
