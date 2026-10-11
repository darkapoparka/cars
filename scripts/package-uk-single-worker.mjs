// One public origin and one Worker per dealer. Provider-only composition of six verified builds.
// Each Next/Vite application receives its own framework global registry; this is not a security sandbox.
import fs from 'node:fs';import path from 'node:path';import {createHash} from 'node:crypto';import {gzipSync} from 'node:zlib';
import {verifyArtifactDirectory} from './lib/uk-cloudflare-artifacts.mjs';
import {bindImportSurfaceLogos,namespaceImportAssets,importAssetName} from './lib/uk-import-brand-provider.mjs';
const KEYS=['auto-best','modern','import','app','mobile','karento-best','router'],NEXT=new Set(['modern','app','mobile']);
const hash=b=>createHash('sha256').update(b).digest('hex'),assert=(ok,m)=>{if(!ok)throw Error(m);};
function walk(root,relative='',out=[]){for(const e of fs.readdirSync(path.join(root,relative),{withFileTypes:true})){assert(!e.isSymbolicLink(),'Linked artifact refused');const n=relative?relative+'/'+e.name:e.name;if(e.isDirectory())walk(root,n,out);else if(e.isFile())out.push(n);else throw Error('Unsupported artifact');}return out.sort();}
export function scopedGlobalsSource(){return `const platform=globalThis;
const local=Object.create(null);
const scope=new Proxy(local,{
 get(target,key){return Object.hasOwn(target,key)?Reflect.get(target,key):Reflect.get(platform,key,platform);},
 set(target,key,value){return Reflect.set(target,key,value);},
 has(target,key){return Object.hasOwn(target,key)||Reflect.has(platform,key);},
 ownKeys(target){return [...new Set([...Reflect.ownKeys(platform),...Reflect.ownKeys(target)])];},
 getOwnPropertyDescriptor(target,key){const own=Object.getOwnPropertyDescriptor(target,key);if(own)return own;if(Reflect.has(platform,key))return {configurable:true,enumerable:true,writable:true,value:Reflect.get(platform,key,platform)};},
 deleteProperty(target,key){return Reflect.deleteProperty(target,key);}
});
local.globalThis=scope;local.global=scope;local.self=scope;local.fetch=platform.fetch.bind(platform);
export {scope as frameworkGlobal};
`;}
export function singleWorkerSource(){return [
 'import router from "./router.mjs";',
 ...KEYS.filter(k=>k!=='router').map(k=>'import design_'+k.replaceAll('-','_')+' from "./'+k+'/'+(NEXT.has(k)?'index.js':'index.mjs')+'";'),
 'export default {async fetch(request, env, ctx) {',
 ' const bindings={...env,'+KEYS.filter(k=>k!=='router').map(k=>'CARS_'+k.toUpperCase().replaceAll('-','_')+':{fetch:r=>design_'+k.replaceAll('-','_')+'.fetch(r,env,ctx)}').join(',')+'};',
 ' return router.fetch(request,bindings);',
 '}};',''].join('\n');}
export function scopeCompiledModule(source,scopeImport,esbuild){
 assert(!source.includes('__CARS_FRAMEWORK_GLOBAL__'),'Private namespace identifier already occupied');
 const define={globalThis:'__CARS_FRAMEWORK_GLOBAL__',global:'__CARS_FRAMEWORK_GLOBAL__',fetch:'__CARS_FRAMEWORK_GLOBAL__.fetch'};
 for(const token of new Set(source.match(/\b(?:__vite_rsc_[A-Za-z0-9_]+|__VINEXT_[A-Za-z0-9_]+)\b/g)||[]))define[token]='__CARS_FRAMEWORK_GLOBAL__.'+token;
 const result=esbuild.transformSync(source,{format:'esm',target:'es2022',minifyWhitespace:true,minifySyntax:true,minifyIdentifiers:false,keepNames:false,legalComments:'inline',define,banner:'import {frameworkGlobal as __CARS_FRAMEWORK_GLOBAL__} from '+JSON.stringify(scopeImport)+';'});
 return result.code;
}
export function packageUkSingleWorker({inputs,destination,expectedDealer,esbuild}){
 assert(/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(expectedDealer)&&!fs.existsSync(destination),'Exact dealer and a fresh derived destination required');
 assert(esbuild&&typeof esbuild.transformSync==='function','Reviewed existing esbuild required');
 const inspected={};for(const key of KEYS){const directory=inputs[key];assert(directory&&fs.existsSync(directory),'Missing exact compiled input '+key);const inventory=verifyArtifactDirectory(directory),deploy=JSON.parse(fs.readFileSync(path.join(directory,'deploy.json'),'utf8'));assert(inventory.kind==='compiled-worker'&&inventory.status==='passed'&&inventory.dealer===expectedDealer&&deploy.dealer===expectedDealer&&deploy.key===key&&deploy.compiled===true&&deploy.sourcePayloadUnchanged===true,'Wrong compiled input '+key);inspected[key]={directory,inventory,deploy};}
 const identity=inspected.router.deploy;for(const {deploy}of Object.values(inspected))for(const key of ['sourceCommit','packageTree','packageDigest','payloadDigest','publicOrigin','runId','attempt'])assert(String(deploy[key])===String(identity[key]),'Mixed exact source packages: '+key);
 const base=path.resolve(destination),changes=[],headers=[];fs.mkdirSync(base+'/server',{recursive:true});fs.mkdirSync(base+'/public');
 const copy=(from,name)=>{assert(!path.isAbsolute(name)&&!name.split('/').includes('..'),'Unsafe derived path');const target=path.join(base,name),bytes=fs.readFileSync(from);if(fs.existsSync(target)){assert(fs.readFileSync(target).equals(bytes),'Conflicting static path '+name);return;}fs.mkdirSync(path.dirname(target),{recursive:true});try{fs.linkSync(from,target);}catch{fs.writeFileSync(target,bytes,{flag:'wx'});}};
 for(const [key,{directory,deploy}] of Object.entries(inspected)){
  if(key==='router')copy(path.join(directory,deploy.mainPath),'server/router.mjs');
  else if(NEXT.has(key)){
   assert(deploy.mainPath.endsWith('/dist/server/index.js'),'Review Next compiled entry shape');const server=path.dirname(path.join(directory,deploy.mainPath)),scopePath='server/'+key+'/framework-globals.mjs';fs.mkdirSync(path.join(base,'server',key),{recursive:true});fs.writeFileSync(path.join(base,scopePath),scopedGlobalsSource());
   for(const name of walk(server)){if(name==='wrangler.json'||name.endsWith('.map'))continue;const source=path.join(server,name),out='server/'+key+'/'+name;
    if(/\.[cm]?js$/.test(name)){const before=fs.readFileSync(source),relative=path.posix.relative(path.posix.dirname(out),scopePath),after=Buffer.from(scopeCompiledModule(before.toString('utf8'),relative.startsWith('.')?relative:'./'+relative,esbuild));fs.mkdirSync(path.dirname(path.join(base,out)),{recursive:true});fs.writeFileSync(path.join(base,out),after,{flag:'wx'});changes.push({path:out,sourcePath:path.relative(directory,source).replaceAll('\\','/'),beforeSha256:hash(before),afterSha256:hash(after),method:'AST-defined private globals; identifiers retained without keepNames helpers so serialized inline functions remain self-contained'});}
    else copy(source,out);
   }
  }else{const source='compiled/'+key+'/.cars-cloudflare/worker/index.js';assert(inspected[key].inventory.files.some(f=>f.path===source),'Missing verified standalone Svelte module');const before=fs.readFileSync(path.join(directory,source)),after=Buffer.from(esbuild.transformSync(key==='import'?namespaceImportAssets(bindImportSurfaceLogos(before.toString('utf8')).source):before.toString('utf8'),{format:'esm',target:'es2022',minify:true,keepNames:true,legalComments:'inline'}).code),out='server/'+key+'/index.mjs';fs.mkdirSync(path.dirname(path.join(base,out)),{recursive:true});fs.writeFileSync(path.join(base,out),after,{flag:'wx'});changes.push({path:out,sourcePath:source,beforeSha256:hash(before),afterSha256:hash(after),method:key==='import'?'Verified raster surface bindings and versioned asset namespace; ES module minification':'ES module minification only, names retained'});}
  const assets=path.join(directory,deploy.assetPath);for(const name of walk(assets)){if(name==='_headers'){headers.push(fs.readFileSync(path.join(assets,name),'utf8'));continue;}if(name==='.assetsignore'||name==='.vite'||name.startsWith('.vite/')||name==='vinext-client-entry-manifest.json')continue;if(key==='import'&&/\.[cm]?js$/.test(name)){const original=fs.readFileSync(path.join(assets,name)),branded=Buffer.from(namespaceImportAssets(bindImportSurfaceLogos(original.toString('utf8')).source)),target='public/'+importAssetName(name);fs.mkdirSync(path.dirname(path.join(base,target)),{recursive:true});fs.writeFileSync(path.join(base,target),branded,{flag:'wx'});if(!original.equals(branded))changes.push({path:target,beforeSha256:hash(original),afterSha256:hash(branded),method:'Bind exact dark-on-light and white-on-dark Import logo slots with new immutable asset namespace'});}else copy(path.join(assets,name),'public/'+(key==='import'?importAssetName(name):name));}
 }
 fs.writeFileSync(base+'/public/.assetsignore','.vite\n**/.vite\n');fs.writeFileSync(base+'/public/_headers','/*\n  X-Robots-Tag: noindex, nofollow\n\n'+headers.join('\n\n')+'\n');fs.writeFileSync(base+'/server/worker.mjs',singleWorkerSource());
 const config={name:identity.workerName,main:'server/worker.mjs',base_dir:'server',compatibility_date:'2026-10-10',compatibility_flags:['nodejs_compat'],workers_dev:true,preview_urls:false,no_bundle:true,find_additional_modules:true,rules:[{type:'ESModule',globs:['**/*.js','**/*.mjs'],fallthrough:true},{type:'CompiledWasm',globs:['**/*.wasm'],fallthrough:true}],observability:{enabled:true},assets:{directory:'./public',binding:'ASSETS',run_worker_first:false}};
 fs.writeFileSync(base+'/wrangler.json',JSON.stringify(config,null,2)+'\n');
 const files=walk(base).map(name=>{const b=fs.readFileSync(path.join(base,name));return {path:name,bytes:b.length,sha256:hash(b)};}),server=files.filter(f=>f.path.startsWith('server/')),serverBytes=server.reduce((s,f)=>s+f.bytes,0),assetFiles=files.filter(f=>f.path.startsWith('public/')).length;
 assert(serverBytes<64*1024**2,'Actual server exceeds the current 64 MiB Worker limit');assert(assetFiles<20000,'Actual static-asset count exceeds Workers Free allowance');assert(files.filter(f=>f.path.startsWith('public/')).every(f=>f.bytes<=25*1024**2),'A static asset exceeds 25 MiB');
 const receipt={schemaVersion:1,type:'cars-uk-single-worker-provider-package',dealer:expectedDealer,sourceCommit:identity.sourceCommit,packageTree:identity.packageTree,packageDigest:identity.packageDigest,payloadDigest:identity.payloadDigest,runId:identity.runId,attempt:identity.attempt,publicOrigin:identity.publicOrigin,workerName:identity.workerName,applicationCount:6,workerCount:1,composition:{inProcess:KEYS.filter(k=>k!=='router'),serviceBindings:[]},excludedAssetMetadata:{paths:['.vite/**','.assetsignore','vinext-client-entry-manifest.json'],reason:'Per-build tooling manifests are not mounted public application assets; actual client entry filenames remain embedded in each unchanged client bundle and server asset map.'},frameworkGlobalScopes:['modern','app','mobile'],serverBytes,compressedBytes:server.reduce((s,f)=>s+gzipSync(fs.readFileSync(path.join(base,f.path))).length,0),assetFiles,esbuildVersion:esbuild.version,changes,files,outputDigest:hash(JSON.stringify(files)),artifacts:Object.fromEntries(Object.entries(inspected).map(([k,v])=>[k,{digest:v.inventory.digest,compiledDigest:v.deploy.compiledDigest}])),sourceApplicationBytesChanged:false,compiledApplicationBytesChanged:true,hostedVerified:false};
 fs.writeFileSync(base+'/single-worker-receipt.json',JSON.stringify(receipt,null,2)+'\n');return receipt;
}
