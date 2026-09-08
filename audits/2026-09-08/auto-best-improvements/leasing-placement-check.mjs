import fs from 'node:fs/promises';
import assert from 'node:assert/strict';
import {chromium} from '../../../templates/auto-best/node_modules/playwright/index.mjs';
const root=import.meta.dirname;
const browser=await chromium.launch({channel:'chrome',headless:true});
const results=[];
try{for(const width of [320,390,430,768,992,1440]){
const page=await browser.newPage({viewport:{width,height:width<992?844:900}});
const errors=[];page.on('pageerror',e=>errors.push(e.message));
for(const topic of ['leasing&vehicle=4','leasing','leasing&vehicle=unknown','inspection&vehicle=4']){
await page.goto(`http://127.0.0.1:6461/contact?topic=${topic}`,{waitUntil:'networkidle'});
const selected=topic==='leasing&vehicle=4';
assert.equal(await page.locator('.dn-contact-hero .dn-contact-vehicle').count(),selected?1:0);
assert.equal(await page.locator('.dn-contact-intent .dn-contact-vehicle').count(),topic==='inspection&vehicle=4'?1:0);
if(topic.startsWith('leasing')) assert.equal(await page.locator('.dn-contact-hero__action').count(),selected?0:1);
if(topic.startsWith('leasing')&&!selected) assert.equal(await page.locator('.dn-contact-hero__action').getAttribute('href'),'/listing-grid');
assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth),false);
if(selected){
const geometry=await page.evaluate(()=>{const rect=s=>{const r=document.querySelector(s).getBoundingClientRect();return {top:r.top,bottom:r.bottom,left:r.left,right:r.right};};return {hero:rect('.dn-contact-hero'),card:rect('.dn-contact-vehicle'),copy:rect('.dn-contact-hero__copy'),body:rect('.dn-contact-intent__main')};});
assert(geometry.card.top>=geometry.copy.bottom,JSON.stringify({width,...geometry}));
assert(geometry.card.bottom<=geometry.hero.bottom,JSON.stringify({width,...geometry}));
assert(geometry.card.bottom<=geometry.body.top,JSON.stringify({width,...geometry}));
assert.equal(await page.locator('.dn-contact-vehicle').getAttribute('href'),'/listing-detail-v1/4');
await page.locator('.dn-contact-vehicle').focus();
assert.equal(await page.locator('.dn-contact-vehicle').evaluate(e=>e===document.activeElement),true);
await page.locator('.dn-contact-vehicle').evaluate(e=>e.blur());
await page.screenshot({path:`${root}/leasing-placement/after-${width}.png`});
if([390,1440].includes(width)){await page.screenshot({path:`${root}/after/${width}-leasing-top.png`});await page.screenshot({path:`${root}/after/${width}-leasing.png`,fullPage:true});}
results.push({width,topic,geometry});
}else results.push({width,topic});
}assert.deepEqual(errors,[]);await page.close();}
await fs.writeFile(`${root}/leasing-placement/checks.json`,JSON.stringify(results,null,2));console.log('Passed 24 viewport/route checks');
}finally{await browser.close();}
