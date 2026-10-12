import test from'node:test';import assert from'node:assert/strict';import{validatePrivateSourceRequest,parseQualifiedReceipt,verifyPackagingCheckout,isolatedPackageGitArgs,boundedPrivateSourceFailure}from'./package-qualified-private-source.mjs';
import fs from'node:fs';import os from'node:os';import path from'node:path';import{spawnSync}from'node:child_process';
const request=()=>({schemaVersion:1,kind:'cars-qualified-private-source-export',repository:'darkapoparka/cars',sourceCommit:'a'.repeat(40),runId:123,attempt:1,reviewed:true,dealers:[{slug:'fixture-dealer',repository:'darkapoparka/cars-fixture-dealer',sourceTree:'b'.repeat(40)}]});
test('private source export requires explicit bounded immutable source and exact repository identities',()=>{assert.equal(validatePrivateSourceRequest(request()).dealers.length,1);for(const patch of[{reviewed:false},{sourceCommit:'main'},{attempt:0},{repository:'other/repo'},{dealers:[]}])assert.throws(()=>validatePrivateSourceRequest({...request(),...patch}));});
test('duplicates, foreign repositories and more than five dealers fail closed',()=>{const r=request();for(const dealers of[[...r.dealers,...r.dealers],[{...r.dealers[0],repository:'foreign/repo'}],Array.from({length:6},(_,i)=>({slug:'fixture-'+i,repository:'darkapoparka/cars-fixture-'+i,sourceTree:'b'.repeat(40)}))])assert.throws(()=>validatePrivateSourceRequest({...r,dealers}));});
test('qualified receipt reader accepts retained literal newline terminator but rejects other trailing bytes',()=>{assert.deepEqual(parseQualifiedReceipt(Buffer.from('{}'+String.fromCharCode(92)+'n')),{});assert.deepEqual(parseQualifiedReceipt(Buffer.from('{}\n')),{});assert.throws(()=>parseQualifiedReceipt(Buffer.from('{}untrusted')));});
const checkout='c'.repeat(40);
const fixture=({changedPath=null,ancestor=true,head=checkout}={})=>({root:'/fixture',request:request(),dealer:request().dealers[0],slug:'fixture-dealer',checkoutCommit:checkout,readGit:(_root,args)=>{if(args[0]==='merge-base')return ancestor?'':null;if(args[1]==='HEAD')return head;const [commit,name]=args[1].split(':');if(commit===checkout&&name===changedPath)return'd'.repeat(40);return name==='clients/fixture-dealer'?'b'.repeat(40):'e'.repeat(40);}});
test('packaging descendant preserves the old compiled source identity while admitting the exact unchanged current checkout',()=>{assert.equal(verifyPackagingCheckout(fixture()),checkout);});
test('changed dealer, templates, registry, source proof or original compilation request is never admitted',()=>{for(const changedPath of['clients/fixture-dealer','templates.lock.json','docs/DEPLOYMENT-INVENTORY.json','clients/index.json','docs/releases/cloudflare-existing25-20261011/build-request.json','docs/releases/cloudflare-existing25-20261011/selection.json','docs/releases/cloudflare-existing25-20261011/new-source/fixture-dealer'])assert.throws(()=>verifyPackagingCheckout(fixture({changedPath})),/Packaging admission input changed/);});
test('foreign ancestry or a nonexact packaging checkout is rejected',()=>{assert.throws(()=>verifyPackagingCheckout(fixture({ancestor:false})),/not an ancestor/);assert.throws(()=>verifyPackagingCheckout(fixture({head:'d'.repeat(40)})),/Exact packaging checkout/);});
test('isolated export index ignores checkout sparsity without changing canonical index or configuration',()=>{
 const root=fs.mkdtempSync(path.join(os.tmpdir(),'cars-private-index-'));
 const cmd=(args,{input,env}={})=>spawnSync('git',['-C',root,...args],{input,encoding:'utf8',env:{...process.env,...env}});
 const ok=(args,options)=>{const r=cmd(args,options);assert.equal(r.status,0,r.stderr);return r.stdout.trim();};
 try{
  ok(['init','-q']);ok(['config','user.name','Fixture']);ok(['config','user.email','fixture@example.invalid']);
  fs.mkdirSync(path.join(root,'scripts'));fs.writeFileSync(path.join(root,'scripts','original.txt'),'preserved\n');
  ok(['add','.']);ok(['commit','-qm','fixture']);ok(['sparse-checkout','init','--no-cone']);ok(['sparse-checkout','set','/scripts/']);
  const originalIndex=fs.readFileSync(path.join(root,'.git','index')),originalConfig=fs.readFileSync(path.join(root,'.git','config'));
  const packageRoot=path.join(root,'runtime','package');fs.mkdirSync(path.join(packageRoot,'auto-best'),{recursive:true});
  fs.writeFileSync(path.join(packageRoot,'auto-best','package.json'),'{"private":true}\n');fs.writeFileSync(path.join(packageRoot,'dealer.json'),'{"slug":"fixture"}\n');
  const env={GIT_INDEX_FILE:path.join(root,'private-package.index')},files='auto-best/package.json\0dealer.json\0';
  ok(isolatedPackageGitArgs(packageRoot,['read-tree','--empty']),{env});
  const before=cmd(['--work-tree',packageRoot,'--literal-pathspecs','add','--force','--pathspec-from-file=-','--pathspec-file-nul'],{env,input:files});
  assert.notEqual(before.status,0);assert.match(before.stderr,/sparse-checkout/);
  ok(isolatedPackageGitArgs(packageRoot,['--literal-pathspecs','add','--force','--pathspec-from-file=-','--pathspec-file-nul']),{env,input:files});
  const tree=ok(isolatedPackageGitArgs(packageRoot,['write-tree']),{env});
  assert.deepEqual(ok(['ls-tree','-r','--name-only',tree]).split('\n'),['auto-best/package.json','dealer.json']);
  assert.deepEqual(fs.readFileSync(path.join(root,'.git','index')),originalIndex);
  assert.deepEqual(fs.readFileSync(path.join(root,'.git','config')),originalConfig);
 }finally{fs.rmSync(root,{recursive:true,force:true});}
});
test('diagnostics retain short errors and bound noisy Git path inventories',()=>{
 assert.equal(boundedPrivateSourceFailure(Error('small')), 'small');
 const text='FIRST '+ 'x'.repeat(20000)+' LAST';const result=boundedPrivateSourceFailure(Error(text));
 assert.ok(result.length<12100);assert.ok(result.startsWith('FIRST'));assert.ok(result.endsWith('LAST'));assert.match(result,/truncated/);
});
