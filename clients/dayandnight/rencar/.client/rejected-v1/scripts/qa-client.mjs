import fs from 'node:fs/promises';
import path from 'node:path';
import {chromium} from 'playwright';
const root=path.resolve(import.meta.dirname,'..'),out=path.join(root,'.client/qa');
await fs.mkdir(path.join(out,'screenshots'),{recursive:true});
const browser=await chromium.launch({headless:true,channel:'chrome'});
const routes=[['home2','/'],['home1','/index.html'],['home3','/index-3.html'],['home4','/index-4.html'],['home5','/index-5.html'],['inventory','/car.html'],['detail','/car-single.html?id=audi-rs6-avant'],['contact','/contact.html'],['about','/about.html'],['services','/service.html'],['variants','/variants.html']];
const results=[];
for(const width of [1440,390]) {
  const context=await browser.newContext({viewport:{width,height:width===390?844:900}});
  const page=await context.newPage();
  for(const [key,route] of routes){
    const errors=[];const listener=message=>{if(message.type()==='error')errors.push(message.text());};const pageError=error=>errors.push(error.message);
    page.on('console',listener);page.on('pageerror',pageError);
    const response=await page.goto('http://127.0.0.1:6601'+route,{waitUntil:'networkidle',timeout:45000});
    await page.evaluate(()=>scrollTo(0,0));
    await page.screenshot({path:path.join(out,'screenshots',`${key}-${width}.png`)});
    const metrics=await page.evaluate(()=>({title:document.title,h1:document.querySelector('h1')?.textContent,overflow:document.documentElement.scrollWidth-document.documentElement.clientWidth,brokenImages:[...document.images].filter(i=>i.getBoundingClientRect().width>0&&i.complete&&!i.naturalWidth).map(i=>i.src),staleText:/rencar|lorem ipsum|Book Your Ride|Rental Cars|Toyota Camry|New York|25k Trusted|30\+ Years/i.test(document.body.innerText),mainHeight:document.querySelector('main')?.getBoundingClientRect().height}));
    await page.evaluate(()=>scrollTo(0,innerHeight));await page.screenshot({path:path.join(out,'screenshots',`${key}-${width}-below.png`)});
    await page.screenshot({path:path.join(out,'screenshots',`${key}-${width}-full.png`),fullPage:true});
    page.off('console',listener);page.off('pageerror',pageError);
    const record={key,route,width,status:response.status(),errors,...metrics};results.push(record);console.log(JSON.stringify(record));
    await fs.writeFile(path.join(out,'routes.json'),JSON.stringify(results,null,2));
  }
  await context.close();
}
await browser.close();
if(results.some(r=>r.status!==200||r.errors.length||r.overflow>0||r.brokenImages.length||r.staleText||!r.h1))process.exitCode=1;
