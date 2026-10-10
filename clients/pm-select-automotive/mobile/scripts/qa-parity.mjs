import { chromium } from 'playwright';
import assert from 'node:assert/strict';
import { mkdir, writeFile } from 'node:fs/promises';
import sharp from 'sharp';
const out=process.env.QA_OUTPUT||'reference/web/pass2';await mkdir(out,{recursive:true});
const browser=await chromium.launch({headless:true,channel:'chrome'});
const context=await browser.newContext({viewport:{width:427,height:872},deviceScaleFactor:3,hasTouch:true,isMobile:true});
const page=await context.newPage();page.setDefaultTimeout(20000);const errors=[];const checks=[];
page.on('pageerror',e=>errors.push(e.message));
const base=process.env.QA_URL||'http://127.0.0.1:6424';
async function go(route){await page.goto(base+route,{waitUntil:'networkidle',timeout:90000});await page.evaluate(()=>document.fonts.ready);}
async function snap(name){await page.evaluate(()=>document.fonts.ready);await sharp(await page.screenshot()).resize(427,872).toFile(out+'/'+name+'.png');}
async function check(name,run){try{await run();checks.push({name,pass:true});console.log('PASS',name);}catch(e){checks.push({name,pass:false,error:e.message});console.error('FAIL',name,e.message);await snap('failure-'+checks.length);}}
try{
 await check('expanded native filters',async()=>{
  await go('/search');await page.getByRole('button',{name:'Reset filters',exact:true}).click();await page.getByRole('dialog').getByRole('button',{name:'Reset search',exact:true}).click();
  await page.getByRole('button',{name:/^Condition/}).click();await snap('condition');
  await page.getByLabel('First Registration from',{exact:true}).fill('2024');await page.getByLabel('Mileage to',{exact:true}).fill('50000');
  assert.equal(await page.getByLabel('First Registration from',{exact:true}).inputValue(),'2024');
  await page.getByRole('button',{name:/^Financial/}).click();await snap('financial');
  await page.getByRole('button',{name:'Leasing',exact:true}).click();await page.getByLabel('Leasing rate to',{exact:true}).fill('500');await snap('leasing');
  await page.getByRole('button',{name:/^Technical data/}).click();await page.getByRole('button',{name:'Diesel',exact:true}).click();await snap('technical');
 });
 await check('full advanced filters and native dialogs',async()=>{
  await go('/search/filters');await page.getByRole('button',{name:'Reset search',exact:true}).click();await page.getByRole('dialog').getByRole('button',{name:'OK',exact:true}).click();await snap('advanced');
  await page.getByRole('button',{name:'Condition',exact:true}).click();await snap('condition-dialog');await page.getByRole('dialog').getByLabel('Used',{exact:true}).click();
  await page.getByRole('button',{name:'Price',exact:true}).click();await snap('price-dialog');await page.getByLabel('Price to',{exact:true}).fill('60000');await page.getByRole('dialog').getByRole('button',{name:'OK',exact:true}).click();
  await page.getByRole('button',{name:'Show all filters',exact:true}).click();assert.equal(await page.getByRole('button',{name:'Emission class',exact:true}).count(),1);
  await page.getByRole('button',{name:'Fuel type',exact:true}).click();await snap('fuel-dialog');await page.getByRole('dialog').getByLabel('Diesel',{exact:true}).check();await page.getByRole('dialog').getByRole('button',{name:'OK',exact:true}).click();
 });
 await check('filter URL and persistence',async()=>{
  await page.getByRole('link',{name:/Offers$/}).click();await page.waitForURL('**/results?**');assert.match(page.url(),/maxPrice=60000/);assert.match(page.url(),/fuel=Diesel/);
  await page.reload({waitUntil:'networkidle'});assert.equal(await page.locator('article').count(),1);
 });
}finally{await writeFile(out+'/filter-report.json',JSON.stringify({at:new Date().toISOString(),checks,errors},null,2));await browser.close();}
if(errors.length||checks.some(c=>!c.pass))process.exitCode=1;
