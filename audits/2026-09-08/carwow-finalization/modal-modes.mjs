import { chromium } from '../../../templates/carwow/node_modules/playwright/index.mjs';
import { strict as assert } from 'node:assert';
import fs from 'node:fs/promises';
const b=await chromium.launch({channel:'chrome',headless:true});const result=[];
try{
 const p=await b.newPage({viewport:{width:390,height:844},reducedMotion:'reduce'});
 await p.goto('http://127.0.0.1:6463/inventory',{waitUntil:'networkidle'});
 for(const selector of ['.mobile-inventory-search','.mobile-inventory-filter-chip','.mobile-inventory-sort-chip','.mobile-inventory-make-chip','.mobile-inventory-model-chip']){
  const trigger=p.locator(selector).first();
  try{await trigger.click({timeout:4000});const d=p.locator('dialog.mobile-fullsheet');await d.waitFor();await d.locator('button').first().focus();await p.keyboard.press('Shift+Tab');assert(await p.evaluate(()=>Boolean(document.activeElement?.closest('.mobile-fullsheet'))));await p.keyboard.press('Escape');await d.waitFor({state:'detached'});assert(await trigger.evaluate(e=>e===document.activeElement));result.push({selector,pass:true});}
  catch(e){result.push({selector,pass:false,error:e.message});await p.keyboard.press('Escape');}
 }
 const priceTrigger=p.locator('.mobile-inventory-filter-chip');await priceTrigger.click();await p.locator('dialog').getByRole('button',{name:'Цена',exact:true}).click();await p.locator('dialog button').first().focus();await p.keyboard.press('Shift+Tab');assert(await p.evaluate(()=>Boolean(document.activeElement?.closest('.mobile-fullsheet'))));await p.keyboard.press('Escape');await p.locator('dialog.mobile-fullsheet').waitFor({state:'detached'});result.push({selector:'Price submode Escape focus',pass:await priceTrigger.evaluate(e=>e===document.activeElement)});
 await p.goto('http://127.0.0.1:6463/',{waitUntil:'networkidle'});
 const menu=p.getByRole('button',{name:'Меню',exact:true});await menu.click();await p.locator('#mobile-menu-sheet').waitFor();await p.keyboard.press('Escape');await p.locator('#mobile-menu-sheet').waitFor({state:'hidden'});result.push({selector:'Menu Escape focus',pass:await menu.evaluate(e=>e===document.activeElement)});
}finally{await b.close();await fs.writeFile(new URL('./modal-modes.json',import.meta.url),JSON.stringify(result,null,2));}
console.log(JSON.stringify(result,null,2));if(result.some(r=>!r.pass))process.exitCode=1;
