import fs from 'node:fs';
import path from 'node:path';
import assert from 'node:assert/strict';
import { createRequire } from 'node:module';
import { fileURLToPath } from 'node:url';
import { spawnSync } from 'node:child_process';
import { readRequest, validateOriginalProofs, guardHostedContext, assertBoundary, sha256, REQUEST_BASENAME } from './lib/hosted-native-qa.mjs';
import { githubIdentity } from './verify-existing-fleet-hosted-native.mjs';

export const PIN = Object.freeze({ sourceCommit:'b6eb5f8e209f83d273101a3e26d8d4a8659026de', sourceTree:'168a0b043467a517757ba1544c88969b013fd53f',
  versionId:'31b65368-5bec-4deb-8592-18b1980ea895', deploymentId:'569d7c89-3501-477a-8adb-bd0d059443de', buildRunId:38169149692,
  artifactId:11713191454, publicOrigin:'https://cars-priselci.darkapoparka1.workers.dev' });
export const SOURCE_ID = '11784527405061757';
const S1='32ac4ebcbafff38df6306e9919ce6113b2d10503';
export function assertCi(env=process.env) {
  assert.equal(process.platform,'linux');assert.equal(process.version,'v26.10.0');
  assert.equal(env.GITHUB_ACTIONS,'true');assert.equal(env.GITHUB_REPOSITORY,'darkapoparka/cars');assert.equal(env.GITHUB_EVENT_NAME,'workflow_dispatch');assert.equal(env.GITHUB_REF,'refs/heads/main');
  assert.match(env.GITHUB_SHA||'',/^[a-f0-9]{40}$/);
  assert.equal(env.GITHUB_WORKFLOW_REF,'darkapoparka/cars/.github/workflows/priselci-public-browser-complement.yml@refs/heads/main');
}
export function prepareBrowserDependencies(root,env=process.env) {
  assertCi(env);
  const git=(...args)=>{const r=spawnSync('git',args,{cwd:root,env:{...env,GIT_NO_LAZY_FETCH:'0'},encoding:'utf8',maxBuffer:8*1024**2});assert.equal(r.status,0,r.stderr);return r.stdout.trim();};
  assert.equal(git('rev-parse','HEAD'),env.GITHUB_SHA);assert.equal(git('remote','get-url','origin').replace(/\.git$/,''),'https://github.com/darkapoparka/cars');
  // Same immutable-S1 preparation rule as hosted55, scoped to this runner's two dependency inputs. Its strict workflow-specific API cannot admit this workflow.
  const files=['templates/auto-best/package.json','templates/auto-best/package-lock.json'];
  git('restore','--source='+S1,'--worktree','--',...files);
  return files.map(relative=>{const file=path.join(root,relative);assert.equal(fs.realpathSync(file),file);assert.equal(git('hash-object',file),git('rev-parse',S1+':'+relative));return{path:relative,sha256:sha256(fs.readFileSync(file))};});
}
export function assertPilot(request) {
  for (const [key,value] of Object.entries(PIN)) assert.equal(request[key],value,'Pilot identity differs: '+key);
  return request;
}
export function routePlan(family,locale) {
  assert(['app','mobile','karento-best'].includes(family),'Unsupported family');
  assert(['bg','en'].includes(locale),'Unsupported locale');
  if(family==='app') { const home='/variant-4/'+locale,detail=home+'/cars/vw-golf-1-4-2007-'+SOURCE_ID;
    return {home,inventory:home+'/cars',detail,gallery:detail+'/gallery',contact:home+'/stores'}; }
  if(family==='mobile') return {home:'/variant-5/?lang='+locale,inventory:'/variant-5/?lang='+locale,
    detail:'/variant-5/vehicle/'+SOURCE_ID+'?lang='+locale,gallery:'/variant-5/vehicle/'+SOURCE_ID+'/gallery?lang='+locale,contact:'/variant-5/contact?lang='+locale};
  return {home:'/variant-6/?lang='+locale,inventory:'/variant-6/vehicles?lang='+locale,
    detail:'/variant-6/vehicle?id='+SOURCE_ID+'&lang='+locale,gallery:null,contact:'/variant-6/contact?lang='+locale};
}
export function designLinks(locale) {
  assert(['bg','en'].includes(locale));
  return {'auto-best':'/'+locale,modern:'/variant-2/'+locale+'/cars',import:'/variant-3/'+locale,app:'/variant-4/'+locale,
    mobile:'/variant-5/?lang='+locale,'karento-best':'/variant-6/?lang='+locale};
}
export function galleryLabels(family,locale) {
  routePlan(family,locale);
  if(locale==='en') return {dialog:'Vehicle photo viewer',next:'Next photo',close:'Close photo viewer',mobileOpen:'Open vehicle image 1'};
  return {dialog:family==='mobile'?'Преглед на снимките':'Преглед на снимки',next:'Следваща снимка',
    close:family==='app'?'Затвори снимката':family==='mobile'?'Затвори снимките':'Затворете снимките',mobileOpen:'Отвори снимка 1'};
}
export function manifestAsset(imageUrl,rows,kind) {
  const url=new URL(imageUrl,PIN.publicOrigin);
  assert.equal(url.origin,PIN.publicOrigin,'Foreign source image');
  const original=url.pathname==='/_next/image'||url.pathname.endsWith('/_next/image') ? new URL(url.searchParams.get('url'),PIN.publicOrigin) : url;
  assert.equal(original.origin,PIN.publicOrigin,'Foreign optimized source image');const pathname=original.pathname;
  assert(!pathname.includes('..')&&!/%2f|%5c/i.test(pathname),'Unsafe image path');
  const row=rows.find(row=>row.path==='public'+pathname);
  assert(row&&row.bytes>0&&row.bytes<=8*1024**2&&/^[a-f0-9]{64}$/.test(row.sha256),'Painted asset lacks bounded original manifest entry');
  assert(kind==='logo'? /logo|brand/i.test(pathname): /vehicle/i.test(pathname)&&!/logo|brand/i.test(pathname),'Wrong image role');
  return {path:pathname,bytes:row.bytes,sha256:row.sha256};
}
export function validateGeometry(value,width) {
  assert.equal(value.innerWidth,width,'Actual viewport differs');
  assert(value.scrollWidth<=width+1,'Horizontal page overflow');
  assert(value.paintedImages>0,'No painted source images');
  for(const heading of value.headings) {assert(heading.width>0&&heading.left>=-1&&heading.right<=width+1,'Heading outside viewport');assert(!heading.textClipped,'Painted primary title text clipped');
    if(heading.clientWidth!==undefined) assert(heading.scrollWidth<=heading.clientWidth+1&&heading.scrollHeight<=heading.clientHeight+1,'Primary title copy clipped');}
  return value;
}
export function assertLocale(actual,expected) {assert(actual===expected||actual.startsWith(expected+'-'),'Actual document locale differs');}
export function controlFit(bounds,width) {assert(bounds&&bounds.x>=-1&&bounds.y>=-1&&bounds.width>0&&bounds.height>0&&bounds.x+bounds.width<=width+1,'Native control outside viewport');return bounds;}
export function legacyClipRegion(bounds,clip,position) {
  if(clip==='auto'||!clip||!['absolute','fixed'].includes(position)) return null;
  assert(/^rect\(.+\)$/.test(clip),'Unknown painted legacy clip');
  const parts=clip.slice(5,-1).trim().split(/\s*,\s*|\s+/);assert.equal(parts.length,4,'Unknown legacy clip rectangle');
  const limits=[bounds.top,bounds.right,bounds.bottom,bounds.left],origins=[bounds.top,bounds.left,bounds.top,bounds.left];
  const edges=parts.map((part,i)=>{if(part==='auto')return limits[i];assert(/^-?\d+(?:\.\d+)?px$/.test(part),'Unknown legacy clip units');return origins[i]+Number(part.slice(0,-2));});
  return {top:edges[0],right:edges[1],bottom:edges[2],left:edges[3],x:true,y:true};
}
export function selectSourceLink(rows,detail) {
  const expected=new URL(detail,PIN.publicOrigin);
  const index=rows.findIndex(row=>{if(!row.visible||!/Golf/i.test(row.text))return false;let actual;try{actual=new URL(row.href,PIN.publicOrigin);}catch{return false;}
    return actual.origin===PIN.publicOrigin&&actual.pathname===expected.pathname&&actual.searchParams.get('id')===expected.searchParams.get('id')&&
      (!expected.searchParams.has('lang')||(actual.searchParams.get('lang')||'bg')===expected.searchParams.get('lang'));});
  assert(index>=0,'Actual source card/detail join absent');return index;
}
export async function dismissAppWelcome(page,locale) {
  assert(['bg','en'].includes(locale));const sheet=page.locator('[data-welcome-sheet][role="dialog"]');
  if(!await sheet.isVisible())return false;
  await sheet.getByRole('button',{name:locale==='bg'?'Затвори приветствието':'Close welcome',exact:true}).click();
  await page.locator('[data-welcome-overlay]').waitFor({state:'hidden'});return true;
}
export function paintedHeading(heading,width,height) {
  if(heading.hidden||heading.width<=0||heading.height<=0) return null;
  const region={left:0,right:width,top:0,bottom:height};
  for(const clip of [heading,...heading.clips]) {if(clip.x!==false) {region.left=Math.max(region.left,clip.left);region.right=Math.min(region.right,clip.right);}if(clip.y!==false) {region.top=Math.max(region.top,clip.top);region.bottom=Math.min(region.bottom,clip.bottom);}}
  if(region.left>=region.right||region.top>=region.bottom) return null;
  const textClipped=heading.textRects.some(rect=>rect.bottom>region.top&&rect.top<region.bottom&&rect.right>rect.left&&(rect.left<region.left-1||rect.right>region.right+1));
  return {...heading,visibleRegion:region,textClipped};
}
async function geometry(page,width,title=null) {
  const value=await page.evaluate(({title})=>{
    const rect=e=>{const r=e.getBoundingClientRect();return{left:r.left,right:r.right,top:r.top,bottom:r.bottom,width:r.width,height:r.height};};
    return {innerWidth,innerHeight,visualWidth:visualViewport?.width,scrollWidth:Math.max(document.body.scrollWidth,document.documentElement.scrollWidth),
      headings:(title?[title]:[...document.querySelectorAll('h1')]).map(e=>{const range=document.createRange();range.selectNodeContents(e);const clips=[];let hidden=false;
        for(let ancestor=e;ancestor;ancestor=ancestor.parentElement) {const s=getComputedStyle(ancestor);hidden ||= s.visibility==='hidden'||s.display==='none'||Number(s.opacity)===0||ancestor.getAttribute('aria-hidden')==='true';
          const x=/hidden|clip|scroll|auto/.test(s.overflowX),y=/hidden|clip|scroll|auto/.test(s.overflowY);if(x||y) clips.push({...rect(ancestor),x,y});if(s.clip!=='auto') clips.push({legacyClip:s.clip,position:s.position,bounds:rect(ancestor)});}
        return {...rect(e),text:e.textContent.trim().slice(0,180),level:e.tagName,hidden,clips,textRects:[...range.getClientRects()].map(r=>({left:r.left,right:r.right,top:r.top,bottom:r.bottom})),clientWidth:e.clientWidth,clientHeight:e.clientHeight,scrollWidth:e.scrollWidth,scrollHeight:e.scrollHeight};}),
      paintedImages:[...document.images].filter(e=>{const r=e.getBoundingClientRect(),s=getComputedStyle(e);return e.complete&&e.naturalWidth>0&&r.width>0&&r.height>0&&r.bottom>0&&r.top<innerHeight&&s.visibility!=='hidden'&&s.display!=='none'&&Number(s.opacity)>0;}).length};
  },{title:title?await title.elementHandle():null});
  value.unpaintedHeadingCount=value.headings.length;value.headings=value.headings.map(row=>({...row,clips:row.clips.map(clip=>clip.legacyClip?legacyClipRegion(clip.bounds,clip.legacyClip,clip.position):clip).filter(Boolean)})).map(row=>paintedHeading(row,width,value.innerHeight)).filter(Boolean);value.unpaintedHeadingCount-=value.headings.length;
  if(title) assert.equal(value.headings.length,1,'Native source title is not painted in viewport');
  return validateGeometry(value,width);
}
async function goto(page,relative,locale) {
  const response=await page.goto(PIN.publicOrigin+relative,{waitUntil:'domcontentloaded',timeout:45000});
  assert(response&&response.status()===200,'Route HTTP failure: '+relative);
  assert.equal(new URL(page.url()).origin,PIN.publicOrigin);
  await page.locator('body').waitFor(); await page.waitForTimeout(650);
  if(locale) assertLocale(await page.locator('html').getAttribute('lang')||'',locale);
}
async function paintedAssets(page,rows,kind) {
  const urls=await page.evaluate(()=>[...document.images].filter(e=>{const r=e.getBoundingClientRect(),s=getComputedStyle(e);return e.complete&&e.naturalWidth>0&&r.width>0&&r.height>0&&r.bottom>0&&r.top<innerHeight&&r.right>0&&r.left<innerWidth&&s.visibility!=='hidden'&&s.display!=='none'&&Number(s.opacity)>0;}).map(e=>e.currentSrc||e.src));
  const candidates=urls.flatMap(url=>{try{return[manifestAsset(url,rows,kind)];}catch{return[];}});
  assert(candidates.length,'No manifest-bound painted '+kind);
  const selected=candidates[0],response=await page.request.get(PIN.publicOrigin+selected.path,{timeout:30000,maxRedirects:0});
  assert.equal(response.status(),200); const bytes=await response.body();
  assert.equal(bytes.length,selected.bytes,'Raw source image size differs'); assert.equal(sha256(bytes),selected.sha256,'Raw source image digest differs');
  return selected;
}
async function switcher(page,locale,width) {
  const host=page.locator('dealer-design-switcher, excellent-design-switcher').first(),fab=host.locator('.fab');
  await fab.waitFor({state:'visible'}); const bounds=await fab.boundingBox();
  assert(bounds&&bounds.x>=0&&bounds.x+bounds.width<=width+1&&bounds.width>=44&&bounds.height>=44,'FAB target geometry');
  await fab.click(); assert.equal(await fab.getAttribute('aria-expanded'),'true');
  const expected=designLinks(locale),actual=await host.locator('a.design').evaluateAll(links=>links.map(a=>({key:a.dataset.designKey,href:a.href})));
  assert.equal(actual.length,6); assert.equal(new Set(actual.map(x=>x.key)).size,6);
  for(const row of actual) assert.equal(row.href,PIN.publicOrigin+expected[row.key],'Native design link differs');
  const admin=host.locator('a.admin'); assert.equal(await admin.getAttribute('href'),'https://cars-admin-blue.vercel.app/?dealer=cars-priselci');
  assert.equal(await admin.getAttribute('target'),'_blank'); assert.match(await admin.getAttribute('rel')||'',/noopener/); assert.match(await admin.getAttribute('rel')||'',/noreferrer/);
  await host.locator('.close').click(); assert.equal(await fab.getAttribute('aria-expanded'),'false');
  return {fab:bounds,designs:actual,admin:'verified external demo link; not opened'};
}
async function followDesignLinks(page,locale) {
  const initial=page.url(),followed=[];
  for(const [key,relative] of Object.entries(designLinks(locale))) {
    const target=PIN.publicOrigin+relative;if(target===initial) {followed.push({key,target,sameRoute:true});continue;}
    const host=page.locator('dealer-design-switcher').first();await host.locator('.fab').click();
    await Promise.all([page.waitForURL(target,{waitUntil:'domcontentloaded'}),host.locator('a.design[data-design-key="'+key+'"]').click()]);
    followed.push({key,target,actual:page.url()});await page.goBack({waitUntil:'domcontentloaded'});assert.equal(page.url(),initial);await page.locator('dealer-design-switcher .fab').waitFor({state:'visible'});
    if(await host.locator('.fab').getAttribute('aria-expanded')==='true') await host.locator('.close').click();
  }
  return followed;
}
async function gallery(page,family,locale,width) {
  const labels=galleryLabels(family,locale);
  const tile=family==='app'?page.locator('button[data-photo-index="0"]'):family==='mobile'?page.getByRole('button',{name:labels.mobileOpen,exact:true}):page.locator('[aria-roledescription="carousel"] .slick-current a[role="button"]');
  await tile.first().waitFor({state:'visible'});await tile.first().click();
  const dialog=family==='karento-best'?page.locator('dialog.karento-photo-viewer[open]'):page.getByRole('dialog',{name:labels.dialog,exact:true});
  await dialog.waitFor({state:'visible'});
  const photo=dialog.locator('img').first();await photo.waitFor({state:'visible'});const before=await photo.getAttribute('src');
  const next=dialog.getByRole('button',{name:labels.next,exact:true});await next.click();
  await page.waitForFunction(({selector,before})=>{const image=document.querySelector(selector);return image&&image.getAttribute('src')!==before&&image.complete&&image.naturalWidth>0;},
    {selector:family==='karento-best'?'dialog.karento-photo-viewer[open] img':'[role="dialog"] img, dialog[open] img',before});
  const close=dialog.getByRole('button',{name:labels.close,exact:true}),closeBounds=controlFit(await close.boundingBox(),width);
  if(width<=390) assert(closeBounds.width>=44&&closeBounds.height>=44,'Mobile photo close target smaller than44');
  await close.click();await dialog.waitFor({state:'hidden'});
  return {opened:true,nextImageChanged:true,close:closeBounds,dismissed:true};
}
export async function runComplement({root,requestSha,env=process.env}) {
  assertCi(env);
  assert.match(env.GITHUB_RUN_ID||'',/^\d+$/);assert.match(env.GITHUB_RUN_ATTEMPT||'',/^\d+$/);
  const loaded=readRequest(root,REQUEST_BASENAME,requestSha),request=assertPilot(loaded.request),proofs=validateOriginalProofs(root,request,{fresh:true});
  const identity=await githubIdentity(request),base=fs.realpathSync(env.RUNNER_TEMP),output=path.join(base,'priselci-public-browser-'+env.GITHUB_RUN_ID+'-'+env.GITHUB_RUN_ATTEMPT);
  assert(!fs.existsSync(output),'Evidence output already exists');fs.mkdirSync(output);assert.equal(fs.realpathSync(output),output);
  const require=createRequire(path.join(root,'templates/auto-best/package.json'));
  assert.equal(require('./package.json').devDependencies.playwright,'1.62.1','Selected browser runtime changed');
  const {chromium}=require('playwright'),browser=await chromium.launch({headless:true}),records=[],screenshots=[],assets=new Map();
  let fatal=null;
  try {
    for(const family of ['app','mobile','karento-best']) for(const locale of ['bg','en']) for(const width of [320,390,1440]) {
      const record={family,locale,width,sourceId:SOURCE_ID,steps:[],passed:false},context=await browser.newContext({viewport:{width,height:width===1440?1000:844},locale:locale==='bg'?'bg-BG':'en-GB'});
      const blocked=await guardHostedContext(context,{publicOrigin:PIN.publicOrigin,output},{preferences:false}),page=await context.newPage(),routes=routePlan(family,locale);
      try {
        await goto(page,routes.home,locale);if(family==='app')record.welcomeDismissed=await dismissAppWelcome(page,locale);record.steps.push({stage:'home',documentLocale:await page.locator('html').getAttribute('lang'),geometry:await geometry(page,width),switcher:await switcher(page,locale,width)});
        if(family==='app'&&locale==='bg'&&width===390) record.followedDesignLinks=await followDesignLinks(page,locale);
        if(locale==='bg'&&width===390) { assets.set(family+'/logo',await paintedAssets(page,proofs.artifactManifest.value.files,'logo'));const filename=family+'-bg-390-home.png';await page.screenshot({path:path.join(output,filename)});screenshots.push(filename); }
        await goto(page,routes.inventory,locale);if(family==='app')await dismissAppWelcome(page,locale);const links=page.locator('a[href]');
        const candidates=await links.evaluateAll(nodes=>nodes.map(a=>{const r=a.getBoundingClientRect(),s=getComputedStyle(a);return{href:a.href,text:a.textContent,visible:r.width>0&&r.height>0&&s.visibility!=='hidden'&&s.display!=='none'};}));
        const index=selectSourceLink(candidates,routes.detail),selected=candidates[index];record.sourceLink={href:selected.href,text:selected.text.trim()};
        await Promise.all([page.waitForURL(selected.href,{waitUntil:'domcontentloaded'}),links.nth(index).click()]);
        assert.equal(page.url(),selected.href,'Native source card navigation differs');await page.waitForFunction(expected=>document.documentElement.lang===expected||document.documentElement.lang.startsWith(expected+'-'),locale,{timeout:10000});assertLocale(await page.locator('html').getAttribute('lang')||'',locale);
        const title=page.getByRole('heading',{name:/Golf/i}).first();await title.waitFor({state:'visible'});
        assert.match(await page.locator('body').innerText(),/3[\s\u00a0.,]?600/,'Dated source price absent');record.steps.push({stage:'source-detail',geometry:await geometry(page,width,title)});
        if(locale==='en'&&width===1440) {assets.set(family+'/photo',await paintedAssets(page,proofs.artifactManifest.value.files,'photo'));const filename=family+'-en-1440-detail.png';await page.screenshot({path:path.join(output,filename)});screenshots.push(filename);}
        if(routes.gallery) await goto(page,routes.gallery,locale);record.gallery=await gallery(page,family,locale,width);record.steps.push({stage:'gallery',geometry:await geometry(page,width)});
        const prior=page.url();await goto(page,routes.contact,locale);record.steps.push({stage:'contact',geometry:await geometry(page,width)});
        await page.goBack({waitUntil:'domcontentloaded'});await page.waitForFunction(expected=>document.documentElement.lang===expected||document.documentElement.lang.startsWith(expected+'-'),locale,{timeout:10000});
        assert.equal(page.url(),prior,'Native back lost the exact source/gallery URL or locale query');assertLocale(await page.locator('html').getAttribute('lang')||'',locale);
        record.nativeBack={expected:prior,actual:page.url(),documentLocale:await page.locator('html').getAttribute('lang')};
        assertBoundary(blocked);record.passed=true;
      } catch(error) {record.error=error.message;} finally {record.blocked=blocked;records.push(record);await context.close();}
    }
  } catch(error) {fatal=error.message;} finally {await browser.close();}
  const result={schemaVersion:1,type:'cars-priselci-public-browser-complement',checkedAt:new Date().toISOString(),requestSha256:requestSha,identity,pilot:PIN,
    scope:'18 three-family viewport/locale journeys; separate from 55 preference cases',records,assets:Object.fromEntries(assets),screenshots,
    passed:!fatal&&records.length===18&&records.every(row=>row.passed)&&screenshots.length===6&&assets.size===6,fatal,
    acceptance:{source:false,native:false,hosted:false,owner:false,global:false},postCollectionProviderRecheckRequired:true};
  fs.writeFileSync(path.join(output,'results.json'),JSON.stringify(result,null,2)+'\n');assert(result.passed,'Browser complement failed; retain compact results');return result;
}
if(process.argv[1]&&path.resolve(process.argv[1])===fileURLToPath(import.meta.url)) {
  const args=process.argv.slice(2),root=path.resolve(fileURLToPath(new URL('..',import.meta.url)));
  if(args.length===1&&args[0]==='--prepare-source') console.log(JSON.stringify(prepareBrowserDependencies(root)));
  else {assert.equal(args.length,3);assert.equal(args[0],'--run');assert.equal(args[1],'--sha256');assert.match(args[2],/^[a-f0-9]{64}$/);await runComplement({root,requestSha:args[2]});}
}
