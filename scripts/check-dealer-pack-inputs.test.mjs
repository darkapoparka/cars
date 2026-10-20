import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import {checkDealerPackInputs} from './check-dealer-pack-inputs.mjs';
import {buildAndVerifyDealerPack} from './dealer-pack.mjs';

function fixture(t) {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), 'cars-pack-inputs-'));
  t.after(() => fs.rmSync(root, {recursive: true, force: true}));
  const pack = {manifest: {dealerId: 'gb-city-public-motors'}, facts: {business: {name: 'Public Motors', countryCode: 'GB'}},
    packDigest: 'a'.repeat(64), stock: {kind: 'dated-listing-snapshot', records: [{}]},
    files: new Map([['business-facts.json', Buffer.from('{"name":"Public Motors"}\n')], ['branding/source.json', Buffer.from('{}\n')]])};
  const readLead = () => ({lead: {id: pack.manifest.dealerId, country: 'GB', name: 'Public Motors'}, source: {path: 'leads/expansion-2026-10-18/uk.json', sha256: 'b'.repeat(64)}});
  return {root, pack, slug: 'public-motors', loadPack: () => pack, readLead};
}

test('input rehearsal reproduces in memory and retains a truthful committed-input report', async t => {
  const options = fixture(t), original = [...options.pack.files].map(([name, bytes]) => [name, Buffer.from(bytes)]);
  const report = await checkDealerPackInputs({...options, prepareLogo: async ({root, toolPackage, persist, sourceFiles}) => {
    assert.equal(root, options.root); assert.equal(path.isAbsolute(toolPackage), true); assert.equal(persist, false);
    assert.equal(sourceFiles.get('branding/source.json').toString(), '{}\n');
    return {status: 'retained-public-original-not-dealer-approved', generatedFiles: new Map(sourceFiles)};
  }});
  assert.equal(report.success, true); assert.equal(report.logo.deterministic, true);
  assert.equal(report.liveResearchPerformed, false); assert.equal(report.imageGenerationPerformed, false);
  assert.deepEqual([...options.pack.files], original);
  assert.deepEqual(fs.readdirSync(path.join(options.root, 'runtime/dealer-pack-input-checks')), ['public-motors.json']);
  assert.equal(JSON.parse(fs.readFileSync(path.join(options.root, 'runtime/dealer-pack-input-checks/public-motors.json'))).success, true);
});

test('input rehearsal rejects an unrelated lead before exporting artwork', async t => {
  const options = fixture(t); let called = false;
  await assert.rejects(checkDealerPackInputs({...options,
    readLead: () => ({lead: {id: 'gb-city-other-motors', country: 'GB', name: 'Other Motors'}, source: {}}),
    prepareLogo: async () => {called = true;}}), /identity differs/);
  assert.equal(called, false);
});

test('input rehearsal rejects changed or undeclared exports and preserves original inputs', async t => {
  for (const extra of [false, true]) {
    const options = fixture(t);
    await assert.rejects(checkDealerPackInputs({...options, prepareLogo: async ({sourceFiles}) => {
      const generatedFiles = new Map(sourceFiles); generatedFiles.set(extra ? 'branding/extra.json' : 'branding/source.json', Buffer.from('{"changed":true}\n'));
      return {status: 'proposal', generatedFiles};
    }}), /stale or non-deterministic/);
    assert.equal(options.pack.files.get('branding/source.json').toString(), '{}\n');
    const directory = path.join(options.root, 'runtime/dealer-pack-input-checks');
    assert.deepEqual(fs.readdirSync(directory), ['public-motors.json']);
    assert.equal(JSON.parse(fs.readFileSync(path.join(directory, 'public-motors.json'))).success, false);
  }
});

test('a compact v2 pack checks hydrated bytes while preserving the committed pack digest and file count', async t => {
  const options = fixture(t), bytes = Buffer.from('exact-derived-test-fixture');
  options.pack.logoRecipe = {outputs: [{path: 'dealer-brand/test.webp', sha256: (await import('./lib/workflow.mjs')).sha256(bytes)}]};
  options.pack.logoRegeneration = {verified: true}; options.pack.branding = {status: 'proposal'}; options.pack.fileCount = options.pack.files.size;
  options.pack.files.set('dealer-brand/test.webp', bytes);
  const result = await checkDealerPackInputs({...options, prepareLogo: () => {throw Error('already rehydrated and verified by loader');}});
  assert.equal(result.packDigest, 'a'.repeat(64)); assert.equal(result.sourceFiles, 2); assert.equal(result.logo.regeneratedExports, 1);
  options.pack.files.set('dealer-brand/test.webp', Buffer.from('changed')); await assert.rejects(checkDealerPackInputs(options), /Hydrated logo/);
});

test('the one-command build fails when real QA reports failure and returns only verified success', async () => {
  const calls = [], options = {slug: 'public-motors', plan: 'paid'}, argv = ['build', '--slug', options.slug];
  const runBuild = async args => {calls.push(args); return {bundleRoot: '/tmp/pack-proof/bundle'};};
  await assert.rejects(buildAndVerifyDealerPack({options, argv, runBuild, verify: async args => {
    assert.equal(args.reportPath, '/tmp/pack-proof/qa-report.json');
    return {success: false, checks: [{id: 'rendered-routes', status: 'failed'}]};
  }}), /QA failed; retained report/);
  const result = await buildAndVerifyDealerPack({options, argv, runBuild, verify: async () => ({success: true})});
  assert.equal(result.qa.success, true); assert.equal(result.providerWrites, false); assert.deepEqual(calls, [argv, argv]);
});
