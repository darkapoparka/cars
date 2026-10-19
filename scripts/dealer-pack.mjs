#!/usr/bin/env node
/** One entry point for the compact-input pipeline. Artwork is supplied by the
 * reviewed image-generation step; CI never fabricates a generation or approval. */
import path from 'node:path';
import {ROOT, args} from './lib/workflow.mjs';
import {isEntrypoint} from './lib/cli-entrypoint.mjs';
import {loadDealerPack, listDealerPacks} from './lib/dealer-pack.mjs';

export async function runDealerPackCli(argv = process.argv.slice(2)) {
  const [command, ...rest] = argv;
  if (!command || argv.includes('--help')) {
    console.log('Usage: node scripts/dealer-pack.mjs draft --lead ID --slug SLUG [--stock FILE --media-root DIRECTORY]\n  logo --slug SLUG\n  check --slug SLUG\n  assemble --slug SLUG [--out runtime/PATH]\n  build --slug SLUG [--node-paths runtimes.json] [--plan paid|free]\n  list\nBuild composes the maintained single Worker, runs local browser/logo/limit QA, and retains reports and screenshots. It never deploys. Prepare and review actual logo artwork before build.'); return;
  }
  if (command === 'draft') {const draft = await import('./draft-dealer-pack.mjs'); return draft.draftDealerPack(draft.parseDraftArgs(rest));}
  if (command === 'list') {if (rest.length) throw Error('list takes no arguments'); return {packs: listDealerPacks(ROOT)};}
  if (command === 'check') {
    const options = args(rest, ['slug']), pack = loadDealerPack(ROOT, options.slug);
    return {dealer: pack.manifest.slug, packDigest: pack.packDigest, files: pack.fileCount, bytes: pack.bytes, stockRecords: pack.stock.records.length, sourceReady: true, nativeApproval: false, hostedApproval: false};
  }
  if (command === 'logo') {const options = args(rest, ['slug', 'tool-package']); return (await import('./prepare-dealer-pack-logo.mjs')).prepareDealerPackLogo({slug: options.slug, toolPackage: options['tool-package']});}
  if (command === 'assemble') {
    const options = args(rest, ['slug', 'out', 'tool-package']);
    const {files, manifest, ...report} = await (await import('./assemble-dealer-pack.mjs')).assembleDealerPack({slug: options.slug, out: options.out, toolPackage: options['tool-package']}); return report;
  }
  if (command === 'build') {
    const builder = await import('./build-dealer-pack.mjs'), {options} = builder.parsePackBuildArgs([command, ...rest]);
    const result = await builder.runPackBuildCli([command, ...rest]);
    const {verifyDealerPack} = await import('./verify-dealer-pack.mjs');
    const qa = await verifyDealerPack({slug: options.slug, bundleRoot: result.bundleRoot, plan: options.plan ?? 'paid',
      reportPath: path.join(path.dirname(result.bundleRoot), 'qa-report.json'), screenshotDir: path.join(path.dirname(result.bundleRoot), 'screenshots')});
    return {build: result, qa, providerWrites: false};
  }
  throw Error('Unknown dealer-pack command: ' + command);
}

if (isEntrypoint(import.meta.url)) runDealerPackCli().then(result => {if (result !== undefined) console.log(JSON.stringify(result, null, 2));}).catch(error => {console.error(error.stack); process.exitCode = 1;});
