import fs from 'node:fs';
import path from 'node:path';
import {createHash} from 'node:crypto';

// Bounded, explicitly requested Priselci experiment; never a template promotion.
export const MODERN_FREE_SOURCE_REVISION='b1f0f5609c7c249cfd0649c122849ff2cbb8dfde';
export const MODERN_FREE_CLIENT_TREE='9b5ad1a83b3442a4f1453169517195afb6fe5a4b';
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
 if(!exact(value,['schemaVersion','kind','dealer','sourceRevision','sourceTree','overlayCommit','files'])||value.schemaVersion!==1||value.kind!=='cars-modern-free-services-build-experiment'||value.dealer!=='priselci'||value.dealer!==dealer||value.sourceRevision!==MODERN_FREE_SOURCE_REVISION||value.sourceTree!==MODERN_FREE_CLIENT_TREE||sourceTree!==value.sourceTree||sourceReleases?.modern?.revision!==value.sourceRevision||!hex(value.overlayCommit,40)||!Array.isArray(value.files)||value.files.length!==3)fail('exact original dealer/source and published overlay request required');
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
 const experiment={schemaVersion:1,kind:request.kind,dealer,sourceCommit,sourceTree,sourceRevision:request.sourceRevision,overlayCommit:request.overlayCommit,requestSha256:hash(JSON.stringify(request)),files:rows,originalSourceUnchanged:true};
 return {files,experiment};
}

export function applyModernFreeBuildOverlay(input,experiment,{base}={}){
 if(experiment===undefined||experiment===null)return input;
 if(!(input instanceof Map)||!['/variant-2','/variant-3'].includes(base)||experiment.kind!=='cars-modern-free-services-build-experiment'||experiment.dealer!=='priselci'||!hex(experiment.sourceCommit,40)||!hex(experiment.overlayCommit,40)||experiment.sourceTree!==MODERN_FREE_CLIENT_TREE||experiment.sourceRevision!==MODERN_FREE_SOURCE_REVISION||!hex(experiment.requestSha256,64)||experiment.files?.length!==3)fail('sealed native overlay required');
 const files=new Map(input),generated=[];
 const put=(name,bytes)=>{const before=files.get(name);if(!before)fail('missing original graph module '+name);const next=Buffer.from(bytes);files.set(name,next);generated.push({path:name,beforeSha256:hash(before),afterSha256:hash(next)});};
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
 const receipt={...experiment,mount:base,vinext:'1.1.0',phase:{VINEXT_PRERENDER:'1',NEXT_PHASE:'phase-production-build'},generated,graph:'original-native-rsc-ssr-client',queryCache:false,nativeApproved:false,hostedApproved:false,freeCpuQualified:false};
 for(const [name,bytes]of [['.cars-modern-free-build.json',JSON.stringify(receipt,null,2)+'\n'],['scripts/modern-free-services-build.mjs',modernFreeServicesBuildSource()]]){if(files.has(name))fail('occupied generated experiment member '+name);files.set(name,Buffer.from(bytes));}
 return files;
}

/** An additional export in the SAME RSC build, with original source/module IDs. */
export function createModernFreeServicesPlugin({packageRoot,cwd}){
 const virtual='virtual:cars-native-preferences',resolved='\0'+virtual;
 return {name:'cars-modern-free-services-graph',apply:'build',enforce:'post',
  resolveId(id){if(id===virtual)return resolved;},
  load(id){if(id===resolved)return 'export { resolveCarsNativePreferences } from '+JSON.stringify(path.join(cwd,'lib/locale-preferences.ts').replaceAll('\\','/'))+';';},
  buildStart(){if(this.environment.name==='rsc')this.emitFile({type:'chunk',id:virtual,fileName:'cars-native-preferences.js',preserveSignature:'strict'});},
  generateBundle(_options,bundle){
   const environment=this.environment.name;if(!['rsc','ssr','client'].includes(environment))fail('unexpected native build environment');
   const rows=Object.values(bundle).filter(item=>item.type==='chunk').map(item=>({file:item.fileName,imports:item.imports,dynamicImports:item.dynamicImports,moduleIds:item.moduleIds.map(id=>id.replaceAll('\\','/').replace(packageRoot.replaceAll('\\','/')+'/','<package>/'))})).sort((a,b)=>a.file.localeCompare(b.file));
   if(!rows.length)fail('native '+environment+' graph missing');
   fs.writeFileSync(path.join(packageRoot,'.cars-modern-free-graph-'+environment+'.json'),JSON.stringify({schemaVersion:1,environment,graph:'original-native',rows},null,2)+'\n',{flag:'wx'});
  },
 };
}

function inside(root,relative){const absolute=path.resolve(root,relative);if(!relative||absolute===root||!absolute.startsWith(root+path.sep))fail('unbounded emitted path');return absolute;}
function leaves(root){const result=[];function walk(dir){for(const item of fs.readdirSync(dir,{withFileTypes:true}).sort((a,b)=>a.name.localeCompare(b.name))){if(item.isSymbolicLink())fail('linked emitted member');const absolute=inside(root,path.relative(root,path.join(dir,item.name)));if(item.isDirectory())walk(absolute);else if(item.isFile())result.push(path.relative(root,absolute).replaceAll('\\','/'));else fail('nonfile emitted member');}}walk(root);return result;}
function removeOwnedLeaves(root,names){
 // Admission already checked every leaf. No recursive or ambiguous deletion.
 for(const name of names)fs.unlinkSync(inside(root,name));
 function empty(dir){for(const item of fs.readdirSync(dir,{withFileTypes:true})){const child=inside(root,path.relative(root,path.join(dir,item.name)));if(!item.isDirectory()||item.isSymbolicLink())fail('unexpected residual emitted member');empty(child);fs.rmdirSync(child);}}empty(root);fs.rmdirSync(root);
}

export function emitModernFreeServicesSnapshots({packageRoot,target}){
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
 const graph={};for(const env of ['rsc','ssr','client']){const file=inside(packageRoot,'.cars-modern-free-graph-'+env+'.json'),bytes=fs.readFileSync(file),value=JSON.parse(bytes);if(value.environment!==env||value.graph!=='original-native'||!value.rows?.length)fail('actual native graph receipt missing');graph[env]={sha256:hash(bytes),chunks:value.rows.length};}
 const resolver=inside(server,'cars-native-preferences.js'),resolverBytes=fs.readFileSync(resolver);if(!resolverBytes.toString().includes('resolveCarsNativePreferences'))fail('compiled pure resolver export missing');
 const routes=wanted.map(pathname=>{const locale=pathname.split('/')[1],route={locale,pathname:target.base+pathname};for(const kind of ['html','rsc']){const bytes=fs.readFileSync(inside(prerender,pathname.slice(1)+'.'+kind));if(bytes.length<1||bytes.length>2*1024*1024)fail('unbounded native '+kind);if(kind==='html'&&bytes.toString().split('<script type="application/json" id="cars-modern-native-preferences">null</script>').length!==2)fail('actual native HTML bootstrap slot differs');const sha256=hash(bytes),relative='_cars/private/modern/'+sha256+'.'+kind;route[kind]={path:'/'+relative,bytes:bytes.length,sha256};const dest=inside(client,relative);fs.mkdirSync(path.dirname(dest),{recursive:true});fs.writeFileSync(dest,bytes,{flag:'wx'});}return route;});
 if(new Set(routes.flatMap(row=>[row.html.path,row.rsc.path])).size!==4)fail('duplicate snapshots');
 const manifest={schemaVersion:1,kind:'cars-modern-services-static-experiment',mount:target.base,routes};
 fs.writeFileSync(inside(server,'cars-free-services.json'),JSON.stringify(manifest,null,2)+'\n',{flag:'wx'});
 const receipt={...contract,schemaVersion:1,kind:'cars-modern-free-services-compiled-experiment',buildId:index.buildId,nativePrerenderIndexSha256:hash(indexBytes),discardedGenerated404:seen.has('/404'),emitted:routes,resolver:{path:target.root+'/dist/server/cars-native-preferences.js',bytes:resolverBytes.length,sha256:hash(resolverBytes),callableVerified:false},graph,originalClientSourceTreeUnchanged:true,queryCache:false,nativeApproved:false,hostedApproved:false,freeCpuQualified:false};
 fs.writeFileSync(inside(server,'cars-free-services-build.json'),JSON.stringify(receipt,null,2)+'\n',{flag:'wx'});
 removeOwnedLeaves(prerender,actual);fs.unlinkSync(indexPath);
 return {manifestPath:target.root+'/dist/server/cars-free-services.json',resolverPath:target.root+'/dist/server/cars-native-preferences.js',receiptPath:target.root+'/dist/server/cars-free-services-build.json'};
}

export function modernFreeServicesBuildSource(){
 const functions=[createModernFreeServicesPlugin,inside,leaves,removeOwnedLeaves,emitModernFreeServicesSnapshots];
 return "import fs from 'node:fs';\nimport path from 'node:path';\nimport {createHash} from 'node:crypto';\nconst MODERN_FREE_CLIENT_TREE="+JSON.stringify(MODERN_FREE_CLIENT_TREE)+";\nconst hash="+hash.toString()+";\nconst hex="+hex.toString()+";\nconst fail="+fail.toString()+";\n"+functions.map(fn=>'export '+fn.toString()).join('\n')+'\n';
}
