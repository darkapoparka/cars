import assert from 'node:assert/strict';
import { mkdir, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { setTimeout as delay } from 'node:timers/promises';
import { chromium, webkit } from 'playwright';

await import('./prepare-domain-tests.mjs');
const { storageKeys, showroomTitle } = await import('../.qa/domain/showroom-config.mjs');
const { translate } = await import('../.qa/domain/locale.mjs');

const base = process.env.QA_URL || 'http://127.0.0.1:6474';
const output = path.resolve(process.env.QA_OUTPUT || '.qa/architecture');
const scope = process.env.QA_SCOPE || 'all';
assert.ok(['all', 'state'].includes(scope), 'QA_SCOPE must be all or state');
const engines = Object.entries({ chromium, webkit }).filter(
  ([name]) => !process.env.QA_ENGINE || process.env.QA_ENGINE === name,
);
assert.ok(engines.length, 'QA_ENGINE must be chromium or webkit');
const report = { at: new Date().toISOString(), base, scope, checks: [], errors: [] };
await mkdir(output, { recursive: true });

async function run(name, engine) {
  const browser = await engine.launch({ headless: true });
  const posts = [];
  const network = new WeakMap();
  const check = (description) => report.checks.push({ engine: name, description });
  async function focusAt(page, selector, edge = 'first') {
    // Radix restores and moves focus after its mount/unmount effects finish.
    await page.waitForFunction(
      ({ selector, edge }) => {
        const targets = [...document.querySelectorAll(selector)];
        const target = edge === 'last' ? targets.at(-1) : targets[0];
        return Boolean(target) && target === document.activeElement;
      },
      { selector, edge },
    );
  }
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
      const activity = { pending: new Set(), lastActivity: Date.now() };
      network.set(page, activity);
      const finished = (request) => {
        activity.pending.delete(request);
        activity.lastActivity = Date.now();
      };
      page.on('requestfinished', finished);
      page.on('requestfailed', finished);
      page.on('pageerror', (error) =>
        report.errors.push({ engine: name, url: page.url(), message: error.message }),
      );
      page.on('request', (request) => {
        activity.pending.add(request);
        activity.lastActivity = Date.now();
        // Ignore a third-party map frame's telemetry, not application submissions.
        if (request.method() === 'POST' && request.frame() === page.mainFrame())
          posts.push(request.url());
      });
    });
    return context;
  }
  async function quietNetwork(page) {
    // WebKit pauses animation frames in background tabs. Activate each page
    // before waiting for the layout frames that schedule its prefetches.
    await page.bringToFront();
    // networkidle may already be satisfied before React/Next schedules new links.
    // Require a fresh quiet period after their layout and prefetch callbacks.
    await page.evaluate(
      () => new Promise((resolve) => requestAnimationFrame(() => requestAnimationFrame(resolve))),
    );
    const activity = network.get(page);
    const started = Date.now();
    while (activity.pending.size || Date.now() - Math.max(started, activity.lastActivity) < 600) {
      assert.ok(
        Date.now() - started < 45000,
        'Network did not settle before navigation: ' +
          [...activity.pending].map((request) => request.url()).join(', '),
      );
      await delay(50);
    }
  }
  async function closeContext(context) {
    // Finish background route prefetches before deliberately destroying their pages.
    for (const page of context.pages()) await quietNetwork(page);
    await context.close();
  }
  async function go(page, route, locale = 'en') {
    if (page.url().startsWith(base)) await quietNetwork(page);
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
      { polling: 100 },
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
  async function serviceSegment(page, label, locale) {
    const { height, borders, bounds } = await page.getByRole('tablist').evaluate((rail) => {
      const outer = rail.getBoundingClientRect();
      const css = getComputedStyle(rail);
      const bounds = [...rail.querySelectorAll('[role="tab"]')].map((tab) => {
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
      return {
        height: outer.height,
        borders: [
          css.borderTopColor,
          css.borderRightColor,
          css.borderBottomColor,
          css.borderLeftColor,
        ],
        bounds,
      };
    });
    const search = await page
      .getByRole('button', { name: translate('Search services', locale), exact: true })
      .boundingBox();
    assert.ok(
      search && height <= search.height * 0.8,
      label + ' service segment must remain visibly smaller than search',
    );
    assert.equal(
      new Set(borders).size,
      1,
      label + ' glass rail must have matching borders without an opaque bottom line',
    );
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
    check(label + ': smaller service segments stay equal and centered with matching glass edges');
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
  async function desktopFrame(page, label, inventory = false, saved = false) {
    // A stable scrollbar gutter can reserve space even when Chromium reports
    // the full viewport as clientWidth. Measure the actual containing block.
    await page.evaluate(
      () => new Promise((resolve) => requestAnimationFrame(() => requestAnimationFrame(resolve))),
    );
    const frame = await page.locator('[data-hydrated]').evaluate((shell) => {
      const { x, width } = shell.getBoundingClientRect();
      const parent = shell.parentElement;
      const css = getComputedStyle(parent);
      const start = parseFloat(css.paddingLeft);
      const end = parseFloat(css.paddingRight);
      return {
        x,
        width,
        available: parent.clientWidth - start - end,
        origin: parent.getBoundingClientRect().x + start,
        viewport: document.documentElement.clientWidth,
      };
    });
    assert.ok(
      Math.abs(frame.width - Math.min(1280, frame.available - 48)) <= 1,
      label +
        ' must use the shared desktop frame with safe outer gutters: ' +
        JSON.stringify(frame),
    );
    assert.ok(
      Math.abs(frame.x - (frame.origin + (frame.available - frame.width) / 2)) <= 1,
      label + ' frame must remain centered',
    );
    if (inventory) {
      const cards = await page.locator('[data-showroom-vehicle]').evaluateAll((cards) =>
        cards.slice(0, 4).map((card) => {
          const { x, y, width } = card.getBoundingClientRect();
          return {
            x,
            y,
            width,
            title: getComputedStyle(card.querySelector('h2')).fontSize,
            price: getComputedStyle(card.querySelector('strong')).fontSize,
            facts: [...card.querySelectorAll('[data-vehicle-fact]')].map(
              (fact) => getComputedStyle(fact).fontSize,
            ),
          };
        }),
      );
      const columns = !saved && page.viewportSize().width >= 1280 ? 4 : 3;
      assert.ok(cards.length >= columns, label + ' needs enough cards to verify the grid');
      assert.equal(
        cards.filter((card) => Math.abs(card.y - cards[0].y) < 1).length,
        columns,
        label + ' must retain its responsive readable columns',
      );
      assert.ok(
        cards.every(
          (card) =>
            card.width >= (columns === 4 ? 270 : 290) &&
            card.title === '18px' &&
            card.price === '22px' &&
            card.facts.every((size) => size === '14px'),
        ),
        label + ' cards must retain readable desktop type and width',
      );
    }
    check(
      label +
        ': centered desktop frame' +
        (inventory ? ', responsive columns and readable type' : ''),
    );
  }
  async function fixedFrameActions(page, label) {
    const summary = page.locator('[data-vehicle-desktop-summary]');
    if (await summary.isVisible()) {
      assert.equal(
        await page.locator('[data-vehicle-contact-dock]').isVisible(),
        false,
        label + ' desktop summary must replace, not duplicate, the mobile dock',
      );
      const enquiry = summary.locator('a[href^="/contact?vehicle="]');
      assert.equal(
        await enquiry.isVisible(),
        true,
        label + ' desktop enquiry must remain available',
      );
      const href = await enquiry.getAttribute('href');
      assert.equal(
        new URL(href, base).searchParams.get('vehicle'),
        new URL(page.url()).pathname.split('/')[2],
        label + ' enquiry retains the current car',
      );
      assert.equal(
        await summary.evaluate((element) => {
          const box = element.getBoundingClientRect();
          const frame = document.querySelector('[data-hydrated]').getBoundingClientRect();
          return box.left >= frame.left - 1 && box.right <= frame.right + 1;
        }),
        true,
        label + ' desktop summary must stay inside the showroom frame',
      );
      check(label + ': desktop sidebar replaces the mobile dock and retains the vehicle enquiry');
    } else {
      await page
        .locator('[data-vehicle-contact-dock]:visible, [data-message-actions]:visible')
        .waitFor();
    }
    const failures = await page.locator('button, a').evaluateAll((actions) => {
      const shell = document.querySelector('[data-hydrated]').getBoundingClientRect();
      const docks = new Set(
        actions
          .map((action) => action.parentElement)
          .filter(
            (parent) =>
              parent.getClientRects().length > 0 &&
              getComputedStyle(parent).position === 'fixed' &&
              getComputedStyle(parent).bottom === '0px',
          ),
      );
      return [...docks]
        .filter((dock) => {
          const bounds = dock.getBoundingClientRect();
          return Math.abs(bounds.x - shell.x) > 1 || Math.abs(bounds.width - shell.width) > 1;
        })
        .map((dock) => ({ text: dock.textContent, width: dock.getBoundingClientRect().width }));
    });
    assert.deepEqual(failures, [], label + ' fixed actions must align with the shared frame');
    check(label + ': fixed actions align with desktop frame');
  }
  async function openContact(page) {
    await page.locator('[data-hydrated="true"]').waitFor();
    await quietNetwork(page);
    await page.evaluate(
      () => new Promise((resolve) => requestAnimationFrame(() => requestAnimationFrame(resolve))),
    );
    const message = page.getByRole('textbox', { name: 'Enquiry message', exact: true });
    if (!(await message.isVisible()))
      await page.getByRole('button', { name: 'Write a message', exact: true }).click();
    await message.waitFor();
    return message;
  }
  try {
    const widths = scope === 'state' ? [] : [320, 390, 768, 1024, 1280, 1366, 1440, 1920];
    for (const width of widths) {
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
        if (width >= 1024) await desktopFrame(page, 'Cars ' + width + ' ' + locale, true);
        const profile = page.getByRole('button', { name: t('Open profile menu'), exact: true });
        const profileBounds = await profile.boundingBox();
        assert.ok(
          profileBounds.width >= 48 && profileBounds.height >= 48,
          'Profile has a usable touch target',
        );
        await profile.click();
        const profileMenu = page.locator('[data-profile-menu]');
        await profileMenu.waitFor();
        const profileLinks = profileMenu.getByRole('menuitem');
        assert.deepEqual(
          await profileLinks.evaluateAll((links) =>
            links.map((link) => new URL(link.href).pathname),
          ),
          ['/car-park', '/settings'],
        );
        assert.equal(await profileMenu.getByRole('menuitemradio').count(), 2);
        await page.keyboard.press('Escape');
        await profileMenu.waitFor({ state: 'hidden' });
        await focusAt(page, '[data-profile-menu-trigger]');
        check(
          'Profile destinations, language choices, Escape and focus return: ' +
            width +
            ' ' +
            locale,
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
        check('Home profile touch target and unboxed category artwork: ' + width + ' ' + locale);
        if (width >= 1024) {
          const menu = page.getByRole('button', { name: t('Open profile menu'), exact: true });
          await menu.click();
          const navigation = page.locator('[data-profile-menu]');
          await navigation.waitFor();
          const menuLinks = navigation.getByRole('menuitem');
          assert.deepEqual(
            await menuLinks.evaluateAll((links) =>
              links.map((link) => new URL(link.href).pathname),
            ),
            ['/car-park', '/settings'],
          );
          // Safari does not focus every button after a pointer click. Escape
          // must also dismiss a pointer-opened menu while focus is elsewhere.
          await page.evaluate(
            () =>
              new Promise((resolve) => requestAnimationFrame(() => requestAnimationFrame(resolve))),
          );
          await page.keyboard.press('Escape');
          await navigation.waitFor({ state: 'hidden' });
          await focusAt(page, '[data-profile-menu-trigger]');
          check('Desktop menu destinations, Escape and focus return: ' + locale);
          await menu.press('ArrowDown');
          await menuLinks.first().waitFor();
          await page.waitForFunction(() =>
            Boolean(document.activeElement?.closest('[data-profile-menu]')),
          );
          await page.keyboard.press('End');
          await focusAt(page, '[data-profile-menu] [role="menuitem"]', 'last');
          await page.keyboard.press('Home');
          await focusAt(page, '[data-profile-menu] [role="menuitem"]');
          await page.keyboard.press('ArrowUp');
          await focusAt(page, '[data-profile-menu] [role="menuitem"]', 'last');
          await page.keyboard.press('Escape');
          await navigation.waitFor({ state: 'hidden' });
          await focusAt(page, '[data-profile-menu-trigger]');
          check('Desktop menu keyboard navigation wraps and restores focus: ' + locale);
          const opener = page.getByRole('button', { name: new RegExp('^' + t('All filters')) });
          await opener.click();
          await page.locator('dialog[open]').waitFor();
          const dialog = page.locator('dialog[open]');
          const search = dialog.getByRole('searchbox');
          const searchBounds = await search.boundingBox();
          const makeBounds = await dialog
            .locator('[data-desktop-picker-open="make"]')
            .boundingBox();
          assert.ok(
            searchBounds && makeBounds && searchBounds.y + searchBounds.height <= makeBounds.y,
            'Keyword search must span the body above the vehicle controls',
          );
          assert.equal(
            await dialog.locator('section[aria-label]').first().getAttribute('aria-label'),
            t('Search'),
          );
          const conditionBounds = await dialog
            .locator('section[aria-label="' + t('Condition') + '"]')
            .boundingBox();
          const contentBounds = await dialog
            .locator('[data-desktop-filter-section="all"]')
            .boundingBox();
          assert.ok(
            conditionBounds &&
              contentBounds &&
              conditionBounds.y + conditionBounds.height <= contentBounds.y + contentBounds.height,
            'The normal All filters view must keep Condition visible without extra scrolling',
          );
          await search.fill('bmw');
          await page.keyboard.press('Escape');
          await page.locator('dialog[open]').waitFor({ state: 'hidden' });
          assert.equal(await opener.evaluate((el) => el === document.activeElement), true);
          check('Desktop filters open, dismiss and restore focus: ' + locale);
          assert.equal(
            new URL(page.url()).searchParams.has('query'),
            false,
            'Closing must discard keyword draft',
          );
          await opener.click();
          await dialog.waitFor();
          assert.equal(await search.inputValue(), '', 'Cancelled keyword draft must not reopen');
          await search.fill('bmw');
          await search.press('Enter');
          await dialog.waitFor({ state: 'hidden' });
          await page.waitForFunction(
            () => new URL(location.href).searchParams.get('query') === 'bmw',
          );
          // The URL changes before React necessarily commits the filtered cards.
          // Verify the results before the next deliberate document navigation.
          await page.waitForFunction(() => {
            const cards = [...document.querySelectorAll('[data-showroom-vehicle]')];
            return (
              cards.length > 0 &&
              cards.every((card) => card.querySelector('h2')?.textContent?.startsWith('BMW'))
            );
          });
          await go(page, '/', locale);
          check(
            'Desktop keyword search appears first, cancels drafts and applies with Enter: ' +
              width +
              ' ' +
              locale,
          );
          for (const card of await page.locator('[data-showroom-vehicle]').all()) {
            await card.locator('button').click();
            if (
              (await page
                .locator('[data-showroom-vehicle] button[aria-pressed="true"]')
                .count()) === 4
            )
              break;
          }
          await go(page, '/car-park', locale);
          await cars(page, 4);
          await desktopFrame(page, 'Saved cars ' + width + ' ' + locale, true, true);
          await visibleVehicleFacts(page, 'Saved cars ' + width + ' ' + locale);
        }
        for (const [label, route] of [
          ['Services', '/services'],
          ['Contact', '/contact'],
          ['Vehicle', detail],
        ]) {
          await go(page, route, locale);
          await geometry(page, label + ' ' + width + ' ' + locale);
          if (width >= 1024) await desktopFrame(page, label + ' ' + width + ' ' + locale);
          if (label === 'Services') {
            const segmentWidth =
              width >= 1024 ? await serviceSegment(page, 'Services ' + locale, locale) : null;
            for (const tab of ['Import', 'Sell', 'All']) {
              await page.getByRole('tab', { name: t(tab), exact: true }).click();
              await geometry(page, 'Services ' + tab + ' ' + width + ' ' + locale);
              if (width >= 1024) {
                const selectedWidth = await serviceSegment(
                  page,
                  'Services ' + tab + ' ' + locale,
                  locale,
                );
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
            if (width >= 1024 && section === 'Features')
              await fixedFrameActions(page, 'Vehicle ' + width + ' ' + locale);
          }
          assert.equal(await page.evaluate(() => history.length), historyLength);
          check('Vehicle sections preserve Back history: ' + width + ' ' + locale);
        }
        if (width >= 1024) {
          await go(page, detail + '/message', locale);
          await geometry(page, 'Vehicle enquiry ' + width + ' ' + locale);
          await desktopFrame(page, 'Vehicle enquiry ' + width + ' ' + locale);
          await fixedFrameActions(page, 'Vehicle enquiry ' + width + ' ' + locale);
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
      { polling: 100 },
    );
    assert.equal(await shared.evaluate(() => document.documentElement.lang), 'en');
    assert.equal(
      await shared.evaluate((key) => localStorage.getItem(key), storageKeys.language),
      'bg',
    );
    check('Shared-link language stays explicit without echoing cross-tab preference writes');
    await shared.goto(base + '/');
    await shared.waitForFunction(() => document.documentElement.lang === 'bg', null, {
      polling: 100,
    });
    await quietNetwork(shared);
    await other.evaluate((key) => localStorage.setItem(key, 'en'), storageKeys.language);
    await shared.waitForFunction(() => document.documentElement.lang === 'en', null, {
      polling: 100,
    });
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
    await quietNetwork(savedPage);
    await savedPage.reload({ waitUntil: 'load' });
    await quietNetwork(savedPage);
    await cars(savedPage, 1);
    await savedPage
      .locator('[data-showroom-vehicle]')
      .getByRole('button', { name: /^Remove .* from saved cars/ })
      .click();
    await save.waitFor();
    await quietNetwork(savedPage);
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
    await quietNetwork(page);
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
    await quietNetwork(page);
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
        await page.getByRole('button', { name: 'Open profile menu', exact: true }).click();
        await page.getByRole('menuitem', { name: /^Saved cars/ }).click();
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
await Promise.all(
  engines.map(async ([name, engine]) => {
    try {
      await run(name, engine);
    } catch (error) {
      report.errors.push({ engine: name, message: error.stack || String(error) });
    }
  }),
);
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
