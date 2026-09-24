import fs from 'node:fs';
import path from 'node:path';
import { planNewClient, assertMainCheckout } from './new-client.mjs';
import { copySource } from './copy-source.mjs';
import { packageDealer } from './package-dealer.mjs';
import { verifyPackage } from './export-dealer.mjs';
import { NATIVE_PACKAGING_VERSION, nativeReleaseReadiness } from './lib/native-localization.mjs';
import { ROOT, POLICY, args, fingerprint, json, writeJson, resolveIdentity } from './lib/workflow.mjs';
import { gitRead } from './workspace-doctor.mjs';
import { verifyTemplate } from './template-release.mjs';
import { materializeTemplateSource } from './lib/template-source.mjs';
import { normalizeDealerLocale, readDealerLocale, planDealerLocale, assertLegacyLocaleCompatible, nativeLocaleSources, LocalePackagingError } from './lib/dealer-locale.mjs';

const independentInputs = ['scripts/create-independent-dealer.mjs', 'scripts/lib/dealer-locale.mjs', 'scripts/package-dealer.mjs',
  'scripts/publishing/mounts.mjs', 'scripts/publishing/preview-paths.ts.txt', 'scripts/publishing/preview-switcher.js', 'scripts/publishing/fix-svelte-service-output.mjs',
  'scripts/lib/catalog-literal.mjs', 'scripts/lib/native-localization.mjs', 'scripts/publishing/native-mounts.mjs', 'scripts/publishing/build-native-service.mjs', 'scripts/publishing/switcher-messages.json', 'scripts/export-dealer.mjs',
  'scripts/new-client.mjs', 'scripts/copy-source.mjs', 'scripts/template-release.mjs', 'scripts/lib/workflow.mjs', 'scripts/lib/template-source.mjs', 'scripts/lib/dealer-guidance.mjs',
  'scripts/workspace-doctor.mjs', 'templates.lock.json', 'catalog.json', 'workspace.json'];

export function assertIndependentWorkflowInputs(root, readGit = gitRead) {
  const changed = readGit(root, ['diff', '--name-only', 'HEAD', '--', ...independentInputs]);
  const untracked = readGit(root, ['ls-files', '--others', '--exclude-standard', '--', ...independentInputs]);
  if (changed || untracked) throw new Error('Commit the reviewed independent generator/packaging inputs before generation: ' + [changed, untracked].filter(Boolean).join(', '));
}


export function independentGuidance(slug, repository) {
  return `# ${slug}: independent dealer source\n\nThis repository (${repository}) is the ONLY editable source for this dealership. Work on main in its registered permanent checkout; do not create session clones, worktrees or other branches. Cars is the tooling/registry repository, not another source copy for this dealer.\n\n## Default changes\nPersonalize approved PNG/WebP logos and icons, factual business copy, contacts, social links, inventory, metadata and existing accent tokens. Do not redesign heroes, banners, typography, spacing, section order, breakpoints or interactions during branding/content tasks. A requested client-specific feature can change code deliberately; record the scope and rerun checks. Shared improvements belong in the template first.\n\n## Sources and safety\nRead dealer.json, business-facts.json, docs/SOURCES.md and HANDOFF.md. Use one fact/asset pack for all three designs. Preserve source currency, unknown facts and the distinction between demo stock and available vehicles. Never copy another dealer's facts, staff, testimonials or credentials. No invented warranties, finance offers or successful form delivery. Do not replace an approved raster logo with text/CSS/SVG. SVG interface icons are allowed.\n\n## Localization release boundaries\nA language field or a visitor country is not proof of complete localization. Enable a language only after catalog, native routing, accessibility and browser tests pass for every offered design. Keep language, visitor country, dealership location and inventory currency separate. Arabic/RTL remains unavailable until translations and RTL acceptance are complete. Never use the legacy default-locale packager to overwrite native localization.\n\n## Verification and publishing\nRun node scripts/check-dealer.mjs, the three application checks/builds, and desktop/mobile browser checks before a release. The guard checks are technical evidence, not complete visual approval. Keep the three design routes and one shared Admin demo link. The Admin is not a production backend. Push main once to the existing Git-linked Vercel project; do not duplicate deployment triggers. Preserve uncommitted work and rollback history. No outreach, paid services, database or real enquiry submission is authorized by a website task.\n`;
}

export function resolveIndependentTarget(parent, slug) {
  if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug)) throw new Error('Invalid dealer slug');
  const physical = fs.realpathSync(parent);
  if (physical.toLowerCase() !== path.resolve(parent).toLowerCase()) throw new Error('Use the physical independent-clients root, not a junction');
  const target = path.join(physical, slug);
  if (fs.existsSync(target)) throw new Error('Existing independent dealer checkout: ' + target);
  return target;
}

export async function createIndependentDealer({ root = ROOT, client, repository, preset = 'standard', dealerId = null, localeConfig = null, write = false, readGit = gitRead, copy = copySource, packageSource = packageDealer }) {
  const requestedLocale = localeConfig === null ? null : normalizeDealerLocale(localeConfig, dealerId || client);
  const config = json(path.join(root, 'workspace.json'));
  const parent = config.independentClientsRoot?.[process.platform];
  if (!parent) throw new Error('Record independentClientsRoot for this machine in workspace.json first');
  const plan = planNewClient({ root, client, repository, preset, dealerId, readGit });
  assertIndependentWorkflowInputs(root, readGit);
  const target = resolveIndependentTarget(parent, client);
  const nativeSources = plan.plans.flatMap(item => nativeLocaleSources(new Map(), item.source).map(file => item.template + '/' + file));
  const nativeReleases = Object.fromEntries(plan.plans.map(item => [item.template, item.release]));
  const readiness = requestedLocale ? nativeReleaseReadiness(plan.manifest.variants, nativeReleases) : null;
  const localization = requestedLocale ? { ...planDealerLocale(requestedLocale, plan.manifest),
    ...(readiness.ready ? { status: 'native-ready-needs-dealer-qa', blockers: [] } : { blockers: readiness.blockers })
  } : { status: nativeSources.length ? 'blocked-native-source' : 'unverified-legacy-defaults', appliedChanges: [], nativeSources };
  const summary = { localization, mode: write ? 'create' : 'dry-run', sourceOwnership: 'independent-repository', repository, target, workflowCommit: plan.checkout.head, templates: plan.plans.map(p => ({ key: p.template, source: p.sourceRef, newerDevelopmentAvailable: p.updateAvailable })) };
  if (!write) return summary;
  if (requestedLocale ? !readiness.ready : nativeSources.length) throw new LocalePackagingError(readiness?.blockers || nativeSources);
  if (!requestedLocale) for (const item of plan.plans) assertLegacyLocaleCompatible({ manifest: plan.manifest, source: item.source });
  const runtime = path.join(parent, '.runtime'); fs.mkdirSync(runtime, { recursive: true });
  const lock = path.join(runtime, 'create-independent.lock');
  fs.mkdirSync(lock);
  fs.writeFileSync(path.join(lock, 'owner.json'), JSON.stringify({ pid: process.pid, client, startedAt: new Date().toISOString() }));
  let stage;
  try {
    stage = fs.mkdtempSync(path.join(runtime, client + '-seed-'));
    const seed = path.join(stage, 'seed'); fs.mkdirSync(seed);
    const language = requestedLocale?.defaultLocale || 'en';
    const manifest = { ...plan.manifest, sourceOwnership: 'independent-repository', language, switcher: { language, accent: '#c40101' },
      ...(requestedLocale ? { localization: requestedLocale, packaging: { ...plan.manifest.packaging, version: NATIVE_PACKAGING_VERSION } } : {}),
      templateRevisions: Object.fromEntries(plan.plans.map(p => [p.template, p.sourceRef.revision])),
      templateSources: Object.fromEntries(plan.plans.map(p => [p.template, p.sourceRef])) };
    writeJson(path.join(seed, 'dealer.json'), manifest);
    for (const item of plan.plans) {
      const dest = path.join(seed, item.template);
      await materializeTemplateSource({ root, key: item.template, release: item.release, source: item.sourceRef, destination: dest, copy });
      if (fingerprint(dest).digest !== item.release.digest) throw new Error('Template copy mismatch: ' + item.template);
    }
    const candidate = path.join(stage, 'ready');
    await packageSource({ source: seed, destination: candidate, manifest, sourceCommit: plan.checkout.head, guidance: independentGuidance(client, repository), ...(requestedLocale ? { nativeReleases } : {}) });
    verifyPackage(candidate);
    const generated = json(path.join(candidate, '.cars-package.json'));
    if (assertMainCheckout(root, { readGit }).head !== plan.checkout.head) throw new Error('Cars main changed during preparation');
    assertIndependentWorkflowInputs(root, readGit);
    for (const item of plan.plans) {
      if (JSON.stringify(verifyTemplate(root, item.template)) !== JSON.stringify(item.release)) throw new Error('Template release changed during preparation: ' + item.template);
      if (fingerprint(path.join(seed, item.template)).digest !== item.release.digest) throw new Error('Prepared template changed during packaging: ' + item.template);
    }
    if (resolveIdentity(root, client, dealerId).exists) throw new Error('Dealer identity appeared during preparation; existing source was preserved');
    const registryPath = path.join(root, 'docs/DEPLOYMENT-INVENTORY.json');
    if (fs.existsSync(registryPath) && json(registryPath).dealers?.some(item => item.repository?.toLowerCase() === repository.toLowerCase())) throw new Error('Publishing repository was registered during preparation; existing source was preserved');
    resolveIndependentTarget(parent, client);
    verifyPackage(candidate);
    writeJson(path.join(candidate, 'docs/workflow/GENERATION.json'), { ...summary, createdAt: new Date().toISOString(), meaning: 'Approved template source and initial mount transformation, not a finished dealer build', packagingVersion: generated.packagingVersion, initialMountedDigest: generated.payloadDigest });
    fs.renameSync(path.join(candidate, '.cars-package.json'), path.join(candidate, 'docs/workflow/INITIAL-PACKAGE.json'));
    fs.renameSync(candidate, target);
    writeJson(path.join(stage, 'creation.json'), summary);
    return { ...summary, state: 'needs-personalization', receipt: path.join(stage, 'creation.json') };
  } catch (error) { if (stage) writeJson(path.join(stage, 'failure.json'), { target, error: error.message }); throw error; }
  finally { fs.renameSync(lock, lock + '.completed-' + process.pid + '-' + Date.now()); }
}

async function main() {
  if (process.argv.includes('--help')) {
    console.log('Usage: node scripts/create-independent-dealer.mjs --client SLUG --repository OWNER/REPO [--preset standard|import] [--dealer-id ID] [--locale-config FILE] [--write] (native generation requires exact reviewed EN/BG releases for all selected designs)');
    return;
  }
  const options = args(process.argv.slice(2), ['client', 'repository', 'preset', 'dealer-id', 'locale-config'], ['write']);
  const result = await createIndependentDealer({ client: options.client, repository: options.repository, preset: options.preset, dealerId: options['dealer-id'], localeConfig: options['locale-config'] ? readDealerLocale(path.resolve(options['locale-config']), options['dealer-id'] || options.client) : null, write: Boolean(options.write) });
  console.log(JSON.stringify(result, null, 2));
  if (result.localization.status.startsWith('blocked')) process.exitCode = 2;
}
if (process.argv[1] && path.resolve(process.argv[1]) === import.meta.filename) {
  main().catch(error => { console.error(error.message); process.exitCode = 1; });
}
