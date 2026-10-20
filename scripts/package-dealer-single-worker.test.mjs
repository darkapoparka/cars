import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import {createHash} from 'node:crypto';
import {fileURLToPath} from 'node:url';
import {artifactInventory} from './lib/uk-cloudflare-artifacts.mjs';
import {planSixDesignSelection} from './lib/six-design-release.mjs';
import {COMPOSITION_KEYS,parseCompositionArgs,planDealerSingleWorker,runDealerSingleWorker,resolveExistingEsbuild} from './package-dealer-single-worker.mjs';

const ROOT=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..'),runtime=path.join(ROOT,'runtime');
const hash=b=>createHash('sha256').update(b).digest('hex');
const write=(file,value)=>{fs.mkdirSync(path.dirname(file),{recursive:true});fs.writeFileSync(file,typeof value==='string'?value:JSON.stringify(value,null,2)+'\n');};
const read=file=>JSON.parse(fs.readFileSync(file,'utf8'));
const sourceReleases=Object.fromEntries(COMPOSITION_KEYS.filter(k=>k!=='router').map(key=>[key,{repository:'darkapoparka/cars',revision:'1'.repeat(40),path:'templates/'+key,tree:'2'.repeat(40),digest:'3'.repeat(64)}]));
function fixture(t,{client='priselci',variant2='modern',repository='darkapoparka/cars-priselci',reviewed=true,independent=false}={}) {
 const area=fs.mkdtempSync(path.join(runtime,'single-worker-cli-test-'));
 t.after(()=>{
  const real=fs.realpathSync(area),relative=path.relative(fs.realpathSync(runtime),real);
  assert(relative&&relative.startsWith('single-worker-cli-test-')&&!relative.includes(path.sep)&&!path.isAbsolute(relative));
  fs.rmSync(real,{recursive:true,force:true});
 });
 const oldVariants=[{key:'auto-best',base:'',entry:'/'},{key:variant2,base:'/variant-2',entry:variant2==='modern'?'/variant-2/cars':'/variant-2/'},{key:'carwow',base:'/variant-3',entry:'/variant-3/'},{key:'app',base:'/variant-4',entry:'/variant-4/'}];
 const variants=planSixDesignSelection(oldVariants).variants,workerName=repository.split('/')[1],publicOrigin='https://'+workerName+'.darkapoparka1.workers.dev';
 const registry={dealers:[{slug:client,repository,variants:oldVariants,...(independent?{sourceOwnership:'independent-repository',canonicalSourceRepository:repository,localPath:null,checkoutPath:path.join(area,'clients',client)}:{canonicalSourceRepository:'darkapoparka/cars'})}]};
 const review={schemaVersion:1,client,repository,sourceRepository:independent?repository:'darkapoparka/cars',reviewed,reviewedAt:reviewed?'2026-10-11T08:00:00Z':null,publicOrigin,workerName,variants,inputs:{}};
 const routeVariants=variants.map(v=>({...v,binding:'CARS_'+v.key.toUpperCase().replaceAll('-','_'),worker:workerName+'-'+(v.key==='karento-best'?'signature':v.key)}));
 for(const key of COMPOSITION_KEYS) {
  const directory=path.join(area,'runtime','compiled',key),mainPath=key==='router'?'compiled/cloudflare/router.mjs':['modern','app','mobile'].includes(key)?'compiled/'+key+'/dist/server/index.js':'compiled/'+key+'/.cars-cloudflare/worker/index.js';
  write(path.join(directory,mainPath),key==='router'?'export default createDealerRouter('+JSON.stringify({variants:routeVariants,redirects:[]})+');\n':'export default {fetch(){return new Response("fixture");}};\n');
  const deploy={schemaVersion:1,kind:'existing-fleet-cloudflare-compiled-candidate',dealer:client,key,provider:'cloudflare',accountId:'cb0007f242077bd759331f096eb75531',workerName:key==='router'?workerName:routeVariants.find(v=>v.key===key).worker,publicOrigin,sourceCommit:'4'.repeat(40),sourceTree:'5'.repeat(40),inputDigest:'6'.repeat(64),sourceReleases,configPath:'compiled/deploy.json',mainPath,assetPath:'compiled/'+key+'/public',runId:'38095505261',attempt:'1',compiled:true,dryRun:true,hosted:false,credentialsIncluded:false,nativeApproval:false};
  write(path.join(directory,deploy.configPath),{name:deploy.workerName,main:path.posix.relative('compiled',mainPath),assets:{directory:key+'/public',binding:'ASSETS'}});
  write(path.join(directory,deploy.assetPath,'fixture.txt'),'fixture');
  const compiledFiles=[deploy.configPath,mainPath,deploy.assetPath+'/fixture.txt'].sort().map(name=>{const bytes=fs.readFileSync(path.join(directory,name));return {path:name,bytes:bytes.length,sha256:hash(bytes)};});
  const compiledDigest=hash(JSON.stringify(compiledFiles));Object.assign(deploy,{compiledFiles,compiledDigest});
  write(path.join(directory,'deploy.json'),deploy);
  write(path.join(directory,'receipts/source.json'),{schemaVersion:1,dealer:client,key,sourceCommit:deploy.sourceCommit,sourceTree:deploy.sourceTree,inputDigest:deploy.inputDigest,sourceReleases,originalSourceUnchanged:true,workerPrefix:workerName,publicOrigin,manifest:{slug:client,repository,variants},nativeApproval:false,hosted:false});
  write(path.join(directory,'receipts/build.json'),{schemaVersion:1,dealer:client,key,sourceCommit:deploy.sourceCommit,runId:deploy.runId,attempt:deploy.attempt,status:'passed',compiled:true,dryRun:true,compiledDigest,workerName:deploy.workerName,hosted:false});
  const inventory=artifactInventory(directory,{dealer:client,key,kind:deploy.kind,status:'passed'});
  review.inputs[key]={directory:path.relative(area,directory),artifactDigest:inventory.digest,compiledDigest};
 }
 const inputsFile=path.join(area,'reviewed-seven-targets.json');write(inputsFile,review);
 return {area,registry,review,inputsFile,out:path.join(area,'runtime','composed'),client,writeReview:()=>write(inputsFile,review),reseal:key=>{const directory=path.resolve(area,review.inputs[key].directory),d=read(path.join(directory,'deploy.json'));review.inputs[key].compiledDigest=d.compiledDigest;review.inputs[key].artifactDigest=artifactInventory(directory,{dealer:client,key,kind:d.kind,status:'passed'}).digest;write(inputsFile,review);}};
}
const options=f=>({client:f.client,inputsFile:f.inputsFile,out:f.out,root:f.area,registry:f.registry});

test('proposal verifies a sealed seven-target set without writing or resolving dependencies',t=>{
 const f=fixture(t);let writes=0;
 const plan=runDealerSingleWorker({...options(f),compose:()=>{writes++;},resolveEsbuild:()=>{throw Error('Proposal must not load build tools');}});
 assert.equal(plan.workerCount,1);assert.equal(plan.applicationCount,6);assert.equal(plan.compositionWritten,false);assert.equal(plan.builds,0);assert.equal(plan.deployments,0);assert.deepEqual(plan.serviceBindings,[]);assert.equal(writes,0);assert.equal(fs.existsSync(f.out),false);
});
test('Import-first and Excellent Cars retain their existing routes and repository identities',t=>{
 for(const config of [{variant2:'import'}, {client:'excellent-cars',repository:'darkapoparka/excellent-cars'}]) {
  const f=fixture(t,config),{plan}=planDealerSingleWorker(options(f));
  assert.equal(plan.variants[1].key,config.variant2||'modern');assert.equal(plan.variants[2].key,config.variant2==='import'?'modern':'import');assert.equal(plan.repository,config.repository||'darkapoparka/cars-priselci');assert.equal(plan.workerName,plan.repository.split('/')[1]);
 }
});
test('changed artifact bytes and stale reviewed digests are refused',t=>{
 const f=fixture(t),directory=path.resolve(f.area,f.review.inputs.app.directory);
 fs.appendFileSync(path.join(directory,'compiled/app/dist/server/index.js'),'// unexpected');
 assert.throws(()=>planDealerSingleWorker(options(f)),/differ|changed|inventory/i);
 const g=fixture(t);g.review.inputs.app.artifactDigest='9'.repeat(64);g.writeReview();assert.throws(()=>planDealerSingleWorker(options(g)),/reviewed digest/);
});
test('mixed source digests are refused even when the altered family is separately sealed',t=>{
 const f=fixture(t),directory=path.resolve(f.area,f.review.inputs.app.directory);
 for(const name of ['deploy.json','receipts/source.json']){const p=path.join(directory,name),v=read(p);v.inputDigest='a'.repeat(64);write(p,v);}f.reseal('app');
 assert.throws(()=>planDealerSingleWorker(options(f)),/mixed|source|identity|inputDigest/i);
});
test('original variant-2, exact public identity and six mounts cannot be relabelled by a review',t=>{
 const f=fixture(t);f.review.variants=planSixDesignSelection([{key:'auto-best',base:'',entry:'/'},{key:'import',base:'/variant-2',entry:'/variant-2/'},{key:'carwow',base:'/variant-3',entry:'/variant-3/'}]).variants;f.writeReview();assert.throws(()=>planDealerSingleWorker(options(f)),/variant-2/);
 const g=fixture(t);g.review.publicOrigin='https://another.darkapoparka1.workers.dev';g.writeReview();assert.throws(()=>planDealerSingleWorker(options(g)),/origin/);
 const h=fixture(t);h.review.variants[5].base='/variant-7';h.writeReview();assert.throws(()=>planDealerSingleWorker(options(h)),/mount|sixth/);
});
test('existing, outside-runtime and nested-input outputs are refused',t=>{
 const f=fixture(t);fs.mkdirSync(f.out);assert.throws(()=>planDealerSingleWorker(options(f)),/Fresh/);
 const g=fixture(t);assert.throws(()=>planDealerSingleWorker({...options(g),out:path.join(g.area,'source')}),/inside/);
 assert.throws(()=>planDealerSingleWorker({...options(g),out:path.resolve(g.area,g.review.inputs.app.directory,'new-output')}),/inside a reviewed/);
});
test('Al Reef cannot compose a Cars-owned source receipt',t=>{
 const f=fixture(t,{client:'al-reef-used-cars',repository:'darkapoparka/cars-alreefusedcars',independent:true});f.review.sourceRepository='darkapoparka/cars';f.writeReview();
 assert.throws(()=>planDealerSingleWorker(options(f)),/source repository.*ownership/);
});
test('independent composition verifies the source commit and tree in its own checkout',t=>{
 const f=fixture(t,{client:'al-reef-used-cars',repository:'darkapoparka/cars-alreefusedcars',independent:true}),checkout=path.join(f.area,'clients',f.client);
 fs.mkdirSync(path.join(checkout,'.git'),{recursive:true});
 const gitRead=(directory,args)=>{
  if(directory===f.area&&args[0]==='ls-files')return '';
  assert.equal(directory,checkout);
  if(args.join(' ')==='rev-parse --show-toplevel')return checkout;
  if(args.join(' ')==='remote get-url origin')return 'https://github.com/'+f.review.repository+'.git';
  if(args.join(' ')==='rev-parse '+'4'.repeat(40)+'^{commit}')return '4'.repeat(40);
  if(args.join(' ')==='rev-parse '+'4'.repeat(40)+'^{tree}')return '5'.repeat(40);
  throw Error('Unexpected Git read');
 };
 const {plan}=planDealerSingleWorker({...options(f),gitRead});assert.equal(plan.independentSource,true);assert.equal(plan.sourceRepository,f.review.repository);
 assert.throws(()=>planDealerSingleWorker({...options(f),gitRead:(directory,args)=>args[1]?.endsWith('^{tree}')?'7'.repeat(40):gitRead(directory,args)}),/source tree.*own repository/);
});
test('write requires a dated exact review and uses the existing composer once',t=>{
 const f=fixture(t,{reviewed:false});let calls=0;assert.throws(()=>runDealerSingleWorker({...options(f),write:true,compose:()=>{calls++;}}),/explicit dated review/);assert.equal(calls,0);assert.equal(fs.existsSync(f.out),false);
 const g=fixture(t),esbuild={version:'existing-fixture-tool'},result=runDealerSingleWorker({...options(g),write:true,resolveEsbuild:()=>esbuild,compose:args=>{
  calls++;assert.equal(args.expectedDealer,g.client);assert.equal(args.esbuild,esbuild);assert.equal(Object.keys(args.inputs).length,7);fs.mkdirSync(args.destination);
  return {workerName:g.review.workerName,publicOrigin:g.review.publicOrigin,sourceCommit:'4'.repeat(40),workerCount:1,outputDigest:'b'.repeat(64),artifacts:Object.fromEntries(COMPOSITION_KEYS.map(k=>[k,{digest:g.review.inputs[k].artifactDigest,compiledDigest:g.review.inputs[k].compiledDigest}]))};
 }});
 assert.equal(calls,1);assert.equal(result.compositionWritten,true);assert.equal(result.deployments,0);assert.equal(read(path.join(g.out,'dealer-composition-review.json')).reviewSha256,result.reviewSha256);
});
test('reviewed fixture composes six applications through the real existing provider',t=>{
 const f=fixture(t),esbuild=resolveExistingEsbuild(ROOT);
 const result=runDealerSingleWorker({...options(f),write:true,resolveEsbuild:()=>esbuild});
 const receipt=read(path.join(f.out,'single-worker-receipt.json')),config=read(path.join(f.out,'wrangler.json'));
 assert.equal(result.compositionWritten,true);assert.equal(receipt.type,'cars-existing-fleet-single-worker-provider-package');
 assert.equal(receipt.workerCount,1);assert.equal(receipt.applicationCount,6);assert.equal(config.name,f.review.workerName);assert.equal(config.services,undefined);
 assert.deepEqual(receipt.composition.serviceBindings,[]);assert.equal(receipt.sourceApplicationBytesChanged,false);assert.equal(receipt.hostedVerified,false);
 assert.equal(receipt.esbuildVersion,esbuild.version);assert.equal(receipt.inputDigest,'6'.repeat(64));assert.equal(result.deployments,0);
});
test('CLI rejects ambiguous duplicate and missing arguments',()=>{
 assert.deepEqual(parseCompositionArgs(['--client','priselci','--inputs','review.json','--out','runtime/output']),{write:false,client:'priselci',inputs:'review.json',out:'runtime/output'});
 for(const argv of [[],['--client','priselci'],['--client','priselci','--client','other'],['--deploy']])assert.throws(()=>parseCompositionArgs(argv));
});
