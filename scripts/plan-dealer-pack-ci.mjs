#!/usr/bin/env node
/** Select independent ready packs; a rejected dealer never prevents other lanes from running. */
import fs from 'node:fs';
import path from 'node:path';
import {ROOT, git, inside, writeJson} from './lib/workflow.mjs';
import {isEntrypoint} from './lib/cli-entrypoint.mjs';
import {validPackSlug, listDealerPacks} from './lib/dealer-pack.mjs';
import {readPackBatchAssignments} from './lib/dealer-pack-identity.mjs';
import {checkDealerPackInputs} from './check-dealer-pack-inputs.mjs';
import {cloneBenchmarkDealerPack} from './migrate-dealer-pack.mjs';
import {loadPreparedDealerPack} from './prepare-dealer-pack-logo.mjs';

const assert = (ok, message) => {if (!ok) throw Error(message);};
const hex40 = value => typeof value === 'string' && /^[a-f0-9]{40}$/.test(value);
const hex64 = value => typeof value === 'string' && /^[a-f0-9]{64}$/.test(value);
const benchmarkMix = Object.freeze([{sourceSlug: 'za-motors', count: 7}, {sourceSlug: 'granada-auto-sales', count: 1}, {sourceSlug: 'wadishee-used-cars', count: 17}]);
export const PACK_CI_MAX_LANES = 14;
export const PACK_CI_BENCHMARK_LANES = 7;

export function parsePlanSlugs(value) {
  const rows = Array.isArray(value) ? value : typeof value === 'string' && value.trim().startsWith('[') ? JSON.parse(value) : String(value ?? '').split(/[\s,]+/).filter(Boolean);
  assert(Array.isArray(rows) && rows.length >= 1 && rows.length <= 100 && rows.every(row => typeof row === 'string'), 'Explicit planning requires one to 100 slug strings');
  assert(new Set(rows).size === rows.length, 'An explicit dealer-pack request contains duplicate slugs');
  return rows;
}

export function changedDealerPackSlugs({root = ROOT, base, head, readGit = git} = {}) {
  assert(hex40(base) && hex40(head), 'PR planning requires exact base and head commit SHAs');
  const changed = readGit(root, ['diff', '--name-only', '-z', base + '..' + head, '--', 'dealers/']).split('\0').filter(Boolean);
  return [...new Set(changed.flatMap(file => {
    const match = /^dealers\/([^/]+)\//.exec(file);
    if (!match || !validPackSlug(match[1])) return [];
    const manifest = path.join(root, 'dealers', match[1], 'dealer.json');
    return fs.existsSync(manifest) && fs.lstatSync(manifest).isFile() ? [match[1]] : [];
  }))].sort((a, b) => a.localeCompare(b, 'en'));
}

/** Weighted interleaving avoids putting all seven UK prototypes into the first lanes. */
export function benchmarkDealerPackDescriptors() {
  const used = new Map(benchmarkMix.map(row => [row.sourceSlug, 0])), rows = [];
  for (let index = 0; index < 25; index++) {
    const selected = benchmarkMix.filter(row => used.get(row.sourceSlug) < row.count)
      .sort((a, b) => ((index + 1) * b.count / 25 - used.get(b.sourceSlug)) - ((index + 1) * a.count / 25 - used.get(a.sourceSlug)))[0];
    used.set(selected.sourceSlug, used.get(selected.sourceSlug) + 1);
    rows.push({slug: 'm2-bench-' + String(index + 1).padStart(2, '0') + '-' + selected.sourceSlug, sourceSlug: selected.sourceSlug,
      benchmarkOnly: true, neverDeploy: true});
  }
  return rows;
}

export function distributeDealerPackLanes(valid, {maxLanes = PACK_CI_MAX_LANES, benchmarkClones = []} = {}) {
  assert(Number.isInteger(maxLanes) && maxLanes >= 1 && maxLanes <= PACK_CI_MAX_LANES, 'Use one to ' + PACK_CI_MAX_LANES + ' CI dealer lanes');
  const include = Array.from({length: Math.min(maxLanes, valid.length)}, (_, index) => ({lane: index + 1, slugs: [], benchmarkClones: []}));
  const descriptors = new Map(benchmarkClones.map(row => [row.slug, row]));
  valid.forEach((slug, index) => {const lane = include[index % include.length]; lane.slugs.push(slug); if (descriptors.has(slug)) lane.benchmarkClones.push(descriptors.get(slug));});
  return {include};
}

export async function planDealerPackCi({root = ROOT, base, head, slugs, batch, benchmark25 = false,
  maxLanes = benchmark25 ? PACK_CI_BENCHMARK_LANES : PACK_CI_MAX_LANES,
  toolPackage, validatePack = checkDealerPackInputs, readGit = git, now = new Date().toISOString()} = {}) {
  const modes = [slugs !== undefined, batch !== undefined, benchmark25, base !== undefined || head !== undefined].filter(Boolean).length;
  assert(modes === 1, 'Choose exactly one planning source: explicit slugs, one assigned batch, benchmark25, or PR base/head');
  assert(Number.isInteger(maxLanes) && maxLanes >= 1 && maxLanes <= PACK_CI_MAX_LANES, 'Use one to ' + PACK_CI_MAX_LANES + ' CI dealer lanes');
  const rejected = [], checked = new Map(); let requested, descriptors = [];
  if (benchmark25) {descriptors = benchmarkDealerPackDescriptors(); requested = descriptors.map(row => row.slug);}
  else if (slugs !== undefined) requested = parsePlanSlugs(slugs);
  else if (batch !== undefined) {
    assert(/^[1-4]$/.test(String(batch)), 'Use an exact assigned batch from 1 to 4');
    const assignments = readPackBatchAssignments(root), ids = assignments.batches.find(row => row.number === Number(batch)).leadIds;
    const packs = listDealerPacks(root); requested = [];
    for (const dealerId of ids) {
      const matches = packs.filter(row => row.dealerId === dealerId && row.benchmarkOnly !== true);
      if (matches.length === 1) requested.push(matches[0].slug);
      else rejected.push({slug: matches[0]?.slug ?? dealerId, dealerId, reason: matches.length ? 'More than one pack claims the assigned research identity' : 'No input pack exists for this assigned research identity'});
    }
    for (const row of packs.filter(row => !row.valid && !row.dealerId)) rejected.push({slug: row.slug, reason: row.diagnostics.map(value => value.reason).join('; ')});
  } else requested = changedDealerPackSlugs({root, base, head, readGit});
  assert(requested.length <= 400, 'PR planning exceeds the bounded 400-pack scope');
  const toCheck = benchmark25 ? [...new Set(descriptors.map(row => row.sourceSlug))] : requested;
  for (const slug of toCheck) {
    if (!validPackSlug(slug)) {checked.set(slug, {success: false, reason: 'Invalid or oversized canonical slug; run the mechanical migration first'}); continue;}
    try {
      const result = await validatePack({root, slug, batch, toolPackage});
      assert(result?.success === true && hex64(result.packDigest) && /^cars-six-[a-f0-9]{64}$/.test(result.releaseId ?? ''), 'Input check did not return a successful exact pack/release binding');
      checked.set(slug, {success: true, result});
    } catch (error) {checked.set(slug, {success: false, reason: error.message});}
  }
  const valid = [], packs = [];
  for (const slug of requested) {
    const descriptor = descriptors.find(row => row.slug === slug), value = checked.get(descriptor?.sourceSlug ?? slug);
    if (!value?.success) {rejected.push({slug, ...(descriptor ? {sourceSlug: descriptor.sourceSlug} : {}), reason: value?.reason ?? 'Input validation did not complete'}); continue;}
    valid.push(slug); packs.push({slug, packDigest: value.result.packDigest, releaseId: value.result.releaseId,
      ...(descriptor ? {sourceSlug: descriptor.sourceSlug, benchmarkOnly: true, sourcePackDigest: value.result.packDigest} : {})});
  }
  descriptors = descriptors.filter(row => valid.includes(row.slug)).map(row => ({...row, sourcePackDigest: checked.get(row.sourceSlug).result.packDigest}));
  return {schemaVersion: 1, kind: 'cars-dealer-pack-ci-plan', createdAt: now, source: benchmark25 ? 'benchmark25' : slugs !== undefined ? 'explicit' : batch !== undefined ? 'batch-' + batch : 'pr-changed-packs',
    ...(base ? {base, head} : {}), requested, valid, rejected, packs, lanes: distributeDealerPackLanes(valid, {maxLanes, benchmarkClones: descriptors}),
    releaseIds: [...new Set(packs.map(row => row.releaseId))], hasWork: valid.length > 0, hasRejections: rejected.length > 0,
    status: rejected.length ? valid.length ? 'partial-failure' : 'failed' : valid.length ? 'ready' : 'skipped',
    benchmarkOnly: benchmark25, providerWrites: 0, sourceWrites: 0};
}

/** Bootstrap creates only descriptors authenticated against the fixed benchmark set and exact source digest. */
export async function bootstrapDealerPackCiLane({root = ROOT, plan, lane, toolPackage,
  clonePack = cloneBenchmarkDealerPack, loadPack = loadPreparedDealerPack} = {}) {
  assert(plan?.schemaVersion === 1 && plan.kind === 'cars-dealer-pack-ci-plan' && Array.isArray(plan.lanes?.include), 'Use an actual retained dealer-pack CI plan');
  const selected = plan.lanes.include.find(row => row.lane === Number(lane));
  assert(selected && Number.isInteger(selected.lane) && selected.lane >= 1 && selected.lane <= PACK_CI_MAX_LANES && Array.isArray(selected.slugs) &&
    selected.slugs.length > 0 && selected.slugs.length <= 100 && new Set(selected.slugs).size === selected.slugs.length && selected.slugs.every(validPackSlug), 'Use one exact bounded lane from the retained plan');
  assert(Array.isArray(plan.valid) && selected.slugs.every(slug => plan.valid.includes(slug)), 'Lane requests differ from the validated pack selection');
  const expected = new Map(benchmarkDealerPackDescriptors().map(row => [row.slug, row.sourceSlug])), descriptors = selected.benchmarkClones ?? [];
  assert(Array.isArray(descriptors) && new Set(descriptors.map(row => row.slug)).size === descriptors.length && descriptors.every(row => selected.slugs.includes(row.slug)), 'Benchmark descriptors do not match their planned lane');
  assert(plan.benchmarkOnly ? descriptors.length === selected.slugs.length : descriptors.length === 0, 'Benchmark scope differs from the retained plan');
  const results = [], slugs = [], rejected = [];
  for (const slug of selected.slugs) {
    const descriptor = descriptors.find(row => row.slug === slug);
    if (!descriptor) {slugs.push(slug); results.push({slug, status: 'existing-source', created: false}); continue;}
    try {
      assert(descriptor.benchmarkOnly === true && descriptor.neverDeploy === true && expected.get(slug) === descriptor.sourceSlug && hex64(descriptor.sourcePackDigest), 'Unrecognized or unbound benchmark descriptor');
      const source = await loadPack(root, descriptor.sourceSlug, {toolPackage});
      assert(source.packDigest === descriptor.sourcePackDigest, 'Benchmark source changed after planning');
      const directory = path.join(root, 'dealers', slug); let value;
      if (fs.existsSync(directory)) {
        const existing = await loadPack(root, slug, {toolPackage, allowBenchmark: true});
        assert(existing.manifest.pack?.benchmarkOnly === true && existing.manifest.pack.benchmark?.neverDeploy === true &&
          existing.manifest.pack.benchmark.sourceSlug === descriptor.sourceSlug && existing.manifest.pack.benchmark.sourcePackDigest === descriptor.sourcePackDigest &&
          existing.manifest.dealerId === source.manifest.dealerId, 'An existing benchmark directory differs; preserve it and refuse the lane entry');
        value = {slug, reused: true, created: false};
      } else value = {...await clonePack({root, sourceSlug: descriptor.sourceSlug, sourcePackDigest: descriptor.sourcePackDigest, slug, toolPackage}), created: true};
      slugs.push(slug); results.push({...value, status: 'ready', benchmarkOnly: true, neverDeploy: true});
    } catch (error) {rejected.push({slug, reason: error.message}); results.push({slug, status: 'failed', reason: error.message});}
  }
  return {schemaVersion: 1, kind: 'cars-dealer-pack-ci-lane-bootstrap', lane: selected.lane, slugs, rejected, results, benchmarkOnly: plan.benchmarkOnly === true,
    status: rejected.length ? slugs.length ? 'partial-failure' : 'failed' : 'ready', hasWork: slugs.length > 0, providerWrites: 0};
}

export function writeDealerPackPlanOutputs(value, file) {
  assert(typeof file === 'string' && file.length > 0, 'GITHUB_OUTPUT path is required');
  const rows = value.kind === 'cars-dealer-pack-ci-plan'
    ? {requested: value.requested, valid: value.valid, rejected: value.rejected, matrix: value.lanes, lanes: value.lanes, release_ids: value.releaseIds, has_work: value.hasWork, has_rejections: value.hasRejections, benchmark_only: value.benchmarkOnly}
    : {slugs: value.slugs, rejected: value.rejected, has_work: value.hasWork, benchmark_only: value.benchmarkOnly};
  fs.appendFileSync(file, Object.entries(rows).map(([key, item]) => key + '=' + JSON.stringify(item) + '\n').join(''));
}

export async function runDealerPackPlanCli(argv = process.argv.slice(2)) {
  if (argv.includes('--help')) {console.log('Usage: plan-dealer-pack-ci.mjs plan --base SHA --head SHA | --slugs CSV_OR_JSON | --batch N | --benchmark25 [--max-lanes 1..' + PACK_CI_MAX_LANES + '] [--report runtime/plan.json] [--github-output]\n       plan-dealer-pack-ci.mjs bootstrap --plan runtime/plan.json --lane N [--report runtime/lane.json] [--github-output]\nNormal plans default to ' + PACK_CI_MAX_LANES + ' lanes; benchmark25 defaults to ' + PACK_CI_BENCHMARK_LANES + '. Rejected packs remain reported while valid lanes continue. Planning makes no source packs and never deploys. Benchmark bootstrap creates only its exact temporary, deployment-forbidden descriptors.'); return;}
  const [first, ...remaining] = argv, command = first?.startsWith('--') ? 'plan' : first ?? 'plan', rest = first?.startsWith('--') ? argv : remaining, options = {};
  assert(['plan', 'bootstrap'].includes(command), 'Use plan or bootstrap');
  const valued = new Set(['--base', '--head', '--slugs', '--batch', '--max-lanes', '--tool-package', '--report', '--plan', '--lane']);
  for (let index = 0; index < rest.length; index++) {
    const key = rest[index]; assert(!Object.hasOwn(options, key), 'Repeated planner option: ' + key);
    if (['--benchmark25', '--github-output'].includes(key)) {options[key] = true; continue;}
    assert(valued.has(key) && rest[index + 1] && !rest[index + 1].startsWith('--'), 'Unknown or incomplete planner option: ' + key); options[key] = rest[++index];
  }
  const result = command === 'bootstrap'
    ? await bootstrapDealerPackCiLane({plan: JSON.parse(fs.readFileSync(options['--plan'], 'utf8')), lane: Number(options['--lane']), toolPackage: options['--tool-package']})
    : await planDealerPackCi({base: options['--base'], head: options['--head'], slugs: options['--slugs'], batch: options['--batch'], benchmark25: Boolean(options['--benchmark25']), maxLanes: options['--max-lanes'] === undefined ? undefined : Number(options['--max-lanes']), toolPackage: options['--tool-package']});
  if (options['--report']) {const report = inside(ROOT, path.relative(ROOT, path.resolve(options['--report']))); assert(report.startsWith(path.join(ROOT, 'runtime') + path.sep), 'Write planner reports only under ignored runtime/'); writeJson(report, result);}
  if (options['--github-output']) writeDealerPackPlanOutputs(result, process.env.GITHUB_OUTPUT);
  return result;
}

if (isEntrypoint(import.meta.url)) runDealerPackPlanCli().then(value => {if (value) console.log(JSON.stringify(value, null, 2));}).catch(error => {console.error(error.message); process.exitCode = 1;});
