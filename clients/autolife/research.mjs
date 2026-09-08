import fs from 'node:fs/promises';
import {chromium} from '../../templates/boxcar/node_modules/playwright/index.mjs';
const root='J:/cars/clients/autolife'; await fs.mkdir(root+'/assets',{recursive:true}); await fs.mkdir(root+'/evidence',{recursive:true});
const b=await chromium.launch({channel:'chrome',headless:true}); const p=await b.newPage();
for(const [name,url] of [['stock','https://autolife.mobile.bg/'],['contact','https://autolife.mobile.bg/contacts'],['about','https://autolife.mobile.bg/about']]){
await p.goto(url,{waitUntil:'domcontentloaded'});await p.waitForTimeout(900);
const d=await p.evaluate(()=>({url:location.href,text:document.body.innerText,images:[...document.images].map(i=>({src:i.currentSrc||i.src,alt:i.alt})),links:[...document.querySelectorAll('a')].map(a=>({text:a.textContent.trim(),url:a.href})),cards:[...document.querySelectorAll('.ads2023 > .item')].map(e=>({title:e.querySelector('a.title')?.textContent.trim(),url:e.querySelector('a.title')?.href,parts:[...(e.querySelector('.text')?.children||[])].map(x=>({cls:x.className,text:x.textContent.trim()})),images:[...e.querySelectorAll('img')].map(i=>i.src).filter(s=>s.includes('photosorg'))}))}));
await fs.writeFile(root+'/evidence/'+name+'.json',JSON.stringify(d,null,2));await p.screenshot({path:root+'/evidence/'+name+'.png'});console.log(name,d.text.slice(0,name==='stock'?500:5000));if(name==='stock') console.log(JSON.stringify(d.cards.slice(0,1)));
}
await b.close();
