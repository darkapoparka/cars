import { chromium } from '../../../templates/carwow/node_modules/playwright/index.mjs';
import fs from 'node:fs/promises';
const root='J:/cars/audits/2026-09-08/carwow-finalization';
const browser=await chromium.launch({channel:'chrome',headless:true});
const results=[];
try {
 for (const width of [320,390,430,1024,1280,1440]) {
  const page=await browser.newPage({viewport:{width,height:900}});
  const errors=[];page.on('pageerror',e=>errors.push(e.message));
  await page.goto('http://127.0.0.1:6463/',{waitUntil:'networkidle'});
  await page.evaluate(()=>document.fonts.ready);
  if(width<992){
   await page.getByRole('button',{name:'Меню',exact:true}).click();
   if(width===390) await page.screenshot({path:root+'/blog-mobile-menu.png'});
   await page.locator('#mobile-menu-sheet').getByRole('link',{name:'Блог',exact:true}).click();
  }else{
   await page.locator('#main-nav').getByRole('link',{name:'Блог',exact:true}).click();
  }
  await page.waitForURL('**/blog');
  await page.locator('[data-daynight-blog-empty]').waitFor();
  await page.evaluate(()=>document.fonts.ready);
  const overflow=await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth);
  if(width===390||width===1440) await page.screenshot({path:root+`/blog-current-${width}.png`});
  results.push({width,url:page.url(),overflow,errors,breadcrumbs:await page.locator('.blog-page .breadcrumb').count()});
  await page.close();
 }
 const p=await browser.newPage();
 const article=await p.request.get('http://127.0.0.1:6463/blog/kak-da-kupim-upotrebyavan-avtomobil');
 const sitemap=await p.request.get('http://127.0.0.1:6463/sitemap.xml');
 results.push({sampleArticleStatus:article.status(),sitemapStatus:sitemap.status(),sampleArticleInSitemap:(await sitemap.text()).includes('/blog/kak-da-kupim-upotrebyavan-avtomobil')});
 await fs.writeFile(root+'/blog-verification.json',JSON.stringify(results,null,2));
 console.log(JSON.stringify(results));
}finally{await browser.close();}
