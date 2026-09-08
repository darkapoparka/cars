import fs from 'node:fs/promises';import {chromium} from '../../templates/boxcar/node_modules/playwright/index.mjs';
const root='J:/cars/clients/autolife',stock=JSON.parse(await fs.readFile(root+'/stock.json')),cards=JSON.parse(await fs.readFile(root+'/evidence/stock.json')).cards,prov=JSON.parse(await fs.readFile(root+'/assets/provenance.json'));
const b=await chromium.launch({headless:true,channel:'chrome'}),p=await b.newPage();
for(const [n,v] of stock.entries()){
v.priceEur=Number(cards[n].parts.find(x=>x.cls==='zaglavie').text.match(/^\s*([\d ]+)\s*€/m)[1].replaceAll(' ',''));await p.goto(v.sourceUrl,{waitUntil:'domcontentloaded'});await p.waitForTimeout(150);
const d=await p.evaluate(()=>({text:document.body.innerText,images:[...document.images].map(i=>i.currentSrc||i.src).filter(s=>s.includes('photosorg')),iframes:[...document.querySelectorAll('iframe')].map(x=>x.src)}));await fs.writeFile(root+'/evidence/detail-'+(n+1)+'.json',JSON.stringify(d,null,2));
const imgs=[...new Set(d.images)].slice(0,4);if(imgs.length){v.images=[];for(const [i,url] of imgs.entries()){const file=`vehicle-${String(n+1).padStart(2,'0')}-${i+1}.webp`;const full=url.replace(/(\/photosorg\/\d+\/\d+\/)(?!big)/,'$1big1/');const r=await fetch(full);if(!r.ok)throw Error(full);await fs.writeFile(root+'/assets/'+file,Buffer.from(await r.arrayBuffer()));v.images.push('/assets/autolife/'+file);prov.downloads.push({file,url:full,sourcePage:v.sourceUrl});}}
console.log(n+1,v.title,v.priceEur,v.images.length);
}
await p.goto('https://autolife.mobile.bg/contacts',{waitUntil:'domcontentloaded'});console.log('MAP',await p.locator('iframe').evaluateAll(es=>es.map(x=>x.src)));await fs.writeFile(root+'/stock.json',JSON.stringify(stock,null,2));await fs.writeFile(root+'/assets/provenance.json',JSON.stringify(prov,null,2));await b.close();
