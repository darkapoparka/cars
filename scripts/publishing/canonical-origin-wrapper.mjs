import assert from 'node:assert/strict';
import {createHash} from 'node:crypto';
// Proven v2 factory below changes head metadata without rewriting React/RSC bodies.
export function canonicalOriginWrapper({originalImport,provider,canonical,ukDefault=false}) {
 assert(/^\.\/[A-Za-z0-9_.-]+\.mjs$/.test(originalImport));
 assert(new URL(provider).protocol==='https:' && new URL(canonical).protocol==='https:');
 const client=`(()=>{const p=${JSON.stringify(provider)},c=${JSON.stringify(canonical)},url=v=>v===p?c:v?.startsWith(p+'/')?c+v.slice(p.length):v;function update(){for(const e of document.head.querySelectorAll('link[href],meta[content]')){const a=e.tagName==='LINK'?'href':'content',v=e.getAttribute(a),n=url(v);if(v!==n)e.setAttribute(a,n);}for(const e of document.querySelectorAll('script[type="application/ld+json"]')){const v=e.textContent,n=v.replaceAll(p,c);if(n!==v)e.textContent=n;}}update();new MutationObserver(update).observe(document.head,{subtree:true,childList:true,attributes:true,attributeFilter:['href','content']});document.addEventListener('DOMContentLoaded',update,{once:true});})();`;
 return 'import original from '+JSON.stringify(originalImport)+';\n'+
 'const provider='+JSON.stringify(provider)+',canonical='+JSON.stringify(canonical)+',client='+JSON.stringify(client)+';\n'+
 'const originScript="/.well-known/cars-origin-v2.js";\n'+
 'const origin=value=>value===provider?canonical:value?.startsWith(provider+"/")?canonical+value.slice(provider.length):value;\n'+
 'export default {async fetch(request,env,ctx){const url=new URL(request.url);'+
 'if(url.pathname===originScript && (request.method==="GET"||request.method==="HEAD"))return new Response(request.method==="HEAD"?null:client,{headers:{"content-type":"application/javascript; charset=utf-8","cache-control":"public, max-age=86400"}});'+
 (ukDefault?'if(url.pathname==="/"||url.pathname==="/variant-3"||url.pathname==="/variant-3/"){url.pathname=url.pathname==="/"?"/en":"/variant-3/en";return Response.redirect(url.toString(),302);}':'')+
 'const response=await original.fetch(request,env,ctx);if(response.status===101)return response;const headers=new Headers(response.headers),location=headers.get("location");if(location)headers.set("location",origin(location));const result=new Response(response.body,{status:response.status,statusText:response.statusText,headers});if(!(headers.get("content-type")||"").toLowerCase().includes("text/html"))return result;headers.delete("content-length");headers.delete("etag");const html=new Response(result.body,{status:result.status,statusText:result.statusText,headers});return new HTMLRewriter().on("link[href]",{element(e){const value=e.getAttribute("href"),next=origin(value);if(next!==value)e.setAttribute("href",next);}}).on("meta[content]",{element(e){const value=e.getAttribute("content"),next=origin(value);if(next!==value)e.setAttribute("content",next);}}).on("head",{element(e){e.append("<script defer src=\\""+originScript+"\\"></script>",{html:true});}}).transform(html);}};\n';
}

export const CANONICAL_COMPOSITION_KIND='cars-canonical-origin-wrapper-v2';
export const CANONICAL_ORIGINAL_WORKER_PATH='server/__cars_original_worker.mjs';
const hash=value=>createHash('sha256').update(value).digest('hex');
const exactKeys=(value,keys)=>assert(value&&typeof value==='object'&&!Array.isArray(value)&&JSON.stringify(Object.keys(value).sort())===JSON.stringify([...keys].sort()),'Exact canonical composition fields required');
function origins({providerOrigin,canonicalOrigin,toolRevision,ukDefault},variants){
 let provider,canonical;try{provider=new URL(providerOrigin);canonical=new URL(canonicalOrigin);}catch{throw Error('Exact canonical composition origins required');}
 assert(provider.origin===providerOrigin&&provider.protocol==='https:'&&!provider.username&&!provider.password&&/^[-a-z0-9]+\.[-a-z0-9]+\.workers\.dev$/.test(provider.hostname),'Canonical composition provider must be the exact workers.dev origin');
 assert(canonical.origin===canonicalOrigin&&canonical.protocol==='https:'&&!canonical.username&&!canonical.password&&/^[a-z0-9]+(?:-[a-z0-9]+)*\.webpreviews\.site$/.test(canonical.hostname),'Canonical composition requires an explicit exact reviewed hostname');
 assert(/^[a-f0-9]{40}$/.test(toolRevision)&&typeof ukDefault==='boolean','Canonical composition requires the source tool revision and explicit locale behavior');
 if(ukDefault)assert(variants?.find(v=>v.key==='modern')?.base==='/variant-2'&&variants?.find(v=>v.key==='import')?.base==='/variant-3','Reviewed UK redirect requires the proven Modern/Import mounts');
}
export function canonicalCompositionEntry(composition){
 return canonicalOriginWrapper({originalImport:'./__cars_original_worker.mjs',provider:composition.providerOrigin,canonical:composition.canonicalOrigin,ukDefault:composition.ukDefault});
}
export function createCanonicalComposition(selection,{providerOrigin,toolRevision,variants}){
 exactKeys(selection,['canonicalOrigin','ukDefault']);
 origins({...selection,providerOrigin,toolRevision},variants);
 const value={schemaVersion:1,kind:CANONICAL_COMPOSITION_KIND,wrapperVersion:2,providerOrigin,canonicalOrigin:selection.canonicalOrigin,ukDefault:selection.ukDefault,originalWorkerPath:CANONICAL_ORIGINAL_WORKER_PATH,toolRevision};
 return {...value,wrapperSha256:hash(canonicalCompositionEntry(value))};
}
export function validateCanonicalComposition(value,{providerOrigin,toolRevision,variants}){
 exactKeys(value,['schemaVersion','kind','wrapperVersion','providerOrigin','canonicalOrigin','ukDefault','originalWorkerPath','toolRevision','wrapperSha256']);
 assert(value.schemaVersion===1&&value.kind===CANONICAL_COMPOSITION_KIND&&value.wrapperVersion===2&&value.originalWorkerPath===CANONICAL_ORIGINAL_WORKER_PATH,'Only the reviewed canonical wrapper v2 is permitted');
 assert(value.providerOrigin===providerOrigin&&value.toolRevision===toolRevision,'Canonical composition provider/source tool revision differs');
 origins(value,variants);
 assert(value.wrapperSha256===hash(canonicalCompositionEntry(value)),'Canonical wrapper generator digest differs');
 return value;
}

