import fs from 'node:fs';
import path from 'node:path';
import os from 'node:os';
import { spawnSync } from 'node:child_process';
import { createRequire } from 'node:module';
import { fileURLToPath } from 'node:url';
import { gzipSync } from 'node:zlib';
import { ROOT, json, writeJson, inside, git, sha256, filesAt } from './lib/workflow.mjs';
import { MANIFEST_PATH, FAMILIES, selectDealers, assertPinnedReleases, assertManualCi } from './build-uk-dealers.mjs';
import { assertCarsOwnedDealer } from './lib/dealer-source.mjs';
import { committedDealerInputs, packageDealer } from './package-dealer.mjs';
import { verifyPackageTree } from './export-dealer.mjs';
import { resolveCloudflareNpmCli } from './publishing/cloudflare-next.mjs';
import { inspectCloudflareSvelteOutput, CLOUDFLARE_SVELTE_OUTPUT } from './publishing/cloudflare-svelte.mjs';
import { UK_FAMILY_NODES, UK_NEXT_FAMILIES, parseQualificationRuns, validateQualification,
  validateFileInventory, verifyInventoryBytes, artifactInventory, verifyArtifactDirectory,
  copyBuildArtifact, readZipFile, assertPackagePayload, downloadGitHubArchive, assertCompiledConfig } from './lib/uk-cloudflare-artifacts.mjs';

const SELF = fileURLToPath(import.meta.url), GIB = 1024 ** 3;
const META_FILES = ['.cars-package.json','.cars-six-build.json','.cars-cloudflare.json',
  '.cars-cloudflare-next.json','.cars-cloudflare-svelte.json','.cars-dealer-share.json','dealer.json'];
const slugOf = selection => {
  if (selection === 'all') throw Error('Compile one dealer per dispatch; artifacts are reviewed and deployed separately.');
  return selectDealers(json(path.join(ROOT,MANIFEST_PATH)),selection)[0];
};
const batchOf = () => json(path.join(ROOT,MANIFEST_PATH));
const areaOf = slug => inside(ROOT,'runtime/uk-cloudflare-builds/' + process.env.GITHUB_RUN_ID + '-' + process.env.GITHUB_RUN_ATTEMPT + '/' + slug);
const packageOf = (slug,key='prepare') => inside(ROOT,'runtime/dealer-packages/uk-' + process.env.GITHUB_RUN_ID + '-' + process.env.GITHUB_RUN_ATTEMPT + '-' + key + '/' + slug);
const preparedArtifactOf = slug => inside(ROOT,'runtime/uk-cloudflare-input/' + slug);
const noHostedApproval = () => ({hosted:false,freeRuntimeQualified:false,dealerQa:false,readyToPublish:false});
const encode = value => Buffer.from(JSON.stringify(value,null,2)+'\n');

export function buildMatrix(selection) {
  slugOf(selection);
  return {include:Object.entries(UK_FAMILY_NODES).map(([key,node])=>({key,node}))};
}

function assertExactCi() {
  assertManualCi();
  if (!/^[a-f0-9]{40}$/.test(process.env.GITHUB_SHA ?? '') ||
      !/^[1-9][0-9]*$/.test(process.env.GITHUB_RUN_ID ?? '') || !/^[1-9][0-9]*$/.test(process.env.GITHUB_RUN_ATTEMPT ?? '') ||
      fs.realpathSync(process.env.GITHUB_WORKSPACE) !== fs.realpathSync(ROOT) ||
      git(ROOT,['rev-parse','HEAD']) !== process.env.GITHUB_SHA ||
      git(ROOT,['remote','get-url','origin']).replace(/\.git$/,'') !== 'https://github.com/darkapoparka/cars') {
    throw Error('Build requires the exact manually dispatched Cars main checkout.');
  }
}

function sourceIdentity(dealer) {
  const batch = batchOf(); assertPinnedReleases(batch,json(path.join(ROOT,'templates.lock.json')));
  const source = assertCarsOwnedDealer(ROOT,dealer.slug), manifest = json(inside(source,'dealer.json',{mustExist:true}));
  const creation = json(inside(source,'.client/uk-source-creation.json',{mustExist:true}));
  if (manifest.slug !== dealer.slug || manifest.repository !== dealer.repository || manifest.packaging?.version !== '5' ||
      manifest.cloudflare?.workerPrefix !== dealer.workerName || manifest.shareIdentity?.publicOrigin !== dealer.publicOrigin ||
      creation.dealer !== dealer.slug || creation.sourceMaterialized !== true ||
      creation.personalizationApplied !== true || creation.sourceSealsVerified !== true ||
      JSON.stringify(creation.sourceReleases) !== JSON.stringify(batch.sourceReleases) ||
      FAMILIES.some(key=>manifest.templateRevisions?.[key] !== batch.sourceReleases[key].revision)) {
    throw Error('Canonical dealer needs a committed, personalized, six-family source receipt and exact Cloudflare identity.');
  }
  return {source,manifest,batch,creation};
}

function diskBudget(directory,requiredFreeBytes,label) {
  const stat = fs.statfsSync(directory), freeBytes = Number(stat.bavail) * Number(stat.bsize);
  const budget = {label,requiredFreeBytes,freeBytes,memoryBytes:os.totalmem(),ready:freeBytes>=requiredFreeBytes};
  if (!budget.ready) throw Error('Insufficient measured runner space: ' + JSON.stringify(budget));
  return budget;
}

function treeBytes(prefix,commit=process.env.GITHUB_SHA) {
  return git(ROOT,['ls-tree','-r','-l','-z',commit,...(prefix?['--',prefix]:[])],{encoding:null}).toString('utf8').split('\0').filter(Boolean)
    .reduce((sum,line)=>sum+Number(line.slice(0,line.indexOf('\t')).trim().split(/\s+/)[3]),0);
}

function stage(area,name,program,args,cwd=ROOT,environment={}) {
  const reports = path.join(area,'receipts'); fs.mkdirSync(reports,{recursive:true});
  const logfile = path.join(reports,name+'.log'), fd = fs.openSync(logfile,'wx'), started = Date.now();
  console.log('UK Cloudflare build: ' + name);
  let result;
  try {result=spawnSync(program,args,{cwd,env:{...process.env,CI:'true',WRANGLER_SEND_METRICS:'false',
    NEXT_TELEMETRY_DISABLED:'1',...environment},stdio:['ignore',fd,fd],timeout:45*60*1000});}
  finally {fs.closeSync(fd);}
  const record = {phase:name,status:!result.error&&result.status===0?'passed':'failed',milliseconds:Date.now()-started,log:name+'.log'};
  const stepsFile = path.join(reports,'steps.json'), steps = fs.existsSync(stepsFile)?json(stepsFile):[];
  steps.push(record); writeJson(stepsFile,steps);
  if (record.status !== 'passed') {
    const text=fs.readFileSync(logfile);console.error(text.subarray(Math.max(0,text.length-22000)).toString('utf8'));
    throw Error('UK Cloudflare phase failed: ' + name + ' (' + (result.error?.message??result.status) + ')');
  }
  return record;
}

async function githubJson(endpoint) {
  const token=process.env.GH_TOKEN;
  if (!token) throw Error('This CI step needs its explicitly supplied repository Actions-read token.');
  const response=await fetch('https://api.github.com/repos/darkapoparka/cars/'+endpoint,{
    headers:{Authorization:'Bearer '+token,Accept:'application/vnd.github+json','X-GitHub-Api-Version':'2026-03-10'},
    signal:AbortSignal.timeout(30000)
  });
  if (!response.ok) throw Error('Read-only GitHub Actions request failed: HTTP '+response.status);
  return response.json();
}

async function qualifiedLocks(area,batch,runIds) {
  const candidates=[];
  for (const id of runIds) {
    const run=await githubJson('actions/runs/'+id);
    const inventory=await githubJson('actions/runs/'+id+'/artifacts?per_page=100');
    if (inventory.total_count>100) throw Error('Qualification artifact list needs explicit pagination review.');
    for (const artifact of inventory.artifacts??[]) {
      const key=FAMILIES.find(key=>artifact.name.startsWith('cloudflare-qualification-'+key+'-'+id+'-'));
      if (key && !artifact.expired) candidates.push({key,run,artifact});
    }
  }
  candidates.sort((a,b)=>b.run.id-a.run.id||b.artifact.id-a.artifact.id);
  if (candidates.reduce((sum,item)=>sum+item.artifact.size_in_bytes,0)>4*GIB) throw Error('Qualification archive download budget exceeds 4 GiB.');
  const archives=path.join(area,'qualification-archives');fs.mkdirSync(archives);
  const selected={}, rejected=[], locks={svelte:{},next:[]};
  for (const candidate of candidates) {
    const {key,artifact,run}=candidate;
    if (selected[key]) continue;
    const archive=path.join(archives,artifact.id+'.zip');
    const download=await downloadGitHubArchive(artifact,archive,process.env.GH_TOKEN);
    try {
      const manifest=JSON.parse(readZipFile(archive,'artifact-manifest.json'));
      const readReceipt=name=>{
        const bytes=readZipFile(archive,'receipts/'+name);
        verifyInventoryBytes(manifest,'receipts/'+name,bytes);return JSON.parse(bytes);
      };
      const source=readReceipt('source.json'),qualification=readReceipt('qualification.json');
      if (qualification.status!=='passed') {rejected.push({key,artifactId:artifact.id,status:qualification.status});continue;}
      const frozen=readReceipt(UK_NEXT_FAMILIES.has(key)?'.cars-next-'+key+'-frozen-lock.json':'.cars-cloudflare-svelte-locks.json');
      const lock=validateQualification({...candidate,manifest,source,qualification,frozen},batch.sourceReleases[key]);
      if (UK_NEXT_FAMILIES.has(key)) locks.next.push(lock);else locks.svelte[key]=lock;
      selected[key]={key,runId:run.id,attempt:qualification.attempt,commit:run.head_sha,artifactId:artifact.id,
        artifactName:artifact.name,archive:download,source:source.source,steps:qualification.steps,
        frozenLockSha256:sha256(encode(lock))};
    } catch(error) {throw Error(key+' qualification artifact '+artifact.id+': '+error.message);}
  }
  if (FAMILIES.some(key=>!selected[key])) throw Error('Successful frozen qualification receipts missing: '+FAMILIES.filter(key=>!selected[key]).join(', '));
  locks.next.sort((a,b)=>a.key.localeCompare(b.key));
  const evidence={schemaVersion:1,sourceReleases:batch.sourceReleases,selected,rejected,locks};
  writeJson(path.join(area,'receipts','qualified-locks.json'),evidence);
  return evidence;
}

async function installShareTooling(area,batch,dealer) {
  if (process.version!=='v26.10.0') throw Error('Share tooling uses the exact approved Signature Node 26.10.0.');
  const tooling=path.join(area,'share-tooling');fs.mkdirSync(tooling);
  const source=batch.sourceReleases['karento-best'], inputs=[];
  for (const name of ['package.json','package-lock.json']) {
    const bytes=git(ROOT,['show',source.revision+':templates/karento-best/'+name],{encoding:null});
    fs.writeFileSync(path.join(tooling,name),bytes,{flag:'wx'});
    inputs.push({path:name,sha256:sha256(bytes)});
  }
  const npm=resolveCloudflareNpmCli(process.execPath,fs,path);
  stage(area,'share-tooling-install',process.execPath,[npm,'ci','--include=dev','--ignore-scripts','--cache',path.join(area,'npm-cache')],tooling,
    {PLAYWRIGHT_SKIP_BROWSER_DOWNLOAD:'1',GH_TOKEN:''});
  const require=createRequire(path.join(tooling,'package.json')), sharp=require('sharp'), ts=require('typescript');
  if (require('sharp/package.json').version!=='0.35.5'||ts.version!=='6.0.3') throw Error('Actual share rendering tools differ from the retained source lock.');
  const icon=await sharp(fs.readFileSync(path.join(ROOT,dealer.brief,dealer.appIcon))).metadata();
  if (icon.format!=='png'||!icon.width||icon.width!==icon.height) throw Error('Share renderer did not decode the supplied square icon.');
  const receipt={schemaVersion:1,source,inputs,node:process.version,sharp:'0.35.5',typescript:ts.version,
    install:'npm ci --include=dev --ignore-scripts',actualIconDecoded:{width:icon.width,height:icon.height}};
  writeJson(path.join(area,'receipts','share-tooling.json'),receipt);
  return tooling;
}

function isolatedIndex(area,packageRoot) {
  const file=path.join(area,'package.index');
  if (fs.existsSync(file)) throw Error('Isolated package index already exists.');
  return {GIT_INDEX_FILE:file,GIT_WORK_TREE:packageRoot};
}

export async function sealPackage(dealer) {
  assertExactCi();
  const area=areaOf(dealer.slug), context=sourceIdentity(dealer);
  const evidence=json(path.join(area,'receipts','qualified-locks.json'));
  const {canonicalFiles,untrackedExcluded}=await committedDealerInputs({root:ROOT,source:context.source,
    manifest:context.manifest,sourceCommit:process.env.GITHUB_SHA,prefix:'clients/'+dealer.slug});
  if (untrackedExcluded.length) throw Error('Uncommitted source appeared in the immutable CI checkout.');
  const destination=packageOf(dealer.slug);
  const packaged=await packageDealer({source:context.source,destination,manifest:context.manifest,
    sourceCommit:process.env.GITHUB_SHA,canonicalFiles,provider:'cloudflare',cloudflareLocks:evidence.locks});
  const artifact=path.join(area,'source-artifact');fs.mkdirSync(artifact);
  const index=isolatedIndex(area,destination);
  git(ROOT,['-c','core.sparseCheckout=false','read-tree','--empty'],{env:index});
  git(ROOT,['-c','core.sparseCheckout=false','-c','core.autocrlf=false','--literal-pathspecs',
    'add','--force','--pathspec-from-file=-','--pathspec-file-nul'],{
      env:index,input:Buffer.from(packaged.files.join('\0')+'\0')});
  const tree=git(ROOT,['write-tree'],{env:index}), checked=verifyPackageTree({root:ROOT,packageTree:tree});
  if (checked.digest!==packaged.digest||checked.meta.sourceCommit!==process.env.GITHUB_SHA||
      checked.manifest.slug!==dealer.slug) throw Error('Clean package tree differs from package-dealer output.');
  const transportCommit=git(ROOT,['commit-tree',tree,'-p',process.env.GITHUB_SHA],{input:'UK Cloudflare artifact transport for '+dealer.slug+'\n',
    env:{GIT_AUTHOR_NAME:'github-actions[bot]',GIT_COMMITTER_NAME:'github-actions[bot]',
      GIT_AUTHOR_EMAIL:'41898282+github-actions[bot]@users.noreply.github.com',
      GIT_COMMITTER_EMAIL:'41898282+github-actions[bot]@users.noreply.github.com'}});
  const ref='refs/cars-ci/uk-cloudflare/'+process.env.GITHUB_RUN_ID+'/'+process.env.GITHUB_RUN_ATTEMPT+'/'+dealer.slug;
  git(ROOT,['update-ref',ref,transportCommit,'0'.repeat(40)]);
  const bundle=path.join(artifact,'package.bundle');
  git(ROOT,['bundle','create',bundle,ref,'^'+process.env.GITHUB_SHA]);git(ROOT,['bundle','verify',bundle]);
  const packageBytes=treeBytes('',tree);
  const transport={schemaVersion:1,dealer:dealer.slug,provider:'cloudflare',repository:dealer.repository,
    publicOrigin:dealer.publicOrigin,workerName:dealer.workerName,runId:process.env.GITHUB_RUN_ID,
    attempt:process.env.GITHUB_RUN_ATTEMPT,sourceCommit:process.env.GITHUB_SHA,packageTree:tree,transportCommit,ref,
    packageDigest:checked.digest,payloadDigest:checked.meta.payloadDigest,
    packageSha256:sha256(fs.readFileSync(path.join(destination,'.cars-package.json'))),packageBytes,
    bundle:{path:'package.bundle',bytes:fs.statSync(bundle).size,sha256:sha256(fs.readFileSync(bundle))},
    sourceReleases:context.batch.sourceReleases,creationPackDigest:context.creation.inputPackDigest,
    transportOnly:true,privateExportRequired:true,compiled:false,...noHostedApproval()};
  writeJson(path.join(artifact,'transport.json'),transport);
  fs.mkdirSync(path.join(artifact,'receipts'));
  for (const name of META_FILES) copyBuildArtifact(path.join(destination,name),path.join(artifact,'receipts',name));
  for (const name of ['qualified-locks.json','share-tooling.json']) copyBuildArtifact(path.join(area,'receipts',name),path.join(artifact,'receipts',name));
  writeJson(path.join(artifact,'receipts','package-build.json'),{schemaVersion:1,...transport,packageTreeVerification:checked.io,sourceRetained:true,sealed:true});
  artifactInventory(artifact,{dealer:dealer.slug,kind:'sealed-package-transport',status:'passed'});
  console.log(JSON.stringify({phase:'package-sealed',dealer:dealer.slug,packageTree:tree,packageDigest:checked.digest,bundleBytes:transport.bundle.bytes,...noHostedApproval()}));
  return transport;
}

export async function prepareBuild(dealer,runInput) {
  assertExactCi();
  const area=areaOf(dealer.slug);
  if (fs.existsSync(area)) throw Error('Build attempt already exists; use a new Actions run/attempt.');
  fs.mkdirSync(path.dirname(area),{recursive:true});fs.mkdirSync(area);
  const context=sourceIdentity(dealer), sourceBytes=treeBytes('clients/'+dealer.slug);
  writeJson(path.join(area,'receipts','runner-budget.json'),diskBudget(ROOT,sourceBytes*3+5*GIB,'package, tools and bounded qualification archives'));
  const status={schemaVersion:1,dealer:dealer.slug,sourceCommit:process.env.GITHUB_SHA,status:'running',...noHostedApproval()};
  try {
    await qualifiedLocks(area,context.batch,parseQualificationRuns(runInput));
    const tooling=await installShareTooling(area,context.batch,dealer);
    stage(area,'seal-package',process.execPath,['--max-old-space-size=4096',SELF,'seal',dealer.slug],ROOT,
      {NODE_PATH:path.join(tooling,'node_modules'),GH_TOKEN:''});
    status.status='passed';status.transport=json(path.join(area,'source-artifact','transport.json'));
  } catch(error) {status.status='failed';status.error=error.message;throw error;}
  finally {writeJson(path.join(area,'receipts','prepare.json'),status);}
}

function validateTransport(transport,dealer) {
  if (transport.schemaVersion!==1||transport.dealer!==dealer.slug||transport.repository!==dealer.repository||
      transport.provider!=='cloudflare'||transport.sourceCommit!==process.env.GITHUB_SHA||
      String(transport.runId)!==process.env.GITHUB_RUN_ID||String(transport.attempt)!==process.env.GITHUB_RUN_ATTEMPT||
      transport.workerName!==dealer.workerName||transport.publicOrigin!==dealer.publicOrigin||
      ![transport.packageTree,transport.transportCommit].every(value=>/^[a-f0-9]{40}$/.test(value??''))||
      ![transport.packageDigest,transport.payloadDigest,transport.packageSha256,transport.bundle?.sha256].every(value=>/^[a-f0-9]{64}$/.test(value??''))||
      transport.ref!=='refs/cars-ci/uk-cloudflare/'+process.env.GITHUB_RUN_ID+'/'+process.env.GITHUB_RUN_ATTEMPT+'/'+dealer.slug||
      transport.bundle.path!=='package.bundle'||!Number.isSafeInteger(transport.packageBytes)||transport.packageBytes<=0) {
    throw Error('Source transport differs from this exact dealer/build dispatch.');
  }
  return transport;
}

function restorePackage(dealer,key,area) {
  const input=preparedArtifactOf(dealer.slug);
  const inventory=verifyArtifactDirectory(input);
  if (inventory.status!=='passed'||inventory.kind!=='sealed-package-transport'||inventory.dealer!==dealer.slug) throw Error('Missing passed package transport artifact.');
  const transport=validateTransport(json(path.join(input,'transport.json')),dealer),bundle=path.join(input,'package.bundle');
  if (fs.statSync(bundle).size!==transport.bundle.bytes||sha256(fs.readFileSync(bundle))!==transport.bundle.sha256) throw Error('Package bundle changed.');
  writeJson(path.join(area,'receipts','runner-budget.json'),diskBudget(ROOT,transport.packageBytes*2+4*GIB,'one sealed package, target dependencies and compiled copies'));
  git(ROOT,['bundle','verify',bundle]);
  if (git(ROOT,['bundle','list-heads',bundle])!==transport.transportCommit+' '+transport.ref) throw Error('Bundle advertises an unexpected transport ref.');
  git(ROOT,['bundle','unbundle',bundle]);
  if (git(ROOT,['show','-s','--format=%T %P',transport.transportCommit])!==transport.packageTree+' '+transport.sourceCommit) throw Error('Transport commit has unexpected ancestry.');
  const checked=verifyPackageTree({root:ROOT,packageTree:transport.packageTree});
  if (checked.digest!==transport.packageDigest||checked.meta.payloadDigest!==transport.payloadDigest||
      checked.meta.sourceCommit!==transport.sourceCommit||checked.manifest.slug!==dealer.slug) throw Error('Restored package tree identity differs.');
  const destination=packageOf(dealer.slug,key);
  if (fs.existsSync(destination)) throw Error('Target generated package already exists.');
  fs.mkdirSync(destination,{recursive:true});
  const index=isolatedIndex(area,destination);
  git(ROOT,['-c','core.sparseCheckout=false','read-tree','--no-sparse-checkout',transport.packageTree],{env:index});
  git(ROOT,['-c','core.autocrlf=false','checkout-index','--all','--prefix='+destination.replaceAll('\\','/')+'/'],{env:index});
  assertPackagePayload(destination,checked.meta,transport.packageSha256);
  writeJson(path.join(area,'receipts','source.json'),{...transport,packageTreeVerification:checked.io,restored:true});
  return {packageRoot:destination,transport,meta:checked.meta};
}

function installedBin(directory,name,command) {
  const require=createRequire(path.join(directory,'package.json'));
  for (const parent of require.resolve.paths(name)??[]) {
    const filename=path.join(parent,name,'package.json');
    if (!fs.existsSync(filename)) continue;
    const pkg=json(filename),relative=typeof pkg.bin==='string'?pkg.bin:pkg.bin?.[command];
    if (pkg.name===name&&relative) return {file:path.resolve(path.dirname(filename),relative),version:pkg.version};
  }
  throw Error('Installed compiler is unavailable: '+name);
}

function workerStats(packageRoot,assetPath,modulePath) {
  const assets=filesAt(path.join(packageRoot,assetPath),{filter:()=>true}).map(name=>({path:name,bytes:fs.statSync(path.join(packageRoot,assetPath,name)).size}));
  const modules=filesAt(path.join(packageRoot,modulePath),{filter:()=>true}).filter(name=>!name.endsWith('.map')&&!/^(?:README|bundle-meta)(?:\.|$)/.test(path.basename(name)));
  return {assets:{files:assets.length,bytes:assets.reduce((sum,row)=>sum+row.bytes,0),
    largest:assets.reduce((max,row)=>row.bytes>(max?.bytes??-1)?row:max,null),
    fileCountWithinFreeLimit:assets.length<=20000,fileSizesWithinLimit:assets.every(row=>row.bytes<=25*1024**2)},
    worker:{modules:modules.length,uncompressedBytes:modules.reduce((sum,name)=>sum+fs.statSync(path.join(packageRoot,modulePath,name)).size,0),
      compressedBytes:modules.reduce((sum,name)=>sum+gzipSync(fs.readFileSync(path.join(packageRoot,modulePath,name))).length,0)},
    runtimeCpu:{measured:false,freeQualified:false}};
}

function runWranglerDryRun(area,packageRoot,key,target) {
  const where=path.join(packageRoot,target.root),wrangler=installedBin(where,'wrangler','wrangler');
  const expected='4.149.0';
  if (wrangler.version!==expected) throw Error('Dry-run Wrangler differs from frozen toolchain.');
  const output='.cars-build-assets/'+key+'-worker';
  stage(area,key+'-dry-run',process.execPath,[wrangler.file,'deploy','--dry-run','--config',path.join(packageRoot,target.config),
    '--outdir',path.join(packageRoot,output),'--metafile',path.join(packageRoot,output,'bundle-meta.json')],where);
  return output;
}

export async function compileTarget(dealer,key) {
  assertExactCi();
  if (!Object.hasOwn(UK_FAMILY_NODES,key)||process.version!=='v'+UK_FAMILY_NODES[key]) throw Error('Use the declared target and exact family Node version.');
  const area=path.join(areaOf(dealer.slug),'targets',key);
  if (fs.existsSync(area)) throw Error('Target build attempt already exists.');
  fs.mkdirSync(area,{recursive:true});
  const artifact=path.join(area,'artifact'),evidence=path.join(area,'evidence');
  fs.mkdirSync(artifact);fs.mkdirSync(evidence);
  const result={schemaVersion:1,dealer:dealer.slug,key,node:process.version,status:'running',
    runId:process.env.GITHUB_RUN_ID,attempt:process.env.GITHUB_RUN_ATTEMPT,
    sourceCommit:process.env.GITHUB_SHA,compiled:false,dryRun:false,...noHostedApproval()};
  let completed=false;
  try {
    const context=restorePackage(dealer,key,area),{packageRoot,transport,meta}=context;
    let target,output,dryBundle;
    const check=()=>assertPackagePayload(packageRoot,meta,transport.packageSha256);
    if (key==='router') {
      target={root:'cloudflare',config:'cloudflare/wrangler.jsonc',main:'cloudflare/router.mjs',assets:'cloudflare/public',workerName:dealer.workerName};
      const npm=resolveCloudflareNpmCli(process.execPath,fs,path);
      stage(area,'router-install',process.execPath,[npm,'ci','--include=dev','--cache',path.join(packageRoot,'.cars-build-assets','router-npm-cache')],path.join(packageRoot,'cloudflare'));
      check();dryBundle=runWranglerDryRun(area,packageRoot,key,target);check();
      for (const name of [target.main,target.config,target.assets]) copyBuildArtifact(path.join(packageRoot,name),path.join(artifact,'compiled',name));
      copyBuildArtifact(path.join(packageRoot,dryBundle),path.join(artifact,'compiled',dryBundle));
      output=workerStats(packageRoot,target.assets,dryBundle);
    } else if (UK_NEXT_FAMILIES.has(key)) {
      const receipt=json(path.join(packageRoot,'.cars-cloudflare-next.json'));
      target=receipt.targets.find(item=>item.key===key);
      if (!target||receipt.dependencyLock!=='frozen') throw Error('The sealed package lacks frozen Next target dependencies.');
      const helper=path.join(packageRoot,'scripts/build-cloudflare-next.mjs');
      for (const phase of ['install','build']) {
        stage(area,key+'-'+phase,process.execPath,[helper,phase,key],packageRoot);check();
      }
      target={...target,config:target.generatedConfig};
      dryBundle=runWranglerDryRun(area,packageRoot,key,target);check();
      copyBuildArtifact(path.join(packageRoot,target.root,'dist'),path.join(artifact,'compiled',target.root,'dist'));
      copyBuildArtifact(path.join(packageRoot,dryBundle),path.join(artifact,'compiled',dryBundle));
      copyBuildArtifact(path.join(packageRoot,'.cars-next-'+key+'-dependencies.json'),path.join(area,'receipts','.cars-next-'+key+'-dependencies.json'));
      output=workerStats(packageRoot,target.assets,dryBundle);
    } else {
      const receipt=json(path.join(packageRoot,'.cars-cloudflare-svelte.json')),service=receipt.services.find(item=>item.key===key);
      if (!service||service.dependencyLockStatus!=='frozen') throw Error('The sealed package lacks frozen Svelte target dependencies.');
      const helper=path.join(packageRoot,'scripts/build-cloudflare-svelte.mjs');
      for (const phase of ['dependencies','build','dry-run']) {
        stage(area,key+'-'+phase,process.execPath,[helper,key,phase],packageRoot);check();
      }
      target={root:key,config:key+'/wrangler.json',main:key+'/'+CLOUDFLARE_SVELTE_OUTPUT.main,
        assets:key+'/'+CLOUDFLARE_SVELTE_OUTPUT.assets,workerName:json(path.join(packageRoot,key,'wrangler.json')).name};
      dryBundle=key+'/'+CLOUDFLARE_SVELTE_OUTPUT.bundle;
      for (const name of ['.svelte-kit/cloudflare','.svelte-kit/cloudflare-worker','.cars-cloudflare/worker','wrangler.json']) {
        copyBuildArtifact(path.join(packageRoot,key,name),path.join(artifact,'compiled',key,name));
      }
      for (const suffix of ['dependencies','build']) copyBuildArtifact(
        path.join(packageRoot,'.cars-build-assets',key+'.cloudflare-'+suffix+'.json'),
        path.join(area,'receipts','.cars-build-assets',key+'.cloudflare-'+suffix+'.json'));
      output=inspectCloudflareSvelteOutput(path.join(packageRoot,key));
    }
    const expectedWorker=key==='router'?dealer.workerName:dealer.workerName+'-'+(key==='karento-best'?'signature':key);
    if (target.workerName!==expectedWorker||!fs.statSync(path.join(packageRoot,target.main)).isFile()||
        !fs.statSync(path.join(packageRoot,target.config)).isFile()) throw Error('Compiled Worker identity or entry is missing.');
    assertCompiledConfig(json(path.join(packageRoot,target.config)),target,{router:key==='router'});
    check();
    const files=filesAt(path.join(artifact,'compiled'),{filter:()=>true}).map(name=>{
      const bytes=fs.readFileSync(path.join(artifact,'compiled',name));
      return {path:'compiled/'+name,bytes:bytes.length,sha256:sha256(bytes)};
    });
    const deploy={schemaVersion:1,dealer:dealer.slug,key,provider:'cloudflare',repository:dealer.repository,
      sourceCommit:transport.sourceCommit,packageTree:transport.packageTree,transportCommit:transport.transportCommit,
      packageDigest:transport.packageDigest,payloadDigest:transport.payloadDigest,packageSha256:transport.packageSha256,
      publicOrigin:dealer.publicOrigin,workerName:target.workerName,node:process.version,
      configPath:'compiled/'+target.config,mainPath:'compiled/'+target.main,assetPath:'compiled/'+target.assets,
      dryRunBundlePath:'compiled/'+dryBundle,compiledFiles:files,compiledDigest:sha256(JSON.stringify(files)),
      artifactName:'uk-cloudflare-compiled-'+dealer.slug+'-'+key+'-'+process.env.GITHUB_RUN_ID+'-'+process.env.GITHUB_RUN_ATTEMPT,
      runId:process.env.GITHUB_RUN_ID,attempt:process.env.GITHUB_RUN_ATTEMPT,
      compiled:true,dryRun:true,sourcePayloadUnchanged:true,output,
      deployment:{performed:false,credentialsIncluded:false,buildRequired:false,reviewRequired:true},
      ...noHostedApproval()};
    writeJson(path.join(artifact,'deploy.json'),deploy);
    for (const name of META_FILES) copyBuildArtifact(path.join(packageRoot,name),path.join(area,'receipts',name));
    Object.assign(result,{status:'passed',compiled:true,dryRun:true,...{
      packageTree:transport.packageTree,packageDigest:transport.packageDigest,payloadDigest:transport.payloadDigest,
      workerName:target.workerName,sourcePayloadUnchanged:true,compiledDigest:deploy.compiledDigest,output}});
    completed=true;
  } catch(error) {result.status='failed';result.error=error.message;throw error;}
  finally {
    result.finishedAt=new Date().toISOString();writeJson(path.join(area,'receipts','build.json'),result);
    if (fs.existsSync(path.join(area,'receipts'))) copyBuildArtifact(path.join(area,'receipts'),path.join(artifact,'receipts'));
    const inventory=artifactInventory(artifact,{dealer:dealer.slug,key,kind:'compiled-worker',status:result.status});
    copyBuildArtifact(path.join(area,'receipts'),path.join(evidence,'receipts'));
    copyBuildArtifact(path.join(artifact,'artifact-manifest.json'),path.join(evidence,'compiled-artifact-manifest.json'));
    if (completed) copyBuildArtifact(path.join(artifact,'deploy.json'),path.join(evidence,'deploy.json'));
    artifactInventory(evidence,{dealer:dealer.slug,key,kind:'compiled-worker-evidence',status:result.status});
    console.log(JSON.stringify({dealer:dealer.slug,key,status:result.status,artifactBytes:inventory.bytes,...noHostedApproval()}));
  }
  return result;
}

export function summarizeBuild(dealer) {
  assertExactCi();
  const directory=inside(ROOT,'runtime/uk-cloudflare-evidence/'+dealer.slug,{mustExist:true});
  const rows=[];
  for (const key of Object.keys(UK_FAMILY_NODES)) {
    const name='uk-cloudflare-evidence-'+dealer.slug+'-'+key+'-'+process.env.GITHUB_RUN_ID+'-'+process.env.GITHUB_RUN_ATTEMPT;
    const root=inside(directory,name,{mustExist:true}),manifest=verifyArtifactDirectory(root),build=json(path.join(root,'receipts/build.json'));
    if (manifest.kind!=='compiled-worker-evidence'||manifest.status!=='passed'||manifest.key!==key||manifest.dealer!==dealer.slug||
        build.status!=='passed'||build.compiled!==true||build.dryRun!==true||build.sourcePayloadUnchanged!==true||
        build.sourceCommit!==process.env.GITHUB_SHA||build.dealer!==dealer.slug||build.key!==key) throw Error('A required target lacks passing exact build evidence: '+key);
    const deploy=json(path.join(root,'deploy.json')),inventory=validateFileInventory(json(path.join(root,'compiled-artifact-manifest.json')));
    if (inventory.kind!=='compiled-worker'||inventory.status!=='passed'||inventory.key!==key||
        deploy.packageDigest!==build.packageDigest||deploy.payloadDigest!==build.payloadDigest||
        deploy.compiledDigest!==build.compiledDigest||deploy.compiledDigest!==sha256(JSON.stringify(deploy.compiledFiles))) throw Error('Compiled artifact evidence differs from its build: '+key);
    for (const file of deploy.compiledFiles) {
      const declared=inventory.files.find(row=>row.path===file.path);
      if (JSON.stringify(declared)!==JSON.stringify(file)) throw Error('Compiled output inventory mismatch: '+key+'/'+file.path);
    }
    rows.push({key,workerName:build.workerName,packageTree:build.packageTree,packageDigest:build.packageDigest,
      payloadDigest:build.payloadDigest,compiledDigest:build.compiledDigest,artifactName:deploy.artifactName,output:deploy.output});
  }
  if (new Set(rows.map(row=>row.packageDigest)).size!==1||new Set(rows.map(row=>row.packageTree)).size!==1||
      new Set(rows.map(row=>row.payloadDigest)).size!==1) throw Error('Family builds did not use one identical sealed package.');
  const report={schemaVersion:1,dealer:dealer.slug,provider:'cloudflare',publicOrigin:dealer.publicOrigin,
    sourceCommit:process.env.GITHUB_SHA,runId:process.env.GITHUB_RUN_ID,attempt:process.env.GITHUB_RUN_ATTEMPT,
    packageTree:rows[0].packageTree,packageDigest:rows[0].packageDigest,payloadDigest:rows[0].payloadDigest,
    allSixFamiliesBuilt:true,routerDryRun:true,status:'compiled-awaiting-local-deployment-review',targets:rows,...noHostedApproval()};
  const output=inside(ROOT,'runtime/uk-cloudflare-summary/'+dealer.slug);fs.mkdirSync(output,{recursive:true});
  writeJson(path.join(output,'build-summary.json'),report);
  if (process.env.GITHUB_STEP_SUMMARY) fs.appendFileSync(process.env.GITHUB_STEP_SUMMARY,
    '# '+dealer.name+' — Cloudflare build\n\nSeven exact targets (six dealer applications and the router) compiled and passed Wrangler dry-runs.\n\n'+
    'Source commit: '+report.sourceCommit+'\n\nPackage tree: '+report.packageTree+'\n\n'+
    'Artifacts are ready for local deployment review. No Worker was uploaded; hosted, browser and contact-path QA remain pending.\n');
  console.log(JSON.stringify(report));
  return report;
}

if (process.argv[1]&&path.resolve(process.argv[1])===SELF) {
  try {
    const [command,selection,argument]=process.argv.slice(2),dealer=slugOf(selection);
    if (command==='matrix'&&process.argv.length===4) console.log('matrix='+JSON.stringify(buildMatrix(selection)));
    else if (command==='prepare'&&process.argv.length===5) await prepareBuild(dealer,argument);
    else if (command==='seal'&&process.argv.length===4) await sealPackage(dealer);
    else if (command==='compile'&&process.argv.length===5) await compileTarget(dealer,argument);
    else if (command==='summary'&&process.argv.length===4) summarizeBuild(dealer);
    else throw Error('Usage: build-uk-cloudflare.mjs matrix SLUG | prepare SLUG RUN_IDS | compile SLUG FAMILY | summary SLUG');
  } catch(error) {console.error(error.message);process.exitCode=1;}
}
