import { appPath, returningContext, returningPage } from './locale-smoke-fixture.mjs';
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
    assert(box.width < input.width && box.height <= input.height, 'Entry controls must be narrower and no taller than the input');
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
      const page = await returningPage(browser, { viewport: { width, height: width < 768 ? 844 : 1000 }, reducedMotion: 'reduce' });
      const errors = [];
      page.on('pageerror', e => errors.push(e.message));
      try {
        await page.goto(`${base}/`, {waitUntil:'networkidle'});
        await page.evaluate(() => document.fonts.ready);
        if (width < 768) {
          const buy = page.getByRole('tab',{name:'Покупка',exact:true});
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
          assert.equal((await page.locator('.dn-search__import-field > .dn-icon').boundingBox()).width,18);
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
          await page.goto(`${base}/listing-grid`,{waitUntil:'networkidle'});
          await page.locator('[aria-controls="dn-listing-filter-dialog"]:visible').first().click();
          assert.equal((await typeOf(page.locator('.dn-listing-filter__dialog-submit'))).size,18);
          await readable(page,`${width}-inventory-filters`);
          await page.keyboard.press('Escape');
        }
        await page.goto(`${base}/contact?topic=trade-in`,{waitUntil:'networkidle'});
        const start = page.locator('.dn-tradein-start');
        const primary = await typeOf(start);
        assert(primary.size === 16 && primary.weight === 500);
        assert.equal(primary.height,44);
        assert.equal((await typeOf(page.locator('.dn-tradein-reference'))).height,44);
        assert.equal((await typeOf(page.locator('.dn-tradein-entry-segments'))).height,44);
        await entryHierarchy(page.locator('.dn-tradein-reference'),page.locator('.dn-tradein-entry-segments'),start);
        assert.equal(await page.locator('.dn-contact-intent__main .dn-workflow-support__call').count(),0);
        assert.equal(await page.locator('.dn-workflow-showcase').count(),0);
        if (width < 768) {
          assert.equal(await page.locator('.dn-workflow-support').isVisible(), false, 'Mobile keeps the support banner out of the primary flow');
        } else {
          const call = await typeOf(page.locator('.dn-workflow-support__call'));
          assert(call.size === 16 && call.weight === 500);
          assert.match(await start.getAttribute('class'), /\bdn-compact-primary\b/);
          assert.doesNotMatch((await page.locator('.dn-workflow-support__call').getAttribute('class')) ?? '', /\bdn-compact-primary\b/);
          assert.match(await page.locator('.dn-workflow-support__call').getAttribute('href'),/^tel:/);
          assert.equal(await page.locator('.dn-workflow-support__call').evaluate(e=>getComputedStyle(e).textDecorationLine),'none');
          const cardBounds=await page.locator('.dn-contact-intent__main').boundingBox();
          const callBounds=await page.locator('.dn-workflow-support__call').boundingBox();
          assert(callBounds.y >= cardBounds.y + cardBounds.height, 'Call must sit below the entry card');
        }
        await readable(page,`${width}-sell`);
        await start.click();
        const sell = page.locator('.dn-tradein-dialog');
        assert.equal((await typeOf(sell.locator('.dn-tradein-fields input').first())).height,44);
        assert.equal((await typeOf(sell.locator('.dn-tradein-primary'))).height,44);
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
          await editor.getByRole('button',{name:'Запазете',exact:true}).click();
          assert(await editor.getByRole('alert').isVisible());
          assert.equal(await sell.getAttribute('open'),null);
          await page.keyboard.press('Escape');
          assert.equal(await reference.evaluate(e=>e===document.activeElement),true);
        }
        await reference.click();
        assert.equal((await typeOf(editor.locator('[name="entry-value"]'))).height,44);
        await editor.locator('[name="entry-value"]').fill('mobile.bg/obiava-123456789');
        await readable(page,`${width}-sell-reference-editor`);
        await editor.getByRole('button',{name:'Запазете',exact:true}).click();
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
        assert.match(await page.evaluate(()=>window.__tradeinCopiedText),/Демонстрационно запитване: замяна[\s\S]*Обява: https:\/\/mobile.bg\/obiava-123456789/);
        await sell.getByRole('button',{name:'Редактирайте',exact:true}).click();
        await sell.locator('[name="reference"]').fill('');
        await sell.locator('.dn-tradein-primary').click();
        assert.equal(await sell.locator('[name="make"]').evaluate(e=>e===document.activeElement),true);
        await sell.locator('[name="reference"]').fill('invalid');
        await sell.locator('.dn-tradein-primary').click();
        assert(await sell.locator('#tradein-reference-edit-error').isVisible());
        await sell.locator('[name="reference"]').fill('wba00000000000001');
        await page.waitForFunction(() => document.querySelector('.dn-tradein-dialog[open] [name="make"]')?.required === false);
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
        await editor.getByRole('button',{name:'Запазете',exact:true}).click();
        assert.equal(await reference.innerText(),'WBA00000000000001');
        await reference.click();
        await editor.locator('[name="entry-value"]').fill('');
        await editor.getByRole('button',{name:'Запазете',exact:true}).click();
        assert.equal(await reference.innerText(),'Линк или VIN');
        await start.click();
        await sell.locator('.dn-tradein-primary').click();
        assert.equal(await sell.locator('[name="make"]').evaluate(e=>e===document.activeElement),true);
        await page.keyboard.press('Escape');
        await page.locator('.dn-tradein-info-drawer__peek').click();
        const sellHelp=page.locator('.dn-tradein-info-dialog');
        const sellHelpReturn=sellHelp.getByRole('button',{name:'Към запитването',exact:true});
        assert.equal((await typeOf(sellHelpReturn)).height,44);
        const sellHelpReturnBox=await sellHelpReturn.boundingBox();
        assert(sellHelpReturnBox && sellHelpReturnBox.width <= 201, 'Sell help return action stays compact');
        assert.equal(await sellHelp.getByRole('link').count(),0);
        if(width<768) assert((await sellHelp.boundingBox()).y >= 83, 'Sell help remains a bottom sheet');
        await readable(page,`${width}-sell-help`);
        await sellHelpReturn.click();
        assert.equal(await page.locator('.dn-tradein-info-drawer__peek').evaluate(e=>e===document.activeElement),true);

        await page.goto(`${base}/contact?topic=import`,{waitUntil:'networkidle'});
        const importStart=page.locator('.dn-enquiry-import-go');
        assert.equal((await typeOf(importStart)).size,16);
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
        assert(importMode.size === 16 && importMode.weight === 500);
        assert.equal((await typeOf(page.locator('.dn-enquiry-import-field'))).height,44);
        await importStart.click();
        assert(await editor.isVisible());
        assert.equal((await typeOf(editor.locator('[name="entry-value"]'))).height,44);
        await editor.locator('[name="entry-value"]').fill('javascript:alert(1)');
        await editor.getByRole('button',{name:'Запазете',exact:true}).click();
        assert(await editor.getByRole('alert').isVisible());
        await editor.locator('[name="entry-value"]').fill('https://example.com/car');
        await readable(page,`${width}-import-link-editor`);
        await editor.getByRole('button',{name:'Запазете',exact:true}).click();
        assert.equal(await importStart.evaluate(e=>e===document.activeElement),true);
        await importStart.click();
        const enquiry=page.locator('.dn-enquiry');
        assert.equal(await enquiry.getAttribute('open'),'');
        assert.equal((await typeOf(enquiry.locator('.dn-enquiry-fields input').first())).height,44);
        assert.equal((await typeOf(enquiry.locator('.dn-enquiry-footer .dn-enquiry-primary'))).height,44);
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
        await editor.getByRole('button',{name:'Запазете',exact:true}).click();
        assert(await editor.getByRole('alert').isVisible());
        await editor.locator('[name="entry-budget"]').fill('40000');
        await readable(page,`${width}-import-info-editor`);
        await editor.getByRole('button',{name:'Запазете',exact:true}).click();
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
        assert.match(await enquiry.locator('.dn-enquiry-summary').innerText(),/Изисквания: BMW X5[\s\S]*40000 EUR/);
        await page.keyboard.press('Escape');
        await page.getByRole('button',{name:'Линк',exact:true}).click();
        assert.equal(await importEntry.innerText(),'https://example.com/car');
        await readable(page,`${width}-import`);
        await page.locator('.dn-import-info-drawer__peek').click();
        const importHelp=page.locator('.dn-import-info-dialog');
        const importHelpReturn=importHelp.getByRole('button',{name:'Към запитването',exact:true});
        assert.equal((await typeOf(importHelpReturn)).height,44);
        const importHelpReturnBox=await importHelpReturn.boundingBox();
        assert(importHelpReturnBox && importHelpReturnBox.width <= 201, 'Import help return action stays compact');
        assert.equal(await importHelp.getByRole('link').count(),0);
        if(width<768) assert((await importHelp.boundingBox()).y >= 83, 'Import help remains a bottom sheet');
        await readable(page,`${width}-import-help`);
        await importHelpReturn.click();
        assert.equal(await page.locator('.dn-import-info-drawer__peek').evaluate(e=>e===document.activeElement),true);
        assert.deepEqual(errors,[]);
      } finally { await page.close(); }
    });
  }

  for (const height of [667,712,844]) {
    await suite.check(`mobile workflow dock 385x${height}`, async () => {
      const page = await returningPage(browser, { viewport: { width: 385, height }, reducedMotion: 'reduce' });
      try {
        for (const topic of ['trade-in','import']) {
          await page.goto(`${base}/contact?topic=${topic}`, { waitUntil: 'networkidle' });
          const drawer = page.locator(topic === 'import' ? '.dn-import-info-drawer__peek' : '.dn-tradein-info-drawer__peek');
          const dialog = page.locator(topic === 'import' ? '.dn-import-info-dialog' : '.dn-tradein-info-dialog');
          const action = page.locator(topic === 'import' ? '.dn-enquiry-import-go' : '.dn-tradein-start');
          const [drawerBox, navBox, actionBox] = await Promise.all([
            drawer.boundingBox(), page.locator('.dn-mobile-bottom-nav').boundingBox(), action.boundingBox()
          ]);
          assert(drawerBox && navBox && actionBox);
          assert(drawerBox.y + drawerBox.height <= navBox.y + 1, `${topic}: drawer must stay above bottom nav`);
          assert(Math.abs(actionBox.width - 180) < 1 && Math.abs(actionBox.height - 44) < 1, `${topic}: compact CTA geometry`);
          assert.equal(await page.locator('.dn-workflow-support').isVisible(), false, `${topic}: mobile support banner stays out of the primary flow`);
          await drawer.click();
          const dialogBox=await dialog.boundingBox();
          assert(dialogBox && dialogBox.y >= 83, `${topic}: sheet keeps visible top breathing room`);
          assert.equal(await page.locator('.dn-mobile-bottom-nav').evaluate(e => getComputedStyle(e).visibility), 'hidden');
          const returnAction=dialog.getByRole('button',{name:'Към запитването',exact:true});
          const returnBox=await returnAction.boundingBox();
          assert(returnBox && returnBox.height === 44 && returnBox.width <= 201, `${topic}: sheet return action stays compact`);
          assert.equal(await dialog.getByRole('link').count(),0, `${topic}: sheet does not repeat header contact actions`);
          await returnAction.click();
          assert.equal(await drawer.evaluate(e=>e===document.activeElement),true);
        }
      } finally { await page.close(); }
    });
  }
} finally { await browser.close(); await suite.finish(); }
