import test from 'node:test';import assert from 'node:assert/strict';import {createRequire} from 'node:module';
import fs from 'node:fs';import os from 'node:os';import path from 'node:path';import {createHash} from 'node:crypto';
import {artifactInventory} from './lib/uk-cloudflare-artifacts.mjs';
import {planSixDesignSelection} from './lib/six-design-release.mjs';
import {scopedGlobalsSource,scopeCompiledModule,singleWorkerSource,inspectSingleWorkerInputs,packageUkSingleWorker} from './package-uk-single-worker.mjs';
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
