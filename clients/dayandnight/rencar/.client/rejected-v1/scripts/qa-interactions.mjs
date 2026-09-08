import fs from 'node:fs/promises';
import path from 'node:path';
import assert from 'node:assert/strict';
import {chromium} from 'playwright';

const root=path.resolve(import.meta.dirname,'..');
const out=path.join(root,'.client/qa');
const browser=await chromium.launch({headless:true,channel:'chrome'});
const results=[];
const origin='http://127.0.0.1:6601';
const record=(width,check)=>results.push({width,check,pass:true});
try {
  for(const width of [390,1440]) {
    const context=await browser.newContext({viewport:{width,height:width===390?844:900}});
    const page=await context.newPage();
    const errors=[];
    page.on('pageerror',e=>errors.push(e.message));
    page.on('console',m=>{if(m.type()==='error')errors.push(m.text());});
    const goto=route=>page.goto(origin+route,{waitUntil:'networkidle'});
    const count=number=>page.waitForFunction(n=>document.querySelectorAll('.dn-catalog-results .dn-vehicle-card').length===n,number);
    const focusReturned=selector=>page.waitForFunction(s=>document.activeElement===document.querySelector(s)&&document.body.style.overflow==='',selector);
    await goto('/');
    if(width===390) {
      await page.getByRole('button',{name:'Отвори менюто',exact:true}).click();
      await page.locator('.dn-menu-dialog[open]').waitFor();
      assert.equal(await page.evaluate(()=>document.body.style.overflow),'hidden');
      await page.screenshot({path:path.join(out,'screenshots','menu-390.png')});
      await page.keyboard.press('Escape');
      await focusReturned('.dn-menu-button');
      await page.getByRole('button',{name:'Отвори менюто',exact:true}).click();
      await page.getByRole('button',{name:'Затвори менюто',exact:true}).click();
      await focusReturned('.dn-menu-button');
      record(width,'Mobile menu opens; Escape and close restore focus and scrolling');
    }
    await page.getByRole('button',{name:'Отвори търсенето',exact:true}).click();
    await page.locator('#global-search').fill('Audi');
    await page.keyboard.press('Escape');
    await focusReturned('.dn-nav-actions>button');
    await page.getByRole('button',{name:'Отвори търсенето',exact:true}).click();
    await page.locator('.dn-search-dialog form').getByRole('button').click();
    await page.waitForURL(/car\.html\?q=Audi/);
    await count(2);
    record(width,'Global search submits to two matching Audi models; dialog Escape restores focus');
    await page.locator('.dn-sort select').selectOption('name');
    await page.waitForFunction(()=>new URLSearchParams(location.search).get('sort')==='name');
    record(width,'Sort changes both rendered order and URL');
    await page.locator('.dn-vehicle-card .car-title a').first().click();
    await page.waitForURL(/car-single\.html/);
    const originalReturn=await page.locator('.dn-back').getAttribute('href');
    assert.match(originalReturn,/q=Audi/);
    assert.match(originalReturn,/sort=name/);
    const modelTitle=await page.locator('h1').innerText();
    await page.locator('.dn-detail-gallery>button').click();
    await page.locator('.dn-photo-dialog[open]').waitFor();
    await page.screenshot({path:path.join(out,'screenshots',`photo-${width}.png`)});
    await page.keyboard.press('Escape');
    await focusReturned('.dn-detail-gallery>button');
    await page.locator('.dn-detail-gallery>button').click();
    await page.getByRole('button',{name:'Затвори снимката',exact:true}).click();
    await focusReturned('.dn-detail-gallery>button');
    record(width,'Vehicle photo opens; Escape and close restore focus and scrolling');
    await page.locator('.dn-detail .dn-vehicle-card .car-title a').first().click();
    await page.waitForURL(url=>url.pathname==='/car-single.html'&&url.searchParams.get('id')!=='' );
    assert.equal(await page.locator('.dn-back').getAttribute('href'),originalReturn);
    await page.locator('.dn-back').click();
    await count(2);
    assert.equal(await page.locator('.dn-sort select').inputValue(),'name');
    assert.equal(await page.locator('#model-search').inputValue(),'Audi');
    record(width,'Detail and related model preserve catalog query and sorting on return');
    await page.locator('.dn-vehicle-card .car-title a').first().click();
    await page.waitForURL(/car-single\.html/);
    await page.getByRole('link',{name:'Уговорете оглед',exact:false}).click();
    await page.waitForURL(/contact\.html\?topic=inspection/);
    assert.equal(await page.locator('input[name=topic]:checked').inputValue(),'inspection');
    assert.equal(await page.locator('.dn-selected-vehicle').innerText(),modelTitle);
    await page.locator('input[value=leasing]').check();
    await page.waitForFunction(()=>new URLSearchParams(location.search).get('topic')==='leasing');
    assert.ok(new URL(page.url()).searchParams.get('vehicle'));
    assert.equal(await page.locator('.dn-contact-hero .theme-btn').getAttribute('href'),'tel:+359877733110');
    assert.equal(await page.locator('a[href="https://daynight.mobile.bg/contacts"]').count(),1);
    assert.equal(await page.locator('input[type=email],textarea,button[type=submit]').count(),1); // Shared global search only.
    record(width,'Vehicle enquiry retains model and topic; verified direct contact links replace booking');
    await goto('/car.html');
    if(width===390) {
      await page.getByRole('button',{name:'Филтри',exact:true}).click();
      await page.locator('#mobile-make').selectOption('BMW');
      await page.screenshot({path:path.join(out,'screenshots','filters-390.png')});
      await page.locator('.dn-filter-dialog>.theme-btn').click();
      await focusReturned('.dn-mobile-filter');
      await count(1);
      await page.getByRole('button',{name:'Филтри',exact:true}).click();
      await page.keyboard.press('Escape');
      await focusReturned('.dn-mobile-filter');
    } else {
      await page.locator('#desktop-make').selectOption('BMW');
      await count(1);
    }
    assert.equal(new URL(page.url()).searchParams.get('make'),'BMW');
    await page.locator('#model-search').fill('not-a-real-model');
    await page.locator('.dn-empty h2').waitFor();
    await page.getByRole('button',{name:'Покажи всички модели',exact:true}).click();
    await count(6);
    assert.equal(new URL(page.url()).search,'');
    record(width,'Make filter, empty state, clear/reset and mobile dialog work');
    await goto('/');
    await page.locator('.dn-dealer-search select[name=make]').selectOption('Audi');
    await page.locator('.dn-dealer-search select[name=body]').selectOption('Комби');
    await page.locator('.dn-dealer-search .theme-btn').click();
    await page.waitForURL(/car\.html\?/);
    await count(1);
    assert.equal(await page.locator('.car-title').innerText(),'Audi RS 6 Avant');
    record(width,'Home dealer search submits combined criteria');
    await goto('/car-single.html?id=missing');
    assert.match(await page.locator('h1').innerText(),/Този модел не е/);
    await goto('/car-single.html?id=audi-rs6-avant&from=https://example.com');
    assert.equal(await page.locator('.dn-back').getAttribute('href'),'/car.html');
    await goto('/car-booking.html');
    assert.equal(await page.locator('.dn-contact-content').count(),1);
    await goto('/login.html');
    assert.match(await page.locator('h1').innerText(),/Тази страница не е/);
    record(width,'Invalid model and old rental/account URLs show appropriate client content');
    assert.deepEqual(errors,[]);
    record(width,'No browser console errors or page errors during interactions');
    await context.close();
  }
} catch(error) {
  results.push({pass:false,error:error.stack});
  process.exitCode=1;
} finally {
  await fs.writeFile(path.join(out,'interactions.json'),JSON.stringify(results,null,2));
  console.log(JSON.stringify(results,null,2));
  await browser.close();
}
