import crypto from 'node:crypto';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { createRequire } from 'node:module';
import { fingerprint, filesAt } from '../lib/workflow.mjs';
import { planSixDesignSelection, SIX_DESIGN_PACKAGING_CANDIDATE } from '../lib/six-design-release.mjs';
import { loadDealerProfile } from '../lib/client-refresh-normalize.mjs';
import { applyRefreshAdapter } from '../lib/client-refresh-adapters.mjs';
import { applyExtendedRefreshAdapter, sealExtendedVariant, EXTENDED_VARIANT_RECEIPTS, retainDealerVariantAssets } from '../lib/client-refresh-six.mjs';
import { validatePackagingManifest, packageRetainsPath } from '../package-dealer.mjs';
import { applyMounts } from '../publishing/mounts.mjs';
import { adoptNativeSource, applyNativeMounts } from '../publishing/native-mounts.mjs';
import { assertNativeAdoption } from '../lib/native-localization.mjs';
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
  updateManifestPins
} from './three-way-upgrade.mjs';
import { readPinnedTemplateTree } from './pinned-template-source.mjs';
import { baseNativeManifest, APP_PACKAGING_VERSION, assertAppVariant } from '../publishing/app-variant.mjs';
import { buildLegacyDetailRouteMap, legacyDetailArtifact, LEGACY_DETAIL_FILE } from '../publishing/legacy-detail-routes.mjs';

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
       [--design-set six] [--variants karento-best]
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
    plan: new Set(['dealer-root', 'cars-root', 'template-root', 'lock-file', 'run-dir', 'candidate-dir', 'resolutions-file', 'asset-pool', 'candidate-asset-pool', 'design-set', 'variants']),
    install: new Set(['run-dir']),
    rollback: new Set(['run-dir', 'dealer-root'])
  }[action];
  const values = {};
  for (let index = 0; index < rest.length; index++) {
    const flag = rest[index];
    if (!flag.startsWith('--')) throw new Error(`Unexpected argument: ${flag}`);
    const key = flag.slice(2);
    if (!allowed.has(key)) throw new Error(`Unknown --${key} option for ${action}`);
    if (!rest[index + 1] || rest[index + 1].startsWith('--')) throw new Error(`Missing value for --${key}`);
    if (values[key] !== undefined) throw new Error(`Duplicate --${key} option`);
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

export function targetManifestForUpgrade({ dealerRoot, manifest, pins, targetVariants = manifest.variants, carsRoot }) {
  const next = updateManifestPins(manifest, pins);
  next.variants = structuredClone(targetVariants);
  if (targetVariants.length === 6) {
    next.packaging = { ...next.packaging, version: SIX_DESIGN_PACKAGING_CANDIDATE };
    for (const field of ['templateRevisions','templateSources']) next[field] = Object.fromEntries(next.variants.map(({key})=>[key,next[field]?.[key]]));
    if (carsRoot) {
      const registryFile = path.join(carsRoot,'docs/DEPLOYMENT-INVENTORY.json');
      const record = fs.existsSync(registryFile) ? readJson(registryFile).dealers?.find(row=>row.slug===manifest.slug) : null;
      if (!record || record.repository !== manifest.repository || !record.delivery?.url) throw new Error('Six-design delivery needs the exact registered repository and public origin');
      const profile = loadDealerProfile(dealerRoot,manifest.slug),asset = profile.logoContract?.assets.onLight;
      if (!asset) throw new Error('Six-design sharing needs the reviewed dealer logo contract');
      const origin = new URL(record.delivery.url);
      if (origin.protocol!=='https:' || origin.username || origin.password || origin.pathname!=='/' || origin.search || origin.hash) throw new Error('The registered dealer delivery must be a complete HTTPS origin');
      next.shareIdentity={name:profile.business.name,publicOrigin:origin.origin,
        description:profile.business.previewNotice,
        logo:{sourcePath:asset.publicPath.slice(1),sha256:asset.sha256}};
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

async function adaptPinnedBases({ keys, oldBases, newBases, manifest, targetManifest }) {
  let oldFiles = new Map(), newFiles = new Map();
  for (const key of keys) {
    if (oldBases[key]?.size) addPrefixedTree(oldFiles, key, oldBases[key]);
    addPrefixedTree(newFiles, key, newBases[key]);
  }
  let fromAdapter, targetAdapter;
  if (manifest.packaging.version === '1') {
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
async function personalizeAddedBases({ pins, newBases, dealerRoot, manifest }) {
  const added = Object.entries(pins).filter(([,pin])=>pin.from === null);
  if (!added.length) return {};
  const profile = loadDealerProfile(dealerRoot,manifest.slug), adaptation = {};
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

/** Preserve exact old Carwow links while the published third family changes. */
export function addLegacyDetailUpgrade({ files, dealerRoot, manifest, pins }) {
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

async function addNativeAdoption(plan, candidateDirectory, dealerRoot, lock, {carsRoot, refreshedAt, extendedAdaptations = {}, candidateAssetPool} = {}) {
  if (!['2', APP_PACKAGING_VERSION, SIX_DESIGN_PACKAGING_CANDIDATE].includes(plan.manifest.packaging.version)) {
    reconcilePlanWithCandidate({ source: dealerRoot, plan, candidateDirectory });
    return;
  }
  if (Object.keys(plan.pins).some(key=>['auto-best','modern','import','carwow'].includes(key))) await regenerateDealerCatalogs(candidateDirectory, carsRoot,Object.keys(plan.pins));
  const files = readDirectoryTree(candidateDirectory);
  const before = new Map([...files].map(([name, bytes]) => [name, Buffer.from(bytes)]));
  const candidateManifest = JSON.parse(files.get('dealer.json').toString('utf8').replace(/^\uFEFF/, ''));
  addLegacyDetailUpgrade({files,dealerRoot,manifest:candidateManifest,pins:plan.pins});
  plan.manifest=candidateManifest;
  validatePackagingManifest(candidateManifest);
  const baseManifest = baseNativeManifest(candidateManifest);
  const selectedNative = baseManifest.variants.some(({key})=>plan.pins[key]);
  const retainedFiles = new Map([...files].filter(([name]) => packageRetainsPath(name)));
  const adopted = selectedNative ? adoptNativeSource(retainedFiles, baseManifest, lock.templates) : retainedFiles;
  assertNativeAdoption(adopted, baseManifest);
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
    const profile = loadDealerProfile(dealerRoot,candidateManifest.slug);
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
  const extendedAdaptations=await personalizeAddedBases({pins:metadata.pins,newBases,dealerRoot:metadata.dealerRoot,manifest});
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
  return {...adapted,extendedAdaptations};
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

async function runPlan(values) {
  const createdAt = new Date().toISOString();
  const carsRoot = fs.realpathSync(path.resolve(values['cars-root'] || defaultCarsRoot()));
  const dealerRoot = fs.realpathSync(required(values, 'dealer-root'));
  const manifestPath = path.join(dealerRoot, 'dealer.json');
  const lockFile = path.resolve(values['lock-file'] || path.join(carsRoot, 'templates.lock.json'));
  const templateRoot = path.resolve(values['template-root'] || path.join(path.dirname(carsRoot), 'template-repos'));
  if (!fs.existsSync(manifestPath)) throw new Error(`Dealer manifest not found: ${manifestPath}`);
  if (!fs.existsSync(lockFile)) throw new Error(`Template approval lock not found: ${lockFile}`);
  const sourceBeforeSha256=fingerprint(dealerRoot).digest;
  const manifest = readJson(manifestPath);
  validatePackagingManifest(manifest);
  const lockBytes = fs.readFileSync(lockFile);
  const lock = JSON.parse(lockBytes.toString('utf8').replace(/^\uFEFF/, ''));
  const selection = updateSelection(manifest,{designSet:values['design-set'],variants:values.variants});
  const pins = selectPinnedRevisions(manifest, lock,{targetVariants:selection.targetVariants,keys:selection.selectedKeys});
  const targetManifest = targetManifestForUpgrade({ dealerRoot, manifest, pins,targetVariants:selection.targetVariants,carsRoot });
  const resolutionBytes = values['resolutions-file'] ? fs.readFileSync(path.resolve(values['resolutions-file'])) : null;
  const resolutions = parseResolutions(resolutionBytes, pins);
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
  const extendedAdaptations=await personalizeAddedBases({pins,newBases,dealerRoot,manifest});

  const adapted = await adaptPinnedBases({ keys: Object.keys(pins), oldBases, newBases, manifest, targetManifest });
  const assetPool=values['asset-pool']?ensureCandidateDirectory({carsRoot,dealerRoot,repositoryPaths:paths,runDirectory,requested:values['asset-pool'],explicit:true}):null;
  if(assetPool&&pathsOverlap(assetPool,candidatePath))throw new Error('Derived asset pool must be separate from the candidate');
  const candidateAssetPool=values['candidate-asset-pool']?ensureCandidateDirectory({carsRoot,dealerRoot,repositoryPaths:paths,runDirectory,requested:values['candidate-asset-pool'],explicit:true}):assetPool;
  if(candidateAssetPool&&pathsOverlap(candidateAssetPool,candidatePath))throw new Error('Candidate asset pool must be separate from the candidate');
  if(assetPool&&candidateAssetPool&&!samePath(assetPool,candidateAssetPool)&&pathsOverlap(assetPool,candidateAssetPool))throw new Error('Candidate and installation asset pools must not contain each other');
  const candidateAssetPoolStats={pool:candidateAssetPool,objectsWritten:0,objectsReused:0,filesLinked:0,filesCopied:0,bytesLinked:0};
  const plan = planDealerUpgrade({ dealerRoot, lock, oldBases: adapted.oldBases, newBases: adapted.newBases, targetManifest: adapted.targetManifest, selectedKeys:selection.selectedKeys, resolutions });
  let candidateDirectory = null, candidateDigest = null;
  if (plan.ready) {
    candidateDirectory = materializeUpgradeCandidate({
      source: dealerRoot,
      plan,
      destination: candidatePath, assetPool:candidateAssetPool, assetPoolStats:candidateAssetPoolStats
    });
    await addNativeAdoption(plan, candidateDirectory, dealerRoot, lock, {carsRoot, refreshedAt: createdAt, extendedAdaptations, candidateAssetPool});
    candidateDigest = fingerprint(candidateDirectory).digest;
  }
  const review = upgradeReviewReport(plan);
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
    runDirectory,
    pins: renderPins(pins),
    selection:{designSet:values['design-set'] || null,selectedKeys:selection.selectedKeys || null},
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
  return { runDirectory: resolved, metadata };
}

async function runInstall(values) {
  const { runDirectory, metadata } = loadRun(required(values, 'run-dir'));
  if (!metadata.ready || !metadata.candidateDirectory || !metadata.candidateDigest) {
    throw new Error('This update has unresolved conflicts and no buildable candidate');
  }
  const dealerRoot = fs.realpathSync(metadata.dealerRoot);
  const lockBytes = fs.readFileSync(metadata.lockFile);
  if (sha256(lockBytes) !== metadata.lockSha256) throw new Error('Approved template lock changed after review; create a new update plan');
  const lock = JSON.parse(lockBytes.toString('utf8').replace(/^\uFEFF/, ''));
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
  if (fingerprint(candidateDirectory).digest !== metadata.candidateDigest) {
    throw new Error('Buildable candidate changed after review; create and preview a new update plan');
  }
  const receiptPath = path.join(runDirectory, 'rollback.json');
  if (fs.existsSync(receiptPath)) {
    const receipt = readJson(receiptPath);
    const originalManifest = readReceiptOriginalManifest(runDirectory, receipt);
    validatePackagingManifest(originalManifest);
    const originalSelection = updateSelection(originalManifest,{designSet:metadata.selection?.designSet || undefined,variants:metadata.selection?.selectedKeys || undefined});
    const originalPins = selectPinnedRevisions(originalManifest, lock,{targetVariants:originalSelection.targetVariants,keys:originalSelection.selectedKeys});
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
  const pins = selectPinnedRevisions(manifest, lock,{targetVariants:selection.targetVariants,keys:selection.selectedKeys});
  if (JSON.stringify(renderPins(pins)) !== JSON.stringify(metadata.pins)) {
    throw new Error('Dealer template pins changed after review; create a new update plan');
  }
  const adapted = await validatePinnedBaseEvidence(metadata, manifest, lock, paths);
  const plan = planDealerUpgrade({ dealerRoot, lock, oldBases: adapted.oldBases, newBases: adapted.newBases, targetManifest: adapted.targetManifest,selectedKeys:selection.selectedKeys, resolutions });
  let recomputedReview;
  if (plan.ready) {
    fs.mkdirSync(path.dirname(candidateDirectory), { recursive: true });
    const validationCandidate = fs.mkdtempSync(path.join(path.dirname(candidateDirectory), '.cars-upgrade-validation-'));
    try {
      const candidateAssetPool=metadata.candidateAssetPool??metadata.assetPool;
      materializeUpgradeCandidate({ source: dealerRoot, plan, destination: validationCandidate, assetPool:candidateAssetPool });
      await addNativeAdoption(plan, validationCandidate, dealerRoot, lock, {carsRoot: metadata.carsRoot, refreshedAt: metadata.createdAt,extendedAdaptations:adapted.extendedAdaptations,candidateAssetPool});
      recomputedReview = upgradeReviewReport(plan);
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
