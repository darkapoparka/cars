import { chromium } from 'playwright';
import fs from 'node:fs/promises';
import sharp from 'sharp';
import { exportReferenceReview } from './export-reference-review.mjs';
const base=process.env.QA_URL||'http://127.0.0.1:6424';
const out=process.env.QA_OUTPUT||'reference/web/parity-followup-20260928/visual';
await fs.mkdir(out,{recursive:true});
const browser=await chromium.launch({headless:true,channel:'chrome'});
const report=[];
const click=(name,exact=true)=>async page=>page.getByRole('button',{name,exact}).click();
const specs=[
 ['home','/','17-home'],['search','/search','02-search-cars'],['profile','/profile','18-profile'],
 ['sell','/sell','26-sell'],['park','/car-park','12-car-park'],['searches','/my-searches','11-my-searches'],
 ['detail','/vehicle/bmw-x6','08-detail'],['results','/results?makes=BMW','07-results-clean'],
 ['makes','/search','123-all-makes-current',click('All Makes')],
 ['models','/search','201-bmw-models',click('BMW')],
 ['model-family','/search','202-bmw-1-series',async p=>{await click('BMW')(p);await click('Expand 1 Series')(p);}],
 ['advanced','/search/filters','46-more-filters',null,{filters:{makes:['BMW']}}],
 ['condition','/search','41-condition',click(/^Condition/,false),{filters:{makes:['BMW']}}],
 ['financial','/search','42-financial',click(/^Financial/,false),{filters:{makes:['BMW']}}],
 ['technical','/search','43-technical',async p=>{await click(/^Technical data/,false)(p);await p.evaluate(()=>window.scrollTo(0,80));},{filters:{makes:['BMW']}}],
 ['language','/settings/language','112-language-native'],['notifications','/settings/notifications','111-notifications-native'],
 ['message','/vehicle/bmw-x6/message','119-native-message'],
 ['technical-dialog','/vehicle/bmw-x6','85-x6-technical-expanded',click('Show more technical data')],
 ['features-dialog','/vehicle/bmw-x6','88-x6-features-full',click('Show more features')],
 ['gallery','/vehicle/bmw-x6/gallery','80-x6-gallery'],
 ['sort','/results?makes=BMW','61-sort',click('Sort options')],
 ['save-gate','/results','62-save-search',click('Save search')],
 ['fuel-dialog','/search/filters','59-fuel-dialog',click('Fuel type'),{filters:{makes:['BMW']}}],
 ['price-dialog','/search/filters','57-price-dialog',click('Price'),{filters:{makes:['BMW']}}],
 ['company','/company','215-company-menu'],
 ['legal','/legal','216-legal-menu'],
 ['help','/help','217-help-menu'],
 ['messages-empty','/messages','218-messages-native'],
 ['notification-inbox','/notifications','219-notification-inbox'],
 ['bike','/search','228-bike-grid',null,{filters:{category:'bike'}}],
 ['ebike','/search','221-search-ebike',null,{filters:{category:'electric-bike'}}],
 ['camper','/search','222-search-motorhome',null,{filters:{category:'motorhome'}}],
 ['trucks','/search','223-search-truck',null,{filters:{category:'truck'}}],
 ['truck-selected','/search','234-truck-filters',click('Over 7.5 t'),{filters:{category:'truck'}}],
 ['park-populated','/car-park','240-park-populated',null,{parked:['bmw-x6'],parkedAt:{'bmw-x6':1790499600000}}],
 ['park-sort','/car-park','241-park-sort',click('Sort options'),{parked:['bmw-x6'],parkedAt:{'bmw-x6':1790499600000}}],
 ['park-options','/car-park','242-park-options',click('Options for BMW X6'),{parked:['bmw-x6'],parkedAt:{'bmw-x6':1790499600000}}],
 ['followed-dealer','/my-searches?tab=dealers','208-followed-dealers',null,{dealers:['bmw-x6']}],
 ['dealer-inventory','/dealer/bmw-x6','209-dealer-offers'],
 ['dealer-information','/dealer/bmw-x6/information','207-dealer-imprint'],
];
try {
 for(const [name,route,native,setup,seed] of specs){
  if(process.env.QA_TEST&&!new RegExp(process.env.QA_TEST,'i').test(name))continue;
  const context=await browser.newContext({viewport:{width:427,height:872},deviceScaleFactor:3,isMobile:true,hasTouch:true});
  if(seed)await context.addInitScript(value=>localStorage.setItem('mobile-reference-v1',JSON.stringify(value)),seed);
  const page=await context.newPage();page.setDefaultTimeout(60000);const errors=[];
  page.on('pageerror',e=>errors.push(e.message));
  try{
   const response=await page.goto(base+route,{waitUntil:'networkidle',timeout:90000});
   await page.locator('[data-hydrated="true"]').waitFor();if(setup)await setup(page);
   await page.evaluate(()=>document.fonts.ready);await page.waitForTimeout(200);
   const web=await sharp(await page.screenshot()).resize(427,872).png().toBuffer();
   const reference=await sharp('reference/android/'+native+'.png').extract({left:0,top:168,width:1280,height:2616}).resize(427,872).png().toBuffer();
   await fs.writeFile(out+'/'+name+'.png',web);
   await sharp({create:{width:854,height:872,channels:4,background:'#ffffff'}}).composite([{input:reference,left:0,top:0},{input:web,left:427,top:0}]).png().toFile(out+'/compare-'+name+'.png');
   report.push({name,route,native,status:response.status(),errors});console.log('CAPTURE',name,response.status(),errors.length);
  }catch(error){report.push({name,route,native,error:error.message,errors});console.error('FAIL',name,error.message);}
  finally{await context.close();await fs.writeFile(out+'/report.json',JSON.stringify({at:new Date().toISOString(),base,comparisons:'Native left; browser right. Image capture is not a pixel-parity assertion.',report},null,2));}
 }
}finally{await browser.close();}
if(report.some(r=>r.error||r.status!==200||r.errors.length))process.exitCode=1;
await exportReferenceReview(out);
