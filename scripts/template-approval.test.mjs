import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import test from 'node:test';
import { approveCarsTemplate } from './template-release.mjs';
import { fingerprintCommit, git, POLICY, writeJson, sha256 } from './lib/workflow.mjs';
import { NATIVE_CHECKS } from './lib/native-localization.mjs';
import { fixtureReleases, writeTinySingleton } from './test-fixtures/fleet-single-worker.mjs';

function fixture(t, { native = false, key = 'auto-best', existing = true } = {}) {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), 'cars-source-approval-'));
  t.after(() => fs.rmSync(root, { recursive: true, force: true }));
  const prefix = `templates/${key}`;
  fs.mkdirSync(path.join(root, prefix), { recursive: true });
  fs.writeFileSync(path.join(root, prefix, 'package.json'), '{"name":"fixture"}\n');
  if (native) {
    fs.mkdirSync(path.join(root, prefix, 'src/lib/locale'), { recursive: true });
    fs.writeFileSync(path.join(root, prefix, 'src/lib/locale/core.ts'), 'export const locales = ["en", "bg"];\n');
  }
  git(root, ['init', '-b', 'main']);
  git(root, ['config', 'user.name', 'Cars fixture']);
  git(root, ['config', 'user.email', 'fixture@example.invalid']);
  git(root, ['remote', 'add', 'origin', 'https://github.com/darkapoparka/cars.git']);
  git(root, ['add', 'templates']);
  git(root, ['commit', '-m', 'template']);
  const commit = git(root, ['rev-parse', 'HEAD']);
  git(root, ['update-ref', 'refs/remotes/origin/main', commit]);
  const lockFile = path.join(root, 'templates.lock.json');
  writeJson(lockFile, { templates: existing ? { [key]: {
    status: 'approved', repository: 'darkapoparka/cars-template-auto-best', commit: 'a'.repeat(40),
    snapshotPath: prefix, digest: 'b'.repeat(64), exportPolicy: POLICY,
    qa: { evidence: 'docs/releases/previous.json' }
  } } : {} });
  const evidence = path.join(root, 'docs/releases/current.json');
  const qa = { repository: 'darkapoparka/cars', commit, sourcePath: prefix,
    sourceTree: git(root, ['rev-parse', `${commit}:${prefix}`]),
    sourceDigest: fingerprintCommit(root, commit, { prefix }).digest,
    approved: true, verifiedAt: '2026-09-24T18:00:00Z', runtime: { node: '24' },
    checks: [{ name: 'application', status: 'passed' }], standalone: { mobile: true, desktop: true } };
  writeJson(evidence, qa);
  return { root, commit, evidence, qa, lockFile, prefix };
}

function cloudflareApprovalFixture(t) {
  const f = fixture(t, { native: true }), client = 'approval-fixture';
  // Both immutable identities are real tiny Git commits. They are not deployment evidence.
  const dealerPath = path.join(f.root, 'clients', client); fs.mkdirSync(dealerPath, { recursive: true });
  fs.writeFileSync(path.join(dealerPath, 'source.json'), '{"syntheticFixture":true}\n');
  git(f.root, ['add', 'clients']); git(f.root, ['commit', '-m', 'synthetic compiled dealer source']);
  const compiledCommit = git(f.root, ['rev-parse', 'HEAD']); git(f.root, ['update-ref', 'refs/remotes/origin/main', compiledCommit]);
  const source = { repository:f.qa.repository,revision:f.commit,path:f.prefix,tree:f.qa.sourceTree,digest:f.qa.sourceDigest };
  const sourceReleases = {...fixtureReleases(),'auto-best':source};
  const bundle = writeTinySingleton(path.join(f.root, 'tiny-proof'), { client, sourceReleases, sourceCommit:compiledCommit,
    sourceTree:git(f.root, ['rev-parse', compiledCommit + ':clients/' + client]) });
  const proofDirectory = path.join(f.root, 'docs/releases/hosted-fixture'); fs.mkdirSync(proofDirectory, {recursive:true});
  const pin = (name, value) => {
    const bytes = Buffer.isBuffer(value) ? value : Buffer.from(JSON.stringify(value,null,2)+'\n');
    fs.writeFileSync(path.join(proofDirectory,name),bytes);
    return {reference:'docs/releases/hosted-fixture/'+name,sha256:sha256(bytes)};
  };
  const refs = {artifactManifest:pin('artifact-manifest.json',fs.readFileSync(path.join(bundle.directory,'artifact-manifest.json'))),
    singleWorkerReceipt:pin('single-worker-receipt.json',fs.readFileSync(path.join(bundle.directory,'single-worker-receipt.json')))};
  const common = {...Object.fromEntries(['accountId','workerName','publicOrigin','sourceCommit','sourceTree','inputDigest','sourceReleases','outputDigest','workerCount','applicationCount'].map(name=>[name,bundle.receipt[name]])),
    artifactDigest:bundle.inventory.digest,serviceBindings:[],deploymentId:'11111111-1111-4111-8111-111111111111',versionId:'22222222-2222-4222-8222-222222222222',
    versionTraffic:[{version_id:'22222222-2222-4222-8222-222222222222',percentage:100}],liveBindings:[{type:'assets',name:'ASSETS'}],
    sourcePublication:{repository:'darkapoparka/cars',commit:compiledCommit,sourceTree:bundle.receipt.sourceTree,ref:'refs/heads/main',publishedAt:'2026-10-11T09:00:00Z',evidence:'synthetic Git main proof',verifiedMainCommit:compiledCommit}};
  const deployed = {...structuredClone(common),schemaVersion:1,type:'cars-existing-fleet-single-worker-deployment',status:'deployed',client,
    runId:bundle.receipt.runId,attempt:bundle.receipt.attempt,deployments:1,hostedVerified:false,ownerAccepted:false,finishedAt:'2026-10-11T10:00:00Z'};
  refs.deploymentReceipt = pin('deployment.json',deployed);
  const nativeLocalization = Object.fromEntries(['auto-best','modern','import'].map(key=>{const selected=sourceReleases[key];return [key,{
    schemaVersion:1,adapter:'native-v1',repository:selected.repository,commit:selected.revision,sourcePath:selected.path,sourceTree:selected.tree,sourceDigest:selected.digest,
    locales:['en','bg'],widths:[320,390,1440],verifiedAt:'2026-10-11T10:02:00Z',evidenceSha256:'b'.repeat(64),
    catalogs:[{format:'json-pair',en:'localization/en.json',bg:'localization/bg.json'}],checks:NATIVE_CHECKS.map(name=>({name,status:'passed',evidenceSha256:'c'.repeat(64)}))}];}));
  const hosted = {...structuredClone(common),schemaVersion:1,type:'cars-existing-fleet-single-worker-hosted-acceptance',status:'passed',client,unauthenticated:true,verifiedAt:'2026-10-11T10:03:00Z',...refs,nativeLocalization,
    applications:Object.fromEntries(Object.entries(sourceReleases).map(([key,selected])=>[key,{status:'passed',source:selected,
      checks:['mounted-journeys','public-journeys','assets-preserved'].map(name=>({name,status:'passed',evidenceSha256:'d'.repeat(64)}))}]))};
  refs.hostedReceipt = pin('hosted.json',hosted);
  const deployment = {...structuredClone(common),provider:'cloudflare',publicAlias:common.publicOrigin,...refs};delete deployment.publicOrigin;
  f.qa.nativeLocalization = {...structuredClone(nativeLocalization['auto-best']),deployment};writeJson(f.evidence,f.qa);
  const rewriteComposer = mutate => {
    const composer=structuredClone(bundle.receipt),inventory=structuredClone(bundle.inventory);mutate(composer);
    composer.outputDigest=sha256(JSON.stringify(composer.files));
    const bytes=Buffer.from(JSON.stringify(composer,null,2)+'\n'),ref=pin('single-worker-receipt.json',bytes);
    inventory.files=inventory.files.filter(row=>['single-worker-receipt.json','dealer-composition-review.json','delivery-receipt.json'].includes(row.path)||composer.files.some(file=>file.path===row.path));
    const row=inventory.files.find(file=>file.path==='single-worker-receipt.json');row.bytes=bytes.length;row.sha256=sha256(bytes);
    inventory.digest=sha256(JSON.stringify(inventory.files));inventory.bytes=inventory.files.reduce((sum,file)=>sum+file.bytes,0);
    const manifest=pin('artifact-manifest.json',inventory),updated={...structuredClone(deployed),artifactDigest:inventory.digest,outputDigest:composer.outputDigest},deployRef=pin('deployment.json',updated);
    const accepted={...structuredClone(hosted),artifactDigest:inventory.digest,outputDigest:composer.outputDigest,artifactManifest:manifest,singleWorkerReceipt:ref,deploymentReceipt:deployRef};
    Object.assign(f.qa.nativeLocalization.deployment,{artifactDigest:inventory.digest,outputDigest:composer.outputDigest,artifactManifest:manifest,singleWorkerReceipt:ref,deploymentReceipt:deployRef,hostedReceipt:pin('hosted.json',accepted)});
  };
  return {...f,bundle,deployed,hosted,pin,compiledCommit,rewriteComposer};
}

test('Cloudflare approval reads original sealed receipts and keeps template and dealer Git identities distinct', t => {
  const f=cloudflareApprovalFixture(t),before=fs.readFileSync(f.lockFile),sourceBefore=fingerprintCommit(f.root,f.commit,{prefix:f.prefix}).digest;
  const options={root:f.root,key:'auto-best',commit:f.commit,evidence:f.evidence};
  const proposed=approveCarsTemplate(options);assert.equal(proposed.ready,true);assert.deepEqual(fs.readFileSync(f.lockFile),before);
  assert.equal(proposed.release.source.revision,f.commit);assert.equal(proposed.release.qa.nativeLocalization.deployment.sourceCommit,f.compiledCommit);
  assert.notEqual(f.commit,f.compiledCommit);assert.equal(f.deployed.hostedVerified,false);
  const selected=approveCarsTemplate({...options,write:true});assert.deepEqual(selected.release.qa.nativeLocalization.deployment,f.qa.nativeLocalization.deployment);
  assert.equal(fingerprintCommit(f.root,f.commit,{prefix:f.prefix}).digest,sourceBefore);
  assert.equal(git(f.root,['diff','--name-only','--',f.prefix]),'');
});

test('Cloudflare approval rejects stale proof bytes, rewritten originals and partial hosted evidence without selecting a lock', t => {
  for(const mutate of [
    f=>{fs.appendFileSync(path.join(f.root,f.qa.nativeLocalization.deployment.artifactManifest.reference),' ');},
    f=>{const changed=structuredClone(f.hosted);delete changed.applications.app;f.qa.nativeLocalization.deployment.hostedReceipt=f.pin('hosted.json',changed);},
    f=>{const changed=structuredClone(f.hosted);changed.nativeLocalization.import.checks[0].status='pending';f.qa.nativeLocalization.deployment.hostedReceipt=f.pin('hosted.json',changed);},
    f=>{const changed=structuredClone(f.deployed);changed.sourceTree='f'.repeat(40);const ref=f.pin('deployment.json',changed);f.qa.nativeLocalization.deployment.deploymentReceipt=ref;
      const hosted=structuredClone(f.hosted);hosted.deploymentReceipt=ref;f.qa.nativeLocalization.deployment.hostedReceipt=f.pin('hosted.json',hosted);},
    f=>{f.rewriteComposer(composer=>{composer.sourceReleases.mobile.digest='f'.repeat(64);});},
    f=>{f.rewriteComposer(composer=>{composer.files=composer.files.filter(row=>row.path!=='server/app/index.js');});},
    f=>{f.qa.nativeLocalization.deployment.hostedReceipt.reference='../hosted.json';},
    f=>{f.qa.standalone.mobile=false;}
  ]) {
    const f=cloudflareApprovalFixture(t),before=fs.readFileSync(f.lockFile);mutate(f);writeJson(f.evidence,f.qa);
    assert.throws(()=>approveCarsTemplate({root:f.root,key:'auto-best',commit:f.commit,evidence:f.evidence,write:true}));
    assert.deepEqual(fs.readFileSync(f.lockFile),before);
  }
});

test('source approval updates only the lock and retains standalone provenance', t => {
  const f = fixture(t), before = fs.readFileSync(f.lockFile);
  const options = { root: f.root, key: 'auto-best', commit: f.commit, evidence: f.evidence };
  assert.equal(approveCarsTemplate(options).ready, true);
  assert.deepEqual(fs.readFileSync(f.lockFile), before);
  const result = approveCarsTemplate({ ...options, write: true });
  assert.equal(result.release.source.revision, f.commit);
  assert.equal(result.release.legacySource.revision, 'a'.repeat(40));
  assert.equal(result.release.legacySource.evidence, 'docs/releases/previous.json');
  assert.equal(git(f.root, ['diff', '--name-only', '--', f.prefix]), '');
  assert.equal(fs.existsSync(path.join(f.root, 'runtime')), false);
  assert.deepEqual(approveCarsTemplate({ ...options, write: true }).release.legacySource, result.release.legacySource);
});

test('source approval rejects mismatched or failed evidence without changing the lock', t => {
  const f = fixture(t), before = fs.readFileSync(f.lockFile);
  for (const bad of [{ commit: 'f'.repeat(40) }, { sourceTree: 'f'.repeat(40) },
    { sourceDigest: 'f'.repeat(64) }, { sourcePath: 'templates/carwow' },
    { checks: [{ name: 'application', status: 'failed' }] }, { standalone: { desktop: true } }]) {
    writeJson(f.evidence, { ...f.qa, ...bad });
    assert.throws(() => approveCarsTemplate({ root: f.root, key: 'auto-best', commit: f.commit,
      evidence: f.evidence, write: true }), /Evidence must bind/);
    assert.deepEqual(fs.readFileSync(f.lockFile), before);
  }
});

test('native source stays held when its acceptance is missing or belongs to a standalone release', t => {
  const f = fixture(t, { native: true }), before = fs.readFileSync(f.lockFile);
  for (const nativeLocalization of [undefined, { schemaVersion: 1, adapter: 'native-v1',
    repository: 'darkapoparka/cars-template-auto-best', commit: 'a'.repeat(40) }]) {
    writeJson(f.evidence, { ...f.qa, nativeLocalization });
    assert.throws(() => approveCarsTemplate({ root: f.root, key: 'auto-best', commit: f.commit,
      evidence: f.evidence, write: true }), /exact-commit native acceptance/);
    assert.deepEqual(fs.readFileSync(f.lockFile), before);
  }
});

test('unpublished source is not selectable as a dealer release', t => {
  const f = fixture(t);
  git(f.root, ['update-ref', '-d', 'refs/remotes/origin/main']);
  assert.throws(() => approveCarsTemplate({ root: f.root, key: 'auto-best', commit: f.commit }), /not published/);
});

test('new Mobile and Signature releases require exact evidence before adding their source entries', t => {
  for (const key of ['mobile', 'karento-best']) {
    const f = fixture(t, { key, existing: false }), before = fs.readFileSync(f.lockFile);
    const options = { root: f.root, key, commit: f.commit };
    assert.equal(approveCarsTemplate(options).ready, false);
    assert.deepEqual(fs.readFileSync(f.lockFile), before);
    assert.throws(() => approveCarsTemplate({ ...options, write: true }), /exact-source QA/);
    writeJson(f.evidence, { ...f.qa, sourceDigest: 'f'.repeat(64) });
    assert.throws(() => approveCarsTemplate({ ...options, evidence: f.evidence, write: true }), /Evidence must bind/);
    assert.deepEqual(fs.readFileSync(f.lockFile), before);
    writeJson(f.evidence, f.qa);
    const result = approveCarsTemplate({ ...options, evidence: f.evidence, write: true });
    assert.equal(result.release.source.path, f.prefix);
    assert.equal(result.release.source.revision, f.commit);
    assert.equal(result.release.legacySource, undefined);
    assert.equal(JSON.parse(fs.readFileSync(f.lockFile)).templates[key].status, 'approved');
    assert.equal(git(f.root, ['diff', '--name-only', '--', f.prefix]), '');
  }
});
