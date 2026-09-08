import { chromium } from '../../../templates/carwow/node_modules/playwright/index.mjs';
const root='J:/cars/audits/2026-09-08/carwow-finalization';
const browser=await chromium.launch({channel:'chrome',headless:true});
try {
 const page=await browser.newPage({viewport:{width:1440,height:1000}});
 await page.goto('file:///'+root+'/before-after.html');
 await page.selectOption('#route','/blog');
 await page.locator('#after').evaluate(image=>image.decode());
 await page.locator('#before').evaluate(image=>image.decode());
 await page.screenshot({path:root+'/mobile-blog-before-after.png'});
 await page.selectOption('#route','/blog');
 await page.click('#desktop');
 await page.locator('#after').evaluate(image=>image.decode());
 await page.locator('#before').evaluate(image=>image.decode());
 await page.screenshot({path:root+'/desktop-blog-before-after.png'});
 const errors=[];page.on('pageerror',e=>errors.push(e.message));
 const response=await page.goto('http://127.0.0.1:6463/',{waitUntil:'domcontentloaded',timeout:60000});
 await page.getByRole('heading',{name:'Разгледай. Купи. Продай. На едно място.'}).waitFor({timeout:60000});
 await page.evaluate(()=>document.fonts.ready);
 await page.screenshot({path:root+'/runtime-restored.png'});
 console.log(JSON.stringify({status:response.status(),title:await page.title(),h1:await page.locator('h1:visible').allTextContents(),errors}));
}finally{await browser.close();}
