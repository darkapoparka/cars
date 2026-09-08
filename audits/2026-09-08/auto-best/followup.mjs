import fs from 'node:fs/promises';
import { chromium } from '../../../templates/auto-best/node_modules/playwright/index.mjs';
const out=import.meta.dirname+'/evidence',base='http://127.0.0.1:6461';
const browser=await chromium.launch({headless:true,channel:'chrome'});const result=[];
for(const width of [390,1440]) {
 const page=await browser.newPage({viewport:{width,height:width===390?844:900},reducedMotion:'reduce'});page.setDefaultTimeout(10000);
 const go=async route=>{await page.goto(base+route,{waitUntil:'networkidle'});};
 await go('/listing-detail-v1/1');
 const input=page.locator('.dn-finance-calculator input');await input.focus();await input.press('Tab');
 result.push({name:'finance-keyboard-focus',width,style:await page.locator('.dn-finance-calculator select').evaluate(e=>{const s=getComputedStyle(e);return{active:e===document.activeElement,focusVisible:e.matches(':focus-visible'),outline:s.outline,boxShadow:s.boxShadow,border:s.border,focusToken:s.getPropertyValue('--dn-focus')}})});
 await page.screenshot({path:`${out}/${width}-keyboard-focus.png`});
 await page.locator('.dn-finance-calculator a').click();await page.waitForURL('**/contact?topic=leasing*');await page.locator('.dn-contact-intent').waitFor();
 result.push({name:'verified-finance-handoff',width,url:page.url(),selectedVehicleVisible:(await page.locator('main').innerText()).includes('Audi RS 6')});
 await go('/listing-grid?make=BMW&sort=price-asc');await page.locator('.dn-listing-results__grid a').first().click();await page.waitForURL('**/listing-detail-v1/*');const detail=page.url();await (width===390?page.locator('.dn-detail-mobile-back'):page.locator('.dn-detail-title-card > a')).click();await page.waitForURL('**/listing-grid');result.push({name:'verified-detail-back',width,detail,url:page.url(),count:await page.locator('.dn-listing-results__grid > *').count()});
 await go('/');await page.keyboard.press('Tab');result.push({name:'first-tab',width,text:await page.evaluate(()=>document.activeElement?.outerHTML.slice(0,350)),skipLinks:await page.locator('a[href="#main-content"],a[href="#main"]').count()});
 for(const route of ['/about-us','/listing-detail-v1/1','/contact']) {await go(route);const frame=page.locator('.dn-showroom-map');await frame.scrollIntoViewIfNeeded();await page.waitForTimeout(3500);await frame.screenshot({path:`${out}/${width}-map-${route.split('/')[1]}.png`});result.push({name:'settled-map',width,route,frames:page.frames().map(f=>({url:f.url()}))});}
 await go('/');await page.locator('.dn-video-card__play').first().click();await page.waitForTimeout(4000);const vf=page.frames().find(f=>f.url().includes('youtube-nocookie'));result.push({name:'video-player-state',width,state:await vf?.evaluate(()=>({text:document.body.innerText.slice(0,400),videos:[...document.querySelectorAll('video')].map(v=>({paused:v.paused,time:v.currentTime,ready:v.readyState,error:v.error?.message}))})).catch(e=>({error:e.message}))});
 await fs.writeFile(out+'/followup.json',JSON.stringify(result,null,2));await page.close();
}
await browser.close();
