import { chromium } from 'playwright';
import { mkdir, writeFile } from 'node:fs/promises';
const browser=await chromium.launch({headless:true,channel:'chrome'});
const routes={home:'',listings:'listings/',detail:'listing/ranger-white-2022/',blog:'blog/?style=full',article:'bmw-x6-m50i-is-designed-to-exceed-your-sportiest/',contact:'contact-us/',about:'about-us/',compare:'compare/',calculator:'calculator/',services:'services/',terms:'terms-and-conditions/'};
await mkdir('qa',{recursive:true}); const results=[];
for(const [name,route] of Object.entries(routes)) {
 const page=await browser.newPage({viewport:{width:1440,height:1000},deviceScaleFactor:1});const errors=[],failures=[];
 page.on('pageerror',e=>errors.push(e.message));page.on('response',r=>{if(r.status()>=400)failures.push({url:r.url(),status:r.status()});});
 await page.goto('http://127.0.0.1:6450/'+route,{waitUntil:'networkidle',timeout:45000}).catch(e=>errors.push(e.message));
 await page.waitForFunction(()=>document.documentElement.dataset.boxcarReady==='true');
 await page.waitForTimeout(500);await page.evaluate(()=>document.fonts.ready);
 await page.screenshot({path:`qa/${name}-desktop.png`,fullPage:true});
 await page.screenshot({path:`qa/${name}-viewport.png`});
 const desktop=await page.evaluate(()=>({width:innerWidth,scroll:document.documentElement.scrollWidth,height:document.body.scrollHeight,broken:[...document.images].filter(i=>!i.complete||!i.naturalWidth).map(i=>i.src)}));
 await page.setViewportSize({width:390,height:844});await page.waitForTimeout(400);
 await page.screenshot({path:`qa/${name}-mobile.png`,fullPage:true});
 const mobile=await page.evaluate(()=>({width:innerWidth,scroll:document.documentElement.scrollWidth}));
 results.push({name,route,desktop,mobile,errors,failures});console.log(name,JSON.stringify({desktop:desktop.scroll,mobile:mobile.scroll,broken:desktop.broken.length,errors,failures:failures.length}));await page.close();
}
await writeFile('qa/render-report.json',JSON.stringify(results,null,2));await browser.close();
