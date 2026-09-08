import fs from 'node:fs/promises';
import {chromium} from 'playwright';
const browser=await chromium.launch({headless:true,channel:'chrome'});
const results=[];
for(const [width,scale] of [[320,1],[390,2]]) {
  const page=await browser.newPage({viewport:{width,height:844}});
  for(const [key,route] of [['home2','/'],['inventory','/car.html'],['detail','/car-single.html?id=audi-rs6-avant'],['contact','/contact.html'],['about','/about.html'],['variants','/variants.html']]) {
    await page.goto('http://127.0.0.1:6601'+route,{waitUntil:'networkidle'});
    if(scale===2)await page.evaluate(()=>{
      const pairs=[...document.querySelectorAll('body *')].map(e=>[e,parseFloat(getComputedStyle(e).fontSize)]);
      for(const [element,size] of pairs)element.style.fontSize=size*2+'px';
    });
    await page.evaluate(()=>{document.body.style.overflowX='visible';document.documentElement.style.overflowX='visible';});
    const metrics=await page.evaluate(()=>({
      overflow:document.documentElement.scrollWidth-innerWidth,
      outside:[...document.querySelectorAll('main h1, main h2, header a, .dn-car-specs, .car-footer, .dn-results-toolbar, footer a')].map(e=>({text:e.textContent.slice(0,65),left:e.getBoundingClientRect().left,right:e.getBoundingClientRect().right,width:e.getBoundingClientRect().width})).filter(r=>r.width>0&&(r.left<-.5||r.right>innerWidth+.5))
    }));
    results.push({key,width,scale,...metrics});
    await page.screenshot({path:'.client/qa/screenshots/'+key+'-'+width+'-text'+scale+'.png'});
  }
  await page.close();
}
await fs.writeFile('.client/qa/responsive.json',JSON.stringify(results,null,2));
console.log(JSON.stringify(results,null,2));
await browser.close();
if(results.some(r=>r.overflow>0||r.outside.length))process.exitCode=1;
