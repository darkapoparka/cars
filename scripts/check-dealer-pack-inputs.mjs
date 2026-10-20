#!/usr/bin/env node
/** Reproduce reviewed logo exports and bind compact inputs to one retained lead. */
import fs from 'node:fs';
import path from 'node:path';
import {ROOT, args, inside, writeJson, sha256} from './lib/workflow.mjs';
import {isEntrypoint} from './lib/cli-entrypoint.mjs';
import {validPackSlug} from './lib/dealer-pack.mjs';
import {readExpansionLead} from './draft-dealer-pack.mjs';
import {prepareDealerPackLogo, loadPreparedDealerPack} from './prepare-dealer-pack-logo.mjs';

const assert = (value, message) => {if (!value) throw Error(message);};
const nameKey = value => String(value ?? '').normalize('NFKD').replace(/\p{M}/gu, '').toLowerCase().replace(/&/g, 'and').replace(/[^\p{L}\p{N}]/gu, '');

export async function checkDealerPackInputs({root = ROOT, slug,
  toolPackage = path.join(root, 'runtime/dealer-pack-tools/package.json'),
  batch, allowBenchmark = false, loadPack = loadPreparedDealerPack, readLead = readExpansionLead, prepareLogo = prepareDealerPackLogo} = {}) {
  assert(validPackSlug(slug), 'Use an exact compact dealer-pack slug');
  const report = {schemaVersion: 1, kind: 'cars-dealer-pack-input-check', dealer: slug,
    success: false, startedAt: new Date().toISOString(), providerWrites: 0,
    liveResearchPerformed: false, imageGenerationPerformed: false,
    method: 'Verify retained lead identity and the committed input digest; reproduce reviewed logo exports in memory and compare exact bytes without writing source exports.'};
  const runtime = inside(root, 'runtime/dealer-pack-input-checks');
  fs.mkdirSync(runtime, {recursive: true});
  try {
    const pack = await loadPack(root, slug, {toolPackage, batch, allowBenchmark}), {lead, source} = readLead(root, pack.manifest.dealerId);
    assert(lead.id === pack.manifest.dealerId && lead.country === pack.facts.business.countryCode &&
      nameKey(lead.name) && nameKey(lead.name) === nameKey(pack.facts.business.name),
    'Pack business identity differs from its exact retained expansion lead');
    report.lead = {id: lead.id, country: lead.country, source};
    report.packDigest = pack.packDigest;
    report.releaseId = pack.release?.releaseId ?? null;
    report.sourceFiles = pack.fileCount ?? pack.files.size; report.sourceBytes = pack.bytes ?? [...pack.files.values()].reduce((sum, bytes) => sum + bytes.length, 0);
    report.batch = pack.batch ?? null; report.benchmarkOnly = pack.manifest.pack?.benchmarkOnly === true;
    report.stock = {kind: pack.stock.kind, records: pack.stock.records.length,
      acquisition: pack.stock.kind === 'illustrative-not-dealer-stock' ? 'disclosed-retained-template-examples' : 'reviewed-dated-public-snapshot'};
    const before = [...pack.files].map(([name, bytes]) => [name, sha256(bytes)]);
    if (pack.logoRecipe && pack.logoRegeneration?.verified === true) {
      assert(pack.logoRecipe.outputs.every(row => pack.files.has(row.path) && sha256(pack.files.get(row.path)) === row.sha256), 'Hydrated logo output differs from its exact reviewed recipe');
      report.logo = {status: 'passed', identityStatus: pack.branding.status, deterministic: true, comparedPackFiles: pack.fileCount,
        regeneratedExports: pack.logoRecipe.outputs.length, committedInputDigestPreserved: true};
    } else {
      const logo = await prepareLogo({root, slug, toolPackage: path.resolve(toolPackage), persist: false, sourceFiles: pack.files});
      assert(logo.generatedFiles instanceof Map && logo.generatedFiles.size > 0 && [...logo.generatedFiles].every(([name, bytes]) => pack.files.get(name)?.equals(bytes)),
        'Reviewed logo exports are stale or non-deterministic; run dealer-pack logo and review the changed inputs');
      report.logo = {status: 'passed', identityStatus: logo.status, deterministic: true, comparedPackFiles: pack.files.size,
        regeneratedExports: logo.generatedFiles.size, committedInputDigestPreserved: true};
    }
    assert(JSON.stringify(before) === JSON.stringify([...pack.files].map(([name, bytes]) => [name, sha256(bytes)])), 'In-memory input check modified source bytes');
    report.success = true;
    return report;
  } catch (error) {
    report.error = error.message;
    throw error;
  } finally {
    report.finishedAt = new Date().toISOString();
    report.elapsedMs = Date.parse(report.finishedAt) - Date.parse(report.startedAt);
    writeJson(path.join(runtime, slug + '.json'), report);
  }
}

if (isEntrypoint(import.meta.url)) {
  const options = args(process.argv.slice(2), ['slug', 'tool-package', 'batch']);
  checkDealerPackInputs({slug: options.slug, batch: options.batch, toolPackage: options['tool-package']})
    .then(report => console.log(JSON.stringify(report, null, 2)))
    .catch(error => {console.error(error.message); process.exitCode = 1;});
}
