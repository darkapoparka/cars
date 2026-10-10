import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import test from 'node:test';
import {git,writeJson,sha256} from './lib/workflow.mjs';
import {packageFiles,packageDigest,verifyPackage,verifyPackageTree,exportDealer,pushExport} from './export-dealer.mjs';

function put(root,name,bytes) {
  const file=path.join(root,name);fs.mkdirSync(path.dirname(file),{recursive:true});
  fs.writeFileSync(file,typeof bytes==='string'||Buffer.isBuffer(bytes)?bytes:JSON.stringify(bytes,null,2)+'\n');
}
function init(root) {
  fs.mkdirSync(root,{recursive:true});git(root,['init','-b','main']);
  git(root,['config','user.name','Package tree fixture']);git(root,['config','user.email','fixture@example.invalid']);
  git(root,['config','core.autocrlf','false']);
}
function commit(root) {git(root,['add','.']);git(root,['commit','-m','fixture']);return git(root,['rev-parse','HEAD']);}
function fixture(t,{frozen=true}={}) {
  const area=fs.mkdtempSync(path.join(os.tmpdir(),'cars-package-tree-')),root=path.join(area,'cars'),pkg=path.join(area,'package');
  t.after(()=>{const actual=fs.realpathSync(area);assert.ok(actual.startsWith(fs.realpathSync(os.tmpdir())+path.sep));fs.rmSync(actual,{recursive:true,force:true});});
  init(root);
  const keys=['auto-best','modern','import','app','mobile','karento-best'];
  const manifest={schemaVersion:1,slug:'demo',repository:'fixture/cars-demo',defaultBranch:'main',
    variants:keys.map((key,index)=>({key,base:index?'/variant-'+(index+1):'',entry:key==='modern'?'/variant-2/cars':index?'/variant-'+(index+1)+'/':'/'})),
    extraAssets:['assets'],packaging:{version:'5'}};
  put(root,'clients/demo/dealer.json',manifest);put(root,'source.txt','Canonical input.\n');
  const sourceCommit=commit(root);
  put(pkg,'dealer.json',manifest);put(pkg,'app/source.ts','export const value = 1;\r\n');
  const media=Buffer.from([0,1,2,3,254,255]);
  put(pkg,'assets/shared.bin',media);put(pkg,'mobile/public/shared.bin',media);
  put(pkg,'.cars-cloudflare.json',{provider:'cloudflare',acceptance:{dependencyLocksFrozen:frozen}});
  const reseal=()=>{
    const payload=packageDigest(pkg).files.filter(file=>file.path!=='.cars-package.json');
    put(pkg,'.cars-package.json',{schemaVersion:1,manifest,sourceCommit,packagingVersion:'5',
      assetDelivery:{provider:'cloudflare'},payload,payloadDigest:sha256(JSON.stringify(payload))});
  };
  reseal();
  let sequence=0;
  const tree=(base,changes=[])=>{
    const env={GIT_INDEX_FILE:path.join(area,'index-'+(++sequence))};
    if (base) git(root,['read-tree',base],{env});
    else {
      git(root,['read-tree','--empty'],{env});
      git(root,['--work-tree',pkg,'--literal-pathspecs','add','--force','--pathspec-from-file=-','--pathspec-file-nul'],
        {env,input:packageFiles(pkg).join('\0')+'\0'});
    }
    for (const change of changes) {
      if (change.remove) git(root,['update-index','--force-remove','--',change.path],{env});
      else {
        const blob=change.object ?? git(root,['hash-object','-w','--stdin'],{input:change.bytes??'Fixture addition.\n'});
        git(root,['update-index','--add','--cacheinfo',change.mode??'100644',blob,change.path],{env});
      }
    }
    return git(root,['write-tree'],{env});
  };
  return {area,root,pkg,manifest,sourceCommit,tree,reseal};
}

test('immutable tree verification equals directory verification without a package checkout, and deduplicates binary blobs',t=>{
  const f=fixture(t),expected=verifyPackage(f.pkg),tree=f.tree(),originalIndex=fs.readFileSync(path.join(f.root,'.git/index'));
  const transport=git(f.root,['commit-tree',tree,'-p',f.sourceCommit],{input:'Ephemeral package transport.\n'});
  fs.renameSync(f.pkg,f.pkg+'-retained');
  for (const packageTree of [tree,transport]) {
    const actual=verifyPackageTree({root:f.root,packageTree});
    assert.equal(actual.tree,tree);assert.equal(actual.digest,expected.digest);assert.deepEqual(actual.files,expected.files);
    assert.equal(actual.meta.sourceCommit,f.sourceCommit);assert.equal(actual.manifest.repository,f.manifest.repository);
    assert.ok(actual.io.uniqueBlobs<actual.io.files);assert.ok(actual.io.bytesRead>0);
    assert.ok(Number.isFinite(actual.io.observedRssBytes));assert.equal(fs.existsSync(f.pkg),false);
  }
  assert.deepEqual(fs.readFileSync(path.join(f.root,'.git/index')),originalIndex);
  assert.equal(git(f.root,['rev-parse','HEAD']),f.sourceCommit);
});

test('tree input rejects mutable refs, changed or missing payload bytes, and unfrozen provider locks',t=>{
  const f=fixture(t),tree=f.tree();
  for (const packageTree of ['HEAD','main',tree+':app','--all','0'.repeat(40)]) {
    assert.throws(()=>verifyPackageTree({root:f.root,packageTree}));
  }
  for (const changed of [
    f.tree(tree,[{path:'app/source.ts',bytes:'export const value = 2;\n'}]),
    f.tree(tree,[{path:'assets/shared.bin',remove:true}]),
    f.tree(tree,[{path:'unexpected.txt',bytes:'Unsealed content.\n'}])
  ]) assert.throws(()=>verifyPackageTree({root:f.root,packageTree:changed}),/payload changed/);
  const unfrozen=fixture(t,{frozen:false});
  assert.throws(()=>verifyPackageTree({root:unfrozen.root,packageTree:unfrozen.tree()}),/qualified and frozen/);
});

test('tree input rejects excluded transport files, symlinks and submodules instead of filtering them into a different package',t=>{
  const f=fixture(t),base=f.tree();
  for (const entry of [
    {path:'.env.local',bytes:'Fixture only.\n'},
    {path:'runtime/cache.json',bytes:'{}'},
    {path:'.cars-publish.json',bytes:'{}'},
    {path:'.cars-cloudflare-svelte-locks.json/hidden.txt',bytes:'Excluded parent.\n'},
    {path:'app/build.log/hidden.txt',bytes:'Excluded parent.\n'},
    {path:'app/node_modules/fixture/index.js',bytes:'export {};\n'},
    {path:'app/link',mode:'120000',bytes:'../dealer.json'},
    {path:'app/submodule',mode:'160000',object:f.sourceCommit}
  ]) {
    const packageTree=f.tree(base,[entry]);
    assert.throws(()=>verifyPackageTree({root:f.root,packageTree}),/unsafe or excluded|Unsupported package tree/);
  }
});

test('large unique blobs are verified in measured bounded batches without constructing an entire package Buffer',t=>{
  const f=fixture(t),first=Buffer.alloc(8*1024**2),second=Buffer.alloc(8*1024**2);
  first[0]=1;second[0]=2;
  put(f.pkg,'assets/first.bin',first);put(f.pkg,'assets/second.bin',second);f.reseal();
  const actual=verifyPackageTree({root:f.root,packageTree:f.tree()});
  assert.equal(actual.digest,verifyPackage(f.pkg).digest);
  assert.ok(actual.io.batches>=2);assert.ok(actual.io.maxBatchBytes<=actual.io.batchTargetBytes);
  assert.equal(actual.io.maxSingleFileBytes,8*1024**2);
  assert.ok(actual.io.bytesRead>=16*1024**2 && actual.io.bytesRead<17*1024**2);
});

test('tree export preserves private remote review, exact parent, canonical index and race checks',t=>{
  const f=fixture(t),remote=path.join(f.area,'remote');init(remote);
  put(remote,'README.md','Reviewed publishing initialization.\n');const remoteCommit=commit(remote);
  git(f.root,['config','url.'+remote.replaceAll('\\','/')+'.insteadOf','https://github.com/fixture/cars-demo.git']);
  const tree=f.tree(),transport=git(f.root,['commit-tree',tree,'-p',f.sourceCommit],{input:'Ephemeral package transport.\n'});
  git(f.root,['config','core.sparseCheckout','true']);
  git(f.root,['config','core.sparseCheckoutCone','false']);
  put(f.root,'.git/info/sparse-checkout','/clients/demo/\n');
  const originalIndex=fs.readFileSync(path.join(f.root,'.git/index'));
  fs.renameSync(f.pkg,f.pkg+'-retained');
  const options={root:f.root,slug:'demo',packageTree:transport,targetBranch:'codex/tree-pilot'};
  assert.throws(()=>exportDealer({...options,packageDir:f.pkg}),/exactly one/);
  const proposal=exportDealer(options);
  assert.equal(proposal.packageDirectory,null);assert.equal(proposal.packageTree,tree);
  assert.equal(proposal.parent,remoteCommit);assert.equal(proposal.sourceCommit,f.sourceCommit);
  assert.throws(()=>exportDealer({...options,write:true}),/reconciliation/);
  const reviewFile=path.join(f.area,'review.json');
  writeJson(reviewFile,{remoteCommit,candidateDigest:proposal.candidateDigest,changes:proposal.changes.map(name=>
    ({path:name,resolution:'canonical-source',reason:'Fixture explicitly reviews this exact package.'}))});
  const result=exportDealer({...options,reviewFile,write:true});
  assert.equal(git(f.root,['rev-parse',result.commit+'^']),remoteCommit);
  assert.equal(git(f.root,['merge-base','--is-ancestor',transport,result.commit],{allowFailure:true}),null);
  assert.deepEqual(fs.readFileSync(path.join(f.root,'.git/index')),originalIndex);
  assert.equal(git(f.root,['rev-parse','HEAD']),f.sourceCommit);
  const receiptFile=path.join(result.proposalDirectory,'export.json');
  pushExport({root:f.root,receiptFile});
  assert.equal(git(remote,['rev-parse','refs/heads/codex/tree-pilot']),result.commit);
  assert.equal(git(remote,['rev-parse','main']),remoteCommit);
  const next=exportDealer({...options,write:true});
  put(remote,'owner-change.txt','Another writer advanced the remote.\n');commit(remote);
  assert.throws(()=>pushExport({root:f.root,receiptFile:path.join(next.proposalDirectory,'export.json')}),/Remote advanced/);
});
