import test from 'node:test';
import assert from 'node:assert/strict';
import {createHash} from 'node:crypto';
import {REPAIR_KEYS,componentArtifactName,componentRepairRow,applyReviewedComponentRepairs,componentSourceRows,verifyOriginalComponentMetadata,createComponentReuseProof,assertComponentReuseProof,componentAssemblyIdentity} from './lib/fleet-component-repairs.mjs';
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
