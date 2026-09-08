import {chromium} from 'playwright';
import fs from 'node:fs/promises';
const browser=await chromium.launch({channel:'chrome'});
const result=[];
for(const width of [1440,390,1280,1024,1920]){
 const page=await browser.newPage({viewport:{width,height:1000}});const errors=[];page.on('pageerror',e=>errors.push(e.message));
 await page.goto('http://127.0.0.1:6601/');await page.waitForFunction(()=>document.documentElement.dataset.rencarReady==='true');await page.locator('.preloader').waitFor({state:'hidden'});await page.evaluate(()=>document.fonts.ready);
 result.push(await page.evaluate(()=>({width:innerWidth,overflow:document.documentElement.scrollWidth-innerWidth,headerWidth:parseFloat(getComputedStyle(document.querySelector('.navbar'),'::before').width),topContentWidth:document.querySelector('.header-top .container').getBoundingClientRect().width,aboutHeight:document.querySelector('.about-centered').getBoundingClientRect().height,aboutHeading:document.querySelector('#about-heading').textContent,aboutHeadingOverflow:document.querySelector('#about-heading').scrollWidth-document.querySelector('#about-heading').clientWidth,aboutColumns:getComputedStyle(document.querySelector('.about-content')).gridTemplateColumns,broken:[...document.images].filter(i=>i.complete&&!i.naturalWidth).map(i=>i.src)})));
 if([1440,390].includes(width)){
   await page.screenshot({path:`.client/section-qa/header-${width}.png`});
   await page.evaluate(()=>scrollTo({top:document.querySelector('.about-centered').getBoundingClientRect().top+scrollY-120,behavior:'instant'}));await page.waitForTimeout(300);
   await page.screenshot({path:`.client/section-qa/about-${width}.png`});
   await page.locator('.about-action a').click();await page.waitForURL('**/about.html');
   result.at(-1).aboutLink=true;
 }
 result.at(-1).errors=errors;await page.close();
}
await browser.close();await fs.writeFile('.client/section-qa/layout.json',JSON.stringify(result,null,2));console.log(result);
