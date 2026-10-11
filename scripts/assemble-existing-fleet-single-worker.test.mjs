import test from 'node:test';import assert from 'node:assert/strict';import fs from 'node:fs';import path from 'node:path';
import {json} from './lib/workflow.mjs';import {artifactInventory} from './lib/uk-cloudflare-artifacts.mjs';
import {inspectSingleWorkerInputs} from './package-uk-single-worker.mjs';
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
