import fs from 'node:fs/promises';
import path from 'node:path';
import {pathToFileURL} from 'node:url';
const root=path.resolve(import.meta.dirname,'../..');
const {chromium}=await import(pathToFileURL(path.join(root,'templates/boxcar/node_modules/playwright/index.mjs')));
const browser=await chromium.launch({headless:true,channel:'chrome'});
const out=path.join(root,'audits/2026-09-06'), results=[];
const entries=[['auto-best',5173,'/listing-grid','Филтри'],['carwow',6517,'/inventory','Филтри'],['modern',6212,'/cars','Отвори филтрите'],['import',6518,'/inventory','Филтри'],['showroom',6404,'/inventory','Филтри'],['boxcar',6450,'/listings/','More Filters'],['rencar',6430,'/','Open search'],['nusavo',6420,'/car-listing/','Economy'],['motoria',6440,'/inventory/','Search Options'],['autodeal',6460,'/',null]].filter(x=>!process.argv[2]||process.argv[2].split(',').includes(x[0]));
for(const [key,port,route,name] of entries) {
  const context=await browser.newContext({viewport:{width:390,height:844}}),page=await context.newPage(),record={key,port,route,name,errors:[]};
  page.on('console',m=>{if(m.type()==='error')record.errors.push({text:m.text(),location:m.location()});});
  try {
    await page.goto(`http://127.0.0.1:${port}${route}`,{waitUntil:'domcontentloaded',timeout:45000});
    await page.waitForLoadState('networkidle',{timeout:4000}).catch(()=>{});
    record.controls=await page.locator('button,a,[role=button]').evaluateAll(es=>es.filter(e=>e.getBoundingClientRect().width>0).map(e=>({tag:e.tagName,role:e.getAttribute('role'),name:e.getAttribute('aria-label')||e.innerText.trim(),class:e.className})).slice(0,40));
    if(name) {
      let trigger=page.getByRole('button',{name,exact:true}).filter({visible:true}).first();
      if(!(await trigger.count()))trigger=page.getByText(name,{exact:true}).filter({visible:true}).first();
      if(await trigger.count()) {
        await trigger.click({timeout:6000});
        await page.waitForTimeout(500);
        record.after={url:page.url(),text:(await page.locator('body').innerText()).slice(0,10000),dialogs:await page.locator('[role="dialog"],dialog[open]').filter({visible:true}).count()};
        await page.screenshot({path:path.join(out,'screenshots',`${key}-shortlist-interaction-390.png`)});
        await page.keyboard.press('Escape');
        await page.waitForTimeout(300);
        record.afterEscape=await page.evaluate(()=>({dialogs:[...document.querySelectorAll('[role="dialog"],dialog[open]')].filter(e=>e.getBoundingClientRect().width>0&&getComputedStyle(e).visibility!=='hidden').length,active:document.activeElement?.getAttribute('aria-label')||document.activeElement?.textContent?.trim().slice(0,100)}));
        record.result='action-inspected';
      }else record.result='control-not-found';
    }else record.result='navigation-inventory-only';
  }catch(e){record.failure=e.message;}
  results.push(record);
  console.log(JSON.stringify({key,result:record.result,failure:record.failure,dialogs:record.after?.dialogs,afterEscape:record.afterEscape,errors:record.errors}));
  await fs.writeFile(path.join(out,'shortlist-interactions.json'),JSON.stringify(results,null,2));
  await context.close();
}
await browser.close();

