/** Explicit deployment of an already compiled, reviewed fleet singleton.
 * Default is read-only inspection. --write uploads once with the existing Wrangler profile.
 * This bridge never builds, composes, downloads, extracts, creates dependent Workers or changes DNS/billing.
 */
import fs from 'node:fs';
import path from 'node:path';
import {randomUUID} from 'node:crypto';
import {spawnSync} from 'node:child_process';
import {isEntrypoint} from './lib/cli-entrypoint.mjs';
import {ROOT,json,sha256,inside} from './lib/workflow.mjs';
import {registeredCompositionIdentity} from './package-dealer-single-worker.mjs';
import {hashArchive,readZipReceipt,parseWranglerDeploymentOutput,activeDeployment} from './deploy-uk-cloudflare.mjs';
import {SINGLETON_ACCOUNT,SINGLETON_KIND,SINGLETON_TOOLCHAIN,singletonArtifactName,verifyFleetSingletonDirectory} from './assemble-existing-fleet-single-worker.mjs';

const assert=(value,message)=>{if(!value)throw Error(message);};
const canonical=value=>JSON.stringify(value,(_,v)=>v&&typeof v==='object'&&!Array.isArray(v)?Object.fromEntries(Object.keys(v).sort().map(k=>[k,v[k]])):v);
const hex40=v=>/^[a-f0-9]{40}$/.test(v??''),hex64=v=>/^[a-f0-9]{64}$/.test(v??'');
const number=v=>/^[1-9][0-9]{0,14}$/.test(String(v??''));
const uuid=v=>/^[a-f0-9]{8}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{12}$/i.test(v??'');
const writeNew=(file,value)=>fs.writeFileSync(file,JSON.stringify(value,null,2)+'\n',{flag:'wx'});
const deploymentMode=(mode,review)=>{
 assert(['update-existing','create-singleton'].includes(mode),'Use update-existing or explicit create-singleton deployment mode');
 assert((review.deploymentMode??'update-existing')===mode,'Reviewed deployment mode differs; creation requires explicit create-singleton selection');
 return mode;
};

export function validateSingletonGitHubBuild({run,artifact},review) {
 assert(number(review.runId)&&number(review.attempt)&&number(review.artifactId)&&run.id===Number(review.runId)&&run.run_attempt===Number(review.attempt)&&run.event==='push'&&
  run.head_branch==='main'&&run.path==='.github/workflows/existing-fleet-cloudflare.yml'&&run.repository?.full_name==='darkapoparka/cars'&&run.head_repository?.full_name==='darkapoparka/cars'&&
  run.head_sha===review.sourceCommit&&hex40(run.head_sha)&&run.status==='completed'&&run.conclusion==='success','Exact successful Cars main singleton build is required');
 assert(artifact.id===Number(review.artifactId)&&artifact.name===singletonArtifactName(review.client,review.runId,review.attempt)&&artifact.name===review.artifactName&&!artifact.expired&&
  artifact.workflow_run?.id===run.id&&artifact.workflow_run?.head_sha===run.head_sha&&artifact.digest===review.archiveDigest&&/^sha256:[a-f0-9]{64}$/.test(artifact.digest??'')&&
  Number.isSafeInteger(artifact.size_in_bytes)&&artifact.size_in_bytes>0&&artifact.size_in_bytes<=2*1024**3&&artifact.size_in_bytes===review.archiveBytes,'Exact singleton GitHub artifact identity differs');
 return {run,artifact};
}

export function validateSourcePublication(publication,proof,receipt,record) {
 const sourceRepository=record.sourceOwnership==='independent-repository'?record.repository:record.canonicalSourceRepository||'darkapoparka/cars';
 assert(publication?.repository===sourceRepository&&publication.commit===receipt.sourceCommit&&publication.sourceTree===receipt.sourceTree&&publication.ref==='refs/heads/main'&&
  Number.isFinite(Date.parse(publication.publishedAt))&&typeof publication.evidence==='string'&&publication.evidence.trim().length>0,'Canonical source publication differs');
 assert(proof?.repository===sourceRepository&&proof.commit===receipt.sourceCommit&&proof.sourceTree===receipt.sourceTree&&proof.ref==='refs/heads/main'&&
  proof.mainReachable===true&&hex40(proof.mainCommit),'Authenticated GitHub proof does not establish published source on main');
 return {...publication,verifiedMainCommit:proof.mainCommit};
}


export const CANONICAL_EXPOSURE_ZONE = '006e99b27c99b7ee85bc0642fa91fa14';
export const CANONICAL_EXPOSURE_KIND = 'cars-existing-worker-canonical-exposure-lease';
const exposureReads = new WeakMap();
const exposureEndpoint = (kind, lease) => kind === 'zoneRoutes' ? '/zones/'+CANONICAL_EXPOSURE_ZONE+'/workers/routes' :
 kind === 'workerDomains' ? '/accounts/'+SINGLETON_ACCOUNT+'/workers/domains' :
 '/accounts/'+SINGLETON_ACCOUNT+'/workers/scripts/'+lease.workerName+'/subdomain';
const exposureKeys = (value, expected, label) => assert(value && typeof value === 'object' && !Array.isArray(value) &&
 canonical(Object.keys(value).sort()) === canonical([...expected].sort()), 'Canonical exposure '+label+' shape differs');
function exposureRows(rows, kind) {
 assert(Array.isArray(rows) && rows.length <= 1000, 'Canonical exposure requires bounded complete '+kind);
 const ids = new Set();
 return rows.map(row => {
  assert(row && /^[a-f0-9]{32}$/.test(row.id ?? '') && !ids.has(row.id), 'Canonical exposure has an invalid or duplicate ID'); ids.add(row.id);
  if (kind === 'zoneRoutes') {
   assert(/^[a-z0-9][a-z0-9-]{0,63}\.webpreviews\.site\/\*$/.test(row.pattern ?? '') &&
    (row.script == null || /^cars-[a-z0-9-]{1,58}$/.test(row.script)), 'Canonical exposure contains an unreviewed route pattern or Worker');
   return {id:row.id,pattern:row.pattern,script:row.script ?? null};
  }
  assert(typeof row.hostname === 'string' && row.hostname.length <= 253 && typeof row.service === 'string' &&
   typeof row.zone_id === 'string' && typeof row.environment === 'string' && typeof row.cert_id === 'string' &&
   typeof row.enabled === 'boolean' && typeof row.previews_enabled === 'boolean', 'Canonical exposure domain inventory differs');
  return {id:row.id,hostname:row.hostname,service:row.service,zone_id:row.zone_id,environment:row.environment,
   cert_id:row.cert_id,enabled:row.enabled,previews_enabled:row.previews_enabled};
 }).sort((a,b)=>a.id.localeCompare(b.id,'en'));
}
/** Hash normalized authenticated API results, never cached review timestamps. */
export function canonicalExposureDigests({zoneRoutes,workerDomains,scriptSubdomain}) {
 const routes=exposureRows(zoneRoutes.result,'zoneRoutes'),domains=exposureRows(workerDomains.result,'workerDomains'),subdomain=scriptSubdomain.result;
 exposureKeys(subdomain,['enabled','previews_enabled'],'subdomain');
 assert(typeof subdomain.enabled === 'boolean' && typeof subdomain.previews_enabled === 'boolean','Canonical exposure subdomain settings differ');
 return {zoneRoutes:sha256(canonical(routes)),workerDomains:sha256(canonical(domains)),scriptSubdomain:sha256(canonical(subdomain))};
}
export function validateCanonicalExposureLease(lease, {client,workerName,publicOrigin,now=Date.now()} = {}) {
 exposureKeys(lease,['schemaVersion','kind','dealer','reviewed','reviewedAt','accountId','workerName','providerOrigin','canonicalOrigin','zoneId','routeId','proofs'],'lease');
 assert(lease.schemaVersion===1 && lease.kind===CANONICAL_EXPOSURE_KIND && lease.reviewed===true &&
  Number.isFinite(Date.parse(lease.reviewedAt)) && Date.parse(lease.reviewedAt)<=now &&
  lease.accountId===SINGLETON_ACCOUNT && lease.zoneId===CANONICAL_EXPOSURE_ZONE && lease.dealer===client &&
  lease.workerName===workerName && lease.providerOrigin===publicOrigin && /^[a-f0-9]{32}$/.test(lease.routeId ?? ''),
  'Canonical exposure lease differs from the reviewed dealer/Worker');
 let origin;try{origin=new URL(lease.canonicalOrigin);}catch{assert(false,'Canonical exposure HTTPS origin required');}
 assert(origin.origin===lease.canonicalOrigin && origin.protocol==='https:' && !origin.username && !origin.password &&
  /^[a-z0-9][a-z0-9-]{0,63}\.webpreviews\.site$/.test(origin.hostname), 'Canonical exposure requires one exact existing webpreviews hostname');
 exposureKeys(lease.proofs,['zoneRoutes','workerDomains','scriptSubdomain'],'proofs');
 for(const kind of ['zoneRoutes','workerDomains','scriptSubdomain']) {
  exposureKeys(lease.proofs[kind],['endpoint','sha256'],kind+' proof');
  assert(lease.proofs[kind].endpoint===exposureEndpoint(kind,lease) && hex64(lease.proofs[kind].sha256), 'Canonical exposure proof endpoint/hash differs');
 }
 return lease;
}
/** Root supplies actual authenticated GETs. The default CLI has no exposure reader. */
export async function readCanonicalExposureSnapshot({snapshot,review,readExposure,stage,notBefore,now=()=>Date.now()}) {
 const lease=validateCanonicalExposureLease(review.canonicalExposure,review);
 assert(typeof readExposure==='function' && ['before','locked','after'].includes(stage) && Number.isFinite(Date.parse(notBefore)),
  'Canonical exposure requires a live authenticated readExposure callback');
 const requestId=randomUUID();
 const value=await readExposure({requestId,accountId:SINGLETON_ACCOUNT,workerName:review.workerName,zoneId:CANONICAL_EXPOSURE_ZONE,
  canonicalOrigin:lease.canonicalOrigin,stage,notBefore,expectedVersionId:snapshot.versionId,
  endpoints:Object.fromEntries(['zoneRoutes','workerDomains','scriptSubdomain'].map(kind=>[kind,exposureEndpoint(kind,lease)]))});
 assert(value?.kind==='cars-live-canonical-exposure-read' && value.requestId===requestId && value.evidence==='authenticated-cloudflare-connector' &&
  value.accountId===SINGLETON_ACCOUNT && value.workerName===review.workerName && value.zoneId===CANONICAL_EXPOSURE_ZONE &&
  Number.isFinite(Date.parse(value.observedAt)) && Date.parse(value.observedAt)>=Date.parse(notBefore) &&
  Date.parse(value.observedAt)<=now() && now()-Date.parse(value.observedAt)<=15*60*1000,
  'Canonical exposure requires a fresh stage-specific authenticated observation, not cached review data');
 for(const kind of ['zoneRoutes','workerDomains','scriptSubdomain']) {
  const proof=value[kind];
  assert(proof?.endpoint===exposureEndpoint(kind,lease) && proof.success===true && proof.status===200,
   'Canonical exposure authenticated GET failed: '+kind);
  if(kind!=='scriptSubdomain') assert(proof.complete===true && Number.isSafeInteger(proof.totalCount) &&
   proof.totalCount===proof.result?.length, 'Canonical exposure inventory is incomplete: '+kind);
 }
 const digests=canonicalExposureDigests(value),routes=exposureRows(value.zoneRoutes.result,'zoneRoutes'),domains=exposureRows(value.workerDomains.result,'workerDomains');
 for(const kind of Object.keys(digests)) assert(digests[kind]===lease.proofs[kind].sha256,'Canonical exposure lease drift: '+kind);
 const own=routes.filter(row=>row.script===review.workerName),pattern=new URL(lease.canonicalOrigin).hostname+'/*';
 assert(own.length===1 && own[0].id===lease.routeId && own[0].pattern===pattern &&
  routes.filter(row=>row.pattern===pattern).length===1, 'Canonical exposure route is not owned solely by this exact Worker/hostname');
 assert(!domains.some(row=>row.service===review.workerName || row.hostname===new URL(lease.canonicalOrigin).hostname),
  'Canonical exposure includes a foreign or unexpected Custom Domain');
 assert(value.scriptSubdomain.result.enabled===true && value.scriptSubdomain.result.previews_enabled===false,
  'Canonical exposure workers.dev/preview settings differ from the sealed configuration');
 const result={...snapshot,routes:own,domains:[],workersDev:true,workersDevPreviewEnabled:false,
  canonicalExposureRead:{stage,requestId,observedAt:value.observedAt,leaseSha256:sha256(canonical(lease)),proofDigests:digests}};
 exposureReads.set(result,{snapshot:canonical(result),leaseSha256:sha256(canonical(lease))});
 return result;
}
function validateCanonicalExposureSnapshot(snapshot, lease, workerName) {
 const recorded=exposureReads.get(snapshot);
 assert(recorded?.snapshot===canonical(snapshot) && recorded.leaseSha256===sha256(canonical(lease)) &&
  snapshot.canonicalExposureRead?.leaseSha256===recorded.leaseSha256 && snapshot.workersDevPreviewEnabled===false &&
  canonical(snapshot.handlers)===canonical(['fetch']) && snapshot.bindings.length===1 &&
  snapshot.bindings[0].type==='assets' && snapshot.bindings[0].name==='ASSETS',
  'Canonical exposure requires the unmodified live-reader snapshot, fetch-only handler and ASSETS-only bindings');
}

export const MINIMUM_SPARE_WORKER_SCRIPTS=1;
const freshObservation=(value,now)=>Number.isFinite(Date.parse(value))&&now-Date.parse(value)>=0&&now-Date.parse(value)<=15*60*1000;
/** A reviewed allowance is separate from inventory and never inferred from purchase intent. */
export function validateSingletonCapacity(snapshot,{now=Date.now()}={}) {
 assert(snapshot?.accountId===SINGLETON_ACCOUNT&&Number.isSafeInteger(snapshot.scriptCount)&&snapshot.scriptCount>=0&&
  [100,500].includes(snapshot.allowedScripts),'Worker capacity requires the target account, a nonnegative count and a supported 100/500 allowance');
 const review=snapshot.capacityReview;
 if(review==null){
  assert(snapshot.allowedScripts===100,'The 500-script allowance requires fresh reviewed paid-plan capacity evidence');
  return {allowedScripts:100,basis:'conservative-free-default',reviewSha256:null,minimumSpareScripts:MINIMUM_SPARE_WORKER_SCRIPTS};
 }
 assert(review.schemaVersion===1&&review.kind==='cars-workers-capacity-review'&&review.accountId===SINGLETON_ACCOUNT&&review.reviewed===true&&
  freshObservation(review.observedAt,now)&&freshObservation(review.reviewedAt,now)&&Date.parse(review.reviewedAt)>=Date.parse(review.observedAt)&&
  review.allowedScripts===snapshot.allowedScripts&&({free:100,paid:500})[review.workersPlan]===snapshot.allowedScripts,
  'Fresh reviewed account-matching Workers plan and allowance evidence is required');
 const source=review.source;
 assert(hex64(source?.sha256)&&(
  review.evidence==='authenticated-cloudflare-connector'&&source.endpoint==='/accounts/'+SINGLETON_ACCOUNT+'/subscriptions'||
  review.evidence==='authenticated-cloudflare-dashboard'&&source.url==='https://dash.cloudflare.com/'+SINGLETON_ACCOUNT+'/workers/plans'),
  'Worker capacity evidence requires an exact authenticated account plan source and retained observation hash');
 const policy=review.reservePolicy;
 if(policy!==undefined)assert(policy&&typeof policy==='object'&&!Array.isArray(policy)&&canonical(Object.keys(policy).sort())===canonical(['minimumSpareScripts','reason'])&&
  [0,1].includes(policy.minimumSpareScripts)&&typeof policy.reason==='string'&&policy.reason.trim().length>0&&policy.reason.length<=1000&&
  (policy.minimumSpareScripts!==0||review.workersPlan==='paid'&&snapshot.allowedScripts===500),'Explicit spare-capacity policy requires a concrete reason; zero reserve requires reviewed Workers Paid 500');
 return {allowedScripts:snapshot.allowedScripts,basis:'reviewed-workers-'+review.workersPlan,reviewSha256:sha256(canonical(review)),minimumSpareScripts:policy?.minimumSpareScripts??MINIMUM_SPARE_WORKER_SCRIPTS};
}
const capacityPins=snapshot=>canonical({allowedScripts:snapshot.allowedScripts,capacityReview:snapshot.capacityReview??null});

export function validateCurrentSingletonTarget(snapshot,workerName,{now=Date.now(),after=false,versionId,canonicalExposure}={}) {
 assert(snapshot?.accountId===SINGLETON_ACCOUNT&&snapshot.workerName===workerName&&snapshot.exists===true&&snapshot.workersDev===true&&
  Number.isFinite(Date.parse(snapshot.checkedAt))&&Math.abs(now-Date.parse(snapshot.checkedAt))<=15*60*1000&&
  Array.isArray(snapshot.routes)&&(canonicalExposure || snapshot.routes.length===0)&&Array.isArray(snapshot.domains)&&snapshot.domains.length===0&&
  Array.isArray(snapshot.tailConsumers)&&snapshot.tailConsumers.length===0&&Array.isArray(snapshot.schedules)&&snapshot.schedules.length===0&&
  Array.isArray(snapshot.bindings),
  'Fresh existing public Worker snapshot without foreign routes/resources is required');
 validateSingletonCapacity(snapshot,{now});
 if(canonicalExposure)validateCanonicalExposureSnapshot(snapshot,canonicalExposure,workerName);
 const ownServices=new Set(['auto-best','modern','import','app','mobile','karento-best','signature','carwow'].map(k=>workerName+'-'+k));
 for(const binding of snapshot.bindings){
  if(binding.type==='assets'&&binding.name==='ASSETS')continue;
  assert(!after&&binding.type==='service'&&ownServices.has(binding.service)&&(!binding.environment||binding.environment==='production')&&!binding.entrypoint&&
   /^(?:CARS_(?:AUTO_BEST|MODERN|IMPORT|APP|MOBILE|KARENTO_BEST)|APP|MODERN|CARWOW)$/.test(binding.name),'Current Worker includes foreign resources or singleton still has service bindings');
 }
 assert(uuid(snapshot.versionId)&&snapshot.versionTraffic?.length===1&&snapshot.versionTraffic[0].version_id===snapshot.versionId&&snapshot.versionTraffic[0].percentage===100,'Current Worker version is not active at 100%');
 if(after)assert(snapshot.versionId===versionId&&snapshot.bindings.length===1&&snapshot.bindings[0].type==='assets'&&snapshot.bindings[0].name==='ASSETS','Uploaded singleton has dependencies or a different active version');
 return snapshot;
}

/** Complete authenticated inventory is absence/capacity evidence, never hosted acceptance. */
export function validateAbsentSingletonTarget(snapshot,workerName,publicOrigin,{now=Date.now()}={}) {
 assert(snapshot?.accountId===SINGLETON_ACCOUNT&&snapshot.workerName===workerName&&snapshot.publicOrigin===publicOrigin&&snapshot.exists===false&&snapshot.workersDev===false&&
  snapshot.evidence==='authenticated-cloudflare-connector'&&Number.isFinite(Date.parse(snapshot.checkedAt))&&now-Date.parse(snapshot.checkedAt)>=0&&now-Date.parse(snapshot.checkedAt)<=15*60*1000&&
  ['routes','domains','tailConsumers','schedules','bindings','versionTraffic'].every(key=>Array.isArray(snapshot[key])&&snapshot[key].length===0)&&snapshot.versionId===null,
  'Fresh authenticated absent Worker snapshot without routes/resources is required');
 const capacity=validateSingletonCapacity(snapshot,{now});
 assert(snapshot.scriptCount+1+capacity.minimumSpareScripts<=snapshot.allowedScripts,
  'New Worker capacity must retain the reviewed spare script slots after creation');
 const inventory=snapshot.scriptInventory;
 assert(inventory?.complete===true&&freshObservation(inventory.checkedAt,now)&&Date.parse(inventory.checkedAt)<=Date.parse(snapshot.checkedAt)&&
  inventory.endpoint==='/accounts/'+SINGLETON_ACCOUNT+'/workers/scripts'&&Array.isArray(inventory.names)&&
  inventory.names.length===snapshot.scriptCount&&inventory.names.every(name=>typeof name==='string'&&name.length>0&&name.length<=128)&&
  new Set(inventory.names).size===inventory.names.length&&!inventory.names.includes(workerName),'Complete account script inventory must prove the exact Worker is absent');
 return snapshot;
}

const absentTargetPins=snapshot=>canonical(Object.fromEntries(['accountId','workerName','publicOrigin','exists','workersDev','routes','domains','tailConsumers','schedules','bindings','versionId','versionTraffic','scriptCount','allowedScripts','evidence'].map(key=>[key,snapshot[key]]).concat([['capacityReview',snapshot.capacityReview??null],['scriptInventory',{complete:snapshot.scriptInventory.complete,endpoint:snapshot.scriptInventory.endpoint,names:[...snapshot.scriptInventory.names].sort()}]])));

/** Only the qualified Wrangler's exact API endpoint/code establishes live absence. */
export function validateWranglerAbsentTarget(result,accountId,workerName) {
 const endpoint='/accounts/'+accountId+'/workers/scripts/'+workerName+'/deployments';
 const text=(String(result?.stdout??'')+'\n'+String(result?.stderr??'')).replace(/\x1b\[[0-9;]*m/g,'');
 const codes=[...text.matchAll(/\[code:\s*(\d+)\]/g)].map(match=>Number(match[1]));
 assert(accountId===SINGLETON_ACCOUNT&&/^[a-z][a-z0-9-]{0,62}$/.test(workerName)&&!result?.error&&!result?.signal&&result?.status===1&&
  text.includes('A request to the Cloudflare API ('+endpoint+') failed.')&&codes.length===1&&codes[0]===10007,
  'Authenticated exact Worker absence was not established; existing targets, auth/network failures and unknown errors are refused');
 return {endpoint,errorCode:10007,checkedAt:new Date().toISOString(),evidence:'qualified-wrangler-read-only-absence-probe'};
}

/** Uses standard GitHub environment/profile authentication; never exports credentials. */
export async function githubJson(endpoint) {
 assert(/^repos\/darkapoparka\/[-a-z0-9]+\//.test(endpoint),'Unexpected GitHub metadata endpoint');
 if(process.env.GH_TOKEN||process.env.GITHUB_TOKEN){
  const response=await fetch('https://api.github.com/'+endpoint,{headers:{Accept:'application/vnd.github+json',Authorization:'Bearer '+(process.env.GH_TOKEN||process.env.GITHUB_TOKEN),'X-GitHub-Api-Version':'2022-11-28'},signal:AbortSignal.timeout(30000)});
  assert(response.ok,'Authenticated GitHub metadata request failed: '+response.status);return response.json();
 }
 const result=spawnSync('gh',['api',endpoint],{encoding:'utf8',timeout:30000,windowsHide:true,maxBuffer:8*1024**2});
 assert(!result.error&&result.status===0,'Authenticated GitHub metadata is unavailable; use the standard GitHub profile/environment');return JSON.parse(result.stdout);
}

export async function readSingletonRemoteMetadata(review,record,read=githubJson) {
 const [run,artifact]=await Promise.all([read('repos/darkapoparka/cars/actions/runs/'+review.runId),read('repos/darkapoparka/cars/actions/artifacts/'+review.artifactId)]);
 const repository=record.sourceOwnership==='independent-repository'?record.repository:record.canonicalSourceRepository||'darkapoparka/cars';
 const [commit,comparison,main]=await Promise.all([read('repos/'+repository+'/commits/'+review.sourceCommit),read('repos/'+repository+'/compare/'+review.sourceCommit+'...main'),read('repos/'+repository+'/commits/main')]);
 assert(commit.sha===review.sourceCommit&&comparison.base_commit?.sha===review.sourceCommit&&['ahead','identical'].includes(comparison.status)&&hex40(main.sha),'Canonical source is not reachable from current main');
 let sourceTree=commit.commit?.tree?.sha;
 if(record.sourceOwnership!=='independent-repository'){
  const root=await read('repos/'+repository+'/git/trees/'+sourceTree),clients=root.tree?.find(r=>r.path==='clients'&&r.type==='tree');assert(clients,'Published Cars source has no clients tree');
  const dealers=await read('repos/'+repository+'/git/trees/'+clients.sha);sourceTree=dealers.tree?.find(r=>r.path===review.client&&r.type==='tree')?.sha;
 }
 return {run,artifact,sourceProof:{repository,commit:commit.sha,sourceTree,ref:'refs/heads/main',mainCommit:main.sha,mainReachable:true}};
}

export async function inspectFleetSingleton({reviewFile,mode='update-existing',root=ROOT,registry=json(path.join(root,'docs/DEPLOYMENT-INVENTORY.json')),readMetadata=readSingletonRemoteMetadata,originalArchiveBytes}={}) {
 const absolute=path.resolve(reviewFile),bytes=fs.readFileSync(absolute),review=JSON.parse(bytes);
 assert(review.schemaVersion===1&&typeof review.reviewed==='boolean'&&(!review.reviewed||Number.isFinite(Date.parse(review.reviewedAt)))&&review.accountId===SINGLETON_ACCOUNT&&
  hex40(review.sourceCommit)&&hex40(review.sourceTree)&&hex64(review.inputDigest)&&hex64(review.outputDigest)&&hex64(review.artifactDigest),'Explicit fleet review and exact source/artifact pins are required');
 deploymentMode(mode,review);
 const capacity=validateSingletonCapacity(review.providerSnapshot);
 if(review.canonicalExposure){assert(mode==='update-existing','Canonical exposure supports existing Workers only');validateCanonicalExposureLease(review.canonicalExposure,review);}
 const archiveMode=review.archiveMode??'file';assert(['file','original-byte-buffer'].includes(archiveMode),'Unsupported original archive input mode');
 const memory=archiveMode==='original-byte-buffer';
 assert(memory?Buffer.isBuffer(originalArchiveBytes)&&review.archive===undefined:originalArchiveBytes===undefined,'Explicit original ZIP buffer mode must not substitute a file path or absent bytes');
 const originalArchive=memory?originalArchiveBytes:review.archive;
 for(const key of memory?['directory']:['archive','directory'])assert(typeof review[key]==='string'&&path.isAbsolute(review[key]),'Use an exact absolute '+key+' path');
 assert(review.archive!==review.directory,'Archive and extracted output must be distinct');
 const sealed=verifyFleetSingletonDirectory(review.directory),{receipt,delivery,inventory}=sealed;
 const registered=registeredCompositionIdentity(registry,review.client,{...review,variants:sealed.review.variants});
 assert(registered.record.sourceOwnership!=='independent-repository'&&sealed.review.sourceRepository==='darkapoparka/cars','Independent fleet singleton requires separate own-repository compiled receipts');
 for(const key of ['sourceCommit','sourceTree','inputDigest','sourceReleases','outputDigest','workerName','publicOrigin'])assert(canonical(review[key])===canonical(receipt[key]),'Approved singleton pin differs: '+key);
 assert(receipt.dealer===review.client&&String(receipt.runId)===String(review.runId)&&String(receipt.attempt)===String(review.attempt)&&inventory.digest===review.artifactDigest&&delivery.repository===review.repository,'Approved dealer/run/inventory differs');
 const remote=await readMetadata(review,registered.record);validateSingletonGitHubBuild(remote,review);
 const archive=await hashArchive(originalArchive);assert(archive.bytes===remote.artifact.size_in_bytes&&'sha256:'+archive.sha256===remote.artifact.digest,'Original GitHub archive bytes differ');
 for(const name of ['artifact-manifest.json','single-worker-receipt.json','dealer-composition-review.json','delivery-receipt.json','wrangler.json'])assert(readZipReceipt(originalArchive,name).equals(fs.readFileSync(inside(review.directory,name,{mustExist:true}))),'Extracted singleton receipt differs from original archive: '+name);
 const composition=receipt.canonicalComposition??null;
 assert(canonical(review.canonicalComposition??null)===canonical(composition),'Reviewed canonical composition differs from the sealed artifact');
 if(review.canonicalExposure)assert(composition&&composition.providerOrigin===review.canonicalExposure.providerOrigin&&composition.canonicalOrigin===review.canonicalExposure.canonicalOrigin,'Canonical exposure requires the matching sealed canonical wrapper composition');
 if(composition)for(const name of ['server/worker.mjs',composition.originalWorkerPath])assert(readZipReceipt(originalArchive,name).equals(fs.readFileSync(inside(review.directory,name,{mustExist:true}))),'Extracted canonical Worker bytes differ from original archive: '+name);
 const sourcePublication=validateSourcePublication(review.sourcePublication,remote.sourceProof,receipt,registered.record);
 if(mode==='create-singleton')validateAbsentSingletonTarget(review.providerSnapshot,receipt.workerName,receipt.publicOrigin);
 return {reviewFile:absolute,reviewSha256:sha256(bytes),review,sealed,remote,sourcePublication,plan:{schemaVersion:1,type:'cars-existing-fleet-single-worker-inspection',client:review.client,repository:review.repository,
  sourcePublication,privatePublishingMirror:{...(review.privatePublishingMirror??{repository:review.repository,state:'not-verified-by-this-bridge'}),verifiedByBridge:false},accountId:SINGLETON_ACCOUNT,workerName:receipt.workerName,publicOrigin:receipt.publicOrigin,
  sourceCommit:receipt.sourceCommit,sourceTree:receipt.sourceTree,inputDigest:receipt.inputDigest,sourceReleases:receipt.sourceReleases,runId:review.runId,attempt:review.attempt,artifactId:review.artifactId,
  archiveMode,archiveDigest:review.archiveDigest,artifactDigest:inventory.digest,outputDigest:receipt.outputDigest,applicationCount:6,workerCount:1,serviceBindings:[],deploymentMode:mode,readyToDeploy:review.reviewed,
  ...(composition?{canonicalComposition:composition}:{}),...(review.canonicalExposure?{canonicalExposure:review.canonicalExposure,requiresLiveExposureReader:true}:{}),capacity,minimumSpareScripts:mode==='create-singleton'?capacity.minimumSpareScripts:null,deployments:0,hostedVerified:false,ownerAccepted:false}};
}

export function localWrangler({toolPackage,accountId=SINGLETON_ACCOUNT}={}) {
 assert(process.version==='v'+SINGLETON_TOOLCHAIN.node&&path.isAbsolute(toolPackage),'Use Node26.10.0 and the existing qualified absolute Wrangler package.json');
 const pkg=json(toolPackage),entry=path.join(path.dirname(toolPackage),'wrangler-dist/cli.js');assert(pkg.name==='wrangler'&&pkg.version===SINGLETON_TOOLCHAIN.wrangler&&fs.statSync(entry).isFile(),'Existing Wrangler differs from the qualified uploader');
 const tool={node:process.version,version:pkg.version,packageSha256:sha256(fs.readFileSync(toolPackage)),entrySha256:sha256(fs.readFileSync(entry)),authentication:'standard-wrangler-profile-or-environment'};
 let lastDeploymentOutput;
 const run=(args,{structuredOutput,captureFailure=false}={})=>{
  const env={...process.env};for(const key of Object.keys(env))if(/^(?:GH_TOKEN|GITHUB_TOKEN|WRANGLER_(?:OUTPUT_FILE_PATH|OUTPUT_FILE_DIRECTORY|LOG|LOG_PATH|CACHE_DIR)|(?:CLOUDFLARE|CF)_ACCOUNT_ID)$/i.test(key))delete env[key];
  Object.assign(env,{CLOUDFLARE_ACCOUNT_ID:accountId,WRANGLER_SEND_METRICS:'false',WRANGLER_LOG_SANITIZE:'true',NO_COLOR:'1'});if(structuredOutput)env.WRANGLER_OUTPUT_FILE_PATH=structuredOutput;
  const result=spawnSync(process.execPath,['--no-warnings','--preserve-symlinks','--preserve-symlinks-main',entry,...args],{encoding:'utf8',env,windowsHide:true,timeout:30*60*1000,maxBuffer:16*1024**2});
  if(captureFailure)return result;
  assert(!result.error&&result.status===0,'Wrangler failed; reconcile any partial upload before retry');return result.stdout;
 };
 return {tool,
  snapshot(review,{versionId}={}){
   const auth=JSON.parse(run(['whoami','--json']));assert(auth.loggedIn===true&&auth.accounts?.some(a=>a.id===accountId),'Wrangler authentication does not include the target account');
   const config=path.join(review.directory,'wrangler.json'),listArgs=['deployments','list','--name',review.workerName,'--config',config,'--json'];
   if(review.deploymentMode==='create-singleton'&&!versionId){
    const absent=validateAbsentSingletonTarget(review.providerSnapshot,review.workerName,review.publicOrigin);
    const absenceProbe=validateWranglerAbsentTarget(run(listArgs,{captureFailure:true}),accountId,review.workerName);
    return {...absent,absenceProbe,resourceSnapshotCheckedAt:absent.checkedAt,scriptCountVerifiedAfter:false};
   }
   const deployments=JSON.parse(run(listArgs));
   const current=[...deployments].sort((a,b)=>Date.parse(b.created_on)-Date.parse(a.created_on))[0];assert(current?.versions?.length===1&&current.versions[0].percentage===100,'Existing Worker needs one active deployment');
   const active=current.versions[0].version_id;if(versionId)activeDeployment(deployments,versionId);
   const version=JSON.parse(run(['versions','view',active,'--name',review.workerName,'--config',config,'--json']));
   assert(version.id===active&&canonical(version.resources?.script?.handlers)===canonical(['fetch']),'Worker has unexpected handlers');
   const creating=review.deploymentMode==='create-singleton';
   if(creating)assert(lastDeploymentOutput?.version_id===versionId&&canonical(lastDeploymentOutput.targets)===canonical([review.publicOrigin]),'New Worker upload did not expose only the reviewed workers.dev origin');
   const snapshot={...review.providerSnapshot,checkedAt:new Date().toISOString(),versionId:active,versionTraffic:current.versions,bindings:version.resources?.bindings,handlers:version.resources?.script?.handlers,accountId,workerName:review.workerName,exists:true,...(creating?{workersDev:true,publicOrigin:review.publicOrigin,exposureEvidence:'qualified-wrangler-deployment-targets'}:{})};
   // Connector snapshot carries live route/domain/schedule/subdomain/count evidence not returned by version view.
   assert(review.providerSnapshot?.evidence==='authenticated-cloudflare-connector'&&Date.now()-Date.parse(review.providerSnapshot.checkedAt)>=0&&Date.now()-Date.parse(review.providerSnapshot.checkedAt)<=15*60*1000,'Refresh the connected Cloudflare route/resource snapshot before upload');
   if(!versionId)assert(review.providerSnapshot.versionId===active,'Worker advanced since the connected provider review');
   return {...snapshot,deploymentId:current.id,resourceSnapshotCheckedAt:review.providerSnapshot.checkedAt,scriptCountVerifiedAfter:false};
  },
  upload(review,reportDirectory){
   const output=path.join(reportDirectory,'deploy.jsonl');assert(!fs.existsSync(output),'Prior deployment output requires reconciliation');
   run(['deploy','--no-bundle','--config',path.join(review.directory,'wrangler.json'),'--outdir',path.join(reportDirectory,'wrangler-output')],{structuredOutput:output});
   lastDeploymentOutput=parseWranglerDeploymentOutput(fs.readFileSync(output,'utf8'),review.workerName,pkg.version);return lastDeploymentOutput;
  }
 };
}

export async function runFleetSingletonDeployment({reviewFile,write=false,mode='update-existing',root=ROOT,registry,readMetadata,provider,toolPackage,originalArchiveBytes,readExposure}={}) {
 const context=await inspectFleetSingleton({reviewFile,mode,root,registry,readMetadata,originalArchiveBytes});
 if(context.review.canonicalExposure)assert(typeof readExposure==='function','Canonical exposure requires a live authenticated readExposure callback; the default CLI refuses');
 if(!write)return context.plan;
 assert(context.review.reviewed===true,'Upload requires explicit dated review of this exact sealed artifact');
 const review=context.review,uploader=provider??localWrangler({toolPackage});
 assert(uploader.tool?.version===SINGLETON_TOOLCHAIN.wrangler,'Uploader differs from qualified Wrangler');
 const base=inside(root,'runtime',{mustExist:true}),reports=path.join(base,'dealer-single-worker-deployments');fs.mkdirSync(reports,{recursive:true});
 const report=inside(reports,review.client+'-'+review.runId+'-'+review.attempt+'-'+review.outputDigest.slice(0,12));
 assert(!fs.existsSync(report),'An earlier deployment attempt requires live reconciliation before retry');
 const creating=mode==='create-singleton',validateBefore=snapshot=>creating?validateAbsentSingletonTarget(snapshot,review.workerName,review.publicOrigin):validateCurrentSingletonTarget(snapshot,review.workerName,{canonicalExposure:review.canonicalExposure});
 const snapshotFor=async(stage,versionId)=>{const notBefore=new Date().toISOString(),snapshot=await uploader.snapshot(review,versionId?{versionId}:{});
  return review.canonicalExposure?readCanonicalExposureSnapshot({snapshot,review,readExposure,stage,notBefore}):snapshot;};
 const before=validateBefore(await snapshotFor('before'));
 assert(capacityPins(before)===capacityPins(review.providerSnapshot),'Worker allowance evidence changed since the exact provider review');
 if(creating)assert(absentTargetPins(before)===absentTargetPins(review.providerSnapshot),'Absent target/capacity changed since the exact provider review');
 const lock=path.join(reports,'deployment.lock');const fd=fs.openSync(lock,'wx');fs.writeSync(fd,JSON.stringify({pid:process.pid,workerName:review.workerName}));fs.closeSync(fd);
 try{
  fs.mkdirSync(report);writeNew(path.join(report,'started.json'),{...context.plan,status:'started',startedAt:new Date().toISOString(),reviewSha256:context.reviewSha256,tool:uploader.tool,rollback:before});
  assert(sha256(fs.readFileSync(context.reviewFile))===context.reviewSha256,'Reviewed deployment input changed');
  const sealed=verifyFleetSingletonDirectory(review.directory);assert(sealed.inventory.digest===review.artifactDigest,'Sealed output changed before upload');
  const fresh=validateBefore(await snapshotFor('locked'));
  assert(capacityPins(fresh)===capacityPins(before),'Worker allowance evidence changed before upload');
  if(creating)assert(absentTargetPins(fresh)===absentTargetPins(before),'Absent target/capacity changed before upload');
  else assert(fresh.versionId===before.versionId,'Public Worker advanced before upload');
  if(review.archiveMode==='original-byte-buffer'){const original=await hashArchive(originalArchiveBytes);assert(original.bytes===context.remote.artifact.size_in_bytes&&'sha256:'+original.sha256===context.remote.artifact.digest,'Original GitHub archive bytes changed before upload');}
  const deployed=await uploader.upload(review,report);assert(uuid(deployed.version_id)&&deployed.worker_name===review.workerName,'Uploader returned another Worker/version');
  if(creating)assert(canonical(deployed.targets)===canonical([review.publicOrigin]),'New Worker upload exposed another target or origin');
  const after=validateCurrentSingletonTarget(await snapshotFor('after',deployed.version_id),review.workerName,{after:true,versionId:deployed.version_id,canonicalExposure:review.canonicalExposure});
  assert(capacityPins(after)===capacityPins(before),'Worker allowance evidence changed during upload; reconcile the deployment');
  assert(verifyFleetSingletonDirectory(review.directory).inventory.digest===review.artifactDigest,'Output changed during upload');
  const receipt={...context.plan,type:'cars-existing-fleet-single-worker-deployment',status:'deployed',deployments:1,versionId:deployed.version_id,deploymentId:after.deploymentId,versionTraffic:after.versionTraffic,
   liveBindings:after.bindings,scriptCountSnapshot:{count:before.scriptCount,allowed:before.allowedScripts,checkedAt:before.resourceSnapshotCheckedAt??before.checkedAt,evidence:before.evidence,capacity:validateSingletonCapacity(before)},scriptCountVerifiedAfter:false,
   ...(creating?{creationEvidence:{absentBefore:true,scriptInventorySha256:sha256(canonical(before.scriptInventory)),checkedAt:before.checkedAt,expectedScriptCountAfter:before.scriptCount+1,minimumSpareScripts:validateSingletonCapacity(before).minimumSpareScripts,expectedSpareScriptsAfter:before.allowedScripts-before.scriptCount-1,scriptCountVerifiedAfter:false,absenceProbe:before.absenceProbe??null}}:{}),
   ...(review.canonicalExposure?{exposurePreservation:{canonicalOrigin:review.canonicalExposure.canonicalOrigin,zoneId:review.canonicalExposure.zoneId,routeId:review.canonicalExposure.routeId,before:before.canonicalExposureRead,locked:fresh.canonicalExposureRead,after:after.canonicalExposureRead}}:{}),rollback:before,reviewSha256:context.reviewSha256,tool:uploader.tool,finishedAt:new Date().toISOString(),hostedVerified:false,ownerAccepted:false};
  writeNew(path.join(report,'deployment.json'),receipt);return {...receipt,receiptFile:path.join(report,'deployment.json')};
 }catch(error){if(fs.existsSync(report)&&!fs.existsSync(path.join(report,'needs-reconciliation.json')))writeNew(path.join(report,'needs-reconciliation.json'),{status:'needs-reconciliation',workerName:review.workerName,error:error.message,at:new Date().toISOString()});throw error;
 }finally{fs.unlinkSync(lock);}
}

export function readDealerPackBatch(batchFile){
 const slugs=json(batchFile);
 assert(Array.isArray(slugs)&&slugs.length>0&&slugs.length<=400&&slugs.every(slug=>typeof slug==='string'&&slug.length<=63&&/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug))&&new Set(slugs).size===slugs.length,
  'Batch must be a JSON array of 1 to 400 distinct dealer slugs');
 return slugs;
}

/** M1 candidates may be inspected on their real branch/run; this never grants deployment approval. */
export async function inspectDealerPackBatch({batchFile,bundleRoot,plan,reportFile,write=false,root=ROOT,loadPack}={}){
 assert(write===false,'Dealer pack batch --write is unavailable until the separately authorized M2 deployment');
 assert(['free','paid'].includes(plan),'Batch inspection requires an explicit --plan free or paid build target');
 const slugs=readDealerPackBatch(batchFile),base=path.resolve(bundleRoot??path.join(root,'runtime/dealer-packs'));
 const {inspectDealerPackBundle}=await import('./verify-dealer-pack.mjs');
 if(!loadPack)({loadDealerPack:loadPack}=await import('./lib/dealer-pack.mjs'));
 const result={schemaVersion:1,type:'cars-dealer-pack-batch-inspection',startedAt:new Date().toISOString(),targetPlan:plan,success:false,
  deployments:0,providerWrites:0,readyToDeploy:false,hostedVerified:false,ownerAccepted:false,results:[],
  qualification:{sourcePublication:'not-verified-by-candidate-inspection',workersPlan:'not-verified',capacity:'not-verified',routes:'not-changed',
   note:'This verifies local candidate bytes and bound build/QA reports. It is not a main-branch publication proof, a live provider inventory, or deployment authorization.'}};
 for(const slug of slugs)try{
  const pack=await loadPack(root,slug),directory=inside(base,slug+'/bundle',{mustExist:true});
  const context=inspectDealerPackBundle({bundleRoot:directory,slug,packDigest:pack.packDigest,releaseDigest:pack.releaseDigest??pack.manifest.releaseDigest,sourceReleases:pack.manifest.templateSources,plan});
  const parent=path.dirname(directory),build=json(inside(parent,'build-report.json',{mustExist:true})),qa=json(inside(parent,'qa-report.json',{mustExist:true})),receipt=context.receipt;
  const bound=value=>value&&value.slug===slug&&value.packDigest===receipt.packDigest&&value.releaseDigest===receipt.releaseDigest&&value.outputDigest===receipt.outputDigest&&canonical(value.execution)===canonical(receipt.execution)&&value.packCompositionDigest===receipt.packCompositionDigest;
  assert(bound(build)&&build.status==='passed'&&canonical(build.packComposition)===canonical(receipt.packComposition),'Build report does not match the actual compiled candidate');
  assert(bound(qa)&&qa.type==='cars-dealer-pack-qa'&&qa.success===true&&Array.isArray(qa.checks)&&qa.checks.length>0&&qa.checks.every(row=>row.status==='passed'),
   'QA report is missing, failed, or does not match this candidate');
  for(const id of ['bundle-integrity','cloudflare-limits','fleet-contact-coverage','logo-assets','rendered-routes','screenshots','bundle-unchanged'])assert(qa.checks.filter(row=>row.id===id&&row.status==='passed').length===1,'Missing candidate QA gate: '+id);
  assert(qa.capacity?.targetPlan===plan&&context.capacity.status==='passed','QA or bundle budget differs from the requested target plan');
  assert(qa.proof?.screenshots?.length===18,'All six designs require 320/390/1280 screenshot evidence');
  const seen=new Set();
  for(const image of qa.proof.screenshots){
   assert(['auto-best','modern','import','app','mobile','karento-best'].includes(image.key)&&[320,390,1280].includes(image.width)&&!seen.has(image.key+':'+image.width)&&
    typeof image.path==='string'&&!path.isAbsolute(image.path)&&!image.path.includes('\\')&&!image.path.split('/').some(part=>!part||part==='.'||part==='..')&&hex64(image.sha256),'Invalid screenshot evidence');
   seen.add(image.key+':'+image.width);assert(sha256(fs.readFileSync(inside(parent,image.path,{mustExist:true})))===image.sha256,'Screenshot bytes changed: '+image.path);
  }
  result.results.push({slug,status:'passed',workerName:receipt.workerName,publicOrigin:receipt.publicOrigin,workerCount:1,applicationCount:6,serviceBindings:[],
   execution:receipt.execution,sourceCommit:receipt.sourceCommit,packDigest:receipt.packDigest,releaseDigest:receipt.releaseDigest,outputDigest:receipt.outputDigest,
   ...(receipt.packCompositionDigest!==undefined?{packCompositionDigest:receipt.packCompositionDigest}:{}),
   capacity:context.capacity,buildStatus:build.status,qaStatus:'passed',readyToDeploy:false,deployments:0});
 }catch(error){result.results.push({slug,status:'failed',reason:error.message,readyToDeploy:false,deployments:0});}
 result.success=result.results.every(row=>row.status==='passed');result.finishedAt=new Date().toISOString();
 if(reportFile){const target=path.resolve(reportFile);assert(!path.relative(base,target).split(path.sep).includes('bundle'),'Inspection report must stay outside sealed bundles');fs.mkdirSync(path.dirname(target),{recursive:true});fs.writeFileSync(target,JSON.stringify(result,null,2)+'\n');}
 return result;
}

export function parseDeploymentArgs(argv){
 const result={write:false},names={'--input':'reviewFile','--wrangler-package':'toolPackage','--mode':'mode','--batch':'batchFile','--bundle-root':'bundleRoot','--plan':'plan','--report':'reportFile'};
 for(let i=0;i<argv.length;i++){const key=argv[i];if(key==='--write'){assert(!result.write,'Repeated --write');result.write=true;}else{assert(names[key]&&argv[i+1]&&!argv[i+1].startsWith('--'),'Use --input REVIEW_JSON, or --batch SLUGS_JSON --bundle-root DIRECTORY --plan free|paid');const name=names[key];assert(!result[name],'Repeated '+key);result[name]=argv[++i];}}
 if(result.batchFile){assert(!result.write,'Dealer pack batch --write is unavailable until the separately authorized M2 deployment');assert(!result.reviewFile&&!result.toolPackage&&!result.mode,'Batch inspection cannot mix legacy deployment options');assert(result.bundleRoot&&['free','paid'].includes(result.plan),'Use --batch SLUGS_JSON --bundle-root DIRECTORY --plan free|paid');}
 else{assert(result.reviewFile&&!result.bundleRoot&&!result.plan&&!result.reportFile,'Use --input REVIEW_JSON [--mode create-singleton] [--write --wrangler-package ABS_PACKAGE_JSON]');if(result.mode)assert(['update-existing','create-singleton'].includes(result.mode),'Use update-existing or create-singleton mode');}
 return result;
}
async function runDeploymentCli(){
 if(process.argv.slice(2).includes('--help'))console.log('Usage: deploy-dealer-single-worker.mjs --input REVIEW_JSON [--mode create-singleton] [--write --wrangler-package ABS_PACKAGE_JSON]\nDefault: exact artifact/source inspection only; update-existing is the default target mode. Explicit create-singleton requires a fresh complete absent-target inventory. Reserve defaults to one slot; a concrete reviewed Paid-500 policy can explicitly use the final slot. Capacity defaults to 100; 500 requires fresh reviewed paid-plan evidence. --write uploads once with standard Wrangler authentication. No builds/downloads/dependent Workers.\nDealer-pack candidate inspection: --batch SLUGS_JSON --bundle-root runtime/dealer-packs --plan free|paid [--report PATH]. JSON arrays of slugs only; --write is rejected for candidate batches pending M2.');
 else{const options=parseDeploymentArgs(process.argv.slice(2)),result=await(options.batchFile?inspectDealerPackBatch(options):runFleetSingletonDeployment(options));console.log(JSON.stringify(result,null,2));if(options.batchFile&&!result.success)process.exitCode=1;}
}
// Batch QA imports hosted checks that reuse this module's deployment guards.
// Finish module evaluation before awaiting that graph so CLI inspection can run.
if(isEntrypoint(import.meta.url))runDeploymentCli().catch(error=>{console.error(error.message);process.exitCode=1;});
