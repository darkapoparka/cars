import { chromium } from 'playwright';
import fs from 'node:fs';
const base='http://127.0.0.1:6461';
const out='docs/audits/2026-09-12-mobile-finalization/evidence';
fs.mkdirSync(`${out}/screenshots`,{recursive:true});
const browser=await chromium.launch({channel:'chrome',headless:true});
const sitemap=await (await fetch(`${base}/sitemap.xml`)).text();
const detailRoutes=[...sitemap.matchAll(/<loc>(.*?)<\/loc>/g)].map(m=>new URL(m[1]).pathname).filter(p=>/\/\d+$/.test(p));
const core=['/','/listing-grid','/contact?topic=trade-in','/contact?topic=import','/contact?topic=leasing','/contact?topic=inspection','/contact','/about-us','/blog'];
const extra=['/listing-grid?make=BMW&sort=price-asc','/listing-grid?q=no-match-xyz','/blog?category=Лизинг','/blog?q=no-match-xyz','/contact?topic=leasing&vehicle=4','/contact?topic=inspection&vehicle=1','/listing-detail-v1/999','/listing-detail-v1/01','/blog-detail/999','/missing-page'];
const results=[];const links=new Set();
const save=()=>fs.writeFileSync(`${out}/browser-routes.json`,JSON.stringify({base,time:new Date().toISOString(),results},null,2));
for(const width of [390,320,360,375,414,430,767,768,991,992,1440]){
 const context=await browser.newContext({viewport:{width,height:width>=767?900:844},deviceScaleFactor:1,isMobile:width<767,hasTouch:width<767,reducedMotion:'reduce'});
 const routes=width===390?[...core,...detailRoutes,...extra]:[...core,'/listing-detail-v1/1','/blog-detail/1','/contact?topic=leasing&vehicle=4'];
 for(const route of routes){
  const page=await context.newPage();const errors=[],consoleErrors=[],failedAssets=[],network=[];
  page.on('pageerror',e=>errors.push(e.message));page.on('console',m=>{if(m.type()==='error')consoleErrors.push(m.text())});
  page.on('response',r=>{if(r.status()>=400&&r.url().startsWith(base)&&/\.(webp|png|jpg|css|js|woff2|svg)(\?|$)/.test(r.url()))failedAssets.push({url:r.url(),status:r.status()})});
  page.on('requestfailed',r=>network.push({url:r.url(),error:r.failure()?.errorText}));
  let row={width,route,errors,consoleErrors,failedAssets,network};
  try{
   const response=await page.goto(base+route,{waitUntil:'networkidle',timeout:30000});row.status=response.status();row.finalUrl=page.url();
   await page.evaluate(()=>document.fonts.ready);
   if(width===390||[320,430,1440].includes(width)){for(let y=0;y<await page.evaluate(()=>document.documentElement.scrollHeight);y+=650){await page.evaluate(y=>scrollTo(0,y),y);await page.waitForTimeout(65)}await page.waitForTimeout(250)}
   await page.evaluate(()=>scrollTo(0,0));await page.waitForTimeout(120);
   row.dom=await page.evaluate(()=>{
    const visible=e=>e.getBoundingClientRect().width>0&&e.getBoundingClientRect().height>0&&getComputedStyle(e).visibility!=='hidden';
    const box=e=>{const r=e.getBoundingClientRect();return {x:r.x,y:r.y,w:r.width,h:r.height}};
    const name=e=>(e.getAttribute('aria-label')||e.textContent||e.getAttribute('alt')||'').trim().replace(/\s+/g,' ').slice(0,120);
    const controls=[...document.querySelectorAll('a,button,input,select,textarea,[role="tab"]')].filter(visible);
    const imgs=[...document.images].filter(visible).map(i=>({src:i.currentSrc,alt:i.alt,naturalWidth:i.naturalWidth,naturalHeight:i.naturalHeight,loaded:i.complete,box:box(i)}));
    return {title:document.title,lang:document.documentElement.lang,overflow:document.documentElement.scrollWidth-innerWidth,height:document.documentElement.scrollHeight,h1:[...document.querySelectorAll('h1')].map(e=>({text:name(e),visible:visible(e)})),main:document.querySelectorAll('main').length,broken:imgs.filter(i=>i.loaded&&!i.naturalWidth),images:imgs,smallTargets:controls.filter(e=>{const r=e.getBoundingClientRect();return r.width<44||r.height<44}).map(e=>({tag:e.tagName,name:name(e),box:box(e)})),emptyControls:controls.filter(e=>!name(e)&&!e.querySelector('img[alt]')).map(e=>e.outerHTML.slice(0,240)),headings:[...document.querySelectorAll('h1,h2,h3')].filter(visible).map(e=>({level:e.tagName,text:name(e),box:box(e)})),links:[...document.querySelectorAll('a[href]')].map(e=>e.getAttribute('href')),text:document.body.innerText,resources:performance.getEntriesByType('resource').filter(r=>r.name.startsWith(location.origin)).map(r=>({url:r.name,bytes:r.transferSize,decoded:r.decodedBodySize,duration:r.duration})),metaDescription:document.querySelector('meta[name="description"]')?.content,robots:document.querySelector('meta[name="robots"]')?.content};
   });
   row.dom.links.filter(l=>l.startsWith('/')&&!l.startsWith('//')).forEach(l=>links.add(l));
   if(width===390||[320,430,1440].includes(width)){
    row.screenshot=`screenshots/${width}-${route.replace(/[^a-z0-9]/gi,'_')||'home'}.png`;
    await page.screenshot({path:`${out}/${row.screenshot}`,fullPage:true});
   }
  }catch(e){row.failure=e.message}finally{results.push(row);save();await page.close()}
  console.log(`${width} ${route} status=${row.status} overflow=${row.dom?.overflow} errors=${errors.length} broken=${row.dom?.broken.length} ${row.failure||''}`);
 }
 await context.close();
}
const linkResults=[];for(const link of links){try{const r=await fetch(base+link);linkResults.push({link,status:r.status,url:r.url})}catch(e){linkResults.push({link,error:e.message})}}
fs.writeFileSync(`${out}/internal-links.json`,JSON.stringify(linkResults,null,2));
await browser.close();console.log(`Done ${results.length} route/viewport checks, ${linkResults.length} links`);
