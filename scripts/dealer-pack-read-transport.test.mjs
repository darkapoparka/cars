import test from 'node:test';
import assert from 'node:assert/strict';
import {cloudflarePackProvider,tokenCloudflareTransport,PACK_API_READ_RETRY} from './lib/dealer-pack-cloudflare.mjs';
import {PACK_DEPLOY_ACCOUNT,PACK_DEPLOY_ZONE} from './lib/dealer-pack-queue.mjs';

const token='private-test-account-token-never-log';
const account='/accounts/'+PACK_DEPLOY_ACCOUNT,zone='/zones/'+PACK_DEPLOY_ZONE;
const request={slug:'dealer-one',workerName:'cars-dealer-one',publicOrigin:'https://dealer-one.webpreviews.site'};
const deployments=account+'/workers/scripts/'+request.workerName+'/deployments';
const workerId='b'.repeat(32),versionId='11111111-2222-4333-8444-555555555555';
const clock='2026-10-21T06:19:16.000Z';
const response=(status=200,result={ok:true},extra={})=>({status,json:async()=>({success:status>=200&&status<300,result,...extra})});
const socketFailure=(code='ECONNRESET')=>new TypeError('fetch failed',{cause:Object.assign(Error('Authorization: Bearer '+token),{code})});
function harness(fetch){
  const calls=[],waits=[],diagnostics=[];let tick=0;
  const transport=tokenCloudflareTransport({token,fetchImpl:async(url,options)=>{calls.push({url:String(url),options});return fetch(url,options,calls.length);},readRetryWait:async delay=>{waits.push(delay);},transportDiagnostic:row=>diagnostics.push(row),transportClock:()=>tick+=17});
  return {transport,calls,waits,diagnostics};
}
const get=transport=>transport({method:'GET',path:deployments,query:{page:2,per_page:100}});

test('a transient deployment-read500 is retried as the same fresh GET with sanitized bounded diagnostics',async()=>{
  const h=harness((_url,_options,attempt)=>attempt===1?response(500,null,{errors:[{message:token}]}):response(200,{deployment:'actual-id'},{result_info:{total_count:1}}));
  const result=await get(h.transport);
  assert.deepEqual(result,{success:true,result:{deployment:'actual-id'},result_info:{total_count:1},status:200});
  assert.equal(h.calls.length,2);assert.equal(h.calls[0].url,h.calls[1].url);
  assert.match(h.calls[0].url,/page=2&per_page=100$/);
  for(const {options} of h.calls){assert.equal(options.method,'GET');assert.equal(options.body,undefined);assert.equal(options.headers.Authorization,'Bearer '+token);assert(options.signal instanceof AbortSignal);}
  assert.notEqual(h.calls[0].options.signal,h.calls[1].options.signal);
  assert.deepEqual(h.waits,[1000]);assert.equal(h.diagnostics.length,1);
  assert.deepEqual(h.diagnostics[0],{type:'cars-pack-api-read-retry',operation:'workers-api-read',method:'GET',attempt:1,maximumAttempts:3,errorName:'Error',causeCodes:[],elapsedMs:17,timeoutMs:30000,responseStatus:500,retryInMs:1000});
  assert(!JSON.stringify(h.diagnostics).includes(token));assert(!JSON.stringify(h.diagnostics).includes('https:'));
});

test('only the four selected transient HTTP statuses retry, with three total attempts and no accepted failure payload',async()=>{
  assert.deepEqual(PACK_API_READ_RETRY,{attempts:3,timeoutMs:30000,delaysMs:[1000,2000],statuses:[500,502,503,504]});
  assert(Object.isFrozen(PACK_API_READ_RETRY)&&Object.isFrozen(PACK_API_READ_RETRY.delaysMs)&&Object.isFrozen(PACK_API_READ_RETRY.statuses));
  for(const status of [500,502,503,504]){
    const h=harness(()=>response(status,{shouldNotBeAccepted:true},{success:true}));
    const result=await get(h.transport);
    assert.equal(result.status,status,'The existing caller must still reject the terminal non2xx response');
    assert.equal(h.calls.length,3);assert.deepEqual(h.waits,[1000,2000]);
    assert.deepEqual(h.diagnostics.map(r=>[r.attempt,r.responseStatus]),[[1,status],[2,status]]);
  }
});

test('transient status remains retryable when the server sends HTML or loses its error body',async()=>{
  for(const error of [new SyntaxError('private HTML '+token),socketFailure('UND_ERR_SOCKET')]){
    const h=harness((_url,_options,attempt)=>attempt<3?{status:502,json:async()=>{throw error;}}:response());
    assert.equal((await get(h.transport)).status,200);assert.equal(h.calls.length,3);assert.deepEqual(h.waits,[1000,2000]);
    assert(h.diagnostics.every(d=>d.responseStatus===502));assert(!JSON.stringify(h.diagnostics).includes(token));
  }
});

test('auth, validation, conflict, rate-limit and other unselected HTTP statuses are never retried',async()=>{
  for(const status of [400,401,403,404,408,409,422,429,501,505]){
    const h=harness(()=>response(status,null,{errors:[{message:token}]}));
    assert.equal((await get(h.transport)).status,status);assert.equal(h.calls.length,1);assert.deepEqual(h.waits,[]);assert.deepEqual(h.diagnostics,[]);
  }
  const invalid=harness(()=>response(200,null,{success:false,errors:[{code:10000,message:'Authentication error '+token}]}));
  assert.equal((await get(invalid.transport)).success,false);assert.equal(invalid.calls.length,1);assert.deepEqual(invalid.waits,[]);
});

test('an explicit auth or validation refusal cannot become retryable through a subsequent socket failure',async()=>{
  for(const status of [400,401,403,404,409,422,429,501,505]){
    const h=harness(()=>({status,json:async()=>{throw socketFailure();}}));
    await assert.rejects(()=>get(h.transport),error=>error.name==='PackProviderTransportError'&&error.transport.responseStatus===status&&!error.message.includes(token));
    assert.equal(h.calls.length,1);assert.deepEqual(h.waits,[]);assert.deepEqual(h.diagnostics,[]);
  }
});

test('recognized network loss and own-request timeout get a fresh bounded GET but arbitrary local errors do not',async()=>{
  for(const error of [socketFailure(),socketFailure('UND_ERR_CONNECT_TIMEOUT'),new TypeError('fetch failed'),new DOMException('private timeout '+token,'TimeoutError')]){
    const h=harness((_url,_options,attempt)=>{if(attempt===1)throw error;return response();});
    assert.equal((await get(h.transport)).status,200);assert.equal(h.calls.length,2);assert.deepEqual(h.waits,[1000]);
    assert(h.diagnostics.every(d=>d.method==='GET'&&d.maximumAttempts===3&&d.timeoutMs===30000));assert(!JSON.stringify(h.diagnostics).includes(token));
  }
  for(const error of [new TypeError('invalid URL '+token),new Error('claim fence rejected '+token),new SyntaxError('invalid JSON '+token)]){
    const h=harness(()=>{throw error;});await assert.rejects(()=>get(h.transport),e=>!e.message.includes(token));assert.equal(h.calls.length,1);assert.deepEqual(h.waits,[]);
  }
});

test('successful HTTP body socket loss can retry, while malformed successful JSON remains a terminal validation error',async()=>{
  const h=harness((_url,_options,attempt)=>attempt===1?{status:200,json:async()=>{throw socketFailure('UND_ERR_BODY_TIMEOUT');}}:response());
  assert.equal((await get(h.transport)).status,200);assert.equal(h.calls.length,2);assert.deepEqual(h.diagnostics[0].causeCodes,['UND_ERR_BODY_TIMEOUT']);
  const malformed=harness(()=>({status:200,json:async()=>{throw new SyntaxError('private JSON '+token);}}));
  await assert.rejects(()=>get(malformed.transport),error=>error.transport.responseStatus===200&&error.transport.errorName==='SyntaxError'&&!error.message.includes(token));
  assert.equal(malformed.calls.length,1);assert.deepEqual(malformed.waits,[]);
});

test('exhausted GET transport retries remain an unknown outcome with sanitized final metadata',async()=>{
  const h=harness(()=>{throw socketFailure('EPIPE');});
  await assert.rejects(()=>get(h.transport),error=>{
    assert.equal(error.name,'PackProviderTransportError');assert.equal(error.providerOutcomeKnown,undefined);assert.equal(error.cause,undefined);
    assert.deepEqual(error.transport,{operation:'workers-api-read',method:'GET',attempt:3,maximumAttempts:3,errorName:'TypeError',causeCodes:['EPIPE'],elapsedMs:17,timeoutMs:30000,responseStatus:null});
    assert(!error.message.includes(token));return true;
  });
  assert.equal(h.calls.length,3);assert.deepEqual(h.waits,[1000,2000]);
});

test('all API mutation methods remain single-attempt for500, malformed bodies and ambiguous transport loss',async()=>{
  for(const method of ['POST','PUT','PATCH','DELETE'])for(const failure of ['status','body','network']){
    const h=harness(()=>{if(failure==='network')throw socketFailure();return failure==='body'?{status:500,json:async()=>{throw socketFailure();}}:response(500);});
    const call=()=>h.transport({method,path:account+'/workers/workers',body:{private:token}});
    if(failure==='status')assert.equal((await call()).status,500);
    else await assert.rejects(call,error=>{assert.equal(error.transport.attempt,1);assert.equal(error.transport.maximumAttempts,1);assert.equal(error.transport.timeoutMs,180000);assert.equal(error.providerOutcomeKnown,undefined);assert(!error.message.includes(token));return true;});
    assert.equal(h.calls.length,1);assert.deepEqual(h.waits,[]);assert.deepEqual(h.diagnostics,[]);
  }
});

function snapshotFixture({deploymentFailures=1}={}){
  const worker={id:workerId,name:request.workerName,tags:['cars-pack-v1'],deployed_on:clock,subdomain:{enabled:false,previews_enabled:false}};let reads=0;
  const h=harness(url=>{
    const endpoint=url.pathname.slice('/client/v4'.length);
    if(endpoint===account+'/workers/workers')return response(200,[worker],{result_info:{total_count:1,total_pages:1}});
    if(endpoint===zone+'/workers/routes')return response(200,[{id:'route-owned',pattern:'dealer-one.webpreviews.site/*',script:request.workerName}]);
    if(endpoint===account+'/workers/domains')return response(200,[]);
    if(endpoint===account+'/workers/workers/'+workerId)return response(200,worker);
    if(endpoint===deployments){reads++;return reads<=deploymentFailures?response(500):response(200,[{id:'deployment-owned',created_on:clock,versions:[{version_id:versionId,percentage:100}]}]);}
    if(endpoint===account+'/workers/workers/'+workerId+'/versions/'+versionId)return response(200,{id:versionId,bindings:[{name:'ASSETS',type:'assets'}],limits:{cpu_ms:30000}});
    assert.fail('Unexpected endpoint');
  });
  return {...h,provider:cloudflarePackProvider({api:h.transport,now:()=>clock}),get deploymentReads(){return reads;}};
}

test('post-route snapshot recovers deployment-read500 using fresh GETs and retains exact Worker/version/route evidence',async()=>{
  const h=snapshotFixture();
  const snapshot=await h.provider.snapshot({request,challenge:{requestId:'fresh-challenge',stage:'after-route',notBefore:clock}});
  assert.equal(snapshot.complete,true);assert.equal(snapshot.scriptCount,1);assert.equal(snapshot.target.workerId,workerId);assert.equal(snapshot.target.versionId,versionId);
  assert.equal(snapshot.routes[0].id,'route-owned');assert.equal(snapshot.routes[0].script,request.workerName);assert.equal(snapshot.requestId,'fresh-challenge');assert.equal(snapshot.stage,'after-route');
  assert.equal(h.deploymentReads,2);assert(h.calls.every(c=>c.options.method==='GET'));assert.deepEqual(h.waits,[1000]);
});

test('exhausted post-route deployment reads still fail the snapshot and require reconciliation without any provider write',async()=>{
  const h=snapshotFixture({deploymentFailures:99});
  await assert.rejects(()=>h.provider.snapshot({request,challenge:{requestId:'fresh-challenge',stage:'after-route',notBefore:clock}}),error=>/deployment read failed \(500\); reconcile any unknown write outcome/.test(error.message)&&error.providerOutcomeKnown===undefined);
  assert.equal(h.deploymentReads,3);assert(h.calls.every(c=>c.options.method==='GET'));assert.deepEqual(h.waits,[1000,2000]);
  assert(!h.calls.some(c=>c.url.includes('/versions/')),'No version evidence may be invented after deployment read exhaustion');
});

test('pre-activation identity read may recover but the activation POST itself cannot be replayed',async()=>{
  let reads=0,posts=0;
  const h=harness((_url,options)=>{if(options.method==='GET'){reads++;return reads===1?response(503):response(200,{id:workerId,name:request.workerName});}posts++;throw socketFailure();});
  const provider=cloudflarePackProvider({api:h.transport});
  await assert.rejects(()=>provider.activateVersion({request,workerId,versionId}),error=>error.transport.operation==='worker-activation'&&error.transport.attempt===1&&error.providerOutcomeKnown===undefined);
  assert.equal(reads,2);assert.equal(posts,1);assert.deepEqual(h.waits,[1000]);
  assert(h.diagnostics.every(d=>d.method==='GET'));
});

test('scope refusals happen before any retryable network request',async()=>{
  const h=harness(()=>{throw socketFailure();});
  await assert.rejects(()=>h.transport({method:'GET',path:'/accounts/'+PACK_DEPLOY_ACCOUNT+'/billing/profile'}),/scope/);
  await assert.rejects(()=>h.transport({method:'GET',path:'/zones/foreign/workers/routes'}),/scope/);
  assert.equal(h.calls.length,0);assert.deepEqual(h.waits,[]);assert.deepEqual(h.diagnostics,[]);
});
