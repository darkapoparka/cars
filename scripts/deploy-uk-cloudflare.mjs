import fs from 'node:fs';
import path from 'node:path';
import { createHash } from 'node:crypto';
import { inflateRawSync } from 'node:zlib';
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import { ROOT, json, sha256, normalized, inside, git } from './lib/workflow.mjs';
import { MANIFEST_PATH, FAMILIES, selectDealers } from './build-uk-dealers.mjs';
import { UK_FAMILY_NODES, UK_NEXT_FAMILIES, safeArtifactPath, verifyArtifactDirectory,
  verifyInventoryBytes, assertCompiledConfig } from './lib/uk-cloudflare-artifacts.mjs';

export const UK_DEPLOY_ACCOUNT = 'cb0007f242077bd759331f096eb75531';
export const UK_DEPLOY_NODE = '26.10.0';
export const UK_DEPLOY_ROOT = path.join(ROOT,'runtime','uk-cloudflare-deployments');
export const UK_DELIVERY_ROOT = path.join(ROOT,'runtime','uk-cloudflare-delivery');
const SELF=fileURLToPath(import.meta.url), SHA=/^[a-f0-9]{64}$/, COMMIT=/^[a-f0-9]{40}$/;
const UUID=/^[a-f0-9]{8}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{12}$/i;
const KEYS=[...FAMILIES,'router'], encode=value=>JSON.stringify(value,null,2)+'\n';
const NEXT_CLI='runtime/uk-cloudflare-next-adapter-20261010/qualification/mobile/node_modules/wrangler/bin/wrangler.js';
const SVELTE_CLI='runtime/uk-cloudflare-svelte-adapter-20261010/qualification/auto-best/node_modules/wrangler/bin/wrangler.js';
const expectedWorker=(dealer,key)=>key==='router'?dealer.workerName:dealer.workerName+'-'+(key==='karento-best'?'signature':key);
const numberId=value=>/^[1-9][0-9]{0,14}$/.test(String(value));

function localPath(value,{mustExist=true,delivery=false}={}) {
  if (typeof value!=='string'||!path.isAbsolute(value)) throw Error('Use an absolute path below the UK deployment or delivery runtime.');
  for(const root of delivery?[UK_DEPLOY_ROOT,UK_DELIVERY_ROOT]:[UK_DEPLOY_ROOT]){
    const relative=path.relative(root,path.resolve(value));
    if(relative&&relative!=='..'&&!relative.startsWith('..'+path.sep)&&!path.isAbsolute(relative))return inside(root,relative,{mustExist});
  }
  throw Error('Deployment file is outside its permitted UK runtime namespace.');
}
function localSurface() {
  if (process.platform!=='win32'||process.version!=='v'+UK_DEPLOY_NODE||path.resolve(ROOT).toLowerCase()!=='l:\\codex\\cars') {
    throw Error('Run this explicit local deployment command with L:\\Toolchains\\Node\\26.10.0\\node.exe in L:\\CODEX\\cars.');
  }
}
function immutableJson(file,value) {
  fs.mkdirSync(path.dirname(file),{recursive:true});
  fs.writeFileSync(file,encode(value),{flag:'wx'});
}
export async function hashArchive(file) {
  const hash=createHash('sha256');let bytes=0;
  for await(const chunk of fs.createReadStream(file)){bytes+=chunk.length;hash.update(chunk);}
  return {bytes,sha256:hash.digest('hex')};
}

/** Read only small declared JSON receipts from a verified GitHub ZIP; never extract source. */
export function readZipReceipt(archive,name) {
  if (!safeArtifactPath(name)) throw Error('Unsafe ZIP receipt path.');
  const fd=fs.openSync(archive,'r');
  const read=(size,offset)=>{
    const out=Buffer.alloc(size);
    if(fs.readSync(fd,out,0,size,offset)!==size)throw Error('Truncated ZIP receipt archive.');
    return out;
  };
  try {
    const size=fs.fstatSync(fd).size;
    if(size<22||size>2*1024**3)throw Error('ZIP receipt archive size is unsupported.');
    const tail=read(Math.min(size,65557),Math.max(0,size-65557));
    let end=-1;
    for(let i=tail.length-22;i>=0;i--)if(tail.readUInt32LE(i)===0x06054b50&&i+22+tail.readUInt16LE(i+20)===tail.length){end=i;break;}
    if(end<0||tail.readUInt16LE(end+4)!==0||tail.readUInt16LE(end+6)!==0)throw Error('Split ZIP archives are not supported.');
    const count=tail.readUInt16LE(end+10);
    if(tail.readUInt16LE(end+8)!==count)throw Error('Split ZIP member counts differ.');
    const length=tail.readUInt32LE(end+12),offset=tail.readUInt32LE(end+16);
    if(count===65535||length===0xffffffff||offset===0xffffffff||length>32*1024**2||offset+length>size)throw Error('ZIP64 or oversized directory needs explicit review.');
    const directory=read(length,offset),entries=new Set();let cursor=0,chosen;
    for(let i=0;i<count;i++){
      if(cursor+46>directory.length||directory.readUInt32LE(cursor)!==0x02014b50)throw Error('Invalid ZIP directory.');
      const flags=directory.readUInt16LE(cursor+8),method=directory.readUInt16LE(cursor+10);
      const compressed=directory.readUInt32LE(cursor+20),bytes=directory.readUInt32LE(cursor+24);
      const n=directory.readUInt16LE(cursor+28),extra=directory.readUInt16LE(cursor+30),comment=directory.readUInt16LE(cursor+32);
      const raw=directory.subarray(cursor+46,cursor+46+n),entry=raw.toString('utf8');
      if(cursor+46+n+extra+comment>directory.length||!Buffer.from(entry).equals(raw)||entries.has(entry)||
        !safeArtifactPath(entry.endsWith('/')?entry.slice(0,-1):entry))throw Error('Unsafe or duplicate ZIP member.');
      entries.add(entry);
      if(entry===name)chosen={flags,method,compressed,bytes,offset:directory.readUInt32LE(cursor+42)};
      cursor+=46+n+extra+comment;
    }
    if(cursor!==directory.length||!chosen||chosen.flags&1||![0,8].includes(chosen.method)||chosen.bytes>32*1024**2||chosen.compressed>32*1024**2)throw Error('Missing, encrypted or oversized ZIP receipt.');
    const header=read(30,chosen.offset);
    if(header.readUInt32LE(0)!==0x04034b50||header.readUInt16LE(6)!==chosen.flags||header.readUInt16LE(8)!==chosen.method||
      !read(header.readUInt16LE(26),chosen.offset+30).equals(Buffer.from(name)))throw Error('Invalid ZIP local receipt identity.');
    const start=chosen.offset+30+header.readUInt16LE(26)+header.readUInt16LE(28);
    if(start+chosen.compressed>offset)throw Error('ZIP receipt crosses its directory.');
    const compressed=read(chosen.compressed,start);
    const bytes=chosen.method===0?compressed:inflateRawSync(compressed,{maxOutputLength:32*1024**2});
    if(bytes.length!==chosen.bytes)throw Error('ZIP receipt length differs.');
    return bytes;
  } finally {fs.closeSync(fd);}
}

export function validateRemoteBuild({run,artifact,summaryArtifact},input) {
  if(!numberId(input.runId)||!numberId(input.attempt)||!numberId(input.artifactId)||!numberId(input.summaryArtifactId)||
    !KEYS.includes(input.key)||run.id!==Number(input.runId)||run.event!=='workflow_dispatch'||
    run.head_branch!=='main'||run.run_attempt!==Number(input.attempt)||run.path!=='.github/workflows/build-uk-cloudflare.yml'||
    run.repository?.full_name!=='darkapoparka/cars'||run.head_repository?.full_name!=='darkapoparka/cars'||
    !COMMIT.test(run.head_sha??'')||run.status!=='completed'||run.conclusion!=='success')throw Error('Deployment needs a completed successful manual Cars main build.');
  const suffix=input.dealer+'-'+input.runId+'-'+input.attempt;
  for(const [item,id,name]of [
    [artifact,input.artifactId,'uk-cloudflare-compiled-'+input.dealer+'-'+input.key+'-'+input.runId+'-'+input.attempt],
    [summaryArtifact,input.summaryArtifactId,'uk-cloudflare-review-'+suffix]
  ]){
    if(item.id!==Number(id)||item.name!==name||item.expired||item.workflow_run?.id!==run.id||
      item.workflow_run?.head_sha!==run.head_sha||!/^sha256:[a-f0-9]{64}$/.test(item.digest??'')||
      !Number.isSafeInteger(item.size_in_bytes)||item.size_in_bytes<=0||item.size_in_bytes>2*1024**3)throw Error('GitHub artifact identity or archive hash differs from the exact build.');
  }
}

export function validateBuildHandoff({deploy,summary,inventory,meta,provider,config},dealer,input,headSha) {
  const key=input.key,worker=expectedWorker(dealer,key);
  if(deploy.schemaVersion!==1||deploy.dealer!==dealer.slug||deploy.key!==key||deploy.repository!==dealer.repository||
    deploy.provider!=='cloudflare'||deploy.sourceCommit!==headSha||String(deploy.runId)!==String(input.runId)||
    String(deploy.attempt)!==String(input.attempt)||deploy.publicOrigin!==dealer.publicOrigin||deploy.workerName!==worker||
    deploy.node!=='v'+UK_FAMILY_NODES[key]||deploy.compiled!==true||deploy.dryRun!==true||deploy.sourcePayloadUnchanged!==true||
    deploy.deployment?.performed!==false||deploy.deployment?.credentialsIncluded!==false||deploy.deployment?.buildRequired!==false||
    ![deploy.packageTree,deploy.transportCommit].every(value=>COMMIT.test(value??''))||
    ![deploy.packageDigest,deploy.payloadDigest,deploy.packageSha256,deploy.compiledDigest].every(value=>SHA.test(value??'')))throw Error('Compiled deployment contract is incomplete or differs from this dealer.');
  if(summary.schemaVersion!==1||summary.dealer!==dealer.slug||summary.provider!=='cloudflare'||summary.publicOrigin!==dealer.publicOrigin||
    summary.sourceCommit!==headSha||String(summary.runId)!==String(input.runId)||String(summary.attempt)!==String(input.attempt)||
    summary.allSixFamiliesBuilt!==true||summary.routerDryRun!==true||summary.status!=='compiled-awaiting-local-deployment-review'||
    summary.packageTree!==deploy.packageTree||summary.packageDigest!==deploy.packageDigest||summary.payloadDigest!==deploy.payloadDigest||
    !Array.isArray(summary.targets)||summary.targets.length!==7||new Set(summary.targets.map(row=>row.key)).size!==7)throw Error('The build summary does not prove all seven targets from one sealed package.');
  for(const target of summary.targets){
    if(!KEYS.includes(target.key)||target.workerName!==expectedWorker(dealer,target.key)||target.packageTree!==summary.packageTree||
      target.packageDigest!==summary.packageDigest||target.payloadDigest!==summary.payloadDigest||!SHA.test(target.compiledDigest??''))throw Error('Build summary target identity differs.');
  }
  const selected=summary.targets.find(row=>row.key===key);
  const expectedArtifact='uk-cloudflare-compiled-'+dealer.slug+'-'+key+'-'+input.runId+'-'+input.attempt;
  if(selected.compiledDigest!==deploy.compiledDigest||selected.artifactName!==expectedArtifact||deploy.artifactName!==expectedArtifact||
    inventory.schemaVersion!==1||inventory.kind!=='compiled-worker'||inventory.status!=='passed'||inventory.dealer!==dealer.slug||inventory.key!==key||
    !Array.isArray(deploy.compiledFiles)||deploy.compiledDigest!==sha256(JSON.stringify(deploy.compiledFiles))||
    JSON.stringify(inventory.files.filter(row=>row.path.startsWith('compiled/')))!==JSON.stringify(deploy.compiledFiles)||
    meta.sourceCommit!==headSha||meta.payloadDigest!==deploy.payloadDigest||!Array.isArray(meta.payload)||
    meta.payloadDigest!==sha256(JSON.stringify(meta.payload))||provider.dealer!==dealer.slug||provider.worker!==dealer.workerName||
    provider.provider!=='cloudflare'||provider.acceptance?.dependencyLocksFrozen!==true)throw Error('Compiled files, payload receipt or provider identity differs.');
  const target={workerName:worker,config:deploy.configPath,main:deploy.mainPath,assets:deploy.assetPath};
  if(![target.config,target.main,target.assets,deploy.dryRunBundlePath].every(name=>safeArtifactPath(name)&&name.startsWith('compiled/')))throw Error('Compiled deployment paths are unsafe.');
  assertCompiledConfig(config,target,{router:key==='router'});
  if(config.build?.command||config.route||config.routes?.length||config.env&&Object.keys(config.env).length||
    config.containers&&Object.keys(config.containers).length||config.durable_objects?.bindings?.length||
    config.account_id&&config.account_id!==UK_DEPLOY_ACCOUNT)throw Error('Unexpected build, route, environment or provisioned resource in the sealed Worker.');
  const wantedServices=key==='router'?provider.configuration?.services??[]:[];
  if(JSON.stringify(config.services??[])!==JSON.stringify(wantedServices)||key==='router'&&
    JSON.stringify(wantedServices.map(row=>row.service).sort())!==JSON.stringify(FAMILIES.map(family=>expectedWorker(dealer,family)).sort()))throw Error('Router bindings differ from the sealed six services.');
  const uploadMain=UK_NEXT_FAMILIES.has(key)||key==='router'?deploy.mainPath:deploy.dryRunBundlePath+'/index.js';
  if(!deploy.compiledFiles.some(row=>row.path===uploadMain)||!deploy.compiledFiles.some(row=>row.path===deploy.configPath)||
    !deploy.compiledFiles.some(row=>row.path.startsWith(deploy.assetPath+'/')))throw Error('Compiled entry, configuration or assets are missing.');
  return {key,workerName:worker,configPath:deploy.configPath,mainPath:deploy.mainPath,uploadMainPath:uploadMain,
    assetPath:deploy.assetPath,workersDev:key==='router',sourceCommit:headSha,packageTree:deploy.packageTree,
    packageDigest:deploy.packageDigest,payloadDigest:deploy.payloadDigest,compiledDigest:deploy.compiledDigest};
}

async function githubMetadata(id,kind) {
  const headers={Accept:'application/vnd.github+json','X-GitHub-Api-Version':'2026-03-10'};
  if(process.env.GH_TOKEN)headers.Authorization='Bearer '+process.env.GH_TOKEN;
  const response=await fetch('https://api.github.com/repos/darkapoparka/cars/actions/'+kind+'/'+id,{headers,signal:AbortSignal.timeout(30000)});
  if(!response.ok)throw Error('Read-only GitHub build verification failed: HTTP '+response.status);
  return response.json();
}
function uploader(key) {
  const svelte=key!=='router'&&!UK_NEXT_FAMILIES.has(key),version=svelte?'4.118.0':'4.149.0';
  const cli=path.join(ROOT,svelte?SVELTE_CLI:NEXT_CLI),packageFile=path.join(path.dirname(cli),'..','package.json');
  const pkg=json(packageFile),entryFile=path.join(path.dirname(cli),'..','wrangler-dist','cli.js');
  if(pkg.name!=='wrangler'||pkg.version!==version||!fs.statSync(cli).isFile())throw Error('Existing local Wrangler differs from the qualified uploader.');
  return {file:cli,entryFile,version,sha256:sha256(fs.readFileSync(cli)),entrySha256:sha256(fs.readFileSync(entryFile)),
    packageSha256:sha256(fs.readFileSync(packageFile)),node:process.version};
}

export function validatePrivatePublication({published,exported,publishMeta,remoteHead,commitTree,commitParent},dealer,deploy) {
  if(published.schemaVersion!==1||published.slug!==dealer.slug||published.repository!==dealer.repository||
    published.provider!=='cloudflare'||published.branch!=='main'||published.repositoryVisibility!=='private'||
    !numberId(published.repositoryId)||published.pushed!==true||!COMMIT.test(published.commit??'')||
    published.commit!==published.verifiedRemoteHead||published.commit!==remoteHead||
    !Number.isFinite(Date.parse(published.verifiedAt))||!Number.isFinite(Date.parse(published.visibilityVerifiedAt))||
    published.sourceCommit!==deploy.sourceCommit||published.packageTree!==deploy.packageTree||
    published.candidateDigest!==deploy.packageDigest)throw Error('The exact compiled package needs a verified private main publication.');
  if(exported.schemaVersion!==1||exported.slug!==dealer.slug||exported.repository!==dealer.repository||
    exported.provider!=='cloudflare'||exported.branch!=='main'||exported.defaultBranch!=='main'||
    exported.commit!==published.commit||exported.sourceCommit!==deploy.sourceCommit||
    exported.packageTree!==deploy.packageTree||exported.candidateDigest!==deploy.packageDigest||
    !COMMIT.test(commitTree??'')||exported.tree!==commitTree||!COMMIT.test(commitParent??'')||exported.parent!==commitParent||
    publishMeta.schemaVersion!==1||publishMeta.repository!==dealer.repository||publishMeta.sourceCommit!==deploy.sourceCommit||
    publishMeta.candidateDigest!==deploy.packageDigest||!Array.isArray(publishMeta.files)||!publishMeta.files.length) {
    throw Error('Private publication and actual exported commit differ from the sealed package.');
  }
  return {repository:dealer.repository,repositoryVisibility:'private',repositoryId:Number(published.repositoryId),
    publishedCommit:published.commit,sourceCommit:deploy.sourceCommit,packageTree:deploy.packageTree,candidateDigest:deploy.packageDigest};
}

function readPublishedPackage(value,dealer,deploy) {
  const base=inside(ROOT,'runtime/dealer-exports/'+dealer.slug,{mustExist:true});
  if(typeof value!=='string'||!path.isAbsolute(value))throw Error('Use the retained published.json from the private export bridge.');
  const relative=path.relative(base,path.resolve(value)),parts=relative.split(path.sep);
  if(parts.length!==2||!/^proposal-[a-zA-Z0-9_-]+$/.test(parts[0])||parts[1]!=='published.json')throw Error('Unexpected private publication receipt path.');
  const file=inside(base,relative,{mustExist:true}),bytes=fs.readFileSync(file),published=JSON.parse(bytes);
  const exportFile=inside(base,parts[0]+'/export.json',{mustExist:true});
  if(typeof published.exportReceipt!=='string'||path.resolve(published.exportReceipt).toLowerCase()!==path.resolve(exportFile).toLowerCase()||
    !COMMIT.test(published.commit??''))throw Error('Private publication is detached from its export receipt.');
  const exportBytes=fs.readFileSync(exportFile),exported=JSON.parse(exportBytes);
  const remote=git(ROOT,['ls-remote','--exit-code','https://github.com/'+dealer.repository+'.git','refs/heads/main']);
  if(!new RegExp('^[a-f0-9]{40}\\s+refs/heads/main$').test(remote))throw Error('Private publishing main head was not returned exactly.');
  const metadataBytes=git(ROOT,['show',published.commit+':.cars-publish.json'],{encoding:null});
  const info=git(ROOT,['show','-s','--format=%T %P',published.commit]).split(' ');
  if(info.length!==2)throw Error('Private export must retain its single reviewed parent.');
  const identity=validatePrivatePublication({published,exported,publishMeta:JSON.parse(metadataBytes),
    remoteHead:remote.split(/\s+/)[0],commitTree:info[0],commitParent:info[1]},dealer,deploy);
  return {...identity,publishedReceipt:file,publishedReceiptSha256:sha256(bytes),exportReceiptSha256:sha256(exportBytes),
    publishMetadataSha256:sha256(metadataBytes)};
}

async function inspectInput(inputFile,remote) {
  localSurface();inputFile=localPath(inputFile,{delivery:true});
  const inputBytes=fs.readFileSync(inputFile),input=JSON.parse(inputBytes),batch=json(path.join(ROOT,MANIFEST_PATH));
  if(input.schemaVersion!==1||input.dealer==='all')throw Error('Inspect one exact UK dealer target.');
  const dealer=selectDealers(batch,input.dealer)[0];
  if(dealer.slug!==input.dealer||!KEYS.includes(input.key))throw Error('Unknown dealer or target.');
  const archive=localPath(input.archive,{delivery:true}),summaryArchive=localPath(input.summaryArchive,{delivery:true}),directory=localPath(input.directory,{delivery:true});
  const job=path.join(UK_DEPLOY_ROOT,dealer.slug,String(input.runId)+'-'+String(input.attempt));
  const reportDirectory=path.join(job,'receipts',input.key);
  if(!remote){
    const [run,artifact,summaryArtifact]=await Promise.all([
      githubMetadata(input.runId,'runs'),githubMetadata(input.artifactId,'artifacts'),githubMetadata(input.summaryArtifactId,'artifacts')]);
    remote={run,artifact,summaryArtifact};
  }
  validateRemoteBuild(remote,input);
  const [archiveHash,summaryHash]=await Promise.all([hashArchive(archive),hashArchive(summaryArchive)]);
  for(const [actual,expected]of [[archiveHash,remote.artifact],[summaryHash,remote.summaryArtifact]]){
    if(actual.bytes!==expected.size_in_bytes||'sha256:'+actual.sha256!==expected.digest)throw Error('Downloaded GitHub archive changed.');
  }
  const inventory=verifyArtifactDirectory(directory);
  const originalInventory=readZipReceipt(archive,'artifact-manifest.json');
  if(!originalInventory.equals(fs.readFileSync(path.join(directory,'artifact-manifest.json'))))throw Error('Extracted inventory is not the GitHub archive inventory.');
  const readReceipt=name=>{
    const bytes=readZipReceipt(archive,name);
    verifyInventoryBytes(inventory,name,bytes);
    if(!bytes.equals(fs.readFileSync(inside(directory,name,{mustExist:true}))))throw Error('Extracted receipt differs from its archive.');
    return JSON.parse(bytes);
  };
  const deploy=readReceipt('deploy.json'),meta=readReceipt('receipts/.cars-package.json'),provider=readReceipt('receipts/.cars-cloudflare.json');
  if(sha256(fs.readFileSync(path.join(directory,'receipts/.cars-package.json')))!==deploy.packageSha256)throw Error('Sealed package receipt bytes differ.');
  const providerPayload=meta.payload.find(row=>row.path==='.cars-cloudflare.json');
  if(providerPayload?.sha256!==sha256(normalized(fs.readFileSync(path.join(directory,'receipts/.cars-cloudflare.json')))))throw Error('Provider receipt is outside the package seal.');
  const summary=JSON.parse(readZipReceipt(summaryArchive,'build-summary.json'));
  const config=json(inside(directory,deploy.configPath,{mustExist:true}));
  const plan=validateBuildHandoff({deploy,summary,inventory,meta,provider,config},dealer,input,remote.run.head_sha);
  const tool=uploader(input.key),publication=readPublishedPackage(input.publishedReceipt,dealer,deploy);
  const identity={inputSha256:sha256(inputBytes),archiveSha256:archiveHash.sha256,summaryArchiveSha256:summaryHash.sha256,
    artifactDigest:inventory.digest,deploySha256:sha256(fs.readFileSync(path.join(directory,'deploy.json'))),
    configSha256:sha256(fs.readFileSync(path.join(directory,plan.configPath))),publication,tool,...plan};
  return {inputFile,input,dealer,remote,identity,fingerprint:sha256(JSON.stringify(identity)),reportDirectory,summary,directory};
}

export function parseWranglerDeploymentOutput(text,workerName,version) {
  const rows=text.split(/\r?\n/).filter(Boolean).map(line=>JSON.parse(line));
  const sessions=rows.filter(row=>row.type==='wrangler-session'),deployments=rows.filter(row=>row.type==='deploy');
  if(sessions.length!==1||sessions[0].wrangler_version!==version||deployments.length!==1||rows.some(row=>row.type==='command-failed'))throw Error('Wrangler did not return one successful pinned deployment session.');
  const result=deployments[0];
  if(result.version!==1||result.worker_name!==workerName||!UUID.test(result.version_id??'')||result.worker_name_overridden===true||result.wrangler_environment)throw Error('Wrangler deployment response lacks the exact Worker version.');
  return result;
}
export function activeDeployment(deployments,versionId) {
  if(!Array.isArray(deployments)||!deployments.length)throw Error('Cloudflare returned no active deployment.');
  const latest=[...deployments].sort((a,b)=>Date.parse(b.created_on)-Date.parse(a.created_on))[0];
  if(!UUID.test(latest.id??'')||!Number.isFinite(Date.parse(latest.created_on))||latest.versions?.length!==1||
    latest.versions[0].version_id!==versionId||latest.versions[0].percentage!==100)throw Error('Latest Cloudflare deployment does not serve this exact version at 100%.');
  return {id:latest.id,createdOn:latest.created_on,versionTraffic:latest.versions,checkedAt:new Date().toISOString()};
}
export function assertRouterPrerequisites(receipts,summary,dealer,publication) {
  if(!COMMIT.test(publication?.publishedCommit??'')||!SHA.test(publication?.publishedReceiptSha256??''))throw Error('Router requires the exact private publication receipt.');
  if(receipts.length!==6||new Set(receipts.map(row=>row.key)).size!==6)throw Error('Router requires six confirmed family deployments.');
  for(const row of receipts){
    const expected=summary.targets.find(target=>target.key===row.key);
    if(!FAMILIES.includes(row.key)||row.schemaVersion!==1||row.type!=='cars-uk-cloudflare-deployment'||row.status!=='deployed'||
      row.dealer!==dealer.slug||row.repository!==dealer.repository||row.publishedCommit!==publication?.publishedCommit||
      row.privateExport?.publishedReceiptSha256!==publication?.publishedReceiptSha256||row.accountId!==UK_DEPLOY_ACCOUNT||row.workerName!==expectedWorker(dealer,row.key)||row.workersDev!==false||
      row.sourceCommit!==summary.sourceCommit||row.packageTree!==summary.packageTree||row.packageDigest!==summary.packageDigest||
      row.payloadDigest!==summary.payloadDigest||row.compiledDigest!==expected?.compiledDigest||String(row.runId)!==String(summary.runId)||
      String(row.attempt)!==String(summary.attempt)||!UUID.test(row.versionId??'')||row.live?.id!==row.deploymentId||
      row.live?.versionTraffic?.length!==1||row.live.versionTraffic[0].version_id!==row.versionId||row.live.versionTraffic[0].percentage!==100)throw Error('Router family deployment receipt is missing or belongs to different source.');
  }
}

function runWrangler(context,label,args,{structured=false}={}) {
  const folder=context.reportDirectory,file=path.join(folder,label+'.log'),output=path.join(folder,label+'.jsonl');
  if(fs.existsSync(file)||fs.existsSync(output))throw Error('An earlier deployment command requires receipt review before retry.');
  const env={...process.env};
  for(const name of Object.keys(env)){
    if(['gh_token','github_token','cloudflare_api_token','cf_api_token','cloudflare_api_key','cf_api_key','cloudflare_email','cf_email',
      'wrangler_output_file_path','wrangler_output_file_directory','wrangler_log','wrangler_log_path','wrangler_log_sanitize',
      'wrangler_cache_dir','cloudflare_account_id','cf_account_id'].includes(name.toLowerCase()))delete env[name];
  }
  Object.assign(env,{CLOUDFLARE_ACCOUNT_ID:UK_DEPLOY_ACCOUNT,WRANGLER_SEND_METRICS:'false',WRANGLER_LOG:'info',
    WRANGLER_OUTPUT_FILE_PATH:output,WRANGLER_CACHE_DIR:path.join(folder,'wrangler-cache'),
    WRANGLER_LOG_PATH:path.join(folder,'wrangler-debug'),WRANGLER_LOG_SANITIZE:'true',NO_COLOR:'1'});
  console.log(JSON.stringify({phase:label,dealer:context.dealer.slug,key:context.input.key,workerName:context.identity.workerName}));
  const result=spawnSync(process.execPath,['--no-warnings',context.identity.tool.entryFile,...args],{
    cwd:folder,env,encoding:'utf8',windowsHide:true,timeout:30*60*1000,maxBuffer:32*1024**2});
  fs.writeFileSync(file,(result.stdout??'')+'\n'+(result.stderr??''),{flag:'wx'});
  if(result.error||result.status!==0)throw Error('Wrangler '+label+' failed; inspect '+file+' and reconcile any partial upload. '+(result.error?.message??result.status));
  return structured?fs.readFileSync(output,'utf8'):result.stdout;
}

export async function inspectDeployment(inputFile) {
  const context=await inspectInput(inputFile),file=path.join(context.reportDirectory,'inspection.json');
  const report={schemaVersion:1,type:'cars-uk-cloudflare-inspection',verifiedAt:new Date().toISOString(),
    inputFile:context.inputFile,input:context.input,remote:context.remote,identity:context.identity,
    fingerprint:context.fingerprint,accountId:UK_DEPLOY_ACCOUNT,publishingPerformed:false};
  if(fs.existsSync(file)){
    if(json(file).fingerprint!==report.fingerprint)throw Error('A prior inspection belongs to different immutable input.');
  }else immutableJson(file,report);
  return {inspection:file,dealer:context.dealer.slug,key:context.input.key,workerName:context.identity.workerName,
    artifactId:context.input.artifactId,compiledDigest:context.identity.compiledDigest,publishingPerformed:false};
}

export async function deployInspected(inspectionFile) {
  localSurface();inspectionFile=localPath(inspectionFile);
  const inspectionBytes=fs.readFileSync(inspectionFile),inspection=JSON.parse(inspectionBytes);
  if(inspection.schemaVersion!==1||inspection.type!=='cars-uk-cloudflare-inspection'||inspection.accountId!==UK_DEPLOY_ACCOUNT)throw Error('Use the completed exact local artifact inspection.');
  const context=await inspectInput(inspection.inputFile,inspection.remote);
  if(context.fingerprint!==inspection.fingerprint||path.resolve(inspectionFile)!==path.join(context.reportDirectory,'inspection.json'))throw Error('Artifact or uploader changed after inspection.');
  const {input,dealer,identity,reportDirectory}=context,receiptFile=path.join(reportDirectory,'deployment.json');
  if(fs.existsSync(receiptFile))throw Error('This target already has an actual deployment receipt; do not upload it again.');
  const prerequisites=input.key==='router'?FAMILIES.map(key=>json(path.join(path.dirname(reportDirectory),key,'deployment.json'))):[];
  if(input.key==='router')assertRouterPrerequisites(prerequisites,context.summary,dealer,identity.publication);
  const lock=path.join(UK_DEPLOY_ROOT,'deployment.lock');
  const fd=fs.openSync(lock,'wx');fs.writeSync(fd,encode({pid:process.pid,dealer:dealer.slug,key:input.key}));fs.closeSync(fd);
  const startedAt=new Date().toISOString(),base={schemaVersion:1,type:'cars-uk-cloudflare-deployment',
    dealer:dealer.slug,key:input.key,repository:dealer.repository,publishedCommit:identity.publication.publishedCommit,
    privateExport:identity.publication,provider:'cloudflare',accountId:UK_DEPLOY_ACCOUNT,publicOrigin:dealer.publicOrigin,
    workerName:identity.workerName,sourceCommit:identity.sourceCommit,packageTree:identity.packageTree,
    packageDigest:identity.packageDigest,payloadDigest:identity.payloadDigest,compiledDigest:identity.compiledDigest,
    artifactId:Number(input.artifactId),artifactSha256:identity.archiveSha256,runId:String(input.runId),attempt:String(input.attempt),
    wranglerVersion:identity.tool.version,nodeVersion:process.version,inspectionSha256:sha256(inspectionBytes),
    workersDev:identity.workersDev,startedAt,hostedVerified:false,freeRuntimeQualified:false};
  try{
    immutableJson(path.join(reportDirectory,'started.json'),{...base,status:'started'});
    const config=inside(context.directory,identity.configPath,{mustExist:true});
    const main=inside(context.directory,identity.uploadMainPath,{mustExist:true});
    if(prerequisites.length){
      const current=[];
      for(const receipt of prerequisites){
        const rows=JSON.parse(runWrangler(context,'prerequisite-'+receipt.key,['deployments','list','--name',receipt.workerName,'--config',config,'--json']));
        current.push({key:receipt.key,workerName:receipt.workerName,versionId:receipt.versionId,live:activeDeployment(rows,receipt.versionId)});
      }
      immutableJson(path.join(reportDirectory,'router-prerequisites.json'),{schemaVersion:1,sourceCommit:identity.sourceCommit,targets:current});
    }
    const output=runWrangler(context,'deploy',['deploy',main,'--config',config,'--no-bundle',
      '--outdir',path.join(reportDirectory,'wrangler-output')],{structured:true});
    const deployed=parseWranglerDeploymentOutput(output,identity.workerName,identity.tool.version);
    const actual=JSON.parse(runWrangler(context,'deployment-list',['deployments','list','--name',identity.workerName,'--config',config,'--json']));
    const live=activeDeployment(actual,deployed.version_id);
    verifyArtifactDirectory(context.directory);
    const receipt={...base,status:'deployed',versionId:deployed.version_id,deploymentId:live.id,live,
      targets:deployed.targets??[],bundleSize:deployed.bundle_size??null,finishedAt:new Date().toISOString()};
    immutableJson(receiptFile,receipt);
    return {receipt:receiptFile,dealer:dealer.slug,key:input.key,workerName:receipt.workerName,
      versionId:receipt.versionId,deploymentId:receipt.deploymentId,status:'deployed',publicOrigin:dealer.publicOrigin};
  }catch(error){
    const failed=path.join(reportDirectory,'needs-reconciliation.json');
    if(!fs.existsSync(failed))immutableJson(failed,{...base,status:'needs-reconciliation',error:error.message,finishedAt:new Date().toISOString()});
    throw error;
  }finally{fs.unlinkSync(lock);}
}

if(process.argv[1]&&path.resolve(process.argv[1])===SELF){
  try{
    const [command,file]=process.argv.slice(2);
    if(process.argv.length!==4||!['inspect','deploy'].includes(command))throw Error('Usage: deploy-uk-cloudflare.mjs inspect INPUT_JSON | deploy INSPECTION_JSON. Download/extract one compiled target below the UK deployment or delivery runtime first.');
    console.log(JSON.stringify(command==='inspect'?await inspectDeployment(file):await deployInspected(file),null,2));
  }catch(error){console.error(error.message);process.exitCode=1;}
}
