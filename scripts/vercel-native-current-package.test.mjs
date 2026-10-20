import fs from 'node:fs';
import path from 'node:path';
import assert from 'node:assert/strict';
import test from 'node:test';
import {observeVercelGithubDeployment} from './lib/vercel-git-observation.mjs';
import {currentPackageTrees} from './lib/vercel-native-current-package.mjs';
import {selectedPolicyScope} from './verify-vercel-dealer-native-policy.mjs';
test('default source-policy scope and explicit Import-only scope preserve actual command ownership',()=>{
 const all=selectedPolicyScope(),one=selectedPolicyScope('corrected-import-only');assert.equal(all.importOnly,false);assert.equal(all.selectedCommands.length,6);assert.equal(one.importOnly,true);assert.deepEqual(one.selectedKeys,['import']);assert.equal(one.selectedCommands.length,1);assert.equal(one.selectedCommands[0].name,'import-native-policy-tests');assert.throws(()=>selectedPolicyScope('all-import-approved'));
});
test('all helper relative imports resolve as one coherent closure without provider activity',async()=>{
 for(const name of ['vercel-native-import-derivative','vercel-native-current-package','vercel-git-observation','vercel-native-mapping','native-localization'])assert(Object.keys(await import('./lib/'+name+'.mjs')).length>0);
 assert.equal(typeof(await import('./seal-vercel-dealer-native.mjs')).freezeVercelDealerNativeSeal,'function');
 assert.equal(typeof(await import('./lib/native-localization.mjs')).validateNativeRelease,'function');
});
test('actual provider source metadata never permits unrelated project or conflicting SHA',()=>{
 const expected={repository:'darkapoparka/cars-promosalevarna',branch:'codex/vercel-refresh-pilot',commit:'026775502cfc80372d1a1abeae15739916ed9b79',deploymentId:'dpl_CAZkRU3dvK9X2B7v8DY75ijngft3',projectId:'prj_yjXIu0an7sqCiY26hKWgOGUl5hbY',publicOrigin:'https://cars-promosalevarna-nj823vwow-tyj5.vercel.app/'};
 const raw={result:{deployment:{id:expected.deploymentId,project:{id:expected.projectId},source:'git',readyState:'READY',meta:{githubCommitSha:expected.commit,githubOrg:'darkapoparka',githubRepo:'cars-promosalevarna',githubCommitRef:expected.branch},url:'cars-promosalevarna-nj823vwow-tyj5.vercel.app'}}};
 const result=observeVercelGithubDeployment(raw,expected);assert.equal(result.commit,expected.commit);assert.equal(result.actualSourceFieldPresent,true);assert(!Object.hasOwn(raw.result.deployment,'gitSource'));
 for(const mutate of[r=>r.result.deployment.meta.githubCommitSha='0'.repeat(40),r=>r.result.deployment.project.id='prj_other',r=>r.result.deployment.readyState='BUILDING',r=>r.result.deployment.gitSource={type:'github',sha:'0'.repeat(40)}]){const r=structuredClone(raw);mutate(r);assert.throws(()=>observeVercelGithubDeployment(r,expected));}
});
test('derived Git package trees reject ambiguous duplicate and escaping paths',()=>{
 const a=currentPackageTrees([{path:'modern/a.ts',blob:'1'.repeat(40)}]);assert(/^[0-9a-f]{40}$/.test(a.tree));assert.throws(()=>currentPackageTrees([{path:'../outside',blob:'1'.repeat(40)}]));assert.throws(()=>currentPackageTrees([{path:'modern/a.ts',blob:'1'.repeat(40)},{path:'modern/a.ts',blob:'2'.repeat(40)}]));
});

test('the published new-dealer source scope survives mapping integration without granting native approval',async()=>{const{validateNativeQualificationContext}=await import('./lib/native-localization.mjs');const context={schemaVersion:1,kind:'cars-native-source-qualification-context',id:'new-dealer-fixture',dealer:'fixture-dealer',scope:'new-dealer-source-proposal',reviewed:true,reviewedAt:'2026-10-12T00:00:00Z',sourceCommit:'1'.repeat(40),nativeApproval:false,hostedApproval:false,globalReleaseApproval:false,approvedLockSha256:'2'.repeat(64),candidateLockSha256:'3'.repeat(64),sourceDeltaReview:{reference:'docs/releases/fixture-source.json',sha256:'4'.repeat(64),reviewedAt:'2026-10-12T00:00:00Z'}};assert.equal(validateNativeQualificationContext(context).scope,context.scope);assert.equal(validateNativeQualificationContext({...context,scope:'existing-dealer-pilot'}).scope,'existing-dealer-pilot');assert.throws(()=>validateNativeQualificationContext({...context,nativeApproval:true}));assert.throws(()=>validateNativeQualificationContext({...context,scope:'globally-approved'}));});
