import assert from 'node:assert/strict';
import { launchBrowser, previewUrl } from './browser.mjs';
import { smokeReport } from './smoke-report.mjs';

const base = previewUrl();
const output = 'artifacts/journey-smoke';
const suite = await smokeReport(output, base);
const browser = await launchBrowser();
try {
  for (const width of [390, 1440]) {
    const page = await browser.newPage({ viewport: { width, height: 900 } });
    page.setDefaultTimeout(8000);
    await suite.check(`list and article return ${width}`, async () => {
      await page.goto(`${base}/listing-grid?make=BMW&sort=price-asc`, { waitUntil: 'networkidle' });
      const first = page.locator('.dn-listing-results .dn-vehicle-card__link').first();
      const title = await first.getAttribute('aria-label');
      // Click the padded card area, not just its title, to protect the real hit target.
      await first.click({ position: { x: 5, y: 5 } });
      await page.waitForURL('**/listing-detail-v1/**');
      await page.locator(width < 768 ? '.dn-detail-mobile-back' : '.dn-detail-title-card a').click();
      await page.waitForURL(url => url.pathname === '/listing-grid');
      assert.equal(new URL(page.url()).searchParams.get('make'), 'BMW');
      assert.equal(new URL(page.url()).searchParams.get('sort'), 'price-asc');
      assert.equal(await page.locator('.dn-listing-results .dn-vehicle-card__link').first().getAttribute('aria-label'), title);
      assert(new URL(page.url()).hash.startsWith('#vehicle-'));
      await page.goto(`${base}/blog?category=${encodeURIComponent('Внос')}`, { waitUntil: 'networkidle' });
      await page.locator('.dn-blog-card__link').first().click();
      await page.waitForURL('**/blog-detail/**');
      await page.locator('.dn-blog-detail__back').click();
      await page.waitForURL(url => url.pathname === '/blog');
      assert.equal(new URL(page.url()).searchParams.get('category'), 'Внос');
      assert(new URL(page.url()).hash.startsWith('#article-'));
      await page.goto(`${base}/listing-detail-v1/4?return=https://example.com`, { waitUntil: 'networkidle' });
      assert.equal(await page.locator('.dn-detail-mobile-back').getAttribute('href'), '/listing-grid');
    });
    await suite.check(`vehicle context and finance ${width}`, async () => {
      for (let id = 1; id <= 8; id++) {
        await page.goto(`${base}/listing-detail-v1/${id}`, { waitUntil: 'networkidle' });
        const title = await page.locator('h1').innerText();
        const trigger = page.locator('.dn-detail-finance-trigger');
        if (await trigger.isVisible()) { await trigger.click(); await page.locator('.dn-detail-finance-dialog:modal').waitFor(); }
        const finance = page.locator('.dn-finance-calculator:visible');
        const amountBefore = await finance.locator('dd').first().innerText();
        await finance.locator('input').fill('10000');
        await finance.locator('select').selectOption('24');
        assert.notEqual(await finance.locator('dd').first().innerText(), amountBefore);
        await finance.locator('input').focus();
        await page.keyboard.press('Tab');
        const ring = await finance.locator('select').evaluate(el => ({ width: getComputedStyle(el).outlineWidth, style: getComputedStyle(el).outlineStyle }));
        assert.notEqual(ring.style, 'none'); assert.notEqual(ring.width, '0px');
        assert.equal(await page.locator('.dn-detail-gallery__count').count(), 0);
        await finance.locator('a').click();
        await page.waitForURL(url => url.pathname === '/contact');
        assert.equal(new URL(page.url()).searchParams.get('vehicle'), String(id));
        assert.equal(new URL(page.url()).searchParams.get('down_payment'), '10000');
        assert.equal(new URL(page.url()).searchParams.get('term'), '24');
        const returnHref = new URL(await page.locator('.dn-contact-vehicle').getAttribute('href'), base);
        assert.equal(returnHref.searchParams.get('down_payment'), '10000');
        assert.equal(returnHref.searchParams.get('term'), '24');
        assert.equal(await page.locator('.dn-contact-vehicle strong').innerText(), title);
        assert.equal(returnHref.pathname, `/listing-detail-v1/${id}`);
      }
      await page.goto(`${base}/contact?topic=leasing&vehicle=999`, { waitUntil: 'networkidle' });
      assert.equal(await page.locator('.dn-contact-vehicle').count(), 0);
    });
    await suite.check(`stock discovery ${width}`, async () => {
      await page.goto(base, { waitUntil: 'networkidle' });
      const shortcuts = await page.locator('.dn-body-type, .dn-brand-card').evaluateAll(links => links.map(link => ({ route: link.getAttribute('href'), count: Number(link.dataset.stockCount) })));
      for (const { route, count } of shortcuts) {
        await page.goto(base + route, { waitUntil: 'networkidle' });
        assert.equal(await page.locator('.dn-listing-results .dn-vehicle-card').count(), count, `${route} must reflect actual stock`);
        if (!count) assert(await page.getByText('Няма съвпадения', { exact: true }).isVisible());
      }
      await page.goto(`${base}/listing-grid?equipment=4x4&equipment=4x4&price_max=0`, { waitUntil: 'networkidle' });
      assert.equal(await page.locator('.dn-listing-results .dn-vehicle-card').count(), 0);
      assert(await page.getByText('Няма съвпадения', { exact: true }).isVisible());
    });
    await page.close();
  }
  await suite.check('mobile menu isolation, focus and resize', async () => {
    const page = await browser.newPage({ viewport: { width: 390, height: 844 } });
    try {
      await page.goto(base, { waitUntil: 'networkidle' });
      await page.keyboard.press('Tab');
      assert.equal(await page.locator('.dn-skip-link').evaluate(el => el === document.activeElement), true);
      await page.keyboard.press('Enter');
      const trigger = page.locator('.dn-mobile-bottom-nav button');
      await trigger.click();
      const dialog = page.locator('#dn-mobile-menu');
      assert(await dialog.evaluate(el => el.matches(':modal')));
      await page.locator('main').evaluate(el => el.focus());
      assert(await dialog.evaluate(el => el.contains(document.activeElement)), 'Background cannot receive focus');
      for (let i = 0; i < 18; i++) { await page.keyboard.press('Tab'); assert(await dialog.evaluate(el => el.contains(document.activeElement))); }
      await page.screenshot({ path: `${output}/mobile-menu.png` });
      await page.keyboard.press('Escape');
      await page.waitForFunction(() => document.activeElement?.matches('.dn-mobile-bottom-nav button'));
      assert(await trigger.evaluate(el => el === document.activeElement));
      assert.equal(await page.evaluate(() => document.body.style.overflow), '');
      await trigger.click(); await page.setViewportSize({ width: 992, height: 900 });
      await page.waitForFunction(() => !document.querySelector('#dn-mobile-menu'));
      assert.equal(await page.evaluate(() => document.body.style.overflow), '');
    } finally { await page.close(); }
  });
  await suite.check('hero media only loads for its viewport', async () => {
    const evidence = [];
    for (const width of [390, 1024, 1440]) {
      const page = await browser.newPage({ viewport: { width, height: 900 } });
      const media = [];
      page.on('request', request => { if (request.url().includes('/assets/')) media.push(request.url()); });
      try {
        await page.goto(base, { waitUntil: 'networkidle' });
        assert(!media.some(url => /home-hero-v3|home-black-v1/.test(url)));
        assert(!media.some(url => url.includes('urus-front-v1')), 'Home uses the refreshed two-car artwork');
        const homeArtwork = await page.locator('.dn-hero-vehicles__pair img').evaluate(image => image.currentSrc);
        assert(width < 768 ? homeArtwork.includes('collection-banner-v2') : homeArtwork.startsWith('data:'));
        const sources = await page.locator('.dn-hero-vehicles__car img').evaluateAll(images => images.map(image => image.currentSrc));
        assert(sources.every(src => width >= 1440 ? src.startsWith('http') : src.startsWith('data:')));
        evidence.push({ width, heroSources: sources, homeArtwork });
        for (const [topic, scene] of [['trade-in', 'sell'], ['import', 'import']]) {
          await page.goto(`${base}/contact?topic=${topic}`, { waitUntil: 'networkidle' });
          const support = await page.locator('.dn-hero-vehicles__support img').evaluateAll(images => images.map(image => image.currentSrc));
          assert.equal(support.length, 2);
          assert(support.every(src => width < 768 ? src.includes(`mobile-${scene}-v1`) : src.startsWith('data:')));
        }
      } finally { await page.close(); }
    }
    return evidence;
  });
} finally { await browser.close(); await suite.finish(); }
