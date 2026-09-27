import assert from 'node:assert/strict';
import {mkdir,writeFile} from 'node:fs/promises';
import {launchBrowser,previewUrl} from './browser.mjs';
const base=previewUrl(),output='artifacts/hero-composition-smoke';
await mkdir(output,{recursive:true});
const browser=await launchBrowser(),results=[];
try {
  for(const locale of ['en','bg']) for(const width of [320,390,430,1440]) {
    const page=await browser.newPage({viewport:{width,height:844},reducedMotion:'reduce'});
    await page.context().addCookies([{name:'cars_locale',value:locale,url:base},{name:'cars_prompt',value:'v1',url:base}]);
    const errors=[];page.on('pageerror',e=>errors.push(e.message));
    for(const topic of ['home','trade-in','import']) {
      await page.goto(`${base}/${locale}${topic==='home'?'':'/contact?topic='+topic}`,{waitUntil:'networkidle',timeout:60000});
      const hero=page.locator('.dn-hero-vehicles').first();
      const frame=await hero.boundingBox();assert(frame,'Hero is visible');
      const center=frame.x+frame.width/2;
      if(width<768) {
        const main=hero.locator(topic==='home'?'.dn-hero-vehicles__pair':'.dn-hero-vehicles__scene');
        const box=await main.boundingBox();assert(box,'Main vehicle artwork is visible');
        assert(Math.abs(box.x+box.width/2-center)<.5,'Primary vehicle remains centered over the entry card');
        const img=main.locator('img');
        await img.evaluate(image=>image.decode());
        assert(box.x>=0&&box.x+box.width<=width,'Complete hero scene stays within viewport');
        assert(box.y>=frame.y-1&&box.y+box.height<=frame.y+frame.height+1,'Hero scene is not clipped vertically');
        if(topic!=='home') {
          assert(await img.evaluate(e=>e.naturalWidth===1200&&e.naturalHeight===400),'Scene source matches its crop metadata');
          assert((await img.evaluate(e=>e.currentSrc)).includes('service-'+(topic==='trade-in'?'sell':'import')+'-front-v3.webp'),'Correct front-facing service asset loaded');
        }

      } else {
        assert.equal(await hero.locator('.dn-hero-vehicles__car:visible').count(),2,'Desktop retains its two side vehicles');
      }
      assert(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),'No horizontal overflow');
      await page.screenshot({path:`${output}/${locale}-${width}-${topic}.png`});
    }
    assert.deepEqual(errors,[]);results.push({locale,width,passed:true});await page.close();console.log(`PASS centered hero composition ${locale} ${width}`);
  }
  await writeFile(`${output}/report.json`,JSON.stringify({passed:true,results},null,2));
} finally {await browser.close();}
