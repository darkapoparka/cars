import { appPath, returningPage } from './locale-smoke-fixture.mjs';
import assert from 'node:assert/strict';
import { launchBrowser, previewUrl } from './browser.mjs';
import { smokeReport } from './smoke-report.mjs';
import { verifyHomeBrowse } from './home-browse-smoke.mjs';

const base = previewUrl();
const output = 'artifacts/phase4-smoke';
const suite = await smokeReport(output, base);
const browser = await launchBrowser();
const casePattern = process.env.PHASE4_CASE ? new RegExp(process.env.PHASE4_CASE) : null;
const check = (name, run) => casePattern && !casePattern.test(name) ? Promise.resolve() : suite.check(name, run);

// Test application readiness, not third-party map/network inactivity.
async function navigate(page, destination) {
  const response = await page.goto(destination, { waitUntil: 'domcontentloaded' });
  assert.equal(response.status(), 200, destination);
  await page.locator('[data-locale-ready="true"]').waitFor({ state: 'attached' });
  await page.evaluate(() => document.fonts.ready.then(() => undefined));
}

async function assertCleanDom(page) {
  const state = await page.evaluate(() => {
    const ids = [...document.querySelectorAll('[id]')].map(element => element.id);
    return {
      duplicates: [...new Set(ids.filter((id, index) => ids.indexOf(id) !== index))],
      bodyWidth: document.documentElement.scrollWidth,
      viewportWidth: document.documentElement.clientWidth
    };
  });
  assert.deepEqual(state.duplicates, [], 'Rendered discovery and shell surfaces must not duplicate IDs');
  assert(state.bodyWidth <= state.viewportWidth + 1, `Unexpected horizontal overflow: ${state.bodyWidth}/${state.viewportWidth}`);
}

const mobileField = (page, title) => page.locator('.dn-mobile-filter-fields button').filter({ has: page.getByText(title, { exact: true }) });

try {
  await check('URL sort and chip removal retain unrelated filters', async () => {
    const page = await returningPage(browser, { viewport: { width: 390, height: 844 }, reducedMotion: 'reduce' });
    try {
      await navigate(page, `${base}/cars?make=BMW&fuel=${encodeURIComponent('Дизел')}&sort=price-asc`);
      await assertCleanDom(page);
      await page.locator('.dn-listing-filter__mobile-sort').click();
      const sortSheet = page.locator('#dn-listing-sort-sheet');
      await sortSheet.waitFor({ state: 'visible' });
      await sortSheet.locator('input[name=sort][value="mileage-asc"]').check();
      await sortSheet.locator('.apply').click();
      await page.waitForURL(url => url.searchParams.get('sort') === 'mileage-asc');
      let params = new URL(page.url()).searchParams;
      assert.equal(params.get('make'), 'BMW');
      assert.equal(params.get('fuel'), 'Дизел');
      await page.getByRole('link', { name: 'Премахнете BMW', exact: true }).click();
      await page.waitForURL(url => !url.searchParams.has('make'));
      params = new URL(page.url()).searchParams;
      assert.equal(params.get('fuel'), 'Дизел');
      assert.equal(params.get('sort'), 'mileage-asc');
      assert.equal(params.has('model'), false);
      return { url: page.url() };
    } finally { await page.close(); }
  });

  await check('facet and outer filter drafts save or cancel at their owner', async () => {
    const page = await returningPage(browser, { viewport: { width: 390, height: 844 }, reducedMotion: 'reduce' });
    try {
      await navigate(page, `${base}/cars?fuel=${encodeURIComponent('Дизел')}&sort=price-asc`);
      const trigger = page.locator('.dn-listing-filter__toggle');
      const dialog = page.locator('#dn-listing-filter-dialog');
      const picker = dialog.locator('.dn-mobile-filter-editor');
      const save = dialog.getByRole('button', { name: 'Запазете', exact: true });
      await trigger.click();
      await dialog.waitFor({ state: 'visible' });
      const makeField = mobileField(page, 'Марка');
      await makeField.click();
      await picker.getByRole('checkbox', { name: 'Audi', exact: true }).check();
      await page.keyboard.press('Escape');
      await picker.waitFor({ state: 'hidden' });
      assert.match(await makeField.innerText(), /Всички/, 'Nested Cancel must preserve the parent draft');
      assert.equal(await makeField.locator('[data-active]').getAttribute('data-active'), 'false');
      assert.equal(new URL(page.url()).searchParams.has('make'), false, 'Nested Cancel must not update the URL');
      assert.equal(await makeField.evaluate(element => element === document.activeElement), true, 'Nested Cancel must restore focus');

      await makeField.click();
      await picker.getByRole('checkbox', { name: 'Audi', exact: true }).check();
      await save.click();
      assert.equal(new URL(page.url()).searchParams.has('make'), false, 'Nested Apply must not update the URL');
      assert.match(await makeField.innerText(), /Audi/);

      await mobileField(page, 'Модел').click();
      await picker.getByRole('checkbox', { name: 'RS Q8', exact: true }).check();
      await save.click();
      assert.match(await mobileField(page, 'Модел').innerText(), /RS Q8/);

      await mobileField(page, 'Марка').click();
      await picker.getByRole('checkbox', { name: 'BMW', exact: true }).check();
      await picker.getByRole('checkbox', { name: 'Audi', exact: true }).uncheck();
      await save.click();
      assert.match(await mobileField(page, 'Марка').innerText(), /BMW/);
      assert.match(await mobileField(page, 'Модел').innerText(), /Всички/, 'Changing make must reset model');

      await page.keyboard.press('Escape');
      await dialog.waitFor({ state: 'hidden' });
      assert.equal(await trigger.evaluate(element => element === document.activeElement), true);
      assert.equal(new URL(page.url()).searchParams.has('make'), false, 'Outer Cancel must not update the URL');

      await trigger.click();
      await dialog.waitFor({ state: 'visible' });
      assert.match(await mobileField(page, 'Марка').innerText(), /Всички/, 'Outer Cancel must discard its draft');
      await mobileField(page, 'Марка').click();
      await picker.getByRole('checkbox', { name: 'BMW', exact: true }).check();
      await save.click();
      await dialog.locator('.dn-listing-filter__dialog-submit').click();
      await page.waitForURL(url => url.searchParams.get('make') === 'BMW');
      const params = new URL(page.url()).searchParams;
      assert.equal(params.get('fuel'), 'Дизел');
      assert.equal(params.get('sort'), 'price-asc');
      await assertCleanDom(page);
      return { url: page.url() };
    } finally { await page.close(); }
  });

  await check('Home desktop selector drafts save, cancel and reach filtered results', async () => {
    const page = await returningPage(browser, { viewport: { width: 1440, height: 900 }, reducedMotion: 'reduce' });
    try {
      await navigate(page, base);
      await assertCleanDom(page);
      await verifyHomeBrowse(page);
      await assertCleanDom(page);
      return { url: page.url() };
    } finally { await page.close(); }
  });

  await check('desktop mega menu keeps keyboard ownership', async () => {
    const page = await returningPage(browser, { viewport: { width: 1440, height: 900 }, reducedMotion: 'reduce' });
    try {
      await navigate(page, base);
      const trigger = page.locator('.dn-nav__link--disclosure').first();
      await trigger.focus();
      await page.keyboard.press('ArrowDown');
      const panel = page.locator('.dn-mega');
      await panel.waitFor({ state: 'visible' });
      assert.equal(await panel.evaluate(element => element.contains(document.activeElement)), true);
      await page.mouse.move(1430, 880);
      assert(await panel.isVisible(), 'Pointer departure must preserve a keyboard-focused menu');
      assert.equal(await panel.evaluate(element => element.contains(document.activeElement)), true);
      await page.keyboard.press('Escape');
      await panel.waitFor({ state: 'hidden' });
      assert.equal(await trigger.evaluate(element => element === document.activeElement), true);
      return { focusedTrigger: true };
    } finally { await page.close(); }
  });
  await check('shell state stays correct across direct and client navigation', async () => {
    const page = await returningPage(browser, { viewport: { width: 390, height: 844 }, reducedMotion: 'reduce' });
    try {
      await navigate(page, base);
      const shell = page.locator('.dn-app-shell');
      assert.equal(await shell.getAttribute('data-route'), 'home');
      assert.equal(await shell.getAttribute('data-mobile-bottom'), 'footer');
      assert.equal(await page.locator('.dn-mobile-bottom-nav a').first().getAttribute('aria-current'), 'page');
      await page.evaluate(() => window.scrollTo({ top: document.body.scrollHeight, behavior: 'instant' }));
      await page.waitForFunction(() => document.querySelector('.dn-mobile-bottom-nav')?.classList.contains('dn-mobile-bottom-nav--footer-visible'));
      await page.evaluate(() => window.scrollTo({ top: 0, behavior: 'instant' }));

      await page.locator('.dn-mobile-bottom-nav a[href="/bg/cars"]').click();
      await page.waitForURL(url => appPath(url) === '/cars');
      assert.equal(await shell.getAttribute('data-route'), 'listing');
      assert.equal(await shell.getAttribute('data-mobile-bottom'), 'nav');
      assert.equal(await page.locator('.dn-mobile-bottom-nav a[href="/bg/cars"]').getAttribute('aria-current'), 'page');
      await assertCleanDom(page);

      await navigate(page, `${base}/cars?make=BMW&sort=price-asc`);
      const first = page.locator('.dn-listing-results .dn-vehicle-card__link').first();
      const title = await first.getAttribute('aria-label');
      await first.click({ position: { x: 5, y: 5 } });
      await page.waitForURL('**/listing-detail-v1/**');
      assert.equal(await shell.getAttribute('data-route'), 'vehicle-detail');
      assert.equal(await shell.getAttribute('data-mobile-bottom'), 'detail');
      assert.equal(await page.locator('.dn-mobile-detail-bar').isVisible(), true);
      assert.equal(await page.locator('.dn-mobile-bottom-nav').count(), 0);
      assert.match(await page.locator('.dn-mobile-detail-bar__secondary').getAttribute('href'), /^\/bg\/contact\?topic=inspection&vehicle=\d+$/);
      await page.locator('.dn-detail-mobile-back').click();
      await page.waitForURL(url => appPath(url) === '/cars');
      let url = new URL(page.url());
      assert.equal(url.searchParams.get('make'), 'BMW');
      assert.equal(url.searchParams.get('sort'), 'price-asc');
      assert.match(url.hash, /^#vehicle-/);
      assert.equal(await page.locator('.dn-listing-results .dn-vehicle-card__link').first().getAttribute('aria-label'), title);

      await page.locator('.dn-mobile-bottom-nav a[href="/bg/contact?topic=trade-in"]').click();
      await page.waitForURL(url => appPath(url) === '/contact' && url.searchParams.get('topic') === 'trade-in');
      assert.equal(await shell.getAttribute('data-contact-topic'), 'trade-in');
      assert.equal(await shell.getAttribute('data-journey'), 'workflow');
      assert.equal(await page.locator('.dn-mobile-bottom-nav a[href="/bg/contact?topic=trade-in"]').getAttribute('aria-current'), 'page');

      await page.locator('.dn-mobile-bottom-nav a[href="/bg/contact?topic=import"]').click();
      await page.waitForURL(url => url.searchParams.get('topic') === 'import');
      assert.equal(await shell.getAttribute('data-contact-topic'), 'import');
      assert.equal(await page.locator('.dn-mobile-bottom-nav a[href="/bg/contact?topic=import"]').getAttribute('aria-current'), 'page');
      await assertCleanDom(page);

      const menuTrigger = page.locator('.dn-mobile-bottom-nav button');
      await menuTrigger.click();
      const menu = page.locator('#dn-mobile-menu');
      await menu.waitFor({ state: 'visible' });
      await menu.locator('a[href="/bg/about-us"]').click();
      await page.waitForURL(url => appPath(url) === '/about-us');
      assert.equal(await shell.getAttribute('data-route'), 'about');
      assert.equal(await shell.getAttribute('data-mobile-bottom'), 'footer');
      assert.equal(await page.locator('.dn-mobile-bottom-nav button').evaluate(element => element.classList.contains('active')), true);
      const aboutMenuTrigger = page.locator('.dn-mobile-bottom-nav button');
      await aboutMenuTrigger.click();
      await menu.waitFor({ state: 'visible' });
      assert.equal(await menu.locator('a[href="/bg/about-us"]').getAttribute('aria-current'), 'page');
      await page.keyboard.press('Escape');
      await menu.waitFor({ state: 'hidden' });
      assert.equal(await aboutMenuTrigger.evaluate(element => element === document.activeElement), true);
      await assertCleanDom(page);
      return { route: await shell.getAttribute('data-route'), url: page.url() };
    } finally { await page.close(); }
  });

  await check('responsive shell and discovery boundaries', async () => {
    const results = [];
    for (const [width, height] of [[320, 677], [390, 844], [430, 932], [844, 390], [767, 900], [768, 900], [991, 900], [992, 900], [1024, 900], [1440, 900], [1920, 1080]]) {
      const page = await returningPage(browser, { viewport: { width, height }, reducedMotion: 'reduce' });
      try {
        await navigate(page, base);
        const shell = page.locator('.dn-app-shell');
        assert.equal(await shell.getAttribute('data-route'), 'home');
        assert.equal(await shell.getAttribute('data-mobile-bottom'), 'footer');
        assert.equal(
          await page.locator('.dn-mobile-bottom-nav').isVisible(),
          width <= 991,
          `Mobile bottom-nav visibility mismatch at ${width}x${height}`
        );
        await assertCleanDom(page);
        await navigate(page, `${base}/cars?make=Audi&sort=price-asc`);
        assert.equal(await shell.getAttribute('data-route'), 'listing');
        assert.equal(await shell.getAttribute('data-mobile-bottom'), 'nav');
        await assertCleanDom(page);

        await navigate(page, `${base}/listing-detail-v1/1`);
        assert.equal(await shell.getAttribute('data-route'), 'vehicle-detail');
        assert.equal(await shell.getAttribute('data-mobile-bottom'), 'detail');
        assert.equal(
          await page.locator('.dn-mobile-detail-bar').isVisible(),
          width <= 991,
          `Mobile detail-bar visibility mismatch at ${width}x${height}`
        );
        await assertCleanDom(page);
        results.push({ width, height, passed: true });
        console.log(`PASS responsive boundary ${width}x${height}`);
      } finally { await page.close(); }
    }
    return results;
  });
} finally {
  await browser.close();
  await suite.finish();
}
