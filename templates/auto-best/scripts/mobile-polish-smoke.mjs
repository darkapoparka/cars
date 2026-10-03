import assert from 'node:assert/strict';
import { mkdir } from 'node:fs/promises';
import { launchBrowser, previewUrl } from './browser.mjs';
import { smokeReport } from './smoke-report.mjs';

const base = previewUrl();
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
    for (const svg of el.querySelectorAll('svg')) if (svg.checkVisibility() && svg.getBoundingClientRect().width < minimumIcon) problems.push('collapsed icon');
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
  assert.equal(await page.locator('#brands-grid a.dn-discovery-toggle').getAttribute('href'), `/${locale}/listing-grid`);
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
      const badges = [...card.querySelectorAll(layout === 'listing' ? '.dn-vehicle-card__fact' : '.dn-vehicle-card__spec')].slice(layout === 'listing' ? 2 : 0);
      for (const [index, badge] of badges.entries()) {
        badge.title = labels[index].full;
        badge.querySelector(layout === 'listing' ? '[aria-hidden="true"]' : '.dn-vehicle-card__spec-compact').textContent = labels[index].compact;
        badge.querySelector('.dn-sr-only').textContent = labels[index].full;
      }
      source.parentElement.append(card);
    }, { title, fuel, locale, layout });
    const fixture = page.locator('#vehicle-copy-fixture');
    try {
      await fixture.scrollIntoViewIfNeeded();
      await page.evaluate(() => new Promise(resolve => requestAnimationFrame(() => requestAnimationFrame(resolve))));
      const geometry = await fixture.evaluate(card => {
        const heading = card.querySelector('.dn-vehicle-card__name');
        const headingStyle = getComputedStyle(heading);
        const listing = card.classList.contains('dn-vehicle-card--listing');
        const badges = [...card.querySelectorAll(listing ? '.dn-vehicle-card__fact' : '.dn-vehicle-card__spec')];
        return {
          lines: heading.getBoundingClientRect().height / parseFloat(headingStyle.lineHeight),
          title: heading.title, accessible: card.querySelector('a').getAttribute('aria-label'),
          badges: badges.map(badge => {
            const text = listing ? badge.querySelector('[aria-hidden="true"]') ?? badge
              : [...badge.querySelectorAll('.dn-vehicle-card__spec-full, .dn-vehicle-card__spec-compact')].find(label => label.checkVisibility());
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
      assert(geometry.badges.every(badge => badge.whiteSpace === 'nowrap' && badge.height <= badge.lineHeight + badge.padding + 1 && badge.fits), `Every badge keeps a single line inside its surface: ${JSON.stringify(geometry)}`);
      assert(geometry.badges.every(badge => !badge.clipped), 'Known compact fuel and transmission labels remain fully visible');
      if (layout !== 'listing') assert(Math.abs(geometry.badges[0].top - geometry.badges[1].top) <= 1, 'Carousel specification badges share one row');
      assert(geometry.badges.some(badge => badge.full === fuel.full), 'Full fuel values remain available alongside compact copy');
      await fixture.screenshot({ path: `${output}/${locale}-${page.viewportSize().width}-${layout}-${fuel.name}-copy.png` });
    } finally {
      await fixture.evaluate(card => card.remove());
    }
  }
  await page.evaluate(() => window.scrollTo({ top: 0, behavior: 'instant' }));
}
try {
  for (const locale of ['bg', 'en']) for (const width of [320, 390, 430, 1440]) {
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
            return art.top >= copy.bottom + 4 && art.bottom <= box.bottom && art.left >= box.left && art.right <= box.right;
          }));
          assert(homeArt.every(Boolean), 'Service artwork stays inside its card and clear of the text');
          const actionImages = await page.locator('.dn-mobile-core-card img').evaluateAll(images => images.map(image => image.getAttribute('src')));
          assert.equal(new Set(actionImages).size, 4, 'Each service has distinct imagery');
          assert.match(actionImages[1], /service-sell-front-v3/);
          assert.match(actionImages[2], /service-import-front-v3/);
          assert.match(actionImages[3], /home-action-finance-v3/);
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
          assert.equal(search.height, 44); assert.equal(search.font, '18px'); assert.equal(search.gap, '8px');
          assert.deepEqual(search.icons.map(icon => icon.width), [22]);
          assert(search.icons.every(icon => Math.abs(icon.dy) <= .5));
          assert.equal(search.background, 'rgb(241, 243, 245)', 'The main mobile entry field has a pale surface');
          assert.equal(search.color, 'rgb(98, 104, 115)', 'The prompt uses the shared placeholder color');
          assert.equal(search.border, '0px', 'Entry fields have no decorative border');
          assert(search.labelFits, 'The default make/model prompt fits on one line without truncation');
          assert.equal(search.tapHighlight, 'rgba(0, 0, 0, 0)', 'Taps do not paint a native blue overlay');
          const headerIcons = await page.locator('.dn-mobile-control svg').evaluateAll(icons => icons.map(icon => icon.getBoundingClientRect().width));
          assert.deepEqual(headerIcons, [26, 26], 'Header location and phone glyphs remain legible within 44px targets');
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
            const transmission = card.querySelector('.dn-vehicle-card__spec--transmission .dn-vehicle-card__spec-full');
            return { titleSize: title.fontSize, titleWeight: title.fontWeight,
              priceSize: price.fontSize, priceWeight: price.fontWeight,
              transmission: transmission.innerText, fits: transmission.scrollWidth <= transmission.clientWidth + 1 };
          });
          assert.deepEqual(cardTypography, { titleSize: '16px', titleWeight: '500', priceSize: '20px', priceWeight: '600',
            transmission: locale === 'bg' ? 'Автоматик' : 'Automatic', fits: true }, 'Model and price have distinct roles; full transmission fits');
          const viewAll = page.locator('.dn-search__mobile-all:visible').first();
          await compactControl(viewAll, { icon: true });
          assert.match(await viewAll.innerText(), /\([1-9]\d*\)/, 'Home action exposes the inventory count');
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
            return { left: box.left, right: box.right, viewport: document.documentElement.clientWidth,
              background: style.backgroundColor, radius: style.borderRadius, shadow: style.boxShadow,
              inactive: getComputedStyle(inactive).color, ink: getComputedStyle(document.body).color };
          });
          assert(dockStyle.left <= 1 && Math.abs(dockStyle.right - dockStyle.viewport) <= 1 && dockStyle.radius === '0px' && dockStyle.shadow === 'none' && dockStyle.background === 'rgb(255, 255, 255)',
            'The dock is a flat white bar spanning the mobile viewport');
          assert.equal(dockStyle.inactive, dockStyle.ink, 'Inactive dock icons and labels use the strong ink color');
          assert.equal(await dock.locator('svg[data-icon-family="hugeicons-rounded"][viewBox="0 0 24 24"][fill="none"]').count(), 5,
            'All five mobile dock glyphs use official Hugeicons Stroke Rounded geometry');
          assert.equal(await dock.locator('path[opacity]').count(), 0, 'Dock glyphs have no grey duotone layer');
          await alignedDock(page);
          for (const pill of await page.locator('.dn-search__mobile-shortcuts a').all()) await compactControl(pill);
          const trigger = page.locator('.dn-mobile-bottom-nav button');
          await trigger.click();
          await fits(page.locator('.dn-mobile-menu__contact a'));
          const localeControl = page.locator('.dn-mobile-menu [data-locale-selector]');
          await fits(localeControl);
          assert.equal(await localeControl.locator('svg[data-icon-family="hugeicons-rounded"]').count(), 2,
            'Country and language has a globe and chevron in the same mobile icon family');
          assert(await localeControl.evaluate(el => el.getBoundingClientRect().height >= 44 && getComputedStyle(el).backgroundColor !== 'rgba(0, 0, 0, 0)'),
            'Country and language is a visible full-row control');
          await capture('menu');
          await page.keyboard.press('Escape');
          assert.equal(await trigger.evaluate(el => document.activeElement === el), true);
        }
        await visit('/listing-grid');
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
            const facts = [...card.querySelectorAll('.dn-vehicle-card__fact')];
            const badgeBoxes = facts.map(fact => fact.getBoundingClientRect());
            const badgeTextFits = facts.every(fact => {
              const text = fact.querySelector('[aria-hidden="true"]') ?? fact;
              const range = document.createRange(); range.selectNodeContents(text);
              const textBox = range.getBoundingClientRect(), badge = fact.getBoundingClientRect();
              return textBox.left >= badge.left && textBox.right <= badge.right && textBox.top >= badge.top && textBox.bottom <= badge.bottom;
            });
            const badgeSurface = getComputedStyle(facts[0]).backgroundColor;
            const badgesMatch = facts.every(fact => getComputedStyle(fact).backgroundColor === badgeSurface);
            return { title: photograph.alt, loaded: photograph.complete && photograph.naturalWidth > 0, fits:
              getComputedStyle(photograph).objectFit === 'cover' && image.width >= (box.width - 28) * .49 &&
              Math.abs(image.top - identity.top) <= 1 && Math.abs(image.bottom - metadata.bottom) <= 1 &&
              image.left >= box.left && image.right <= content.left - 1 && image.bottom <= box.bottom &&
              make && card.querySelector('.dn-vehicle-card__name').innerText.trim() === model &&
              Math.abs(price.left - identity.left) <= 1 && price.top >= identity.bottom - 1 && price.top <= identity.bottom + 6 &&
              metadata.top >= content.bottom && metadata.left > image.right &&
              metadata.left >= box.left && metadata.right <= box.right && metadata.bottom <= box.bottom &&
              parseFloat(priceStyle.fontSize) > parseFloat(headingStyle.fontSize) &&
              parseFloat(priceStyle.fontWeight) > parseFloat(headingStyle.fontWeight) &&
              facts.length === 4 && badgesMatch && badgeTextFits && badgeSurface !== 'rgba(0, 0, 0, 0)' &&
              badgeBoxes.every(badge => Math.abs(badge.width - badgeBoxes[0].width) <= 1 && Math.abs(badge.height - badgeBoxes[0].height) <= 1) &&
              facts.every(fact => getComputedStyle(fact).borderRadius === '6px') &&
              Math.abs(badgeBoxes[0].left - metadata.left) <= 1 && Math.abs(badgeBoxes[3].right - metadata.right) <= 1 &&
              Math.abs(badgeBoxes[0].top - badgeBoxes[1].top) <= 1 &&
              Math.abs(badgeBoxes[2].top - badgeBoxes[3].top) <= 1 && badgeBoxes[2].top >= badgeBoxes[0].bottom + 3 &&
              priceStyle.backgroundColor === 'rgba(0, 0, 0, 0)' };
          }));
          assert(photos.every(photo => photo.loaded && photo.fits),
            `Photos match the full height of the details and two rows of badges: ${JSON.stringify(photos.filter(photo => !photo.loaded || !photo.fits))}`);
          const mileageBadge = page.locator('.dn-vehicle-card__mobile-meta li:nth-child(2)').first();
          assert.equal(await page.locator('.dn-vehicle-card__mobile-meta li:last-child [aria-hidden="true"]').first().innerText(),
            locale === 'bg' ? 'Автомат' : 'Auto', 'Dense cards use a recognizable transmission label');
          assert.match(await mileageBadge.locator('[aria-hidden="true"]').innerText(), /^\d+$/,
            'Mobile mileage keeps all digits without an extra unit or grouping');
          assert.match(await mileageBadge.locator('.dn-sr-only').innerText(), /km|км/,
            'Accessible mileage retains its full kilometer unit');
          const alignment = await page.locator('.dn-vehicle-card--listing').evaluateAll(cards => cards.map(card => {
            const box = card.getBoundingClientRect();
            return { height: box.height, priceTop: card.querySelector('.dn-vehicle-card__amount').getBoundingClientRect().top - box.top,
              factsTop: card.querySelector('.dn-vehicle-card__mobile-meta').getBoundingClientRect().top - box.top };
          }));
          for (const key of ['height']) assert(Math.max(...alignment.map(item => item[key])) - Math.min(...alignment.map(item => item[key])) <= 1,
            `All inventory cards share their ${key}, including the longest AMG titles`);
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
              { height: 44, font: '18px', fits: true }, 'Sell and Import share the compact, readable entry proportions');
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
            assert.equal(await guide.locator('[data-icon-family="hugeicons-rounded"]').count(), 1);
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
          const articleStyles = await page.locator('.dn-blog-search input').evaluate(input => ({
            size: getComputedStyle(input).fontSize, border: getComputedStyle(input).borderWidth,
            height: input.getBoundingClientRect().height, frame: getComputedStyle(input.closest('form')).padding
          }));
          assert.deepEqual(articleStyles, { size: '18px', border: '0px', height: 44, frame: '0px' },
            'Article search shares the mobile input system without a second frame');
          assert.equal(await page.locator('.dn-blog-card h2').first().evaluate(title => getComputedStyle(title).fontWeight), '500');
          await capture('articles');
          await page.locator('#dn-blog-search').fill(locale === 'bg' ? 'внос' : 'import');
          await page.locator('#dn-blog-search').press('Enter');
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
