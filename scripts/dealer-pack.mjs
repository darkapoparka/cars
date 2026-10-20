#!/usr/bin/env node
/** One entry point for the compact-input pipeline. Public original or generated
 * artwork is reviewed before CI; no generation or approval is fabricated. */
import path from 'node:path';
import {ROOT, args} from './lib/workflow.mjs';
import {isEntrypoint} from './lib/cli-entrypoint.mjs';
import {listDealerPacks} from './lib/dealer-pack.mjs';

export async function buildAndVerifyDealerPack({options, argv, runBuild, verify}) {
  const result = await runBuild(argv);
  const reportPath = path.join(path.dirname(result.bundleRoot), 'qa-report.json');
  const qa = await verify({slug: options.slug, bundleRoot: result.bundleRoot, plan: options.plan ?? 'paid',
    reportPath, screenshotDir: path.join(path.dirname(result.bundleRoot), 'screenshots')});
  if (qa.success !== true) throw Error('Dealer-pack QA failed; retained report: ' + reportPath);
  return {build: result, qa, providerWrites: false};
}

export async function runDealerPackCli(argv = process.argv.slice(2)) {
  const [command, ...rest] = argv;
  if (!command || argv.includes('--help')) {
    console.log('Usage: node scripts/dealer-pack.mjs draft --lead ID --slug SLUG [--batch N] [--stock FILE --media-root DIRECTORY]\n  logo --slug SLUG\n  review --slug SLUG [--batch N]\n  check --slug SLUG [--batch N]\n  migrate --slug SLUG|--batch N [--write]\n  assemble --slug SLUG [--out runtime/PATH]\n  build --slug SLUG [--node-paths runtimes.json] [--plan paid|free]\n  fast-build --slug SLUG --out runtime/PATH --node-paths runtimes.json\n  fast-batch --slugs LIST --out runtime/PATH --node-paths runtimes.json\n  list\nBuilds and migrations never deploy. V2 stores original artwork and a deterministic export recipe; review records automated input checks only, never human/dealer approval.'); return;
  }
  if (command === 'draft') {const draft = await import('./draft-dealer-pack.mjs'); return draft.draftDealerPack(draft.parseDraftArgs(rest));}
  if (command === 'list') {if (rest.length) throw Error('list takes no arguments'); const packs = listDealerPacks(ROOT); return {packs, diagnostics: packs.flatMap(row => row.diagnostics ?? [])};}
  if (command === 'migrate') {
    const migrate = await import('./migrate-dealer-pack.mjs'), options = migrate.parseMigrationArgs(rest);
    return options.slug ? migrate.migrateDealerPack(options) : migrate.migrateDealerPackBatch(options);
  }
  if (command === 'review') {
    const options = args(rest, ['slug', 'batch', 'tool-package']);
    return (await import('./review-dealer-pack.mjs')).reviewDealerPack({slug: options.slug, batch: options.batch, toolPackage: options['tool-package']});
  }
  if (command === 'fast-build' || command === 'fast-batch') return (await import('./build-dealer-pack-fast.mjs')).runFastBuildCli([command === 'fast-batch' ? 'batch' : 'build', ...rest]);
  if (command === 'check') {
    const options = args(rest, ['slug', 'batch', 'tool-package']), pack = await (await import('./prepare-dealer-pack-logo.mjs')).loadPreparedDealerPack(ROOT, options.slug, {batch: options.batch, toolPackage: options['tool-package']});
    return {dealer: pack.manifest.slug, packDigest: pack.packDigest, files: pack.fileCount, bytes: pack.bytes, stockRecords: pack.stock.records.length,
      releaseId: pack.release.releaseId, batch: pack.batch, sourceReady: true, inputReview: pack.manifest.pack?.schemaVersion === 2 ? 'automated' : 'retained-M1', humanReview: false, nativeApproval: false, hostedApproval: false};
  }
  if (command === 'logo') {const options = args(rest, ['slug', 'tool-package']); return (await import('./prepare-dealer-pack-logo.mjs')).prepareDealerPackLogo({slug: options.slug, toolPackage: options['tool-package']});}
  if (command === 'assemble') {
    const options = args(rest, ['slug', 'out', 'tool-package']);
    const {files, manifest, ...report} = await (await import('./assemble-dealer-pack.mjs')).assembleDealerPack({slug: options.slug, out: options.out, toolPackage: options['tool-package']}); return report;
  }
  if (command === 'build') {
    const builder = await import('./build-dealer-pack.mjs'), {options} = builder.parsePackBuildArgs([command, ...rest]);
    const {verifyDealerPack} = await import('./verify-dealer-pack.mjs');
    return buildAndVerifyDealerPack({options, argv: [command, ...rest], runBuild: builder.runPackBuildCli, verify: verifyDealerPack});
  }
  throw Error('Unknown dealer-pack command: ' + command);
}

if (isEntrypoint(import.meta.url)) runDealerPackCli().then(result => {
  if (result !== undefined) console.log(JSON.stringify(result, null, 2));
  if (result?.success === false || ['partial-failure', 'failed'].includes(result?.status)) process.exitCode = 1;
}).catch(error => {console.error(error.stack); process.exitCode = 1;});
