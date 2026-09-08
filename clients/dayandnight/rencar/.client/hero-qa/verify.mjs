import {chromium} from 'playwright';
import fs from 'node:fs/promises';
import assert from 'node:assert/strict';
import {load} from 'cheerio';
const browser=await chromium.launch({channel:'chrome'});const results=[];
for(const width of [320,390,768,1024,1440,1920]) {
 const page=await browser.newPage({viewport:{width,height:900}});const errors=[];page.on('pageerror',e=>errors.push(e.message));
 await page.goto('http://127.0.0.1:6601/');await page.waitForFunction(()=>document.documentElement.dataset.rencarReady==='true');await page.locator('.preloader').waitFor({state:'hidden'});await page.evaluate(()=>document.fonts.ready);
 const metrics=await page.evaluate(()=>{const title=document.querySelector('.owl-item.active .hero-title');const rect=title.getBoundingClientRect();const strip=document.querySelector('.header-top').getBoundingClientRect();return {width:innerWidth,overflow:document.documentElement.scrollWidth-innerWidth,stripWidth:strip.width,navWidth:parseFloat(getComputedStyle(document.querySelector('.navbar'),'::before').width),headingCentered:Math.abs(rect.x+rect.width/2-innerWidth/2)<1,headingOverflow:title.scrollWidth-title.clientWidth,bookingTop:document.querySelector('.booking-form-wrap').getBoundingClientRect().top,extraHeroContent:document.querySelectorAll('.hero-centered .hero-btn,.hero-centered .hero-sub-title,.hero-centered .hero-content p,.hero-centered .shape,.hero-centered .hero-shape').length,broken:[...document.images].filter(i=>i.complete&&!i.naturalWidth).map(i=>i.src)}});
 assert.equal(metrics.stripWidth,metrics.navWidth);assert.ok(width===320 ? metrics.overflow<=4 : metrics.overflow===0);assert.equal(metrics.headingOverflow,0);assert.equal(metrics.headingCentered,true);assert.equal(metrics.extraHeroContent,0);assert.ok(metrics.bookingTop<550);assert.equal(metrics.broken.length,0);
 const slide=await page.evaluate(()=>window.jQuery('.hero-slider').data('owl.carousel').current());await page.locator('.hero-slider .owl-next').click();await page.waitForTimeout(350);assert.notEqual(await page.evaluate(()=>window.jQuery('.hero-slider').data('owl.carousel').current()),slide);
 results.push({...metrics,manualSlider:true,errors});await page.close();
}
await browser.close();
const before=await fs.readFile('.client/hero-qa/before-index.svelte','utf8');const after=await fs.readFile('src/pages/index.svelte','utf8');
const marker='      <div class="booking-form ng-mt">';assert.equal(after.slice(after.indexOf(marker)),before.slice(before.indexOf(marker)));
const a=load(before),b=load(after);assert.equal(a('.main-navigation').toString(),b('.main-navigation').toString());assert.equal(b('.hero-single').length,3);
await fs.writeFile('.client/hero-qa/results.json',JSON.stringify({results,belowHeroUnchanged:true,mainNavigationUnchanged:true,originalSlides:3},null,2));console.log(JSON.stringify(results));
