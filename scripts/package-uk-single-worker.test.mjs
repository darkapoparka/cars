import test from 'node:test';import assert from 'node:assert/strict';import {createRequire} from 'node:module';
import fs from 'node:fs';import os from 'node:os';import path from 'node:path';import {createHash} from 'node:crypto';
import {artifactInventory} from './lib/uk-cloudflare-artifacts.mjs';
import {planSixDesignSelection} from './lib/six-design-release.mjs';
import {createDealerRouter} from './publishing/cloudflare-router.mjs';
import {headSwitcher} from './publishing/native-mounts.mjs';
import {scopedGlobalsSource,scopeCompiledModule,singleWorkerSource,inspectSingleWorkerInputs,inspectModernFreeStaticExperiment,packageUkSingleWorker} from './package-uk-single-worker.mjs';
const require=createRequire(process.env.CARS_ESBUILD_RESOLVE_FROM||import.meta.url),esbuild=require('esbuild');
const uri=(source,tag)=>'data:text/javascript;base64,'+Buffer.from(source+'\n// '+tag).toString('base64');
test('framework registries are separate while native constructors remain native',async()=>{
 const a=(await import(uri(scopedGlobalsSource(),'a'))).frameworkGlobal,b=(await import(uri(scopedGlobalsSource(),'b'))).frameworkGlobal;
 a.__vite_rsc_require__=()=>'A';b.__vite_rsc_require__=()=>'B';
 assert.equal(a.__vite_rsc_require__(),'A');assert.equal(b.__vite_rsc_require__(),'B');assert.equal(globalThis.__vite_rsc_require__,undefined);
 const key=Symbol.for('vinext.als.registry');a[key]=new Set([1]);assert.equal(b[key],globalThis[key]);assert.notEqual(a[key],b[key]);
 assert.equal(a.Response,Response);assert.equal(b.URL,URL);assert.equal(a.crypto,globalThis.crypto);assert.equal(a.globalThis,a);assert.equal(b.global,b);
 delete a.__vite_rsc_require__;assert.equal(a.__vite_rsc_require__,undefined);assert.equal(b.__vite_rsc_require__(),'B');
});
test('AST scoping rewrites only executable globals and retains client-script literals',async()=>{
 const source='globalThis.__vite_rsc_require__=()=>"modern";export const current=()=>__vite_rsc_require__();export const literal="globalThis.__vite_rsc_require__";';
 const scope=uri(scopedGlobalsSource(),'scope-modern'),output=scopeCompiledModule(source,scope,esbuild),module=await import(uri(output,'module-modern'));
 assert.equal(module.current(),'modern');assert.equal(module.literal,'globalThis.__vite_rsc_require__');assert.equal(globalThis.__vite_rsc_require__,undefined);
 const source2=source.replace('"modern"','"mobile"'),module2=await import(uri(scopeCompiledModule(source2,uri(scopedGlobalsSource(),'scope-mobile'),esbuild),'module-mobile'));
 assert.deepEqual(await Promise.all([Promise.resolve(module.current()),Promise.resolve(module2.current())]),['modern','mobile']);
});
test('one public router preserves six existing application bindings and their original request objects',()=>{
 const source=singleWorkerSource();for(const key of ['AUTO_BEST','MODERN','IMPORT','APP','MOBILE','KARENTO_BEST'])assert.ok(source.includes('CARS_'+key+':{fetch:r=>'));
 assert.equal((source.match(/\.fetch\(r,env,ctx\)/g)||[]).length,6);assert.ok(source.includes('router.fetch(request,bindings)'));assert.ok(!source.includes('new URL('));
});

test('generated entry is valid ECMAScript even for the Import design key',()=>{assert.doesNotThrow(()=>esbuild.transformSync(singleWorkerSource(),{format:'esm',target:'es2022'}));});

const keys=['auto-best','modern','import','app','mobile','karento-best','router'],fleetKind='existing-fleet-cloudflare-compiled-candidate';
const sha=value=>createHash('sha256').update(value).digest('hex');
function fixture(t,kind='existing-fleet',second='modern'){
 const parent=fs.realpathSync(os.tmpdir()),root=fs.mkdtempSync(path.join(parent,'cars-single-worker-test-'));
 t.after(()=>{const resolved=fs.realpathSync(root);assert.equal(path.dirname(resolved),parent);assert.ok(path.basename(resolved).startsWith('cars-single-worker-test-'));fs.rmSync(resolved,{recursive:true});});
 const sourceReleases=Object.fromEntries(keys.filter(key=>key!=='router').map(key=>[key,{repository:'darkapoparka/cars',revision:'a'.repeat(40),path:'templates/'+key,tree:'b'.repeat(40),digest:'c'.repeat(64)}]));
 const identity={sourceCommit:'d'.repeat(40),sourceTree:'e'.repeat(40),inputDigest:'f'.repeat(64),sourceReleases,accountId:'1'.repeat(32),publicOrigin:'https://cars-fixture.darkapoparka1.workers.dev',runId:'42',attempt:'1'};
 const inputs={};
 const variants=planSixDesignSelection([{key:'auto-best',base:'',entry:'/'},{key:second,base:'/variant-2',entry:second==='modern'?'/variant-2/cars':'/variant-2/'},{key:'carwow',base:'/variant-3',entry:'/variant-3/'}]).variants.map(row=>({...row,binding:'CARS_'+row.key.toUpperCase().replaceAll('-','_'),worker:'cars-fixture-'+(row.key==='karento-best'?'signature':row.key)}));
 const importMount=variants.find(row=>row.key==='import').base,modernMount=variants.find(row=>row.key==='modern').base;
 const write=(directory,name,value)=>{const absolute=path.join(directory,name);fs.mkdirSync(path.dirname(absolute),{recursive:true});fs.writeFileSync(absolute,typeof value==='string'?value:JSON.stringify(value));};
 for(const key of keys){
  const directory=path.join(root,key);inputs[key]=directory;fs.mkdirSync(directory);
  const isNext=['modern','app','mobile'].includes(key),mainPath=key==='router'?'compiled/cloudflare/router.mjs':isNext?'compiled/'+key+'/dist/server/index.js':'compiled/'+key+'/.cars-cloudflare/worker/index.js',assetPath='compiled/'+key+'/public',configPath='compiled/'+key+'/wrangler.json';
  write(directory,mainPath,key==='router'?'export default createDealerRouter('+JSON.stringify({variants,redirects:[]})+');':key==='import'?'export const logos={logoLight:"/dealer-brand/logo.webp",logoDark:"/dealer-brand/logo.webp"};export const app="'+importMount+'/_app";export default {fetch(){return new Response(logos.logoLight)}};':'export default {fetch(){return new Response("'+key+(key==='modern'?modernMount:'/')+'")}};');
  write(directory,assetPath+'/'+key+'.txt',key);write(directory,configPath,{});
  if(key==='import')write(directory,assetPath+importMount+'/_app/client.js','export const logos={logoLight:"/dealer-brand/logo.webp",logoDark:"/dealer-brand/logo.webp"};export const path="'+importMount+'/_app/client.js";');
  if(key==='modern')write(directory,assetPath+modernMount+'/_next/static/modern.js','export const mount="'+modernMount+'";');
  const files=[];const visit=(prefix='compiled')=>{for(const item of fs.readdirSync(path.join(directory,prefix),{withFileTypes:true})){const name=prefix+'/'+item.name;if(item.isDirectory())visit(name);else{const bytes=fs.readFileSync(path.join(directory,name));files.push({path:name,bytes:bytes.length,sha256:sha(bytes)});}}};visit();files.sort((a,b)=>a.path.localeCompare(b.path));
  const deploy={schemaVersion:1,dealer:'fixture',key,provider:'cloudflare',...identity,workerName:key==='router'?'cars-fixture':'cars-fixture-'+(key==='karento-best'?'signature':key),mainPath,assetPath,configPath,compiledFiles:files,compiledDigest:sha(JSON.stringify(files)),compiled:true,dryRun:true,hosted:false,credentialsIncluded:false,nativeApproval:false};
  if(kind==='existing-fleet')deploy.kind=fleetKind;
  else{delete deploy.sourceTree;delete deploy.inputDigest;delete deploy.sourceReleases;deploy.packageTree='2'.repeat(40);deploy.packageDigest='3'.repeat(64);deploy.payloadDigest='4'.repeat(64);deploy.sourcePayloadUnchanged=true;}
  write(directory,'deploy.json',deploy);
  write(directory,'receipts/source.json',{schemaVersion:1,dealer:'fixture',key,...identity,originalSourceUnchanged:true});
  write(directory,'receipts/build.json',{schemaVersion:1,status:'passed',dealer:'fixture',key,sourceCommit:identity.sourceCommit,workerName:deploy.workerName,compiledDigest:deploy.compiledDigest,runId:'42',attempt:'1',compiled:true,dryRun:true});
  artifactInventory(directory,{dealer:'fixture',key,kind:kind==='existing-fleet'?fleetKind:'compiled-worker',status:'passed'});
 }
 const reseal=key=>artifactInventory(inputs[key],{dealer:'fixture',key,kind:kind==='existing-fleet'?fleetKind:'compiled-worker',status:'passed'});
 const change=(key,name,mutate)=>{const file=path.join(inputs[key],name),data=JSON.parse(fs.readFileSync(file,'utf8'));mutate(data);write(inputs[key],name,data);reseal(key);};
 return {root,inputs,identity,change,reseal};
}
test('fleet inspection preserves its own immutable source schema and accepts equivalent release object order',t=>{
 const f=fixture(t);f.change('app','deploy.json',d=>d.sourceReleases=Object.fromEntries(Object.entries(d.sourceReleases).reverse()));
 const result=inspectSingleWorkerInputs({inputs:f.inputs,expectedDealer:'fixture'});
 assert.equal(result.inputKind,'existing-fleet');assert.equal(result.identity.inputDigest,f.identity.inputDigest);assert.equal(result.identity.packageDigest,undefined);assert.equal(Object.keys(result.inspected).length,7);
});
test('UK inspection keeps the original sealed package identity',t=>{
 const f=fixture(t,'uk'),result=inspectSingleWorkerInputs({inputs:f.inputs,expectedDealer:'fixture'});
 assert.equal(result.inputKind,'uk');assert.equal(result.identity.packageDigest,'3'.repeat(64));assert.equal(result.identity.sourceTree,undefined);
});
test('UK composition preserves its original receipt schema and raster-logo mapping',t=>{
 const f=fixture(t,'uk'),receipt=packageUkSingleWorker({inputs:f.inputs,destination:path.join(f.root,'composed'),expectedDealer:'fixture',esbuild});
 assert.equal(receipt.type,'cars-uk-single-worker-provider-package');assert.equal(receipt.packageTree,'2'.repeat(40));assert.equal(receipt.packageDigest,'3'.repeat(64));assert.equal(receipt.payloadDigest,'4'.repeat(64));assert.equal(receipt.sourceTree,undefined);assert.equal(receipt.inputDigest,undefined);
 const server=fs.readFileSync(path.join(f.root,'composed/server/import/index.mjs'),'utf8');assert.ok(server.includes('logo-on-light-20261011.webp'));assert.ok(server.includes('logo-on-dark-20261011.webp'));
});
test('fleet inspection rejects changed source, build, release, compiled and exposure receipts',async t=>{
 const cases=[
  ['source tree',(f)=>f.change('app','deploy.json',d=>d.sourceTree='9'.repeat(40)),/source receipt differs/],
  ['input digest',(f)=>{f.change('app','deploy.json',d=>d.inputDigest='9'.repeat(64));f.change('app','receipts/source.json',d=>d.inputDigest='9'.repeat(64));},/Mixed exact source packages: inputDigest/],
  ['release mismatch',(f)=>{f.change('app','deploy.json',d=>d.sourceReleases.modern.revision='9'.repeat(40));f.change('app','receipts/source.json',d=>d.sourceReleases.modern.revision='9'.repeat(40));},/Mixed exact source packages: sourceReleases/],
  ['missing release',(f)=>f.change('app','deploy.json',d=>delete d.sourceReleases.mobile),/Missing six exact source releases/],
  ['build failure',(f)=>f.change('app','receipts/build.json',d=>d.status='failed'),/build receipt differs/],
  ['changed original source',(f)=>f.change('app','receipts/source.json',d=>d.originalSourceUnchanged=false),/source receipt differs/],
  ['invented UK seal',(f)=>f.change('app','deploy.json',d=>d.packageDigest='9'.repeat(64)),/Invalid existing-fleet source schema/],
  ['wrong compiled digest',(f)=>f.change('app','deploy.json',d=>d.compiledDigest='9'.repeat(64)),/Changed compiled digest/],
  ['unsealed artifact bytes',(f)=>{const d=JSON.parse(fs.readFileSync(path.join(f.inputs.app,'deploy.json'),'utf8'));fs.appendFileSync(path.join(f.inputs.app,d.mainPath),'\n// changed without a new inventory');},/Artifact receipt bytes differ/],
  ['wrong compiled bytes',(f)=>{const d=JSON.parse(fs.readFileSync(path.join(f.inputs.app,'deploy.json'),'utf8'));fs.appendFileSync(path.join(f.inputs.app,d.mainPath),'\n// changed');f.reseal('app');},/Compiled inventory differs/],
  ['missing config',(f)=>f.change('app','deploy.json',d=>d.configPath='compiled/app/absent.json'),/Missing compiled entry/],
  ['wrong public Worker',(f)=>{f.change('app','deploy.json',d=>d.workerName='other-app');f.change('app','receipts/build.json',d=>d.workerName='other-app');},/Wrong design Worker identity/],
  ['wrong workflow run',(f)=>f.change('app','receipts/build.json',d=>d.runId='43'),/build receipt differs/],
  ['wrong origin',(f)=>f.change('router','deploy.json',d=>d.publicOrigin='https://other.darkapoparka1.workers.dev'),/Public origin differs/]
 ];
 for(const [name,mutate,pattern] of cases)await t.test(name,t=>{const f=fixture(t);mutate(f);assert.throws(()=>inspectSingleWorkerInputs({inputs:f.inputs,expectedDealer:'fixture'}),pattern);});
});
test('UK and fleet receipts cannot be mixed or substituted with missing input sets',t=>{
 const f=fixture(t),uk=fixture(t,'uk');assert.throws(()=>inspectSingleWorkerInputs({inputs:{...f.inputs,app:uk.inputs.app},expectedDealer:'fixture'}),/Mixed or unsupported/);
 const missing={...f.inputs};delete missing.mobile;assert.throws(()=>inspectSingleWorkerInputs({inputs:missing,expectedDealer:'fixture'}),/Exactly six/);
});
test('composition emits one Worker and fleet source seals while retaining fleet Import logo paths',t=>{
 const f=fixture(t),receipt=packageUkSingleWorker({inputs:f.inputs,destination:path.join(f.root,'composed'),expectedDealer:'fixture',esbuild});
 assert.equal(receipt.type,'cars-existing-fleet-single-worker-provider-package');assert.equal(receipt.inputDigest,f.identity.inputDigest);assert.deepEqual(receipt.sourceReleases,f.identity.sourceReleases);assert.equal(receipt.packageDigest,undefined);assert.equal(receipt.workerCount,1);assert.equal(receipt.applicationCount,6);assert.deepEqual(receipt.composition.serviceBindings,[]);
 const config=JSON.parse(fs.readFileSync(path.join(f.root,'composed/wrangler.json'),'utf8'));assert.equal(config.name,'cars-fixture');assert.equal(config.services,undefined);
 const server=fs.readFileSync(path.join(f.root,'composed/server/import/index.mjs'),'utf8'),client=fs.readFileSync(path.join(f.root,'composed/public/variant-3/_app-uk-brand-20261011/client.js'),'utf8');
 for(const source of [server,client]){assert.ok(source.includes('/dealer-brand/logo.webp'));assert.ok(!source.includes('logo-on-light-20261011'));}
 assert.equal(inspectSingleWorkerInputs({inputs:f.inputs,expectedDealer:'fixture'}).identity.inputDigest,f.identity.inputDigest);
});
test('composition rejects mismatched inputs before creating its destination',t=>{
 const f=fixture(t);f.change('app','receipts/source.json',d=>d.originalSourceUnchanged=false);const destination=path.join(f.root,'refused');assert.throws(()=>packageUkSingleWorker({inputs:f.inputs,destination,expectedDealer:'fixture',esbuild}),/source receipt differs/);assert.equal(fs.existsSync(destination),false);
});

test('Import-first composition namespaces variant-2 assets while preserving Modern at variant-3',t=>{
 const f=fixture(t,'existing-fleet','import'),destination=path.join(f.root,'composed');packageUkSingleWorker({inputs:f.inputs,destination,expectedDealer:'fixture',esbuild});
 const server=fs.readFileSync(path.join(destination,'server/import/index.mjs'),'utf8'),client=fs.readFileSync(path.join(destination,'public/variant-2/_app-uk-brand-20261011/client.js'),'utf8');
 assert(server.includes('/variant-2/_app-uk-brand-20261011'));assert(client.includes('/variant-2/_app-uk-brand-20261011/client.js'));
 assert(!fs.existsSync(path.join(destination,'public/variant-2/_app/client.js')));assert(!fs.existsSync(path.join(destination,'public/variant-3/_app-uk-brand-20261011/client.js')));
 assert(fs.readFileSync(path.join(destination,'server/modern/index.js'),'utf8').includes('modern/variant-3'));assert(fs.readFileSync(path.join(destination,'public/variant-3/_next/static/modern.js'),'utf8').includes('/variant-3'));
 assert(fs.existsSync(path.join(f.inputs.import,'compiled/import/public/variant-2/_app/client.js')));assert.equal(inspectSingleWorkerInputs({inputs:f.inputs,expectedDealer:'fixture'}).identity.inputDigest,f.identity.inputDigest);
});

function addModernServices(f,mount='/variant-2'){
 const directory=f.inputs.modern,deployFile=path.join(directory,'deploy.json'),deploy=JSON.parse(fs.readFileSync(deployFile,'utf8')),server=deploy.mainPath.slice(0,-'index.js'.length);
 const write=(name,value)=>{const file=path.join(directory,name);fs.mkdirSync(path.dirname(file),{recursive:true});fs.writeFileSync(file,value);};
 const resolver='export function resolveCarsNativePreferences({locale,returnTo}){return {state:{locale,country:"BG",suggestedCountry:"BG",promptDismissed:false,source:"default"},returnTo};}\n';
 const nativeVary='RSC, Next-Router-State-Tree, Next-Router-Prefetch, Next-Router-Segment-Prefetch, Next-Url, X-Vinext-Interception-Context, X-Vinext-Interception-Id, X-Vinext-Mounted-Slots, X-Vinext-Rsc-Render-Mode, X-Vinext-Rsc-State-Fingerprint';
 const policy=(locale,kind)=>({
  'cache-control':'private, no-store','cdn-cache-control':'no-store','vercel-cdn-cache-control':'no-store','content-language':locale,'content-type':kind==='rsc'?'text/x-component':'text/html; charset=utf-8',vary:nativeVary,
  'content-security-policy':"default-src 'self'; script-src 'self' 'unsafe-inline'",'cross-origin-opener-policy':'same-origin','cross-origin-resource-policy':'same-origin','origin-agent-cluster':'?1','referrer-policy':'no-referrer','strict-transport-security':'max-age=31536000; includeSubDomains',
  'x-content-type-options':'nosniff','x-dns-prefetch-control':'off','x-download-options':'noopen','x-frame-options':'SAMEORIGIN','x-permitted-cross-domain-policies':'none','x-xss-protection':'0',
  ...(kind==='rsc'?{'x-vinext-params':encodeURIComponent(JSON.stringify({locale})),'x-vinext-rendered-path-and-search':encodeURIComponent('/'+locale+'/services'),'x-vinext-rsc-build-id':'fixture-build','x-vinext-rsc-compatibility-id':'fixture-compatibility'}:{link:'</native-fixture.woff2>; rel=preload; as=font'}),
 });
 const routes=['en','bg'].map(locale=>{
  const bodies={html:'<html lang="'+locale+'"><head><script type="application/json" id="cars-modern-native-preferences">null</script></head><body>Native Services '+locale+'</body></html>',rsc:'0:{"nativeServices":"'+locale+'"}\n'};
  const nativeHead=new Map([['fixture/app.html',Buffer.from(bodies.html)]]);headSwitcher(nativeHead,'fixture/app.html');bodies.html=nativeHead.get('fixture/app.html').toString();
  const row={locale,pathname:mount+'/'+locale+'/services'};
  for(const kind of ['html','rsc']){const body=bodies[kind];row[kind]={path:'/_cars/private/modern/'+sha(body)+'.'+kind,bytes:Buffer.byteLength(body),sha256:sha(body),headers:policy(locale,kind)};write(deploy.assetPath+row[kind].path,body);}return row;
 });
 const manifest={schemaVersion:2,kind:'cars-modern-services-static-experiment',mount,routes,responsePolicy:{vinextVersion:'1.1.0',sourceTree:deploy.sourceTree,producerSha256:sha(resolver),identities:{buildId:'fixture-build',compatibilityId:'fixture-compatibility',deploymentId:null}}};
 write(server+'cars-free-services.json',JSON.stringify(manifest));
 write(server+'cars-native-preferences.js',resolver);
 deploy.freeStaticExperiment={manifestPath:server+'cars-free-services.json',resolverPath:server+'cars-native-preferences.js'};
 fs.writeFileSync(deployFile,JSON.stringify(deploy));
 const reseal=()=>{
  const current=JSON.parse(fs.readFileSync(deployFile,'utf8')),files=[];
  const visit=(prefix='compiled')=>{for(const item of fs.readdirSync(path.join(directory,prefix),{withFileTypes:true})){const name=prefix+'/'+item.name;if(item.isDirectory())visit(name);else{const b=fs.readFileSync(path.join(directory,name));files.push({path:name,bytes:b.length,sha256:sha(b)});}}};visit();files.sort((a,b)=>a.path.localeCompare(b.path));
  current.compiledFiles=files;current.compiledDigest=sha(JSON.stringify(files));fs.writeFileSync(deployFile,JSON.stringify(current));
  const buildFile=path.join(directory,'receipts/build.json'),build=JSON.parse(fs.readFileSync(buildFile,'utf8'));build.compiledDigest=current.compiledDigest;fs.writeFileSync(buildFile,JSON.stringify(build));f.reseal('modern');
 };
 reseal();return {manifest,deploy,write,reseal};
}

test('explicit sealed Modern Services experiment preserves all six native handlers and emits private snapshot guard only when opted in',t=>{
 const f=fixture(t),s=addModernServices(f),destination=path.join(f.root,'composed'),receipt=packageUkSingleWorker({inputs:f.inputs,destination,expectedDealer:'fixture',esbuild});
 assert.equal(receipt.applicationCount,6);assert.equal(receipt.workerCount,1);assert.deepEqual(receipt.composition.serviceBindings,[]);assert.equal(receipt.hostedVerified,false);
 const worker=fs.readFileSync(path.join(destination,'server/worker.mjs'),'utf8');assert(worker.includes('modernStatic.fetch(request,env)'));for(const family of ['AUTO_BEST','MODERN','IMPORT','APP','MOBILE','KARENTO_BEST'])assert(worker.includes('CARS_'+family+':{fetch:'+(family==='MODERN'?'async r=>':'r=>')));
 assert.doesNotThrow(()=>esbuild.transformSync(worker,{format:'esm',target:'es2022'}));assert(fs.existsSync(path.join(destination,'server/modern/cars-native-preferences.js')));assert(fs.existsSync(path.join(destination,'server/modern-free-static-runtime.mjs')));
 const config=JSON.parse(fs.readFileSync(path.join(destination,'wrangler.json'),'utf8'));assert.deepEqual(config.assets.run_worker_first,['/_cars/private/modern/*','/_vinext/static-cache/*']);
 for(const route of s.manifest.routes)for(const kind of ['html','rsc'])assert.equal(sha(fs.readFileSync(path.join(destination,'public'+route[kind].path))),route[kind].sha256);
 assert.equal(inspectModernFreeStaticExperiment(inspectSingleWorkerInputs({inputs:f.inputs,expectedDealer:'fixture'}).inspected,'/variant-2').routes.length,2);
});

test('static experiment supports preserved opposite Modern mount and rejects incomplete or unadmitted sealed outputs before composition',async t=>{
 const other=fixture(t,'existing-fleet','import');addModernServices(other,'/variant-3');assert.doesNotThrow(()=>packageUkSingleWorker({inputs:other.inputs,destination:path.join(other.root,'composed'),expectedDealer:'fixture',esbuild}));
 const cases=[
  ['no marker',s=>{const file=path.join(s.directory,'deploy.json'),d=JSON.parse(fs.readFileSync(file,'utf8'));delete d.freeStaticExperiment;fs.writeFileSync(file,JSON.stringify(d));},/Unadmitted private/],
  ['different response source tree',s=>s.write(s.deploy.freeStaticExperiment.manifestPath,JSON.stringify({...s.manifest,responsePolicy:{...s.manifest.responsePolicy,sourceTree:'9'.repeat(40)}})),/response source tree differs/],
  ['different compiled response producer',s=>s.write(s.deploy.freeStaticExperiment.manifestPath,JSON.stringify({...s.manifest,responsePolicy:{...s.manifest.responsePolicy,producerSha256:'9'.repeat(64)}})),/response producer differs/],
  ['wrong selected mount',s=>s.write(s.deploy.freeStaticExperiment.manifestPath,JSON.stringify({...s.manifest,mount:'/variant-3',routes:s.manifest.routes.map(r=>({...r,pathname:r.pathname.replace('/variant-2/','/variant-3/')}))})),/mount differs/],
  ['missing pure module',s=>fs.unlinkSync(path.join(s.directory,s.deploy.freeStaticExperiment.resolverPath)),/Missing bounded compiled/],
  ['changed snapshot bytes',s=>s.write(s.deploy.assetPath+s.manifest.routes[0].html.path,'changed'),/snapshot differs/],
  ['unscoped adapter cache',s=>s.write(s.deploy.assetPath+'/_vinext/static-cache/index.json','{}'),/Unscoped native/],
  ['extra private route',s=>s.write(s.deploy.assetPath+'/_cars/private/modern/'+sha('other')+'.html','other'),/Only four/]
 ];
 for(const [name,edit,pattern] of cases)await t.test(name,t=>{const f=fixture(t),s=addModernServices(f);s.directory=f.inputs.modern;edit(s);s.reseal();const destination=path.join(f.root,'refused');assert.throws(()=>packageUkSingleWorker({inputs:f.inputs,destination,expectedDealer:'fixture',esbuild}),pattern);assert.equal(fs.existsSync(destination),false);});
});

test('ordinary package contains no experiment runtime, private-cache admission or changed asset dispatch',t=>{
 const f=fixture(t),destination=path.join(f.root,'composed');packageUkSingleWorker({inputs:f.inputs,destination,expectedDealer:'fixture',esbuild});
 const config=JSON.parse(fs.readFileSync(path.join(destination,'wrangler.json'),'utf8'));assert.equal(config.assets.run_worker_first,false);assert.equal(fs.existsSync(path.join(destination,'server/modern-free-static-runtime.mjs')),false);assert.equal(fs.readFileSync(path.join(destination,'server/worker.mjs'),'utf8'),singleWorkerSource());
 assert.equal(inspectModernFreeStaticExperiment(inspectSingleWorkerInputs({inputs:f.inputs,expectedDealer:'fixture'}).inspected,'/variant-2'),null);
});


test('captured Services traverse the real dealer router and retain the native shared chrome, RSC policy and early private boundaries',async t=>{
 const f=fixture(t),s=addModernServices(f),variants=planSixDesignSelection([{key:'auto-best',base:'',entry:'/'},{key:'modern',base:'/variant-2',entry:'/variant-2/cars'},{key:'carwow',base:'/variant-3',entry:'/variant-3/'}]).variants.map(v=>({...v,binding:'CARS_'+v.key.toUpperCase().replaceAll('-','_')}));
 const routerUrl=uri('export default ('+createDealerRouter.toString()+')('+JSON.stringify({variants,redirects:[]})+');','real-dealer-router'),router=await import(routerUrl);
 const runtimeUrl=new URL('./lib/modern-free-static-runtime.mjs',import.meta.url).href;
 const observerUrl=uri('import {createModernFreeStaticRuntime as native,modernSnapshotRequest} from '+JSON.stringify(runtimeUrl)+';export {modernSnapshotRequest};export const calls=[];export function createModernFreeStaticRuntime(options){const runtime=native(options);return {fetch(request,env){calls.push({request,pathname:new URL(request.url).pathname,country:request.headers.get("x-cars-country"),vercelCountry:request.headers.get("x-vercel-ip-country")});return runtime.fetch(request,env);}};}','transparent-native-snapshot-observer'),observer=await import(observerUrl);
 const resolver=fs.readFileSync(path.join(f.inputs.modern,s.deploy.freeStaticExperiment.resolverPath),'utf8'),resolverUrl=uri(resolver,'fixture-native-resolver');
 let source=singleWorkerSource(s.manifest).replace('"./router.mjs"',JSON.stringify(routerUrl)).replace('"./modern-free-static-runtime.mjs"',JSON.stringify(observerUrl)).replace('"./modern/cars-native-preferences.js"',JSON.stringify(resolverUrl));
 const nativeModules={};for(const family of keys.filter(k=>k!=='router')){const tag=family.replaceAll('-','_'),nativeUrl=uri('export const calls=[];export default {fetch(request,env,ctx){calls.push({request,env,ctx});return new Response("original native '+family+'",{headers:{"content-type":"text/html"}});}};','fixture-native-'+family);nativeModules[family]=await import(nativeUrl);source=source.replace(JSON.stringify('./'+family+'/'+(['modern','app','mobile'].includes(family)?'index.js':'index.mjs')),JSON.stringify(nativeUrl));}
 const worker=(await import(uri(source,'owned-static-router-entry'))).default,assetCalls=[],env={ASSETS:{async fetch(request){const name=new URL(request.url).pathname;assetCalls.push(name);const asset=s.manifest.routes.flatMap(r=>[r.html,r.rsc]).find(a=>a.path===name||a.path.endsWith('.html')&&a.path.slice(0,-5)===name);assert.ok(asset);assert.equal(request.redirect,'manual');return new Response(fs.readFileSync(path.join(f.inputs.modern,s.deploy.assetPath+asset.path)));}}},ctx={passThroughOnException(){}};
 for(const route of s.manifest.routes){const request=new Request('https://dealer.example'+route.pathname,{headers:{'x-cars-country':'ZZ','x-vercel-ip-country':'ZZ'}});const response=await worker.fetch(request,env,ctx),html=await response.text();assert.equal(response.status,200);assert.equal(observer.calls.at(-1).request===request,false,'the actual router must clone/sanitize the ingress');assert.equal(observer.calls.at(-1).country,null);assert.equal(observer.calls.at(-1).vercelCountry,null);assert.equal((html.match(/preview-switcher\.js/g)||[]).length,1);assert.match(html,/<script defer src="\/preview-switcher\.js"><\/script>/);assert.match(html,/cars-modern-native-preferences/);assert.equal(response.headers.get('content-security-policy'),route.html.headers['content-security-policy']);assert.equal(response.headers.get('cache-control'),'private, no-store');assert.equal(response.headers.get('x-robots-tag'),'noindex, nofollow');
 const rscResponse=await worker.fetch(new Request('https://dealer.example'+route.pathname+'?_rsc=',{headers:{RSC:'1'}}),env,ctx),rsc=Buffer.from(await rscResponse.arrayBuffer());assert.equal(sha(rsc),route.rsc.sha256);assert.equal(rscResponse.headers.get('content-type'),'text/x-component');assert.equal(rscResponse.headers.get('cache-control'),'private, no-store');assert.equal(rsc.toString().includes('preview-switcher'),false);assert.equal(rscResponse.headers.get('x-vinext-rsc-build-id'),'fixture-build');}
 assert.equal(observer.calls.length,4);assert.equal(nativeModules.modern.calls.length,0);
 const assetCount=assetCalls.length;for(const pathname of ['/_cars/private/modern','/_cars/private/modern/alias','/_cars/private/modern/alias.html','/_vinext/static-cache','/_vinext/static-cache/alias.rsc']){const response=await worker.fetch(new Request('https://dealer.example'+pathname),env,ctx);assert.equal(response.status,404);assert.equal(response.headers.get('cache-control'),'private, no-store');assert.equal((await response.text()).includes('preview-switcher'),false);}assert.equal(assetCalls.length,assetCount);for(const family of Object.values(nativeModules))assert.equal(family.calls.length,0);
 const invalidBootstrap=await worker.fetch(new Request('https://dealer.example/_cars/native-preferences/modern?returnTo=https://evil.invalid'),env,ctx);assert.equal(invalidBootstrap.status,400);assert.equal(assetCalls.length,assetCount);
 const fallback=await worker.fetch(new Request('https://dealer.example/variant-2/en/services?ordinary=1'),env,ctx);assert.equal(await fallback.text(),'original native modern');assert.equal(nativeModules.modern.calls.length,1);assert.equal(nativeModules.modern.calls[0].ctx,ctx);assert.equal(new URL(nativeModules.modern.calls[0].request.url).search,'?ordinary=1');assert.equal(router.default.fetch instanceof Function,true);
});
