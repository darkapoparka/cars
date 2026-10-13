import test from 'node:test';
import assert from 'node:assert/strict';
import {createHash} from 'node:crypto';
import {REPAIR_KEYS,componentArtifactName,componentRepairRow,applyReviewedComponentRepairs,componentSourceRows,verifyOriginalComponentMetadata,createComponentReuseProof,assertComponentReuseProof,componentAssemblyIdentity,componentAssemblyRow,componentCompileContext,componentDownloadPlan,verifyRetainedComponentMetadata,signatureStaticFontCompletion,assertSignatureStaticFontCompletion} from './lib/fleet-component-repairs.mjs';
const hash=x=>createHash('sha256').update(x).digest('hex');
const canonical=x=>JSON.stringify(x,(_k,v)=>v&&typeof v==='object'&&!Array.isArray(v)?Object.fromEntries(Object.entries(v).sort(([a],[b])=>a.localeCompare(b))):v);
function fixture(){
 const slug='auto-insurance-import-varna',sourceTree='1'.repeat(40),sourceCommit='2'.repeat(40),newCommit='3'.repeat(40);
 const names=['modern/packages/marketplace-ui/components/dealer-mobile-brand-bar.tsx','modern/packages/marketplace-ui/components/mobile-dealer-discovery-header.tsx','import/src/lib/content/localized.ts'];
 const files=new Map(names.map(name=>[name,Buffer.from('before:'+name)]));
 const sourceChanges=names.map(name=>({path:name,operation:name.startsWith('modern/')?'modern-dark-discovery-v1':'import-illustrative-stock-en-v1',beforeSha256:hash(files.get(name)),afterSha256:hash('after:'+name)}));
 const original={runId:38341478999,attempt:1,sourceCommit,artifacts:REPAIR_KEYS.map((key,i)=>({id:100+i,name:componentArtifactName(slug,key,38341478999,1),sizeInBytes:1000+i,sha256:hash('original:'+key)}))};
 const row={slug,sourceTree,rebuild:['modern','import'],sourceChanges,original};
 const request={dealers:[slug],componentRepair:{schemaVersion:1,kind:'cars-existing-component-repair',reviewed:true,reviewedAt:'2026-10-13T05:00:00Z',dealers:[row]}};
 const repair=source=>({source:source.replace(/^before:/,'after:')});
 const sourceRepairs=applyReviewedComponentRepairs(files,request,slug,sourceTree,{importRepair:repair,modernRepair:(_name,source)=>repair(source)});
 const context={sourceCommit:newCommit,runId:999,attempt:1};
 const prepared={sourceTree,inputDigest:hash('raw-source'),componentRepair:sourceRepairs,familyBeforeDependencies:{}};
 const inputs={};
 for(const key of REPAIR_KEYS){
  const prefix=(key==='router'?'cloudflare':key)+'/',rows=[{path:prefix+'verified-native-source',sha256:hash(key+':unchanged-source')}];
  prepared.familyBeforeDependencies[key]=rows;
  const fresh=row.rebuild.includes(key),where=fresh?context:original,inventory={digest:hash('inventory:'+key)};
  const deploy={sourceCommit:where.sourceCommit,sourceTree,inputDigest:prepared.inputDigest,runId:where.runId,attempt:where.attempt,compiledDigest:hash('compiled:'+key)};
  const source={sourceCommit:deploy.sourceCommit,sourceTree,inputDigest:prepared.inputDigest,targetBeforeDependencies:rows,...(fresh?{componentRepair:sourceRepairs}:{})};
  inputs[key]={deploy,source,inventory};
 }
 const run={id:original.runId,run_attempt:1,head_sha:sourceCommit,status:'completed',conclusion:'success',event:'push',repository:{full_name:'darkapoparka/cars'},head_repository:{full_name:'darkapoparka/cars'},path:'.github/workflows/existing-fleet-cloudflare.yml',head_branch:'main'};
 const artifacts={artifacts:original.artifacts.map(a=>({id:a.id,name:a.name,size_in_bytes:a.sizeInBytes,digest:'sha256:'+a.sha256,expired:false,workflow_run:{id:original.runId,head_sha:sourceCommit}}))};
 const originalMetadata=verifyOriginalComponentMetadata(row,run,artifacts);
 return {slug,files,request,row,prepared,context,inputs,run,artifacts,originalMetadata};
}
function proof(f=fixture()){return createComponentReuseProof({request:f.request,slug:f.slug,context:f.context,prepared:f.prepared,inputs:f.inputs,originalMetadata:f.originalMetadata});}
const deploys=f=>Object.fromEntries(REPAIR_KEYS.map(k=>[k,f.inputs[k].deploy]));
const reseal=p=>{const {seal,...rest}=p;return {...rest,seal:hash(canonical(rest))};};
test('ordinary same-run requests do not opt into component repair',()=>{assert.equal(componentRepairRow({dealers:['ordinary']},'ordinary'),null);});
test('exact reviewed Modern+Import source changes and original seven artifacts validate',()=>{const f=fixture();assert.equal(componentRepairRow(f.request,f.slug),f.row);assert.deepEqual(f.row.rebuild,['modern','import']);assert.equal(f.prepared.componentRepair.sourceChanges.length,3);assert.equal(f.prepared.componentRepair.appBindingsChanged,false);});
test('source transform cannot silently broaden, miss the before lease or differ from reviewed after bytes',()=>{const f=fixture();assert.throws(()=>applyReviewedComponentRepairs(f.files,f.request,f.slug,f.row.sourceTree,{importRepair:()=>({source:'arbitrary'}),modernRepair:()=>({source:'arbitrary'})}),/original source bytes/);const files=new Map(f.row.sourceChanges.map(x=>[x.path,Buffer.from('before:'+x.path)]));assert.throws(()=>applyReviewedComponentRepairs(files,f.request,f.slug,f.row.sourceTree,{importRepair:()=>({source:'wrong'}),modernRepair:()=>({source:'wrong'})}),/reviewed result/);assert.throws(()=>applyReviewedComponentRepairs(files,f.request,f.slug,'f'.repeat(40)),/source tree/);});
for(const [name,change]of [
 ['unreviewed',f=>{f.request.componentRepair.reviewed=false;}],
 ['new App mapping',f=>{f.row.sourceChanges[0].path='app/AppShell.tsx';}],
 ['missing Modern half',f=>{f.row.sourceChanges.splice(0,1);}],
 ['unnecessary App rebuild',f=>{f.row.rebuild.push('app');}],
 ['unchanged Import not rebuilt',f=>{f.row.rebuild=['modern'];}],
 ['duplicate donor',f=>{f.row.original.artifacts[1]=f.row.original.artifacts[0];}],
 ['renamed original artifact',f=>{f.row.original.artifacts[0].name+='-new-run';}],
 ['other dealer sharing the specialist patch',f=>{f.row.slug='unreviewed';f.request.dealers=['unreviewed'];}],
 ['duplicate source mutation',f=>{f.row.sourceChanges[1]=f.row.sourceChanges[0];}]
])test('rejects '+name,()=>{const f=fixture();change(f);assert.throws(()=>componentRepairRow(f.request,f.row.slug),/Component repair/);});
for(const [name,change]of [
 ['failed run',f=>{f.run.conclusion='failure';}],['forked run',f=>{f.run.head_repository.full_name='other/cars';}],['wrong original commit',f=>{f.run.head_sha='f'.repeat(40);}],['expired original',f=>{f.artifacts.artifacts[0].expired=true;}],['wrong digest',f=>{f.artifacts.artifacts[0].digest='sha256:'+'0'.repeat(64);}],['wrong size',f=>{f.artifacts.artifacts[0].size_in_bytes++;}],['missing artifact',f=>{f.artifacts.artifacts.pop();}]
])test('rejects donor metadata: '+name,()=>{const f=fixture();change(f);assert.throws(()=>verifyOriginalComponentMetadata(f.row,f.run,f.artifacts),/Component repair/);});
test('five reused families retain original run and two rebuilt families retain the new run',()=>{const f=fixture(),p=proof(f);assert.deepEqual(p.rebuiltFamilies,['modern','import']);assert.equal(p.reusedFamilies.length,5);for(const key of REPAIR_KEYS)assert.equal(p.members[key].runId,f.row.rebuild.includes(key)?999:38341478999);assert.equal(assertComponentReuseProof(p,deploys(f)),p);const original=f.inputs.router.deploy,newIdentity=componentAssemblyIdentity(original,p);assert.notEqual(original,newIdentity);assert.equal(original.runId,38341478999);assert.equal(newIdentity.runId,'999');assert.equal(componentAssemblyIdentity(original,null),original);});
test('refuses an unaffected source drift instead of falsely reusing its passed compiled component',()=>{const f=fixture();f.inputs.app.source.targetBeforeDependencies=[{path:'app/verified-native-source',sha256:hash('changed source')}];assert.throws(()=>proof(f),/reused native family source changed unexpectedly: app/);});
test('refuses rebuilt source drift and missing reviewed source repair receipt',()=>{const f=fixture();f.inputs.modern.source.targetBeforeDependencies=[{path:'modern/verified-native-source',sha256:hash('wrong source')}];assert.throws(()=>proof(f),/rebuilt native family source/);const other=fixture();delete other.inputs.import.source.componentRepair;assert.throws(()=>proof(other),/exact reviewed source repairs/);});
test('refuses renamed donor run, forged seal, wrong inventory and original-run impersonation',()=>{const f=fixture(),p=proof(f),wrong=structuredClone(p);wrong.members.app.runId=999;assert.throws(()=>assertComponentReuseProof(wrong,deploys(f)),/seal/);assert.throws(()=>assertComponentReuseProof(reseal(wrong),deploys(f)),/relabeled source\/run/);const counterfeit=structuredClone(p);counterfeit.assembly.runId=f.row.original.runId;assert.throws(()=>assertComponentReuseProof(reseal(counterfeit),deploys(f)),/impersonate/);const bad=structuredClone(deploys(f));bad.app.compiledDigest='0'.repeat(64);assert.throws(()=>assertComponentReuseProof(p,bad),/compiled\/source proof/);});
test('family proof ignores unrelated packaging metadata but includes all actual native files',()=>{const a=hash('a'),b=hash('b');assert.deepEqual(componentSourceRows([{path:'scripts/package-helper.mjs',sha256:b},{path:'app/b',sha256:b},{path:'app/a',sha256:a}],'app'),[{path:'app/a',sha256:a},{path:'app/b',sha256:b}]);assert.throws(()=>componentSourceRows([],'app'),/missing or invalid/);assert.throws(()=>componentSourceRows([{path:'app/../foreign',sha256:a}],'app'),/missing or invalid/);});

function retainedFixture(){
 const f=fixture(),bytes=Buffer.from(JSON.stringify(f.request)),where=f.context;
 const assembly={schemaVersion:1,kind:'cars-retained-component-assembly',sourceCommit:where.sourceCommit,runId:where.runId,attempt:where.attempt,requestSha256:hash(bytes),planJobId:500,
  artifacts:f.row.rebuild.map((key,i)=>({dealer:f.slug,key,id:1000+i,jobId:600+i,name:componentArtifactName(f.slug,key,where.runId,where.attempt),sizeInBytes:100+i,sha256:hash('retained-zip:'+key)}))};
 f.request.componentAssembly=assembly;
 const run={...f.run,id:where.runId,head_sha:where.sourceCommit,conclusion:'failure'};
 const artifacts={artifacts:assembly.artifacts.map(a=>({id:a.id,name:a.name,size_in_bytes:a.sizeInBytes,digest:'sha256:'+a.sha256,expired:false,workflow_run:{id:where.runId,head_sha:where.sourceCommit}}))};
 const jobs={total_count:3,jobs:[{id:500,name:'plan',run_id:where.runId,status:'completed',conclusion:'success'},...assembly.artifacts.map(a=>({id:a.jobId,name:f.slug+' / '+a.key,run_id:where.runId,status:'completed',conclusion:'success'}))]};
 const context={sourceCommit:'4'.repeat(40),runId:1001,attempt:1};
 return {...f,assembly,retainedRun:run,retainedArtifacts:artifacts,jobs,bytes,assemblyContext:context};
}
const verifyRetained=f=>verifyRetainedComponentMetadata(f.request,f.slug,f.retainedRun,f.retainedArtifacts,f.jobs,f.bytes);
const retainedProof=f=>createComponentReuseProof({request:f.request,slug:f.slug,context:f.assemblyContext,prepared:f.prepared,inputs:f.inputs,originalMetadata:f.originalMetadata,retainedMetadata:verifyRetained(f)});
test('composition recovery accepts successful selected native jobs from the original failed-delivery run without claiming the whole run passed',()=>{
 const f=retainedFixture(),metadata=verifyRetained(f),p=retainedProof(f);
 assert.equal(metadata.runConclusion,'failure');assert.equal(metadata.selectedCompilationJobsPassed,true);
 assert.equal(p.assembly.runId,1001);assert.equal(p.members.modern.runId,999);assert.equal(p.members.modern.mode,'rebuilt-retained');assert.equal(p.members.app.runId,38341478999);assert.equal(p.members.app.mode,'reused');assert.equal(assertComponentReuseProof(p,deploys(f)),p);
 assert.deepEqual(componentCompileContext(f.assembly,f.assemblyContext),f.context);
 assert.equal(p.sourceRepairs.requestSha256,f.prepared.componentRepair.requestSha256);
});
test('download plan preserves one original artifact directory and does not rename it as the new composition',()=>{
 const f=retainedFixture();f.row.sourceChanges=f.row.sourceChanges.filter(x=>x.path.startsWith('import/'));f.row.rebuild=['import'];f.assembly.artifacts=f.assembly.artifacts.filter(x=>x.key==='import');
 const p=componentDownloadPlan(f.request,f.slug,f.assemblyContext);assert.equal(p.singleArtifactDirectory,componentArtifactName(f.slug,'import',999,1));assert.equal(p.retainedArtifactIds,String(f.assembly.artifacts[0].id));assert.equal(p.originalRunId,38341478999);assert.equal(p.retainedRunId,999);
 delete f.request.componentAssembly;const fresh=componentDownloadPlan(f.request,f.slug,f.context);assert.equal(fresh.singleArtifactDirectory,componentArtifactName(f.slug,'import',999,1));assert.equal(fresh.retainedRunId,0);
});
test('multi-artifact and ordinary seven-family downloads keep native named directories',()=>{const f=retainedFixture(),p=componentDownloadPlan(f.request,f.slug,f.assemblyContext);assert.equal(p.singleArtifactDirectory,'');assert.equal(p.retainedArtifactIds.split(',').length,2);const ordinary=componentDownloadPlan({dealers:['ordinary']},'ordinary',f.context);assert.equal(ordinary.singleArtifactDirectory,'');assert.equal(ordinary.originalRunId,0);assert.equal(componentAssemblyRow({dealers:['ordinary']},'ordinary'),null);});
for(const[name,mutate]of [
 ['active original run',f=>{f.retainedRun.status='in_progress';}],['cancelled original run',f=>{f.retainedRun.conclusion='cancelled';}],['foreign source',f=>{f.retainedRun.head_sha='a'.repeat(40);}],['wrong attempt',f=>{f.retainedRun.run_attempt++;}],['failed plan',f=>{f.jobs.jobs[0].conclusion='failure';}],['failed changed compilation',f=>{f.jobs.jobs[1].conclusion='failure';}],['wrong job run',f=>{f.jobs.jobs[1].run_id++;}],['missing job page',f=>{f.jobs.total_count++;}],['renamed selected job',f=>{f.jobs.jobs[1].name+='-repair';}],['expired retained artifact',f=>{f.retainedArtifacts.artifacts[0].expired=true;}],['wrong retained digest',f=>{f.retainedArtifacts.artifacts[0].digest='sha256:'+'0'.repeat(64);}],['wrong retained size',f=>{f.retainedArtifacts.artifacts[0].size_in_bytes++;}],['wrong artifact origin run',f=>{f.retainedArtifacts.artifacts[0].workflow_run.id++;}],['missing retained artifact',f=>{f.retainedArtifacts.artifacts.pop();}],['source request mutation',f=>{f.request.componentRepair.reviewedAt='2026-10-14T00:00:00Z';}],['wrong original request bytes',f=>{f.bytes=Buffer.from('{}');}],['unrelated additional App artifact',f=>{f.assembly.artifacts[0].key='app';}],['duplicate artifact job',f=>{f.assembly.artifacts[1].jobId=f.assembly.artifacts[0].jobId;}],['unexpected authority key',f=>{f.assembly.force=true;}]
])test('retained composition rejects '+name,()=>{const f=retainedFixture();mutate(f);assert.throws(()=>verifyRetained(f),/Component repair/);});
test('retained composition still rejects source drift and relabeling of passed native members',()=>{
 const f=retainedFixture();f.inputs.modern.source.targetBeforeDependencies=[{...f.inputs.modern.source.targetBeforeDependencies[0],sha256:'a'.repeat(64)}];assert.throws(()=>retainedProof(f),/native family source changed/);
 const other=retainedFixture();other.inputs.modern.deploy.runId=other.assemblyContext.runId;assert.throws(()=>retainedProof(other),/identity differs/);
 const sameRun=retainedFixture();sameRun.assemblyContext={...sameRun.context};assert.throws(()=>retainedProof(sameRun),/distinct retained compilation/);
 const seal=retainedFixture(),p=retainedProof(seal);p.retainedMetadata.planPassed=false;assert.throws(()=>assertComponentReuseProof(reseal(p),deploys(seal)),/retained native metadata/);
});

import fs from 'node:fs';
import {buildMatrix} from './build-existing-fleet-cloudflare.mjs';
test('retained request disables compilation, while removing recovery restores exactly the changed-family matrix',()=>{const f=retainedFixture(),r={...f.request,schemaVersion:1,mode:'existing-migration'},leads=[{slug:f.slug,proposedRepository:'darkapoparka/cars-fixture'}],registry={dealers:[{slug:f.slug,repository:'darkapoparka/cars-fixture'}]};assert.equal(buildMatrix(r,leads,registry).include.length,0);delete r.componentAssembly;assert.equal(buildMatrix(r,leads,registry).include.length,2);});
test('assembly materializes original selected branding and retains single-artifact layout without cancelling independent composition',()=>{const text=fs.readFileSync(new URL('../.github/workflows/existing-fleet-cloudflare.yml',import.meta.url),'utf8');const assembly=text.split('  delivery_artifacts:')[1];assert(assembly.includes('/docs/releases/cloudflare-existing25-20261011/new-source/${{ matrix.slug }}/'));assert(assembly.includes('fail-fast: false'));assert(text.includes("if: needs.plan.outputs.compile_required == 'true'"));assert(assembly.includes('artifact-ids: ${{ matrix.retainedArtifactIds }}'));assert(assembly.includes('/inputs/${{ matrix.singleArtifactDirectory }}'));});

import {SIGNATURE_FONT_FILES} from './publishing/signature-font-assets.mjs';
function fontCompletionFixture(){const f=fixture();const old=f.inputs['karento-best'].source.targetBeforeDependencies.map(x=>({...x}));const fonts=SIGNATURE_FONT_FILES.map(name=>({path:'karento-best/static/assets/fonts/sofia-sans/'+name,sha256:hash(name)}));const imports=SIGNATURE_FONT_FILES.map(name=>({path:'import/static/fonts/sofia-sans/'+name,sha256:hash(name)}));f.prepared.familyBeforeDependencies['karento-best']=[...old,...fonts];f.inputs['karento-best'].source.targetBeforeDependencies=old;const importRows=[...f.prepared.familyBeforeDependencies.import,...imports];f.prepared.familyBeforeDependencies.import=importRows;f.inputs.import.source.targetBeforeDependencies=importRows;return f;}
test('legacy Signature reuse retains exact native source and discloses only nine proven Import-font additions',()=>{const f=fontCompletionFixture(),p=proof(f);assert.equal(p.staticAssetCompletion.files.length,9);assert.equal(p.staticAssetCompletion.scriptOrStyleBytesChanged,false);assert.equal(p.members['karento-best'].sourceFiles,1);assert.equal(p.staticAssetCompletion.preparedSourceFiles,10);assert.equal(p.members['karento-best'].sourceCommit,f.row.original.sourceCommit);assert.equal(p.members.import.runId,f.context.runId);assert.equal(assertComponentReuseProof(p,deploys(f)),p);assert.equal(signatureStaticFontCompletion([],[],[]),null);});
for(const[name,mutate]of [
 ['changed existing source',f=>{f.prepared.familyBeforeDependencies['karento-best'][0]={path:'karento-best/verified-native-source',sha256:'a'.repeat(64)};}],
 ['additional executable',f=>{f.prepared.familyBeforeDependencies['karento-best'].push({path:'karento-best/execute.js',sha256:'a'.repeat(64)});}],
 ['renamed extra font',f=>{f.prepared.familyBeforeDependencies['karento-best'][1].path='karento-best/static/assets/fonts/other.woff2';}],
 ['missing expected font',f=>{f.prepared.familyBeforeDependencies['karento-best'].pop();}],
 ['font differs from Import',f=>{f.prepared.familyBeforeDependencies['karento-best'][1].sha256='b'.repeat(64);}],
 ['missing Import source font',f=>{f.prepared.familyBeforeDependencies.import=f.prepared.familyBeforeDependencies.import.slice(0,-1);f.inputs.import.source.targetBeforeDependencies=f.prepared.familyBeforeDependencies.import;}]
])test('static font reuse rejects '+name,()=>{assert.throws(()=>proof(mutateFixture(fontCompletionFixture(),mutate)),/Component repair/);});
function mutateFixture(f,fn){fn(f);return f;}
test('a resealed forged font exception cannot change the selected source family or hide extra assets',()=>{const f=fontCompletionFixture(),p=proof(f);p.staticAssetCompletion.sourceFamily='app';assert.throws(()=>assertComponentReuseProof(reseal(p),deploys(f)),/Invalid static font/);const q=proof(fontCompletionFixture());q.staticAssetCompletion.files[0].targetPath='public/other.js';assert.throws(()=>assertSignatureStaticFontCompletion(q.staticAssetCompletion,q.members),/Static font/);});
