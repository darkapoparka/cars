import { chromium } from '../../../templates/carwow/node_modules/playwright/index.mjs';
import fs from 'node:fs/promises';
const root='J:/cars/audits/2026-09-08/carwow-finalization';
const browser=await chromium.launch({channel:'chrome',headless:true});
const results=[];
try {
 for(const width of [390,1440]) {
  const p=await browser.newPage({viewport:{width,height:1000}});
  const errors=[];p.on('pageerror',e=>errors.push(e.message));
  await p.goto('http://127.0.0.1:6463/blog',{waitUntil:'networkidle'});
  await p.evaluate(()=>document.fonts.ready);
  const articles=await p.locator('[data-daynight-article-card]').count();
  if(articles!==6)throw new Error('Expected 6 guides; got '+articles);
  await p.screenshot({path:root+`/guides-index-${width}.png`,fullPage:true});
  await p.screenshot({path:root+`/guides-viewport-${width}.png`});
  await p.locator('[data-daynight-article-card]').first().click();
  await p.locator('.blog-article-page h1').waitFor();
  await p.evaluate(()=>document.fonts.ready);
  await p.screenshot({path:root+`/guides-article-${width}.png`,fullPage:true});
  const articleSections=await p.locator('.bloc-details-container h2').count();
  if(articleSections!==3)throw new Error('Article missing sections');
  await p.goto('http://127.0.0.1:6463/blog');
  await p.locator('.widget-categories a').filter({hasText:'Продажба'}).click();
  await p.waitForURL('**/blog?**');
  const saleCards=await p.locator('[data-daynight-article-card]').count();
  if(saleCards!==2)throw new Error('Sale category mismatch');
  await p.goto('http://127.0.0.1:6463/blog');
  await p.locator('#blog-search').fill('снимки');
  await p.locator('form.widget-search button').click();
  await p.waitForURL('**/blog?**');
  const searchCards=await p.locator('[data-daynight-article-card]').count();
  if(!searchCards||searchCards>=6)throw new Error('Search did not narrow results');
  const overflow=await p.evaluate(()=>document.documentElement.scrollWidth>innerWidth);
  results.push({width,articles,articleSections,saleCards,searchCards,overflow,errors});
  await p.close();
 }
 const p=await browser.newPage();
 await p.goto('http://127.0.0.1:6463/blog');
 const urls=await p.locator('[data-daynight-article-card]').evaluateAll(a=>a.map(e=>e.href));
 for(const url of urls){const response=await p.goto(url);if(response.status()!==200)throw new Error('Broken article '+url);results.push({url,status:response.status(),sections:await p.locator('.bloc-details-container h2').count(),brokenImages:await p.locator('img').evaluateAll(a=>a.filter(e=>e.complete&&!e.naturalWidth).length)});}
 await fs.writeFile(root+'/guides-verification.json',JSON.stringify(results,null,2));
 console.log(JSON.stringify(results));
}finally{await browser.close();}
