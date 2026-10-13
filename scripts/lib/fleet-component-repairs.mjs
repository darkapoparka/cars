/** Narrow source repairs and honest original-component reuse for the maintained
 * Cars six-app compiler/composer. No source generation, deploy, approval or edits
 * to an original compiled artifact. Every reused member keeps its original run. */
import {createHash} from 'node:crypto';
const hash=x=>createHash('sha256').update(x).digest('hex');
const canonical=x=>JSON.stringify(x,(_k,v)=>v&&typeof v==='object'&&!Array.isArray(v)?Object.fromEntries(Object.entries(v).sort(([a],[b])=>a.localeCompare(b))):v);
const same=(a,b)=>canonical(a)===canonical(b);
const must=(ok,message)=>{if(!ok)throw new Error('Component repair: '+message);};
const hex=(x,n)=>typeof x==='string'&&new RegExp('^[a-f0-9]{'+n+'}$').test(x);
const positive=x=>Number.isSafeInteger(Number(x))&&Number(x)>0;
export const REPAIR_KEYS=Object.freeze(['auto-best','modern','import','app','mobile','karento-best','router']);
const paths=Object.freeze({
 'modern/packages/marketplace-ui/components/dealer-mobile-brand-bar.tsx':'modern-dark-discovery-v1',
 'modern/packages/marketplace-ui/components/mobile-dealer-discovery-header.tsx':'modern-dark-discovery-v1',
 'import/src/lib/content/localized.ts':'import-illustrative-stock-en-v1'
});
export const componentArtifactName=(slug,key,run,attempt)=>'existing-cf-'+slug+'-'+key+'-'+run+'-'+attempt;
export function componentRepairRow(request,slug){
 const repair=request?.componentRepair;if(repair===undefined)return null;
 must(repair?.schemaVersion===1&&repair.kind==='cars-existing-component-repair'&&repair.reviewed===true&&Number.isFinite(Date.parse(repair.reviewedAt)),'dated reviewed repair required');
 must(Array.isArray(repair.dealers)&&repair.dealers.length>0&&repair.dealers.length<=5&&same(repair.dealers.map(x=>x.slug).sort(),[...request.dealers].sort()),'exact bounded dealer scope required');
 must(new Set(repair.dealers.map(x=>x.slug)).size===repair.dealers.length,'duplicate repair dealer');
 for(const row of repair.dealers){
  must(/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(row.slug)&&hex(row.sourceTree,40),'exact source tree and dealer required');
  must(Array.isArray(row.sourceChanges)&&row.sourceChanges.length>0&&row.sourceChanges.length<=3&&new Set(row.sourceChanges.map(x=>x.path)).size===row.sourceChanges.length,'one to three exact source paths required');
  for(const change of row.sourceChanges)must(paths[change.path]===change.operation&&hex(change.beforeSha256,64)&&hex(change.afterSha256,64)&&change.beforeSha256!==change.afterSha256,'unreviewed source path, operation or byte lease');
  const affected=[...new Set(row.sourceChanges.map(x=>x.path.split('/')[0]))].sort();
  must(Array.isArray(row.rebuild)&&same([...row.rebuild].sort(),affected),'compile only the changed native families');
  if(affected.includes('modern'))must(['biemaauto-varna','auto-insurance-import-varna'].includes(row.slug)&&row.sourceChanges.filter(x=>x.operation==='modern-dark-discovery-v1').length===2,'Modern repair must be the specialist exact two-file dealer scope');
  const original=row.original;
  must(original&&positive(original.runId)&&positive(original.attempt)&&hex(original.sourceCommit,40)&&Array.isArray(original.artifacts)&&original.artifacts.length===7,'exact original successful run and seven artifact metadata pins required');
  must(new Set(original.artifacts.map(x=>x.id)).size===7&&new Set(original.artifacts.map(x=>x.name)).size===7,'duplicate original artifact');
  for(const key of REPAIR_KEYS){const found=original.artifacts.filter(x=>x.name===componentArtifactName(row.slug,key,original.runId,original.attempt));must(found.length===1&&positive(found[0].id)&&positive(found[0].sizeInBytes)&&hex(found[0].sha256,64),'original artifact identity differs: '+key);}
 }
 const row=repair.dealers.find(x=>x.slug===slug);must(row,'dealer outside reviewed repair');return row;
}
export function applyReviewedComponentRepairs(files,request,slug,sourceTree,{importRepair,modernRepair}={}){
 const row=componentRepairRow(request,slug);if(!row)return null;
 must(files instanceof Map&&sourceTree===row.sourceTree,'canonical original source tree differs');
 const results=[];
 for(const change of row.sourceChanges){
  const bytes=files.get(change.path);must(Buffer.isBuffer(bytes)&&hash(bytes)===change.beforeSha256,'exact original source bytes differ: '+change.path);
  const operation=change.operation==='modern-dark-discovery-v1'?modernRepair:importRepair;must(typeof operation==='function','maintained source repair function missing');
  const result=change.operation==='modern-dark-discovery-v1'?operation(change.path.split('/').at(-1),bytes.toString('utf8')):operation(bytes.toString('utf8'));
  const after=Buffer.from(result.source);must(hash(after)===change.afterSha256,'source repair differs from reviewed result: '+change.path);
  files.set(change.path,after);results.push({...change});
 }
 return {schemaVersion:1,kind:'cars-reviewed-component-source-repair',dealer:slug,canonicalSourceTree:sourceTree,requestSha256:hash(canonical(request.componentRepair)),sourceChanges:results,canonicalSourceUnchanged:true,derivedSourceChanged:true,artworkChanged:false,appBindingsChanged:false,desktopPaletteChanged:false};
}
export function componentSourceRows(rows,key){
 must(REPAIR_KEYS.includes(key)&&Array.isArray(rows),'native family source rows required');
 const prefix=(key==='router'?'cloudflare':key)+'/';
 const selected=rows.filter(r=>r.path.startsWith(prefix)).map(r=>({path:r.path,sha256:r.sha256})).sort((a,b)=>a.path<b.path?-1:a.path>b.path?1:0);
 must(selected.length>0&&new Set(selected.map(r=>r.path)).size===selected.length&&selected.every(r=>hex(r.sha256,64)&&!r.path.split('/').includes('..')),'missing or invalid native family source proof: '+key);
 return selected;
}
export const componentSourceDigest=(rows,key)=>hash(canonical(componentSourceRows(rows,key)));
export function verifyOriginalComponentMetadata(row,run,artifacts){
 must(run?.id===row.original.runId&&run.run_attempt===row.original.attempt&&run.head_sha===row.original.sourceCommit&&run.status==='completed'&&run.conclusion==='success'&&run.event==='push'&&run.repository?.full_name==='darkapoparka/cars'&&run.head_repository?.full_name==='darkapoparka/cars','original native run identity/status differs');
 must(run.path==='.github/workflows/existing-fleet-cloudflare.yml'&&run.head_branch==='main','original source was not the maintained main native workflow');
 const list=artifacts?.artifacts;must(Array.isArray(list),'original artifact metadata unavailable');
 for(const pin of row.original.artifacts){const found=list.filter(x=>x.id===pin.id);must(found.length===1,'original artifact ID missing');const a=found[0];must(a.name===pin.name&&a.size_in_bytes===pin.sizeInBytes&&a.digest==='sha256:'+pin.sha256&&a.expired===false&&a.workflow_run?.id===row.original.runId&&a.workflow_run?.head_sha===row.original.sourceCommit,'original artifact metadata differs: '+pin.name);}
 return {schemaVersion:1,originalRunId:run.id,originalRunAttempt:run.run_attempt,originalSourceCommit:run.head_sha,metadataSha256:hash(canonical(row.original)),originalRunPassed:true,originalArtifactsUnexpired:true};
}
/** Compare current prepared family bytes against the original receipt before
 * accepting reuse. Packaging-only root helpers are not compiled family source;
 * their current identity is separately carried by the assembly commit. */
export function createComponentReuseProof({request,slug,context,prepared,inputs,originalMetadata}){
 const row=componentRepairRow(request,slug);must(row,'reviewed repair required');
 must(context&&hex(context.sourceCommit,40)&&positive(context.runId)&&positive(context.attempt),'exact new assembly context required');
 must(context.sourceCommit!==row.original.sourceCommit&&Number(context.runId)!==row.original.runId,'new assembly cannot impersonate original run');
 must(prepared.sourceTree===row.sourceTree&&prepared.componentRepair?.requestSha256===hash(canonical(request.componentRepair))&&same(prepared.componentRepair.sourceChanges,row.sourceChanges),'new prepared source repair proof differs');
 must(originalMetadata?.originalRunPassed===true&&originalMetadata.originalArtifactsUnexpired===true&&originalMetadata.metadataSha256===hash(canonical(row.original)),'original donor metadata was not verified');
 const members={};
 for(const key of REPAIR_KEYS){
  const input=inputs[key],fresh=row.rebuild.includes(key);must(input?.deploy&&input.source&&input.inventory,'seven exact source/deploy/inventory receipts required');
  const expected=fresh?context:{sourceCommit:row.original.sourceCommit,runId:row.original.runId,attempt:row.original.attempt};
  for(const name of ['sourceCommit','runId','attempt'])must(String(input.deploy[name])===String(expected[name]),'component original/new identity differs: '+key+'/'+name);
  must(input.source.sourceCommit===input.deploy.sourceCommit&&input.source.sourceTree===row.sourceTree&&input.deploy.sourceTree===row.sourceTree&&input.source.inputDigest===prepared.inputDigest,'retained canonical source authority differs: '+key);
  const actual=componentSourceRows(input.source.targetBeforeDependencies,key),current=componentSourceRows(prepared.familyBeforeDependencies[key],key);
  must(same(actual,current),(fresh?'rebuilt':'reused')+' native family source changed unexpectedly: '+key);
  if(fresh)must(same(input.source.componentRepair,prepared.componentRepair),'fresh compile did not apply the exact reviewed source repairs');
  members[key]={mode:fresh?'rebuilt':'reused',sourceCommit:input.deploy.sourceCommit,runId:Number(input.deploy.runId),attempt:Number(input.deploy.attempt),artifactDigest:input.inventory.digest,compiledDigest:input.deploy.compiledDigest,familySourceDigest:hash(canonical(current)),sourceFiles:current.length};
 }
 const proof={schemaVersion:1,kind:'cars-verified-component-reuse',dealer:slug,sourceTree:row.sourceTree,inputDigest:prepared.inputDigest,assembly:{sourceCommit:context.sourceCommit,runId:Number(context.runId),attempt:Number(context.attempt)},requestSha256:hash(canonical(request.componentRepair)),reviewedAt:request.componentRepair.reviewedAt,row,originalMetadata,sourceRepairs:prepared.componentRepair,members,rebuiltFamilies:[...row.rebuild],reusedFamilies:REPAIR_KEYS.filter(k=>!row.rebuild.includes(k)),unaffectedFamilySourceVerified:true,originalCompiledBytesUnchanged:true};
 return {...proof,seal:hash(canonical(proof))};
}
export function assertComponentReuseProof(proof,deployments){
 must(proof?.schemaVersion===1&&proof.kind==='cars-verified-component-reuse'&&proof.unaffectedFamilySourceVerified===true&&proof.originalCompiledBytesUnchanged===true&&hex(proof.seal,64),'verified per-component source reuse proof required');
 const {seal,...body}=proof;must(hash(canonical(body))===seal,'component reuse proof seal differs');
 must(hex(proof.assembly?.sourceCommit,40)&&positive(proof.assembly?.runId)&&positive(proof.assembly?.attempt)&&proof.assembly.sourceCommit!==proof.row?.original?.sourceCommit&&Number(proof.assembly.runId)!==proof.row?.original?.runId,'new assembly must not impersonate the original run');
 must(proof.sourceRepairs?.dealer===proof.dealer&&proof.sourceRepairs.canonicalSourceTree===proof.sourceTree&&proof.sourceRepairs.canonicalSourceUnchanged===true&&proof.sourceRepairs.derivedSourceChanged===true&&proof.sourceRepairs.requestSha256===proof.requestSha256&&same(proof.sourceRepairs.sourceChanges,proof.row?.sourceChanges),'exact derived source repair proof required');
 const request={dealers:[proof.dealer],componentRepair:{schemaVersion:1,kind:'cars-existing-component-repair',reviewed:true,reviewedAt:proof.reviewedAt,dealers:[proof.row]}};
 const row=componentRepairRow(request,proof.dealer);must(proof.sourceTree===row.sourceTree&&same(proof.rebuiltFamilies,row.rebuild)&&same(proof.reusedFamilies,REPAIR_KEYS.filter(k=>!row.rebuild.includes(k)))&&same(Object.keys(proof.members).sort(),[...REPAIR_KEYS].sort()),'reuse family partition differs');
 must(proof.originalMetadata?.metadataSha256===hash(canonical(row.original))&&proof.originalMetadata.originalRunPassed===true&&proof.originalMetadata.originalArtifactsUnexpired===true,'original metadata proof differs');
 for(const key of REPAIR_KEYS){const member=proof.members[key],deploy=deployments[key],fresh=row.rebuild.includes(key),expected=fresh?proof.assembly:{sourceCommit:row.original.sourceCommit,runId:row.original.runId,attempt:row.original.attempt};
  must(member.mode===(fresh?'rebuilt':'reused')&&hex(member.artifactDigest,64)&&hex(member.compiledDigest,64)&&hex(member.familySourceDigest,64)&&positive(member.sourceFiles),'invalid component proof: '+key);
  for(const name of ['sourceCommit','runId','attempt'])must(String(member[name])===String(expected[name])&&String(deploy[name])===String(expected[name]),'mixed or relabeled source/run: '+key+'/'+name);
  must(deploy.sourceTree===proof.sourceTree&&deploy.inputDigest===proof.inputDigest&&deploy.compiledDigest===member.compiledDigest,'component compiled/source proof differs: '+key);
 }
 return proof;
}
export function componentAssemblyIdentity(router,proof){
 if(!proof)return router;
 // This is a NEW assembly identity, not a mutation of an original deploy receipt.
 return {...router,sourceCommit:proof.assembly.sourceCommit,runId:String(proof.assembly.runId),attempt:String(proof.assembly.attempt)};
}
