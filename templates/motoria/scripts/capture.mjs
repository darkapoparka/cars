import { chromium } from 'playwright';
import { mkdir, writeFile, readFile } from 'node:fs/promises';
import { createHash } from 'node:crypto';

const endpoint = process.argv[2];
if (!endpoint) throw new Error('Pass the reference browser CDP URL.');
const browser = await chromium.connectOverCDP(endpoint);
const context = browser.contexts()[0];
const page = await context.newPage();
const root = new URL('../', import.meta.url);
const routes = [
 ['home','elementor-classified-one/','/'],
 ['inventory','elementor-classified-four/inventory/','/inventory/'],
 ['bmw-m5','elementor-classified-one/listings/bmw-m5/','/listings/bmw-m5/'],
 ...['pricing','contact-us','about-us','blog','loan-calculators','leasing-calculators','import-car-calculator','insurance-calculator'].map(x=>[x,`elementor-classified-one/${x}/`,`/${x}/`]),
 ...[2,3,4,5].map(n=>[`inventory-page-${n}`,`elementor-classified-four/inventory/page/${n}/`,`/inventory/page/${n}/`])
];
await mkdir(new URL('references/pages/',root),{recursive:true});
await mkdir(new URL('references/screenshots/',root),{recursive:true});
await mkdir(new URL('static/mirror/',root),{recursive:true});
const assets = JSON.parse(await readFile(new URL('references/assets.json',root),'utf8').catch(()=>'{}'));
const pending = new Set();
page.on('response', response => {
 const url = response.url();
 const type = response.request().resourceType();
 if (!['stylesheet','script','image','font','media'].includes(type) || !/^https:\/\/(motors\.stylemixthemes\.com|static\.stylemixthemes\.com|fonts\.(googleapis|gstatic)\.com|cdnjs\.cloudflare\.com)/.test(url) || response.status() !== 200) return;
 const task = (async()=>{
  try {
   const content = await response.body();
   const pathname = new URL(url).pathname;
   const ext = pathname.match(/\.[a-z0-9]{2,6}$/i)?.[0] || (type==='stylesheet'?'.css':type==='script'?'.js':'.bin');
   const path = '/mirror/'+createHash('sha256').update(url).digest('hex').slice(0,20)+ext;
   await writeFile(new URL('static'+path,root),content);
   assets[url]={path,type,bytes:content.length};
  } catch {}
 })();
 pending.add(task); task.finally(()=>pending.delete(task));
});
const manifest=JSON.parse(await readFile(new URL('references/manifest.json',root),'utf8').catch(()=>'[]'));
for (const [name,path,local] of routes) {
 if(process.env.RESUME && manifest.some(x=>x.name===name)) continue;
 const url='https://motors.stylemixthemes.com/'+path;
 await page.setViewportSize({width:1440,height:1000});
 const response=await page.goto(url,{waitUntil:'domcontentloaded',timeout:60000});
 await page.waitForLoadState('networkidle',{timeout:15000}).catch(()=>{});
 await page.waitForTimeout(1500);
 if(response.status()!==200) throw new Error(`${name}: ${response.status()}`);
 await writeFile(new URL(`references/pages/${name}.html`,root),await response.text());
 await page.evaluate(async()=>{for(let y=0;y<document.body.scrollHeight;y+=700){window.scrollTo(0,y);await new Promise(r=>setTimeout(r,80));}window.scrollTo(0,0);});
 await page.waitForTimeout(700);
 await page.screenshot({path:new URL(`references/screenshots/${name}-desktop.png`,root).pathname.replace(/^\/([A-Z]:)/,'$1'),fullPage:true});
 await writeFile(new URL(`references/pages/${name}.rendered.html`,root),await page.content());
 const summary=await page.evaluate(()=>({title:document.title,headings:[...document.querySelectorAll('h1,h2,h3')].map(x=>x.textContent.trim()),height:document.body.scrollHeight,forms:[...document.forms].map(f=>({action:f.action,id:f.id,fields:[...f.elements].map(e=>({name:e.name,type:e.type}))}))}));
 await page.setViewportSize({width:390,height:844});
 await page.waitForTimeout(300);
 await page.screenshot({path:new URL(`references/screenshots/${name}-mobile.png`,root).pathname.replace(/^\/([A-Z]:)/,'$1'),fullPage:true});
 const existing=manifest.findIndex(x=>x.name===name);
 if(existing>=0) manifest.splice(existing,1);
 manifest.push({name,source:url,route:local,...summary});
 console.log(name,summary.title,summary.height,'assets',Object.keys(assets).length);
 await writeFile(new URL('references/manifest.json',root),JSON.stringify(manifest,null,2));
 await Promise.allSettled([...pending]);
 await writeFile(new URL('references/assets.json',root),JSON.stringify(assets,null,2));
}
await page.close();
await browser.close();
