import test from 'node:test';
import assert from 'node:assert/strict';
import {classifyQueueGitFailure,runQueueGitOperation} from './lib/dealer-pack-git-operation.mjs';
const good={status:0,signal:null,stdout:'retained exact source',stderr:''};
const failure=stderr=>({status:128,signal:null,stdout:'',stderr});
const invoke=(args,execute,options={})=>runQueueGitOperation({args,execute,sleep:()=>assert.fail('unexpected retry'),...options});

test('successful reads and mutations execute exactly once and preserve the full result',()=>{
  for(const command of ['fetch','show','push','hash-object','commit-tree']){
    let calls=0;const result=invoke([command],()=>{calls++;return good;});
    assert.equal(calls,1);assert.equal(result,good);
  }
});
test('fetch and lazy read transport can recover through at most three invocations',()=>{
  for(const command of ['fetch','show']){
    let calls=0;const sleeps=[];
    const result=invoke([command],()=>++calls<3?failure('fatal: Could not resolve host: github.com'):good,{sleep:ms=>sleeps.push(ms)});
    assert.equal(result,good);assert.equal(calls,3);assert.deepEqual(sleeps,[1000,3000]);
  }
});
test('exhausted read failure remains a failure with no raw output or credentials',()=>{
  const secret='PRIVATE_TOKEN_NEVER_LOGGED',sleeps=[];let calls=0;
  assert.throws(()=>invoke(['fetch','https://'+secret+'@github.com/private'],()=>{calls++;return failure('fatal: unable to access https://'+secret+'@github.com/private: Could not resolve host');},{sleep:ms=>sleeps.push(ms)}),error=>{
    assert.match(error.message,/\[fetch:transport-network, attempts=3\]/);assert.ok(!error.message.includes(secret));assert.ok(!error.message.includes('github.com'));assert.equal(error.cause,undefined);return true;
  });assert.equal(calls,3);assert.deepEqual(sleeps,[1000,3000]);
});
test('write commands never retry even when their failure looks transient',()=>{
  for(const command of ['init','config','hash-object','read-tree','update-index','write-tree','commit-tree','push']){
    let calls=0;
    assert.throws(()=>invoke([command],()=>{calls++;return failure('connection reset by peer');}),/Durable Git queue operation failed/);
    assert.equal(calls,1,command);
  }
});
test('ambiguous and rejected pushes are passed untouched to the existing CAS handler',()=>{
  for(const stderr of ['connection reset by peer','[rejected] non-fast-forward','fatal: cannot lock ref']){
    const original=failure(stderr);let calls=0;
    const result=invoke(['push','--porcelain','origin'],()=>{calls++;return original;},{allowFailure:true});
    assert.equal(result,original);assert.equal(calls,1);
  }
});
test('authorization, storage, rate and unknown failures fail immediately without retry',()=>{
  for(const stderr of ['Authentication failed: secret','permission denied: secret','HTTP returned error: 403','No space left on device','unable to create index.lock: File exists','HTTP returned error: 429','corrupt Git object','SSL certificate problem']){
    let calls=0;assert.throws(()=>invoke(['fetch'],()=>{calls++;return failure(stderr);}),/attempts=1/);assert.equal(calls,1);
  }
});
test('bounded read timeout is retried but mutation timeout is not',()=>{
  for(const command of ['fetch','show','push']){
    let calls=0;const sleeps=[];
    assert.throws(()=>invoke([command],()=>{calls++;return{status:null,signal:'SIGTERM',error:{code:'ETIMEDOUT',message:'secret'},stderr:'',stdout:''};},{sleep:ms=>sleeps.push(ms)}),/process-timeout/);
    assert.equal(calls,command==='push'?1:3);assert.equal(sleeps.length,command==='push'?0:2);
  }
});
test('signals, invalid outputs and non-timeout launch problems never masquerade as success',()=>{
  for(const result of [{...good,signal:'SIGTERM'},{...good,stdout:null},{...good,error:{code:'ENOBUFS'}},{...good,error:{code:'ENOENT'}}]){
    assert.throws(()=>invoke(['show'],()=>result),/attempts=1/);
  }
});
test('thrown launcher errors do not disclose exception payloads',()=>{
  assert.throws(()=>invoke(['fetch'],()=>{throw Error('https://token-secret@example.invalid');}),error=>{
    assert.match(error.message,/fetch:process-launch/);assert.ok(!error.message.includes('token-secret'));return true;
  });
});
test('only the two explicit read operations can receive transport retries',()=>{
  for(const command of ['clone','reset','checkout','shell','https://secret.invalid',undefined]){
    let calls=0;assert.throws(()=>invoke([command],()=>{calls++;return good;}),/Bounded known queue Git operation/);assert.equal(calls,0);
  }
});
test('classification produces bounded codes and gives authorization/storage priority',()=>{
  assert.equal(classifyQueueGitFailure(failure('Authentication failed; connection reset')),'authorization');
  assert.equal(classifyQueueGitFailure(failure('No space left on device; early EOF')),'local-storage-or-lock');
  assert.equal(classifyQueueGitFailure({error:{code:'ENOBUFS'},stderr:'connection reset'}),'output-bound');
  for(const code of [500,502,503,504])assert.equal(classifyQueueGitFailure(failure('The requested URL returned error: '+code)),'transport-network');
  assert.equal(classifyQueueGitFailure(failure('The requested URL returned error: 501')),'unclassified');
});
