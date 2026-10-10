import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import {registeredDeliveryOrigin} from './dealer-updates/update-dealer-template.mjs';
import {protectedInputFiles,assertPreservedInputs,validateRefreshReview} from './refresh-uk-dealers.mjs';
const manifest={repository:'darkapoparka/cars-uk-test',shareIdentity:{publicOrigin:'https://cars-uk-test.darkapoparka1.workers.dev'}};
const record={repository:manifest.repository,delivery:{provider:'cloudflare',configuredPublicOrigin:manifest.shareIdentity.publicOrigin,publicUrl:null}};
test('refresh accepts the configured unpublished Cloudflare identity without claiming it is live',()=>{
  const before=JSON.stringify(record);assert.equal(registeredDeliveryOrigin(record,manifest).origin,manifest.shareIdentity.publicOrigin);
  assert.equal(JSON.stringify(record),before);assert.equal(record.delivery.publicUrl,null);
});
test('refresh refuses mismatched repository, hostname, HTTP, credentials and route URLs',()=>{
  assert.throws(()=>registeredDeliveryOrigin({...record,repository:'someone/other'},manifest));
  for(const url of ['https://other.workers.dev','http://cars-uk-test.darkapoparka1.workers.dev','https://a:b@cars-uk-test.darkapoparka1.workers.dev','https://cars-uk-test.darkapoparka1.workers.dev/variant-2']){
    assert.throws(()=>registeredDeliveryOrigin({...record,delivery:{...record.delivery,configuredPublicOrigin:url}},manifest));
  }
});
test('existing registered live origins remain supported',()=>{
  assert.equal(registeredDeliveryOrigin({repository:manifest.repository,delivery:{url:'https://example.com/'}},manifest).origin,'https://example.com');
});
test('all stock, locale, business and raster asset inputs are byte-preserved',t=>{
  const root=fs.mkdtempSync(path.join(os.tmpdir(),'cars-uk-refresh-test-'));t.after(()=>fs.rmSync(root,{recursive:true,force:true}));
  for(const f of ['business-facts.json','locale-config.json','stock.json','assets/icon.png','branding/logo.png','dealer-brand/logo.webp','dealer-stock/car.webp']){
    fs.mkdirSync(path.dirname(path.join(root,f)),{recursive:true});fs.writeFileSync(path.join(root,f),'original '+f);
  }
  const snapshot=protectedInputFiles(root);assert.equal(snapshot.length,7);assertPreservedInputs(snapshot,root);
  fs.writeFileSync(path.join(root,'stock.json'),'changed');assert.throws(()=>assertPreservedInputs(snapshot,root),/protected.*stock/);
});
test('conflict decisions are bound to dealer, immutable source tree and exact release selection',()=>{
  const dealer={slug:'test'},batch={sourceReleases:{app:{revision:'a'.repeat(40)}}};
  const review={schemaVersion:1,dealer:'test',sourceTree:'b'.repeat(40),sourceReleases:batch.sourceReleases,resolutions:{}};
  validateRefreshReview(review,dealer,review.sourceTree,batch);
  assert.throws(()=>validateRefreshReview(review,dealer,'c'.repeat(40),batch));
  assert.throws(()=>validateRefreshReview({...review,dealer:'other'},dealer,review.sourceTree,batch));
  assert.throws(()=>validateRefreshReview(review,dealer,review.sourceTree,{sourceReleases:{app:{revision:'c'.repeat(40)}}}));
});
