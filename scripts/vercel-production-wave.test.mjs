import test from 'node:test';
import assert from 'node:assert/strict';
import {assertVercelProductionWave,assertVercelProductionWaveMember,vercelProductionWaveMember,VERCEL_PRIOR_COHORT_SHA256,VERCEL_WAVE_KEYS} from './lib/vercel-production-wave.mjs';
import {validateVercelRefreshRequest} from './prepare-vercel-presentation-release.mjs';
import {assertVercelQualificationExport} from './export-dealer.mjs';

function fixture(){
 const templateSources=Object.fromEntries(VERCEL_WAVE_KEYS.map(key=>[key,{repository:'darkapoparka/cars',revision:'1'.repeat(40),path:'templates/'+key,tree:'2'.repeat(40),digest:'3'.repeat(64)}]));
 const providers=Object.fromEntries(['vercel','cloudflare'].map(provider=>[provider,{provider,state:'READY',target:'production',gitBranch:'main',gitCommit:'4'.repeat(40),serviceCount:6,hostedVerified:true,allSixEntriesVerified:true,aboutContactVerified:true,fabAndDashboardsVerified:true,providerReceiptSha256:'5'.repeat(64),hostedReceiptSha256:'6'.repeat(64),templateSources:structuredClone(templateSources),...(provider==='vercel'?{dealer:'f1rst-motors',projectId:'prj_mavqUXCj6hSEg8EvBJW8G3XJlihm',publicOrigin:'https://cars-f1rstmotors.vercel.app',deploymentId:'dpl_fixture'}:{dealer:'bradford-cherry-tree-cars',workerName:'cars-uk-bradford-cherry-tree-cars',publicOrigin:'https://bradford-cherry-tree-cars.webpreviews.site',versionId:'63494b31-cbd4-4e32-8c86-e2ded180f004'})}]));
 const row={slug:'promosale-varna',repository:'darkapoparka/cars-promosalevarna',projectId:'prj_yjXIu0an7sqCiY26hKWgOGUl5hbY',publicOrigin:'https://cars-promosalevarna.vercel.app',sourceCommit:'7'.repeat(40),sourceTree:'8'.repeat(40),privateMain:'9'.repeat(40),sourceReviewSha256:'a'.repeat(64),qualificationSha256:'b'.repeat(64),nativeInputDigest:'c'.repeat(64),stockAndFactsUnchanged:true,selectedLogoBytesPreserved:true};
 const wave={schemaVersion:1,kind:'cars-owner-authorized-vercel-main-production-wave',ownerAuthorizedMain:true,targetBranch:'main',providerTarget:'production',noPreviewPublication:true,cohortSha256:VERCEL_PRIOR_COHORT_SHA256,templateSourceCommit:'1'.repeat(40),candidateLockSha256:'d'.repeat(64),templateSources,pilotQualification:providers,dealers:[row]};
 const cohort={rows:Array.from({length:25},(_,i)=>i?{slug:'fixture-'+i,repository:'darkapoparka/fixture-'+i,projectId:'prj_fixture'+i,origin:'https://fixture-'+i+'.vercel.app'}:{slug:row.slug,repository:row.repository,projectId:row.projectId,origin:row.publicOrigin})};
 const registry={dealers:cohort.rows.map(r=>({slug:r.slug,repository:r.repository,delivery:{projectId:r.projectId}}))};
 const dealer={...row,sourceOwnership:'cars-owned',sourceRepository:'darkapoparka/cars',sourceReview:{path:'docs/releases/wave/source.json',sha256:row.sourceReviewSha256},qualification:{path:'docs/releases/wave/context.json',sha256:row.qualificationSha256},targetBranch:'codex/fleet-final-polish-20261014',privateTarget:null};
 const request={schemaVersion:2,kind:'cars-existing-vercel-refresh',action:'proposal',stage:'qualification-preview',publicationTransport:'existing-local-publisher',toolingSourceCommit:'e'.repeat(40),templateLock:{path:'docs/releases/wave/lock.json',sha256:wave.candidateLockSha256},templateSources,previousDelivery:{path:'docs/releases/vercel-presentation-20261011/prior-25-delivery.json',sha256:VERCEL_PRIOR_COHORT_SHA256},productionWave:{path:'docs/releases/wave/production-wave.json',sha256:'f'.repeat(64)},dealers:[dealer]};
 const manifest={slug:row.slug,repository:row.repository,shareIdentity:{publicOrigin:row.publicOrigin},templateSources};
 const meta={sourceCommit:row.sourceCommit,assetDelivery:{provider:'vercel'},qualification:{schemaVersion:1,kind:'cars-vercel-native-source-qualification',provider:'vercel',dealer:row.slug,repository:row.repository,publicOrigin:row.publicOrigin,sourceCommit:row.sourceCommit,targetBranch:dealer.targetBranch,production:false,nativeApproval:false,hostedApproval:false,globalReleaseApproval:false,templateSourceCommit:wave.templateSourceCommit,candidateLockSha256:wave.candidateLockSha256,nativeInput:{digest:row.nativeInputDigest}}};
 return {wave,row,request,cohort,registry,manifest,meta};
}

test('qualified continuation packages an exact remaining member and admits MAIN with pending source flags',()=>{
 const f=fixture();validateVercelRefreshRequest(f.request,{cohort:f.cohort,registry:f.registry,productionWave:f.wave});
 const member=vercelProductionWaveMember(f.wave,f.row.slug);assertVercelProductionWaveMember(member,f);assertVercelQualificationExport(f.meta,{branch:'main',manifest:f.manifest,productionPilot:member});
 for(const field of ['production','nativeApproval','hostedApproval','globalReleaseApproval'])assert.equal(f.meta.qualification[field],false);
 assert.equal(member.productionBuildPending,true);assert.equal(member.hostedApproval,false);
 assert.throws(()=>assertVercelQualificationExport(f.meta,{branch:'main',manifest:f.manifest}),/exact reviewed preview branch/);
});

test('absent or partial final provider qualification cannot authorize a batch',()=>{
 for(const mutate of [f=>delete f.wave.pilotQualification.cloudflare,f=>f.wave.pilotQualification.vercel.state='BUILDING',f=>f.wave.pilotQualification.cloudflare.hostedVerified=false,f=>f.wave.pilotQualification.vercel.aboutContactVerified=false,f=>f.wave.pilotQualification.cloudflare.fabAndDashboardsVerified=false,f=>f.wave.pilotQualification.vercel.serviceCount=5,f=>f.wave.pilotQualification.vercel.gitBranch='codex/preview',f=>f.wave.pilotQualification.cloudflare.templateSources.modern.tree='0'.repeat(40)]){const f=fixture();mutate(f);assert.throws(()=>assertVercelProductionWave(f.wave));}
});

test('production wave cannot replace identities, source, lock, review, sealed input or current private lease',()=>{
 for(const field of ['repository','projectId','publicOrigin','sourceCommit','sourceTree','privateMain']){const f=fixture();f.request.dealers[0][field]+='changed';assert.throws(()=>validateVercelRefreshRequest(f.request,{cohort:f.cohort,registry:f.registry,productionWave:f.wave}));}
 for(const mutate of [f=>f.request.templateLock.sha256='0'.repeat(64),f=>f.request.dealers[0].qualification.sha256='0'.repeat(64),f=>f.request.dealers[0].sourceReview.sha256='0'.repeat(64),f=>f.request.action='publish',f=>delete f.request.productionWave]){const f=fixture();mutate(f);assert.throws(()=>validateVercelRefreshRequest(f.request,{cohort:f.cohort,registry:f.registry,productionWave:f.wave}));}
 for(const mutate of [m=>m.privateMain='0'.repeat(40),m=>m.productionBuildPending=false,m=>m.hostedApproval=true]){const f=fixture(),m=vercelProductionWaveMember(f.wave,f.row.slug);mutate(m);assert.throws(()=>assertVercelProductionWaveMember(m,f));}
 const f=fixture(),member=vercelProductionWaveMember(f.wave,f.row.slug);f.meta.qualification.nativeInput.digest='0'.repeat(64);assert.throws(()=>assertVercelProductionWaveMember(member,f));
});

test('F1rst, independent Al Reef, preview publication and over-five waves stay outside this lane',()=>{
 for(const slug of ['f1rst-motors','al-reef-used-cars']){const f=fixture();f.wave.dealers[0].slug=slug;assert.throws(()=>assertVercelProductionWave(f.wave));}
 for(const mutate of [f=>f.wave.targetBranch='codex/preview',f=>f.wave.noPreviewPublication=false,f=>f.wave.cohortSha256='0'.repeat(64),f=>f.wave.dealers[0].stockAndFactsUnchanged=false,f=>f.wave.dealers[0].selectedLogoBytesPreserved=false]){const f=fixture();mutate(f);assert.throws(()=>assertVercelProductionWave(f.wave));}
 const f=fixture();f.wave.dealers=Array.from({length:6},(_,i)=>({...f.row,slug:'dealer-'+i}));assert.throws(()=>assertVercelProductionWave(f.wave),/at most five/);
});
