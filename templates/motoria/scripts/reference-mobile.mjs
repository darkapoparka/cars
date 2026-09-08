import { chromium } from 'playwright';
import { readFile } from 'node:fs/promises';
const browser=await chromium.connectOverCDP(process.argv[2]);
const page=await browser.contexts()[0].newPage();
const manifest=JSON.parse(await readFile('references/manifest.json','utf8'));
await page.setViewportSize({width:390,height:844});
for(const route of manifest){
 await page.goto(route.source,{waitUntil:'domcontentloaded',timeout:60000});
 await page.waitForTimeout(2000);
 await page.evaluate(async()=>{await document.fonts.ready;for(let y=0;y<document.body.scrollHeight;y+=700){window.scrollTo(0,y);await new Promise(r=>setTimeout(r,60));}window.scrollTo(0,0);});
 await page.waitForTimeout(300);
 await page.screenshot({path:`references/screenshots/${route.name}-mobile.png`,fullPage:true});
 console.log(route.name,await page.evaluate(()=>document.body.scrollHeight));
}
await page.close();await browser.close();
