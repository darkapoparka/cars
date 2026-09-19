import assert from 'node:assert/strict';
import { mkdir } from 'node:fs/promises';
import { launchBrowser, previewUrl } from './browser.mjs';
import { smokeReport } from './smoke-report.mjs';

const base = previewUrl();
const output = 'artifacts/typography-smoke';
await mkdir(output, { recursive: true });
const suite = await smokeReport(output, base);
const browser = await launchBrowser();
async function typeOf(locator) {
  return locator.evaluate(e => { const s = getComputedStyle(e); return { size: parseFloat(s.fontSize), weight: Number(s.fontWeight), height: e.getBoundingClientRect().height }; });
}
async function entryHierarchy(field, segments, action) {
  const input = await field.boundingBox();
  for(const control of [segments, action]) {
    const box = await control.boundingBox();
    assert(box.width < input.width && box.height < input.height, 'Entry controls must be narrower and shorter than the input');
    assert(Math.abs((box.x + box.width / 2) - (input.x + input.width / 2)) < 1, 'Entry controls must stay centered with the input');
  }
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
      const page = await browser.newPage({ viewport: { width, height: width < 768 ? 844 : 1000 }, reducedMotion: 'reduce' });
      const errors = [];
      page.on('pageerror', e => errors.push(e.message));
      try {
        await page.goto(`${base}/`, {waitUntil:'networkidle'});
        await page.evaluate(() => document.fonts.ready);
        if (width < 768) {
          const buy = page.getByRole('tab',{name:'Купи',exact:true});
          assert.equal((await typeOf(buy)).size,16);
          assert.equal((await typeOf(buy)).weight,500);
          const entry = await typeOf(page.locator('.dn-quick-search__trigger'));
          assert(entry.size > (await typeOf(buy)).size && entry.size === 18 && entry.weight === 400 && entry.height >= 52);
          assert.equal(await buy.evaluate(e=>getComputedStyle(e).backgroundColor),'rgb(255, 255, 255)');
          await buy.focus(); await page.keyboard.press('ArrowRight');
          assert.equal(await page.getByRole('tab',{name:'Внос',exact:true}).getAttribute('aria-selected'),'true');
          const homeImport=await typeOf(page.locator('.dn-search__import-field input'));
          assert.equal(homeImport.size,18);
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
          await page.goto(`${base}/listing-grid`,{waitUntil:'networkidle'});
          await page.locator('[aria-controls="dn-listing-filter-dialog"]:visible').first().click();
          assert.equal((await typeOf(page.locator('.dn-listing-filter__dialog-submit'))).size,18);
          await readable(page,`${width}-inventory-filters`);
          await page.keyboard.press('Escape');
        }
        await page.goto(`${base}/contact?topic=trade-in`,{waitUntil:'networkidle'});
        const start = page.locator('.dn-tradein-start');
        const primary = await typeOf(start), call = await typeOf(page.locator('.dn-workflow-support__call'));
        assert(primary.size > call.size && primary.size === 18 && primary.weight === 500);
        assert.equal(primary.height,44);
        assert((await typeOf(page.locator('.dn-tradein-reference'))).height > primary.height);
        assert.equal((await typeOf(page.locator('.dn-tradein-entry-segments'))).height,44);
        await entryHierarchy(page.locator('.dn-tradein-reference'),page.locator('.dn-tradein-entry-segments'),start);
        assert.equal(await page.locator('.dn-contact-intent__main .dn-workflow-support__call').count(),0);
        assert.equal(await page.locator('.dn-workflow-showcase').count(),0);
        assert.match(await page.locator('.dn-workflow-support__call').getAttribute('href'),/^tel:/);
        assert.equal(await page.locator('.dn-workflow-support__call').evaluate(e=>getComputedStyle(e).textDecorationLine),'none');
        const cardBounds=await page.locator('.dn-contact-intent__main').boundingBox();
        const callBounds=await page.locator('.dn-workflow-support__call').boundingBox();
        assert(callBounds.y >= cardBounds.y + cardBounds.height, 'Call must sit below the entry card');
        await readable(page,`${width}-sell`);
        await start.click();
        const sell = page.locator('.dn-tradein-dialog');
        await sell.locator('.dn-tradein-primary').click();
        assert.equal(await sell.locator('[name="make"]').evaluate(e=>e===document.activeElement),true);
        for(const [field,value] of Object.entries({make:'Audi',model:'A6 Avant',year:'2020',mileage:'85000'})) await sell.locator(`[name="${field}"]`).fill(value);
        await readable(page,`${width}-sell-fields`);
        await sell.locator('.dn-tradein-primary').click();
        await readable(page,`${width}-sell-photos`);
        await sell.locator('.dn-tradein-primary').click();
        assert.match(await sell.locator('.dn-tradein-review-card').innerText(),/Audi A6 Avant/);
        await readable(page,`${width}-sell-review`);
        await page.keyboard.press('Escape');
        assert.equal(await start.evaluate(e=>e===document.activeElement),true);

        const reference=page.locator('#tradein-reference');
        const editor=page.locator('.dn-entry-editor[open]');
        for(const invalid of ['javascript:alert(1)','WBA0000000000000I']) {
          await reference.click();
          await editor.locator('[name="entry-value"]').fill(invalid);
          await editor.getByRole('button',{name:'Запази',exact:true}).click();
          assert(await editor.getByRole('alert').isVisible());
          assert.equal(await sell.getAttribute('open'),null);
          await page.keyboard.press('Escape');
          assert.equal(await reference.evaluate(e=>e===document.activeElement),true);
        }
        await reference.click();
        await editor.locator('[name="entry-value"]').fill('mobile.bg/obiava-123456789');
        await readable(page,`${width}-sell-reference-editor`);
        await editor.getByRole('button',{name:'Запази',exact:true}).click();
        assert.match(await reference.innerText(),/https:\/\/mobile.bg\/obiava-123456789/);
        await reference.click();
        await editor.locator('[name="entry-value"]').fill('https://example.com/discard');
        await editor.getByRole('button',{name:'Отказ',exact:true}).click();
        assert.match(await reference.innerText(),/mobile.bg/);
        await page.getByRole('button',{name:'Бартер',exact:true}).click();
        await start.click();
        for(const field of ['make','model','year','mileage']) {
          await sell.locator(`[name="${field}"]`).fill('');
          assert.equal(await sell.locator(`[name="${field}"]`).getAttribute('required'),null);
        }
        await sell.locator('.dn-tradein-primary').click();
        await sell.locator('.dn-tradein-primary').click();
        assert.match(await sell.locator('.dn-tradein-review-card').innerText(),/https:\/\/mobile.bg\/obiava-123456789/);
        await page.evaluate(()=>Object.defineProperty(navigator,'clipboard',{configurable:true,value:{writeText:async text=>{window.__tradeinCopiedText=text;}}}));
        await sell.locator('.dn-tradein-copy').click();
        assert.match(await page.evaluate(()=>window.__tradeinCopiedText),/Заявка за бартер[\s\S]*Обява: https:\/\/mobile.bg\/obiava-123456789/);
        await sell.getByRole('button',{name:'Редактирай',exact:true}).click();
        await sell.locator('[name="reference"]').fill('');
        await sell.locator('.dn-tradein-primary').click();
        assert.equal(await sell.locator('[name="make"]').evaluate(e=>e===document.activeElement),true);
        await sell.locator('[name="reference"]').fill('invalid');
        await sell.locator('.dn-tradein-primary').click();
        assert(await sell.locator('#tradein-reference-edit-error').isVisible());
        await sell.locator('[name="reference"]').fill('wba00000000000001');
        await sell.locator('.dn-tradein-primary').click();
        await sell.locator('.dn-tradein-primary').click();
        assert.match(await sell.locator('.dn-tradein-review-card').innerText(),/VIN: WBA00000000000001/);
        await sell.locator('.dn-tradein-copy').click();
        assert.match(await page.evaluate(()=>window.__tradeinCopiedText),/VIN: WBA00000000000001/);
        await readable(page,`${width}-sell-vin-review`);
        await page.keyboard.press('Escape');
        assert.equal(await start.evaluate(e=>e===document.activeElement),true);
        await reference.click();
        await editor.locator('[name="entry-value"]').fill('wba00000000000001');
        await editor.getByRole('button',{name:'Запази',exact:true}).click();
        assert.equal(await reference.innerText(),'WBA00000000000001');
        await reference.click();
        await editor.locator('[name="entry-value"]').fill('');
        await editor.getByRole('button',{name:'Запази',exact:true}).click();
        assert.equal(await reference.innerText(),'Линк или VIN');
        await start.click();
        await sell.locator('.dn-tradein-primary').click();
        assert.equal(await sell.locator('[name="make"]').evaluate(e=>e===document.activeElement),true);
        await page.keyboard.press('Escape');
        await page.locator('.dn-tradein-info-drawer__peek').click();
        await readable(page,`${width}-sell-help`); await page.keyboard.press('Escape');

        await page.goto(`${base}/contact?topic=import`,{waitUntil:'networkidle'});
        const importStart=page.getByRole('button',{name:/^Заяви внос/});
        assert.equal((await typeOf(importStart)).size,18);
        assert.equal((await typeOf(importStart)).height,44);
        assert.equal((await typeOf(page.locator('.dn-enquiry-import-segments'))).height,44);
        await entryHierarchy(page.locator('.dn-enquiry-import-field'),page.locator('.dn-enquiry-import-segments'),importStart);
        assert.equal(await page.locator('#enquiry-entry svg').count(),0);
        if(width<768) {
          const hint=page.locator('.dn-contact-workflow-hint');
          assert.equal(await hint.innerText(),'Линк към обява или описание');
          assert(await hint.evaluate(e=>Math.abs(e.getBoundingClientRect().height-parseFloat(getComputedStyle(e).lineHeight))<1));
        }
        assert.equal(await page.locator('.dn-contact-intent__main .dn-workflow-support__call').count(),0);
        assert.equal(await page.locator('.dn-workflow-support__call').count(),1);
        const importEntry=page.locator('#enquiry-entry');
        const importField=await typeOf(importEntry);
        const importMode=await typeOf(page.getByRole('button',{name:'Линк',exact:true}));
        assert(importField.size > importMode.size && importField.size === 18 && importField.weight === 400);
        assert((await typeOf(page.locator('.dn-enquiry-import-field'))).height >= 52);
        await importStart.click();
        assert(await editor.isVisible());
        await editor.locator('[name="entry-value"]').fill('javascript:alert(1)');
        await editor.getByRole('button',{name:'Запази',exact:true}).click();
        assert(await editor.getByRole('alert').isVisible());
        await editor.locator('[name="entry-value"]').fill('https://example.com/car');
        await readable(page,`${width}-import-link-editor`);
        await editor.getByRole('button',{name:'Запази',exact:true}).click();
        assert.equal(await importStart.evaluate(e=>e===document.activeElement),true);
        await importStart.click();
        const enquiry=page.locator('.dn-enquiry');
        assert.equal(await enquiry.getAttribute('open'),'');
        await readable(page,`${width}-import-fields`);
        await enquiry.locator('.dn-enquiry-footer .dn-enquiry-primary').click();
        await readable(page,`${width}-import-contact`);
        await enquiry.locator('.dn-enquiry-footer .dn-enquiry-primary').click();
        await readable(page,`${width}-import-review`);
        await page.keyboard.press('Escape');
        assert.equal(await importStart.evaluate(e=>e===document.activeElement),true);
        const linkCardHeight=(await page.locator('.dn-contact-intent__main').boundingBox()).height;
        await page.getByRole('button',{name:'Инфо',exact:true}).click();
        assert.equal((await page.locator('.dn-contact-intent__main').boundingBox()).height,linkCardHeight);
        await importEntry.click();
        assert.equal((await typeOf(editor.locator('textarea'))).size,18);
        await editor.locator('textarea').fill('BMW X5, дизел, 2020, автоматик');
        await editor.locator('[name="entry-budget"]').fill('invalid');
        await editor.getByRole('button',{name:'Запази',exact:true}).click();
        assert(await editor.getByRole('alert').isVisible());
        await editor.locator('[name="entry-budget"]').fill('40000');
        await readable(page,`${width}-import-info-editor`);
        await editor.getByRole('button',{name:'Запази',exact:true}).click();
        assert.equal(await importEntry.evaluate(e=>e===document.activeElement),true);
        assert.match(await importEntry.innerText(),/BMW X5.*40000/);
        await importEntry.click();
        await editor.locator('textarea').fill('Discard this edit');
        await page.keyboard.press('Escape');
        assert.match(await importEntry.innerText(),/BMW X5/);
        await readable(page,`${width}-import-criteria`);
        await importStart.click();
        assert.equal(await enquiry.getAttribute('open'),'');
        await enquiry.locator('.dn-enquiry-footer .dn-enquiry-primary').click();
        await enquiry.locator('.dn-enquiry-footer .dn-enquiry-primary').click();
        assert.match(await enquiry.locator('.dn-enquiry-summary').innerText(),/Критерии: BMW X5[\s\S]*40000 EUR/);
        await page.keyboard.press('Escape');
        await page.getByRole('button',{name:'Линк',exact:true}).click();
        assert.equal(await importEntry.innerText(),'https://example.com/car');
        await readable(page,`${width}-import`);
        assert.deepEqual(errors,[]);
      } finally { await page.close(); }
    });
  }
} finally { await browser.close(); await suite.finish(); }
