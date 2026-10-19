#!/usr/bin/env node
/** Reproduce reviewed logo exports and bind compact inputs to one retained lead. */
import fs from 'node:fs';
import path from 'node:path';
import {ROOT, args, inside, writeJson} from './lib/workflow.mjs';
import {isEntrypoint} from './lib/cli-entrypoint.mjs';
import {loadDealerPack, readPackFiles, validPackSlug} from './lib/dealer-pack.mjs';
import {readExpansionLead} from './draft-dealer-pack.mjs';
import {prepareDealerPackLogo} from './prepare-dealer-pack-logo.mjs';

const assert = (value, message) => {if (!value) throw Error(message);};
const nameKey = value => String(value ?? '').normalize('NFKD').replace(/\p{M}/gu, '').toLowerCase().replace(/&/g, 'and').replace(/[^\p{L}\p{N}]/gu, '');

export async function checkDealerPackInputs({root = ROOT, slug,
  toolPackage = path.join(root, 'runtime/dealer-pack-tools/package.json'),
  loadPack = loadDealerPack, readLead = readExpansionLead, prepareLogo = prepareDealerPackLogo} = {}) {
  assert(validPackSlug(slug), 'Use an exact compact dealer-pack slug');
  const report = {schemaVersion: 1, kind: 'cars-dealer-pack-input-check', dealer: slug,
    success: false, startedAt: new Date().toISOString(), providerWrites: 0,
    liveResearchPerformed: false, imageGenerationPerformed: false,
    method: 'Verify retained lead identity, then reproduce reviewed logo exports in an isolated directory and compare every pack byte.'};
  const runtime = inside(root, 'runtime/dealer-pack-input-checks');
  fs.mkdirSync(runtime, {recursive: true});
  let temporary;
  try {
    const pack = await loadPack(root, slug), {lead, source} = readLead(root, pack.manifest.dealerId);
    assert(lead.id === pack.manifest.dealerId && lead.country === pack.facts.business.countryCode &&
      nameKey(lead.name) && nameKey(lead.name) === nameKey(pack.facts.business.name),
    'Pack business identity differs from its exact retained expansion lead');
    report.lead = {id: lead.id, country: lead.country, source};
    report.packDigest = pack.packDigest;
    report.stock = {kind: pack.stock.kind, records: pack.stock.records.length,
      acquisition: pack.stock.kind === 'illustrative-not-dealer-stock' ? 'disclosed-retained-template-examples' : 'reviewed-dated-public-snapshot'};
    temporary = fs.mkdtempSync(path.join(runtime, '.reproduce-'));
    const destination = inside(temporary, 'dealers/' + slug);
    fs.mkdirSync(destination, {recursive: true});
    for (const [name, bytes] of pack.files) {
      const file = inside(destination, name);
      fs.mkdirSync(path.dirname(file), {recursive: true});
      fs.writeFileSync(file, bytes, {flag: 'wx'});
    }
    const logo = await prepareLogo({root: temporary, slug, toolPackage: path.resolve(toolPackage)});
    const reproduced = readPackFiles(destination);
    assert(reproduced.size === pack.files.size && [...pack.files].every(([name, bytes]) => reproduced.get(name)?.equals(bytes)),
      'Reviewed logo exports are stale or non-deterministic; run dealer-pack logo and review the changed inputs');
    report.logo = {status: 'passed', identityStatus: logo.status, deterministic: true, comparedPackFiles: reproduced.size};
    report.success = true;
    return report;
  } catch (error) {
    report.error = error.message;
    throw error;
  } finally {
    if (temporary) fs.rmSync(temporary, {recursive: true, force: true});
    report.finishedAt = new Date().toISOString();
    report.elapsedMs = Date.parse(report.finishedAt) - Date.parse(report.startedAt);
    writeJson(path.join(runtime, slug + '.json'), report);
  }
}

if (isEntrypoint(import.meta.url)) {
  const options = args(process.argv.slice(2), ['slug', 'tool-package']);
  checkDealerPackInputs({slug: options.slug, toolPackage: options['tool-package']})
    .then(report => console.log(JSON.stringify(report, null, 2)))
    .catch(error => {console.error(error.message); process.exitCode = 1;});
}
