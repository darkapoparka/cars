import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import {parsePlanSlugs, changedDealerPackSlugs, benchmarkDealerPackDescriptors, distributeDealerPackLanes,
  planDealerPackCi, bootstrapDealerPackCiLane, writeDealerPackPlanOutputs} from './plan-dealer-pack-ci.mjs';
import {buildPackBatchAssignments, PACK_BATCH_FILE} from './lib/dealer-pack-identity.mjs';

const digest = 'a'.repeat(64), releaseId = 'cars-six-' + 'b'.repeat(64);
const area = t => {const root = fs.mkdtempSync(path.join(os.tmpdir(), 'cars-pack-ci-')); t.after(() => fs.rmSync(root, {recursive: true, force: true})); return root;};
const put = (root, name, value) => {const file = path.join(root, name); fs.mkdirSync(path.dirname(file), {recursive: true}); fs.writeFileSync(file, typeof value === 'string' ? value : JSON.stringify(value));};
const ready = async () => ({success: true, packDigest: digest, releaseId});

test('PR selection uses exact commits and only existing changed dealer directories', t => {
  const root = area(t), base = '1'.repeat(40), head = '2'.repeat(40);
  put(root, 'dealers/changed-pack/dealer.json', {}); put(root, 'dealers/malformed-pack/dealer.json', '<<<<<<< ours');
  const selected = changedDealerPackSlugs({root, base, head, readGit: (location, args) => {
    assert.equal(location, root); assert.deepEqual(args, ['diff', '--name-only', '-z', base + '..' + head, '--', 'dealers/']);
    return ['dealers/templates.lock.json', 'dealers/changed-pack/dealer.json', 'dealers/changed-pack/stock.json',
      'dealers/deleted-pack/dealer.json', 'dealers/malformed-pack/business-facts.json', 'docs/PIPELINE.md'].join('\0') + '\0';
  }});
  assert.deepEqual(selected, ['changed-pack', 'malformed-pack']);
  assert.throws(() => changedDealerPackSlugs({root, base: 'main', head}), /exact base/);
});

test('one malformed or rejected pack does not prevent valid bounded lanes', async t => {
  const root = area(t), calls = [];
  const plan = await planDealerPackCi({root, slugs: ['one-pack', 'malformed-pack', '../outside', 'two-pack'], validatePack: async ({slug}) => {
    calls.push(slug); if (slug === 'malformed-pack') throw Error('Merge conflict in business-facts.json'); return ready();
  }});
  assert.deepEqual(calls, ['one-pack', 'malformed-pack', 'two-pack']); assert.deepEqual(plan.valid, ['one-pack', 'two-pack']);
  assert.deepEqual(plan.rejected.map(row => row.slug), ['malformed-pack', '../outside']); assert.equal(plan.status, 'partial-failure');
  assert.equal(plan.hasRejections, true); assert.deepEqual(plan.releaseIds, [releaseId]);
  assert.deepEqual(plan.lanes.include.map(row => row.slugs), [['one-pack'], ['two-pack']]); assert.equal(plan.sourceWrites, 0);
  const refused = await planDealerPackCi({root, slugs: ['unbound-pack'], validatePack: async () => ({success: true})});
  assert.equal(refused.status, 'failed'); assert.deepEqual(refused.lanes.include, []);
});

test('a PR with no dealer changes skips without inventing proof builds', async t => {
  const plan = await planDealerPackCi({root: area(t), base: '1'.repeat(40), head: '2'.repeat(40), readGit: () => 'dealers/templates.lock.json\0',
    validatePack: () => {throw Error('No dealer should be read');}});
  assert.equal(plan.status, 'skipped'); assert.equal(plan.hasWork, false); assert.deepEqual(plan.requested, []);
});

test('batch selection reports missing and conflicted assignments but keeps the matching ready pack', async t => {
  const root = area(t), manifest = {priorityResearchIds: Array.from({length: 400}, (_, i) => 'gb-lead-' + i)};
  put(root, 'leads/expansion-2026-10-18/manifest.json', manifest); put(root, PACK_BATCH_FILE, buildPackBatchAssignments(manifest));
  put(root, 'dealers/own-pack/dealer.json', {slug: 'own-pack', dealerId: 'gb-lead-0'});
  put(root, 'dealers/unrelated-pack/dealer.json', {slug: 'unrelated-pack', dealerId: 'gb-lead-150'});
  put(root, 'dealers/conflicted-pack/dealer.json', '<<<<<<< conflict');
  const plan = await planDealerPackCi({root, batch: 1, validatePack: async ({slug, batch}) => {assert.equal(slug, 'own-pack'); assert.equal(batch, 1); return ready();}});
  assert.deepEqual(plan.valid, ['own-pack']); assert.equal(plan.rejected.length, 100); assert.equal(plan.rejected.filter(row => row.dealerId).length, 99);
  assert.equal(plan.status, 'partial-failure'); assert(plan.rejected.some(row => row.slug === 'conflicted-pack' && row.reason));
});

test('explicit requests and lane fanout have bounded sizes without dropping or duplicating dealers', () => {
  const slugs = Array.from({length: 100}, (_, index) => 'pack-' + index), lanes = distributeDealerPackLanes(slugs);
  assert.equal(lanes.include.length, 7); assert.equal(Math.max(...lanes.include.map(row => row.slugs.length)), 15);
  assert.deepEqual([...new Set(lanes.include.flatMap(row => row.slugs))].sort(), [...slugs].sort());
  assert.deepEqual(parsePlanSlugs('["pack-one","pack-two"]'), ['pack-one', 'pack-two']);
  for (const value of ['', [], Array(101).fill('x'), ['same', 'same']]) assert.throws(() => parsePlanSlugs(value));
  assert.throws(() => distributeDealerPackLanes(slugs, {maxLanes: 8}), /one to seven/);
});

test('benchmark25 plans the required 7/1/17 mix without creating any source directories', async t => {
  const root = area(t), checked = [];
  const plan = await planDealerPackCi({root, benchmark25: true, validatePack: async ({slug}) => {checked.push(slug); return ready();}});
  assert.equal(checked.length, 3); assert.equal(plan.requested.length, 25); assert.equal(plan.valid.length, 25);
  const descriptors = plan.lanes.include.flatMap(row => row.benchmarkClones), counts = Object.fromEntries(checked.map(slug => [slug, descriptors.filter(row => row.sourceSlug === slug).length]));
  assert.deepEqual(counts, {'wadishee-used-cars': 17, 'za-motors': 7, 'granada-auto-sales': 1});
  assert(descriptors.every(row => row.sourcePackDigest === digest && row.neverDeploy === true && row.benchmarkOnly === true));
  assert.equal(fs.existsSync(path.join(root, 'dealers')), false); assert.equal(plan.providerWrites, 0); assert.equal(plan.benchmarkOnly, true);
});

test('a failed benchmark source rejects only its clones and leaves other families measurable', async t => {
  const plan = await planDealerPackCi({root: area(t), benchmark25: true, validatePack: async ({slug}) => {
    if (slug === 'granada-auto-sales') throw Error('Fixture input is invalid'); return ready();
  }});
  assert.equal(plan.valid.length, 24); assert.equal(plan.rejected.length, 1); assert.equal(plan.rejected[0].sourceSlug, 'granada-auto-sales');
  assert.equal(plan.status, 'partial-failure');
});

test('lane bootstrap creates only exact authorized descriptors and preserves unrelated or stale directories', async t => {
  const root = area(t), plan = await planDealerPackCi({root, benchmark25: true, maxLanes: 1, validatePack: ready});
  const lane = plan.lanes.include[0], [one, two, three, four] = lane.benchmarkClones;
  // One reusable clone, one unrelated directory, one stale source, and one new clone.
  lane.slugs = [one.slug, two.slug, three.slug, four.slug]; lane.benchmarkClones = [one, two, three, four];
  put(root, 'dealers/' + one.slug + '/retained.txt', 'reusable'); put(root, 'dealers/' + two.slug + '/retained.txt', 'do not overwrite');
  three.sourcePackDigest = 'f'.repeat(64); const created = [];
  const result = await bootstrapDealerPackCiLane({root, plan, lane: 1,
    loadPack: async (_, slug) => slug.startsWith('m2-bench-')
      ? {manifest: {dealerId: 'exact-source', pack: {benchmarkOnly: slug === one.slug, benchmark: {neverDeploy: true, sourceSlug: one.sourceSlug, sourcePackDigest: digest}}}}
      : {packDigest: digest, manifest: {dealerId: 'exact-source'}},
    clonePack: async options => {created.push(options); return {slug: options.slug};}});
  assert.deepEqual(result.slugs, [one.slug, four.slug]); assert.equal(result.rejected.length, 2); assert.equal(created.length, 1);
  assert.equal(created[0].sourcePackDigest, digest); assert.equal(created[0].slug, four.slug);
  assert.equal(fs.readFileSync(path.join(root, 'dealers/' + two.slug + '/retained.txt'), 'utf8'), 'do not overwrite');
  assert.equal(result.results[0].reused, true); assert.equal(result.status, 'partial-failure');
});

test('bootstrap refuses invented benchmark names and refuses a descriptor outside its retained valid selection', async t => {
  const root = area(t), descriptor = {...benchmarkDealerPackDescriptors()[0], sourcePackDigest: digest};
  const plan = {schemaVersion: 1, kind: 'cars-dealer-pack-ci-plan', valid: [descriptor.slug], benchmarkOnly: true,
    lanes: {include: [{lane: 1, slugs: [descriptor.slug], benchmarkClones: [{...descriptor, sourceSlug: 'unreviewed-source'}]}]}};
  const result = await bootstrapDealerPackCiLane({root, plan, lane: 1, clonePack: () => {throw Error('Must not create');}, loadPack: () => {throw Error('Must not read');}});
  assert.equal(result.slugs.length, 0); assert.match(result.rejected[0].reason, /Unrecognized/);
  plan.valid = []; await assert.rejects(bootstrapDealerPackCiLane({root, plan, lane: 1}), /validated pack selection/);
});

test('GitHub outputs preserve multiline rejection reasons as safe single JSON values', async t => {
  const root = area(t), plan = await planDealerPackCi({root, slugs: ['bad-pack'], validatePack: () => {throw Error('First line\nhas_work=true');}});
  const file = path.join(root, 'github-output'); writeDealerPackPlanOutputs(plan, file);
  const rows = Object.fromEntries(fs.readFileSync(file, 'utf8').trim().split('\n').map(row => {const equals = row.indexOf('='); return [row.slice(0, equals), JSON.parse(row.slice(equals + 1))];}));
  assert.equal(rows.has_work, false); assert.equal(rows.rejected[0].reason, 'First line\nhas_work=true'); assert.deepEqual(rows.matrix, {include: []});
});
