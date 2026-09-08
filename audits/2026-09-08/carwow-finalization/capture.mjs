import { chromium } from '../../../templates/carwow/node_modules/playwright/index.mjs';
import fs from 'node:fs/promises';
import path from 'node:path';
const phase = process.argv[2] || 'before';
const root = path.dirname(new URL(import.meta.url).pathname.replace(/^\/(\w:)/, '$1'));
const routes = ['/', '/inventory', '/sell-your-car', '/sell-your-car/request', '/contact', '/contact?intent=import', '/financing', '/calculator', '/reviews', '/faq', '/team', '/blog', '/terms', '/favorites', '/compare', '/about', '/about/daynight-auto-plovdiv', '/team/prodazhbi-showroom', '/blog/kak-da-kupim-upotrebyavan-avtomobil', '/inventory/mercedes-benz-gla-45-amg-405323'];
const browser = await chromium.launch({channel:'chrome',headless:true});
const results=[];
try {
 for(const width of [390,1440]) {
  const context=await browser.newContext({viewport:{width,height:width===390?844:1050},isMobile:width===390,hasTouch:width===390,reducedMotion:'reduce',...(width===390?{userAgent:'Mozilla/5.0 (iPhone; CPU iPhone OS 18_0 like Mac OS X) AppleWebKit/605.1.15 Version/18.0 Mobile/15E148 Safari/604.1'}:{})});
  const page=await context.newPage();
  let errors=[];page.on('pageerror',e=>errors.push(e.message));
  for(const [i,route] of routes.entries()){
   errors=[];
   console.log('capturing',width,route);
   const response=await page.goto(`http://127.0.0.1:6463${route}`,{waitUntil:'domcontentloaded',timeout:60000});
   await page.waitForFunction(()=>[...document.querySelectorAll('h1,h2')].some(e=>e.getBoundingClientRect().height>0),{},{timeout:30000});
   await page.waitForTimeout(1200);
   await page.evaluate(()=>document.fonts.ready);
   await page.evaluate(async()=>{for(let y=0;y<document.body.scrollHeight;y+=700){window.scrollTo(0,y);await new Promise(r=>setTimeout(r,45));}window.scrollTo(0,0)});
   await page.waitForTimeout(300);
   const metrics=await page.evaluate(()=>({title:document.title,h1:[...document.querySelectorAll('h1')].filter(e=>e.getBoundingClientRect().height).map(e=>e.textContent),height:document.documentElement.scrollHeight,overflow:document.documentElement.scrollWidth>innerWidth,broken:[...document.images].filter(i=>i.getBoundingClientRect().height&&i.complete&&!i.naturalWidth).map(i=>i.src)}));
   const filename=`${width}-${String(i).padStart(2,'0')}.png`;
   await page.screenshot({path:path.join(root,phase,filename),fullPage:true});
   results.push({width,route,status:response.status(),filename,errors,...metrics});
   console.log(width,route,response.status(),metrics.h1.join(' | '));
  }
  await context.close();
 }
} finally {await browser.close();await fs.writeFile(path.join(root,`${phase}.json`),JSON.stringify(results,null,2));}
