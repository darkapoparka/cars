import {chromium} from 'playwright';
import {readFile,writeFile} from 'node:fs/promises';
import {PNG} from 'pngjs';
import pixelmatch from 'pixelmatch';
const browser=await chromium.launch({channel:'chrome',headless:true});
const context=await browser.newContext();
const results=[];
for(const width of [1440,390]) for(const variant of [2,3,4,5]) {
  const height=width===390?844:1000;
  const row={width,variant};
  for(const [kind,base] of [['reference','https://live.themewild.com/rencar/'],['local','http://127.0.0.1:6430/']]) {
    const page=await context.newPage();await page.setViewportSize({width,height});
    await page.goto(base+`index-${variant}.html`,{waitUntil:'load'});
    await page.waitForFunction(()=>window.jQuery?.fn.owlCarousel&&document.querySelector('.ss-main'));
    await page.evaluate(()=>document.fonts.ready);
    await page.locator('.preloader').waitFor({state:'hidden'});
    await page.evaluate(()=>{window.jQuery('.owl-carousel').trigger('stop.owl.autoplay');window.jQuery('.hero-slider').trigger('to.owl.carousel',[0,0]);});
    await page.addStyleTag({content:'.wow{visibility:visible!important}*,*::before,*::after{animation:none!important;transition:none!important;caret-color:transparent!important}'});
    await page.waitForTimeout(300);
    await page.screenshot({path:`reference/qa/${kind}-variant${variant}-${width}.png`});
    row[kind]=await page.evaluate(()=>({bodyClass:document.body.className,width:innerWidth,scrollWidth:document.documentElement.scrollWidth}));
    await page.close();
  }
  const a=PNG.sync.read(await readFile(`reference/qa/reference-variant${variant}-${width}.png`));
  const b=PNG.sync.read(await readFile(`reference/qa/local-variant${variant}-${width}.png`));
  row.pixelMismatchPercent=100*pixelmatch(a.data,b.data,null,width,height,{threshold:.1})/(width*height);
  results.push(row);console.log(JSON.stringify(row));
}
await writeFile('reference/qa/variant-report.json',JSON.stringify(results,null,2));
await browser.close();
