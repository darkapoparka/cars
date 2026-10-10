import fs from 'node:fs';
import path from 'node:path';
import assert from 'node:assert/strict';
import crypto from 'node:crypto';
import { fileURLToPath } from 'node:url';
import { loadDealerProfile } from '../../scripts/lib/client-refresh-normalize.mjs';
import { normalizeDealerLocale } from '../../scripts/lib/dealer-locale.mjs';

const root=path.dirname(fileURLToPath(import.meta.url));
const read=p=>JSON.parse(fs.readFileSync(p,'utf8').replace(/^\uFEFF/,''));
const sha=b=>crypto.createHash('sha256').update(b).digest('hex');
const selected=read(path.join(root,'selected-10.json'));
assert.equal(selected.leadCount,10); assert.equal(selected.leads.length,10);
for(const field of ['slug','profileUrl','proposedRepository'])assert.equal(new Set(selected.leads.map(x=>x[field])).size,10,'Duplicate '+field);
assert.deepEqual(selected.requestedDesigns,['auto-best','modern','import','app','mobile','karento-best']);
const results=[];
for(const lead of selected.leads){
 const pack=path.join(root,'packs',lead.slug);
 const facts=read(path.join(pack,'business-facts.json'));
 const stock=read(path.join(pack,'stock.json'));
 const assets=read(path.join(pack,'asset-provenance.json'));
 const intent=read(path.join(pack,'project-intent.json'));
 assert.equal(facts.slug,lead.slug); assert.equal(facts.sourceUrl,lead.profileUrl);
 assert.match(facts.phoneE164,/^\+359\d{9}$/); assert(lead.phones.some(x=>x.e164===facts.phoneE164));
 assert.equal(facts.currency,'EUR'); assert.equal(facts.countryCode,'BG');
 assert.equal(intent.deploymentUrl,null); assert.equal(intent.outreachApproved,false);
 assert.equal(intent.sourceState,'not-created-release-selection-blocked');
 assert.deepEqual(intent.designs,selected.requestedDesigns);
 normalizeDealerLocale(read(path.join(pack,'locale.json')),lead.slug);
 assert.equal(stock.kind,'dated-marketplace-listing-sample'); assert.equal(stock.records.length,8);
 assert.equal(new Set(stock.records.map(x=>x.id)).size,stock.records.length);
 const paths=new Set();
 for(const asset of assets.assets){
  assert(!path.isAbsolute(asset.path)&&!asset.path.split(/[\\/]/).includes('..'));
  const bytes=fs.readFileSync(path.join(pack,asset.path));
  assert.equal(bytes.length,asset.bytes,'Size mismatch '+asset.path);
  assert.equal(sha(bytes),asset.sha256,'Hash mismatch '+asset.path);
  assert(new URL(asset.sourceUrl).protocol==='https:'); paths.add('/'+asset.path);
  if(asset.role==='vehicle-photo'){assert.equal(bytes.subarray(8,12).toString(),'WEBP');assert(asset.width>=300&&asset.height>=150);}
 }
 assert.equal(assets.assets.filter(x=>x.role==='vehicle-photo').length,32);
 for(const v of stock.records){
  assert.equal(new URL(v.sourceUrl).hostname,new URL(lead.profileUrl).hostname);
  assert(v.sourceUrl.includes(v.sourceId)); assert.equal(v.id,v.sourceId);
  assert(Number.isInteger(v.year)&&v.year>=1900&&v.year<=2027);
  assert(Number.isFinite(v.priceEur)&&v.priceEur>0); assert.equal(v.currency,'EUR');
  assert(Number.isFinite(v.mileageKm)&&v.mileageKm>=0);
  assert(v.availability&&v.observedAt&&v.sourceHtmlSha256);
  assert.equal(v.images.length,4); for(const image of v.images)assert(paths.has(image),'Missing gallery asset '+image);
 }
 const normalized=loadDealerProfile(pack,lead.slug);
 assert.equal(normalized.listings.length,8); assert.equal(normalized.business.phoneE164,facts.phoneE164);
 assert.equal(normalized.business.inventoryUrl,lead.profileUrl);
 for(const v of normalized.listings){assert.equal(v.currency,'EUR'); assert(Number.isFinite(v.priceAmount)&&v.priceAmount>0);}
 results.push({slug:lead.slug,records:8,photos:32,hashedAssets:assets.assets.length,normalizer:'passed',localeContract:'passed',assetIntegrity:'passed',visualLogoQA:'pending',sixAppBuild:'not-run',hostedQA:'not-run'});
}
const report={schemaVersion:1,checkedAt:new Date().toISOString(),scope:'Data/identity/local-media integrity and existing dealer normalizer only. Not template acceptance, a framework build, visual QA, source adoption or deployment.',result:'PASS_DATA_ONLY',dealers:results,totals:{dealers:10,vehicles:80,photos:320,hashedAssets:results.reduce((a,x)=>a+x.hashedAssets,0),appBuilds:0,deployments:0}};
if(process.argv.includes('--write'))fs.writeFileSync(path.join(root,'verification.json'),JSON.stringify(report,null,2)+'\n');
console.log(JSON.stringify(report,null,2));
