import { chromium } from 'playwright';
import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
const base=process.env.QA_URL||'http://127.0.0.1:6426';
const out=process.env.QA_OUTPUT||'reference/web/make-model/flows'; await fs.mkdir(out,{recursive:true});
const browser=await chromium.launch({headless:true,channel:'chrome'});const report=[];
async function go(p,path='/search'){await p.goto(base+path,{waitUntil:'networkidle',timeout:90000});await p.locator('[data-hydrated="true"]').waitFor();}
async function state(p){return p.evaluate(()=>JSON.parse(localStorage.getItem('mobile-reference-v1')||'{}').filters);}
async function scenario(name,run,viewport={width:355,height:709}){
 const context=await browser.newContext({viewport,isMobile:true,hasTouch:true});const page=await context.newPage();page.setDefaultTimeout(30000);const errors=[];page.on('pageerror',e=>errors.push(e.message));
 try{await run(page);assert.deepEqual(errors,[]);report.push({name,pass:true});console.log('PASS',name);}catch(error){report.push({name,pass:false,error:error.message,errors});await page.screenshot({path:out+'/failure-'+report.length+'.png'}).catch(()=>{});console.error('FAIL',name,error.message);}finally{await context.close();await fs.writeFile(out+'/report.json',JSON.stringify({at:new Date().toISOString(),base,report},null,2));}
}
const dialog=p=>p.getByRole('dialog');const check=(p,name)=>p.getByRole('checkbox',{name,exact:true});
async function open(p,make){await go(p);await p.getByRole('button',{name:make,exact:true}).click();}
try{
await scenario('Mercedes model variants follow their selected rows and survive search clearing',async p=>{
 await open(p,'Mercedes-Benz');assert.equal(await p.getByLabel('Variant',{exact:true}).count(),1);
 await check(p,'190').check();assert.equal(await p.getByLabel('Variant',{exact:true}).count(),0);await p.getByLabel('Variant for 190',{exact:true}).fill('Sport');
 await check(p,'200').check();await p.getByLabel('Variant for 200',{exact:true}).fill('Automatic');
 await p.getByLabel('Search models',{exact:true}).fill('C-Class');assert.equal(await check(p,'Any').count(),0);
 await p.getByRole('button',{name:'Clear search',exact:true}).click();assert(await check(p,'190').isChecked());assert.equal(await p.getByLabel('Variant for 190').inputValue(),'Sport');
 await dialog(p).getByRole('button',{name:'OK',exact:true}).click();const f=await state(p);assert.deepEqual(f.modelVariants['Mercedes-Benz'],{'190':'Sport','200':'Automatic'});
 await p.reload({waitUntil:'networkidle'});await p.getByRole('button',{name:/^Mercedes-Benz 190 Sport, 200 Automatic$/}).click();assert.equal(await p.getByLabel('Variant for 200').inputValue(),'Automatic');
 await p.getByLabel('Variant for 190').fill('Cancelled');await dialog(p).getByRole('button',{name:'Cancel',exact:true}).click();assert.equal((await state(p)).modelVariants['Mercedes-Benz']['190'],'Sport');
});
await scenario('Family selection has a mixed checkbox and one shared family variant editor',async p=>{
 await open(p,'BMW');await check(p,'1 Series').check();await p.getByRole('button',{name:'Expand 1 Series',exact:true}).click();
 assert(await check(p,'114').isChecked());await check(p,'114').uncheck();assert(await check(p,'1 Series').evaluate(el=>el.indeterminate));
 assert.equal(await p.getByLabel('Variant for 116',{exact:true}).count(),0);await p.getByLabel('Variant for 1 Series',{exact:true}).fill('Sport');
 await dialog(p).getByRole('button',{name:'OK',exact:true}).click();const f=await state(p);assert(!f.makeModels.BMW.includes('114'));assert.equal(f.makeModels.BMW.length,9);assert(Object.values(f.modelVariants.BMW).every(value=>value==='Sport'));
 await p.getByRole('button',{name:/^BMW 116 Sport/}).click();assert(await check(p,'1 Series').evaluate(el=>el.indeterminate));assert.equal(await p.getByLabel('Variant for 1 Series').inputValue(),'Sport');
 await check(p,'Any').check();await dialog(p).getByRole('button',{name:'Cancel',exact:true}).click();assert.equal((await state(p)).makeModels.BMW.length,9);
});
await scenario('Included and excluded models have independent editable cards',async p=>{
 await open(p,'BMW');await dialog(p).getByRole('button',{name:'OK',exact:true}).click();
 await p.getByRole('button',{name:'+ Select Make / Model',exact:true}).click();await p.getByRole('switch',{name:'Exclude make'}).click();await p.getByRole('button',{name:'BMW',exact:true}).first().click();
 await p.getByLabel('Search models',{exact:true}).fill('X6');await check(p,'X6').check();await p.getByLabel('Variant for X Series',{exact:true}).fill('AHK');await dialog(p).getByRole('button',{name:'OK',exact:true}).click();
 await p.getByRole('button',{name:'Excluded BMW X6 AHK',exact:true}).click();assert.equal(await p.getByRole('switch',{name:'Exclude make'}).getAttribute('aria-checked'),'true');
 await p.getByLabel('Search models',{exact:true}).fill('X6');assert.equal(await p.getByLabel('Variant for X Series').inputValue(),'AHK');await dialog(p).getByRole('button',{name:'Cancel',exact:true}).click();
 await p.getByRole('button',{name:'Remove excluded BMW',exact:true}).click();const f=await state(p);assert.deepEqual(f.makes,['BMW']);assert.deepEqual(f.excludedModels,{});assert.deepEqual(f.excludedModelVariants,{});
});
await scenario('Per-model variants affect results and removing a make clears hidden criteria',async p=>{
 await open(p,'BMW');await p.getByLabel('Search models').fill('X6');await check(p,'X6').check();await p.getByLabel('Variant for X Series').fill('AHK');await dialog(p).getByRole('button',{name:'OK',exact:true}).click();
 await p.getByRole('link',{name:'1 Offer',exact:true}).click();await p.waitForURL('**/results?**');await p.getByRole('button',{name:'Remove BMW',exact:true}).click();
 await p.waitForFunction(()=>!new URLSearchParams(location.search).has('makes'));const f=await state(p);assert.deepEqual(f.makeModels,{});assert.deepEqual(f.modelVariants,{});assert.deepEqual(f.models,[]);
});
await scenario('Make fast-scroll indicator supports keyboard and pointer movement',async p=>{
 await go(p);await p.getByRole('button',{name:'All Makes',exact:true}).click();const rail=p.getByRole('scrollbar',{name:'Scroll makes'});await rail.waitFor();await rail.focus();await p.keyboard.press('End');
 await p.waitForFunction(()=>Number(document.querySelector('[role=scrollbar]')?.getAttribute('aria-valuenow'))>0);await rail.press('Home');await p.waitForFunction(()=>document.querySelector('[role=scrollbar]')?.getAttribute('aria-valuenow')==='0');
 const r=await rail.boundingBox();await p.mouse.move(r.x+4,r.y+20);await p.mouse.down();await p.mouse.move(r.x+4,r.y+r.height*0.8,{steps:10});await p.mouse.up();assert(Number(await rail.getAttribute('aria-valuenow'))>0);
 await p.getByLabel('Search makes').fill('Mercedes');await p.getByRole('button',{name:'Clear search'}).click();assert.equal(await p.getByLabel('Search makes').inputValue(),'');
 await p.keyboard.press('Escape');assert.equal(await dialog(p).count(),0);assert.equal(await p.evaluate(()=>document.activeElement?.textContent?.trim()),'All Makes');
});
await scenario('Make/model result counts resize the native dialog without losing selection',async p=>{
 await go(p);await p.getByRole('button',{name:'All Makes',exact:true}).click();await p.getByLabel('Search makes').fill('ZZZ999');
 let r=await dialog(p).boundingBox();assert(Math.abs(r.height-208)<2,'zero-result dialog height');
 await p.getByLabel('Search makes').fill('MINI');r=await dialog(p).boundingBox();assert(Math.abs(r.height-326)<2,'single-make dialog height');
 await dialog(p).getByRole('button',{name:'MINI',exact:true}).click();await p.getByLabel('Search models').fill('Aceman E');r=await dialog(p).boundingBox();assert(Math.abs(r.height-316)<2,'filtered family dialog height');
 await p.getByRole('checkbox',{name:'Aceman E',exact:true}).check();await p.getByLabel('Variant for Aceman').fill('Sport');await p.getByRole('button',{name:'Clear search'}).click();await p.getByRole('button',{name:'Expand Aceman',exact:true}).click();assert(await p.getByRole('checkbox',{name:'Aceman E',exact:true}).isChecked());assert.equal(await p.getByLabel('Variant for Aceman').inputValue(),'Sport');
});
await scenario('MINI same-name model and family remain independently selectable',async p=>{
 await go(p);await p.getByRole('button',{name:'All Makes',exact:true}).click();await p.getByLabel('Search makes').fill('MINI');await dialog(p).getByRole('button',{name:'MINI',exact:true}).click();
 const leaf=p.locator('[data-model-key="@model:Aceman"]'),family=p.locator('[data-model-key="Aceman"]');await leaf.check();assert.equal(await family.isChecked(),false);await family.check();assert(await leaf.isChecked());await family.uncheck();assert(await leaf.isChecked());
 await dialog(p).getByRole('button',{name:'OK',exact:true}).click();assert.deepEqual((await state(p)).makeModels.MINI,['@model:Aceman']);
});
await scenario('Advanced filters preserve excluded model editing and removal',async p=>{
 await open(p,'Mercedes-Benz');await p.getByRole('switch',{name:'Exclude make'}).click();await check(p,'190').check();await p.getByLabel('Variant for 190').fill('Sport');await dialog(p).getByRole('button',{name:'OK',exact:true}).click();
 await go(p,'/search/filters');await p.getByRole('button',{name:'Mercedes-Benz (excluded) 190 Sport',exact:true}).click();assert.equal(await p.getByRole('switch',{name:'Exclude make'}).getAttribute('aria-checked'),'true');assert(await check(p,'190').isChecked());await dialog(p).getByRole('button',{name:'Cancel',exact:true}).click();await p.getByRole('button',{name:'Remove excluded Mercedes-Benz',exact:true}).click();assert.deepEqual((await state(p)).excludedModels,{});
});
for(const viewport of [{width:320,height:568},{width:355,height:709},{width:375,height:667},{width:427,height:872},{width:740,height:360},{width:1440,height:900}]){
 await scenario('Picker bounds, fixed actions and long title at '+viewport.width+'x'+viewport.height,async p=>{
  for(const make of ['Mercedes-Benz','DS Automobiles']){
   await go(p);await p.getByRole('button',{name:'All Makes',exact:true}).click();await p.getByLabel('Search makes').fill(make);await dialog(p).getByRole('button',{name:make,exact:true}).first().click();
   const metrics=await dialog(p).evaluate(el=>{const rect=el.getBoundingClientRect(),buttons=[...el.querySelectorAll('button')].filter(el=>['Cancel','OK'].includes(el.textContent.trim()));const title=el.querySelector('h2').getBoundingClientRect(),toggle=el.querySelector('[role=switch]').parentElement.getBoundingClientRect();return {width:innerWidth,height:innerHeight,rect:rect.toJSON(),scroll:el.scrollHeight-el.clientHeight,title:title.toJSON(),toggle:toggle.toJSON(),buttons:buttons.map(el=>el.getBoundingClientRect().toJSON()),overflow:document.documentElement.scrollWidth>innerWidth};});
   assert(!metrics.overflow);assert(metrics.rect.left>=0&&metrics.rect.right<=viewport.width+1);assert(metrics.rect.top>=0&&metrics.rect.bottom<=viewport.height+1);assert(metrics.scroll<=1);assert(metrics.title.right<=metrics.toggle.left+1);assert(metrics.buttons.every(r=>r.top>=metrics.rect.top&&r.bottom<=metrics.rect.bottom+1));
   await p.locator('[data-picker-scroll=models]').evaluate(el=>el.scrollTop=el.scrollHeight);await dialog(p).getByRole('button',{name:'Cancel',exact:true}).click();
  }
 },viewport);
}
}finally{await browser.close();}
console.log('MAKE_MODEL_QA',report.filter(x=>x.pass).length+'/'+report.length);if(report.some(x=>!x.pass))process.exitCode=1;
