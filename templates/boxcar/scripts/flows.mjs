import {chromium} from 'playwright';
import assert from 'node:assert/strict';
import {writeFile} from 'node:fs/promises';
const browser=await chromium.launch({channel:'chrome'}), context=await browser.newContext({viewport:{width:1440,height:1000}}),page=await context.newPage();
const results=[]; const base='http://127.0.0.1:6450';
async function ready(){await page.waitForFunction(()=>document.documentElement.dataset.boxcarReady==='true');}
async function go(route){await page.goto(base+route,{waitUntil:'networkidle'});await ready();}
async function test(name,run){try{await run();results.push({name,passed:true});console.log('PASS',name);}catch(e){results.push({name,passed:false,error:e.message});console.log('FAIL',name,e.message);await page.screenshot({path:'qa/flow-failure-'+results.length+'.png'});}}
await test('Home make/model search and URL persistence',async()=>{
 await go('/');await page.locator('.select2-container').first().click();await page.getByRole('option',{name:'Audi',exact:true}).click();
 await page.getByRole('button',{name:'Search Cars'}).click();await page.waitForURL('**/listings/?filter-make=audi');await ready();
 assert.equal(await page.locator('article.listing-grid').count(),4);assert.equal(await page.locator('article.listing-grid:not(.listing_make-audi)').count(),0);
 await page.reload({waitUntil:'networkidle'});await ready();assert.equal(await page.locator('article.listing-grid').count(),4);
});
await test('Sort and zero-result filters',async()=>{
 await go('/listings/?filter-orderby=price-lowest');const prices=await page.locator('article.listing-grid .listing-price .price-text').allTextContents();assert.equal(prices[0].replace(/\D/g,''),'12000');
 await go('/listings/?filter-make=porsche&filter-price-to=1');assert.equal(await page.locator('article.listing-grid').count(),0);assert.ok(await page.getByText('No listings found. Try changing your filters.').isVisible());
});
await test('Pagination keeps navigation local',async()=>{await go('/listings/');await page.locator('.pagination a').filter({hasText:'2'}).click();assert.equal(await page.locator('article.listing-grid').count(),3);assert.ok(page.url().includes('page=2'));});
await test('More Filters disclosure and selection',async()=>{await go('/listings/');await page.getByText('More Filters',{exact:true}).click();assert.ok(await page.locator('.advance-search-wrapper-fields').isVisible());await page.screenshot({path:'qa/filters-open.png'});await page.getByText('More Filters',{exact:true}).click();await page.waitForTimeout(200);assert.equal(await page.locator('.advance-search-wrapper-fields').isVisible(),false);});
await test('Saved cars and comparison persist between pages',async()=>{
 await go('/listing/ranger-white-2022/');await page.locator('.action-favorite').first().click();assert.deepEqual(await page.evaluate(()=>JSON.parse(localStorage.getItem('boxcar-favorites'))),['1638']);await page.locator('.action-compare').first().click();
 await go('/listing/toyota-camry-new/');await page.locator('.action-compare').first().click();await go('/compare/');assert.equal(await page.locator('.comparison-table thead th').count(),3);await page.screenshot({path:'qa/compare-populated.png',fullPage:true});await page.getByRole('button',{name:'Remove Ranger White – 2022'}).click();assert.equal(await page.locator('.comparison-table thead th').count(),2);
});
await test('Calculator normal, zero interest, and invalid deposit',async()=>{
 await go('/calculator/');await page.getByRole('button',{name:'Calculate',exact:true}).click();assert.equal(await page.locator('.monthly-payment .value').textContent(),'$161.34');await page.locator('#loan-interest').fill('0');await page.getByRole('button',{name:'Calculate',exact:true}).click();assert.equal(await page.locator('.monthly-payment .value').textContent(),'$138.89');
 await page.locator('#loan-deposit').fill('20000');await page.getByRole('button',{name:'Calculate',exact:true}).click();assert.ok(await page.getByRole('alert').isVisible());
});
await test('Detail gallery and request dialog Escape/focus return',async()=>{
 await go('/listing/ranger-white-2022/');const first=await page.locator('.listing-detail-gallery .slick-active img').getAttribute('src');await page.locator('.listing-detail-gallery .slick-next').click();await page.waitForTimeout(400);assert.notEqual(await page.locator('.listing-detail-gallery .slick-active img').getAttribute('src'),first);await page.locator('.listing-detail-gallery .slick-active').click();assert.ok(await page.locator('dialog').isVisible());await page.keyboard.press('Escape');assert.equal(await page.locator('dialog').isVisible(),false);
 await page.getByText('Make An Offer Price',{exact:true}).click();assert.ok(await page.locator('dialog').isVisible());await page.screenshot({path:'qa/offer-dialog.png'});await page.keyboard.press('Escape');assert.equal(await page.locator('dialog').isVisible(),false);
});
await test('Mobile menu opens, expands, closes with Escape',async()=>{
 await page.setViewportSize({width:390,height:844});await go('/');await page.locator('#apus-header-mobile .btn-showmenu').click();await page.waitForTimeout(350);assert.ok(await page.locator('#apus-mobile-menu').evaluate(el=>el.classList.contains('active')));await page.screenshot({path:'qa/mobile-menu.png'});await page.locator('#apus-mobile-menu button').filter({hasText:/^Pages$/}).click();await page.waitForTimeout(350);assert.ok(await page.locator('#apus-mobile-menu a').filter({hasText:/^Calculator$/}).isVisible());await page.keyboard.press('Escape');assert.equal(await page.locator('#apus-mobile-menu').evaluate(el=>el.classList.contains('active')),false);assert.equal(await page.locator('#apus-header-mobile .btn-showmenu').evaluate(el=>el===document.activeElement),true);
});
await test('Contact form stays local and gives honest feedback',async()=>{
 await go('/contact-us/');const form=page.locator('form.wpcf7-form');await form.locator('input[name="your-first-name"]').fill('Test');await form.locator('input[name="your-last-name"]').fill('User');await form.locator('input[type=email]').fill('test@example.com');await form.locator('input[type=submit],button[type=submit]').click();assert.ok(await page.getByRole('status').filter({hasText:'No message was sent'}).isVisible());
});
await writeFile('qa/flow-report.json',JSON.stringify(results,null,2));await browser.close();if(results.some(r=>!r.passed))process.exitCode=1;

