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

const sourceSlug='centralauto-varna',sourceWorker='cars-centralauto-varna',sourceOrigin='https://'+sourceWorker+'.darkapoparka1.workers.dev';
const sourceManifest={slug:sourceSlug,repository:'darkapoparka/'+sourceWorker,cloudflare:{workerPrefix:sourceWorker},shareIdentity:{publicOrigin:sourceOrigin}};
const sourceRecord={slug:sourceSlug,repository:sourceManifest.repository,sourceOwnership:'cars-canonical',canonicalSourceRepository:'darkapoparka/cars',canonicalSourceTree:'6e62f26a7362e348b4debdf867b50c6e1352172f',delivery:{state:'source-adoption-awaiting-publication-proof'},cloudflare:{workerName:sourceWorker,publicOrigin:sourceOrigin},evidence:{source:{state:'verified-source-proposal',tree:'6e62f26a7362e348b4debdf867b50c6e1352172f',preparation:'docs/releases/cloudflare-existing25-20261011/new-source/'+sourceSlug+'/source-preparation-receipt.json',proposal:'docs/releases/cloudflare-existing25-20261011/new-source/'+sourceSlug+'/source-patch.json',inputMapping:'docs/releases/cloudflare-existing25-20261011/new-source/'+sourceSlug+'/input-mapping.json'}}};
test('verified canonical source proposals retain their exact registered Cloudflare Worker origin',()=>{
  const before=JSON.stringify([sourceRecord,sourceManifest]);
  assert.equal(registeredDeliveryOrigin(sourceRecord,sourceManifest).origin,sourceOrigin);
  assert.equal(JSON.stringify([sourceRecord,sourceManifest]),before);
  assert.deepEqual(sourceRecord.delivery,{state:'source-adoption-awaiting-publication-proof'});
});
test('source-proposal origin admission rejects missing proof, foreign identities and conflicting providers',()=>{
  const mutate=change=>{const next=structuredClone(sourceRecord);change(next);return next;};
  for(const change of [
    r=>{r.slug='another-dealer';},
    r=>{r.repository='someone/other';},
    r=>{r.sourceOwnership='independent-repository';},
    r=>{r.canonicalSourceRepository='someone/other';},
    r=>{r.delivery.state='unknown';},
    r=>{r.delivery.provider='vercel';},
    r=>{delete r.evidence;},
    r=>{r.evidence.source.state='unreviewed';},
    r=>{r.canonicalSourceTree='not-a-tree';},
    r=>{r.evidence.source.tree='a'.repeat(40);},
    r=>{r.evidence.source.preparation='docs/other-source.json';},
    r=>{r.evidence.source.proposal='docs/other-patch.json';},
    r=>{r.evidence.source.inputMapping='docs/other-map.json';},
    r=>{r.cloudflare.workerName='cars-other';},
    r=>{r.cloudflare.publicOrigin='https://cars-other.darkapoparka1.workers.dev';},
    r=>{r.cloudflare.publicOrigin='https://centralauto-varna.webpreviews.site';},
    r=>{r.cloudflare.publicOrigin=sourceOrigin+'/variant-2';},
  ])assert.throws(()=>registeredDeliveryOrigin(mutate(change),sourceManifest));
  for(const changed of [
    {...sourceManifest,cloudflare:{workerPrefix:'cars-other'}},
    {...sourceManifest,shareIdentity:{publicOrigin:'https://cars-other.darkapoparka1.workers.dev'}},
    {...sourceManifest,shareIdentity:{publicOrigin:'https://centralauto-varna.webpreviews.site'}},
  ])assert.throws(()=>registeredDeliveryOrigin(sourceRecord,changed));
});
test('source-proposal fallback does not replace an explicitly registered Vercel delivery URL',()=>{
  const registered={...sourceRecord,delivery:{provider:'vercel',url:'https://cars-centralauto-varna.vercel.app/'}};
  assert.equal(registeredDeliveryOrigin(registered,sourceManifest).origin,'https://cars-centralauto-varna.vercel.app');
});
