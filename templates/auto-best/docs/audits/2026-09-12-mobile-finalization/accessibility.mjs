import { chromium, webkit, firefox } from 'playwright';
import fs from 'node:fs';
const base='http://127.0.0.1:6461', out='docs/audits/2026-09-12-mobile-finalization/evidence';
const axe='J:/cars/runtime/auto-best-audit-tools/package/axe.min.js';
const browser=await chromium.launch({channel:'chrome',headless:true});
const results=[];
fs.writeFileSync(`${out}/browser-availability.json`,JSON.stringify({webkit:{path:webkit.executablePath(),installed:fs.existsSync(webkit.executablePath())},firefox:{path:firefox.executablePath(),installed:fs.existsSync(firefox.executablePath())}},null,2));
const save=()=>fs.writeFileSync(`${out}/accessibility.json`,JSON.stringify({engine:'axe-core 4.13.0',notes:'Chromium emulation; third-party iframe contents excluded. Not a manual WCAG certification.',results},null,2));
async function audit(page,name){
 await page.waitForFunction(() => Boolean(document.querySelector('main'))); await page.evaluate(() => document.fonts.ready); await page.waitForTimeout(450); await page.addScriptTag({path:axe});
 const a=await page.evaluate(async()=>await window.axe.run(document,{runOnly:{type:'tag',values:['wcag2a','wcag2aa','wcag21aa','wcag22aa']},resultTypes:['violations','incomplete'],iframes:false}));
 const row={name,url:page.url(),viewport:page.viewportSize(),violations:a.violations.map(v=>({id:v.id,impact:v.impact,description:v.description,help:v.help,helpUrl:v.helpUrl,nodes:v.nodes.map(n=>({target:n.target,html:n.html,failureSummary:n.failureSummary}))})),incomplete:a.incomplete.map(v=>({id:v.id,nodes:v.nodes.length}))};
 results.push(row);save();console.log(`${name}: ${row.violations.map(v=>`${v.id}(${v.nodes.length})`).join(', ')||'no violations'}`);
}
const sitemap=await(await fetch(base+'/sitemap.xml')).text();
const routes=['/','/listing-grid','/contact','/contact?topic=trade-in','/contact?topic=import','/contact?topic=leasing&vehicle=4','/contact?topic=inspection&vehicle=1','/about-us','/blog',...sitemap.matchAll(/<loc>(.*?)<\/loc>/g)].map(r=>Array.isArray(r)?new URL(r[1]).pathname:r).filter((v,i,a)=>a.indexOf(v)===i);
for(const route of routes){
 const page=await browser.newPage({viewport:{width:390,height:844},reducedMotion:'reduce'});page.setDefaultTimeout(8000);
 try{await page.goto(base+route,{waitUntil:'domcontentloaded',timeout:30000});await audit(page,route)}catch(e){results.push({name:route,error:e.message});save()}finally{await page.close()}
}
for(const width of [320,390,430]){
 const page=await browser.newPage({viewport:{width,height:844},reducedMotion:'reduce'});page.setDefaultTimeout(8000);
 try{
  await page.goto(base,{waitUntil:'domcontentloaded',timeout:30000});
  await page.getByRole('button',{name:'Меню',exact:true}).click();await audit(page,`menu-${width}`);await page.screenshot({path:`${out}/screenshots/menu-${width}.png`});await page.keyboard.press('Escape');
  await page.getByRole('button',{name:'Търсете марка, модел или ключова дума',exact:true}).click();await audit(page,`home-search-${width}`);await page.screenshot({path:`${out}/screenshots/home-search-${width}.png`});await page.keyboard.press('Escape');
  await page.goto(base+'/listing-grid',{waitUntil:'domcontentloaded',timeout:30000});await page.locator('.dn-listing-filter__toggle').click();await audit(page,`listing-filters-${width}`);
  await page.screenshot({path:`${out}/screenshots/listing-filters-${width}.png`});
  await page.locator('.dn-mobile-filter-fields button').filter({has:page.getByText('Марка',{exact:true})}).click();await audit(page,`nested-make-${width}`);await page.screenshot({path:`${out}/screenshots/nested-make-${width}.png`});
  await page.goto(base+'/contact?topic=trade-in',{waitUntil:'domcontentloaded',timeout:30000});await page.getByRole('button',{name:'Предложи автомобил',exact:true}).click();await audit(page,`sell-step1-${width}`);await page.screenshot({path:`${out}/screenshots/sell-step1-${width}.png`});
  await page.locator('.dn-enquiry input[name=make]').fill('Audi');await page.locator('.dn-enquiry input[name=model]').fill('Audit fixture');await page.getByRole('button',{name:'Продължи',exact:true}).click();await audit(page,`sell-step2-${width}`);
  await page.getByRole('button',{name:'Прегледай запитването',exact:true}).click();await audit(page,`sell-step3-${width}`);await page.screenshot({path:`${out}/screenshots/sell-step3-${width}.png`});
 }catch(e){results.push({name:`states-${width}`,error:e.message});save()}finally{await page.close()}
}
await browser.close();save();
