import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import {createHash} from 'node:crypto';
import {cloudflarePackProvider,packAssetManifest,packProviderTransportFailure,PACK_ASSET_TRANSPORT_RETRY,tokenCloudflareTransport} from './lib/dealer-pack-cloudflare.mjs';
import {PACK_DEPLOY_ACCOUNT,packDeploymentRequest} from './lib/dealer-pack-queue.mjs';

const hash=value=>createHash('sha256').update(value).digest('hex');
const request=packDeploymentRequest({slug:'dealer-one',dealerId:'gb-london-dealer-one',batch:1,workerName:'cars-dealer-one',publicOrigin:'https://dealer-one.webpreviews.site',packDigest:hash('pack'),releaseId:'cars-six-current',releaseDigest:hash('release'),outputDigest:hash('output'),sourceCommit:'a'.repeat(40)});
const token='test-session-private-never-report',completion='test-completion-private-never-report';
const ok=(result,status=200)=>({status,success:true,result});
const response=(status=201,jwt=completion)=>({status,json:async()=>({success:status<300,result:jwt?{jwt}:{}})});
const socketFailure=(code='ECONNRESET')=>new TypeError('fetch failed',{cause:Object.assign(Error('private body '+token),{code})});
function fixture(t,count=1){
  const directory=fs.mkdtempSync(path.join(os.tmpdir(),'cars-pack-transport-'));t.after(()=>fs.rmSync(directory,{recursive:true,force:true}));
  const files=[];
  for(let index=0;index<count;index++){const name='public/asset-'+index+'.txt',bytes=Buffer.from('Sealed exact bytes '+index),file=path.join(directory,name);fs.mkdirSync(path.dirname(file),{recursive:true});fs.writeFileSync(file,bytes);files.push({path:name,bytes:bytes.length,sha256:hash(bytes)});}
  const candidate={directory,files},assets=packAssetManifest(candidate),keys=[...assets.byHash.keys()],buckets=keys.map(key=>[key]),operations=[],calls=[],waits=[],diagnostics=[];let fences=0;
  const api=async operation=>{operations.push(operation);assert.equal(operation.path,'/accounts/'+PACK_DEPLOY_ACCOUNT+'/workers/scripts/'+request.workerName+'/assets-upload-session');return ok({jwt:token,buckets});};
  const assetFetch=async(url,options)=>{calls.push({url,options});return response();};
  const assetRetryWait=async ms=>{waits.push(ms);},transportDiagnostic=value=>diagnostics.push(value),beforeWrite=async()=>{fences++;};
  return {candidate,assets,keys,buckets,operations,calls,waits,diagnostics,api,assetFetch,assetRetryWait,transportDiagnostic,beforeWrite,get fences(){return fences;}};
}
const prepare=(f,overrides={})=>cloudflarePackProvider({...f,...overrides}).prepareAssets({candidate:f.candidate,request,beforeWrite:overrides.beforeWrite??f.beforeWrite});
function deferred(){let resolve,reject;const promise=new Promise((yes,no)=>{resolve=yes;reject=no;});return {promise,resolve,reject};}
const nextTurn=()=>new Promise(resolve=>setImmediate(resolve));

test('lost transport acknowledgement retries only the same exact bucket/session with a new claim fence and payload',async t=>{
  const f=fixture(t),fetch=f.assetFetch;let first=true;
  const result=await prepare(f,{assetFetch:async(url,options)=>{const res=await fetch(url,options);if(first){first=false;throw socketFailure();}return res;}});
  assert.deepEqual(PACK_ASSET_TRANSPORT_RETRY,{attempts:3,timeoutMs:120000,delaysMs:[1000,2000]});
  assert.equal(f.operations.length,1);assert.equal(f.calls.length,2);assert.equal(f.fences,3);assert.deepEqual(f.waits,[1000]);assert.equal(result.completionToken,completion);
  assert.notEqual(f.calls[0].options.body,f.calls[1].options.body);assert.notEqual(f.calls[0].options.signal,f.calls[1].options.signal);
  for(const {url,options} of f.calls){assert.equal(url,'https://api.cloudflare.com/client/v4/accounts/'+PACK_DEPLOY_ACCOUNT+'/workers/assets/upload?base64=true');assert.equal(options.method,'POST');assert.equal(options.headers.Authorization,'Bearer '+token);assert.deepEqual([...options.body.keys()],[f.keys[0]]);assert.equal(hash(Buffer.from(await options.body.get(f.keys[0]).text(),'base64')),f.candidate.files[0].sha256);}
  assert.equal(f.diagnostics[0].operation,'asset-bucket-upload');assert.deepEqual(f.diagnostics[0].causeCodes,['ECONNRESET']);assert.equal(JSON.stringify(f.diagnostics).includes(token),false);
});

test('network retries stop after three attempts and preserve an unknown provider outcome with safe cause diagnostics',async t=>{
  const f=fixture(t);let posts=0;
  await assert.rejects(()=>prepare(f,{assetFetch:async()=>{posts++;throw socketFailure('UND_ERR_SOCKET');}}),error=>{
    assert.equal(error.name,'PackProviderTransportError');assert.equal(error.providerOutcomeKnown,undefined);assert.equal(error.transport.attempt,3);assert.equal(error.transport.maximumAttempts,3);assert.deepEqual(error.transport.causeCodes,['UND_ERR_SOCKET']);assert.equal(error.transport.responseStatus,null);assert.equal(error.transport.timeoutMs,120000);assert.equal(error.transport.assetFiles,1);assert.equal(error.message.includes(token),false);assert.equal(error.cause,undefined);return true;
  });
  assert.equal(posts,3);assert.equal(f.fences,4);assert.deepEqual(f.waits,[1000,2000]);assert.equal(f.operations.length,1);assert.equal(f.diagnostics.length,2);
});

test('a socket failure while reading an acknowledged HTTP response retries the sealed content bucket',async t=>{
  const f=fixture(t);let posts=0;
  const result=await prepare(f,{assetFetch:async()=>{posts++;return posts===1?{status:201,json:async()=>{throw socketFailure('UND_ERR_BODY_TIMEOUT');}}:response();}});
  assert.equal(result.completionToken,completion);assert.equal(posts,2);assert.equal(f.diagnostics[0].responseStatus,201);assert.deepEqual(f.diagnostics[0].causeCodes,['UND_ERR_BODY_TIMEOUT']);
});

test('bounded own-request timeouts can retry, while arbitrary TypeErrors and malformed JSON cannot',async t=>{
  for(const name of ['TimeoutError','AbortError']){const f=fixture(t);let posts=0;await prepare(f,{assetFetch:async()=>{posts++;if(posts===1)throw Object.assign(Error('private '+token),{name});return response();}});assert.equal(posts,2);assert.equal(f.diagnostics[0].errorName,name);}
  for(const error of [new TypeError('Invalid header '+token),new SyntaxError('private response '+token),Error('ambiguous timeout')]){
    const f=fixture(t);let posts=0;await assert.rejects(()=>prepare(f,{assetFetch:async()=>{posts++;throw error;}}),failure=>!failure.message.includes(token)&&failure.name==='PackProviderTransportError');assert.equal(posts,1);assert.deepEqual(f.waits,[]);
  }
});

test('explicit HTTP/auth/size/rate-limit/server refusals are not silently retried or treated as successful',async t=>{
  for(const status of [400,401,403,413,429,500,502,503,504]){
    const f=fixture(t);let posts=0;await assert.rejects(()=>prepare(f,{assetFetch:async()=>{posts++;return response(status);}}),new RegExp('Static asset upload failed \\(HTTP '+status+'\\)'));assert.equal(posts,1);assert.deepEqual(f.waits,[]);
  }
});

test('an explicit HTTP refusal is never retried even if reading its response body loses the connection',async t=>{
  for(const status of [401,403,429,500,503]){
    const f=fixture(t);let posts=0;
    await assert.rejects(()=>prepare(f,{assetFetch:async()=>{posts++;return {status,json:async()=>{throw socketFailure();}};}}),error=>error.transport.responseStatus===status);
    assert.equal(posts,1);assert.deepEqual(f.waits,[]);assert.deepEqual(f.diagnostics,[]);
  }
});

test('a lost claim during backoff blocks the retry before sending another POST',async t=>{
  const f=fixture(t);let posts=0,lost=false,fences=0;
  await assert.rejects(()=>prepare(f,{assetFetch:async()=>{posts++;throw socketFailure();},assetRetryWait:async ms=>{f.waits.push(ms);lost=true;},beforeWrite:async()=>{fences++;if(lost)throw Error('current claim lost');}}),/current claim lost/);
  assert.equal(posts,1);assert.equal(fences,3);assert.deepEqual(f.waits,[1000]);
});

test('changed sealed bytes during backoff cannot be uploaded on a retry',async t=>{
  const f=fixture(t);let posts=0;
  await assert.rejects(()=>prepare(f,{assetFetch:async()=>{posts++;throw socketFailure();},assetRetryWait:async()=>{fs.appendFileSync(path.join(f.candidate.directory,f.candidate.files[0].path),'changed');}}),/sealed inventory/);
  assert.equal(posts,1);assert.equal(f.fences,2);
});

test('a permanent sibling failure stops retries and queued admission while all in-flight responses settle',async t=>{
  const f=fixture(t,4),started=[deferred(),deferred(),deferred()],replies=[deferred(),deferred(),deferred()],backoff=deferred(),waiting=deferred(),posts=[];let settled=false;
  const pending=prepare(f,{assetFetch:async(url,options)=>{const index=f.keys.indexOf([...options.body.keys()][0]);posts.push(index);started[index]?.resolve();return replies[index].promise;},assetRetryWait:async()=>{waiting.resolve();await backoff.promise;}});
  const rejected=assert.rejects(pending,/Static asset upload failed/).then(()=>{settled=true;});
  await Promise.all(started.map(row=>row.promise));replies[0].reject(socketFailure());await waiting.promise;replies[1].resolve(response(403));await nextTurn();backoff.resolve();await nextTurn();assert.equal(settled,false);assert.deepEqual(posts,[0,1,2]);
  replies[2].resolve(response(201));await rejected;assert.deepEqual(posts,[0,1,2]);assert.equal(settled,true);
});

test('exhausted retries wait for another in-flight bucket and an early completion token cannot hide failure',async t=>{
  const f=fixture(t,3),other=[deferred(),deferred()],started=[deferred(),deferred()],posts=[0,0,0];let settled=false;
  const pending=prepare(f,{assetFetch:async(url,options)=>{const index=f.keys.indexOf([...options.body.keys()][0]);posts[index]++;if(index===0)throw socketFailure();started[index-1].resolve();return other[index-1].promise;}});
  const rejected=assert.rejects(pending,/asset-bucket-upload transport failed/).then(()=>{settled=true;});
  await Promise.all(started.map(row=>row.promise));await nextTurn();assert.deepEqual(posts,[3,1,1]);assert.equal(settled,false);
  other[0].resolve(response());await nextTurn();assert.equal(settled,false);other[1].resolve(response(202,null));await rejected;assert.deepEqual(posts,[3,1,1]);
});

test('API transport gives precise sanitized operation/cause but never retries any provider mutation',async()=>{
  const endpoints=[['asset-manifest-session','/scripts/dealer-one/assets-upload-session'],['worker-create','/workers'],['worker-version-upload','/workers/'+'b'.repeat(32)+'/versions'],['worker-activation','/scripts/dealer-one/deployments'],['worker-subdomain','/scripts/dealer-one/subdomain']];
  for(const [operation,suffix] of endpoints){let calls=0,ticks=0;const transport=tokenCloudflareTransport({token,fetchImpl:async()=>{calls++;throw socketFailure('EPIPE');},transportClock:()=>ticks++?81234:0});
    await assert.rejects(()=>transport({method:'POST',path:'/accounts/'+PACK_DEPLOY_ACCOUNT+'/workers'+suffix,body:{private:token}}),error=>{assert.equal(error.transport.operation,operation);assert.equal(error.transport.attempt,1);assert.equal(error.transport.maximumAttempts,1);assert.equal(error.transport.elapsedMs,81234);assert.equal(error.transport.timeoutMs,180000);assert.deepEqual(error.transport.causeCodes,['EPIPE']);assert.equal(error.providerOutcomeKnown,undefined);assert.equal(error.message.includes(token),false);return true;});assert.equal(calls,1);
  }
});

test('API response-body failures retain HTTP status without persisting response content',async()=>{
  let calls=0;const transport=tokenCloudflareTransport({token,fetchImpl:async()=>{calls++;return {status:502,json:async()=>{throw new SyntaxError('private content '+token);}};}});
  await assert.rejects(()=>transport({method:'GET',path:'/accounts/'+PACK_DEPLOY_ACCOUNT+'/workers/workers'}),error=>{assert.equal(error.transport.operation,'workers-api-read');assert.equal(error.transport.responseStatus,502);assert.equal(error.transport.errorName,'SyntaxError');assert.equal(error.transport.timeoutMs,30000);assert.equal(error.message.includes(token),false);return true;});assert.equal(calls,1);
});

test('diagnostics collect bounded known nested socket codes without retaining arbitrary causes or headers',()=>{
  const error=new TypeError('fetch failed',{cause:new AggregateError([Object.assign(Error('Authorization: Bearer '+token),{code:'ECONNRESET'}),Object.assign(Error('signed URL '+token),{code:'ETIMEDOUT'}),Object.assign(Error('secret'),{code:token})])});
  const failure=packProviderTransportFailure(error,{operation:'asset-bucket-upload',method:'POST',elapsedMs:81,timeoutMs:120000});
  assert.deepEqual(failure.transport.causeCodes,['ECONNRESET','ETIMEDOUT']);assert.equal(JSON.stringify(failure).includes(token),false);assert.equal(failure.cause,undefined);assert.equal(failure.transport.responseStatus,null);
});
