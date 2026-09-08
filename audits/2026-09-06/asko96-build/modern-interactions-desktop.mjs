import fs from 'node:fs/promises';
import {chromium} from '../../../templates/boxcar/node_modules/playwright/index.mjs';
const browser=await chromium.launch({channel:'chrome',headless:true});
const out='audits/2026-09-06/asko96-build',results=[];
for(const width of [1440]){
 const p=await browser.newPage({viewport:{width,height:900}}),r={width,errors:[]};p.on('pageerror',e=>r.errors.push(e.message));
 try{
 await p.goto('http://127.0.0.1:6612/cars',{waitUntil:'networkidle'});
 if(width===390){await p.getByRole('button',{name:'Отвори филтрите',exact:true}).click();await p.waitForTimeout(350);r.filterOpened=await p.getByRole('dialog').isVisible();await p.screenshot({path:`${out}/modern-filters-${width}.png`});await p.keyboard.press('Escape');await p.waitForTimeout(300);r.filterDismissed=await p.getByRole('dialog').count()===0;await p.getByRole('button',{name:'Меню',exact:true}).click();await p.waitForTimeout(250);r.menuText=(await p.locator('body').innerText()).slice(-3000);await p.keyboard.press('Escape');await p.waitForTimeout(200);await p.getByRole('button',{name:'Търси 16 автомобила',exact:true}).click();}
 const input=p.locator('input').filter({visible:true}).first();r.searchInputs=await input.count();await input.fill('Toyota');await input.press('Enter');await p.waitForTimeout(1200);r.searchUrl=p.url();r.text=(await p.locator('body').innerText()).slice(0,2500);await p.screenshot({path:`${out}/modern-search-${width}.png`});
 const listing=p.locator('a[href*="/listing/asko-"]').filter({visible:true}).first();r.detailHref=await listing.getAttribute('href');await listing.click();await p.waitForTimeout(800);r.detailUrl=p.url();r.phones=await p.locator('a[href^="tel:"]').evaluateAll(es=>[...new Set(es.map(e=>e.getAttribute('href')))]);await p.goBack();await p.waitForTimeout(500);r.returnUrl=p.url();
 }catch(e){r.failure=e.message}results.push(r);await p.close();await fs.writeFile(`${out}/modern-interactions-desktop.json`,JSON.stringify(results,null,2));console.log(JSON.stringify(r));
}
await browser.close();
