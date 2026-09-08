import fs from 'node:fs/promises';
import { chromium } from 'file:///J:/cars/templates/auto-best/node_modules/playwright/index.mjs';
const root=new URL('../',import.meta.url), out=new URL('./',import.meta.url);
const browser=await chromium.launch({headless:true}); const page=await browser.newPage({viewport:{width:1440,height:1000}});
const records=[];
try {
 await page.goto('https://albasmamotors.com/cars',{waitUntil:'networkidle'});
 await page.locator('h3').filter({hasText:/^LEXUS/}).first().waitFor();
 await page.screenshot({path:new URL('official-catalogue-1440.png',out).pathname.replace(/^\//,'')});
 const names=await page.locator('h3').filter({hasText:/^LEXUS/}).allTextContents();
 console.log('catalogue headings',names.length);
 for(const index of [0,1,4,5,7,8,10,11,12,23]) {
  await page.locator('h3').filter({hasText:/^LEXUS/}).nth(index).click();
  await page.waitForURL('**/car/**'); await page.waitForLoadState('networkidle');
  const data=await page.evaluate(()=>({url:location.href,title:document.querySelector('h1')?.innerText,text:document.body.innerText,images:[...document.images].map(i=>({url:i.currentSrc||i.src,alt:i.alt})).filter(i=>i.url.includes('/photos/')),links:[...document.querySelectorAll('a')].map(a=>({href:a.href,text:a.innerText})).filter(a=>/^(tel:|mailto:|https:\/\/wa.me)/.test(a.href))}));
  data.observedAt=new Date().toISOString(); data.sourceTitle=names[index]; data.id=data.url.split('/').pop();
  data.images=[...new Map(data.images.map(i=>[i.url.split('?')[0],i])).values()];
  records.push(data); console.log(data.id,data.sourceTitle,'images',data.images.length,'text',data.text.slice(0,800));
  await fs.writeFile(new URL('official-listings.json',out),JSON.stringify(records,null,2));
  if(records.length===1){await page.screenshot({path:new URL('official-detail-1440.png',out).pathname.replace(/^\//,'')});await page.setViewportSize({width:390,height:844});await page.screenshot({path:new URL('official-detail-390.png',out).pathname.replace(/^\//,'')});await page.setViewportSize({width:1440,height:1000});}
  await page.goto('https://albasmamotors.com/cars',{waitUntil:'networkidle'});
 }
 await page.setViewportSize({width:390,height:844}); await page.screenshot({path:new URL('official-catalogue-390.png',out).pathname.replace(/^\//,'')});
 await page.goto('https://albasmamotors.com/contact',{waitUntil:'networkidle'}); await fs.writeFile(new URL('official-contact.txt',out),await page.locator('body').innerText()); await page.screenshot({path:new URL('official-contact-390.png',out).pathname.replace(/^\//,'')});
} finally {await browser.close();}
