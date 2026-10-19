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

test('input rehearsal reproduces an isolated pack and retains a truthful report', async t => {
  const options = fixture(t), original = [...options.pack.files].map(([name, bytes]) => [name, Buffer.from(bytes)]);
  const report = await checkDealerPackInputs({...options, prepareLogo: async ({root, slug, toolPackage}) => {
    assert.notEqual(root, options.root); assert.equal(path.isAbsolute(toolPackage), true);
    assert.equal(fs.readFileSync(path.join(root, 'dealers', slug, 'branding/source.json'), 'utf8'), '{}\n');
    return {status: 'retained-public-original-not-dealer-approved'};
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
    await assert.rejects(checkDealerPackInputs({...options, prepareLogo: async ({root, slug}) => {
      fs.writeFileSync(path.join(root, 'dealers', slug, extra ? 'branding/extra.json' : 'branding/source.json'), '{"changed":true}\n');
      return {status: 'proposal'};
    }}), /stale or non-deterministic/);
    assert.equal(options.pack.files.get('branding/source.json').toString(), '{}\n');
    const directory = path.join(options.root, 'runtime/dealer-pack-input-checks');
    assert.deepEqual(fs.readdirSync(directory), ['public-motors.json']);
    assert.equal(JSON.parse(fs.readFileSync(path.join(directory, 'public-motors.json'))).success, false);
  }
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
