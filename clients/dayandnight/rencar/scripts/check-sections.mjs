import {chromium} from 'playwright';
import {writeFile} from 'node:fs/promises';
const browser=await chromium.launch({channel:'chrome',headless:true});
const report=[];
for(const [kind,base] of [['reference','https://live.themewild.com/rencar/'],['local','http://127.0.0.1:6430/']]) {
  const page=await browser.newPage({viewport:{width:1440,height:1000}});
  await page.goto(base,{waitUntil:'load'});
  await page.waitForFunction(()=>window.jQuery?.fn.owlCarousel&&document.querySelector('.hero-slider.owl-loaded'));
  await page.evaluate(()=>document.fonts.ready);
  await page.locator('.preloader').waitFor({state:'hidden'});
  await page.addStyleTag({content:'.wow{visibility:visible!important}*,*::before,*::after{animation:none!important;transition:none!important}'});
  for(const [name,selector] of [['about','.about-area'],['cars','.car-area'],['footer','.footer-area']]) {
    await page.locator(selector).scrollIntoViewIfNeeded();
    await page.locator(selector).screenshot({path:`reference/qa/${kind}-section-${name}.png`});
  }
  await page.setViewportSize({width:390,height:844});
  await page.goto(base+'index-4.html',{waitUntil:'load'});
  await page.waitForFunction(()=>window.jQuery?.fn.owlCarousel&&document.querySelector('.ss-main'));
  await page.evaluate(()=>document.fonts.ready);
  await page.locator('.preloader').waitFor({state:'hidden'});
  await page.addStyleTag({content:'.wow{visibility:visible!important}*,*::before,*::after{animation:none!important;transition:none!important}'});
  const state=await page.evaluate(()=>({title:document.title,width:innerWidth,scrollWidth:document.documentElement.scrollWidth,overflow:[...document.querySelectorAll('body *')].filter(e=>{const r=e.getBoundingClientRect();return r.width>0&&r.right>innerWidth+1&&getComputedStyle(e).position!=='fixed'&&!e.closest('.owl-stage,.ss-content,.offcanvas,.search-popup')}).slice(0,12).map(e=>({tag:e.tagName,class:e.className,right:e.getBoundingClientRect().right}))}));
  report.push({kind,...state});
  await page.screenshot({path:`reference/qa/${kind}-home4-mobile.png`});
  await page.close();
}
console.log(JSON.stringify(report,null,2));
await writeFile('reference/qa/home4-overflow.json',JSON.stringify(report,null,2));
await browser.close();
