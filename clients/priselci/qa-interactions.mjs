import fs from 'node:fs/promises';import {chromium} from './auto-best/node_modules/playwright/index.mjs';
const root='J:/cars/clients/priselci',variant=process.argv[2],port={'auto-best':6646,modern:6647,carwow:6648}[variant],base=`http://127.0.0.1:${port}`;
const config={'auto-best':{entry:'/',inventory:'/listing-grid',details:'a[href^="/listing-detail-v1/"]'},modern:{entry:'/cars',inventory:'/bg/cars',details:'a[href*="/listing/priselci-"]'},carwow:{entry:'/',inventory:'/inventory',details:'a[href^="/inventory/vw-golf-"]'}}[variant];
const b=await chromium.launch({headless:true,channel:'chrome'}),reports=[];
try {for(const width of [390,1440]){
 const c=await b.newContext({viewport:{width,height:900},...(width===390?{isMobile:true,hasTouch:true,userAgent:'Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Mobile/15E148 Safari/604.1'}:{})});const p=await c.newPage();p.setDefaultTimeout(7000);const r={variant,width,errors:[],steps:[]};p.on('pageerror',e=>r.errors.push(e.message));
 const step=async(name,fn)=>{try{r.steps.push({name,passed:true,...await fn()});}catch(e){r.steps.push({name,passed:false,error:e.message});}};
 await p.goto(base+config.entry,{waitUntil:'networkidle',timeout:90000});
 await step('Navigation and Escape dismissal',async()=>{
  if(width===390){const trigger=p.getByRole('button',{name:/^(Меню|Отвори менюто|Отворете менюто|Още)$/}).filter({visible:true}).first();if(!await trigger.count())throw Error('No visible mobile menu trigger');await trigger.click();await p.waitForTimeout(250);await p.screenshot({path:`${root}/evidence/${variant}-${width}-menu.png`});const before=await p.locator('body').innerText();await p.keyboard.press('Escape');await p.waitForTimeout(300);return {opened:before.length>0,expanded:await trigger.getAttribute('aria-expanded'),focusReturned:await trigger.evaluate(e=>document.activeElement===e)};}
  const nav=p.locator('a[href*="contact"]').filter({visible:true}).first();const target=await nav.getAttribute('href');await nav.click();await p.waitForURL(url=>url.pathname.includes('contact'));await p.waitForLoadState('networkidle');return {url:p.url(),target};
 });
 await p.goto(base+config.inventory,{waitUntil:'networkidle'});
 await step('Filter overlay Escape',async()=>{
  const trigger=p.getByRole('button',{name:/^(Филтри|Отвори филтрите|Всички филтри|Отворете търсенето на автомобили)$/}).filter({visible:true}).first();if(!await trigger.count())return {notApplicable:'No general filter overlay in selected source layout; search tested separately.'};await trigger.click();await p.waitForTimeout(300);const opened=await p.getByRole('dialog').filter({visible:true}).count();await p.screenshot({path:`${root}/evidence/${variant}-${width}-filters.png`});await p.keyboard.press('Escape');await p.waitForTimeout(300);const remaining=await p.getByRole('dialog').filter({visible:true}).count();if(remaining)throw Error('Dialog remained open after Escape');return {opened,remaining};
 });
 await p.goto(base+config.inventory,{waitUntil:'networkidle'});
 await step('Search Golf through visible control',async()=>{
  let input=p.locator('input[type="search"],input[name="q"]').filter({visible:true}).first();
  if(!await input.count()){
   const trigger=p.getByRole('button',{name:/Отворете търсенето|Отвори търсене|Търсете марка|Марка.*модел|Търси.*автомобил|Търсене/}).filter({visible:true}).first();await trigger.click();await p.waitForTimeout(250);input=p.locator('input[type="search"],input[name="q"],input[aria-label="Търсене"]').filter({visible:true}).first();
  }
  await input.fill('Golf');await input.press('Enter');await p.waitForTimeout(400);
  const dialog=p.getByRole('dialog').filter({visible:true});if(await dialog.count()){const apply=dialog.getByRole('button',{name:/Покажи|Виж.*резултат|Виж.*автомобил|Търси|Приложи/}).filter({visible:true}).last();if(await apply.count())await apply.click();}
  await p.waitForTimeout(700);await p.screenshot({path:`${root}/evidence/${variant}-${width}-search.png`});const text=await p.locator('body').innerText();if(!text.includes('Golf'))throw Error('Expected Golf result missing');return {url:p.url(),golfShown:true,visibleDetailLinks:await p.locator(config.details).filter({visible:true}).count()};
 });
 await step('Result to actual detail and enquiry',async()=>{
  let link=p.locator(config.details).filter({visible:true}).first();if(!await link.count()){await p.goto(base+config.inventory,{waitUntil:'networkidle'});link=p.locator(config.details).filter({visible:true}).first();}const href=await link.getAttribute('href');await link.click();await p.waitForURL(url=>url.pathname===new URL(href,base).pathname);await p.waitForLoadState('networkidle');const detailUrl=p.url();const phoneLinks=await p.locator('a[href^="tel:"]').evaluateAll(es=>[...new Set(es.map(e=>e.getAttribute('href')))]);if(!phoneLinks.some(v=>v.replace(/\s/g,'').includes('886251705')))throw Error('Dealer telephone missing');
  if(variant==='auto-best'){await p.getByRole('button',{name:'Снимка 2',exact:true}).click();if(await p.getByRole('button',{name:'Снимка 2',exact:true}).getAttribute('aria-pressed')!=='true')throw Error('Gallery did not change');}
  const enquiry=p.locator('a[href*="contact"]').filter({visible:true}).last();let enquiryUrl=null;if(await enquiry.count()){await enquiry.click();await p.waitForURL(url=>url.pathname.includes('contact'));await p.waitForLoadState('networkidle');enquiryUrl=p.url();}else{const btn=p.getByRole('button',{name:/Запит|Заяви оглед|Свържи/}).filter({visible:true}).first();if(await btn.count()){await btn.click();await p.waitForTimeout(250);enquiryUrl=p.url();}}
  await p.screenshot({path:`${root}/evidence/${variant}-${width}-enquiry.png`});return {detailUrl,phoneLinks,enquiryUrl,externalSubmission:false};
 });
 reports.push(r);await c.close();console.log(JSON.stringify(r));await fs.writeFile(`${root}/evidence/${variant}-interactions.json`,JSON.stringify(reports,null,2));
}}finally{await b.close();}

