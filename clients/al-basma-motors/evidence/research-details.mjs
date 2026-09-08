import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { chromium } from 'file:///J:/cars/templates/auto-best/node_modules/playwright/index.mjs';
const dir=path.dirname(fileURLToPath(import.meta.url));
const previous=JSON.parse(await fs.readFile(path.join(dir,'official-listings.json'),'utf8'));
await fs.writeFile(path.join(dir,'official-listings-loading-attempt.json'),JSON.stringify(previous,null,2));
const browser=await chromium.launch({headless:true});const page=await browser.newPage({viewport:{width:1440,height:1000}});const records=[];
try { for(const old of previous){
 await page.goto(old.url,{waitUntil:'domcontentloaded'});await page.locator('h1').waitFor({timeout:45000});await page.waitForFunction(()=>document.body.innerText.includes('Car Details'));
 const data=await page.evaluate(()=>({url:location.href,title:document.querySelector('h1')?.innerText,text:document.body.innerText,images:[...document.images].map(i=>({url:i.currentSrc||i.src,alt:i.alt})).filter(i=>i.url.includes('/photos/'))}));
 data.sourceTitle=old.sourceTitle;data.id=old.id;data.observedAt=new Date().toISOString();data.images=[...new Map(data.images.map(i=>[i.url.split('?')[0],i])).values()];
 data.localImages=[];const mediaDir=path.join(dir,'reference-media',data.id);await fs.mkdir(mediaDir,{recursive:true});
 for(const [i,img] of data.images.slice(0,4).entries()) {const response=await fetch(img.url);if(!response.ok)throw Error(`Image ${response.status}: ${img.url}`);const bytes=Buffer.from(await response.arrayBuffer());const name=`${i+1}.webp`;await fs.writeFile(path.join(mediaDir,name),bytes);data.localImages.push({path:`evidence/reference-media/${data.id}/${name}`,sourceUrl:img.url,bytes:bytes.length,permission:'not-established-for-public-redistribution'});}
 records.push(data);await fs.writeFile(path.join(dir,'official-listings.json'),JSON.stringify(records,null,2));console.log(data.id,data.sourceTitle,JSON.stringify(data.text.slice(0,data.text.indexOf('Contact Information'))));
 if(records.length===1){await page.screenshot({path:path.join(dir,'official-detail-1440.png')});await page.setViewportSize({width:390,height:844});await page.screenshot({path:path.join(dir,'official-detail-390.png')});await page.setViewportSize({width:1440,height:1000});}
 }
 console.log('Detail records with local reference media:',records.length);
}finally{await browser.close();}
