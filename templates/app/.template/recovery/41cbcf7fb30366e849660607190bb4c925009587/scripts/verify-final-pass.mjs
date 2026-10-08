import {createBrowser,sleep} from './lib/browser-qa.mjs';
const b=await createBrowser('reference/2026-09-26-final-pass/verification');
const path='/cars/2024-toyota-fortuner-exr';
const labelled=label=>`document.querySelector('[aria-label=${JSON.stringify(label)}]')`;
async function test(name,fn){try{await fn();b.check(name,true);}catch(error){b.check(name,false,error.stack);}}
async function check(name,expression){b.check(name,await b.evaluate(expression));}
async function tap(expression,{scroll=true}={}){
 if(scroll)await b.evaluate(`(${expression})?.scrollIntoView({block:'center',inline:'nearest',behavior:'instant'})`);
 await sleep(120);
 const point=await b.evaluate(`(()=>{const e=${expression};if(!e)throw Error('Missing tap target');const r=e.getBoundingClientRect(),x=r.x+r.width/2,y=r.y+r.height/2;const hit=document.elementFromPoint(x,y);if(!(hit===e||e.contains(hit)))throw Error('Tap target is obscured: '+e.getAttribute('aria-label'));return{x,y};})()`);
 await b.send('Input.dispatchMouseEvent',{type:'mouseMoved',...point});await b.send('Input.dispatchMouseEvent',{type:'mousePressed',button:'left',clickCount:1,...point});await b.send('Input.dispatchMouseEvent',{type:'mouseReleased',button:'left',clickCount:1,...point});await sleep(350);
}
async function tab(text){await b.scroll(650);await tap(`[...document.querySelectorAll('[aria-label="Vehicle sections"] button')].find(e=>e.textContent===${JSON.stringify(text)})`);await sleep(800);}
try{
 await b.navigate(path);
 await test('Offer carousel and captured detail sheets',async()=>{
  await b.send('Emulation.setEmulatedMedia',{features:[{name:'prefers-reduced-motion',value:'no-preference'}]});
  await b.navigate(path);
  await tap(labelled('Show vehicle offer 2'),{scroll:false});
  await check('Cash-offer value matches the reference AED 93,159',`document.querySelector('[aria-label="Vehicle offers"]').textContent.includes('93,159')`);
  await tap(`[...document.querySelectorAll('button')].find(e=>e.textContent==='UNLOCK')`,{scroll:false});await b.capture('cash-offer-login');
  await check('Cash unlock opens login without fabricating an account',`!!document.querySelector('[aria-labelledby="login-title"]')`);await b.back();
  await tap(labelled('Show vehicle offer 3'),{scroll:false});await tap(`document.querySelector('[aria-label="Vehicle offers"] button:not([aria-label])')`,{scroll:false});await b.capture('exchange-coupon');
  await check('Exchange coupon reproduces the observed code and terms',`document.querySelector('[aria-label="Coupon Details"]').textContent.includes('TRADEINCAR')&&document.querySelector('[aria-label="Coupon Details"]').textContent.includes('60 days')`);await b.back();
  await tap(labelled('Show vehicle offer 1'),{scroll:false});await tap(`document.querySelector('[aria-label="Vehicle offers"] button:not([aria-label])')`,{scroll:false});await b.capture('interest-offer');
  await check('Interest offer includes the captured eligibility terms',`document.querySelector('[aria-label="Special interest offer"]').textContent.includes('ENBD & EIB')`);await b.back();
  await b.evaluate('document.activeElement?.blur()');await b.send('Input.dispatchMouseEvent',{type:'mouseMoved',x:10,y:400});
  const initial=await b.evaluate(`document.querySelector('[aria-label="Vehicle offers"]').dataset.offerIndex`);await sleep(5600);
  await check('Visible carousel advances without user input',`document.querySelector('[aria-label="Vehicle offers"]').dataset.offerIndex!==${JSON.stringify(initial)}`);
  await b.send('Emulation.setEmulatedMedia',{features:[{name:'prefers-reduced-motion',value:'reduce'}]});await b.navigate(path);
  await sleep(5500);await check('Reduced-motion mode prevents automatic offer rotation',`document.querySelector('[aria-label="Vehicle offers"]').dataset.offerIndex==='0'`);
  await tap(labelled('Show vehicle offer 2'),{scroll:false});await check('Reduced-motion mode retains manual offer selection',`document.querySelector('[aria-label="Vehicle offers"]').dataset.offerIndex==='1'`);
  await b.send('Emulation.setEmulatedMedia',{features:[]});
 });
 await test('Similar Cars entry uses the native sheet',async()=>{
  await b.navigate(path);await tap(`[...document.querySelectorAll('button')].find(e=>e.textContent==='VIEW SIMILAR CARS')`,{scroll:false});await b.capture('similar-entry');
  await check('Similar sheet contains the two captured cars',`document.querySelectorAll('[aria-label="Similar vehicles"] article').length===2`);
  await tap(`document.querySelector('[aria-label="Similar vehicles"] article button')`);
  await check('Saving from Similar Cars persists the selection',`JSON.parse(localStorage.getItem('drive24:saved')||'[]').some(s=>s.includes('9714841125'))`);
  await b.back();await check('Back closes Similar Cars without leaving detail',`location.pathname===${JSON.stringify(path)}&&!document.querySelector('[role="dialog"]')`);
 });
 await test('Comparison table and related-car navigation',async()=>{
  await b.navigate(path);await tab('Similar Cars');await b.capture('similar-comparison');
  await check('Comparison prices match all three observed listings',`JSON.stringify([...document.querySelectorAll('[data-comparison-price]')].map(e=>Number(e.dataset.comparisonPrice)))==='[94099,105199,94199]'`);
  await check('Comparison has the nine observed specification rows',`document.querySelectorAll('[aria-label="Vehicle specification comparison"] th').length===9`);
  await tap(labelled('Show similar car 2'),{scroll:false});await b.capture('similar-second-slide');
  await check('Similar carousel really moves to the Jeep card',`document.querySelector('[aria-label="Similar car recommendations"]').scrollLeft>100`);
  await tap(`document.querySelector('[aria-label="Compare 2023 Jeep Grand Cherokee L"]')`);await b.waitFor(`location.pathname.includes('9714841145')`);await check('Compared vehicle opens its own detail and price',`document.body.textContent.includes('105,199')&&document.querySelector('h1').textContent.includes('JEEP')`);
  await b.back();await b.waitFor(`location.pathname===${JSON.stringify(path)}`);await tab('Similar Cars');
  await b.scroll(await b.evaluate(`scrollY+document.querySelector('[aria-label="Vehicle specification comparison"]').getBoundingClientRect().top-152`));await b.capture('comparison-specifications');
 });
 await test('Real inline inspection video playback',async()=>{
  await b.navigate(path);await tab('Car Condition');await b.capture('inspection-video-poster');
  await b.evaluate(`document.querySelector('[data-reference-video="inspection video"] video').muted=true`);
  await tap(labelled('Watch inspection video'),{scroll:false});await b.waitFor(`document.querySelector('[data-reference-video="inspection video"] video').currentTime>0.5`,'real inspection playback');
  await check('Inspection stream has a real duration and decoded frame',`(()=>{const v=document.querySelector('[data-reference-video="inspection video"] video');return v.duration>30&&v.duration<60&&v.videoWidth>0&&!v.paused;})()`);
  await b.capture('inspection-video-playing');
  await tap(`document.querySelector('[data-reference-video="inspection video"] [aria-label="Pause video"]')`,{scroll:false});
  await check('Pause changes the actual media element',`document.querySelector('[data-reference-video="inspection video"] video').paused`);
  const before=await b.evaluate(`document.querySelector('[data-reference-video="inspection video"] video').currentTime`);
  await tap(`document.querySelector('[data-reference-video="inspection video"] [aria-label="Forward 10 seconds"]')`,{scroll:false});
  await check('Forward seeks the real media timeline',`document.querySelector('[data-reference-video="inspection video"] video').currentTime>=${before+9}`);
 });
 await test('Full inspection expansion uses the captured source',async()=>{
  await b.navigate(path+'/inspection');
  await tap("[...document.querySelectorAll('section')].find(e=>e.querySelector('h2')?.textContent==='Electricals, Controls & Lights')?.querySelector('button')");
  await check('Electrical inspection expands the AC and window checkpoints',"document.body.textContent.includes('AC System Leaks')&&document.body.textContent.includes('Power/ Manual Windows')");
  await b.capture('inspection-electrical-expanded');
 });
 await test('Customer stories and real testimonial video',async()=>{
  await b.navigate(path);await tab('Our happy customers');await b.capture('customer-stories');
  await check('Five captured testimonials are available',`document.querySelectorAll('[aria-label="Customer video testimonials"] figure').length===5`);
  await b.evaluate(`document.querySelector('[data-reference-video="customer testimonial 1"] video').muted=true`);
  await tap(labelled('Watch customer testimonial 1'),{scroll:false});await b.waitFor(`document.querySelector('[data-reference-video="customer testimonial 1"] video').currentTime>0.3`);
  await check('Customer video has real decoded media',`document.querySelector('[data-reference-video="customer testimonial 1"] video').videoWidth>0`);
  await b.evaluate(`document.querySelector('[aria-label="Customer video testimonials"]').scrollTo({left:450,behavior:'instant'})`);await sleep(500);
  await check('Offscreen testimonial pauses rather than playing hidden audio',`document.querySelector('[data-reference-video="customer testimonial 1"] video').paused`);await b.capture('customer-second-story');
 });
 await test('New flows remain usable across screen sizes',async()=>{
  for(const [width,height]of [[390,844],[768,1024],[1440,1000]]){
   await b.viewport(width,height);await b.navigate(path);await tab('Similar Cars');await b.capture(`comparison-${width}`);
   await b.navigate(path);await tab('Our happy customers');await b.capture(`testimonials-${width}`);
   await b.navigate(path);await tap(`[...document.querySelectorAll('button')].find(e=>e.textContent==='VIEW SIMILAR CARS')`);await b.capture(`similar-sheet-${width}`);await b.key('Escape',27);
  }
 });
 b.check('No new runtime, console or failed HTTP responses',b.errors.length===0,b.errors);
}finally{const result=await b.report();await b.close();process.exitCode=result.failed||result.browserErrors?1:0;}
