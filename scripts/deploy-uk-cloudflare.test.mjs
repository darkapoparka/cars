import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { deflateRawSync } from 'node:zlib';
import { ROOT, json, sha256 } from './lib/workflow.mjs';
import { MANIFEST_PATH, FAMILIES } from './build-uk-dealers.mjs';
import { UK_FAMILY_NODES } from './lib/uk-cloudflare-artifacts.mjs';
import { UK_DEPLOY_ACCOUNT, readZipReceipt, validateRemoteBuild, validateBuildHandoff,
  validatePrivatePublication, parseWranglerDeploymentOutput, activeDeployment,
  assertRouterPrerequisites } from './deploy-uk-cloudflare.mjs';

const dealer=json(path.join(ROOT,MANIFEST_PATH)).dealers.find(row=>row.slug==='stockport-broadbent-car-and-servicing');
assert.ok(dealer,'The reviewed pilot dealer is required.');
const HEAD='a'.repeat(40),TREE='b'.repeat(40),TRANSPORT='c'.repeat(40),EXPORTED='d'.repeat(40);
const DIGEST='1'.repeat(64),COMPILED='2'.repeat(64),OTHER='3'.repeat(64);
const VERSION='11111111-2222-4333-8444-555555555555',DEPLOYMENT='66666666-7777-4888-8999-000000000000';
const copy=value=>structuredClone(value);
const worker=key=>key==='router'?dealer.workerName:dealer.workerName+'-'+(key==='karento-best'?'signature':key);
const artifactName=key=>'uk-cloudflare-compiled-'+dealer.slug+'-'+key+'-42-1';

function handoff(key='modern') {
  const next=['modern','app','mobile'].includes(key);
  const stem=key==='modern'?'modern/apps/web':key;
  const configPath=key==='router'?'compiled/cloudflare/wrangler.jsonc':next?'compiled/'+stem+'/dist/server/wrangler.json':'compiled/'+key+'/wrangler.json';
  const mainPath=key==='router'?'compiled/cloudflare/router.mjs':next?'compiled/'+stem+'/dist/server/index.js':'compiled/'+key+'/.svelte-kit/cloudflare-worker/index.js';
  const assetPath=key==='router'?'compiled/cloudflare/public':next?'compiled/'+stem+'/dist/client':'compiled/'+key+'/.svelte-kit/cloudflare';
  const dryRunBundlePath=next||key==='router'?'compiled/.cars-build-assets/'+key+'-worker':'compiled/'+key+'/.cars-cloudflare/worker';
  const files=[configPath,mainPath,assetPath+'/asset.txt',dryRunBundlePath+'/index.js'].sort().map(file=>({path:file,bytes:3,sha256:DIGEST}));
  const payload=[{path:'.cars-cloudflare.json',sha256:DIGEST}];
  const deploy={schemaVersion:1,dealer:dealer.slug,key,provider:'cloudflare',repository:dealer.repository,
    sourceCommit:HEAD,packageTree:TREE,transportCommit:TRANSPORT,packageDigest:DIGEST,payloadDigest:sha256(JSON.stringify(payload)),
    packageSha256:OTHER,publicOrigin:dealer.publicOrigin,workerName:worker(key),node:'v'+UK_FAMILY_NODES[key],
    configPath,mainPath,assetPath,dryRunBundlePath,compiledFiles:files,compiledDigest:sha256(JSON.stringify(files)),
    artifactName:artifactName(key),runId:'42',attempt:'1',compiled:true,dryRun:true,sourcePayloadUnchanged:true,
    deployment:{performed:false,credentialsIncluded:false,buildRequired:false,reviewRequired:true}};
  const summary={schemaVersion:1,dealer:dealer.slug,provider:'cloudflare',publicOrigin:dealer.publicOrigin,sourceCommit:HEAD,runId:'42',attempt:'1',
    packageTree:TREE,packageDigest:DIGEST,payloadDigest:deploy.payloadDigest,allSixFamiliesBuilt:true,routerDryRun:true,
    status:'compiled-awaiting-local-deployment-review',targets:[...FAMILIES,'router'].map(family=>({
      key:family,workerName:worker(family),packageTree:TREE,packageDigest:DIGEST,payloadDigest:deploy.payloadDigest,
      compiledDigest:family===key?deploy.compiledDigest:COMPILED,artifactName:artifactName(family)}))};
  const services=FAMILIES.map(family=>({binding:'CARS_'+family.toUpperCase().replaceAll('-','_'),service:worker(family)}));
  const provider={dealer:dealer.slug,worker:dealer.workerName,provider:'cloudflare',configuration:{services},acceptance:{dependencyLocksFrozen:true}};
  const config={name:worker(key),workers_dev:key==='router',main:path.posix.relative(path.posix.dirname(configPath),mainPath),
    assets:{directory:path.posix.relative(path.posix.dirname(configPath),assetPath),binding:'ASSETS'},...(key==='router'?{services}:{}),
    ...(next?{no_bundle:true,configPath:'/home/runner/original/wrangler.json',userConfigPath:'/home/runner/original/wrangler.json'}:{})};
  return {input:{dealer:dealer.slug,key,runId:'42',attempt:'1',artifactId:43,summaryArtifactId:44},deploy,summary,config,provider,
    meta:{sourceCommit:HEAD,payload,payloadDigest:deploy.payloadDigest},
    inventory:{schemaVersion:1,kind:'compiled-worker',status:'passed',dealer:dealer.slug,key,files}};
}
function validate(value) {return validateBuildHandoff(value,dealer,value.input,HEAD);}

test('all seven actual target layouts retain emitted configuration and choose the standalone Svelte upload',()=>{
  for(const key of [...FAMILIES,'router']){
    const value=handoff(key),before=JSON.stringify(value.config),result=validate(value);
    assert.equal(JSON.stringify(value.config),before);
    assert.equal(result.workerName,worker(key));
    assert.equal(result.workersDev,key==='router');
    assert.equal(result.uploadMainPath,['modern','app','mobile','router'].includes(key)?value.deploy.mainPath:value.deploy.dryRunBundlePath+'/index.js');
  }
});

test('compiled handoff rejects source, exposure, package and routing drift',()=>{
  for(const mutate of [
    value=>value.deploy.sourceCommit='e'.repeat(40),
    value=>value.deploy.sourcePayloadUnchanged=false,
    value=>value.deploy.deployment.credentialsIncluded=true,
    value=>value.summary.targets.pop(),
    value=>value.summary.targets[0].packageDigest=OTHER,
    value=>value.config.name+='-wrong',
    value=>value.config.workers_dev=true,
    value=>value.config.main='../../outside.js',
    value=>value.config.assets.directory='../../other-assets',
    value=>value.config.account_id='0'.repeat(32),
    value=>value.provider.acceptance.dependencyLocksFrozen=false,
    value=>value.inventory.files=value.inventory.files.slice(1),
    value=>value.meta.payloadDigest=OTHER
  ]){
    const value=handoff();mutate(value);assert.throws(()=>validate(value));
  }
  const router=handoff('router');router.config.services[0].service+='-wrong';assert.throws(()=>validate(router),/bindings/);
  const svelte=handoff('auto-best');
  svelte.deploy.compiledFiles=svelte.deploy.compiledFiles.filter(row=>row.path!==svelte.deploy.dryRunBundlePath+'/index.js');
  svelte.deploy.compiledDigest=sha256(JSON.stringify(svelte.deploy.compiledFiles));
  svelte.inventory.files=svelte.deploy.compiledFiles;svelte.summary.targets.find(row=>row.key==='auto-best').compiledDigest=svelte.deploy.compiledDigest;
  assert.throws(()=>validate(svelte),/entry/);
});

function githubFixture() {
  const value=handoff(),run={id:42,run_attempt:1,event:'workflow_dispatch',head_branch:'main',head_sha:HEAD,
    path:'.github/workflows/build-uk-cloudflare.yml',repository:{full_name:'darkapoparka/cars'},
    head_repository:{full_name:'darkapoparka/cars'},status:'completed',conclusion:'success'};
  const make=(id,name)=>({id,name,expired:false,digest:'sha256:'+DIGEST,size_in_bytes:120,workflow_run:{id:42,head_sha:HEAD}});
  return {input:value.input,remote:{run,artifact:make(43,artifactName('modern')),
    summaryArtifact:make(44,'uk-cloudflare-review-'+dealer.slug+'-42-1')}};
}
test('GitHub handoff requires the successful manual main run and exact archive identity',()=>{
  const good=githubFixture();assert.doesNotThrow(()=>validateRemoteBuild(good.remote,good.input));
  for(const mutate of [
    value=>value.remote.run.event='pull_request',
    value=>value.remote.run.run_attempt=2,
    value=>value.remote.run.head_repository.full_name='someone/fork',
    value=>value.remote.run.conclusion='failure',
    value=>value.remote.artifact.workflow_run.head_sha='e'.repeat(40),
    value=>value.remote.artifact.name+='-other',
    value=>value.remote.artifact.expired=true,
    value=>value.remote.artifact.digest='unverified',
    value=>value.remote.summaryArtifact.id=99
  ]){const value=githubFixture();mutate(value);assert.throws(()=>validateRemoteBuild(value.remote,value.input));}
});

function publicationFixture() {
  const deploy=handoff().deploy;
  const published={schemaVersion:1,slug:dealer.slug,repository:dealer.repository,branch:'main',provider:'cloudflare',
    sourceCommit:HEAD,packageTree:TREE,candidateDigest:DIGEST,commit:EXPORTED,verifiedRemoteHead:EXPORTED,pushed:true,
    repositoryVisibility:'private',repositoryId:12345,verifiedAt:'2026-10-10T12:00:00Z',visibilityVerifiedAt:'2026-10-10T11:59:59Z'};
  const exported={schemaVersion:1,slug:dealer.slug,repository:dealer.repository,branch:'main',defaultBranch:'main',provider:'cloudflare',
    sourceCommit:HEAD,packageTree:TREE,candidateDigest:DIGEST,commit:EXPORTED,tree:'e'.repeat(40),parent:'f'.repeat(40)};
  const publishMeta={schemaVersion:1,repository:dealer.repository,sourceCommit:HEAD,candidateDigest:DIGEST,files:[{path:'dealer.json',blob:'a'.repeat(40)}]};
  return {deploy,values:{published,exported,publishMeta,remoteHead:EXPORTED,commitTree:exported.tree,commitParent:exported.parent}};
}
test('deployment binds to the genuinely published private package and unchanged main commit',()=>{
  const good=publicationFixture();
  assert.equal(validatePrivatePublication(good.values,dealer,good.deploy).publishedCommit,EXPORTED);
  for(const mutate of [
    value=>value.values.published.repositoryVisibility='public',
    value=>value.values.published.pushed=false,
    value=>value.values.published.candidateDigest=OTHER,
    value=>value.values.published.packageTree=TRANSPORT,
    value=>value.values.published.sourceCommit=TRANSPORT,
    value=>value.values.remoteHead=TRANSPORT,
    value=>value.values.exported.commit=TRANSPORT,
    value=>value.values.commitTree=TRANSPORT,
    value=>value.values.commitParent=TRANSPORT,
    value=>value.values.publishMeta.candidateDigest=OTHER,
    value=>value.values.published.visibilityVerifiedAt='unknown'
  ]){const value=publicationFixture();mutate(value);assert.throws(()=>validatePrivatePublication(value.values,dealer,value.deploy));}
});

const session=version=>({type:'wrangler-session',version:1,wrangler_version:version,command_line_args:['deploy']});
const outputDeployment=()=>({type:'deploy',version:1,worker_name:worker('modern'),version_id:VERSION,worker_name_overridden:false});
test('both installed Wrangler versions need an actual structured deployment response',()=>{
  for(const version of ['4.118.0','4.149.0']){
    const rows=[session(version),outputDeployment()],encode=rows=>rows.map(row=>JSON.stringify(row)).join('\n')+'\n';
    assert.equal(parseWranglerDeploymentOutput(encode(rows),worker('modern'),version).version_id,VERSION);
    assert.throws(()=>parseWranglerDeploymentOutput(encode([...rows,session(version)]),worker('modern'),version));
    assert.throws(()=>parseWranglerDeploymentOutput(encode([...rows,{type:'command-failed',message:'Failed'}]),worker('modern'),version));
    const other=copy(rows);other[1].worker_name='wrong';assert.throws(()=>parseWranglerDeploymentOutput(encode(other),worker('modern'),version));
    assert.throws(()=>parseWranglerDeploymentOutput(encode([rows[0]]),worker('modern'),version));
  }
});
test('active traffic proof selects latest deployment and rejects a partial or superseded rollout',()=>{
  const current={id:DEPLOYMENT,created_on:'2026-10-10T12:00:00Z',versions:[{version_id:VERSION,percentage:100}]};
  const older={...copy(current),created_on:'2026-10-09T12:00:00Z',versions:[{version_id:'99999999-2222-4333-8444-555555555555',percentage:100}]};
  assert.deepEqual(activeDeployment([current,older],VERSION).versionTraffic,current.versions);
  const partial=copy(current);partial.versions[0].percentage=50;
  assert.throws(()=>activeDeployment([partial],VERSION));
  assert.throws(()=>activeDeployment([older],VERSION));
  assert.throws(()=>activeDeployment([],VERSION));
});

test('router requires six internal versions from the same published package and build',()=>{
  const summary=handoff('router').summary,publication={publishedCommit:EXPORTED,publishedReceiptSha256:OTHER};
  const receipts=FAMILIES.map((key,index)=>({schemaVersion:1,type:'cars-uk-cloudflare-deployment',status:'deployed',
    dealer:dealer.slug,repository:dealer.repository,publishedCommit:EXPORTED,privateExport:copy(publication),
    key,accountId:UK_DEPLOY_ACCOUNT,workerName:worker(key),workersDev:false,sourceCommit:HEAD,packageTree:TREE,
    packageDigest:DIGEST,payloadDigest:summary.payloadDigest,compiledDigest:summary.targets.find(row=>row.key===key).compiledDigest,
    runId:'42',attempt:'1',versionId:VERSION,deploymentId:DEPLOYMENT,
    live:{id:DEPLOYMENT,versionTraffic:[{version_id:VERSION,percentage:100}]}}));
  assert.doesNotThrow(()=>assertRouterPrerequisites(receipts,summary,dealer,publication));
  for(const mutate of [
    rows=>rows.pop(),rows=>rows[0].sourceCommit=TRANSPORT,rows=>rows[0].packageDigest=OTHER,
    rows=>rows[0].workersDev=true,rows=>rows[0].runId='43',rows=>rows[0].publishedCommit=TRANSPORT,
    rows=>rows[0].privateExport.publishedReceiptSha256=DIGEST,rows=>rows[0].live.versionTraffic[0].percentage=99
  ]){const rows=copy(receipts);mutate(rows);assert.throws(()=>assertRouterPrerequisites(rows,summary,dealer,publication));}
});

function zip(entries) {
  let offset=0;const blocks=[],directory=[];
  for(const entry of entries){
    const name=Buffer.from(entry.name),content=Buffer.from(entry.content),method=entry.deflate?8:0;
    const bytes=entry.deflate?deflateRawSync(content):content;
    const local=Buffer.alloc(30);local.writeUInt32LE(0x04034b50);local.writeUInt16LE(20,4);local.writeUInt16LE(method,8);
    local.writeUInt32LE(bytes.length,18);local.writeUInt32LE(content.length,22);local.writeUInt16LE(name.length,26);
    const central=Buffer.alloc(46);central.writeUInt32LE(0x02014b50);central.writeUInt16LE(20,4);central.writeUInt16LE(20,6);central.writeUInt16LE(method,10);
    central.writeUInt32LE(bytes.length,20);central.writeUInt32LE(content.length,24);central.writeUInt16LE(name.length,28);central.writeUInt32LE(offset,42);
    blocks.push(local,name,bytes);directory.push(central,name);offset+=local.length+name.length+bytes.length;
  }
  const central=Buffer.concat(directory),end=Buffer.alloc(22);end.writeUInt32LE(0x06054b50);end.writeUInt16LE(entries.length,8);end.writeUInt16LE(entries.length,10);
  end.writeUInt32LE(central.length,12);end.writeUInt32LE(offset,16);return Buffer.concat([...blocks,central,end]);
}
test('bounded ZIP receipts support actual stored/deflated members and reject detached identities',t=>{
  const area=fs.mkdtempSync(path.join(ROOT,'runtime','uk-deploy-test-'));
  t.after(()=>fs.rmSync(area,{recursive:true,force:true}));
  const archive=path.join(area,'tiny.zip'),name='receipts/.cars-package.json',value='{"sourceCommit":"'+HEAD+'"}';
  for(const deflate of [false,true]){
    fs.writeFileSync(archive,zip([{name,content:value,deflate}]));
    assert.equal(readZipReceipt(archive,name).toString(),value);
  }
  fs.writeFileSync(archive,zip([{name,content:value},{name,content:value}]));
  assert.throws(()=>readZipReceipt(archive,name),/duplicate/);
  fs.writeFileSync(archive,zip([{name,content:value},{name:'../outside',content:'bad'}]));
  assert.throws(()=>readZipReceipt(archive,name),/Unsafe/);
  const wrongLocal=zip([{name,content:value}]);wrongLocal[30]='X'.charCodeAt(0);fs.writeFileSync(archive,wrongLocal);
  assert.throws(()=>readZipReceipt(archive,name),/local receipt identity/);
  fs.writeFileSync(archive,zip([{name,content:value}]).subarray(0,15));
  assert.throws(()=>readZipReceipt(archive,name),/size/);
});
