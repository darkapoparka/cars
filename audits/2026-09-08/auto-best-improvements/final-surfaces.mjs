import fs from 'node:fs/promises';
import assert from 'node:assert/strict';
import { chromium } from '../../../templates/auto-best/node_modules/playwright/index.mjs';
const browser=await chromium.launch({channel:'chrome',headless:true});
const result=[];
try {
 for(const width of [320,390,430,991,992,1440]) {
  const page=await browser.newPage({viewport:{width,height:900}});
  const errors=[];page.on('pageerror',e=>errors.push(e.message));
  for(const route of ['/contact?topic=leasing&vehicle=4','/blog-detail/1','/','/about-us','/']) {
   await page.goto('http://127.0.0.1:6461'+route,{waitUntil:'networkidle'});
   assert(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1));
  }
  if(width<768) {
   assert.equal(await page.locator('.dn-body-type:visible').count(),4);
   assert.equal(await page.locator('.dn-brand-card:visible').count(),4);
   assert(await page.locator('.dn-body-types__all').isVisible());
   assert(await page.locator('.dn-brand-hero__cta').isVisible());
  }
  if(width===390) {
   for(const [key,selector] of [['brands','.dn-brand-section'],['bodies','.dn-body-types']]) {
    await page.locator(selector).screenshot({path:`${import.meta.dirname}/after/390-${key}.png`});
   }
  }
  if(width>=992) {
   await page.locator('#dn-nav-trigger-guides').focus();await page.keyboard.press('ArrowDown');
   assert(await page.locator('#dn-mega-guides').isVisible());
   assert.equal(await page.locator('#dn-mega-guides .dn-mega__feature').first().getAttribute('href'),'/blog-detail/1');
   await page.keyboard.press('Escape');
   assert(await page.locator('#dn-nav-trigger-guides').evaluate(el=>el===document.activeElement));
  }
  assert.deepEqual(errors,[]);result.push({width,passed:true});await page.close();
 }
} finally {await browser.close();await fs.writeFile(`${import.meta.dirname}/final-surfaces.json`,JSON.stringify(result,null,2));}
