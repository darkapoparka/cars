import fs from 'node:fs/promises';
import {chromium} from '../../templates/boxcar/node_modules/playwright/index.mjs';
const root='J:/cars/clients/astracar';await fs.mkdir(root+'/evidence',{recursive:true});await fs.mkdir(root+'/assets',{recursive:true});
const b=await chromium.launch({channel:'chrome',headless:true});const p=await b.newPage();
for(const [key,url] of [['stock','https://astracar.mobile.bg/'],['contact','https://astracar.mobile.bg/contacts'],['about','https://astracar.mobile.bg/about']]){
await p.goto(url,{waitUntil:'domcontentloaded',timeout:45000});await p.waitForTimeout(1000);
const d=await p.evaluate(()=>({url:location.href,text:document.body.innerText,images:[...document.images].map(i=>({src:i.currentSrc||i.src,alt:i.alt})),links:[...document.querySelectorAll('a[href]')].map(a=>({href:a.href,text:a.innerText}))}));await fs.writeFile(root+'/evidence/'+key+'.json',JSON.stringify(d,null,2));
if(key==='stock'){const cards=await p.locator('.ads2023 > .item').evaluateAll(es=>es.map(e=>({title:e.querySelector('a.title')?.textContent.trim(),url:e.querySelector('a.title')?.href,parts:[...e.querySelector('.text').children].map(x=>({cls:x.className,text:x.textContent.trim()})),images:[...e.querySelectorAll('img')].map(i=>i.src).filter(s=>s.includes('photosorg'))})));await fs.writeFile(root+'/evidence/cards.json',JSON.stringify(cards,null,2));console.log(JSON.stringify(cards.slice(0,2)));}
console.log(key,d.text.slice(0,650));}
await b.close();


