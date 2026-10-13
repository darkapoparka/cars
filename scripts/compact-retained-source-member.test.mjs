import test from 'node:test';
import assert from 'node:assert/strict';
import {assertCompletedSourceMember} from './compact-retained-source.mjs';
const expected={id:1,attempt:1,sourceCommit:'a'.repeat(40)};
const run={id:1,run_attempt:1,head_sha:expected.sourceCommit,path:'.github/workflows/existing-fleet-source.yml',status:'completed',conclusion:'cancelled'};
const jobs=[{id:10,name:'plan',status:'completed',conclusion:'success'},{id:20,name:'prepare_source (dealer-one, registered-adoption)',status:'completed',conclusion:'success'},{id:30,name:'prepare_source (dealer-two, registered-adoption)',status:'completed',conclusion:'cancelled'}];
test('reuse only the exact successful source member when a different member is superseded',()=>{assert.deepEqual(assertCompletedSourceMember(run,jobs,'dealer-one',expected),{planJobId:10,sourceJobId:20});assert.throws(()=>assertCompletedSourceMember(run,jobs,'dealer-two',expected),/Exact original source member must pass/);});
test('reject a changed attempt, revision, planner, or source member',()=>{assert.throws(()=>assertCompletedSourceMember({...run,run_attempt:2},jobs,'dealer-one',expected));assert.throws(()=>assertCompletedSourceMember({...run,head_sha:'b'.repeat(40)},jobs,'dealer-one',expected));assert.throws(()=>assertCompletedSourceMember(run,jobs.map(x=>x.id===10?{...x,conclusion:'failure'}:x),'dealer-one',expected));assert.throws(()=>assertCompletedSourceMember(run,jobs,'dealer-missing',expected));});
