import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import {createHash} from 'node:crypto';
import {spawnSync} from 'node:child_process';
import {cloudflarePackProvider,packAssetHash,packAssetManifest,packModuleUploadPlan,packModuleUpload,readPackUploadFile,tokenCloudflareTransport} from './lib/dealer-pack-cloudflare.mjs';
import {PACK_DEPLOY_ACCOUNT,PACK_DEPLOY_ZONE,packDeploymentRequest} from './lib/dealer-pack-queue.mjs';
import {createPackConnectorRpc,listPackConnectorRequests} from './dealer-pack-connector-bridge.mjs';
import {verifyPublishedPackSource,inspectPackDeploymentBatch} from './deploy-dealer-packs.mjs';

const hash=bytes=>createHash('sha256').update(bytes).digest('hex');
const clock='2026-10-19T21:00:00.000Z';
const request=packDeploymentRequest({slug:'dealer-one',dealerId:'gb-london-dealer-one',batch:1,workerName:'cars-dealer-one',publicOrigin:'https://dealer-one.webpreviews.site',packDigest:hash('pack'),releaseId:'cars-six-'+hash('release'),releaseDigest:hash('release'),outputDigest:hash('output'),sourceCommit:'a'.repeat(40)});
const ok=(result,extra={})=>({status:200,success:true,result,...extra});
function temporary(t){const directory=fs.mkdtempSync(path.join(os.tmpdir(),'cars-pack-provider-'));t.after(()=>fs.rmSync(directory,{recursive:true,force:true}));return directory;}
function bundle(t){
  const directory=temporary(t),files=[];
  const values={'server/worker.mjs':'export default {fetch(){return new Response("test")}}','server/router.js':'export const value=1','server/native.wasm':Buffer.from([0,97,115,109,1,0,0,0]),'public/index.html':'identical','public/style.css':'identical','public/_headers':'/*\n  x-preview: true\n','public/_redirects':'/old / 302\n','public/image.svg':'<svg xmlns="http://www.w3.org/2000/svg"/>'};
  for(const [name,value] of Object.entries(values)){const bytes=Buffer.from(value),file=path.join(directory,name);fs.mkdirSync(path.dirname(file),{recursive:true});fs.writeFileSync(file,bytes);files.push({path:name,bytes:bytes.length,sha256:hash(bytes)});}
  return {directory,files,outputDigest:request.outputDigest,config:{name:request.workerName,main:'server/worker.mjs',compatibility_date:'2026-09-25',compatibility_flags:['nodejs_compat'],assets:{binding:'ASSETS',run_worker_first:false,html_handling:'none',not_found_handling:'none'}}};
}

test('asset and module payloads preserve sealed bytes, MIME and native routing metadata',t=>{
  const candidate=bundle(t),assets=packAssetManifest(candidate);
  assert.notEqual(assets.manifest['/index.html'].hash,assets.manifest['/style.css'].hash);
  assert.equal(assets.manifest['/_headers'],undefined);assert.equal(assets.manifest['/_redirects'],undefined);
  const body=packModuleUpload(candidate,{request,assets:{completionToken:'test-only-completion-token'}});
  const plan=packModuleUploadPlan(candidate,{request,assets:{completionToken:'test-only-completion-token'}});
  assert.deepEqual(body,{...plan,modules:plan.modules.map(({file,...module})=>({...module,content_base64:fs.readFileSync(path.join(candidate.directory,file.path)).toString('base64')}))});
  assert.equal(body.main_module,'server/worker.mjs');assert.deepEqual(body.bindings,[{type:'assets',name:'ASSETS'}]);assert.equal(body.assets.config.run_worker_first,false);assert.equal(body.assets.config.html_handling,'none');
  assert.deepEqual(body.limits,{cpu_ms:30000});
  assert.equal(body.modules.find(row=>row.name==='server/native.wasm').content_type,'application/wasm');assert.equal(body.modules.find(row=>row.name==='_headers').content_type,'text/plain');
  for(const row of body.modules){const source=candidate.files.find(file=>file.path===row.name||file.path==='public/'+row.name);assert.equal(hash(Buffer.from(row.content_base64,'base64')),source.sha256);}
});
test('module upload preserves a configured lower CPU budget and rejects invalid runtime limits',t=>{
  const candidate=bundle(t),options={request,assets:{completionToken:'test-only-completion-token'}};candidate.config.limits={cpu_ms:50,subrequests:1000};
  assert.deepEqual(packModuleUploadPlan(candidate,options).limits,{cpu_ms:50,subrequests:1000});
  for(const cpu_ms of [0,-1,300001,1.5,'50',null]){candidate.config.limits={cpu_ms};assert.throws(()=>packModuleUploadPlan(candidate,options),/CPU limit/);}
  candidate.config.limits={cpu_ms:50,unsupported:true};assert.throws(()=>packModuleUploadPlan(candidate,options),/Unsupported/);
});
test('asset hashes match retained Wrangler4.149.0 golden values and preserve exact extensions',()=>{
  assert.equal(packAssetHash(Buffer.from('identical'),'index.html'),'de00984b532586084e5ed86f8bad77d9');
  assert.equal(packAssetHash(Buffer.from('identical'),'style.css'),'4ba17ce368d289d29fcef8058b76f0aa');
  assert.equal(packAssetHash(Buffer.alloc(0),'empty.txt'),'f9bc91770fa5e997cbd47fba833629fc');
  assert.equal(packAssetHash(Buffer.from('identical'),'first/file.html'),packAssetHash(Buffer.from('identical'),'another/file.html'));
  assert.notEqual(packAssetHash(Buffer.from('identical'),'file.HTML'),packAssetHash(Buffer.from('identical'),'file.html'));
});
test('modified assets and symlinked ancestor escapes fail before upload',t=>{
  const candidate=bundle(t),row=candidate.files.find(file=>file.path==='public/image.svg');fs.appendFileSync(path.join(candidate.directory,row.path),'changed');assert.throws(()=>packAssetManifest(candidate),/sealed inventory/);
  const outside=temporary(t),bytes=Buffer.from('private-outside-file');fs.writeFileSync(path.join(outside,'private.txt'),bytes);fs.symlinkSync(outside,path.join(candidate.directory,'public/escape'),'dir');
  assert.throws(()=>readPackUploadFile(candidate,{path:'public/escape/private.txt',bytes:bytes.length,sha256:hash(bytes)}),/symlinked ancestor/);assert.throws(()=>readPackUploadFile(candidate,{path:'public/../../escape',bytes:1,sha256:hash('x')}),/Unsafe upload/);
});
test('modern paginated inventory includes never-deployed reservations and refuses a changing total',async()=>{
  const workers=Array.from({length:201},(_,i)=>({id:i.toString(16).padStart(32,'0'),name:i===200?request.workerName:'cars-protected-'+i,tags:[],deployed_on:null,subdomain:{enabled:false,previews_enabled:false}})),calls=[];
  const api=async operation=>{calls.push(operation);if(operation.path.endsWith('/workers/workers'))return ok(workers.slice((operation.query.page-1)*100,operation.query.page*100),{result_info:{total_count:201,total_pages:3}});if(operation.path.endsWith('/workers/routes')||operation.path.endsWith('/workers/domains'))return ok([]);if(operation.path.endsWith(workers[200].id))return ok(workers[200]);throw Error('Unexpected endpoint');};
  const provider=cloudflarePackProvider({api,now:()=>clock}),snapshot=await provider.snapshot({request,challenge:{requestId:'challenge',stage:'test',notBefore:clock}});
  assert.equal(snapshot.scriptCount,201);assert.equal(snapshot.target.undeployed,true);assert.equal(snapshot.target.versionId,null);assert.deepEqual(calls.filter(row=>row.path.endsWith('/workers/workers')).map(row=>row.query.page),[1,2,3]);assert.equal(calls.some(row=>row.path.endsWith('/deployments')),false);
  const drifting=cloudflarePackProvider({api:async operation=>{const response=await api(operation);if(operation.path.endsWith('/workers/workers')&&operation.query.page===2)response.result_info.total_count=202;return response;},now:()=>clock});
  await assert.rejects(()=>drifting.snapshot({request,challenge:{requestId:'new',stage:'test',notBefore:clock}}),/changed while paginating/);
});
test('modern inventory with total_count alone reads every full page plus its terminating page',async()=>{
  for(const count of [100,200,500]){
    const workers=Array.from({length:count},(_,i)=>({id:i.toString(16).padStart(32,'0'),name:'cars-protected-'+i,tags:[]})),pages=[];
    const provider=cloudflarePackProvider({api:async operation=>{if(operation.path.endsWith('/workers/workers')){pages.push(operation.query.page);return ok(workers.slice((operation.query.page-1)*100,operation.query.page*100),{result_info:{total_count:count}});}return ok([]);},now:()=>clock});
    const snapshot=await provider.snapshot({request,challenge:{requestId:'count-'+count,stage:'test',notBefore:clock}});assert.equal(snapshot.scriptCount,count);assert.deepEqual(pages,Array.from({length:count/100+1},(_,i)=>i+1));
  }
});
test('create-only conflict reports a known failure and exposes no name-upsert request',async()=>{
  const calls=[],provider=cloudflarePackProvider({api:async operation=>{calls.push(operation);return {status:409,success:false,result:null};}});
  await assert.rejects(()=>provider.createWorker({request,ownershipTags:['cars-pack-v1']}),error=>error.providerOutcomeKnown===true&&/conflict/.test(error.message));assert.equal(calls.length,1);assert.equal(calls[0].method,'POST');assert.equal(calls[0].path,'/accounts/'+PACK_DEPLOY_ACCOUNT+'/workers/workers');assert.equal(calls[0].body.name,request.workerName);assert.equal(calls[0].body.subdomain.enabled,false);
});
test('static uploads use only session JWT, enforce requested hashes, and require completion',async t=>{
  const candidate=bundle(t),assets=packAssetManifest(candidate),keys=[...assets.byHash.keys()],session='test-ephemeral-session-token',completion='test-ephemeral-completion-token',uploads=[];let writes=0;
  const provider=cloudflarePackProvider({api:async operation=>{assert.equal(operation.path,'/accounts/'+PACK_DEPLOY_ACCOUNT+'/workers/scripts/'+request.workerName+'/assets-upload-session');assert.deepEqual(operation.body.manifest,assets.manifest);return ok({jwt:session,buckets:[keys]});},assetFetch:async(url,options)=>{uploads.push({url,options});assert.equal(options.headers.Authorization,'Bearer '+session);for(const [key,value] of options.body.entries()){assert.ok(keys.includes(key));assert.equal(value.type,assets.byHash.get(key).mime);assert.equal(hash(Buffer.from(await value.text(),'base64')),assets.byHash.get(key).row.sha256);}return {status:201,json:async()=>({success:true,result:{jwt:completion}})};}});
  const result=await provider.prepareAssets({candidate,request,beforeWrite:async()=>{writes++;}});assert.equal(result.completionToken,completion);assert.equal(result.uploadedFiles,keys.length);assert.equal(uploads.length,1);assert.equal(writes,2);
  const corrupt=cloudflarePackProvider({api:async()=>ok({jwt:session,buckets:[['f'.repeat(32)]]}),assetFetch:async()=>assert.fail('No unknown asset can upload')});await assert.rejects(()=>corrupt.prepareAssets({candidate,request,beforeWrite:async()=>{}}),/unknown or duplicate/);
});

function deferred(){let resolve,reject;const promise=new Promise((yes,no)=>{resolve=yes;reject=no;});return {promise,resolve,reject};}
const nextTurn=()=>new Promise(resolve=>setImmediate(resolve));
function bucketFixture(t,count=6){
  const candidate=bundle(t),rows=[];
  for(let index=0;index<count;index++){
    const name='public/pool-'+index+'.txt',bytes=Buffer.from('Sealed lazy bucket '+index),file=path.join(candidate.directory,name);
    fs.writeFileSync(file,bytes);const row={path:name,bytes:bytes.length,sha256:hash(bytes)};candidate.files.push(row);rows.push(row);
  }
  const assets=packAssetManifest(candidate),keys=rows.map(row=>assets.manifest['/'+row.path.slice(7)].hash);
  return {candidate,assets,keys,buckets:keys.map(key=>[key]),rows};
}
function uploadControl(keys){
  const started=keys.map(()=>deferred()),responses=keys.map(()=>deferred()),calls=[];
  let active=0,maximum=0;
  const assetFetch=async(url,options)=>{
    const fields=[...options.body.keys()];assert.equal(fields.length,1);const index=keys.indexOf(fields[0]);assert(index>=0);
    assert.equal(options.method,'POST');assert.equal(options.headers.Authorization,'Bearer test-session-private');
    assert.equal(url,'https://api.cloudflare.com/client/v4/accounts/'+PACK_DEPLOY_ACCOUNT+'/workers/assets/upload?base64=true');
    calls.push(index);active++;maximum=Math.max(maximum,active);started[index].resolve(options);
    try{return await responses[index].promise;}finally{active--;}
  };
  const acknowledge=(index,jwt)=>responses[index].resolve({status:jwt?201:202,json:async()=>({success:true,result:jwt?{jwt}:{}})});
  return {started,responses,calls,assetFetch,acknowledge,get active(){return active;},get maximum(){return maximum;}};
}

test('static bucket uploads overlap at most three and require all acknowledgements after an out-of-order completion JWT',async t=>{
  const f=bucketFixture(t),control=uploadControl(f.keys),completion='test-completed-private-session';let fences=0,settled=false;
  const provider=cloudflarePackProvider({api:async operation=>{assert.deepEqual(operation.body.manifest,f.assets.manifest);return ok({jwt:'test-session-private',buckets:f.buckets});},assetFetch:control.assetFetch});
  const pending=provider.prepareAssets({candidate:f.candidate,request,beforeWrite:async()=>{fences++;}}).finally(()=>{settled=true;});
  await Promise.all(control.started.slice(0,3).map(row=>row.promise));assert.deepEqual(control.calls,[0,1,2]);assert.equal(control.active,3);assert.equal(settled,false);
  control.acknowledge(1,completion);await control.started[3].promise;assert.equal(settled,false,'An early completion token cannot finish while other bucket responses are pending');
  control.acknowledge(0);await control.started[4].promise;control.acknowledge(3);await control.started[5].promise;
  assert.equal(control.maximum,3);assert.equal(control.active,3);assert.equal(settled,false);
  control.acknowledge(2);control.acknowledge(4);control.acknowledge(5);const result=await pending;
  assert.equal(result.completionToken,completion);assert.equal(result.manifestDigest,f.assets.manifestDigest);assert.equal(result.assetFiles,Object.keys(f.assets.manifest).length);assert.equal(result.uploadedFiles,6);
  assert.equal(fences,7,'Session and every POST have their own current-claim check');assert.equal(control.active,0);assert.deepEqual([...control.calls].sort(),[0,1,2,3,4,5]);
  for(const [index,row] of control.started.entries()){const options=await row.promise,blob=options.body.get(f.keys[index]);assert.equal(hash(Buffer.from(await blob.text(),'base64')),f.rows[index].sha256);}
});

for(const mode of ['HTTP refusal','ambiguous timeout'])test('bucket '+mode+' stops admission and waits for all in-flight requests without retry',async t=>{
  const f=bucketFixture(t),control=uploadControl(f.keys);let settled=false;
  const provider=cloudflarePackProvider({api:async()=>ok({jwt:'test-session-private',buckets:f.buckets}),assetFetch:control.assetFetch});
  const pending=provider.prepareAssets({candidate:f.candidate,request,beforeWrite:async()=>{}});
  const rejected=assert.rejects(pending,mode==='HTTP refusal'?/Static asset upload failed/:/asset-bucket-upload transport failed/).then(()=>{settled=true;});
  await Promise.all(control.started.slice(0,3).map(row=>row.promise));
  if(mode==='HTTP refusal')control.responses[1].resolve({status:500,json:async()=>({success:false,result:{}})});else control.responses[1].reject(Error('ambiguous timeout'));
  await nextTurn();assert.deepEqual(control.calls,[0,1,2]);assert.equal(settled,false,'Unknown outcome is not returned while uploads remain in flight');assert.equal(control.active,2);
  control.acknowledge(0,'test-token-cannot-hide-failure');await nextTurn();assert.equal(settled,false);assert.deepEqual(control.calls,[0,1,2]);
  control.acknowledge(2);await rejected;assert.equal(control.active,0);assert.deepEqual(control.calls,[0,1,2],'No new request or retry follows an observed failure');
});

test('a lost per-bucket claim blocks pending POSTs and waits for an already-running upload',async t=>{
  const f=bucketFixture(t),control=uploadControl(f.keys),lost=deferred(),other=deferred();let fences=0,settled=false;
  const provider=cloudflarePackProvider({api:async()=>ok({jwt:'test-session-private',buckets:f.buckets}),assetFetch:control.assetFetch});
  const pending=provider.prepareAssets({candidate:f.candidate,request,beforeWrite:async()=>{fences++;if(fences===3)await lost.promise;if(fences===4)await other.promise;}});
  const rejected=assert.rejects(pending,/current claim lost/).then(()=>{settled=true;});
  await control.started[0].promise;assert.equal(fences,4);assert.deepEqual(control.calls,[0]);
  lost.reject(Error('current claim lost'));await nextTurn();other.resolve();await nextTurn();assert.equal(settled,false);assert.deepEqual(control.calls,[0],'A pending claim read cannot admit a POST after another worker loses the fence');
  control.acknowledge(0);await rejected;assert.equal(control.active,0);assert.equal(fences,4);assert.deepEqual(control.calls,[0]);
});

test('every bucket is preflighted for unknown, same-bucket and cross-bucket duplicate hashes before any upload POST',async t=>{
  const f=bucketFixture(t);
  for(const buckets of [[...f.buckets.slice(0,3),['f'.repeat(32)]],[...f.buckets.slice(0,3),[f.keys[3],f.keys[3]]],[...f.buckets.slice(0,3),[f.keys[0]]]]){
    let posts=0,fences=0,customCalls=0;
    const provider=cloudflarePackProvider({api:async()=>ok({jwt:'test-session-private',buckets}),assetFetch:async()=>{posts++;assert.fail('Invalid inventory cannot start a POST');},uploadAssets:async()=>{customCalls++;assert.fail('Invalid inventory cannot enter the connector bypass');}});
    await assert.rejects(()=>provider.prepareAssets({candidate:f.candidate,request,beforeWrite:async()=>{fences++;}}),/unknown or duplicate/);
    assert.equal(posts,0);assert.equal(fences,1);assert.equal(customCalls,0);
  }
});

test('lazy bucket materialization rechecks sealed bytes when a later upload is admitted',async t=>{
  const f=bucketFixture(t),control=uploadControl(f.keys);let settled=false;
  const provider=cloudflarePackProvider({api:async()=>ok({jwt:'test-session-private',buckets:f.buckets}),assetFetch:control.assetFetch});
  const pending=provider.prepareAssets({candidate:f.candidate,request,beforeWrite:async()=>{}});
  const rejected=assert.rejects(pending,/sealed inventory/).then(()=>{settled=true;});
  await Promise.all(control.started.slice(0,3).map(row=>row.promise));fs.appendFileSync(path.join(f.candidate.directory,f.rows[3].path),'changed after manifest');
  control.acknowledge(0);await nextTurn();assert.deepEqual(control.calls,[0,1,2],'Later payloads were not eagerly materialized');assert.equal(settled,false);
  control.acknowledge(1);control.acknowledge(2);await rejected;assert.equal(control.active,0);assert.deepEqual(control.calls,[0,1,2]);
});

test('empty sessions and the explicit connector upload hook retain their previous completion contracts',async t=>{
  const f=bucketFixture(t);let posts=0,fences=0;
  const empty=cloudflarePackProvider({api:async()=>ok({jwt:'test-empty-session-complete',buckets:[]}),assetFetch:async()=>{posts++;assert.fail('Empty session cannot upload');}});
  const result=await empty.prepareAssets({candidate:f.candidate,request,beforeWrite:async()=>{fences++;}});assert.equal(result.completionToken,'test-empty-session-complete');assert.equal(result.uploadedFiles,0);assert.equal(posts,0);assert.equal(fences,1);
  let hooks=0;const custom=cloudflarePackProvider({api:async()=>ok({jwt:'test-session-private',buckets:f.buckets}),assetFetch:async()=>assert.fail('Custom connector must not use the CI pool'),uploadAssets:async options=>{hooks++;assert.deepEqual(options.session.buckets,f.buckets);assert.equal(options.session.jwt,'test-session-private');await options.beforeWrite();return {completionToken:'test-custom-completion'};}});
  const hooked=await custom.prepareAssets({candidate:f.candidate,request,beforeWrite:async()=>{fences++;}});assert.equal(hooks,1);assert.equal(hooked.completionToken,'test-custom-completion');assert.equal(hooked.uploadedFiles,6);assert.equal(hooked.manifestDigest,f.assets.manifestDigest);
  const incomplete=cloudflarePackProvider({api:async()=>ok({jwt:'test-session-private',buckets:[[f.keys[0]]]}),assetFetch:async()=>({status:202,json:async()=>({success:true,result:{}})})});
  await assert.rejects(()=>incomplete.prepareAssets({candidate:f.candidate,request,beforeWrite:async()=>{}}),/completion token/);
});
test('version uploads address immutable Worker IDs and preserve measured startup',async t=>{
  const candidate=bundle(t),workerId='b'.repeat(32),versionId='11111111-1111-4111-8111-111111111111',calls=[],provider=cloudflarePackProvider({api:async operation=>{calls.push(operation);return ok({id:versionId,startup_time_ms:23});}});
  const uploaded=await provider.upload({candidate,request,workerId,assets:{completionToken:'test-only-completion-token'},ownershipTags:['cars-pack-v1']});assert.equal(uploaded.workerId,workerId);assert.equal(uploaded.versionId,versionId);assert.equal(uploaded.startupTimeMs,23);assert.equal(calls[0].method,'POST');assert.equal(calls[0].path,'/accounts/'+PACK_DEPLOY_ACCOUNT+'/workers/workers/'+workerId+'/versions');assert.deepEqual(calls[0].query,{deploy:false});await assert.rejects(()=>provider.upload({candidate,request,workerId:request.workerName,assets:{}}),/immutable Worker ID/);
  assert.equal(uploaded.requestedCpuLimitMs,30000);assert.equal(uploaded.cpuLimitMs,30000);assert.equal(uploaded.cpuLimitSource,'successful-explicit-upload-request');assert.equal(calls[0].body.limits.cpu_ms,30000);
});
test('version upload distinguishes provider CPU readback from the explicit request',async t=>{
  const candidate=bundle(t);candidate.config.limits={cpu_ms:50};
  const provider=cloudflarePackProvider({api:async operation=>{assert.equal(operation.body.limits.cpu_ms,50);return ok({id:'11111111-1111-4111-8111-111111111111',startup_time_ms:20,limits:{cpu_ms:50}});}});
  const uploaded=await provider.upload({candidate,request,workerId:'b'.repeat(32),assets:{completionToken:'test-only-completion-token'}});assert.equal(uploaded.requestedCpuLimitMs,50);assert.equal(uploaded.cpuLimitMs,50);assert.equal(uploaded.cpuLimitSource,'provider-version-response');
});
test('token adapter confines API paths and does not return authentication headers',async()=>{
  const token='test-account-token-never-log',calls=[],transport=tokenCloudflareTransport({token,fetchImpl:async(url,options)=>{calls.push({url:String(url),options});return {status:200,json:async()=>({success:true,result:[]})};}});
  const response=await transport({method:'GET',path:'/accounts/'+PACK_DEPLOY_ACCOUNT+'/workers/workers',query:{page:2}});assert.equal(calls[0].options.headers.Authorization,'Bearer '+token);assert.match(calls[0].url,/page=2/);assert.equal(JSON.stringify(response).includes(token),false);await assert.rejects(()=>transport({method:'POST',path:'/accounts/'+PACK_DEPLOY_ACCOUNT+'/billing/profile',body:{}}),/scope/);await assert.rejects(()=>transport({method:'DELETE',path:'/zones/foreign/workers/routes'}),/scope/);assert.equal(calls.length,1);
});
test('published source proof binds every retained input and rejects uncommitted bytes',async t=>{
  const root=temporary(t),slug=request.slug,directory=path.join(root,'dealers',slug);fs.mkdirSync(directory,{recursive:true});const original=Buffer.from('{"name":"Exact Dealer"}\n');fs.writeFileSync(path.join(directory,'business-facts.json'),original);
  const git=args=>{const result=spawnSync('git',['-C',root,...args],{encoding:'utf8'});assert.equal(result.status,0,result.stderr);return result.stdout.trim();};git(['init','-q']);git(['add','dealers']);git(['-c','user.name=Pack test','-c','user.email=pack-test@example.invalid','commit','-qm','fixture']);const sourceCommit=git(['rev-parse','HEAD']),tree=git(['rev-parse','HEAD^{tree}']);
  const sourceFiles=new Map([['business-facts.json',original]]),pack={sourceFiles,files:new Map([...sourceFiles,['branding/generated.png',Buffer.from('generated-not-committed')]])},readGithub=async operation=>{assert.equal(operation.path,'/repos/darkapoparka/cars/commits/'+sourceCommit);return {status:200,body:{sha:sourceCommit,commit:{tree:{sha:tree}}}};};
  const proof=await verifyPublishedPackSource({root,slug,pack,sourceCommit,readGithub});assert.equal(proof.verified,true);assert.equal(proof.inputFiles,1);assert.equal(proof.mainReachabilityClaimed,false);
  sourceFiles.set('business-facts.json',Buffer.from('tampered'));await assert.rejects(()=>verifyPublishedPackSource({root,slug,pack,sourceCommit,readGithub}),/published commit/);await assert.rejects(()=>verifyPublishedPackSource({root,slug,pack,sourceCommit,readGithub:async()=>({status:404,body:{}})}),/not published/);
});
test('one failing candidate is reported and independent candidates remain deployable',async()=>{
  const slugs=['dealer-one','bad-pack','dealer-three'],report=await inspectPackDeploymentBatch({slugs,bundleRoot:'/unused',inspect:async({slug})=>{if(slug==='bad-pack')throw Error('Malformed pack fixture');return {request:packDeploymentRequest({...request,slug,dealerId:'gb-london-'+slug,workerName:'cars-'+slug,publicOrigin:'https://'+slug+'.webpreviews.site'})};}});
  assert.equal(report.success,false);assert.deepEqual(report.requests.map(row=>row.slug),['dealer-one','dealer-three']);assert.deepEqual(report.failures,[{slug:'bad-pack',reason:'Malformed pack fixture'}]);assert.equal(report.providerWrites,0);assert.equal(report.liveProviderVerified,false);
});
test('connector RPC keeps tokens out of notifications and cleans private exchange files',async t=>{
  const directory=temporary(t),notifications=[],secret='fixture-secret-asset-session',rpc=createPackConnectorRpc({directory,pollMs:2,timeoutMs:1000,notify:value=>{notifications.push(value);const requestFile=path.join(directory,'requests',value.id+'.json'),stored=JSON.parse(fs.readFileSync(requestFile,'utf8'));assert.equal(stored.operation.session.jwt,secret);
    // Node does not expose owner/group permission distinctions on Windows.
    // Keep the exact private-mode assertion on the POSIX deployment executor.
    // https://nodejs.org/api/fs.html#file-modes
    if(process.platform!=='win32')assert.equal(fs.statSync(requestFile).mode&0o777,0o600);
    fs.writeFileSync(path.join(directory,'responses',value.id+'.json'),JSON.stringify({id:value.id,channel:value.channel,result:{completionToken:secret}}),{mode:0o600});}});
  const result=await rpc('cloudflare-assets',{session:{jwt:secret},request:{slug:request.slug},endpoint:'/accounts/'+PACK_DEPLOY_ACCOUNT+'/workers/assets/upload'});assert.equal(result.completionToken,secret);assert.equal(JSON.stringify(notifications).includes(secret),false);assert.deepEqual(listPackConnectorRequests(directory),[]);assert.deepEqual(fs.readdirSync(path.join(directory,'responses')),[]);
});
test('connector RPC rejects mismatched responses and timeouts without retaining secret files',async t=>{
  const directory=temporary(t),rpc=createPackConnectorRpc({directory,pollMs:1,timeoutMs:100,notify:value=>fs.writeFileSync(path.join(directory,'responses',value.id+'.json'),JSON.stringify({id:'wrong-request',channel:value.channel,result:{}}),{mode:0o600})});
  await assert.rejects(()=>rpc('github',{method:'GET',path:'/repos/darkapoparka/cars/contents/queue.json'}),/identity differs/);assert.deepEqual(listPackConnectorRequests(directory),[]);
  const blocked=createPackConnectorRpc({directory,pollMs:1,timeoutMs:5});await assert.rejects(()=>blocked('cloudflare',{method:'POST',path:'/accounts/'+PACK_DEPLOY_ACCOUNT+'/workers/workers'}),/retains its durable claim/);assert.deepEqual(listPackConnectorRequests(directory),[]);
});

