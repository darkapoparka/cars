import fs from 'node:fs/promises';
import {chromium} from '../../templates/boxcar/node_modules/playwright/index.mjs';
const root='J:/cars/clients/excellent-cars';
await fs.mkdir(`${root}/research`,{recursive:true}); await fs.mkdir(`${root}/assets`,{recursive:true});
const browser=await chromium.launch({channel:'chrome',headless:true});
for(const [key,url] of [['stock','https://excellent.mobile.bg/'],['contact','https://excellent.mobile.bg/contacts'],['about','https://excellent.mobile.bg/aboutus'],['cars','https://excellent.cars.bg/']]){
 const p=await browser.newPage(); try{await p.goto(url,{waitUntil:'domcontentloaded',timeout:35000});await p.waitForTimeout(1000);
 const d=await p.evaluate(()=>({url:location.href,title:document.title,text:document.body.innerText,images:[...document.images].map(i=>({src:i.currentSrc||i.src,alt:i.alt,width:i.naturalWidth,height:i.naturalHeight})),links:[...document.querySelectorAll('a[href]')].map(a=>({href:a.href,text:a.innerText})),frames:[...document.querySelectorAll('iframe')].map(i=>i.src)}));
 await fs.writeFile(`${root}/research/${key}.json`,JSON.stringify(d,null,2));await fs.writeFile(`${root}/research/${key}.html`,await p.content());await p.screenshot({path:`${root}/research/${key}.png`});
 if(key==='stock'){const cards=await p.evaluate(()=>[...document.querySelectorAll('.ads2023 > .item')].map(e=>({title:e.querySelector('a.title')?.textContent.trim(),url:e.querySelector('a.title')?.href,parts:[...(e.querySelector('.text')?.children||[])].map(x=>({cls:x.className,text:x.textContent.trim()})),images:[...e.querySelectorAll('img')].map(i=>i.src).filter(s=>s.includes('photosorg'))})));await fs.writeFile(`${root}/research/cards.json`,JSON.stringify(cards,null,2));console.log({cards:cards.length,titles:cards.map(c=>c.title)});}
 console.log(JSON.stringify({key,title:d.title,text:key==='stock'?d.text.slice(0,120):d.text.slice(0,7500),images:d.images.filter(i=>!i.src.includes('photosorg')).slice(0,12),social:d.links.filter(l=>/facebook|instagram/.test(l.href))}));
 }catch(e){console.log(key,e.message)} await p.close();
}await browser.close();
