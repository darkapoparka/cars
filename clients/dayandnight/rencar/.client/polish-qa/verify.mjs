import {chromium} from 'playwright';
import fs from 'node:fs/promises';
import assert from 'node:assert/strict';
const out='.client/polish-qa';
const browser=await chromium.launch({channel:'chrome'});
const results=[];
async function ready(page,route='/') {
  await page.goto('http://127.0.0.1:6601'+route);
  await page.waitForFunction(()=>document.documentElement.dataset.rencarReady==='true');
  await page.locator('.preloader').waitFor({state:'hidden'});
  await page.evaluate(()=>document.fonts.ready);
}
try {
  for(const width of [1440,390]) {
    const page=await browser.newPage({viewport:{width,height:900}});
    let errors=[];page.on('pageerror',e=>errors.push(e.message));page.on('console',m=>{if(m.type()==='error')errors.push(m.text());});
    for(const route of ['/','/index-2.html','/index-3.html','/index-4.html','/index-5.html','/car.html','/car-single.html','/contact.html']) {
      errors=[];await ready(page,route);
      const metrics=await page.evaluate(()=>({
        overflow:document.documentElement.scrollWidth-innerWidth,
        broken:[...document.images].filter(i=>i.complete&&!i.naturalWidth).map(i=>i.src),
        hiddenReveals:[...document.querySelectorAll('.wow')].filter(e=>getComputedStyle(e).visibility==='hidden').length,
        activeRevealAnimations:[...document.querySelectorAll('.wow')].filter(e=>getComputedStyle(e).animationName!=='none').length,
        automaticCarousels:[...document.querySelectorAll('.owl-carousel')].filter(e=>window.jQuery(e).data('owl.carousel')?.settings.autoplay).length,
      }));
      assert.equal(metrics.overflow,0);assert.equal(metrics.broken.length,0);assert.equal(metrics.hiddenReveals,0);assert.equal(metrics.activeRevealAnimations,0);assert.equal(metrics.automaticCarousels,0);assert.equal(errors.length,0);
      const key=route==='/'?'home1':route.slice(1,-5);
      await page.screenshot({path:`${out}/${key}-${width}.png`});
      results.push({width,route,...metrics,errors:[...errors]});
    }
    await ready(page);
    if(width<992) {
      await page.getByRole('button',{name:'Toggle navigation',exact:true}).click();
      await page.locator('#offcanvasNavbar.show').waitFor();
      await page.waitForTimeout(350);
      await page.screenshot({path:`${out}/menu-${width}.png`});
      await page.locator('#offcanvasNavbar .btn-close').click();
      await page.locator('#offcanvasNavbar.show').waitFor({state:'hidden'});
    } else {
      await page.locator('.navbar .nav-link').first().hover();
      await page.locator('.navbar .dropdown-menu').first().waitFor({state:'visible'});
      await page.waitForTimeout(350);
      await page.screenshot({path:`${out}/menu-${width}.png`});
      await page.mouse.move(20,200);
    }
    await page.evaluate(()=>scrollTo(0,400));
    await page.locator('.navbar.fixed-top').waitFor();
    await page.waitForTimeout(100);
    await page.screenshot({path:`${out}/sticky-${width}.png`});
    const trigger=page.locator('.search-box-outer:visible');
    await trigger.click();await page.locator('body.search-active').waitFor();
    await page.waitForTimeout(250);
    await page.screenshot({path:`${out}/search-${width}.png`});
    await page.keyboard.press('Escape');await page.locator('body.search-active').waitFor({state:'hidden'});
    assert.equal(await trigger.evaluate(e=>document.activeElement===e),true);
    await trigger.click();await page.locator('.search-popup input').fill('BMW');
    await page.locator('.search-popup input').press('Enter');await page.waitForURL('**/car.html?q=BMW');
    await page.waitForFunction(()=>document.documentElement.dataset.rencarReady==='true');
    await page.locator('#brand3').check();assert.equal(await page.locator('#brand3').isChecked(),true);
    await ready(page,'/contact.html');
    const form=page.locator('#contact-form');
    await form.locator('[name=name]').fill('Local QA');await form.locator('[name=email]').fill('qa@example.invalid');
    await form.locator('[name=subject]').fill('Local preview check');await form.locator('[name=message]').fill('Testing local preview only.');
    await form.locator('button[type=submit]').click();await form.locator('[role=status]').waitFor();
    assert.match(await form.locator('[role=status]').innerText(),/No information has been sent/);
    await ready(page);
    await page.locator('.booking-form-wrap').scrollIntoViewIfNeeded();
    await page.screenshot({path:`${out}/booking-${width}.png`});
    await page.locator('.booking-form-wrap .ss-main').first().click();
    await page.locator('.ss-content.ss-open').first().waitFor({state:'visible'});
    await page.waitForTimeout(300);
    await page.screenshot({path:`${out}/booking-select-${width}.png`});
    await page.keyboard.press('Escape');
    await page.locator('.booking-form-wrap button[type=submit]').click();await page.waitForURL('**/car-booking.html');
    results.push({width,interactions:'menu, sticky header, search dismissal and focus return, search route, checkbox, local contact submit, booking select and route passed',errors:[...errors]});
    await page.close();
  }
  const page=await browser.newPage({viewport:{width:390,height:844},reducedMotion:'reduce'});await ready(page);
  assert.equal(await page.locator('.hero-title').first().evaluate(e=>getComputedStyle(e).animationName),'none');
  await page.close();
  await fs.writeFile(`${out}/results.json`,JSON.stringify(results,null,2));
  console.log(JSON.stringify({routeSamples:16,interactionWidths:[1440,390],reducedMotion:'pass',errors:results.flatMap(r=>r.errors)}));
} finally {await browser.close();}
