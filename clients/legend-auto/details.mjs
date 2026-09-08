import fs from 'node:fs/promises';
import {chromium} from '../../templates/boxcar/node_modules/playwright/index.mjs';
const root=import.meta.dirname;const home=JSON.parse(await fs.readFile(`${root}/research/home.json`));
const browser=await chromium.launch({channel:'chrome',headless:true});const p=await browser.newPage();let all=[];
for(const [i,c] of home.cards.filter(c=>c.title&&c.url&&!/на части|продаден/i.test(c.title)).slice(0,16).entries()){
await p.goto(c.url,{waitUntil:'domcontentloaded',timeout:45000});
const d=await p.evaluate(()=>({url:location.href,title:document.title,text:document.body.innerText,images:[...document.images].map(i=>({src:i.currentSrc||i.src,alt:i.alt})),html:document.documentElement.outerHTML}));
await fs.writeFile(`${root}/research/detail-${i+1}.json`,JSON.stringify(d,null,2));
const images=[...new Set([...d.images.map(i=>i.src),...d.html.matchAll(/https?:[^"'\s<>]+photosorg[^"'\s<>]+/g)].map(x=>typeof x==='string'?x:x[0]).map(s=>s.replaceAll('&amp;','&')).filter(s=>/photosorg.*\.(webp|jpg|jpeg)/.test(s)))];
all.push({...c,detail:d.text,gallery:images.slice(0,6)});console.log(`${i+1} ${c.title} — ${images.length} images`);
}await fs.writeFile(`${root}/research/selected.json`,JSON.stringify(all,null,2));await browser.close();
