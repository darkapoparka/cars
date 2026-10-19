import {assertComponentReuseProof,componentAssemblyIdentity,componentSourceDigest,assertSignatureStaticFontCompletion} from './lib/fleet-component-repairs.mjs';
// One public origin and one Worker per dealer. Provider-only composition of six verified builds.
// Each Next/Vite application receives its own framework global registry; this is not a security sandbox.
import fs from 'node:fs';import path from 'node:path';import {createHash} from 'node:crypto';import {gzipSync} from 'node:zlib';
import {validateFileInventory,safeArtifactPath,UK_FAMILY_NODES} from './lib/uk-cloudflare-artifacts.mjs';
import {filesAt,inside} from './lib/workflow.mjs';
import {assertSixDesignSelection} from './lib/six-design-release.mjs';
import {bindImportSurfaceLogos,namespaceImportAssets,importAssetName} from './lib/uk-import-brand-provider.mjs';
import {validateModernStaticManifest} from './lib/modern-free-static-runtime.mjs';
import {validateCanonicalComposition,canonicalCompositionEntry,CANONICAL_ORIGINAL_WORKER_PATH} from './publishing/canonical-origin-wrapper.mjs';
import {DEALER_PACK_COMPILED_KIND,DEALER_PACK_BUNDLE_KIND,PACK_IDENTITY_FIELDS,PACK_CONTENT_IDENTITY_FIELDS,validateDealerPackCompiled,assertDealerPackComposition,dealerPackCompositionDigest} from './lib/dealer-pack-artifacts.mjs';
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
export function singleWorkerSource(freeStaticExperiment=null){return [
 'import router from "./router.mjs";',
 ...(freeStaticExperiment?['import {createModernFreeStaticRuntime,modernSnapshotRequest} from "./modern-free-static-runtime.mjs";','import {resolveCarsNativePreferences} from "./modern/cars-native-preferences.js";']:[]),
 ...KEYS.filter(k=>k!=='router').map(k=>'import design_'+k.replaceAll('-','_')+' from "./'+k+'/'+(NEXT.has(k)?'index.js':'index.mjs')+'";'),
 ...(freeStaticExperiment?['const modernStaticManifest='+JSON.stringify(validateModernStaticManifest(freeStaticExperiment))+';','const modernStatic=createModernFreeStaticRuntime({manifest:modernStaticManifest,resolvePreferences:resolveCarsNativePreferences});']:[]),
 'export default {async fetch(request, env, ctx) {',
 ...(freeStaticExperiment?[' if(!modernSnapshotRequest(request,modernStaticManifest)){const experimentResponse=await modernStatic.fetch(request,env);if(experimentResponse)return experimentResponse;}']:[]),
 ' const bindings={...env,'+KEYS.filter(k=>k!=='router').map(k=>'CARS_'+k.toUpperCase().replaceAll('-','_')+':{fetch:'+((freeStaticExperiment&&k==='modern')?'async r=>(await modernStatic.fetch(r,env))??design_modern.fetch(r,env,ctx)':'r=>design_'+k.replaceAll('-','_')+'.fetch(r,env,ctx)')+'}').join(',')+'};',
 ' return router.fetch(request,bindings);',
 '}};',''].join('\n');}
export function scopeCompiledModule(source,scopeImport,esbuild){
 assert(!source.includes('__CARS_FRAMEWORK_GLOBAL__'),'Private namespace identifier already occupied');
 const define={globalThis:'__CARS_FRAMEWORK_GLOBAL__',global:'__CARS_FRAMEWORK_GLOBAL__',fetch:'__CARS_FRAMEWORK_GLOBAL__.fetch'};
 for(const token of new Set(source.match(/\b(?:__vite_rsc_[A-Za-z0-9_]+|__VINEXT_[A-Za-z0-9_]+)\b/g)||[]))define[token]='__CARS_FRAMEWORK_GLOBAL__.'+token;
 const result=esbuild.transformSync(source,{format:'esm',target:'es2022',minifyWhitespace:true,minifySyntax:true,minifyIdentifiers:false,keepNames:false,legalComments:'inline',define,banner:'import {frameworkGlobal as __CARS_FRAMEWORK_GLOBAL__} from '+JSON.stringify(scopeImport)+';'});
 return result.code;
}
const HEX40=/^[a-f0-9]{40}$/,HEX64=/^[a-f0-9]{64}$/,FLEET_KIND='existing-fleet-cloudflare-compiled-candidate';
const canonical=value=>JSON.stringify(value,(_,entry)=>entry&&typeof entry==='object'&&!Array.isArray(entry)?Object.fromEntries(Object.keys(entry).sort().map(key=>[key,entry[key]])):entry);
function verifyCompiledArtifact(directory){
 // Validate the complete inventory once, then hash every byte once. Revalidating
 // the entire inventory for each file makes a real multi-thousand-file build quadratic.
 const inventory=validateFileInventory(JSON.parse(fs.readFileSync(inside(directory,'artifact-manifest.json',{mustExist:true}),'utf8')));
 const actual=filesAt(directory,{filter:()=>true}).filter(name=>name!=='artifact-manifest.json');
 assert(JSON.stringify(actual)===JSON.stringify(inventory.files.map(row=>row.path).sort()),'Artifact contains missing or undeclared files.');
 for(const row of inventory.files){const bytes=fs.readFileSync(inside(directory,row.path,{mustExist:true}));assert(bytes.length===row.bytes&&hash(bytes)===row.sha256,'Artifact receipt bytes differ: '+row.path);}
 return inventory;
}
function validateCompiledFiles(inventory,deploy,key){
 const rows=deploy.compiledFiles;
 assert(Array.isArray(rows)&&rows.length>0&&new Set(rows.map(row=>row.path)).size===rows.length&&HEX64.test(deploy.compiledDigest??'')&&hash(JSON.stringify(rows))===deploy.compiledDigest,'Changed compiled digest '+key);
 const inventoryByPath=new Map(inventory.files.map(row=>[row.path,row]));
 for(const row of rows){const actual=inventoryByPath.get(row.path);assert(safeArtifactPath(row.path)&&row.path.startsWith('compiled/')&&actual&&row.bytes===actual.bytes&&row.sha256===actual.sha256,'Compiled inventory differs '+key);}
 assert(inventory.files.filter(row=>row.path.startsWith('compiled/')).length===rows.length,'Undeclared compiled files '+key);
 assert([deploy.mainPath,deploy.configPath].every(name=>safeArtifactPath(name)&&rows.some(row=>row.path===name))&&safeArtifactPath(deploy.assetPath)&&rows.some(row=>row.path.startsWith(deploy.assetPath+'/')),'Missing compiled entry, config or assets '+key);
}
function dealerPackBuildEvidence(directory,inventory,deploy,key,expectedDealer){
 assert(inventory.kind===DEALER_PACK_COMPILED_KIND&&inventory.status==='passed'&&inventory.dealer===expectedDealer&&inventory.key===key&&deploy.schemaVersion===1&&deploy.provider==='cloudflare'&&deploy.compiled===true&&deploy.dryRun===true,'Wrong cached dealer-pack input '+key);
 const source=JSON.parse(fs.readFileSync(inside(directory,'receipts/source.json',{mustExist:true}),'utf8')),build=JSON.parse(fs.readFileSync(inside(directory,'receipts/build.json',{mustExist:true}),'utf8'));
 validateDealerPackCompiled({deploy,key,expectedDealer,source,build});
 assert(build.node==='v'+UK_FAMILY_NODES[key],'Dealer-pack native build runtime differs: '+key);
 return {source,build};
}
/** Complete physical inventory and original native receipts for one pack build. */
export function inspectDealerPackCompiledArtifact({directory,key,expectedDealer}){
 assert(KEYS.includes(key)&&typeof directory==='string'&&fs.existsSync(directory)&&fs.lstatSync(directory).isDirectory()&&!fs.lstatSync(directory).isSymbolicLink(),'Missing exact cached dealer-pack artifact');
 const inventory=verifyCompiledArtifact(directory),deploy=JSON.parse(fs.readFileSync(inside(directory,'deploy.json',{mustExist:true}),'utf8'));
 validateCompiledFiles(inventory,deploy,key);
 return {directory,inventory,deploy,...dealerPackBuildEvidence(directory,inventory,deploy,key,expectedDealer)};
}
function validateSourceReleases(releases,key){
 assert(releases&&canonical(Object.keys(releases).sort())===canonical(KEYS.filter(name=>name!=='router').sort()),'Missing six exact source releases '+key);
 for(const family of KEYS.filter(name=>name!=='router')){const release=releases[family];assert(release&&release.repository==='darkapoparka/cars'&&release.path==='templates/'+family&&HEX40.test(release.revision??'')&&HEX40.test(release.tree??'')&&HEX64.test(release.digest??''),'Invalid exact source release '+key+': '+family);}
}
export function inspectModernFreeStaticExperiment(inspected,modernMount){
 const entry=inspected.modern,marker=entry.deploy.freeStaticExperiment;
 for(const [key,value] of Object.entries(inspected)){
  const reserved=value.deploy.compiledFiles.filter(row=>row.path.startsWith(value.deploy.assetPath+'/_cars/private/modern/')||row.path.startsWith(value.deploy.assetPath+'/_vinext/static-cache/'));
  assert(key==='modern'&&marker!==undefined||reserved.length===0,'Unadmitted private Modern static outputs');
 }
 if(marker===undefined)return null;
 assert(marker&&typeof marker==='object'&&!Array.isArray(marker)&&canonical(Object.keys(marker).sort())===canonical(['manifestPath','resolverPath'].sort()),'Invalid explicit Modern static opt-in');
 assert(entry.deploy.mainPath.endsWith('/index.js'),'Modern static main module differs');
 const root=entry.deploy.mainPath.slice(0,-'index.js'.length);
 assert(marker.manifestPath===root+'cars-free-services.json'&&marker.resolverPath===root+'cars-native-preferences.js','Modern static native module paths differ');
 const rows=new Map(entry.deploy.compiledFiles.map(row=>[row.path,row]));
 const manifestRow=rows.get(marker.manifestPath),resolverRow=rows.get(marker.resolverPath);
 assert(manifestRow&&manifestRow.bytes<=16384&&resolverRow&&resolverRow.bytes<=256*1024,'Missing bounded compiled native policy or static manifest');
 const plan=validateModernStaticManifest(JSON.parse(fs.readFileSync(inside(entry.directory,marker.manifestPath,{mustExist:true}),'utf8')));
 assert(plan.mount===modernMount,'Modern static experiment mount differs');
 assert(plan.responsePolicy.sourceTree===entry.deploy.sourceTree,'Modern static response source tree differs');
 assert(plan.responsePolicy.producerSha256===resolverRow.sha256,'Modern static response producer differs from compiled native resolver');
 for(const route of plan.routes)for(const key of ['html','rsc']){
  const asset=route[key],row=rows.get(entry.deploy.assetPath+asset.path);
  assert(row&&row.bytes===asset.bytes&&row.sha256===asset.sha256,'Sealed native Services snapshot differs');
 }
 const privateAssets=entry.deploy.compiledFiles.filter(row=>row.path.startsWith(entry.deploy.assetPath+'/_cars/private/modern/'));
 assert(privateAssets.length===4,'Only four exact Services snapshots are admitted');
 assert(!entry.deploy.compiledFiles.some(row=>row.path.startsWith(entry.deploy.assetPath+'/_vinext/static-cache/')),'Unscoped native static cache is not allowed');
 return plan;
}
export function inspectSingleWorkerInputs({inputs,expectedDealer,componentReuse=null,packComposition=null}){
 assert(typeof expectedDealer==='string'&&/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(expectedDealer),'Exact dealer required');
 assert(inputs&&canonical(Object.keys(inputs).sort())===canonical([...KEYS].sort()),'Exactly six compiled designs and one router required');
 const inspected={};let inputKind;
 for(const key of KEYS){
  const directory=inputs[key];assert(typeof directory==='string'&&directory&&fs.existsSync(directory)&&fs.lstatSync(directory).isDirectory()&&!fs.lstatSync(directory).isSymbolicLink(),'Missing exact compiled input '+key);
  const inventory=verifyCompiledArtifact(directory),deploy=JSON.parse(fs.readFileSync(path.join(directory,'deploy.json'),'utf8'));
   const kind=inventory.kind==='compiled-worker'?'uk':inventory.kind===FLEET_KIND?'existing-fleet':inventory.kind===DEALER_PACK_COMPILED_KIND?'dealer-pack':null;
  assert(kind&&(!inputKind||kind===inputKind),'Mixed or unsupported compiled artifact kinds '+key);inputKind=kind;
  assert(inventory.status==='passed'&&inventory.dealer===expectedDealer&&inventory.key===key&&deploy.schemaVersion===1&&deploy.dealer===expectedDealer&&deploy.key===key&&deploy.provider==='cloudflare'&&deploy.compiled===true&&deploy.dryRun===true,'Wrong compiled input '+key);
   assert(HEX40.test(deploy.sourceCommit??'')&&(kind==='dealer-pack'||/^[1-9][0-9]*$/.test(String(deploy.runId??''))&&/^[1-9][0-9]*$/.test(String(deploy.attempt??''))),'Missing exact source or workflow identity '+key);
  validateCompiledFiles(inventory,deploy,key);
  let packEvidence;
  if(kind==='uk')assert(deploy.kind!==FLEET_KIND&&deploy.sourcePayloadUnchanged===true&&HEX40.test(deploy.packageTree??'')&&HEX64.test(deploy.packageDigest??'')&&HEX64.test(deploy.payloadDigest??''),'Missing immutable UK package seals '+key);
   else if(kind==='dealer-pack'){
    assert(!componentReuse,'Dealer packs cannot borrow existing-fleet component approval');
    packEvidence=dealerPackBuildEvidence(directory,inventory,deploy,key,expectedDealer);
   }else{
   assert(deploy.kind===FLEET_KIND&&/^[a-f0-9]{32}$/.test(deploy.accountId??'')&&HEX40.test(deploy.sourceTree??'')&&HEX64.test(deploy.inputDigest??'')&&deploy.hosted===false&&deploy.credentialsIncluded===false&&deploy.nativeApproval===false&&!['packageTree','packageDigest','payloadDigest','sourcePayloadUnchanged'].some(field=>Object.hasOwn(deploy,field)),'Invalid existing-fleet source schema '+key);
   validateSourceReleases(deploy.sourceReleases,key);
   const source=JSON.parse(fs.readFileSync(path.join(directory,'receipts/source.json'),'utf8')),build=JSON.parse(fs.readFileSync(path.join(directory,'receipts/build.json'),'utf8'));
   assert(source.schemaVersion===1&&source.dealer===expectedDealer&&source.key===key&&source.originalSourceUnchanged===true&&['sourceCommit','sourceTree','inputDigest','sourceReleases'].every(field=>canonical(source[field])===canonical(deploy[field])),'Existing-fleet source receipt differs '+key);
   if(componentReuse){assert(componentReuse.members?.[key]&&componentReuse.members[key].familySourceDigest===componentSourceDigest(source.targetBeforeDependencies,key),'Component source receipt differs from proven family bytes: '+key);if(componentReuse.members[key].mode==='rebuilt')assert(canonical(source.componentRepair)===canonical(componentReuse.sourceRepairs),'New compile did not carry the exact source repairs: '+key);}
   assert(build.schemaVersion===1&&build.status==='passed'&&build.dealer===expectedDealer&&build.key===key&&build.compiled===true&&build.dryRun===true&&['sourceCommit','workerName','compiledDigest'].every(field=>build[field]===deploy[field])&&['runId','attempt'].every(field=>String(build[field])===String(deploy[field])),'Existing-fleet build receipt differs '+key);
  }
  inspected[key]={directory,inventory,deploy,...(packEvidence??{})};
 }
 if(componentReuse){assert(inputKind==='existing-fleet','Component reuse excludes unrelated UK package identities');assertComponentReuseProof(componentReuse,Object.fromEntries(Object.entries(inspected).map(([key,value])=>[key,value.deploy])));for(const[key,value]of Object.entries(inspected))assert(value.inventory.digest===componentReuse.members[key].artifactDigest,'Component inventory differs from reuse proof: '+key);}
 if(packComposition){assert(inputKind==='dealer-pack'&&!componentReuse,'Pack composition provenance requires dealer-pack inputs only');assertDealerPackComposition(packComposition,inspected);}
 const originalIdentity=componentAssemblyIdentity(inspected.router.deploy,componentReuse),identity=packComposition?{...originalIdentity,execution:packComposition.execution}:originalIdentity,fields=inputKind==='dealer-pack'?(packComposition?PACK_CONTENT_IDENTITY_FIELDS:PACK_IDENTITY_FIELDS):inputKind==='uk'?['sourceCommit','packageTree','packageDigest','payloadDigest','publicOrigin','runId','attempt']:componentReuse?['sourceTree','inputDigest','sourceReleases','accountId','publicOrigin']:['sourceCommit','sourceTree','inputDigest','sourceReleases','accountId','publicOrigin','runId','attempt'];
 assert(/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(identity.workerName??''),'Exact public Worker name required');
 const origin=new URL(inputKind==='dealer-pack'?identity.providerOrigin:identity.publicOrigin);assert(origin.protocol==='https:'&&!origin.username&&!origin.password&&!origin.search&&!origin.hash&&origin.pathname==='/'&&origin.hostname.startsWith(identity.workerName+'.')&&origin.hostname.endsWith('.workers.dev'),'Public origin differs from Worker identity');
 if(inputKind==='dealer-pack'){const canonicalOrigin=new URL(identity.publicOrigin);assert(canonicalOrigin.protocol==='https:'&&canonicalOrigin.origin===identity.publicOrigin&&!canonicalOrigin.username&&!canonicalOrigin.password,'Invalid dealer-pack canonical share origin');}
 for(const [key,{deploy}] of Object.entries(inspected)){
  for(const field of fields)assert(canonical(deploy[field])===canonical(identity[field]),'Mixed exact source packages: '+field);
  const name=key==='router'?identity.workerName:identity.workerName+'-'+(key==='karento-best'?'signature':key);assert(deploy.workerName===name,'Wrong design Worker identity '+key);
 }
 return {inspected,identity,inputKind};
}

export function materializeSignatureStaticFontCompletion(inspected,completion,copy,{importMount,signatureMount}={}){
 if(!completion)return [];
 assertSignatureStaticFontCompletion(completion);
 assert(['/variant-2','/variant-3'].includes(importMount)&&signatureMount==='/variant-6','Exact frozen Import and Signature mounts required for static font completion');
 const native=inspected.import;assert(native?.deploy&&native?.directory&&typeof copy==='function','Verified Import native artifact and normal copy boundary required');
 // Verify the complete set first; never rewrite a compiled artifact or source file.
 const selected=completion.files.map(row=>{const relative=row.sourcePath.slice('import/static/'.length),sourcePath=native.deploy.assetPath+importMount+'/'+relative;
  const pin=native.deploy.compiledFiles.find(f=>f.path===sourcePath);assert(pin&&pin.sha256===row.sha256&&pin.bytes>=64&&pin.bytes<=1024*1024,'Original compiled Import font pin differs');
  const from=inside(native.directory,sourcePath,{mustExist:true}),st=fs.lstatSync(from),bytes=fs.readFileSync(from);assert(st.isFile()&&!st.isSymbolicLink()&&bytes.length===pin.bytes&&hash(bytes)===pin.sha256&&bytes.subarray(0,4).toString()==='wOF2','Original compiled Import font bytes differ');
  return {from,path:'public'+signatureMount+'/'+row.targetPath.slice('karento-best/static/'.length),sourcePath,sourceKey:'import',afterSha256:row.sha256,bytes:bytes.length,method:'Complete nine existing Signature static font URLs from exact sealed Import WOFF2 bytes; no native module/source modification'};});
 for(const row of selected)copy(row.from,row.path);
 return selected.map(({from,...row})=>row);
}

export function packageUkSingleWorker({inputs,destination,expectedDealer,esbuild,componentReuse=null,canonicalComposition=null,packComposition=null}){
 assert(!fs.existsSync(destination),'Exact dealer and a fresh derived destination required');
 assert(esbuild&&typeof esbuild.transformSync==='function','Reviewed existing esbuild required');
 const {inspected,identity,inputKind}=inspectSingleWorkerInputs({inputs,expectedDealer,componentReuse,packComposition});
 const routerSource=fs.readFileSync(path.join(inspected.router.directory,inspected.router.deploy.mainPath),'utf8'),routerPlan=routerSource.match(/export default createDealerRouter\((\{[\s\S]*\})\);\s*$/);
 assert(routerPlan,'Frozen six-design router is required for provider mount mapping');
 const variants=JSON.parse(routerPlan[1]).variants;assertSixDesignSelection(variants);
 if(canonicalComposition){assert(inputKind==='existing-fleet','Canonical composition requires the sealed existing-fleet source identity');validateCanonicalComposition(canonicalComposition,{providerOrigin:identity.publicOrigin,toolRevision:identity.sourceCommit,variants});}
 const importMount=variants.find(row=>row.key==='import').base,modernMount=variants.find(row=>row.key==='modern').base;
 assert(['/variant-2','/variant-3'].includes(importMount)&&modernMount===(importMount==='/variant-2'?'/variant-3':'/variant-2'),'Import/Modern mounts must preserve their reviewed opposite positions');
 const freeStaticExperiment=inspectModernFreeStaticExperiment(inspected,modernMount);
 assert(Object.entries(inspected).every(([key,value])=>key==='modern'||value.deploy.freeStaticExperiment===undefined),'Static experiment is Modern-only');
 const importNamespace=importAssetName('variant-3/_app/').slice('variant-3/'.length,-1);
 const importName=name=>name.startsWith(importMount.slice(1)+'/_app/')?importMount.slice(1)+'/'+importNamespace+'/'+name.slice((importMount.slice(1)+'/_app/').length):name;
 const importSource=source=>namespaceImportAssets(inputKind==='uk'?bindImportSurfaceLogos(source).source:source).replaceAll(importMount+'/_app"',importMount+'/'+importNamespace+'"').replaceAll(importMount+'/_app\x60',importMount+'/'+importNamespace+'\x60');
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
  }else{const source='compiled/'+key+'/.cars-cloudflare/worker/index.js';assert(inspected[key].inventory.files.some(f=>f.path===source),'Missing verified standalone Svelte module');const before=fs.readFileSync(path.join(directory,source)),after=Buffer.from(esbuild.transformSync(key==='import'?importSource(before.toString('utf8')):before.toString('utf8'),{format:'esm',target:'es2022',minify:true,keepNames:true,legalComments:'inline'}).code),out='server/'+key+'/index.mjs';fs.mkdirSync(path.dirname(path.join(base,out)),{recursive:true});fs.writeFileSync(path.join(base,out),after,{flag:'wx'});changes.push({path:out,sourcePath:source,beforeSha256:hash(before),afterSha256:hash(after),method:key==='import'?(inputKind==='uk'?'Verified raster surface bindings and versioned asset namespace; ES module minification':'Retained fleet logo bindings and versioned asset namespace; ES module minification'):'ES module minification only, names retained'});}
  const assets=path.join(directory,deploy.assetPath);for(const name of walk(assets)){if(name==='_headers'){headers.push(fs.readFileSync(path.join(assets,name),'utf8'));continue;}if(name==='.assetsignore'||name==='.vite'||name.startsWith('.vite/')||name==='vinext-client-entry-manifest.json')continue;if(key==='import'&&/\.[cm]?js$/.test(name)){const original=fs.readFileSync(path.join(assets,name)),branded=Buffer.from(importSource(original.toString('utf8'))),target='public/'+importName(name);fs.mkdirSync(path.dirname(path.join(base,target)),{recursive:true});fs.writeFileSync(path.join(base,target),branded,{flag:'wx'});if(!original.equals(branded))changes.push({path:target,beforeSha256:hash(original),afterSha256:hash(branded),method:inputKind==='uk'?'Bind exact dark-on-light and white-on-dark Import logo slots with new immutable asset namespace':'Preserve fleet logo slots with new immutable asset namespace'});}else copy(path.join(assets,name),'public/'+(key==='import'?importName(name):name));}
 }
 changes.push(...materializeSignatureStaticFontCompletion(inspected,componentReuse?.staticAssetCompletion,copy,{importMount,signatureMount:variants.find(row=>row.key==='karento-best').base}));
 fs.writeFileSync(base+'/public/.assetsignore','.vite\n**/.vite\n');fs.writeFileSync(base+'/public/_headers','/*\n  X-Robots-Tag: noindex, nofollow\n\n'+headers.join('\n\n')+'\n');const original=singleWorkerSource(freeStaticExperiment);
 if(canonicalComposition){fs.writeFileSync(path.join(base,CANONICAL_ORIGINAL_WORKER_PATH),original,{flag:'wx'});fs.writeFileSync(base+'/server/worker.mjs',canonicalCompositionEntry(canonicalComposition),{flag:'wx'});}
 else fs.writeFileSync(base+'/server/worker.mjs',original);
 if(freeStaticExperiment)fs.copyFileSync(new URL('./lib/modern-free-static-runtime.mjs',import.meta.url),base+'/server/modern-free-static-runtime.mjs');
 const config={name:identity.workerName,main:'server/worker.mjs',base_dir:'server',compatibility_date:'2026-10-10',compatibility_flags:['nodejs_compat'],workers_dev:true,preview_urls:false,no_bundle:true,find_additional_modules:true,rules:[{type:'ESModule',globs:['**/*.js','**/*.mjs'],fallthrough:true},{type:'CompiledWasm',globs:['**/*.wasm'],fallthrough:true}],observability:{enabled:true},assets:{directory:'./public',binding:'ASSETS',run_worker_first:false}};
 if(freeStaticExperiment)config.assets.run_worker_first=['/_cars/private/modern/*','/_vinext/static-cache/*'];
 fs.writeFileSync(base+'/wrangler.json',JSON.stringify(config,null,2)+'\n');
 const files=walk(base).map(name=>{const b=fs.readFileSync(path.join(base,name));return {path:name,bytes:b.length,sha256:hash(b)};}),server=files.filter(f=>f.path.startsWith('server/')),serverBytes=server.reduce((s,f)=>s+f.bytes,0),assetFiles=files.filter(f=>f.path.startsWith('public/')).length;
 assert(inputKind==='dealer-pack'?serverBytes<=64*1024**2:serverBytes<64*1024**2,'Actual server exceeds the current 64 MiB Worker limit');
 const packLimit=inputKind==='dealer-pack'?(identity.capacityPlan==='paid'?100000:20000):null;
 assert(packLimit===null?assetFiles<20000:assetFiles<=packLimit,'Actual static-asset count exceeds selected Workers allowance');assert(files.filter(f=>f.path.startsWith('public/')).every(f=>f.bytes<=25*1024**2),'A static asset exceeds 25 MiB');
 const sourceIdentity=inputKind==='dealer-pack'?Object.fromEntries(PACK_IDENTITY_FIELDS.map(key=>[key,identity[key]])):inputKind==='uk'?{packageTree:identity.packageTree,packageDigest:identity.packageDigest,payloadDigest:identity.payloadDigest}:{sourceTree:identity.sourceTree,inputDigest:identity.inputDigest,sourceReleases:identity.sourceReleases,accountId:identity.accountId};
 const receipt={schemaVersion:1,type:inputKind==='dealer-pack'?DEALER_PACK_BUNDLE_KIND:inputKind==='uk'?'cars-uk-single-worker-provider-package':'cars-existing-fleet-single-worker-provider-package',dealer:expectedDealer,sourceCommit:identity.sourceCommit,...sourceIdentity,...(inputKind==='dealer-pack'?{}:{runId:identity.runId,attempt:identity.attempt}),publicOrigin:identity.publicOrigin,workerName:identity.workerName,applicationCount:6,workerCount:1,composition:{inProcess:KEYS.filter(k=>k!=='router'),serviceBindings:[]},excludedAssetMetadata:{paths:['.vite/**','.assetsignore','vinext-client-entry-manifest.json'],reason:'Per-build tooling manifests are not mounted public application assets; actual client entry filenames remain embedded in each unchanged client bundle and server asset map.'},frameworkGlobalScopes:['modern','app','mobile'],serverBytes,compressedBytes:server.reduce((s,f)=>s+gzipSync(fs.readFileSync(path.join(base,f.path))).length,0),assetFiles,esbuildVersion:esbuild.version,changes,files,outputDigest:hash(JSON.stringify(files)),artifacts:Object.fromEntries(Object.entries(inspected).map(([k,v])=>[k,{digest:v.inventory.digest,compiledDigest:v.deploy.compiledDigest}])),sourceApplicationBytesChanged:false,compiledApplicationBytesChanged:true,hostedVerified:false,...(canonicalComposition?{canonicalComposition}:{}),...(componentReuse?{componentReuse,reviewedDerivedSourceRepairs:componentReuse.sourceRepairs}:{} )};
 if(packComposition){receipt.packComposition=packComposition;receipt.packCompositionDigest=dealerPackCompositionDigest(packComposition);}
 fs.writeFileSync(base+'/single-worker-receipt.json',JSON.stringify(receipt,null,2)+'\n');return receipt;
}

