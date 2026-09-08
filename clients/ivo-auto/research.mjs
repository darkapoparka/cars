import fs from 'node:fs/promises';
import {chromium} from './auto-best/node_modules/playwright/index.mjs';
const out='J:/cars/clients/ivo-auto/evidence';
const b=await chromium.launch({channel:'chrome',headless:true});const p=await b.newPage();
for(const route of ['', 'contacts','about']){
 await p.goto('https://ivoauto-varna.mobile.bg/'+route,{waitUntil:'domcontentloaded'});
 await fs.writeFile(`${out}/${route||'stock'}.html`,await p.content());
 const data=await p.evaluate(()=>({text:document.body.innerText,images:[...document.images].map(i=>({src:i.src,alt:i.alt})),links:[...document.querySelectorAll('a')].map(a=>({text:a.textContent.trim(),url:a.href})),cards:[...document.querySelectorAll('.ads2023 > .item')].slice(0,16).map(e=>({title:e.querySelector('a.title')?.textContent.trim(),url:e.querySelector('a.title')?.href,parts:[...e.querySelector('.text').children].map(x=>({cls:x.className,text:x.textContent.trim()})),images:[...e.querySelectorAll('img')].map(i=>i.src).filter(s=>s.includes('photosorg'))}))}));
 await fs.writeFile(`${out}/${route||'stock'}.json`,JSON.stringify(data,null,2));
 console.log(route||'stock',data.images.slice(0,3),data.cards.length);
}
await b.close();

