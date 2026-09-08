import fs from 'node:fs/promises';
import path from 'node:path';
import { pathToFileURL } from 'node:url';

const root = path.resolve(import.meta.dirname, '..');
const pkg = await fs.access(path.join(root, 'templates/boxcar/node_modules/playwright/index.mjs')).then(() => 'templates/boxcar').catch(() => 'boxcar');
const { chromium } = await import(pathToFileURL(path.join(root, pkg, 'node_modules/playwright/index.mjs')));
const out = path.join(root, 'audits/2026-09-06');
await fs.mkdir(path.join(out, 'screenshots'), { recursive: true });
const defaults = [
  ['auto-best',5173,'/'], ['carwow',6517,'/'], ['modern',6212,'/cars'],
  ['import',6518,'/'], ['import-eliq',6404,'/inventory'],
  ['boxcar',6450,'/'], ['rencar',6430,'/'], ['nusavo',6420,'/'], ['motoria',6440,'/']
].map(([key,port,route]) => ({key,port,route}));
const input = process.argv[2] ? JSON.parse(await fs.readFile(process.argv[2], 'utf8')) : defaults;
const browser = await chromium.launch({headless:true,channel:'chrome'});
const results = [];
async function inspect(item) {
  for (const viewport of [{width:1440,height:900},{width:390,height:844}]) {
    const context = await browser.newContext({viewport});
    const page = await context.newPage();
    const errors = [], failed = [];
    page.on('pageerror', error => errors.push(error.message));
    page.on('console', message => { if(message.type()==='error') errors.push(message.text()); });
    page.on('response',response=>{ if(response.status()>=400) failed.push({url:response.url(),status:response.status()}); });
    const record = {...item,viewport,errors,failed};
    const label = `${item.key}-${item.label || 'entry'}-${viewport.width}`;
    try {
      const response = await page.goto(`http://127.0.0.1:${item.port}${item.route}`, {waitUntil:'domcontentloaded',timeout:item.timeout||45000});
      record.status = response?.status();
      await page.waitForFunction(()=>document.body.innerText.trim().length>100,{},{timeout:15000}).catch(()=>{});
      await page.waitForLoadState('networkidle',{timeout:5000}).catch(()=>{});
      if(item.settle) await page.waitForTimeout(item.settle);
      await page.screenshot({path:path.join(out, 'screenshots', `${label}.png`),timeout:15000});
      record.page = await page.evaluate(()=>({
        title:document.title, url:location.href,
        width:innerWidth, scrollWidth:document.documentElement.scrollWidth,height:document.documentElement.scrollHeight,
        text:document.body.innerText.slice(0,18000),
        headings:[...document.querySelectorAll('h1,h2,h3')].map(e=>({tag:e.tagName,text:e.textContent.trim()})).slice(0,90),
        links:[...document.querySelectorAll('a[href]')].map(e=>({text:(e.innerText||e.getAttribute('aria-label')||'').trim(),href:e.getAttribute('href')})).filter(x=>x.href).slice(0,220),
        controls:[...document.querySelectorAll('button,select,input')].map(e=>({tag:e.tagName,text:(e.innerText||e.getAttribute('aria-label')||e.getAttribute('placeholder')||'').trim().slice(0,180),type:e.getAttribute('type'),id:e.id})).slice(0,100),
        brokenImages:[...document.images].filter(e=>e.getBoundingClientRect().width>0 && e.complete && e.naturalWidth===0).map(e=>e.currentSrc),
        scripts:[...document.scripts].map(e=>e.src).filter(Boolean),
        sourceModules:[...document.querySelectorAll('link[rel="modulepreload"]')].map(e=>e.href)
      }));
      await page.evaluate(()=>scrollTo(0,Math.min(innerHeight,document.documentElement.scrollHeight-innerHeight)));
      if(item.settle) await page.waitForTimeout(item.settle);
      await page.screenshot({path:path.join(out, 'screenshots', `${label}-below.png`),timeout:15000});
    } catch(error) { record.failure = error.message; }
    results.push(record);
    await fs.writeFile(path.join(out, `results-${process.argv[3]||'baseline'}.json`),JSON.stringify(results,null,2));
    console.log(JSON.stringify({key:item.key,route:item.route,width:viewport.width,status:record.status,title:record.page?.title,overflow:record.page?record.page.scrollWidth-record.page.width:null,errors:errors.length,broken:record.page?.brokenImages.length,failure:record.failure}));
    await context.close();
  }
}
for(let n=0;n<input.length;n+=2) await Promise.all(input.slice(n,n+2).map(inspect));
await browser.close();
