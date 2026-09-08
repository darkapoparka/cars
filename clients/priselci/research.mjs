import fs from 'node:fs/promises';
import {chromium} from '../../templates/boxcar/node_modules/playwright/index.mjs';
const out='J:/cars/clients/priselci/evidence';
const b=await chromium.launch({channel:'chrome',headless:true});
const p=await b.newPage();
for(const [key,url] of [['home','https://priselci.mobile.bg/'],['contact','https://priselci.mobile.bg/contacts'],['about','https://priselci.mobile.bg/about']]) {
 await p.goto(url,{waitUntil:'domcontentloaded',timeout:40000});
 const d=await p.evaluate(()=>({url:location.href,title:document.title,text:document.body.innerText,images:[...document.images].map(i=>({src:i.src,alt:i.alt})),links:[...document.querySelectorAll('a[href]')].map(a=>({href:a.href,text:a.innerText}))}));
 await fs.writeFile(`${out}/${key}.json`,JSON.stringify(d,null,2));
 await p.screenshot({path:`${out}/${key}.png`});
 if(key==='home') {
 const cards=await p.evaluate(()=>[...document.querySelectorAll('.ads2023 > .item')].map(e=>({title:e.querySelector('a.title')?.textContent.trim(),url:e.querySelector('a.title')?.href,parts:[...(e.querySelector('.text')?.children||[])].map(x=>({cls:x.className,text:x.textContent.trim()})),images:[...e.querySelectorAll('img')].map(i=>i.src).filter(s=>s.includes('photosorg'))})).filter(c=>c.title));
 await fs.writeFile(`${out}/cards.json`,JSON.stringify(cards,null,2)); console.log(JSON.stringify(cards.slice(0,2)));console.log('cards',cards.length);
 }
 console.log(key,d.text.slice(0,900));
}
await b.close();

