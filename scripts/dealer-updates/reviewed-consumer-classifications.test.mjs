import test from 'node:test';
import assert from 'node:assert/strict';
import {createHash} from 'node:crypto';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import {applyReviewedFactualConsumerResolutions,assertFactualRefreshCandidate,assertFactualRefreshReplay} from './update-dealer-template.mjs';
const hash=b=>createHash('sha256').update(b).digest('hex');
const scope={'import/src/lib/config/site.ts':'branding-reference','modern/packages/marketplace-domain/site-config.ts':'schema-policy'};
function fixture(paths=Object.keys(scope)){
 const keys=['auto-best','modern','import','app','mobile','karento-best'];
 const modern=`import { z } from "zod";
const httpsUrl = z.url()
  .refine((value) => { try { const url = new URL(value); return url.protocol === "https:" && !url.username && !url.password; } catch { return false; } }, "Use HTTPS");
export const publicSiteSchema = z.object({contact: z.object({
      phoneDisplay: z.string().trim().max(40),
      phoneHref: z.union([phoneHref, z.literal("")]),
})}).superRefine((site, context) => {
    if (Boolean(site.contact.phoneDisplay) !== Boolean(site.contact.phoneHref)) { context.addIssue({code: "custom", path: ["contact", "phoneHref"], message: "Published phone label and destination must be provided together"}); }
});
`;
 const targetModern=modern.replace('.refine((value) => { try { const url = new URL(value); return url.protocol === "https:" && !url.username && !url.password; } catch { return false; } }, "Use HTTPS");','.refine((value) => new URL(value).protocol === "https:", "Use HTTPS");').replace('phoneDisplay: z.string().trim().max(40),','phoneDisplay: z.string().trim().min(1).max(40),').replace('phoneHref: z.union([phoneHref, z.literal("")]),','phoneHref,').replace('    if (Boolean(site.contact.phoneDisplay) !== Boolean(site.contact.phoneHref)) { context.addIssue({code: "custom", path: ["contact", "phoneHref"], message: "Published phone label and destination must be provided together"}); }\n','');
 const current={'import/src/lib/config/site.ts':Buffer.from('export const site={\n  favicon: "/dealer-brand/app-icon.png",\n  phone: daynightContact.primaryPhoneLabel\n};\n'),'modern/packages/marketplace-domain/site-config.ts':Buffer.from(modern)};
 const targets={'import/src/lib/config/site.ts':Buffer.from(current['import/src/lib/config/site.ts'].toString().replace('"/dealer-brand/app-icon.png"',"'/brand/import-template-icon-v1.png'")),'modern/packages/marketplace-domain/site-config.ts':Buffer.from(targetModern)};
 const targetSources=Object.fromEntries(keys.map(key=>[key,{repository:'darkapoparka/cars',revision:'b'.repeat(40),path:'templates/'+key,digest:'c'.repeat(64),tree:'d'.repeat(40)}])),baseline={commit:'a'.repeat(40),tree:'e'.repeat(40)},original=new Map(),oldBases=Object.fromEntries(keys.map(key=>[key,new Map()])),newBases=Object.fromEntries(keys.map(key=>[key,new Map([['current-facts.json',Buffer.from('{"stock":[{"id":"retained","price":1234}]}')]])])),candidate=new Map(keys.map(key=>[key+'/current-facts.json',newBases[key].get('current-facts.json')]));
 const proof={schemaVersion:1,stage:'preservation-merge-before-native-catalogs-and-branding',mode:'current-facts-from-pinned-six-targets',dealer:'retained',profileSha256:'f'.repeat(64),targetSources,consumerPaths:[...keys.map(key=>key+'/current-facts.json'),...paths].sort()};
 const rows=paths.map(name=>{const slash=name.indexOf('/'),key=name.slice(0,slash),relative=name.slice(slash+1),old=Buffer.from('exact immutable old '+name);original.set(name,current[name]);oldBases[key].set(relative,old);newBases[key].set(relative,targets[name]);candidate.set(name,current[name]);return{path:name,choice:'preserve-current',classification:scope[name],originalSha256:hash(current[name]),oldSha256:hash(old),targetSha256:hash(targets[name]),mergedSha256:hash(current[name])};});
 const review={schemaVersion:1,kind:'cars-factual-consumer-classifications',reviewed:true,dealer:'retained',baseline:structuredClone(baseline),targetSources:structuredClone(targetSources),paths:rows},qualification={schemaVersion:1,kind:'cars-native-source-qualification-context',id:'test',dealer:'retained',scope:'existing-dealer-pilot',reviewed:true,reviewedAt:'2026-10-11',sourceCommit:'b'.repeat(40),nativeApproval:false,hostedApproval:false,globalReleaseApproval:false,approvedLockSha256:'c'.repeat(64),candidateLockSha256:'d'.repeat(64),sourceDeltaReview:{reference:'docs/releases/delta.json',sha256:'e'.repeat(64),reviewedAt:'2026-10-11'}};
 return{plan:{ready:true,candidate,changes:rows.map(row=>({path:row.path,kind:'auto-merged'})),conflicts:[],summary:{changed:rows.length},pins:Object.fromEntries(keys.map(key=>[key,{targetSource:targetSources[key]}]))},original,oldBases,newBases,review,manifest:{slug:'retained',packaging:{version:'5'}},qualification,designSet:'six',refreshFacts:true,templatePalette:true,factualProof:proof,baseline,resolutions:{}};
}

test('reviewed classifications preserve exact clean current policy, track distinct scopes and check every factual family',()=>{
 for(const paths of [Object.keys(scope),[Object.keys(scope)[0]],[Object.keys(scope)[1]]]){
  const f=fixture(paths),before=new Map(f.plan.candidate);assert.throws(()=>assertFactualRefreshCandidate({candidate:f.plan.candidate,newBases:f.newBases,proof:f.factualProof}),/differs after preservation/);const receipt=applyReviewedFactualConsumerResolutions(f);assert.equal(receipt.mode,'explicit-reviewed-ordinary-consumer-classification');assert.deepEqual(f.plan.candidate,before);const checked=assertFactualRefreshCandidate({candidate:f.plan.candidate,newBases:f.newBases,proof:f.factualProof});assert.equal(checked.consumerHashes.length,6);assert.equal(checked.classificationHashes.length,paths.length);for(const row of f.review.paths)assert(f.plan.candidate.get(row.path).equals(f.original.get(row.path)));
 }
});

test('reviewed classifications reject all four byte drift, scope/order/overlap and extra business policy edits atomically',()=>{
 const mutations=['originalSha256','oldSha256','targetSha256','mergedSha256'].map(key=>f=>{f.review.paths[0][key]='0'.repeat(64);});
 mutations.push(f=>{f.review.paths.reverse();},f=>{f.review.paths[0].classification='schema-policy';},f=>{f.review.paths[0].choice='template';},f=>{f.review.paths[0].extra=true;},f=>{f.review.paths[0].path='modern/packages/marketplace/lead-site.ts';},f=>{f.resolutions[f.review.paths[0].path]='dealer';},f=>{f.plan.conflicts.push({path:f.review.paths[0].path});},f=>{f.plan.changes[0].kind='resolved-template';},f=>{f.review.baseline.tree='0'.repeat(40);},f=>{f.review.targetSources.app.tree='0'.repeat(40);},f=>{f.refreshFacts=false;},f=>{f.qualification=null;},f=>{const row=f.review.paths[1],bytes=Buffer.concat([f.plan.candidate.get(row.path),Buffer.from('const unreviewedPhone="+123456789";\n')]);f.original.set(row.path,bytes);f.plan.candidate.set(row.path,bytes);row.originalSha256=row.mergedSha256=hash(bytes);});
 for(const mutate of mutations){const f=fixture();mutate(f);const before=new Map(f.plan.candidate),proof=structuredClone(f.factualProof);assert.throws(()=>applyReviewedFactualConsumerResolutions(f));assert.deepEqual(f.plan.candidate,before);assert.deepEqual(f.factualProof,proof);}
});

test('classified candidate still refuses stale stock, changed preserved schema, and changed target fingerprint',()=>{
 for(const mutate of [f=>f.plan.candidate.set('import/current-facts.json',Buffer.from('stale phone/stock')),f=>f.plan.candidate.set(f.review.paths[0].path,Buffer.from('changed preserved policy')),f=>f.newBases.modern.set('packages/marketplace-domain/site-config.ts',Buffer.from('changed target schema'))]){const f=fixture();applyReviewedFactualConsumerResolutions(f);mutate(f);assert.throws(()=>assertFactualRefreshCandidate({candidate:f.plan.candidate,newBases:f.newBases,proof:f.factualProof}));}
});

test('classified factual replay binds preserved policy bytes and unchanged factual hashes',()=>{
 const f=fixture();applyReviewedFactualConsumerResolutions(f);const factualRefresh=assertFactualRefreshCandidate({candidate:f.plan.candidate,newBases:f.newBases,proof:f.factualProof}),root=fs.mkdtempSync(path.join(os.tmpdir(),'cars-classification-replay-'));
 try{for(const row of f.review.paths){const file=path.join(root,row.path);fs.mkdirSync(path.dirname(file),{recursive:true});fs.writeFileSync(file,f.original.get(row.path));}const metadata={dealerRoot:root,selection:{refreshFacts:true},factualRefresh};assert.doesNotThrow(()=>assertFactualRefreshReplay({proof:f.factualProof,metadata,newBases:f.newBases}));fs.appendFileSync(path.join(root,f.review.paths[1].path),'changed');assert.throws(()=>assertFactualRefreshReplay({proof:f.factualProof,metadata,newBases:f.newBases}));}finally{const absolute=fs.realpathSync(root);assert.equal(path.dirname(absolute),fs.realpathSync(os.tmpdir()));assert(path.basename(absolute).startsWith('cars-classification-replay-'));fs.rmSync(absolute,{recursive:true,force:true});}
});
