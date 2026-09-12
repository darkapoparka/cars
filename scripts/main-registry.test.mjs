import test from 'node:test';
import assert from 'node:assert/strict';
import {registryViews} from './index-deployments.mjs';
test('metadata present locally does not claim excluded applications are on disk', () => {
  const dealer = {slug:'sparse',name:'Sparse',localPath:'clients/sparse',localPresent:true,canonicalSourceRef:'main',variants:[{key:'auto-best',localPresent:false}],delivery:{state:'unknown'},evidence:{browser:{state:'unknown'},ownerReview:{state:'unknown'}}};
  const views = registryViews({dealers:[dealer]});
  assert.equal(views.index.projects[0].sourceState, 'source-on-main');
  assert.match(views.deployments, /Source on main/);
  assert.doesNotMatch(views.deployments, /Local source/);
});
test('sparse dealer source points to main without claiming application acceptance',()=>{const r={dealers:[{slug:'kept',name:'Kept',localPath:'clients/kept',localPresent:false,canonicalSourceRef:'main',variants:[{key:'auto-best',localPresent:false}],delivery:{state:'unknown'},evidence:{browser:{state:'unknown'},ownerReview:{state:'unknown'}}}]};const v=registryViews(r);assert.match(v.deployments,/github.com\/darkapoparka\/cars\/tree\/main\/clients\/kept/);assert.doesNotMatch(v.deployments,/Preserved branch evidence/);assert.equal(v.index.projects[0].sourceState,'source-on-main');assert.match(v.deployments,/unknown \/ unknown/);});
