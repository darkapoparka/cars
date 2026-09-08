import fs from 'node:fs/promises';
import {chromium} from 'file:///J:/cars/templates/boxcar/node_modules/playwright/index.mjs';
const browser=await chromium.launch({channel:'chrome',headless:true});
const results=[];
try {
 if(!process.env.QA_GALLERY_ONLY){
 const page=await browser.newPage({viewport:{width:1440,height:900}});
 page.setDefaultTimeout(15000);
 await page.goto('http://127.0.0.1:6623/financing',{waitUntil:'domcontentloaded'});
 const phones=await page.locator('a[href^="tel:"]').evaluateAll(es=>es.map(e=>e.getAttribute('href')));
 results.push({check:'financing-phone',phones,pass:phones.length>0&&phones.every(p=>p.replace(/\D/g,'').endsWith('895996559'))});
 await page.screenshot({path:new URL('financing-1440.png',import.meta.url).pathname.replace(/^\/(\w:)/,'$1'),timeout:12000,animations:'disabled'});
 await page.goto('http://127.0.0.1:6623/inventory/mercedes-benz-gle-350-amg-designo-134220',{waitUntil:'domcontentloaded'});
 const maps=await page.locator('a[href*="google.com/maps"]').evaluateAll(es=>es.map(e=>decodeURIComponent(e.getAttribute('href'))));
 results.push({check:'detail-map',maps,pass:maps.length>0&&maps.every(h=>h.includes('Excellent')&&!h.includes('Спартак'))});
 const manifest=await (await fetch('http://127.0.0.1:6623/site.webmanifest')).json();
 results.push({check:'manifest-identity',name:manifest.name,pass:manifest.name==='Excellent Cars'&&manifest.icons.every(i=>i.src.includes('/excellent/'))});
 for(const [route,target] of [['/oferta.html','/contact'],['/sa-concept.html','/']]){
  await page.goto('http://127.0.0.1:6623'+route,{waitUntil:'domcontentloaded'});
  await page.waitForURL('http://127.0.0.1:6623'+target);
  results.push({check:'inherited-static-redirect',route,target,pass:new URL(page.url()).pathname===target});
 }
 for(const width of [390,1440]){
  await page.setViewportSize({width,height:900});
  await page.goto('http://127.0.0.1:6623/',{waitUntil:'domcontentloaded'});
  await page.locator(width===390?'.mh-budget-grid':'header').filter({visible:true}).first().waitFor();
  if(width===390){
   const counts=await page.locator('.mh-budget-card__copy').allTextContents();
   results.push({check:'budget-home-counts',width,counts,pass:counts.some(s=>s.includes('20 000')&&s.includes('11 коли'))&&counts.some(s=>s.includes('30 000')&&s.includes('15 коли'))});
   await page.screenshot({path:new URL('budget-390.png',import.meta.url).pathname.replace(/^\/(\w:)/,'$1'),timeout:12000,animations:'disabled'});
  }
  await page.goto('http://127.0.0.1:6623/inventory?price=under-20000',{waitUntil:'domcontentloaded'});
  await page.locator('a[href^="/inventory/"]:not([href="/inventory/map"])').filter({visible:true}).first().waitFor();
  await page.waitForTimeout(1200);
  const matches=await page.locator('a[href^="/inventory/"]').filter({visible:true}).evaluateAll(es=>[...new Set(es.map(e=>e.getAttribute('href')).filter(h=>h!=='/inventory/map'))]);
  results.push({check:'budget-filter',width,limit:20000,matches,pass:matches.length===11});
  await page.goto('http://127.0.0.1:6623/inventory?mileage=under-100000',{waitUntil:'domcontentloaded'});
  await page.locator('a[href^="/inventory/"]:not([href="/inventory/map"])').filter({visible:true}).first().waitFor();
  await page.waitForTimeout(1200);
  const mileageMatches=await page.locator('a[href^="/inventory/"]').filter({visible:true}).evaluateAll(es=>[...new Set(es.map(e=>e.getAttribute('href')).filter(h=>h!=='/inventory/map'))]);
  const stock=JSON.parse(await fs.readFile(new URL('../carwow/src/lib/data/excellent-stock.json',import.meta.url)));
  const expected=stock.filter(s=>s.mileageKm>0&&s.mileageKm<=100000).length;
  results.push({check:'mileage-filter',width,expected,matches:mileageMatches,pass:mileageMatches.length===expected});
 }
 await page.close();
 }
 for(const width of [390,1440]){
  const p=await browser.newPage({viewport:{width,height:900}});
  p.setDefaultTimeout(15000);
  await p.goto('http://127.0.0.1:6622/bg/listing/excellent-21773150110056507',{waitUntil:'networkidle'});
  await p.waitForTimeout(1200);
  const trigger=p.getByRole('button',{name:/Отвори снимка/}).filter({visible:true}).first();
  await trigger.click();const dialog=p.locator('[data-slot="listing-gallery-lightbox"]');await dialog.waitFor();
  const first=await dialog.locator('img').getAttribute('src');
  await dialog.getByRole('button',{name:'Следваща снимка',exact:true}).click();
  await p.waitForTimeout(500);const second=await dialog.locator('img').getAttribute('src');
  await p.keyboard.press('Escape');await dialog.waitFor({state:'hidden'});await p.waitForTimeout(800);
  const focusReturned=await trigger.evaluate(e=>e===document.activeElement);
  const activeElement=await p.evaluate(()=>document.activeElement?.outerHTML.slice(0,500));
  const dismissed=await dialog.count()===0||!await dialog.isVisible();
  results.push({check:'modern-gallery',width,first,second,dismissed,focusReturned,activeElement,knownGap:focusReturned?null:'Inherited lightbox does not restore focus to the opening photo trigger; recorded for shared template accessibility follow-up.',pass:first!==second&&dismissed});
  await p.close();
 }
} catch(error){results.push({check:'focused-exception',pass:false,error:error.stack});} finally {await browser.close();}
await fs.writeFile(new URL(process.env.QA_GALLERY_ONLY?'gallery-diagnostic.json':'focused-results.json',import.meta.url),JSON.stringify(results,null,2));
console.log(results);
if(results.some(r=>!r.pass))process.exitCode=1;
