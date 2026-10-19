import test from 'node:test';
import assert from 'node:assert/strict';
import {createHash} from 'node:crypto';
import {PACK_DEPLOY_ACCOUNT,PACK_DEPLOY_ZONE,PACK_QUEUE_REPOSITORY,createPackDeploymentQueue,packDeploymentRequest,enqueuePackDeployments,claimPackDeployment,queueDigest,validatePackQueue} from './lib/dealer-pack-queue.mjs';
import {executeQueuedPackDeployment,packHostedReceiptEvidence,validateHostedPackResult,packOwnershipTags} from './lib/dealer-pack-deployment.mjs';
import {reconcileOwnedPackCreation,observeStoppedPackExecutor} from './reconcile-dealer-pack-claim.mjs';

const when='2026-10-19T20:00:00.000Z',clock=()=>Date.parse(when),date=()=>when,sha=value=>createHash('sha256').update(value).digest('hex');
const keys=['auto-best','modern','import','app','mobile','karento-best'];
function recoveryFixture({fault='assets',count=100}={}){
  const policy={schemaVersion:1,kind:'cars-owner-authorized-pack-deployment',accountId:PACK_DEPLOY_ACCOUNT,zoneId:PACK_DEPLOY_ZONE,zoneName:'webpreviews.site',workersPlan:'paid',allowedScripts:500,minimumSpareScripts:0,ownerConfirmedPaid:true,allowNewPreviews:true,outreachApproved:false,authorizedAt:when,authorizationSource:'Owner M2 instruction on 19 October 2026',reason:'The owner authorizes 400 new previews and explicitly approves the zero-reserve final slot.',maximumNewDealers:400};
  const names=Array.from({length:count},(_,index)=>'cars-protected-'+index);
  let state=createPackDeploymentQueue({policy,baseline:{accountId:PACK_DEPLOY_ACCOUNT,zoneId:PACK_DEPLOY_ZONE,evidence:'authenticated-cloudflare-api',complete:true,observedAt:when,workerNames:names,routes:[],domains:[]},now:when,queueId:'11111111-1111-4111-8111-111111111111'}),revision=0,version=1;
  const store={async read(){return {state:structuredClone(state),revision:String(revision)};},async compareAndSwap(expected,next){if(expected!==String(revision))return false;state=structuredClone(next);revision++;return String(revision);},get state(){return structuredClone(state);},replace(next){state=structuredClone(next);revision++;},get revision(){return revision;}};
  const request=packDeploymentRequest({slug:'recovery-dealer',dealerId:'gb-birmingham-recovery-dealer',batch:1,workerName:'cars-recovery-dealer',publicOrigin:'https://recovery-dealer.webpreviews.site',packDigest:sha('pack'),releaseId:'cars-six-'+sha('release'),releaseDigest:sha('release'),outputDigest:sha('output'),sourceCommit:'a'.repeat(40)});
  const workers=new Map(names.map(name=>[name,{name,id:sha(name).slice(0,32),tags:[]}])) ,routes=[],calls=[],settings={fault,runStatus:'completed',runConclusion:'cancelled'};
  const provider={
    async snapshot({request:current,challenge}){
      calls.push('read:'+challenge.stage);const value=workers.get(current.workerName),active=value?.versionId;
      return {kind:'cars-live-pack-provider-snapshot',evidence:'authenticated-cloudflare-api',accountId:PACK_DEPLOY_ACCOUNT,zoneId:PACK_DEPLOY_ZONE,requestId:challenge.requestId,stage:challenge.stage,startedAt:challenge.notBefore,observedAt:when,complete:true,
        scripts:[...workers.values()].map(worker=>({name:worker.name,id:worker.id,tags:worker.tags})),scriptCount:workers.size,routes:structuredClone(routes),domains:[],target:value?{exists:true,workerName:value.name,workerId:value.id,tags:[...value.tags],versionId:active??null,versionTraffic:active?[{version_id:active,percentage:100}]:[],undeployed:!active,bindings:active?[{name:'ASSETS',type:'assets'}]:[],subdomain:{enabled:false,previews_enabled:false}}:{exists:false}};
    },
    async createWorker({request:current,ownershipTags}){calls.push('create');const value={id:sha(current.workerName).slice(0,32),name:current.workerName,tags:[...ownershipTags],versionId:null};workers.set(value.name,value);if(settings.fault==='create')throw Error('Create response was lost');return structuredClone(value);},
    async prepareAssets(){calls.push('assets');if(settings.fault==='assets')throw Error('Asset upload was interrupted');return {completionToken:'test-only-completion-token',manifestDigest:sha('assets'),assetFiles:1,uploadedFiles:1};},
    async upload({request:current,workerId}){calls.push('upload');if(settings.fault==='upload')throw Error('Version upload response was lost');const versionId=String(++version).padStart(8,'0')+'-2222-4222-8222-222222222222';return {workerId,workerName:current.workerName,versionId,startupTimeMs:12};},
    async activateVersion({request:current,versionId}){calls.push('activate');if(settings.fault==='activation-pending')throw Error('Activation may still be in flight');workers.get(current.workerName).versionId=versionId;if(settings.fault==='activation-applied')throw Error('Activation response was lost');},
    async disableSubdomain(){calls.push('subdomain');if(settings.fault==='subdomain')throw Error('Subdomain acknowledgement was interrupted');},
    async createRoute({request:current}){calls.push('route');if(settings.fault==='route-pending')throw Error('Route may still be in flight');const row={id:sha('route').slice(0,32),pattern:new URL(current.publicOrigin).hostname+'/*',script:current.workerName};routes.push(row);if(settings.fault==='route-applied')throw Error('Route response was lost');return row;},
    async rollbackVersion(){assert.fail('Creation recovery cannot invoke rollback');},
  };
  const candidate=current=>({verified:true,slug:current.slug,manifest:{pack:{}},packDigest:current.packDigest,releaseId:current.releaseId,releaseDigest:current.releaseDigest,outputDigest:current.outputDigest,sourceCommit:current.sourceCommit,
    sourceProof:{verified:true,repository:PACK_QUEUE_REPOSITORY,commit:current.sourceCommit,path:current.sourcePath},qa:{success:true,packDigest:current.packDigest,releaseDigest:current.releaseDigest,outputDigest:current.outputDigest}});
  const hosted=({request:current,receipt})=>({type:'cars-dealer-pack-hosted-qa',slug:current.slug,publicOrigin:current.publicOrigin,packDigest:current.packDigest,outputDigest:current.outputDigest,versionId:receipt.versionId,width:390,success:true,finishedAt:when,providerWrites:0,
    designs:keys.map(key=>({key,status:'passed',httpStatus:200,sixChoices:true,nameVisible:true,logoVisible:true,phoneStatus:'passed',foreignIdentityCount:0}))});
  const readGithub=async operation=>{assert.equal(operation.method,'GET');assert.equal(operation.path,'/repos/'+PACK_QUEUE_REPOSITORY+'/actions/runs/42');return {status:200,body:{id:42,repository:{full_name:PACK_QUEUE_REPOSITORY},status:settings.runStatus,conclusion:settings.runConclusion}};};
  const execute=async()=>{await enqueuePackDeployments(store,[request],{now:date});const claimed=await claimPackDeployment(store,{owner:'github:42',requestId:request.id,now:date});assert.equal(claimed.value.claimed,true);return executeQueuedPackDeployment({store,claim:claimed.value.claim,provider,registry:[],inspectCandidate:async current=>candidate(current),verifyHosted:async options=>hosted(options),now:clock});};
  const reconcile=options=>reconcileOwnedPackCreation({store,provider,requestId:request.id,readGithub,registry:[],now:clock,...options});
  return {store,request,workers,routes,calls,settings,provider,execute,reconcile,readGithub};
}

test('confirmed create plus interrupted assets resumes at the 500th slot without a second create',async()=>{
  const f=recoveryFixture({count:499}),initial=await f.execute();assert.equal(initial.status,'needs-reconciliation');assert.equal(f.workers.size,500);
  const before=f.store.revision,writes=f.calls.filter(row=>!row.startsWith('read:')).length,inspection=await f.reconcile({write:false});
  assert.equal(inspection.status,'ready-to-resume');assert.equal(inspection.providerWrites,0);assert.equal(f.store.revision,before);assert.equal(f.calls.filter(row=>!row.startsWith('read:')).length,writes);
  const queued=await f.reconcile({write:true});assert.equal(queued.status,'queued');assert.equal(queued.providerWrites,0);assert.equal(f.store.state.active,null);assert.equal(f.store.state.requests[f.request.id].status,'queued');
  f.settings.fault=null;const resumed=await f.execute();assert.equal(resumed.status,'deployed');assert.equal(resumed.receipt.mode,'resume-owned-create');assert.equal(resumed.receipt.counts.before,500);assert.equal(resumed.receipt.counts.after,500);assert.equal(resumed.receipt.hostedVerified,true);assert.equal(f.calls.filter(row=>row==='create').length,1);assert.equal(f.routes.length,1);
});

test('an unacknowledged non-activating version upload can safely resume its saved reservation',async()=>{
  const f=recoveryFixture({fault:'upload'});assert.equal((await f.execute()).status,'needs-reconciliation');const event=f.store.state.requests[f.request.id].events.find(row=>row.kind==='worker-upload-intent');assert.equal(event.deploy,false);
  assert.equal((await f.reconcile({write:true})).status,'queued');f.settings.fault=null;assert.equal((await f.execute()).status,'deployed');assert.equal(f.calls.filter(row=>row==='create').length,1);
});

test('a running old executor prevents reconciliation before any provider observation',async()=>{
  const f=recoveryFixture();await f.execute();f.settings.runStatus='in_progress';f.settings.runConclusion=null;const before=f.calls.length,revision=f.store.revision;
  await assert.rejects(()=>f.reconcile({write:true}),/not confirmed completed/);assert.equal(f.calls.length,before);assert.equal(f.store.revision,revision);assert.ok(f.store.state.active);
});

test('same-name replacement, missing ownership tag, and foreign version are independently refused',async()=>{
  for(const change of [worker=>{worker.id='f'.repeat(32);},worker=>{worker.tags=worker.tags.filter(tag=>!tag.startsWith('cars-request-'));},worker=>{worker.versionId='ffffffff-ffff-4fff-8fff-ffffffffffff';}]){
    const f=recoveryFixture();await f.execute();change(f.workers.get(f.request.workerName));const revision=f.store.revision;
    await assert.rejects(()=>f.reconcile({write:true}),/identity changed|ownership tags|positively matched/);assert.equal(f.store.revision,revision);assert.ok(f.store.state.active);
  }
});

test('a same-name tagged Worker with no acknowledged immutable create ID stays blocked',async()=>{
  const f=recoveryFixture({fault:'create'});await f.execute();assert.ok(f.workers.has(f.request.workerName));const before=f.calls.length;
  await assert.rejects(()=>f.reconcile({write:true}),/no unique acknowledged immutable Worker ID/);assert.equal(f.calls.length,before);assert.ok(f.store.state.active);
});

test('negative activation and route observations cannot release possibly in-flight writes',async()=>{
  for(const fault of ['activation-pending','route-pending']){const f=recoveryFixture({fault});await f.execute();await assert.rejects(()=>f.reconcile({write:true}),/possibly in-flight/);assert.ok(f.store.state.active);}
});

test('positive exact applied activation or route proof resumes only the owned creation',async()=>{
  for(const fault of ['activation-applied','route-applied']){const f=recoveryFixture({fault});await f.execute();assert.equal((await f.reconcile({write:true})).status,'queued');f.settings.fault=null;
    const result=await f.execute();assert.equal(result.status,'deployed',result.error);assert.equal(result.receipt.hostedVerified,true);assert.equal(f.calls.filter(row=>row==='create').length,1);assert.equal(f.routes.length,1);assert.equal(f.workers.size,101);}
});

test('another interruption after a resumed version still preserves the already-owned route',async()=>{
  const f=recoveryFixture({fault:'route-applied'});await f.execute();await f.reconcile({write:true});const routeId=f.routes[0].id;
  f.settings.fault='subdomain';assert.equal((await f.execute()).status,'needs-reconciliation');
  assert.equal((await f.reconcile({write:true})).status,'queued');f.settings.fault=null;const result=await f.execute();
  assert.equal(result.status,'deployed',result.error);assert.equal(result.receipt.routeId,routeId);assert.equal(f.routes.length,1);assert.equal(f.calls.filter(row=>row==='create').length,1);
});

test('stale snapshots and claim changes cannot mutate the recovery queue',async()=>{
  const stale=recoveryFixture();await stale.execute();const original=stale.provider.snapshot;stale.provider.snapshot=async options=>({...await original(options),startedAt:'2020-01-01T00:00:00.000Z',observedAt:'2020-01-01T00:00:00.000Z'});
  await assert.rejects(()=>stale.reconcile({write:true}),/Cached or stale/);assert.ok(stale.store.state.active);
  const race=recoveryFixture();await race.execute();const current=race.provider.snapshot;race.provider.snapshot=async options=>{const result=await current(options),state=race.store.state;state.active.owner='github:777';race.store.replace(state);return result;};
  await assert.rejects(()=>race.reconcile({write:true}),/Claim changed/);assert.equal(race.store.state.active.owner,'github:777');
});

test('legacy upload metadata without explicit deploy:false cannot be auto-resumed',async()=>{
  const f=recoveryFixture({fault:'upload'});await f.execute();const state=f.store.state;delete state.requests[f.request.id].events.find(row=>row.kind==='worker-upload-intent').deploy;f.store.replace(state);
  await assert.rejects(()=>f.reconcile({write:true}),/without deploy:false/);assert.ok(f.store.state.active);
});

test('tampered resume proof is refused before the executor performs provider operations',async()=>{
  const f=recoveryFixture();await f.execute();await f.reconcile({write:true});const state=f.store.state;state.requests[f.request.id].resume.resume.workerId='f'.repeat(32);state.requests[f.request.id].resume.sha256=queueDigest(state.requests[f.request.id].resume.resume);f.store.replace(state);
  const before=f.calls.length;f.settings.fault=null;const result=await f.execute();assert.equal(result.status,'failed');assert.match(result.error,/reconciliation evidence/);assert.equal(f.calls.length,before);
});

test('connector recovery has no unauthenticated PID or force-unlock fallback',async()=>{
  const claim={owner:'connector:m2-pilot',claimedAt:when};await assert.rejects(()=>observeStoppedPackExecutor({claim,now:clock}),/process.*verifier/);
  await assert.rejects(()=>observeStoppedPackExecutor({claim,now:clock,verifyStoppedConnector:async()=>({verified:true,owner:claim.owner,kind:'stopped-connector-executor',observedAt:when,evidence:'A supplied assertion alone is insufficient'})}),/identity or stopped-state/);
  const result=await observeStoppedPackExecutor({claim,now:clock,verifyStoppedConnector:async({challenge})=>({verified:true,owner:claim.owner,kind:'stopped-connector-executor',challengeId:challenge.id,observedAt:when,evidence:'Maintained verifier confirmed exact saved process start identity is stopped'})});assert.equal(result.kind,'stopped-connector-executor');
});

test('400 full artifact locators and accepted hosted summaries fit below the 16 MiB queue bound',async t=>{
  const f=recoveryFixture({fault:null}),successful=await f.execute(),sample=f.store.state.requests[f.request.id],state=f.store.state;
  state.order=[];state.requests={};state.receipts={};state.active=null;
  const slugs=Array.from({length:400},(_,index)=>('queue-size-'+String(index).padStart(3,'0')+'-').padEnd(43,'x'));
  let largestFullReport=0;
  for(const [index,slug] of slugs.entries()){
    const runId=40012345000+Math.floor(index/100),prefix='dealer-pack-transport--'+runId+'--lane-'+(index%7+1),sourceCommit=sha('source'+Math.floor(index/100)).slice(0,40);
    const request=packDeploymentRequest({...f.request,slug,dealerId:'gb-birmingham-'+slug,batch:Math.floor(index/100)+1,workerName:'cars-'+slug,publicOrigin:'https://'+slug+'.webpreviews.site',packDigest:sha('pack'+index),outputDigest:sha('output'+index),sourceCommit,
      buildArtifact:{runId,artifactId:80012345000+index,name:prefix+'--manifest',digest:'sha256:'+sha('manifest-archive'+index),bytes:32*1024**2,sourceCommit,prefix,manifestSha256:sha('manifest'+index),
        shards:Array.from({length:8},(_,shard)=>({index:shard,id:90012345000+index*8+shard,name:prefix+'--shard-'+shard,digest:'sha256:'+sha('shard'+index+':'+shard),bytes:350*1024**2}))}});
    const workerId=sha('worker'+index).slice(0,32),versionId=String(index+1).padStart(8,'0')+'-2222-4222-8222-222222222222',routeId=sha('route'+index).slice(0,32),ownershipTags=packOwnershipTags(state,request);
    const full={...successful.receipt.hosted.report,slug,publicOrigin:request.publicOrigin,packDigest:request.packDigest,outputDigest:request.outputDigest,versionId,language:'en',startedAt:when,finishedAt:when,
      identityCoverage:{registryDealers:100,totalIdentities:500,packDealers:400,packSlugs:slugs,packFactsDiagnostics:[],withName:100,withBusinessFacts:100,withPublicIdentityEvidence:100,withPhone:0,missingBusinessFacts:[],missingPublicPhone:slugs.slice(0,100)},
      routes:keys.flatMap(key=>['home','contact'].map(label=>({key,label,status:'passed',width:390,httpStatus:200,url:request.publicOrigin+'/'+key+'/'+label,findings:[],leaks:[],identity:{policy:'explicit-route',required:{name:label==='home',logo:label==='home',phone:label==='contact'},observed:{name:true,logo:true,phone:true},phoneProvided:true},phone:'observed',demoStock:false,disclosureObserved:false,title:'Business preview '+slug}))),
      screenshots:keys.map(key=>({key,width:390,file:'/home/runner/work/cars/cars/runtime/dealer-pack-hosted/'+slug+'/screenshots/'+key+'-390-hosted.png',sha256:sha(slug+key)})),scope:'Synthetic size fixture: accepted gate shape, 400 identity names, six screenshot locators and twelve route observations. No live measurement is claimed.'};
    const original=JSON.stringify(full);validateHostedPackResult(full,request,versionId);const hosted=packHostedReceiptEvidence(full);
    assert.equal(JSON.stringify(full),original);assert.equal(hosted.sha256,queueDigest(full));assert.equal(hosted.summarySha256,queueDigest(hosted.report));assert.equal(hosted.reportScope,'compact-acceptance-summary');assert.equal(hosted.report.routes,undefined);assert.equal(hosted.report.screenshots,undefined);assert.equal(hosted.report.identityCoverage.packSlugs,undefined);assert.equal(hosted.report.identityCoverage.packDealers,400);assert.equal(hosted.report.identityCoverage.sha256,queueDigest(full.identityCoverage));validateHostedPackResult(hosted.report,request,versionId);
    largestFullReport=Math.max(largestFullReport,Buffer.byteLength(original));
    const base={...successful.receipt,requestId:request.id,slug,dealerId:request.dealerId,batch:request.batch,workerName:request.workerName,publicOrigin:request.publicOrigin,packDigest:request.packDigest,outputDigest:request.outputDigest,sourceCommit,workerId,versionId,routeId,ownershipTags,hostedVerified:false,
      sourceProof:{verified:true,evidence:'authenticated-github-commit-and-exact-git-blob-bytes',repository:PACK_QUEUE_REPOSITORY,commit:sourceCommit,path:request.sourcePath,sourceTree:sha('tree'+index).slice(0,40),sourceTreeSha256:sha('source-tree'+index),inputFiles:23,observedAt:when,mainReachabilityClaimed:false},
      counts:{before:100+index,after:101+index,allowed:500,minimumSpareScripts:0,beforeObservedAt:when,afterObservedAt:when},resources:{bindings:[{name:'ASSETS',type:'assets'}],subdomain:{enabled:false,previews_enabled:false},route:{id:routeId,pattern:new URL(request.publicOrigin).hostname+'/*',script:request.workerName}}};
    delete base.hosted;const receipt={...base,hostedVerified:true,hosted},envelope={sha256:queueDigest(receipt),receipt};
    const events=sample.events.map(event=>{const row=structuredClone(event);for(const key of ['workerName','workerId','versionId','routeId','ownershipTags'])if(row[key]!==undefined)row[key]=base[key];if(row.pattern)row.pattern=new URL(request.publicOrigin).hostname+'/*';if(row.script)row.script=request.workerName;if(row.receipt)row.receipt=base;return row;});
    state.order.push(request.id);state.requests[request.id]={request,status:'deployed',queuedAt:when,finishedAt:when,events,receiptSha256:envelope.sha256};state.receipts[slug]=[envelope];
  }
  validatePackQueue(state);const serializedBytes=Buffer.byteLength(JSON.stringify(state,null,2)+'\n');
  assert.ok(serializedBytes<12*1024**2,'Reserve at least 4 MiB under the 16 MiB queue bound for recovery and pilot rollback history: '+serializedBytes);
  t.diagnostic(JSON.stringify({fixture:'synthetic-scale-bound-not-hosted-measurement',requests:400,shardsPerRequest:8,fullIdentityCoveragePerReport:400,serializedQueueBytes:serializedBytes,queueLimitBytes:16*1024**2,remainingBytes:16*1024**2-serializedBytes,largestFullReportBytes:largestFullReport}));
});
