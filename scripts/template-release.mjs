import fs from 'node:fs';
import path from 'node:path';
import {gitRead} from './workspace-doctor.mjs';
import { nativeLocaleSources } from './lib/dealer-locale.mjs';
import { validateNativeRelease } from './lib/native-localization.mjs';
import {ROOT,POLICY,args,json,writeJson,git,inside,fingerprint,fingerprintCommit,exportCommit,gitFiles} from './lib/workflow.mjs';
import { isCarsTemplateSource } from './lib/template-source.mjs';

export function verifyTemplate(root,key){
 const lock=json(path.join(root,'templates.lock.json')),entry=lock.templates[key];
 if(!entry)throw new Error(`No release lock for ${key}. Run template-release status.`);
 if(entry.status!=='approved')throw new Error(`${key}: ${entry.status}. Reconcile and verify a release before building new leads.`);
 if(!/^[a-f0-9]{40}$/.test(entry.commit||'')||entry.exportPolicy!==POLICY)throw new Error(`${key}: invalid commit or export policy.`);
 const source=entry.source;
 if(source){
  if(!isCarsTemplateSource(source)||source.path!==`templates/${key}`||source.path!==entry.snapshotPath||source.repository!==entry.repository||source.revision!==entry.commit||source.digest!==entry.digest)throw new Error(`${key}: invalid Cars subtree source descriptor.`);
  if(git(root,['merge-base','--is-ancestor',source.revision,'HEAD'],{allowFailure:true})===null)throw new Error(`${key}: Cars source revision is not committed on main.`);
  const actualTree=git(root,['rev-parse',`${source.revision}:${source.path}`]);
  if(actualTree!==source.tree)throw new Error(`${key}: Cars subtree tree mismatch (expected ${source.tree}, found ${actualTree}).`);
  const actual=fingerprintCommit(root,source.revision,{prefix:source.path});
  if(actual.digest!==entry.digest)throw new Error(`${key}: immutable Cars source digest mismatch (expected ${entry.digest}, found ${actual.digest}).`);
  inside(root,entry.snapshotPath,{mustExist:true});
 }else{
  if(entry.repository!==`darkapoparka/cars-template-${key}`)throw new Error(`${key}: missing exact Cars source descriptor or invalid legacy repository.`);
  const actual=fingerprint(inside(root,entry.snapshotPath,{mustExist:true}));
  if(actual.digest!==entry.digest)throw new Error(`${key}: snapshot drift (expected ${entry.digest}, found ${actual.digest}). Preserve edits; do not overwrite.`);
 }
 return entry;
}
export function selectedTemplateSource(entry){
 if(entry?.source)return entry.source;
 return {repository:entry?.repository,revision:entry?.commit,path:'',tree:null,digest:entry?.digest};
}
export function templateDevelopmentState(root,key,entry,developmentHead,{readGit=gitRead}={}){
 const source=selectedTemplateSource(entry);
 if(source.repository==='darkapoparka/cars'){
  const developmentTree=readGit(root,['rev-parse',`${developmentHead}:${source.path}`]);
  return{developmentHead,developmentTree,updateAvailable:developmentTree!==source.tree};
 }
 return{developmentHead,developmentTree:null,updateAvailable:developmentHead!==source.revision};
}
export function releaseStatus(root){
 const lock=json(path.join(root,'templates.lock.json'));
 return Object.entries(lock.templates).map(([key,entry])=>{
  let integrity='unchecked',working='unchecked';
  try{verifyTemplate(root,key);integrity='matches';}catch(error){integrity=error.message;}
  try{working=fingerprint(inside(root,entry.snapshotPath,{mustExist:true})).digest===entry.digest?'matches-approved-source':'development-changes';}catch(error){working=error.message;}
  return{key,status:entry.status,repository:entry.repository,commit:entry.commit,source:entry.source||null,snapshot:entry.snapshotPath,integrity,working};
 });
}

// Select a reviewed commit already published from Cars. No template folder is copied or replaced.
export function approveCarsTemplate({root=ROOT,key,commit,evidence,write=false}) {
 if(!['auto-best','modern','carwow','import'].includes(key))throw new Error('Select one of the four Cars templates.');
 if(!/^[a-f0-9]{40}$/.test(commit||''))throw new Error('Supply an immutable 40-character Cars commit SHA.');
 const remote=git(root,['remote','get-url','origin']).replace(/\.git$/,'').replace(/^git@github.com:/,'https://github.com/');
 if(remote!=='https://github.com/darkapoparka/cars'||git(root,['branch','--show-current'])!=='main')throw new Error('Approve template releases from the Cars main checkout.');
 for(const ref of ['HEAD','refs/remotes/origin/main']) {
  if(git(root,['merge-base','--is-ancestor',commit,ref],{allowFailure:true})===null)throw new Error(`Template source is not published on Cars main: ${ref}`);
 }
 const lockFile=path.join(root,'templates.lock.json'),before=fs.readFileSync(lockFile),lock=JSON.parse(before),prior=lock.templates[key];
 if(!prior)throw new Error(`No existing release entry for ${key}.`);
 const prefix=`templates/${key}`,actual=fingerprintCommit(root,commit,{prefix});
 if(!actual.files.some(f=>f.path==='package.json'))throw new Error(`${key}: missing template application at the selected commit.`);
 const source={repository:'darkapoparka/cars',revision:commit,path:prefix,
  tree:git(root,['rev-parse',`${commit}:${prefix}`]),digest:actual.digest};
 const report={key,source,previousSource:selectedTemplateSource(prior),write,files:actual.files.length,
  changesWorkingFiles:false,changesDealers:false};
 if(!evidence) {
  if(write)throw new Error('Writing requires exact-source QA in --evidence.');
  return {...report,ready:false,reason:'Supply exact-source QA evidence to approve this release.'};
 }
 const evidenceFile=inside(root,path.relative(root,path.resolve(evidence)),{mustExist:true});
 const qa=json(evidenceFile);
 if(qa.repository!==source.repository||qa.commit!==commit||qa.sourcePath!==prefix||
    qa.sourceTree!==source.tree||qa.sourceDigest!==source.digest||qa.approved!==true||
    !Number.isFinite(Date.parse(qa.verifiedAt))||!qa.runtime||!qa.checks?.length||
    qa.checks.some(c=>c.status!=='passed')||!qa.standalone?.mobile||!qa.standalone?.desktop) {
  throw new Error('Evidence must bind passed checks and mobile/desktop QA to this exact Cars commit, subtree and digest.');
 }
 const entry={...prior,status:'approved',repository:source.repository,commit,source,snapshotPath:prefix,
  digest:source.digest,exportPolicy:POLICY,release:qa.release||null,
  reason:'Reviewed immutable Cars template source; dealer adoption is explicit.',
  runtime:qa.runtime,modes:qa.modes||{standalone:'verified',mounted:'requires-dealer-QA'},
  qa:{evidence:path.relative(root,evidenceFile).replaceAll('\\','/'),verifiedAt:qa.verifiedAt,
    checks:qa.checks,standalone:qa.standalone,...(qa.nativeLocalization?{nativeLocalization:qa.nativeLocalization}:{})}};
 if(!prior.source&&!prior.legacySource)entry.legacySource={...selectedTemplateSource(prior),
  evidence:prior.qa?.evidence||null,nativeDeployment:prior.qa?.nativeLocalization?.deployment||null};
 const sourceFiles=new Map(gitFiles(root,commit,{prefix}).map(f=>[f.path,Buffer.alloc(0)]));
 if(nativeLocaleSources(sourceFiles).length||qa.nativeLocalization)validateNativeRelease(key,entry);
 if(write) {
  if(!fs.readFileSync(lockFile).equals(before))throw new Error('Release lock changed during review; preserve the newer selection.');
  lock.templates[key]=entry;
  const temp=path.join(path.dirname(lockFile),`.templates-lock-${process.pid}-${Date.now()}.tmp`);
  try {fs.writeFileSync(temp,JSON.stringify(lock,null,2)+'\n',{flag:'wx'});fs.renameSync(temp,lockFile);}
  finally {if(fs.existsSync(temp))fs.unlinkSync(temp);}
 }
 return {...report,ready:true,release:entry};
}


export function promoteTemplate({root=ROOT,key,sourceRepo,commit,evidence,expectedDigest,write=false}){
 const lockPath=path.join(root,'templates.lock.json'),initialLock=fs.readFileSync(lockPath),lock=JSON.parse(initialLock),prior=lock.templates[key];if(!prior)throw new Error(`Unknown template ${key}`);
 if(prior.source?.repository==='darkapoparka/cars')throw new Error('Cars subtree sources are edited in place; use the source review and lock approval workflow instead of snapshot promotion.');
 const repo=fs.realpathSync(sourceRepo),remote=git(repo,['config','--get','remote.origin.url']).replace(/\.git$/,'').replace(/^git@github.com:/,'https://github.com/');
 if(remote!==`https://github.com/${prior.repository}`)throw new Error('Upstream repository identity mismatch.');
 if(!/^[a-f0-9]{40}$/.test(commit||''))throw new Error('Supply --commit with the exact 40-character SHA.');
 git(repo,['fetch','origin']);
 const known=git(repo,['for-each-ref','--contains',commit,'--format=%(refname)','refs/remotes/origin','refs/tags']);if(!known)throw new Error('Commit is not reachable from a fetched upstream branch or tag.');
 const destination=inside(root,prior.snapshotPath,{mustExist:true}),before=fingerprint(destination);
 const expected=expectedDigest||prior.digest;if(!expected||before.digest!==expected)throw new Error('Snapshot has unexpected edits. Supply a reviewed baseline digest only for initial reconciliation.');
 const dirty=git(root,['status','--porcelain=v1','--untracked-files=all','--',prior.snapshotPath]).split('\n').filter(Boolean).filter(line=>!line.includes('/.template/'));
 if(dirty.length)throw new Error(`Snapshot has local changes (${dirty.length} paths). Reconcile them upstream before promotion.`);
 const area=inside(root,`runtime/template-releases/${key}/${commit}`);fs.mkdirSync(path.dirname(area),{recursive:true});
 const candidate=fs.mkdtempSync(area+'-');const exported=path.join(candidate,'snapshot');const after=exportCommit(repo,commit,exported);
 const oldMap=new Map(before.files.map(f=>[f.path,f.sha256])),newMap=new Map(after.files.map(f=>[f.path,f.sha256]));
 const changes=[...new Set([...oldMap.keys(),...newMap.keys()])].sort().filter(p=>oldMap.get(p)!==newMap.get(p)).map(p=>({path:p,change:!oldMap.has(p)?'add':!newMap.has(p)?'remove':'modify'}));
 const report={key,repository:prior.repository,commit,sourceRepo:repo,sourceDirty:Boolean(git(repo,['status','--porcelain=v1','-uno'])),before:before.digest,after:after.digest,changes,candidate:exported,write};
 writeJson(path.join(candidate,'proposal.json'),report);
 if(!write)return report;
 if(!evidence)throw new Error('Writing requires --evidence with QA for this exact commit.');
 const qa=json(evidence);if(qa.commit!==commit||qa.repository!==prior.repository||qa.approved!==true||!qa.checks?.length||!qa.standalone?.mobile||!qa.standalone?.desktop)throw new Error('Release evidence must name this upstream/commit, passed checks, mobile/desktop standalone verification, and explicit approved=true.');
 if(qa.checks.some(c=>c.status!=='passed'))throw new Error('Release has a failing or unknown required check.');
 if(nativeLocaleSources(new Map(),exported).length || qa.nativeLocalization) validateNativeRelease(key,{status:'approved',repository:prior.repository,commit,digest:after.digest,qa:{nativeLocalization:qa.nativeLocalization}});
 const promotionLock=inside(root,'runtime/template-releases/.promotion-lock');fs.mkdirSync(promotionLock);
 try {
 if(!fs.readFileSync(lockPath).equals(initialLock))throw new Error('Template release registry changed during proposal; preserve the competing release.');
 if(fingerprint(exported).digest!==after.digest)throw new Error('Exported release candidate changed during review.');
 if(fingerprint(destination).digest!==before.digest)throw new Error('Snapshot changed during proposal; retry after coordinating writers.');
 const backup=path.join(candidate,'previous-snapshot'),originalLock=fs.readFileSync(lockPath);fs.mkdirSync(backup,{recursive:true});
 const agentPath=path.join(destination,'AGENTS.md'),originalAgent=fs.existsSync(agentPath)?fs.readFileSync(agentPath):null;
 // Replace only reviewed source files. Excluded dependency/runtime/local metadata stays in place.
 const applied=[];
 try{for(const change of changes){const target=inside(destination,change.path),saved=inside(backup,change.path);fs.mkdirSync(path.dirname(saved),{recursive:true});if(fs.existsSync(target))fs.copyFileSync(target,saved);applied.push(change);if(change.change==='remove')fs.unlinkSync(target);else{fs.mkdirSync(path.dirname(target),{recursive:true});fs.copyFileSync(inside(exported,change.path,{mustExist:true}),target);}}
 const entry={...prior,status:'approved',reason:'Reviewed release selected by the recorded technical QA.',commit,release:qa.release||null,digest:after.digest,exportPolicy:POLICY,runtime:qa.runtime,modes:qa.modes||{standalone:'verified',mounted:'requires-dealer-QA'},qa:{evidence:path.relative(root,path.resolve(evidence)).replaceAll('\\','/'),verifiedAt:qa.verifiedAt,checks:qa.checks,standalone:qa.standalone,...(qa.nativeLocalization?{nativeLocalization:qa.nativeLocalization}:{})}};lock.templates[key]=entry;writeJson(lockPath,lock);
 fs.writeFileSync(path.join(destination,'AGENTS.md'),`# Managed ${key} snapshot\n\nReusable source belongs to [${prior.repository}](https://github.com/${prior.repository}). This copy is pinned to ${commit} by [templates.lock.json](../../templates.lock.json). Follow [Cars instructions](../../AGENTS.md). Shared polish belongs upstream; use [template release](../../docs/TEMPLATE-PROMOTION.md) to update this snapshot. Dealer work belongs under clients/. Technical references in this copy retain source context and are not new task orders.\n`);
 return{...report,backup,qa:entry.qa};
 }catch(error){for(const change of applied.reverse()){const target=inside(destination,change.path),saved=inside(backup,change.path);if(fs.existsSync(saved))fs.copyFileSync(saved,target);else if(fs.existsSync(target))fs.unlinkSync(target);}fs.writeFileSync(lockPath,originalLock);if(originalAgent)fs.writeFileSync(agentPath,originalAgent);else if(fs.existsSync(agentPath))fs.unlinkSync(agentPath);throw error;}
 } finally { fs.rmdirSync(promotionLock); }
}
async function main(){const [command,...argv]=process.argv.slice(2);if(!command||command==='--help'){console.log('Usage: node scripts/template-release.mjs status | verify [--key KEY] | discover | approve --key KEY --commit SHA [--evidence FILE --write] | promote --key KEY --source-repo PATH --commit SHA [--expected-digest HASH] [--evidence FILE --write]\nApprove selects an exact Cars subtree without copying templates or updating dealers. Promote is for legacy standalone recovery.');return;}
 const o=args(argv,['key','source-repo','commit','evidence','expected-digest'],['write']);
 if(command==='status')console.log(JSON.stringify(releaseStatus(ROOT),null,2));
 else if(command==='verify'){const keys=o.key?[o.key]:Object.keys(json(path.join(ROOT,'templates.lock.json')).templates);for(const key of keys)console.log(JSON.stringify({key,...verifyTemplate(ROOT,key)}));}
 else if(command==='discover'){const entries=Object.entries(json(path.join(ROOT,'templates.lock.json')).templates),needsCars=entries.some(([,e])=>e.source?.repository==='darkapoparka/cars');if(needsCars)gitRead(ROOT,['fetch','origin','main']);for(const[key,e]of entries){const repository=e.source?.repository||e.repository,revision=e.source?.revision||e.commit;const head=gitRead(ROOT,['ls-remote','--exit-code',`https://github.com/${repository}.git`,'refs/heads/main']).split(/\s/)[0],development=templateDevelopmentState(ROOT,key,e,head);console.log(JSON.stringify({key,approvedCommit:revision,...development,action:e.source?'Review the Cars subtree and approve its exact source after QA.':'Review in standalone template; no automatic promotion.'}));}}
 else if(command==='approve'){gitRead(ROOT,['fetch','origin','refs/heads/main:refs/remotes/origin/main']);console.log(JSON.stringify(approveCarsTemplate({key:o.key,commit:o.commit,evidence:o.evidence,write:!!o.write}),null,2));}
 else if(command==='promote')console.log(JSON.stringify(promoteTemplate({key:o.key,sourceRepo:o['source-repo'],commit:o.commit,evidence:o.evidence,expectedDigest:o['expected-digest'],write:!!o.write}),null,2));else throw new Error(`Unknown command ${command}`);
}
if(process.argv[1]&&path.resolve(process.argv[1])===import.meta.filename)main().catch(e=>{console.error(e.message);process.exitCode=1;});
