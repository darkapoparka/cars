import {createBrowser,sleep} from './lib/browser-qa.mjs';
import {readFile,writeFile,mkdir} from 'node:fs/promises';
import sharp from 'sharp';
const root='reference/2026-09-26-finish/baseline';
const b=await createBrowser(root);
const observed=[];
async function capture(name,selector){
 await b.capture(name);
 const path=`${root}/${name}.png`;
 await writeFile(path,await sharp(await readFile(path)).resize(427,952).png().toBuffer());
 if(selector)observed.push({name,controls:await b.evaluate(`Array.from(document.querySelectorAll(${JSON.stringify(selector)})).map(e=>({text:e.textContent,src:e.getAttribute('src'),rect:e.getBoundingClientRect().toJSON(),font:getComputedStyle(e).font,weight:getComputedStyle(e).fontWeight,padding:getComputedStyle(e).padding,gap:getComputedStyle(e).gap,fit:getComputedStyle(e).objectFit}))`)});
}
try {
 await b.send('Emulation.setDeviceMetricsOverride',{width:427,height:952,deviceScaleFactor:3,mobile:true,screenWidth:427,screenHeight:952});
 await b.send('Emulation.setEmulatedMedia',{features:[{name:'prefers-reduced-motion',value:'reduce'}]});
 await b.navigate('/cars/2024-toyota-fortuner-exr');
 await b.click(`document.querySelector('[aria-label="Show vehicle offer 3"]')`);
 await capture('detail','h1,[aria-label="Vehicle photographs"] a,[aria-label="Vehicle photographs"] img,[aria-label="Vehicle price"] p,[aria-label="Vehicle price"] button');
 const crops=[];
 for(const family of ['Geist','Roboto','Poppins']){
  await b.evaluate(`document.querySelector('h1').style.fontFamily=${JSON.stringify(family)}`);
  await sleep(150);
  const image=await b.send('Page.captureScreenshot',{format:'png',captureBeyondViewport:false});
  const crop=await sharp(Buffer.from(image.data,'base64')).resize(427,952).extract({left:18,top:365,width:390,height:52}).png().toBuffer();
  crops.push(crop);
 }
 const native=await sharp('reference/2026-09-26-continuation/finish-native-detail-427.png').extract({left:18,top:365,width:390,height:52}).png().toBuffer();
 const all=[native,...crops];
 await sharp({create:{width:390,height:all.length*60,channels:3,background:'#ffffff'}}).composite(all.map((input,i)=>({input,left:0,top:i*60}))).png().toFile(`${root}/title-font-candidates.png`);
 await b.clickText('Price breakdown');await capture('price','[aria-label="Price breakdown"] h2,[aria-label="Price breakdown"] h3,[aria-label="Price breakdown"] p');await b.back();
 await b.clickText('EMI plans');await capture('emi','[aria-label="EMI plans"],[aria-label="EMI plans"] h2,[aria-label="EMI plans"] section,[aria-label="EMI plans"] input,[aria-label="EMI plans"] fieldset,[aria-label="EMI plans"] p,[aria-label="EMI plans"] aside,[aria-label="EMI plans"] button');
 await b.back();await b.navigate('/cars/2024-toyota-fortuner-exr/gallery');await capture('gallery','[aria-label="Vehicle photo categories"] button,[data-photo-index="0"],[data-photo-index="0"] img');
 await mkdir(root,{recursive:true});await writeFile(`${root}/geometry.json`,JSON.stringify(observed,null,2));
} finally {await b.report();await b.close();}
