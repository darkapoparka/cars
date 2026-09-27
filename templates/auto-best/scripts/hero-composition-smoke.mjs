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
        const main=hero.locator(topic==='home'?'.dn-hero-vehicles__pair':'.dn-hero-vehicles__front');
        const box=await main.boundingBox();assert(box,'Main vehicle artwork is visible');
        assert(Math.abs(box.x+box.width/2-center)<.5,'Primary vehicle remains centered over the entry card');
        await main.locator(topic==='home'?'img':':scope').evaluateAll(images=>Promise.all(images.map(image=>image.decode())));
        if(topic!=='home') {
          const supports=hero.locator('.dn-hero-vehicles__support');assert.equal(await supports.count(),2);
          for(const image of await supports.locator('img').all()) {
            await image.evaluate(e=>e.decode());
            assert(await image.evaluate(e=>e.naturalWidth===Number(e.getAttribute('width'))&&e.naturalHeight===Number(e.getAttribute('height'))),'Support crop metadata must match its source image');
          }
          const left=await supports.nth(0).boundingBox(),right=await supports.nth(1).boundingBox();
          assert(left&&right);assert(left.x+left.width<=box.x+1&&right.x>=box.x+box.width-1,'Supporting artwork stays beside the centered vehicle');
          assert(Math.abs((center-left.x-left.width/2)-(right.x+right.width/2-center))<1,'Supporting artwork stays balanced');
          assert(box.width>left.width*2&&box.width>right.width*2,'The front vehicle dominates its supporting artwork');
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
