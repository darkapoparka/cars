import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { spawnSync } from 'node:child_process';
import { sha256, normalized } from './lib/workflow.mjs';
import { UK_FAMILY_NODES,parseQualificationRuns,validateFileInventory,verifyInventoryBytes,
  validateQualification,artifactInventory,verifyArtifactDirectory,generatedBuildPath,assertPackagePayload,assertCompiledConfig } from './lib/uk-cloudflare-artifacts.mjs';
import { buildMatrix } from './build-uk-cloudflare.mjs';

const clone=value=>structuredClone(value);
function qualificationFixture(key='modern') {
  const pins={revision:'1'.repeat(40),tree:'2'.repeat(40),digest:'3'.repeat(64)};
  const next=['modern','app','mobile'].includes(key);
  const run={id:123,event:'workflow_dispatch',head_branch:'main',head_sha:'4'.repeat(40),
    repository:{full_name:'darkapoparka/cars'},head_repository:{full_name:'darkapoparka/cars'},
    path:'.github/workflows/qualify-cloudflare-templates.yml'};
  const artifact={id:456,name:'cloudflare-qualification-'+key+'-123-1',expired:false,digest:'sha256:'+'5'.repeat(64),
    workflow_run:{id:123,head_sha:run.head_sha}};
  const source={key,source:{repository:'darkapoparka/cars',path:'templates/'+key,...pins},
    release:{status:'approved'},dealerAdoption:false,publishingReady:false};
  const qualification={schemaVersion:1,key,status:'passed',node:'v'+UK_FAMILY_NODES[key],repository:'darkapoparka/cars',
    commit:run.head_sha,runId:'123',attempt:'1',hosted:false,publishingReady:false,
    steps:(next?['install-'+key,'build-'+key,'freeze-'+key]:[key+'-dependencies',key+'-build',key+'-dry-run','freeze']).map(phase=>({phase,status:'passed'}))};
  const files=[{path:'receipts/source.json',bytes:2,sha256:sha256('{}')}];
  const manifest={schemaVersion:1,key,status:'passed',commit:run.head_sha,files,digest:sha256(JSON.stringify(files)),bytes:2};
  const frozen=next?{schemaVersion:1,key}:{[key]:{schemaVersion:1}};
  return {input:{key,run,artifact,source,qualification,manifest,frozen},pins};
}

test('manual target matrix keeps six complete dealer families plus one router and exact runtimes',()=>{
  const matrix=buildMatrix('stockport-broadbent-car-and-servicing');
  assert.equal(matrix.include.length,7);assert.deepEqual(matrix.include.map(row=>row.key),Object.keys(UK_FAMILY_NODES));
  assert.throws(()=>buildMatrix('all'),/one dealer/);
  assert.throws(()=>buildMatrix('../other'),/exact reviewed/);
  assert.deepEqual(parseQualificationRuns('38041380562, 38042594609,38043025503'),['38041380562','38042594609','38043025503']);
  for(const input of ['', '1,1','1,main','1;git push','0','1,,2'])assert.throws(()=>parseQualificationRuns(input),/numeric qualification/);
});

test('real qualification receipt contracts reject failed builds, another source, fork runs and absent freeze phases',()=>{
  for(const key of Object.keys(UK_FAMILY_NODES).filter(key=>key!=='router')){
    const {input,pins}=qualificationFixture(key);assert.ok(validateQualification(input,pins));
    for(const change of [
      x=>{x.qualification.status='failed';},x=>{x.source.source.revision='9'.repeat(40);},
      x=>{x.run.head_repository.full_name='other/cars';},x=>{x.artifact.workflow_run.head_sha='9'.repeat(40);},
      x=>{x.qualification.steps.pop();},x=>{x.qualification.steps[0].status='failed';},
      x=>{x.source.release.status='draft';},x=>{x.artifact.name+='-other';},
      x=>{x.artifact.expired=true;},x=>{x.qualification.node='v20.0.0';}
    ]){const altered=clone(input);change(altered);assert.throws(()=>validateQualification(altered,pins),/Qualification|qualification/);}
  }
});

test('receipt integrity rejects hash changes, traversal, repeated paths and a fabricated inventory digest',()=>{
  const {input}=qualificationFixture();const m=input.manifest;
  assert.equal(validateFileInventory(m),m);assert.doesNotThrow(()=>verifyInventoryBytes(m,'receipts/source.json',Buffer.from('{}')));
  assert.throws(()=>verifyInventoryBytes(m,'receipts/source.json',Buffer.from('[]')),/receipt bytes differ/);
  for(const change of [x=>{x.files[0].path='../source.json';},x=>{x.files.push({...x.files[0]});},
    x=>{x.digest='0'.repeat(64);},x=>{x.bytes++;}]){const altered=clone(m);change(altered);assert.throws(()=>validateFileInventory(altered),/malformed or changed/);}
});

test('generated namespaces remain bounded to actual compiler roots, including nested Modern workspaces',()=>{
  for(const name of ['app/dist/server/index.js','mobile/.next/cache/a','modern/apps/web/node_modules/x',
    'modern/packages/database/generated/client.ts','import/.svelte-kit/cloudflare/index.html',
    'karento-best/.cars-cloudflare/worker/index.js','.cars-build-assets/router-worker/index.js',
    'cloudflare/node_modules/wrangler','modern/.turbo/a'])assert.equal(generatedBuildPath(name),true,name);
  for(const name of ['modern/apps/web/app/build/route.ts','app/app/dist/route.ts','app/src/.cache/source.ts',
    'auto-best/src/routes/.svelte-kit/+page.svelte','another/node_modules/x','app/public/dist/logo.png',
    'modern/apps/web/app/node_modules/route.ts','node_modules/x'])assert.equal(generatedBuildPath(name),false,name);
});

test('sealed payload survives allowed compiler output but refuses undeclared source, byte drift and linked outputs',()=>{
  const root=fs.mkdtempSync(path.join(os.tmpdir(),'cars-uk-payload-test-'));
  try{
    fs.mkdirSync(path.join(root,'app/src'),{recursive:true});fs.writeFileSync(path.join(root,'app/src/page.ts'),'export default 1;\n');
    const payload=[{path:'app/src/page.ts',sha256:sha256(normalized(fs.readFileSync(path.join(root,'app/src/page.ts'))))}];
    const meta={schemaVersion:1,payload,payloadDigest:sha256(JSON.stringify(payload))};
    const sealed=Buffer.from(JSON.stringify(meta));fs.writeFileSync(path.join(root,'.cars-package.json'),sealed);
    assert.equal(assertPackagePayload(root,meta,sha256(sealed)).unchanged,true);
    fs.mkdirSync(path.join(root,'app/dist'));fs.writeFileSync(path.join(root,'app/dist/index.js'),'compiled');
    assert.equal(assertPackagePayload(root,meta,sha256(sealed)).unchanged,true);
    fs.mkdirSync(path.join(root,'app/src/build'));fs.writeFileSync(path.join(root,'app/src/build/route.ts'),'new source');
    assert.throws(()=>assertPackagePayload(root,meta,sha256(sealed)),/Undeclared source/);
    fs.rmSync(path.join(root,'app/src/build'),{recursive:true});
    fs.writeFileSync(path.join(root,'app/src/page.ts'),'export default 2;\n');
    assert.throws(()=>assertPackagePayload(root,meta,sha256(sealed)),/payload changed/);
    fs.writeFileSync(path.join(root,'app/src/page.ts'),'export default 1;\n');
    fs.rmSync(path.join(root,'app/dist'),{recursive:true});
    fs.symlinkSync(path.join(root,'app/src'),path.join(root,'app/dist'),process.platform==='win32'?'junction':'dir');
    assert.throws(()=>assertPackagePayload(root,meta,sha256(sealed)),/Linked package input/);
  }finally{fs.rmSync(root,{recursive:true,force:true});}
});

test('artifact manifests detect post-build edits and undeclared files without normalizing binary content',()=>{
  const root=fs.mkdtempSync(path.join(os.tmpdir(),'cars-uk-artifact-test-'));
  try{
    fs.writeFileSync(path.join(root,'worker.bin'),Buffer.from([1,2,0,13,10,255]));
    artifactInventory(root,{kind:'fixture'});assert.equal(verifyArtifactDirectory(root).kind,'fixture');
    fs.writeFileSync(path.join(root,'worker.bin'),Buffer.from([1,2,0,10,255]));
    assert.throws(()=>verifyArtifactDirectory(root),/receipt bytes differ/);
    fs.writeFileSync(path.join(root,'worker.bin'),Buffer.from([1,2,0,13,10,255]));
    fs.writeFileSync(path.join(root,'extra.ts'),'unreviewed');
    assert.throws(()=>verifyArtifactDirectory(root),/undeclared files/);
  }finally{fs.rmSync(root,{recursive:true,force:true});}
});

test('isolated package index can produce and restore a thin bundle while the canonical worktree stays unchanged',()=>{
  const base=fs.mkdtempSync(path.join(os.tmpdir(),'cars-uk-bundle-test-'));
  try{
    const root=path.join(base,'cars'),pack=path.join(base,'package'),restored=path.join(base,'restored');
    for(const dir of [root,pack,restored])fs.mkdirSync(dir);
    const g=(args,{input,env}={})=>{const r=spawnSync('git',['-C',root,...args],{input,env:{...process.env,...env},
      encoding:'utf8',windowsHide:true});assert.equal(r.status,0,r.stderr||r.stdout);return r.stdout.trimEnd();};
    g(['init','--initial-branch=main']);fs.writeFileSync(path.join(root,'source.txt'),'shared\n');
    g(['add','source.txt']);g(['-c','user.name=Test','-c','user.email=test@example.test','commit','-m','source']);
    const source=g(['rev-parse','HEAD']);
    fs.copyFileSync(path.join(root,'source.txt'),path.join(pack,'source.txt'));fs.writeFileSync(path.join(pack,'provider.txt'),'derived\n');
    const env={GIT_INDEX_FILE:path.join(base,'package.index'),GIT_WORK_TREE:pack};
    g(['-c','core.sparseCheckout=false','read-tree','--empty'],{env});
    g(['--literal-pathspecs','add','--force','--pathspec-from-file=-','--pathspec-file-nul'],{env,input:'source.txt\0provider.txt\0'});
    const tree=g(['write-tree'],{env}),commit=g(['-c','user.name=Test','-c','user.email=test@example.test','commit-tree',tree,'-p',source],{input:'transport\n'});
    g(['update-ref','refs/cars-ci/test',commit]);const bundle=path.join(base,'package.bundle');
    g(['bundle','create',bundle,'refs/cars-ci/test','^'+source]);g(['bundle','verify',bundle]);
    assert.equal(g(['show','-s','--format=%T %P',commit]),tree+' '+source);
    const restoreEnv={GIT_INDEX_FILE:path.join(base,'restore.index'),GIT_WORK_TREE:restored};
    g(['-c','core.sparseCheckout=false','read-tree','--no-sparse-checkout',tree],{env:restoreEnv});
    g(['-c','core.autocrlf=false','checkout-index','--all','--prefix='+restored.replaceAll('\\','/')+'/'],{env:restoreEnv});
    assert.equal(fs.readFileSync(path.join(restored,'provider.txt'),'utf8'),'derived\n');
    assert.equal(g(['rev-parse','HEAD']),source);assert.equal(g(['status','--porcelain']),'');
  }finally{fs.rmSync(base,{recursive:true,force:true});}
});

test('portable emitted configs accept exact Modern, Svelte and router paths and reject forbidden bytes',()=>{
  const fixtures=[
    {target:{config:'modern/apps/web/dist/server/wrangler.json',main:'modern/apps/web/dist/server/index.js',assets:'modern/apps/web/dist/client',workerName:'cars-uk-fixture-modern'},
      config:{main:'index.js',assets:{directory:'../client',binding:'ASSETS'},workers_dev:false},router:false},
    {target:{config:'auto-best/wrangler.json',main:'auto-best/.svelte-kit/cloudflare-worker/index.js',assets:'auto-best/.svelte-kit/cloudflare',workerName:'cars-uk-fixture-auto-best'},
      config:{main:'.svelte-kit/cloudflare-worker/index.js',assets:{directory:'.svelte-kit/cloudflare',binding:'ASSETS'},workers_dev:false},router:false},
    {target:{config:'cloudflare/wrangler.jsonc',main:'cloudflare/router.mjs',assets:'cloudflare/public',workerName:'cars-uk-fixture'},
      config:{main:'router.mjs',assets:{directory:'public',binding:'ASSETS'},workers_dev:true},router:true}
  ];
  for(const {target,config,router} of fixtures){
    config.name=target.workerName;
    assert.equal(assertCompiledConfig(config,target,{router}).name,target.workerName);
    for(const field of ['main','assets']){
      for(const invalid of ['\\worker.js','C:/worker.js','x\u0000y','x\u001fy','x\u007fy']){
        const altered=clone(config);
        if(field==='main')altered.main=invalid;else altered.assets.directory=invalid;
        assert.throws(()=>assertCompiledConfig(altered,target,{router}),/Emitted Wrangler config/);
      }
    }
  }
});

test('portable emitted config must resolve the exact named target and asset directory',()=>{
  const target={config:'app/dist/server/wrangler.json',main:'app/dist/server/index.js',assets:'app/dist/client',workerName:'cars-uk-fixture-app'};
  const config={name:target.workerName,main:'index.js',assets:{directory:'../client',binding:'ASSETS'},workers_dev:false,
    configPath:'/obsolete/runner/path/wrangler.jsonc',userConfigPath:'/obsolete/runner/path/wrangler.jsonc'};
  assert.equal(assertCompiledConfig(config,target).name,target.workerName);
  for(const alter of [x=>{x.name='foreign-worker';},x=>{x.main='../../another.js';},x=>{x.assets.directory='/tmp/assets';},
    x=>{x.assets.directory='../../client';},x=>{x.workers_dev=true;},x=>{x.assets.binding='OTHER';}]){
    const next=clone(config);alter(next);assert.throws(()=>assertCompiledConfig(next,target),/Emitted Wrangler config/);
  }
});
