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
    let sellCarPixels, sellCarBox;
    for(const topic of ['home','trade-in','import']) {
      await page.goto(`${base}/${locale}${topic==='home'?'':'/contact?topic='+topic}`,{waitUntil:'networkidle',timeout:60000});
      const hero=page.locator('.dn-hero-vehicles').first();
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
        if(topic!=='home') {
          const car=main.locator('.dn-hero-vehicles__shared-car');
          const carImage=car.locator('img');
          assert((await carImage.evaluate(e=>e.currentSrc)).includes('service-sell-front-v3.webp'),'Both routes use the exact same car source');
          const carBox=await car.boundingBox();
          const pixels=await car.screenshot({path:`${output}/${locale}-${width}-${topic}-car.png`});
          if(topic==='trade-in') { sellCarPixels=pixels;sellCarBox=carBox; }
          else {
            assert.deepEqual(carBox,sellCarBox,'Car position and size do not move between Sell and Import');
            const difference=await page.evaluate(async ({before,after})=>{
              const decode=async (base64)=>{const image=new Image();image.src='data:image/png;base64,'+base64;await image.decode();const canvas=document.createElement('canvas');canvas.width=image.width;canvas.height=image.height;const ctx=canvas.getContext('2d');ctx.drawImage(image,0,0);return ctx.getImageData(0,0,image.width,image.height).data;};
              const a=await decode(before),b=await decode(after);let changed=0,maxDelta=0;for(let i=0;i<a.length;i++){const delta=Math.abs(a[i]-b[i]);if(delta){changed++;maxDelta=Math.max(maxDelta,delta);}}return {ratio:changed/a.length,maxDelta};
            },{before:sellCarPixels.toString('base64'),after:pixels.toString('base64')});
            assert(difference.ratio<.001&&difference.maxDelta<=1,JSON.stringify({message:'Car pixels differ',locale,width,difference}));
          }
          for(const img of await main.locator('.dn-hero-vehicles__detail img').all()) {
            assert((await img.evaluate(e=>e.currentSrc)).includes('service-'+(topic==='trade-in'?'sell':'import')+'-front-v3.webp'),'Only supporting artwork changes by service');
          }
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
