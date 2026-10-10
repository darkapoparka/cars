import fs from 'node:fs';
import path from 'node:path';
import {spawnSync} from 'node:child_process';
import {fileURLToPath} from 'node:url';
import {ROOT,json,git,sha256,writeJson} from '../../scripts/lib/workflow.mjs';
import {downloadGitHubArchive,verifyArtifactDirectory} from '../../scripts/lib/uk-cloudflare-artifacts.mjs';
import {verifyPackageTree} from '../../scripts/export-dealer.mjs';

const SELF=fileURLToPath(import.meta.url),REPO='darkapoparka/cars';
const MANIFEST='leads/uk-2026-10-10-build-manifest.json';
const assert=(ok,message)=>{if(!ok)throw Error(message);};
const equal=(a,b)=>JSON.stringify(a)===JSON.stringify(b);
const exactSha=value=>/^[a-f0-9]{40}$/.test(value??'');
export function parseRuns(value){
 const values=String(value??'').split(',').map(x=>x.trim());
 assert(values.length>=1&&values.length<=10&&values.every(x=>/^[1-9][0-9]{0,14}$/.test(x))&&new Set(values).size===values.length,'Supply one to ten unique completed UK build run IDs.');
 return values;
}
export function selectTransport(run,index,batch){
 assert(run.repository?.full_name===REPO&&run.head_repository?.full_name===REPO&&run.head_branch==='main'&&run.event==='workflow_dispatch'&&run.path==='.github/workflows/build-uk-cloudflare.yml'&&run.status==='completed'&&run.conclusion==='success'&&exactSha(run.head_sha),'Source handoff requires a completed successful manual Cars main Cloudflare build.');
 assert(index.total_count===index.artifacts?.length&&index.total_count<=100,'Artifact list is incomplete.');
 const suffix='-'+run.id+'-'+run.run_attempt;
 const matches=batch.dealers.flatMap(dealer=>index.artifacts.filter(a=>a.name==='uk-cloudflare-source-'+dealer.slug+suffix).map(artifact=>({dealer,artifact})));
 assert(matches.length===1,'One exact reviewed UK source package must belong to this build.');
 const {dealer,artifact}=matches[0];
 const keys=Object.keys(batch.sourceReleases);
 const names=[artifact.name,'uk-cloudflare-review-'+dealer.slug+suffix,...[...keys,'router'].map(key=>'uk-cloudflare-compiled-'+dealer.slug+'-'+key+suffix)];
 for(const name of names){
  const rows=index.artifacts.filter(a=>a.name===name);
  assert(rows.length===1,'Missing or duplicate complete-build artifact: '+name);
  const a=rows[0];
  assert(a.expired===false&&Date.parse(a.expires_at)>Date.now()&&a.workflow_run?.id===run.id&&a.workflow_run?.head_sha===run.head_sha&&/^sha256:[a-f0-9]{64}$/.test(a.digest??''),'Expired or mismatched immutable build artifact: '+name);
 }
 return {dealer,artifact};
}
export function validateTransportIdentity(transport,dealer,run,batch){
 assert(transport.schemaVersion===1&&transport.dealer===dealer.slug&&transport.repository===dealer.repository&&transport.provider==='cloudflare'&&transport.publicOrigin===dealer.publicOrigin&&transport.workerName===dealer.workerName&&transport.sourceCommit===run.head_sha&&String(transport.runId)===String(run.id)&&String(transport.attempt)===String(run.run_attempt),'Source transport identity differs from its completed build.');
 assert(transport.ref==='refs/cars-ci/uk-cloudflare/'+run.id+'/'+run.run_attempt+'/'+dealer.slug&&exactSha(transport.transportCommit)&&exactSha(transport.packageTree)&&equal(transport.sourceReleases,batch.sourceReleases),'Transport source versions or immutable non-branch ref differ.');
 assert(transport.bundle?.path==='package.bundle'&&transport.transportOnly===true&&transport.privateExportRequired===true,'Use the original sealed source transport, not a replacement package.');
}
async function api(endpoint){
 const token=process.env.GH_TOKEN;assert(token,'This manual runner requires its scoped GitHub Actions token.');
 const response=await fetch('https://api.github.com/repos/'+REPO+'/'+endpoint,{headers:{Authorization:'Bearer '+token,Accept:'application/vnd.github+json','X-GitHub-Api-Version':'2026-03-10'},redirect:'error',signal:AbortSignal.timeout(45000)});
 assert(response.ok,'GitHub metadata read failed: HTTP '+response.status);return response.json();
}
function extract(archive,directory){
 const program=`import sys,zipfile,pathlib,stat,shutil
archive,destination=sys.argv[1:]
root=pathlib.Path(destination)
if root.exists(): raise RuntimeError('Extraction destination must be new')
with zipfile.ZipFile(archive) as z:
 entries=z.infolist(); seen=set(); total=0
 if not 1 <= len(entries) <= 100: raise RuntimeError('Unexpected source artifact member count')
 for e in entries:
  name=e.filename; clean=name[:-1] if name.endswith('/') else name
  parts=clean.split('/'); kind=(e.external_attr >> 16) & 0o170000
  if not clean or clean.startswith('/') or '\\\\' in clean or ':' in clean or any(p in ('','..','.') for p in parts) or any(ord(c)<32 for c in clean): raise RuntimeError('Unsafe ZIP path')
  if clean.lower() in seen or kind not in (0,stat.S_IFREG,stat.S_IFDIR) or e.flag_bits & 1: raise RuntimeError('Duplicate, linked or encrypted ZIP member')
  seen.add(clean.lower()); total+=e.file_size
  if not (clean in ('artifact-manifest.json','transport.json','package.bundle','receipts') or (len(parts)==2 and parts[0]=='receipts' and parts[1].endswith('.json'))): raise RuntimeError('Unexpected source artifact file')
  if e.file_size<0 or total>2147483648: raise RuntimeError('Source artifact exceeds 2 GiB')
 root.mkdir()
 for e in entries:
  target=root.joinpath(*e.filename.rstrip('/').split('/'))
  if e.is_dir(): target.mkdir(parents=True,exist_ok=True); continue
  target.parent.mkdir(parents=True,exist_ok=True)
  with z.open(e) as src, target.open('xb') as dst: shutil.copyfileobj(src,dst,1024*1024)
`;
 const result=spawnSync('python3',['-c',program,archive,directory],{encoding:'utf8',timeout:600000,maxBuffer:1024*1024});
 assert(!result.error&&result.status===0,'Bounded source extraction failed: '+(result.error?.message||result.stderr));
}
async function transportOne(runId,batch,area){
 const run=await api('actions/runs/'+runId),index=await api('actions/runs/'+runId+'/artifacts?per_page=100');
 const {dealer,artifact}=selectTransport(run,index,batch);
 const staging=path.join(area,'staging-'+runId),proof=path.join(area,'proof-'+runId);
 fs.mkdirSync(staging);fs.mkdirSync(proof);
 const archive=path.join(staging,'source.zip'),directory=path.join(staging,'source');
 console.log(JSON.stringify({phase:'receive-verified-build',dealer:dealer.slug,runId,artifactId:artifact.id}));
 const downloaded=await downloadGitHubArchive(artifact,archive,process.env.GH_TOKEN);
 extract(archive,directory);
 const inventory=verifyArtifactDirectory(directory),transport=json(path.join(directory,'transport.json'));
 assert(inventory.kind==='sealed-package-transport'&&inventory.status==='passed'&&inventory.dealer===dealer.slug,'Unexpected source inventory.');
 validateTransportIdentity(transport,dealer,run,batch);
 git(ROOT,['fetch','--filter=blob:none','--no-tags','origin',transport.sourceCommit]);
 const head=git(ROOT,['rev-parse','HEAD']);
 const bundle=path.join(directory,'package.bundle');
 git(ROOT,['bundle','verify',bundle]);
 assert(git(ROOT,['bundle','list-heads',bundle])===transport.transportCommit+' '+transport.ref,'Bundle advertised another ref.');
 git(ROOT,['fetch','--no-tags',bundle,transport.ref+':'+transport.ref]);
 assert(git(ROOT,['show','-s','--format=%T %P',transport.transportCommit])===transport.packageTree+' '+transport.sourceCommit,'Transport ancestry changed.');
 const checked=verifyPackageTree({root:ROOT,packageTree:transport.packageTree});
 assert(checked.digest===transport.packageDigest&&checked.meta.payloadDigest===transport.payloadDigest&&checked.meta.sourceCommit===run.head_sha&&checked.manifest.repository===dealer.repository,'Original sealed package verification failed.');
 const remote=git(ROOT,['ls-remote','origin',transport.ref]);
 assert(!remote||remote.split(/\s+/)[0]===transport.transportCommit,'An existing immutable transport ref differs; never overwrite it.');
 if(!remote)git(ROOT,['push','origin',transport.transportCommit+':'+transport.ref]);
 assert(git(ROOT,['ls-remote','origin',transport.ref]).split(/\s+/)[0]===transport.transportCommit,'Incremental source ref was not confirmed.');
 assert(git(ROOT,['rev-parse','HEAD'])===head,'Canonical checkout HEAD changed during artifact transport.');
 const receipt={schemaVersion:1,kind:'cars-uk-incremental-source-transport',dealer:dealer.slug,repository:REPO,publishingRepository:dealer.repository,
  sourceBuildRun:run.id,sourceBuildAttempt:run.run_attempt,sourceCommit:transport.sourceCommit,transportCommit:transport.transportCommit,ref:transport.ref,
  packageTree:transport.packageTree,packageDigest:transport.packageDigest,payloadDigest:transport.payloadDigest,sourceReleases:transport.sourceReleases,
  artifact:{id:artifact.id,name:artifact.name,digest:artifact.digest,bytes:artifact.size_in_bytes,expiresAt:artifact.expires_at},archive:downloaded,
  transportSha256:sha256(fs.readFileSync(path.join(directory,'transport.json'))),inventorySha256:sha256(fs.readFileSync(path.join(directory,'artifact-manifest.json'))),
  verifiedAt:new Date().toISOString(),sourceRefPublished:true,mainMoved:false,newBranch:false,privatePublicationRequired:true,cloudflareDeployed:false};
 for(const name of ['transport.json','artifact-manifest.json'])fs.copyFileSync(path.join(directory,name),path.join(proof,name));
 writeJson(path.join(proof,'source-transport.json'),receipt);
 // Only this freshly created, hash-verified CI staging directory is released.
 fs.rmSync(staging,{recursive:true,force:false});
 console.log(JSON.stringify({phase:'incremental-source-ready',dealer:dealer.slug,ref:transport.ref,commit:transport.transportCommit,packageDigest:transport.packageDigest}));
 return receipt;
}
async function main(){
 assert(process.platform==='linux'&&process.env.GITHUB_ACTIONS==='true'&&process.env.GITHUB_EVENT_NAME==='workflow_dispatch'&&process.env.GITHUB_REPOSITORY===REPO&&process.env.GITHUB_REF==='refs/heads/main','Run only through the scoped manual Cars main source transport workflow.');
 const runs=parseRuns(process.env.UK_BUILD_RUNS),batch=json(path.join(ROOT,MANIFEST));
 const area=path.join(ROOT,'runtime/uk-git-source-transport',process.env.GITHUB_RUN_ID+'-'+process.env.GITHUB_RUN_ATTEMPT);
 assert(!fs.existsSync(area),'A prior handoff exists; use another reviewed workflow attempt.');fs.mkdirSync(area,{recursive:true});
 const results=[];for(const id of runs)results.push(await transportOne(id,batch,area));
 writeJson(path.join(area,'summary.json'),{schemaVersion:1,results,privatePublishingPending:true,cloudflareDeployed:false});
}
if(process.argv[1]&&path.resolve(process.argv[1])===SELF)main().catch(error=>{console.error(error.stack);process.exitCode=1;});
