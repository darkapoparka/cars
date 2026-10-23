import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import {createHash} from 'node:crypto';
import {githubPackTransport} from './deploy-dealer-packs.mjs';
import {downloadPackActionArtifact} from './dispatch-dealer-pack-queue.mjs';

const sha=value=>createHash('sha256').update(value).digest('hex');
const token='test-private-github-token',signedSecret='private-signed-object-query';
const apiPath='/repos/darkapoparka/cars/actions/artifacts/44';
const bytes=Buffer.from('the exact authenticated complete archive');
const artifact=()=>({id:44,size_in_bytes:bytes.length,digest:'sha256:'+sha(bytes)});
const redirect=()=>new Response(null,{status:302,headers:{location:'https://artifact.blob.core.windows.net/archive.zip?sig='+signedSecret}});
const timeout=()=>new DOMException('private timeout URL '+signedSecret+' '+token,'TimeoutError');
function hooks(){const waits=[],diagnostics=[];return {waits,diagnostics,retryWait:async milliseconds=>waits.push(milliseconds),transportDiagnostic:value=>diagnostics.push(value)};}
function temporary(t){const directory=fs.mkdtempSync(path.join(os.tmpdir(),'cars-github-read-'));t.after(()=>fs.rmSync(directory,{recursive:true,force:true}));return path.join(directory,'archive.zip');}
function cleanDiagnostic(value){const serialized=JSON.stringify(value);for(const secret of [token,signedSecret,'https://','Authorization','private timeout URL'])assert.equal(serialized.includes(secret),false);}

test('metadata retries bounded transient transport and HTTP failures against the same GET',async()=>{
  const control=hooks(),calls=[];
  const read=githubPackTransport({token,...control,fetchImpl:async(url,options)=>{
    calls.push({url:String(url),options});if(calls.length===1)throw timeout();
    return calls.length===2?new Response('transient private body '+token,{status:503}):Response.json({id:44,digest:artifact().digest});
  }});
  const result=await read({method:'GET',path:apiPath,query:{per_page:100}});
  assert.equal(result.status,200);assert.equal(result.body.id,44);assert.equal(calls.length,3);
  assert.deepEqual(control.waits,[1000,2000]);assert.equal(new Set(calls.map(row=>row.url)).size,1);
  assert.ok(calls.every(row=>row.options.method==='GET'&&row.options.headers.Authorization==='Bearer '+token));
  assert.deepEqual(control.diagnostics.map(row=>[row.resource,row.stage,row.attempt,row.responseStatus]),[['artifact','api-response',1,null],['artifact','api-response',2,503]]);
  cleanDiagnostic(control.diagnostics);
});

test('metadata body transport failures retry, while malformed successful JSON is terminal and sanitized',async()=>{
  const control=hooks();let calls=0;
  const read=githubPackTransport({token,...control,fetchImpl:async()=>++calls===1?{status:200,json:async()=>{throw Object.assign(Error('private body '+token),{cause:{code:'ECONNRESET'}});}}:Response.json({id:44})});
  assert.equal((await read({method:'GET',path:apiPath})).body.id,44);assert.equal(calls,2);
  assert.equal(control.diagnostics[0].stage,'api-body');assert.deepEqual(control.diagnostics[0].causeCodes,['ECONNRESET']);cleanDiagnostic(control.diagnostics);
  const invalid=hooks();calls=0;
  await assert.rejects(githubPackTransport({token,...invalid,fetchImpl:async()=>{calls++;return new Response('not-json '+token);}})({method:'GET',path:apiPath}),error=>{
    assert.equal(error.name,'PackGithubReadError');assert.equal(error.transport.errorName,'SyntaxError');assert.equal(error.transport.responseStatus,200);cleanDiagnostic({message:error.message,transport:error.transport});return true;
  });
  assert.equal(calls,1);assert.deepEqual(invalid.waits,[]);
});

test('metadata authorization, missing artifacts and rate limits never retry',async()=>{
  for(const status of [401,403,404,409,429]){
    const control=hooks();let calls=0;
    const read=githubPackTransport({token,...control,fetchImpl:async()=>{calls++;return Response.json({message:'terminal'}, {status});}});
    assert.equal((await read({method:'GET',path:apiPath})).status,status);assert.equal(calls,1);assert.deepEqual(control.waits,[]);
  }
});

test('metadata timeout exhaustion retains sanitized stage and bounded attempt evidence',async()=>{
  const control=hooks();let calls=0;
  const read=githubPackTransport({token,...control,fetchImpl:async()=>{calls++;throw timeout();}});
  await assert.rejects(read({method:'GET',path:apiPath}),error=>{
    assert.equal(error.transport.attempt,3);assert.equal(error.transport.maximumAttempts,3);assert.equal(error.transport.timeoutMs,30000);assert.equal(error.transport.stage,'api-response');cleanDiagnostic({message:error.message,transport:error.transport});return true;
  });
  assert.equal(calls,3);assert.deepEqual(control.waits,[1000,2000]);
});

test('GitHub mutations and uncertain CAS responses remain single-attempt and unchanged',async()=>{
  for(const method of ['POST','PUT','PATCH','DELETE']){
    const control=hooks(),original=timeout();let calls=0;
    const write=githubPackTransport({token,...control,fetchImpl:async(url,options)=>{calls++;assert.equal(options.method,method);assert.equal(options.body,JSON.stringify({exact:'payload'}));throw original;}});
    await assert.rejects(write({method,path:'/repos/darkapoparka/cars/contents/queue.json',body:{exact:'payload'}}),error=>error===original);
    assert.equal(calls,1);assert.deepEqual(control.waits,[]);assert.deepEqual(control.diagnostics,[]);
    calls=0;
    const refused=githubPackTransport({token,...control,fetchImpl:async()=>{calls++;return Response.json({message:'uncertain'}, {status:503});}});
    assert.deepEqual(await refused({method,path:'/repos/darkapoparka/cars/contents/queue.json',body:{exact:'payload'}}),{status:503,body:{message:'uncertain'}});assert.equal(calls,1);
  }
});

test('interrupted artifact streams restart the whole pinned download and remove every partial byte',async t=>{
  const out=temporary(t),control=hooks(),input=artifact(),calls=[];let objectRequests=0,apiRequests=0;
  const file=await downloadPackActionArtifact({artifact:input,out,token,...control,fetchImpl:async(url,options)=>{
    calls.push({url:String(url),options});
    if(String(url).startsWith('https://api.github.com/')){
      apiRequests++;assert.ok(String(url).endsWith('/artifacts/44/zip'));assert.equal(fs.existsSync(out+'.partial'),false);return redirect();
    }
    objectRequests++;
    if(objectRequests===1)return {status:200,body:{async *[Symbol.asyncIterator](){yield bytes.subarray(0,7);input.id=99;input.size_in_bytes=1;input.digest='sha256:'+sha('substitution');throw timeout();}}};
    return new Response(bytes);
  }});
  assert.equal(apiRequests,2);assert.equal(objectRequests,2);assert.deepEqual(fs.readFileSync(file),bytes);assert.equal(fs.existsSync(out+'.partial'),false);
  assert.deepEqual(control.waits,[1000]);assert.equal(control.diagnostics[0].stage,'object-body');assert.equal(control.diagnostics[0].artifactId,44);assert.equal(control.diagnostics[0].bytesReceived,7);assert.equal(control.diagnostics[0].expectedBytes,bytes.length);assert.equal(control.diagnostics[0].timeoutMs,480000);
  for(const row of calls){assert.equal(row.options.method,'GET');assert.equal(row.options.headers.Range,undefined);if(row.url.startsWith('https://api.github.com/'))assert.equal(row.options.headers.Authorization,'Bearer '+token);else{assert.equal(row.options.headers.Authorization,undefined);assert.equal(row.options.redirect,'error');}}
  cleanDiagnostic(control.diagnostics);
});

test('transient artifact API and object responses obtain a fresh authenticated redirect per bounded attempt',async t=>{
  const out=temporary(t),control=hooks();let api=0,objects=0;
  await downloadPackActionArtifact({artifact:artifact(),out,token,...control,fetchImpl:async url=>{
    if(String(url).startsWith('https://api.github.com/'))return ++api===1?new Response(null,{status:502}):redirect();
    return ++objects===1?new Response(null,{status:504}):new Response(bytes);
  }});
  assert.equal(api,3);assert.equal(objects,2);assert.deepEqual(control.waits,[1000,2000]);assert.deepEqual(fs.readFileSync(out),bytes);
  assert.deepEqual(control.diagnostics.map(row=>[row.stage,row.responseStatus]),[['api-response',502],['object-response',504]]);
});

test('artifact retry exhaustion leaves no output or partial and preserves only safe failure evidence',async t=>{
  const out=temporary(t),control=hooks();let api=0,objects=0;
  await assert.rejects(downloadPackActionArtifact({artifact:artifact(),out,token,...control,fetchImpl:async url=>{
    if(String(url).startsWith('https://api.github.com/')){api++;return redirect();}
    objects++;return {status:200,body:{async *[Symbol.asyncIterator](){yield bytes.subarray(0,3);throw timeout();}}};
  }}),error=>{
    assert.equal(error.transport.attempt,3);assert.equal(error.transport.stage,'object-body');assert.equal(error.transport.artifactId,44);assert.equal(error.transport.bytesReceived,3);assert.equal(error.transport.responseStatus,200);cleanDiagnostic({message:error.message,transport:error.transport});return true;
  });
  assert.equal(api,3);assert.equal(objects,3);assert.deepEqual(control.waits,[1000,2000]);assert.equal(fs.existsSync(out),false);assert.equal(fs.existsSync(out+'.partial'),false);
});

test('artifact digest, size and redirect violations remain terminal without retry or surviving partial output',async t=>{
  for(const mode of ['digest','truncated','oversized','redirect','forbidden','rate-limit']){
    const out=temporary(t),control=hooks();let calls=0;
    const input=artifact();if(mode==='digest')input.digest='sha256:'+sha('wrong');
    await assert.rejects(downloadPackActionArtifact({artifact:input,out,token,...control,fetchImpl:async()=>{
      calls++;
      if(mode==='redirect')return new Response(null,{status:302,headers:{location:'https://attacker.example/private'}});
      if(mode==='forbidden'||mode==='rate-limit')return new Response(null,{status:mode==='forbidden'?403:429});
      return new Response(mode==='truncated'?bytes.subarray(0,2):mode==='oversized'?Buffer.concat([bytes,bytes]):bytes);
    }}),mode==='redirect'?/known HTTPS Actions/:mode==='forbidden'||mode==='rate-limit'?/archive download failed/:/authenticated (?:digest|size)/);
    assert.equal(calls,1);assert.deepEqual(control.waits,[]);assert.equal(fs.existsSync(out),false);assert.equal(fs.existsSync(out+'.partial'),false);
  }
});
