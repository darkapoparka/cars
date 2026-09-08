import { chromium } from 'playwright';
import { readFile,writeFile } from 'node:fs/promises';
const manifest=JSON.parse(await readFile('reference/manifest.json','utf8'));
const browser=await chromium.launch({channel:'chrome',headless:true});
const rows=[];
for(const width of [1440,390]) {
  const context=await browser.newContext({viewport:{width,height:900}});
  for(const route of Object.keys(manifest)) {
    const page=await context.newPage();
    const errors=[];const failed=[];
    page.on('pageerror',e=>errors.push(e.message));
    page.on('response',r=>{if(r.status()>=400&&r.url().startsWith('http://127.0.0.1:6430'))failed.push(r.url());});
    try {
      await page.goto('http://127.0.0.1:6430/'+route,{waitUntil:'domcontentloaded'});
      await page.waitForFunction(()=>document.documentElement.dataset.rencarReady==='true',{timeout:20000});
      await page.evaluate(()=>document.fonts.ready);
      const state=await page.evaluate(()=>({title:document.title,width:innerWidth,scrollWidth:document.documentElement.scrollWidth,brokenImages:[...document.images].filter(i=>i.complete&&!i.naturalWidth).map(i=>i.src),content:document.body.innerText.trim().length}));
      rows.push({route,width,...state,errors,failed});
      console.log(route,width,errors.length||failed.length||state.brokenImages.length?'FAIL':'OK',state.scrollWidth>width?'OVERFLOW':'');
    } catch(e) {rows.push({route,width,error:e.message,errors,failed});console.log(route,width,e.message);}
    await page.close();
  }
  await context.close();
}
await writeFile('reference/qa/route-report.json',JSON.stringify(rows,null,2));
await browser.close();
