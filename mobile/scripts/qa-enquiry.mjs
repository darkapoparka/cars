import { chromium } from 'playwright';
import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import sharp from 'sharp';
const base=process.env.QA_URL||'http://127.0.0.1:6424';
const output=process.env.QA_OUTPUT||'reference/web/recovery-20260927/enquiry';
await fs.mkdir(output,{recursive:true});
const browser=await chromium.launch({headless:true,channel:'chrome'});const report=[];
async function go(p){await p.goto(base+'/vehicle/bmw-540/message',{waitUntil:'networkidle',timeout:90000});await p.locator('[data-hydrated="true"]').waitFor();}
async function shot(p,name,native){
 await p.evaluate(()=>document.fonts.ready);const image=await sharp(await p.screenshot()).resize(427,872).png().toBuffer();
 await fs.writeFile(output+'/'+name+'.png',image);
 if(native){const reference=await fs.readFile('reference/android/normalized/'+native+'.png');await sharp({create:{width:854,height:872,channels:4,background:'#fff'}}).composite([{input:reference,left:0,top:0},{input:image,left:427,top:0}]).png().toFile(output+'/compare-'+name+'.png');}
}
async function scenario(name,run){
 if(process.env.QA_TEST&&!new RegExp(process.env.QA_TEST,'i').test(name))return;
 const context=await browser.newContext({viewport:{width:427,height:872},deviceScaleFactor:3,isMobile:true,hasTouch:true,timezoneId:'Europe/Sofia'});
 const p=await context.newPage();p.setDefaultTimeout(25000);const errors=[],external=[];
 // Official Playwright Clock API: fixed Date, live timers for navigation and animations.
 await p.clock.setFixedTime(new Date('2026-09-27T09:00:00Z'));
 p.on('pageerror',e=>errors.push(e.message));p.on('request',r=>{if(/^https?:/.test(r.url())&&new URL(r.url()).origin!==new URL(base).origin)external.push(r.url());});
 try{await run(p);assert.deepEqual(errors,[]);assert.deepEqual(external,[]);report.push({name,pass:true});console.log('PASS',name);}
 catch(e){report.push({name,pass:false,error:e.message,errors,external});await shot(p,'failure-'+report.length).catch(()=>{});console.error('FAIL',name,e.message);}
 finally{await context.close();await fs.writeFile(output+'/report.json',JSON.stringify({at:new Date().toISOString(),base,scenarios:report},null,2));}
}
async function open(p,kind){await p.getByRole('switch',{name:'Select '+kind,exact:true}).click();await p.getByRole('button',{name:'Open '+kind.toLowerCase()+' input',exact:true}).click();}
async function choice(p,label,value){await p.getByRole('button',{name:'Open '+label.toLowerCase()+' selection',exact:true}).click();await p.getByRole('dialog').last().getByRole('radio',{name:value,exact:true}).click();}
try {
await scenario('Onsite calendar, time choices, cancellation and nested scroll locking',async p=>{
 await go(p);await open(p,'Onsite visit');await shot(p,'onsite','313-onsite-input');
 assert.equal(await p.getByRole('button',{name:'Add',exact:true}).isDisabled(),true);
 await p.getByRole('button',{name:'Open date selection'}).click();await shot(p,'calendar','314-visit-date-picker');
 await p.getByRole('button',{name:'Monday, September 28, 2026',exact:true}).click();await p.getByRole('dialog',{name:'Select Date',exact:true}).getByRole('button',{name:'OK',exact:true}).click();
 await shot(p,'times','315-visit-time-options');await p.getByRole('dialog',{name:'Time',exact:true}).getByRole('radio',{name:'08:30',exact:true}).click();
 await p.getByRole('button',{name:'Add',exact:true}).click();await p.getByText('28.09.2026 • 08:30',{exact:true}).waitFor();
 await p.getByRole('button',{name:'Open onsite visit input'}).click();await p.getByRole('button',{name:'Open date selection'}).click();
 await p.getByRole('button',{name:'Tuesday, September 29, 2026',exact:true}).click();await p.getByRole('dialog',{name:'Select Date',exact:true}).getByRole('button',{name:'Cancel',exact:true}).click();
 assert.match(await p.getByRole('button',{name:'Open date selection'}).innerText(),/28\.09\.2026/);
 assert.equal(await p.evaluate(()=>document.body.style.overflow),'hidden');
 await p.getByRole('dialog',{name:'Onsite visit',exact:true}).getByRole('button',{name:'Cancel',exact:true}).click();
 assert.equal(await p.evaluate(()=>document.body.style.overflow),'');
});
await scenario('Trade-in basics and native dependent option sheets',async p=>{
 await go(p);await open(p,'Trade-in');await shot(p,'trade-empty','316-trade-in-input');
 assert.equal(await p.getByRole('button',{name:'Next',exact:true}).isDisabled(),true);
 await choice(p,'brand','BMW');await choice(p,'model','120');await choice(p,'first registration year','2024');await choice(p,'first registration month','January');
 await p.getByRole('textbox',{name:'Mileage',exact:true}).fill('78000');await p.getByRole('button',{name:'Next',exact:true}).click();await shot(p,'trade-optional','323-trade-step-two');
 await p.getByRole('button',{name:'Open fuel type selection'}).click();await shot(p,'trade-fuel','326-trade-fuel-options');
 assert.equal(await p.getByRole('dialog',{name:'Fuel Type',exact:true}).getByRole('radio').count(),2);await p.getByRole('radio',{name:'Petrol',exact:true}).click();
 await p.getByRole('button',{name:'Open transmission selection'}).click();await shot(p,'trade-transmission','327-trade-transmission-options');await p.getByRole('radio',{name:'Automatic',exact:true}).click();
 await p.getByRole('button',{name:'Open power/ps selection'}).click();await shot(p,'trade-power','328-trade-power-options');await p.getByRole('radio',{name:'170 HP (125 kW)',exact:true}).click();
 await choice(p,'fuel type','Diesel');assert.match(await p.getByRole('button',{name:'Open transmission selection'}).innerText(),/Choose Transmission/);assert.equal(await p.getByRole('button',{name:'Open power/ps selection'}).isDisabled(),true);
 await p.getByRole('button',{name:'Add',exact:true}).click();await p.getByText('BMW • 120 • 2024 • 78,000 km',{exact:true}).waitFor();
});
await scenario('Changing a confirmed appointment clears its old time without saving cancelled edits',async p=>{
 await go(p);await open(p,'Onsite visit');await p.getByRole('button',{name:'Open date selection'}).click();
 await p.getByRole('dialog',{name:'Select Date',exact:true}).getByRole('button',{name:'OK',exact:true}).click();await p.getByRole('radio',{name:'10:00',exact:true}).click();
 await p.getByRole('button',{name:'Add',exact:true}).click();await p.getByRole('button',{name:'Open onsite visit input'}).click();
 await p.getByRole('button',{name:'Open date selection'}).click();await p.getByRole('button',{name:'Monday, September 28, 2026',exact:true}).click();await p.getByRole('dialog',{name:'Select Date',exact:true}).getByRole('button',{name:'OK',exact:true}).click();await p.keyboard.press('Escape');
 assert.equal(await p.getByRole('button',{name:'Add',exact:true}).isDisabled(),true);
 await p.getByRole('dialog',{name:'Onsite visit',exact:true}).getByRole('button',{name:'Cancel',exact:true}).click();await p.getByText('27.09.2026 • 10:00',{exact:true}).waitFor();
});
await scenario('Delivery editor stays local and cancellation does not overwrite applied input',async p=>{
 await go(p);await open(p,'Delivery');await p.getByRole('textbox',{name:'Zip code',exact:true}).fill('10115');await p.getByRole('textbox',{name:'City',exact:true}).fill('Berlin');
 await p.getByRole('button',{name:'Add',exact:true}).click();await p.getByText('10115 • Berlin',{exact:true}).waitFor();
 await p.getByRole('button',{name:'Open delivery input'}).click();await p.getByRole('textbox',{name:'City',exact:true}).fill('Cancelled city');await p.getByRole('button',{name:'Cancel',exact:true}).click();
 await p.getByText('10115 • Berlin',{exact:true}).waitFor();
 assert.ok(!(await p.evaluate(()=>localStorage.getItem('mobile-reference-v1')||'')).includes('10115'));
});
await scenario('Enquiry pages and nested calendar fit 320px and 427px without clipping',async p=>{
 for(const width of [320,427]){
  await p.setViewportSize({width,height:872});await go(p);await open(p,'Trade-in');
  assert.ok(await p.getByRole('dialog',{name:'Trade in your car',exact:true}).evaluate(el=>el.scrollWidth<=el.clientWidth));
  const next=await p.getByRole('button',{name:'Next',exact:true}).boundingBox();assert.ok(next.y+next.height<=872);
  await p.keyboard.press('Escape');await open(p,'Onsite visit');await p.getByRole('button',{name:'Open date selection'}).click();
  const bounds=await p.getByRole('dialog',{name:'Select Date',exact:true}).boundingBox();assert.ok(bounds.x>=0&&bounds.x+bounds.width<=width&&bounds.y>=0&&bounds.y+bounds.height<=872);
  await p.keyboard.press('Escape');await p.getByRole('dialog',{name:'Onsite visit',exact:true}).getByRole('button',{name:'Cancel',exact:true}).click();
 }
});
} finally { await browser.close(); }
console.log('ENQUIRY_QA',report.filter(x=>x.pass).length+'/'+report.length);if(report.some(x=>!x.pass))process.exitCode=1;
