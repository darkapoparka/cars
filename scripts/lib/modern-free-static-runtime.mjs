// Opt-in two-route experiment. Native policy is supplied by the sealed Modern build.
export const MODERN_BOOTSTRAP_ID='cars-modern-native-preferences';
export const MODERN_BOOTSTRAP_SLOT='<script type="application/json" id="cars-modern-native-preferences">null</script>';
export const MODERN_PREFERENCES_ENDPOINT='/_cars/native-preferences/modern';
export const MODERN_PRIVATE_PREFIX='/_cars/private/modern/';
const fail=message=>{throw Error('Modern static experiment: '+message);};
const object=value=>value!==null&&typeof value==='object'&&!Array.isArray(value)&&[Object.prototype,null].includes(Object.getPrototypeOf(value));
const exact=(value,keys)=>object(value)&&JSON.stringify(Object.keys(value).sort())===JSON.stringify([...keys].sort());
const plainHeaders={'Cache-Control':'private, no-store','Vary':'Cookie, Accept-Language','X-Robots-Tag':'noindex, nofollow'};
export function encodeModernBootstrap(value){
 if(!exact(value,['state','returnTo'])||!object(value.state)||typeof value.returnTo!=='string'||value.returnTo.length>4096)fail('native bootstrap shape');
 const s=value.state;
 if(!exact(s,['locale','country','suggestedCountry','promptDismissed','source'])||!['en','bg'].includes(s.locale)||typeof s.country!=='string'||typeof s.suggestedCountry!=='string'||!(/^[A-Z]{2}$/).test(s.country)||!(/^[A-Z]{2}$/).test(s.suggestedCountry)||typeof s.promptDismissed!=='boolean'||!['url','cookie','header','country','default'].includes(s.source))fail('exact native preference state');
 const json=JSON.stringify({schemaVersion:1,kind:'cars-modern-native-preferences-bootstrap',state:value.state,returnTo:value.returnTo});
 if(json.length>8192)fail('native bootstrap exceeds bound');
 return json.replace(/</g,'\\u003c').replace(/\u2028/g,'\\u2028').replace(/\u2029/g,'\\u2029');
}
export function insertModernBootstrap(html,value){
 if(typeof html!=='string'||html.split(MODERN_BOOTSTRAP_SLOT).length!==2||html.split('id="'+MODERN_BOOTSTRAP_ID+'"').length!==2)fail('exact native bootstrap slot missing or duplicated');
 return html.replace(MODERN_BOOTSTRAP_SLOT,'<script type="application/json" id="'+MODERN_BOOTSTRAP_ID+'">'+encodeModernBootstrap(value)+'</script>');
}
export function validateModernStaticManifest(manifest){
 if(!exact(manifest,['schemaVersion','kind','mount','routes'])||manifest.schemaVersion!==1||manifest.kind!=='cars-modern-services-static-experiment'||!['/variant-2','/variant-3'].includes(manifest.mount)||!Array.isArray(manifest.routes)||manifest.routes.length!==2)fail('exact experiment manifest');
 const locales=new Set();
 for(const route of manifest.routes){
  if(!exact(route,['locale','pathname','html','rsc'])||!['en','bg'].includes(route.locale)||locales.has(route.locale)||route.pathname!==manifest.mount+'/'+route.locale+'/services')fail('exact two native Services routes');
  locales.add(route.locale);
  for(const kind of ['html','rsc']){
   const asset=route[kind];
   if(!exact(asset,['path','bytes','sha256'])||typeof asset.path!=='string'||typeof asset.sha256!=='string'||!/^[a-f0-9]{64}$/.test(asset.sha256)||asset.path!==MODERN_PRIVATE_PREFIX+asset.sha256+'.'+kind||!Number.isSafeInteger(asset.bytes)||asset.bytes<1||asset.bytes>2*1024*1024)fail('bounded sealed '+kind+' snapshot');
  }
 }
 if(new Set(manifest.routes.flatMap(r=>[r.html.path,r.rsc.path])).size!==4)fail('duplicate native snapshot path');
 return structuredClone(manifest);
}
export function modernSnapshotRequest(request,manifest){
 const url=new URL(request.url);
 if(!['GET','HEAD'].includes(request.method)||request.headers.has('next-action')||request.headers.has('x-rsc-action'))return null;
 const route=manifest.routes.find(r=>r.pathname===url.pathname);if(!route)return null;
 const rsc=request.headers.get('RSC')==='1';
 const queries=[...url.searchParams];
 if(queries.length&&(!rsc||queries.length!==1||queries[0][0]!=='_rsc'||queries[0][1].length>128))return null;
 return {route,kind:rsc?'rsc':'html'};
}
function trustedRequest(request){
 const headers=new Headers(request.headers);headers.delete('x-cars-country');headers.delete('x-vercel-ip-country');
 const country=request.cf?.country;
 const trustedCountry=typeof country==='string'&&/^[A-Z]{2}$/.test(country)&&country!=='XX'?country:null;
 if(trustedCountry)headers.set('x-cars-country',trustedCountry);
 return {request:new Request(request,{headers}),trustedCountry};
}
function nativeReturnTo(value,origin,manifest){
 if(typeof value!=='string'||value.length>4096||!value.startsWith('/')||value.startsWith('//')||/[\\\u0000-\u001f\u007f]/.test(value))fail('invalid native returnTo');
 const target=new URL(value,origin);
 const prefix=manifest.mount+'/',relative=target.pathname.slice(prefix.length),locale=relative.split('/')[0];
 if(target.origin!==origin||!target.pathname.startsWith(prefix)||!['en','bg'].includes(locale)||/%(?:2f|5c|00)/i.test(value))fail('returnTo outside native Modern mount');
 // Exact route/query admission remains owned by the compiled native safeReturnPath policy.
 // URL normalization must not silently change the context that policy validates.
 if(target.pathname+target.search+target.hash!==value)fail('noncanonical native returnTo');
 return {returnTo:value,locale};
}
async function readSealedAsset(response,expected){
 if(!response.body)fail('sealed snapshot body absent');
 const reader=response.body.getReader(),parts=[];let total=0;
 try{for(;;){const {done,value}=await reader.read();if(done)break;total+=value.byteLength;if(total>expected){await reader.cancel();fail('sealed snapshot size differs');}parts.push(value);}}
 finally{reader.releaseLock();}
 if(total!==expected)fail('sealed snapshot size differs');
 const bytes=new Uint8Array(total);let offset=0;for(const part of parts){bytes.set(part,offset);offset+=part.byteLength;}return bytes;
}
export function createModernFreeStaticRuntime({manifest,resolvePreferences}){
 const plan=validateModernStaticManifest(manifest);
 if(typeof resolvePreferences!=='function')fail('compiled native pure resolver required');
 async function bootstrap(request,route,returnTo){
  const trusted=trustedRequest(request);
  const value=await resolvePreferences({...trusted,locale:route.locale,returnTo});
  if(!exact(value,['state','returnTo'])||value.returnTo!==returnTo||value.state?.locale!==route.locale)fail('native resolver returned a different return path or locale');
  encodeModernBootstrap(value);return value;
 }
 return {async fetch(request,env){
  const url=new URL(request.url);
  if(url.pathname===MODERN_PRIVATE_PREFIX.slice(0,-1)||url.pathname.startsWith(MODERN_PRIVATE_PREFIX)||url.pathname==='/_vinext/static-cache'||url.pathname.startsWith('/_vinext/static-cache/'))return new Response('Not found',{status:404,headers:plainHeaders});
  if(url.pathname===MODERN_PREFERENCES_ENDPOINT){
   if(request.method!=='GET')return new Response('Method not allowed',{status:405,headers:{...plainHeaders,Allow:'GET'}});
   const pairs=[...url.searchParams];if(pairs.length!==1||pairs[0][0]!=='returnTo')return new Response('Invalid preference context',{status:400,headers:plainHeaders});
   let context,value;try{context=nativeReturnTo(pairs[0][1],url.origin,plan);value=await bootstrap(request,context,context.returnTo);}catch{return new Response('Invalid preference context',{status:400,headers:plainHeaders});}
   return new Response(encodeModernBootstrap(value),{headers:{...plainHeaders,'Content-Type':'application/json; charset=utf-8'}});
  }
  const selected=modernSnapshotRequest(request,plan);if(!selected)return null;
  if(!env?.ASSETS||typeof env.ASSETS.fetch!=='function')fail('native ASSETS binding required');
  const asset=selected.route[selected.kind];
  // ASSETS.fetch applies auto-trailing-slash: sha.html redirects to sha.
  // Request that canonical alias internally; never follow an asset redirect.
  const assetPath=selected.kind==='html'?asset.path.slice(0,-'.html'.length):asset.path;
  const assetRequest=new Request(new URL(assetPath,url.origin),{method:'GET',redirect:'manual'});
  const response=await env.ASSETS.fetch(assetRequest);
  if(response.status!==200)fail('sealed snapshot absent');
  const bytes=await readSealedAsset(response,asset.bytes);
  const headers=new Headers(plainHeaders);headers.set('Content-Type',selected.kind==='rsc'?'text/x-component':'text/html; charset=utf-8');
  if(selected.kind==='rsc')return new Response(request.method==='HEAD'?null:bytes,{headers});
  const html=new TextDecoder('utf-8',{fatal:true}).decode(bytes),value=await bootstrap(request,selected.route,url.pathname);
  return new Response(request.method==='HEAD'?null:insertModernBootstrap(html,value),{headers});
 }};
}
