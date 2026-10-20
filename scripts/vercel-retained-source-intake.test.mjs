import test from 'node:test';import assert from 'node:assert/strict';import {createHash} from 'node:crypto';
import {planRetainedVercelSourceIntake,retainedSourceTree,retainedSourceBlob} from './lib/vercel-retained-source-intake.mjs';
const hash=b=>createHash('sha256').update(b).digest('hex');const keys=['auto-best','modern','import','app','mobile','karento-best'];
function fixture(dealer='f1rst-motors'){
 const repository='darkapoparka/cars-'+dealer.replaceAll('-',''),origin='https://cars-'+dealer.replaceAll('-','')+'.vercel.app';
 const manifest={schemaVersion:1,slug:dealer,repository,packaging:{version:'5'},variants:keys.map((key,i)=>({key,base:i?'/variant-'+(i+1):'',entry:key==='modern'?'/variant-2/cars':i?'/variant-'+(i+1)+'/':'/'})),shareIdentity:{publicOrigin:origin},templateSources:Object.fromEntries(keys.map(key=>[key,{repository:'darkapoparka/cars',revision:'1'.repeat(40),path:'templates/'+key,tree:'2'.repeat(40),digest:'3'.repeat(64)}])),templateRevisions:Object.fromEntries(keys.map(key=>[key,'1'.repeat(40)]))};
 const manifestBytes=Buffer.from(JSON.stringify(manifest,null,2)+'\n'),entry=(path,body)=>({path,mode:'100644',blob:retainedSourceBlob(Buffer.from(body)),bytes:Buffer.byteLength(body)});
 const entries=[entry('dealer.json',manifestBytes),entry('business-facts.json','{"name":"Actual dealer"}\n'),entry('stock.json','[{"photo":"retained-photo.webp"}]\n'),...keys.map(key=>entry(key+'/package.json','{"name":"'+key+'"}\n'))];
 const baseline=[entry('dealer.json','{"packaging":{"version":"3"}}\n'),entry('unique-old-source.txt','Preserved in parented Git history\n')],sourceTree=retainedSourceTree(entries).tree;
 return {dealer,record:{slug:dealer,repository,canonicalSourceRepository:'darkapoparka/cars',delivery:{projectId:'prj_fixture'}},previousDelivery:{slug:dealer,repository,origin,projectId:'prj_fixture',commit:'4'.repeat(40),packageTree:'5'.repeat(40),digest:'6'.repeat(64),sourceCommit:'7'.repeat(40)},freshPrivate:{slug:dealer,repository,origin,projectId:'prj_fixture',privateMain:'4'.repeat(40),unchangedSinceYesterday:true},canonicalBaseline:{commit:'8'.repeat(40),path:'clients/'+dealer,tree:retainedSourceTree(baseline).tree,entries:baseline},rawSource:{commit:'7'.repeat(40),originalCommit:'7'.repeat(40),tree:sourceTree,prefix:'',entries,commitTreeVerified:true},manifestBytes,knownRemoteBlobs:new Set(entries.map(e=>e.blob))};
}
test('exact raw six-source intake uses existing objects and preserves accepted identity',()=>{
 const f=fixture(),p=planRetainedVercelSourceIntake(f);assert.equal(p.preparedTree,f.rawSource.tree);assert.equal(p.objectTransport.missingBlobs.length,0);assert.equal(p.objectTransport.noSourceDirectoryExport,true);assert.equal(p.canonicalBaseline.tree,f.canonicalBaseline.tree);assert.equal(p.privateBaseline.commit,f.previousDelivery.commit);assert.equal(p.nativeApproval,false);assert.equal(p.published,false);assert.deepEqual(p.candidateEntries.find(e=>e.path==='stock.json'),f.rawSource.entries.find(e=>e.path==='stock.json'));
});
test('changed canonical tree or private head cannot pass the intake lease',()=>{
 const f=fixture();assert.throws(()=>planRetainedVercelSourceIntake({...f,canonicalBaseline:{...f.canonicalBaseline,tree:'9'.repeat(40)}}),/canonical client tree lease/);assert.throws(()=>planRetainedVercelSourceIntake({...f,freshPrivate:{...f.freshPrivate,privateMain:'a'.repeat(40)}}),/accepted private head/);
});
test('only KG’s exact live manifest can fill its recorded raw-source omission',()=>{
 const f=fixture('kg-team-auto');f.rawSource.entries=f.rawSource.entries.filter(e=>e.path!=='dealer.json');f.rawSource.tree=retainedSourceTree(f.rawSource.entries).tree;
 assert.throws(()=>planRetainedVercelSourceIntake(f),/missing-manifest envelope/);
 f.manifestEnvelope={kind:'exact-published-dealer-manifest-envelope',reviewed:true,privateCommit:f.freshPrivate.privateMain,path:'dealer.json',blob:retainedSourceBlob(f.manifestBytes),sha256:hash(f.manifestBytes)};
 const p=planRetainedVercelSourceIntake(f);assert.equal(p.candidateEntries.find(e=>e.path==='dealer.json').blob,f.manifestEnvelope.blob);assert.notEqual(p.preparedTree,f.rawSource.tree);
 assert.throws(()=>planRetainedVercelSourceIntake({...f,manifestEnvelope:{...f.manifestEnvelope,privateCommit:'b'.repeat(40)}}),/missing-manifest envelope/);
});
test('a later source correction requires every exact reviewed blob transition',()=>{
 const f=fixture(),original=f.rawSource.entries;f.rawSource={...f.rawSource,originalTree:f.rawSource.tree,originalEntries:original,commit:'b'.repeat(40),entries:original.map(e=>e.path==='business-facts.json'?{...e,blob:'c'.repeat(40)}:e)};f.rawSource.tree=retainedSourceTree(f.rawSource.entries).tree;
 assert.throws(()=>planRetainedVercelSourceIntake(f),/later raw-source correction review/);
 f.correctionReview={reviewed:true,sha256:'d'.repeat(64),parent:f.rawSource.originalCommit,sourceCommit:f.rawSource.commit,sourceTree:f.rawSource.tree,changes:[{path:'business-facts.json',beforeBlob:original.find(e=>e.path==='business-facts.json').blob,afterBlob:'c'.repeat(40),reason:'Exact reviewed factual source correction.'}]};planRetainedVercelSourceIntake(f);
 f.correctionReview.changes[0].afterBlob='e'.repeat(40);assert.throws(()=>planRetainedVercelSourceIntake(f),/Unreviewed raw source correction/);
});
test('historical generated metadata is omitted through the existing source policy; independent and unverified roots are refused',()=>{
 const f=fixture(),entries=[...f.rawSource.entries,{path:'.cars-package.json',mode:'100644',blob:'e'.repeat(40),bytes:2}],p=planRetainedVercelSourceIntake({...f,rawSource:{...f.rawSource,entries,tree:retainedSourceTree(entries).tree}});assert(!p.candidateEntries.some(e=>e.path==='.cars-package.json'));assert(p.sourceProjection.pathsOmitted.includes('.cars-package.json'));assert.equal(p.sourceProjection.generatedMountsRewritten,false);assert.throws(()=>planRetainedVercelSourceIntake({...f,rawSource:{...f.rawSource,commitTreeVerified:false}}),/commit\/root binding/);assert.throws(()=>planRetainedVercelSourceIntake({...f,record:{...f.record,sourceOwnership:'independent-repository'}}),/Independent dealer/);
});
test('literal path/mode collisions are rejected before object transport',()=>{
 for(const entries of [[{path:'../stock.json',mode:'100644',blob:'1'.repeat(40)}],[{path:'a',mode:'120000',blob:'1'.repeat(40)}],[{path:'a',mode:'100644',blob:'1'.repeat(40)},{path:'a/b',mode:'100644',blob:'2'.repeat(40)}]])assert.throws(()=>retainedSourceTree(entries));
});
