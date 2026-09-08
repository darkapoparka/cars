import fs from 'node:fs/promises';import {chromium} from '../../templates/boxcar/node_modules/playwright/index.mjs';
const root=import.meta.dirname,variant=process.argv[2],port={"auto-best":6631,modern:6632,carwow:6633}[variant];
const stock=JSON.parse(await fs.readFile(`${root}/stock.json`));const first=stock[0];
const slug=first.title.toLowerCase().replace(/[^a-z0-9]+/g,'-').replace(/^-|-$/g,'')+'-'+first.id.slice(-6);
const paths=variant==='auto-best'?['/','/listing-grid','/listing-detail-v1/1','/contact','/about-us','/blog']:variant==='modern'?['/cars','/bg/cars',`/bg/listing/champion-${first.id}`,'/bg/contact','/bg/imports','/bg/sell','/bg/lease']:['/','/inventory',`/inventory/${slug}`,'/contact','/about','/financing','/reviews'];
const b=await chromium.launch({channel:'chrome',headless:true});const results=[];
try {
for(const width of [390,1440]){
 const ctx=await b.newContext({viewport:{width,height:900},deviceScaleFactor:1});const p=await ctx.newPage();let errors=[];p.on('pageerror',e=>errors.push(e.message));p.on('console',e=>{if(e.type()==='error')errors.push(e.text())});
 for(const [i,route] of paths.entries()){
 errors=[];const response=await p.goto(`http://127.0.0.1:${port}${route}`,{waitUntil:'domcontentloaded',timeout:60000}).catch(e=>{errors.push(e.message);return null;});
 await p.waitForTimeout(1500);
 await p.evaluate(async()=>{await document.fonts.ready;for(let y=0;y<document.body.scrollHeight;y+=750){window.scrollTo(0,y);await new Promise(r=>setTimeout(r,35));}window.scrollTo(0,0);});await p.waitForTimeout(500);
 const data=await p.evaluate(()=>({url:location.href,title:document.title,text:document.body.innerText,overflow:document.documentElement.scrollWidth>innerWidth,brokenImages:[...document.images].filter(i=>i.getBoundingClientRect().width>0&&(!i.complete||i.naturalWidth===0)).map(i=>i.currentSrc||i.src),phones:[...document.querySelectorAll('a[href^="tel:"]')].map(a=>a.getAttribute('href')),links:[...document.querySelectorAll('a')].filter(a=>a.getBoundingClientRect().width).map(a=>({text:a.innerText,href:a.getAttribute('href')})),buttons:[...document.querySelectorAll('button')].filter(a=>a.getBoundingClientRect().width).map(a=>({text:a.innerText,label:a.getAttribute('aria-label')})),inputs:[...document.querySelectorAll('input,select')].filter(a=>a.getBoundingClientRect().width).map(a=>({tag:a.tagName,type:a.type,name:a.name,label:a.getAttribute('aria-label'),placeholder:a.getAttribute('placeholder')}))}));
 const screenshot=`${variant}-${width}-${i}.png`;await p.screenshot({path:`${root}/qa/${screenshot}`,fullPage:true});results.push({width,route,status:response?.status(),...data,errors:[...new Set(errors)],screenshot});await fs.writeFile(`${root}/qa/${variant}-routes.json`,JSON.stringify(results,null,2));console.log(JSON.stringify({width,route,status:response?.status(),overflow:data.overflow,broken:data.brokenImages.length,errors:errors.length}));
 }
 await ctx.close();
}
await fs.writeFile(`${root}/qa/${variant}-routes.json`,JSON.stringify(results,null,2));
} finally {await b.close();}
