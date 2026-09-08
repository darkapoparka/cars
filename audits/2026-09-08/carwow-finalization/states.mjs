import { chromium } from '../../../templates/carwow/node_modules/playwright/index.mjs';
import fs from 'node:fs/promises';
const phase=process.argv[2]||'before';
const browser=await chromium.launch({channel:'chrome',headless:true});
const out=new URL(`./${phase}/`,import.meta.url).pathname.replace(/^\/(\w:)/,'$1');
for(const width of [390,1440]){
 const context=await browser.newContext({viewport:{width,height:844},reducedMotion:'reduce'});
 await context.addInitScript(()=>localStorage.setItem('daynight:compare',JSON.stringify(['mercedes-benz-gla-45-amg-405323','audi-a8-574112'])));
 const page=await context.newPage();
 await page.goto('http://127.0.0.1:6463/compare',{waitUntil:'networkidle',timeout:60000});
 await page.getByRole('link',{name:'Виж Mercedes-Benz GLA 45 AMG'}).waitFor();
 await page.screenshot({path:`${out}${width}-compare-populated.png`,fullPage:true});
 await page.locator('.chat-launcher').click();
 await page.locator('.chat-thread').waitFor();
 await page.screenshot({path:`${out}${width}-chat.png`,fullPage:false});
 console.log('states captured',width);
 await context.close();
}
await browser.close();
