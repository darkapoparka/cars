import assert from 'node:assert/strict';

export const VERCEL_PRIOR_COHORT_SHA256='c50dde1d239985dac13065aff940aba6ffc58ff75032220fd428199460dbc61d';
export const VERCEL_WAVE_KEYS=['auto-best','modern','import','app','mobile','karento-best'];
const oid=v=>/^[a-f0-9]{40}$/.test(v||'');
const digest=v=>/^[a-f0-9]{64}$/.test(v||'');
const equal=(a,b,message)=>assert.deepEqual(a,b,'Qualified Vercel wave: '+message);
const check=(v,message)=>assert(v,'Qualified Vercel wave: '+message);
const tuple=s=>Object.fromEntries(['repository','revision','path','tree','digest'].map(k=>[k,s?.[k]]));
const sourcesEqual=(a,b)=>{
 equal(Object.keys(a||{}).sort(),[...VERCEL_WAVE_KEYS].sort(),'six immutable source tuples required');
 equal(Object.keys(b||{}).sort(),[...VERCEL_WAVE_KEYS].sort(),'six qualified pilot tuples required');
 for(const key of VERCEL_WAVE_KEYS)equal(tuple(a[key]),tuple(b[key]),'pilot/source tuple changed for '+key);
};

/** Explicit continuation of the owner's two accepted provider pilots. Candidate
 * source seals remain provisional; every member still receives a real production
 * build and its own hosted identity/logo/six-choice checks after MAIN publication.
 */
export function assertVercelProductionWave(wave,{cohort,request}={}){
 check(wave?.schemaVersion===1&&wave.kind==='cars-owner-authorized-vercel-main-production-wave','explicit reviewed production wave required');
 check(wave.ownerAuthorizedMain===true&&wave.targetBranch==='main'&&wave.providerTarget==='production'&&wave.noPreviewPublication===true,'existing production MAIN only');
 check(wave.cohortSha256===VERCEL_PRIOR_COHORT_SHA256&&oid(wave.templateSourceCommit)&&digest(wave.candidateLockSha256),'exact existing cohort and frozen source/lock required');
 check(Array.isArray(wave.dealers)&&wave.dealers.length>0&&wave.dealers.length<=5&&new Set(wave.dealers.map(r=>r.slug)).size===wave.dealers.length,'one bounded wave of at most five dealers required');
 equal(Object.keys(wave.templateSources||{}).sort(),[...VERCEL_WAVE_KEYS].sort(),'six selected sources required');
 for(const [key,s]of Object.entries(wave.templateSources))check(s.repository==='darkapoparka/cars'&&s.revision===wave.templateSourceCommit&&s.path==='templates/'+key&&oid(s.tree)&&digest(s.digest),'invalid immutable source '+key);
 const pilots=wave.pilotQualification;
 check(pilots&&Object.keys(pilots).sort().join(',')==='cloudflare,vercel','both final provider pilot receipts required');
 for(const [provider,p]of Object.entries(pilots)){
  check(p.provider===provider&&p.state==='READY'&&p.target==='production'&&p.gitBranch==='main'&&oid(p.gitCommit),'actual provider MAIN production receipt required');
  check(p.serviceCount===6&&p.hostedVerified===true&&p.allSixEntriesVerified===true&&p.aboutContactVerified===true&&p.fabAndDashboardsVerified===true,'final six-template hosted pilot qualification required');
  check(digest(p.providerReceiptSha256)&&digest(p.hostedReceiptSha256),'sealed provider and focused hosted receipts required');
  sourcesEqual(wave.templateSources,p.templateSources);
 }
 check(pilots.vercel.dealer==='f1rst-motors'&&pilots.vercel.projectId==='prj_mavqUXCj6hSEg8EvBJW8G3XJlihm'&&pilots.vercel.publicOrigin==='https://cars-f1rstmotors.vercel.app'&&/^dpl_[A-Za-z0-9]+$/.test(pilots.vercel.deploymentId||''),'existing F1rst provider pilot identity required');
 check(pilots.cloudflare.dealer==='bradford-cherry-tree-cars'&&pilots.cloudflare.workerName==='cars-uk-bradford-cherry-tree-cars'&&pilots.cloudflare.publicOrigin==='https://bradford-cherry-tree-cars.webpreviews.site'&&/^[a-f0-9-]{36}$/.test(pilots.cloudflare.versionId||''),'existing Bradford provider pilot identity required');
 for(const row of wave.dealers){
  check(typeof row.slug==='string'&&/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(row.slug)&&!['f1rst-motors','al-reef-used-cars'].includes(row.slug),'remaining Cars-owned Vercel member only');
  check(/^darkapoparka\/[a-zA-Z0-9_.-]+$/.test(row.repository||'')&&/^prj_[A-Za-z0-9]+$/.test(row.projectId||'')&&new URL(row.publicOrigin).origin===row.publicOrigin,'exact existing dealer identity required');
  check(oid(row.sourceCommit)&&oid(row.sourceTree)&&oid(row.privateMain)&&digest(row.sourceReviewSha256)&&digest(row.qualificationSha256)&&digest(row.nativeInputDigest),'exact source/tree/review/native/private MAIN leases required');
  check(row.stockAndFactsUnchanged===true&&row.selectedLogoBytesPreserved===true,'reviewed facts, stock, locale and selected logos must be preserved');
  if(cohort){const prior=cohort.rows?.find(r=>r.slug===row.slug);check(prior,'dealer outside exact original 25-member cohort');for(const [k,v]of Object.entries({repository:prior.repository,projectId:prior.projectId,publicOrigin:prior.origin}))equal(row[k],v,'existing cohort identity changed');}
 }
 if(request){
  check(request.stage==='qualification-preview'&&request.action==='proposal'&&request.publicationTransport==='existing-local-publisher','the remote lane produces sealed packages only');
  equal(request.previousDelivery?.sha256,wave.cohortSha256,'cohort input changed');equal(request.templateLock?.sha256,wave.candidateLockSha256,'candidate lock changed');sourcesEqual(request.templateSources,wave.templateSources);
  equal(request.dealers.map(r=>r.slug).sort(),wave.dealers.map(r=>r.slug).sort(),'request/wave membership changed');
  for(const row of request.dealers){const enrolled=wave.dealers.find(r=>r.slug===row.slug);for(const field of ['repository','projectId','publicOrigin','sourceCommit','sourceTree','privateMain'])equal(row[field],enrolled[field],'exact member lease changed: '+field);equal(row.sourceReview?.sha256,enrolled.sourceReviewSha256,'source review changed');equal(row.qualification?.sha256,enrolled.qualificationSha256,'native qualification context changed');check(row.sourceOwnership==='cars-owned'&&row.sourceRepository==='darkapoparka/cars','independent source cannot enter this Cars-owned lane');}
 }
 return wave;
}

export function vercelProductionWaveMember(wave,slug){
 assertVercelProductionWave(wave);const row=wave.dealers.find(r=>r.slug===slug);check(row,'dealer outside sealed production wave');
 return {schemaVersion:1,kind:'cars-owner-authorized-vercel-main-production-wave-member',...structuredClone(row),dealer:slug,wave:structuredClone(wave),productionBuildPending:true,hostedApproval:false};
}

export function assertVercelProductionWaveMember(member,{meta,manifest}={}){
 check(member?.schemaVersion===1&&member.kind==='cars-owner-authorized-vercel-main-production-wave-member','exact wave member admission required');
 assertVercelProductionWave(member.wave);const row=member.wave.dealers.find(r=>r.slug===member.dealer);check(row,'dealer outside accepted wave');
 for(const field of ['slug','repository','projectId','publicOrigin','sourceCommit','sourceTree','privateMain','sourceReviewSha256','qualificationSha256','nativeInputDigest'])equal(member[field],row[field],'member lease changed: '+field);
 check(member.productionBuildPending===true&&member.hostedApproval===false,'member production build and hosted check remain pending');
 equal(manifest?.slug,row.slug,'package dealer changed');equal(manifest?.repository,row.repository,'package repository changed');equal(manifest?.shareIdentity?.publicOrigin,row.publicOrigin,'package origin changed');
 equal(meta?.sourceCommit,row.sourceCommit,'package immutable source changed');sourcesEqual(manifest.templateSources,member.wave.templateSources);
 equal(meta.qualification?.templateSourceCommit,member.wave.templateSourceCommit,'native template source changed');equal(meta.qualification?.candidateLockSha256,member.wave.candidateLockSha256,'native candidate lock changed');equal(meta.qualification?.nativeInput?.digest,row.nativeInputDigest,'native source input seal changed');
 return member;
}
