import { chromium } from 'playwright';
import { mkdir, writeFile } from 'node:fs/promises';
const browser = await chromium.launch({headless:true,channel:"chrome"});
const routes = {home:'',listings:'listings/?filter-condition=0&filter-make=&filter-model=&filter-price-from=&filter-price-to=',detail:'listing/ranger-white-2022/',blog:'blog/?style=full',article:'bmw-x6-m50i-is-designed-to-exceed-your-sportiest/',contact:'contact-us/',about:'about-us/',compare:'compare/',calculator:'calculator/',services:'services/',terms:'terms-and-conditions/'};
await mkdir('reference',{recursive:true});
for(const [key,route] of Object.entries(routes)) {
 const page=await browser.newPage({viewport:{width:1440,height:1000},deviceScaleFactor:1});
 try {
 await page.goto('https://demoapus1.com/boxcar/'+route,{waitUntil:'networkidle',timeout:60000}).catch(()=>{});
 await page.evaluate(()=>document.fonts.ready); await page.waitForTimeout(1500);
 await page.evaluate(async()=>{for(let y=0;y<document.body.scrollHeight;y+=700){window.scrollTo(0,y);await new Promise(r=>setTimeout(r,120));}window.scrollTo(0,0);});await page.waitForTimeout(500);
 await page.screenshot({path:`reference/${key}-viewport.png`});
 await page.screenshot({path:`reference/${key}-desktop.png`,fullPage:true});
 await writeFile(`reference/${key}-rendered.html`,await page.content());
 console.log(key,await page.title(),await page.locator('h1').allTextContents());
 await page.setViewportSize({width:390,height:844}); await page.waitForTimeout(500);
 await page.screenshot({path:`reference/${key}-mobile.png`,fullPage:true});
 }catch(e){console.log(key,e.message)}finally{await page.close()}
}
await browser.close();

