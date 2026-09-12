import test from 'node:test';
import assert from 'node:assert/strict';
import {previewAccess} from './verify-dealer-preview.mjs';

test('preview access distinguishes anonymous proof from scoped temporary sharing',()=>{
  const origin='https://dealer.example';
  assert.equal(previewAccess(origin).access.mode,'anonymous');
  assert.equal(previewAccess(origin).access.publicWithoutShareLink,null);
  const shared=previewAccess(origin,origin+'/?_vercel_share=fixture');
  assert.equal(shared.access.mode,'temporary-share-link');
  assert.equal(shared.access.publicWithoutShareLink,false);
  assert.ok(!JSON.stringify(shared.access).includes('fixture'));
  assert.throws(()=>previewAccess(origin,'https://another.example/?_vercel_share=fixture'),/exact origin/);
  assert.throws(()=>previewAccess(origin,origin+'/'),/share parameter/);
  assert.throws(()=>previewAccess('https://user:password@dealer.example'),/credentials/);
});
