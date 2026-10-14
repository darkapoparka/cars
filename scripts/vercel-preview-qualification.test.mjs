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

const f1rstProductionPilot={
  "schemaVersion": 1,
  "kind": "cars-owner-authorized-f1rst-main-production-pilot",
  "dealer": "f1rst-motors",
  "repository": "darkapoparka/cars-f1rstmotors",
  "projectId": "prj_mavqUXCj6hSEg8EvBJW8G3XJlihm",
  "publicOrigin": "https://cars-f1rstmotors.vercel.app",
  "sourceCommit": "a7044683f48187e2e095d1541177b746b41b15e5",
  "sourceTree": "947f66ca0c9bc86c5b94eae1d0aed1e7b78d3cfd",
  "templateSourceCommit": "7d4557f3074b32e3f57af28b89906754b73fb9cd",
  "privateMain": "6e0184b856858fa4f9d0b158f64b4edef44f0e83",
  "priorReady": {
    "deploymentId": "dpl_DMWq9arGWLk3wxSqzhSyzSvsu5pa",
    "gitCommit": "bda8b54af9326f1e85d981431346fccc29b1d05e",
    "sourceCommit": "3e7002fb71f38c3c99bc35e8ba8b9fb9730c8447",
    "sourceTree": "4bf06e41365c440f74754a787063b4ff35c6f343",
    "packageTree": "0fe7f8d8b3ba54c67ad45066ecd3f7814d4b50d5",
    "serviceCount": 6,
    "receiptSha256": "4940ea6bada364d711ef8c78ab118a183f61b0c4de8c6541020289e1075cf95a"
  },
  "reviewedSuccessor": {
    "path": "docs/releases/cloudflare-existing25-20261011/vercel-existing-source/f1rst-motors/source-preparation-successor-receipt.json",
    "sha256": "2536b02b81da5aa9e6f0f22dfef055f017542632d6a790ab2175dadaa6506772",
    "preparedTree": "947f66ca0c9bc86c5b94eae1d0aed1e7b78d3cfd",
    "nativeInputDigest": "68cc34d7b99cc5356ee7494ff77ce27c47674c00d0369f93e02d572be73b9622"
  },
  "ownerAuthorizedMain": true,
  "otherFiveTemplateTreesUnchanged": true,
  "stockAndFactsUnchanged": true,
  "productionBuildPending": true,
  "hostedApproval": false
};

function f1rstMainEnvelope(){
 const pilot=structuredClone(f1rstProductionPilot),manifest={slug:pilot.dealer,repository:pilot.repository,shareIdentity:{publicOrigin:pilot.publicOrigin}};
 const meta={sourceCommit:pilot.sourceCommit,assetDelivery:{provider:'vercel'},qualification:{schemaVersion:1,kind:'cars-vercel-native-source-qualification',provider:'vercel',dealer:pilot.dealer,repository:pilot.repository,publicOrigin:pilot.publicOrigin,sourceCommit:pilot.sourceCommit,targetBranch:'codex/fleet-final-polish-20261014',production:false,nativeApproval:false,hostedApproval:false,globalReleaseApproval:false,templateSourceCommit:pilot.templateSourceCommit,candidateLockSha256:'4ceb9b3085d3dae4c415229d134ef33905e352f499ae2e1126bd85e318d648d8',nativeInput:{digest:pilot.reviewedSuccessor.nativeInputDigest}}};
 return {pilot,manifest,meta};
}
test('owner-authorized F1rst MAIN pilot retains provisional flags and exact source/build evidence',()=>{
 const {pilot,manifest,meta}=f1rstMainEnvelope();assertVercelQualificationExport(meta,{branch:'main',manifest,productionPilot:pilot});
 assert.equal(meta.qualification.nativeApproval,false);assert.equal(meta.qualification.hostedApproval,false);assert.equal(pilot.productionBuildPending,true);
 assert.throws(()=>assertVercelQualificationExport(meta,{branch:'main',manifest}),/exact reviewed preview branch/);
 assert.throws(()=>assertVercelQualificationExport(meta,{branch:'codex/other',manifest,productionPilot:pilot}),/existing MAIN/);
});
test('MAIN pilot cannot admit another identity, source, stale lease, unproved build or forged approval',()=>{
 for(const mutate of [f=>f.pilot.dealer='dealer-1',f=>f.pilot.privateMain='0'.repeat(40),f=>f.pilot.priorReady.serviceCount=4,f=>f.pilot.reviewedSuccessor.sha256='0'.repeat(64),f=>f.meta.sourceCommit='0'.repeat(40),f=>f.meta.qualification.nativeInput.digest='0'.repeat(64),f=>f.meta.qualification.nativeApproval=true,f=>f.meta.qualification.hostedApproval=true,f=>f.pilot.productionBuildPending=false,f=>f.pilot.hostedApproval=true]){
  const f=f1rstMainEnvelope();mutate(f);assert.throws(()=>assertVercelQualificationExport(f.meta,{branch:'main',manifest:f.manifest,productionPilot:f.pilot}));
 }
 const f=f1rstMainEnvelope();delete f.meta.qualification;assert.throws(()=>assertVercelQualificationExport(f.meta,{branch:'main',manifest:f.manifest,productionPilot:f.pilot}),/actual provisional source envelope/);
});

const unchangedF1TemplateSources={
  "auto-best": {
    "repository": "darkapoparka/cars",
    "revision": "7d4557f3074b32e3f57af28b89906754b73fb9cd",
    "path": "templates/auto-best",
    "tree": "0fd8e81b7ea998227b8a5a067b04f318015bff84",
    "digest": "451141c1787f5ea293a60170ca9f894c35ebd3324e0a6ff09b00b959f2812176"
  },
  "modern": {
    "repository": "darkapoparka/cars",
    "revision": "7d4557f3074b32e3f57af28b89906754b73fb9cd",
    "path": "templates/modern",
    "tree": "01eac7390fa6ba951d4b8d4c26159a9be150f6c8",
    "digest": "30e1a99f857cc25e4d78c9459cfb4394a9f70c5b114196a5ca6325ff38823b4b"
  },
  "import": {
    "repository": "darkapoparka/cars",
    "revision": "7d4557f3074b32e3f57af28b89906754b73fb9cd",
    "path": "templates/import",
    "tree": "d841ddfe5bec918bf6b2c19fd6971fecd6b8e54d",
    "digest": "c7d6c93214e859aa2747af8f5e068b6a0b8ca095d6328c807728a4d531d688f8"
  },
  "app": {
    "repository": "darkapoparka/cars",
    "revision": "7d4557f3074b32e3f57af28b89906754b73fb9cd",
    "path": "templates/app",
    "tree": "7f3d3ffa40546635377e6c5225194fe06fead291",
    "digest": "df336def57349fedfc4c425a00c7434c251735b90abb4636d0926290aafa7ed1"
  },
  "mobile": {
    "repository": "darkapoparka/cars",
    "revision": "7d4557f3074b32e3f57af28b89906754b73fb9cd",
    "path": "templates/mobile",
    "tree": "792bfdd1d8eb22aabd90c7e3a0c0779a6c1c36f3",
    "digest": "f5a3e541a7c648a4c2899ad3893e22a3806027a9f66d95fa4e8c74b2226635b6"
  },
  "karento-best": {
    "repository": "darkapoparka/cars",
    "revision": "7d4557f3074b32e3f57af28b89906754b73fb9cd",
    "path": "templates/karento-best",
    "tree": "8c5ac869c7fd15e19a80c660343fc64b20a2bad9",
    "digest": "be17ef365e3272753df6e50826b139a45bfc32b8fef54ddcb86d977ad16280a9"
  }
};

function reviewedF1Successor(){
 const f=f1rstMainEnvelope(),p=f.pilot;p.sourceCommit='9'.repeat(40);p.sourceTree='a'.repeat(40);p.privateMain='771d8e368e796d94ce3bbbcc589989f5dc778533';p.templateSourceCommit='8'.repeat(40);p.candidateLockSha256='b'.repeat(64);
 f.meta.sourceCommit=p.sourceCommit;f.meta.qualification.sourceCommit=p.sourceCommit;f.meta.qualification.templateSourceCommit=p.templateSourceCommit;f.meta.qualification.candidateLockSha256=p.candidateLockSha256;f.meta.qualification.nativeInput.digest='d'.repeat(64);
 f.manifest.templateSources=structuredClone(unchangedF1TemplateSources);for(const s of Object.values(f.manifest.templateSources))s.revision=p.templateSourceCommit;f.manifest.templateSources['auto-best'].tree='e'.repeat(40);f.manifest.templateSources['auto-best'].digest='f'.repeat(64);
 p.reviewedSuccessor={scope:'owner-reviewed-auto-best-ui-source-successor',reviewed:true,authoritativeFactsUnchanged:true,allRasterAssetBytesUnchanged:true,path:p.reviewedSuccessor.path,sha256:'c'.repeat(64),preparedTree:p.sourceTree,sourceRevision:p.templateSourceCommit,baseline:{commit:'a7044683f48187e2e095d1541177b746b41b15e5',tree:'947f66ca0c9bc86c5b94eae1d0aed1e7b78d3cfd'},nativeInputDigest:f.meta.qualification.nativeInput.digest,autoBestSource:{tree:f.manifest.templateSources['auto-best'].tree,digest:f.manifest.templateSources['auto-best'].digest},changedAutoLeaves:[{path:'src/lib/components/about/AboutProcess.svelte',beforeBlob:'1'.repeat(40),afterBlob:'2'.repeat(40)}],personalizationMarker:{path:'src/lib/data/company.ts',beforeBlob:'3'.repeat(40),afterBlob:'4'.repeat(40),insertedDeclaration:"export const companyServicesCopyOwner = 'dealer' as const;",factualServiceFieldsUnchanged:true}};
 p.priorProduction={state:'READY',target:'production',gitBranch:'main',projectId:p.projectId,publicOrigin:p.publicOrigin,deploymentId:'dpl_DhKSjHLeR9K6qykGy96qdks7PgFn',gitCommit:p.privateMain,receiptSha256:'263777ed0cb33818b9008994408a8bc368db1b374cdf804ef2ebe842590f3e7f',serviceCount:6,sourceCommit:p.reviewedSuccessor.baseline.commit,sourceTree:p.reviewedSuccessor.baseline.tree};return f;
}
test('reviewed F1 MAIN successor uses exact current leases and real prior6 without promoting approval',()=>{
 const f=reviewedF1Successor();assertVercelQualificationExport(f.meta,{branch:'main',manifest:f.manifest,productionPilot:f.pilot});assert.equal(f.meta.qualification.hostedApproval,false);
 assert.throws(()=>assertVercelQualificationExport(f.meta,{branch:'main',manifest:f.manifest}),/exact reviewed preview branch/);
});
test('successor refuses other families, protected facts, stale source/input/main and false prior readiness',()=>{
 for(const mutate of [f=>f.manifest.templateSources.modern.tree='0'.repeat(40),f=>f.pilot.reviewedSuccessor.changedAutoLeaves[0].path='src/lib/data/current-inventory.ts',f=>f.pilot.reviewedSuccessor.personalizationMarker.insertedDeclaration='overwrite services',f=>f.pilot.reviewedSuccessor.personalizationMarker.factualServiceFieldsUnchanged=false,f=>f.pilot.reviewedSuccessor.baseline.tree='0'.repeat(40),f=>f.pilot.priorProduction.serviceCount=4,f=>f.pilot.priorProduction.state='ERROR',f=>f.pilot.priorProduction.gitCommit='0'.repeat(40),f=>f.pilot.sourceCommit='0'.repeat(40),f=>f.pilot.reviewedSuccessor.nativeInputDigest='0'.repeat(64),f=>f.pilot.candidateLockSha256='0'.repeat(64),f=>f.pilot.hostedApproval=true]){
  const f=reviewedF1Successor();mutate(f);assert.throws(()=>assertVercelQualificationExport(f.meta,{branch:'main',manifest:f.manifest,productionPilot:f.pilot}));
 }
});
