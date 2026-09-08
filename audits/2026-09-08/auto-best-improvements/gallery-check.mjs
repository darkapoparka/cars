import { chromium } from '../../../templates/auto-best/node_modules/playwright/index.mjs';
import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
const browser=await chromium.launch({channel:'chrome',headless:true});
try {
 const page=await browser.newPage({viewport:{width:1440,height:1000}});
 const errors=[];page.on('pageerror',error=>errors.push(error.message));
 await page.goto('file:///J:/cars/audits/2026-09-08/auto-best-improvements/comparison.html');
 for(const width of ['390','1440'])for(const name of ['leasing','home','inventory','vehicle','about','article']) {
  await page.selectOption('#width',width);await page.selectOption('#page',name);await page.selectOption('#capture','');
  await page.waitForFunction(()=>['before','after'].every(id=>{const image=document.getElementById(id);return image.complete&&image.naturalWidth>0;}));
 }
 assert.deepEqual(errors,[]);
 await fs.writeFile(`${import.meta.dirname}/gallery-check.json`,JSON.stringify({passed:true,comparisons:12,errors},null,2));
} finally {await browser.close();}
