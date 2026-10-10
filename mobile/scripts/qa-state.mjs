import { chromium } from 'playwright';
import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
const base=process.env.QA_URL||'http://127.0.0.1:6424';
const out=process.env.QA_OUTPUT||'reference/web/pass3-state';
await fs.mkdir(out,{recursive:true});
const browser=await chromium.launch({headless:true,channel:'chrome'});
const report=[];
async function run(name,fn){
 const context=await browser.newContext({viewport:{width:427,height:872},deviceScaleFactor:1,isMobile:true,hasTouch:true});
 const page=await context.newPage();page.setDefaultTimeout(30000);const errors=[];
 page.on('pageerror',e=>errors.push(e.message));
 try{await fn(page,context);assert.deepEqual(errors,[]);report.push({name,pass:true});console.log('PASS',name);}
 catch(error){report.push({name,pass:false,error:error.message});await page.screenshot({path:out+'/failure-'+report.length+'.png'});console.error('FAIL',name,error.message);}
 finally{await context.close();await fs.writeFile(out+'/report.json',JSON.stringify({at:new Date().toISOString(),base,report},null,2));}
}
async function go(page,path){await page.goto(base+path,{waitUntil:'networkidle',timeout:90000});await page.locator('[data-hydrated="true"]').waitFor();}
async function state(page){return page.evaluate(()=>JSON.parse(localStorage.getItem('mobile-reference-v1')||'{}'));}
try{
 await run('Category changes retain independent filters and native layouts',async page=>{
  await go(page,'/results?makes=BMW&maxPrice=60000');await go(page,'/search');
  await page.getByRole('tab',{name:'Motorbike search',exact:true}).click();
  assert.deepEqual((await state(page)).filters.makes,[]);
  await page.getByRole('button',{name:'Yamaha',exact:true}).waitFor();
  await page.getByRole('tab',{name:'E-Bike search',exact:true}).click();
  assert.equal(await page.getByRole('button',{name:/^Condition/}).count(),0);
  await page.getByRole('button',{name:/^Technical data/}).click();
  await page.getByRole('slider',{name:/Frame size/}).waitFor();
  await page.getByRole('tab',{name:'Search Trucks and more'}).click();
  assert.equal(await page.getByRole('link',{name:'More filters',exact:true}).count(),0);
  await page.getByRole('button',{name:'Over 7.5 t',exact:true}).click();
  await page.getByRole('link',{name:'More filters',exact:true}).waitFor();
  assert.ok((await state(page)).filters.details.includes('truckCategory=Over 7.5 t'));
  await page.getByRole('tab',{name:'Car search',exact:true}).click();
  assert.deepEqual((await state(page)).filters.makes,['BMW']);assert.equal((await state(page)).filters.maxPrice,'60000');
  await page.getByRole('button',{name:'Reset filters',exact:true}).click();
  await page.getByRole('dialog').getByRole('button',{name:'Cancel',exact:true}).click();
  assert.equal((await state(page)).filters.maxPrice,'60000');
  await page.getByRole('button',{name:'Reset filters',exact:true}).click();
  await page.getByRole('dialog').getByRole('button',{name:'Reset search',exact:true}).click();
  assert.equal((await state(page)).filters.maxPrice,'');
 });
 await run('Notification and message entry states match the captured flow',async page=>{
  await go(page,'/messages');await page.getByRole('heading',{name:'Direct contact with buyers and potential customers'}).waitFor();
  await go(page,'/notifications');await page.getByRole('heading',{name:/Welcome to mobile.de/}).waitFor();
  assert.equal((await state(page)).readWelcome,true);
  await page.getByRole('link',{name:/Welcome to mobile.de/}).click();await page.waitForURL('**/search');
 });
 await run('Selected gallery image survives detail navigation and reload',async page=>{
  await go(page,'/vehicle/bmw-x6/gallery');await page.getByRole('button',{name:'Open vehicle image 1',exact:true}).click();
  await page.keyboard.press('ArrowRight');await page.getByRole('dialog').getByText('2 / 20',{exact:true}).waitFor();
  await page.keyboard.press('Escape');await go(page,'/vehicle/bmw-x6');
  await page.getByRole('link',{name:'Vehicle image',exact:true}).getByText('2 / 20',{exact:true}).waitFor();
  await page.getByRole('link',{name:'Vehicle image',exact:true}).focus();await page.keyboard.press('ArrowRight');
  await page.getByRole('link',{name:'Vehicle image',exact:true}).getByText('3 / 20',{exact:true}).waitFor();
  await page.reload({waitUntil:'networkidle'});
  await page.getByRole('link',{name:'Vehicle image',exact:true}).getByText('3 / 20',{exact:true}).waitFor();
 });
 await run('Dealer inventory returns to the followed-dealer tab',async page=>{
  await go(page,'/vehicle/bmw-x6');await page.getByRole('button',{name:'Follow this dealer',exact:true}).click();
  await go(page,'/my-searches?tab=dealers');
  await page.getByRole('link',{name:/Autohaus Hofmann GmbH/}).click();await page.waitForURL('**/dealer/bmw-x6');
  await page.getByRole('link',{name:'Go back',exact:true}).click();await page.waitForURL('**/my-searches?tab=dealers');
  await page.getByRole('heading',{name:'Autohaus Hofmann GmbH',exact:true}).waitFor();
 });
 await run('Visible information menus and privacy settings are interactive',async page=>{
  for(const [path,label] of [['/company','Careers'],['/legal','Privacy Settings'],['/help','For dealers']]){
   await go(page,path);await page.getByRole('button',{name:label,exact:true}).click();
   await page.getByRole('dialog').waitFor();
   if(path==='/legal'){await page.getByRole('checkbox',{name:'I have read the local-storage notice'}).check();assert.equal((await state(page)).consent,true);}
   await page.keyboard.press('Escape');assert.equal(await page.getByRole('dialog').count(),0);
  }
 });
 await run('Native Car Park menu, notes, deletion and undo retain state',async page=>{
  await go(page,'/vehicle/bmw-x6');await page.getByRole('button',{name:'Park',exact:true}).click();
  await go(page,'/car-park');await page.getByRole('heading',{name:'Car Park (1)',exact:true}).waitFor();
  await page.getByRole('button',{name:'Options for BMW X6',exact:true}).click();
  await page.getByRole('button',{name:'Notes',exact:true}).click();
  await page.getByRole('textbox',{name:'Private note',exact:true}).fill('Inspect tyres before viewing.');
  await page.getByRole('button',{name:'Save note',exact:true}).click();
  await page.reload({waitUntil:'networkidle'});await page.locator('[data-hydrated="true"]').waitFor();
  assert.equal((await state(page)).parkNotes['bmw-x6'],'Inspect tyres before viewing.');
  await page.getByRole('button',{name:'Sort options',exact:true}).click();
  await page.getByRole('radio',{name:'Price (lowest first)',exact:true}).click();
  await page.getByRole('button',{name:'Options for BMW X6',exact:true}).click();
  await page.getByRole('button',{name:'Delete',exact:true}).click();
  assert.deepEqual((await state(page)).parked,[]);
  await page.getByRole('button',{name:'Undo',exact:true}).click();
  assert.deepEqual((await state(page)).parked,['bmw-x6']);
  await go(page,'/');await page.getByRole('heading',{name:'Parked vehicles',exact:true}).waitFor();
 });
}finally{await browser.close();}
console.log('STATE_SUITE',report.filter(r=>r.pass).length+'/'+report.length);
if(report.some(r=>!r.pass))process.exitCode=1;
