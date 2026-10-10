import { chromium } from 'playwright';
import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import { getFilterSections } from '../.qa/domain/native-filter-fields.mjs';
import { defaultFilters } from '../.qa/domain/types.mjs';
const base=process.env.QA_URL||'http://127.0.0.1:6424';
const output=process.env.QA_OUTPUT||'reference/web/pass4-resources';await fs.mkdir(output,{recursive:true});
const browser=await chromium.launch({headless:true,channel:'chrome'});const results=[];
const cases=[['car',{}],['car-lease',{payment:'lease'}],['car-electric',{fuel:['Electric']}],['car-new',{condition:['New']}],['bike',{category:'bike'}],['ebike',{category:'electric-bike'}],['motorhome',{category:'motorhome'}],...['Over 7.5 t','Trailer','Up to 7.5 t','Semi-Trailer Truck','Semi-trailer','Buses','Agriculture','Construction','Forklift'].map(name=>[name,{category:'truck',details:['truckCategory='+name]}])];
for(const [name,patch] of cases){
 const filters={...structuredClone(defaultFilters),...patch};const context=await browser.newContext({viewport:{width:427,height:872},deviceScaleFactor:1});
 await context.addInitScript(filters=>{if(!localStorage.getItem('mobile-reference-v1'))localStorage.setItem('mobile-reference-v1',JSON.stringify({filters}));},filters);
 const page=await context.newPage();page.setDefaultTimeout(15000);const errors=[];page.on('pageerror',e=>errors.push(e.message));
 try{
  const response=await page.goto(base+'/search/filters',{waitUntil:'networkidle',timeout:90000});assert.equal(response.status(),200);await page.locator('[data-hydrated="true"]').waitFor();await page.getByRole('button',{name:'Show all filters',exact:true}).click();
  const fields=getFilterSections(filters).flatMap(group=>group.fields);
  for(const field of fields){assert.equal(await page.locator('[data-filter-id="'+field.id+'"]').count(),1,name+': '+field.label);}
  assert.deepEqual(errors,[]);await page.screenshot({path:output+'/'+name.replace(/[^a-zA-Z0-9]/g,'-')+'.png'});results.push({name,fields:fields.length,pass:true});console.log('PASS',name,fields.length);
 }catch(error){results.push({name,pass:false,error:error.message,errors});console.error('FAIL',name,error.message);await page.screenshot({path:output+'/failure-'+results.length+'.png'}).catch(()=>{});}
 await context.close();await fs.writeFile(output+'/report.json',JSON.stringify(results,null,2));
}
await browser.close();if(results.some(result=>!result.pass))process.exitCode=1;
