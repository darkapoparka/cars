import assert from 'node:assert/strict';
import { mkdir } from 'node:fs/promises';
import { launchBrowser, previewUrl } from './browser.mjs';
import { smokeReport } from './smoke-report.mjs';

const base = previewUrl();
const cardsOnly = process.argv.includes('--cards-only');
const output = 'artifacts/mobile-polish-smoke';
await mkdir(output, { recursive: true });
const suite = await smokeReport(output, base);
const browser = await launchBrowser();
async function fits(locator) {
  const failures = await locator.evaluateAll(elements => elements.filter(el => el.checkVisibility()).flatMap(el => {
    const box = el.getBoundingClientRect();
    const problems = [];
    if (el.scrollWidth > el.clientWidth + 1) problems.push('horizontal clipping');
    if (box.height < 44) problems.push('touch target below 44px');
    const minimumIcon = 15;
    for (const icon of el.querySelectorAll('svg')) if (icon.checkVisibility() && icon.getBoundingClientRect().width < minimumIcon) problems.push('collapsed icon');
    return problems.length ? [{ text: el.textContent.trim(), problems }] : [];
  }));
  assert.deepEqual(failures, []);
}
async function compactControl(locator, { icon = false } = {}) {
  const result = await locator.evaluate(el => {
    const box = el.getBoundingClientRect(), style = getComputedStyle(el), pseudo = getComputedStyle(el, '::before');
    const svg = el.querySelector('svg')?.getBoundingClientRect();
    const hasSurface = pseudo.content !== 'none';
    const visibleHeight = hasSurface ? box.height - parseFloat(pseudo.top) - parseFloat(pseudo.bottom) : box.height;
    return { width: box.width, height: box.height, visibleHeight, fontSize: style.fontSize,
      lineHeight: style.lineHeight, gap: style.gap, iconWidth: svg?.width,
      iconDy: svg ? svg.y + svg.height / 2 - box.y - box.height / 2 : null };
  });
  assert.equal(result.height, 44); assert.equal(result.visibleHeight, 40);
  assert.equal(result.fontSize, '16px'); assert.equal(result.lineHeight, '20.8px');
  assert.equal(result.gap, '8px');
  if (icon) { assert.equal(result.iconWidth, 15); assert(Math.abs(result.iconDy) <= .5); }
  return result;
}
async function alignedDock(page) {
  const alignment = await page.locator('.dn-mobile-bottom-nav a,.dn-mobile-bottom-nav button').evaluateAll(controls => controls.map(control => {
    const icon = control.querySelector('svg').getBoundingClientRect();
    const label = control.querySelector('.dn-mobile-bottom-nav__label').getBoundingClientRect();
    return { iconTop: icon.top, labelTop: label.top, transform: getComputedStyle(control).transform };
  }));
  assert.equal(alignment.length, 5);
  assert(Math.max(...alignment.map(item => item.iconTop)) - Math.min(...alignment.map(item => item.iconTop)) <= .5 &&
    Math.max(...alignment.map(item => item.labelTop)) - Math.min(...alignment.map(item => item.labelTop)) <= .5 &&
    alignment.every(item => item.transform === 'none'), 'Every navigation item shares one baseline; Sell is never raised');
}
async function alignedDiscovery(page, locale) {
  const grids = await page.locator('#body-types-grid, #brands-grid').evaluateAll(elements => elements.map(grid => {
    const cards = [...grid.children].filter(card => card.checkVisibility());
    return cards.map(card => {
      const box = card.getBoundingClientRect();
      const label = card.querySelector('strong');
      const labelBox = label.getBoundingClientRect();
      const glyph = card.querySelector('.dn-discovery-all__glyph');
      const glyphBox = glyph?.getBoundingClientRect();
      const frame = card.querySelector('.dn-body-type__frame, .dn-brand-card__frame');
      const media = frame?.parentElement.getBoundingClientRect();
      const artwork = frame?.getBoundingClientRect();
      return { height: box.height, labelTop: labelBox.top - box.top, labelHeight: labelBox.height,
        clipped: label.scrollWidth > label.clientWidth + 1, font: getComputedStyle(label).font,
        glyph: glyphBox ? { top: glyphBox.top - box.top, width: glyphBox.width, height: glyphBox.height } : null,
        allLabel: glyph ? label.textContent.trim() : null,
        artFits: !artwork || (artwork.top >= media.top - 1 && artwork.bottom <= media.bottom + 1 && artwork.left >= media.left - 1 && artwork.right <= media.right + 1) };
    });
  }));
  const cards = grids.flat();
  assert(cards.every(card => card.height === 116 && !card.clipped && card.labelHeight < 22 && card.artFits),
    `Discovery copy and artwork fit the same compact tile: ${JSON.stringify(grids)}`);
  assert(Math.max(...cards.map(card => card.labelTop)) - Math.min(...cards.map(card => card.labelTop)) < 1,
    'Body styles, brand names and All share one label baseline');
  assert.equal(new Set(cards.map(card => card.font)).size, 1);
  const all = cards.filter(card => card.glyph);
  assert.equal(all.length, 2);
  assert.deepEqual(all[0].glyph, all[1].glyph, 'Both All glyphs have identical size and placement');
  assert(all.every(card => card.allLabel === (locale === 'bg' ? 'Всички' : 'All')));
  const disclosure = page.locator('#body-types-grid button.dn-discovery-toggle');
  if (await disclosure.count()) {
    await disclosure.click();
    assert.equal(await disclosure.getAttribute('aria-expanded'), 'true');
    assert(await page.locator('#body-types-grid .dn-body-type:visible').count() > 3);
    await disclosure.click();
    assert.equal(await disclosure.getAttribute('aria-expanded'), 'false');
  }
  assert.equal(await page.locator('#brands-grid a.dn-discovery-toggle').getAttribute('href'), `/${locale}/cars`);
}
async function longCardCopy(page, locale, layout) {
  // Exercise future dealer inventory without replacing the master's sample records.
  const title = 'Tesla Model 3 Performance Long Range AWD';
  for (const fuel of [
    { compact: locale === 'bg' ? 'Електр.' : 'Electric', full: locale === 'bg' ? 'Електрически' : 'Electric', name: 'electric' },
    { compact: locale === 'bg' ? 'Б/ЛПГ' : 'P/LPG', full: locale === 'bg' ? 'Бензин/ЛПГ' : 'Petrol/LPG', name: 'lpg' }
  ]) {
    await page.evaluate(({ title, fuel, locale, layout }) => {
      const source = document.querySelector(layout === 'listing' ? '.dn-vehicle-card--listing' : '.dn-inventory .dn-vehicle-card');
      const card = source.cloneNode(true);
      card.id = 'vehicle-copy-fixture';
      card.querySelector('.dn-vehicle-card__make').textContent = 'Tesla';
      const heading = card.querySelector('.dn-vehicle-card__name');
      heading.textContent = title.slice('Tesla '.length);
      heading.title = title;
      card.querySelector('a').setAttribute('aria-label', title);
      const labels = [fuel, { compact: locale === 'bg' ? 'Автомат' : 'Auto', full: locale === 'bg' ? 'Автоматик' : 'Automatic' }];
      const badges = [...card.querySelectorAll('.dn-vehicle-card__fact--spec')];
      for (const [index, badge] of badges.entries()) {
        badge.title = labels[index].full;
        badge.querySelector('[aria-hidden="true"]').textContent = labels[index].compact;
        badge.querySelector('.dn-sr-only').textContent = labels[index].full;
      }
      const body = card.querySelector('.dn-vehicle-card__fact--body');
      if (body) { body.title = locale === 'bg' ? 'Седан' : 'Sedan'; body.querySelector('span').textContent = body.title; }
      source.parentElement.append(card);
    }, { title, fuel, locale, layout });
    const fixture = page.locator('#vehicle-copy-fixture');
    try {
      await fixture.scrollIntoViewIfNeeded();
      await page.evaluate(() => new Promise(resolve => requestAnimationFrame(() => requestAnimationFrame(resolve))));
      const geometry = await fixture.evaluate(card => {
        const heading = card.querySelector('.dn-vehicle-card__name');
        const headingStyle = getComputedStyle(heading);
        const badges = [...card.querySelectorAll('.dn-vehicle-card__fact')].filter(badge => badge.checkVisibility());
        const photo = card.querySelector('.dn-vehicle-card__visual').getBoundingClientRect();
        const metadata = card.querySelector('.dn-vehicle-card__mobile-meta').getBoundingClientRect();
        const content = card.querySelector('.dn-vehicle-card__content').getBoundingClientRect();
        const mileage = badges[1].querySelector('span');
        return {
          expectedFacts: !card.classList.contains('dn-vehicle-card--listing') ? 3 : card.clientWidth <= 24 * parseFloat(getComputedStyle(document.documentElement).fontSize) ? 4 : 5,
          lines: heading.getBoundingClientRect().height / parseFloat(headingStyle.lineHeight),
          title: heading.title, accessible: card.querySelector('a').getAttribute('aria-label'),
          bottomStrip: metadata.top >= photo.bottom && metadata.top >= content.bottom - 1,
          fullMileageFits: mileage.checkVisibility() && mileage.scrollWidth <= mileage.clientWidth + 1 && /\d.*(?:km|км)/.test(mileage.textContent),
          badges: badges.map(badge => {
            const text = badge.querySelector('span:not(.dn-sr-only)');
            const box = badge.getBoundingClientRect(), textBox = text.getBoundingClientRect(), style = getComputedStyle(text);
            return { top: box.top, full: badge.title, whiteSpace: style.whiteSpace, height: textBox.height,
              padding: text === badge ? parseFloat(style.paddingTop) + parseFloat(style.paddingBottom) : 0,
              clipped: text.scrollWidth > text.clientWidth + 1,
              lineHeight: parseFloat(style.lineHeight), fits: textBox.left >= box.left && textBox.right <= box.right };
          })
        };
      });
      assert(geometry.lines <= 2.05, `Long model copy stays within two lines: ${JSON.stringify(geometry)}`);
      assert.equal(geometry.title, title);
      assert.equal(geometry.accessible, title, 'Clamped copy retains the complete vehicle name for accessibility');
      assert(geometry.badges.every(badge => badge.whiteSpace === 'nowrap' && badge.height <= badge.lineHeight + badge.padding + 1 && badge.fits), `Every visible badge keeps a single line inside its surface: ${JSON.stringify(geometry)}`);
      assert(geometry.badges.every(badge => !badge.clipped), `Known compact fuel and transmission labels remain fully visible: ${JSON.stringify(geometry)}`);
      assert.equal(geometry.badges.length, geometry.expectedFacts, 'Narrow listings prioritize year, mileage, fuel and transmission; roomy listings retain all five facts');
      assert(geometry.bottomStrip && geometry.fullMileageFits, 'All mobile cards retain complete mileage in the strip after the title and price');
      assert(Math.max(...geometry.badges.map(badge => badge.top)) - Math.min(...geometry.badges.map(badge => badge.top)) <= 1, 'All mobile specifications share one row');
      assert(geometry.badges.some(badge => badge.full === fuel.full), 'Full fuel values remain available alongside compact copy');
      await fixture.screenshot({ path: `${output}/${locale}-${page.viewportSize().width}-${layout}-${fuel.name}-copy.png` });
    } finally {
      await fixture.evaluate(card => card.remove());
    }
  }
  await page.evaluate(() => window.scrollTo({ top: 0, behavior: 'instant' }));
}
try {
  for (const locale of ['bg', 'en']) for (const width of (cardsOnly ? [320, 390, 430] : [320, 390, 430, 1440])) {
    await suite.check(`${locale} mobile polish ${width}`, async () => {
      const page = await browser.newPage({ viewport: { width, height: width === 1440 ? 900 : 844 }, hasTouch: width < 768, reducedMotion: 'reduce' });
      page.setDefaultNavigationTimeout(60000);
      const errors = [];
      page.on('pageerror', error => errors.push(error.message));
      let dockNames;
      await page.context().addCookies([{ name: 'cars_locale', value: locale, url: base }, { name: 'cars_prompt', value: 'v1', url: base }]);
      const visit = async path => { await page.goto(base + path, { waitUntil: 'networkidle' }); await page.evaluate(() => document.fonts.ready); };
      const capture = async name => {
        assert(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1), `${name}: page overflow`);
        await page.screenshot({ path: `${output}/${locale}-${width}-${name}.png` });
      };
      try {
        await visit('/');
        if (cardsOnly) {
          await longCardCopy(page, locale, 'carousel');
          await visit('/cars');
          await longCardCopy(page, locale, 'listing');
          assert.deepEqual(errors, []);
          return {locale,width,passed:true};
        }
        if (width >= 768) assert.equal(await page.locator('.dn-mobile-services').isVisible(), false,
          'The service overview does not change the desktop Home composition');
        if (width < 768) {
          const homeCopy = await page.locator('.dn-mobile-core-card strong, .dn-mobile-core-card small, #featured-title').evaluateAll(elements => elements.map(el => {
            const box = el.getBoundingClientRect();
            const range = document.createRange(); range.selectNodeContents(el);
            const text = range.getBoundingClientRect();
            return { text: el.textContent.trim(), height: box.height, lineHeight: parseFloat(getComputedStyle(el).lineHeight),
              fits: text.left >= box.left - 1 && text.right <= box.right + 1 };
          }));
          assert.equal(homeCopy.length, 9);
          assert(homeCopy.every(item => item.fits && item.height <= item.lineHeight + 1),
            `Home service copy and featured heading must fit one line: ${JSON.stringify(homeCopy)}`);
          const homeArt = await page.locator('.dn-mobile-core-card').evaluateAll(cards => cards.map(card => {
            const box = card.getBoundingClientRect();
            const copy = card.querySelector('.dn-mobile-core-card__copy').getBoundingClientRect();
            const art = card.querySelector('.feature-artwork').getBoundingClientRect();
            const clearOfCopy = art.bottom <= copy.top - 4 || art.top >= copy.bottom + 4;
            return clearOfCopy && art.top >= box.top && art.bottom <= box.bottom && art.left >= box.left && art.right <= box.right;
          }));
          assert(homeArt.every(Boolean), 'Service artwork stays inside its card and clear of the text');
          const actionImages = await page.locator('.dn-mobile-core-card img').evaluateAll(images => images.map(image => image.getAttribute('src')));
          assert.equal(new Set(actionImages).size, 4, 'Each service has distinct imagery');
          assert.match(actionImages[0], /home-collection-silver-v1/);
          assert.match(actionImages[1], /service-valuation-silver-v2/);
          assert.match(actionImages[2], /desktop-service-import-v2/);
          assert.match(actionImages[3], /service-leasing-silver-v3/);
          const services = page.locator('.dn-mobile-services__card');
          await fits(services);
          assert.equal(await services.getAttribute('href'), `/${locale}/about-us#process`,
            'The service overview reaches the existing localized service section');
          const placement = await services.evaluate(card => {
            const box = card.getBoundingClientRect();
            const brands = document.querySelector('.dn-brand-section').getBoundingClientRect();
            const advice = document.querySelector('.dn-editorial').getBoundingClientRect();
            return box.left >= 0 && box.right <= innerWidth && box.top >= advice.bottom;
          });
          assert(placement, 'All services follows Buying guides without widening the page');
          await capture('home');
          await page.locator('.dn-mobile-core-actions').scrollIntoViewIfNeeded();
          await capture('home-actions');
          const search = await page.locator('.dn-quick-search__trigger').evaluate(el => {
            const box = el.getBoundingClientRect();
            return { height: box.height, font: getComputedStyle(el).fontSize, gap: getComputedStyle(el).gap,
              background: getComputedStyle(el).backgroundColor, border: getComputedStyle(el).borderWidth,
              color: getComputedStyle(el.querySelector('.dn-quick-search__label-mobile')).color,
              labelFits: (() => { const label = el.querySelector('.dn-quick-search__label-mobile'); return label.scrollWidth <= label.clientWidth + 1; })(),
              tapHighlight: getComputedStyle(el).webkitTapHighlightColor,
              icons: [...el.querySelectorAll('svg')].filter(svg => svg.checkVisibility()).map(svg => {
                const icon = svg.getBoundingClientRect();
                return { width: icon.width, dy: icon.y + icon.height / 2 - box.y - box.height / 2 };
              }) };
          });
          assert.equal(search.height, 48); assert.equal(search.font, '18px'); assert.equal(search.gap, '8px');
          assert.deepEqual(search.icons.map(icon => icon.width), [22]);
          assert(search.icons.every(icon => Math.abs(icon.dy) <= .5));
          assert.equal(search.background, 'rgb(241, 243, 245)', 'The main mobile entry field has a pale surface');
          assert.equal(search.color, 'rgb(98, 104, 115)', 'The prompt uses the shared placeholder color');
          assert.equal(search.border, '0px', 'Entry fields have no decorative border');
          assert(search.labelFits, 'The default make/model prompt fits on one line without truncation');
          assert.equal(search.tapHighlight, 'rgba(0, 0, 0, 0)', 'Taps do not paint a native blue overlay');
          const headerIcons = await page.locator('.dn-mobile-control svg').evaluateAll(icons => icons.map(icon => icon.getBoundingClientRect().width));
          assert.deepEqual(headerIcons, [22, 22], 'Header location and phone glyphs remain balanced within 44px targets');
          await fits(page.locator('.dn-mobile-control'));
          await page.locator('.dn-quick-search__trigger').click();
          assert.equal(await page.locator('#quick-search-input').evaluate(input => getComputedStyle(input).fontSize), '18px',
            'The search editor uses the same readable input size as its entry field');
          await page.locator('.dn-quick-search__close').click();
          assert.equal(await page.locator('.dn-quick-search__trigger').evaluate(el => getComputedStyle(el).outlineStyle), 'none', 'Closing by pointer does not leave a focus ring over the opener');
          await page.keyboard.press('Tab');
          await page.keyboard.press('Shift+Tab');
          assert(await page.locator('.dn-quick-search__trigger').evaluate(el => el.matches(':focus-visible') && parseFloat(getComputedStyle(el).outlineWidth) >= 2), 'Keyboard navigation retains a visible focus indicator');
          await alignedDiscovery(page, locale);
          await longCardCopy(page, locale, 'carousel');
          const cardTypography = await page.locator('.dn-inventory .dn-vehicle-card').first().evaluate(card => {
            const title = getComputedStyle(card.querySelector('.dn-vehicle-card__name'));
            const price = getComputedStyle(card.querySelector('.dn-vehicle-card__amount'));
            const fuel = card.querySelector('.dn-vehicle-card__fact--spec [aria-hidden="true"]');
            return { titleSize: title.fontSize, titleWeight: title.fontWeight,
              priceSize: price.fontSize, priceWeight: price.fontWeight,
              fuel: fuel.innerText, fits: fuel.scrollWidth <= fuel.clientWidth + 1 };
          });
          assert.deepEqual(cardTypography, { titleSize: '16px', titleWeight: '500', priceSize: '20px', priceWeight: '600',
            fuel: locale === 'bg' ? 'Бензин' : 'Petrol', fits: true }, 'Price has a clear hierarchy; Home retains three readable facts');
          const viewAll = page.locator('.dn-search__mobile-all:visible').first();
          await compactControl(viewAll, { icon: true });
          assert.equal((await viewAll.innerText()).trim(), locale === 'bg' ? 'Виж всички' : 'View all',
            'Home action has a concise localized label without a competing count');
          assert.match(await viewAll.getAttribute('href'), /\/cars$/, 'Home action still opens the inventory');
          await fits(page.locator('.dn-mobile-bottom-nav a, .dn-mobile-bottom-nav button, .dn-mobile-controls a'));
          const dock = page.locator('.dn-mobile-bottom-nav');
          const dockControls = dock.locator('a,button');
          assert.equal(await dockControls.count(), 5);
          dockNames = await dock.locator('.dn-mobile-bottom-nav__label').allTextContents();
          for (const control of await dockControls.all()) {
            const label = (await control.locator('.dn-mobile-bottom-nav__label').textContent()).trim();
            const role = await control.evaluate(el => el.tagName === 'A' ? 'link' : 'button');
            assert(label && await dock.getByRole(role, { name: label, exact: true }).count() === 1,
              'Every dock icon retains its complete accessible name');
          }
          const labelWidths = await dock.locator('.dn-mobile-bottom-nav__label').evaluateAll(labels => labels.map(label => label.getBoundingClientRect().width));
          assert(labelWidths.every(value => value > 1), 'Normal phone widths keep every dock label visible');
          assert.equal(await page.locator('.dn-mobile-bottom-nav [aria-current=page]').evaluate(el => getComputedStyle(el).backgroundColor), 'rgba(0, 0, 0, 0)', 'Active navigation stays light');
          const dockStyle = await dock.evaluate(el => {
            const box = el.getBoundingClientRect(), style = getComputedStyle(el);
            const inactive = el.querySelector('a:not(.active)');
            return { left: box.left, right: box.right, bottom: box.bottom, viewport: document.documentElement.clientWidth, height: innerHeight,
              background: style.backgroundColor, radius: style.borderRadius, shadow: style.boxShadow,
              targets: [...el.querySelectorAll('a,button')].map(control => control.getBoundingClientRect().toJSON()),
              inactive: getComputedStyle(inactive).color, ink: getComputedStyle(document.body).color };
          });
          assert(dockStyle.left > 0 && dockStyle.right < dockStyle.viewport && Math.abs(dockStyle.left - (dockStyle.viewport - dockStyle.right)) <= 1 && dockStyle.bottom < dockStyle.height,
            'The dock has balanced side insets and clears the bottom edge');
          assert(parseFloat(dockStyle.radius) > 0 && dockStyle.shadow !== 'none' && dockStyle.background === 'rgb(255, 255, 255)',
            'The dock is a rounded white surface with a subtle shadow');
          assert(dockStyle.targets.every(box => box.width >= 44 && box.height >= 44 && box.left >= dockStyle.left && box.right <= dockStyle.right && box.bottom <= dockStyle.bottom),
            'All five dock actions retain separate 44px touch targets inside the surface');
          assert.notEqual(dockStyle.inactive, dockStyle.ink, 'Inactive dock icons and labels stay quieter than body ink');
          assert.equal(await dock.locator('svg[data-icon-family="fluent-system-regular"][data-icon-state="regular"][viewBox="0 0 24 24"][fill="currentColor"]').count(), 5,
            'All five mobile dock glyphs use official Fluent Regular geometry');
          assert.equal(await dock.locator('a[aria-current="page"] [data-icon-active="true"]').count(), 1,
            'The active destination retains Regular geometry');
          const activeMark = await dock.locator('a[aria-current="page"] .dn-mobile-bottom-nav__icon').evaluate(el => {
            const mark = getComputedStyle(el, '::after');
            return { surface: getComputedStyle(el).backgroundColor, color: mark.backgroundColor, radius: mark.borderRadius,
              width: parseFloat(mark.width), height: parseFloat(mark.height) };
          });
          assert(activeMark.surface === 'rgba(0, 0, 0, 0)' && activeMark.color !== 'rgba(0, 0, 0, 0)' && activeMark.radius === '0px' && activeMark.width > activeMark.height,
            'Selection uses a visible flat mark beneath the icon without a surrounding pill');
          assert.equal(await dock.locator('a:not([aria-current="page"]) [data-icon-active="false"]').count(), 3,
            'Inactive destinations retain the same Regular geometry');
          assert.equal(await dock.locator('path[opacity]').count(), 0, 'Dock glyphs have no grey duotone layer');
          await alignedDock(page);
          for (const pill of await page.locator('.dn-search__mobile-shortcuts a').all()) await compactControl(pill);
          const trigger = page.locator('.dn-mobile-bottom-nav button');
          await trigger.click();
          await fits(page.locator('.dn-mobile-menu__contact a'));
          const localeControl = page.locator('.dn-mobile-menu [data-locale-selector]');
          await fits(localeControl);
          assert.equal(await localeControl.locator('svg[data-icon-family="fluent-system-regular"]').count(), 2,
            'Country and language has a globe and chevron in the same mobile icon family');
          assert(await localeControl.evaluate(el => el.getBoundingClientRect().height >= 44 && getComputedStyle(el).backgroundColor !== 'rgba(0, 0, 0, 0)'),
            'Country and language is a visible full-row control');
          await capture('menu');
          await page.keyboard.press('Escape');
          assert.equal(await trigger.evaluate(el => document.activeElement === el), true);
        }
        await visit('/cars');
        if (width < 768) {
          assert.deepEqual(await page.locator('.dn-mobile-bottom-nav__label').allTextContents(), dockNames,
            'Home and inventory retain the same dock destinations and order');
          await alignedDock(page);
          const titles = await page.locator('.dn-vehicle-card--listing .dn-vehicle-card__name').evaluateAll(elements => elements.map(el => ({
            text: el.innerText.trim(), title: el.title, whiteSpace: getComputedStyle(el).whiteSpace,
            lines: el.getBoundingClientRect().height / parseFloat(getComputedStyle(el).lineHeight),
            clipped: el.scrollWidth > el.clientWidth + 1 || el.scrollHeight > el.clientHeight + 1
          })));
          assert(titles.length > 0);
          assert(titles.every(t => t.text && t.title && t.whiteSpace === 'normal'), 'Mobile titles retain their complete vehicle label');
          assert(titles.every(t => t.lines <= 2.05), 'Mobile model titles never exceed two readable lines');
          // Visit each photo before checking it: offscreen inventory intentionally stays lazy.
          for (const card of await page.locator('.dn-vehicle-card--listing').all()) {
            await card.scrollIntoViewIfNeeded();
            const image = await card.locator('img').elementHandle();
            try {
              await page.waitForFunction(image => image.complete && image.naturalWidth > 0, image, { timeout: 30000 });
            } finally { await image.dispose(); }
          }
          await page.evaluate(() => window.scrollTo({ top: 0, behavior: 'instant' }));
          const photos = await page.locator('.dn-vehicle-card--listing').evaluateAll(cards => cards.map(card => {
            const photograph = card.querySelector('img');
            const image = photograph.getBoundingClientRect();
            const content = card.querySelector('.dn-vehicle-card__content').getBoundingClientRect();
            const box = card.getBoundingClientRect();
            const identity = card.querySelector('.dn-vehicle-card__identity').getBoundingClientRect();
            const make = card.querySelector('.dn-vehicle-card__make').innerText.trim();
            const model = photograph.alt.startsWith(`${make} `) ? photograph.alt.slice(make.length + 1) : photograph.alt;
            const price = card.querySelector('.dn-vehicle-card__amount').getBoundingClientRect();
            const metadata = card.querySelector('.dn-vehicle-card__mobile-meta').getBoundingClientRect();
            const headingStyle = getComputedStyle(card.querySelector('.dn-vehicle-card__name'));
            const priceStyle = getComputedStyle(card.querySelector('.dn-vehicle-card__amount'));
            const facts = [...card.querySelectorAll('.dn-vehicle-card__fact')].filter(fact => fact.checkVisibility());
            const expectedFacts = card.clientWidth <= 24 * parseFloat(getComputedStyle(document.documentElement).fontSize) ? 4 : 5;
            const badgeBoxes = facts.map(fact => fact.getBoundingClientRect());
            const badgeTextFits = facts.every(fact => {
              const text = fact.querySelector('span:not(.dn-sr-only)');
              const range = document.createRange(); range.selectNodeContents(text);
              const textBox = range.getBoundingClientRect(), badge = fact.getBoundingClientRect();
              return textBox.left >= badge.left && textBox.right <= badge.right && textBox.top >= badge.top && textBox.bottom <= badge.bottom;
            });
            const badgeSurface = getComputedStyle(facts[0]).backgroundColor;
            const badgesMatch = facts.every(fact => getComputedStyle(fact).backgroundColor === badgeSurface);
            return { title: photograph.alt, loaded: photograph.complete && photograph.naturalWidth > 0, fits:
              getComputedStyle(photograph).objectFit === 'cover' && image.width >= 112 && image.width <= 157 &&
              Math.abs(identity.top - image.top - 2) <= 1 && Math.abs(price.bottom - image.bottom + 2) <= 1 && image.bottom <= metadata.top &&
              image.left >= box.left && image.right <= content.left - 1 && image.bottom <= box.bottom &&
              make && card.querySelector('.dn-vehicle-card__name').innerText.trim() === model &&
              Math.abs(price.left - identity.left) <= 1 && price.top >= identity.bottom + 7.5 &&
              metadata.top >= content.bottom - 1 && Math.abs(metadata.left - image.left) <= 1 &&
              metadata.left >= box.left && metadata.right <= box.right && metadata.bottom <= box.bottom &&
              parseFloat(priceStyle.fontSize) > parseFloat(headingStyle.fontSize) &&
              parseFloat(priceStyle.fontWeight) > parseFloat(headingStyle.fontWeight) &&
              facts.length === expectedFacts && priceStyle.fontSize === '18px' && badgesMatch && badgeTextFits && badgeSurface !== 'rgba(0, 0, 0, 0)' &&
              badgeBoxes.every(badge => Math.abs(badge.height - badgeBoxes[0].height) <= 1) &&
              facts.every(fact => getComputedStyle(fact).borderRadius === '6px') &&
              Math.abs(badgeBoxes[0].left - metadata.left) <= 1 && badgeBoxes.at(-1).right <= metadata.right + 1 &&
              badgeBoxes.every(badge => Math.abs(badge.top - badgeBoxes[0].top) <= 1) &&
              priceStyle.backgroundColor === 'rgba(0, 0, 0, 0)' };
          }));
          assert(photos.every(photo => photo.loaded && photo.fits),
            `Compact photos sit beside details, with a full-width strip below both: ${JSON.stringify(photos.filter(photo => !photo.loaded || !photo.fits))}`);
          const mileage = page.locator('.dn-vehicle-card__mobile-meta li:nth-child(2) span').first();
          assert.equal(await page.locator('.dn-vehicle-card--listing .dn-vehicle-card__fact--transmission [aria-hidden="true"]').first().textContent(),
            locale === 'bg' ? 'Автомат' : 'Auto', 'Dense cards use a recognizable transmission label');
          assert.match(await mileage.innerText(), /\d.*(?:km|км)/,
            'Mobile mileage visibly retains formatting and its kilometer unit');
          assert.equal(await page.locator('.dn-vehicle-card__badge--mileage').first().textContent(), await mileage.innerText(),
            'Mileage retains its complete value');
          const alignment = await page.locator('.dn-vehicle-card--listing').evaluateAll(cards => cards.map(card => {
            const box = card.getBoundingClientRect();
            return { height: box.height, priceTop: card.querySelector('.dn-vehicle-card__amount').getBoundingClientRect().top - box.top,
              factsTop: card.querySelector('.dn-vehicle-card__mobile-meta').getBoundingClientRect().top - box.top };
          }));
          const titleLineHeight = await page.locator('.dn-vehicle-card--listing .dn-vehicle-card__name').first().evaluate(title => parseFloat(getComputedStyle(title).lineHeight));
          assert(Math.max(...alignment.map(item => item.height)) - Math.min(...alignment.map(item => item.height)) <= titleLineHeight + 1,
            'Compact inventory cards allow one extra title line without empty detail space');
          assert.equal(await page.locator('.dn-vehicle-card--listing img[fetchpriority="high"]').count(), 1,
            'Only the first inventory photograph gets high fetch priority');
          await longCardCopy(page, locale, 'listing');
          const quickPills = await page.locator('.dn-listing-filter__quick button').evaluateAll(pills => pills.map(pill => {
            const box = pill.getBoundingClientRect(), style = getComputedStyle(pill), paint = getComputedStyle(pill, '::before');
            return { hitHeight: box.height, paintedHeight: box.height - parseFloat(paint.top) - parseFloat(paint.bottom),
              font: style.fontSize, iconWidth: pill.querySelector('svg').getBoundingClientRect().width };
          }));
          assert(quickPills.every(pill => pill.hitHeight >= 44 && pill.paintedHeight === 40 && pill.font === '16px' && pill.iconWidth === 14),
            'Inventory quick filters match Home pills: 40px paint, 16px type and 44px targets');
          assert.equal(await page.locator('.dn-listing-filter__mobile-keyword').evaluate(el => getComputedStyle(el).fontSize), '16px',
            'Inventory search uses the same readable control size as the quick filters');
          assert.equal(await page.locator('.dn-listing-filter__mobile-keyword > svg').evaluate(el => el.getBoundingClientRect().width), 22,
            'Mobile inventory search has a legible 22px icon');
          const railSpacing = await page.evaluate(() => {
            const toolbar = document.querySelector('.dn-listing-filter__primary').getBoundingClientRect();
            const rail = document.querySelector('.dn-listing-filter__quick').getBoundingClientRect();
            const grid = document.querySelector('.dn-listing-results__grid').getBoundingClientRect();
            return { above: rail.top - toolbar.bottom, below: grid.top - rail.bottom };
          });
          assert(railSpacing.above >= 4 && railSpacing.above <= 8 && railSpacing.below >= 8 && railSpacing.below <= 12,
            `Quick filters stay close to search and cards: ${JSON.stringify(railSpacing)}`);
          await capture('inventory');
          const discoveryControls = await page.locator('.dn-listing-filter__mobile-sort,.dn-listing-filter__toggle').evaluateAll(controls => controls.map(control => {
            const box = control.getBoundingClientRect(), style = getComputedStyle(control);
            return { width: box.width, height: box.height, left: box.left, right: box.right, clip: style.backgroundClip,
              paintedHeight: box.height - parseFloat(style.paddingTop) - parseFloat(style.paddingBottom) };
          }));
          assert(discoveryControls.every(control => control.width === 44 && control.height === 44 && control.paintedHeight === 40 && control.clip === 'content-box'),
            'Sort and Filters share a 44px target and 40px painted circle');
          assert(discoveryControls[1].left > discoveryControls[0].right, 'Filters is the rightmost discovery control');
          await page.locator('.dn-listing-filter__toggle').click();
          const filter = page.locator('#dn-listing-filter-dialog');
          await filter.locator('input[name=q]').fill('no-match-mobile-polish');
          const submit = filter.locator('.dn-listing-filter__dialog-submit');
          assert.equal(await submit.isDisabled(), true);
          await fits(submit);
          await capture('empty-filter');
          await page.keyboard.press('Escape');
          assert.notEqual(await page.evaluate(() => getComputedStyle(document.body).position), 'fixed');
        } else await capture('inventory');
        for (const topic of ['import', 'trade-in']) {
          await visit(`/contact?topic=${topic}`);
          if (width < 768) {
            assert.deepEqual(await page.locator('.dn-mobile-bottom-nav__label').allTextContents(), dockNames,
              'Sell and Import retain the same dock destinations and order');
            await alignedDock(page);
          }
          const action = page.locator('.dn-service-entry__submit:visible');
          await fits(action);
          await fits(page.locator('.dn-service-entry:visible .dn-service-entry__choices button'));
          assert.equal(await page.locator('.dn-service-process li').count(), 3);
          if (width < 768) {
            assert.equal(await page.locator('.dn-service-faq').isVisible(), false);
            const field = page.locator('.dn-service-entry__field:visible');
            assert.deepEqual(await field.evaluate(el => ({ height: el.getBoundingClientRect().height,
              font: getComputedStyle(el).fontSize, fits: el.querySelector('span').scrollWidth <= el.querySelector('span').clientWidth + 1 })),
              { height: 48, font: '18px', fits: true }, 'Sell and Import share the prominent field within the compact entry hierarchy');
            await field.click();
            const editor = page.locator('.dn-service-editor[open]');
            const editorFields = await editor.locator('input').evaluateAll(inputs => inputs.map(input => ({
              height: input.getBoundingClientRect().height, font: getComputedStyle(input).fontSize
            })));
            assert(editorFields.every(input => input.height === 44 && input.font === '18px'));
            await page.keyboard.press('Escape');
            const guide = page.locator('.dn-service-guide button[aria-haspopup=dialog]');
            await guide.scrollIntoViewIfNeeded();
            await fits(guide);
            assert.equal(await guide.evaluate(button => getComputedStyle(button).backgroundColor), 'rgb(255, 255, 255)',
              'Process guidance uses a compact white card below the form');
            assert.equal(await guide.locator('[data-icon-family="fluent-system-regular"]').count(), 1);
            assert(await guide.locator('.dn-service-process-preview__copy').innerText());
            const entryBeforeGuide = await field.innerText();
            await guide.click();
            const info = page.locator(topic === 'trade-in' ? '#tradein-info-dialog' : '#import-info-dialog');
            assert(await info.isVisible());
            assert.equal(await info.locator('li').count(), 6, 'The guide explains preparation and three service steps');
            assert(await info.locator('h2').evaluate(heading => heading === document.activeElement));
            assert.equal(await page.locator('.dn-mobile-bottom-nav').isVisible(), false);
            await page.keyboard.press('Tab');
            await page.keyboard.press('Shift+Tab');
            assert(await info.evaluate(dialog => dialog.contains(document.activeElement)), 'Focus remains in the guide');
            await page.keyboard.press('Escape');
            assert.equal(await info.isVisible(), false);
            assert(await guide.evaluate(button => button === document.activeElement), 'Escape returns focus to the guide card');
            assert(await page.locator('.dn-mobile-bottom-nav').isVisible());
            await guide.click();
            await info.locator('footer button').click();
            assert.equal(await info.isVisible(), false);
            assert.equal(await field.innerText(), entryBeforeGuide, 'Reading guidance preserves the enquiry draft');
            await guide.click();
            await info.locator('header button').click();
            assert.equal(await info.isVisible(), false);
          } else {
            assert.equal(await page.locator('.dn-service-guide').isVisible(), false);
            await fits(page.locator('.dn-service-faq summary'));
            await page.locator('.dn-service-faq summary').first().click();
            assert.equal(await page.locator('.dn-service-faq details[open]').count(), 1);
          }
          await capture(topic);
          if (width < 768) {
            await page.setViewportSize({ width, height: 420 });
            await action.scrollIntoViewIfNeeded();
            const rect = await action.boundingBox();
            assert(rect.y >= 0 && rect.y + rect.height <= 420 - 64, 'Continue remains reachable above mobile navigation in a short viewport');
            await page.setViewportSize({ width, height: 844 });
          }
        }
        await visit('/listing-detail-v1/4');
        await fits(page.locator('.dn-detail-tabs button'));
        if (width < 768) {
          await fits(page.locator('.dn-mobile-detail-bar a'));
          await capture('detail');
          await page.locator('.dn-mobile-detail-bar__secondary').click();
          await page.waitForURL(url => url.pathname.endsWith('/contact'));
          assert.equal(new URL(page.url()).searchParams.get('vehicle'), '4');
          await fits(page.locator('.dn-contact-button--call'));
          const number = page.locator('.dn-contact-call-number');
          assert.equal(await number.evaluate(el => getComputedStyle(el).whiteSpace), 'nowrap');
          await capture('inspection');
        } else await capture('detail');
        if (width < 768) {
          await visit('/blog');
          await page.locator('.dn-blog-search-trigger').click();
          const articleQuery = page.locator('#dn-blog-search-query');
          const articleStyles = await articleQuery.evaluate(input => ({
            size: getComputedStyle(input).fontSize, border: getComputedStyle(input).borderWidth,
            height: input.getBoundingClientRect().height, frame: getComputedStyle(input.closest('.dn-mobile-overlay-search')).padding
          }));
          assert.deepEqual(articleStyles, { size: '18px', border: '0px', height: 44, frame: '0px 4px 0px 16px' },
            'Article search uses the shared mobile overlay field');
          assert.equal(await page.locator('.dn-blog-card h2').first().evaluate(title => getComputedStyle(title).fontWeight), '600');
          await capture('articles');
          await articleQuery.fill(locale === 'bg' ? 'внос' : 'import');
          await articleQuery.press('Enter');
          await page.waitForURL(url => url.searchParams.has('q'));
          assert(await page.locator('.dn-blog-card').count() > 0, 'Article search returns matching cards');
        }
        await visit('/locale-settings');
        assert((await page.title()).endsWith(' — Auto Best'));
        assert.deepEqual(errors, []);
        return { locale, width, passed: true };
      } finally { await page.close(); }
    });
  }
} finally { await browser.close(); await suite.finish(); }
