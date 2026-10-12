import test from 'node:test';
import assert from 'node:assert/strict';
import {createHash} from 'node:crypto';
import {createModernFreeStaticRuntime,validateModernStaticManifest,modernSnapshotRequest,insertModernBootstrap,encodeModernBootstrap,MODERN_BOOTSTRAP_SLOT,MODERN_PREFERENCES_ENDPOINT,MODERN_NATIVE_VARY} from './lib/modern-free-static-runtime.mjs';
const origin='https://cars-priselci.darkapoparka1.workers.dev',html='<html><head>'+MODERN_BOOTSTRAP_SLOT+'</head><body><h1>Услуги</h1><p>Recorded dealer facts</p></body></html>',flight='0:{"native":"unchanged","locale":"bg"}\n';
const bytes=s=>Buffer.byteLength(s),hash='a'.repeat(64);
const sha=s=>createHash('sha256').update(s).digest('hex'),contents=locale=>({html:html+'<!--'+locale+'-->',rsc:locale==='bg'?flight:flight.replace('"bg"','"en"')}),asset=(body,kind)=>({path:'/_cars/private/modern/'+sha(body)+'.'+kind,bytes:bytes(body),sha256:sha(body)});
// Synthetic unit policy, not a production CSP or browser-baseline replay.
const identities={buildId:'fixture-build',compatibilityId:'fixture-graph',deploymentId:'fixture-deploy'};
const policyHeaders=(locale,kind)=>({'cache-control':'private, no-store','cdn-cache-control':'no-store','vercel-cdn-cache-control':'no-store','content-language':locale,'content-type':kind==='rsc'?'text/x-component':'text/html; charset=utf-8',vary:MODERN_NATIVE_VARY,'content-security-policy':"default-src 'self'; script-src 'self' 'unsafe-inline';",'cross-origin-opener-policy':'same-origin','cross-origin-resource-policy':'same-origin','origin-agent-cluster':'?1','referrer-policy':'no-referrer','strict-transport-security':'max-age=31536000','x-content-type-options':'nosniff','x-dns-prefetch-control':'off','x-download-options':'noopen','x-frame-options':'SAMEORIGIN','x-permitted-cross-domain-policies':'none','x-xss-protection':'0',...(kind==='html'?{link:'</variant-2/_next/static/native-fixture.js>; rel=modulepreload'}:{'x-vinext-params':encodeURIComponent(JSON.stringify({locale})),'x-vinext-rendered-path-and-search':encodeURIComponent('/'+locale+'/services'),'x-vinext-rsc-build-id':identities.buildId,'x-vinext-rsc-compatibility-id':identities.compatibilityId,'x-nextjs-deployment-id':identities.deploymentId,'x-vinext-dynamic-stale-time':'0'})});
const plan=()=>({schemaVersion:2,kind:'cars-modern-services-static-experiment',mount:'/variant-2',responsePolicy:{vinextVersion:'1.1.0',sourceTree:'b'.repeat(40),producerSha256:'c'.repeat(64),identities:{...identities}},routes:['en','bg'].map(locale=>({locale,pathname:'/variant-2/'+locale+'/services',html:{...asset(contents(locale).html,'html'),headers:policyHeaders(locale,'html')},rsc:{...asset(contents(locale).rsc,'rsc'),headers:policyHeaders(locale,'rsc')}}))});
const request=(p,options={})=>new Request(origin+p,options);
const resolve=async({request,locale,returnTo,trustedCountry})=>({state:{locale,country:request.headers.get('Cookie')==='saved=GB'?'GB':trustedCountry??'BG',suggestedCountry:trustedCountry??'BG',promptDismissed:false,source:'default'},returnTo});
const assets={fetch:async r=>{const name=new URL(r.url).pathname;for(const locale of ['en','bg'])for(const kind of ['html','rsc']){const path=asset(contents(locale)[kind],kind).path;if(kind==='html'&&path===name)return new Response(null,{status:307,headers:{Location:path.slice(0,-'.html'.length)}});if((kind==='html'?path.slice(0,-'.html'.length):path)===name)return new Response(contents(locale)[kind]);}return new Response('absent',{status:404});}};
test('only two exact native Services pages admit static HTML/RSC; every other route/query/business method keeps native dispatch',()=>{
 const p=validateModernStaticManifest(plan());
 assert.equal(modernSnapshotRequest(request('/variant-2/en/services'),p).kind,'html');
 assert.equal(modernSnapshotRequest(request('/variant-2/bg/services?_rsc=',{headers:{RSC:'1'}}),p).kind,'rsc');
 for(const [path,opt] of [['/variant-2/en/services?country=GB',{}],['/variant-2/en/services?_rsc=x',{}],['/variant-2/en/services?_rsc=a&_rsc=b',{headers:{RSC:'1'}}],['/variant-2/en/cars',{}],['/variant-2/api/preferences',{method:'POST'}],['/variant-2/en/services',{method:'POST'}],['/variant-2/en/services',{headers:{'next-action':'id'}}]])assert.equal(modernSnapshotRequest(request(path,opt),p),null,path);
});
test('immutable snapshot plus trusted native state preserves body facts and never trusts client country hints',async()=>{
 let observed;const runtime=createModernFreeStaticRuntime({manifest:plan(),resolvePreferences:async x=>{observed=x;return resolve(x);}});
 const req=request('/variant-2/bg/services',{headers:{'x-cars-country':'US','x-vercel-ip-country':'CA',Cookie:'saved=GB'}});Object.defineProperty(req,'cf',{value:{country:'DE'}});
 const response=await runtime.fetch(req,{ASSETS:assets});const body=await response.text();
 assert.equal(observed.trustedCountry,'DE');assert.equal(observed.request.headers.get('x-cars-country'),'DE');assert.equal(observed.request.headers.get('x-vercel-ip-country'),null);
 assert(body.includes('"country":"GB"')&&body.includes('"suggestedCountry":"DE"'));assert(body.includes('<h1>Услуги</h1><p>Recorded dealer facts</p>'));
 assert.equal(response.headers.get('Cache-Control'),'private, no-store');assert.equal(response.headers.get('Vary'),MODERN_NATIVE_VARY+', Cookie, Accept-Language');assert.equal(response.headers.get('X-Robots-Tag'),'noindex, nofollow');
 const unknown=request('/variant-2/en/services',{headers:{'x-cars-country':'US'}});await runtime.fetch(unknown,{ASSETS:assets});assert.equal(observed.trustedCountry,null);assert.equal(observed.request.headers.get('x-cars-country'),null);
});
test('RSC bytes remain exactly native and bootstrap endpoint has its separate GET-only contract',async()=>{
 let calls=0;const runtime=createModernFreeStaticRuntime({manifest:plan(),resolvePreferences:x=>{calls++;return resolve(x);}});
 const response=await runtime.fetch(request('/variant-2/bg/services?_rsc=',{headers:{RSC:'1'}}),{ASSETS:assets});assert.equal(await response.text(),flight);assert.equal(calls,0);
 const endpoint=MODERN_PREFERENCES_ENDPOINT+'?returnTo='+encodeURIComponent('/variant-2/en/services#details');
 const result=await runtime.fetch(request(endpoint),{});const payload=await result.json();assert.equal(payload.returnTo,'/variant-2/en/services#details');assert.equal(payload.state.locale,'en');assert.equal(calls,1);
 const post=await runtime.fetch(request(endpoint,{method:'POST'}),{});assert.equal(post.status,405);assert.equal(post.headers.get('Allow'),'GET');assert.equal(calls,1);
 assert.equal(await runtime.fetch(request('/variant-2/api/preferences'),{}),null);assert.equal(await runtime.fetch(request('/variant-2/api/preferences',{method:'POST'}),{}),null);
});
test('private snapshot URLs deny direct access and unsafe/ambiguous returns fail before native policy',async()=>{
 let calls=0;const runtime=createModernFreeStaticRuntime({manifest:plan(),resolvePreferences:x=>{calls++;return resolve(x);}});
 for(const p of ['/_cars/private/modern/'+hash+'.html','/_vinext/static-cache/index.json'])assert.equal((await runtime.fetch(request(p),{})).status,404);
 for(const value of ['https://evil.example/','//evil.example','/variant-3/en/cars','/variant-2/de/services','/variant-2/en/services\\evil','/variant-2/en/services\u0000','/variant-2/en/%2fsecret','/variant-2/en/../en/services'])assert.equal((await runtime.fetch(request(MODERN_PREFERENCES_ENDPOINT+'?returnTo='+encodeURIComponent(value)),{})).status,400);
 assert.equal((await runtime.fetch(request(MODERN_PREFERENCES_ENDPOINT+'?returnTo=/variant-2/en/services&returnTo=/variant-2/bg/services'),{})).status,400);assert.equal(calls,0);
});
test('bootstrap JSON prevents script break-out while missing/duplicated native slot is a hard error',()=>{
 const value={state:{locale:'en',country:'BG',suggestedCountry:'BG',promptDismissed:false,source:'default'},returnTo:'/variant-2/en/services#</script><script>alert(1)</script>\u2028\u2029'};
 const encoded=encodeModernBootstrap(value);assert(!encoded.includes('<')&&!encoded.includes('\u2028')&&!encoded.includes('\u2029'));assert.deepEqual(JSON.parse(encoded).state,value.state);
 const result=insertModernBootstrap(html,value);assert.equal((result.match(/<script /g)||[]).length,1);assert(result.includes('<h1>Услуги</h1>'));
 assert.throws(()=>insertModernBootstrap('<html></html>',value),/slot/);assert.throws(()=>insertModernBootstrap(html+MODERN_BOOTSTRAP_SLOT,value),/slot/);
});
test('each request receives its own native state and returned path; no cross-visitor preference cache',async()=>{
 const mutable=plan();const runtime=createModernFreeStaticRuntime({manifest:mutable,resolvePreferences:resolve});mutable.routes[0].pathname='/mutated';
 const [a,b]=await Promise.all([runtime.fetch(request('/variant-2/en/services',{headers:{Cookie:'saved=GB'}}),{ASSETS:assets}),runtime.fetch(request('/variant-2/bg/services'),{ASSETS:assets})]);
 const aa=await a.text(),bb=await b.text();assert(aa.includes('"country":"GB"')&&aa.includes('"locale":"en"'));assert(bb.includes('"country":"BG"')&&bb.includes('"locale":"bg"'));
 const wrong=createModernFreeStaticRuntime({manifest:plan(),resolvePreferences:async()=>({state:{},returnTo:'/elsewhere'})});await assert.rejects(wrong.fetch(request('/variant-2/en/services'),{ASSETS:assets}),/different return path/);
});
test('sealed missing/changed snapshot fails instead of silently rendering or serving a generic page',async()=>{
 const runtime=createModernFreeStaticRuntime({manifest:plan(),resolvePreferences:resolve});
 await assert.rejects(runtime.fetch(request('/variant-2/en/services'),{ASSETS:{fetch:async()=>new Response('missing',{status:404})}}),/snapshot absent/);
 await assert.rejects(runtime.fetch(request('/variant-2/en/services'),{ASSETS:{fetch:async()=>new Response('short')}}),/size differs/);
});
test('manifest forbids unknown route, unsealed files, aliases, oversized payloads and unsafe private paths',()=>{
 for(const edit of [p=>p.extra=true,p=>p.routes.push(p.routes[0]),p=>p.routes[1].locale='en',p=>p.routes[0].pathname='/variant-2/en/cars',p=>p.routes[0].html.bytes=3*1024*1024,p=>p.routes[0].html.path='/../secret.html',p=>p.routes[0].html.sha256='',p=>p.routes[0].html.sha256=[p.routes[0].html.sha256],p=>p.mount='/variant-4']){const p=plan();edit(p);assert.throws(()=>validateModernStaticManifest(p));}
});
test('native state ABI rejects stale other-locale bootstrap, unexpected keys and malformed policy output',async()=>{
 const baseline={state:{locale:'en',country:'BG',suggestedCountry:'BG',promptDismissed:false,source:'default'},returnTo:'/variant-2/en/services'};
 for(const edit of [s=>s.extra=true,s=>s.country='gb',s=>s.country=['BG'],s=>s.suggestedCountry=['GB'],s=>s.promptDismissed='false',s=>s.source='invented']){const v=structuredClone(baseline);edit(v.state);assert.throws(()=>encodeModernBootstrap(v),/native preference state/);}
 const runtime=createModernFreeStaticRuntime({manifest:plan(),resolvePreferences:async()=>({...baseline,state:{...baseline.state,locale:'bg'}})});
 await assert.rejects(runtime.fetch(request('/variant-2/en/services'),{ASSETS:assets}),/different return path or locale/);
});
test('persistent native provider resolves cars/contact contexts without expanding snapshot coverage or bypassing compiled safe-return policy',async()=>{
 const seen=[];const runtime=createModernFreeStaticRuntime({manifest:plan(),resolvePreferences:x=>{seen.push(x);if(x.returnTo.includes('/admin')||x.returnTo.includes('?bad='))throw Error('native safeReturnPath rejected');return resolve(x);}});
 for(const path of ['/variant-2/en/cars?brand=Volkswagen','/variant-2/bg/contact#location']){
  const response=await runtime.fetch(request(MODERN_PREFERENCES_ENDPOINT+'?returnTo='+encodeURIComponent(path)),{}),payload=await response.json();
  assert.equal(response.status,200);assert.equal(payload.returnTo,path);assert.equal(payload.state.locale,path.split('/')[2]);assert.equal(await runtime.fetch(request(path),{}),null);
 }
 for(const path of ['/variant-2/en/admin','/variant-2/bg/contact?bad=1'])assert.equal((await runtime.fetch(request(MODERN_PREFERENCES_ENDPOINT+'?returnTo='+encodeURIComponent(path)),{})).status,400);
 assert.equal(seen.length,4);assert.equal(seen[1].returnTo,'/variant-2/bg/contact#location');
});
test('oversized ASSETS stream is cancelled at the sealed byte bound rather than buffered without limit',async()=>{
 let cancelled=false;const runtime=createModernFreeStaticRuntime({manifest:plan(),resolvePreferences:resolve});
 const response=()=>new Response(new ReadableStream({start(c){c.enqueue(new Uint8Array(plan().routes[0].html.bytes+1));},cancel(){cancelled=true;}}));
 await assert.rejects(runtime.fetch(request('/variant-2/en/services'),{ASSETS:{fetch:async()=>response()}}),/size differs/);assert.equal(cancelled,true);
});
test('Cloudflare HTML alias handling reads canonical sealed snapshots and never follows redirects',async()=>{
 const p=plan(),seen=[],runtime=createModernFreeStaticRuntime({manifest:p,resolvePreferences:resolve});
 const binding={fetch:async r=>{seen.push({path:new URL(r.url).pathname,redirect:r.redirect});return assets.fetch(r);}};
 for(const route of p.routes){
  const raw=await assets.fetch(request(route.html.path));assert.equal(raw.status,307);assert.equal(raw.headers.get('Location'),route.html.path.slice(0,-'.html'.length));
  const response=await runtime.fetch(request(route.pathname),{ASSETS:binding});assert.equal(response.status,200);
  const body=await response.text();assert(body.includes('<h1>Услуги</h1><p>Recorded dealer facts</p>'));assert(body.endsWith('<!--'+route.locale+'-->'));
 }
 assert.deepEqual(seen,p.routes.map(route=>({path:route.html.path.slice(0,-'.html'.length),redirect:'manual'})));
 for(const location of [p.routes[0].html.path,'https://evil.example/snapshot','/_cars/private/modern/other']){
  let calls=0;await assert.rejects(runtime.fetch(request(p.routes[0].pathname),{ASSETS:{fetch:async()=>{calls++;return new Response(null,{status:307,headers:{Location:location}});}}}),/sealed snapshot absent/);assert.equal(calls,1);
 }
});

test('native sealed policy survives HTML, HEAD and exact full Flight without snapshot cookies or stale body validators',async()=>{
 const p=plan(),runtime=createModernFreeStaticRuntime({manifest:p,resolvePreferences:resolve});
 // ASSETS metadata is not the authority for public native response policy.
 const binding={fetch:async r=>{const response=await assets.fetch(r);response.headers.set('Set-Cookie','leaked=1');response.headers.set('Content-Security-Policy','asset host policy');response.headers.set('ETag','old-body');return response;}};
 for(const route of p.routes)for(const [kind,method] of [['html','GET'],['html','HEAD'],['rsc','GET'],['rsc','HEAD']]){
  const response=await runtime.fetch(request(route.pathname+(kind==='rsc'?'?_rsc=':''),{method,headers:kind==='rsc'?{RSC:'1'}:{}}),{ASSETS:binding});
  assert.equal(response.status,200);
  for(const [name,value] of Object.entries(route[kind].headers))assert.equal(response.headers.get(name),name==='vary'?value+', Cookie, Accept-Language':value,name);
  for(const name of ['set-cookie','etag','content-length','content-encoding'])assert.equal(response.headers.get(name),null,name);
  const body=await response.text();if(method==='HEAD')assert.equal(body,'');else if(kind==='rsc')assert.equal(body,contents(route.locale).rsc);else assert(body.includes('"locale":"'+route.locale+'"'));
 }
});
test('native policy requires exact source identity and rejects shared state, nonce, transport and mismatched route metadata',()=>{
 const edits=[p=>p.schemaVersion=1,p=>delete p.responsePolicy,p=>p.responsePolicy.extra=true,p=>p.responsePolicy.vinextVersion='1.0.0',p=>p.responsePolicy.sourceTree=[p.responsePolicy.sourceTree],p=>p.responsePolicy.producerSha256=[p.responsePolicy.producerSha256],p=>p.responsePolicy.identities.extra='oops',p=>p.responsePolicy.identities.deploymentId='a\nvalue',p=>delete p.routes[0].html.headers['content-security-policy'],p=>p.routes[0].html.headers['Set-Cookie']='saved=GB',p=>p.routes[0].html.headers['set-cookie']='saved=GB',p=>p.routes[0].html.headers.etag='sealed-before-injection',p=>p.routes[0].html.headers['content-length']='100',p=>p.routes[0].html.headers['content-encoding']='gzip',p=>p.routes[0].html.headers['x-middleware-next']='1',p=>p.routes[0].html.headers['content-security-policy']="script-src 'nonce-per-request';",p=>p.routes[0].html.headers['referrer-policy']='no-referrer\r\nSet-Cookie: x=1',p=>p.routes[0].html.headers.link='a'.repeat(16385),p=>p.routes[0].html.headers['cache-control']='public, max-age=60',p=>p.routes[0].html.headers['cdn-cache-control']='public',p=>p.routes[0].html.headers['content-language']='bg',p=>p.routes[0].html.headers.vary='RSC',p=>p.routes[0].html.headers['x-vinext-params']='%7B%7D',p=>p.routes[0].rsc.headers['x-vinext-params']=encodeURIComponent(JSON.stringify({locale:'bg'})),p=>p.routes[0].rsc.headers['x-vinext-rendered-path-and-search']=encodeURIComponent('/variant-2/en/contact'),p=>p.routes[0].rsc.headers['x-vinext-rendered-path-and-search']=encodeURIComponent('/variant-2/en/services'),p=>p.routes[0].rsc.headers['x-vinext-rsc-build-id']='other graph',p=>p.routes[0].rsc.headers['x-nextjs-deployment-id']='other deploy',p=>p.routes[0].rsc.headers['x-vinext-stale-time-pending']='1'];
 for(const edit of edits){const p=plan();edit(p);assert.throws(()=>validateModernStaticManifest(p));}
});
test('native hash, prefetch and contextual variants keep native dispatch and conflicting deployment never fetches assets',async()=>{
 const p=plan(),runtime=createModernFreeStaticRuntime({manifest:p,resolvePreferences:resolve});let calls=0;
 const ASSETS={fetch:async r=>{calls++;return assets.fetch(r);}};
 for(const name of ['next-router-prefetch','next-router-segment-prefetch','next-router-state-tree','next-url','x-vinext-interception-context','x-vinext-interception-id','x-vinext-mounted-slots','x-vinext-rsc-render-mode','x-vinext-rsc-state-fingerprint','x-vinext-client-reuse-manifest'])assert.equal(await runtime.fetch(request('/variant-2/en/services?_rsc=',{headers:{RSC:'1',[name]:'native selector'}}),{ASSETS}),null,name);
 for(const path of ['/variant-2/en/services','/variant-2/en/services?_rsc=nativeHash','/variant-2/en/services?_rsc=&_rsc='])assert.equal(await runtime.fetch(request(path,{headers:{RSC:'1'}}),{ASSETS}),null,path);
 for(const name of ['x-deployment-id','x-nextjs-deployment-id'])assert.equal(await runtime.fetch(request('/variant-2/en/services?_rsc=',{headers:{RSC:'1',[name]:'other deploy'}}),{ASSETS}),null,name);
 for(const name of ['__VINEXT_DEPLOYMENT_ID','NEXT_DEPLOYMENT_ID'])assert.equal(await runtime.fetch(request('/variant-2/en/services'),{ASSETS,[name]:'other deploy'}),null,name);
 for(const headers of [{'x-vinext-rsc-build-id':'other graph'},{'x-vinext-rsc-compatibility-id':'other graph'},{'x-vinext-rsc-build-id':identities.buildId},{'x-vinext-rsc-compatibility-id':identities.compatibilityId}])assert.equal(await runtime.fetch(request('/variant-2/en/services?_rsc=',{headers:{RSC:'1',...headers}}),{ASSETS}),null);
 for(const bindings of [{__VINEXT_DEPLOYMENT_ID:identities.deploymentId,NEXT_DEPLOYMENT_ID:'other deploy'},{__VINEXT_DEPLOYMENT_ID:'other deploy',NEXT_DEPLOYMENT_ID:identities.deploymentId},{__VINEXT_DEPLOYMENT_ID:identities.deploymentId,NEXT_DEPLOYMENT_ID:''}])assert.equal(await runtime.fetch(request('/variant-2/en/services'),{ASSETS,...bindings}),null);
 assert.equal(calls,0);
 assert.equal((await runtime.fetch(request('/variant-2/en/services?_rsc=',{headers:{RSC:'1','x-deployment-id':identities.deploymentId}}),{ASSETS,__VINEXT_DEPLOYMENT_ID:identities.deploymentId,NEXT_DEPLOYMENT_ID:identities.deploymentId})).status,200);
 assert.equal(calls,1);
});
test('same-length snapshot tampering fails SHA admission before bootstrap or native policy replay',async()=>{
 let calls=0;const runtime=createModernFreeStaticRuntime({manifest:plan(),resolvePreferences:x=>{calls++;return resolve(x);}});
 const altered=contents('en').html.replace('Recorded dealer facts','Replaced dealer facts');assert.equal(bytes(altered),plan().routes[0].html.bytes);
 await assert.rejects(runtime.fetch(request('/variant-2/en/services'),{ASSETS:{fetch:async()=>new Response(altered)}}),/snapshot SHA differs/);assert.equal(calls,0);
});
