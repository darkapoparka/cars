import fs from 'node:fs/promises';
import {chromium} from '../../templates/boxcar/node_modules/playwright/index.mjs';
const browser=await chromium.launch({headless:true,channel:'chrome'});
const output=[];
for(const port of [6517,6518]){
 const page=await browser.newPage({viewport:{width:1440,height:900}});
 await page.goto(`http://127.0.0.1:${port}/inventory`);
 await page.waitForLoadState('networkidle',{timeout:5000}).catch(()=>{});
 if(port===6517) await page.locator('#daynight-inventory-hero-search').click();
 const search=page.locator('input').filter({visible:true}).first();
 const record={port,placeholder:await search.getAttribute('placeholder')};
 await search.fill('BMW');await search.press('Enter');
 await page.waitForTimeout(1200);
 record.url=page.url();record.headings=await page.locator('h2,h3').filter({visible:true}).allTextContents();

 await page.screenshot({path:`audits/2026-09-06/screenshots/shortlist-${port}-desktop-search.png`});
 output.push(record);console.log(JSON.stringify(record));await page.close();
}
await fs.writeFile('audits/2026-09-06/shortlist-desktop-search.json',JSON.stringify(output,null,2));await browser.close();


