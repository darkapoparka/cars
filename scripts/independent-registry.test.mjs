import test from 'node:test';
import assert from 'node:assert/strict';
import { registryViews, validateRegistry } from './index-deployments.mjs';
const dealer={slug:'example-cars',name:'Example Cars',sourceOwnership:'independent-repository',canonicalSourceRepository:'fixture/cars-example',repository:'fixture/cars-example',localPath:null,checkoutPath:'I:/cars-clients/example-cars',localPresent:true,canonicalSourceRef:'main',variants:[{key:'auto-best',entry:'/',base:''},{key:'modern',entry:'/variant-2/cars',base:'/variant-2'},{key:'carwow',entry:'/variant-3/',base:'/variant-3'}],delivery:{state:'not-deployed',url:null},evidence:{source:{remoteVerified:false},ownerReview:{state:'unknown'}}};
const registry=()=>({schemaVersion:2,aliases:{},dealers:[structuredClone(dealer)]});
test('independent source is represented without inventing a Cars folder or live GitHub proof',()=>{
 const r=registry();assert.equal(validateRegistry(r),true);const view=registryViews(r);
 assert.match(view.deployments,/GitHub publication pending/);assert.doesNotMatch(view.deployments,/cars\/tree\/main/);
 assert.equal(view.index.projects[0].path,dealer.checkoutPath);assert.equal(view.index.projects[0].sourceState,'independent-source');
});
test('verified independent GitHub source links to its own repository',()=>{
 const r=registry();r.dealers[0].evidence.source.remoteVerified=true;
 assert.match(registryViews(r).deployments,/github.com\/fixture\/cars-example\/tree\/main/);
});
test('independent ownership rejects a competing central source copy',()=>{
 const r=registry();r.dealers[0].localPath='clients/example-cars';assert.throws(()=>validateRegistry(r),/Independent source/);
});
