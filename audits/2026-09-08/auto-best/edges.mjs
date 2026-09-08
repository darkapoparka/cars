import fs from 'node:fs/promises';
import { chromium } from '../../../templates/auto-best/node_modules/playwright/index.mjs';
const out=import.meta.dirname+'/evidence';
const browser=await chromium.launch({headless:true,channel:'chrome'});
const results=[];
for(const [width,height] of [[320,844],[430,932],[768,900],[991,900],[992,900],[1024,900],[1280,900],[1920,1080],[844,390]]){
 const page=await browser.newPage({viewport:{width,height},reducedMotion:'reduce'});
 const routes=width===768||width===991||width===992?['/','/listing-grid']:['/','/listing-grid','/listing-detail-v1/2','/about-us','/blog','/contact','/contact?topic=trade-in','/contact?topic=import'];
 for(const route of routes){const r={width,height,route};try{await page.goto('http://127.0.0.1:6461'+route,{waitUntil:'domcontentloaded'});await page.evaluate(()=>document.fonts.ready);await page.waitForTimeout(150);r.measure=await page.evaluate(()=>({scrollWidth:document.documentElement.scrollWidth,height:document.documentElement.scrollHeight,header:[...document.querySelectorAll('header a,header button')].filter(e=>e.getBoundingClientRect().width&&e.getBoundingClientRect().height).map(e=>{let r=e.getBoundingClientRect();return{text:(e.innerText||e.getAttribute('aria-label')||'').trim(),x:r.x,y:r.y,w:r.width,h:r.height}}),broken:[...document.images].filter(e=>e.getBoundingClientRect().width&&e.complete&&!e.naturalWidth).map(e=>e.currentSrc)}));
 const key=route.replaceAll('/','-').replaceAll('?','-').replaceAll('=','-');r.image=`edge-${width}x${height}${key||'-home'}.png`;await page.screenshot({path:out+'/'+r.image});
 }catch(e){r.error=e.message}results.push(r);await fs.writeFile(out+'/edges.json',JSON.stringify(results,null,2));console.log(JSON.stringify({width,height,route,overflow:r.measure?.scrollWidth-width,error:r.error}));}
 await page.close();
}
const supplemental=[];
for(const width of [390,1440]){const page=await browser.newPage({viewport:{width,height:width===390?844:900}});for(const id of [7,8,9]){const r=await page.goto('http://127.0.0.1:6461/blog-detail/'+id,{waitUntil:'networkidle'});await page.screenshot({path:`${out}/${width===390?'mobile':'desktop'}-article-${id}.png`,fullPage:true});supplemental.push({width,route:'/blog-detail/'+id,status:r.status(),text:await page.locator('main').innerText(),overflow:await page.evaluate(()=>document.documentElement.scrollWidth-innerWidth)});}await page.close();}
await fs.writeFile(out+'/supplemental-articles.json',JSON.stringify(supplemental,null,2));
await browser.close();
