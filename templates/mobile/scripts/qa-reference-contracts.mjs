import { chromium } from 'playwright';
import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
const base=process.env.QA_URL||'http://127.0.0.1:6425';
const output=process.env.QA_OUTPUT||'reference/web/pass4-contracts';await fs.mkdir(output,{recursive:true});
const browser=await chromium.launch({headless:true,channel:'chrome'});const report=[];
async function go(page,route){await page.goto(base+route,{waitUntil:'networkidle',timeout:90000});await page.locator('[data-hydrated="true"]').waitFor();}
async function scenario(name,run){const context=await browser.newContext({viewport:{width:427,height:872}});const page=await context.newPage();page.setDefaultTimeout(20000);const errors=[];page.on('pageerror',e=>errors.push(e.message));try{await run(page);assert.deepEqual(errors,[]);report.push({name,pass:true});console.log('PASS',name);}catch(e){report.push({name,pass:false,error:e.message,errors});console.error('FAIL',name,e.message);await page.screenshot({path:output+'/failure-'+report.length+'.png'}).catch(()=>{});}finally{await context.close();await fs.writeFile(output+'/report.json',JSON.stringify(report,null,2));}}
try{
await scenario('Full car model catalog and independent make selections',async p=>{
 await go(p,'/search');await p.getByRole('button',{name:'BMW',exact:true}).click();await p.getByLabel('Search models',{exact:true}).fill('X6');await p.getByRole('dialog').getByLabel('X6',{exact:true}).check();await p.getByRole('dialog').getByRole('button',{name:'OK',exact:true}).click();
 await p.getByRole('button',{name:'+ Select Make / Model',exact:true}).click();await p.getByLabel('Search makes',{exact:true}).fill('Audi');await p.getByRole('dialog').getByRole('button',{name:'Audi',exact:true}).click();await p.getByLabel('Search models',{exact:true}).fill('A3');await p.getByRole('dialog').getByLabel('A3',{exact:true}).check();await p.getByRole('dialog').getByRole('button',{name:'OK',exact:true}).click();
 const state=await p.evaluate(()=>JSON.parse(localStorage.getItem('mobile-reference-v1')).filters);assert.deepEqual(state.makeModels.BMW,['X6']);assert.deepEqual(state.makeModels.Audi,['A3']);
 await p.getByRole('button',{name:/BMW.*X6/}).click();await p.getByLabel('Search models',{exact:true}).fill('X6');assert.equal(await p.getByRole('dialog').getByLabel('X6',{exact:true}).isChecked(),true);await p.getByRole('dialog').getByRole('button',{name:'Cancel',exact:true}).click();
});
await scenario('Native non-car optional model text and cancelled selection',async p=>{
 await go(p,'/search');await p.getByRole('tab',{name:'Motorbike search'}).click();await p.getByRole('button',{name:'Honda',exact:true}).click();await p.getByLabel('Model for Honda',{exact:true}).fill('CB 500');await p.getByRole('dialog').getByRole('button',{name:'OK',exact:true}).click();
 const state=await p.evaluate(()=>JSON.parse(localStorage.getItem('mobile-reference-v1')).filters);assert.equal(state.makeVariants.Honda,'CB 500');
 await p.getByRole('button',{name:'+ Select Make / Model',exact:true}).click();await p.getByRole('button',{name:'Add vehicle',exact:true}).click();await p.getByRole('dialog').getByRole('button',{name:'Yamaha',exact:true}).click();await p.getByRole('dialog').getByRole('button',{name:'Cancel',exact:true}).click();
 assert.deepEqual(await p.evaluate(()=>JSON.parse(localStorage.getItem('mobile-reference-v1')).filters.makes),['Honda']);
});
await scenario('Power units use actual native kW choices and preserve HP query values',async p=>{
 await go(p,'/search/filters');await p.locator('[data-filter-id="power"]').click();await p.getByRole('radio',{name:'kW',exact:true}).check();await p.getByRole('dialog').getByLabel('Power from',{exact:true}).fill('100');await p.getByRole('dialog').getByRole('button',{name:'OK',exact:true}).click();
 assert.equal(await p.evaluate(()=>JSON.parse(localStorage.getItem('mobile-reference-v1')).filters.minPower),'136');
});
await scenario('Location Cancel leaves saved filter values unchanged',async p=>{
 await go(p,'/search/filters');await p.locator('[data-filter-id="location"]').click();await p.getByRole('button',{name:'Open country selection',exact:true}).click();await p.getByRole('dialog').last().getByRole('button',{name:'Germany',exact:true}).click();await p.getByRole('dialog').getByRole('button',{name:'Cancel',exact:true}).click();
 const country=await p.evaluate(()=>JSON.parse(localStorage.getItem('mobile-reference-v1')||'{}').filters?.country||'');assert.equal(country,'');
});
await scenario('Checklist follows sign-in gate and saves the native guide notes locally',async p=>{
 await go(p,'/vehicle/bmw-x6');await p.getByRole('link',{name:'Checklist',exact:true}).click();await p.waitForURL('**/vehicle/bmw-x6/checklist');assert.equal(await p.getByLabel('Password',{exact:true}).isDisabled(),true);
 await p.getByRole('button',{name:'Continue in local demo',exact:true}).click();await p.getByRole('heading',{name:'Checklist',exact:true}).waitFor();await p.getByRole('heading',{name:'Documents',exact:true}).waitFor();await p.getByLabel('Checklist notes',{exact:true}).fill('Check service records at inspection.');await p.getByRole('button',{name:'Save checklist',exact:true}).click();await p.waitForURL('**/vehicle/bmw-x6');
 await go(p,'/vehicle/bmw-x6/checklist');assert.equal(await p.getByLabel('Checklist notes',{exact:true}).inputValue(),'Check service records at inspection.');
});
}finally{await browser.close();}
console.log('REFERENCE_CONTRACTS',report.filter(x=>x.pass).length+'/'+report.length);if(report.some(x=>!x.pass))process.exitCode=1;
