/** M2 pack deployment entry point. Enqueue is durable; only drain --write can deploy. */
import fs from 'node:fs';
import path from 'node:path';
import {createHash,randomUUID} from 'node:crypto';
import {spawnSync} from 'node:child_process';
import {isEntrypoint} from './lib/cli-entrypoint.mjs';
import {ROOT,inside,json,sha256} from './lib/workflow.mjs';
import {expectedPackHosting,assertPackBatch} from './lib/dealer-pack-identity.mjs';
import {getPackReleaseBinding} from './lib/dealer-pack-release.mjs';
import {PACK_QUEUE_REPOSITORY,queueCanonical,packDeploymentRequest,validatePackQueue,enqueuePackDeployments,claimPackDeployment} from './lib/dealer-pack-queue.mjs';
import {validatePackDeploymentIdentity,latestOwnedPackReceipt,executeQueuedPackDeployment,validatePackProviderSnapshot,validatePackTargetForWrite} from './lib/dealer-pack-deployment.mjs';
import {cloudflarePackProvider,tokenCloudflareTransport} from './lib/dealer-pack-cloudflare.mjs';
import {gitPackQueueStore} from './lib/dealer-pack-queue-git.mjs';
import {packGithubReadResource,runPackGithubRead} from './lib/dealer-pack-github-read.mjs';

const assert=(ok,message)=>{if(!ok)throw Error(message);};
const hex40=value=>/^[a-f0-9]{40}$/.test(value??'');
const hex64=value=>/^[a-f0-9]{64}$/.test(value??'');
const git=(root,args)=>{const result=spawnSync('git',['-C',root,...args],{encoding:'utf8',maxBuffer:16*1024**2,timeout:120000,windowsHide:true});assert(result.status===0&&!result.signal&&typeof result.stdout==='string','Exact committed pack source could not be read'+(result.error?.code?' ('+result.error.code+')':''));return result.stdout;};

export function githubPackTransport({token=process.env.GH_TOKEN??process.env.GITHUB_TOKEN,fetchImpl=fetch,retryWait,transportClock,transportDiagnostic}={}) {
  return async({method,path:requestPath,query,body})=>{
    assert(requestPath.startsWith('/repos/'+PACK_QUEUE_REPOSITORY+'/'),'Unexpected GitHub repository');
    if(method!=='GET')assert(typeof token==='string'&&token.length>10,'Durable enqueue/drain needs GitHub contents:write authentication; use the connected GitHub adapter when CI credentials are unavailable');
    const url=new URL('https://api.github.com'+requestPath);for(const [key,value] of Object.entries(query??{}))url.searchParams.set(key,String(value));
    if(method==='GET')return runPackGithubRead({operation:'repository-metadata',resource:packGithubReadResource(requestPath),fetchImpl,retryWait,transportClock,transportDiagnostic,execute:async read=>{
      assert(!body,'GitHub GET request body is not supported');
      const response=await read.get(url,{headers:{Accept:'application/vnd.github+json','X-GitHub-Api-Version':'2022-11-28',...(token?{Authorization:'Bearer '+token}:{})},redirect:'follow'});
      return {status:response.status,body:await read.body(()=>response.json())};
    }});
    const response=await fetchImpl(url,{method,headers:{Accept:'application/vnd.github+json','X-GitHub-Api-Version':'2022-11-28',...(token?{Authorization:'Bearer '+token}:{}),...(body?{'Content-Type':'application/json'}:{})},...(body?{body:JSON.stringify(body)}:{}),signal:AbortSignal.timeout(30000)});
    return {status:response.status,body:await response.json()};
  };
}

/** The exact commit is authenticated remotely; Git's content-addressed tree is
 * then matched to every retained local input byte. Branch/main reachability is
 * not fabricated: the owner explicitly authorized the new PR/batch branches.
 */
export async function verifyPublishedPackSource({root=ROOT,slug,pack,sourceCommit,readGithub=githubPackTransport()}={}) {
  assert(hex40(sourceCommit),'Exact source commit required');
  const response=await readGithub({method:'GET',path:'/repos/'+PACK_QUEUE_REPOSITORY+'/commits/'+sourceCommit});
  assert(response.status===200&&response.body?.sha===sourceCommit&&hex40(response.body.commit?.tree?.sha),'Exact pack source commit is not published on GitHub');
  const prefix='dealers/'+slug+'/',sourceTree=git(root,['rev-parse',sourceCommit+':dealers/'+slug]).trim();assert(hex40(sourceTree),'Committed pack subtree is missing');
  const raw=git(root,['ls-tree','-r','-z',sourceCommit,'--','dealers/'+slug]),rows=raw.split('\0').filter(Boolean).map(line=>{
    const match=/^(100644|100755) blob ([a-f0-9]{40})\t(.+)$/.exec(line);assert(match&&match[3].startsWith(prefix),'Pack source contains an unsafe non-file Git entry');return {path:match[3].slice(prefix.length),mode:match[1],sha:match[2]};
  });
  assert(rows.length>0&&rows.length<=512,'Bounded exact committed pack inputs required');
  const physical=pack.sourceFiles??pack.files;assert(physical instanceof Map,'Pack must expose its retained physical input files');
  assert(rows.length===physical.size,'Pack has uncommitted, missing or extra input files');
  for(const row of rows){const bytes=physical.get(row.path);assert(Buffer.isBuffer(bytes),'Pack source file is missing: '+row.path);const objectHash=createHash('sha1').update('blob '+bytes.length+'\0').update(bytes).digest('hex');assert(objectHash===row.sha,'Pack input differs from its published commit: '+row.path);}
  return {verified:true,evidence:'authenticated-github-commit-and-exact-git-blob-bytes',repository:PACK_QUEUE_REPOSITORY,commit:sourceCommit,path:'dealers/'+slug,sourceTree,
    sourceTreeSha256:sha256(queueCanonical(rows)),inputFiles:rows.length,observedAt:new Date().toISOString(),mainReachabilityClaimed:false};
}

/** Durable intake authenticates the small source/manifest identity first. It
 * never marks the compiled bundle verified: the account executor must pass
 * inspectExactPackDeployment before its first provider mutation. */
export async function inspectPackDeploymentIntake({root=ROOT,slug,row,batch,queue,registry,readGithub,buildArtifact}={}) {
  const {loadDealerPack}=await import('./lib/dealer-pack.mjs'),identity=expectedPackHosting(slug);
  assert(row?.slug===slug&&row.sourceCommit===buildArtifact?.sourceCommit,'Artifact intake source identity differs');
  const manifest=json(path.join(root,'dealers',slug,'dealer.json'));
  const own=latestOwnedPackReceipt(queue,{slug,...identity,dealerId:manifest.dealerId});
  const registryRows=Array.isArray(registry)?registry:registry.dealers;
  const pack=loadDealerPack(root,slug,{registryOverride:own?registryRows.filter(value=>value.slug!==slug):registryRows,batch});
  assert(pack.manifest.pack?.benchmarkOnly!==true&&pack.packDigest===row.packDigest,'Benchmark or changed source cannot enter the deployment queue');
  const assignment=assertPackBatch(root,pack.manifest,{batch}),release=getPackReleaseBinding(pack.lock);
  const request=packDeploymentRequest({slug,dealerId:pack.manifest.dealerId,batch:assignment.number,...identity,packDigest:row.packDigest,releaseId:release.releaseId,releaseDigest:row.releaseDigest,outputDigest:row.outputDigest,sourceCommit:row.sourceCommit,buildArtifact});
  validatePackDeploymentIdentity({request,queue,registry});
  const sourceProof=await verifyPublishedPackSource({root,slug,pack,sourceCommit:request.sourceCommit,readGithub});
  return {request,sourceProof,bundleVerified:false,providerWrites:0};
}

export async function inspectExactPackDeployment({root=ROOT,slug,bundleRoot,batch,queue,registry=json(path.join(root,'docs/DEPLOYMENT-INVENTORY.json')),loadPack,readGithub=githubPackTransport(),sourceProof,request:expectedRequest}={}) {
  const directory=inside(path.resolve(bundleRoot),slug+'/bundle',{mustExist:true});
  if(!loadPack)({loadPreparedDealerPack:loadPack}=await import('./prepare-dealer-pack-logo.mjs'));
  const identity=expectedPackHosting(slug);
  // Only a receipt authenticated by the dedicated queue permits the loader to
  // ignore its own registry row after receipt integration.
  const preliminary=expectedRequest??{slug,...identity,dealerId:json(path.join(root,'dealers',slug,'dealer.json')).dealerId};
  const own=queue?latestOwnedPackReceipt(queue,preliminary):null;
  const registryRows=Array.isArray(registry)?registry:registry.dealers;
  const registryOverride=own?registryRows.filter(row=>row.slug!==slug):registryRows;
  const pack=await loadPack(root,slug,{registryOverride,toolPackage:process.env.CARS_DEALER_PACK_TOOL_PACKAGE});
  assert(pack.manifest.pack?.benchmarkOnly!==true,'Benchmark-only slugs are never deployment candidates');
  const assignment=assertPackBatch(root,pack.manifest,{batch});
  const {inspectDealerPackBundle}=await import('./verify-dealer-pack.mjs');
  const rawReceipt=json(path.join(directory,'single-worker-receipt.json'));
  const context=rawReceipt.fastBuild?await (await import('./build-dealer-pack-fast.mjs')).inspectFastDealerPackBundle({root,directory,slug,pack}):inspectDealerPackBundle({bundleRoot:directory,slug,packDigest:pack.packDigest,sourceReleases:pack.manifest.templateSources,plan:'paid'}),receipt=context.receipt;
  assert(receipt.workerName===identity.workerName&&receipt.publicOrigin===identity.publicOrigin&&context.capacity.status==='passed','Bundle identity or capacity does not match the canonical dealer target');
  const parent=path.dirname(directory),build=json(inside(parent,'build-report.json',{mustExist:true})),qa=json(inside(parent,'qa-report.json',{mustExist:true}));
  const bound=value=>value&&value.slug===slug&&value.packDigest===receipt.packDigest&&value.releaseDigest===receipt.releaseDigest&&value.outputDigest===receipt.outputDigest&&queueCanonical(value.execution)===queueCanonical(receipt.execution)&&value.packCompositionDigest===receipt.packCompositionDigest;
  assert(bound(build)&&build.status==='passed','Bound successful build report required');
  assert(bound(qa)&&qa.type==='cars-dealer-pack-qa'&&qa.success===true&&Array.isArray(qa.checks)&&qa.checks.every(row=>row.status==='passed'),'Bound successful local QA required');
  for(const id of ['bundle-integrity','cloudflare-limits','fleet-contact-coverage','logo-assets','rendered-routes','screenshots','bundle-unchanged'])assert(qa.checks.filter(row=>row.id===id&&row.status==='passed').length===1,'Missing local candidate gate: '+id);
  assert(qa.proof?.screenshots?.length===18,'Local six-design screenshot evidence is required');
  const seen=new Set();for(const image of qa.proof.screenshots){assert(['auto-best','modern','import','app','mobile','karento-best'].includes(image.key)&&[320,390,1280].includes(image.width)&&!seen.has(image.key+':'+image.width)&&hex64(image.sha256),'Invalid screenshot coverage');seen.add(image.key+':'+image.width);assert(sha256(fs.readFileSync(inside(parent,image.path,{mustExist:true})))===image.sha256,'Local screenshot bytes changed');}
  const release=getPackReleaseBinding(pack.lock);
  const request=packDeploymentRequest({slug,dealerId:pack.manifest.dealerId,batch:assignment.number,...identity,packDigest:receipt.packDigest,releaseId:release.releaseId,releaseDigest:receipt.releaseDigest,outputDigest:receipt.outputDigest,sourceCommit:receipt.sourceCommit,
    ...(expectedRequest?{action:expectedRequest.action,buildArtifact:expectedRequest.buildArtifact,rollbackTo:expectedRequest.rollbackTo}:{})});
  if(expectedRequest)assert(request.id===expectedRequest.id,'Current inspected bundle does not match the queued request');
  if(queue)validatePackDeploymentIdentity({request,queue,registry});
  sourceProof??=await verifyPublishedPackSource({root,slug,pack,sourceCommit:receipt.sourceCommit,readGithub});
  assert(sourceProof.commit===receipt.sourceCommit&&sourceProof.path==='dealers/'+slug&&sourceProof.verified===true,'Source publication proof differs');
  return {verified:true,root,slug,directory,request,pack,manifest:pack.manifest,benchmarkOnly:false,packDigest:receipt.packDigest,releaseId:release.releaseId,releaseDigest:receipt.releaseDigest,outputDigest:receipt.outputDigest,sourceCommit:receipt.sourceCommit,
    sourceProof,qa,config:context.config,files:context.inventory.files,receipt,capacity:context.capacity,build};
}

export async function inspectPackDeploymentBatch({root=ROOT,slugs,bundleRoot,batch,queue,provider,readGithub,inspect=inspectExactPackDeployment}={}) {
  assert(Array.isArray(slugs)&&slugs.length>0&&slugs.length<=400&&new Set(slugs).size===slugs.length,'Choose between1 and400 distinct slugs');
  const report={schemaVersion:1,type:'cars-dealer-pack-deployment-inspection',startedAt:new Date().toISOString(),success:false,deployments:0,providerWrites:0,liveProviderVerified:Boolean(provider),requests:[],providerObservations:[],failures:[]};let plannedCreates=0;
  for(const slug of slugs)try{
    const candidate=await inspect({root,slug,bundleRoot,batch,queue,readGithub});
    if(provider){
      assert(queue,'Live dry-run requires the authenticated durable policy/baseline');
      const request=candidate.request,{own,mode}=validatePackDeploymentIdentity({request,queue,registry:json(path.join(root,'docs/DEPLOYMENT-INVENTORY.json'))}),challenge={requestId:randomUUID(),stage:'deployment-dry-run',notBefore:new Date().toISOString()};
      const snapshot=validatePackProviderSnapshot(await provider.snapshot({request,challenge}),{challenge,request,queue});validatePackTargetForWrite(snapshot,{request,queue,own,creating:mode==='create-new'});
      if(mode==='create-new'){assert(plannedCreates<snapshot.available,'Only '+snapshot.available+' new dealers fit the observed live capacity; this dry-run already selected that many');plannedCreates++;}
      report.providerObservations.push({slug,mode,scriptCount:snapshot.snapshot.scriptCount,available:snapshot.available,observedAt:snapshot.snapshot.observedAt});
    }
    report.requests.push(candidate.request);
  }catch(error){report.failures.push({slug,reason:error.message});}
  report.success=report.failures.length===0;report.ready=report.requests.length;report.finishedAt=new Date().toISOString();return report;
}

export async function drainPackDeployments({store,provider,owner,root=ROOT,bundleRoot,requestIds,maximum=400,write=false,inspectCandidate,verifyHosted,registry=json(path.join(root,'docs/DEPLOYMENT-INVENTORY.json')),readGithub}={}) {
  assert(write===true,'drain requires explicit --write; inspect/enqueue never deploy');
  assert(Number.isSafeInteger(maximum)&&maximum>0&&maximum<=400,'Bounded drain maximum required');
  const selected=requestIds?new Set(requestIds):null,results=[];
  if(!verifyHosted){const {verifyHostedDealerPack}=await import('./verify-hosted-dealer-pack.mjs');verifyHosted=options=>verifyHostedDealerPack({root:options.candidate?.root??root,registry,...options,pack:options.candidate?.pack,reportFile:path.join(root,'runtime/dealer-pack-hosted',options.request.slug,'report.json'),screenshotDirectory:path.join(root,'runtime/dealer-pack-hosted',options.request.slug,'screenshots')});}
  for(let index=0;index<maximum;index++){
    const current=await store.read();validatePackQueue(current.state);
    if(current.state.active)return {status:'queued',reason:'another executor owns the non-expiring account claim',active:current.state.active,results,pending:current.state.order.filter(id=>current.state.requests[id].status==='queued').length};
    const id=current.state.order.find(key=>current.state.requests[key].status==='queued'&&(!selected||selected.has(key)));if(!id)break;
    // Do not consume a durable request if the authenticated Actions API is
    // temporarily unavailable. The exact source run is also read by materialize;
    // this read warms that same authenticated resolver cache before the claim.
    if(readGithub){
      const request=current.state.requests[id].request,runId=request.buildArtifact?.runId;
      assert(Number.isSafeInteger(runId)&&runId>0,'Queued request is missing an exact source run');
      let probe;try{probe=await readGithub({method:'GET',path:'/repos/'+PACK_QUEUE_REPOSITORY+'/actions/runs/'+runId});}
      catch{return {status:'queued',reason:'Authenticated build source API unavailable before claim',results,pending:current.state.order.filter(key=>current.state.requests[key].status==='queued').length};}
      if(probe.status!==200)return {status:'queued',reason:'Authenticated build source API unavailable before claim',results,pending:current.state.order.filter(key=>current.state.requests[key].status==='queued').length};
      assert(probe.body?.id===runId&&probe.body.head_sha===request.sourceCommit,'Queued source run identity changed before claim');
    }
    const claimed=await claimPackDeployment(store,{owner,requestId:id});if(!claimed.value.claimed)continue;
    const resolve=inspectCandidate??(async request=>inspectExactPackDeployment({root,slug:request.slug,bundleRoot,batch:request.batch,queue:(await store.read()).state,registry,readGithub,request}));
    const result=await executeQueuedPackDeployment({store,claim:claimed.value.claim,provider,inspectCandidate:resolve,registry,verifyHosted});results.push(result);
    if(result.claimRetained)break;
  }
  return {status:results.some(row=>row.status!=='deployed'&&row.status!=='rolled-back')?'completed-with-failures':'completed',results};
}

export async function runPackDeploymentCli(argv=process.argv.slice(2)) {
  if(argv.includes('--help')){console.log('Usage: deploy-dealer-packs.mjs inspect|enqueue --slugs FILE --bundle-root DIR [--batch 1] [--live] [--report FILE]\n       deploy-dealer-packs.mjs drain --bundle-root DIR --owner github:RUN_ID --write [--request-ids INSPECTION.json] [--report FILE]\n       deploy-dealer-packs.mjs status\n--live performs fresh read-only identity/capacity checks. Durable state: darkapoparka/cars, branch cars-deploy-queue, queue.json. Cloudflare secret: CLOUDFLARE_API_TOKEN; GitHub contents:write uses GITHUB_TOKEN. All pack requests persist before drain. A cancelled in-flight owner requires explicit reconciliation; no lease expires automatically.');return;}
  const [command,...args]=argv;assert(['inspect','enqueue','drain','status'].includes(command),'Use inspect, enqueue, drain or status');
  const options={},allowed=new Set(['--slugs','--bundle-root','--batch','--report','--owner','--request-ids','--max']);
  for(let i=0;i<args.length;i++){if(['--write','--live'].includes(args[i])){const flag=args[i].slice(2);assert(!options[flag],'Repeated '+args[i]);options[flag]=true;continue;}assert(allowed.has(args[i])&&args[i+1]&&!args[i+1].startsWith('--')&&!options[args[i]],'Invalid deployment option: '+args[i]);options[args[i]]=args[++i];}
  assert(!options.write||command==='drain','Only drain accepts --write');
  const readGithub=githubPackTransport(),store=command==='inspect'&&!options.live?null:gitPackQueueStore({directory:path.join(ROOT,'runtime/dealer-pack-deploy-cache/queue.git')});let report;
  if(command==='status'){const {state}=await store.read();report={queueId:state.queueId,generation:state.generation,active:state.active,requests:state.order.map(id=>({id,slug:state.requests[id].request.slug,status:state.requests[id].status})),receiptCount:Object.values(state.receipts).reduce((sum,rows)=>sum+rows.length,0)};}
  else if(command==='drain'){
    assert(options.write&&options['--bundle-root']&&options['--owner'],'Drain needs --bundle-root, --owner and explicit --write');
    const selected=options['--request-ids']?json(options['--request-ids']):null,requestIds=selected?(Array.isArray(selected)?selected:selected.requests?.map(row=>row.id)):undefined;
    report=await drainPackDeployments({store,provider:cloudflarePackProvider({api:tokenCloudflareTransport()}),owner:options['--owner'],bundleRoot:options['--bundle-root'],requestIds,maximum:Number(options['--max']??400),write:true,readGithub});
  }else{
    assert(options['--slugs']&&options['--bundle-root'],'Inspection/enqueue need --slugs and --bundle-root');const queue=command==='enqueue'||options.live?(await store.read()).state:undefined;
    report=await inspectPackDeploymentBatch({slugs:json(options['--slugs']),bundleRoot:options['--bundle-root'],batch:options['--batch'],queue,provider:options.live?cloudflarePackProvider({api:tokenCloudflareTransport()}):undefined,readGithub});
    if(command==='enqueue'&&report.requests.length){const added=await enqueuePackDeployments(store,report.requests);report.enqueued=added.value;}
  }
  if(options['--report']){const file=path.resolve(options['--report']);assert(!file.split(path.sep).includes('bundle'),'Reports must stay outside sealed bundles');fs.mkdirSync(path.dirname(file),{recursive:true});fs.writeFileSync(file,JSON.stringify(report,null,2)+'\n');}
  console.log(JSON.stringify(report,null,2));if(report.success===false||report.status==='completed-with-failures')process.exitCode=1;return report;
}

if(isEntrypoint(import.meta.url))runPackDeploymentCli().catch(error=>{console.error(error.message);process.exitCode=1;});
