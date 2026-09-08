import fs from 'node:fs/promises';import {chromium} from './auto-best/node_modules/playwright/index.mjs';
const root='J:/cars/clients/priselci',variant=process.argv[2];
const stock=JSON.parse(await fs.readFile(`${root}/stock.json`));
const slug=stock[0].title.toLowerCase().replace(/[^a-z0-9]+/g,'-').replace(/^-|-$/g,'')+'-'+stock[0].id.slice(-6);
const config={ 'auto-best':{port:6646,routes:['/','/listing-grid','/listing-detail-v1/1','/contact']},modern:{port:6647,routes:['/cars','/bg/cars',`/bg/listing/priselci-${stock[0].id}`,'/bg/contact']},carwow:{port:6648,routes:['/','/inventory',`/inventory/${slug}`,'/contact']}}[variant];
const b=await chromium.launch({channel:'chrome',headless:true}),results=[];
for(const width of [390,1440]){
 const context=await b.newContext({viewport:{width,height:900},...(width===390?{isMobile:true,hasTouch:true,userAgent:'Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Mobile/15E148 Safari/604.1'}:{})});
 const p=await context.newPage();
 for(const [i,route] of config.routes.entries()){
  const errors=[];const listener=e=>errors.push(e.message);p.on('pageerror',listener);
  try {const res=await p.goto(`http://127.0.0.1:${config.port}${route}`,{waitUntil:'networkidle',timeout:90000});await p.waitForTimeout(400);
   await p.evaluate(()=>{for(const i of document.images)i.loading='eager';});
   for(let step=0;step<8;step++){await p.evaluate(()=>window.scrollBy(0,900));await p.waitForTimeout(120);}await p.waitForTimeout(1200);await p.evaluate(()=>window.scrollTo(0,0));
   const report=await p.evaluate(()=>({url:location.href,title:document.title,h1:[...document.querySelectorAll('h1')].map(e=>e.innerText),width:innerWidth,scrollWidth:document.documentElement.scrollWidth,text:document.body.innerText,images:[...document.images].filter(i=>!i.complete||i.naturalWidth===0).map(i=>({src:i.currentSrc||i.src,alt:i.alt})),links:[...document.querySelectorAll('a')].map(a=>({text:a.innerText,href:a.getAttribute('href')})),buttons:[...document.querySelectorAll('button')].filter(e=>e.getBoundingClientRect().width).map(e=>({text:e.innerText,label:e.getAttribute('aria-label')})),inputs:[...document.querySelectorAll('input,select')].filter(e=>e.getBoundingClientRect().width).map(e=>({tag:e.tagName,label:e.getAttribute('aria-label'),name:e.name,placeholder:e.placeholder}))}));
   const image=`${variant}-${width}-${i}.png`;await p.screenshot({path:`${root}/evidence/${image}`,fullPage:true});
   results.push({route,width,status:res.status(),errors,screenshot:image,...report});console.log(JSON.stringify({variant,route,width,status:res.status(),overflow:report.scrollWidth>width,brokenImages:report.images.length,errors}));
  }catch(e){results.push({route,width,error:e.message});console.log(route,e.message);}
  p.off('pageerror',listener);
 }
 await context.close();
}
await b.close();await fs.writeFile(`${root}/evidence/${variant}-routes.json`,JSON.stringify(results,null,2));
