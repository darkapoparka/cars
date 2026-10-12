import fs from 'node:fs';
import path from 'node:path';
import {createHash} from 'node:crypto';
import {pathToFileURL} from 'node:url';
import {registerHooks} from 'node:module';

// Bounded, explicitly requested Priselci experiment; never a template promotion.
export const MODERN_FREE_SOURCE_REVISION='b1f0f5609c7c249cfd0649c122849ff2cbb8dfde';
export const MODERN_FREE_CLIENT_TREE='5027934141219c6f8373f95bc239e8b9f5eb12cf';
export const MODERN_FREE_SOURCE_RESEAL=Object.freeze({
 schemaVersion:1,kind:'cars-maintained-pilot-logo-contract-reseal',
 predecessorSourceTree:'9b5ad1a83b3442a4f1453169517195afb6fe5a4b',
 preparedSourceTree:MODERN_FREE_CLIENT_TREE,
 publicationCommit:'bf6303bbde4268c649efb91df2b04ad3240b347b',
 sourceRunId:38189987139,
 receiptSha256:'032475f943c5c933d767692a6e9a1049b2703ac4bdaa06e86bbe6c204e43e8fe',
 independentHandoffSha256:'614eb2d783aa6a28ce7e14d3040219cc61ded71f88c13e43233fc32892c46814',
});
export const MODERN_FREE_OVERLAY_PATHS=Object.freeze([
 'templates/modern/apps/web/lib/locale-preferences.ts',
 'templates/modern/apps/web/app/[locale]/layout.tsx',
 'templates/modern/packages/marketplace-ui/components/locale-preferences.tsx',
]);
const hash=bytes=>createHash('sha256').update(bytes).digest('hex');
const blob=bytes=>createHash('sha1').update(Buffer.from('blob '+bytes.length+'\0')).update(bytes).digest('hex');
const exact=(v,keys)=>v&&typeof v==='object'&&!Array.isArray(v)&&JSON.stringify(Object.keys(v).sort())===JSON.stringify([...keys].sort());
const hex=(v,n)=>typeof v==='string'&&new RegExp('^[a-f0-9]{'+n+'}$').test(v);
const fail=message=>{throw Error('Modern Free build experiment: '+message);};
function replaceOnce(source,from,to){if(source.split(from).length!==2)fail('unreviewed source boundary '+from.slice(0,65));return source.replace(from,to);}

export function validateModernFreeServicesRequest(value,{dealer,sourceTree,sourceReleases}={}){
 if(value===undefined)return null;
 if(!exact(value,['schemaVersion','kind','dealer','sourceRevision','sourceTree','sourceReseal','overlayCommit','files'])||value.schemaVersion!==1||value.kind!=='cars-modern-free-services-build-experiment'||value.dealer!=='priselci'||value.dealer!==dealer||value.sourceRevision!==MODERN_FREE_SOURCE_REVISION||value.sourceTree!==MODERN_FREE_CLIENT_TREE||sourceTree!==value.sourceTree||sourceReleases?.modern?.revision!==value.sourceRevision||!hex(value.overlayCommit,40)||!Array.isArray(value.files)||value.files.length!==3||!exact(value.sourceReseal,Object.keys(MODERN_FREE_SOURCE_RESEAL))||Object.entries(MODERN_FREE_SOURCE_RESEAL).some(([key,expected])=>value.sourceReseal[key]!==expected))fail('exact reviewed resealed dealer/source and published overlay request required');
 const paths=new Set();
 for(const row of value.files){
  if(!exact(row,['path','beforeGitBlob','beforeSha256','afterGitBlob','afterSha256'])||!MODERN_FREE_OVERLAY_PATHS.includes(row.path)||paths.has(row.path)||!hex(row.beforeGitBlob,40)||!hex(row.afterGitBlob,40)||!hex(row.beforeSha256,64)||!hex(row.afterSha256,64)||row.beforeGitBlob===row.afterGitBlob)fail('exact three native before/after leases required');
  paths.add(row.path);
 }
 return structuredClone(value);
}

export function applyModernFreeNativeOverlay(input,value,{dealer,sourceTree,sourceReleases,sourceCommit,readOverlay}={}){
 const request=validateModernFreeServicesRequest(value,{dealer,sourceTree,sourceReleases});
 if(!request)return {files:input,experiment:null};
 if(!(input instanceof Map)||!hex(sourceCommit,40)||typeof readOverlay!=='function')fail('immutable compiled source authority required');
 const files=new Map(input),rows=[];
 for(const row of request.files){
  const member=row.path.slice('templates/'.length),before=files.get(member),after=Buffer.from(readOverlay(request.overlayCommit,row.path));
  if(!Buffer.isBuffer(before)||hash(before)!==row.beforeSha256||blob(before)!==row.beforeGitBlob||hash(after)!==row.afterSha256||blob(after)!==row.afterGitBlob)fail('original or overlay native bytes differ: '+row.path);
  files.set(member,after);rows.push({...row,bytes:after.length});
 }
 const experiment={schemaVersion:1,kind:request.kind,dealer,sourceCommit,sourceTree,sourceRevision:request.sourceRevision,sourceReseal:request.sourceReseal,overlayCommit:request.overlayCommit,requestSha256:hash(JSON.stringify(request)),files:rows,originalSourceUnchanged:true};
 return {files,experiment};
}

export function applyModernFreeBuildOverlay(input,experiment,{base}={}){
 if(experiment===undefined||experiment===null)return input;
 if(!(input instanceof Map)||!['/variant-2','/variant-3'].includes(base)||experiment.kind!=='cars-modern-free-services-build-experiment'||experiment.dealer!=='priselci'||!hex(experiment.sourceCommit,40)||!hex(experiment.overlayCommit,40)||experiment.sourceTree!==MODERN_FREE_CLIENT_TREE||experiment.sourceRevision!==MODERN_FREE_SOURCE_REVISION||!hex(experiment.requestSha256,64)||experiment.files?.length!==3)fail('sealed native overlay required');
 const files=new Map(input),generated=[];
 const put=(name,bytes)=>{const before=files.get(name);if(!before)fail('missing original graph module '+name);const next=Buffer.from(bytes);files.set(name,next);generated.push({path:name,beforeGitBlob:blob(before),beforeSha256:hash(before),afterGitBlob:blob(next),afterSha256:hash(next)});};
 const layout='modern/apps/web/app/[locale]/layout.tsx';let body=files.get(layout)?.toString();if(!body)fail('native Layout missing');
 body=replaceOnce(body,'import { getRequestPreferences } from "@/lib/locale-preferences";','import { getRequestPreferences, getStaticServicesPreferences } from "@/lib/locale-preferences";');
 const phase='process.env.VINEXT_PRERENDER === "1" && process.env.NEXT_PHASE === "phase-production-build"';
 body=replaceOnce(body,'export const dynamic = "force-dynamic";','export const dynamic = '+phase+' ? "auto" : "force-dynamic";');
 body=replaceOnce(body,'export const revalidate = 0;','export const revalidate = '+phase+' ? false : 0;');
 body=replaceOnce(body,'  const preferences = nativePreferences ?? await getRequestPreferences(normalizedLocale);','  const carsPrerender = '+phase+';\n  requestBootstrap = true;\n  const preferences = nativePreferences ?? (carsPrerender ? getStaticServicesPreferences(normalizedLocale) : await getRequestPreferences(normalizedLocale));');
 put(layout,body);
 const page='modern/apps/web/app/[locale]/services/page.tsx',original=files.get(page)?.toString();
 if(!original||/\bexport\s+(?:const|function|async\s+function)\s+(?:generateStaticParams|dynamic|revalidate)\b/.test(original))fail('unknown Services static parameters/config boundary');
 put(page,original+'\n// Exact immutable paths for the owned vinext prerender phase only.\nexport function generateStaticParams() { return [{ locale: "en" }, { locale: "bg" }]; }\n');
 const policySources=['modern/apps/web/proxy.ts','modern/packages/security/proxy.ts','modern/packages/internationalization/policy.ts','modern/apps/web/env.ts'].map(name=>{const bytes=files.get(name);if(!bytes)fail('native response policy source missing: '+name);return {path:name,gitBlob:blob(bytes),sha256:hash(bytes),bytes:bytes.length};});
 const proxy='modern/apps/web/proxy.ts';body=files.get(proxy).toString();
 body=replaceOnce(body,'  matcher: [','  get matcher() {\n    const original = [');
 body=replaceOnce(body,'  ],\n};','    ];\n    return '+phase+'\n      ? original.map(pattern => pattern.replace("/((?!", "/((?!(?:en|bg)/services$|"))\n      : original;\n  },\n};');
 body+='\n// Same native security configuration; this pure export performs no request or SSR.\nexport async function resolveCarsNativeResponsePolicy(locale: "en" | "bg") {\n  if (locale !== "en" && locale !== "bg") throw new Error("Exact Services locale required");\n  const response = await securityHeaders();\n  const headers = new Headers(response.headers);\n  headers.delete("x-middleware-next");\n  for (const [name, value] of carsPrivateHeaders(locale)) headers.set(name, value);\n  return Object.fromEntries(headers);\n}\n';
 body='import { privateHeaders as carsPrivateHeaders } from "@repo/internationalization/policy";\n'+body;put(proxy,body);
 const receipt={...experiment,mount:base,vinext:'1.1.0',phase:{VINEXT_PRERENDER:'1',NEXT_PHASE:'phase-production-build'},generated,policySources,policyDependencies:{'@nosecone/next':'1.2.0',nosecone:'1.2.0'},graph:'original-native-rsc-ssr-client',queryCache:false,nativeApproved:false,hostedApproved:false,freeCpuQualified:false};
 for(const [name,bytes]of [['.cars-modern-free-build.json',JSON.stringify(receipt,null,2)+'\n'],['scripts/modern-free-services-build.mjs',modernFreeServicesBuildSource()]]){if(files.has(name))fail('occupied generated experiment member '+name);files.set(name,Buffer.from(bytes));}
 return files;
}

/** Observe the tagged driver's own loopback responses; never replace its body. */
export function installModernNativeResponseCapture({packageRoot,mount,sourceTree,scope=globalThis,env=process.env}={}){
 if(!['/variant-2','/variant-3'].includes(mount)||!hex(sourceTree,40)||typeof scope.fetch!=='function')fail('bounded native capture authority required');
 packageRoot=fs.realpathSync(packageRoot);
 const key=Symbol.for('cars.modern.native-response-capture'),existing=scope[key];
 if(existing){
  if(existing.kind!=='cars-modern-native-response-capture'||typeof existing.closed!=='boolean')fail('native capture scope owner differs');
  const same=existing.packageRoot===packageRoot&&existing.mount===mount&&existing.sourceTree===sourceTree&&existing.env===env;
  if(!existing.closed||same){
   if(!same)fail('native capture authority differs');
   if(scope.fetch!==(existing.closed?existing.originalFetch:existing.observedFetch))fail('native capture fetch owner changed');
   return existing.handle;
  }
  if(scope.fetch!==existing.originalFetch)fail('native capture fetch owner changed');
 }
 const originalFetch=scope.fetch,seen=new Set();
 const restore=()=>{if(state.closed)return;if(scope.fetch!==observedFetch)fail('native capture fetch owner changed');scope.fetch=originalFetch;state.closed=true;if(state.exitRegistered){process.removeListener('exit',restore);state.exitRegistered=false;}};
 const record=async(response,locale,kind,pathname)=>{
  if(response.status!==200)fail('canonical native '+kind+' response is not 200');
  const bytes=await readModernCapturedBody(response.clone()),headers=Object.fromEntries(response.headers);
  const value={schemaVersion:1,kind:'cars-modern-official-prerender-response',sourceTree,pathname,locale,representation:kind,status:response.status,bytes:bytes.length,sha256:hash(bytes),headers};
  fs.writeFileSync(inside(packageRoot,'.cars-modern-native-response-'+locale+'-'+kind+'.json'),JSON.stringify(value,null,2)+'\n',{flag:'wx'});
 };
 async function observedFetch(input,init){
  const request=new Request(input,init),url=new URL(request.url),locale=['en','bg'].find(value=>url.pathname===mount+'/'+value+'/services');
  const capture=env.VINEXT_PRERENDER==='1'&&env.NEXT_PHASE==='phase-production-build'&&url.protocol==='http:'&&url.hostname==='127.0.0.1'&&url.port&&locale&&request.method==='GET'&&url.search===''&&request.headers.has('x-vinext-prerender-secret')&&request.headers.get('RSC')!=='1';
  if(!capture)return originalFetch(input,init);
  try{
   if(seen.has(locale)||['cookie','authorization','x-cars-country','x-vercel-ip-country','cf-ipcountry'].some(name=>request.headers.has(name)))fail('unexpected canonical build request context');seen.add(locale);
   const response=await originalFetch(input,init);await record(response,locale,'html',url.pathname);
   // The official driver normally extracts Flight from its HTML. Ask its same
   // live handler for canonical RSC metadata and require the emitted bytes join.
   const rscUrl=new URL(url);rscUrl.search='?_rsc=';const headers=new Headers(request.headers);headers.set('RSC','1');headers.set('Accept','text/x-component');
   const rsc=await originalFetch(new Request(rscUrl,{method:'GET',headers,redirect:'manual'}));await record(rsc,locale,'rsc',url.pathname);await rsc.body?.cancel();
   if(seen.size===2)restore();return response;
  }catch(error){restore();throw error;}
 }
 const state={kind:'cars-modern-native-response-capture',packageRoot,mount,sourceTree,env,originalFetch,observedFetch,closed:false,exitRegistered:false,handle:null};
 state.handle={restore,
  registerExitHook(){if(state.closed||state.exitRegistered)return;process.once('exit',restore);state.exitRegistered=true;},
 };
 scope[key]=state;scope.fetch=observedFetch;return state.handle;
}
async function readModernCapturedBody(response){
 if(!response.body)fail('native capture body missing');const reader=response.body.getReader(),parts=[];let size=0;
 try{for(;;){const result=await reader.read();if(result.done)break;size+=result.value.byteLength;if(size>2*1024*1024){await reader.cancel();fail('native capture exceeds snapshot bound');}parts.push(Buffer.from(result.value));}}finally{reader.releaseLock();}
 if(!size)fail('native capture body empty');return Buffer.concat(parts,size);
}

/** An additional export in the SAME RSC build, with original source/module IDs. */
export function createModernFreeServicesPlugin({packageRoot,cwd}){
 const virtual='virtual:cars-native-preferences',resolved='\0'+virtual;let manager;
 const phaseFor=environment=>{
  if(!['rsc','ssr','client'].includes(environment.name)||typeof manager?.isScanBuild!=='boolean')fail('pinned native build lifecycle missing');
  const phase=manager.isScanBuild?'scan':'final';
  if(environment.config.build.write!==(phase==='final')||(phase==='scan'&&environment.name==='client'))fail('native scan/final write authority differs');
  return phase;
 };
 const recordGraph=(environment,bundle,phase)=>{
  const outputDirectory=path.relative(packageRoot,path.resolve(environment.config.build.outDir)).replaceAll('\\','/');inside(packageRoot,outputDirectory);
  const rows=Object.values(bundle).filter(item=>item.type==='chunk').map(item=>({file:item.fileName,imports:item.imports,dynamicImports:item.dynamicImports,moduleIds:item.moduleIds.map(id=>id.replaceAll('\\','/').replace(packageRoot.replaceAll('\\','/')+'/','<package>/')),bytes:Buffer.byteLength(item.code),sha256:hash(item.code)})).sort((a,b)=>a.file.localeCompare(b.file));
  const wasm=Object.values(bundle).filter(item=>item.type==='asset'&&item.fileName.endsWith('.wasm')).map(item=>{const bytes=Buffer.from(item.source);return {file:item.fileName,bytes:bytes.length,sha256:hash(bytes)};}).sort((a,b)=>a.file.localeCompare(b.file));
  if(!rows.length||(phase==='final'&&environment.name==='rsc'&&!rows.some(row=>row.file==='cars-native-preferences.js')))fail('native '+phase+' '+environment.name+' graph missing');
  const suffix=phase==='scan'?'scan-'+environment.name:environment.name;
  const value={schemaVersion:1,environment:environment.name,graph:'original-native',phase,lifecycle:{plugin:'@vitejs/plugin-rsc',version:'0.5.36',isScanBuild:manager.isScanBuild,write:environment.config.build.write},outputDirectory,rows,wasm};
  writeModernOwnedReceipt(packageRoot,'.cars-modern-free-graph-'+suffix+'.json',JSON.stringify(value,null,2)+'\n');
  if(phase==='final'&&environment.name==='rsc'){const contract=JSON.parse(fs.readFileSync(inside(packageRoot,'.cars-modern-free-build.json')));installModernNativeWasmModules({packageRoot,graph:value,mount:contract.mount,sourceTree:contract.sourceTree,purpose:'official-prerender'}).registerExitHook();}
 };
 return {name:'cars-modern-free-services-graph',apply:'build',enforce:'post',
  // Same public API lookup as tagged getPluginApi; the manager is shared by all
  // five official stages. Do not infer phase from environment identity/counts.
  configResolved(config){manager=config.plugins.find(plugin=>plugin.name==='rsc:minimal')?.api?.manager;if(typeof manager?.isScanBuild!=='boolean')fail('pinned native build lifecycle missing');},
  resolveId(id){if(id===virtual)return resolved;},
  load(id){if(id===resolved)return 'export { resolveCarsNativePreferences } from '+JSON.stringify(path.join(cwd,'lib/locale-preferences.ts').replaceAll('\\','/'))+';\nexport { resolveCarsNativeResponsePolicy } from '+JSON.stringify(path.join(cwd,'proxy.ts').replaceAll('\\','/'))+';\nexport { VINEXT_INTERNAL_HEADERS } from "vinext/internal/server/headers";';},
  buildStart(){const phase=phaseFor(this.environment);if(this.environment.name==='rsc'){const contract=JSON.parse(fs.readFileSync(path.join(packageRoot,'.cars-modern-free-build.json'),'utf8'));verifyModernNativePolicyToolchain(packageRoot);this.emitFile({type:'chunk',id:virtual,fileName:'cars-native-preferences.js',preserveSignature:'strict'});if(phase==='final'){const capture=installModernNativeResponseCapture({packageRoot,mount:contract.mount,sourceTree:contract.sourceTree});capture.registerExitHook();}}},
  generateBundle:{order:'post',handler(_options,bundle){const phase=phaseFor(this.environment);if(phase==='scan')recordGraph(this.environment,bundle,phase);}},
  // All generateBundle mutations precede writeBundle. Only written final output
  // is authoritative; scan graphs remain separate immutable evidence.
  writeBundle:{order:'post',handler(_options,bundle){const phase=phaseFor(this.environment);if(phase!=='final')fail('scan graph was written');recordGraph(this.environment,bundle,phase);}},
 };
}

function verifyModernNativePolicyToolchain(packageRoot){
 const nextDirectory=fs.realpathSync(path.join(packageRoot,'modern/packages/security/node_modules/@nosecone/next')),noseconeDirectory=fs.realpathSync(path.resolve(nextDirectory,'../../nosecone'));
 const rows=[];for(const [name,directory]of [['@nosecone/next',nextDirectory],['nosecone',noseconeDirectory]]){
  const packageBytes=fs.readFileSync(path.join(directory,'package.json')),metadata=JSON.parse(packageBytes),entryBytes=fs.readFileSync(path.join(directory,'index.js'));
  if(metadata.name!==name||metadata.version!=='1.2.0'||metadata.main!=='./index.js'||(name==='@nosecone/next'&&metadata.dependencies?.nosecone!=='1.2.0'))fail('native security dependency differs');
  rows.push({name,version:metadata.version,packageSha256:hash(packageBytes),entrySha256:hash(entryBytes),entryBytes:entryBytes.length});
 }
 writeModernOwnedReceipt(packageRoot,'.cars-modern-native-policy-toolchain.json',JSON.stringify({schemaVersion:1,kind:'cars-modern-native-policy-toolchain',rows},null,2)+'\n');
}

function writeModernOwnedReceipt(root,relative,value){
 const file=inside(root,relative),bytes=Buffer.from(value);
 try{fs.writeFileSync(file,bytes,{flag:'wx'});return;}catch(error){if(error.code!=='EEXIST')throw error;}
 const member=fs.lstatSync(file);
 if(member.isSymbolicLink()||!member.isFile()||!fs.readFileSync(file).equals(bytes))fail('owned native receipt bytes differ: '+relative);
}

/** Node normally instantiates .wasm ESM imports; Arcjet's workerd entry instead
 * expects compiled Modules and supplies its own exact component imports. */
export function installModernNativeWasmModules({packageRoot,graph,mount,sourceTree,purpose,scope=globalThis,env=process.env}={}){
 packageRoot=fs.realpathSync(packageRoot);
 if(!['/variant-2','/variant-3'].includes(mount)||sourceTree!==MODERN_FREE_CLIENT_TREE||!['official-prerender','compiled-policy-admission'].includes(purpose)||graph?.environment!=='rsc'||graph.phase!=='final'||graph.lifecycle?.plugin!=='@vitejs/plugin-rsc'||graph.lifecycle?.version!=='0.5.36'||graph.lifecycle?.isScanBuild!==false||graph.lifecycle?.write!==true||!Array.isArray(graph.wasm)||graph.wasm.length!==3)fail('exact final native WASM authority required');
 const contract=JSON.parse(fs.readFileSync(inside(packageRoot,'.cars-modern-free-build.json')));if(contract.mount!==mount||contract.sourceTree!==sourceTree)fail('native WASM compiled source authority differs');
 const output=inside(packageRoot,graph.outputDirectory),seen=new Set(),rows=graph.wasm.map(row=>{
  const match=new RegExp('^'+mount.slice(1)+'/_next/static/media/arcjet_analyze_js_req\\.component\\.(core(?:2|3)?)\\.[A-Za-z0-9_-]+\\.wasm$').exec(row.file);
  if(!match||seen.has(match[1])||!Number.isSafeInteger(row.bytes)||row.bytes<8||row.bytes>4*1024*1024||!hex(row.sha256,64))fail('bounded exact three Arcjet WASM assets required');seen.add(match[1]);
  const file=inside(output,row.file),member=fs.lstatSync(file);if(member.isSymbolicLink()||!member.isFile()||fs.realpathSync(file)!==file)fail('linked native WASM asset');const bytes=fs.readFileSync(file);
  if(bytes.length!==row.bytes||hash(bytes)!==row.sha256)fail('native WASM bytes do not join final graph');const module=new WebAssembly.Module(bytes);
  return {...row,url:pathToFileURL(file).href,imports:WebAssembly.Module.imports(module),exports:WebAssembly.Module.exports(module)};
 }).sort((a,b)=>a.file.localeCompare(b.file));
 const authority=JSON.stringify({packageRoot,mount,sourceTree,purpose,rows}),key=Symbol.for('cars.modern.native-wasm-module-loader'),existing=scope[key];
 if(existing&&(existing.kind!=='cars-modern-native-wasm-module-loader'||typeof existing.closed!=='boolean'))fail('native WASM scope owner differs');
 if(existing&&!existing.closed){if(existing.authority!==authority||existing.env!==env)fail('native WASM loader authority differs');return existing.handle;}
 const receipt={schemaVersion:1,kind:'cars-modern-native-node-wasm-module-contract',sourceTree,mount,purpose,nodeVersion:process.version,graphSha256:hash(JSON.stringify(graph,null,2)+'\n'),representation:'compiled WebAssembly.Module; original Arcjet instantiation/imports unchanged',rows};
 if(purpose==='official-prerender')writeModernOwnedReceipt(packageRoot,'.cars-modern-native-wasm-prerender.json',JSON.stringify(receipt,null,2)+'\n');
 const state={kind:'cars-modern-native-wasm-module-loader',authority,env,closed:false,exitRegistered:false,handle:null},loaded=new Set(),hooks=registerHooks(createModernNativeWasmHooks(rows,{env,purpose,loaded}));
 const restore=()=>{if(state.closed)return;hooks.deregister();state.closed=true;if(state.exitRegistered){process.removeListener('exit',restore);state.exitRegistered=false;}};
 state.handle={restore,receipt,loaded:()=>[...loaded].sort(),registerExitHook(){if(state.closed||state.exitRegistered)return;process.once('exit',restore);state.exitRegistered=true;}};scope[key]=state;return state.handle;
}

function createModernNativeWasmHooks(rows,{env,purpose,loaded}){
 const admitted=new Map(rows.map(row=>[row.url,row]));
 return {load(url,context,nextLoad){
  const row=admitted.get(url),phase=purpose==='compiled-policy-admission'||(env.VINEXT_PRERENDER==='1'&&env.NEXT_PHASE==='phase-production-build');
  if(!row||!phase)return nextLoad(url,context);loaded.add(url);
  // Re-read and revalidate at evaluation time; no emitted asset is rewritten.
  return {format:'module',shortCircuit:true,source:'import {readFileSync} from "node:fs";import {createHash} from "node:crypto";const bytes=readFileSync(new URL('+JSON.stringify(url)+'));if(bytes.length!=='+row.bytes+'||createHash("sha256").update(bytes).digest("hex")!=='+JSON.stringify(row.sha256)+')throw new Error("Native WASM graph bytes changed");export default new WebAssembly.Module(bytes);'};
 }};
}

function readModernNativeGraph(root,environment,phase){
 const suffix=phase==='scan'?'scan-'+environment:environment,bytes=fs.readFileSync(inside(root,'.cars-modern-free-graph-'+suffix+'.json')),value=JSON.parse(bytes);
 if(value.schemaVersion!==1||value.environment!==environment||value.graph!=='original-native'||value.phase!==phase||value.lifecycle?.plugin!=='@vitejs/plugin-rsc'||value.lifecycle?.version!=='0.5.36'||value.lifecycle?.isScanBuild!==(phase==='scan')||value.lifecycle?.write!==(phase==='final')||!value.rows?.length)fail('actual native '+phase+' graph receipt missing');
 const output=inside(root,value.outputDirectory),seen=new Set();
 for(const row of value.rows){
  if(typeof row.file!=='string'||seen.has(row.file)||!Number.isSafeInteger(row.bytes)||row.bytes<0||!hex(row.sha256,64))fail('native graph output authority differs');seen.add(row.file);
  if(phase==='final'){const file=inside(output,row.file),member=fs.lstatSync(file);if(member.isSymbolicLink()||!member.isFile())fail('linked native graph output');const actual=fs.readFileSync(file);if(actual.length!==row.bytes||hash(actual)!==row.sha256)fail('final native graph does not join written output');}
 }
 if(phase==='final'&&environment==='rsc'&&!seen.has('cars-native-preferences.js'))fail('final native resolver graph missing');
 return {bytes,value};
}

function inside(root,relative){const absolute=path.resolve(root,relative);if(!relative||absolute===root||!absolute.startsWith(root+path.sep))fail('unbounded emitted path');return absolute;}
function leaves(root){const result=[];function walk(dir){for(const item of fs.readdirSync(dir,{withFileTypes:true}).sort((a,b)=>a.name.localeCompare(b.name))){if(item.isSymbolicLink())fail('linked emitted member');const absolute=inside(root,path.relative(root,path.join(dir,item.name)));if(item.isDirectory())walk(absolute);else if(item.isFile())result.push(path.relative(root,absolute).replaceAll('\\','/'));else fail('nonfile emitted member');}}walk(root);return result;}
function removeOwnedLeaves(root,names){
 // Admission already checked every leaf. No recursive or ambiguous deletion.
 for(const name of names)fs.unlinkSync(inside(root,name));
 function empty(dir){for(const item of fs.readdirSync(dir,{withFileTypes:true})){const child=inside(root,path.relative(root,path.join(dir,item.name)));if(!item.isDirectory()||item.isSymbolicLink())fail('unexpected residual emitted member');empty(child);fs.rmdirSync(child);}}empty(root);fs.rmdirSync(root);
}

const modernNativeRequiredHeaders=['cache-control','cdn-cache-control','vercel-cdn-cache-control','content-language','content-type','vary','content-security-policy','cross-origin-opener-policy','cross-origin-resource-policy','origin-agent-cluster','referrer-policy','strict-transport-security','x-content-type-options','x-dns-prefetch-control','x-download-options','x-frame-options','x-permitted-cross-domain-policies','x-xss-protection'];
const modernNativeOptionalHeaders=['link','x-edge-runtime','x-vinext-params','x-vinext-dynamic-stale-time','x-nextjs-stale-time','x-vinext-rendered-path-and-search','x-vinext-rsc-build-id','x-vinext-rsc-compatibility-id','x-nextjs-deployment-id','x-deployment-id'];
const modernNativeVary='RSC, Next-Router-State-Tree, Next-Router-Prefetch, Next-Router-Segment-Prefetch, Next-Url, X-Vinext-Interception-Context, X-Vinext-Interception-Id, X-Vinext-Mounted-Slots, X-Vinext-Rsc-Render-Mode, X-Vinext-Rsc-State-Fingerprint';
export function sealModernNativeResponseHeaders(capture,security,{locale,kind,pathname,internalHeaderNames}){
 const omitted={},headers={},internal=new Set(internalHeaderNames);
 const diagnostics=new Set(['x-modern-public-path','x-vinext-cache','x-nextjs-cache','x-next-cache-tags','x-vinext-timing','server-timing','date','connection','keep-alive','transfer-encoding','content-length','content-encoding']);
 for(const [name,value]of Object.entries(capture)){
  if(typeof value!=='string'||/\bnonce-/i.test(value)||name==='set-cookie'||name==='x-vinext-stale-time-pending')fail('request-specific native response policy');
  if(diagnostics.has(name)||internal.has(name)||name.startsWith('x-middleware-')){omitted[name]=value;continue;}
  headers[name]=value;
 }
 Object.assign(headers,security);const allowed=new Set([...modernNativeRequiredHeaders,...modernNativeOptionalHeaders]);let total=0;
 for(const [name,value]of Object.entries(headers)){
  if(!allowed.has(name)||typeof value!=='string'||!value.length||value.length>16384||!/^[\x20-\x7e]+$/.test(value)||/\bnonce-/i.test(value))fail('unsafe or unfamiliar native response header: '+name);total+=name.length+value.length;
 }
 if(Object.keys(headers).length>32||total>32768||modernNativeRequiredHeaders.some(name=>!Object.hasOwn(headers,name)))fail('bounded complete native security policy required');
 if(headers['cache-control']!=='private, no-store'||headers['cdn-cache-control']!=='no-store'||headers['vercel-cdn-cache-control']!=='no-store'||headers['content-language']!==locale||headers.vary!==modernNativeVary||headers['content-type']!==(kind==='rsc'?'text/x-component':'text/html; charset=utf-8'))fail('native representation/private policy differs');
 if(kind==='rsc'){
  if(headers['x-vinext-params']!==encodeURIComponent(JSON.stringify({locale}))||headers['x-vinext-rendered-path-and-search']!==encodeURIComponent('/'+locale+'/services'))fail('actual native RSC route metadata required');
 }else if(Object.keys(headers).some(name=>name.startsWith('x-vinext-')||name==='x-nextjs-stale-time'||name==='x-nextjs-deployment-id'))fail('HTML has RSC-only metadata');
 return {headers:Object.fromEntries(Object.entries(headers).sort()),omitted};
}
function nativeResponseIdentities(headers){
 const identity=value=>{if(value===undefined)return null;if(typeof value!=='string'||value.length<1||value.length>256||!/^[\x21-\x7e]+$/.test(value))fail('native build identity is unbounded');return value;};
 const deployment=headers['x-nextjs-deployment-id'];
 if(headers['x-deployment-id']!==undefined&&headers['x-deployment-id']!==deployment)fail('native deployment identities differ');
 return {buildId:identity(headers['x-vinext-rsc-build-id']),compatibilityId:identity(headers['x-vinext-rsc-compatibility-id']),deploymentId:identity(deployment)};
}

export async function emitModernFreeServicesSnapshots({packageRoot,target}){
 if(target.key!=='modern'||!target.freeStaticExperiment)fail('explicit Modern target marker required');
 packageRoot=fs.realpathSync(packageRoot);const contract=JSON.parse(fs.readFileSync(inside(packageRoot,'.cars-modern-free-build.json'),'utf8'));
 if(contract.mount!==target.base||contract.vinext!=='1.1.0'||contract.sourceTree!==MODERN_FREE_CLIENT_TREE||!hex(contract.overlayCommit,40))fail('original compiled overlay contract differs');
 const server=inside(packageRoot,target.root+'/dist/server'),client=inside(packageRoot,target.assets),prerender=inside(server,'prerendered-routes'),indexPath=inside(server,'vinext-prerender.json');
 for(const dir of [server,client,prerender])if(fs.lstatSync(dir).isSymbolicLink()||fs.realpathSync(dir)!==dir)fail('linked build output');
 const indexBytes=fs.readFileSync(indexPath),index=JSON.parse(indexBytes);if(!hex(index.buildId,32)&&!(typeof index.buildId==='string'&&index.buildId.length>0&&index.buildId.length<=256))fail('actual native BUILD_ID required');
 if(!Array.isArray(index.routes)||index.trailingSlash===true)fail('unexpected official prerender index');
 const wanted=['/en/services','/bg/services'],rendered=index.routes.filter(row=>row.status==='rendered'),seen=new Set(),allowedFiles=[];
 for(const row of index.routes)if(row.status==='error'||!['rendered','skipped'].includes(row.status))fail('unsuccessful native prerender route');
 for(const row of rendered){const pathname=row.path??row.route;
  if(pathname==='/404'&&row.route==='/404'&&row.router==='app'&&row.revalidate===false&&row.path===undefined&&row.responseStatus===undefined&&!row.fallback&&!row.notFound){if(seen.has('/404'))fail('duplicate generated404');seen.add('/404');allowedFiles.push('404.html');continue;}
  if(!wanted.includes(pathname)||seen.has(pathname)||row.router!=='app'||row.route!=='/[locale]/services'||row.fallback||row.notFound||row.redirectProps||(row.responseStatus!==undefined&&row.responseStatus!==200)||row.revalidate!==false)fail('extra or noncanonical successful prerender route');
  seen.add(pathname);allowedFiles.push(pathname.slice(1)+'.html',pathname.slice(1)+'.rsc');
 }
 if(wanted.some(name=>!seen.has(name)))fail('exact EN/BG Services pair missing');
 const actual=leaves(prerender).sort();if(JSON.stringify(actual)!==JSON.stringify(allowedFiles.sort()))fail('extra/missing official prerender product');
 if(fs.existsSync(inside(client,'_vinext/static-cache')))fail('unreviewed framework static cache');
 const graph={};let rscGraph;for(const env of ['rsc','ssr','client']){
  const {bytes,value}=readModernNativeGraph(packageRoot,env,'final'),retainedPath=target.root+'/dist/server/cars-native-graph-'+env+'.json';fs.writeFileSync(inside(packageRoot,retainedPath),bytes,{flag:'wx'});graph[env]={path:retainedPath,bytes:bytes.length,sha256:hash(bytes),chunks:value.rows.length,phase:'final',writtenOutputJoinVerified:true};
  if(env==='rsc')rscGraph=value;
  if(env!=='client'){const scan=readModernNativeGraph(packageRoot,env,'scan'),scanPath=target.root+'/dist/server/cars-native-graph-scan-'+env+'.json';fs.writeFileSync(inside(packageRoot,scanPath),scan.bytes,{flag:'wx'});graph[env].scan={path:scanPath,bytes:scan.bytes.length,sha256:hash(scan.bytes),chunks:scan.value.rows.length,phase:'scan'};}
 }
 const resolver=inside(server,'cars-native-preferences.js'),resolverBytes=fs.readFileSync(resolver);if(!resolverBytes.toString().includes('resolveCarsNativePreferences'))fail('compiled pure resolver export missing');
 const policyReceipts=[],routes=[],products=[];let identities=null;
 const wasm=installModernNativeWasmModules({packageRoot,graph:rscGraph,mount:contract.mount,sourceTree:contract.sourceTree,purpose:'compiled-policy-admission'});
 try {
 const producer=await import(pathToFileURL(resolver).href+'?cars-policy='+hash(resolverBytes));if(typeof producer.resolveCarsNativeResponsePolicy!=='function'||!Array.isArray(producer.VINEXT_INTERNAL_HEADERS))fail('same native graph response policy export missing');
 for(const pathname of wanted){
  const locale=pathname.split('/')[1],route={locale,pathname:target.base+pathname},security=await producer.resolveCarsNativeResponsePolicy(locale);
  for(const kind of ['html','rsc']){
   const bytes=fs.readFileSync(inside(prerender,pathname.slice(1)+'.'+kind));if(bytes.length<1||bytes.length>2*1024*1024)fail('unbounded native '+kind);if(kind==='html'&&bytes.toString().split('<script type="application/json" id="cars-modern-native-preferences">null</script>').length!==2)fail('actual native HTML bootstrap slot differs');
   const capturePath='.cars-modern-native-response-'+locale+'-'+kind+'.json',captureBytes=fs.readFileSync(inside(packageRoot,capturePath)),capture=JSON.parse(captureBytes);
   if(capture.schemaVersion!==1||capture.kind!=='cars-modern-official-prerender-response'||capture.sourceTree!==contract.sourceTree||capture.pathname!==route.pathname||capture.locale!==locale||capture.representation!==kind||capture.status!==200||capture.bytes!==bytes.length||capture.sha256!==hash(bytes))fail('actual canonical native '+kind+' headers/body do not join emitted snapshot');
   const sealed=sealModernNativeResponseHeaders(capture.headers,security,{locale,kind,pathname:route.pathname,internalHeaderNames:producer.VINEXT_INTERNAL_HEADERS});
   if(kind==='rsc'){const next=nativeResponseIdentities(sealed.headers);if(identities&&JSON.stringify(identities)!==JSON.stringify(next))fail('canonical native RSC identities differ');identities=next;}
   policyReceipts.push({locale,representation:kind,captureSha256:hash(captureBytes),captureBytes:captureBytes.length,capture,omitted:sealed.omitted,headers:sealed.headers});
   const sha256=hash(bytes),relative='_cars/private/modern/'+sha256+'.'+kind;route[kind]={path:'/'+relative,bytes:bytes.length,sha256,headers:sealed.headers};products.push({relative,bytes});
  }routes.push(route);
 }
 } finally {wasm.restore();}
 if(new Set(routes.flatMap(row=>[row.html.path,row.rsc.path])).size!==4)fail('duplicate snapshots');
 for(const row of routes)for(const kind of ['html','rsc']){const deployment=row[kind].headers['x-deployment-id'];if(deployment!==undefined&&deployment!==identities.deploymentId)fail('native representation deployment identity differs');}
 const responsePolicy={vinextVersion:'1.1.0',sourceTree:contract.sourceTree,producerSha256:hash(resolverBytes),identities},manifest={schemaVersion:2,kind:'cars-modern-services-static-experiment',mount:target.base,routes,responsePolicy},manifestBytes=Buffer.from(JSON.stringify(manifest,null,2)+'\n');
 const toolchainBytes=fs.readFileSync(inside(packageRoot,'.cars-modern-native-policy-toolchain.json')),toolchain=JSON.parse(toolchainBytes);if(toolchain.kind!=='cars-modern-native-policy-toolchain'||toolchain.rows?.length!==2||toolchain.rows.some(row=>row.version!=='1.2.0'))fail('actual native policy toolchain proof missing');
 const policyPath=target.root+'/dist/server/cars-native-response-policy.json',policyBytes=Buffer.from(JSON.stringify({schemaVersion:1,kind:'cars-modern-native-response-policy-proof',...responsePolicy,policySources:contract.policySources,policyDependencies:contract.policyDependencies,toolchain:{bytes:toolchainBytes.length,sha256:hash(toolchainBytes),receipt:toolchain},rows:policyReceipts},null,2)+'\n');
 const prerenderWasmBytes=fs.readFileSync(inside(packageRoot,'.cars-modern-native-wasm-prerender.json')),prerenderWasm=JSON.parse(prerenderWasmBytes);
 if(prerenderWasm.kind!=='cars-modern-native-node-wasm-module-contract'||prerenderWasm.purpose!=='official-prerender'||prerenderWasm.sourceTree!==contract.sourceTree||prerenderWasm.mount!==target.base||prerenderWasm.graphSha256!==graph.rsc.sha256||JSON.stringify(prerenderWasm.rows)!==JSON.stringify(wasm.receipt.rows))fail('both native WASM process authorities must join final graph');
 const wasmPath=target.root+'/dist/server/cars-native-node-wasm.json',wasmBytes=Buffer.from(JSON.stringify({schemaVersion:1,kind:'cars-modern-native-node-wasm-proof',prerender:{bytes:prerenderWasmBytes.length,sha256:hash(prerenderWasmBytes),receipt:prerenderWasm},compiledPolicy:{...wasm.receipt,loadedUrls:wasm.loaded(),hookRestored:true},emittedWasmBytesUnchanged:true},null,2)+'\n');fs.writeFileSync(inside(packageRoot,wasmPath),wasmBytes,{flag:'wx'});
 for(const {relative,bytes}of products){const dest=inside(client,relative);fs.mkdirSync(path.dirname(dest),{recursive:true});fs.writeFileSync(dest,bytes,{flag:'wx'});}
 fs.writeFileSync(inside(packageRoot,policyPath),policyBytes,{flag:'wx'});fs.writeFileSync(inside(server,'cars-free-services.json'),manifestBytes,{flag:'wx'});
 const receipt={...contract,schemaVersion:2,kind:'cars-modern-free-services-compiled-experiment',buildId:index.buildId,nativePrerenderIndexSha256:hash(indexBytes),discardedGenerated404:seen.has('/404'),emitted:routes,responsePolicy,manifest:{path:target.root+'/dist/server/cars-free-services.json',bytes:manifestBytes.length,sha256:hash(manifestBytes)},nativeResponsePolicy:{path:policyPath,bytes:policyBytes.length,sha256:hash(policyBytes),callableVerified:true,actualRscBodyJoinVerified:true},nativeNodeWasm:{path:wasmPath,bytes:wasmBytes.length,sha256:hash(wasmBytes)},resolver:{path:target.root+'/dist/server/cars-native-preferences.js',bytes:resolverBytes.length,sha256:hash(resolverBytes),callableVerified:false},graph,originalClientSourceTreeUnchanged:true,queryCache:false,nativeApproved:false,hostedApproved:false,freeCpuQualified:false};
 fs.writeFileSync(inside(server,'cars-free-services-build.json'),JSON.stringify(receipt,null,2)+'\n',{flag:'wx'});
 removeOwnedLeaves(prerender,actual);fs.unlinkSync(indexPath);
 return {manifestPath:target.root+'/dist/server/cars-free-services.json',resolverPath:target.root+'/dist/server/cars-native-preferences.js',receiptPath:target.root+'/dist/server/cars-free-services-build.json'};
}

export function modernFreeServicesBuildSource(){
 const functions=[installModernNativeResponseCapture,readModernCapturedBody,createModernFreeServicesPlugin,verifyModernNativePolicyToolchain,writeModernOwnedReceipt,installModernNativeWasmModules,createModernNativeWasmHooks,readModernNativeGraph,inside,leaves,removeOwnedLeaves,sealModernNativeResponseHeaders,nativeResponseIdentities,emitModernFreeServicesSnapshots];
 return "import fs from 'node:fs';\nimport path from 'node:path';\nimport {createHash} from 'node:crypto';\nimport {pathToFileURL} from 'node:url';\nimport {registerHooks} from 'node:module';\nconst MODERN_FREE_CLIENT_TREE="+JSON.stringify(MODERN_FREE_CLIENT_TREE)+";\nconst hash="+hash.toString()+";\nconst hex="+hex.toString()+";\nconst fail="+fail.toString()+";\nconst modernNativeRequiredHeaders="+JSON.stringify(modernNativeRequiredHeaders)+";\nconst modernNativeOptionalHeaders="+JSON.stringify(modernNativeOptionalHeaders)+";\nconst modernNativeVary="+JSON.stringify(modernNativeVary)+";\n"+functions.map(fn=>'export '+fn.toString()).join('\n')+'\n';
}
