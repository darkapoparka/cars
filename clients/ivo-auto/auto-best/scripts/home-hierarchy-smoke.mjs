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
  const typeCount = await page.locator('.dn-body-type').count();
  const brandCount = await page.locator('.dn-brand-card').count();
  assert.equal(await types.count(), width < 768 ? Math.min(typeCount, 3) : typeCount);
  assert.equal(await brands.count(), width < 768 ? Math.min(brandCount, 3) : brandCount);
  if (width === 1440) {
   for (const [cards, columns] of [[types,4],[brands,Math.min(brandCount,6)]]) {
    const rows = await cards.evaluateAll(els => [...new Set(els.map(el => Math.round(el.getBoundingClientRect().top)))]);
    assert.equal(rows.length,Math.ceil(await cards.count()/columns));
   }
  }
  if (width < 768) {
   for (const [section,count] of [['.dn-body-types',typeCount],['.dn-brand-section',brandCount]]) {
    const toggle=page.locator(`${section} .dn-discovery-toggle`);
    if (count > 3) {
     await toggle.click(); assert.equal(await toggle.getAttribute('aria-expanded'),'true');
     assert.equal(await page.locator(`${section} a[data-stock-count]:visible`).count(),count);
     await toggle.click(); assert.equal(await toggle.getAttribute('aria-expanded'),'false');
    } else {
     assert((await toggle.getAttribute('href'))?.endsWith('/listing-grid'));
    }
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
   assert(count > 0, 'Browse shortcuts must have matching cars');
  }
  results.push({width,overflow,errors,discoveryLinks:shortcuts.length});await page.close();
 }
 await writeFile(`${out}/results.json`,JSON.stringify(results,null,2));console.log(results);
} finally {await browser.close();}
