import test from 'node:test';
import assert from 'node:assert/strict';
import {createRequire} from 'node:module';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import {singleWorkerSource} from './package-uk-single-worker.mjs';
import {createDealerRouter} from './publishing/cloudflare-router.mjs';
import {verifyHostedHead} from './verify-hosted-dealer-pack.mjs';

const origin='https://head-fixture.webpreviews.site';
const variants=['auto-best','modern','import','app','mobile','karento-best'].map((key,index)=>({
  key,base:index?'/variant-'+(index+1):'',entry:index?'/variant-'+(index+1)+'/':'/',binding:'CARS_'+key.toUpperCase().replaceAll('-','_')
}));
const moduleName=key=>key+'/'+(['modern','app','mobile'].includes(key)?'index.js':'index.mjs');
const uri=source=>'data:text/javascript;base64,'+Buffer.from(source).toString('base64');
const routerSource='const createDealerRouter='+createDealerRouter.toString()+';export default createDealerRouter('+JSON.stringify({variants,redirects:[{source:'/old',destination:'/variant-3/?to=new',permanent:true}]})+');';
async function fixture(){
  const modules=new Map([['router.mjs',routerSource],...variants.map(({key})=>[moduleName(key),'export default {fetch(request,env,ctx){return env.testFetch(request,ctx,'+JSON.stringify(key)+');}};'])]);
  return (await import(uri(singleWorkerSource().replace(/from "\.\/([^\"]+)";/g,(_,name)=>'from '+JSON.stringify(uri(modules.get(name)))+';')))).default;
}

test('all six composed designs answer HEAD through GET with preserved headers and no body',async()=>{
  const worker=await fixture(),cancelled=[],pending=[],requests=[];
  const ctx={waitUntil(promise){pending.push(promise);}};
  const env={testFetch(request,context,key){
    assert.equal(context,ctx);assert.equal(request.method,'GET');requests.push({key,url:request.url,cookie:request.headers.get('cookie')});
    return new Response(new ReadableStream({start(controller){controller.enqueue(new TextEncoder().encode(key));},cancel(){cancelled.push(key);}}),{
      headers:{'content-type':'text/html; charset=utf-8','cache-control':'private','content-language':'en','etag':'"native"','vary':'Cookie','set-cookie':'cars_locale=en; Path=/'}
    });
  }};
  for(const variant of variants){
    const request=new Request(origin+variant.entry+'?lang=en',{method:'HEAD',headers:{cookie:'cars_locale=en'}});
    const response=await worker.fetch(request,env,ctx);
    assert.equal(request.method,'HEAD');assert.equal(response.status,200);assert.equal(response.body,null);assert.equal(await response.text(),'');
    assert.equal(response.headers.get('content-type'),'text/html; charset=utf-8');assert.equal(response.headers.get('etag'),'"native"');
    assert.equal(response.headers.get('content-language'),'en');assert.equal(response.headers.get('vary'),'Cookie');
    assert.equal(response.headers.get('set-cookie'),'cars_locale=en; Path=/');assert.equal(response.headers.get('x-robots-tag'),'noindex, nofollow');
  }
  await Promise.all(pending);
  assert.deepEqual(cancelled,variants.map(row=>row.key));assert.deepEqual(requests,variants.map(row=>({key:row.key,url:origin+row.entry+'?lang=en',cookie:'cars_locale=en'})));
});

test('composed HEAD preserves native failures, conditional status and router redirects',async()=>{
  const worker=await fixture();let calls=0;
  const env={testFetch(request){calls++;const status=Number(new URL(request.url).searchParams.get('status'));return new Response([204,304].includes(status)?null:'native body',{status,headers:{etag:'"same-representation"'}});}};
  for(const status of [204,304,404,500]){
    const response=await worker.fetch(new Request(origin+'/?status='+status,{method:'HEAD'}),env);
    assert.equal(response.status,status);assert.equal(response.body,null);assert.equal(response.headers.get('etag'),'"same-representation"');
  }
  for(const [url,status,location] of [['/variant-2?lang=en',307,'/variant-2/?lang=en'],['/old?lang=en&to=old',308,'/variant-3/?to=new&lang=en']]){
    const response=await worker.fetch(new Request(origin+url,{method:'HEAD'}),env);
    assert.equal(response.status,status);assert.equal(response.headers.get('location'),origin+location);assert.equal(response.body,null);
  }
  assert.equal(calls,4);
});

test('GET and write methods retain their existing native request and response behavior',async()=>{
  const worker=await fixture(),observed=[];
  const env={async testFetch(request){const body=await request.text();observed.push({method:request.method,body});return new Response('native '+request.method+body,{status:201,headers:{'x-native':'retained'}});}};
  for(const method of ['GET','POST']){
    const response=await worker.fetch(new Request(origin+'/',{method,...(method==='POST'?{body:' payload'}:{})}),env);
    assert.equal(response.status,201);assert.equal(response.headers.get('x-native'),'retained');assert.equal(await response.text(),'native '+method+(method==='POST'?' payload':''));
  }
  assert.deepEqual(observed,[{method:'GET',body:''},{method:'POST',body:' payload'}]);
});

test('HEAD stream cancellation does not hold response headers or turn a cancellation error into HTTP 500',async()=>{
  const worker=await fixture(),pending=[];let release;
  const env={testFetch(){return new Response(new ReadableStream({cancel(){return new Promise(resolve=>{release=resolve;});}}));}};
  const response=await worker.fetch(new Request(origin+'/',{method:'HEAD'}),env,{waitUntil(promise){pending.push(promise);}});
  assert.equal(response.status,200);assert.equal(response.body,null);assert.equal(pending.length,1);release();await Promise.all(pending);
  const failure=await worker.fetch(new Request(origin+'/',{method:'HEAD'}),{testFetch(){return new Response(new ReadableStream({cancel(){throw Error('cancelled renderer');}}));}});
  assert.equal(failure.status,200);assert.equal(failure.body,null);
});

test('real workerd preserves geography and GET representation headers for bodyless HEAD',async t=>{
  const {Miniflare,convertV4MiniflareOptions}=createRequire(process.env.CARS_MINIFLARE_RESOLVE_FROM||import.meta.url)('miniflare');
  const moduleRoot=fs.realpathSync(os.tmpdir()),module=(name,contents)=>({type:'ESModule',path:path.join(moduleRoot,'cars-head-test',name),contents});
  const design='export default {fetch(request){if(request.method==="HEAD")throw Error("native HEAD regression");return new Response("native GET body",{headers:{"content-type":"text/html; charset=utf-8","etag":"native-etag","x-country":request.headers.get("x-cars-country")||"missing"}});}};';
  const options={compatibilityDate:'2026-10-10',compatibilityFlags:['nodejs_compat'],modulesRoot:path.join(moduleRoot,'cars-head-test'),modules:[module('worker.mjs',singleWorkerSource()),module('router.mjs',routerSource),...variants.map(row=>module(moduleName(row.key),design))],telemetry:{enabled:false}};
  const mf=new Miniflare(convertV4MiniflareOptions?convertV4MiniflareOptions(options):options);t.after(()=>mf.dispose());
  for(const variant of variants){
    const get=await mf.dispatchFetch(origin+variant.entry,{cf:{country:'GB'}});assert.equal(get.status,200);assert.equal(await get.text(),'native GET body');
    const head=await mf.dispatchFetch(origin+variant.entry,{method:'HEAD',cf:{country:'GB'}});
    assert.equal(head.status,200);assert.equal(await head.text(),'');assert.equal(head.headers.get('etag'),get.headers.get('etag'));
    assert.equal(head.headers.get('content-type'),get.headers.get('content-type'));assert.equal(head.headers.get('x-country'),'GB');
    assert.ok(!head.headers.has('content-length')||head.headers.get('content-length')===get.headers.get('content-length'));
  }
});

test('hosted HEAD checker follows same-origin redirects using HEAD and requires an empty 200',async()=>{
  const seen=[],result=await verifyHostedHead({origin,href:'/',fetchImpl:async(url,options)=>{
    seen.push({url,method:options.method,redirect:options.redirect});
    return url===origin+'/'?new Response(null,{status:307,headers:{location:'/en'}}):new Response(null,{headers:{'content-type':'text/html','content-length':'100000'}});
  }});
  assert.equal(result.status,'passed');assert.equal(result.httpStatus,200);assert.equal(result.bodyBytes,0);assert.equal(result.url,origin+'/en');assert.equal(result.redirects.length,1);
  assert.deepEqual(seen,[{url:origin+'/',method:'HEAD',redirect:'manual'},{url:origin+'/en',method:'HEAD',redirect:'manual'}]);
});

test('hosted HEAD checker rejects HTTP500, response bodies, missing Location and loops',async()=>{
  for(const [response,pattern] of [
    [()=>new Response(null,{status:500}),/HTTP 500/],
    [()=>new Response('invalid HEAD body'),/response body/],
    [()=>new Response(null,{status:307}),/missing Location/],
    [()=>new Response(null,{status:302,headers:{location:'/'}}),/redirect loop/]
  ]){
    const result=await verifyHostedHead({origin,href:'/',fetchImpl:async()=>response()});assert.equal(result.status,'failed');assert.match(result.findings.join('; '),pattern);
  }
});

test('hosted HEAD checker refuses foreign origins and credentials before sending another request',async()=>{
  for(const location of ['https://foreign.example/','https://user:password@head-fixture.webpreviews.site/']){
    let calls=0;const result=await verifyHostedHead({origin,href:'/',fetchImpl:async()=>{calls++;return new Response(null,{status:302,headers:{location}});}});
    assert.equal(result.status,'failed');assert.match(result.findings.join('; '),/approved dealer origin/);assert.equal(calls,1);
  }
  let calls=0;const result=await verifyHostedHead({origin,href:'https://foreign.example/',fetchImpl:async()=>{calls++;return new Response(null);}});
  assert.equal(result.status,'failed');assert.equal(calls,0);
});

test('hosted HEAD checker bounds redirect chains and reports transport errors',async()=>{
  let calls=0;const bounded=await verifyHostedHead({origin,href:'/',maxRedirects:2,fetchImpl:async()=>new Response(null,{status:307,headers:{location:'/step-'+(++calls)}})});
  assert.equal(bounded.status,'failed');assert.equal(calls,3);assert.match(bounded.findings.join('; '),/redirect limit/);
  const failed=await verifyHostedHead({origin,href:'/',fetchImpl:async()=>{throw Error('unavailable');}});assert.equal(failed.status,'failed');assert.deepEqual(failed.findings,['unavailable']);
});
