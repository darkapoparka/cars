import fs from 'node:fs/promises';
import { chromium } from '../../../templates/auto-best/node_modules/playwright/index.mjs';
const phase=process.argv[2] || 'before';
const out=`${import.meta.dirname}/${phase}`;
await fs.mkdir(out,{recursive:true});
const browser=await chromium.launch({channel:'chrome',headless:true});
const results=[];
try {
 for(const width of [390,1440]) {
  const context=await browser.newContext({viewport:{width,height:width===390?844:900}});
  const page=await context.newPage();
  for(const [name,url] of [['home','/'],['inventory','/listing-grid?make=BMW&sort=price-asc'],['vehicle','/listing-detail-v1/4'],['leasing','/contact?topic=leasing&vehicle=4'],['about','/about-us'],['article','/blog-detail/1']]) {
   const errors=[];page.on('pageerror',e=>errors.push(e.message));
   const response=await page.goto(`http://127.0.0.1:6461${url}`,{waitUntil:'networkidle'});
   await page.evaluate(()=>document.fonts.ready);
   for(let y=0;y<await page.evaluate(()=>document.documentElement.scrollHeight);y+=700){await page.evaluate(y=>scrollTo(0,y),y);await page.waitForTimeout(70);}
   await page.evaluate(()=>scrollTo(0,0));await page.waitForTimeout(250);
   await page.screenshot({path:`${out}/${width}-${name}.png`,fullPage:true});
   await page.screenshot({path:`${out}/${width}-${name}-top.png`});
   results.push({width,name,url,status:response.status(),errors,...await page.evaluate(()=>({title:document.title,overflow:document.documentElement.scrollWidth>innerWidth,broken:[...document.images].filter(i=>i.getBoundingClientRect().width&&i.complete&&!i.naturalWidth).map(i=>i.currentSrc)}))});
   await fs.writeFile(`${out}/results.json`,JSON.stringify(results,null,2));
   console.log(`${phase} ${width} ${name}`);
  }
  await context.close();
 }
} finally { await browser.close(); }
