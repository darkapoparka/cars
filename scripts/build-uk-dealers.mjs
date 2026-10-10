import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { ROOT, json, writeJson, inside, git, sha256, excluded, filesAt } from './lib/workflow.mjs';
import { readDealerLocale } from './lib/dealer-locale.mjs';
import { loadDealerProfile } from './lib/client-refresh-normalize.mjs';
import { retainDealerVariantAssets, applyExtendedRefreshAdapter, sealExtendedVariant } from './lib/client-refresh-six.mjs';
import { applyRefreshAdapter } from './lib/client-refresh-adapters.mjs';
import { prepareAppDealer, sealAppDealerSource } from './lib/app-dealer-adapter.mjs';
import { planNewClient, createNewClient } from './new-client.mjs';
import { collectSource } from './package-dealer.mjs';
import { adoptNativeSource } from './publishing/native-mounts.mjs';
import { baseNativeManifest, assertAppVariant } from './publishing/app-variant.mjs';
import { assertNativeAdoption } from './lib/native-localization.mjs';
import { assertExtendedVariantSources } from './publishing/six-variant.mjs';
import { applyDealerIcons, inspectDealerIcon, ICO_INPUT_PATH } from './lib/uk-dealer-icons.mjs';
import { resolveShareIdentity } from './publishing/dealer-share.mjs';

export const MANIFEST_PATH = 'leads/uk-2026-10-10-build-manifest.json';
export const FAMILIES = Object.freeze(['auto-best', 'modern', 'import', 'app', 'mobile', 'karento-best']);
const GIB = 1024 ** 3;
const SOURCE_RECEIPT = '.client/uk-source-creation.json';
const safeSlug = value => typeof value === 'string' && /^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(value);
const publicUrl = value => {
  try { const url = new URL(value); return url.protocol === 'https:' && !url.username && !url.password; }
  catch { return false; }
};
const relative = value => typeof value === 'string' && value.length > 0 && !/[\\:\0]/.test(value) &&
  !value.startsWith('/') && value.split('/').every(part => part && part !== '.' && part !== '..');
const emit = value => console.log(JSON.stringify(value));
const state = () => ({desktop:false, mobile:false, identity:false, contactPath:false});

export function assertManualCi(env = process.env, platform = process.platform) {
  if (platform !== 'linux' || env.GITHUB_ACTIONS !== 'true' ||
      env.GITHUB_REPOSITORY !== 'darkapoparka/cars' || env.GITHUB_REF !== 'refs/heads/main' ||
      env.GITHUB_EVENT_NAME !== 'workflow_dispatch') {
    throw new Error('Source creation and commit require the manual Cars main Linux workflow; local preflight is read-only.');
  }
}

export function validateBatch(batch) {
  if (batch.schemaVersion !== 1 || batch.batch !== 'uk-2026-10-10' || batch.designSet !== 'six' ||
      batch.provider !== 'cloudflare' || batch.sourceOwnership !== 'cars-canonical' ||
      batch.publishingRepositoryVisibility !== 'private' ||
      batch.selectionEvidence !== 'docs/qa/uk-approved-six-selection-2026-10-10.json') throw new Error('Unexpected UK build manifest policy.');
  if (!Array.isArray(batch.dealers) || batch.dealers.length !== 10) throw new Error('The reviewed UK batch must contain ten dealers.');
  const slugs = new Set(), repositories = new Set(), leads = new Set();
  for (const dealer of batch.dealers) {
    if (!safeSlug(dealer.slug) || !safeSlug(dealer.leadId) || !dealer.name ||
        dealer.brief !== 'leads/uk-2026-10-10-briefs/' + dealer.leadId ||
        dealer.repository !== 'darkapoparka/cars-uk-' + dealer.slug ||
        dealer.workerName !== 'cars-uk-' + dealer.slug ||
        dealer.publicOrigin !== 'https://' + dealer.workerName + '.darkapoparka1.workers.dev' ||
        !['standard', 'import'].includes(dealer.preset) || !relative(dealer.appIcon) ||
        !dealer.appIcon.startsWith('assets/') || !dealer.appIcon.endsWith('.png')) {
      throw new Error('Invalid canonical UK dealer identity: ' + (dealer.slug || 'unknown'));
    }
    if (slugs.has(dealer.slug) || repositories.has(dealer.repository) || leads.has(dealer.leadId)) throw new Error('Repeated UK dealer identity.');
    slugs.add(dealer.slug); repositories.add(dealer.repository); leads.add(dealer.leadId);
  }
  if (JSON.stringify(Object.keys(batch.sourceReleases).sort()) !== JSON.stringify([...FAMILIES].sort())) throw new Error('All six exact source pins are required.');
  for (const key of FAMILIES) {
    const source = batch.sourceReleases[key];
    if (!/^[a-f0-9]{40}$/.test(source.revision || '') || !/^[a-f0-9]{40}$/.test(source.tree || '') ||
        !/^[a-f0-9]{64}$/.test(source.digest || '')) throw new Error('Invalid exact source selection: ' + key);
  }
  return batch;
}

export function selectDealers(batch, selection = 'all') {
  validateBatch(batch);
  if (selection === 'all') return batch.dealers;
  const selected = batch.dealers.filter(dealer => dealer.slug === selection);
  if (selected.length !== 1) throw new Error('Select all or an exact reviewed dealer slug.');
  return selected;
}

export function assertPinnedReleases(batch, lock) {
  for (const key of FAMILIES) {
    const expected = batch.sourceReleases[key], release = lock.templates?.[key];
    if (release?.status !== 'approved' || release.source?.repository !== 'darkapoparka/cars' ||
        release.source.path !== 'templates/' + key || release.commit !== expected.revision ||
        release.digest !== expected.digest ||
        ['revision', 'tree', 'digest'].some(field => release.source[field] !== expected[field])) {
      throw new Error('Reviewed UK source selection drifted: ' + key + '; review a new batch instead of silently changing its inputs.');
    }
  }
}

function packFiles(directory) {
  const names = ['business-facts.json', 'locale-config.json', 'stock.json'];
  for (const folder of ['assets', 'branding', 'dealer-brand', 'dealer-stock']) {
    const absolute = inside(directory, folder, {mustExist:true});
    for (const file of filesAt(absolute)) names.push(folder + '/' + file);
  }
  for (const name of ['SOURCES.md', 'HANDOFF.md', 'FACTS-AND-INVENTORY.json']) {
    if (fs.existsSync(inside(directory, name))) names.push(name);
  }
  return [...new Set(names)].sort();
}

function packSnapshot(directory) {
  const files = packFiles(directory).map(name => {
    const absolute = inside(directory, name, {mustExist:true}), stat = fs.lstatSync(absolute);
    if (!stat.isFile() || stat.isSymbolicLink() || stat.size >= 100 * 1024 ** 2) throw new Error('Invalid retained brief file: ' + name);
    return {path:name, bytes:stat.size, sha256:sha256(fs.readFileSync(absolute))};
  });
  return {digest:sha256(JSON.stringify(files)), bytes:files.reduce((sum, file) => sum + file.bytes, 0), files};
}

function assertPngIcon(file) {
  const bytes = fs.readFileSync(file);
  if (bytes.length < 24 || bytes.subarray(0, 8).toString('hex') !== '89504e470d0a1a0a' ||
      bytes.toString('ascii', 12, 16) !== 'IHDR' || bytes.readUInt32BE(16) < 32 ||
      bytes.readUInt32BE(16) !== bytes.readUInt32BE(20)) throw new Error('App branding needs a retained square PNG of at least 32 pixels: ' + file);
}

export function shareIdentityForDealer(dealer, profile, directory) {
  if (dealer.workerName !== 'cars-uk-' + dealer.slug ||
      dealer.publicOrigin !== 'https://' + dealer.workerName + '.darkapoparka1.workers.dev') {
    throw new Error('Dealer share identity must match the reviewed Cloudflare router and account subdomain.');
  }
  const logo = profile.logoContract?.assets?.onLight, icon = profile.logoContract?.icon;
  const sourcePath = logo?.publicPath?.replace(/^\//, '');
  if (!relative(sourcePath) || icon?.localPath !== dealer.appIcon) throw new Error('Missing retained logo or icon contract for dealer share metadata.');
  const identity = {
    name:profile.business.name, publicOrigin:dealer.publicOrigin,
    description:[profile.business.previewNotice, profile.business.inventoryNotice].filter(Boolean).join(' '),
    logo:{sourcePath, sha256:logo.sha256, faviconSourcePath:dealer.appIcon, faviconSha256:icon.sha256}
  };
  const files = new Map([sourcePath,dealer.appIcon].map(name => [name,fs.readFileSync(inside(directory,name,{mustExist:true}))]));
  resolveShareIdentity(files,{shareIdentity:identity});
  return identity;
}

export function inspectBrief(root, dealer) {
  const directory = inside(root, dealer.brief, {mustExist:true});
  const facts = json(inside(directory, 'business-facts.json', {mustExist:true}));
  if (facts.slug !== dealer.slug || facts.leadId !== dealer.leadId || facts.name !== dealer.name) throw new Error('Brief identity differs from the reviewed batch: ' + dealer.slug);
  const locale = readDealerLocale(inside(directory, 'locale-config.json', {mustExist:true}), dealer.slug);
  if (locale.defaultLocale !== 'en' || locale.dealerCountry !== 'GB' || locale.inventoryCurrency !== 'GBP' ||
      JSON.stringify([...locale.enabledLocales].sort()) !== '["bg","en"]') throw new Error('UK creation requires explicit English-first GB/GBP with retained en/bg catalogs.');
  const profile = loadDealerProfile(directory, dealer.slug);
  if (!profile.logoContract) throw new Error('Missing reviewed raster logo contract: ' + dealer.slug);
  if (profile.business.countryCode !== 'GB' || profile.business.currency !== 'GBP' || profile.business.distanceUnit !== 'mi') throw new Error('UK facts must retain GBP and original miles.');
  if (profile.stockKind === 'illustrative-not-dealer-stock' || /unpopulated|illustrative/i.test(facts.inventoryMode || '') ||
      profile.sourceCount !== profile.listings.length) throw new Error('Dated sourced stock with retained images is required; no empty or illustrative fallback.');
  for (const listing of profile.listings) {
    if (!publicUrl(listing.sourceUrl) || !/^\d{4}-\d{2}-\d{2}/.test(listing.observedAt || '') ||
        listing.currency !== 'GBP' || !Number.isFinite(listing.priceAmount) || listing.priceAmount <= 0 ||
        !Number.isInteger(listing.year) || listing.year < 1900 || listing.mileageOnRequest === true ||
        !Number.isFinite(listing.mileageValue) || listing.mileageValue < 0 || !listing.images?.length ||
        listing.images.some(image => !/^\/[^?#\\]+\.(?:png|webp|jpe?g)$/i.test(image) || /placeholder|no[-_]?photo/i.test(image))) {
      throw new Error('Incomplete published price, mileage, source date or local raster photo: ' + dealer.slug + '/' + listing.id);
    }
  }
  const legacyLogo = ['branding/logo-on-light.png', 'branding/logo-master.png'].find(name => fs.existsSync(inside(directory, name)));
  if (!legacyLogo) throw new Error('Missing retained PNG logo alias: ' + dealer.slug);
  assertPngIcon(inside(directory, dealer.appIcon, {mustExist:true}));
  inspectDealerIcon(fs.readFileSync(inside(directory, dealer.appIcon)), fs.readFileSync(inside(directory, ICO_INPUT_PATH, {mustExist:true})));
  // Validate actual retained logo and stock bytes before any source materialization.
  retainDealerVariantAssets(new Map(), 'auto-best', profile, directory);
  shareIdentityForDealer(dealer, profile, directory);
  const snapshot = packSnapshot(directory);
  return {directory, facts, locale, profile, snapshot};
}

function sourceByteBudget(root, batch, briefBytes) {
  let sourceBytes = 0;
  for (const key of FAMILIES) {
    const pin = batch.sourceReleases[key], prefix = 'templates/' + key + '/';
    const tree = git(root, ['ls-tree', '-r', '-l', '-z', pin.revision, '--', 'templates/' + key], {encoding:null}).toString('utf8');
    for (const item of tree.split('\0').filter(Boolean)) {
      const [metadata, name] = item.split('\t'), [mode, type, blob, size] = metadata.trim().split(/\s+/);
      if (!excluded(name.slice(prefix.length))) {
        if (type !== 'blob' || !['100644','100755'].includes(mode) || !/^\d+$/.test(size)) throw new Error('Unsupported retained source in disk budget: ' + name);
        sourceBytes += Number(size);
      }
    }
  }
  const disk = fs.statfsSync(root), freeBytes = disk.bavail * disk.bsize;
  // One independent source tree, possible newly fetched blobs/index writes, six media copies,
  // and 1 GiB working margin. This job deliberately does not install or compile dependencies.
  const requiredFreeBytes = sourceBytes * 3 + briefBytes * 8 + GIB;
  return {sourceBytes, briefBytes, requiredFreeBytes, freeBytes, ready:freeBytes >= requiredFreeBytes,
    scope:'one dealer source creation only; dependency/build jobs need their own measured budget'};
}

function writeMap(directory, files, before = new Map()) {
  for (const [name, bytes] of files) {
    if (!relative(name)) throw new Error('Unsafe generated path: ' + name);
    const previous = before.get(name);
    if (previous === bytes || (previous && previous.equals(bytes))) continue;
    const file = inside(directory, name);
    fs.mkdirSync(path.dirname(file), {recursive:true}); fs.writeFileSync(file, bytes);
  }
}

function copyBrief(brief, client) {
  for (const file of brief.snapshot.files) {
    const bytes = fs.readFileSync(inside(brief.directory, file.path, {mustExist:true}));
    if (sha256(bytes) !== file.sha256) throw new Error('Brief changed while copying: ' + file.path);
    const target = inside(client, file.path);
    if (fs.existsSync(target)) throw new Error('Brief would overwrite a generated source path: ' + file.path);
    fs.mkdirSync(path.dirname(target), {recursive:true}); fs.writeFileSync(target, bytes);
  }
}

function metadata(client, dealer, batch, workflowCommit) {
  const common = {state:'personalized-needs-build', publicUrl:null, qa:state(),
    crm:{leadId:dealer.leadId, demoProjectId:null, registered:false},
    hosting:{provider:'cloudflare', status:'not-deployed'}, readyToPublish:false};
  for (const key of FAMILIES) {
    const file = inside(client, key + '/.client/project.json', {mustExist:true});
    writeJson(file, {...json(file), ...common});
  }
  writeJson(inside(client, '.client/project.json'), {schemaVersion:1, client:dealer.slug, ...common,
    sourceOwnership:'cars-canonical', repository:dealer.repository, designSet:batch.designSet,
    workflowCommit, templateRevisions:Object.fromEntries(FAMILIES.map(key => [key,batch.sourceReleases[key].revision]))});
  fs.writeFileSync(inside(client, 'CLIENT.md'), '# ' + dealer.name + '\n\n' +
    'Six independent applications use the same dated business, stock and raster-brand pack. Canonical source: clients/' + dealer.slug + '.\n\n' +
    'Source personalization and integrity seals are recorded. Builds, visual review, contact journeys and Cloudflare deployment are still pending. This is an independent design preview; do not treat it as a dealer-approved live site.\n\n' +
    'Publishing repository: ' + dealer.repository + ' (private). Hosting target: Cloudflare. Source selection: ' + batch.selectionEvidence + '.\n');
}

async function personalize(client, dealer, batch, brief, plan) {
  copyBrief(brief, client);
  const manifest = json(inside(client, 'dealer.json', {mustExist:true}));
  manifest.extraAssets = ['assets', 'branding', 'dealer-brand', 'dealer-stock'];
  manifest.cloudflare = {workerPrefix:dealer.workerName};
  manifest.shareIdentity = shareIdentityForDealer(dealer, brief.profile, client);
  writeJson(inside(client, 'dealer.json'), manifest);
  metadata(client, dealer, batch, plan.checkout.head);
  const profile = loadDealerProfile(client, dealer.slug), nativeChanges = {};
  for (const key of FAMILIES.slice(0,3)) {
    const assets = new Map();
    retainDealerVariantAssets(assets, key, profile, client); writeMap(client, assets);
    const candidate = inside(client, key, {mustExist:true});
    nativeChanges[key] = applyRefreshAdapter({key, oldVariant:candidate, candidate, profile});
  }
  let files = await collectSource(client, manifest);
  const before = new Map(files);
  const appFiles = new Map([...files].filter(([name]) => name.startsWith('app/')).map(([name, bytes]) => [name.slice(4),bytes]));
  const app = await prepareAppDealer(client, manifest, {appFiles});
  for (const [name, bytes] of app.files) files.set('app/' + name, bytes);
  files.set('app/public/dealer-app/icon.png', fs.readFileSync(inside(client, dealer.appIcon, {mustExist:true})));
  const adaptations = {};
  for (const key of ['mobile','karento-best']) adaptations[key] = applyExtendedRefreshAdapter({files, key, profile, client});
  const icons = applyDealerIcons({files, manifest, profile,
    png:fs.readFileSync(inside(client, dealer.appIcon)), ico:fs.readFileSync(inside(client, ICO_INPUT_PATH))});
  const nativeManifest = baseNativeManifest(manifest);
  files = adoptNativeSource(files, nativeManifest, json(path.join(plan.root, 'templates.lock.json')).templates);
  sealAppDealerSource({files, manifest, provenance:app.provenance});
  for (const key of ['mobile','karento-best']) sealExtendedVariant({files, key, manifest, profile, adaptation:adaptations[key]});
  assertNativeAdoption(files, nativeManifest); assertAppVariant(files, manifest); assertExtendedVariantSources(files, manifest);
  writeMap(client, files, before);
  files = await collectSource(client, manifest);
  assertNativeAdoption(files, nativeManifest); assertAppVariant(files, manifest); assertExtendedVariantSources(files, manifest);
  const receipt = {schemaVersion:1, batch:batch.batch, dealer:dealer.slug, leadId:dealer.leadId,
    workflowCommit:plan.checkout.head, createdAt:new Date().toISOString(), provider:'cloudflare',
    inputPackDigest:brief.snapshot.digest, sourceReleases:batch.sourceReleases,
    sourceMaterialized:true, personalizationApplied:true, sourceSealsVerified:true,
    inventory:{count:profile.listings.length, mode:'dated-listing-snapshot', observedAt:profile.business.observedAt},
    nativeChanges, icons, sourceReceipts:['localization/adoption.json','.cars-app.json','.cars-mobile.json','.cars-signature.json'],
    build:false, hosted:false, dealerQa:state(), readyToPublish:false};
  writeJson(inside(client, SOURCE_RECEIPT), receipt);
  return receipt;
}

export function assertMutationScope(paths, slug) {
  if (!safeSlug(slug) || !paths.length || paths.some(name => !relative(name) || !name.startsWith('clients/' + slug + '/'))) {
    throw new Error('Generated commit may include only the selected canonical dealer.');
  }
}

function candidateFiles(client) {
  const paths = [];
  const allowedMetadata = /^(?:(?:auto-best|modern|import|app|mobile|karento-best)\/)?(?:AGENTS\.md|\.template\/source-manifest\.json|\.client\/project\.json)$/;
  const walk = (directory, prefix = '') => {
    for (const entry of fs.readdirSync(directory, {withFileTypes:true})) {
      const name = prefix + entry.name, absolute = inside(client, name);
      if (entry.isSymbolicLink()) throw new Error('Canonical source contains a link: ' + name);
      if (entry.isDirectory()) walk(absolute, name + '/');
      else if (entry.isFile()) {
        if (excluded(name) && !allowedMetadata.test(name) && name !== SOURCE_RECEIPT) throw new Error('Unexpected excluded file in source candidate: ' + name);
        if (fs.statSync(absolute).size >= 100 * 1024 ** 2) throw new Error('Source file exceeds GitHub limits: ' + name);
        paths.push(name);
      } else throw new Error('Unsupported source candidate: ' + name);
    }
  };
  walk(client); return paths.sort();
}

function guardedInputs(batch, dealer) {
  return [MANIFEST_PATH, 'scripts', '.github/workflows/build-uk-dealers.yml', 'templates.lock.json', 'catalog.json',
    'workspace.json', 'docs/DEPLOYMENT-INVENTORY.json', batch.selectionEvidence, dealer.brief];
}

function assertDispatchInputs(root, dealer, batch) {
  const dispatch = process.env.GITHUB_SHA;
  if (!/^[a-f0-9]{40}$/.test(dispatch || '') ||
      git(root, ['merge-base','--is-ancestor',dispatch,'HEAD'], {allowFailure:true}) === null ||
      git(root, ['diff','--name-only',dispatch,'HEAD','--',...guardedInputs(batch,dealer)])) {
    throw new Error('Creation inputs changed since manual dispatch; run a newly reviewed batch. Only unrelated source commits may advance between dealer jobs.');
  }
}

function commitAndPush(root, dealer, batch, brief, sourceReceipt, runtime) {
  assertManualCi();
  const prefix = 'clients/' + dealer.slug, base = sourceReceipt.workflowCommit;
  if (git(root, ['rev-parse','HEAD']) !== base) throw new Error('Checkout moved during source creation.');
  if (git(root, ['diff','--cached','--name-only'])) throw new Error('Unexpected pre-existing staged changes.');
  if (packSnapshot(brief.directory).digest !== brief.snapshot.digest) throw new Error('Input pack changed during source creation.');
  assertPinnedReleases(batch, json(path.join(root, 'templates.lock.json')));
  const candidates = candidateFiles(path.join(root, prefix)).map(name => prefix + '/' + name);
  assertMutationScope(candidates, dealer.slug);
  git(root, ['--literal-pathspecs','add','--sparse','--force','--pathspec-from-file=-','--pathspec-file-nul'], {input:Buffer.from(candidates.join('\0') + '\0')});
  const staged = git(root, ['diff','--cached','--name-only','-z'], {encoding:null}).toString('utf8').split('\0').filter(Boolean);
  assertMutationScope(staged, dealer.slug);
  if (JSON.stringify([...staged].sort()) !== JSON.stringify(candidates)) throw new Error('Staged source differs from the fully retained candidate.');
  git(root, ['commit','-m','Create UK six-design source for ' + dealer.name], {env:{
    GIT_AUTHOR_NAME:'github-actions[bot]', GIT_AUTHOR_EMAIL:'41898282+github-actions[bot]@users.noreply.github.com',
    GIT_COMMITTER_NAME:'github-actions[bot]', GIT_COMMITTER_EMAIL:'41898282+github-actions[bot]@users.noreply.github.com'}});
  git(root, ['fetch','--filter=blob:none','--no-tags','origin','main']);
  const remote = git(root, ['rev-parse','refs/remotes/origin/main']);
  if (remote !== base) {
    const guarded = guardedInputs(batch, dealer);
    if (git(root, ['merge-base','--is-ancestor',base,remote], {allowFailure:true}) === null ||
        git(root, ['diff','--name-only',base,remote,'--',...guarded]) ||
        git(root, ['cat-file','-e',remote + ':' + prefix], {allowFailure:true}) !== null) {
      throw new Error('Cars main changed relevant inputs or dealer identity; the generated commit is preserved for review, not pushed.');
    }
    // Only unrelated committed work may be rebased. No source pin or pack changes.
    git(root, ['rebase','refs/remotes/origin/main'], {env:{
      GIT_COMMITTER_NAME:'github-actions[bot]', GIT_COMMITTER_EMAIL:'41898282+github-actions[bot]@users.noreply.github.com'}});
  }
  const head = git(root, ['rev-parse','HEAD']), changed = git(root, ['diff','--name-only','HEAD^','HEAD','-z'], {encoding:null}).toString('utf8').split('\0').filter(Boolean);
  assertMutationScope(changed, dealer.slug);
  const current = git(root, ['ls-remote','--exit-code','origin','refs/heads/main']).split(/\s+/)[0];
  if (current !== remote) throw new Error('Cars main advanced again; the generated commit is preserved without a force push.');
  writeJson(path.join(runtime, 'commit.json'), {schemaVersion:1, dealer:dealer.slug, commit:head, parent:remote, inputWorkflowCommit:base,
    rebased:remote !== base, sourceReleases:batch.sourceReleases, files:changed.length, pushed:false});
  git(root, ['push','origin','HEAD:refs/heads/main']);
  if (git(root, ['ls-remote','--exit-code','origin','refs/heads/main']).split(/\s+/)[0] !== head) throw new Error('Could not confirm the source commit at Cars main.');
  const result = {...json(path.join(runtime, 'commit.json')), pushed:true};
  writeJson(path.join(runtime, 'commit.json'), result);
  return result;
}

function retainedCreation(root, dealer, batch, brief) {
  const prefix = 'clients/' + dealer.slug, raw = git(root, ['show','HEAD:' + prefix + '/' + SOURCE_RECEIPT], {allowFailure:true});
  if (raw === null) return null;
  const receipt = JSON.parse(raw);
  const creationCommit = git(root, ['log','-1','--format=%H','--',prefix + '/' + SOURCE_RECEIPT]);
  if (!creationCommit || git(root, ['diff','--name-only',creationCommit,'HEAD','--',prefix])) {
    throw new Error('Existing dealer changed after its source seal receipt; review the canonical source before reusing it: ' + dealer.slug);
  }
  if (receipt.dealer !== dealer.slug || receipt.inputPackDigest !== brief.snapshot.digest ||
      JSON.stringify(receipt.sourceReleases) !== JSON.stringify(batch.sourceReleases) ||
      receipt.sourceMaterialized !== true || receipt.sourceSealsVerified !== true) throw new Error('Existing canonical dealer requires a reviewed refresh: ' + dealer.slug);
  for (const key of FAMILIES) git(root, ['cat-file','-e','HEAD:' + prefix + '/' + key + '/package.json']);
  return {state:'existing-canonical-source', dealer:dealer.slug,
    commit:git(root, ['log','-1','--format=%H','--',prefix]), readyToPublish:false};
}

export async function runCreation(root, dealer, batch) {
  assertManualCi();
  const runtime = inside(root, 'runtime/uk-dealer-builds/' + process.env.GITHUB_RUN_ID + '-' + process.env.GITHUB_RUN_ATTEMPT + '/' + dealer.slug);
  fs.mkdirSync(runtime, {recursive:true});
  try {
    assertDispatchInputs(root, dealer, batch);
    assertPinnedReleases(batch, json(path.join(root, 'templates.lock.json')));
    const brief = inspectBrief(root, dealer);
    const existing = retainedCreation(root, dealer, batch, brief);
    if (existing) { writeJson(path.join(runtime, 'result.json'), existing); return existing; }
    const budget = sourceByteBudget(root, batch, brief.snapshot.bytes);
    writeJson(path.join(runtime, 'preflight.json'), {dealer:dealer.slug, inputPackDigest:brief.snapshot.digest, budget});
    if (!budget.ready) throw new Error('Insufficient measured runner storage for one retained dealer; no cleanup or partial source fallback was attempted.');
    const plan = planNewClient({root, client:dealer.slug, repository:dealer.repository,
      preset:dealer.preset, designSet:'six', localeConfig:brief.locale});
    emit({phase:'copying-approved-sources', dealer:dealer.slug, workflowCommit:plan.checkout.head, budget});
    const creation = await createNewClient(plan);
    const source = await personalize(creation.clientRoot, dealer, batch, brief, plan);
    writeJson(path.join(runtime, 'source.json'), source);
    const commit = commitAndPush(root, dealer, batch, brief, source, runtime);
    const result = {state:'canonical-source-committed', dealer:dealer.slug, repository:dealer.repository,
      sourceCommit:commit.commit, applications:6, provider:'cloudflare', build:false, hosted:false, readyToPublish:false};
    writeJson(path.join(runtime, 'result.json'), result); return result;
  } catch (error) {
    writeJson(path.join(runtime, 'failure.json'), {dealer:dealer.slug, message:error.message, at:new Date().toISOString(),
      candidate:path.join(root,'clients',dealer.slug), sourceCommit:git(root,['rev-parse','HEAD'],{allowFailure:true}), readyToPublish:false});
    throw error;
  }
}

async function main() {
  const [command = 'preflight', selection = 'all', ...extra] = process.argv.slice(2);
  if (extra.length || !['matrix','preflight','create'].includes(command)) throw new Error('Usage: node scripts/build-uk-dealers.mjs matrix|preflight|create [all|SLUG]');
  const batch = validateBatch(json(path.join(ROOT, MANIFEST_PATH))), dealers = selectDealers(batch, selection);
  if (command === 'matrix') { console.log('matrix=' + JSON.stringify({include:dealers.map(dealer => ({slug:dealer.slug}))})); return; }
  if (command === 'preflight') {
    assertPinnedReleases(batch, json(path.join(ROOT, 'templates.lock.json')));
    let blocked = false;
    for (const dealer of dealers) {
      try { const brief = inspectBrief(ROOT, dealer); emit({dealer:dealer.slug, ready:true, stock:brief.profile.listings.length, inputPackDigest:brief.snapshot.digest, briefBytes:brief.snapshot.bytes}); }
      catch (error) { blocked = true; emit({dealer:dealer.slug, ready:false, reason:error.message}); }
    }
    if (blocked) process.exitCode = 1;
    return;
  }
  if (dealers.length !== 1) throw new Error('Creation is one dealer per fresh runner; use the serial matrix for all ten.');
  emit(await runCreation(ROOT, dealers[0], batch));
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) main().catch(error => { console.error(error.message); process.exitCode = 1; });
