import fs from 'node:fs/promises';
import {chromium} from '../../templates/boxcar/node_modules/playwright/index.mjs';
const root=import.meta.dirname;await fs.mkdir(`${root}/research`,{recursive:true});
const browser=await chromium.launch({channel:'chrome',headless:true});const p=await browser.newPage();
for(const [key,url] of [['home','https://legendauto1.mobile.bg/'],['contact','https://legendauto1.mobile.bg/contacts'],['about','https://legendauto1.mobile.bg/about']]){
await p.goto(url,{waitUntil:'domcontentloaded',timeout:45000});
await p.screenshot({path:`${root}/research/${key}.png`});
const d=await p.evaluate(()=>({capturedAt:new Date().toISOString(),url:location.href,title:document.title,text:document.body.innerText,images:[...document.images].map(i=>({src:i.currentSrc||i.src,alt:i.alt})),links:[...document.querySelectorAll('a[href]')].map(a=>({url:a.href,text:a.textContent.trim()})),cards:[...document.querySelectorAll('.ads2023 > .item')].map(e=>({title:e.querySelector('a.title')?.textContent.trim(),url:e.querySelector('a.title')?.href,parts:[...(e.querySelector('.text')?.children||[])].map(x=>({cls:x.className,text:x.textContent.trim()})),images:[...e.querySelectorAll('img')].map(i=>i.src).filter(s=>s.includes('photosorg'))}))}));
await fs.writeFile(`${root}/research/${key}.json`,JSON.stringify(d,null,2));await fs.writeFile(`${root}/research/${key}.html`,await p.content());console.log(JSON.stringify({key,title:d.title,cards:d.cards.length,text:d.text.slice(0,800)}));}
await browser.close();
