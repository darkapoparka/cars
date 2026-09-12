import test from 'node:test';
import assert from 'node:assert/strict';
import {registryViews} from './index-deployments.mjs';
test('sparse dealer source points to main without claiming application acceptance',()=>{const r={dealers:[{slug:'kept',name:'Kept',localPath:'clients/kept',localPresent:false,canonicalSourceRef:'main',variants:[{key:'auto-best',localPresent:false}],delivery:{state:'unknown'},evidence:{browser:{state:'unknown'},ownerReview:{state:'unknown'}}}]};const v=registryViews(r);assert.match(v.deployments,/github.com\/darkapoparka\/cars\/tree\/main\/clients\/kept/);assert.doesNotMatch(v.deployments,/Preserved branch evidence/);assert.equal(v.index.projects[0].sourceState,'source-on-main');assert.match(v.deployments,/unknown \/ unknown/);});
