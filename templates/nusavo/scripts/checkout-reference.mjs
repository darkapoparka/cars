import {chromium} from 'playwright';import fs from 'node:fs/promises';
const browser=await chromium.connectOverCDP(process.argv[2]);const ctx=browser.contexts()[0];const page=await ctx.newPage();
const base='https://shop.creativemox.com/nusavo/';
for(const slug of ['nusavo-checkout-page','nusavo-check-out','nusavo-checkout']){const r=await ctx.request.get(base+'?elementor_library='+slug);console.log(slug,r.status(),(await r.text()).match(/<title>(.*?)<\/title>/)?.[1])}
await page.goto(base+'?add-to-cart=746',{waitUntil:'domcontentloaded'});await page.waitForTimeout(1000);console.log('Demo cart prepared; no order submitted');await page.close();await browser.close();
