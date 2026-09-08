import { chromium } from 'playwright';
import { mkdir, readFile, writeFile } from 'node:fs/promises';
import { PNG } from 'pngjs';
import pixelmatch from 'pixelmatch';

await mkdir('reference/qa',{recursive:true});
const browser=await chromium.launch({channel:'chrome',headless:true});
const results=[];
async function settle(page, local) {
  if(local) await page.waitForFunction(()=>document.documentElement.dataset.rencarReady==='true');
  else await page.waitForFunction(()=>window.jQuery&&(!document.querySelector('.hero-slider')||document.querySelector('.hero-slider.owl-loaded')));
  await page.evaluate(async()=>{
    await document.fonts.ready;
    window.jQuery('.owl-carousel').trigger('stop.owl.autoplay');
    window.jQuery('.hero-slider').trigger('to.owl.carousel',[0,0]);
    document.querySelectorAll('.preloader').forEach(x=>x.style.display='none');
    document.querySelectorAll('.wow').forEach(x=>{x.style.visibility='visible';x.style.animationName='none';});
    document.querySelectorAll('[data-animation]').forEach(x=>{x.classList.remove('animated');x.style.opacity='1';x.style.animation='none';});
    document.querySelectorAll('.counter').forEach(x=>{x.textContent=x.dataset.to||x.textContent;});
  });
  await page.addStyleTag({content:'*,*::before,*::after{animation:none!important;transition:none!important;caret-color:transparent!important}.wow{visibility:visible!important}'});
  await page.waitForTimeout(600);
  await page.evaluate(()=>{document.querySelectorAll('.counter').forEach(x=>{clearInterval(window.jQuery(x).data('countTo')?.interval);x.textContent=x.dataset.to||x.textContent;});});
}
for(const [name,width,height] of [['desktop',1440,1000],['mobile',390,844]]) {
  const record={viewport:name,width,height};
  for(const [kind,base] of [['reference','https://live.themewild.com/rencar/'],['local','http://127.0.0.1:6430/']]) {
    const page=await browser.newPage({viewport:{width,height}});
    const errors=[];const failed=[];
    page.on('pageerror',e=>errors.push(e.message));
    page.on('response',r=>{if(r.status()>=400)failed.push({url:r.url(),status:r.status()});});
    await page.goto(base,{waitUntil:'load'});
    await settle(page,kind==='local');
    await page.screenshot({path:`reference/qa/${kind}-${name}.png`});
    await page.screenshot({path:`reference/qa/${kind}-${name}-full.png`,fullPage:true});
    record[kind]=await page.evaluate(()=>({title:document.title,width:innerWidth,scrollWidth:document.documentElement.scrollWidth,height:document.body.scrollHeight,images:[...document.images].filter(i=>!i.complete||!i.naturalWidth).map(i=>i.src),headings:[...document.querySelectorAll('h1,h2')].map(x=>x.textContent.trim()),fonts:[getComputedStyle(document.body).fontFamily,getComputedStyle(document.querySelector('h2')||document.body).fontFamily]}));
    record[kind].errors=errors;record[kind].failed=failed;
    await page.close();
  }
  const a=PNG.sync.read(await readFile(`reference/qa/reference-${name}.png`));
  const b=PNG.sync.read(await readFile(`reference/qa/local-${name}.png`));
  const diff=new PNG({width,height});
  const mismatch=pixelmatch(a.data,b.data,diff.data,width,height,{threshold:.1});
  await writeFile(`reference/qa/diff-${name}.png`,PNG.sync.write(diff));
  record.pixelMismatchPercent=100*mismatch/(width*height);
  const fullA=PNG.sync.read(await readFile(`reference/qa/reference-${name}-full.png`));
  const fullB=PNG.sync.read(await readFile(`reference/qa/local-${name}-full.png`));
  if(fullA.height===fullB.height) record.fullPagePixelMismatchPercent=100*pixelmatch(fullA.data,fullB.data,null,fullA.width,fullA.height,{threshold:.1})/(fullA.width*fullA.height);
  results.push(record);
  console.log(name,JSON.stringify(record));
}
await writeFile('reference/qa/visual-report.json',JSON.stringify(results,null,2));
await browser.close();
