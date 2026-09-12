import fs from 'node:fs';
import path from 'node:path';
import {ROOT,POLICY,args,json,writeJson,git,inside,fingerprint,exportCommit} from './lib/workflow.mjs';

export function verifyTemplate(root,key){
 const lock=json(path.join(root,'templates.lock.json')),entry=lock.templates[key];
 if(!entry)throw new Error(`No release lock for ${key}. Run template-release status.`);
 if(entry.status!=='approved')throw new Error(`${key}: ${entry.status}. Reconcile and verify a release before building new leads.`);
 if(!/^[a-f0-9]{40}$/.test(entry.commit||'')||entry.exportPolicy!==POLICY)throw new Error(`${key}: invalid commit or export policy.`);
 const actual=fingerprint(inside(root,entry.snapshotPath,{mustExist:true}));
 if(actual.digest!==entry.digest)throw new Error(`${key}: snapshot drift (expected ${entry.digest}, found ${actual.digest}). Preserve edits; do not overwrite.`);
 return entry;
}
export function releaseStatus(root){const lock=json(path.join(root,'templates.lock.json'));return Object.entries(lock.templates).map(([key,e])=>{let integrity='unchecked';try{const actual=fingerprint(inside(root,e.snapshotPath,{mustExist:true}));integrity=actual.digest===e.digest?'matches':'drift';}catch(error){integrity=error.message;}return{key,status:e.status,repository:e.repository,commit:e.commit,snapshot:e.snapshotPath,integrity};});}

export function promoteTemplate({root=ROOT,key,sourceRepo,commit,evidence,expectedDigest,write=false}){
 const lockPath=path.join(root,'templates.lock.json'),lock=json(lockPath),prior=lock.templates[key];if(!prior)throw new Error(`Unknown template ${key}`);
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
 if(fingerprint(destination).digest!==before.digest)throw new Error('Snapshot changed during proposal; retry after coordinating writers.');
 const backup=path.join(candidate,'previous-snapshot'),originalLock=fs.readFileSync(lockPath);fs.mkdirSync(backup,{recursive:true});
 const agentPath=path.join(destination,'AGENTS.md'),originalAgent=fs.existsSync(agentPath)?fs.readFileSync(agentPath):null;
 // Replace only reviewed source files. Excluded dependency/runtime/local metadata stays in place.
 const applied=[];
 try{for(const change of changes){const target=inside(destination,change.path),saved=inside(backup,change.path);fs.mkdirSync(path.dirname(saved),{recursive:true});if(fs.existsSync(target))fs.copyFileSync(target,saved);applied.push(change);if(change.change==='remove')fs.unlinkSync(target);else{fs.mkdirSync(path.dirname(target),{recursive:true});fs.copyFileSync(inside(exported,change.path,{mustExist:true}),target);}}
 const entry={...prior,status:'approved',reason:'Reviewed release selected by the recorded technical QA.',commit,release:qa.release||null,digest:after.digest,exportPolicy:POLICY,runtime:qa.runtime,modes:qa.modes||{standalone:'verified',mounted:'requires-dealer-QA'},qa:{evidence:path.relative(root,path.resolve(evidence)).replaceAll('\\','/'),verifiedAt:qa.verifiedAt,checks:qa.checks,standalone:qa.standalone}};lock.templates[key]=entry;writeJson(lockPath,lock);
 fs.writeFileSync(path.join(destination,'AGENTS.md'),`# Managed ${key} snapshot\n\nReusable source belongs to [${prior.repository}](https://github.com/${prior.repository}). This copy is pinned to ${commit} by [templates.lock.json](../../templates.lock.json). Follow [Cars instructions](../../AGENTS.md). Shared polish belongs upstream; use [template release](../../docs/TEMPLATE-PROMOTION.md) to update this snapshot. Dealer work belongs under clients/. Technical references in this copy retain source context and are not new task orders.\n`);
 return{...report,backup,qa:entry.qa};
 }catch(error){for(const change of applied.reverse()){const target=inside(destination,change.path),saved=inside(backup,change.path);if(fs.existsSync(saved))fs.copyFileSync(saved,target);else if(fs.existsSync(target))fs.unlinkSync(target);}fs.writeFileSync(lockPath,originalLock);if(originalAgent)fs.writeFileSync(agentPath,originalAgent);else if(fs.existsSync(agentPath))fs.unlinkSync(agentPath);throw error;}
}
async function main(){const [command,...argv]=process.argv.slice(2);if(!command||command==='--help'){console.log('Usage: node scripts/template-release.mjs status | verify [--key KEY] | discover | promote --key KEY --source-repo PATH --commit SHA [--expected-digest HASH] [--evidence FILE --write]\nDiscovery reports development heads; only promote changes snapshots.');return;}
 const o=args(argv,['key','source-repo','commit','evidence','expected-digest'],['write']);
 if(command==='status')console.log(JSON.stringify(releaseStatus(ROOT),null,2));
 else if(command==='verify'){const keys=o.key?[o.key]:Object.keys(json(path.join(ROOT,'templates.lock.json')).templates);for(const key of keys)console.log(JSON.stringify({key,...verifyTemplate(ROOT,key)}));}
 else if(command==='discover'){for(const[key,e]of Object.entries(json(path.join(ROOT,'templates.lock.json')).templates)){const head=git(ROOT,['ls-remote',`https://github.com/${e.repository}.git`,'refs/heads/main']).split(/\s/)[0];console.log(JSON.stringify({key,approvedCommit:e.commit,developmentHead:head,updateAvailable:e.commit!==head,action:'Review in standalone template; no automatic promotion.'}));}}
 else if(command==='promote')console.log(JSON.stringify(promoteTemplate({key:o.key,sourceRepo:o['source-repo'],commit:o.commit,evidence:o.evidence,expectedDigest:o['expected-digest'],write:!!o.write}),null,2));else throw new Error(`Unknown command ${command}`);
}
if(process.argv[1]&&path.resolve(process.argv[1])===import.meta.filename)main().catch(e=>{console.error(e.message);process.exitCode=1;});
