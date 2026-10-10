/** Compile preserved existing dealer candidates with the maintained Cloudflare adapters.
 * No template/dealer generation, Vercel write, credential export or release approval.
 * The resulting exact artifacts are staged for separately authorized local deployment.
 */
import fs from 'node:fs';
import path from 'node:path';
import {createHash} from 'node:crypto';
import {gzipSync} from 'node:zlib';
import {createRequire} from 'node:module';
import {spawnSync} from 'node:child_process';
import {fileURLToPath} from 'node:url';
import {ROOT,git,normalized,filesAt,writeJson} from './lib/workflow.mjs';
import {collectSource,validatePackagingManifest,switcherConfiguration} from './package-dealer.mjs';
import {loadDealerProfile} from './lib/client-refresh-normalize.mjs';
import {assertAppVariant} from './publishing/app-variant.mjs';
import {assertExtendedVariantSources,applySixVariantMounts} from './publishing/six-variant.mjs';
import {bindModernMobileWordmarkLogo} from './lib/client-logo-contract.mjs';
import {applyDealerPresentation} from './publishing/dealer-presentation.mjs';
import {specializeModernDemoDatabase} from './publishing/modern-demo-database.mjs';
import {specializeDealerReferencePackage} from './publishing/dealer-reference-package.mjs';
import {applyDealerShare} from './publishing/dealer-share.mjs';
import {PUBLIC_ROOTS,familyRetention} from './publishing/vercel-asset-plan.mjs';
import {applyCloudflareProvider} from './publishing/cloudflare-provider.mjs';
import {applyCloudflareSvelte,CLOUDFLARE_SVELTE_OUTPUT} from './publishing/cloudflare-svelte.mjs';
import {resolveCloudflareNpmCli} from './publishing/cloudflare-next.mjs';
import {artifactInventory,copyBuildArtifact,assertCompiledConfig,safeArtifactPath} from './lib/uk-cloudflare-artifacts.mjs';

export const NODES=Object.freeze({'auto-best':'22.23.2',modern:'22.23.2',import:'24.21.0',app:'22.23.2',mobile:'22.23.2','karento-best':'26.10.0',router:'22.23.2'});
export const FAMILIES=Object.keys(NODES).filter(k=>k!=='router');
const NEXT=new Set(['modern','app','mobile']);
const encode=v=>Buffer.from(JSON.stringify(v,null,2)+'\n');
const hash=b=>createHash('sha256').update(b).digest('hex');
const read=p=>JSON.parse(fs.readFileSync(p,'utf8'));
const selection=()=>read(path.join(ROOT,'docs/releases/cloudflare-existing25-20261011/selection.json')).leads;
export function selectedDealer(slug,leads=selection()) {
 const dealer=leads.find(d=>d.slug===slug);
 const validRepository = dealer && (/^darkapoparka\/cars-[a-z0-9]+$/.test(dealer.proposedRepository) || (slug === 'day-and-night-auto-group' && dealer.proposedRepository === 'darkapoparka/day-and-night-autodeal'));
 if(!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug||'')||!validRepository)throw Error('Unregistered existing dealer');
 return dealer;
}
export function buildMatrix(request,leads=selection()) {
 if(request?.schemaVersion!==1||!Array.isArray(request.dealers)||!request.dealers.length||request.dealers.length>25||new Set(request.dealers).size!==request.dealers.length)throw Error('Invalid Cloudflare batch');
 const keys=request.targets??Object.keys(NODES);
 if(!Array.isArray(keys)||!keys.length||new Set(keys).size!==keys.length||keys.some(k=>!Object.hasOwn(NODES,k)))throw Error('Invalid Cloudflare targets');
 return {include:request.dealers.flatMap(slug=>{selectedDealer(slug,leads);return keys.map(key=>({slug,key,node:NODES[key]}));})};
}
export function pruneReviewedAssets(input,keys=FAMILIES) {
 const files=new Map(input),receipts=[];
 for(const key of keys){
  const plan=familyRetention(files,key);const prefix=PUBLIC_ROOTS[key];
  for(const row of plan.omitted){const bytes=files.get(prefix+row.path);if(!bytes||hash(bytes)!==row.sha256||bytes.length!==row.bytes)throw Error('Reviewed asset changed: '+row.path);}
  for(const row of plan.omitted)files.delete(prefix+row.path);
  receipts.push({key,...plan,canonicalAssetsRetained:true});
 }
 return {files,receipts};
}
function sourceRows(files){return [...files].sort(([a],[b])=>a<b?-1:a>b?1:0).map(([p,b])=>({path:p,sha256:hash(normalized(b))}));}
function exactCi(key){
 if(process.platform!=='linux'||process.env.GITHUB_ACTIONS!=='true'||process.env.GITHUB_REPOSITORY!=='darkapoparka/cars'||process.env.GITHUB_REF!=="refs/heads/codex/cloudflare-existing25-20261011"||process.version!=='v'+NODES[key]||!/^\d+$/.test(process.env.GITHUB_RUN_ID||''))throw Error('Compile only the declared family in isolated existing-fleet CI');
 const sha=process.env.GITHUB_SHA;
 if(!/^[a-f0-9]{40}$/.test(sha||'')||git(ROOT,['rev-parse','HEAD'])!==sha||git(ROOT,['remote','get-url','origin']).replace(/\.git$/,'')!=='https://github.com/darkapoparka/cars')throw Error('Exact Cars source is required');
 return sha;
}
function stage(area,name,args,cwd){
 const log=path.join(area,'receipts',name+'.log'),fd=fs.openSync(log,'wx');let result;
 console.log('EXISTING FLEET CLOUDFLARE '+name);
 try{result=spawnSync(process.execPath,args,{cwd,env:{...process.env,CI:'true',NEXT_TELEMETRY_DISABLED:'1',WRANGLER_SEND_METRICS:'false'},stdio:['ignore',fd,fd],timeout:40*60*1000});}finally{fs.closeSync(fd);}
 const passed=!result.error&&result.status===0;
 const p=path.join(area,'receipts/steps.json'),steps=fs.existsSync(p)?read(p):[];steps.push({phase:name,passed,exitCode:result.status,error:result.error?.message??null});writeJson(p,steps);
 if(!passed){const bytes=fs.readFileSync(log);console.error(bytes.subarray(Math.max(0,bytes.length-18000)).toString());throw Error(name+' failed');}
}
function writeFiles(root,files){
 if(fs.existsSync(root))throw Error('Fresh derived package required');fs.mkdirSync(root,{recursive:true});
 for(const [name,bytes]of files){if(!safeArtifactPath(name))throw Error('Unsafe package member');const p=path.join(root,name);fs.mkdirSync(path.dirname(p),{recursive:true});fs.writeFileSync(p,bytes,{flag:'wx'});}
}
async function prepare(slug,key,sha,area){
 const dealer=selectedDealer(slug),source=path.join(ROOT,'clients',slug),manifest=read(path.join(source,'dealer.json'));
 const candidate=read(path.join(source,'.client/cloudflare-existing-source.json'));
 if(manifest.slug!==slug||manifest.repository!==dealer.proposedRepository||candidate.dealer!==slug||candidate.kind!=='personalized-source-candidate-not-an-approved-release')throw Error('Candidate identity mismatch');
 validatePackagingManifest(manifest);
 let files=await collectSource(source,manifest);assertAppVariant(files,manifest);assertExtendedVariantSources(files,manifest);
 const inputRows=sourceRows(files),profile=loadDealerProfile(source,slug),workerPrefix=manifest.repository.split('/')[1];
 const publicOrigin='https://'+workerPrefix+'.darkapoparka1.workers.dev';
 manifest.cloudflare={workerPrefix};
 if(!manifest.shareIdentity?.logo?.sourcePath||!files.has(manifest.shareIdentity.logo.sourcePath)||hash(files.get(manifest.shareIdentity.logo.sourcePath))!==manifest.shareIdentity.logo.sha256)throw Error('Preserved dealer share-logo contract differs');
 manifest.shareIdentity={...manifest.shareIdentity,publicOrigin};manifest.candidate={...(manifest.candidate||{}),approved:false,nativeReleaseQualification:false};
 const presentation=applyDealerPresentation(files,manifest);
 files=applySixVariantMounts(files,manifest,{provider:'cloudflare'});
 const logoFile='modern/packages/marketplace-ui/components/dealer-mobile-brand-bar.tsx',originalLogo=files.get(logoFile);if(!originalLogo)throw Error('Modern logo consumer missing');
 const fixedLogo=Buffer.from(bindModernMobileWordmarkLogo(originalLogo.toString('utf8')));files.set(logoFile,fixedLogo);
 const contracts={kind:'existing-reviewed-pilot-logo-binding',changes:[{path:logoFile,beforeSha256:hash(originalLogo),afterSha256:hash(fixedLogo)}],factsPreserved:true};
 const reference=specializeDealerReferencePackage(files,manifest);
 const databaseSpecialization=specializeModernDemoDatabase(files,manifest);
 const tools=createRequire(path.join(ROOT,'runtime/varna-tools/package.json')),sharp=tools('sharp'),typescript=tools('typescript');
 if(sharp.versions.sharp!=='0.35.5'||typescript.version!=='6.0.3')throw Error('Unexpected share compiler');
 await applyDealerShare(files,manifest,{sharp,typescript});
 const config=switcherConfiguration(manifest,read(path.join(ROOT,'scripts/publishing/switcher-messages.json')),files);
 const switcher=fs.readFileSync(path.join(ROOT,'scripts/publishing/preview-switcher.js'),'utf8').replace('__CARS_SWITCHER_CONFIG__',()=>JSON.stringify(config).replace(/</g,'\\u003c'));
 files.set('auto-best/static/preview-switcher.js',Buffer.from(switcher));files.set('dealer.json',encode(manifest));
 const pruned=pruneReviewedAssets(files);files=pruned.files;
 files=await applyCloudflareProvider(files,manifest,{workerPrefix,svelteAdapter:(f,m,o)=>applyCloudflareSvelte(f,m,{...o,serviceKeys:!NEXT.has(key)&&key!=='router'?[key]:['auto-best','import','karento-best']})});
 files.set('scripts/build-cloudflare-svelte.mjs',fs.readFileSync(path.join(ROOT,'scripts/publishing/cloudflare-svelte.mjs')));
 const assembledRows=sourceRows(files);
 // Materialize only this job's real target, not six installed dependency trees.
 const root=key==='router'?'cloudflare':key;
 const retained=new Map([...files].filter(([name])=>name.startsWith(root+'/')||name.startsWith('scripts/')||!name.includes('/')));
 const packageRoot=path.join(area,'package');writeFiles(packageRoot,retained);
 const provenance={schemaVersion:1,dealer:slug,key,sourceCommit:sha,sourceTree:git(ROOT,['rev-parse',sha+':clients/'+slug]),inputDigest:hash(JSON.stringify(inputRows)),sourceCandidate:candidate.candidateSourceDigest,sourceReleases:manifest.templateSources,manifest,workerPrefix,publicOrigin,originalSourceUnchanged:true,assembledDigest:hash(JSON.stringify(assembledRows)),targetBeforeDependencies:sourceRows(retained),contracts,presentation,reference,databaseSpecialization,retention:pruned.receipts,nativeApproval:false,hosted:false};
 writeJson(path.join(area,'receipts/source.json'),provenance);return {packageRoot,manifest,provenance};
}
function installedBin(root,name){
 const require=createRequire(path.join(root,'package.json'));for(const directory of require.resolve.paths(name)||[]){const p=path.join(directory,name,'package.json');if(fs.existsSync(p)){const pkg=read(p);if(pkg.name===name)return path.resolve(path.dirname(p),typeof pkg.bin==='string'?pkg.bin:pkg.bin[name]);}}
 throw Error('Compiler missing: '+name);
}
export function outputBudget(assets,modules){
 const result={assetFiles:assets.length,assetBytes:assets.reduce((n,r)=>n+r.bytes,0),largestAsset:assets.reduce((a,r)=>r.bytes>(a?.bytes??-1)?r:a,null),workerModules:modules.length,workerCompressedBytes:modules.reduce((n,r)=>n+r.compressedBytes,0)};
 if(assets.length>20000||assets.some(r=>r.bytes>25*1024**2))throw Error('Cloudflare asset limit exceeded: '+JSON.stringify(result));
 if(result.workerCompressedBytes>3*1024**2)throw Error('Cloudflare Free Worker size exceeded; no plan upgrade authorized: '+JSON.stringify(result));
 return result;
}
export async function compile(slug,key){
 selectedDealer(slug);if(!Object.hasOwn(NODES,key))throw Error('Unknown family');const sha=exactCi(key);
 const area=path.join(ROOT,'runtime/existing-fleet-cloudflare',slug,key);if(fs.existsSync(area))throw Error('Build attempt exists');fs.mkdirSync(path.join(area,'receipts'),{recursive:true});
 const artifact=path.join(area,'artifact');fs.mkdirSync(artifact);const result={schemaVersion:1,dealer:slug,key,sourceCommit:sha,runId:process.env.GITHUB_RUN_ID,attempt:process.env.GITHUB_RUN_ATTEMPT,node:process.version,startedAt:new Date().toISOString(),status:'running',compiled:false,hosted:false};
 try{
  const {packageRoot,manifest,provenance}=await prepare(slug,key,sha,area);let target,bundle;
  if(key==='router'){
   target={config:'cloudflare/wrangler.jsonc',main:'cloudflare/router.mjs',assets:'cloudflare/public',workerName:provenance.workerPrefix,root:'cloudflare'};
   stage(area,'router-install',[resolveCloudflareNpmCli(process.execPath,fs,path),'ci','--include=dev'],path.join(packageRoot,'cloudflare'));
   bundle='cloudflare/.cars-cloudflare/worker';stage(area,'router-dry-run',[installedBin(path.join(packageRoot,'cloudflare'),'wrangler'),'deploy','--dry-run','--outdir',path.join(packageRoot,bundle)],path.join(packageRoot,'cloudflare'));
   for(const name of [target.config,target.main,target.assets,bundle])copyBuildArtifact(path.join(packageRoot,name),path.join(artifact,'compiled',name));
  }else if(NEXT.has(key)){
   const receipt=read(path.join(packageRoot,'.cars-cloudflare-next.json')),t=receipt.targets.find(t=>t.key===key),helper=path.join(packageRoot,'scripts/build-cloudflare-next.mjs');
   for(const phase of ['install','build','freeze'])stage(area,key+'-'+phase,[helper,phase,key],packageRoot);
   target={...t,config:t.generatedConfig};bundle=t.root+'/.cars-cloudflare/worker';
   stage(area,key+'-dry-run',[installedBin(path.join(packageRoot,t.root),'wrangler'),'deploy','--dry-run','--config',path.join(packageRoot,target.config),'--outdir',path.join(packageRoot,bundle)],path.join(packageRoot,t.root));
   copyBuildArtifact(path.join(packageRoot,t.root,'dist'),path.join(artifact,'compiled',t.root,'dist'));
   copyBuildArtifact(path.join(packageRoot,bundle),path.join(artifact,'compiled',bundle));
   for(const name of ['.cars-next-'+key+'-dependencies.json','.cars-next-'+key+'-frozen-lock.json'])copyBuildArtifact(path.join(packageRoot,name),path.join(area,'receipts',name));
  }else{
   const helper=path.join(packageRoot,'scripts/build-cloudflare-svelte.mjs');
   if(key==='auto-best')stage(area,'auto-best-locales',[path.join(packageRoot,key,'scripts/build-locales.mjs')],path.join(packageRoot,key));
   for(const phase of ['dependencies','build','dry-run'])stage(area,key+'-'+phase,[helper,key,phase],packageRoot);
   stage(area,key+'-freeze',[helper,'freeze'],packageRoot);
   target={root:key,config:key+'/wrangler.json',main:key+'/'+CLOUDFLARE_SVELTE_OUTPUT.main,assets:key+'/'+CLOUDFLARE_SVELTE_OUTPUT.assets,workerName:read(path.join(packageRoot,key,'wrangler.json')).name};bundle=key+'/'+CLOUDFLARE_SVELTE_OUTPUT.bundle;
   for(const name of [key+'/wrangler.json',key+'/.svelte-kit/cloudflare',key+'/.svelte-kit/cloudflare-worker',bundle])copyBuildArtifact(path.join(packageRoot,name),path.join(artifact,'compiled',name));
   for(const name of ['.cars-cloudflare-svelte-locks.json','.cars-build-assets/'+key+'.cloudflare-dependencies.json','.cars-build-assets/'+key+'.cloudflare-build.json'])copyBuildArtifact(path.join(packageRoot,name),path.join(area,'receipts',name));
  }
  const nativeConfig=read(path.join(packageRoot,target.config));assertCompiledConfig(nativeConfig,target,{router:key==='router'});
  const assetNames=filesAt(path.join(packageRoot,target.assets),{filter:()=>true}).filter(n=>!n.endsWith('.map')&&!['.assetsignore','_routes.json','_headers','_redirects'].includes(n)&&!n.startsWith('_worker.js'));
  const assets=assetNames.map(n=>({path:n,bytes:fs.statSync(path.join(packageRoot,target.assets,n)).size}));
  const modules=filesAt(path.join(packageRoot,bundle),{filter:()=>true}).filter(n=>!n.endsWith('.map')&&!/^README(?:\.|$)/i.test(path.basename(n))).map(n=>({path:n,compressedBytes:gzipSync(fs.readFileSync(path.join(packageRoot,bundle,n))).length}));
  const output=outputBudget(assets,modules);
  const uploadMain=NEXT.has(key)||key==='router'?target.main:bundle+'/index.js';
  const uploadConfig={...nativeConfig,main:uploadMain,assets:{...nativeConfig.assets,directory:target.assets},no_bundle:true};
  delete uploadConfig.$schema;
  if(uploadConfig.build?.command||uploadConfig.route||uploadConfig.routes?.length||uploadConfig.durable_objects?.bindings?.length||uploadConfig.containers?.length)throw Error('Unexpected deployment-side build or resource');
  writeJson(path.join(artifact,'compiled/deploy.json'),uploadConfig);
  const compiledFiles=filesAt(path.join(artifact,'compiled'),{filter:()=>true}).map(name=>{const b=fs.readFileSync(path.join(artifact,'compiled',name));return {path:'compiled/'+name,bytes:b.length,sha256:hash(b)};});
  const deploy={schemaVersion:1,kind:'existing-fleet-cloudflare-compiled-candidate',dealer:slug,key,provider:'cloudflare',accountId:'cb0007f242077bd759331f096eb75531',workerName:target.workerName,publicOrigin:provenance.publicOrigin,sourceCommit:sha,sourceTree:provenance.sourceTree,inputDigest:provenance.inputDigest,sourceReleases:manifest.templateSources,configPath:'compiled/deploy.json',mainPath:'compiled/'+uploadMain,assetPath:'compiled/'+target.assets,compiledFiles,compiledDigest:hash(JSON.stringify(compiledFiles)),output,runId:process.env.GITHUB_RUN_ID,attempt:process.env.GITHUB_RUN_ATTEMPT,compiled:true,dryRun:true,hosted:false,credentialsIncluded:false,nativeApproval:false};
  writeJson(path.join(artifact,'deploy.json'),deploy);Object.assign(result,{status:'passed',compiled:true,dryRun:true,workerName:target.workerName,compiledDigest:deploy.compiledDigest,output});
 }catch(error){Object.assign(result,{status:'failed',error:error.message});throw error;}
 finally{result.finishedAt=new Date().toISOString();writeJson(path.join(area,'receipts/build.json'),result);copyBuildArtifact(path.join(area,'receipts'),path.join(artifact,'receipts'));artifactInventory(artifact,{kind:'existing-fleet-cloudflare-compiled-candidate',dealer:slug,key,status:result.status});console.log(JSON.stringify(result));}
 return result;
}
if(process.argv[1]&&path.resolve(process.argv[1])===fileURLToPath(import.meta.url))try{const [command,a,b]=process.argv.slice(2);if(command==='matrix')console.log('matrix='+JSON.stringify(buildMatrix(read(path.join(ROOT,'docs/releases/cloudflare-existing25-20261011/build-request.json')))));else if(command==='compile')await compile(a,b);else throw Error('Usage: matrix | compile SLUG FAMILY');}catch(e){console.error(e.stack);process.exitCode=1;}
