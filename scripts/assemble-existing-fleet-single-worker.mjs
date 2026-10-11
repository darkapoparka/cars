/** CI-only assembly of seven immutable native builds into one sealed provider artifact.
 * No dealer generation, source modification, authentication or hosting deployment.
 */
import fs from 'node:fs';
import path from 'node:path';
import {createRequire} from 'node:module';
import {spawnSync} from 'node:child_process';
import {pathToFileURL} from 'node:url';
import {ROOT,json,sha256,normalized,filesAt,inside,git,writeJson} from './lib/workflow.mjs';
import {artifactInventory,validateFileInventory} from './lib/uk-cloudflare-artifacts.mjs';
import {COMPOSITION_KEYS,registeredCompositionIdentity,reviewedRouterVariants,runDealerSingleWorker} from './package-dealer-single-worker.mjs';
import {inspectSingleWorkerInputs,singleWorkerSource} from './package-uk-single-worker.mjs';
import {collectSource} from './package-dealer.mjs';
import {buildMatrix,selectedDealer} from './build-existing-fleet-cloudflare.mjs';

export const SINGLETON_KIND='existing-fleet-cloudflare-single-worker';
export const SINGLETON_ACCOUNT='cb0007f242077bd759331f096eb75531';
export const SINGLETON_TOOLCHAIN=Object.freeze({node:'26.10.0',wrangler:'4.149.0',esbuild:'0.28.2'});
const hex40=value=>/^[a-f0-9]{40}$/.test(value??''),hex64=value=>/^[a-f0-9]{64}$/.test(value??'');
const number=value=>/^[1-9][0-9]{0,14}$/.test(String(value??''));
const canonical=value=>JSON.stringify(value,(_,v)=>v&&typeof v==='object'&&!Array.isArray(v)?Object.fromEntries(Object.keys(v).sort().map(k=>[k,v[k]])):v);
const assert=(value,message)=>{if(!value)throw Error(message);};
export const singletonArtifactName=(slug,runId,attempt)=>'existing-cf-single-worker-'+slug+'-'+runId+'-'+attempt;

export function assertSingletonConfig(config,workerName) {
 const allowed=new Set(['name','main','base_dir','compatibility_date','compatibility_flags','workers_dev','preview_urls','no_bundle','find_additional_modules','rules','observability','assets']);
 assert(config&&Object.keys(config).every(k=>allowed.has(k))&&config.name===workerName&&config.main==='server/worker.mjs'&&config.base_dir==='server'&&
  config.compatibility_date==='2026-10-10'&&canonical(config.compatibility_flags)===canonical(['nodejs_compat'])&&config.workers_dev===true&&config.preview_urls===false&&
  config.no_bundle===true&&config.find_additional_modules===true&&canonical(config.rules)===canonical([{type:'ESModule',globs:['**/*.js','**/*.mjs'],fallthrough:true},{type:'CompiledWasm',globs:['**/*.wasm'],fallthrough:true}])&&
  canonical(config.observability)===canonical({enabled:true})&&canonical(config.assets)===canonical({directory:'./public',binding:'ASSETS',run_worker_first:false}),
  'Singleton configuration differs or includes service bindings, routes or foreign resources');
 return config;
}

/** Linear byte verification: no repeated whole-manifest validation for each file. */
export function verifySingletonInventory(directory) {
 assert(fs.existsSync(directory)&&fs.lstatSync(directory).isDirectory()&&!fs.lstatSync(directory).isSymbolicLink(),'An unlinked singleton directory is required');
 const inventory=validateFileInventory(json(inside(directory,'artifact-manifest.json',{mustExist:true})));
 const actual=filesAt(directory,{filter:()=>true}).filter(n=>n!=='artifact-manifest.json');
 assert(canonical(actual)===canonical(inventory.files.map(r=>r.path).sort()),'Singleton has missing or undeclared files');
 for(const row of inventory.files){
  assert(!row.path.split('/').some(n=>['node_modules','.git'].includes(n)||n.startsWith('.env')||n.startsWith('.dev.vars')),'Private/dependency file in singleton artifact');
  const bytes=fs.readFileSync(inside(directory,row.path,{mustExist:true}));
  assert(bytes.length===row.bytes&&sha256(bytes)===row.sha256,'Singleton bytes differ: '+row.path);
 }
 return inventory;
}

export function validateFleetSingleton({inventory,receipt,review,delivery,config,entry}) {
 assert(inventory.kind===SINGLETON_KIND&&inventory.status==='passed'&&receipt.schemaVersion===1&&receipt.type==='cars-existing-fleet-single-worker-provider-package'&&
  inventory.dealer===receipt.dealer&&receipt.workerCount===1&&receipt.applicationCount===6&&receipt.accountId===SINGLETON_ACCOUNT&&receipt.hostedVerified===false&&
  receipt.sourceApplicationBytesChanged===false&&receipt.compiledApplicationBytesChanged===true&&hex40(receipt.sourceCommit)&&hex40(receipt.sourceTree)&&hex64(receipt.inputDigest)&&
  number(receipt.runId)&&number(receipt.attempt)&&!['packageTree','packageDigest','payloadDigest'].some(k=>Object.hasOwn(receipt,k)), 'Not an exact fleet singleton provider package');
 assert(canonical(receipt.composition)===canonical({inProcess:COMPOSITION_KEYS.filter(k=>k!=='router'),serviceBindings:[]})&&canonical(receipt.frameworkGlobalScopes)===canonical(['modern','app','mobile']), 'Singleton depends on external design services');
 assert(Object.keys(receipt.sourceReleases??{}).sort().join(',')===COMPOSITION_KEYS.filter(k=>k!=='router').sort().join(','),'Missing six source releases');
 for(const key of COMPOSITION_KEYS.filter(k=>k!=='router')){const r=receipt.sourceReleases[key];assert(r.repository==='darkapoparka/cars'&&r.path==='templates/'+key&&hex40(r.revision)&&hex40(r.tree)&&hex64(r.digest),'Invalid source release '+key);}
 assert(review.schemaVersion===1&&review.type==='cars-dealer-single-worker-composition'&&review.inputKind==='existing-fleet'&&review.client===receipt.dealer&&review.compositionWritten===true&&review.reviewed===true&&
  Number.isFinite(Date.parse(review.reviewedAt))&&review.sourceRepository==='darkapoparka/cars'&&review.independentSource===false&&review.workerName===receipt.workerName&&review.publicOrigin===receipt.publicOrigin&&
  review.sourceCommit===receipt.sourceCommit&&canonical(review.sourceIdentity)===canonical({sourceTree:receipt.sourceTree,inputDigest:receipt.inputDigest,sourceReleases:receipt.sourceReleases})&&
  review.outputDigest===receipt.outputDigest&&review.workerCount===1&&review.applicationCount===6&&canonical(review.serviceBindings)===canonical([])&&review.deployments===0&&review.hostedVerified===false,
  'Singleton composition review differs');
 const keys=Object.keys(receipt.artifacts??{}).sort();assert(canonical(keys)===canonical([...COMPOSITION_KEYS].sort())&&canonical(Object.keys(review.artifacts??{}).sort())===canonical(keys),'Missing seven reviewed input pins');
 for(const key of keys){const pin=receipt.artifacts[key],approved=review.artifacts[key];assert(hex64(pin.digest)&&hex64(pin.compiledDigest)&&approved.artifactDigest===pin.digest&&approved.compiledDigest===pin.compiledDigest,'Singleton input pin differs: '+key);}
 assert(delivery.schemaVersion===1&&delivery.kind===SINGLETON_KIND&&delivery.status==='passed'&&delivery.dealer===receipt.dealer&&delivery.repository===review.repository&&delivery.sourceRepository===review.sourceRepository&&
  delivery.workerName===receipt.workerName&&delivery.publicOrigin===receipt.publicOrigin&&delivery.accountId===SINGLETON_ACCOUNT&&delivery.sourceCommit===receipt.sourceCommit&&delivery.sourceTree===receipt.sourceTree&&
  delivery.inputDigest===receipt.inputDigest&&canonical(delivery.sourceReleases)===canonical(receipt.sourceReleases)&&String(delivery.runId)===String(receipt.runId)&&String(delivery.attempt)===String(receipt.attempt)&&
  delivery.artifactName===singletonArtifactName(receipt.dealer,receipt.runId,receipt.attempt)&&delivery.outputDigest===receipt.outputDigest&&canonical(delivery.inputs)===canonical(receipt.artifacts)&&
  delivery.compiled===true&&delivery.dryRun===true&&delivery.credentialsIncluded===false&&delivery.deploymentPerformed===false&&delivery.hostedVerified===false&&delivery.ownerAccepted===false&&
  delivery.node==='v'+SINGLETON_TOOLCHAIN.node&&delivery.wranglerVersion===SINGLETON_TOOLCHAIN.wrangler&&delivery.esbuildVersion===SINGLETON_TOOLCHAIN.esbuild&&receipt.esbuildVersion===SINGLETON_TOOLCHAIN.esbuild,
  'Singleton delivery receipt differs');
 const rows=receipt.files;assert(Array.isArray(rows)&&sha256(JSON.stringify(rows))===receipt.outputDigest,'Singleton output digest differs');
 const derived=inventory.files.filter(r=>!['single-worker-receipt.json','dealer-composition-review.json','delivery-receipt.json'].includes(r.path));
 assert(canonical(derived)===canonical(rows),'Singleton output inventory differs');
 assert(rows.every(r=>r.path==='wrangler.json'||r.path.startsWith('server/')||r.path.startsWith('public/')),'Unexpected singleton payload');
 const server=rows.filter(r=>r.path.startsWith('server/')),assets=rows.filter(r=>r.path.startsWith('public/'));
 assert(server.reduce((s,r)=>s+r.bytes,0)===receipt.serverBytes&&receipt.serverBytes<64*1024**2&&assets.length===receipt.assetFiles&&assets.length<20000&&assets.every(r=>r.bytes<=25*1024**2),'Singleton exceeds current account Worker/assets limits');
 assert(entry===singleWorkerSource(),'Singleton entry is not the six in-process design router');
 assertSingletonConfig(config,receipt.workerName);
 return {inventory,receipt,review,delivery,config};
}

export function verifyFleetSingletonDirectory(directory) {
 const inventory=verifySingletonInventory(directory),read=name=>json(inside(directory,name,{mustExist:true}));
 return validateFleetSingleton({inventory,receipt:read('single-worker-receipt.json'),review:read('dealer-composition-review.json'),delivery:read('delivery-receipt.json'),config:read('wrangler.json'),entry:fs.readFileSync(inside(directory,'server/worker.mjs',{mustExist:true}),'utf8')});
}

export function assertCiContext({env=process.env,platform=process.platform,version=process.version,root=ROOT,gitRead=git}={}) {
 assert(platform==='linux'&&version==='v'+SINGLETON_TOOLCHAIN.node&&env.GITHUB_ACTIONS==='true'&&env.GITHUB_EVENT_NAME==='push'&&env.GITHUB_REPOSITORY==='darkapoparka/cars'&&
  env.GITHUB_REF==='refs/heads/main'&&hex40(env.GITHUB_SHA)&&number(env.GITHUB_RUN_ID)&&number(env.GITHUB_RUN_ATTEMPT),'Assembly requires the exact Cars main push CI context');
 assert(gitRead(root,['rev-parse','HEAD'])===env.GITHUB_SHA&&gitRead(root,['remote','get-url','origin']).replace(/\.git$/,'')==='https://github.com/darkapoparka/cars','CI checkout differs from the exact source');
 assert(!Object.keys(env).some(k=>/^(?:CLOUDFLARE|CF)_(?:API_(?:TOKEN|KEY)|AUTH|TOKEN)|^WRANGLER_(?:API_TOKEN|TOKEN)$/.test(k)&&env[k]),'No Cloudflare credentials may enter CI assembly');
 return {sourceCommit:env.GITHUB_SHA,runId:env.GITHUB_RUN_ID,attempt:env.GITHUB_RUN_ATTEMPT};
}

export function validateCiSourceIdentity(actual,expected) {
 for(const key of ['sourceCommit','sourceTree','inputDigest','sourceReleases'])assert(canonical(actual[key])===canonical(expected[key]),'CI compiled source differs: '+key);
 return actual;
}

export async function sourceIdentityForCi(root,slug,sourceCommit,readGit=git) {
 const source=path.join(root,'clients',slug),manifest=json(path.join(source,'dealer.json'));
 assert(!fs.existsSync(path.join(source,'.git'))&&manifest.sourceOwnership!=='independent-repository','Independent dealer needs its own source CI');
 const files=await collectSource(source,manifest),rows=[...files].sort(([a],[b])=>a<b?-1:a>b?1:0).map(([name,bytes])=>({path:name,sha256:sha256(normalized(bytes))}));
 return {sourceCommit,sourceTree:readGit(root,['rev-parse',sourceCommit+':clients/'+slug]),inputDigest:sha256(JSON.stringify(rows)),sourceReleases:manifest.templateSources};
}

export function nativeInputDirectories(inputRoot,slug,runId,attempt) {
 const expected=COMPOSITION_KEYS.map(key=>'existing-cf-'+slug+'-'+key+'-'+runId+'-'+attempt),actual=fs.readdirSync(inputRoot).sort();
 assert(canonical(actual)===canonical([...expected].sort()),'Exactly seven current run/attempt artifact directories are required');
 return Object.fromEntries(COMPOSITION_KEYS.map((key,i)=>[key,inside(inputRoot,expected[i],{mustExist:true})]));
}

export function createCiCompositionReview({slug,inputs,inspected,identity,request,registry,sourceIdentity}) {
 assert(request.composition?.reviewed===true&&Number.isFinite(Date.parse(request.composition.reviewedAt)),'Explicit dated source/composition review is required');
 validateCiSourceIdentity(identity,sourceIdentity);
 const record=registry.dealers?.find(r=>r.slug===slug),variants=reviewedRouterVariants(inputs.router,inspected.router.deploy);
 const review={schemaVersion:1,client:slug,repository:record?.repository,sourceRepository:'darkapoparka/cars',reviewed:true,reviewedAt:request.composition.reviewedAt,
  reviewScope:'Exact committed source and CI provider composition; hosting/owner acceptance are separate',publicOrigin:identity.publicOrigin,workerName:identity.workerName,variants,
  inputs:Object.fromEntries(COMPOSITION_KEYS.map(k=>[k,{directory:inputs[k],artifactDigest:inspected[k].inventory.digest,compiledDigest:inspected[k].deploy.compiledDigest}]))};
 registeredCompositionIdentity(registry,slug,review);
 assert(record?.sourceOwnership!=='independent-repository','Independent dealer requires own reviewed CI source');
 return review;
}

export function dryRunSingleton({directory,toolPackage,logDirectory}) {
 const require=createRequire(toolPackage),wranglerPackage=require.resolve('wrangler/package.json'),wrangler=json(wranglerPackage),esbuild=require('esbuild');
 assert(wrangler.version===SINGLETON_TOOLCHAIN.wrangler&&esbuild.version===SINGLETON_TOOLCHAIN.esbuild,'Assembly toolchain differs from the reviewed lock');
 fs.mkdirSync(logDirectory,{recursive:true});
 const result=spawnSync(process.execPath,[path.join(path.dirname(wranglerPackage),'wrangler-dist/cli.js'),'deploy','--dry-run','--no-bundle','--config',path.join(directory,'wrangler.json'),'--outdir',path.join(logDirectory,'dry-run')],
  {cwd:directory,env:{...process.env,WRANGLER_SEND_METRICS:'false',WRANGLER_LOG_SANITIZE:'true'},encoding:'utf8',timeout:10*60*1000,maxBuffer:8*1024**2,windowsHide:true});
 fs.writeFileSync(path.join(logDirectory,'dry-run.log'),(result.stdout??'')+'\n'+(result.stderr??''),{flag:'wx'});
 assert(!result.error&&result.status===0,'Singleton Wrangler dry-run failed; preserve exact build evidence');
 return {wranglerVersion:wrangler.version,esbuildVersion:esbuild.version,dryRun:true};
}

export async function assembleFleetCi({slug,inputRoot,destination,toolPackage,root=ROOT,env=process.env,registry=json(path.join(root,'docs/DEPLOYMENT-INVENTORY.json')),
 request=json(path.join(root,'docs/releases/cloudflare-existing25-20261011/build-request.json')),leads=json(path.join(root,'docs/releases/cloudflare-existing25-20261011/selection.json')).leads,
 ciCheck=assertCiContext,sourceIdentity=sourceIdentityForCi,compose=runDealerSingleWorker,dryRun=dryRunSingleton}={}) {
 const context=ciCheck({env,root});buildMatrix(request,leads,registry);assert(request.dealers.includes(slug),'Dealer is outside the bounded request');selectedDealer(slug,leads,registry);
 const inputs=nativeInputDirectories(inputRoot,slug,context.runId,context.attempt),{inspected,identity,inputKind}=inspectSingleWorkerInputs({inputs,expectedDealer:slug});
 assert(inputKind==='existing-fleet'&&String(identity.runId)===String(context.runId)&&String(identity.attempt)===String(context.attempt)&&identity.accountId===SINGLETON_ACCOUNT,'Foreign CI artifact kind/account/run/attempt');
 const expected=await sourceIdentity(root,slug,context.sourceCommit),review=createCiCompositionReview({slug,inputs,inspected,identity,request,registry,sourceIdentity:expected});
 const runtime=inside(root,'runtime',{mustExist:true}),out=inside(runtime,path.relative(runtime,path.resolve(destination)));
 const area=path.dirname(out);fs.mkdirSync(area,{recursive:true});const inputsFile=path.join(area,'composition-review.json');
 fs.writeFileSync(inputsFile,JSON.stringify(review,null,2)+'\n',{flag:'wx'});
 const result=compose({client:slug,inputsFile,out,write:true,root,registry,resolveEsbuild:()=>createRequire(toolPackage)('esbuild')});
 const tool=dryRun({directory:out,toolPackage,logDirectory:path.join(area,'evidence')});
 const receipt=json(path.join(out,'single-worker-receipt.json'));
 const delivery={schemaVersion:1,kind:SINGLETON_KIND,status:'passed',dealer:slug,repository:review.repository,sourceRepository:review.sourceRepository,
  accountId:SINGLETON_ACCOUNT,workerName:identity.workerName,publicOrigin:identity.publicOrigin,...expected,runId:context.runId,attempt:context.attempt,
  artifactName:singletonArtifactName(slug,context.runId,context.attempt),inputs:receipt.artifacts,outputDigest:receipt.outputDigest,node:process.version,...tool,
  compiled:true,credentialsIncluded:false,deploymentPerformed:false,hostedVerified:false,ownerAccepted:false};
 writeJson(path.join(out,'delivery-receipt.json'),delivery);
 artifactInventory(out,{kind:SINGLETON_KIND,dealer:slug,status:'passed'});const sealed=verifyFleetSingletonDirectory(out);
 return {dealer:slug,workerName:identity.workerName,workerCount:1,applicationCount:6,serviceBindings:[],artifactName:delivery.artifactName,artifactDigest:sealed.inventory.digest,
  artifactBytes:sealed.inventory.bytes,outputDigest:receipt.outputDigest,destination:out,compiled:true,dryRun:true,deploymentPerformed:false,hostedVerified:false};
}

if(process.argv[1]&&import.meta.url===pathToFileURL(path.resolve(process.argv[1])).href){
 try{const [slug,inputRoot,destination,toolPackage]=process.argv.slice(2);assert(process.argv.length===6,'Usage: assemble-existing-fleet-single-worker.mjs SLUG INPUT_ROOT OUTPUT TOOL_PACKAGE_JSON (main CI only)');
  console.log(JSON.stringify(await assembleFleetCi({slug,inputRoot:path.resolve(inputRoot),destination:path.resolve(destination),toolPackage:path.resolve(toolPackage)}),null,2));
 }catch(error){console.error(error.message);process.exitCode=1;}
}
