import {validateImportCorrectedPrivateNativeEvidence} from './vercel-native-import-derivative.mjs';
import {validateCurrentPrivatePackageNativeEvidence} from './vercel-native-current-package.mjs';
import {observeVercelGithubDeployment} from './vercel-git-observation.mjs';
import fs from 'node:fs';
import { inside, sha256, git } from './workflow.mjs';
const keys=['auto-best','modern','import','app','mobile','karento-best'];
const serviceNames={'auto-best':'autobest',modern:'modern',import:'importer',app:'app',mobile:'mobile','karento-best':'signature'};
const nodes={autobest:'22.23.2',modern:'22.23.2',importer:'24.21.0',app:'22.23.2',mobile:'22.23.2',signature:'24.21.0'};
const h40=v=>/^[a-f0-9]{40}$/.test(v||''),h64=v=>/^[a-f0-9]{64}$/.test(v||'');
const stable=v=>JSON.stringify(v,(_,x)=>x&&typeof x==='object'&&!Array.isArray(x)?Object.fromEntries(Object.keys(x).sort().map(k=>[k,x[k]])):x);
const same=(a,b)=>stable(a)===stable(b),dated=v=>Number.isFinite(Date.parse(v));
const fail=m=>{throw Error('Vercel mapped native acceptance: '+m);};
const need=(v,m)=>{if(!v)fail(m);};
const sourceValid=(k,v)=>v?.repository==='darkapoparka/cars'&&h40(v.revision)&&v.path==='templates/'+k&&h40(v.tree)&&h64(v.digest);
export function readVercelNativeProof(root,ref) {
 need(ref&&same(Object.keys(ref).sort(),['reference','sha256'])&&typeof ref.reference==='string'&&
   /^docs\/releases\/[A-Za-z0-9_./-]+\.json$/.test(ref.reference)&&!ref.reference.split('/').some(p=>p==='..'||p==='.')&&h64(ref.sha256),'bounded hashed release JSON reference required');
 const file=inside(root,ref.reference,{mustExist:true});need(fs.realpathSync(file)===file&&!fs.lstatSync(file).isSymbolicLink(),'proof path must be physical and unlinked');
 const stat=fs.statSync(file);need(stat.isFile()&&stat.size>0&&stat.size<=8*1024**2,'proof exceeds bounded size');
 const bytes=fs.readFileSync(file);need(bytes.length===stat.size&&sha256(bytes)===ref.sha256,'proof bytes differ: '+ref.reference);
 const value=JSON.parse(new TextDecoder('utf-8',{fatal:true}).decode(bytes));
 return {value,bytes,reference:ref};
}
function checkedRows(root,rows,names,identity) {
 need(Array.isArray(rows)&&rows.length===names.length&&new Set(rows.map(r=>r.name)).size===names.length,'complete distinct checked rows required');
 for(const name of names){const row=rows.find(r=>r.name===name);need(row?.status==='passed'&&h64(row.evidenceSha256)&&row.evidence?.sha256===row.evidenceSha256,'failed or unhashed check: '+name);
  const proof=readVercelNativeProof(root,row.evidence).value;
  need(proof.schemaVersion===1&&proof.kind==='cars-vercel-actual-check'&&proof.status==='passed'&&proof.executed===true&&dated(proof.verifiedAt)&&
    ['dealer','key','deploymentId','projectId','exportCommit','packageDigest'].every(k=>proof[k]===identity[k])&&
    proof.name===name&&same(proof.source,identity.source)&&h64(proof.observationsSha256)&&proof.observations?.sha256===proof.observationsSha256,
    'check collector identity or actual execution differs: '+name);
  const observations=readVercelNativeProof(root,proof.observations).value;
  need(observations.schemaVersion===1&&observations.executed===true&&observations.status==='passed'&&
    ['dealer','key','deploymentId','projectId','exportCommit','packageDigest'].every(k=>observations[k]===identity[k])&&
    observations.name===name&&same(observations.source,identity.source)&&dated(observations.verifiedAt)&&
    Array.isArray(observations.cases)&&observations.cases.length>0&&observations.cases.every(c=>c.status==='passed'&&c.actual===true),
    'actual check observations missing or failed: '+name);
  if (['auto-best','modern','import'].includes(identity.key) && ['standalone-journeys','mounted-journeys','public-journeys'].includes(name)) {
    need(['en','bg'].every(locale=>[320,390,1440].every(width=>observations.cases.some(c=>c.locale===locale&&c.width===width))),
      'actual EN/BG acceptance widths are missing: '+name);
  }
 }
}
/** Reconcile actual Vercel private Git source to immutable template tuples; no provider writes. */
export function validateVercelNativeMapping(key,release,review,root,{nativeChecks=[]}={}) {
 const d=review.deployment,ref=d.mappedSource;
 need(ref&&same(Object.keys(ref).sort(),['lease','reference','sha256']),'mapping and reviewed hash lease required');
 const proof=readVercelNativeProof(root,{reference:ref.reference,sha256:ref.sha256}).value,lease=readVercelNativeProof(root,ref.lease).value;
 need(proof.schemaVersion===1&&proof.kind==='cars-vercel-dealer-native-acceptance'&&proof.scope==='existing-dealer'&&
   /^[a-z0-9][a-z0-9-]*$/.test(proof.dealer||'')&&/^darkapoparka\/[A-Za-z0-9_-]+$/.test(proof.repository||'')&&
   /^prj_[A-Za-z0-9]+$/.test(proof.projectId||'')&&h40(proof.sourceCommit)&&h40(proof.sourceTree)&&h40(proof.packageTree)&&
   h64(proof.packageDigest)&&h40(proof.publishingCommit)&&dated(proof.verifiedAt)&&proof.nativeApproval===true&&
   proof.hostedApproval===true&&proof.globalReleaseApproval===false,'incomplete actual dealer acceptance');
 need(lease.schemaVersion===1&&lease.kind==='cars-vercel-native-acceptance-lease'&&lease.scope==='existing-dealer'&&lease.reviewed===true&&dated(lease.reviewedAt)&&
   lease.mappingSha256===ref.sha256&&lease.nativeApproval===true&&lease.hostedApproval===true&&lease.globalReleaseApproval===false&&
   ['dealer','repository','projectId','sourceCommit','sourceTree','packageTree','packageDigest','publishingCommit','publicOrigin'].every(k=>lease[k]===proof[k])&&
   same(lease.sourceReleases,proof.sourceReleases)&&same(lease.nativeInput,proof.nativeInput)&&same(lease.evidence,proof.evidence)&&h40(lease.exportParent)&&h64(lease.approvedLockSha256),
   'reviewed acceptance lease differs');
 need(sha256(fs.readFileSync(inside(root,'templates.lock.json',{mustExist:true})))===lease.approvedLockSha256,'global lock changed');
 need(proof.sourceReleases&&same(Object.keys(proof.sourceReleases).sort(),[...keys].sort())&&keys.every(k=>sourceValid(k,proof.sourceReleases[k]))&&
   same(proof.sourceReleases[key],release.source),'six exact source donors or selected template tuple differs');
 need(git(root,['rev-parse',proof.sourceCommit+':clients/'+proof.dealer])===proof.sourceTree,'immutable canonical dealer tree differs');
 for(const family of keys){const source=proof.sourceReleases[family];need(git(root,['rev-parse',source.revision+':'+source.path])===source.tree,'immutable template tree differs');}
 const original=JSON.parse(git(root,['show',proof.sourceCommit+':clients/'+proof.dealer+'/localization/adoption.json'],{encoding:null}).toString('utf8'));
 need(h64(proof.nativeInput?.digest)&&Number.isSafeInteger(proof.nativeInput?.files)&&same(original.input,proof.nativeInput),'original native source input differs');
 need(d.provider==='vercel'&&d.state==='READY'&&d.projectId===proof.projectId&&d.sourceCommit===proof.publishingCommit&&
   d.id===proof.deploymentId&&d.publicAlias===proof.publicOrigin,'actual provider/source identity differs');
 let origin;try{origin=new URL(proof.publicOrigin);}catch{fail('invalid public origin');}
 need(origin.protocol==='https:'&&!origin.username&&!origin.password&&origin.pathname==='/'&&!origin.search&&!origin.hash,'invalid public origin');
 need(proof.evidence&&same(Object.keys(proof.evidence).sort(),['export','hosted','package','provider'].sort()),'four exact proof references required');
 const p=readVercelNativeProof(root,proof.evidence.package).value,x=readVercelNativeProof(root,proof.evidence.export).value,
   v=readVercelNativeProof(root,proof.evidence.provider).value,hosted=readVercelNativeProof(root,proof.evidence.hosted).value;
 if(p.kind==='cars-vercel-import-corrected-private-package-native-proof'){
  validateImportCorrectedPrivateNativeEvidence(p,proof,lease,x,{readProof:reference=>readVercelNativeProof(root,reference),canonicalPublishedAncestor:git(root,['merge-base','--is-ancestor',proof.sourceCommit,'HEAD'])===''});
 }else if(p.kind==='cars-vercel-current-private-package-native-proof'){
  validateCurrentPrivatePackageNativeEvidence(p,proof,lease,x,{readProof:reference=>readVercelNativeProof(root,reference),canonicalPublishedAncestor:git(root,['merge-base','--is-ancestor',proof.sourceCommit,'HEAD'])===''});
 }else{
 need(p.schemaVersion===1&&p.kind==='private-vercel-pilot-prepared-package'&&p.dealer===proof.dealer&&p.repository===proof.repository&&
   p.sourceCommit===proof.sourceCommit&&p.packageTree===proof.packageTree&&p.packageDigest===proof.packageDigest&&
   p.nativeApproval===false&&p.hostedApproval===false&&p.globalReleaseApproval===false&&Number.isSafeInteger(p.runId)&&p.runId>0,
   'original prepared package differs');
 need(Array.isArray(p.compiled)&&p.compiled.length===6&&new Set(p.compiled.map(c=>c.service)).size===6&&
   Object.entries(nodes).every(([service,node])=>p.compiled.some(c=>c.service===service&&c.node===node&&c.result==='PASS'&&dated(c.startedAt)&&dated(c.finishedAt)&&Date.parse(c.finishedAt)>=Date.parse(c.startedAt))),
   'six actual native service compilations must pass');
 need(p.compilationInputProof?.schemaVersion===1&&p.compilationInputProof.kind==='immutable-package-compilation-input-proof'&&p.compilationInputProof.passed===true&&p.compilationInputProof.packageDigest===proof.packageDigest&&
   h64(p.compilationInputProof.actualRetainedDigest)&&p.compilationInputProof.expectedRetainedDigest===p.compilationInputProof.actualRetainedDigest&&Array.isArray(p.compilationInputProof.unexpected)&&p.compilationInputProof.unexpected.length===0&&
   p.compilationInputProof.nativeApproval===false&&p.compilationInputProof.hostedApproval===false&&p.compilationInputProof.globalReleaseApproval===false&&h64(p.compilationInputProofSha256)&&p.compilationInputProofSha256===lease.compilationInputProofSha256,
   'passing exact compilation input proof/helper lease required');
 if(p.compilationProofRecovery){const recovery=p.compilationProofRecovery;
   need(recovery.kind==='recorded-native-compilation-proof-recovery'&&recovery.buildsRepeated===0&&recovery.originalProofPassed===false&&h64(recovery.originalProofSha256)&&recovery.actualRetainedDigest===p.compilationInputProof.actualRetainedDigest&&
     Number.isSafeInteger(p.nativeCompilationSourceRunId)&&p.nativeCompilationSourceRunId>0&&p.nativeCompilationSourceRunId===lease.nativeCompilationSourceRunId&&recovery.lease?.sourceRunId===p.nativeCompilationSourceRunId&&recovery.lease?.packageTree===proof.packageTree&&recovery.lease?.packageDigest===proof.packageDigest&&
     recovery.originalProofSha256===recovery.lease?.files?.proof?.sha256&&recovery.lease?.originalCompilationInputProofSha256===lease.originalCompilationInputProofHelperSha256&&h64(recovery.moduleSha256)&&recovery.moduleSha256===lease.compilationProofRecoverySha256,
     'recorded six compilation recovery lease differs');
 }
 need(p.transport?.packageTree===proof.packageTree&&p.transport?.sourceCommit===proof.sourceCommit&&
   p.tooling?.nativeClientBytesChanged===false&&p.tooling?.canonicalMainChanged===false&&h64(p.tooling?.patchSha256)&&h64(p.tooling?.qualificationRequestSha256),
   'package transport or source-preserving tooling differs');
 need(x.commit===proof.publishingCommit&&x.sourceCommit===proof.sourceCommit&&x.packageTree===proof.packageTree&&x.packageDigest===proof.packageDigest&&
   x.projectId===proof.projectId&&x.productionMainChanged===false&&x.publicationEnvelope?.parent===lease.exportParent&&x.publicationEnvelope?.packageTree===proof.packageTree,
   'exact private pilot export differs');
 }
 observeVercelGithubDeployment(v,{repository:proof.repository,branch:'codex/vercel-refresh-pilot',commit:proof.publishingCommit,deploymentId:d.id,projectId:d.projectId,publicOrigin:proof.publicOrigin});
 need(hosted.schemaVersion===1&&hosted.kind==='cars-vercel-dealer-hosted-acceptance'&&hosted.dealer===proof.dealer&&hosted.executed===true&&
   hosted.status==='passed'&&hosted.unauthenticated===true&&hosted.sourceCommit===proof.sourceCommit&&hosted.sourceTree===proof.sourceTree&&
   hosted.packageTree===proof.packageTree&&hosted.packageDigest===proof.packageDigest&&hosted.exportCommit===proof.publishingCommit&&
   hosted.deploymentId===d.id&&hosted.projectId===d.projectId&&hosted.publicOrigin===proof.publicOrigin&&dated(hosted.verifiedAt)&&
   same(Object.keys(hosted.applications||{}).sort(),[...keys].sort()),'current six-family public acceptance differs');
 for(const family of keys){const a=hosted.applications[family],identity={dealer:proof.dealer,key:family,deploymentId:d.id,projectId:d.projectId,exportCommit:proof.publishingCommit,packageDigest:proof.packageDigest,source:proof.sourceReleases[family]};
  need(a.status==='passed'&&same(a.source,identity.source),'hosted family source differs');
  checkedRows(root,a.checks,['mounted-journeys','public-journeys','assets-preserved','family-contract'],identity);
 }
 for(const family of ['auto-best','modern','import']){const a=hosted.nativeLocalization?.[family],source=proof.sourceReleases[family],
   identity={dealer:proof.dealer,key:family,deploymentId:d.id,projectId:d.projectId,exportCommit:proof.publishingCommit,packageDigest:proof.packageDigest,source};
  need(a?.schemaVersion===1&&a.adapter==='native-v1'&&a.repository===source.repository&&a.commit===source.revision&&
    a.sourcePath===source.path&&a.sourceTree===source.tree&&a.sourceDigest===source.digest&&dated(a.verifiedAt)&&
    same([...(a.locales||[])].sort(),['bg','en'])&&[320,390,1440].every(w=>a.widths?.includes(w))&&h64(a.evidenceSha256),
    'current native family acceptance differs');
  checkedRows(root,a.checks,nativeChecks,identity);
 }
 const accepted=hosted.nativeLocalization[key],fields=['schemaVersion','adapter','repository','commit','sourcePath','sourceTree','sourceDigest','locales','widths','verifiedAt','evidenceSha256','catalogs'];
 need(fields.every(k=>same(accepted[k],review[k]))&&same(accepted.checks.map(({name,status,evidenceSha256})=>({name,status,evidenceSha256})),review.checks.map(({name,status,evidenceSha256})=>({name,status,evidenceSha256}))),
   'stored selected native acceptance differs from original hosted proof');
 return {mapping:proof,lease,hosted};
}
