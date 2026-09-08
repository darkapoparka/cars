import fs from 'node:fs/promises';
import {chromium} from '../../templates/boxcar/node_modules/playwright/index.mjs';
const root=new URL('./',import.meta.url);
const browser=await chromium.launch({channel:'chrome',headless:true});
const page=await browser.newPage();
await page.goto('https://avangard-auto.mobile.bg/',{waitUntil:'domcontentloaded'});
await fs.writeFile(new URL('evidence/mobile-home.html',root),await page.content());
const cards=await page.evaluate(()=>[...document.querySelectorAll('.ads2023 > .item')].map(e=>({title:e.querySelector('a.title')?.textContent.trim(),url:e.querySelector('a.title')?.href,parts:[...(e.querySelector('.text')?.children||[])].map(x=>({cls:x.className,text:x.textContent.trim()})),images:[...e.querySelectorAll('img')].map(i=>i.src).filter(s=>s.includes('photosorg'))})).filter(x=>x.title));
await fs.writeFile(new URL('evidence/stock-cards.json',root),JSON.stringify(cards,null,2));
console.log(JSON.stringify(cards[0]));
for(const route of ['contacts','about']) {await page.goto('https://avangard-auto.mobile.bg/'+route,{waitUntil:'domcontentloaded'}); const data=await page.evaluate(()=>({url:location.href,text:document.body.innerText,images:[...document.images].map(i=>i.src),links:[...document.querySelectorAll('a')].map(a=>({text:a.textContent,url:a.href}))}));await fs.writeFile(new URL(`evidence/${route}.json`,root),JSON.stringify(data,null,2));}
for(const [i,c] of cards.slice(0,16).entries()) {await page.goto(c.url,{waitUntil:'domcontentloaded'}); const d=await page.evaluate(()=>({url:location.href,text:document.body.innerText,images:[...document.images].map(i=>i.currentSrc||i.src),links:[...document.querySelectorAll('a')].map(a=>a.href).filter(s=>s.includes('photos'))})); await fs.writeFile(new URL(`evidence/detail-${i+1}.json`,root),JSON.stringify(d,null,2)); console.log(i+1,c.title,d.images.filter(s=>s.includes('photos')).length);}
await browser.close();
