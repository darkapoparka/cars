import { chromium } from 'playwright';
import fs from 'node:fs/promises';
import assert from 'node:assert/strict';
import sharp from 'sharp';
import { defaultFilters } from '../.qa/domain/types.mjs';
import { parseFilters, serializeFilters } from '../.qa/domain/search.mjs';

const base = process.env.QA_URL || 'http://127.0.0.1:6425';
const out = process.env.QA_OUTPUT || 'reference/web/parity-followup-20260928/followup';
await fs.mkdir(out, { recursive: true });
const browser = await chromium.launch({ headless: true, channel: 'chrome' });
const checks = [];
const errors = [];
const external = [];
const near = (actual, expected, label, tolerance = 3) => assert.ok(Math.abs(actual - expected) <= tolerance, `${label}: ${actual} vs ${expected}`);
async function go(page, route) {
  const response = await page.goto(base + route, { waitUntil: 'networkidle', timeout: 90000 });
  assert.equal(response.status(), 200);
  await page.locator('[data-hydrated="true"]').waitFor();
  await page.evaluate(() => document.fonts.ready);
}
async function test(name, fn) {
  const context = await browser.newContext({ viewport: { width: 427, height: 872 }, deviceScaleFactor: 1, isMobile: true, hasTouch: true });
  const page = await context.newPage();
  page.setDefaultTimeout(30000);
  page.on('pageerror', e => errors.push({name, message:e.message}));
  page.on('request', request => { if (/^https?:/.test(request.url()) && new URL(request.url()).origin !== new URL(base).origin) external.push(request.url()); });
  try { await fn(page, context); checks.push({name, passed:true}); console.log('PASS', name); }
  catch (error) { checks.push({name, passed:false, error:error.message}); await page.screenshot({path:out + '/failure-' + checks.length + '.png'}).catch(()=>{}); console.log('FAIL', name, error.message); }
  finally { await context.close(); await fs.writeFile(out + '/report.json', JSON.stringify({at:new Date().toISOString(),base,checks,errors,external}, null, 2)); }
}
try {
  await test('Native seller category sheet: four rows, 272px height, cancellation and focus restoration', async page => {
    await go(page, '/sell');
    const opener = page.getByRole('button', {name:'Create new ad', exact:true});
    await opener.click();
    const dialog = page.getByRole('dialog', {name:'Create new ad'});
    const links = dialog.getByRole('link');
    assert.equal(await links.count(), 4);
    assert.equal(await dialog.getByRole('heading').count(), 0);
    assert.equal(await dialog.getByRole('button', {name:'Cancel', exact:true}).count(), 0);
    const bounds = await dialog.boundingBox(); near(bounds.y, 600, 'sheet top'); near(bounds.height,272,'sheet height');
    for (let i=0;i<4;i++) { const b = await links.nth(i).boundingBox(); near(b.y,648+i*56,'category '+i); near(b.height,56,'row height'); }
    await page.screenshot({path:out + '/seller-sheet.png'});
    const native = await sharp('reference/android/27-create-category.png').extract({left:0,top:1968,width:1280,height:816}).resize(427,272).png().toBuffer();
    const web = await sharp(await page.screenshot()).extract({left:0,top:600,width:427,height:272}).png().toBuffer();
    const pair = await sharp({create:{width:854,height:272,channels:3,background:'#fff'}}).composite([{input:native,left:0,top:0},{input:web,left:427,top:0}]).png().toBuffer();
    await fs.writeFile(out + '/compare-seller-sheet.png', pair);
    const small = await sharp(pair).resize(640,204).jpeg({quality:45}).toBuffer();
    await fs.writeFile(out + '/seller-review.base64.txt', small.toString('base64').match(/.{1,2000}/g).join('\n'));
    await page.keyboard.press('Escape'); assert.equal(await dialog.count(),0);
    assert.equal(await opener.evaluate(el => document.activeElement === el), true);
    assert.equal(await page.evaluate(()=>document.body.style.overflow), '');
    await opener.click(); await page.mouse.click(8,180); assert.equal(await dialog.count(),0);
  });
  await test('Each seller category reaches the local login gate without losing the selected category', async page => {
    for (const category of ['Car','Motorbike','Trailer or Motorhome','Truck or Utility Vehicle']) {
      await go(page, '/sell'); await page.getByRole('button',{name:'Create new ad',exact:true}).click();
      await page.getByRole('dialog').getByRole('link',{name:category,exact:true}).click();
      await page.waitForURL('**/login?**');
      assert.equal(new URL(page.url()).searchParams.get('category'), category);
      assert.equal(await page.getByLabel('Password',{exact:true}).isDisabled(),true);
    }
  });
  await test('Damage chips reflect the actual filter and remove only that constraint', async page => {
    const f = {...structuredClone(defaultFilters),excludeDamaged:false,damagedOnly:true,fuel:['Diesel'],maxPrice:'80000'};
    await go(page,'/results?' + serializeFilters(f) + '&sort=price-desc');
    await page.getByRole('button',{name:'Remove damaged vehicle filter'}).waitFor();
    assert.match(await page.getByRole('button',{name:'Remove damaged vehicle filter'}).innerText(),/Show only/);
    await page.getByRole('button',{name:'Remove damaged vehicle filter'}).click();
    await page.waitForURL(url=>!url.searchParams.has('damagedOnly'));
    const current = parseFilters(new URL(page.url()).searchParams.toString());
    assert.equal(current.excludeDamaged,false); assert.equal(current.damagedOnly,false);
    assert.deepEqual(current.fuel,['Diesel']); assert.equal(current.maxPrice,'80000');
    assert.equal(new URL(page.url()).searchParams.get('sort'),'price-desc');
    assert.equal(await page.getByRole('button',{name:'Remove damaged vehicle filter'}).count(),0);
  });
  await test('Resetting payment does not silently switch Buy to Leasing', async page => {
    await go(page,'/results?payment=lease');
    await page.getByRole('button',{name:'Reset payment type to Buy'}).click();
    await page.waitForURL(url=>!url.searchParams.has('payment'));
    await page.getByRole('heading',{name:'4 Offers',exact:true}).waitFor();
    await page.getByRole('button',{name:'Reset payment type to Buy'}).click();
    await page.getByRole('heading',{name:'4 Offers',exact:true}).waitFor();
    assert.equal(parseFilters(new URL(page.url()).searchParams.toString()).payment,'buy');
  });
  await test('Scoped exclusion and range chips remove independently and persist through reload', async page => {
    const f = {...structuredClone(defaultFilters),makes:['BMW'],excludedModels:{BMW:['X3']},fuel:['Diesel'],maxPrice:'80000'};
    await go(page,'/results?' + serializeFilters(f));
    await page.getByRole('button',{name:'Remove excluded BMW',exact:true}).click();
    await page.waitForURL(url=>!url.searchParams.has('excludedModels'));
    let current = parseFilters(new URL(page.url()).searchParams.toString());
    assert.deepEqual(current.makes,['BMW']); assert.deepEqual(current.excludedModels,{});
    await page.getByRole('button',{name:'Remove Price range',exact:true}).click();
    await page.waitForURL(url=>!url.searchParams.has('maxPrice')); await page.reload({waitUntil:'networkidle'});
    current = parseFilters(new URL(page.url()).searchParams.toString());
    assert.deepEqual(current.fuel,['Diesel']); assert.deepEqual(current.makes,['BMW']); assert.equal(current.maxPrice,'');
  });
  await test('Gallery rows follow the captured image bounds without accumulating spacing drift', async page => {
    await go(page,'/vehicle/bmw-x6/gallery');
    const tiles = page.getByRole('button',{name:/^Open vehicle image/}); assert.equal(await tiles.count(),20);
    const xml = await fs.readFile('reference/android/80-x6-gallery.xml','utf8');
    const native = [...xml.matchAll(/<node[^>]*content-desc="Vehicle image"[^>]*bounds="\[(\d+),(\d+)\]\[(\d+),(\d+)\]"/g)].slice(0,8);
    assert.equal(native.length,8);
    for (let i=0;i<8;i++) {
      const [,x,y,r,b]=native[i].map(Number), box=await tiles.nth(i).boundingBox();
      near(box.x,x/3,'gallery x '+i); near(box.y,(y-168)/3,'gallery y '+i);
      near(box.width,(r-x)/3,'gallery width '+i); near(box.height,(b-y)/3,'gallery height '+i);
    }
    const call = await page.getByRole('button',{name:'Call',exact:true}).boundingBox(); near(call.height,48,'gallery call height');
    await page.screenshot({path:out+'/gallery.png'});
  });
  await test('Photo pan respects letterboxing, previous/next wrapping and focus restoration', async (page,context) => {
    await go(page,'/vehicle/bmw-x6/gallery');
    const tile=page.getByRole('button',{name:'Open vehicle image 1',exact:true}); await tile.click();
    const viewer=page.getByRole('dialog',{name:'Vehicle photo viewer'});
    await page.keyboard.press('+'); await page.keyboard.press('+');
    const cdp=await context.newCDPSession(page);
    await cdp.send('Input.dispatchTouchEvent',{type:'touchStart',touchPoints:[{x:200,y:420}]});
    await cdp.send('Input.dispatchTouchEvent',{type:'touchMove',touchPoints:[{x:200,y:710}]});
    await cdp.send('Input.dispatchTouchEvent',{type:'touchEnd',touchPoints:[]});
    const transform=await viewer.locator('img').evaluate(el=>getComputedStyle(el).transform);
    const translateY=Number(transform.match(/matrix\([^,]+,[^,]+,[^,]+,[^,]+,[^,]+,\s*([^\)]+)/)?.[1]);
    near(translateY,0,'contained image vertical pan',0.01);
    await viewer.getByRole('button',{name:'Previous photo',exact:true}).click(); assert.equal(await viewer.locator('output').innerText(),'20 / 20');
    await viewer.getByRole('button',{name:'Next photo',exact:true}).click(); assert.equal(await viewer.locator('output').innerText(),'1 / 20');
    await page.keyboard.press('Escape'); assert.equal(await viewer.count(),0); assert.equal(await tile.evaluate(el=>document.activeElement===el),true);
    assert.equal(await page.evaluate(()=>document.body.style.overflow),'');
  });
  await test('Native layout and sort symbols decode and reflect selected direction', async page => {
    await go(page,'/results');
    const toggle=page.getByRole('button',{name:'Toggle Views'});
    assert.match(await toggle.locator('span').first().evaluate(el=>getComputedStyle(el).maskImage),/layoutCard/);
    await page.getByRole('button',{name:'Sort options'}).click(); await page.getByRole('dialog').getByLabel('Price (lowest first)',{exact:true}).click();
    await page.waitForURL('**sort=price-asc');
    assert.match(await page.getByRole('button',{name:'Sort options'}).locator('span').first().evaluate(el=>getComputedStyle(el).maskImage),/sortAscending/);
    await page.screenshot({path:out+'/results.png'});
  });
  await test('Seller sheet remains reachable on small screens and landscape', async page => {
    for (const [width,height] of [[320,568],[375,667],[427,872],[872,427]]) {
      await page.setViewportSize({width,height}); await go(page,'/sell');
      await page.getByRole('button',{name:'Create new ad',exact:true}).click();
      const dialog=page.getByRole('dialog');
      const last=dialog.getByRole('link',{name:'Truck or Utility Vehicle',exact:true});
      await last.scrollIntoViewIfNeeded(); const box=await last.boundingBox(); assert.ok(box.y>=0 && box.y+box.height<=height+1);
      await page.keyboard.press('Escape');
    }
  });
} finally { await browser.close(); }
if (checks.some(c=>!c.passed) || errors.length || external.length) process.exitCode=1;
console.log('FOLLOWUP_SUMMARY',JSON.stringify({passed:checks.filter(c=>c.passed).length,total:checks.length,errors:errors.length,external:external.length}));
