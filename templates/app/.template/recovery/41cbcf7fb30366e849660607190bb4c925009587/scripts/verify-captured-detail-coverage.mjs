import {readFile,writeFile,stat} from 'node:fs/promises';
import {createBrowser,sleep} from './lib/browser-qa.mjs';
const data=JSON.parse(await readFile('lib/captured-vehicle-details.json','utf8'));
const b=await createBrowser('reference/2026-09-26-final-pass/coverage-verification');
const fortuner='/cars/2024-toyota-fortuner-exr',ciaz='/cars/2023-suzuki-ciaz-glx';
async function scenario(name,fn){try{await fn();b.check(name,true);}catch(error){b.check(name,false,error.stack);}}
async function check(name,expression){b.check(name,await b.evaluate(expression));}
async function goSection(name){await b.scroll(650);await b.click(`[...document.querySelectorAll('[aria-label="Vehicle sections"] button')].find(e=>e.textContent===${JSON.stringify(name)})`);await sleep(800);}
try {
 await scenario('All captured source identities and backing media remain intact',async()=>{
  const manifest=JSON.parse(await readFile('reference/2026-09-26-final-pass/vehicle-details/manifest.json','utf8'));
  for(const entry of manifest.results){if(!entry.file)continue;const raw=JSON.parse(await readFile(entry.file,'utf8')).content,d=data[entry.slug];b.check(`${entry.slug}: source identity and actual fee`,d.referenceId===raw.appointmentId&&d.convenienceFee===raw.updatedPriceBenefits.convenienceFee);
   const expected=raw.inspectionReport.flatMap(s=>s.child).flatMap(group=>group.child??[group]);const got=d.inspection.flatMap(s=>s.groups).flatMap(g=>g.items);
   b.check(`${entry.slug}: no inspection findings or tyre measurements discarded`,JSON.stringify(got.map(item=>[item.name,item.status,item.value??null,item.remarks]))===JSON.stringify(expected.map(item=>[item.title,item.status??null,item.value??null,item.error??[]])));
  }
  const paths=[...new Set(Object.values(data).flatMap(d=>[...d.gallery.map(p=>p.src),d.primaryImage,d.serviceDue?.image,d.videoTour?.src,d.videoTour?.poster].filter(Boolean)))];
  for(let i=0;i<paths.length;i+=16)await Promise.all(paths.slice(i,i+16).map(async path=>{const item=await stat('public'+path);if(item.size<20)throw Error(`Empty backing asset: ${path}`);}));
  b.check('Every captured gallery, tour, service and primary image has non-empty local backing',true,{count:paths.length});
 });
 await scenario('All 43 captured cars expose real detail, gallery, feature and inspection routes',async()=>{
  const urls=Object.keys(data).flatMap(slug=>['','/gallery','/features','/inspection'].map(suffix=>`/cars/${slug}${suffix}`));
  for(let i=0;i<urls.length;i+=4)await Promise.all(urls.slice(i,i+4).map(async url=>{const r=await fetch(b.base+url,{signal:AbortSignal.timeout(15000)});const html=await r.text();b.check(`${url}: usable server response`,r.status===200&&!html.includes('This page could not be found'));}));
 });
 await scenario('Ciaz uses its own four-tab video, specifications and fee',async()=>{
  await b.navigate(ciaz);await b.capture('ciaz-detail');
  await check('Ciaz has Video tour plus three actual photo categories',`document.querySelector('[aria-label="Vehicle photographs"]').children.length===4`);
  await check('Ciaz displays its Semi Loaded trim and AED 3,000 convenience fee',`document.body.textContent.includes('Semi Loaded')&&document.querySelector('[aria-label="Vehicle price"]').textContent.includes('3,000')`);
  await b.click(`[...document.querySelectorAll('button')].find(e=>e.textContent==='Price breakdown')`);
  await check('Ciaz price breakdown totals AED 31,799, not a copied Fortuner fee',`document.querySelector('[aria-label="Price breakdown"]').textContent.includes('31,799')`);await b.back();
  // Real pointer activation is required by the browser's audio-autoplay contract.
  const tourPoint=await b.evaluate(`(()=>{const r=document.querySelector('[aria-label="Open vehicle video tour"]').getBoundingClientRect();return{x:r.x+r.width/2,y:r.y+r.height/2};})()`);
  for(const type of ['mousePressed','mouseReleased'])await b.send('Input.dispatchMouseEvent',{type,button:'left',clickCount:1,...tourPoint});
  await b.waitFor(`!!document.querySelector('[aria-label="Vehicle video tour"] video')`);
  await b.evaluate(`document.querySelector('[aria-label="Vehicle video tour"] video').muted=true`);
  await b.waitFor(`document.querySelector('[aria-label="Vehicle video tour"] video').currentTime>0.3`,'real Ciaz video tour');await b.capture('ciaz-video-tour');
  await check('Ciaz video tour decodes and plays its own clip',`document.querySelector('[aria-label="Vehicle video tour"] video').videoWidth>0`);await b.back();
  await check('Video tour Back restores the car without audio',`!document.querySelector('[aria-label="Vehicle video tour"]')&&location.pathname===${JSON.stringify(ciaz)}`);
  await goSection('Overview');await b.capture('ciaz-overview');
  await b.click(`document.querySelector('[aria-label="About Option Type"]')`);await b.capture('specification-information');await b.back();
  await b.navigate(ciaz+'/gallery');await b.capture('ciaz-gallery');
  await check('Ciaz gallery contains its own complete captured photography',`document.querySelectorAll('[data-photo-index]').length===${data['2023-suzuki-ciaz-glx'].gallery.length}&&[...document.querySelectorAll('[data-photo-index] img')].every(img=>img.getAttribute('src').includes('9714842062'))`);
  await b.navigate(ciaz+'/inspection');await b.scroll(490);await b.capture('ciaz-inspection-findings');
  await check('Ciaz imperfections are visible without a click and are not green passes',`document.body.textContent.includes('Acid Marks/ Bird Dropping')&&document.querySelector('[data-inspection-name="Front right door"]').dataset.inspectionStatus==='2'&&!!document.querySelector('[aria-label="Imperfection recorded"]')`);
  await b.scroll(100000);await b.capture('ciaz-tyre-life');
  await check('Tyre life displays recorded percentages, not a fabricated pass',`[...document.querySelectorAll('[data-inspection-status="3"]')].some(row=>row.textContent.includes('<65%'))`);
 });
 await scenario('Feature descriptions and structural VIN are working controls',async()=>{
  await b.navigate(fortuner+'/features');await b.click(`document.querySelector('[aria-label="About Airbag Knees"]')`);await b.capture('airbag-information');
  await check('Airbag information reproduces the captured explanation',`document.querySelector('[aria-label="Airbag Knees"]').textContent.includes('controlling lower body movement')`);await b.back();
  await b.navigate(fortuner);await b.evaluate(`document.querySelector('[aria-label="Captured structural inspection"]').scrollIntoView({block:'center',behavior:'instant'})`);await b.capture('structural-summary');
  await b.click(`document.querySelector('[aria-label="Copy vehicle VIN"]')`);await check('VIN copy reports a visible result',`!!document.querySelector('[aria-label="Captured structural inspection"] [role="status"]')`);
 });
 await scenario('Representative Lite and Luxe cars keep their own content on mobile and desktop',async()=>{
  const samples=['2025-toyota-veloz-gx','2023-jeep-grand-cherokee-l-limited-9714841145','2017-mitsubishi-outlander-glx-mid-0593'];
  for(const [width,height]of [[390,844],[1440,1000]]){await b.viewport(width,height);for(const slug of samples){await b.navigate('/cars/'+slug);await b.capture(`${slug}-${width}`);await b.navigate('/cars/'+slug+'/features');await b.capture(`${slug}-features-${width}`);b.check(`${slug}: complete equipment list`,await b.evaluate('document.querySelectorAll("li").length')===data[slug].featureGroups.reduce((n,g)=>n+g.items.length,0));}}
 });
 b.check('No captured-detail runtime, console or failed HTTP responses',b.errors.length===0,b.errors);
}finally{const report=await b.report();await b.close();await writeFile('reference/2026-09-26-final-pass/coverage-summary.json',JSON.stringify(report,null,2));process.exitCode=report.failed||report.browserErrors?1:0;}
