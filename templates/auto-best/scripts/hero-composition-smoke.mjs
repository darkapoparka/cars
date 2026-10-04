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
    let sellCarRendering, sellCarBox;
    for(const topic of ['home','trade-in','import']) {
      await page.goto(`${base}/${locale}${topic==='home'?'':'/contact?topic='+topic}`,{waitUntil:'networkidle',timeout:60000});
      const hero=page.locator(width<768?'.dn-hero-vehicles':'.dn-desktop-hero-scene').first();
      const frame=await hero.boundingBox();assert(frame,'Hero is visible');
      const center=frame.x+frame.width/2;
      if(width<768) {
        const main=hero.locator(topic==='home'?'.dn-hero-vehicles__pair':'.dn-hero-vehicles__scene');
        const box=await main.boundingBox();assert(box,'Main vehicle artwork is visible');
        assert(Math.abs(box.x+box.width/2-center)<.5,'Primary vehicle remains centered over the entry card');
        const images=main.locator('img');
        await images.evaluateAll(imgs=>Promise.all(imgs.map(image=>image.decode())));
        assert(box.x>=0&&box.x+box.width<=width,'Complete hero scene stays within viewport');
        assert(box.y>=frame.y-1&&box.y+box.height<=frame.y+frame.height+1,'Hero scene is not clipped vertically');
        if(topic==='home') assert.match(await images.first().evaluate(e=>e.currentSrc),/\/day-night-collection-banner-v2(?:-480)?\.webp$/,'Home keeps the original front-facing hero pair');
        if(topic!=='home') {
          const car=main.locator('.dn-hero-vehicles__shared-car');
          const carImage=car.locator('img');
          assert.match(await carImage.evaluate(e=>e.currentSrc),/\/service-sell-front-v3(?:-480)?\.webp$/,'Both routes keep the original shared front-facing hero car');
          const carBox=await car.boundingBox();
          await car.screenshot({path:`${output}/${locale}-${width}-${topic}-car.png`});
          const rendering=await carImage.evaluate(async image=>{
            const canvas=document.createElement('canvas');canvas.width=image.naturalWidth;canvas.height=image.naturalHeight;
            const context=canvas.getContext('2d');context.drawImage(image,0,0);
            const pixels=context.getImageData(0,0,canvas.width,canvas.height).data;
            const digest=await crypto.subtle.digest('SHA-256',pixels);
            return {pixels:[...new Uint8Array(digest)],dimensions:[canvas.width,canvas.height],imageStyle:image.getAttribute('style'),frameStyle:image.closest('.dn-artwork-region').getAttribute('style')};
          });
          if(topic==='trade-in') { sellCarRendering=rendering;sellCarBox=carBox; }
          else {
            assert.deepEqual(carBox,sellCarBox,'Car position and size do not move between Sell and Import');
            // Compare the transparent car itself; each journey owns its background.
            assert.deepEqual(rendering,sellCarRendering,'Both services render identical car pixels and crop styles');
          }
          for(const img of await main.locator('.dn-hero-vehicles__detail img').all()) {
            assert.match(await img.evaluate(e=>e.currentSrc),new RegExp('/service-'+(topic==='trade-in'?'sell':'import')+'-front-v3(?:-480)?\\.webp$'),'Only supporting artwork changes by service');
          }
        }

      } else {
        await hero.locator('img').evaluateAll(images=>Promise.all(images.map(image=>image.decode())));
        if(topic==='home') {
          assert.equal(await hero.getAttribute('data-artwork'),'vehicles','Home frames its search panel with the reviewed cutouts');
          assert.deepEqual(await hero.locator('.dn-campaign-vehicles__car').evaluateAll(cars=>cars.map(car=>car.dataset.vehicle)),['gclass','urus'],'Home keeps its original inward-facing car pair');
        } else {
          assert.equal(await hero.getAttribute('data-artwork'),'image','Service heroes use the larger Contact car scene');
          assert((await hero.locator('img').evaluate(image=>image.currentSrc)).endsWith('auto-best-desktop-inventory-v2.webp'),'Both service routes reuse the approved Contact banner');
        }
        assert.equal(await page.locator('.dn-hero-vehicles__car').count(),0,'Desktop does not mount additional cutout pairs');
      }
      assert(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),'No horizontal overflow');
      await page.screenshot({path:`${output}/${locale}-${width}-${topic}.png`});
    }
    assert.deepEqual(errors,[]);results.push({locale,width,passed:true});await page.close();console.log(`PASS centered hero composition ${locale} ${width}`);
  }
  await writeFile(`${output}/report.json`,JSON.stringify({passed:true,results},null,2));
} finally {await browser.close();}
