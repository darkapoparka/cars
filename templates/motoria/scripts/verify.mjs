import { chromium } from 'playwright';
import { readFile, writeFile, mkdir } from 'node:fs/promises';
const manifest=JSON.parse(await readFile('references/manifest.json','utf8'));
const browser=await chromium.connectOverCDP(process.argv[2]);
const page=await browser.contexts()[0].newPage();
await mkdir('references/local',{recursive:true});
const results=[];
for(const route of manifest){
 if(process.env.ONLY && route.name!==process.env.ONLY) continue;
 const failures=[],errors=[];
 const onResponse=r=>{if(r.status()>=400)failures.push({url:r.url(),status:r.status()});};
 const onError=e=>errors.push(e.message);
 page.on('response',onResponse);page.on('pageerror',onError);
 for(const [width,height,label] of [[1440,1000,'desktop'],[390,844,'mobile']]){
  await page.setViewportSize({width,height});
  await page.goto('http://127.0.0.1:6440'+route.route+(route.name==='pricing'?'?style=all':''),{waitUntil:'domcontentloaded'});
  await page.waitForTimeout(2200);
  await page.evaluate(async()=>{for(let y=0;y<document.body.scrollHeight;y+=700){window.scrollTo(0,y);await new Promise(r=>setTimeout(r,60));}window.scrollTo(0,0);});
  await page.waitForTimeout(300);
  await page.screenshot({path:`references/local/${route.name}-${label}.png`,fullPage:true});
  const metrics=await page.evaluate(()=>({title:document.title,width:innerWidth,scrollWidth:document.documentElement.scrollWidth,height:document.body.scrollHeight,brokenImages:[...document.images].filter(i=>i.getBoundingClientRect().width>0&&i.getBoundingClientRect().height>0&&(!i.complete||!i.naturalWidth)&&getComputedStyle(i).visibility!=='hidden').map(i=>i.src),headings:[...document.querySelectorAll('h1,h2,h3')].filter(e=>e.getBoundingClientRect().height).map(e=>e.textContent.trim())}));
  if(metrics.title!==route.title)throw new Error(`Unexpected page identity: ${metrics.title}`);
  results.push({name:route.name,viewport:label,...metrics,failures:[...failures],errors:[...errors]});
  console.log(route.name,label,'height',metrics.height,'overflow',metrics.scrollWidth-width,'images',metrics.brokenImages.length,'errors',errors.length,'failed',failures.length);
 }
 page.off('response',onResponse);page.off('pageerror',onError);
 const prior = process.env.ONLY ? JSON.parse(await readFile('references/verification.json','utf8')).filter(x=>x.name!==process.env.ONLY) : [];
 await writeFile('references/verification.json',JSON.stringify([...prior,...results],null,2));
}
await page.close();await browser.close();
