import { appPath, returningContext, returningPage } from './locale-smoke-fixture.mjs';
import assert from 'node:assert/strict';
import { mkdir } from 'node:fs/promises';
import { launchBrowser, previewUrl } from './browser.mjs';
import { smokeReport } from './smoke-report.mjs';
import { fillServiceEntry, serviceEntry, serviceAction } from './service-entry-fixture.mjs';

const base = previewUrl();
const serviceOnly = process.env.TYPOGRAPHY_SCOPE === 'services';
const output = serviceOnly ? 'artifacts/service-typography-smoke' : 'artifacts/typography-smoke';
await mkdir(output, { recursive: true });
const suite = await smokeReport(output, base);
const browser = await launchBrowser();
async function typeOf(locator) {
  return locator.evaluate(e => { const s = getComputedStyle(e); return { size: parseFloat(s.fontSize), weight: Number(s.fontWeight), height: e.getBoundingClientRect().height }; });
}
async function readable(page, name) {
  assert(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1), `${name}: page overflow`);
  const clipped = await page.locator('button, input, select, textarea, dialog[open]').evaluateAll(nodes => nodes.filter(e => e.checkVisibility() && e.clientWidth > 0 && e.scrollWidth > e.clientWidth + 2 && getComputedStyle(e).textOverflow !== 'ellipsis').map(e => ({ text: e.textContent.trim().slice(0,60), class: e.className })));
  assert.deepEqual(clipped, [], `${name}: clipped controls`);
  await page.screenshot({ path: `${output}/${name}.png` });
}
try {
  for (const width of [320,390,768,1440]) {
    await suite.check(`typography and enquiry ${width}`, async () => {
      const page = await returningPage(browser, { viewport: { width, height: width < 768 ? 844 : 1000 }, reducedMotion: 'reduce' });
      const errors = [];
      page.on('pageerror', e => errors.push(e.message));
      try {
        if (!serviceOnly) {
        await page.goto(`${base}/`, {waitUntil:'networkidle'});
        await page.evaluate(() => document.fonts.ready);
        if (width < 768) {
          const buy = page.locator('#home-buy-tab');
          assert.equal((await typeOf(buy)).size,16);
          assert.equal((await typeOf(buy)).weight,500);
          const entry = await typeOf(page.locator('.dn-quick-search__trigger'));
          assert(entry.size > (await typeOf(buy)).size && entry.size === 18 && entry.weight === 400 && entry.height === 44);
          assert.equal(await buy.evaluate(e=>getComputedStyle(e).backgroundColor),'rgb(255, 255, 255)');
          const homeCard = page.locator('.dn-search');
          const homeChips = page.locator('.dn-search__mobile-shortcuts');
          const buyCardBox = await homeCard.boundingBox();
          const buyChipsBox = await homeChips.boundingBox();
          const buyCta = page.locator('#home-buy-search .dn-search__mobile-all');
          const buyCtaType = await typeOf(buyCta);
          const buyCtaBox = await buyCta.boundingBox();
          assert(buyCtaType.size === 16 && buyCtaType.weight === 500 && buyCtaType.height === 44 && buyCtaBox.width === 180);
          assert.equal(await buyCta.evaluate(e=>parseFloat(getComputedStyle(e,'::before').height)),40);
          assert.equal(await buyCta.evaluate(e=>getComputedStyle(e,'::before').backgroundColor),'rgb(196, 1, 1)');
          assert.equal((await page.locator('.dn-quick-search__trigger > .dn-icon').first().boundingBox()).width,18);
          assert.equal((await page.locator('.dn-quick-search__mobile-filter .dn-icon').boundingBox()).width,18);
          const buyLabelColor = await page.locator('.dn-quick-search__label-mobile').evaluate(e=>getComputedStyle(e).color);
          await buy.focus(); await page.keyboard.press('ArrowRight');
          assert.equal(await page.getByRole('tab',{name:'Внос',exact:true}).getAttribute('aria-selected'),'true');
          const homeImport=await typeOf(page.locator('.dn-search__import-field input'));
          assert.equal(homeImport.size,18);
          const importCta = page.locator('.dn-search__import-form .dn-search__mobile-all');
          const importCtaType = await typeOf(importCta);
          const importCardBox = await homeCard.boundingBox();
          const importChipsBox = await homeChips.boundingBox();
          const importCtaBox = await importCta.boundingBox();
          assert(importCtaType.size === 16 && importCtaType.weight === 500 && importCtaType.height === 44 && importCtaBox.width === 180);
          assert.equal(await importCta.evaluate(e=>parseFloat(getComputedStyle(e,'::before').height)),40);
          assert.equal(await importCta.evaluate(e=>getComputedStyle(e,'::before').backgroundColor),'rgb(196, 1, 1)');
          assert.equal(await page.locator('.dn-search__import-field > .dn-icon').count(),0);
          assert(Math.abs(importCardBox.height-buyCardBox.height)<.5 && Math.abs(importChipsBox.y-buyChipsBox.y)<.5, 'Home mode switch must not move the card or following content');
          assert(Math.abs(importCtaBox.width-buyCtaBox.width)<.5 && Math.abs(importCtaBox.y-buyCtaBox.y)<.5, 'Home mode CTAs must keep stable geometry');
          const importPlaceholderColor = await page.locator('.dn-search__import-field input').evaluate(e=>getComputedStyle(e,'::placeholder').color);
          assert.equal(buyLabelColor,importPlaceholderColor);
          await readable(page,`${width}-home-import`);
          await page.keyboard.press('ArrowLeft');
          assert.equal(await buy.getAttribute('aria-selected'),'true');
        }
        await readable(page,`${width}-home`);
        if (width < 768) {
          await page.locator('.dn-quick-search__trigger').click();
          assert.equal((await typeOf(page.locator('.dn-quick-search__mobile-footer button'))).size,18);
          await readable(page,`${width}-home-filters`);
          await page.keyboard.press('Escape');
          await page.goto(`${base}/cars`,{waitUntil:'networkidle'});
          await page.locator('[aria-controls="dn-listing-filter-dialog"]:visible').first().click();
          assert.equal((await typeOf(page.locator('.dn-listing-filter__dialog-submit'))).size,18);
          await readable(page,`${width}-inventory-filters`);
          await page.keyboard.press('Escape');
        }
        }
        for (const topic of ['trade-in', 'import']) {
          await page.goto(base + '/contact?topic=' + topic, {waitUntil:'networkidle'});
          const entry = serviceEntry(page);
          const start = serviceAction(page);
          const primary = await typeOf(start);
          assert(primary.size === 16 && primary.weight === 500 && primary.height === 44);
          for (const input of await entry.locator('input:visible').all()) {
            assert.equal((await typeOf(input)).size, 18);
            assert.equal((await typeOf(input)).height, 44);
          }
          assert.equal(await page.locator('.dn-service-process li').count(), 3);
          if (width < 768) {
            assert(await page.locator('.dn-service-banner').isVisible());
            assert.equal(await page.locator('.dn-service-faq').isVisible(), false);
          } else {
            await page.locator('.dn-service-faq summary').first().click();
            assert(await page.locator('.dn-service-faq details[open] p').isVisible());
          }
          await readable(page, width + '-' + topic);
          if (width < 768) {
            await fillServiceEntry(page, topic === 'trade-in' ? { make:'Audi', model:'A6 Avant', year:'2020', mileage:'85000' } : { link:'https://example.com/car' });
          } else if (topic === 'trade-in') {
            await start.click();
            assert(await entry.locator('[name=make]').evaluate(e=>e===document.activeElement));
            for(const [field,value] of Object.entries({make:'Audi',model:'A6 Avant',year:'2020',mileage:'85000'})) await entry.locator('[name='+field+']').fill(value);
          } else await entry.locator('[name=link]').fill('https://example.com/car');
          await start.click();
          const dialog = page.locator('dialog[open]');
          assert.equal((await typeOf(dialog.locator('input[autocomplete="name"]'))).size, 18);
          await readable(page, width + '-' + topic + '-contact');
          await dialog.locator('footer button[type=submit], .dn-tradein-primary, .dn-enquiry-footer .dn-enquiry-primary').last().click();
          await readable(page, width + '-' + topic + '-review');
          await page.keyboard.press('Escape');
          assert(await start.evaluate(e=>e===document.activeElement));
        }
        assert.deepEqual(errors,[]);
      } finally { await page.close(); }
    });
  }

  for (const height of [667,712,844]) {
    await suite.check(`mobile service scroll 385x${height}`, async () => {
      const page = await returningPage(browser, { viewport: { width: 385, height }, reducedMotion: 'reduce' });
      try {
        for (const topic of ['trade-in','import']) {
          await page.goto(`${base}/contact?topic=${topic}`, { waitUntil: 'networkidle' });
          const action = serviceAction(page);
          await action.scrollIntoViewIfNeeded();
          const [navBox, actionBox] = await Promise.all([page.locator('.dn-mobile-bottom-nav').boundingBox(), action.boundingBox()]);
          assert(actionBox && navBox && actionBox.y >= 0 && actionBox.y + actionBox.height <= navBox.y + 1);
          assert.equal(await page.locator('.dn-service-process li').count(), 3);
          const guide = page.locator('.dn-service-guide button[aria-haspopup=dialog]');
          await guide.scrollIntoViewIfNeeded();
          const guideBox = await guide.boundingBox();
          assert(guideBox.y >= 0 && guideBox.y + guideBox.height <= navBox.y + 1);
          assert.equal(await guide.getAttribute('aria-haspopup'), 'dialog');

        }
      } finally { await page.close(); }
    });
  }
} finally { await browser.close(); await suite.finish(); }
