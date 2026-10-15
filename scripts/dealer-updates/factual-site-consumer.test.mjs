import assert from 'node:assert/strict';
import {createHash} from 'node:crypto';
import test from 'node:test';
import {applyReviewedFactualConsumerResolutions,assertFactualRefreshCandidate} from './update-dealer-template.mjs';

function fixture(){
 const keys=['auto-best','modern','import','app','mobile','karento-best'],name='import/src/lib/config/site.ts',dealer='import/src/lib/config/dealer.ts',relative='src/lib/config/site.ts';
 const digest=b=>createHash('sha256').update(b).digest('hex'),current=Buffer.from("favicon: '/dealer-brand/app-icon.png'\n// no published phone\n"),old=Buffer.from("favicon: '/brand/import-template-icon-v1.png'\n"),target=Buffer.from("favicon: '/brand/import-template-icon-v1.png'\n// no published phone\n"),merged=Buffer.from(current),dealerTarget=Buffer.from('exact current dealer facts\n');
 const newBases=Object.fromEntries(keys.map(k=>[k,new Map([['src/current-facts.json',Buffer.from('{"id":"stock-1","price":4299}\n')]])]));newBases.import.set(relative,target);newBases.import.set('src/lib/config/dealer.ts',dealerTarget);
 const targetSources=Object.fromEntries(keys.map(k=>[k,{repository:'darkapoparka/cars',revision:'b'.repeat(40),path:'templates/'+k,tree:'c'.repeat(40),digest:'d'.repeat(64)}]));
 const proof={schemaVersion:1,stage:'preservation-merge-before-native-catalogs-and-branding',mode:'current-facts-from-pinned-six-targets',dealer:'retained',profileSha256:'a'.repeat(64),targetSources,consumerPaths:[...keys.map(k=>k+'/src/current-facts.json'),dealer,name].sort()};
 const candidate=new Map(keys.map(k=>[k+'/src/current-facts.json',newBases[k].get('src/current-facts.json')]));candidate.set(name,merged);candidate.set(dealer,dealerTarget);candidate.set('import/src/paid.ts',Buffer.from('preserved customization\n'));
 const baseline={commit:'a'.repeat(40),tree:'b'.repeat(40)},review={schemaVersion:1,kind:'cars-factual-consumer-template-resolutions',reviewed:true,dealer:'retained',baseline:structuredClone(baseline),targetSources:structuredClone(targetSources),paths:[{path:name,choice:'template',originalSha256:digest(current),oldSha256:digest(old),targetSha256:digest(target),mergedSha256:digest(merged)}]};
 const qualification={schemaVersion:1,kind:'cars-native-source-qualification-context',id:'test',dealer:'retained',scope:'existing-dealer-pilot',reviewed:true,reviewedAt:'2026-10-11',sourceCommit:'b'.repeat(40),nativeApproval:false,hostedApproval:false,globalReleaseApproval:false,approvedLockSha256:'c'.repeat(64),candidateLockSha256:'d'.repeat(64),sourceDeltaReview:{reference:'docs/releases/delta.json',sha256:'e'.repeat(64),reviewedAt:'2026-10-11'}};
 const plan={ready:true,candidate,changes:[{path:name,kind:'auto-merged',beforeSha256:digest(current),afterSha256:digest(merged)},{path:dealer,kind:'resolved-template',beforeSha256:'e'.repeat(64),afterSha256:digest(dealerTarget)}],conflicts:[],summary:{changed:2,conflicts:0},pins:Object.fromEntries(keys.map(k=>[k,{targetSource:targetSources[k]}]))};
 return{name,dealer,relative,current,old,target,merged,dealerTarget,digest,newBases,proof,plan,review,baseline,qualification,manifest:{slug:'retained',packaging:{version:'5'}},original:new Map([[name,current]]),oldBases:{import:new Map([[relative,old]])},factualProof:proof,designSet:'six',refreshFacts:true,templatePalette:true,resolutions:{[dealer]:'template'}};
}

test('reviewed site singleton preserves an existing dealer conflict choice and all factual source',()=>{
 const f=fixture(),priorDealer=f.plan.changes[1],paid=Buffer.from(f.plan.candidate.get('import/src/paid.ts'));
 assert.throws(()=>assertFactualRefreshCandidate({candidate:f.plan.candidate,newBases:f.newBases,proof:f.proof}),/differs after preservation/);
 const proof=applyReviewedFactualConsumerResolutions(f);
 assert(f.plan.candidate.get(f.name).equals(f.target));assert(f.original.get(f.name).equals(f.current));assert(f.plan.candidate.get(f.dealer).equals(f.dealerTarget));assert(f.plan.candidate.get('import/src/paid.ts').equals(paid));assert(f.plan.changes.includes(priorDealer));assert.deepEqual(f.resolutions,{[f.dealer]:'template'});assert.deepEqual(proof.paths,f.review.paths);
 assert.equal(assertFactualRefreshCandidate({candidate:f.plan.candidate,newBases:f.newBases,proof:f.proof}).consumerHashes.length,8);
});

test('reviewed site singleton rejects every changed byte lease, overlap and factual scope atomically',()=>{
 const mutations=['originalSha256','oldSha256','targetSha256','mergedSha256'].map(k=>f=>{f.review.paths[0][k]='0'.repeat(64);});
 mutations.push(f=>{f.resolutions[f.name]='template';},f=>{f.plan.changes[0].kind='resolved-manual';},f=>{f.plan.conflicts=[{path:f.name}];},f=>{f.review.paths[0].path='import/src/paid.ts';},f=>{f.review.paths[0].path='../outside';},f=>{f.review.paths.push({...f.review.paths[0]});},f=>{f.review.paths[0].extra=true;},f=>{f.factualProof.consumerPaths=f.factualProof.consumerPaths.filter(p=>p!==f.name);},f=>{f.plan.candidate.set(f.name,f.target);f.review.paths[0].mergedSha256=f.digest(f.target);});
 for(const mutate of mutations){const f=fixture();mutate(f);const before=new Map(f.plan.candidate);assert.throws(()=>applyReviewedFactualConsumerResolutions(f));for(const [name,bytes]of before)assert(f.plan.candidate.get(name).equals(bytes));assert(f.plan.candidate.get(f.dealer).equals(f.dealerTarget));}
});

test('reviewed site singleton retains qualification, exact six pins and unrelated factual equality',()=>{
 for(const mutate of [f=>f.refreshFacts=false,f=>f.templatePalette=false,f=>f.qualification=null,f=>f.registeredAdoption={},f=>f.designSet=null,f=>f.review.baseline.tree='0'.repeat(40),f=>f.review.targetSources.app.revision='0'.repeat(40),f=>f.plan.ready=false]){const f=fixture();mutate(f);assert.throws(()=>applyReviewedFactualConsumerResolutions(f));assert(f.plan.candidate.get(f.name).equals(f.merged));}
 const f=fixture();applyReviewedFactualConsumerResolutions(f);f.plan.candidate.set('mobile/src/current-facts.json',Buffer.from('stale unrelated stock\n'));assert.throws(()=>assertFactualRefreshCandidate({candidate:f.plan.candidate,newBases:f.newBases,proof:f.proof}),/differs after preservation/);
});

test('reviewed site factual source order accepts identical object seals and keeps arrays ordered',()=>{
 const f=fixture();f.review.baseline=Object.fromEntries(Object.entries(f.review.baseline).reverse());f.review.targetSources=Object.fromEntries(Object.entries(f.review.targetSources).reverse().map(([key,value])=>[key,Object.fromEntries(Object.entries(value).reverse())]));assert.doesNotThrow(()=>applyReviewedFactualConsumerResolutions(f));assert(f.plan.candidate.get(f.name).equals(f.target));
 for(const mutate of [f=>{f.review.targetSources.import.unknown='unreviewed';},f=>{f.review.targetSources.import.tree='0'.repeat(40);},f=>{f.review.paths.push({...f.review.paths[0]});},f=>{f.review.paths[0].path='modern/arbitrary-paid-code.ts';}]){const f=fixture();mutate(f);assert.throws(()=>applyReviewedFactualConsumerResolutions(f));assert(f.plan.candidate.get(f.name).equals(f.merged));}
});
