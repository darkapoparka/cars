import test from 'node:test';import assert from 'node:assert/strict';
import {validateVercelRefreshRequest,vercelRefreshMatrix,assertVercelSourceBinding,VERCEL_KEYS} from './prepare-vercel-presentation-release.mjs';
function fixture(){
 const rows=Array.from({length:25},(_,i)=>({slug:i===0?'f1rst-motors':i===24?'al-reef-used-cars':'dealer-'+i,repository:'darkapoparka/cars-fixture'+i,origin:'https://cars-fixture'+i+'.vercel.app',projectId:'prj_fixture'+i}));
 const registry={dealers:rows.map((r,i)=>({slug:r.slug,repository:r.repository,delivery:{projectId:r.projectId},...(i===24?{sourceOwnership:'independent-repository',canonicalSourceRepository:r.repository,localPath:null}: {})}))};
 const sources=Object.fromEntries(VERCEL_KEYS.map(key=>[key,{repository:'darkapoparka/cars',revision:'1'.repeat(40),path:'templates/'+key,tree:'2'.repeat(40),digest:'3'.repeat(64)}]));
 const r=rows[0],dealer={slug:r.slug,repository:r.repository,projectId:r.projectId,publicOrigin:r.origin,sourceOwnership:'cars-owned',sourceRepository:'darkapoparka/cars',sourceCommit:'4'.repeat(40),sourceTree:'5'.repeat(40),sourceReview:{path:'docs/releases/fixture-source.json',sha256:'6'.repeat(64)},privateMain:'7'.repeat(40),privateTarget:null,targetBranch:'codex/final-source-pilot',qualification:{path:'docs/releases/fixture-context.json',sha256:'8'.repeat(64)}};
 return {cohort:{rows},registry,request:{schemaVersion:2,kind:'cars-existing-vercel-refresh',action:'proposal',stage:'qualification-preview',toolingSourceCommit:'9'.repeat(40),templateLock:{path:'docs/releases/fixture-lock.json',sha256:'a'.repeat(64)},templateSources:sources,dealers:[dealer]}};
}
test('F1rst alone is the first six-design pilot and existing provider identities stay bound',()=>{
 const f=fixture();validateVercelRefreshRequest(f.request,f);assert.equal(vercelRefreshMatrix(f.request,f).include.length,1);
 for(const field of ['repository','projectId','publicOrigin']){const r=structuredClone(f.request);r.dealers[0][field]+='changed';assert.throws(()=>validateVercelRefreshRequest(r,f),/identity changed/);}
 const r=structuredClone(f.request);r.dealers[0].slug='dealer-1';assert.throws(()=>validateVercelRefreshRequest(r,f),/first combined/);
});
test('production waves require approved ordinary source, fresh parent and reviewed digest/tree',()=>{
 const f=fixture(),r=structuredClone(f.request);r.stage='approved-production';r.action='publish';r.dealers[0].targetBranch='main';r.dealers[0].privateTarget=r.dealers[0].privateMain;delete r.dealers[0].qualification;
 assert.throws(()=>validateVercelRefreshRequest(r,f),/exact reviewed proposal/);
 r.dealers[0].approval={remoteCommit:r.dealers[0].privateMain,candidateDigest:'b'.repeat(64),packageTree:'c'.repeat(40)};validateVercelRefreshRequest(r,f);
 r.dealers[0].qualification={};assert.throws(()=>validateVercelRefreshRequest(r,f),/ordinary approved-native source/);
});
test('existing local publisher transport is explicit and cannot push from Actions',()=>{
 const f=fixture(),r=structuredClone(f.request);r.publicationTransport='existing-local-publisher';validateVercelRefreshRequest(r,f);
 r.action='publish';assert.throws(()=>validateVercelRefreshRequest(r,f),/proposal only/);r.action='proposal';r.publicationTransport='invented-controller';assert.throws(()=>validateVercelRefreshRequest(r,f),/proposal only/);
});
test('independent Al Reef never becomes a Cars-owned source job',()=>{
 const f=fixture(),r=structuredClone(f.request),last=f.cohort.rows[24];r.stage='approved-production';r.dealers=[{...r.dealers[0],slug:last.slug,repository:last.repository,projectId:last.projectId,publicOrigin:last.origin,sourceOwnership:'independent-repository',sourceRepository:last.repository,targetBranch:'main',privateTarget:r.dealers[0].privateMain}];delete r.dealers[0].qualification;
 validateVercelRefreshRequest(r,f);assert.equal(vercelRefreshMatrix(r,f).include[0].independent,true);
 r.dealers[0].sourceOwnership='cars-owned';r.dealers[0].sourceRepository='darkapoparka/cars';assert.throws(()=>validateVercelRefreshRequest(r,f),/Source ownership differs/);
});
test('stale four-design canonical source and changed template locators are refused',()=>{
 const f=fixture(),row=f.request.dealers[0],manifest={slug:row.slug,repository:row.repository,packaging:{version:'5'},shareIdentity:{publicOrigin:row.publicOrigin},variants:VERCEL_KEYS.map(key=>({key})),templateSources:f.request.templateSources};assertVercelSourceBinding(manifest,row,f.request);
 assert.throws(()=>assertVercelSourceBinding({...manifest,packaging:{version:'3'},variants:manifest.variants.slice(0,4)},row,f.request));
 const changed=structuredClone(manifest);changed.templateSources.modern.tree='d'.repeat(40);assert.throws(()=>assertVercelSourceBinding(changed,row,f.request),/template drift/);
});
