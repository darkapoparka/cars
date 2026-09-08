import fs from 'node:fs/promises';
import path from 'node:path';
import {execFile} from 'node:child_process';
import {promisify} from 'node:util';
import {chromium} from 'file:///J:/cars/templates/boxcar/node_modules/playwright/index.mjs';
const exec=promisify(execFile),runtimeDir="J:/cars/audits/2026-09-08/verify",out=process.env.QA_OUTPUT||runtimeDir;
await fs.mkdir(out,{recursive:true});
const jobs=JSON.parse(await fs.readFile('J:/cars/audits/2026-09-07/varna-leads/build-tasks.json')).tasks;
const keep=new Set([6621,6622,6623,6631]);
const results=await fs.readFile(path.join(out,'results.json'),'utf8').then(JSON.parse).catch(()=>[]);
const browser=await chromium.launch({channel:'chrome',headless:true,args:['--explicitly-allowed-ports=6666,6667,6668']});
const save=()=>fs.writeFile(path.join(out,'results.json'),JSON.stringify(results,null,2));
const wait=ms=>new Promise(r=>setTimeout(r,ms));
async function nav(p,url){const r=await p.goto(url,{waitUntil:'domcontentloaded',timeout:45000});await p.waitForTimeout(2500);await p.waitForFunction(()=>document.body.innerText.trim().length>100,{},{timeout:15000});return r;}
async function shot(p,file){await p.waitForTimeout(800);await p.screenshot({path:file,timeout:12000,animations:'disabled'}).catch(()=>{});}
function detailSelector(t){return t==='auto-best'?'a[href*="/listing-detail-v1/"]':t==='modern'?'a[href*="/listing/"]':'a[href^="/inventory/"]';}
async function metrics(p){
 await p.evaluate(async()=>{for(let y=0;y<Math.min(document.body.scrollHeight,14000);y+=800){scrollTo(0,y);await new Promise(r=>setTimeout(r,40));}scrollTo(0,0)});

 await p.waitForFunction(()=>[...document.images].filter(i=>i.getBoundingClientRect().width>0).every(i=>i.complete),{},{timeout:8000}).catch(()=>{});
 return p.evaluate(()=>({title:document.title,text:document.body.innerText.slice(0,22000),overflow:document.documentElement.scrollWidth-document.documentElement.clientWidth,broken:[...document.images].filter(i=>i.getBoundingClientRect().width>0&&(i.complete&&!i.naturalWidth)).map(i=>i.currentSrc||i.src),phones:[...new Set([...document.querySelectorAll('a[href^="tel:"]')].map(a=>a.getAttribute('href')))],links:[...document.querySelectorAll('a[href]')].filter(a=>a.getBoundingClientRect().width>0).map(a=>({text:a.innerText,href:a.getAttribute('href')})),overlay:!!document.querySelector('vite-error-overlay,[data-nextjs-dialog]')}));
}
async function interaction(p,base,t,width,r){
 const inventory=t==='auto-best'?'/listing-grid':t==='modern'?'/cars':'/inventory';
 await nav(p,base+inventory);
 const beforeLinks=await p.locator(detailSelector(t)).evaluateAll(es=>[...new Set(es.map(a=>a.getAttribute('href')))]);
 let brand=(await p.locator(detailSelector(t)).filter({visible:true}).first().innerText()).match(/\b(Mercedes|BMW|Audi|VW|Volkswagen|Subaru|Toyota|Honda|Ford|Opel|Skoda|Cupra|Nissan|Peugeot|Renault|Kia|Hyundai|Mazda|Volvo|Seat|Porsche|Land Rover)\b/i)?.[1]||'BMW';
 r.query=brand;r.beforeCount=beforeLinks.length;
 const menu=p.getByRole('button',{name:/^(Меню|Отвори менюто|Отворете менюто)$/}).filter({visible:true}).first();
 if(await menu.count()){
  const trigger=await menu.elementHandle();await menu.click();await p.waitForTimeout(250);r.menuOpened=await trigger.getAttribute('aria-expanded')==='true'||await p.getByRole('dialog').filter({visible:true}).count()>0;
  await p.keyboard.press('Escape');await p.waitForTimeout(800);r.menuDismissed=await trigger.getAttribute('aria-expanded')!=='true'&&await p.getByRole('dialog').filter({visible:true}).count()===0;
  r.menuFocus=await trigger.evaluate(e=>e===document.activeElement);
  if(!r.menuDismissed)await nav(p,base+inventory);
 }else r.menu='No visible menu button at this width';
 const filter=p.getByRole('button',{name:/^(Филтри|Отвори филтрите)$/}).filter({visible:true}).first();
 if(await filter.count()){
  await filter.click();await p.waitForTimeout(200);r.filterOpened=await p.locator('dialog,[role="dialog"]').filter({visible:true}).count()>0;
  await p.keyboard.press('Escape');await p.waitForTimeout(800);r.filterDismissed=await p.locator('dialog,[role="dialog"]').filter({visible:true}).count()===0;
  if(!r.filterDismissed)await nav(p,base+inventory);
 }
 if(t==='auto-best'){
  if(width===390){await p.getByRole('button',{name:'Филтри',exact:true}).click();const d=p.locator('#dn-listing-filter-dialog');await d.locator('input[name=q]').fill(brand);await d.locator('.dn-listing-filter__dialog-submit').click();}
  else {const f=p.locator('#dn-desktop-discovery');const opts=await f.locator('select[name=make] option').evaluateAll(es=>es.map(e=>({value:e.value,text:e.textContent})));const selected=opts.find(x=>x.value&&x.text.toLowerCase().includes(brand.toLowerCase()))||opts.find(x=>x.value);brand=selected.text.trim();r.query=brand;await f.locator('select[name=make]').selectOption(selected.value);await f.getByRole('button',{name:'Търси',exact:true}).click();}
 }else{
  let input=p.locator('input[type=search],input[name=q]').filter({visible:true}).first();
  if(!await input.count()){
   const trigger=p.getByRole('button',{name:/Търси \d+ автомобила|Отвори търсене|Отвори търсенето|Отворете търсенето|Търсене на автомобили|Търсете марка/}).filter({visible:true}).first();
   if(await trigger.count())await trigger.click();
  }
  input=p.locator('input[type=search],input[name=q],input[placeholder*="марка"],input[placeholder*="Марка"]').filter({visible:true}).first();
  await input.fill(brand);await input.press('Enter');await p.waitForTimeout(300);
  const apply=p.getByRole('button',{name:/^Покажи\s+\d|^Покажи.*автомобил|^Търси „/}).filter({visible:true}).first();if(await apply.count())await apply.click();
 }
 await p.waitForTimeout(750);r.searchUrl=p.url();r.afterCount=await p.locator(detailSelector(t)).filter({visible:true}).count();r.search=(/[?&](q|make|brand)=/.test(p.url())||r.afterCount<r.beforeCount)&&r.afterCount>0;
 const link=p.locator(detailSelector(t)).filter({visible:true}).first();r.detailHref=await link.getAttribute('href');await link.click();await p.waitForTimeout(900);r.navigation=/listing-detail-v1|\/listing\/|\/inventory\//.test(p.url());
 r.detailPhone=await p.locator('a[href^="tel:"]').count()>0;
 const next=p.getByRole('button',{name:/^Следваща снимка$|^Next image$/}).filter({visible:true}).first();
 if(await next.count()){
  const gallery=p.locator(t==='auto-best'?'.dn-detail-gallery > img':'.swiper-listing-details-main .swiper-slide-active img.img-main').filter({visible:true});const prev=await gallery.evaluateAll(es=>es.map(e=>e.currentSrc||e.src));await next.click();await p.waitForTimeout(500);const after=await gallery.evaluateAll(es=>es.map(e=>e.currentSrc||e.src));r.galleryChanged=JSON.stringify(prev)!==JSON.stringify(after);
 }
 const enquiry=p.locator('a[href*="contact"]').filter({visible:true}).filter({hasText:/оглед|запитване|информация|Свърж/i}).first();
 if(await enquiry.count()){r.enquiryHref=await enquiry.getAttribute('href');await enquiry.click();await p.waitForTimeout(500);r.enquiry=/contact/.test(p.url());}else{r.enquiry=r.detailPhone;r.enquiryMode='telephone link inspected, no call placed';}
 r.pass=r.search&&r.navigation&&r.enquiry&&r.detailPhone&&r.menuDismissed!==false&&r.filterDismissed!==false&&r.galleryChanged!==false;
}
try{
for(const job of jobs){for(const [t,port]of [['auto-best',job.ports.autoBest],['modern',job.ports.modern],['carwow',job.ports.carwow]]){
 if(process.argv[2]&&job.slug!==process.argv[2])continue;
 const old=results.findIndex(r=>r.client===job.slug&&r.template===t);if(old>=0&&results[old].pass)continue;if(old>=0)results.splice(old,1);
 const dir=path.join(out,job.slug,t);await fs.mkdir(dir,{recursive:true});
 const result={client:job.slug,name:job.name,template:t,port,startedAt:new Date().toISOString(),routes:[],interactions:[],runtime:null};results.push(result);await save();
 const base=`http://127.0.0.1:${port}`;let owned=null;
 console.log(`START ${job.slug}/${t}`);
 try{
  if(!keep.has(port)){const launch=await exec('powershell.exe',['-NoProfile','-ExecutionPolicy','Bypass','-File',path.join(runtimeDir,'runtime.ps1'),'-Client',job.slug,'-Template',t,'-Port',String(port)],{timeout:30000});owned=JSON.parse(launch.stdout);result.runtime=owned;}
  else result.runtime={status:'existing owner-review server preserved'};
  for(let n=0;n<30;n++){try{await fetch(base,{signal:AbortSignal.timeout(1000)});break;}catch{await wait(500);}}
  let detail=null;
  for(const width of [390,1440]){
   const p=await browser.newPage({viewport:{width,height:900}});p.setDefaultTimeout(6500);
   const inventory=t==='auto-best'?'/listing-grid':t==='modern'?'/cars':'/inventory';
   const contact=t==='modern'?'/bg/contact':'/contact';
   const routeList=[t==='modern'?'/cars':'/',inventory,'DETAIL',contact,t==='auto-best'?'/about-us':t==='modern'?'/bg/imports':'/about',...(t==='carwow'?['/financing','/inventory?price=under-10000','/inventory?price=under-20000']:[])];
   for(const [i,key]of [...new Set(routeList)].entries()){
    const route=key==='DETAIL'?detail:key;if(!route){result.routes.push({width,route:'DETAIL',error:'No vehicle detail link found'});continue;}
    const row={width,route,errors:[],consoleErrors:[]};const err=e=>row.errors.push(e.message),con=e=>{if(e.type()==='error')row.consoleErrors.push(e.text())};p.on('pageerror',err);p.on('console',con);
    try{
     const response=await nav(p,base+route);const m=await metrics(p);Object.assign(row,m,{status:response.status()});
     if(route===inventory){const l=p.locator(detailSelector(t)).filter({visible:true}).first();if(await l.count())detail=await l.getAttribute('href');}
     row.staleIdentity=m.text.match(/Day\s*(?:&|and|и)\s*Night|АСКО\s*96|ELIQ|Елик|Кристиян Кирилов|Спартак Ауто/gi)||[];
     row.pass=!m.phones.some(x=>x.includes("888626117"))&&row.status===200&&row.overflow<=0&&!row.broken.length&&!row.errors.length&&!row.overlay&&!row.staleIdentity.length;
     if(route.includes('price=under-')){const actual=await p.locator(detailSelector(t)).filter({visible:true}).evaluateAll(es=>[...new Set(es.map(e=>e.getAttribute('href')))].length);row.budgetCount=actual;row.expectedBudgetCount=route.includes('under-20000')?13:{autolife:8,priselci:13,'ivo-auto':7}[job.slug];row.pass=row.pass&&actual===row.expectedBudgetCount;}delete row.text;await shot(p,path.join(dir,`${width}-${i}.png`));
    }catch(e){row.error=e.message;row.pass=false;}
    result.routes.push(row);p.off('pageerror',err);p.off('console',con);await save();
   }
   const inter={width,errors:[]};const ie=e=>inter.errors.push(e.message);p.on('pageerror',ie);
   try{await interaction(p,base,t,width,inter);}catch(e){inter.error=e.message;inter.pass=false;}
   if(inter.errors.length)inter.pass=false;await shot(p,path.join(dir,`${width}-interaction.png`));result.interactions.push(inter);await p.close();await save();
  }
 }catch(e){result.error=e.message;}
 finally{if(owned){await exec('powershell.exe',['-NoProfile','-File',path.join(runtimeDir,'runtime.ps1'),'-StopPid',String(owned.PID),'-Port',String(port)],{timeout:15000}).catch(e=>result.cleanupError=e.message);result.runtime.Status='stopped-after-verification';}}
 result.pass=!result.error&&result.routes.length>=8&&result.routes.every(r=>r.pass)&&result.interactions.length===2&&result.interactions.every(r=>r.pass);
 await fs.writeFile(path.join(dir,'result.json'),JSON.stringify(result,null,2));await save();console.log(JSON.stringify({client:job.slug,template:t,pass:result.pass,routes:result.routes.length,routeFailures:result.routes.filter(r=>!r.pass).map(r=>({route:r.route,width:r.width,error:r.error,broken:r.broken?.length,overflow:r.overflow,errors:r.errors,stale:r.staleIdentity})),interactions:result.interactions,error:result.error}));
}}
}finally{await browser.close();}


