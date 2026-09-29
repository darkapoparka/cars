/** Complete local demo drafts; clipboard/share are mocked and business network writes denied. */
import fs from 'node:fs';
import path from 'node:path';
import assert from 'node:assert/strict';
import { chromium } from 'playwright';
import { translatedEnglishPatterns } from './locale-copy-audit.mjs';
const root=path.resolve(import.meta.dirname,'..'),base=new URL(process.env.BASE_URL||process.env.DEALER_BASE_URL);
const out=process.env.LOCALE_QA_OUT||path.join(root,'artifacts/localization/completion');fs.mkdirSync(out,{recursive:true});
const widths=(process.env.LOCALE_QA_WIDTHS||'320,390,1440').split(',').map(Number);
const rows=['catalog','template','dealer'].flatMap(name=>JSON.parse(fs.readFileSync(path.join(root,`localization/${name}.reviewed.json`),'utf8')));
const common=JSON.parse(fs.readFileSync(path.join(root,'localization/common.json'),'utf8'));
const wrong=[...rows,...Object.values(common)].filter(row=>row.en!==row.bg&&!row.en.includes('{')).map(row=>row.en.replace(/\s+/g,' ').trim());
const patterns=translatedEnglishPatterns(rows),results=[];
const save=()=>fs.writeFileSync(path.join(out,'RESULTS.json'),JSON.stringify({base:base.href,at:new Date().toISOString(),scope:'Complete Auto Best sell/import drafts, photo failures, copy success/denial, sharing busy/failure, native text geometry and disabled business writes',results},null,2));
const browser=await chromium.launch({channel:'chrome',headless:true});
try {for(const locale of ['en','bg'])for(const width of widths)for(const kind of ['sell','import']){
 const name=`${locale}-${width}-${kind}`,context=await browser.newContext({viewport:{width,height:width>=1000?1000:844},locale:locale==='en'?'bg-BG':'en-US'});
 await context.addCookies([{name:'cars_prompt',value:'v1',url:base.origin,httpOnly:true,sameSite:'Lax'}]);
 const errors=[],writes=[],stages=[];let page;
 await context.route('**/*',route=>{const req=route.request(),url=new URL(req.url());if(['GET','HEAD','OPTIONS'].includes(req.method()))return route.continue();if(url.hostname==='maps.googleapis.com'&&url.pathname.endsWith('/GetViewportInfo'))return route.abort();writes.push({url:req.url(),method:req.method()});return route.abort();});
 await context.addInitScript(()=>{
  window.qaClipboard='success';window.qaSummary='';window.qaRejectShare=null;
  Object.defineProperty(navigator,'clipboard',{configurable:true,value:{writeText:async text=>{if(window.qaClipboard==='deny')throw new DOMException('Mocked clipboard denial','NotAllowedError');window.qaSummary=text;}}});
  Object.defineProperty(navigator,'canShare',{configurable:true,value:()=>true});
  Object.defineProperty(navigator,'share',{configurable:true,value:()=>new Promise((resolve,reject)=>{window.qaRejectShare=()=>reject(new Error('Mocked share failure'));})});
 });
 try {
  page=await context.newPage();page.setDefaultTimeout(10000);page.on('pageerror',error=>errors.push(error.message));
  await page.goto(base.origin+'/'+locale+'/contact?topic='+(kind==='sell'?'trade-in':'import'),{waitUntil:'domcontentloaded'});await page.locator('[data-locale-ready="true"]').waitFor({state:'attached'});
  async function snapshot(stage,locator){
   await locator.evaluate(async el=>{await Promise.all(el.getAnimations({subtree:true}).filter(a=>a.effect?.getComputedTiming().iterations!==Infinity).map(a=>a.finished.catch(()=>{})));});
   const evidence=await locator.evaluate((el,{locale,wrong,patterns})=>{
    const strings=[],overflow=[],walker=document.createTreeWalker(el,NodeFilter.SHOW_TEXT);
    while(walker.nextNode()){const node=walker.currentNode,parent=node.parentElement,text=node.textContent.replace(/\s+/g,' ').trim();if(!text||!parent?.checkVisibility()||parent.closest('script,style,option,textarea,svg,[aria-hidden=true]'))continue;strings.push(text);const control=parent.closest('button,[role=tab]');if(control&&el.contains(control)){const bounds=control.getBoundingClientRect(),range=document.createRange();range.selectNodeContents(node);for(const rect of range.getClientRects())if(rect.left<bounds.left-2||rect.right>bounds.right+2||rect.top<bounds.top-2||rect.bottom>bounds.bottom+2)overflow.push({text,control:control.className});}}
    for(const target of el.querySelectorAll('[aria-label],[placeholder]'))if(target.checkVisibility())for(const attribute of ['aria-label','placeholder'])if(target.hasAttribute(attribute))strings.push(target.getAttribute(attribute));
    const expressions=patterns.map(pattern=>new RegExp(pattern,'u')),known=new Set(wrong);
    const bad=[...new Set(strings.filter(text=>locale==='en'?/[А-Яа-яЁё]/.test(text):known.has(text)||expressions.some(re=>re.test(text))))];
    const r=el.getBoundingClientRect();return {bad,overflow,strings:strings.length,box:{x:r.x,y:r.y,right:r.right,bottom:r.bottom},viewport:{width:innerWidth,height:innerHeight},documentOverflow:document.documentElement.scrollWidth-innerWidth};
   },{locale,wrong,patterns});
   stages.push({stage,...evidence});assert.deepEqual(evidence.bad,[],stage+' wrong language');assert.deepEqual(evidence.overflow,[],stage+' clipped control labels');assert(evidence.documentOverflow<=1);assert(evidence.box.x>=-1&&evidence.box.y>=-1&&evidence.box.right<=evidence.viewport.width+1&&evidence.box.bottom<=evidence.viewport.height+1,stage+' outside viewport');
   await page.screenshot({path:path.join(out,name+'-'+stage+'.png'),animations:'disabled'});
  }
  if(kind==='import'){
   await page.locator('.dn-enquiry-import-segments button').nth(1).click();await page.locator('.dn-entry-editor-trigger:visible').click();const entry=page.locator('dialog.dn-entry-editor[open]');await entry.locator('[name=entry-value]').fill('QA vehicle criteria');await entry.locator('[name=entry-budget]').fill('40000');await entry.locator('button[type=submit]').click();await entry.waitFor({state:'hidden'});await page.locator('.dn-enquiry-import-go').click();
  }else await page.locator('.dn-tradein-start').click();
  const dialog=page.locator(kind==='sell'?'dialog.dn-tradein-dialog[open]':'dialog.dn-enquiry[open]');await dialog.waitFor({state:'visible'});
  const next=dialog.locator(kind==='sell'?'footer .dn-tradein-primary':'footer .dn-enquiry-primary');
  await dialog.locator('[name=make]').fill('QA Demo');await dialog.locator('[name=model]').fill('QA Model');await dialog.locator('[name=year]').fill('2020');
  if(kind==='sell'){await dialog.locator('[name=mileage]').fill('85000');await dialog.locator('[name=price]').fill('20000');}
  await next.click();await snapshot('contact-step',dialog);
  if(kind==='sell'){
   const upload=dialog.locator('input[type=file]');await upload.setInputFiles({name:'invalid.txt',mimeType:'text/plain',buffer:Buffer.from('Not a photo')});await dialog.locator('[role=alert]').waitFor({state:'visible'});await snapshot('photo-type-error',dialog);
   const image=Buffer.from('iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+aR1sAAAAASUVORK5CYII=','base64');
   await upload.setInputFiles(Array.from({length:7},(_,i)=>({name:'demo-'+i+'.png',mimeType:'image/png',buffer:image})));assert.equal(await dialog.locator('.dn-tradein-photo-grid li').count(),6);await snapshot('photo-limit-error',dialog);
   await dialog.locator('.dn-tradein-photo-grid button').first().click();assert.equal(await dialog.locator('.dn-tradein-photo-grid li').count(),5);
  }
  await next.click();await snapshot('review',dialog);
  const copy=dialog.locator(kind==='sell'?'.dn-tradein-copy':'.dn-enquiry-copy');
  await copy.click();await page.waitForFunction(()=>window.qaSummary.length>0);assert((await page.evaluate(()=>window.qaSummary)).includes('QA Demo'));await snapshot('copy-success',dialog);
  await page.evaluate(()=>window.qaClipboard='deny');await copy.click();await snapshot('copy-denied',dialog);
  await next.click();await page.waitForFunction(()=>typeof window.qaRejectShare==='function');assert(await next.isDisabled());await snapshot('share-pending',dialog);
  await page.evaluate(()=>window.qaRejectShare());await next.waitFor({state:'visible'});await page.waitForFunction(selector=>!document.querySelector(selector)?.disabled,kind==='sell'?'dialog[open] footer .dn-tradein-primary':'dialog[open] footer .dn-enquiry-primary');await snapshot('share-failed',dialog);
  await page.keyboard.press('Escape');await dialog.waitFor({state:'hidden'});assert.equal(await page.evaluate(()=>document.activeElement?.tagName),'BUTTON');
  assert.deepEqual(errors,[]);assert.deepEqual(writes,[]);results.push({name,pass:true,stages,errors,writes});console.log('PASS '+name);
 }catch(error){results.push({name,pass:false,error:error.message,stages,errors,writes});console.error('FAIL '+name+': '+error.message);if(page)await page.screenshot({path:path.join(out,name+'-failure.png')}).catch(()=>{});}
 finally{await context.close();save();}
}}finally{await browser.close();save();}
const failed=results.filter(result=>!result.pass);console.log(JSON.stringify({checks:results.length,passed:results.length-failed.length,failed:failed.map(({name,error})=>({name,error}))}));if(failed.length)process.exitCode=1;
