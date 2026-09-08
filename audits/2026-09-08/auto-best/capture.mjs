import fs from 'node:fs/promises';
import path from 'node:path';
import crypto from 'node:crypto';
import { chromium } from '../../../templates/auto-best/node_modules/playwright/index.mjs';

const root = 'J:/cars/templates/auto-best';
const out = path.join(import.meta.dirname, 'evidence');
await fs.mkdir(out, { recursive: true });
async function walk(dir) { const result=[]; for(const e of await fs.readdir(dir,{withFileTypes:true})) { const p=path.join(dir,e.name); if(e.isDirectory()) result.push(...await walk(p)); else result.push(p); } return result; }
const files = [...await walk(root+'/src'), ...await walk(root+'/scripts'), ...['package.json','package-lock.json','svelte.config.js','TEMPLATE.md','.template/template.json'].map(p=>root+'/'+p)];
const source=[];
for(const file of files) { const b=await fs.readFile(file); const t=b.toString(); source.push({path:path.relative(root,file).replaceAll('\\','/'),bytes:b.length,lines:t.split('\n').length,sha256:crypto.createHash('sha256').update(b).digest('hex'),hexColors:(t.match(/#[0-9a-fA-F]{3,8}\b/g)||[]).length,important:(t.match(/!important/g)||[]).length,effects:(t.match(/\$effect\(/g)||[]).length}); }
await fs.writeFile(out+'/source-manifest.json',JSON.stringify(source,null,2));
const routes=[['home','/'],['inventory','/listing-grid'],...Array.from({length:8},(_,i)=>['vehicle-'+(i+1),'/listing-detail-v1/'+(i+1)]),['about','/about-us'],['blog','/blog'],...Array.from({length:6},(_,i)=>['article-'+(i+1),'/blog-detail/'+(i+1)]),['contact','/contact'],['inspection','/contact?topic=inspection'],['leasing','/contact?topic=leasing'],['sell','/contact?topic=trade-in'],['import','/contact?topic=import'],['inventory-empty','/listing-grid?q=zzzz-no-match'],['blog-empty','/blog?q=zzzz-no-match'],['not-found','/audit-missing'],['vehicle-missing','/listing-detail-v1/999'],['article-missing','/blog-detail/999']];
const browser=await chromium.launch({headless:true,channel:'chrome'});
const records=[];
for(const width of [390,1440]) {
 const context=await browser.newContext({viewport:{width,height:width===390?844:900},isMobile:width===390,hasTouch:width===390});
 const page=await context.newPage(); let errors=[],failed=[];
 page.on('pageerror',e=>errors.push(e.message)); page.on('console',m=>{if(m.type()==='error')errors.push(m.text())});
 page.on('response',r=>{if(r.status()>=400)failed.push({url:r.url(),status:r.status()})});
 for(const [key,route] of routes) {
  errors=[];failed=[];
  const record={key,route,width};
  try {
   const res=await page.goto('http://127.0.0.1:6461'+route,{waitUntil:'networkidle',timeout:45000});record.status=res.status();
   await page.evaluate(()=>document.fonts.ready);
   for(let y=0;y<await page.evaluate(()=>document.documentElement.scrollHeight);y+=700){await page.evaluate(y=>scrollTo(0,y),y);await page.waitForTimeout(70);}
   await page.waitForTimeout(250); await page.evaluate(()=>scrollTo(0,0));
   const prefix=(width===390?'mobile':'desktop')+'-'+key;
   await page.screenshot({path:out+'/'+prefix+'.png',fullPage:true});
   await page.screenshot({path:out+'/'+prefix+'-top.png'});
   record.page=await page.evaluate(()=>{
    const visible=e=>{const r=e.getBoundingClientRect(),s=getComputedStyle(e);return r.width>0&&r.height>0&&s.visibility!=='hidden'&&s.display!=='none'};
    const rect=e=>{const r=e.getBoundingClientRect();return {x:r.x,y:r.y,w:r.width,h:r.height}};
    return {title:document.title,url:location.href,height:document.documentElement.scrollHeight,scrollWidth:document.documentElement.scrollWidth,text:document.body.innerText,
     headings:[...document.querySelectorAll('h1,h2,h3')].filter(visible).map(e=>({tag:e.tagName,text:e.textContent.trim(),...rect(e)})),
     links:[...document.querySelectorAll('a[href]')].filter(visible).map(e=>({text:(e.innerText||e.getAttribute('aria-label')||'').trim(),href:e.getAttribute('href'),...rect(e)})),
     controls:[...document.querySelectorAll('button,input:not([type=hidden]),select,textarea')].filter(visible).map(e=>({tag:e.tagName,id:e.id,name:e.getAttribute('name'),type:e.getAttribute('type'),label:(e.innerText||e.getAttribute('aria-label')||e.getAttribute('placeholder')||'').trim(),...rect(e)})),
     brokenImages:[...document.images].filter(e=>visible(e)&&e.complete&&!e.naturalWidth).map(e=>e.currentSrc),
     unnamed:[...document.querySelectorAll('button,a[href]')].filter(visible).filter(e=>!e.textContent.trim()&&!e.getAttribute('aria-label')&&!e.querySelector('img[alt]')).map(e=>e.outerHTML.slice(0,350)),
     overflow:[...document.querySelectorAll('main *')].filter(visible).filter(e=>e.getBoundingClientRect().right>innerWidth+2||e.getBoundingClientRect().left<-2).slice(0,25).map(e=>({tag:e.tagName,class:e.className,...rect(e)})),
     frames:[...document.querySelectorAll('iframe')].map(e=>({src:e.src,title:e.title,...rect(e)}))};
   });
   record.errors=[...errors];record.failed=[...failed];
  } catch(e) {record.failure=e.message;}
  records.push(record); await fs.writeFile(out+'/routes.json',JSON.stringify(records,null,2));
  console.log(JSON.stringify({key,width,status:record.status,overflow:record.page?.scrollWidth-width,broken:record.page?.brokenImages.length,errors:record.errors?.length,failure:record.failure}));
 }
 await context.close();
}
const linked=[...new Set(records.flatMap(r=>r.page?.links.map(l=>l.href)||[]).filter(h=>h.startsWith('/')))];
const urls=[]; for(const route of [...linked,'/home02','/home10','/listing-list','/listing-detail-v2/1','/faq','/sitemap.xml','/robots.txt']) {try{const r=await fetch('http://127.0.0.1:6461'+route);urls.push({route,status:r.status,url:r.url,redirected:r.redirected});}catch(e){urls.push({route,error:e.message});}}
await fs.writeFile(out+'/linked-urls.json',JSON.stringify(urls,null,2));
await browser.close();
