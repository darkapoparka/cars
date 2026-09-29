import { appPath, returningContext, returningPage } from './locale-smoke-fixture.mjs';
import assert from 'node:assert/strict';
import { launchBrowser, previewUrl } from './browser.mjs';
import { smokeReport } from './smoke-report.mjs';

const base = previewUrl();
const output = 'artifacts/phase4-smoke';
const suite = await smokeReport(output, base);
const browser = await launchBrowser();

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
  await suite.check('URL sort and chip removal retain unrelated filters', async () => {
    const page = await returningPage(browser, { viewport: { width: 390, height: 844 }, reducedMotion: 'reduce' });
    try {
      await page.goto(`${base}/listing-grid?make=BMW&fuel=${encodeURIComponent('Дизел')}&sort=price-asc`, { waitUntil: 'networkidle' });
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

  await suite.check('nested and outer dialog drafts apply or cancel at their owner', async () => {
    const page = await returningPage(browser, { viewport: { width: 390, height: 844 }, reducedMotion: 'reduce' });
    try {
      await page.goto(`${base}/listing-grid?fuel=${encodeURIComponent('Дизел')}&sort=price-asc`, { waitUntil: 'networkidle' });
      const trigger = page.locator('.dn-listing-filter__toggle');
      const dialog = page.locator('#dn-listing-filter-dialog');
      const picker = page.locator('#dn-dialog-choice');
      await trigger.click();
      await dialog.waitFor({ state: 'visible' });
      const makeField = mobileField(page, 'Марка');
      await makeField.click();
      await picker.getByRole('radio', { name: 'Audi', exact: true }).check();
      await page.keyboard.press('Escape');
      await picker.waitFor({ state: 'hidden' });
      assert.match(await makeField.innerText(), /Всички/, 'Nested Cancel must preserve the parent draft');
      assert.equal(await makeField.locator('[data-active]').getAttribute('data-active'), 'false');
      assert.equal(new URL(page.url()).searchParams.has('make'), false, 'Nested Cancel must not update the URL');
      assert.equal(await makeField.evaluate(element => element === document.activeElement), true, 'Nested Cancel must restore focus');

      await makeField.click();
      await picker.getByRole('radio', { name: 'Audi', exact: true }).check();
      await picker.locator('.apply').click();
      assert.equal(new URL(page.url()).searchParams.has('make'), false, 'Nested Apply must not update the URL');
      assert.match(await makeField.innerText(), /Audi/);

      await mobileField(page, 'Модел').click();
      await picker.getByRole('radio', { name: 'RS Q8', exact: true }).check();
      await picker.locator('.apply').click();
      assert.match(await mobileField(page, 'Модел').innerText(), /RS Q8/);

      await mobileField(page, 'Марка').click();
      await picker.getByRole('radio', { name: 'BMW', exact: true }).check();
      await picker.locator('.apply').click();
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
      await picker.getByRole('radio', { name: 'BMW', exact: true }).check();
      await picker.locator('.apply').click();
      await dialog.locator('.dn-listing-filter__dialog-submit').click();
      await page.waitForURL(url => url.searchParams.get('make') === 'BMW');
      const params = new URL(page.url()).searchParams;
      assert.equal(params.get('fuel'), 'Дизел');
      assert.equal(params.get('sort'), 'price-asc');
      await assertCleanDom(page);
      return { url: page.url() };
    } finally { await page.close(); }
  });

  await suite.check('Home desktop pending values survive dialog cancel and apply on submit', async () => {
    const page = await returningPage(browser, { viewport: { width: 1440, height: 900 }, reducedMotion: 'reduce' });
    try {
      await page.goto(base, { waitUntil: 'networkidle' });
      await assertCleanDom(page);
      const form = page.locator('.dn-search__desktop-form .dn-discovery');
      await form.locator('select[name=make]').selectOption('Audi');
      const opener = form.locator('.dn-discovery__keyword');
      await opener.click();
      const dialog = page.locator('#dn-listing-filter-dialog');
      await dialog.waitFor({ state: 'visible' });
      assert.equal(await dialog.locator('select[name=make]').inputValue(), 'Audi');
      await page.keyboard.press('Escape');
      await dialog.waitFor({ state: 'hidden' });
      assert.equal(await opener.evaluate(element => element === document.activeElement), true);
      assert.equal(appPath(page.url()), '/');
      assert.equal(await form.locator('select[name=make]').inputValue(), 'Audi');
      await form.locator('.dn-discovery__submit').click();
      await page.waitForURL(url => appPath(url) === '/listing-grid' && url.searchParams.get('make') === 'Audi');
      assert.equal(await page.locator('.dn-listing-results .dn-vehicle-card').count(), 2);
      await assertCleanDom(page);
      return { url: page.url() };
    } finally { await page.close(); }
  });

  await suite.check('desktop mega menu keeps keyboard ownership', async () => {
    const page = await returningPage(browser, { viewport: { width: 1440, height: 900 }, reducedMotion: 'reduce' });
    try {
      await page.goto(base, { waitUntil: 'networkidle' });
      const trigger = page.locator('.dn-nav__link--disclosure').first();
      await trigger.focus();
      await page.keyboard.press('ArrowDown');
      const panel = page.locator('.dn-mega');
      await panel.waitFor({ state: 'visible' });
      assert.equal(await panel.evaluate(element => element.contains(document.activeElement)), true);
      await page.keyboard.press('Escape');
      await panel.waitFor({ state: 'hidden' });
      assert.equal(await trigger.evaluate(element => element === document.activeElement), true);
      return { focusedTrigger: true };
    } finally { await page.close(); }
  });
  await suite.check('shell state stays correct across direct and client navigation', async () => {
    const page = await returningPage(browser, { viewport: { width: 390, height: 844 }, reducedMotion: 'reduce' });
    try {
      await page.goto(base, { waitUntil: 'networkidle' });
      const shell = page.locator('.dn-app-shell');
      assert.equal(await shell.getAttribute('data-route'), 'home');
      assert.equal(await shell.getAttribute('data-mobile-bottom'), 'footer');
      assert.equal(await page.locator('.dn-mobile-bottom-nav a').first().getAttribute('aria-current'), 'page');
      await page.evaluate(() => window.scrollTo({ top: document.body.scrollHeight, behavior: 'instant' }));
      await page.waitForFunction(() => document.querySelector('.dn-mobile-bottom-nav')?.classList.contains('dn-mobile-bottom-nav--footer-visible'));
      await page.evaluate(() => window.scrollTo({ top: 0, behavior: 'instant' }));

      await page.locator('.dn-mobile-bottom-nav a[href="/bg/listing-grid"]').click();
      await page.waitForURL(url => appPath(url) === '/listing-grid');
      assert.equal(await shell.getAttribute('data-route'), 'listing');
      assert.equal(await shell.getAttribute('data-mobile-bottom'), 'nav');
      assert.equal(await page.locator('.dn-mobile-bottom-nav a[href="/bg/listing-grid"]').getAttribute('aria-current'), 'page');
      await assertCleanDom(page);

      await page.goto(`${base}/listing-grid?make=BMW&sort=price-asc`, { waitUntil: 'networkidle' });
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
      await page.waitForURL(url => appPath(url) === '/listing-grid');
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

  await suite.check('responsive shell and discovery boundaries', async () => {
    const results = [];
    for (const [width, height] of [[320, 677], [390, 844], [430, 932], [844, 390], [767, 900], [768, 900], [991, 900], [992, 900], [1024, 900], [1440, 900], [1920, 1080]]) {
      const page = await returningPage(browser, { viewport: { width, height }, reducedMotion: 'reduce' });
      try {
        await page.goto(base, { waitUntil: 'networkidle' });
        const shell = page.locator('.dn-app-shell');
        assert.equal(await shell.getAttribute('data-route'), 'home');
        assert.equal(await shell.getAttribute('data-mobile-bottom'), 'footer');
        assert.equal(
          await page.locator('.dn-mobile-bottom-nav').isVisible(),
          width <= 991,
          `Mobile bottom-nav visibility mismatch at ${width}x${height}`
        );
        await assertCleanDom(page);
        await page.goto(`${base}/listing-grid?make=Audi&sort=price-asc`, { waitUntil: 'networkidle' });
        assert.equal(await shell.getAttribute('data-route'), 'listing');
        assert.equal(await shell.getAttribute('data-mobile-bottom'), 'nav');
        await assertCleanDom(page);

        await page.goto(`${base}/listing-detail-v1/1`, { waitUntil: 'networkidle' });
        assert.equal(await shell.getAttribute('data-route'), 'vehicle-detail');
        assert.equal(await shell.getAttribute('data-mobile-bottom'), 'detail');
        assert.equal(
          await page.locator('.dn-mobile-detail-bar').isVisible(),
          width <= 991,
          `Mobile detail-bar visibility mismatch at ${width}x${height}`
        );
        await assertCleanDom(page);
        results.push({ width, height, passed: true });
      } finally { await page.close(); }
    }
    return results;
  });
} finally {
  await browser.close();
  await suite.finish();
}
