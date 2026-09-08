import { chromium } from '../../../templates/carwow/node_modules/playwright/index.mjs';
import fs from 'node:fs/promises';
const browser=await chromium.launch({channel:'chrome',headless:true});
const records=[];const checks=[];
const routes=['/','/inventory','/sell-your-car','/contact?intent=import','/contact','/services','/about','/financing','/calculator','/blog','/team','/compare','/inventory/mercedes-benz-gla-45-amg-405323'];
const base='http://127.0.0.1:6463';
try {
 for(const width of [320,430,1280,1920]){
  const ctx=await browser.newContext({viewport:{width,height:1080},reducedMotion:'reduce',...(width<992?{isMobile:true,hasTouch:true,userAgent:'Mozilla/5.0 (iPhone; CPU iPhone OS 18_0 like Mac OS X) AppleWebKit/605.1.15 Version/18.0 Mobile/15E148 Safari/604.1'}:{})});
  const p=await ctx.newPage();let errors=[];p.on('pageerror',e=>errors.push(e.message));
  for(const route of routes){errors=[];const r=await p.goto(base+route,{waitUntil:'networkidle',timeout:45000});await p.evaluate(()=>document.fonts.ready);
   const result=await p.evaluate(()=>({overflow:document.documentElement.scrollWidth>innerWidth,broken:[...document.images].filter(i=>i.getBoundingClientRect().height&&i.complete&&!i.naturalWidth).map(i=>i.src)}));
   records.push({width,route,status:r.status(),errors,...result});
   if(route==='/financing'&&width<992){checks.push({name:`financing phone ${width}`,value:await p.locator('.mobile-financing-cta a[href^="tel:"]').evaluate(e=>{let b=e.getBoundingClientRect(),s=e.querySelector('span');return {width:b.width,height:b.height,color:getComputedStyle(s??e).color,background:getComputedStyle(e).backgroundColor,href:e.getAttribute('href')}})});}
   if(route==='/blog'&&width<992){checks.push({name:`footer gutters ${width}`,value:await p.locator('.daynight-legacy-footer input').evaluate(e=>{let r=e.getBoundingClientRect();return {left:r.left,right:r.right,viewport:innerWidth}})});}
   if(route==='/inventory'&&width<992){await p.addStyleTag({content:':root {font-size:200% !important}'});checks.push({name:`text resize inventory ${width}`,value:await p.evaluate(()=>({overflow:document.documentElement.scrollWidth>innerWidth}))});}
  }
  console.log('edge width complete',width);await ctx.close();
 }
}finally{await browser.close();await fs.writeFile(new URL('./edges.json',import.meta.url),JSON.stringify({records,checks},null,2));}
const failures=records.filter(r=>r.status!==200||r.overflow||r.broken.length||r.errors.length);console.log(JSON.stringify({failures,checks},null,2));if(failures.length)process.exitCode=1;
