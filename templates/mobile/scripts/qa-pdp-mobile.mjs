import assert from 'node:assert/strict';
import { mkdir, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { chromium, webkit } from 'playwright';
import { vehicles } from '../.qa/domain/catalog.mjs';
import { localeMoney } from '../.qa/domain/locale.mjs';

const base = process.env.QA_URL || 'http://127.0.0.1:6474';
const output = path.resolve(process.env.QA_OUTPUT || '../../runtime/mobile-pdp-polish-20261005');
const evidence = path.resolve(process.env.QA_EVIDENCE || '../../docs/mobile-pdp-polish-20261005');
await mkdir(output, { recursive: true });
await mkdir(evidence, { recursive: true });
const report = { at: new Date().toISOString(), base, checks: [], errors: [] };
const labels = {
  bg: {
    rating: 'Детайли за оценката',
    lease: 'Детайли за лизинга',
    technical: 'Покажи още технически данни',
    save: 'Запази колата',
    unsave: 'Премахни от запазени',
    back: 'Назад',
    share: 'Сподели',
    image: 'Снимка на автомобила',
    photos: 'Снимки',
    features: 'Екстри',
    details: 'Детайли',
    enquire: 'Запитване',
    buying: 'Покупка',
    leasing: 'Лизинг',
    financing: 'Калкулатор за финансиране',
  },
  en: {
    rating: 'Price rating details',
    lease: 'Leasing details',
    technical: 'Show more technical data',
    save: 'Save car',
    unsave: 'Remove from saved cars',
    back: 'Go back',
    share: 'Share via',
    image: 'Vehicle image',
    photos: 'Photos',
    features: 'Features',
    details: 'Details',
    enquire: 'Enquire',
    buying: 'Buying',
    leasing: 'Leasing',
    financing: 'Calculate Financing',
  },
};

async function run(name, engine) {
  const browser = await engine.launch({ headless: true });
  const context = await browser.newContext({
    viewport: { width: 390, height: 844 },
    deviceScaleFactor: 1,
    hasTouch: true,
  });
  if (name === 'chromium') await context.grantPermissions(['clipboard-read', 'clipboard-write']);
  const page = await context.newPage();
  page.setDefaultTimeout(10000);
  page.on('pageerror', (error) => report.errors.push({ engine: name, error: error.message }));
  page.on('console', (message) => {
    if (message.type() === 'error') report.errors.push({ engine: name, error: message.text() });
  });
  const check = (description) => report.checks.push({ engine: name, description });
  const panel = () => page.locator('[data-vehicle-detail-panel]');
  const summary = () => page.locator('[data-vehicle-mobile-summary]');
  async function go(route) {
    const response = await page.goto(base + route, { waitUntil: 'networkidle' });
    assert.ok([200, 304].includes(response.status()), route + ': HTTP ' + response.status());
    await page.locator('[data-hydrated=true]').waitFor();
    await page.evaluate(() => document.fonts.ready);
    await page.locator('[data-vehicle-hero] img').evaluate((image) => image.decode());
    await page.evaluate(
      () => new Promise((resolve) => requestAnimationFrame(() => requestAnimationFrame(resolve))),
    );
  }
  async function geometry(description) {
    const result = await page.evaluate(() => ({
      width: innerWidth,
      scrollWidth: document.documentElement.scrollWidth,
      badImages: [...document.images]
        .filter((image) => {
          const r = image.getBoundingClientRect();
          return (
            r.width &&
            r.height &&
            r.bottom > 0 &&
            r.top < innerHeight &&
            image.complete &&
            !image.naturalWidth
          );
        })
        .map((image) => image.src),
    }));
    assert.ok(
      result.scrollWidth <= result.width + 1,
      description + ': horizontal overflow ' + JSON.stringify(result),
    );
    assert.deepEqual(result.badImages, [], description + ': broken images');
  }
  async function capture(file) {
    if (name === 'chromium') await page.screenshot({ path: path.join(evidence, file + '.png') });
  }
  try {
    for (const width of [320, 390, 430]) {
      await page.setViewportSize({ width, height: 844 });
      for (const lang of ['bg', 'en']) {
        const l = labels[lang];
        for (const v of vehicles) {
          await go('/vehicle/' + v.id + '?lang=' + lang);
          await page.locator('[data-vehicle-mobile-header=image]').waitFor();
          const payment = page.getByRole('group', {
            name: lang === 'bg' ? 'Начин на плащане' : 'Payment type',
          });
          assert.equal(await payment.count(), 0, 'mobile has no purchase/leasing segment');
          const photo = await page.locator('[data-vehicle-hero]').boundingBox();
          assert.equal(photo.y, 0, 'image reaches the top edge');
          assert.ok(Math.abs(photo.height - width * 0.75) < 1, '4:3 mobile hero');
          const header = page.locator('[data-vehicle-mobile-header]');
          for (const button of await header.getByRole('button').all()) {
            const box = await button.boundingBox();
            assert.ok(
              box.width >= 44 &&
                box.height >= 44 &&
                box.y >= photo.y &&
                box.y + box.height <= photo.y + photo.height,
              'image controls are reachable inside the photo',
            );
          }
          const titleHeading = summary().getByRole('heading', {
            level: 1,
            name: `${v.make} ${v.model}`,
            exact: true,
          });
          const title = await titleHeading.boundingBox();
          assert.equal(
            await titleHeading.innerText(),
            `${v.make} ${v.model}`,
            'the complete car name remains available in the heading',
          );
          const price = summary().locator('[data-mobile-vehicle-price]');
          assert.equal(
            await price.innerText(),
            localeMoney(v.price, lang),
            'purchase price is stable',
          );
          const priceBox = await price.boundingBox();
          const ratingBox = await page
            .getByRole('button', { name: l.rating, exact: true })
            .boundingBox();
          const layout = await summary().getAttribute('data-mobile-price-layout');
          assert.equal(layout, 'below-title');
          assert.ok(
            title.width >= width - 33 &&
              title.height === 28 &&
              title.y + title.height <= priceBox.y,
            'every name has the complete first row with the price beneath it',
          );
          assert.ok(Math.abs(priceBox.x - 16) < 1, 'purchase price aligns left beneath the title');
          assert.ok(
            Math.abs(ratingBox.x + ratingBox.width - (width - 16)) < 1,
            'the price rating aligns with the right edge',
          );
          const ratingPosition = await summary().getAttribute('data-mobile-rating-position');
          if (ratingPosition === 'beside-title') {
            const textBox = await titleHeading.evaluate((el) => {
              const range = document.createRange();
              range.selectNodeContents(el);
              const box = range.getBoundingClientRect();
              return { right: box.right };
            });
            assert.ok(
              textBox.right + 11 <= ratingBox.x &&
                ratingBox.y >= title.y &&
                ratingBox.y + ratingBox.height <= title.y + title.height,
              'the price rating fits beside the complete title without covering its text',
            );
          } else {
            assert.equal(ratingPosition, 'above-title');
            assert.ok(
              ratingBox.y + ratingBox.height <= title.y,
              'long names move the rating above the title',
            );
          }
          assert.ok(ratingBox.height >= 24, 'secondary rating has a reachable target');
          const variant = await summary().locator('[data-mobile-vehicle-variant]').boundingBox();
          assert.ok(
            variant.y >= priceBox.y + priceBox.height && Math.abs(variant.x - priceBox.x) < 1,
            'quiet variant pills align left beneath the prices',
          );
          for (const pill of await summary().locator('[data-mobile-variant-pill]').all()) {
            const box = await pill.boundingBox();
            assert.ok(
              box.x >= variant.x && box.x + box.width <= variant.x + variant.width + 1,
              'every pill wraps inside the metadata column',
            );
          }
          assert.ok(
            variant.y >= priceBox.y + priceBox.height,
            'pills have the full row beneath the price and never overlap it',
          );
          const net = summary().locator('[data-mobile-vehicle-net-price]');
          if (await net.count()) {
            const netBox = await net.boundingBox();
            assert.ok(
              netBox.x >= priceBox.x + priceBox.width + 7 &&
                netBox.y < priceBox.y + priceBox.height &&
                netBox.y + netBox.height > priceBox.y,
              'net and main price share a row, with net immediately to the right',
            );
            assert.doesNotMatch(await net.innerText(), /19(?:\.00)?\s*%/);
            assert.ok(
              variant.y >= netBox.y + netBox.height,
              'variant pills appear below both prices',
            );
          }
          const typography = await summary().evaluate((el) => ({
            title: parseFloat(getComputedStyle(el.querySelector('h1')).fontSize),
            titleWeight: Number(getComputedStyle(el.querySelector('h1')).fontWeight),
            price: parseFloat(
              getComputedStyle(el.querySelector('[data-mobile-vehicle-price]')).fontSize,
            ),
            priceWeight: Number(
              getComputedStyle(el.querySelector('[data-mobile-vehicle-price]')).fontWeight,
            ),
          }));
          assert.ok(typography.price < typography.title, 'price is quieter than the car name');
          assert.ok(typography.priceWeight < typography.titleWeight, 'price has a lighter weight');
          const summaryBox = await summary().boundingBox();
          const rail = await page.locator('[data-vehicle-detail-nav]').boundingBox();
          assert.deepEqual(
            await page.locator('[data-vehicle-detail-nav]').getByRole('tab').allTextContents(),
            [l.details, l.features, l.photos],
            'mobile sections follow Details, Features, Photos',
          );
          const tabGeometry = await page
            .locator('[data-vehicle-detail-nav] [role=tablist]')
            .evaluate((el) => {
              const selected = el.querySelector('[aria-selected=true]');
              const indicator = getComputedStyle(selected, '::after');
              return {
                background: getComputedStyle(el).backgroundColor,
                shadow: getComputedStyle(el).boxShadow,
                border: getComputedStyle(el).borderBottomWidth,
                height: el.getBoundingClientRect().height,
                indicatorHeight: indicator.height,
                indicatorDisplay: indicator.display,
                indicatorLeft: indicator.left,
                indicatorRight: indicator.right,
                indicatorBottom: indicator.bottom,
              };
            });
          assert.equal(
            tabGeometry.background,
            'rgb(255, 255, 255)',
            'PDP tabs have a white surface',
          );
          assert.equal(
            tabGeometry.shadow,
            'rgba(23, 32, 43, 0.12) 0px 4px 8px 0px',
            'PDP tabs retain their original elevated surface',
          );
          assert.equal(tabGeometry.border, '0px', 'no extra rail line doubles the underline');
          assert.equal(tabGeometry.height, 52, 'original rail height');
          assert.equal(tabGeometry.indicatorHeight, '3px', 'original underline thickness');
          assert.equal(tabGeometry.indicatorDisplay, 'block');
          assert.equal(tabGeometry.indicatorLeft, '2px');
          assert.equal(tabGeometry.indicatorRight, '2px');
          assert.equal(
            tabGeometry.indicatorBottom,
            '0px',
            'full-tab underline meets the rail baseline',
          );
          assert.ok(
            summaryBox.y + summaryBox.height <= rail.y + 1,
            'summary and actions sit above the section tabs',
          );
          assert.equal(
            await summary().locator('[data-mobile-monthly-payment]').count(),
            0,
            'summary ends with contact actions',
          );
          const monthly = page.locator(
            '[data-mobile-vehicle-finance] [data-mobile-monthly-payment]',
          );
          assert.equal(await monthly.count(), 1, 'Details has one financing calculator entry');
          const monthlyBox = await monthly.boundingBox();
          assert.ok(
            monthlyBox.height >= 44 && monthlyBox.width >= width - 1,
            'reachable lower Details row',
          );
          const descriptionEnd = await page
            .getByRole('heading', {
              name: lang === 'bg' ? 'Описание на автомобила' : 'Vehicle description',
              exact: true,
            })
            .locator('..')
            .boundingBox();
          assert.ok(
            monthlyBox.y >= descriptionEnd.y + descriptionEnd.height,
            'financing follows the description',
          );
          assert.equal(
            await page.getByRole('button', { name: l.lease, exact: true }).count(),
            0,
            'buying has no second leasing link',
          );
          assert.equal(
            await page.getByRole('button', { name: new RegExp(l.financing) }).count(),
            1,
            'buying has one financing control',
          );
          const facts = await page
            .getByRole('region', { name: lang === 'bg' ? 'Основни данни' : 'Vehicle overview' })
            .innerText();
          assert.doesNotMatch(facts, /kW|E10|Скоростна кутия/);
          assert.match(facts, new RegExp(v.power + (lang === 'bg' ? ' к\\.с\\.' : ' hp')));
          const description = page.getByRole('heading', {
            name: lang === 'bg' ? 'Описание на автомобила' : 'Vehicle description',
            exact: true,
          });
          assert.equal(await description.count(), 1, 'Details retains the vehicle description');
          assert.ok(await description.isVisible());
          assert.match(
            await description.locator('..').locator('p').first().innerText(),
            new RegExp(v.make + ' ' + v.model),
            'description retains vehicle context',
          );
          assert.equal(
            await page.locator('[data-vehicle-contact-dock]').count(),
            0,
            'dock is absent while primary actions are available',
          );
          await geometry(width + '/' + lang + '/' + v.id);
          if (['bmw-120', 'bmw-x6'].includes(v.id) && width !== 430)
            await capture('after-' + v.id + '-' + lang + '-' + width);
          check(
            width +
              'px ' +
              lang +
              ' ' +
              v.id +
              ': calm summary, Details/Features/Photos tabs, financing below description, no payment segment and no overflow',
          );
        }
      }
    }

    await page.setViewportSize({ width: 390, height: 844 });
    for (const lang of ['bg', 'en']) {
      await go('/vehicle/bmw-120?lang=' + lang);
      const nav = page.locator('[data-vehicle-detail-nav]');
      await nav.getByRole('tab', { name: labels[lang].details, exact: true }).focus();
      await page.keyboard.press('ArrowRight');
      await page.locator('[data-vehicle-detail-panel=features]').waitFor();
      assert.equal(await page.locator('[data-mobile-vehicle-finance]').count(), 0);
      await page.keyboard.press('ArrowRight');
      await page.locator('[data-vehicle-detail-panel=photos]').waitFor();
      assert.equal(await page.locator('[data-mobile-vehicle-finance]').count(), 0);
      await page.keyboard.press('Home');
      await page.locator('[data-vehicle-detail-panel=details]').waitFor();
      assert.equal(await page.locator('[data-mobile-vehicle-finance]').count(), 1);
      check('Mobile tab keyboard order and Details-only financing in ' + lang);
    }
    await go('/vehicle/bmw-120?lang=bg');
    await page.locator('[data-mobile-vehicle-finance] [data-mobile-monthly-payment]').click();
    const dialog = page.getByRole('dialog');
    await dialog.waitFor();
    const leaseOffer = dialog.locator('[data-mobile-lease-offer]');
    await leaseOffer.locator('summary').click();
    assert.equal(await leaseOffer.getAttribute('open'), '');
    assert.match(await leaseOffer.innerText(), /199\s*€/);
    assert.match(
      await leaseOffer.innerText(),
      /не се изпраща|не са свързани|не е свързан|Captured|Демо|референт/i,
    );
    await capture('monthly-details-390');
    await page.keyboard.press('Escape');
    await dialog.waitFor({ state: 'hidden' });
    assert.equal(
      await page
        .locator('[data-mobile-vehicle-finance] [data-mobile-monthly-payment]')
        .evaluate((el) => document.activeElement === el),
      true,
    );
    await page.getByRole('button', { name: labels.bg.rating, exact: true }).click();
    await dialog.waitFor();
    await page.keyboard.press('Escape');
    await page.getByRole('button', { name: labels.bg.technical, exact: true }).click();
    await dialog.waitFor();
    assert.match(
      await dialog.innerText(),
      /125\s+kW\s+\(170\s+к\.с\.\)/,
      'full technical sheet retains complete power',
    );
    assert.match(await dialog.innerText(), /E10/, 'full sheet retains fuel compatibility');
    await page.keyboard.press('Escape');
    await dialog.waitFor({ state: 'hidden' });
    check(
      'Monthly sheet exposes the captured lease quote; rating and full technical dialogs preserve facts and restore focus',
    );

    await go('/vehicle/bmw-120?lang=bg');
    await page.getByRole('button', { name: labels.bg.save, exact: true }).click();
    const saved = page.locator('[data-vehicle-mobile-header] button[aria-pressed=true]');
    assert.equal(await saved.count(), 1);
    await page.reload({ waitUntil: 'networkidle' });
    await page.locator('[data-hydrated=true]').waitFor();
    await saved.waitFor();
    assert.equal(await saved.count(), 1, 'saved state survives reload');
    await saved.click();
    await page.getByRole('button', { name: labels.bg.share, exact: true }).click();
    if (name === 'chromium')
      assert.match(
        await page.evaluate(() => navigator.clipboard.readText()),
        /vehicle\/bmw-120\?lang=bg/,
      );
    check('Overlay save persists and can be undone; Share copies the locale-aware vehicle link');

    await go('/vehicle/bmw-x6?lang=bg');
    const hero = page.getByRole('link', { name: labels.bg.image, exact: true });
    const firstPhoto = await hero.locator('img').getAttribute('src');
    await hero.focus();
    await page.keyboard.press('ArrowRight');
    assert.notEqual(
      await hero.locator('img').getAttribute('src'),
      firstPhoto,
      'keyboard photo navigation',
    );
    await page.getByRole('tab', { name: labels.bg.features, exact: true }).click();
    await page.locator('[data-vehicle-detail-panel=features]').waitFor();
    await page.locator('[data-vehicle-mobile-header=compact]').waitFor();
    await page.locator('[data-vehicle-contact-dock]').waitFor();
    await geometry('features section');
    await capture('after-features-390');
    await hero.click({ force: true });
    await page.waitForURL('**/gallery?returnSection=features');
    await page.getByRole('link', { name: labels.bg.back, exact: true }).click();
    await page.waitForURL('**/vehicle/bmw-x6#features');
    await page.locator('[data-vehicle-detail-panel=features]').waitFor();
    await page.getByRole('tab', { name: labels.bg.photos, exact: true }).click();
    await page.locator('[data-vehicle-detail-panel=photos]').waitFor();
    await geometry('photos section');
    await page.getByRole('tab', { name: labels.bg.details, exact: true }).click();
    await page.locator('[data-vehicle-detail-panel=details]').waitFor();
    await page.evaluate(
      () => new Promise((resolve) => requestAnimationFrame(() => requestAnimationFrame(resolve))),
    );
    await page.evaluate(() => window.scrollTo(0, 550));
    await page.locator('[data-vehicle-contact-dock]').waitFor();
    await capture('after-bmw-x6-scroll-390');
    await page.evaluate(() => window.scrollTo(0, 0));
    await page.locator('[data-vehicle-mobile-header=image]').waitFor();
    await page.locator('[data-vehicle-contact-dock]').waitFor({ state: 'hidden' });
    check('Gallery/section return, compact header, conditional dock and scroll-to-top restoration');

    for (const width of [390, 320]) {
      await page.setViewportSize({ width, height: 844 });
      await go('/vehicle/bmw-120?lang=bg');
      const fullVariant =
        '120d xDrive M Sport · Автоматик · Панорама · Камера · Пълен пакет оборудване';
      await summary()
        .locator('[data-mobile-vehicle-variant]')
        .evaluate((el, text) => {
          const pill = el.firstElementChild;
          el.replaceChildren(
            ...text.split(' · ').map((part) => {
              const chip = pill.cloneNode(false);
              chip.textContent = part;
              return chip;
            }),
          );
        }, fullVariant);
      const wrappedVariant = await summary().locator('[data-mobile-vehicle-variant]').boundingBox();
      const shortTitle = await summary().locator('h1').boundingBox();
      const inlinePrice = await summary().locator('[data-mobile-vehicle-price]').boundingBox();
      assert.equal(await summary().getAttribute('data-mobile-price-layout'), 'below-title');
      assert.equal(
        (await summary().locator('[data-mobile-variant-pill]').allInnerTexts()).join(' · '),
        fullVariant,
      );
      assert.ok(
        wrappedVariant.height > 24 && wrappedVariant.y >= shortTitle.y + shortTitle.height,
        'long variant pills wrap beneath the title',
      );
      assert.ok(
        shortTitle.y + shortTitle.height <= inlinePrice.y,
        'wrapped pills leave the title row free',
      );
      await geometry('long variant ' + width);
      await capture('after-long-variant-bg-' + width);
      check('Full variant wraps without truncation at ' + width);
      await go('/vehicle/bmw-120?lang=bg');
      const longName = 'Lamborghini Aventador SVJ Roadster';
      await summary().evaluate((el, text) => {
        const title = el.querySelector('h1');
        title.textContent = text;
        title.title = text;
        el.querySelector('[data-mobile-title-probe]').textContent = text;
      }, longName);
      await page.waitForFunction(
        () =>
          document
            .querySelector('[data-vehicle-mobile-summary]')
            ?.getAttribute('data-mobile-rating-position') === 'above-title',
      );
      const title = await summary().locator('h1').boundingBox();
      const price = await summary().locator('[data-mobile-vehicle-price]').boundingBox();
      assert.ok(
        title.height === 28 && title.width >= width - 33 && title.y + title.height <= price.y + 1,
        'long names retain one full-width row with price below',
      );
      assert.equal(
        await summary().getByRole('heading', { level: 1, name: longName, exact: true }).count(),
        1,
      );
      if (width === 320)
        assert.ok(
          await summary()
            .locator('h1')
            .evaluate((el) => el.scrollWidth > el.clientWidth),
          'the long name is visually truncated at 320px while its accessible name is intact',
        );
      await geometry('long-title stress case ' + width);
      await capture('after-long-name-bg-' + width);
      check('Lamborghini Aventador SVJ Roadster retains one full-width title row at ' + width);
    }
    await page.setViewportSize({ width: 320, height: 480 });
    await page.evaluate(() => {
      const changes = [...document.querySelectorAll('body *')]
        .filter((el) => {
          const r = el.getBoundingClientRect();
          return r.width && r.height;
        })
        .map((el) => [el, getComputedStyle(el).fontSize, getComputedStyle(el).lineHeight]);
      for (const [el, size, line] of changes) {
        el.style.fontSize = parseFloat(size) * 2 + 'px';
        if (line.endsWith('px')) el.style.lineHeight = parseFloat(line) * 2 + 'px';
      }
    });
    await geometry('320px 200% text');
    const largeVariant = await summary().locator('[data-mobile-vehicle-variant]').boundingBox();
    const largePrice = await summary().locator('[data-mobile-vehicle-price]').boundingBox();
    assert.ok(
      largeVariant.x + largeVariant.width <= largePrice.x + 1 ||
        largePrice.x + largePrice.width <= largeVariant.x + 1 ||
        largeVariant.y + largeVariant.height <= largePrice.y + 1 ||
        largePrice.y + largePrice.height <= largeVariant.y + 1,
      'enlarged variant and price do not overlap',
    );
    await summary()
      .getByRole('link', { name: labels.bg.enquire, exact: true })
      .evaluate((el) =>
        window.scrollTo({
          top: window.scrollY + el.getBoundingClientRect().bottom - 80,
          behavior: 'instant',
        }),
      );
    await page.locator('[data-vehicle-contact-dock]').waitFor();
    const dock = await page.locator('[data-vehicle-contact-dock]').boundingBox();
    assert.ok(
      dock.x >= 0 && dock.y >= 0 && dock.x + dock.width <= 321 && dock.y + dock.height <= 481,
    );
    await capture('text200-320');
    check('320x480 long names and 200% text reflow with a reachable dock');

    await page.setViewportSize({ width: 390, height: 844 });
    await go('/vehicle/bmw-120?lang=bg');
    await page.evaluate(() => {
      const key = 'mobile-reference-v1';
      const state = JSON.parse(localStorage.getItem(key));
      state.filters.payment = 'lease';
      localStorage.setItem(key, JSON.stringify(state));
    });
    await page.reload({ waitUntil: 'networkidle' });
    assert.equal(
      await summary().locator('[data-mobile-vehicle-price]').innerText(),
      localeMoney(27777, 'bg'),
      'mobile retains the complete vehicle price when inventory was filtered by leasing',
    );
    await page.setViewportSize({ width: 1440, height: 1000 });
    await page.waitForFunction(() =>
      document.querySelector('[data-vehicle-price]')?.textContent.includes('199'),
    );
    assert.deepEqual(
      await page.locator('[data-vehicle-detail-nav]').getByRole('tab').allTextContents(),
      [labels.bg.details, labels.bg.photos, labels.bg.features],
      'desktop retains its tab order',
    );
    assert.equal(await page.locator('[data-mobile-vehicle-finance]').isVisible(), false);
    await page.getByRole('button', { name: 'Покупка', exact: true }).click();
    assert.equal(
      await panel().locator('[data-vehicle-price]').innerText(),
      localeMoney(27777, 'bg'),
    );
    check(
      'Mobile keeps one vehicle price and no segment; desktop retains its purchase/leasing behavior',
    );
    await page.evaluate(() => {
      const key = 'mobile-reference-v1';
      const state = JSON.parse(localStorage.getItem(key));
      state.filters.payment = 'buy';
      state.photoIndexes = {};
      localStorage.setItem(key, JSON.stringify(state));
    });
    for (const id of ['bmw-120', 'bmw-x6']) {
      await go('/vehicle/' + id + '?lang=bg');
      assert.equal(
        await page.locator('[data-vehicle-hero]').evaluate((el) => el.getBoundingClientRect().top),
        60,
      );
      await capture('after-' + id + '-bg-1440');
    }
    await page.setViewportSize({ width: 390, height: 844 });
    await go('/vehicle/bmw-120?lang=bg');
    await summary().getByRole('link', { name: labels.bg.enquire, exact: true }).click();
    await page.waitForURL('**/contact?vehicle=bmw-120');
    await page.waitForLoadState('networkidle');
    await page.locator('[data-hydrated=true]').waitFor();
    await geometry('vehicle enquiry destination');
    check('Enquiry keeps vehicle context without submitting a form');
  } finally {
    await browser.close();
  }
}

try {
  for (const [name, engine] of [
    ['chromium', chromium],
    ['webkit', webkit],
  ])
    await run(name, engine);
  assert.deepEqual(report.errors, [], 'browser console errors');
  report.passed = true;
} catch (error) {
  report.passed = false;
  report.failure = error.stack;
  process.exitCode = 1;
} finally {
  await writeFile(path.join(output, 'browser-report.json'), JSON.stringify(report, null, 2));
  console.log(
    JSON.stringify({
      passed: report.passed,
      checks: report.checks.length,
      errors: report.errors,
      failure: report.failure,
    }),
  );
}
