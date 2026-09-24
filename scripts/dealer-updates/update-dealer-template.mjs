import crypto from 'node:crypto';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { fingerprint } from '../lib/workflow.mjs';
import { validatePackagingManifest } from '../package-dealer.mjs';
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
  installUpgrade,
  rollbackUpgrade,
  updateManifestPins
} from './three-way-upgrade.mjs';
import { readPinnedTemplateTree } from './pinned-template-source.mjs';

const TEMPLATE_KEYS = ['auto-best', 'modern', 'carwow', 'import'];
const sha256 = value => crypto.createHash('sha256').update(value).digest('hex');
const readJson = file => JSON.parse(fs.readFileSync(file, 'utf8').replace(/^\uFEFF/, ''));
const writeJsonExclusive = (file, value) => fs.writeFileSync(file, `${JSON.stringify(value, null, 2)}\n`, { flag: 'wx' });

export const updateDealerTemplateUsage = `
Opt in to a template update for one existing dealer.

  node update-dealer-template.mjs plan --dealer-root <path> [--cars-root <path>]
       [--template-root <path>] [--lock-file <path>] [--run-dir <path>]
       [--candidate-dir <path>] [--resolutions-file <json-path>]
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
    plan: new Set(['dealer-root', 'cars-root', 'template-root', 'lock-file', 'run-dir', 'candidate-dir', 'resolutions-file']),
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

export function targetManifestForUpgrade({ dealerRoot, manifest, pins }) {
  const next = updateManifestPins(manifest, pins);
  const kinds = new Set(Object.entries(pins).map(([key, pin]) =>
    pin.targetSource.repository === 'darkapoparka/cars' && pin.targetSource.path === `templates/${key}` ? 'cars-native' : 'legacy'
  ));
  if (kinds.size !== 1) throw new Error('A dealer update cannot mix Cars-native and legacy target sources');
  if (!kinds.has('cars-native')) return validatePackagingManifest(next);
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
  next.packaging = { version: '2' };
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
    addPrefixedTree(oldFiles, key, oldBases[key]);
    addPrefixedTree(newFiles, key, newBases[key]);
  }
  let fromAdapter, targetAdapter;
  if (manifest.packaging.version === '1') {
    fromAdapter = 'cars-package-v1-mounts';
    await applyMounts(oldFiles, manifest);
  } else if (manifest.packaging.version === '2') {
    fromAdapter = 'cars-package-v2-native-mounts';
    oldFiles = applyNativeMounts(oldFiles, manifest);
  } else throw new Error(`Unsupported dealer packaging version: ${manifest.packaging?.version}`);
  if (targetManifest.packaging.version === '1') {
    targetAdapter = 'cars-package-v1-mounts';
    await applyMounts(newFiles, targetManifest);
  } else if (targetManifest.packaging.version === '2') {
    targetAdapter = 'cars-package-v2-native-mounts';
    newFiles = applyNativeMounts(newFiles, targetManifest);
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

function writeDirectoryTreeChanges(root, before, after) {
  for (const name of new Set([...before.keys(), ...after.keys()])) {
    const oldBytes = before.get(name) ?? null;
    const newBytes = after.get(name) ?? null;
    if (oldBytes && newBytes && oldBytes.equals(newBytes)) continue;
    const target = path.join(root, name);
    if (newBytes === null) fs.rmSync(target, { force: true });
    else {
      fs.mkdirSync(path.dirname(target), { recursive: true });
      fs.writeFileSync(target, newBytes);
    }
  }
}

function addNativeAdoption(plan, candidateDirectory, dealerRoot, lock) {
  if (plan.manifest.packaging.version !== '2') {
    reconcilePlanWithCandidate({ source: dealerRoot, plan, candidateDirectory });
    return;
  }
  const files = readDirectoryTree(candidateDirectory);
  const before = new Map([...files].map(([name, bytes]) => [name, Buffer.from(bytes)]));
  const candidateManifest = JSON.parse(files.get('dealer.json').toString('utf8').replace(/^\uFEFF/, ''));
  validatePackagingManifest(candidateManifest);
  const adopted = adoptNativeSource(files, candidateManifest, lock.templates);
  assertNativeAdoption(adopted, candidateManifest);
  writeDirectoryTreeChanges(candidateDirectory, before, adopted);
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
    const oldTree = readPinnedTemplateTree({ key, repositoryPath: paths[oldSource.repository], source: oldSource });
    const targetTree = readPinnedTemplateTree({ key, repositoryPath: paths[targetSource.repository], source: targetSource });
    if (oldTree.digest !== oldSource.digest || targetTree.digest !== targetSource.digest) {
      throw new Error(`${key}: immutable base digest changed after review`);
    }
    oldBases[key] = oldTree.tree;
    newBases[key] = targetTree.tree;
  }
  const targetManifest = metadata.targetManifest;
  validatePackagingManifest(targetManifest);
  if (sha256(Buffer.from(JSON.stringify(targetManifest))) !== metadata.targetManifestSha256) {
    throw new Error('Reviewed target dealer manifest changed after planning');
  }
  const adapted = await adaptPinnedBases({ keys: Object.keys(metadata.pins), oldBases, newBases, manifest, targetManifest });
  if (adapted.adapter !== metadata.baseAdapter) throw new Error('Dealer source adapter changed after review; create a new update plan');
  return adapted;
}

function validateRepositoryPaths(pins, paths) {
  for (const pin of Object.values(pins)) {
    for (const locator of [pin.fromSource, pin.targetSource]) {
      const checkout = paths[locator.repository];
      if (!checkout || !fs.existsSync(checkout)) throw new Error(`No local checkout for ${locator.repository}: ${checkout || '(unmapped)'}`);
    }
  }
}

function renderPins(pins) {
  return JSON.parse(JSON.stringify(pins));
}

async function runPlan(values) {
  const carsRoot = fs.realpathSync(path.resolve(values['cars-root'] || defaultCarsRoot()));
  const dealerRoot = fs.realpathSync(required(values, 'dealer-root'));
  const manifestPath = path.join(dealerRoot, 'dealer.json');
  const lockFile = path.resolve(values['lock-file'] || path.join(carsRoot, 'templates.lock.json'));
  const templateRoot = path.resolve(values['template-root'] || path.join(path.dirname(carsRoot), 'template-repos'));
  if (!fs.existsSync(manifestPath)) throw new Error(`Dealer manifest not found: ${manifestPath}`);
  if (!fs.existsSync(lockFile)) throw new Error(`Template approval lock not found: ${lockFile}`);
  const manifest = readJson(manifestPath);
  validatePackagingManifest(manifest);
  const lockBytes = fs.readFileSync(lockFile);
  const lock = JSON.parse(lockBytes.toString('utf8').replace(/^\uFEFF/, ''));
  const pins = selectPinnedRevisions(manifest, lock);
  const targetManifest = targetManifestForUpgrade({ dealerRoot, manifest, pins });
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
    const oldTree = readPinnedTemplateTree({
      key,
      repositoryPath: paths[pin.fromSource.repository],
      source: pin.fromSource
    });
    const targetTree = readPinnedTemplateTree({
      key,
      repositoryPath: paths[pin.targetSource.repository],
      source: pin.targetSource
    });
    oldBases[key] = oldTree.tree;
    newBases[key] = targetTree.tree;
    bases[key] = {
      old: { ...pin.fromSource, digest: oldTree.digest },
      target: { ...pin.targetSource, digest: targetTree.digest }
    };
  }

  const adapted = await adaptPinnedBases({ keys: Object.keys(pins), oldBases, newBases, manifest, targetManifest });
  const plan = planDealerUpgrade({ dealerRoot, lock, oldBases: adapted.oldBases, newBases: adapted.newBases, targetManifest: adapted.targetManifest, resolutions });
  let candidateDirectory = null, candidateDigest = null;
  if (plan.ready) {
    candidateDirectory = materializeUpgradeCandidate({
      source: dealerRoot,
      plan,
      destination: candidatePath
    });
    addNativeAdoption(plan, candidateDirectory, dealerRoot, lock);
    candidateDigest = fingerprint(candidateDirectory).digest;
  }
  const review = upgradeReviewReport(plan);
  const reviewBytes = Buffer.from(`${JSON.stringify(review, null, 2)}\n`);
  writeJsonExclusive(path.join(runDirectory, 'review.json'), review);
  if (resolutionBytes) fs.writeFileSync(path.join(runDirectory, 'resolutions.json'), resolutionBytes, { flag: 'wx' });

  const metadata = {
    schemaVersion: 1,
    createdAt: new Date().toISOString(),
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
    sourceBeforeSha256: fingerprint(dealerRoot).digest,
    runDirectory,
    pins: renderPins(pins),
    bases,
    ready: plan.ready,
    reviewSha256: sha256(reviewBytes),
    reviewDigest: sha256(Buffer.from(JSON.stringify(review))),
    candidateDirectory,
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
    const originalPins = selectPinnedRevisions(originalManifest, lock);
    if (JSON.stringify(renderPins(originalPins)) !== JSON.stringify(metadata.pins) ||
        JSON.stringify(stableChangeHashes(review.changes)) !== JSON.stringify(stableChangeHashes(receipt.changes || []))) {
      throw new Error('Installed receipt does not match the reviewed update plan');
    }
    await validatePinnedBaseEvidence(metadata, originalManifest, lock, paths);
    const retried = installUpgrade({
      source: dealerRoot,
      plan: { ready: true, changes: review.changes },
      runDir: runDirectory,
      candidateDirectory
    });
    return { action: 'install', ...retried };
  }
  if (fingerprint(dealerRoot).digest !== metadata.sourceBeforeSha256) {
    throw new Error('Dealer source changed after candidate review; create and preview a new update plan');
  }
  const manifest = readJson(path.join(dealerRoot, 'dealer.json'));
  validatePackagingManifest(manifest);
  const pins = selectPinnedRevisions(manifest, lock);
  const targetManifest = targetManifestForUpgrade({ dealerRoot, manifest, pins });
  if (JSON.stringify(renderPins(pins)) !== JSON.stringify(metadata.pins)) {
    throw new Error('Dealer template pins changed after review; create a new update plan');
  }
  const adapted = await validatePinnedBaseEvidence(metadata, manifest, lock, paths);
  const plan = planDealerUpgrade({ dealerRoot, lock, oldBases: adapted.oldBases, newBases: adapted.newBases, targetManifest: adapted.targetManifest, resolutions });
  let recomputedReview;
  if (plan.ready) {
    fs.mkdirSync(path.dirname(candidateDirectory), { recursive: true });
    const validationCandidate = fs.mkdtempSync(path.join(path.dirname(candidateDirectory), '.cars-upgrade-validation-'));
    try {
      materializeUpgradeCandidate({ source: dealerRoot, plan, destination: validationCandidate });
      addNativeAdoption(plan, validationCandidate, dealerRoot, lock);
      recomputedReview = upgradeReviewReport(plan);
    } finally {
      fs.rmSync(validationCandidate, { recursive: true, force: true });
    }
  } else recomputedReview = upgradeReviewReport(plan);
  if (sha256(Buffer.from(JSON.stringify(recomputedReview))) !== metadata.reviewDigest) {
    throw new Error('Current merge plan differs from the reviewed plan; create a new update plan');
  }
  const installed = installUpgrade({ source: dealerRoot, plan, runDir: runDirectory, candidateDirectory });
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
