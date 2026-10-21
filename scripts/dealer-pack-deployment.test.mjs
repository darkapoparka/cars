import test from 'node:test';
import assert from 'node:assert/strict';
import {createHash} from 'node:crypto';
import {PACK_DEPLOY_ACCOUNT,PACK_DEPLOY_ZONE,createPackDeploymentQueue,packDeploymentRequest,validatePackQueue,queueDigest,enqueuePackDeployments,claimPackDeployment,readPackClaim,finishPackDeployment,recoverPackClaim,githubPackQueueStore} from './lib/dealer-pack-queue.mjs';
import {executeQueuedPackDeployment,registryPackCollisions,validatePackDeploymentIdentity,validatePackProviderSnapshot,packOwnershipTags,latestOwnedPackReceipt} from './lib/dealer-pack-deployment.mjs';

const now='2026-10-19T20:00:00.000Z',clock=()=>Date.parse(now),time=()=>now;
const id=value=>createHash('sha256').update(value).digest('hex');
const keys=['auto-best','modern','import','app','mobile','karento-best'];
const policy={schemaVersion:1,kind:'cars-owner-authorized-pack-deployment',accountId:PACK_DEPLOY_ACCOUNT,zoneId:PACK_DEPLOY_ZONE,zoneName:'webpreviews.site',workersPlan:'paid',allowedScripts:500,minimumSpareScripts:0,ownerConfirmedPaid:true,allowNewPreviews:true,outreachApproved:false,authorizedAt:now,authorizationSource:'Owner M2 instruction dated19October2026',reason:'Owner approved100 existing plus400 new previews, explicitly accepting no remaining reserve.',maximumNewDealers:400};
const input=(slug='dealer-one',extra={})=>packDeploymentRequest({slug,dealerId:'gb-birmingham-'+slug,batch:1,workerName:'cars-'+slug,publicOrigin:'https://'+slug+'.webpreviews.site',packDigest:id(slug+'pack'),releaseId:'cars-six-'+id('release'),releaseDigest:id('release'),outputDigest:id(slug+'output'),sourceCommit:'a'.repeat(40),...extra});
function memoryStore(state){let current=structuredClone(state),revision=0;return {async read(){await Promise.resolve();return {state:structuredClone(current),revision:String(revision)};},async compareAndSwap(expected,next){await Promise.resolve();if(expected!==String(revision))return false;current=structuredClone(next);revision++;return String(revision);},get state(){return structuredClone(current);},set state(next){current=structuredClone(next);revision++;}};}
function fixture({count=100,existing=[]}={}){
  const workerNames=Array.from({length:count},(_,i)=>'cars-protected-'+i),baseline={accountId:PACK_DEPLOY_ACCOUNT,zoneId:PACK_DEPLOY_ZONE,evidence:'authenticated-cloudflare-api',complete:true,observedAt:now,workerNames,routes:[],domains:[]};
  const queue=createPackDeploymentQueue({policy,baseline,now,queueId:'11111111-1111-4111-8111-111111111111'}),store=memoryStore(queue),workers=new Map(workerNames.map(name=>[name,{id:id(name).slice(0,32),name,tags:[],versionId:'11111111-1111-4111-8111-111111111111',subdomain:{enabled:false,previews_enabled:false}}])),routes=[],calls=[];let versionCounter=1;
  for(const row of existing)workers.set(row.name,row);
  const provider={
    async snapshot({request,challenge}){calls.push('read:'+challenge.stage);const worker=workers.get(request.workerName),active=worker?.versionId;return {kind:'cars-live-pack-provider-snapshot',evidence:'authenticated-cloudflare-api',accountId:PACK_DEPLOY_ACCOUNT,zoneId:PACK_DEPLOY_ZONE,requestId:challenge.requestId,stage:challenge.stage,startedAt:challenge.notBefore,observedAt:now,complete:true,scripts:[...workers.values()].map(row=>({id:row.id,name:row.name,tags:row.tags})),scriptCount:workers.size,routes:structuredClone(routes),domains:[],target:worker?{exists:true,workerId:worker.id,workerName:worker.name,tags:[...worker.tags],versionId:active??null,versionTraffic:active?[{version_id:active,percentage:100}]:[],undeployed:!active,bindings:active?[{type:'assets',name:'ASSETS'}]:[],subdomain:worker.subdomain}:{exists:false}};},
    async createWorker({request,ownershipTags}){calls.push('create:'+request.workerName);if(workers.has(request.workerName)){const error=Error('Create-only conflict409');error.providerOutcomeKnown=true;throw error;}const value={id:id(request.workerName).slice(0,32),name:request.workerName,tags:[...ownershipTags],subdomain:{enabled:false,previews_enabled:false},versionId:null};workers.set(value.name,value);return structuredClone(value);},
    async prepareAssets(){calls.push('assets');return {completionToken:'not-a-real-token-for-tests',manifestDigest:id('assets'),assetFiles:12,uploadedFiles:12};},
    async upload({request,workerId}){calls.push('upload:'+workerId);versionCounter++;return {workerId,workerName:request.workerName,versionId:String(versionCounter).padStart(8,'0')+'-2222-4222-8222-222222222222',startupTimeMs:32,requestedCpuLimitMs:30000,cpuLimitMs:30000,cpuLimitSource:'provider-version-response'};},
    async activateVersion({request,versionId}){calls.push('activate');workers.get(request.workerName).versionId=versionId;},
    async disableSubdomain({request}){calls.push('subdomain');workers.get(request.workerName).subdomain={enabled:false,previews_enabled:false};},
    async createRoute({request}){calls.push('route');const value={id:id(request.workerName+'route').slice(0,32),pattern:new URL(request.publicOrigin).hostname+'/*',script:request.workerName};routes.push(value);return value;},
    async rollbackVersion({request,versionId}){calls.push('rollback');workers.get(request.workerName).versionId=versionId;},
  };
  const candidate=request=>({verified:true,slug:request.slug,manifest:{pack:{benchmarkOnly:false}},packDigest:request.packDigest,releaseId:request.releaseId,releaseDigest:request.releaseDigest,outputDigest:request.outputDigest,sourceCommit:request.sourceCommit,sourceProof:{verified:true,repository:'darkapoparka/cars',commit:request.sourceCommit,path:'dealers/'+request.slug},qa:{success:true,packDigest:request.packDigest,releaseDigest:request.releaseDigest,outputDigest:request.outputDigest}});
  const hosted=({request,receipt})=>({type:'cars-dealer-pack-hosted-qa',slug:request.slug,publicOrigin:request.publicOrigin,packDigest:request.packDigest,outputDigest:request.outputDigest,versionId:receipt?.versionId,width:390,success:true,finishedAt:now,providerWrites:0,language:'en',designs:keys.map(key=>({key,status:'passed',httpStatus:200,headStatus:'passed',headHttpStatus:200,sixChoices:true,nameVisible:true,logoVisible:true,phoneStatus:'passed',foreignIdentityCount:0}))});
  const execute=async(request=input(),options={})=>{await enqueuePackDeployments(store,[request],{now:time});const row=await claimPackDeployment(store,{owner:'test-executor',requestId:request.id,now:time});assert.equal(row.value.claimed,true);return executeQueuedPackDeployment({store,claim:row.value.claim,provider,inspectCandidate:async value=>candidate(value),registry:{dealers:[]},verifyHosted:async value=>hosted(value),now:clock,...options});};
  return {queue,store,workers,routes,calls,provider,candidate,hosted,execute};
}

test('four simultaneous batches persist all requests and duplicate enqueue is idempotent',async()=>{
  const f=fixture(),groups=Array.from({length:4},(_,batch)=>Array.from({length:20},(_,i)=>input('dealer-'+batch+'-'+i,{batch:batch+1})));
  await Promise.all(groups.map(group=>enqueuePackDeployments(f.store,group,{now:time})));
  assert.equal(f.store.state.order.length,80);const generation=f.store.state.generation;
  const duplicate=await enqueuePackDeployments(f.store,groups[0],{now:time});assert.equal(duplicate.value.added.length,0);assert.equal(f.store.state.generation,generation);validatePackQueue(f.store.state);
});
test('a queue collision arriving during CAS retry rejects only that slug in collection mode',async()=>{
  const f=fixture(),rival=input('claimed-name'),colliding=input('different-name',{dealerId:rival.dealerId}),valid=input('independent-ready');
  const original=f.store.compareAndSwap;let raced=false;
  f.store.compareAndSwap=async(revision,next)=>{
    if(!raced){raced=true;await enqueuePackDeployments({read:f.store.read,compareAndSwap:original},[rival],{now:time});return false;}
    return original(revision,next);
  };
  const result=await enqueuePackDeployments(f.store,[colliding,valid,{slug:'malformed'}],{collectRejections:true,now:time});
  assert.deepEqual(result.value.added,[valid.id]);assert.deepEqual(result.value.rejected.map(row=>row.slug).sort(),['different-name','malformed']);
  assert.equal(f.store.state.order.length,2);assert.ok(f.store.state.requests[rival.id]);assert.ok(f.store.state.requests[valid.id]);assert.equal(f.store.state.requests[colliding.id],undefined);
  const generation=f.store.state.generation;await assert.rejects(()=>enqueuePackDeployments(f.store,[colliding,input('strict-uncommitted')],{now:time}),/conflicting/);assert.equal(f.store.state.generation,generation);
});
test('two racing executors cannot both acquire the account claim and claims never auto-expire',async()=>{
  const f=fixture();await enqueuePackDeployments(f.store,[input(),input('dealer-two')],{now:time});
  const values=await Promise.all(['runner-one','runner-two'].map(owner=>claimPackDeployment(f.store,{owner,now:time})));
  assert.equal(values.filter(row=>row.value.claimed).length,1);assert.equal(f.store.state.order.filter(key=>f.store.state.requests[key].status==='queued').length,1);
  const later=await claimPackDeployment(f.store,{owner:'runner-three',now:()=> '2027-10-19T20:00:00.000Z'});assert.equal(later.value.claimed,false);
});
test('a successful create uses create-only API, fresh capacity, immutable ID, owned route and durable hosted receipt',async()=>{
  const f=fixture(),result=await f.execute();assert.equal(result.status,'deployed');assert.equal(f.workers.size,101);assert.equal(result.receipt.counts.before,100);assert.equal(result.receipt.counts.after,101);assert.equal(result.receipt.hostedVerified,true);assert.equal(result.receipt.runtime.startupTimeMs,32);assert.equal(f.store.state.active,null);
  assert.ok(result.receipt.hosted.report.designs.every(row=>row.headStatus==='passed'&&row.headHttpStatus===200));
  assert.equal(result.receipt.runtime.startupWithinLimit,true);assert.equal(result.receipt.runtime.startupLimitMs,1000);assert.equal(result.receipt.runtime.cpuLimitMs,30000);assert.equal(result.receipt.runtime.requestedCpuLimitMs,30000);assert.equal(result.receipt.runtime.cpuLimitSource,'provider-version-response');
  const createIndex=f.calls.findIndex(value=>value.startsWith('create:'));assert.equal(f.calls[createIndex-1],'read:immediately-before-worker-create');assert.match(f.calls.find(value=>value.startsWith('upload:')),/^upload:[a-f0-9]{32}$/);assert.equal(f.routes[0].pattern,'dealer-one.webpreviews.site/*');assert.equal(f.store.state.receipts['dealer-one'].length,1);
  assert.deepEqual([...f.workers.keys()].filter(name=>name.startsWith('cars-protected-')).sort(),[...f.queue.baseline.workerNames].sort());
});
test('approved zero reserve permits the500th create and refuses the501st without provider writes',async()=>{
  const f=fixture({count:499});assert.equal((await f.execute()).status,'deployed');assert.equal(f.workers.size,500);const writes=f.calls.filter(value=>!value.startsWith('read:')).length;
  const result=await f.execute(input('dealer-two'));assert.equal(result.status,'failed');assert.match(result.error,/capacity/);assert.equal(f.workers.size,500);assert.equal(f.calls.filter(value=>!value.startsWith('read:')).length,writes);
});
test('two queued final-slot requests serialize and only one can consume the last slot',async()=>{
  const f=fixture({count:499});await enqueuePackDeployments(f.store,[input(),input('dealer-two')],{now:time});const first=await claimPackDeployment(f.store,{owner:'first-runner',now:time});const concurrent=await claimPackDeployment(f.store,{owner:'second-runner',now:time});assert.equal(concurrent.value.claimed,false);
  assert.equal((await executeQueuedPackDeployment({store:f.store,claim:first.value.claim,provider:f.provider,inspectCandidate:async request=>f.candidate(request),registry:[],verifyHosted:async options=>f.hosted(options),now:clock})).status,'deployed');
  const second=await claimPackDeployment(f.store,{owner:'second-runner',now:time});const result=await executeQueuedPackDeployment({store:f.store,claim:second.value.claim,provider:f.provider,inspectCandidate:async request=>f.candidate(request),registry:[],verifyHosted:async options=>f.hosted(options),now:clock});assert.equal(result.status,'failed');assert.equal(f.workers.size,500);
});
test('foreign same-name Worker is refused without upload even with spare capacity',async()=>{
  const f=fixture({existing:[{name:'cars-dealer-one',id:'f'.repeat(32),tags:[],versionId:'11111111-1111-4111-8111-111111111111',subdomain:{enabled:false,previews_enabled:false}}]});const result=await f.execute();assert.equal(result.status,'failed');assert.match(result.error,/occupied/);assert.equal(f.calls.some(row=>row.startsWith('upload:')||row.startsWith('create:')),false);
});
test('create-only API conflict closes the check/create race without adopting or updating the intruder',async()=>{
  const f=fixture(),original=f.provider.createWorker;f.provider.createWorker=async args=>{f.workers.set(args.request.workerName,{id:'f'.repeat(32),name:args.request.workerName,tags:[],versionId:null});return original(args);};
  const result=await f.execute();assert.equal(result.status,'failed');assert.match(result.error,/conflict/);assert.equal(f.calls.some(row=>row.startsWith('upload:')),false);assert.equal(f.store.state.active,null);
});
test('registry workerName, publicOrigin, nested hostingIdentity and normalized aliases all collide',()=>{
  const request=input();for(const row of [{slug:'old',hosting:{workerName:request.workerName}},{slug:'old',publicOrigin:request.publicOrigin},{slug:'old',hostingIdentity:{canonical:request.publicOrigin}},{slug:'old',aliases:['Dealer One']}])assert.ok(registryPackCollisions({dealers:[row]},request).length);
});
test('protected baseline Worker cannot be enqueued even using a matching forged local receipt',async()=>{
  const f=fixture(),request=input('protected-1');await assert.rejects(()=>enqueuePackDeployments(f.store,[request]),/protected/);
});
test('tampered durable receipt and forged own-receipt identity both fail',async()=>{
  const f=fixture();await f.execute();const state=f.store.state;state.receipts['dealer-one'][0].receipt.workerId='f'.repeat(32);assert.throws(()=>validatePackQueue(state),/receipt/i);
  const altered=f.store.state;altered.receipts['dealer-one'][0].receipt.dealerId='gb-someone-else';altered.receipts['dealer-one'][0].sha256=queueDigest(altered.receipts['dealer-one'][0].receipt);assert.throws(()=>latestOwnedPackReceipt(altered,input()),/ownership/);
});
test('same pack may update only its exact owned immutable ID, version and route',async()=>{
  const f=fixture();await f.execute();const count=f.workers.size,request=input('dealer-one',{packDigest:id('revised-pack'),outputDigest:id('revised-output')});
  const result=await f.execute(request);assert.equal(result.status,'deployed');assert.equal(result.receipt.mode,'update-owned');assert.equal(f.workers.size,count);assert.equal(f.calls.filter(row=>row.startsWith('create:')).length,1);assert.equal(f.routes.length,1);assert.equal(f.store.state.receipts['dealer-one'].length,2);
});
test('an outside version advance blocks an otherwise owned pack update',async()=>{
  const f=fixture();await f.execute();f.workers.get('cars-dealer-one').versionId='99999999-9999-4999-8999-999999999999';const writes=f.calls.filter(row=>row.startsWith('upload:')).length;
  const result=await f.execute(input('dealer-one',{outputDigest:id('new-output')}));assert.equal(result.status,'failed');assert.match(result.error,/advanced/);assert.equal(f.calls.filter(row=>row.startsWith('upload:')).length,writes);
});
test('reusing a cached snapshot challenge is refused before create',async()=>{
  const f=fixture(),original=f.provider.snapshot;let old;f.provider.snapshot=async args=>old??=(await original(args));const result=await f.execute();assert.equal(result.status,'failed');assert.match(result.error,/stage-specific/);assert.equal(f.calls.some(row=>row.startsWith('create:')),false);assert.equal(f.store.state.active,null);
});
test('a fresh count drift between first inspection and create blocks the final slot',async()=>{
  const f=fixture({count:499}),original=f.provider.snapshot;f.provider.snapshot=async args=>{if(args.challenge.stage==='immediately-before-worker-create')f.workers.set('external-reservation',{id:'e'.repeat(32),name:'external-reservation',tags:[],versionId:null});return original(args);};const result=await f.execute();assert.equal(result.status,'failed');assert.match(result.error,/capacity/);assert.equal(f.calls.some(row=>row.startsWith('create:')),false);
});
test('malformed candidate and benchmark-only pack fail before any provider operation',async()=>{
  for(const change of [candidate=>({...candidate,packDigest:id('wrong')}),candidate=>({...candidate,benchmarkOnly:true})]){const f=fixture(),result=await f.execute(input(),{inspectCandidate:async request=>change(f.candidate(request))});assert.equal(result.status,'failed');assert.equal(f.calls.length,0);assert.equal(f.store.state.active,null);}
});
test('unavailable or excessive startup and a changed CPU cap block activation while preserving the owned reservation',async()=>{
  const changes=[row=>({...row,startupTimeMs:null}),row=>({...row,startupTimeMs:1001}),row=>({...row,startupTimeMs:-1}),row=>({...row,cpuLimitMs:50000}),row=>({...row,requestedCpuLimitMs:50000})];
  for(const change of changes){
    const f=fixture(),original=f.provider.upload;f.provider.upload=async options=>change(await original(options));const result=await f.execute();
    assert.equal(result.status,'needs-reconciliation');assert.equal(result.claimRetained,true);assert.match(result.error,/startup|CPU limit/);assert.equal(f.calls.includes('activate'),false);assert.equal(f.calls.includes('route'),false);assert.equal(f.workers.size,101);
    const events=f.store.state.requests[input().id].events;assert.ok(events.some(row=>row.kind==='worker-upload-observed'&&row.versionId));assert.equal(events.some(row=>row.kind==='activate-version-intent'),false);assert.ok(f.store.state.active);
  }
});
test('measured startup accepts zero and the1000ms ceiling without raising the requested CPU cap',async()=>{
  for(const startupTimeMs of [0,1000]){const f=fixture(),original=f.provider.upload;f.provider.upload=async options=>({...await original(options),startupTimeMs});const result=await f.execute();assert.equal(result.status,'deployed');assert.equal(result.receipt.runtime.startupTimeMs,startupTimeMs);assert.equal(result.receipt.runtime.cpuLimitMs,30000);}
});
test('unknown create outcome retains durable claim and blocks another executor',async()=>{
  const f=fixture();f.provider.createWorker=async()=>{throw Error('Connection lost after sending create');};const result=await f.execute();assert.equal(result.status,'needs-reconciliation');assert.equal(result.claimRetained,true);assert.ok(f.store.state.active);await enqueuePackDeployments(f.store,[input('dealer-two')]);assert.equal((await claimPackDeployment(f.store,{owner:'another-runner'})).value.claimed,false);
});
test('a missing route after known upload retains ownership intent for recovery',async()=>{
  const f=fixture();f.provider.createRoute=async()=>{throw Error('Unknown route write outcome');};const result=await f.execute();assert.equal(result.status,'needs-reconciliation');assert.equal(f.workers.size,101);const events=f.store.state.requests[input().id].events;assert.ok(events.some(row=>row.kind==='worker-create-observed'&&row.workerId));assert.ok(events.some(row=>row.kind==='worker-upload-observed'&&row.versionId));
});
test('hosted failure keeps a complete own receipt and allows unrelated packs to continue',async()=>{
  const f=fixture();const bad=await f.execute(input(),{verifyHosted:async options=>({...f.hosted(options),success:false})});assert.equal(bad.status,'failed');assert.equal(bad.requestId,input().id);assert.equal(bad.requestId,bad.receipt.requestId);assert.equal(bad.receipt.hostedVerified,false);assert.ok(f.store.state.receipts['dealer-one']);assert.equal(f.store.state.active,null);assert.equal((await f.execute(input('dealer-two'))).status,'deployed');
});
test('pre-provider materialization failure identifies its exact terminal request and releases the claim',async()=>{
  const f=fixture(),request=input(),result=await f.execute(request,{inspectCandidate:async()=>{throw Error('Immutable artifact download timed out');}});
  assert.equal(result.status,'failed');assert.equal(result.requestId,request.id);assert.equal(result.claimRetained,false);assert.equal(result.receipt,undefined);
  assert.deepEqual(f.calls,[]);assert.equal(f.store.state.active,null);assert.equal(f.store.state.requests[request.id].status,'failed');
  assert.deepEqual(f.store.state.requests[request.id].events.map(row=>row.kind),['claimed','failed']);
  assert.equal((await f.execute(input('dealer-two'))).status,'deployed');assert.equal(f.store.state.requests[request.id].status,'failed');
});
test('successful GET cannot finalize a deployment when any design lacks or fails HEAD evidence',async()=>{
  const mutations=[row=>{delete row.headStatus;delete row.headHttpStatus;},row=>{row.headStatus='failed';},row=>{row.headHttpStatus=500;}];
  for(const mutate of mutations){
    const f=fixture(),result=await f.execute(input(),{verifyHosted:async options=>{const report=f.hosted(options);mutate(report.designs[0]);return report;}});
    assert.equal(result.status,'failed');assert.match(result.error,/HEAD/);assert.equal(result.receipt.hostedVerified,false);assert.equal(result.receipt.hosted,undefined);
    assert.equal(f.store.state.requests[input().id].status,'failed');assert.equal(f.store.state.receipts['dealer-one'][0].receipt.hostedVerified,false);assert.equal(f.store.state.active,null);
  }
});
test('rollback restores only an earlier same-pack hosted-qualified version and preserves the route/count',async()=>{
  const f=fixture(),first=await f.execute();await f.execute(input('dealer-one',{outputDigest:id('second')}));const original=f.store.state.receipts['dealer-one'][0],request=input('dealer-one',{action:'rollback',outputDigest:id('second'),rollbackTo:original.sha256});const result=await f.execute(request);assert.equal(result.status,'rolled-back');assert.equal(result.receipt.versionId,first.receipt.versionId);assert.equal(f.workers.size,101);assert.equal(f.routes.length,1);
});
test('rollback refuses a receipt from a different dealer',async()=>{
  const f=fixture();await f.execute();await f.execute(input('dealer-two'));const other=f.store.state.receipts['dealer-two'][0];const result=await f.execute(input('dealer-one',{action:'rollback',rollbackTo:other.sha256}));assert.equal(result.status,'failed');assert.match(result.error,/earlier owned/);assert.equal(f.calls.includes('rollback'),false);
});
test('negative provider read cannot release an unacknowledged create',async()=>{
  const f=fixture();f.provider.createWorker=async()=>{throw Error('in-flight');};await f.execute();await assert.rejects(()=>recoverPackClaim(f.store,{requestId:input().id,ownerStopped:{verified:true,kind:'completed-github-run',evidence:'Actual run terminal status'},readOutcome:async()=>({verified:true,requestId:input().id,evidence:'authenticated-cloudflare-api',observedAt:now,outcome:'absent'})}),/negative read/);assert.ok(f.store.state.active);
});
test('GitHub store uses Contents SHA CAS and reads large state through its immutable blob',async()=>{
  const f=fixture(),calls=[],sha='b'.repeat(40),content=Buffer.from(JSON.stringify(f.store.state)).toString('base64');const store=githubPackQueueStore({request:async request=>{calls.push(request);if(request.method==='PUT')return {status:409,body:{}};if(request.path.includes('/git/blobs/'))return {status:200,body:{sha,encoding:'base64',size:1024**2+1,content}};return {status:200,body:{type:'file',sha,size:1024**2+1,encoding:'none',content:''}};}});const read=await store.read();assert.equal(read.revision,sha);assert.equal(calls[1].path,'/repos/darkapoparka/cars/git/blobs/'+sha);assert.equal(await store.compareAndSwap(sha,read.state),false);assert.equal(calls[2].body.sha,sha);assert.equal(calls[2].body.branch,'cars-deploy-queue');
});
