import {chromium} from '@playwright/test';
import fs from 'node:fs';
const browser=await chromium.launch({headless:true}); const page=await browser.newPage({viewport:{width:1440,height:1000}});page.on('console',m=>{if(m.type()==='error')console.log('console',m.text().slice(0,180))});page.on('pageerror',e=>console.log('pageerror',e.message));
await page.goto('http://127.0.0.1:6613',{waitUntil:'domcontentloaded',timeout:120000});await page.waitForTimeout(2500);console.log(await page.title());console.log((await page.locator('body').innerText()).slice(0,5000));await page.screenshot({path:'.client/home-1440.png',fullPage:true});console.log('images',await page.locator('img').evaluateAll(es=>es.filter(e=>!e.complete||!e.naturalWidth).map(e=>e.currentSrc||e.src)));await browser.close();
