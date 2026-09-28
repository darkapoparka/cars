import {createBrowser,sleep} from './lib/browser-qa.mjs';
import {readFile,writeFile,mkdir} from 'node:fs/promises';
import sharp from 'sharp';
const root=process.env.QA_REPORT_DIR??'reference/2026-09-26-finish/visuals';
const b=await createBrowser(root),pairs=[];
const nativeRoot='reference/2026-09-26-continuation';
async function shot(name,native){
 await b.capture(name);
 const file=`${root}/${name}.png`;
 await writeFile(file,await sharp(await readFile(file)).resize(427,952).png().toBuffer());
 if(native){await mkdir(root+'/pairs',{recursive:true});const nativeFile=`${nativeRoot}/${native}-427.png`;await sharp({create:{width:854,height:952,channels:3,background:'#fff'}}).composite([{input:await readFile(nativeFile),left:0,top:0},{input:await readFile(file),left:427,top:0}]).png().toFile(`${root}/pairs/${name}.png`);pairs.push({name,native:nativeFile,browser:file,comparison:`${root}/pairs/${name}.png`});}
}
async function check(name,expression){b.check(name,await b.evaluate(expression));}
async function section(name){await b.scroll(650);await b.click(`[...document.querySelectorAll('[aria-label="Vehicle sections"] button')].find(e=>e.textContent===${JSON.stringify(name)})`);await sleep(700);}
try{
 await b.send('Emulation.setDeviceMetricsOverride',{width:427,height:952,deviceScaleFactor:3,mobile:true,screenWidth:427,screenHeight:952});
 await b.send('Emulation.setEmulatedMedia',{features:[{name:'prefers-reduced-motion',value:'reduce'}]});
 const car='/cars/2024-toyota-fortuner-exr';
 await b.navigate(car);await b.click(`document.querySelector('[aria-label="Show vehicle offer 2"]')`);await shot('detail','finish-native-detail');
 await check('Vehicle heading uses the matched Poppins 600 face',`getComputedStyle(document.querySelector('h1')).fontFamily.includes('Poppins')&&getComputedStyle(document.querySelector('h1')).fontWeight==='600'`);
 await check('Three photo tabs match the native horizontal bounds within two CSS pixels',`(()=>{const expected=[[22.4,117.7],[151.1,118.1],[280.2,118.1]];return [...document.querySelectorAll('[aria-label="Vehicle photographs"] a')].every((e,i)=>{const r=e.getBoundingClientRect();return Math.abs(r.x-expected[i][0])<2&&Math.abs(r.width-expected[i][1])<2;});})()`);
 await check('Exterior thumbnail is the captured side view, not the hero image',`document.querySelector('[aria-label="Vehicle photographs"] a img').getAttribute('src').endsWith('/photo-1.jpg')`);
 await b.clickText('Price breakdown');await shot('price','finish-native-price');await b.back();
 await b.clickText('EMI plans');await shot('emi','finish-native-emi');
 await check('EMI sheet matches the native 96-pixel top edge',`Math.abs(document.querySelector('[aria-label="EMI plans"]').getBoundingClientRect().top-96)<1`);
 await check('EMI heading matches native horizontal and vertical placement',`(()=>{const r=document.querySelector('[aria-label="EMI plans"] h2').getBoundingClientRect();return Math.abs(r.x-20)<1&&Math.abs(r.y-109.4)<1.5;})()`);
 await check('EMI action stays at its native bottom position',`Math.abs(document.querySelector('[aria-label="Check loan eligibility from EMI plans"]').getBoundingClientRect().top-857.3)<2`);
 await b.back();await b.navigate(car+'/gallery');await shot('gallery','finish-native-current');
 await check('Gallery category typography matches the native pill widths',`Math.abs(document.querySelector('[aria-label="Vehicle photo categories"] button').getBoundingClientRect().width-71.7)<2`);
 await b.navigate('/cars/2023-suzuki-ciaz-glx');await b.click(`document.querySelector('[aria-label="Show vehicle offer 2"]')`);await shot('ciaz','recovery-native-ciaz');
 await check('Four-tab Ciaz layout keeps each category visible and actionable',`(()=>{const tabs=[...document.querySelector('[aria-label="Vehicle photographs"]').children];return tabs.length===4&&tabs.every(e=>e.getBoundingClientRect().right<=innerWidth-12&&e.getBoundingClientRect().width>75);})()`);
 await b.navigate(car);await section('Service History');await shot('service-history','resume-service-history');await section('Car finance');await shot('finance','resume-finance-confirmed');
 await section('Our happy customers');await shot('customers','final-customers');await section('Similar Cars');await shot('comparison','final-similar-top');
 await b.navigate(car);await b.clickText('VIEW SIMILAR CARS');await shot('similar-sheet','final-similar-entry-ready');await b.back();
 await b.click(`document.querySelector('[aria-label="Show vehicle offer 3"]')`);await b.click(`document.querySelector('[aria-label="Vehicle offers"] button:not([aria-label])')`);await shot('coupon','final-offer-action');await b.back();
 await b.navigate(car+'/features');await b.click(`document.querySelector('[aria-label="About Airbag Knees"]')`);await shot('airbag','final-airbag-information');
 for(const [name,route]of [['home','/'],['inventory','/cars'],['sell','/sell'],['service','/service'],['stores','/stores'],['luxe','/luxe'],['menu','/more']]){await b.navigate(route);await shot(name);}
 await b.viewport(390,844);await b.navigate(car);await b.clickText('EMI plans');await b.capture('emi-390');
 await check('Short viewport retains a scrollable EMI sheet',`(()=>{const e=document.querySelector('[aria-label="EMI plans"]');e.scrollTop=e.scrollHeight;return e.scrollTop>0&&e.getBoundingClientRect().top>=90;})()`);await b.back();
 await b.viewport(1440,1000);await b.navigate(car+'/gallery');
 await check('Desktop gallery clears its fixed controls',`document.querySelector('[data-photo-index="0"]').getBoundingClientRect().top>=document.querySelector('[aria-label="Vehicle photo categories"]').getBoundingClientRect().bottom-1`);
 b.check('No final-visual runtime, console or HTTP errors',b.errors.length===0,b.errors);
}finally{await writeFile(root+'/pairs.json',JSON.stringify(pairs,null,2));const result=await b.report();await b.close();process.exitCode=result.failed||result.browserErrors?1:0;}
