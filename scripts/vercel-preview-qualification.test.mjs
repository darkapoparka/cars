import test from 'node:test';import assert from 'node:assert/strict';import fs from 'node:fs';import os from 'node:os';import path from 'node:path';
import {nativeFixture} from './test-fixtures/native-source.mjs';
import {adoptNativeQualification} from './publishing/native-mounts.mjs';
import {assertNativeAdoption} from './lib/native-localization.mjs';
import {vercelPreviewQualification,planDealerPackage,packageDealer} from './package-dealer.mjs';
import {assertVercelQualificationExport} from './export-dealer.mjs';

function fixture(t){
 const directory=fs.mkdtempSync(path.join(os.tmpdir(),'cars-vercel-preview-qualification-'));
 t.after(()=>{const exact=fs.realpathSync(directory),relative=path.relative(fs.realpathSync(os.tmpdir()),exact);assert(relative.startsWith('cars-vercel-preview-qualification-')&&!relative.includes(path.sep)&&!path.isAbsolute(relative));fs.rmSync(exact,{recursive:true,force:true});});
 const f=nativeFixture(path.join(directory,'source'));f.manifest.shareIdentity={publicOrigin:'https://fixture-cars.vercel.app'};
 const context={schemaVersion:1,kind:'cars-native-source-qualification-context',id:'fixture-final-source',dealer:f.manifest.slug,scope:'existing-dealer-pilot',sourceCommit:'9'.repeat(40),reviewed:true,reviewedAt:'2026-10-14T00:00:00Z',nativeApproval:false,hostedApproval:false,globalReleaseApproval:false,approvedLockSha256:'a'.repeat(64),candidateLockSha256:'b'.repeat(64),sourceDeltaReview:{reference:'docs/releases/fixture-delta.json',sha256:'c'.repeat(64),reviewedAt:'2026-10-14T00:00:00Z'}};
 const files=adoptNativeQualification(f.files,f.manifest,f.releases,context);
 for(const [name,b]of files){const p=path.join(f.source,name);fs.mkdirSync(path.dirname(p),{recursive:true});fs.writeFileSync(p,b);}fs.writeFileSync(path.join(f.source,'dealer.json'),JSON.stringify(f.manifest,null,2)+'\n');
 return {...f,files,context,qualification:{context,targetBranch:'codex/final-source-pilot'},sourceCommit:'8'.repeat(40)};
}
test('a real native candidate seal admits only its exact Vercel preview branch',t=>{
 const f=fixture(t),envelope=vercelPreviewQualification(f.files,f.manifest,f.qualification,{sourceCommit:f.sourceCommit});
 assert.equal(envelope.kind,'cars-vercel-native-source-qualification');assert.equal(envelope.sourceCommit,f.sourceCommit);assert.equal(envelope.templateSourceCommit,f.context.sourceCommit);
 assert.equal(envelope.production,false);assert.equal(envelope.nativeApproval,false);assert.equal(envelope.hostedApproval,false);assert.equal(envelope.globalReleaseApproval,false);
 const meta={sourceCommit:f.sourceCommit,assetDelivery:{provider:'vercel'},qualification:envelope};assertVercelQualificationExport(meta,{branch:f.qualification.targetBranch,manifest:f.manifest});
 for(const branch of ['main','codex/another-pilot'])assert.throws(()=>assertVercelQualificationExport(meta,{branch,manifest:f.manifest}),/exact reviewed preview branch/);
 assert.throws(()=>assertNativeAdoption(f.files,f.manifest),/ordinary publication is refused/);
});
test('changed candidate bytes, forged approval, other provider and main are rejected',t=>{
 const f=fixture(t);const check=(files=f.files,q=f.qualification,extra={})=>vercelPreviewQualification(files,f.manifest,q,{sourceCommit:f.sourceCommit,...extra});
 const changed=new Map(f.files);changed.set('modern/localization/en.json',Buffer.from('{"title":"changed","detail":"View {vehicle}","contact":{"title":"Trade-in enquiry"}}'));
 assert.throws(()=>check(changed),/catalog audit changed|Native source changed/);
 assert.throws(()=>check(f.files,{...f.qualification,context:{...f.context,nativeApproval:true}}),/qualification context/);
 assert.throws(()=>check(f.files,{...f.qualification,targetBranch:'main'}),/exact codex preview branch/);
 assert.throws(()=>check(f.files,f.qualification,{provider:'cloudflare'}),/Vercel qualification/);
 assert.throws(()=>check(f.files,f.qualification,{nativeReleases:f.releases}),/Vercel qualification/);
});
test('ordinary package planning still refuses the actual provisional source seal',async t=>{
 const f=fixture(t);await assert.rejects(planDealerPackage({source:f.source,destination:path.join(f.source,'../fixture-package'),manifest:f.manifest,canonicalFiles:f.files,sourceCommit:f.sourceCommit}),/ordinary publication is refused/);
});
test('the maintained packager emits a sealed preview envelope from actual admitted candidate bytes',async t=>{
 const f=fixture(t),destination=path.join(f.source,'../package');await packageDealer({source:f.source,destination,manifest:f.manifest,canonicalFiles:f.files,sourceCommit:f.sourceCommit,nativeQualification:f.qualification});
 const meta=JSON.parse(fs.readFileSync(path.join(destination,'.cars-package.json')));assert.equal(meta.qualification.targetBranch,f.qualification.targetBranch);assert.equal(meta.qualification.nativeApproval,false);assert.equal(meta.qualification.hostedApproval,false);assert.equal(meta.sourceCommit,f.sourceCommit);
 assertVercelQualificationExport(meta,{branch:f.qualification.targetBranch,manifest:meta.manifest});assert.throws(()=>assertVercelQualificationExport(meta,{branch:'main',manifest:meta.manifest}),/exact reviewed preview branch/);
});
