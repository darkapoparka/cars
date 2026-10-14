import test from 'node:test';import assert from 'node:assert/strict';import fs from 'node:fs';import path from 'node:path';
import {json,sha256,filesAt} from './lib/workflow.mjs';import {artifactInventory} from './lib/uk-cloudflare-artifacts.mjs';
import {inspectSingleWorkerInputs,singleWorkerSource} from './package-uk-single-worker.mjs';
import {assertCiContext,nativeInputDirectories,validateCiSourceIdentity,createCiCompositionReview,verifyFleetSingletonDirectory,assembleFleetCi,SINGLETON_KIND} from './assemble-existing-fleet-single-worker.mjs';
import {tinyArea,writeTinySingleton,writeTinyNativeInputs,writeFixture,fixtureReleases} from './test-fixtures/fleet-single-worker.mjs';

test('the complete singleton seal covers config, six modules, assets and all receipts',t=>{
 const root=tinyArea(t),f=writeTinySingleton(path.join(root,'runtime/output'));assert.equal(verifyFleetSingletonDirectory(f.directory).inventory.digest,f.inventory.digest);
 fs.appendFileSync(path.join(f.directory,'dealer-composition-review.json'),' ');assert.throws(()=>verifyFleetSingletonDirectory(f.directory),/bytes differ/);
});
test('resealed service bindings, foreign resources and relabelled singleton entries fail closed',t=>{
 for(const mutate of [f=>{f.config.services=[{binding:'CARS_APP',service:'other'}];writeFixture(path.join(f.directory,'wrangler.json'),f.config);},f=>writeFixture(path.join(f.directory,'server/worker.mjs'),'export default {};'),f=>{f.delivery.deploymentPerformed=true;writeFixture(path.join(f.directory,'delivery-receipt.json'),f.delivery);}]){
  const root=tinyArea(t),f=writeTinySingleton(path.join(root,'runtime/output'));mutate(f);artifactInventory(f.directory,{kind:SINGLETON_KIND,dealer:f.client,status:'passed'});assert.throws(()=>verifyFleetSingletonDirectory(f.directory),/differs|entry|inventory/);
 }
});
test('a resealed invented UK receipt or altered source identity is refused',t=>{
 const root=tinyArea(t),f=writeTinySingleton(path.join(root,'runtime/output'));f.receipt.packageDigest='a'.repeat(64);writeFixture(path.join(f.directory,'single-worker-receipt.json'),f.receipt);artifactInventory(f.directory,{kind:SINGLETON_KIND,dealer:f.client,status:'passed'});assert.throws(()=>verifyFleetSingletonDirectory(f.directory),/fleet singleton/);
 for(const field of ['sourceCommit','sourceTree','inputDigest','sourceReleases']){const expected={sourceCommit:'1',sourceTree:'2',inputDigest:'3',sourceReleases:{a:'x'}};assert.throws(()=>validateCiSourceIdentity({...expected,[field]:'wrong'},expected),new RegExp(field));}
});
test('CI requires main push, exact checkout, proper Node and absent Cloudflare credentials',()=>{
 const env={GITHUB_ACTIONS:'true',GITHUB_EVENT_NAME:'push',GITHUB_REPOSITORY:'darkapoparka/cars',GITHUB_REF:'refs/heads/main',GITHUB_SHA:'4'.repeat(40),GITHUB_RUN_ID:'12345',GITHUB_RUN_ATTEMPT:'1'};
 const opts={env,platform:'linux',version:'v26.10.0',gitRead:(_r,args)=>args[0]==='rev-parse'?env.GITHUB_SHA:'https://github.com/darkapoparka/cars.git'};
 assert.equal(assertCiContext(opts).sourceCommit,env.GITHUB_SHA);
 for(const change of [{GITHUB_REF:'refs/heads/other'},{GITHUB_EVENT_NAME:'pull_request'},{CLOUDFLARE_API_TOKEN:'fixture-secret'}])assert.throws(()=>assertCiContext({...opts,env:{...env,...change}}),/CI|credentials/);
 assert.throws(()=>assertCiContext({...opts,version:'v22.23.2'}),/context/);
});
test('only current seven targets and explicit dated composition approval are accepted',t=>{
 const root=tinyArea(t),inputRoot=path.join(root,'runtime/inputs');writeTinyNativeInputs(inputRoot);
 const inputs=nativeInputDirectories(inputRoot,'navara-car','12345','1'),{inspected,identity}=inspectSingleWorkerInputs({inputs,expectedDealer:'navara-car'}),f=writeTinySingleton(path.join(root,'runtime/unused'));
 const expected={sourceCommit:identity.sourceCommit,sourceTree:identity.sourceTree,inputDigest:identity.inputDigest,sourceReleases:identity.sourceReleases},args={slug:f.client,inputs,inspected,identity,registry:f.registry,sourceIdentity:expected};
 assert.throws(()=>createCiCompositionReview({...args,request:{}}),/dated/);
 assert.equal(createCiCompositionReview({...args,request:{composition:{reviewed:true,reviewedAt:'2026-10-11T08:00:00Z'}}}).inputs.app.compiledDigest,inspected.app.deploy.compiledDigest);
 fs.mkdirSync(path.join(inputRoot,'foreign'));assert.throws(()=>nativeInputDirectories(inputRoot,f.client,'12345','1'),/seven/);
});
test('CI orchestration delegates seven verified inputs and uploads only a sealed singleton',async t=>{
 const root=tinyArea(t),inputRoot=path.join(root,'runtime/inputs'),out=path.join(root,'runtime/assembly/output');writeTinyNativeInputs(inputRoot);
 const record={slug:'navara-car',repository:'darkapoparka/cars-navaracar',variants:[{key:'modern',base:'/variant-2',entry:'/variant-2/cars'}]},registry={dealers:[record]},request={schemaVersion:1,dealers:[record.slug],composition:{reviewed:true,reviewedAt:'2026-10-11T08:00:00Z'}};
 let composed=0,dryRuns=0;
 const result=await assembleFleetCi({slug:record.slug,inputRoot,destination:out,root,registry,request,leads:[{slug:record.slug,proposedRepository:record.repository}],
  ciCheck:()=>({sourceCommit:'4'.repeat(40),runId:'12345',attempt:'1'}),sourceIdentity:async()=>({sourceCommit:'4'.repeat(40),sourceTree:'5'.repeat(40),inputDigest:'6'.repeat(64),sourceReleases:fixtureReleases()}),
  compose:options=>{composed++;assert.equal(options.write,true);const review=json(options.inputsFile),f=writeTinySingleton(options.out);f.receipt.artifacts=Object.fromEntries(Object.entries(review.inputs).map(([k,p])=>[k,{digest:p.artifactDigest,compiledDigest:p.compiledDigest}]));f.composition.artifacts=review.inputs;
   writeFixture(path.join(options.out,'single-worker-receipt.json'),f.receipt);writeFixture(path.join(options.out,'dealer-composition-review.json'),f.composition);return {};},
  dryRun:()=>{dryRuns++;return {wranglerVersion:'4.149.0',esbuildVersion:'0.28.2',dryRun:true};}});
 assert.equal(composed,1);assert.equal(dryRuns,1);assert.equal(result.workerCount,1);assert.deepEqual(result.serviceBindings,[]);assert.equal(result.deploymentPerformed,false);assert(verifyFleetSingletonDirectory(out).inventory.files.every(r=>!r.path.startsWith('inputs/')&&!r.path.includes('node_modules')));
});
test('workflow triggers only bounded request pushes on main and preserves credential-free seven-to-one assembly',()=>{
 const yaml=fs.readFileSync(new URL('../.github/workflows/existing-fleet-cloudflare.yml',import.meta.url),'utf8');
 assert.match(yaml,/branches: \[main\]/);assert.match(yaml,/paths: \[docs\/releases\/cloudflare-existing25-20261011\/build-request\.json\]/);assert.doesNotMatch(yaml,/workflow_dispatch|secrets\.|CLOUDFLARE_API_TOKEN|existing-cf-delivery-/);
 assert.match(yaml,/ref: \$\{\{ github\.sha \}\}/);assert.match(yaml,/\/docs\/DEPLOYMENT-INVENTORY\.json/);assert.match(yaml,/assemble-existing-fleet-single-worker\.mjs/);assert.match(yaml,/name: existing-cf-single-worker-.*github\.run_attempt/);assert.match(yaml,/compression-level: 6/);
 assert.match(yaml,/sparse-checkout: \|\s*\/scripts\/\s*\/\.github\/workflows\/existing-fleet-cloudflare\.yml/);
});

function resealStaticSingleton(f){
 const files=filesAt(f.directory,{filter:()=>true}).filter(name=>!['artifact-manifest.json','single-worker-receipt.json','dealer-composition-review.json','delivery-receipt.json'].includes(name)).map(name=>{const bytes=fs.readFileSync(path.join(f.directory,name));return {path:name,bytes:bytes.length,sha256:sha256(bytes)};});
 f.receipt.files=files;f.receipt.outputDigest=sha256(JSON.stringify(files));f.receipt.serverBytes=files.filter(row=>row.path.startsWith('server/')).reduce((sum,row)=>sum+row.bytes,0);f.receipt.assetFiles=files.filter(row=>row.path.startsWith('public/')).length;f.composition.outputDigest=f.receipt.outputDigest;f.delivery.outputDigest=f.receipt.outputDigest;
 writeFixture(path.join(f.directory,'single-worker-receipt.json'),f.receipt);writeFixture(path.join(f.directory,'dealer-composition-review.json'),f.composition);writeFixture(path.join(f.directory,'delivery-receipt.json'),f.delivery);artifactInventory(f.directory,{kind:SINGLETON_KIND,dealer:f.client,status:'passed'});
}
function sealedServicesFixture(f,mount='/variant-2'){
 const original='export function resolveCarsNativePreferences(input){return input;}\n',resolver='import {frameworkGlobal} from "./framework-globals.mjs";\n'+original;
 const headers=(locale,kind)=>({'cache-control':'private, no-store','cdn-cache-control':'no-store','vercel-cdn-cache-control':'no-store','content-language':locale,'content-type':kind==='rsc'?'text/x-component':'text/html; charset=utf-8',vary:'RSC, Next-Router-State-Tree, Next-Router-Prefetch, Next-Router-Segment-Prefetch, Next-Url, X-Vinext-Interception-Context, X-Vinext-Interception-Id, X-Vinext-Mounted-Slots, X-Vinext-Rsc-Render-Mode, X-Vinext-Rsc-State-Fingerprint',
  'content-security-policy':"default-src 'self'; script-src 'self' 'unsafe-inline'",'cross-origin-opener-policy':'same-origin','cross-origin-resource-policy':'same-origin','origin-agent-cluster':'?1','referrer-policy':'no-referrer','strict-transport-security':'max-age=31536000; includeSubDomains','x-content-type-options':'nosniff','x-dns-prefetch-control':'off','x-download-options':'noopen','x-frame-options':'SAMEORIGIN','x-permitted-cross-domain-policies':'none','x-xss-protection':'0',
  ...(kind==='rsc'?{'x-vinext-params':encodeURIComponent(JSON.stringify({locale})),'x-vinext-rendered-path-and-search':encodeURIComponent('/'+locale+'/services'),'x-vinext-rsc-build-id':'fixture-build','x-vinext-rsc-compatibility-id':'fixture-compatibility'}:{link:'</fixture.woff2>; rel=preload; as=font'})});
 const routes=['en','bg'].map(locale=>{const route={locale,pathname:mount+'/'+locale+'/services'};for(const kind of ['html','rsc']){const body=kind==='html'?'<html lang="'+locale+'"><body>Native Services '+locale+'</body></html>':'0:{"locale":"'+locale+'"}\n';route[kind]={path:'/_cars/private/modern/'+sha256(body)+'.'+kind,bytes:Buffer.byteLength(body),sha256:sha256(body),headers:headers(locale,kind)};writeFixture(path.join(f.directory,'public'+route[kind].path),body);}return route;});
 const manifest={schemaVersion:2,kind:'cars-modern-services-static-experiment',mount,routes,responsePolicy:{vinextVersion:'1.1.0',sourceTree:f.receipt.sourceTree,producerSha256:sha256(original),identities:{buildId:'fixture-build',compatibilityId:'fixture-compatibility',deploymentId:null}}};
 writeFixture(path.join(f.directory,'server/modern/cars-free-services.json'),manifest);writeFixture(path.join(f.directory,'server/modern/cars-native-preferences.js'),resolver);writeFixture(path.join(f.directory,'server/modern-free-static-runtime.mjs'),fs.readFileSync(new URL('./lib/modern-free-static-runtime.mjs',import.meta.url)));writeFixture(path.join(f.directory,'server/worker.mjs'),singleWorkerSource(manifest));f.config.assets.run_worker_first=['/_cars/private/modern/*','/_vinext/static-cache/*'];writeFixture(path.join(f.directory,'wrangler.json'),f.config);
 f.receipt.changes=[{path:'server/modern/cars-native-preferences.js',sourcePath:'compiled/modern/apps/web/dist/server/cars-native-preferences.js',beforeSha256:sha256(original),afterSha256:sha256(resolver),method:'AST-defined private globals; identifiers retained without keepNames helpers so serialized inline functions remain self-contained'}];resealStaticSingleton(f);return {manifest,resolver};
}
test('sealed Services opt-in accepts the exact generated six-handler entry and two-path private asset guard',t=>{
 for(const second of ['modern','import']){const root=tinyArea(t),f=writeTinySingleton(path.join(root,'runtime/output'),{second}),s=sealedServicesFixture(f,second==='modern'?'/variant-2':'/variant-3');assert.equal(verifyFleetSingletonDirectory(f.directory).receipt.applicationCount,6);assert.deepEqual(f.receipt.composition.serviceBindings,[]);assert.equal(fs.readFileSync(path.join(f.directory,'server/worker.mjs'),'utf8'),singleWorkerSource(s.manifest));assert.equal(f.receipt.hostedVerified,false);}
});
test('resealed Services admission rejects false source/resolver/runtime/assets and widened config or entry',async t=>{
 const cases=[
  ['source tree',(f,s)=>{s.manifest.responsePolicy.sourceTree='9'.repeat(40);writeFixture(path.join(f.directory,'server/modern/cars-free-services.json'),s.manifest);},/source tree differs/],
  ['selected mount',(f,s)=>{f.composition.variants.find(row=>row.key==='modern').base='/variant-3';},/mount differs/],
  ['raw producer',(f,s)=>{s.manifest.responsePolicy.producerSha256='9'.repeat(64);writeFixture(path.join(f.directory,'server/modern/cars-free-services.json'),s.manifest);},/resolver transform differs/],
  ['missing transform',f=>{f.receipt.changes=[];},/resolver transform differs/],
  ['foreign transform source',f=>{f.receipt.changes[0].sourcePath='compiled/other/cars-native-preferences.js';},/resolver transform differs/],
  ['transformed resolver hash',f=>{f.receipt.changes[0].afterSha256='9'.repeat(64);},/resolver transform differs/],
  ['duplicate transform',f=>{f.receipt.changes.push({...f.receipt.changes[0]});},/resolver transform differs/],
  ['runtime source',f=>fs.appendFileSync(path.join(f.directory,'server/modern-free-static-runtime.mjs'),'\n// changed'),/runtime source differs/],
  ['snapshot body',(f,s)=>writeFixture(path.join(f.directory,'public'+s.manifest.routes[0].html.path),'different original body'),/four sealed/],
  ['extra private snapshot',f=>writeFixture(path.join(f.directory,'public/_cars/private/modern/'+('9'.repeat(64))+'.html'),'other'),/four sealed/],
  ['unscoped cache',f=>writeFixture(path.join(f.directory,'public/_vinext/static-cache/index.json'),'{}'),/Unscoped/],
  ['broad worker-first',f=>{f.config.assets.run_worker_first=true;writeFixture(path.join(f.directory,'wrangler.json'),f.config);},/configuration differs/],
  ['extra protected route',f=>{f.config.assets.run_worker_first.push('/variant-2/*');writeFixture(path.join(f.directory,'wrangler.json'),f.config);},/configuration differs/],
  ['ordinary entry',f=>writeFixture(path.join(f.directory,'server/worker.mjs'),singleWorkerSource()),/entry is not/],
  ['extra entry dispatcher',f=>fs.appendFileSync(path.join(f.directory,'server/worker.mjs'),'\nexport const foreignRoute=true;'),/entry is not/],
 ];
 for(const [name,mutate,pattern]of cases)await t.test(name,t=>{const root=tinyArea(t),f=writeTinySingleton(path.join(root,'runtime/output')),s=sealedServicesFixture(f);mutate(f,s);resealStaticSingleton(f);assert.throws(()=>verifyFleetSingletonDirectory(f.directory),pattern);});
});
test('ordinary singleton keeps byte-identical dispatch and refuses unmarked reserved static outputs',t=>{
 const root=tinyArea(t),f=writeTinySingleton(path.join(root,'runtime/output'));assert.equal(fs.readFileSync(path.join(f.directory,'server/worker.mjs'),'utf8'),singleWorkerSource());assert.equal(verifyFleetSingletonDirectory(f.directory).config.assets.run_worker_first,false);
 writeFixture(path.join(f.directory,'public/_cars/private/modern/'+('9'.repeat(64))+'.html'),'unmarked');resealStaticSingleton(f);assert.throws(()=>verifyFleetSingletonDirectory(f.directory),/Unmarked/);
});

import {createCanonicalComposition,canonicalCompositionEntry,CANONICAL_ORIGINAL_WORKER_PATH} from './publishing/canonical-origin-wrapper.mjs';

function wrappedTinySingleton(t){
 const f=writeTinySingleton(path.join(tinyArea(t),'runtime/output'));
 const composition=createCanonicalComposition({canonicalOrigin:'https://explicit-reviewed.webpreviews.site',ukDefault:false},{providerOrigin:f.publicOrigin,toolRevision:f.receipt.sourceCommit,variants:f.composition.variants});
 writeFixture(path.join(f.directory,CANONICAL_ORIGINAL_WORKER_PATH),fs.readFileSync(path.join(f.directory,'server/worker.mjs')));
 writeFixture(path.join(f.directory,'server/worker.mjs'),canonicalCompositionEntry(composition));
 for(const receipt of [f.receipt,f.composition,f.delivery])receipt.canonicalComposition=composition;
 resealStaticSingleton(f);return f;
}
test('canonical wrapper v2, exact original router and one tuple across sealed receipts are required',t=>{
 const f=wrappedTinySingleton(t),sealed=verifyFleetSingletonDirectory(f.directory);
 assert.deepEqual(sealed.receipt.canonicalComposition,sealed.delivery.canonicalComposition);
 assert.equal(sealed.receipt.publicOrigin,f.publicOrigin);assert.notEqual(sealed.receipt.publicOrigin,sealed.receipt.canonicalComposition.canonicalOrigin);
 assert(sealed.inventory.files.some(row=>row.path===CANONICAL_ORIGINAL_WORKER_PATH));
 for(const mode of ['wrapper','original','tuple','missing-marker','tool-revision']){
  const g=wrappedTinySingleton(t);
  if(mode==='wrapper')writeFixture(path.join(g.directory,'server/worker.mjs'),singleWorkerSource());
  if(mode==='original')writeFixture(path.join(g.directory,CANONICAL_ORIGINAL_WORKER_PATH),'export default {};');
  if(mode==='tuple')g.delivery.canonicalComposition={...g.delivery.canonicalComposition,canonicalOrigin:'https://foreign.webpreviews.site'};
  if(mode==='missing-marker')for(const value of [g.receipt,g.composition,g.delivery])delete value.canonicalComposition;
  if(mode==='tool-revision')for(const value of [g.receipt,g.composition,g.delivery])value.canonicalComposition={...value.canonicalComposition,toolRevision:'a'.repeat(40)};
  resealStaticSingleton(g);assert.throws(()=>verifyFleetSingletonDirectory(g.directory),/canonical|Canonical|original router|tool revision/);
 }
});
test('CI canonical origin comes only from an explicit reviewed per-dealer composition selection',t=>{
 const root=tinyArea(t),inputs=writeTinyNativeInputs(path.join(root,'runtime/inputs')),{inspected,identity}=inspectSingleWorkerInputs({inputs,expectedDealer:'navara-car'}),f=writeTinySingleton(path.join(root,'runtime/unused'));
 const args={slug:f.client,inputs,inspected,identity,registry:f.registry,sourceIdentity:{sourceCommit:identity.sourceCommit,sourceTree:identity.sourceTree,inputDigest:identity.inputDigest,sourceReleases:identity.sourceReleases}};
 const request={dealers:[f.client],composition:{reviewed:true,reviewedAt:'2026-10-14T08:00:00Z',canonicalCompositions:{[f.client]:{canonicalOrigin:'https://deliberately-different.webpreviews.site',ukDefault:false}}}};
 const review=createCiCompositionReview({...args,request});assert.equal(review.canonicalComposition.canonicalOrigin,'https://deliberately-different.webpreviews.site');assert.equal(review.canonicalComposition.toolRevision,identity.sourceCommit);
 for(const canonicalCompositions of [{foreign:{canonicalOrigin:'https://foreign.webpreviews.site',ukDefault:false}},{[f.client]:{canonicalOrigin:'https://*.webpreviews.site',ukDefault:false}},{[f.client]:{canonicalOrigin:'https://dealer.example',ukDefault:false}},{[f.client]:{canonicalOrigin:'https://exact.webpreviews.site'}}])assert.throws(()=>createCiCompositionReview({...args,request:{...request,composition:{...request.composition,canonicalCompositions}}}),/Canonical|canonical|fields/);
 const plain=createCiCompositionReview({...args,request:{composition:{reviewed:true,reviewedAt:request.composition.reviewedAt}}});assert.equal(plain.canonicalComposition,undefined);
});

