import test from 'node:test';import assert from 'node:assert/strict';import fs from 'node:fs';
import {specializeDealerReferencePackage} from './publishing/dealer-reference-package.mjs';
import {planAssetRetention} from './publishing/public-asset-retention.mjs';
const b=value=>Buffer.from(typeof value==='string'?value:JSON.stringify(value));
function input(){return new Map([
 ['app/lib/dealer.json',b({mode:'dealer',id:'test-varna'})],
 ['app/lib/dealer-config.ts',b("export const isDealer = dealer.mode === 'dealer';")],
 ['app/lib/reference-data.server.ts',fs.readFileSync(new URL('./fixtures/varna/reference-data.server.ts.txt',import.meta.url))],
 ['app/lib/captured-vehicle-details.json',b({captured:{gallery:['/reference-assets/vehicle-details/example.jpg']}})],
 ['app/public-assets.policy.json',b({schemaVersion:1,family:'app',keepPrefixes:[],candidates:[]})],
 ['app/public/reference-assets/vehicle-details/example.jpg',b('example-public-reference')],
 ['app/public/reference-assets/final-pass/customer-0.mp4',b('example-reference-video')],
 ['app/public/dealer-app/real-stock.webp',b('actual-dealer-media')]
]);}
const manifest={slug:'test-varna'};
test('specializes the proven dealer branch without removing any published media itself',()=>{const files=input(),real=files.get('app/public/dealer-app/real-stock.webp');let r=specializeDealerReferencePackage(files,manifest);assert.equal(r.additionalHashBoundCandidates,2);assert.equal(r.publicAssetsDeletedByThisStep,0);assert.equal(files.has('app/lib/captured-vehicle-details.json'),false);assert.equal(files.get('app/public/dealer-app/real-stock.webp'),real);assert.match(files.get('app/lib/reference-data.server.ts').toString(),/return undefined/);});
test('rejects reference mode, source drift, and a second snapshot consumer without mutation',()=>{for(const mutate of [f=>f.set('app/lib/dealer.json',b({mode:'reference',id:'test-varna'})),f=>f.set('app/lib/reference-data.server.ts',b('changed implementation')),f=>f.set('app/components/extra.tsx',b("import data from '../lib/captured-vehicle-details.json';"))]){let f=input();mutate(f);const original=[...f];assert.throws(()=>specializeDealerReferencePackage(f,manifest));assert.deepEqual([...f],original);}});
test('hash-bound policy retains referenced media and excludes only genuinely unused captures',()=>{let f=input();specializeDealerReferencePackage(f,manifest);let policy=JSON.parse(f.get('app/public-assets.policy.json'));let assets=new Map([...f].filter(([p])=>p.startsWith('app/public/')).map(([p,b])=>[p.slice(11),b]));const plan=planAssetRetention({assets,policy,consumers:[{path:'components/example.tsx',text:'const image="/reference-assets/vehicle-details/example.jpg";'}]});assert.equal(plan.omitted.length,1);assert.equal(plan.omitted[0].path,'reference-assets/final-pass/customer-0.mp4');assert.equal(plan.retained[0].path,'reference-assets/vehicle-details/example.jpg');});
test('customized binary and dynamic asset readers survive conservative retention',()=>{let f=input();specializeDealerReferencePackage(f,manifest);let policy=JSON.parse(f.get('app/public-assets.policy.json'));let assets=new Map([...f].filter(([p])=>p.startsWith('app/public/')).map(([p,b])=>[p.slice(11),b]));assets.set('reference-assets/final-pass/customer-0.mp4',b('custom-video'));const plan=planAssetRetention({assets,policy,consumers:[{path:'component.tsx',text:'const source=`/reference-assets/vehicle-details/${id}.jpg`;'}]});assert.equal(plan.omitted.length,0);assert.equal(plan.retained.length,2);});