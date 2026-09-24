import crypto from 'node:crypto';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { spawnSync } from 'node:child_process';

const TEXT_EXTENSIONS = new Set([
  '.cjs', '.css', '.html', '.js', '.json', '.md', '.mjs', '.svelte', '.ts', '.tsx', '.txt', '.xml', '.yaml', '.yml'
]);
const IGNORED_DIRECTORIES = new Set([
  '.git', '.vercel', '.netlify', 'node_modules', '.next', '.nuxt', '.svelte-kit', '.turbo', '.vite',
  '.cache', '.pnpm-store', 'dist', 'build', 'out', 'coverage', 'runtime', 'test-results',
  'playwright-report', 'blob-report'
]);
function ignoredFile(name) {
  if (name.startsWith('.env') && !/^\.env\.(?:example|sample|template)$/i.test(name)) return true;
  if (/\.(?:log|tsbuildinfo|pem|key|pfx|p12|pid)$/i.test(name)) return true;
  return /(?:credentials|service-account|license-certificate|purchase-code)/i.test(name) &&
    !/\.(?:[cm]?[jt]sx?|svelte|vue|py|sh|ps1)$/i.test(name);
}

const sha256 = value => crypto.createHash('sha256').update(value).digest('hex');
const exists = file => fs.existsSync(file);
const normalizedText = bytes => Buffer.from(bytes.toString('utf8').replace(/\r\n/g, '\n'));

function safeRelative(value) {
  const normalized = String(value).replaceAll('\\', '/');
  if (!normalized || normalized.startsWith('/') || /^[a-z]:/i.test(normalized) ||
      normalized.split('/').some(part => !part || part === '.' || part === '..')) {
    throw new Error(`Unsafe upgrade path: ${value}`);
  }
  return normalized;
}

function safeFileAt(root, relative) {
  const name = safeRelative(relative), full = path.join(root, name);
  let current = root;
  const parts = name.split('/');
  for (let index = 0; index < parts.length; index++) {
    current = path.join(current, parts[index]);
    let stat;
    try { stat = fs.lstatSync(current); }
    catch (error) { if (error.code === 'ENOENT') break; throw error; }
    if (stat.isSymbolicLink()) throw new Error(`Symlink path requires review: ${name}`);
    if (index < parts.length - 1 && !stat.isDirectory()) throw new Error(`Non-directory path component: ${name}`);
  }
  return full;
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

function assertOutsideSource(source, destination, label) {
  const physicalSource = fs.realpathSync(source);
  const physicalDestination = projectedPhysicalPath(destination);
  if (isInsidePath(physicalSource, physicalDestination) || isInsidePath(physicalDestination, physicalSource)) {
    throw new Error(`${label} must stay outside the dealer source checkout`);
  }
  if (path.relative(path.resolve(destination), physicalDestination) !== '') {
    throw new Error(`${label} must not resolve through a symlink or junction`);
  }
  return physicalDestination;
}

function assertCandidateRunRelationship(runDirectory, candidateDirectory) {
  const runRoot = fs.realpathSync(runDirectory);
  const candidatePath = path.resolve(candidateDirectory);
  const physicalCandidate = projectedPhysicalPath(candidatePath);
  if (path.relative(candidatePath, physicalCandidate) !== '') {
    throw new Error('Candidate directory must not resolve through a symlink or junction');
  }
  if (isInsidePath(runRoot, physicalCandidate) && !isInsidePath(physicalCandidate, runRoot)) {
    if (path.relative(path.join(runRoot, 'candidate'), physicalCandidate) !== '') {
      throw new Error('A candidate inside the update run must use its candidate/ directory');
    }
    return physicalCandidate;
  }
  if (isInsidePath(runRoot, physicalCandidate) || isInsidePath(physicalCandidate, runRoot)) {
    throw new Error('External candidate directory must remain separate from the update run directory');
  }
  return physicalCandidate;
}

function atomicWriteFile(target, bytes, { exclusive = false } = {}) {
  const directory = path.dirname(target);
  const existing = exists(target) ? fs.statSync(target) : null;
  const temp = path.join(directory, `.${path.basename(target)}.cars-upgrade-${crypto.randomUUID()}.tmp`);
  try {
    fs.writeFileSync(temp, bytes, { flag: 'wx', ...(existing ? { mode: existing.mode & 0o777 } : {}) });
    if (existing && process.platform !== 'win32') fs.chmodSync(temp, existing.mode & 0o777);
    if (exclusive || !existing) fs.linkSync(temp, target);
    else fs.renameSync(temp, target);
  } finally {
    try { if (exists(temp)) fs.rmSync(temp, { force: true }); }
    catch { /* A stale temp does not affect the completed link or rename. */ }
  }
}

function comparable(pathname, bytes) {
  if (bytes === null || bytes === undefined) return null;
  const text = TEXT_EXTENSIONS.has(path.extname(pathname).toLowerCase())
    ? tryUtf8(bytes)
    : null;
  return text === null ? Buffer.from(bytes) : normalizedText(bytes);
}

function tryUtf8(bytes) {
  if (bytes.includes(0)) return null;
  try { return new TextDecoder('utf-8', { fatal: true }).decode(bytes); }
  catch { return null; }
}

function same(pathname, a, b) {
  if (a === null || a === undefined || b === null || b === undefined) return a == null && b == null;
  return comparable(pathname, a).equals(comparable(pathname, b));
}

function gitMerge(pathname, dealerBytes, baseBytes, templateBytes, tempRoot) {
  if (!TEXT_EXTENSIONS.has(path.extname(pathname).toLowerCase()) ||
      [dealerBytes, baseBytes, templateBytes].some(bytes => tryUtf8(bytes) === null)) return null;
  const files = fs.mkdtempSync(path.join(tempRoot, 'merge-'));
  try {
    const dealer = path.join(files, 'dealer');
    const base = path.join(files, 'base');
    const template = path.join(files, 'template');
    fs.writeFileSync(dealer, normalizedText(dealerBytes));
    fs.writeFileSync(base, normalizedText(baseBytes));
    fs.writeFileSync(template, normalizedText(templateBytes));
    const result = spawnSync('git', [
      'merge-file', '-p', '-L', 'dealer', '-L', 'old-template', '-L', 'new-template',
      dealer, base, template
    ], { encoding: null, maxBuffer: 16 * 1024 * 1024, windowsHide: true });
    if (result.error) throw result.error;
    const output = Buffer.from(result.stdout || []);
    if (result.status === 0) return { clean: true, bytes: output };
    const preview = output.toString('utf8');
    const hasConflictMarkers = /^<<<<<<< .+\r?$/m.test(preview) && /^>>>>>>> .+\r?$/m.test(preview);
    if (result.status === 1 || hasConflictMarkers) return { clean: false, bytes: output };
    throw new Error(`git merge-file failed for ${pathname}: ${result.stderr?.toString() || result.status}`);
  } finally {
    fs.rmSync(files, { recursive: true, force: true });
  }
}

function mapOfFiles(value) {
  if (value instanceof Map) {
    return new Map([...value].map(([name, bytes]) => [safeRelative(name), Buffer.from(bytes)]));
  }
  if (typeof value === 'string') {
    const root = path.resolve(value), result = new Map();
    const walk = (directory, relative = '') => {
      if (!exists(directory)) return;
      for (const entry of fs.readdirSync(directory, { withFileTypes: true })) {
        if (entry.isDirectory() && IGNORED_DIRECTORIES.has(entry.name)) continue;
        const rel = relative ? `${relative}/${entry.name}` : entry.name;
        if (entry.isFile() && ignoredFile(entry.name)) continue;
        const file = path.join(directory, entry.name);
        if (entry.isDirectory()) walk(file, rel);
        else if (entry.isFile()) result.set(safeRelative(rel), fs.readFileSync(file));
        else if (entry.isSymbolicLink()) throw new Error(`Retained source link requires review: ${rel}`);
      }
    };
    walk(root);
    return result;
  }
  throw new TypeError('Upgrade trees must be Maps or directory paths');
}

function record(pathname, kind, before, after, extra = {}) {
  return {
    path: pathname,
    kind,
    beforeSha256: before == null ? null : sha256(before),
    afterSha256: after == null ? null : sha256(after),
    ...extra
  };
}

/** Select immutable revisions from the current Cars approval lock, never from a floating branch label. */
export function selectPinnedRevisions(manifest, lock) {
  if (!Array.isArray(manifest?.variants) || manifest.variants.length !== 3) {
    throw new Error('Template update requires the dealer’s recorded three-design manifest');
  }
  const keys = manifest.variants.map(({ key }) => key);
  if (![['auto-best', 'modern', 'carwow'], ['auto-best', 'import', 'carwow']]
    .some(allowed => JSON.stringify(allowed) === JSON.stringify(keys))) {
    throw new Error('Template update supports the standard trio or the Import trio in its recorded order');
  }
  const pins = {};
  for (const { key } of manifest.variants) {
    const previous = manifest.templateRevisions?.[key];
    const previousSource = manifest.templateSources?.[key];
    const approved = lock?.templates?.[key];
    const source = approved?.source || {
      repository: approved?.repository,
      revision: approved?.commit,
      path: approved?.repository === 'darkapoparka/cars' ? `templates/${key}` : ''
    };
    const targetRepository = source?.repository;
    const targetRevision = source?.revision || source?.commit;
    const targetPath = source?.path ?? source?.prefix ?? '';
    const targetDigest = source?.digest || approved?.digest;
    const targetTree = source?.tree ?? null;
    if (!/^[a-f0-9]{40}$/.test(previous || '')) throw new Error(`Missing recorded old template pin for ${key}`);
    const previousRepository = previousSource?.repository || `darkapoparka/cars-template-${key}`;
    const previousRevision = previousSource?.revision || previousSource?.commit || previous;
    const previousPath = previousSource?.path ?? previousSource?.prefix ??
      (previousRepository === 'darkapoparka/cars' ? `templates/${key}` : '');
    const previousTree = previousSource?.tree ?? null;
    const validPreviousStandalone = previousRepository === `darkapoparka/cars-template-${key}` && previousPath === '';
    const validPreviousCarsSubtree = previousRepository === 'darkapoparka/cars' && previousPath === `templates/${key}`;
    if ((!validPreviousStandalone && !validPreviousCarsSubtree) || previousRevision !== previous ||
        (previousSource?.digest !== undefined && !/^[a-f0-9]{64}$/.test(previousSource.digest || '')) ||
        (previousTree !== null && !/^[a-f0-9]{40}$/.test(previousTree || ''))) {
      throw new Error(`Invalid recorded old template source for ${key}`);
    }
    const validStandalone = targetRepository === `darkapoparka/cars-template-${key}` && targetPath === '';
    const validCarsSubtree = targetRepository === 'darkapoparka/cars' && targetPath === `templates/${key}`;
    if (approved?.status !== 'approved' || (!validStandalone && !validCarsSubtree) ||
        !/^[a-f0-9]{40}$/.test(targetRevision || '') || !/^[a-f0-9]{64}$/.test(targetDigest || '') ||
        (targetTree !== null && !/^[a-f0-9]{40}$/.test(targetTree || ''))) {
      throw new Error(`No exact approved target pin is available for ${key}`);
    }
    pins[key] = Object.freeze({
      repository: targetRepository,
      from: previous,
      to: targetRevision,
      digest: targetDigest,
      fromSource: Object.freeze({
        repository: previousRepository,
        revision: previous,
        path: previousPath,
        ...(previousSource?.digest ? { digest: previousSource.digest } : {}),
        ...(previousTree ? { tree: previousTree } : {})
      }),
      snapshotPath: approved.snapshotPath,
      targetSource: Object.freeze({
        repository: targetRepository,
        revision: targetRevision,
        path: targetPath,
        digest: targetDigest,
        ...(targetTree ? { tree: targetTree } : {})
      })
    });
  }
  return Object.freeze(pins);
}

export function updateManifestPins(manifest, pins) {
  const next = structuredClone(manifest);
  next.templateRevisions = { ...(next.templateRevisions || {}) };
  next.templateSources = { ...(next.templateSources || {}) };
  for (const [key, pin] of Object.entries(pins)) {
    next.templateRevisions[key] = pin.to;
    next.templateSources[key] = { ...pin.targetSource };
  }
  return next;
}

/** Produce a JSON-safe review artifact without embedding raw template/dealer files. */
export function upgradeReviewReport(plan) {
  return {
    schemaVersion: plan.schemaVersion,
    ready: plan.ready,
    pins: plan.pins || {},
    summary: plan.summary,
    changes: plan.changes.map(({ path: name, kind, beforeSha256, afterSha256, diff }) => ({
      path: name, kind, beforeSha256, afterSha256, diff
    })),
    conflicts: plan.conflicts.map(({ path: name, kind, beforeSha256, afterSha256, dealerSha256, dealerDiff, templateDiff, conflictPreview }) => ({
      path: name, kind, beforeSha256, afterSha256, dealerSha256, dealerDiff, templateDiff, conflictPreview
    }))
  };
}

/** Build one dealer-root plan for its exact recorded trio and an approved lock. */
export function planDealerUpgrade({ dealerRoot, lock, oldBases, newBases, targetManifest, manifestPath = 'dealer.json', resolutions = {}, tempRoot = os.tmpdir() }) {
  const source = path.resolve(dealerRoot);
  const safeManifestPath = safeRelative(manifestPath);
  const manifestFile = path.join(source, safeManifestPath);
  const manifestBytes = fs.readFileSync(manifestFile);
  const manifest = JSON.parse(manifestBytes.toString('utf8').replace(/^\uFEFF/, ''));
  const pins = selectPinnedRevisions(manifest, lock);
  const candidate = new Map(), changes = [], conflicts = [], perDesign = {};
  for (const key of Object.keys(pins)) {
    if (!oldBases?.[key] || !newBases?.[key]) throw new Error(`Missing exact old/new template trees for ${key}`);
    const oldBase = mapOfFiles(oldBases[key]);
    const newBase = mapOfFiles(newBases[key]);
    if (!oldBase.has('package.json') || !newBase.has('package.json')) throw new Error(`${key}: pinned template tree must contain package.json`);
    const designRoot = path.join(source, safeRelative(key));
    if (!exists(path.join(designRoot, 'package.json'))) throw new Error(`${key}: dealer source is missing its design package.json`);
    const planned = planThreeWayUpgrade({
      oldBase,
      newBase,
      dealer: designRoot,
      resolutions: Object.fromEntries(Object.entries(resolutions).filter(([name]) => name.startsWith(`${key}/`)).map(([name, value]) => [name.slice(key.length + 1), value])),
      tempRoot
    });
    perDesign[key] = planned;
    for (const [name, bytes] of planned.candidate) candidate.set(`${key}/${name}`, bytes);
    changes.push(...planned.changes.map(item => ({ ...item, path: `${key}/${item.path}` })));
    conflicts.push(...planned.conflicts.map(item => ({ ...item, path: `${key}/${item.path}` })));
  }
  const pinnedManifest = updateManifestPins(manifest, pins);
  const nextManifest = targetManifest ? structuredClone(targetManifest) : pinnedManifest;
  if (nextManifest.slug !== manifest.slug || nextManifest.repository !== manifest.repository ||
      JSON.stringify(nextManifest.variants) !== JSON.stringify(manifest.variants) ||
      JSON.stringify(nextManifest.templateRevisions) !== JSON.stringify(pinnedManifest.templateRevisions) ||
      JSON.stringify(nextManifest.templateSources) !== JSON.stringify(pinnedManifest.templateSources)) {
    throw new Error('Target dealer manifest differs from the reviewed identity, trio or exact source pins');
  }
  const nextManifestBytes = Buffer.from(`${JSON.stringify(nextManifest, null, 2)}\n`);
  if (!manifestBytes.equals(nextManifestBytes)) {
    candidate.set(safeManifestPath, nextManifestBytes);
    changes.push(record(safeManifestPath, 'manifest-pins', manifestBytes, nextManifestBytes, {
      diff: unifiedDiff(manifestBytes, nextManifestBytes, [`dealer/${safeManifestPath}`, `candidate/${safeManifestPath}`])
    }));
  }
  return {
    schemaVersion: 1,
    ready: conflicts.length === 0,
    pins,
    manifest: nextManifest,
    candidate,
    conflicts,
    changes: changes.sort((a, b) => a.path.localeCompare(b.path)),
    perDesign,
    summary: {
      designs: Object.keys(pins).length,
      examined: Object.values(perDesign).reduce((count, item) => count + item.summary.examined, 0),
      changed: changes.length,
      conflicts: conflicts.length,
      autoMerged: changes.filter(item => item.kind === 'auto-merged').length,
      dealerOnly: changes.filter(item => item.kind === 'dealer-only').length,
      templateOnly: changes.filter(item => item.kind === 'template-only').length
    }
  };
}

/**
 * Produce a non-writing three-way update tree from exact old/new template
 * bases and the dealer's current source. Conflicts remain unresolved and block
 * readiness until a deliberate per-path decision or edited resolution file is
 * supplied. No template version is inferred here; callers pin both bases.
 */
export function planThreeWayUpgrade({ oldBase, newBase, dealer, resolutions = {}, tempRoot = os.tmpdir() }) {
  const oldFiles = mapOfFiles(oldBase), newFiles = mapOfFiles(newBase), dealerFiles = mapOfFiles(dealer);
  const candidate = new Map(), changes = [], conflicts = [];
  const names = [...new Set([...oldFiles.keys(), ...newFiles.keys(), ...dealerFiles.keys()])].sort();
  for (const pathname of names) {
    const base = oldFiles.get(pathname) ?? null;
    const fresh = newFiles.get(pathname) ?? null;
    const live = dealerFiles.get(pathname) ?? null;
    let chosen, kind;

    if (same(pathname, live, base)) { chosen = fresh; kind = 'template-only'; }
    else if (same(pathname, fresh, base)) { chosen = live; kind = 'dealer-only'; }
    else if (same(pathname, live, fresh)) { chosen = live; kind = 'already-equal'; }
    else if (base === null && live !== null && fresh === null) { chosen = live; kind = 'dealer-added'; }
    else if (base === null && live === null) { chosen = fresh; kind = 'template-added'; }
    else if (live === null && fresh !== null && base !== null) {
      const decision = resolutions[pathname];
      if (decision === 'template') { chosen = fresh; kind = 'resolved-template'; }
      else if (decision === 'dealer') { chosen = null; kind = 'resolved-dealer-delete'; }
      else {
        chosen = null;
        conflicts.push(record(pathname, 'dealer-delete-vs-template-edit', base, fresh, {
          dealerDiff: unifiedDiff(base, null, [`old-template/${pathname}`, `dealer/${pathname}`]),
          templateDiff: unifiedDiff(base, fresh, [`old-template/${pathname}`, `new-template/${pathname}`])
        }));
        continue;
      }
    } else if (fresh === null && live !== null && base !== null) {
      const decision = resolutions[pathname];
      if (decision === 'dealer') { chosen = live; kind = 'resolved-dealer'; }
      else if (decision === 'template') { chosen = null; kind = 'resolved-template-delete'; }
      else {
        chosen = null;
        conflicts.push(record(pathname, 'dealer-edit-vs-template-delete', base, live, {
          dealerDiff: unifiedDiff(base, live, [`old-template/${pathname}`, `dealer/${pathname}`]),
          templateDiff: unifiedDiff(base, null, [`old-template/${pathname}`, `new-template/${pathname}`])
        }));
        continue;
      }
    } else if (base === null && live !== null && fresh !== null) {
      if (same(pathname, live, fresh)) { chosen = live; kind = 'already-equal'; }
      else {
        const decision = resolutions[pathname];
        if (decision === 'dealer') { chosen = live; kind = 'resolved-dealer'; }
        else if (decision === 'template') { chosen = fresh; kind = 'resolved-template'; }
        else {
          conflicts.push(record(pathname, 'dealer-added-vs-template-added', null, fresh, {
            dealerSha256: sha256(live),
            dealerDiff: unifiedDiff(null, live, [`empty/${pathname}`, `dealer/${pathname}`]),
            templateDiff: unifiedDiff(null, fresh, [`empty/${pathname}`, `new-template/${pathname}`])
          }));
          continue;
        }
      }
    } else {
      const merge = gitMerge(pathname, live, base, fresh, tempRoot);
      if (merge?.clean) { chosen = merge.bytes; kind = 'auto-merged'; }
      else {
        const decision = resolutions[pathname];
        if (decision === 'dealer') { chosen = live; kind = 'resolved-dealer'; }
        else if (decision === 'template') { chosen = fresh; kind = 'resolved-template'; }
        else if (Buffer.isBuffer(decision)) { chosen = decision; kind = 'resolved-manual'; }
        else {
          conflicts.push(record(pathname, merge ? 'text-merge-conflict' : 'binary-merge-conflict', base, fresh, {
            dealerSha256: sha256(live),
            conflictPreview: merge?.bytes.toString('utf8'),
            dealerDiff: unifiedDiff(base, live, [`old-template/${pathname}`, `dealer/${pathname}`]),
            templateDiff: unifiedDiff(base, fresh, [`old-template/${pathname}`, `new-template/${pathname}`])
          }));
          continue;
        }
      }
    }

    if (chosen !== null && chosen !== undefined) candidate.set(pathname, Buffer.from(chosen));
    if (!same(pathname, live, chosen ?? null)) {
      const diff = unifiedDiff(live, chosen ?? null, [`dealer/${pathname}`, `candidate/${pathname}`]);
      changes.push(record(pathname, kind, live, chosen ?? null, { diff }));
    }
  }

  return {
    schemaVersion: 1,
    ready: conflicts.length === 0,
    candidate,
    conflicts,
    changes,
    summary: {
      examined: names.length,
      changed: changes.length,
      conflicts: conflicts.length,
      autoMerged: changes.filter(item => item.kind === 'auto-merged').length,
      dealerOnly: changes.filter(item => item.kind === 'dealer-only').length,
      templateOnly: changes.filter(item => item.kind === 'template-only').length
    }
  };
}

export function unifiedDiff(beforeBytes, afterBytes, labels = ['dealer', 'candidate']) {
  const temp = fs.mkdtempSync(path.join(os.tmpdir(), 'cars-upgrade-diff-'));
  try {
    const before = path.join(temp, 'before');
    const after = path.join(temp, 'after');
    fs.writeFileSync(before, beforeBytes ?? Buffer.alloc(0));
    fs.writeFileSync(after, afterBytes ?? Buffer.alloc(0));
    const result = spawnSync('git', ['diff', '--no-index', '--no-prefix', '--', 'before', 'after'], {
      cwd: temp, encoding: 'utf8', maxBuffer: 8 * 1024 * 1024, windowsHide: true
    });
    if (result.error) throw result.error;
    if (![0, 1].includes(result.status)) throw new Error(`git diff failed: ${result.stderr}`);
    return result.stdout.replaceAll(before, labels[0]).replaceAll(after, labels[1]);
  } finally { fs.rmSync(temp, { recursive: true, force: true }); }
}

export function writeCandidateTree(plan, destination) {
  if (!plan?.ready) throw new Error('Unresolved template conflicts block candidate materialization');
  const root = path.resolve(destination);
  fs.mkdirSync(root, { recursive: true });
  if (fs.readdirSync(root).length) throw new Error('Candidate destination must be empty');
  for (const [name, bytes] of plan.candidate) {
    const file = path.join(root, safeRelative(name));
    fs.mkdirSync(path.dirname(file), { recursive: true });
    fs.writeFileSync(file, bytes, { flag: 'wx' });
  }
  return root;
}

/** Materialize the full buildable dealer source under runtime without touching its checkout. */
export function materializeUpgradeCandidate({ source, plan, destination }) {
  if (!plan?.ready) throw new Error('Unresolved template conflicts block candidate materialization');
  const target = path.resolve(destination);
  assertOutsideSource(source, target, 'Candidate destination');
  fs.mkdirSync(target, { recursive: true });
  if (fs.readdirSync(target).length) throw new Error('Candidate destination must be empty');
  const finalFiles = mapOfFiles(source);
  for (const item of plan.changes) {
    const name = safeRelative(item.path);
    if (item.afterSha256 === null) finalFiles.delete(name);
    else {
      const bytes = plan.candidate.get(name);
      if (!bytes || sha256(bytes) !== item.afterSha256) throw new Error(`Planned candidate bytes are missing or changed: ${name}`);
      finalFiles.set(name, Buffer.from(bytes));
    }
  }
  for (const [name, bytes] of finalFiles) {
    const file = path.join(target, safeRelative(name));
    fs.mkdirSync(path.dirname(file), { recursive: true });
    fs.writeFileSync(file, bytes, { flag: 'wx' });
  }
  return target;
}

/** Reconcile generated package metadata back into a reviewed source-to-candidate plan. */
export function reconcilePlanWithCandidate({ source, plan, candidateDirectory }) {
  if (!plan?.ready) throw new Error('Unresolved template conflicts block candidate reconciliation');
  const original = mapOfFiles(source), candidate = mapOfFiles(candidateDirectory);
  const previousKinds = new Map(plan.changes.map(item => [safeRelative(item.path), item.kind]));
  const names = [...new Set([...original.keys(), ...candidate.keys()])].sort();
  const changes = [];
  for (const name of names) {
    const before = original.get(name) ?? null;
    const after = candidate.get(name) ?? null;
    if (same(name, before, after)) continue;
    const kind = previousKinds.get(name) || 'generated-candidate';
    changes.push(record(name, kind, before, after, {
      diff: unifiedDiff(before, after, [`dealer/${name}`, `candidate/${name}`])
    }));
  }
  plan.candidate = candidate;
  plan.changes = changes;
  plan.summary = {
    ...plan.summary,
    changed: changes.length,
    autoMerged: changes.filter(item => item.kind === 'auto-merged').length,
    dealerOnly: changes.filter(item => item.kind === 'dealer-only').length,
    templateOnly: changes.filter(item => item.kind === 'template-only').length
  };
  return plan;
}

function stableChanges(changes) {
  return changes.map(({ path: name, beforeSha256, afterSha256 }) => ({
    path: safeRelative(name), beforeSha256: beforeSha256 ?? null, afterSha256: afterSha256 ?? null
  })).sort((left, right) => left.path.localeCompare(right.path, 'en'));
}

function reusableInstallReceipt({ source, runDir, plan }) {
  const receiptPath = path.join(runDir, 'rollback.json');
  if (!exists(receiptPath)) return null;
  const receipt = JSON.parse(fs.readFileSync(receiptPath, 'utf8'));
  const expectedChanges = stableChanges(plan.changes);
  const recordedChanges = Array.isArray(receipt.changes) ? stableChanges(receipt.changes) : null;
  if (receipt.schemaVersion !== 1 || path.resolve(receipt.source || '') !== path.resolve(source) ||
      JSON.stringify(recordedChanges) !== JSON.stringify(expectedChanges)) {
    throw new Error('Update run already has an immutable rollback receipt for a different install; use a fresh run directory');
  }
  if (receipt.rolledBackAt) throw new Error('This update run was already rolled back; use a fresh run directory to retry');
  const runRoot = fs.realpathSync(runDir);
  const backupDir = path.resolve(receipt.rollbackDirectory || '');
  const candidateDir = assertCandidateRunRelationship(runRoot, assertOutsideSource(
    source,
    path.resolve(receipt.candidateDirectory || ''),
    'Installed candidate'
  ));
  const relativeBackup = path.relative(runRoot, backupDir);
  for (const [directory, relative, label] of [[backupDir, relativeBackup, 'Immutable rollback backup']]) {
    if (!relative || relative === '..' || relative.startsWith(`..${path.sep}`) || path.isAbsolute(relative)) {
      throw new Error(`${label} must remain inside the update run directory`);
    }
    const physical = fs.realpathSync(directory);
    const physicalRelative = path.relative(runRoot, physical);
    if (!physicalRelative || physicalRelative === '..' || physicalRelative.startsWith(`..${path.sep}`) || path.isAbsolute(physicalRelative)) {
      throw new Error(`${label} escapes the update run directory`);
    }
  }
  for (const item of plan.changes) {
    const target = safeFileAt(source, item.path);
    const current = exists(target) ? fs.readFileSync(target) : null;
    if ((current === null ? null : sha256(current)) !== item.afterSha256) {
      throw new Error(`Update receipt exists, but installed source changed; preserve dealer edits: ${item.path}`);
    }
    if (item.beforeSha256 !== null) {
      const saved = fs.readFileSync(safeFileAt(backupDir, item.path));
      if (sha256(saved) !== item.beforeSha256) throw new Error(`Immutable rollback bytes failed integrity check: ${item.path}`);
    }
    const forwardFile = safeFileAt(candidateDir, item.path);
    const forward = exists(forwardFile) ? fs.readFileSync(forwardFile) : null;
    if ((forward === null ? null : sha256(forward)) !== item.afterSha256) {
      throw new Error(`Installed candidate bytes failed integrity check: ${item.path}`);
    }
  }
  return { ...receipt, noOp: true };
}

/** Install only reviewed path changes; create a machine-produced byte backup. */
export function installUpgrade({ source, plan, runDir, candidateDirectory, beforeWrite, afterWrite }) {
  if (!plan?.ready) throw new Error('Unresolved template conflicts block installation');
  const root = path.resolve(source), candidateDir = assertOutsideSource(
    root,
    path.resolve(candidateDirectory || path.join(runDir, 'candidate')),
    'Candidate directory'
  );
  assertCandidateRunRelationship(runDir, candidateDir);
  const lock = path.join(runDir, '.upgrade-write-lock');
  fs.mkdirSync(lock);
  const original = mapOfFiles(root), applied = [], conflicts = [];
  let backupDir = null;
  try {
    const candidateExists = exists(candidateDir);
    if (candidateExists && fs.readdirSync(candidateDir).length) {
      for (const item of plan.changes) {
        const file = safeFileAt(candidateDir, item.path);
        if (item.afterSha256 === null) {
          if (exists(file)) throw new Error(`Reviewed candidate still contains a planned deletion: ${item.path}`);
        } else if (!exists(file) || sha256(fs.readFileSync(file)) !== item.afterSha256) {
          throw new Error(`Reviewed candidate changed after build/preview: ${item.path}`);
        }
      }
    } else {
      if (candidateExists) fs.rmSync(candidateDir, { recursive: true, force: true });
      materializeUpgradeCandidate({ source: root, plan, destination: candidateDir });
    }
    const existingReceipt = reusableInstallReceipt({ source: root, runDir, plan });
    if (existingReceipt) return existingReceipt;
    if (beforeWrite) beforeWrite({ source: root, candidate: candidateDir, plan });
    const backupRoot = path.join(runDir, 'rollback-attempts');
    fs.mkdirSync(backupRoot, { recursive: true });
    backupDir = fs.mkdtempSync(path.join(backupRoot, 'attempt-'));
    const changed = plan.changes;
    for (const item of changed) {
      const target = safeFileAt(root, item.path), current = exists(target) ? fs.readFileSync(target) : null;
      if ((current === null ? null : sha256(current)) !== item.beforeSha256) throw new Error(`Source changed after review: ${item.path}`);
      const saved = safeFileAt(backupDir, item.path);
      if (current !== null) { fs.mkdirSync(path.dirname(saved), { recursive: true }); fs.writeFileSync(saved, current, { flag: 'wx' }); }
      if (item.afterSha256 === null) fs.rmSync(target, { force: true });
      else {
        const bytes = fs.readFileSync(safeFileAt(candidateDir, item.path));
        if (sha256(bytes) !== item.afterSha256) throw new Error(`Candidate changed after review: ${item.path}`);
        fs.mkdirSync(path.dirname(target), { recursive: true });
        atomicWriteFile(target, bytes);
      }
      applied.push(item);
      if (afterWrite) afterWrite(item);
    }
    const receipt = {
      schemaVersion: 1,
      installedAt: new Date().toISOString(),
      source: root,
      sourceBeforeSha256: sha256(Buffer.from(JSON.stringify([...original].sort(([a], [b]) => a.localeCompare(b)).map(([name, bytes]) => [name, sha256(bytes)])))),
      sourceAfterSha256: sha256(Buffer.from(JSON.stringify([...mapOfFiles(root)].sort(([a], [b]) => a.localeCompare(b)).map(([name, bytes]) => [name, sha256(bytes)])))),
      rollbackDirectory: backupDir,
      candidateDirectory: candidateDir,
      changes: changed
    };
    atomicWriteFile(path.join(runDir, 'rollback.json'), Buffer.from(JSON.stringify(receipt, null, 2) + '\n'), { exclusive: true });
    return { ...receipt, noOp: changed.length === 0 };
  } catch (error) {
    for (const item of applied.reverse()) {
      const target = safeFileAt(root, item.path), current = exists(target) ? fs.readFileSync(target) : null;
      if ((current === null ? null : sha256(current)) !== item.afterSha256) { conflicts.push(item.path); continue; }
      if (item.beforeSha256 === null) fs.rmSync(target, { force: true });
      else {
        if (!backupDir) throw new Error(`No rollback backup exists for applied path: ${item.path}`);
        const saved = safeFileAt(backupDir, item.path);
        fs.mkdirSync(path.dirname(target), { recursive: true }); atomicWriteFile(target, fs.readFileSync(saved));
      }
    }
    if (conflicts.length) error.message += `; preserved concurrent changes: ${conflicts.join(', ')}`;
    throw error;
  } finally { fs.rmdirSync(lock); }
}

/** Roll back only if every affected source path still matches this update. */
export function rollbackUpgrade({ source, receiptPath }) {
  const receipt = JSON.parse(fs.readFileSync(receiptPath, 'utf8'));
  const root = path.resolve(source);
  if (receipt.schemaVersion !== 1 || path.resolve(receipt.source) !== root || !Array.isArray(receipt.changes)) {
    throw new Error('Rollback receipt does not match this dealer source');
  }
  const runDir = path.dirname(path.resolve(receiptPath));
  const backupDir = path.resolve(receipt.rollbackDirectory);
  const candidateDir = assertOutsideSource(root, path.resolve(receipt.candidateDirectory), 'Candidate directory');
  assertCandidateRunRelationship(runDir, candidateDir);
  for (const directory of [backupDir]) {
    const relative = path.relative(fs.realpathSync(runDir), fs.realpathSync(directory));
    if (!relative || relative === '..' || relative.startsWith(`..${path.sep}`) || path.isAbsolute(relative)) {
      throw new Error('Rollback artifacts must remain inside the update run directory');
    }
  }
  const lock = path.join(runDir, '.upgrade-write-lock');
  fs.mkdirSync(lock);
  const restore = [], applied = [], rollbackConflicts = [];
  try {
    for (const item of receipt.changes) {
      const name = safeRelative(item.path), target = safeFileAt(root, name);
      const current = exists(target) ? fs.readFileSync(target) : null;
      const currentHash = current === null ? null : sha256(current);
      if (currentHash === item.beforeSha256) continue;
      if (currentHash !== item.afterSha256) throw new Error(`Cannot roll back changed dealer path; preserve concurrent edit: ${name}`);
      let before = null;
      if (item.beforeSha256 !== null) {
        before = fs.readFileSync(safeFileAt(backupDir, name));
        if (sha256(before) !== item.beforeSha256) throw new Error(`Rollback bytes failed integrity check: ${name}`);
      }
      if (item.afterSha256 !== null) {
        const forward = fs.readFileSync(safeFileAt(candidateDir, name));
        if (sha256(forward) !== item.afterSha256) throw new Error(`Installed candidate bytes failed integrity check: ${name}`);
      }
      restore.push({ ...item, name, target, before });
    }
    for (const item of restore) {
      const current = exists(item.target) ? fs.readFileSync(item.target) : null;
      if ((current === null ? null : sha256(current)) !== item.afterSha256) throw new Error(`Dealer source changed during rollback: ${item.name}`);
      if (item.beforeSha256 === null) fs.rmSync(item.target, { force: true });
      else {
        fs.mkdirSync(path.dirname(item.target), { recursive: true });
        atomicWriteFile(item.target, item.before);
      }
      applied.push(item);
    }
    const updated = { ...receipt, rolledBackAt: new Date().toISOString(), rollbackChanges: restore.map(({ path: name }) => name) };
    atomicWriteFile(receiptPath, Buffer.from(JSON.stringify(updated, null, 2) + '\n'));
    return updated;
  } catch (error) {
    for (const item of applied.reverse()) {
      const current = exists(item.target) ? fs.readFileSync(item.target) : null;
      if ((current === null ? null : sha256(current)) !== item.beforeSha256) { rollbackConflicts.push(item.name); continue; }
      if (item.afterSha256 === null) fs.rmSync(item.target, { force: true });
      else {
        const forward = fs.readFileSync(safeFileAt(candidateDir, item.name));
        fs.mkdirSync(path.dirname(item.target), { recursive: true });
        atomicWriteFile(item.target, forward);
      }
    }
    if (rollbackConflicts.length) error.message += `; preserved concurrent changes during rollback: ${rollbackConflicts.join(', ')}`;
    throw error;
  } finally { fs.rmdirSync(lock); }
}
