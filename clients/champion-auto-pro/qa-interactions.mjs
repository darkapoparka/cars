import fs from 'node:fs/promises';import {chromium} from '../../templates/boxcar/node_modules/playwright/index.mjs';
const root=import.meta.dirname,variant=process.argv[2],port={"auto-best":6631,modern:6632,carwow:6633}[variant],base=`http://127.0.0.1:${port}`;
const inventory=variant==='auto-best'?'/listing-grid':variant==='modern'?'/cars':'/inventory';const detailPattern=variant==='auto-best'?'a[href*="/listing-detail-v1/"]':variant==='modern'?'a[href*="/listing/champion-"]':'a[href^="/inventory/"]';
const b=await chromium.launch({channel:'chrome',headless:true}),results=[];
try {for(const width of [390,1440]){const p=await b.newPage({viewport:{width,height:900}});p.setDefaultTimeout(6500);const r={width,errors:[]};p.on('pageerror',e=>r.errors.push(e.message));
 try {
 await p.goto(base+inventory,{waitUntil:'domcontentloaded'});await p.waitForTimeout(1800);
 const menu=width===1440&&variant==='auto-best'?p.locator('.dn-nav a[aria-haspopup="true"]').first():p.getByRole('button',{name:/^(Меню|Отворете менюто|Отвори менюто)$/}).filter({visible:true}).first();
 if(await menu.count()){await menu.click();await p.waitForTimeout(350);r.menuOpened=true;await p.screenshot({path:`${root}/qa/${variant}-${width}-menu.png`});await p.keyboard.press('Escape');await p.waitForTimeout(350);r.menuDismissed=await menu.getAttribute('aria-expanded')!=='true';r.menuFocusReturned=await menu.evaluate(e=>e===document.activeElement);}
 const filters=p.getByRole('button',{name:/^(Филтри|Отвори филтрите)$/}).filter({visible:true}).first();
 if(await filters.count()){await filters.click();await p.waitForTimeout(350);r.filtersOpened=true;await p.screenshot({path:`${root}/qa/${variant}-${width}-filters.png`});await p.keyboard.press('Escape');await p.waitForTimeout(350);r.filtersDismissed=await p.locator('[role="dialog"]').filter({visible:true}).count()===0;r.filterFocusReturned=await filters.evaluate(e=>e===document.activeElement);}
 let search=p.locator('input[type="search"],input[name="q"]').filter({visible:true}).first();
 if(!await search.count()){const trigger=p.getByRole('button',{name:/Отворете търсенето на автомобили|Търсете марка|Търси \d+ автомобила|Търсене|Търси автомобил/}).filter({visible:true}).first();if(await trigger.count()){await trigger.click();await p.waitForTimeout(300);}}
 search=p.locator('input[type="search"],input[name="q"]').filter({visible:true}).first();
 if(!await search.count()&&variant==='modern')search=p.locator('input').filter({visible:true}).first();
 if(await search.count()){await search.fill('BMW');await search.press('Enter');await p.waitForTimeout(800);const apply=p.getByRole('button',{name:/^Покажи.*автомобил/}).filter({visible:true}).first();if(await apply.count()){await apply.click();await p.waitForTimeout(500);}r.searchUrl=p.url();r.searchText=(await p.locator('body').innerText()).slice(0,6000);r.searchApplied=/BMW|bmw/.test(p.url());await p.screenshot({path:`${root}/qa/${variant}-${width}-search.png`});}else r.searchMissing=true;
 const listing=p.locator(detailPattern).filter({visible:true}).first();r.detailHref=await listing.getAttribute('href');await listing.click();await p.waitForTimeout(900);r.detailUrl=p.url();r.phones=await p.locator('a[href^="tel:"]').evaluateAll(es=>[...new Set(es.map(e=>e.getAttribute('href')))]);
 const gallery=p.getByRole('button',{name:/^Следваща снимка$|^Next image$/}).filter({visible:true}).first();if(await gallery.count()){await gallery.click();r.galleryNext=true;}
 const enquiry=p.locator('a[href*="contact"]').filter({visible:true}).filter({hasText:/оглед|запитване|информация/i}).first();if(await enquiry.count()){r.enquiryHref=await enquiry.getAttribute('href');await enquiry.click();await p.waitForTimeout(600);r.enquiryUrl=p.url();r.enquiryText=(await p.locator('body').innerText()).slice(0,4000);}
 await p.screenshot({path:`${root}/qa/${variant}-${width}-enquiry.png`});
 }catch(e){r.failure=e.message;}results.push(r);await p.close();await fs.writeFile(`${root}/qa/${variant}-interactions.json`,JSON.stringify(results,null,2));console.log(JSON.stringify(r));}
} finally {await b.close();}
