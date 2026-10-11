import test from 'node:test';
import assert from 'node:assert/strict';
import {legacyClipRegion,selectSourceLink,dismissAppWelcome,assertPilot,PIN,routePlan,designLinks,galleryLabels,manifestAsset,validateGeometry,paintedHeading,assertLocale,controlFit,SOURCE_ID} from './verify-priselci-public-browser.mjs';
test('release guard rejects a different hosted version, origin, source and artifact',()=>{
  if(PIN.sourceCommit === null){assert.throws(()=>assertPilot({...PIN}),/Held S2 pilot tuple is not sealed/);return;}
  assertPilot({...PIN});for(const key of ['versionId','deploymentId','publicOrigin','sourceCommit','sourceTree','buildRunId','artifactId']) assert.throws(()=>assertPilot({...PIN,[key]:'changed'}));
});
test('actual Signature320 offscreen carousel clones are excluded, partly painted clipped text remains a failure',()=>{
  const headings=[-339,16,371,726].map(left=>({left,right:left+273,top:200,bottom:250,width:273,height:50,hidden:false,clips:[{left:16,right:304,top:0,bottom:844,x:true,y:false}],textRects:[{left,right:left+273,top:200,bottom:250}]}));
  const painted=headings.map(row=>paintedHeading(row,320,844)).filter(Boolean);assert.equal(painted.length,1);assert.equal(painted[0].left,16);assert.equal(painted[0].textClipped,false);
  const partial=paintedHeading({...headings[1],left:290,right:563,textRects:[{left:290,right:563,top:200,bottom:250}]},320,844);assert(partial.textClipped);
  assert.throws(()=>validateGeometry({innerWidth:320,scrollWidth:320,paintedImages:1,headings:[partial]},320));
});
test('native locale and visible control geometry must match actual document, not browser configuration',()=>{
  assertLocale('bg','bg');assertLocale('en-GB','en');assert.throws(()=>assertLocale('bg','en'));assert.throws(()=>assertLocale('','bg'));
  controlFit({x:270,y:20,width:44,height:44},320);assert.throws(()=>controlFit({x:310,y:20,width:44,height:44},320));
});
test('exact source route joins retain locale and actual native IDs without arbitrary route admission',()=>{
  for(const locale of ['bg','en']) for(const family of ['app','mobile','karento-best']) {const row=routePlan(family,locale);assert(row.detail.includes(SOURCE_ID));assert(row.contact.includes(locale));assert(Object.values(row).every(value=>value===null||value.startsWith('/variant-')));}
  assert.throws(()=>routePlan('modern','bg'));assert.throws(()=>routePlan('app','fr'));assert.equal(Object.keys(designLinks('en')).length,6);
  assert.equal(galleryLabels('karento-best','bg').close,'Затворете снимките');assert.notEqual(galleryLabels('app','bg').close,galleryLabels('mobile','bg').close);
  assert.throws(()=>galleryLabels('app','fr'));
});
test('painted image must join exact bounded archive row and original same-origin asset',()=>{
  const row={path:'public/variant-4/dealer-app/vehicle-one.webp',bytes:100,sha256:'a'.repeat(64)};
  assert.equal(manifestAsset(PIN.publicOrigin+'/variant-4/_next/image?url=%2Fvariant-4%2Fdealer-app%2Fvehicle-one.webp&w=640',[row],'photo').sha256,row.sha256);
  assert.throws(()=>manifestAsset('https://foreign.example/vehicle-one.webp',[row],'photo'));
  assert.throws(()=>manifestAsset(PIN.publicOrigin+'/variant-4/dealer-app/vehicle-two.webp',[row],'photo'));
  assert.throws(()=>manifestAsset(PIN.publicOrigin+'/variant-4/dealer-app/vehicle-one.webp',[row],'logo'));
});
test('reported viewport, painted state and document overflow are asserted, not inferred',()=>{
  const good={innerWidth:390,scrollWidth:390,paintedImages:1,headings:[{width:350,left:20,right:370}]};validateGeometry(good,390);
  for(const changed of [{innerWidth:320},{scrollWidth:410},{paintedImages:0},{headings:[{width:420,left:0,right:420}]},{headings:[{width:350,left:20,right:370,clientWidth:350,scrollWidth:410,clientHeight:40,scrollHeight:40}]}]) assert.throws(()=>validateGeometry({...good,...changed},390));
});
test('actual legacy clip excludes fully unpainted accessibility text and rejects partly painted clipping',()=>{
  const hidden={left:16,right:17,top:100,bottom:101,width:1,height:1,hidden:false,textRects:[{left:16,right:116,top:100,bottom:142}],clientWidth:1,clientHeight:1,scrollWidth:100,scrollHeight:42};
  const zero=legacyClipRegion(hidden,'rect(0px, 0px, 0px, 0px)','absolute');assert.equal(paintedHeading({...hidden,clips:[zero]},320,844),null);
  const partial={left:16,right:216,top:100,bottom:142,width:200,height:42,hidden:false,textRects:[{left:16,right:216,top:100,bottom:142}],clips:[legacyClipRegion({left:16,right:216,top:100,bottom:142},'rect(0px, 100px, 42px, 0px)','absolute')]};
  const painted=paintedHeading(partial,320,844);assert(painted.textClipped);assert.throws(()=>validateGeometry({innerWidth:320,scrollWidth:320,paintedImages:1,headings:[painted]},320));
  assert.equal(legacyClipRegion(hidden,'auto','absolute'),null);assert.equal(legacyClipRegion(hidden,'rect(0px, 0px, 0px, 0px)','static'),null);assert.throws(()=>legacyClipRegion(hidden,'circle(0px)','absolute'));
});
test('native source link admits sibling photos while source, locale and origin joins stay strict',()=>{
  const detail=routePlan('karento-best','en').detail,valid={href:PIN.publicOrigin+detail,text:'VW Golf 1.4',visible:true};
  assert.equal(selectSourceLink([{...valid,text:'Other source'},valid],detail),1);
  for(const changed of [{href:'https://foreign.example'+detail},{href:PIN.publicOrigin+detail.replace(SOURCE_ID,'another')},{href:PIN.publicOrigin+detail.replace('lang=en','lang=bg')},{visible:false},{text:'Other car'}])assert.throws(()=>selectSourceLink([{...valid,...changed}],detail));
  assert.equal(selectSourceLink([{...valid,href:PIN.publicOrigin+routePlan('karento-best','bg').detail.replace('&lang=bg','')}],routePlan('karento-best','bg').detail),0);
});
test('welcome closes through exact native local control with no force or business write',async()=>{
  for(const locale of ['bg','en']) {const calls=[];const sheet={isVisible:async()=>true,getByRole:(role,options)=>{calls.push({role,options});return{click:async(...args)=>calls.push({clickArgs:args})};}};
    const page={locator:selector=>selector.includes('sheet')?sheet:{waitFor:async options=>calls.push({wait:options})}};
    assert.equal(await dismissAppWelcome(page,locale),true);assert.equal(calls[0].options.name,locale==='bg'?'Затвори приветствието':'Close welcome');assert.deepEqual(calls[1].clickArgs,[]);assert.deepEqual(calls[2].wait,{state:'hidden'});
  }
  assert.equal(await dismissAppWelcome({locator:()=>({isVisible:async()=>false})},'bg'),false);
});
