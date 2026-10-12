import crypto from 'node:crypto';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { createRequire } from 'node:module';
import { fingerprint, filesAt, git } from '../lib/workflow.mjs';
import { planSixDesignSelection, SIX_DESIGN_PACKAGING_CANDIDATE } from '../lib/six-design-release.mjs';
import { loadDealerProfile } from '../lib/client-refresh-normalize.mjs';
import { applyRefreshAdapter } from '../lib/client-refresh-adapters.mjs';
import {buildModernDealerInventoryCopy} from '../lib/modern-dealer-inventory-copy.mjs';
import { restoreTemplatePalette, templatePaletteConfigPath } from '../lib/client-refresh-presentation.mjs';
import { applyExtendedRefreshAdapter, sealExtendedVariant, EXTENDED_VARIANT_RECEIPTS, retainDealerVariantAssets } from '../lib/client-refresh-six.mjs';
import { validatePackagingManifest, packageRetainsPath } from '../package-dealer.mjs';
import { applyMounts } from '../publishing/mounts.mjs';
import { adoptNativeSource, adoptNativeQualification, applyNativeMounts } from '../publishing/native-mounts.mjs';
import { assertNativeAdoption, assertNativeQualification, validateNativeQualificationContext, validateTemplateQualification, NATIVE_CHECKS, ADOPTION_FILE } from '../lib/native-localization.mjs';
import { refreshNormalizeInternals } from '../lib/client-refresh-normalize.mjs';
import {
  materializeUpgradeCandidate,
  planDealerUpgrade,
  selectPinnedRevisions,
  upgradeReviewReport,
  reconcilePlanWithCandidate,
  replaceCandidateFile,
  installUpgrade,
  rollbackUpgrade,
  updateManifestPins,
  unifiedDiff
} from './three-way-upgrade.mjs';
import { readPinnedTemplateTree } from './pinned-template-source.mjs';
import { baseNativeManifest, APP_PACKAGING_VERSION, assertAppVariant } from '../publishing/app-variant.mjs';
import {prepareAppDealer,sealAppDealerSource} from '../lib/app-dealer-adapter.mjs';
import { buildLegacyDetailRouteMap, legacyDetailArtifact, LEGACY_DETAIL_FILE } from '../publishing/legacy-detail-routes.mjs';
import {readRegisteredDealerAdoption,assertRegisteredAdoptionPlan,registeredAdoptionTarget,materializeRegisteredAssetView,assertRegisteredAssetView,assertRegisteredCandidateDirectory,assertRegisteredMountOwnership} from '../registered-dealer-adoption.mjs';

const TEMPLATE_KEYS = ['auto-best', 'modern', 'carwow', 'import', 'app', 'mobile', 'karento-best'];
const sha256 = value => crypto.createHash('sha256').update(value).digest('hex');
const readJson = file => JSON.parse(fs.readFileSync(file, 'utf8').replace(/^\uFEFF/, ''));
const writeJsonExclusive = (file, value) => fs.writeFileSync(file, `${JSON.stringify(value, null, 2)}\n`, { flag: 'wx' });
let catalogGeneration = 0;

export const updateDealerTemplateUsage = `
Opt in to a template update for one existing dealer.

  node update-dealer-template.mjs plan --dealer-root <path> [--cars-root <path>]
       [--template-root <path>] [--lock-file <path>] [--run-dir <path>]
       [--candidate-dir <path>] [--resolutions-file <json-path>]
       [--candidate-asset-pool <path>] [--asset-pool <installation-path>]
       [--design-set six] [--template-palette] [--variants karento-best]
       [--qualification <reviewed-context-json> --lock-file <candidate-lock-json>]
       [--registered-adoption <reviewed-receipt-json> --registered-adoption-sha256 <hash>] [--refresh-facts]
       [--modern-copy-review <reviewed-display-copy-json> --modern-copy-review-sha256 <hash>]
  node update-dealer-template.mjs install --run-dir <path>
  node update-dealer-template.mjs rollback --run-dir <path> [--dealer-root <path>]

plan writes review.json and a buildable candidate under Cars runtime/ and never changes the dealer.
install changes only reviewed paths after checking the lock, pinned source trees, review and candidate.
rollback restores the exact backed-up bytes while preserving later dealer edits.
`;

function parseCommand(argv) {
  if (argv.length === 0 || argv.includes('--help') || argv.includes('-h')) return { action: 'help' };
  const [action, ...rest] = argv;
  if (!['plan', 'install', 'rollback'].includes(action)) throw new Error(`Unknown action: ${action}\n${updateDealerTemplateUsage}`);
  const allowed = {
    plan: new Set(['dealer-root', 'cars-root', 'template-root', 'lock-file', 'run-dir', 'candidate-dir', 'resolutions-file', 'asset-pool', 'candidate-asset-pool', 'design-set', 'variants', 'template-palette', 'qualification', 'registered-adoption', 'registered-adoption-sha256', 'refresh-facts', 'modern-copy-review', 'modern-copy-review-sha256']),
    install: new Set(['run-dir']),
    rollback: new Set(['run-dir', 'dealer-root'])
  }[action];
  const values = {};
  for (let index = 0; index < rest.length; index++) {
    const flag = rest[index];
    if (!flag.startsWith('--')) throw new Error(`Unexpected argument: ${flag}`);
    const key = flag.slice(2);
    if (!allowed.has(key)) throw new Error(`Unknown --${key} option for ${action}`);
    if (values[key] !== undefined) throw new Error(`Duplicate --${key} option`);
    if (key === 'template-palette' || key === 'refresh-facts') { values[key] = true; continue; }
    if (!rest[index + 1] || rest[index + 1].startsWith('--')) throw new Error(`Missing value for --${key}`);
    values[key] = rest[++index];
  }
  return { action, values };
}

function required(values, key) {
  if (!values[key]) throw new Error(`Missing required --${key} option`);
  return values[key];
}

function defaultCarsRoot() {
  return path.resolve(fileURLToPath(new URL('../..', import.meta.url)));
}

function isInsidePath(root, target) {
  const relative = path.relative(root, target);
  return relative === '' || (relative !== '..' && !relative.startsWith(`..${path.sep}`) && !path.isAbsolute(relative));
}

function projectedPhysicalPath(destination) {
  let existing = path.resolve(destination);
  const suffix = [];
  while (true) {
    try {
      return path.resolve(fs.realpathSync(existing), ...suffix);
    } catch (error) {
      if (error.code !== 'ENOENT') throw error;
      const parent = path.dirname(existing);
      if (parent === existing) throw error;
      suffix.unshift(path.basename(existing));
      existing = parent;
    }
  }
}

function ensureInsideRuntime(carsRoot, destination) {
  const physicalCarsRoot = fs.realpathSync(carsRoot);
  const runtimeRoot = path.resolve(physicalCarsRoot, 'runtime');
  const runDirectory = path.resolve(destination);
  const relative = path.relative(runtimeRoot, runDirectory);
  if (!relative || relative === '..' || relative.startsWith(`..${path.sep}`) || path.isAbsolute(relative)) {
    throw new Error(`Update artifacts must stay under ${runtimeRoot}`);
  }
  const physicalRuntimeRoot = projectedPhysicalPath(runtimeRoot);
  if (path.relative(physicalCarsRoot, physicalRuntimeRoot) !== 'runtime') {
    throw new Error('Cars runtime/ must resolve to its own directory inside the Cars checkout');
  }
  const physicalRunDirectory = projectedPhysicalPath(runDirectory);
  if (!isInsidePath(physicalRuntimeRoot, physicalRunDirectory) || physicalRunDirectory === physicalRuntimeRoot) {
    throw new Error('Update artifacts must resolve inside Cars runtime/');
  }
  return runDirectory;
}

function createRunDirectory(carsRoot, slug, requested) {
  const runtimeRoot = path.join(carsRoot, 'runtime', 'dealer-template-upgrades');
  fs.mkdirSync(runtimeRoot, { recursive: true });
  if (requested) {
    const runDirectory = ensureInsideRuntime(carsRoot, requested);
    if (fs.existsSync(runDirectory)) throw new Error(`Update run directory already exists: ${runDirectory}`);
    fs.mkdirSync(path.dirname(runDirectory), { recursive: true });
    fs.mkdirSync(runDirectory);
    return runDirectory;
  }
  const safeSlug = String(slug || 'dealer').replace(/[^a-z0-9-]+/gi, '-').replace(/^-|-$/g, '') || 'dealer';
  return fs.mkdtempSync(path.join(runtimeRoot, `${safeSlug}-${Date.now()}-`));
}

function pathsOverlap(left, right) {
  return isInsidePath(left, right) || isInsidePath(right, left);
}

function samePath(left, right) {
  return path.relative(path.resolve(left), path.resolve(right)) === '';
}

function ensureCandidateDirectory({ carsRoot, dealerRoot, repositoryPaths: repositories, runDirectory, requested, explicit }) {
  const candidateDirectory = path.resolve(requested);
  if (path.dirname(candidateDirectory) === candidateDirectory) throw new Error('Candidate directory cannot be a filesystem root');
  const physicalCandidate = projectedPhysicalPath(candidateDirectory);
  if (!samePath(physicalCandidate, candidateDirectory)) {
    throw new Error('Candidate directory must not resolve through a symlink or junction');
  }

  const physicalCarsRoot = fs.realpathSync(carsRoot);
  const physicalRuntimeRoot = projectedPhysicalPath(path.join(physicalCarsRoot, 'runtime'));
  const insideCars = isInsidePath(physicalCarsRoot, physicalCandidate);
  if (insideCars && (!isInsidePath(physicalRuntimeRoot, physicalCandidate) || samePath(physicalCandidate, physicalRuntimeRoot))) {
    throw new Error(`Candidate directory inside Cars must stay under ${physicalRuntimeRoot}`);
  }
  if (!insideCars && isInsidePath(physicalCandidate, physicalCarsRoot)) {
    throw new Error('Candidate directory cannot contain the Cars checkout');
  }

  const protectedRoots = [
    ['dealer source checkout', fs.realpathSync(dealerRoot)],
    ...Object.entries(repositories)
      .filter(([name]) => name !== 'darkapoparka/cars')
      .filter(([, repository]) => fs.existsSync(repository))
      .map(([name, repository]) => [`${name} template checkout`, fs.realpathSync(repository)])
  ];
  for (const [label, root] of protectedRoots) {
    if (pathsOverlap(root, physicalCandidate)) throw new Error(`Candidate directory overlaps the ${label}`);
  }

  const physicalRunDirectory = fs.realpathSync(runDirectory);
  if (pathsOverlap(physicalRunDirectory, physicalCandidate)) {
    const expectedDefault = path.resolve(path.join(physicalRunDirectory, 'candidate'));
    if (explicit || !samePath(physicalCandidate, expectedDefault)) {
      throw new Error('An explicit candidate directory must be separate from the update run directory');
    }
  }
  return physicalCandidate;
}

function repositoryPaths(carsRoot, templateRoot) {
  return Object.fromEntries([
    ['darkapoparka/cars', carsRoot],
    ...TEMPLATE_KEYS.map(key => [`darkapoparka/cars-template-${key}`, path.join(templateRoot, `cars-template-${key}`)])
  ]);
}

function addPrefixedTree(files, key, root) {
  if (root instanceof Map) {
    for (const [name, bytes] of root) files.set(`${key}/${name}`, Buffer.from(bytes));
    return;
  }
  const walk = (directory, relative = '') => {
    for (const entry of fs.readdirSync(directory, { withFileTypes: true })) {
      const name = relative ? `${relative}/${entry.name}` : entry.name;
      const target = path.join(directory, entry.name);
      if (entry.isDirectory()) walk(target, name);
      else if (entry.isFile()) files.set(`${key}/${name}`, fs.readFileSync(target));
      else throw new Error(`${key}: pinned tree contains a link or special file at ${name}`);
    }
  };
  walk(root);
}

function splitPrefixedTrees(files, keys) {
  return Object.fromEntries(keys.map(key => [key, new Map(
    [...files].filter(([name]) => name.startsWith(`${key}/`)).map(([name, bytes]) => [name.slice(key.length + 1), bytes])
  )]));
}

export function registeredDeliveryOrigin(record, manifest) {
  if (!record || record.repository !== manifest.repository) throw new Error('Six-design delivery needs the exact registered repository and public origin');
  const value = record.delivery?.url || (record.delivery?.provider === 'cloudflare' ? record.delivery.configuredPublicOrigin : null);
  if (!value) throw new Error('Six-design delivery needs the exact registered repository and public origin');
  const origin = new URL(value);
  if (origin.protocol !== 'https:' || origin.username || origin.password || origin.pathname !== '/' || origin.search || origin.hash) throw new Error('The registered dealer delivery must be a complete HTTPS origin');
  if (record.delivery?.provider === 'cloudflare' && origin.origin !== manifest.shareIdentity?.publicOrigin) throw new Error('Configured Cloudflare origin differs from the retained dealer identity');
  return origin;
}

export function targetManifestForUpgrade({ dealerRoot, manifest, pins, targetVariants = manifest.variants, carsRoot, registeredAdoption }) {
  if (registeredAdoption) {
    assertRegisteredAdoptionPlan(registeredAdoption,{dealerRoot,manifest});
    const next=registeredAdoptionTarget(registeredAdoption,pins);
    if(JSON.stringify(next.variants)!==JSON.stringify(targetVariants))throw new Error('Registered adoption requires its reviewed six-family selection');
    return validatePackagingManifest(next);
  }
  const next = updateManifestPins(manifest, pins);
  next.variants = structuredClone(targetVariants);
  if (targetVariants.length === 6) {
    next.packaging = { ...next.packaging, version: SIX_DESIGN_PACKAGING_CANDIDATE };
    for (const field of ['templateRevisions','templateSources']) next[field] = Object.fromEntries(next.variants.map(({key})=>[key,next[field]?.[key]]));
    if (carsRoot) {
      const registryFile = path.join(carsRoot,'docs/DEPLOYMENT-INVENTORY.json');
      const record = fs.existsSync(registryFile) ? readJson(registryFile).dealers?.find(row=>row.slug===manifest.slug) : null;
      const origin = registeredDeliveryOrigin(record, manifest);
      const profile = loadDealerProfile(dealerRoot,manifest.slug),asset = profile.logoContract?.assets.onLight;
      if (!asset) throw new Error('Six-design sharing needs the reviewed dealer logo contract');
      next.shareIdentity={...(manifest.shareIdentity || {}),name:profile.business.name,publicOrigin:origin.origin,
        description:profile.business.previewNotice,
        logo:{...(manifest.shareIdentity?.logo || {}),sourcePath:asset.publicPath.slice(1),sha256:asset.sha256}};
      next.extraAssets=[...new Set([...(next.extraAssets || []),'dealer-brand','branding'])];
    }
  }
  const kinds = new Set(Object.entries(pins).map(([key, pin]) =>
    pin.targetSource.repository === 'darkapoparka/cars' && pin.targetSource.path === `templates/${key}` ? 'cars-native' : 'legacy'
  ));
  if (kinds.size !== 1) throw new Error('A dealer update cannot mix Cars-native and legacy target sources');
  if (!kinds.has('cars-native')) return validatePackagingManifest(next);
  if (['2', APP_PACKAGING_VERSION, SIX_DESIGN_PACKAGING_CANDIDATE].includes(next.packaging?.version) && manifest.localization) return validatePackagingManifest(next);
  const factsFile = path.join(dealerRoot, 'business-facts.json');
  const rawFacts = fs.existsSync(factsFile) ? readJson(factsFile) : {};
  const business = refreshNormalizeInternals.normalizeBusiness(dealerRoot, manifest.slug, rawFacts);
  const country = String(business.countryCode || '').toUpperCase();
  const currency = String(business.currency || '').toUpperCase();
  if (!/^[A-Z]{2}$/.test(country) || !/^[A-Z]{3}$/.test(currency)) throw new Error(`${manifest.slug}: native migration requires an explicit country and currency`);
  const defaultLocale = country === 'BG' ? 'bg' : 'en';
  next.schemaVersion = 1;
  next.dealerId = next.dealerId || next.slug;
  next.defaultBranch = next.defaultBranch || 'main';
  next.language = defaultLocale;
  next.packaging = { version: targetVariants.length === 6 ? SIX_DESIGN_PACKAGING_CANDIDATE : manifest.packaging?.version === APP_PACKAGING_VERSION ? APP_PACKAGING_VERSION : '2' };
  next.localization = {
    schemaVersion: 1, dealerId: next.dealerId, defaultLocale, enabledLocales: ['en', 'bg'],
    dealerCountry: country, inventoryCurrency: currency
  };
  next.switcher = {
    ...(next.switcher || {}), language: defaultLocale,
    accent: /^#[0-9a-f]{6}$/i.test(business.accent || '') ? business.accent : (next.switcher?.accent || '#2563eb')
  };
  return validatePackagingManifest(next);
}

export async function adaptPinnedBases({ keys, oldBases, newBases, manifest, targetManifest, registeredAdoption }) {
  let oldFiles = new Map(), newFiles = new Map();
  for (const key of keys) {
    if (oldBases[key]?.size) addPrefixedTree(oldFiles, key, oldBases[key]);
    addPrefixedTree(newFiles, key, newBases[key]);
  }
  let fromAdapter, targetAdapter;
  if (registeredAdoption) {
    assertRegisteredAdoptionPlan(registeredAdoption,{manifest});
    fromAdapter='registered-raw-unmounted-applications';
  } else if (manifest.packaging.version === '1') {
    fromAdapter = 'cars-package-v1-mounts';
    await applyMounts(oldFiles, manifest);
  } else if (['2', APP_PACKAGING_VERSION, SIX_DESIGN_PACKAGING_CANDIDATE].includes(manifest.packaging.version)) {
    fromAdapter = 'cars-package-v2-native-mounts';
    const native = baseNativeManifest(manifest);
    native.variants = native.variants.filter(({key})=>oldFiles.has(key+'/package.json'));
    if (native.variants.length) oldFiles = applyNativeMounts(oldFiles,native);
  } else throw new Error(`Unsupported dealer packaging version: ${manifest.packaging?.version}`);
  if (targetManifest.packaging.version === '1') {
    targetAdapter = 'cars-package-v1-mounts';
    await applyMounts(newFiles, targetManifest);
  } else if (['2', APP_PACKAGING_VERSION, SIX_DESIGN_PACKAGING_CANDIDATE].includes(targetManifest.packaging.version)) {
    targetAdapter = 'cars-package-v2-native-mounts';
    const native = baseNativeManifest(targetManifest);
    native.variants = native.variants.filter(({key})=>newFiles.has(key+'/package.json'));
    if (native.variants.length) newFiles = applyNativeMounts(newFiles,native);
  } else throw new Error(`Unsupported target packaging version: ${targetManifest.packaging?.version}`);
  return {
    adapter: `${fromAdapter}->${targetAdapter}`, targetManifest,
    oldBases: splitPrefixedTrees(oldFiles, keys), newBases: splitPrefixedTrees(newFiles, keys)
  };
}

function parseResolutions(bytes, pins) {
  if (!bytes) return {};
  const parsed = JSON.parse(bytes.toString('utf8').replace(/^\uFEFF/, ''));
  const entries = parsed?.schemaVersion === 1 ? parsed.resolutions : parsed;
  if (!entries || typeof entries !== 'object' || Array.isArray(entries)) throw new Error('Resolutions file must contain a path-to-decision object');
  const result = {};
  for (const [name, value] of Object.entries(entries)) {
    const normalized = name.replaceAll('\\', '/');
    const parts = normalized.split('/');
    const key = parts.shift();
    if (!pins[key] || !parts.length || parts.some(part => !part || part === '.' || part === '..') || normalized.startsWith('/') || /^[a-z]:/i.test(normalized)) {
      throw new Error(`Invalid resolution path: ${name}`);
    }
    if (value === 'dealer' || value === 'template') result[normalized] = value;
    else if (value && typeof value === 'object' && !Array.isArray(value)) {
      const action = value.action;
      if (action === 'dealer' || action === 'template') result[normalized] = action;
      else if (action === 'manual' && typeof value.text === 'string') result[normalized] = Buffer.from(value.text);
      else throw new Error(`Invalid resolution for ${normalized}: use dealer, template or { action: "manual", text: "..." }`);
    } else throw new Error(`Invalid resolution for ${normalized}: use dealer, template or a manual text object`);
  }
  return result;
}


/** An explicit reviewed exception to a clean preservation merge, never to factual equality. */
export function applyReviewedFactualConsumerResolutions({plan,original,oldBases,newBases,review,manifest,qualification,designSet,selectedKeys,registeredAdoption,refreshFacts,templatePalette,factualProof,baseline,resolutions={}}) {
  if(review==null)return null;
  const exact=(value,keys)=>value&&typeof value==='object'&&!Array.isArray(value)&&JSON.stringify(Object.keys(value).sort())===JSON.stringify([...keys].sort());
  const equal=(a,b)=>JSON.stringify(a)===JSON.stringify(b);
  const keys=['auto-best','modern','import','app','mobile','karento-best'];
  const pathname='import/src/lib/config/dealer.ts',relative='src/lib/config/dealer.ts';
  assertFactualRefreshAdmission({enabled:refreshFacts,designSet,selectedKeys,qualification,registeredAdoption,manifest});
  if(refreshFacts!==true||templatePalette!==true||registeredAdoption||!plan?.ready||!(plan.candidate instanceof Map)||!(original instanceof Map))throw new Error('Reviewed factual consumers require a ready ordinary six-family factual refresh with selected template palettes');
  if(!exact(review,['schemaVersion','kind','reviewed','dealer','baseline','targetSources','paths'])||review.schemaVersion!==1||review.kind!=='cars-factual-consumer-template-resolutions'||review.reviewed!==true||review.dealer!==manifest.slug||
     !exact(review.baseline,['commit','tree'])||!Object.values(review.baseline).every(value=>/^[a-f0-9]{40}$/.test(value))||!equal(review.baseline,baseline)||
     factualProof?.stage!=='preservation-merge-before-native-catalogs-and-branding'||!Array.isArray(factualProof.consumerPaths)||!factualProof.consumerPaths.includes(pathname)||
     !exact(review.targetSources,keys)||!equal(review.targetSources,factualProof.targetSources)||!equal(review.targetSources,Object.fromEntries(keys.map(key=>[key,renderPins(plan.pins?.[key]?.targetSource)])))||
     !Array.isArray(review.paths)||review.paths.length!==1)throw new Error('Invalid reviewed factual consumer identity, baseline, pins or scope');
  if(Object.hasOwn(resolutions,pathname)||plan.changes.some(row=>row.path===pathname&&row.kind?.startsWith('resolved-')))throw new Error('Reviewed clean factual choice cannot overlap an existing conflict decision');
  const item=review.paths[0];
  if(!exact(item,['path','choice','originalSha256','oldSha256','targetSha256','mergedSha256'])||item.path!==pathname||item.choice!=='template'||Object.entries(item).some(([key,value])=>key.endsWith('Sha256')&&!/^[a-f0-9]{64}$/.test(value)))throw new Error('Reviewed factual consumer must name only the exact Import dealer config with four byte leases');
  const current=original.get(pathname),old=oldBases?.import?.get(relative),target=newBases?.import?.get(relative),merged=plan.candidate.get(pathname);
  const text=bytes=>Buffer.isBuffer(bytes)&&!bytes.includes(0)&&Buffer.from(bytes.toString('utf8')).equals(bytes);
  if(![current,old,target,merged].every(text)||merged.equals(target)||plan.conflicts?.some(row=>row.path===pathname)||
     sha256(current)!==item.originalSha256||sha256(old)!==item.oldSha256||sha256(target)!==item.targetSha256||sha256(merged)!==item.mergedSha256)throw new Error('Reviewed factual consumer bytes changed, are not clean UTF-8, or are not a clean target difference');
  // All validation precedes changes; retain every other candidate and conflict decision.
  const change={path:pathname,kind:'reviewed-factual-template',beforeSha256:sha256(current),afterSha256:sha256(target),diff:unifiedDiff(current,target,[`dealer/${pathname}`,`candidate/${pathname}`])};
  plan.candidate.set(pathname,Buffer.from(target));
  plan.changes=[...plan.changes.filter(row=>row.path!==pathname),change].sort((a,b)=>a.path.localeCompare(b.path));
  plan.summary={...plan.summary,changed:plan.changes.length,autoMerged:plan.changes.filter(row=>row.kind==='auto-merged').length,dealerOnly:plan.changes.filter(row=>row.kind==='dealer-only').length,templateOnly:plan.changes.filter(row=>row.kind==='template-only').length};
  const proof={schemaVersion:1,stage:factualProof.stage,mode:'explicit-reviewed-ordinary-factual-template-consumer',dealer:manifest.slug,baseline:structuredClone(baseline),targetSources:structuredClone(review.targetSources),qualificationSha256:sha256(Buffer.from(JSON.stringify(qualification))),reviewSha256:sha256(Buffer.from(JSON.stringify(review))),paths:structuredClone(review.paths)};
  plan.factualConsumerResolutions=proof;return proof;
}

export function preserveReviewedAppInventoryNotice({app,currentBytes,profileBytes,review,manifest,baseline,targetSources}) {
  if(review==null)return null;
  const exact=(v,keys)=>v&&typeof v==='object'&&!Array.isArray(v)&&JSON.stringify(Object.keys(v).sort())===JSON.stringify([...keys].sort());
  const equal=(a,b)=>JSON.stringify(a)===JSON.stringify(b),hex=v=>/^[a-f0-9]{64}$/.test(v??'');
  if(!exact(review.baseline,['commit','tree'])||!Object.values(review.baseline).every(v=>/^[a-f0-9]{40}$/.test(v??''))||!exact(review.targetSources,['auto-best','modern','import','app','mobile','karento-best']))throw Error('Exact canonical App notice baseline and six target sources required');
  if(!exact(review,['schemaVersion','kind','dealer','baseline','path','currentConfigSha256','currentNoticeSha256','profileSha256','unmodifiedTargetConfigSha256','targetSources','reviewed','reviewedBy'])||review.schemaVersion!==1||review.kind!=='cars-current-app-inventory-notice-preservation'||review.reviewed!==true||typeof review.reviewedBy!=='string'||!review.reviewedBy.trim()||review.dealer!==manifest.slug||review.path!=='app/lib/dealer.json'||!equal(review.baseline,baseline)||!equal(review.targetSources,targetSources)||!['currentConfigSha256','currentNoticeSha256','profileSha256','unmodifiedTargetConfigSha256'].every(k=>hex(review[k])))throw Error('Exact reviewed App notice identity, baseline, target pins and byte leases required');
  const clean=b=>Buffer.isBuffer(b)&&b.length>0&&b.length<=2*1024**2&&!b.includes(0)&&Buffer.from(b.toString('utf8')).equals(b);
  if(!clean(currentBytes)||!clean(profileBytes)||sha256(currentBytes)!==review.currentConfigSha256||sha256(profileBytes)!==review.profileSha256||!(app.files instanceof Map))throw Error('Reviewed App notice source/profile bytes changed');
  const current=JSON.parse(currentBytes.toString('utf8')),profile=JSON.parse(profileBytes.toString('utf8')),targetBytes=app.files.get('lib/dealer.json');
  if(current.mode!=='dealer'||current.id!==manifest.slug||profile.slug!==manifest.slug||!clean(targetBytes)||sha256(targetBytes)!==review.unmodifiedTargetConfigSha256||!equal(JSON.parse(targetBytes.toString('utf8')),app.config)||app.config.mode!=='dealer'||app.config.id!==manifest.slug||!app.provenance||app.provenance.profileSha256!==review.profileSha256)throw Error('Reviewed App notice current/generated dealer identity or provenance changed');
  const notice=current.inventoryNotice;
  if(typeof notice!=='string'||!notice.trim()||Buffer.byteLength(notice,'utf8')>1024||notice.includes('\0')||sha256(Buffer.from(notice,'utf8'))!==review.currentNoticeSha256)throw Error('Exact current concise App notice required');
  if(!Array.isArray(profile.listings)||profile.listings.some(row=>(row.mediaKind||row.raw?.mediaKind)==='generated_category_illustration')&&!/illustrat/i.test(notice))throw Error('Current notice must preserve any required illustrated-image disclosure');
  // Preserve one existing presentation string before factual target comparison; all facts and generated controls remain exact.
  const config={...app.config,inventoryNotice:notice},after=Buffer.from(JSON.stringify(config,null,2)+'\n');
  const proof={schemaVersion:1,kind:review.kind,dealer:manifest.slug,baseline:structuredClone(baseline),path:review.path,reviewSha256:sha256(Buffer.from(JSON.stringify(review))),currentConfigSha256:review.currentConfigSha256,currentNoticeSha256:review.currentNoticeSha256,profileSha256:review.profileSha256,unmodifiedTargetConfigSha256:review.unmodifiedTargetConfigSha256,targetConfigSha256:sha256(after),targetSources:structuredClone(targetSources),allOtherConfigFieldsUnchanged:true,sourceFactsUnchanged:true};
  app.config=config;app.files.set('lib/dealer.json',after);app.provenance={...app.provenance,inventoryNoticePreservation:proof};return proof;
}

function readAppInventoryNoticeReview(bytes) {
  const review=bytes?JSON.parse(bytes.toString('utf8').replace(/^\uFEFF/,'')).appInventoryNoticePreservation??null:null;
  if(review!=null&&(!review||typeof review!=='object'||Array.isArray(review)))throw Error('App notice review must be an exact object');
  return review;
}

function readFactualConsumerReview(bytes) {
  return bytes?JSON.parse(bytes.toString('utf8').replace(/^\uFEFF/,'')).factualConsumerResolutions??null:null;
}

function factualConsumerBaseline({review,carsRoot,dealerRoot,dealer}) {
  if(!review)return null;
  if(!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(dealer)||fs.realpathSync(path.join(carsRoot,'clients',dealer))!==fs.realpathSync(dealerRoot)||!review.baseline||!/^[a-f0-9]{40}$/.test(review.baseline.commit)||!/^[a-f0-9]{40}$/.test(review.baseline.tree))throw new Error('Reviewed factual baseline requires the ordinary canonical dealer');
  if(git(carsRoot,['merge-base','--is-ancestor',review.baseline.commit,'HEAD'],{allowFailure:true})===null||git(carsRoot,['rev-parse',`${review.baseline.commit}:clients/${dealer}`])!==review.baseline.tree||git(carsRoot,['rev-parse',`HEAD:clients/${dealer}`])!==review.baseline.tree)throw new Error('Reviewed factual dealer baseline is no longer the published current source');
  return structuredClone(review.baseline);
}

function applyFactualReviewToPlan({plan,dealerRoot,carsRoot,manifest,qualification,selection,registeredAdoption,refreshFacts,templatePalette,factualProof,oldBases,newBases,review,resolutions}) {
  if(!review)return null;
  const baseline=factualConsumerBaseline({review,carsRoot,dealerRoot,dealer:manifest.slug});
  const original=new Map([['import/src/lib/config/dealer.ts',fs.readFileSync(path.join(dealerRoot,'import/src/lib/config/dealer.ts'))]]);
  return applyReviewedFactualConsumerResolutions({plan,original,oldBases,newBases,review,manifest,qualification,designSet:selection.designSet,selectedKeys:selection.selectedKeys,registeredAdoption,refreshFacts,templatePalette,factualProof,baseline,resolutions});
}

function readDirectoryTree(root) {
  const files = new Map();
  const walk = (directory, relative = '') => {
    for (const entry of fs.readdirSync(directory, { withFileTypes: true })) {
      const name = relative ? `${relative}/${entry.name}` : entry.name;
      const file = path.join(directory, entry.name);
      if (entry.isDirectory()) walk(file, name);
      else if (entry.isFile()) files.set(name, fs.readFileSync(file));
      else throw new Error(`Candidate contains a link or special file at ${name}`);
    }
  };
  walk(root);
  return files;
}

function writeDirectoryTreeChanges(root, before, after, assetPool) {
  for (const name of new Set([...before.keys(), ...after.keys()])) {
    const oldBytes = before.get(name) ?? null;
    const newBytes = after.get(name) ?? null;
    if (oldBytes && newBytes && oldBytes.equals(newBytes)) continue;
    const target = path.join(root, name);
    if (newBytes === null) fs.rmSync(target, { force: true });
    else {
      fs.mkdirSync(path.dirname(target), { recursive: true });
      replaceCandidateFile(target,newBytes,{assetPool,expectedPreviousSha256:oldBytes===null?null:sha256(oldBytes)});
    }
  }
}

export async function regenerateDealerCatalogs(candidateDirectory, carsRoot = defaultCarsRoot(), selectedKeys = ['auto-best','carwow']) {
  for (const key of ['auto-best', 'carwow'].filter(key=>selectedKeys.includes(key))) {
    const directory = path.join(candidateDirectory, key);
    if (!fs.existsSync(directory)) continue;
    const scriptFile = path.join(directory, 'scripts/build-locales.mjs');
    let script = fs.readFileSync(scriptFile, 'utf8');
    const rootStatement = "const root = path.resolve(import.meta.dirname, '..');";
    if (script.split(rootStatement).length !== 2) throw new Error(`${key}: unreviewed catalog generator root`);
    script = script.replace(rootStatement, `const root = ${JSON.stringify(directory)};`)
      .replace("from './locale-catalog.mjs'", `from ${JSON.stringify(pathToFileURL(path.join(directory, 'scripts/locale-catalog.mjs')).href)}`);
    if (script.includes("from 'prettier'")) {
      const require = createRequire(path.join(carsRoot, 'templates', key, 'package.json'));
      script = script.replace("from 'prettier'", `from ${JSON.stringify(pathToFileURL(require.resolve('prettier')).href)}`);
      // These generated files are TS object literals and JSON. UI plugins are
      // unnecessary and resolve their stylesheet relative to the caller cwd.
      script = script.replaceAll('...prettierOptions, parser:',
        '...prettierOptions, plugins: [], parser:');
    }
    // Execute the existing reviewed generator against this derived source only.
    await import(`data:text/javascript;base64,${Buffer.from(script).toString('base64')}#${++catalogGeneration}`);
  }
}

export function updateSelection(manifest, { designSet, variants } = {}) {
  if (designSet !== undefined && designSet !== 'six') throw new Error('The supported design migration is --design-set six');
  const targetVariants = designSet === 'six' ? planSixDesignSelection(manifest.variants).variants : manifest.variants;
  const selectedKeys = typeof variants === 'string' ? variants.split(',').map(key=>key.trim()) : variants;
  if (selectedKeys && manifest.packaging?.version === '1') throw new Error('Selective updates require the native source workflow; migrate the legacy package first');
  return { targetVariants, selectedKeys };
}

/** Newly selected families reuse the same fact pack and adapters as ordinary dealer work. */
async function personalizeAddedBases({ pins, newBases, dealerRoot, manifest, registeredAdoption }) {
  // Registered source is personalized consistently after the preservation merge.
  if(registeredAdoption){assertRegisteredAdoptionPlan(registeredAdoption,{dealerRoot,manifest});return {};}
  const added = Object.entries(pins).filter(([,pin])=>pin.from === null);
  if (!added.length) return {};
  const profile = registeredAdoption?.profile ?? loadDealerProfile(dealerRoot,manifest.slug), adaptation = {};
  for (const [key] of added) {
    if (Object.hasOwn(EXTENDED_VARIANT_RECEIPTS,key)) {
      const files = new Map([...newBases[key]].map(([name,bytes])=>[key+'/'+name,bytes]));
      adaptation[key] = applyExtendedRefreshAdapter({files,key,profile,client:dealerRoot});
      newBases[key] = splitPrefixedTrees(files,[key])[key];
      continue;
    }
    if (!['modern','import'].includes(key)) throw new Error(`An added ${key} needs its reviewed dealer adapter; no template identity fallback`);
    const tempRoot = fs.mkdtempSync(path.join(process.env.TEMP || process.env.TMP || dealerRoot,'cars-added-variant-'));
    try {
      writeDirectoryTreeChanges(tempRoot,new Map(),newBases[key]);
      applyRefreshAdapter({key,oldVariant:path.join(dealerRoot,key),candidate:tempRoot,profile});
      newBases[key] = new Map(filesAt(tempRoot).map(name=>[name,fs.readFileSync(path.join(tempRoot,name))]));
      const prefixed = new Map([...newBases[key]].map(([name,bytes])=>[key+'/'+name,bytes]));
      retainDealerVariantAssets(prefixed,key,profile,dealerRoot);
      newBases[key] = splitPrefixedTrees(prefixed,[key])[key];
    } finally {
      // The unique adapter directory is our own derived output; preserve dealer/master source.
      const absolute = fs.realpathSync(tempRoot);
      if (path.dirname(absolute) === absolute || !path.basename(absolute).startsWith('cars-added-variant-')) throw new Error('Unsafe temporary adapter cleanup target');
      fs.rmSync(absolute,{recursive:true,force:true});
    }
  }
  return adaptation;
}


/** Exact display-copy input; immutable listing facts and source files stay unchanged. */
export function assertReviewedModernCopy({profile,value}) {
  if(value?.schemaVersion!==1||value.kind!=='cars-reviewed-modern-bilingual-copy-input'||value.dealer!==profile.slug||!Number.isSafeInteger(value.listingCount))throw Error('Exact dealer-scoped Modern display-copy input required');
  if(value.reviewedGeneratorHelper?.path!=='scripts/lib/modern-dealer-inventory-copy.mjs'||value.reviewedGeneratorHelper?.sha256!=='cbdbaa28dc07911cfe913b4e627671b6556fc25d3bfe59364e29c5ca5a29072b')throw Error('Exact reviewed maintained Modern copy helper required');
  if(!/^[a-f0-9]{40}$/.test(value.sourceCommit??'')||!/^[a-f0-9]{40}$/.test(value.baselineTree??'')||!/^[a-f0-9]{64}$/.test(value.inputSha256??'')||!/^[a-f0-9]{64}$/.test(value.modernInputRowsSha256??''))throw Error('Exact Modern source/input leases required');
  for(const key of ['displayCopyOnly','exactSourceDescriptionKeys','listingFactsUnchanged','imageUrlsUnchanged','imageAltsPreserved','interpolationTokensUnchanged'])if(value.review?.[key]!==true)throw Error('Modern display-copy review declaration missing: '+key);
  if(typeof value.review.reviewedBy!=='string'||!value.review.reviewedBy.trim())throw Error('Modern display-copy reviewer required');
  const rows=profile.listings.map(item=>({slug:item.slug,description:item.description||profile.business.inventoryNotice,images:item.images.map(url=>({url,alt:item.title}))}));
  if(value.listingCount!==rows.length||sha256(JSON.stringify(rows))!==value.modernInputRowsSha256||JSON.stringify(Object.keys(value.reviewedCopy??{}).sort())!==JSON.stringify(rows.map(x=>x.slug).sort()))throw Error('Reviewed Modern copy differs from exact normalized listing inputs');
  const copy=buildModernDealerInventoryCopy(rows,{reviewedCopy:value.reviewedCopy});
  for(const row of rows)for(const locale of ['en','bg'])if(JSON.stringify(copy[row.slug][locale].imageAlts)!==JSON.stringify(row.images.map(x=>x.alt)))throw Error('Reviewed Modern copy changed factual image alts: '+row.slug);
  return {rows:rows.length,modernInputRowsSha256:value.modernInputRowsSha256,reviewedCopySha256:sha256(JSON.stringify(copy))};
}
export function loadModernCopyReview({carsRoot,dealerRoot,dealer,pin}) {
  const artifact=qualificationArtifact(carsRoot,pin.path),relative=path.relative(carsRoot,artifact.file).replaceAll('\\','/');
  if(relative!=='docs/releases/cloudflare-existing25-20261011/vercel-existing-source/'+dealer+'/modern-copy-review.json'||!/^[a-f0-9]{64}$/.test(pin.sha256??'')||artifact.sha256!==pin.sha256)throw Error('Exact bounded dealer Modern copy path/hash required');
  const value=artifact.value,profile=loadDealerProfile(dealerRoot,dealer);assertReviewedModernCopy({profile,value});
  if(git(carsRoot,['--no-lazy-fetch','rev-parse',value.sourceCommit+':clients/'+dealer])!==value.baselineTree)throw Error('Reviewed Modern copy immutable client tree differs');
  if(!Array.isArray(value.profileInputs)||JSON.stringify(value.profileInputs.map(x=>x.path).sort())!==JSON.stringify(['business-facts.json','dealer.json','stock.json']))throw Error('Exact original Modern factual input inventory required');
  for(const row of value.profileInputs){
    const file=path.join(dealerRoot,row.path),stat=fs.lstatSync(file),bytes=fs.readFileSync(file);
    if(!stat.isFile()||stat.isSymbolicLink()||!samePath(fs.realpathSync(file),file)||bytes.length!==row.bytes||sha256(bytes)!==row.sha256||crypto.createHash('sha1').update('blob '+bytes.length+'\0').update(bytes).digest('hex')!==row.gitBlob||git(carsRoot,['--no-lazy-fetch','rev-parse',value.sourceCommit+':clients/'+dealer+'/'+row.path])!==row.gitBlob)throw Error('Reviewed Modern source facts changed: '+row.path);
  }
  return {...artifact,path:relative};
}

/** Explicit factual refresh uses fresh pinned target trees, never a twice-personalized candidate. */
export async function personalizeFactualTargetBases({pins,newBases,dealerRoot,manifest,modernCopyReview=null,appInventoryNoticeReview=null,carsRoot}) {
  const keys=['auto-best','modern','import','app','mobile','karento-best'];
  if(JSON.stringify(Object.keys(pins).sort())!==JSON.stringify([...keys].sort()) || manifest.packaging?.version!=='5')throw new Error('Factual refresh requires all six qualified target families');
  if(appInventoryNoticeReview!=null){if(!carsRoot)throw Error('Canonical root required for reviewed App notice');factualConsumerBaseline({review:appInventoryNoticeReview,carsRoot,dealerRoot,dealer:manifest.slug});}
  return personalizePinnedTargetBases({pins,newBases,dealerRoot,manifest,profile:loadDealerProfile(dealerRoot,manifest.slug),modernCopyReview,appInventoryNoticeReview});
}

async function personalizePinnedTargetBases({pins,newBases,dealerRoot,manifest,profile,modernCopyReview=null,appInventoryNoticeReview=null}) {
  const keys=['auto-best','modern','import','app','mobile','karento-best'];
  const consumerPaths=new Set(),adaptations={};
  if(modernCopyReview)assertReviewedModernCopy({profile,value:modernCopyReview.value});
  const note=(before,after,prefix='')=>{
    for(const name of new Set([...before.keys(),...after.keys()])) {
      const prior=before.get(name),next=after.get(name);
      if(prior&&next&&prior.equals(next))continue;
      if(!next)throw new Error('Factual adapter unexpectedly removed a target path: '+prefix+name);
      consumerPaths.add(prefix+name);
    }
  };
  for(const key of ['auto-best','modern','import']) {
    const scratchParent=fs.realpathSync(process.env.TEMP||process.env.TMP||dealerRoot),tempRoot=fs.mkdtempSync(path.join(scratchParent,'cars-factual-target-'));
    try {
      const before=new Map(newBases[key]),textInputs=new Map([...before].filter(([,bytes])=>!bytes.includes(0)&&Buffer.from(bytes.toString('utf8')).equals(bytes)));writeDirectoryTreeChanges(tempRoot,new Map(),textInputs);
      applyRefreshAdapter({key,oldVariant:path.join(dealerRoot,key),candidate:tempRoot,profile,...(['modern','import'].includes(key)&&modernCopyReview?{reviewedModernCopy:modernCopyReview.value.reviewedCopy}:{})});
      const derived=readDirectoryTree(tempRoot);for(const name of textInputs.keys())if(!derived.has(name))throw new Error('Factual adapter unexpectedly removed a target input: '+key+'/'+name);let after=new Map([...before,...derived]);
      const retained=new Map([...after].map(([name,bytes])=>[key+'/'+name,bytes]));
      retainDealerVariantAssets(retained,key,profile,dealerRoot);
      after=splitPrefixedTrees(retained,[key])[key];note(before,after,key+'/');newBases[key]=after;
    } finally {
      const absolute=fs.realpathSync(tempRoot);
      if(path.dirname(absolute)!==scratchParent||!path.basename(absolute).startsWith('cars-factual-target-'))throw new Error('Unsafe factual target scratch cleanup');
      fs.rmSync(absolute,{recursive:true,force:true});
    }
  }
  const generated=new Map();for(const key of keys)addPrefixedTree(generated,key,newBases[key]);
  const readFile=name=>{
    if(generated.has(name))return generated.get(name);
    return fs.readFileSync(path.join(dealerRoot,name));
  };
  const app=await prepareAppDealer(dealerRoot,manifest,{readFile,appFiles:newBases.app});
  const appNoticeProof=appInventoryNoticeReview!=null?preserveReviewedAppInventoryNotice({app,currentBytes:fs.readFileSync(path.join(dealerRoot,'app/lib/dealer.json')),profileBytes:readFile('auto-best/src/lib/data/dealer-profile.json'),review:appInventoryNoticeReview,manifest,baseline:appInventoryNoticeReview.baseline,targetSources:Object.fromEntries(keys.map(key=>[key,renderPins(pins[key].targetSource)]))}):null;
  for(const [name,bytes]of app.files){generated.set('app/'+name,bytes);consumerPaths.add('app/'+name);}
  const beforeExtended=new Map(generated);
  for(const key of ['mobile','karento-best'])adaptations[key]=applyExtendedRefreshAdapter({files:generated,key,profile,client:dealerRoot});
  note(beforeExtended,generated);
  const split=splitPrefixedTrees(generated,keys);for(const key of keys)newBases[key]=split[key];
  if(keys.some(key=>![...consumerPaths].some(name=>name.startsWith(key+'/'))))throw new Error('Every factual target family needs exact consumer proof');
  return {adaptations,appProvenance:app.provenance,proof:{schemaVersion:1,stage:'preservation-merge-before-native-catalogs-and-branding',mode:'current-facts-from-pinned-six-targets',dealer:manifest.slug,profileSha256:sha256(JSON.stringify(profile)),
    targetSources:Object.fromEntries(keys.map(key=>[key,renderPins(pins[key].targetSource)])),consumerPaths:[...consumerPaths].sort(),...(appNoticeProof?{appInventoryNoticePreservation:appNoticeProof}:{}),...(modernCopyReview?{modernCopyReview:{path:modernCopyReview.path,sha256:modernCopyReview.sha256,modernInputRowsSha256:modernCopyReview.value.modernInputRowsSha256}}:{})}};
}

/** A reviewed dealer resolution cannot retain stale facts and receive a new profile seal. */
export function assertFactualRefreshCandidate({candidate,newBases,proof}) {
  const keys=['auto-best','modern','import','app','mobile','karento-best'];
  if(!proof || proof.schemaVersion!==1 || proof.stage!=='preservation-merge-before-native-catalogs-and-branding' || proof.mode!=='current-facts-from-pinned-six-targets' || !/^[a-f0-9]{64}$/.test(proof.profileSha256??'') || JSON.stringify(Object.keys(proof.targetSources??{}).sort())!==JSON.stringify([...keys].sort()) || !Array.isArray(proof.consumerPaths) || !proof.consumerPaths.length || new Set(proof.consumerPaths).size!==proof.consumerPaths.length || JSON.stringify(proof.consumerPaths)!==JSON.stringify([...proof.consumerPaths].sort()) || proof.consumerPaths.some(name=>typeof name!=='string'||!keys.includes(name.split('/')[0])||name.split('/').some(part=>!part||part==='.'||part==='..')||name.includes('\\')) || keys.some(key=>!proof.consumerPaths.some(name=>name.startsWith(key+'/'))))throw new Error('Exact factual target proof required');
  const consumerHashes=[];
  for(const name of proof.consumerPaths) {
    const slash=name.indexOf('/'),key=name.slice(0,slash),relative=name.slice(slash+1);
    const expected=newBases[key]?.get(relative),actual=candidate.get(name);
    if(!expected||!actual||!actual.equals(expected))throw new Error('Factual target differs after preservation; review custom factual consumer: '+name);
    consumerHashes.push({path:name,sha256:sha256(expected)});
  }
  return {...proof,consumerHashes};
}

export function assertFactualRefreshReplay({proof,metadata,newBases}){
  const candidate=new Map();for(const [key,files]of Object.entries(newBases))for(const [name,bytes]of files)candidate.set(key+'/'+name,bytes);
  const current=assertFactualRefreshCandidate({candidate,newBases,proof});
  if(metadata.selection?.refreshFacts!==true||metadata.registeredAdoption||JSON.stringify(current)!==JSON.stringify(metadata.factualRefresh))throw new Error('Current factual profile, target pins or consumer bytes changed after review');return current;
}

export function assertFactualRefreshAdmission({enabled,designSet,selectedKeys,qualification,registeredAdoption,manifest}) {
 if(!enabled)return;
 if(enabled!==true||designSet!=='six'||selectedKeys||registeredAdoption||!qualification||!['2','3','5'].includes(manifest?.packaging?.version))throw new Error('Explicit factual refresh requires ordinary native source, all six families and reviewed qualification');
 validateNativeQualificationContext(qualification,{dealer:manifest.slug});
}

/** Reject any registered adapter delta that would erase a preserved custom consumer. */
export function assertRegisteredPersonalizationPreservation({before,after,newBases}) {
  const families=['auto-best','modern','import','app','mobile','karento-best'];
  if(!(before instanceof Map)||!(after instanceof Map)||families.some(key=>!(newBases?.[key] instanceof Map)))throw new Error('Registered personalization requires exact mounted target bases');
  const consumerHashes=[];
  for(const name of [...new Set([...before.keys(),...after.keys()])].sort()) {
    const slash=name.indexOf('/'),key=name.slice(0,slash);if(!families.includes(key))continue;
    const prior=before.get(name),next=after.get(name);if(prior&&next&&prior.equals(next))continue;
    if(!next)throw new Error('Registered personalization removed a preserved path: '+name);
    // Reviewed rasters have their own exact input lease. Text consumers must have no preserved custom bytes.
    const text=prior&&!/\.(?:png|webp|jpe?g|gif|ico|avif|woff2?|ttf|eot)$/i.test(name);
    if(text){const target=newBases[key].get(name.slice(slash+1));if(!target||!target.equals(prior))throw new Error('Registered personalization would overwrite a custom consumer; review a template resolution: '+name);}
    consumerHashes.push({path:name,sha256:sha256(next)});
  }
  return {schemaVersion:1,stage:'personalization-before-native-catalogs-and-branding',mode:'mounted-template-text-consumers-only',consumerHashes};
}

/** Derive registered consumer ownership through the maintained target adapters. */
export async function deriveRegisteredConsumerTargets({registeredAdoption,assetView,newBases,manifest}) {
  assertRegisteredAdoptionPlan(registeredAdoption);assertRegisteredAssetView(registeredAdoption,assetView);
  assertRegisteredMountOwnership(manifest,{files:new Map(),commit:registeredAdoption.baseline.commit,tree:registeredAdoption.baseline.tree},registeredAdoption);
  const keys=['auto-best','modern','import','app','mobile','karento-best'];
  if(keys.some(key=>!(newBases?.[key] instanceof Map))||JSON.stringify(Object.keys(newBases).sort())!==JSON.stringify([...keys].sort()))throw new Error('Registered resolution requires exact six mounted targets');
  const personalizedBases=Object.fromEntries(keys.map(key=>[key,new Map(newBases[key])])),pins=Object.fromEntries(keys.map(key=>[key,{targetSource:manifest.templateSources[key]}]));
  await personalizePinnedTargetBases({pins,newBases:personalizedBases,dealerRoot:assetView,manifest,profile:registeredAdoption.profile});
  assertRegisteredAssetView(registeredAdoption,assetView);return personalizedBases;
}

/** Pure registered review planner; generic three-way resolution behavior stays unchanged. */
export function planReviewedRegisteredConsumerResolutions({before,original,newBases,personalizedBases,review,dealer,baseline,targetSources}) {
  if(!(before instanceof Map)||!(original instanceof Map))throw new Error('Exact registered source and merged maps required');
  if(review===null||review===undefined)return {candidate:new Map(before),proof:null};
  const keys=['auto-best','modern','import','app','mobile','karento-best'],equal=(a,b)=>JSON.stringify(a)===JSON.stringify(b),digest=bytes=>bytes?sha256(bytes):null;
  if(review.schemaVersion!==1||review.kind!=='cars-registered-consumer-template-resolutions'||review.reviewed!==true||review.dealer!==dealer||!equal(review.baseline,baseline)||!equal(review.targetSources,targetSources)||!Array.isArray(review.paths)||!review.paths.length||review.paths.length>256||keys.some(key=>!(newBases?.[key] instanceof Map)||!(personalizedBases?.[key] instanceof Map)))throw new Error('Exact reviewed registered consumer resolution receipt required');
  const names=review.paths.map(item=>item?.path);if(new Set(names).size!==names.length||!equal(names,[...names].sort()))throw new Error('Registered consumer paths must be unique and sorted');
  const changes=[];
  for(const item of review.paths){
    const name=item.path;if(typeof name!=='string'||name.includes('\\')||name.split('/').some(part=>!part||part==='.'||part==='..')||!keys.includes(name.split('/')[0])||/\.(?:png|webp|jpe?g|gif|ico|avif|woff2?|ttf|eot)$/i.test(name)||item.choice!=='template')throw new Error('Only exact adapter-owned text template resolutions are allowed');
    const slash=name.indexOf('/'),key=name.slice(0,slash),relative=name.slice(slash+1),target=newBases[key].get(relative),personalized=personalizedBases[key].get(relative),merged=before.get(name),raw=original.get(name);
    if(!target||!personalized||!merged||target.equals(personalized)||target.includes(0)||personalized.includes(0)||!Buffer.from(target.toString('utf8')).equals(target)||!Buffer.from(personalized.toString('utf8')).equals(personalized))throw new Error('Unknown or unchanged registered adapter consumer: '+name);
    if(merged.equals(target))throw new Error('Registered consumer already has the exact mounted target: '+name);
    if(item.originalSha256!==digest(raw)||item.mergedSha256!==digest(merged)||item.targetSha256!==digest(target)||item.personalizedTargetSha256!==digest(personalized))throw new Error('Registered consumer path/hash lease changed: '+name);
    changes.push({path:name,choice:'template',originalSha256:digest(raw),mergedSha256:digest(merged),targetSha256:digest(target),personalizedTargetSha256:digest(personalized)});
  }
  const candidate=new Map(before);for(const item of changes){const slash=item.path.indexOf('/');candidate.set(item.path,Buffer.from(newBases[item.path.slice(0,slash)].get(item.path.slice(slash+1))));}
  return {candidate,proof:{schemaVersion:1,stage:'preservation-merge-before-personalization',mode:'explicit-reviewed-registered-template-consumers',dealer,baseline:structuredClone(baseline),targetSources:structuredClone(targetSources),reviewSha256:sha256(JSON.stringify(review)),paths:changes}};
}

async function applyReviewedRegisteredConsumerResolutions({registeredAdoption,assetView,candidateDirectory,dealerRoot,manifest,newBases,review,assetPool}) {
  assertRegisteredAdoptionPlan(registeredAdoption,{dealerRoot});assertRegisteredAssetView(registeredAdoption,assetView);assertRegisteredCandidateDirectory(registeredAdoption,candidateDirectory);
  if(review?.schemaVersion!==1||review.kind!=='cars-registered-consumer-template-resolutions'||review.reviewed!==true||review.dealer!==registeredAdoption.dealer||JSON.stringify(review.baseline)!==JSON.stringify(registeredAdoption.baseline)||JSON.stringify(review.targetSources)!==JSON.stringify(manifest.templateSources)||!Array.isArray(review.paths)||!review.paths.length)throw new Error('Exact reviewed registered consumer resolution receipt required');
  const personalizedBases=await deriveRegisteredConsumerTargets({registeredAdoption,assetView,newBases,manifest}),before=readDirectoryTree(candidateDirectory),original=new Map();
  for(const item of review?.paths??[]){const name=item?.path;if(typeof name!=='string'||name.includes('\\')||name.split('/').some(part=>!part||part==='.'||part==='..')||name.startsWith('/')||/^[a-z]:/i.test(name))throw new Error('Unsafe registered resolution source path');const file=path.join(dealerRoot,name);if(fs.existsSync(file)){if(!fs.lstatSync(file).isFile())throw new Error('Registered resolution source is not a physical file');original.set(name,fs.readFileSync(file));}}
  const planned=planReviewedRegisteredConsumerResolutions({before,original,newBases,personalizedBases,review,dealer:registeredAdoption.dealer,baseline:registeredAdoption.baseline,targetSources:manifest.templateSources});
  writeDirectoryTreeChanges(candidateDirectory,before,planned.candidate,assetPool);assertRegisteredAssetView(registeredAdoption,assetView);return planned.proof;
}


/** Reuse maintained adapters after merge; only the authenticated asset view supplies inputs. */
export async function personalizeRegisteredCandidate({registeredAdoption,assetView,candidateDirectory,manifest,assetPool,newBases}) {
  assertRegisteredAdoptionPlan(registeredAdoption);assertRegisteredAssetView(registeredAdoption,assetView);assertRegisteredCandidateDirectory(registeredAdoption,candidateDirectory);assertRegisteredMountOwnership(manifest,{files:new Map(),commit:registeredAdoption.baseline.commit,tree:registeredAdoption.baseline.tree},registeredAdoption);
  const profile=registeredAdoption.profile,adaptations={},original=readDirectoryTree(candidateDirectory);
  for(const key of ['auto-best','modern','import']){
    const assets=new Map();retainDealerVariantAssets(assets,key,profile,assetView);
    const before=readDirectoryTree(candidateDirectory),after=new Map([...before,...assets]);writeDirectoryTreeChanges(candidateDirectory,before,after,assetPool);
    applyRefreshAdapter({key,oldVariant:path.join(assetView,key),candidate:path.join(candidateDirectory,key),profile});
  }
  const before=readDirectoryTree(candidateDirectory),files=new Map(before),appFiles=new Map([...files].filter(([name])=>name.startsWith('app/')).map(([name,bytes])=>[name.slice(4),bytes]));
  const readFile=name=>{const bytes=files.get(name);if(!bytes){const error=Error('Missing reviewed candidate input: '+name);error.code='ENOENT';throw error;}return bytes;};
  const app=await prepareAppDealer(candidateDirectory,manifest,{appFiles,readFile});for(const [name,bytes]of app.files)files.set('app/'+name,bytes);
  const icon=fs.readFileSync(path.join(assetView,profile.business.logo.slice(1)));files.set('app/public/dealer-app/icon.png',icon);
  for(const key of ['mobile','karento-best'])adaptations[key]=applyExtendedRefreshAdapter({files,key,profile,client:assetView});
  // The share-identity source remains a retained exact reviewed raster.
  for(const publicName of new Set([profile.business.logo,profile.business.logoDark]))files.set(publicName.slice(1),fs.readFileSync(path.join(assetView,publicName.slice(1))));
  const preservation=assertRegisteredPersonalizationPreservation({before:original,after:files,newBases});
  sealAppDealerSource({files,manifest,provenance:app.provenance});
  writeDirectoryTreeChanges(candidateDirectory,before,files,assetPool);assertRegisteredAssetView(registeredAdoption,assetView);
  return {adaptations,preservation};
}

/** Preserve exact old Carwow links while the published third family changes. */
export function addLegacyDetailUpgrade({ files, dealerRoot, manifest, pins, registeredAdoption }) {
  if(registeredAdoption){assertRegisteredAdoptionPlan(registeredAdoption,{dealerRoot});return null;}
  if (manifest.packaging?.version !== SIX_DESIGN_PACKAGING_CANDIDATE) return null;
  const original=readJson(path.join(dealerRoot,'dealer.json'));
  const migration=original.variants?.some(variant=>variant.key==='carwow'&&variant.base==='/variant-3');
  const third=manifest.variants.find(variant=>variant.base==='/variant-3');
  if (!migration && !(manifest.legacyDetailRoutes && pins?.[third?.key])) {
    // Signature-only refreshes retain the existing exact map byte for byte.
    legacyDetailArtifact(files,manifest);
    return null;
  }
  const profile=loadDealerProfile(dealerRoot,manifest.slug);
  const mapping=buildLegacyDetailRouteMap({dealerRoot,profile,manifest});
  manifest.legacyDetailRoutes=mapping.reference;
  files.set(LEGACY_DETAIL_FILE,mapping.bytes);
  files.set('dealer.json',Buffer.from(JSON.stringify(manifest,null,2)+'\n'));
  return {entries:mapping.artifact.entries.length,retired:mapping.artifact.retired.length,reference:mapping.reference};
}

function pinnedPaletteConfigs(newBases, pins, enabled) {
  if (!enabled) return {};
  const configs = {};
  for (const key of Object.keys(pins)) {
    const configPath = templatePaletteConfigPath(key);
    if (!configPath) continue;
    const bytes = newBases[key]?.get(configPath);
    if (!Buffer.isBuffer(bytes)) throw new Error(`${key}: selected immutable template palette config is missing`);
    configs[key] = Buffer.from(bytes);
  }
  return configs;
}

/** Runs after the preservation merge and before any native/source seal. */
export function restorePinnedTemplatePalettes({ plan, candidateDirectory, templatePalette = false, templatePaletteConfigs = {} }) {
  if (!templatePalette) return null;
  const corrections = [];
  for (const [key, pin] of Object.entries(plan.pins)) {
    if (!templatePaletteConfigPath(key)) continue;
    const templateConfigBuffer = templatePaletteConfigs[key];
    if (!Buffer.isBuffer(templateConfigBuffer)) throw new Error(`${key}: exact pinned template palette bytes are required`);
    corrections.push({ ...restoreTemplatePalette({key, templateConfigBuffer, candidate:path.join(candidateDirectory,key)}), source:renderPins(pin.targetSource) });
  }
  return { schemaVersion:1, mode:'selected-template-palette', corrections };
}

function reviewedUpgradeReport(plan) {
  const review = upgradeReviewReport(plan);
  if (plan.templatePalette) review.templatePalette = plan.templatePalette;
  if (plan.nativeQualification) review.nativeQualification = plan.nativeQualification;
  if (plan.factualRefresh) review.factualRefresh = plan.factualRefresh;
  if (plan.factualConsumerResolutions) review.factualConsumerResolutions = plan.factualConsumerResolutions;
  if (plan.registeredPersonalizationPreservation) review.registeredPersonalizationPreservation = plan.registeredPersonalizationPreservation;
  return review;
}

async function addNativeAdoption(plan, candidateDirectory, dealerRoot, lock, {carsRoot, refreshedAt, extendedAdaptations = {}, candidateAssetPool, templatePalette = false, templatePaletteConfigs, qualification, registeredAdoption,registeredAssetView,registeredTargetBases,factualAppProvenance,registeredConsumerReview} = {}) {
  if(registeredConsumerReview&&(!registeredAdoption||!registeredAssetView||!registeredTargetBases))throw new Error('Reviewed consumer resolutions require authenticated registered profile/view/targets');
  if(registeredAdoption){assertRegisteredAdoptionPlan(registeredAdoption,{dealerRoot});const before=readDirectoryTree(candidateDirectory),after=new Map(before);for(const [name,bytes]of registeredAdoption.files){if(after.has(name)&&!after.get(name).equals(bytes))throw new Error('Registered adoption input destination is occupied');after.set(name,bytes);}writeDirectoryTreeChanges(candidateDirectory,before,after,candidateAssetPool);}
  if(registeredAssetView){const resolutionProof=registeredConsumerReview?await applyReviewedRegisteredConsumerResolutions({registeredAdoption,assetView:registeredAssetView,candidateDirectory,dealerRoot,manifest:plan.manifest,newBases:registeredTargetBases,review:registeredConsumerReview,assetPool:candidateAssetPool}):null;const derived=await personalizeRegisteredCandidate({registeredAdoption,assetView:registeredAssetView,candidateDirectory,manifest:plan.manifest,assetPool:candidateAssetPool,newBases:registeredTargetBases});extendedAdaptations=derived.adaptations;plan.registeredPersonalizationPreservation=resolutionProof?{...derived.preservation,templateResolutions:resolutionProof}:derived.preservation;}
  plan.templatePalette = restorePinnedTemplatePalettes({plan,candidateDirectory,templatePalette,templatePaletteConfigs});
  if (!['2', APP_PACKAGING_VERSION, SIX_DESIGN_PACKAGING_CANDIDATE].includes(plan.manifest.packaging.version)) {
    reconcilePlanWithCandidate({ source: dealerRoot, plan, candidateDirectory });
    return;
  }
  if (Object.keys(plan.pins).some(key=>['auto-best','modern','import','carwow'].includes(key))) await regenerateDealerCatalogs(candidateDirectory, carsRoot,Object.keys(plan.pins));
  const files = readDirectoryTree(candidateDirectory);
  const before = new Map([...files].map(([name, bytes]) => [name, Buffer.from(bytes)]));
  const candidateManifest = JSON.parse(files.get('dealer.json').toString('utf8').replace(/^\uFEFF/, ''));
  addLegacyDetailUpgrade({files,dealerRoot,manifest:candidateManifest,pins:plan.pins,registeredAdoption});
  plan.manifest=candidateManifest;
  validatePackagingManifest(candidateManifest);
  if(plan.factualRefresh&&factualAppProvenance)sealAppDealerSource({files,manifest:candidateManifest,provenance:factualAppProvenance});
  const baseManifest = baseNativeManifest(candidateManifest);
  const selectedNative = baseManifest.variants.some(({key})=>plan.pins[key]);
  const retainedFiles = new Map([...files].filter(([name]) => packageRetainsPath(name)));
  const adopted = qualification ? adoptNativeQualification(retainedFiles,baseManifest,lock.templates,qualification,{root:carsRoot}) : selectedNative ? adoptNativeSource(retainedFiles, baseManifest, lock.templates,{root:carsRoot}) : retainedFiles;
  if (qualification) {
    const receipt=assertNativeQualification(adopted,baseManifest,qualification,{root:carsRoot});
    plan.nativeQualification={context:structuredClone(qualification),contextDigest:receipt.contextDigest,receiptSha256:sha256(adopted.get(ADOPTION_FILE)),nativeApproval:false};
  } else assertNativeAdoption(adopted, baseManifest,{root:carsRoot});
  if ([APP_PACKAGING_VERSION,SIX_DESIGN_PACKAGING_CANDIDATE].includes(candidateManifest.packaging.version) && plan.pins.app) {
    const appSource = candidateManifest.templateSources.app;
    candidateManifest.appVariant = { ...candidateManifest.appVariant, source: appSource };
    const appFiles = new Map();
    // Binary assets retain their exact bytes; normalize only valid UTF-8 text.
    for (const [name, bytes] of adopted) if (name.startsWith('app/') && packageRetainsPath(name)) {
      const text = bytes.toString('utf8');
      appFiles.set(name.slice(4), !bytes.includes(0) && Buffer.from(text).equals(bytes) ? Buffer.from(text.replace(/\r\n/g, '\n')) : bytes);
    }
    const receipt = JSON.parse(adopted.get('.cars-app.json').toString('utf8'));
    receipt.template = appSource;
    receipt.appDigest = sha256(Buffer.from(JSON.stringify([...appFiles].sort(([a], [b]) => a < b ? -1 : a > b ? 1 : 0).map(([name, bytes]) => [name, sha256(bytes)]))));
    receipt.refreshedAt = refreshedAt;
    adopted.set('.cars-app.json', Buffer.from(JSON.stringify(receipt, null, 2) + '\n'));
    adopted.set('dealer.json', Buffer.from(JSON.stringify(candidateManifest, null, 2) + '\n'));
    assertAppVariant(new Map([...adopted].filter(([name]) => packageRetainsPath(name))), candidateManifest);
    plan.manifest = candidateManifest;
  }
  if (candidateManifest.packaging.version === SIX_DESIGN_PACKAGING_CANDIDATE) {
    const profile = registeredAdoption?.profile ?? loadDealerProfile(dealerRoot,candidateManifest.slug);
    for (const key of Object.keys(EXTENDED_VARIANT_RECEIPTS).filter(key=>plan.pins[key])) {
      const current = files.has(EXTENDED_VARIANT_RECEIPTS[key]) ? JSON.parse(files.get(EXTENDED_VARIANT_RECEIPTS[key]).toString()) : null;
      const p = current?.personalization;
      const adaptation = extendedAdaptations[key] || (p ? {...p,nativeFacts:p.nativeDealerFacts===true} : {
        logoPaths: [...new Set([profile.business.logo,profile.business.logoDark].filter(Boolean))],
        mediaPaths:[...new Set(profile.listings.flatMap(car=>car.images))],
        contentPaths:key==='mobile' ? ['mobile/src/lib/showroom-config.ts','mobile/src/lib/catalog.ts','mobile/src/lib/dealer-inventory.json','mobile/src/lib/dealers.ts'] :
          ['karento-best/src/lib/content.ts','karento-best/src/lib/data/vehicles.ts','karento-best/src/lib/data/vehicle-listing.ts','karento-best/src/lib/data/dealer-vehicles.json']
      });
      sealExtendedVariant({files:adopted,key,manifest:candidateManifest,profile,adaptation});
    }
  }
  // Retain excluded dealer work in source; it is not part of the publish seal.
  const diskFiles = new Map([...files, ...adopted]);
  writeDirectoryTreeChanges(candidateDirectory, before, diskFiles, candidateAssetPool);
  reconcilePlanWithCandidate({ source: dealerRoot, plan, candidateDirectory });
}

/** Explicit CI candidate finalization after reviewed branding; it never installs source. */
export async function finalizeDealerTemplateCandidate({plan,candidateDirectory,dealerRoot,lock,...options}) {
  if (!plan?.ready || !Array.isArray(plan.changes) || !plan.pins || !plan.manifest) throw new Error('Reconstruct the ready reviewed plan, pins and candidate manifest before finalization');
  const root=fs.realpathSync(options.carsRoot || defaultCarsRoot());
  ensureInsideRuntime(root,candidateDirectory);
  if(pathsOverlap(fs.realpathSync(dealerRoot),fs.realpathSync(candidateDirectory)))throw new Error('Candidate finalization must stay separate from dealer source');
  if(options.qualification)validateNativeQualificationContext(options.qualification,{dealer:plan.manifest.slug});
  await addNativeAdoption(plan,candidateDirectory,dealerRoot,lock,{...options,carsRoot:root});
  return {plan,review:reviewedUpgradeReport(plan),candidateDigest:fingerprint(candidateDirectory).digest};
}

function readResolutionArtifact(runDirectory, metadata) {
  if (!metadata.resolutionsSha256) return {};
  const file = path.join(runDirectory, 'resolutions.json');
  const bytes = fs.readFileSync(file);
  if (sha256(bytes) !== metadata.resolutionsSha256) throw new Error('Saved resolutions changed after review; create a new update plan');
  return parseResolutions(bytes, metadata.pins);
}

function verifiedReviewArtifact(runDirectory, metadata) {
  const bytes = fs.readFileSync(path.join(runDirectory, 'review.json'));
  if (sha256(bytes) !== metadata.reviewSha256) throw new Error('Review report changed after planning');
  const review = JSON.parse(bytes.toString('utf8'));
  if (sha256(Buffer.from(JSON.stringify(review))) !== metadata.reviewDigest) {
    throw new Error('Review report digest does not match update run metadata');
  }
  if (!review.ready || JSON.stringify(review.pins) !== JSON.stringify(metadata.pins)) {
    throw new Error('Review report does not match the pinned update plan');
  }
  if (Boolean(review.templatePalette) !== (metadata.selection?.templatePalette === true) ||
      JSON.stringify(review.templatePalette ?? null) !== JSON.stringify(metadata.templatePalette ?? null)) {
    throw new Error('Template palette selection or correction receipt changed after review');
  }
  if (Boolean(review.nativeQualification) !== Boolean(metadata.qualification) ||
      JSON.stringify(review.nativeQualification ?? null) !== JSON.stringify(metadata.nativeQualification ?? null)) throw new Error('Source qualification mode or receipt changed after review');
  if(JSON.stringify(review.registeredPersonalizationPreservation??null)!==JSON.stringify(metadata.registeredPersonalizationPreservation??null))throw new Error('Registered preservation review proof changed');
  if(JSON.stringify(review.factualRefresh??null)!==JSON.stringify(metadata.factualRefresh??null))throw new Error('Factual refresh review proof changed');
  if(JSON.stringify(review.factualConsumerResolutions??null)!==JSON.stringify(metadata.factualConsumerResolutions??null))throw new Error('Factual consumer resolution review proof changed');
  return review;
}

function stableChangeHashes(changes) {
  return changes.map(({ path: name, beforeSha256, afterSha256 }) => ({
    path: String(name).replaceAll('\\', '/'),
    beforeSha256: beforeSha256 ?? null,
    afterSha256: afterSha256 ?? null
  })).sort((left, right) => left.path.localeCompare(right.path, 'en'));
}

function readReceiptOriginalManifest(runDirectory, receipt) {
  const runRoot = fs.realpathSync(runDirectory);
  const backup = path.resolve(receipt.rollbackDirectory || '');
  const relative = path.relative(runRoot, backup);
  if (!relative || relative === '..' || relative.startsWith(`..${path.sep}`) || path.isAbsolute(relative)) {
    throw new Error('Immutable rollback backup must remain inside the update run directory');
  }
  const physicalBackup = fs.realpathSync(backup);
  const physicalRelative = path.relative(runRoot, physicalBackup);
  if (!physicalRelative || physicalRelative === '..' || physicalRelative.startsWith(`..${path.sep}`) || path.isAbsolute(physicalRelative)) {
    throw new Error('Immutable rollback backup escapes the update run directory');
  }
  const manifestFile = path.join(physicalBackup, 'dealer.json');
  if (fs.lstatSync(manifestFile).isSymbolicLink()) throw new Error('Rollback dealer manifest cannot be a symlink');
  return readJson(manifestFile);
}

async function validatePinnedBaseEvidence(metadata, manifest, lock, paths) {
  const oldBases = {}, newBases = {};
  for (const [key, evidence] of Object.entries(metadata.bases)) {
    const oldSource = evidence.old;
    const targetSource = evidence.target;
    const oldTree = oldSource ? readPinnedTemplateTree({ key, repositoryPath: paths[oldSource.repository], source: oldSource }) : {tree:new Map(),digest:null};
    const targetTree = readPinnedTemplateTree({ key, repositoryPath: paths[targetSource.repository], source: targetSource });
    if (oldTree.digest !== (oldSource?.digest ?? null) || targetTree.digest !== targetSource.digest) {
      throw new Error(`${key}: immutable base digest changed after review`);
    }
    oldBases[key] = oldTree.tree;
    newBases[key] = targetTree.tree;
  }
  const templatePaletteConfigs=pinnedPaletteConfigs(newBases,metadata.pins,metadata.selection?.templatePalette === true);
  const refreshFacts=metadata.selection?.refreshFacts===true;assertFactualRefreshAdmission({enabled:refreshFacts,designSet:metadata.selection?.designSet,selectedKeys:metadata.selection?.selectedKeys,qualification:metadata.qualification?.context,manifest});
  if(metadata.modernCopyReview&&(!refreshFacts||!metadata.selection?.templatePalette||metadata.registeredAdoption))throw new Error('Saved Modern copy review requires ordinary six-family factual source preparation');
  const modernCopyReview=metadata.modernCopyReview?loadModernCopyReview({carsRoot:metadata.carsRoot,dealerRoot:metadata.dealerRoot,dealer:metadata.dealerSlug,pin:metadata.modernCopyReview}):null;
  const noticeResolutionBytes=metadata.resolutionsSha256?fs.readFileSync(path.join(metadata.runDirectory,'resolutions.json')):null;
  if(noticeResolutionBytes&&sha256(noticeResolutionBytes)!==metadata.resolutionsSha256)throw Error('Reviewed App notice resolution artifact changed');
  const appInventoryNoticeReview=readAppInventoryNoticeReview(noticeResolutionBytes);
  if(appInventoryNoticeReview!=null&&(!refreshFacts||!metadata.selection?.templatePalette||metadata.registeredAdoption))throw Error('Saved App notice review requires ordinary qualified six-family factual preparation');
  const factual=refreshFacts?await personalizeFactualTargetBases({pins:metadata.pins,newBases,dealerRoot:metadata.dealerRoot,manifest:metadata.targetManifest,modernCopyReview,appInventoryNoticeReview,carsRoot:metadata.carsRoot}):null;
  const extendedAdaptations=factual?.adaptations??await personalizeAddedBases({pins:metadata.pins,newBases,dealerRoot:metadata.dealerRoot,manifest});
  const targetManifest = metadata.targetManifest;
  validatePackagingManifest(targetManifest);
  if (sha256(Buffer.from(JSON.stringify(targetManifest))) !== metadata.targetManifestSha256) {
    throw new Error('Reviewed target dealer manifest changed after planning');
  }
  const selection=updateSelection(manifest,{designSet:metadata.selection?.designSet || undefined,variants:metadata.selection?.selectedKeys || undefined});
  const currentTarget=targetManifestForUpgrade({dealerRoot:metadata.dealerRoot,manifest,pins:metadata.pins,targetVariants:selection.targetVariants,carsRoot:metadata.carsRoot});
  if(sha256(Buffer.from(JSON.stringify(currentTarget)))!==metadata.targetManifestSha256)throw new Error('Dealer delivery identity changed after review; create a new update plan');
  const adapted = await adaptPinnedBases({ keys: Object.keys(metadata.pins), oldBases, newBases, manifest, targetManifest });
  if (adapted.adapter !== metadata.baseAdapter) throw new Error('Dealer source adapter changed after review; create a new update plan');
  if(factual)assertFactualRefreshReplay({proof:factual.proof,metadata,newBases:adapted.newBases});
  return {...adapted,extendedAdaptations,templatePaletteConfigs,factualAppProvenance:factual?.appProvenance};
}

function validateRepositoryPaths(pins, paths) {
  for (const pin of Object.values(pins)) {
    for (const locator of [pin.fromSource, pin.targetSource].filter(Boolean)) {
      const checkout = paths[locator.repository];
      if (!checkout || !fs.existsSync(checkout)) throw new Error(`No local checkout for ${locator.repository}: ${checkout || '(unmapped)'}`);
    }
  }
}

function renderPins(pins) {
  return JSON.parse(JSON.stringify(pins));
}

function qualificationArtifact(carsRoot,requested) {
  const target=path.resolve(carsRoot,requested),relative=path.relative(carsRoot,target).replaceAll('\\','/');
  if(!/^(?:runtime\/|docs\/releases\/)/.test(relative)||!relative.endsWith('.json')||!fs.existsSync(target)||fs.lstatSync(target).isSymbolicLink()||!fs.lstatSync(target).isFile()||!samePath(fs.realpathSync(target),target))throw new Error('Qualification artifacts must be regular JSON files inside Cars runtime or docs/releases');
  const bytes=fs.readFileSync(target);if(bytes.length>2*1024*1024)throw new Error('Qualification artifact exceeds its bounded source review size');
  return {file:target,bytes,value:JSON.parse(bytes.toString('utf8').replace(/^\uFEFF/,'')),sha256:sha256(bytes)};
}

function loadQualification({carsRoot,dealer,lockFile,lockBytes,lock,requested}) {
  if(!requested)return null;
  const artifact=qualificationArtifact(carsRoot,requested),context=validateNativeQualificationContext(artifact.value,{dealer});
  const origin=git(carsRoot,['remote','get-url','origin']).replace(/^git@github\.com:/i,'').replace(/^ssh:\/\/git@github\.com\//i,'').replace(/^https?:\/\/github\.com\//i,'').replace(/\.git\/?$/i,'').replace(/\/$/,'').toLowerCase();
  if(origin!=='darkapoparka/cars')throw new Error('Qualification requires the registered Cars source repository');
  const approvedFile=path.join(carsRoot,'templates.lock.json'),approvedBytes=fs.readFileSync(approvedFile),approved=JSON.parse(approvedBytes.toString('utf8').replace(/^\uFEFF/,''));
  if(samePath(lockFile,approvedFile)||context.approvedLockSha256!==sha256(approvedBytes)||context.candidateLockSha256!==sha256(lockBytes))throw new Error('Qualification must pin a separate candidate lock and the unchanged global approved lock');
  if(lock.schemaVersion!==approved.schemaVersion||JSON.stringify(Object.keys(lock.templates||{}).sort())!==JSON.stringify(Object.keys(approved.templates||{}).sort()))throw new Error('Qualification candidate lock must retain the complete approved release set');
  qualificationArtifact(carsRoot,lockFile);
  const delta=qualificationArtifact(carsRoot,context.sourceDeltaReview.reference);
  if(delta.sha256!==context.sourceDeltaReview.sha256||delta.value.schemaVersion!==1||delta.value.kind!=='cars-source-delta-review'||delta.value.sourceCommit!==context.sourceCommit||delta.value.reviewed!==true||delta.value.reviewedAt!==context.sourceDeltaReview.reviewedAt||delta.value.nativeApproval!==false||!Array.isArray(delta.value.checks)||!delta.value.checks.length||delta.value.checks.some(row=>row.status!=='passed'||!/^[a-f0-9]{64}$/.test(row.evidenceSha256||''))||JSON.stringify(delta.value.pendingNativeChecks)!==JSON.stringify(NATIVE_CHECKS))throw new Error('Qualification delta evidence changed, failed, or falsely claims native acceptance');
  let provisional=0;
  for(const [key,release]of Object.entries(lock.templates||{})){
    if(release.status!=='qualification'){
      if(JSON.stringify(release)!==JSON.stringify(approved.templates?.[key]))throw new Error(`${key}: candidate lock changed an ordinary approved entry`);
      continue;
    }
    const proof=validateTemplateQualification(key,release,context,{root:carsRoot}),parent=approved.templates?.[key];
    if(!parent||JSON.stringify(proof.sourceQA.approvedRelease)!==JSON.stringify(parent))throw new Error(`${key}: source QA parent is not the current globally approved release`);
    const sourceQa=qualificationArtifact(carsRoot,proof.sourceQA.reference);
    if(sourceQa.sha256!==proof.sourceQA.sha256)throw new Error(`${key}: referenced original source QA bytes changed`);
    if(git(carsRoot,['merge-base','--is-ancestor',release.source.revision,'refs/remotes/origin/main'],{allowFailure:true})===null)throw new Error(`${key}: qualification source is not published on Cars main`);
    if(git(carsRoot,['rev-parse',`${release.source.revision}:${release.source.path}`])!==release.source.tree)throw new Error(`${key}: qualification subtree identity differs from published source`);
    provisional++;
  }
  if(!provisional)throw new Error('Explicit source qualification requires provisional candidate entries');
  return {file:artifact.file,sha256:artifact.sha256,context,approvedLockSha256:context.approvedLockSha256};
}

/** Read-only validation of the exact review chain before any candidate output. */
export function validateDealerSourceQualification({carsRoot,dealer,lockFile,contextFile}) {
  const root=fs.realpathSync(path.resolve(carsRoot)),file=path.resolve(root,lockFile);
  const lockBytes=fs.readFileSync(file),lock=JSON.parse(lockBytes.toString('utf8').replace(/^\uFEFF/,''));
  if(!contextFile)throw new Error('An explicit qualification context file is required');
  return loadQualification({carsRoot:root,dealer,lockFile:file,lockBytes,lock,requested:contextFile});
}

export function assertUpgradeSourceAdmission({manifest,qualification,registeredAdoption,dealerRoot}) {
  if(registeredAdoption){assertRegisteredAdoptionPlan(registeredAdoption,{dealerRoot,manifest});if(!qualification)throw new Error('Registered adoption requires a reviewed native qualification context');validateNativeQualificationContext(qualification,{dealer:manifest.slug});return;}
  if(qualification&&!['2',APP_PACKAGING_VERSION,SIX_DESIGN_PACKAGING_CANDIDATE].includes(manifest.packaging?.version))throw new Error('Qualification uses the existing native dealer source workflow');
}

async function runPlan(values) {
  const createdAt = new Date().toISOString();
  const carsRoot = fs.realpathSync(path.resolve(values['cars-root'] || defaultCarsRoot()));
  const dealerRoot = fs.realpathSync(required(values, 'dealer-root'));
  const manifestPath = path.join(dealerRoot, 'dealer.json');
  const lockFile = path.resolve(values['lock-file'] || path.join(carsRoot, 'templates.lock.json'));
  const templateRoot = path.resolve(values['template-root'] || path.join(path.dirname(carsRoot), 'template-repos'));
  if(Boolean(values['registered-adoption'])!==Boolean(values['registered-adoption-sha256']))throw new Error('Registered adoption requires its exact reviewed receipt path/hash');
  let registeredAdoption;
  if(values['registered-adoption']){
    if(values['design-set']!=='six'||values.variants)throw new Error('Registered adoption prepares every six-family source together');
    const receiptPath=path.relative(carsRoot,path.resolve(carsRoot,values['registered-adoption'])).replaceAll('\\','/');
    registeredAdoption=await readRegisteredDealerAdoption({root:carsRoot,dealer:path.basename(dealerRoot),pin:{path:receiptPath,sha256:values['registered-adoption-sha256']}});
  }
  if (!registeredAdoption&&!fs.existsSync(manifestPath)) throw new Error(`Dealer manifest not found: ${manifestPath}`);
  if (!fs.existsSync(lockFile)) throw new Error(`Template approval lock not found: ${lockFile}`);
  const sourceBeforeSha256=fingerprint(dealerRoot).digest;
  const manifest = registeredAdoption?.manifest ?? readJson(manifestPath);
  validatePackagingManifest(manifest);
  const lockBytes = fs.readFileSync(lockFile);
  const lock = JSON.parse(lockBytes.toString('utf8').replace(/^\uFEFF/, ''));
  const selection = updateSelection(manifest,{designSet:values['design-set'],variants:values.variants});
  const qualification=loadQualification({carsRoot,dealer:manifest.slug,lockFile,lockBytes,lock,requested:values.qualification});
  const pins = selectPinnedRevisions(manifest, lock,{targetVariants:selection.targetVariants,keys:selection.selectedKeys,qualification:qualification?.context,root:carsRoot});
  assertUpgradeSourceAdmission({manifest,qualification:qualification?.context,registeredAdoption,dealerRoot});
  const refreshFacts=values['refresh-facts']===true;assertFactualRefreshAdmission({enabled:refreshFacts,designSet:values['design-set'],selectedKeys:selection.selectedKeys,qualification:qualification?.context,registeredAdoption,manifest});
  if(Boolean(values['modern-copy-review'])!==Boolean(values['modern-copy-review-sha256']))throw new Error('Modern copy review requires its exact path/hash');
  if(values['modern-copy-review']&&(!refreshFacts||values['template-palette']!==true||registeredAdoption||!qualification))throw new Error('Modern copy review requires ordinary qualified six-family factual preparation and native template palette');
  const modernCopyReview=values['modern-copy-review']?loadModernCopyReview({carsRoot,dealerRoot,dealer:manifest.slug,pin:{path:values['modern-copy-review'],sha256:values['modern-copy-review-sha256']}}):null;
  const targetManifest = targetManifestForUpgrade({ dealerRoot, manifest, pins,targetVariants:selection.targetVariants,carsRoot,registeredAdoption });
  const resolutionBytes = values['resolutions-file'] ? fs.readFileSync(path.resolve(values['resolutions-file'])) : null;
  const resolutions = parseResolutions(resolutionBytes, pins);
  const registeredConsumerReview=resolutionBytes?JSON.parse(resolutionBytes.toString('utf8').replace(/^\uFEFF/,'')).registeredConsumerResolutions??null:null;
  if(registeredConsumerReview&&!registeredAdoption)throw new Error('Reviewed consumer resolutions are registered-only');
  const factualConsumerReview=readFactualConsumerReview(resolutionBytes);
  const appInventoryNoticeReview=readAppInventoryNoticeReview(resolutionBytes);
  if(appInventoryNoticeReview!=null&&(!refreshFacts||values['template-palette']!==true||registeredAdoption||!qualification))throw Error('Reviewed App notice requires ordinary qualified six-family factual preparation and native template palettes');
  if(factualConsumerReview&&(!refreshFacts||registeredAdoption||values['template-palette']!==true))throw new Error('Reviewed factual consumers require ordinary --refresh-facts and --template-palette');
  const paths = repositoryPaths(carsRoot, templateRoot);
  validateRepositoryPaths(pins, paths);
  const runDirectory = createRunDirectory(carsRoot, manifest.slug, values['run-dir']);
  const candidatePath = ensureCandidateDirectory({
    carsRoot,
    dealerRoot,
    repositoryPaths: paths,
    runDirectory,
    requested: values['candidate-dir'] || path.join(runDirectory, 'candidate'),
    explicit: Boolean(values['candidate-dir'])
  });
  const oldBases = {}, newBases = {}, bases = {};

  for (const [key, pin] of Object.entries(pins)) {
    const oldTree = pin.fromSource ? readPinnedTemplateTree({
      key,
      repositoryPath: paths[pin.fromSource.repository],
      source: pin.fromSource
    }) : {tree:new Map(),digest:null};
    const targetTree = readPinnedTemplateTree({
      key,
      repositoryPath: paths[pin.targetSource.repository],
      source: pin.targetSource
    });
    oldBases[key] = oldTree.tree;
    newBases[key] = targetTree.tree;
    bases[key] = {
      old: pin.fromSource ? { ...pin.fromSource, digest: oldTree.digest } : null,
      target: { ...pin.targetSource, digest: targetTree.digest }
    };
  }
  const templatePalette=values['template-palette'] === true;
  const templatePaletteConfigs=pinnedPaletteConfigs(newBases,pins,templatePalette);
  const factual=refreshFacts?await personalizeFactualTargetBases({pins,newBases,dealerRoot,manifest:targetManifest,modernCopyReview,appInventoryNoticeReview,carsRoot}):null;
  const extendedAdaptations=factual?.adaptations??await personalizeAddedBases({pins,newBases,dealerRoot,manifest,registeredAdoption});

  const adapted = await adaptPinnedBases({ keys: Object.keys(pins), oldBases, newBases, manifest, targetManifest,registeredAdoption });
  const assetPool=values['asset-pool']?ensureCandidateDirectory({carsRoot,dealerRoot,repositoryPaths:paths,runDirectory,requested:values['asset-pool'],explicit:true}):null;
  if(assetPool&&pathsOverlap(assetPool,candidatePath))throw new Error('Derived asset pool must be separate from the candidate');
  const candidateAssetPool=values['candidate-asset-pool']?ensureCandidateDirectory({carsRoot,dealerRoot,repositoryPaths:paths,runDirectory,requested:values['candidate-asset-pool'],explicit:true}):assetPool;
  if(candidateAssetPool&&pathsOverlap(candidateAssetPool,candidatePath))throw new Error('Candidate asset pool must be separate from the candidate');
  if(assetPool&&candidateAssetPool&&!samePath(assetPool,candidateAssetPool)&&pathsOverlap(assetPool,candidateAssetPool))throw new Error('Candidate and installation asset pools must not contain each other');
  const candidateAssetPoolStats={pool:candidateAssetPool,objectsWritten:0,objectsReused:0,filesLinked:0,filesCopied:0,bytesLinked:0};
  const plan = planDealerUpgrade({ dealerRoot, lock, oldBases: adapted.oldBases, newBases: adapted.newBases, targetManifest: adapted.targetManifest, selectedKeys:selection.selectedKeys, resolutions, qualification:qualification?.context,root:carsRoot,registeredAdoption });
  let candidateDirectory = null, candidateDigest = null;
  if(plan.ready&&factualConsumerReview)applyFactualReviewToPlan({plan,dealerRoot,carsRoot,manifest,qualification:qualification?.context,selection:{...selection,designSet:values['design-set']},registeredAdoption,refreshFacts,templatePalette,factualProof:factual?.proof,oldBases:adapted.oldBases,newBases:adapted.newBases,review:factualConsumerReview,resolutions});
  if(plan.ready&&factual)plan.factualRefresh=assertFactualRefreshCandidate({candidate:plan.candidate,newBases:adapted.newBases,proof:factual.proof});
  if (plan.ready) {
    candidateDirectory = materializeUpgradeCandidate({
      source: dealerRoot,
      plan,
      destination: candidatePath, assetPool:candidateAssetPool, assetPoolStats:candidateAssetPoolStats
    });
    const registeredAssetView=registeredAdoption?materializeRegisteredAssetView(registeredAdoption,{runDirectory,candidateDirectory}):undefined;
    await addNativeAdoption(plan, candidateDirectory, dealerRoot, lock, {carsRoot, refreshedAt: createdAt, extendedAdaptations, candidateAssetPool, templatePalette, templatePaletteConfigs,qualification:qualification?.context,registeredAdoption,registeredAssetView,registeredTargetBases:adapted.newBases,factualAppProvenance:factual?.appProvenance,registeredConsumerReview});
    candidateDigest = fingerprint(candidateDirectory).digest;
  }
  const review = reviewedUpgradeReport(plan);
  const reviewBytes = Buffer.from(`${JSON.stringify(review, null, 2)}\n`);
  writeJsonExclusive(path.join(runDirectory, 'review.json'), review);
  if (resolutionBytes) fs.writeFileSync(path.join(runDirectory, 'resolutions.json'), resolutionBytes, { flag: 'wx' });
  if(fingerprint(dealerRoot).digest!==sourceBeforeSha256)throw new Error('Dealer source changed during planning; preserve this candidate and create a new update plan');

  const metadata = {
    schemaVersion: 1,
    createdAt,
    dealerRoot,
    dealerSlug: manifest.slug,
    carsRoot,
    templateRoot,
    lockFile,
    lockSha256: sha256(lockBytes),
    baseAdapter: adapted.adapter,
    targetManifest: adapted.targetManifest,
    targetManifestSha256: sha256(Buffer.from(JSON.stringify(adapted.targetManifest))),
    resolutionsSha256: resolutionBytes ? sha256(resolutionBytes) : null,
    sourceBeforeSha256,
    modernCopyReview:modernCopyReview?{path:modernCopyReview.path,sha256:modernCopyReview.sha256}:null,
    runDirectory,
    pins: renderPins(pins),
    selection:{designSet:values['design-set'] || null,selectedKeys:selection.selectedKeys || null,templatePalette,refreshFacts},
    factualRefresh:plan.factualRefresh??null,
    factualConsumerResolutions:plan.factualConsumerResolutions??null,
    registeredPersonalizationPreservation:plan.registeredPersonalizationPreservation??null,
    templatePalette:plan.templatePalette ?? null,
    qualification,
    registeredAdoption:registeredAdoption?{inputPin:registeredAdoption.inputPin,receiptSha256:registeredAdoption.receiptSha256,personalizationSha256:registeredAdoption.personalizationSha256,baseline:registeredAdoption.baseline,proposalOnly:true}:null,
    nativeQualification:plan.nativeQualification ?? null,
    bases,
    ready: plan.ready,
    reviewSha256: sha256(reviewBytes),
    reviewDigest: sha256(Buffer.from(JSON.stringify(review))),
    candidateDirectory,
    assetPool,
    candidateAssetPool,
    candidateAssetPoolStats,
    candidateDigest
  };
  writeJsonExclusive(path.join(runDirectory, 'run.json'), metadata);
  return {
    action: 'plan',
    runDirectory,
    reviewPath: path.join(runDirectory, 'review.json'),
    candidateDirectory,
    ready: plan.ready,
    summary: plan.summary,
    conflicts: plan.conflicts.map(({ path: name, kind }) => ({ path: name, kind })),
    pins
  };
}

function loadRun(runDirectory) {
  const resolved = fs.realpathSync(path.resolve(runDirectory));
  const metadata = readJson(path.join(resolved, 'run.json'));
  if (metadata.schemaVersion !== 1 || path.resolve(metadata.runDirectory) !== resolved) {
    throw new Error('Invalid update run metadata');
  }
  ensureInsideRuntime(metadata.carsRoot, resolved);
  if (metadata.selection?.templatePalette !== undefined && typeof metadata.selection.templatePalette !== 'boolean') throw new Error('Invalid template palette selection in update run');
  if(metadata.selection?.refreshFacts!==undefined&&typeof metadata.selection.refreshFacts!=='boolean')throw new Error('Invalid factual refresh selection');
  if(Boolean(metadata.selection?.refreshFacts)!==Boolean(metadata.factualRefresh))throw new Error('Factual refresh selection/proof mismatch');
  return { runDirectory: resolved, metadata };
}

async function runInstall(values) {
  const { runDirectory, metadata } = loadRun(required(values, 'run-dir'));
  if(metadata.registeredAdoption)throw new Error('Registered adoption is a source publication proposal only; local install cannot adopt an existing registered identity');
  if (!metadata.ready || !metadata.candidateDirectory || !metadata.candidateDigest) {
    throw new Error('This update has unresolved conflicts and no buildable candidate');
  }
  const dealerRoot = fs.realpathSync(metadata.dealerRoot);
  const lockBytes = fs.readFileSync(metadata.lockFile);
  if (sha256(lockBytes) !== metadata.lockSha256) throw new Error('Approved template lock changed after review; create a new update plan');
  const lock = JSON.parse(lockBytes.toString('utf8').replace(/^\uFEFF/, ''));
  const qualification=loadQualification({carsRoot:metadata.carsRoot,dealer:metadata.dealerSlug,lockFile:metadata.lockFile,lockBytes,lock,requested:metadata.qualification?.file});
  if(JSON.stringify(qualification)!==JSON.stringify(metadata.qualification??null))throw new Error('Saved qualification context changed after review');
  const paths = repositoryPaths(metadata.carsRoot, metadata.templateRoot);
  validateRepositoryPaths(metadata.pins, paths);
  if(metadata.assetPool)ensureCandidateDirectory({carsRoot:metadata.carsRoot,dealerRoot,repositoryPaths:paths,runDirectory,requested:metadata.assetPool,explicit:true});
  if(metadata.candidateAssetPool)ensureCandidateDirectory({carsRoot:metadata.carsRoot,dealerRoot,repositoryPaths:paths,runDirectory,requested:metadata.candidateAssetPool,explicit:true});
  const candidateDirectory = ensureCandidateDirectory({
    carsRoot: metadata.carsRoot,
    dealerRoot,
    repositoryPaths: paths,
    runDirectory,
    requested: metadata.candidateDirectory,
    explicit: path.resolve(metadata.candidateDirectory) !== path.resolve(path.join(runDirectory, 'candidate'))
  });
  const resolutions = readResolutionArtifact(runDirectory, metadata);
  const review = verifiedReviewArtifact(runDirectory, metadata);
  const factualConsumerReview=readFactualConsumerReview(metadata.resolutionsSha256?fs.readFileSync(path.join(runDirectory,'resolutions.json')):null);
  if(Boolean(factualConsumerReview)!==Boolean(metadata.factualConsumerResolutions)||factualConsumerReview&&(!metadata.selection?.refreshFacts||!metadata.selection?.templatePalette||metadata.registeredAdoption||sha256(Buffer.from(JSON.stringify(factualConsumerReview)))!==metadata.factualConsumerResolutions.reviewSha256))throw new Error('Saved factual consumer resolution input changed');
  if(factualConsumerReview)factualConsumerBaseline({review:factualConsumerReview,carsRoot:metadata.carsRoot,dealerRoot,dealer:metadata.dealerSlug});
  if (fingerprint(candidateDirectory).digest !== metadata.candidateDigest) {
    throw new Error('Buildable candidate changed after review; create and preview a new update plan');
  }
  const receiptPath = path.join(runDirectory, 'rollback.json');
  if (fs.existsSync(receiptPath)) {
    const receipt = readJson(receiptPath);
    const originalManifest = readReceiptOriginalManifest(runDirectory, receipt);
    validatePackagingManifest(originalManifest);
    const originalSelection = updateSelection(originalManifest,{designSet:metadata.selection?.designSet || undefined,variants:metadata.selection?.selectedKeys || undefined});
    const originalPins = selectPinnedRevisions(originalManifest, lock,{targetVariants:originalSelection.targetVariants,keys:originalSelection.selectedKeys,qualification:qualification?.context,root:metadata.carsRoot});
    if (JSON.stringify(renderPins(originalPins)) !== JSON.stringify(metadata.pins) ||
        JSON.stringify(stableChangeHashes(review.changes)) !== JSON.stringify(stableChangeHashes(receipt.changes || []))) {
      throw new Error('Installed receipt does not match the reviewed update plan');
    }
    await validatePinnedBaseEvidence(metadata, originalManifest, lock, paths);
    const retried = installUpgrade({
      source: dealerRoot,
      plan: { ready: true, changes: review.changes },
      runDir: runDirectory,
      candidateDirectory,assetPool:metadata.assetPool,candidateAssetPool:metadata.candidateAssetPool
    });
    return { action: 'install', ...retried };
  }
  if (fingerprint(dealerRoot).digest !== metadata.sourceBeforeSha256) {
    throw new Error('Dealer source changed after candidate review; create and preview a new update plan');
  }
  const manifest = readJson(path.join(dealerRoot, 'dealer.json'));
  validatePackagingManifest(manifest);
  const selection = updateSelection(manifest,{designSet:metadata.selection?.designSet || undefined,variants:metadata.selection?.selectedKeys || undefined});
  const pins = selectPinnedRevisions(manifest, lock,{targetVariants:selection.targetVariants,keys:selection.selectedKeys,qualification:qualification?.context,root:metadata.carsRoot});
  if (JSON.stringify(renderPins(pins)) !== JSON.stringify(metadata.pins)) {
    throw new Error('Dealer template pins changed after review; create a new update plan');
  }
  const adapted = await validatePinnedBaseEvidence(metadata, manifest, lock, paths);
  const plan = planDealerUpgrade({ dealerRoot, lock, oldBases: adapted.oldBases, newBases: adapted.newBases, targetManifest: adapted.targetManifest,selectedKeys:selection.selectedKeys, resolutions,qualification:qualification?.context,root:metadata.carsRoot });
  if(factualConsumerReview)applyFactualReviewToPlan({plan,dealerRoot,carsRoot:metadata.carsRoot,manifest,qualification:qualification?.context,selection:metadata.selection,refreshFacts:metadata.selection?.refreshFacts,templatePalette:metadata.selection?.templatePalette,factualProof:metadata.factualRefresh,oldBases:adapted.oldBases,newBases:adapted.newBases,review:factualConsumerReview,resolutions});
  if(metadata.factualRefresh)plan.factualRefresh=assertFactualRefreshCandidate({candidate:plan.candidate,newBases:adapted.newBases,proof:metadata.factualRefresh});
  let recomputedReview;
  if (plan.ready) {
    fs.mkdirSync(path.dirname(candidateDirectory), { recursive: true });
    const validationCandidate = fs.mkdtempSync(path.join(path.dirname(candidateDirectory), '.cars-upgrade-validation-'));
    try {
      const candidateAssetPool=metadata.candidateAssetPool??metadata.assetPool;
      materializeUpgradeCandidate({ source: dealerRoot, plan, destination: validationCandidate, assetPool:candidateAssetPool });
      await addNativeAdoption(plan, validationCandidate, dealerRoot, lock, {carsRoot: metadata.carsRoot, refreshedAt: metadata.createdAt,extendedAdaptations:adapted.extendedAdaptations,candidateAssetPool,templatePalette:metadata.selection?.templatePalette === true,templatePaletteConfigs:adapted.templatePaletteConfigs,qualification:qualification?.context,factualAppProvenance:adapted.factualAppProvenance});
      recomputedReview = reviewedUpgradeReport(plan);
    } finally {
      fs.rmSync(validationCandidate, { recursive: true, force: true });
    }
  } else recomputedReview = upgradeReviewReport(plan);
  if (sha256(Buffer.from(JSON.stringify(recomputedReview))) !== metadata.reviewDigest) {
    throw new Error('Current merge plan differs from the reviewed plan; create a new update plan');
  }
  const installed = installUpgrade({ source: dealerRoot, plan, runDir: runDirectory, candidateDirectory,assetPool:metadata.assetPool,candidateAssetPool:metadata.candidateAssetPool });
  return { action: 'install', ...installed };
}

function runRollback(values) {
  const { runDirectory, metadata } = loadRun(required(values, 'run-dir'));
  const dealerRoot = fs.realpathSync(metadata.dealerRoot);
  if (values['dealer-root'] && fs.realpathSync(values['dealer-root']) !== dealerRoot) {
    throw new Error('Requested dealer source does not match this update run');
  }
  const receiptPath = path.join(runDirectory, 'rollback.json');
  if (!fs.existsSync(receiptPath)) throw new Error(`Update receipt not found: ${receiptPath}`);
  return { action: 'rollback', ...rollbackUpgrade({ source: dealerRoot, receiptPath }) };
}

export async function runUpdateDealerTemplate(argv = process.argv.slice(2)) {
  const { action, values = {} } = parseCommand(argv);
  if (action === 'help') return { action: 'help', usage: updateDealerTemplateUsage };
  if (action === 'plan') return runPlan(values);
  if (action === 'install') return runInstall(values);
  return runRollback(values);
}

if (path.resolve(process.argv[1] || '') === fileURLToPath(import.meta.url)) {
  try {
    const result = await runUpdateDealerTemplate();
    if (result.action === 'help') process.stdout.write(result.usage);
    else process.stdout.write(`${JSON.stringify(result, null, 2)}\n`);
  } catch (error) {
    process.stderr.write(`update-dealer-template: ${error.message}\n`);
    process.exitCode = 1;
  }
}
