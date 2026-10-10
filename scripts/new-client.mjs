import fs from 'node:fs';
import path from 'node:path';
import { copySource } from './copy-source.mjs';
import { verifyTemplate, selectedTemplateSource, templateDevelopmentState } from './template-release.mjs';
import { materializeTemplateSource } from './lib/template-source.mjs';
import { ROOT, POLICY, args, json, inside, fingerprint, resolveIdentity, validateManifest, excluded } from './lib/workflow.mjs';
import { dealerGuidance, variantCommands } from './lib/dealer-guidance.mjs';
import { gitRead, repositoryIdentity } from './workspace-doctor.mjs';
import { normalizeDealerLocale, readDealerLocale } from './lib/dealer-locale.mjs';
import { nativeContract, validateNativeRelease } from './lib/native-localization.mjs';
import { planSixDesignSelection } from './lib/six-design-release.mjs';
import { baseNativeManifest } from './publishing/app-variant.mjs';

// Verify this checkout, not every other repository's unrelated unfinished work.
export function assertMainCheckout(root, { readGit = gitRead, platform = process.platform } = {}) {
  const config = json(path.join(root, 'workspace.json'));
  const declared = config.machinePaths?.[platform];
  if (platform === 'win32' && !declared) throw new Error('Missing canonical Windows checkout in workspace.json; resolve the registered Cars source before creating a dealer.');
  const physical = value => platform === 'win32' ? fs.realpathSync(value).toLowerCase() : fs.realpathSync(value);
  if (declared && physical(declared) !== physical(root)) throw new Error('Use the canonical Cars checkout: ' + declared);
  if (repositoryIdentity(readGit(root, ['config', '--get', 'remote.origin.url'])) !== 'darkapoparka/cars') throw new Error('Wrong Cars origin; use the canonical workspace.');
  if (readGit(root, ['branch', '--show-current']) !== 'main') throw new Error('New dealers must be created on main; do not create a branch or worktree.');
  const head = readGit(root, ['rev-parse', 'HEAD']);
  const remoteHead = readGit(root, ['ls-remote', '--exit-code', 'origin', 'refs/heads/main']).split(/\s+/)[0];
  if (!/^[a-f0-9]{40}$/.test(remoteHead) || head !== remoteHead) throw new Error('Cars main is not synchronized with GitHub. Preserve local work, reconcile/push main, then retry in this same checkout.');
  return { head, remoteHead, checkedAt: new Date().toISOString() };
}

export function planNewClient({ root = ROOT, client, repository, preset = 'standard', templates, dealerId = null, designSet = null, localeConfig = null, readGit = gitRead }) {
  root = fs.realpathSync(root);
  if (!['standard', 'import'].includes(preset)) throw new Error('Use --preset standard or import.');
  if (designSet !== null && designSet !== 'six') throw new Error('Use --design-set six for the explicit six-family release.');
  const six = designSet === 'six';
  if (six && localeConfig === null) throw new Error('Six-design creation requires an explicit --locale-config.');
  if (!six && localeConfig !== null) throw new Error('Use --design-set six for native locale creation; legacy version 1 cannot adopt this contract.');
  if (resolveIdentity(root, client, dealerId).exists) throw new Error('Existing dealer identity: continue its canonical source; do not clone a duplicate.');
  const catalog = json(path.join(root, 'catalog.json'));
  const middle = preset === 'import' ? 'import' : 'modern';
  const legacyVariants = ['auto-best', middle, 'carwow'].map((key, i) => ({ key, base: i ? `/variant-${i + 1}` : '', entry: i ? (key === 'modern' ? '/variant-2/cars' : `/variant-${i + 1}/`) : '/' }));
  const defaultKeys = (six ? planSixDesignSelection(legacyVariants).variants : legacyVariants).map(v => v.key).join(',');
  const keys = (templates || defaultKeys).split(',').map(x => x.trim().toLowerCase()).filter(Boolean);
  const selected = keys.map(key => { const item = catalog.templates.find(t => t.key === key || t.aliases.includes(key)); if (!item) throw new Error('Unknown template: ' + key); return item; });
  const count = six ? 6 : 3;
  if (new Set(selected.map(t => t.key)).size !== count || selected.length !== count) throw new Error(`Select exactly ${six ? 'six' : 'three'} distinct designs.`);
  const manifest = validateManifest({ schemaVersion: 1, slug: client, dealerId, repository, defaultBranch: 'main', variants: selected.map((t, i) => {
    const base = i === 0 ? '' : `/variant-${i + 1}`;
    return { key: t.key, entry: t.key === 'modern' ? `${base}/cars` : `${base}/`, base };
  }), extraAssets: [], packaging: { version: six ? '5' : '1' }, ...(six ? { localization: normalizeDealerLocale(localeConfig, dealerId || client) } : {}) });
  const registryPath = path.join(root, 'docs/DEPLOYMENT-INVENTORY.json');
  const existingRepository = fs.existsSync(registryPath) && json(registryPath).dealers?.find(d => d.repository?.toLowerCase() === manifest.repository.toLowerCase());
  if (existingRepository) throw new Error('Publishing repository already belongs to ' + existingRepository.slug + '; reuse its canonical dealer.');
  const checkout = assertMainCheckout(root, { readGit });
  const inputs = ['templates.lock.json', 'catalog.json', 'workspace.json', 'scripts/new-client.mjs', 'scripts/copy-source.mjs', 'scripts/template-release.mjs', 'scripts/lib/workflow.mjs', 'scripts/lib/template-source.mjs', 'scripts/lib/dealer-guidance.mjs', 'scripts/workspace-doctor.mjs'];
  if (six) inputs.push('scripts/lib/dealer-locale.mjs', 'scripts/lib/native-localization.mjs', 'scripts/lib/five-design-release.mjs', 'scripts/lib/six-design-release.mjs', 'scripts/publishing/app-variant.mjs');
  const changed = readGit(root, ['diff', '--name-only', 'HEAD', '--', ...inputs]);
  if (changed) throw new Error('Commit the reviewed workflow/release inputs before cloning: ' + changed);
  const clientRoot = inside(root, 'clients/' + client);
  if (fs.existsSync(clientRoot)) throw new Error('Client destination is occupied: ' + clientRoot);
  const plans = selected.map(template => {
    const release = verifyTemplate(root, template.key);
    const source = selectedTemplateSource(release);
    const expectedPath = 'templates/' + template.key;
    const carsSource = release.source?.repository === 'darkapoparka/cars' && source.path === expectedPath;
    const standaloneSource = !release.source && release.repository === 'darkapoparka/cars-template-' + template.key;
    if (template.path !== expectedPath || release.snapshotPath !== expectedPath || !(carsSource || standaloneSource)) throw new Error('Template catalog/lock identity mismatch: ' + template.key);
    const dirty = readGit(root, ['diff', '--name-only', 'HEAD', '--', expectedPath]).split('\n').filter(Boolean).filter(p => !excluded(p.slice(expectedPath.length + 1)));
    if (dirty.length && !carsSource) throw new Error('Commit the reviewed template snapshot before cloning: ' + template.key);
    const developmentHead = readGit(root, ['ls-remote', '--exit-code', 'https://github.com/' + source.repository + '.git', 'refs/heads/main']).split(/\s+/)[0];
    if (!/^[a-f0-9]{40}$/.test(developmentHead)) throw new Error('Cannot verify current upstream main: ' + template.key);
    const development = templateDevelopmentState(root, template.key, release, developmentHead, { readGit });
    return { template: template.key, release, sourceRef: source, source: inside(root, expectedPath, { mustExist: true }), destination: path.join(clientRoot, template.key), homes: template.homes, ...development, releasePolicy: 'latest-reviewed-release; newer development is not silently promoted' };
  });
  manifest.templateRevisions = Object.fromEntries(plans.map(p => [p.template, p.sourceRef.revision]));
  manifest.templateSources = Object.fromEntries(plans.map(p => [p.template, p.sourceRef]));
  if (six) {
    const base = baseNativeManifest(manifest);
    nativeContract(base);
    for (const { key } of base.variants) validateNativeRelease(key, plans.find(p => p.template === key).release);
  }
  return { root, client, dealerId, clientRoot, manifest, checkout, plans, state: 'needs-personalization' };
}

function creationGuidance(plan, variant = null) {
  const { client: slug, manifest, checkout, plans } = plan;
  const maintained = manifest.variants.filter(v => Object.hasOwn(variantCommands, v.key));
  let guide = dealerGuidance({ slug, variants: maintained, workflowCommit: checkout.head, variant });
  for (const item of manifest.variants.filter(v => !Object.hasOwn(variantCommands, v.key) && (!variant || variant === v.key))) {
    guide += `\n## ${item.key} source\n\nPublished entry after release: ${item.entry}. Read the retained TEMPLATE.md, package scripts and approved runtime in .template/source-manifest.json before installing or previewing this application. Its exact release is ${plans.find(p => p.template === item.key).sourceRef.revision}.\n`;
  }
  if (manifest.packaging.version === '5') guide += '\nThe explicit locale contract is in localization/contract.json at the dealer root. These are source copies awaiting personalization and reviewed native adoption; no build, hosting or dealer QA receipt is created here.\n';
  return guide;
}

export async function createNewClient(plan, { readGit = gitRead, copy = copySource } = {}) {
  const { root, clientRoot, client, manifest, plans } = plan;
  if (path.resolve(clientRoot) !== inside(root, 'clients/' + client) || manifest.slug !== client) throw new Error('Invalid canonical client plan.');
  validateManifest(manifest);
  if (manifest.packaging.version === '5') nativeContract(baseNativeManifest(manifest));
  if (JSON.stringify(plans.map(p => p.template)) !== JSON.stringify(manifest.variants.map(v => v.key))) throw new Error('Plan variants differ from the dealer manifest.');
  const lockPath = inside(root, 'runtime/locks/new-client');
  fs.mkdirSync(path.dirname(lockPath), { recursive: true });
  try { fs.mkdirSync(lockPath); } catch (error) { if (error.code === 'EEXIST') throw new Error('Another new-client operation owns ' + lockPath + '; inspect its owner before retrying.'); throw error; }
  fs.writeFileSync(path.join(lockPath, 'owner.json'), JSON.stringify({ pid: process.pid, client, startedAt: new Date().toISOString() }));
  let staging;
  try {
    if (assertMainCheckout(root, { readGit }).head !== plan.checkout.head) throw new Error('Cars main advanced after planning; regenerate the plan.');
    if (resolveIdentity(root, client, plan.dealerId).exists) throw new Error('Dealer identity appeared after planning; no copy will be installed.');
    const parent = inside(root, 'runtime/new-clients'); fs.mkdirSync(parent, { recursive: true });
    staging = fs.mkdtempSync(path.join(parent, client + '-'));
    const stagedClient = path.join(staging, 'dealer'); fs.mkdirSync(stagedClient);
    const writeJson = (file, value) => fs.writeFileSync(file, JSON.stringify(value, null, 2) + '\n');
    writeJson(path.join(stagedClient, 'dealer.json'), manifest);
    if (manifest.packaging.version === '5') {
      fs.mkdirSync(path.join(stagedClient, 'localization'));
      writeJson(path.join(stagedClient, 'localization/contract.json'), manifest.localization);
    }
    fs.writeFileSync(path.join(stagedClient, 'AGENTS.md'), creationGuidance(plan));
    for (const item of plans) {
      if (JSON.stringify(verifyTemplate(root, item.template)) !== JSON.stringify(item.release)) throw new Error('Template release changed after planning: ' + item.template);
      const destination = path.join(stagedClient, item.template);
      await materializeTemplateSource({ root, key: item.template, release: item.release, source: item.sourceRef, destination, copy });
      if (fingerprint(destination).digest !== item.release.digest) throw new Error('Copied source differs from the approved release: ' + item.template);
      const copied = json(path.join(destination, '.template/source-manifest.json'));
      copied.destination = item.destination; copied.exportPolicy = POLICY; copied.approvedTemplate = item.release; copied.workflowCommit = plan.checkout.head;
      writeJson(path.join(destination, '.template/source-manifest.json'), copied);
      const metadata = { schemaVersion: 1, client, templateKey: item.template, templateVersion: item.sourceRef.revision, createdAt: new Date().toISOString(), state: 'needs-personalization', selectedHome: item.homes[0].id, availableHomes: item.homes, offeredHomes: [], publicUrl: null, qa: { desktop: false, mobile: false, identity: false, contactPath: false }, crm: { leadId: null, demoProjectId: null, registered: false }, templateSource: { ...item.sourceRef, exportPolicy: POLICY }, packaging: { version: manifest.packaging.version, entry: manifest.variants.find(v => v.key === item.template).entry }, workflowCommit: plan.checkout.head };
      fs.mkdirSync(path.join(destination, '.client'), { recursive: true });
      writeJson(path.join(destination, '.client/project.json'), metadata);
      fs.writeFileSync(path.join(destination, 'AGENTS.md'), creationGuidance(plan, item.template));
    }
    const designs = manifest.variants.length === 6 ? 'six' : 'three';
    fs.writeFileSync(path.join(stagedClient, 'CLIENT.md'), `# ${client}\n\nStatus: needs personalization, not ready for outreach.\n\nUse one sourced fact/inventory/approved raster-logo pack across all ${designs} apps. Preserve template heroes, banners, layout and interactions. Record unknown facts. Follow docs/WORKFLOW.md and docs/LEAD-PUBLISHING.md in Cars.\n\n${manifest.variants.length} applications, one canonical dealer folder, one publishing repository on main and one shared Admin demo link. Hosting requires a qualified publisher and separate hosted evidence. No CRM/provider record or adoption/personalization receipt was created by this helper.\n`);
    if (assertMainCheckout(root, { readGit }).head !== plan.checkout.head) throw new Error('Cars main changed during copying; the staged candidate is preserved, not installed.');
    for (const item of plans) {
      if (JSON.stringify(verifyTemplate(root, item.template)) !== JSON.stringify(item.release) || fingerprint(path.join(stagedClient, item.template)).digest !== item.release.digest) throw new Error('Source or copied candidate changed during creation: ' + item.template);
    }
    if (resolveIdentity(root, client, plan.dealerId).exists) throw new Error('Dealer destination appeared during copying; existing work was not overwritten.');
    inside(root, 'clients/' + client); // Recheck ancestor links before installation.
    fs.renameSync(stagedClient, clientRoot);
    writeJson(path.join(staging, 'creation.json'), { createdAt: new Date().toISOString(), clientRoot, workflowCommit: plan.checkout.head, state: 'needs-personalization', templates: plans.map(p => ({ key: p.template, source: p.sourceRef })) });
    return { clientRoot, state: 'needs-personalization', applications: plans.length, receipt: path.join(staging, 'creation.json') };
  } catch (error) {
    if (staging) fs.writeFileSync(path.join(staging, 'failure.json'), JSON.stringify({ error: error.message, clientRoot, retainedCandidate: path.join(staging, 'dealer'), failedAt: new Date().toISOString() }, null, 2));
    throw error;
  } finally {
    // Remove only this invocation's small ownership marker, never a source tree.
    fs.unlinkSync(path.join(lockPath, 'owner.json')); fs.rmdirSync(lockPath);
  }
}

async function main() {
  if (process.argv.includes('--help')) {
    console.log('Usage: node scripts/new-client.mjs --client SLUG --repository OWNER/REPO [--preset standard|import] [--design-set six --locale-config JSON] [--templates ORDERED_KEYS] [--dealer-id ID] [--dry-run]\nDefault: three legacy designs. Explicit six: Auto Best, Modern/Import, Import/Modern, App, Mobile, Signature at packaging version 5; requires a complete en/bg dealer locale contract and every approved source. Uses canonical synchronized main, reports newer development without promoting it, and copies all selected designs together. Source creation only: no provider actions, adoption receipts or overwrites.');
    return;
  }
  const o = args(process.argv.slice(2), ['client', 'repository', 'preset', 'templates', 'dealer-id', 'design-set', 'locale-config'], ['dry-run']);
  const plan = planNewClient({ client: o.client, repository: o.repository, preset: o.preset, templates: o.templates, dealerId: o['dealer-id'], ...(o['design-set'] ? { designSet: o['design-set'] } : {}), ...(o['locale-config'] ? { localeConfig: readDealerLocale(o['locale-config'], o['dealer-id'] || o.client) } : {}) });
  console.log(JSON.stringify({ mode: o['dry-run'] ? 'dry-run' : 'copy', ...plan }, null, 2));
  if (!o['dry-run']) console.log(JSON.stringify(await createNewClient(plan), null, 2));
}
if (process.argv[1] && path.resolve(process.argv[1]) === import.meta.filename) main().catch(error => { console.error(error.message); process.exitCode = 1; });
