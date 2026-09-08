import fs from 'node:fs/promises';
import { chromium } from '../../../templates/auto-best/node_modules/playwright/index.mjs';
const out=import.meta.dirname+'/evidence';const browser=await chromium.launch({headless:true,channel:'chrome'});const r=[];
for(const width of [390,1440]){
 const page=await browser.newPage({viewport:{width,height:900},reducedMotion:'reduce'});page.setDefaultTimeout(10000);
 await page.goto('http://127.0.0.1:6461/',{waitUntil:'networkidle'});
 r.push({name:'hidden-images',width,images:await page.evaluate(()=>[...document.images].filter(e=>!e.getBoundingClientRect().width).map(e=>({src:e.getAttribute('src'),fetchpriority:e.getAttribute('fetchpriority'),loaded:e.complete&&e.naturalWidth>0,resource:performance.getEntriesByName(e.currentSrc).map(p=>({encoded:p.encodedBodySize,transfer:p.transferSize}))}))) });
 if(width===390){const hit=await page.locator('.dn-trust-card').first().evaluate(card=>{const e=card.querySelector('.dn-trust-card__action'),s=getComputedStyle(e,'::after'),box=card.getBoundingClientRect();return{iconWidth:card.querySelector('.dn-trust-card__icon').getBoundingClientRect().width,linkHeight:e.getBoundingClientRect().height,pseudo:{position:s.position,inset:s.inset,w:s.width,h:s.height},cardWidth:box.width,cardHeight:box.height};});r.push({name:'stretched-card-hit-area',...hit});}
 await page.goto('http://127.0.0.1:6461/about-us',{waitUntil:'networkidle'});await page.locator('.dn-about-team-card').first().hover();await page.locator('.dn-about-team-card').first().screenshot({path:`${out}/${width}-team-hover.png`});
 r.push({name:'demo-social-affordance',width,cursor:await page.locator('.dn-about-team-card__socials span').first().evaluate(e=>getComputedStyle(e).cursor),links:await page.locator('.dn-about-team-card__socials a').count()});
 if(width===390){await page.goto('http://127.0.0.1:6461/listing-grid?make=Audi&model=RS+6+Avant&sort=price-asc',{waitUntil:'networkidle'});await page.getByRole('button',{name:'Марка',exact:true}).click();const dlg=page.locator('#dn-quick-filter');await dlg.getByRole('radio',{name:'BMW',exact:true}).check();await dlg.getByRole('button',{name:'Приложи',exact:true}).click();await page.waitForURL(u=>u.searchParams.get('make')==='BMW');r.push({name:'isolated-brand-change',url:page.url(),count:await page.locator('.dn-listing-results__grid > *').count()});await page.screenshot({path:out+'/390-brand-change.png'});}
 await page.close();
}
await fs.writeFile(out+'/final-probes.json',JSON.stringify(r,null,2));await browser.close();
