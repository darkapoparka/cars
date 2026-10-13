import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { assertMainCheckout, planNewClient, createNewClient } from './new-client.mjs';
import { copySource } from './copy-source.mjs';
import { fingerprint, POLICY } from './lib/workflow.mjs';
import vm from 'node:vm';
import {createHash} from 'node:crypto';
import {fileURLToPath} from 'node:url';
import { validateNativeQualificationContext, validateTemplateQualification, parseCatalogJson, NATIVE_CHECKS } from './lib/native-localization.mjs';

function fixture(t) {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), 'cars-new-client-test-'));
  t.after(() => fs.rmSync(root, { recursive: true, force: true }));
  const put = (p, data) => { fs.mkdirSync(path.dirname(path.join(root, p)), { recursive: true }); fs.writeFileSync(path.join(root, p), typeof data === 'string' || Buffer.isBuffer(data) ? data : JSON.stringify(data)); };
  put('workspace.json', { machinePaths: { [process.platform]: root } });
  put('docs/DEPLOYMENT-INVENTORY.json', { aliases: {}, dealers: [] });
  fs.mkdirSync(path.join(root, 'clients'));
  const templates = ['auto-best', 'modern', 'import', 'carwow', 'app', 'mobile', 'karento-best'].map(key => ({ key, path: 'templates/' + key, aliases: [], homes: [{ id: 'home' }] }));
  put('catalog.json', { templates });
  const lock = { templates: {} };
  for (const item of templates) {
    const p = item.path + '/';
    put(p + 'package.json', { name: item.key }); put(p + 'package-lock.json', { lockfileVersion: 3 });
    put(p + 'src/hero.txt', 'Keep this exact hero\r\n'); put(p + 'QA.md', 'Retained technical source documentation');
    put(p + 'static/identity.png', Buffer.from([137, 80, 78, 71, 0, 13, 10]));
    for (const name of ['.env.local', '.auth/state.json', 'runtime/scratch.txt', 'node_modules/dep.js', '.git/config', 'AGENTS.md', '.agents/skills/inherited.md', 'apps/web/next-env.d.ts', 'packages/database/generated/client.ts']) put(p + name, 'must not be exported');
    lock.templates[item.key] = { status: 'approved', repository: 'darkapoparka/cars-template-' + item.key, commit: 'b'.repeat(40), snapshotPath: item.path, exportPolicy: POLICY, digest: fingerprint(path.join(root, item.path)).digest };
  }
  put('templates.lock.json', lock);
  const state = { head: 'a'.repeat(40), remote: 'a'.repeat(40), branch: 'main', origin: 'https://github.com/darkapoparka/cars.git', changed: '', development: 'b'.repeat(40) };
  const readGit = (_root, args) => {
    if (args[0] === 'config') return state.origin;
    if (args[0] === 'branch') return state.branch;
    if (args[0] === 'rev-parse') return state.head;
    if (args[0] === 'diff') return state.changed;
    if (args[0] === 'ls-remote') return (args.includes('origin') ? state.remote : state.development) + '\trefs/heads/main';
    throw new Error('Unexpected git read: ' + args.join(' '));
  };
  const plan = (options = {}) => planNewClient({ root, client: 'sample-dealer', repository: 'darkapoparka/cars-sampledealer', readGit, ...options });
  return { root, put, state, readGit, plan, lock };
}

function sixFixture(t) {
  const f = fixture(t);
  for (const key of ['auto-best', 'modern', 'import']) {
    const release = f.lock.templates[key];
    // Synthetic exact-source acceptance for isolated generator tests only.
    release.qa = { nativeLocalization: { schemaVersion: 1, adapter: 'native-v1', repository: release.repository,
      commit: release.commit, sourceDigest: release.digest, locales: ['en', 'bg'], widths: [320, 390, 1440],
      verifiedAt: '2026-10-10T00:00:00Z', evidenceSha256: 'c'.repeat(64),
      checks: NATIVE_CHECKS.map(name => ({ name, status: 'passed', evidenceSha256: 'd'.repeat(64) })),
      catalogs: [{ format: 'json-pair', en: 'localization/en.json', bg: 'localization/bg.json' }],
      deployment: { id: 'dpl_fixture', projectId: 'prj_fixture', state: 'READY', sourceCommit: release.commit,
        publicAlias: `https://fixture-${key}.example/` }
    } };
  }
  f.put('templates.lock.json', f.lock);
  const localeConfig = { schemaVersion: 1, dealerId: 'sample-dealer', defaultLocale: 'en', enabledLocales: ['en', 'bg'], dealerCountry: 'GB', inventoryCurrency: 'GBP' };
  return { ...f, localeConfig, sixPlan: (options = {}) => f.plan({ designSet: 'six', localeConfig, ...options }) };
}

for (const preset of ['standard', 'import']) test(`explicit six ${preset}: creates pinned source copies and UK contract without shipping receipts`, async t => {
  const f = sixFixture(t); f.state.development = 'c'.repeat(40);
  const plan = f.sixPlan({ preset });
  assert.equal(fs.existsSync(plan.clientRoot), false);
  assert.equal(plan.manifest.packaging.version, '5');
  assert.deepEqual(plan.manifest.variants.map(v => v.key), ['auto-best', preset === 'import' ? 'import' : 'modern', preset === 'import' ? 'modern' : 'import', 'app', 'mobile', 'karento-best']);
  assert.equal(plan.manifest.variants[2].entry, preset === 'import' ? '/variant-3/cars' : '/variant-3/');
  assert.ok(plan.plans.every(p => p.updateAvailable && p.sourceRef.revision === 'b'.repeat(40)), 'new development does not change any selected pin');
  const result = await createNewClient(plan, { readGit: f.readGit });
  assert.equal(result.applications, 6);
  assert.deepEqual(JSON.parse(fs.readFileSync(path.join(result.clientRoot, 'localization/contract.json'))), f.localeConfig);
  for (const item of plan.plans) {
    const dir = path.join(result.clientRoot, item.template);
    assert.equal(fingerprint(dir).digest, item.release.digest, 'native configuration is not silently written into the copied template');
    const meta = JSON.parse(fs.readFileSync(path.join(dir, '.client/project.json')));
    assert.equal(meta.packaging.version, '5'); assert.equal(meta.qa.desktop, false); assert.equal(meta.publicUrl, null);
    assert.match(fs.readFileSync(path.join(dir, 'AGENTS.md'), 'utf8'), /awaiting personalization/);
  }
  for (const name of ['localization/adoption.json', '.cars-app.json', '.cars-mobile.json', '.cars-signature.json', 'vercel.json', 'wrangler.jsonc']) assert.equal(fs.existsSync(path.join(result.clientRoot, name)), false, name);
  assert.match(fs.readFileSync(path.join(result.clientRoot, 'CLIENT.md'), 'utf8'), /all six apps/);
});

test('six creation requires explicit complete native locale and rejects locale on legacy creation', t => {
  const f = sixFixture(t);
  assert.throws(() => f.plan({ designSet: 'six' }), /explicit --locale-config/);
  assert.throws(() => f.sixPlan({ localeConfig: { ...f.localeConfig, enabledLocales: ['en'] } }), /requires complete EN\/BG/);
  assert.throws(() => f.sixPlan({ localeConfig: { ...f.localeConfig, dealerId: 'another-dealer' } }), /must match/);
  assert.throws(() => f.sixPlan({ localeConfig: { ...f.localeConfig, defaultLocale: 'en-GB' } }), /defaultLocale/);
  assert.throws(() => f.plan({ localeConfig: f.localeConfig }), /legacy version 1/);
  assert.throws(() => f.plan({ designSet: 'five' }), /--design-set six/);
  assert.deepEqual(fs.readdirSync(path.join(f.root, 'clients')), []);
});

test('six creation refuses missing/held Signature and core native acceptance without writing source', t => {
  const f = sixFixture(t); const signature = f.lock.templates['karento-best'];
  delete f.lock.templates['karento-best']; f.put('templates.lock.json', f.lock);
  assert.throws(() => f.sixPlan(), /No release lock for karento-best/);
  f.lock.templates['karento-best'] = { ...signature, status: 'draft' }; f.put('templates.lock.json', f.lock);
  assert.throws(() => f.sixPlan(), /karento-best: draft/);
  f.lock.templates['karento-best'] = signature; delete f.lock.templates.modern.qa; f.put('templates.lock.json', f.lock);
  assert.throws(() => f.sixPlan(), /no exact-commit native acceptance/);
  assert.deepEqual(fs.readdirSync(path.join(f.root, 'clients')), []);
});

test('explicit six selection cannot duplicate families, reintroduce Carwow or use unknown mounts', t => {
  const f = sixFixture(t);
  assert.throws(() => f.sixPlan({ templates: 'auto-best,modern,import,app,mobile,mobile' }), /six distinct/);
  assert.throws(() => f.sixPlan({ templates: 'auto-best,modern,carwow,app,mobile,karento-best' }), /no Carwow/);
  assert.throws(() => f.sixPlan({ templates: 'auto-best,modern,import,app,karento-best,mobile' }), /Unknown design family/);
  assert.throws(() => f.plan({ templates: 'auto-best,modern,import,app,mobile,karento-best' }), /three distinct/);
});

test('a Signature release changed during six copying preserves the incomplete candidate outside canonical source', async t => {
  const f = sixFixture(t); const plan = f.sixPlan(); let first = true;
  await assert.rejects(createNewClient(plan, { readGit: f.readGit, copy: async (...args) => {
    const result = await copySource(...args);
    if (first) { first = false; delete f.lock.templates['karento-best']; f.put('templates.lock.json', f.lock); }
    return result;
  } }), /No release lock for karento-best/);
  assert.equal(fs.existsSync(plan.clientRoot), false);
  assert.equal(fs.existsSync(path.join(f.root, 'runtime/locks/new-client')), false);
});

for (const preset of ['standard', 'import']) test(preset + ': creates three exact template copies together, with one manifest and no inherited secrets', async t => {
  const f = fixture(t); const plan = f.plan({ preset });
  assert.equal(fs.existsSync(plan.clientRoot), false, 'planning is read-only');
  const result = await createNewClient(plan, { readGit: f.readGit });
  assert.equal(result.applications, 3); assert.equal(result.state, 'needs-personalization');
  const manifest = JSON.parse(fs.readFileSync(path.join(result.clientRoot, 'dealer.json')));
  assert.equal(manifest.defaultBranch, 'main'); assert.equal(manifest.variants.length, 3);
  assert.equal(manifest.variants[1].entry, preset === 'import' ? '/variant-2/' : '/variant-2/cars');
  for (const item of plan.plans) {
    const dir = path.join(result.clientRoot, item.template);
    assert.equal(fingerprint(dir).digest, item.release.digest);
    assert.equal(fs.readFileSync(path.join(dir, 'QA.md'), 'utf8'), 'Retained technical source documentation');
    for (const p of ['.env.local', '.auth', '.git', 'runtime', 'node_modules', '.agents', 'apps/web/next-env.d.ts', 'packages/database/generated']) assert.equal(fs.existsSync(path.join(dir, p)), false, p);
    const meta = JSON.parse(fs.readFileSync(path.join(dir, '.client/project.json')));
    assert.equal(meta.templateVersion, item.release.commit); assert.equal(meta.qa.desktop, false);
    assert.equal(JSON.parse(fs.readFileSync(path.join(dir, '.template/source-manifest.json'))).destination, item.destination);
  }
  assert.equal(fs.existsSync(path.join(f.root, 'runtime/locks/new-client')), false);
  assert.equal(fs.existsSync(path.join(path.dirname(result.receipt), 'dealer')), false, 'staging moved, not duplicated');
});

for (const [field, value, error] of [['branch', 'feature', /on main/], ['origin', 'https://github.com/other/cars.git', /Wrong Cars origin/], ['remote', 'c'.repeat(40), /not synchronized/], ['changed', 'templates.lock.json', /Commit the reviewed/]]) {
  test('rejects unsafe checkout: ' + field, t => { const f = fixture(t); f.state[field] = value; assert.throws(() => f.plan(), error); assert.deepEqual(fs.readdirSync(path.join(f.root, 'clients')), []); });
}
test('refuses a different physical checkout even with the same Git remote', t => {
  const f = fixture(t); f.put('workspace.json', { machinePaths: { [process.platform]: path.join(f.root, 'clients') } });
  assert.throws(() => assertMainCheckout(f.root, { readGit: f.readGit }), /canonical Cars checkout/);
});
test('does not accept stale cached Git evidence when the network read fails', t => {
  const f = fixture(t); assert.throws(() => f.plan({ readGit: (root, args) => { if (args[0] === 'ls-remote') throw new Error('network unavailable'); return f.readGit(root, args); } }), /network unavailable/);
});
test('reports newer development without substituting it for the approved template', t => {
  const f = fixture(t); f.state.development = 'c'.repeat(40); const p = f.plan();
  assert.ok(p.plans.every(v => v.updateAvailable && v.release.commit === 'b'.repeat(40)));
});
test('refuses snapshot drift and catalog-to-lock path mismatch', t => {
  const f = fixture(t); f.put('templates/modern/src/hero.txt', 'unauthorized redesign');
  assert.throws(() => f.plan(), /snapshot drift/);
  const catalog = JSON.parse(fs.readFileSync(path.join(f.root, 'catalog.json'))); catalog.templates[0].path = 'clients/somewhere'; f.put('catalog.json', catalog);
  assert.throws(() => f.plan(), /identity mismatch/);
});
test('refuses existing dealer aliases rather than making another copy', t => {
  const f = fixture(t); f.put('docs/DEPLOYMENT-INVENTORY.json', { aliases: { 'sample-dealer': 'original' }, dealers: [{ slug: 'original' }] });
  assert.throws(() => f.plan(), /Existing dealer identity/);
});
test('copy failure retains only a diagnostic candidate, never a half-created dealer', async t => {
  const f = fixture(t); const p = f.plan(); let copied = 0;
  await assert.rejects(createNewClient(p, { readGit: f.readGit, copy: async (...args) => { if (++copied === 2) throw new Error('injected copy failure'); return copySource(...args); } }), /injected copy failure/);
  assert.equal(fs.existsSync(p.clientRoot), false); assert.equal(fs.existsSync(path.join(f.root, 'runtime/locks/new-client')), false);
  const stage = fs.readdirSync(path.join(f.root, 'runtime/new-clients'))[0];
  assert.ok(fs.existsSync(path.join(f.root, 'runtime/new-clients', stage, 'failure.json')));
});
test('candidate byte corruption is rejected before canonical installation', async t => {
  const f = fixture(t); const p = f.plan();
  await assert.rejects(createNewClient(p, { readGit: f.readGit, copy: async (source, destination, options) => { await copySource(source, destination, options); fs.appendFileSync(path.join(destination, 'src/hero.txt'), 'corrupted'); } }), /Copied source differs/);
  assert.equal(fs.existsSync(p.clientRoot), false);
});
test('main changing during a copy does not install the obsolete candidate', async t => {
  const f = fixture(t); const p = f.plan();
  await assert.rejects(createNewClient(p, { readGit: f.readGit, copy: async (...args) => { const result = await copySource(...args); f.state.head = f.state.remote = 'd'.repeat(40); return result; } }), /main changed during copying/);
  assert.equal(fs.existsSync(p.clientRoot), false);
});
test('an existing operation lock is not removed or ignored', async t => {
  const f = fixture(t); const p = f.plan(); f.put('runtime/locks/new-client/owner.json', 'other writer');
  await assert.rejects(createNewClient(p, { readGit: f.readGit }), /Another new-client/);
  assert.equal(fs.readFileSync(path.join(f.root, 'runtime/locks/new-client/owner.json'), 'utf8'), 'other writer');
});
test('an occupied canonical destination appearing during copying is preserved', async t => {
  const f = fixture(t); const p = f.plan(); let first = true;
  await assert.rejects(createNewClient(p, { readGit: f.readGit, copy: async (...args) => { const result = await copySource(...args); if (first) { first = false; f.put('clients/sample-dealer/owner.txt', 'preserve'); } return result; } }), /destination appeared/);
  assert.equal(fs.readFileSync(path.join(p.clientRoot, 'owner.txt'), 'utf8'), 'preserve');
  assert.deepEqual(fs.readdirSync(p.clientRoot), ['owner.txt']);
});

test('a mutated plan cannot redirect creation outside the canonical dealer folder', async t => {
  const f = fixture(t); const p = f.plan(); p.clientRoot = path.join(f.root, 'unexpected');
  await assert.rejects(createNewClient(p, { readGit: f.readGit }), /Invalid canonical client plan/);
  assert.equal(fs.existsSync(p.clientRoot), false);
});

test('build-output exclusions do not hide authored generated source or Prisma schemas', async () => {
  const { excluded } = await import('./lib/workflow.mjs');
  for (const p of ['apps/web/next-env.d.ts', 'modern/packages/database/generated/client.ts']) assert.equal(excluded(p), true);
  for (const p of ['src/generated/approved.ts', 'packages/database/schema.prisma', 'packages/database/prisma/schema.prisma']) assert.equal(excluded(p), false);
});

test('a publishing repository cannot be reused under another dealer name', t => {
  const f = fixture(t); f.put('docs/DEPLOYMENT-INVENTORY.json', { aliases: {}, dealers: [{ slug: 'original', repository: 'darkapoparka/CARS-SAMPLEDEALER' }] });
  assert.throws(() => f.plan(), /Publishing repository already belongs to original/);
});


function qualificationFixture(t) {
  const f=fixture(t), hash=b=>createHash('sha256').update(b).digest('hex'),
    oid=b=>createHash('sha1').update(Buffer.concat([Buffer.from('blob '+Buffer.byteLength(b)+'\0'),Buffer.from(b)])).digest('hex'),
    prefix='docs/releases/source-qualification', encode=v=>Buffer.from(JSON.stringify(v)+'\n');
  const delta={reference:prefix+'/delta.json',sha256:hash(encode({reviewed:true})),reviewedAt:'2026-10-12T00:00:00Z'};
  const parent={status:'approved',commit:'b'.repeat(40),digest:'d'.repeat(64),qa:{evidence:prefix+'/parent.json',verifiedAt:delta.reviewedAt}};
  const source={repository:'darkapoparka/cars',revision:'e'.repeat(40),path:'templates/app',tree:'f'.repeat(40),digest:'1'.repeat(64)};
  const context={schemaVersion:1,kind:'cars-native-source-qualification-context',id:'new-wave-test',
    dealer:'sample-dealer',scope:'new-dealer-source-proposal',reviewed:true,reviewedAt:delta.reviewedAt,
    sourceCommit:source.revision,nativeApproval:false,hostedApproval:false,globalReleaseApproval:false,
    approvedLockSha256:hash(fs.readFileSync(path.join(f.root,'templates.lock.json'))),candidateLockSha256:'2'.repeat(64),sourceDeltaReview:delta};
  const release={status:'qualification',repository:source.repository,commit:source.revision,snapshotPath:source.path,
    digest:source.digest,exportPolicy:POLICY,source,qualification:{contextId:context.id,sourceDeltaReview:delta,catalogs:[],
      sourceQA:{approvedRelease:parent,releaseSha256:hash(JSON.stringify(parent)),reference:parent.qa.evidence,
        sha256:'3'.repeat(64),verifiedAt:parent.qa.verifiedAt}}};
  const candidate={schemaVersion:1,exportPolicy:POLICY,templates:{app:release}};
  const lockPin={path:prefix+'/candidate.json',sha256:hash(encode(candidate))};
  context.candidateLockSha256=lockPin.sha256;
  const pins={candidateLock:lockPin,qualification:{path:prefix+'/context.json',sha256:hash(encode(context))}};
  for(const [name,data] of [[lockPin.path,candidate],[pins.qualification.path,context],[delta.reference,{reviewed:true}]])f.put(name,encode(data));
  const committed=new Map([lockPin.path,pins.qualification.path,delta.reference].map(name=>[name,oid(fs.readFileSync(path.join(f.root,name)))]));
  const state={tree:source.tree,ancestor:'',read:0,ordinary:0};
  const helperSource=fs.readFileSync(fileURLToPath(new URL('./new-client.mjs',import.meta.url)),'utf8');
  const start=helperSource.indexOf('export function readNewClientQualification('),end=helperSource.indexOf('export function planNewClient(',start);
  assert(start>=0&&end>start);
  const helper=vm.runInNewContext(helperSource.slice(start,end).replaceAll('export function ','function ')+
    '\n({readNewClientQualification,verifyNewClientRelease})',{fs,path,Buffer,TextDecoder,POLICY,
      inside:(root,name)=>path.join(root,name),sha256:hash,parseCatalogJson,validateNativeQualificationContext,validateTemplateQualification,
      git:(_root,args,options)=>args[0]==='hash-object'?oid(options.input):
        args[0]==='merge-base'?state.ancestor:args[1].startsWith('HEAD:')?committed.get(args[1].slice(5)):state.tree,
      verifyTemplate:()=>{state.ordinary++;return 'ordinary-approved-default';},
      readPinnedTemplateTree:({source:s,expectedDigest})=>{state.read++;assert.deepEqual(JSON.parse(JSON.stringify(s)),source);assert.equal(expectedDigest,source.digest);}});
  return {...f,helper,state,pins,context,release,candidate,encode,hash};
}
test('new source qualification pins require committed raw bytes and the exact dealer scope',t=>{
 const f=qualificationFixture(t),read=()=>f.helper.readNewClientQualification(f.root,f.pins,'sample-dealer');
 const q=read();assert.equal(q.context.scope,'new-dealer-source-proposal');assert.equal(q.context.nativeApproval,false);
 fs.appendFileSync(path.join(f.root,f.pins.candidateLock.path),' ');assert.throws(read,/bytes changed/);
 assert.deepEqual(fs.readdirSync(path.join(f.root,'clients')),[]);
});
test('candidate release keeps ordinary defaults and rejects wrong final tree, ancestor and false approval before copying',t=>{
 const f=qualificationFixture(t),q=f.helper.readNewClientQualification(f.root,f.pins,'sample-dealer');
 assert.equal(f.helper.verifyNewClientRelease(f.root,'app'),'ordinary-approved-default');assert.equal(f.state.ordinary,1);
 assert.equal(f.helper.verifyNewClientRelease(f.root,'app',q).source.tree,f.release.source.tree);assert.equal(f.state.read,1);
 f.state.tree='9'.repeat(40);assert.throws(()=>f.helper.verifyNewClientRelease(f.root,'app',q),/source tree/);assert.equal(f.state.read,1);
 f.state.tree=f.release.source.tree;f.state.ancestor=null;assert.throws(()=>f.helper.verifyNewClientRelease(f.root,'app',q),/source tree/);
 f.state.ancestor='';q.context.nativeApproval=true;assert.throws(()=>f.helper.verifyNewClientRelease(f.root,'app',q),/not native release approval/);
 assert.deepEqual(fs.readdirSync(path.join(f.root,'clients')),[]);
});
test('new and existing source qualifications both retain false approval and reject unrelated scopes or dealers',t=>{
 const f=qualificationFixture(t);
 for(const scope of ['new-dealer-source-proposal','existing-dealer-pilot'])assert.equal(validateNativeQualificationContext({...f.context,scope},{dealer:'sample-dealer'}).scope,scope);
 assert.throws(()=>validateNativeQualificationContext({...f.context,scope:'globally-approved'}),/not native release approval/);
 assert.throws(()=>validateNativeQualificationContext(f.context,{dealer:'another-dealer'}),/not native release approval/);
 for(const field of ['nativeApproval','hostedApproval','globalReleaseApproval'])assert.throws(()=>validateNativeQualificationContext({...f.context,[field]:true}),/not native release approval/);
});

test('immutable source creator allows only an actual published event and keeps ordinary local creation strict',t=>{
 const f=fixture(t),head='a'.repeat(40),remote='b'.repeat(40),env={GITHUB_ACTIONS:'true',GITHUB_EVENT_NAME:'push',GITHUB_REPOSITORY:'darkapoparka/cars',GITHUB_REF:'refs/heads/main',GITHUB_SHA:head,GITHUB_RUN_ID:'123',GITHUB_RUN_ATTEMPT:'1'};
 let current=remote;const calls=[];
 const readGit=(_r,args)=>{calls.push(args);const op=args.join(' ');if(op==='rev-parse HEAD')return head;if(op==='rev-parse --is-shallow-repository')return 'false';if(args[0]==='ls-remote')return current+'\trefs/heads/main';if(args[0]==='merge-base')return head;if(args[0]==='cat-file')return '';return f.readGit(_r,args);};
 const options={readGit,env,platform:'linux',eventCommit:head};
 const proof=assertMainCheckout(f.root,options);assert.equal(proof.head,head);assert.equal(proof.remoteHead,remote);assert.equal(proof.eventCommit,head);
 current='c'.repeat(40);assert.equal(assertMainCheckout(f.root,options).head,head);assert.equal(assertMainCheckout(f.root,options).remoteHead,current);
 assert.throws(()=>assertMainCheckout(f.root,{...options,eventCommit:null}),/not synchronized/);
 for(const altered of [{GITHUB_ACTIONS:'false'},{GITHUB_SHA:remote},{GITHUB_REF:'refs/heads/other'},{GITHUB_EVENT_NAME:'workflow_dispatch'},{GITHUB_REPOSITORY:'other/cars'},{GITHUB_RUN_ID:'0'},{GITHUB_RUN_ATTEMPT:'0'}])assert.throws(()=>assertMainCheckout(f.root,{...options,env:{...env,...altered}}),/actual complete/);
 assert.throws(()=>assertMainCheckout(f.root,{...options,platform:'win32'}));
 assert.throws(()=>assertMainCheckout(f.root,{...options,env:{...env,CF_API_TOKEN:'fixture-only'}}),/credentials/);
 assert.throws(()=>assertMainCheckout(f.root,{...options,readGit:(r,a)=>a[0]==='merge-base'?remote:readGit(r,a)}),/ancestor/);
 assert.throws(()=>assertMainCheckout(f.root,{...options,readGit:(r,a)=>a.join(' ')==='rev-parse HEAD'?remote:readGit(r,a)}),/actual complete/);
 assert(!calls.some(a=>['switch','checkout','reset','update-ref','push'].includes(a[0])));
});
test('immutable creator missing remote metadata fetch is exact and does not move checkout or refs',t=>{
 const f=fixture(t),head='a'.repeat(40),remote='b'.repeat(40),calls=[],env={GITHUB_ACTIONS:'true',GITHUB_EVENT_NAME:'push',GITHUB_REPOSITORY:'darkapoparka/cars',GITHUB_REF:'refs/heads/main',GITHUB_SHA:head,GITHUB_RUN_ID:'123',GITHUB_RUN_ATTEMPT:'1'};
 const readGit=(r,a)=>{calls.push(a);if(a[0]==='cat-file')throw Error('missing exact commit');if(a[0]==='fetch')return '';if(a[0]==='merge-base')return head;if(a[0]==='ls-remote')return remote+'\trefs/heads/main';if(a.join(' ')==='rev-parse --is-shallow-repository')return 'false';return f.readGit(r,a);};
 assert.equal(assertMainCheckout(f.root,{readGit,platform:'linux',env,eventCommit:head}).remoteHead,remote);
 const fetch=calls.find(a=>a[0]==='fetch');assert.deepEqual(fetch,['fetch','--no-tags','--no-auto-maintenance','--no-write-fetch-head','--no-recurse-submodules','--refmap=','--filter=blob:none','origin',remote]);
});
