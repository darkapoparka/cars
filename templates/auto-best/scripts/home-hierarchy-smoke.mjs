import assert from 'node:assert/strict';
import { mkdir, writeFile } from 'node:fs/promises';
import { launchBrowser, previewUrl } from './browser.mjs';
const browser = await launchBrowser();
const out = 'artifacts/home-hierarchy';
await mkdir(out, { recursive: true });
const results = [];
try {
 for (const width of [390, 1024, 1440]) {
  const page = await browser.newPage({ viewport: { width, height: 1000 } });
  const errors = []; page.on('pageerror', e => errors.push(e.message));
  await page.goto(previewUrl(), { waitUntil: 'networkidle' });
  await page.locator('.dn-body-types').scrollIntoViewIfNeeded();
  const types = page.locator('.dn-body-type:visible'), brands = page.locator('.dn-brand-card:visible');
  assert.equal(await types.count(), width < 768 ? 4 : 8);
  assert.equal(await brands.count(), width < 768 ? 4 : 12);
  if (width === 1440) {
   for (const [cards, columns] of [[types,4],[brands,6]]) {
    const rows = await cards.evaluateAll(els => [...new Set(els.map(el => Math.round(el.getBoundingClientRect().top)))]);
    assert.equal(rows.length,2); assert.equal(await cards.count()/rows.length,columns);
   }
  }
  if (width < 768) {
   for (const [section,count] of [['.dn-body-types',8],['.dn-brand-section',12]]) {
    const toggle=page.locator(`${section} .dn-discovery-toggle`);
    await toggle.click(); assert.equal(await toggle.getAttribute('aria-expanded'),'true');
    assert.equal(await page.locator(`${section} a[data-stock-count]:visible`).count(),count);
    await toggle.click(); assert.equal(await toggle.getAttribute('aria-expanded'),'false');
   }
  }
  for (const section of ['.dn-body-types','.dn-brand-section','.dn-editorial']) {
   if (await page.locator(section).count()) { await page.locator(section).scrollIntoViewIfNeeded(); await page.locator(section).screenshot({path:`${out}/${width}-${section.slice(1)}.png`}); }
  }
  const overflow = await page.evaluate(() => document.documentElement.scrollWidth > innerWidth);
  assert.equal(overflow,false);assert.deepEqual(errors,[]);
  const shortcuts=await page.locator('a[data-stock-count]').evaluateAll(els=>els.map(el=>({href:el.getAttribute('href'),count:Number(el.dataset.stockCount)})));
  if(width===1440)for(const {href,count} of shortcuts){
   await page.goto(previewUrl()+href,{waitUntil:'networkidle'});
   assert.equal(await page.locator('.dn-listing-results .dn-vehicle-card').count(),count);
   if(!count)assert(await page.getByText('Няма съвпадения',{exact:true}).isVisible());
  }
  results.push({width,overflow,errors,discoveryLinks:shortcuts.length});await page.close();
 }
 await writeFile(`${out}/results.json`,JSON.stringify(results,null,2));console.log(results);
} finally {await browser.close();}
