import {createBrowser,sleep} from './lib/browser-qa.mjs';
import {readFile,writeFile,mkdir} from 'node:fs/promises';
import sharp from 'sharp';
const phase=process.env.POLISH_PHASE??'verified';
if(!/^[a-z-]+$/.test(phase))throw Error('Invalid evidence label');
const root=`reference/2026-09-26-polish/${phase}`;
const b=await createBrowser(root);
const pairs=[];
const nativeRoot='reference/2026-09-26-continuation';
async function shot(name,native){
 await b.capture(name);
 const raw=await readFile(`${root}/${name}.png`);
 await writeFile(`${root}/${name}.png`,await sharp(raw).resize(427,952).png().toBuffer());
 if(native){const file=`${nativeRoot}/${native}-427.png`;const left=await readFile(file),right=await readFile(`${root}/${name}.png`);await mkdir(`${root}/pairs`,{recursive:true});await sharp({create:{width:854,height:952,channels:3,background:'#fff'}}).composite([{input:left,left:0,top:0},{input:right,left:427,top:0}]).png().toFile(`${root}/pairs/${name}.png`);pairs.push({name,native:file,browser:`${root}/${name}.png`,comparison:`${root}/pairs/${name}.png`});}
}
async function section(name){await b.scroll(650);await b.click(`[...document.querySelectorAll('[aria-label="Vehicle sections"] button')].find(element=>element.textContent===${JSON.stringify(name)})`);await sleep(650);}
try{
 await b.send('Emulation.setDeviceMetricsOverride',{width:427,height:952,deviceScaleFactor:3,mobile:true,screenWidth:427,screenHeight:952});
 await b.send('Emulation.setEmulatedMedia',{features:[{name:'prefers-reduced-motion',value:'reduce'}]});
 const car='/cars/2024-toyota-fortuner-exr';
 await b.navigate(car);await shot('fortuner-detail','native-gallery-top');
 await b.clickText('Price breakdown');await shot('price','price-breakdown-confirmed');await b.back();
 await b.clickText('EMI plans');await shot('emi','emi-confirmed');await b.back();
 await b.navigate(car+'/gallery');await shot('gallery','native-gallery-exteriors');
 await b.navigate(car+'/features');await shot('features');
 await b.click(`document.querySelector('[aria-label="About Airbag Knees"]')`);await shot('airbag','final-airbag-information');await b.back();
 await b.navigate('/cars/2023-suzuki-ciaz-glx');await b.click(`document.querySelector('[aria-label="Show vehicle offer 2"]')`);await shot('ciaz','recovery-native-ciaz');
 await b.navigate(car);await section('Service History');await shot('service-history','resume-service-history');
 await section('Car finance');await shot('finance','resume-finance-confirmed');
 await section('Our happy customers');await shot('customers','final-customers');
 await section('Similar Cars');await shot('comparison','final-similar-top');
 await b.navigate(car);await b.clickText('VIEW SIMILAR CARS');await shot('similar-sheet','final-similar-entry-ready');await b.back();
 await b.click(`document.querySelector('[aria-label="Show vehicle offer 3"]')`);await b.click(`document.querySelector('[aria-label="Vehicle offers"] button:not([aria-label])')`);await shot('coupon','final-offer-action');await b.back();
 for(const [name,route]of [['home','/'],['inventory','/cars'],['sell','/sell'],['service','/service'],['stores','/stores'],['luxe','/luxe'],['menu','/more']]){await b.navigate(route);await shot(name);}
 await b.viewport(1440,1000);await b.navigate(car+'/gallery');
 b.check('Desktop gallery starts below its fixed header',await b.evaluate(`document.querySelector('[data-photo-index="0"]').getBoundingClientRect().top>=document.querySelector('[aria-label="Vehicle photo categories"]').getBoundingClientRect().bottom-1`));
 await b.clickText('Interior');await sleep(400);
 b.check('Desktop gallery category remains visible below fixed controls',await b.evaluate(`document.querySelector('[data-photo-index="4"]').getBoundingClientRect().top>=document.querySelector('[aria-label="Vehicle photo categories"]').getBoundingClientRect().bottom-2`));
 b.check('Visual verification has no runtime, console or HTTP failures',b.errors.length===0,b.errors);
}finally{await writeFile(root+'/pairs.json',JSON.stringify(pairs,null,2));const result=await b.report();await b.close();process.exitCode=result.failed||result.browserErrors?1:0;}
