import fs from 'node:fs/promises';
import { chromium } from '../../templates/boxcar/node_modules/playwright/index.mjs';
const root=import.meta.dirname;
await fs.mkdir(`${root}/assets`,{recursive:true});await fs.mkdir(`${root}/qa`,{recursive:true});
const b=await chromium.launch({channel:'chrome',headless:true});const p=await b.newPage();
for(const [name,url] of [['stock','https://championautopro.mobile.bg/'],['contact','https://championautopro.mobile.bg/contacts'],['about','https://championautopro.mobile.bg/about']]){
 await p.goto(url,{waitUntil:'domcontentloaded'});
 const data=await p.evaluate(()=>({title:document.title,text:document.body.innerText,links:[...document.querySelectorAll('a')].map(a=>({text:a.textContent.trim(),href:a.href})),photos:[...document.images].map(i=>({src:i.src,alt:i.alt}))}));
 await fs.writeFile(`${root}/qa/source-${name}.json`,JSON.stringify(data,null,2));
 if(name==='stock'){
 const cards=await p.evaluate(()=>[...document.querySelectorAll('.ads2023 > .item')].map(e=>({title:e.querySelector('a.title')?.textContent.trim(),url:e.querySelector('a.title')?.href,parts:[...e.querySelector('.text').children].map(x=>({cls:x.className,text:x.textContent.trim()})),images:[...e.querySelectorAll('img')].map(i=>i.src).filter(s=>s.includes('photosorg'))})));
 await fs.writeFile(`${root}/qa/stock-cards.json`,JSON.stringify(cards,null,2));console.log(cards.map(c=>({title:c.title,facts:c.parts.find(p=>p.cls==='params')?.text,price:c.parts.find(p=>p.cls==='zaglavie')?.text,images:c.images.length})));}
 else console.log(name,data.text.slice(0,4000));
}
await b.close();
