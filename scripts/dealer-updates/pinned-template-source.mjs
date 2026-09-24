import fs from 'node:fs';
import path from 'node:path';
import { exportCommit, fingerprintCommit, git, gitFiles } from '../lib/workflow.mjs';

function normalizedRepository(value) {
  return String(value || '')
    .replace(/^git@github\.com:/i, '')
    .replace(/^ssh:\/\/git@github\.com\//i, '')
    .replace(/^https?:\/\/github\.com\//i, '')
    .replace(/\.git$/i, '')
    .replace(/\/$/, '')
    .toLowerCase();
}

function isInsidePath(root, target) {
  const relative = path.relative(root, target);
  return relative === '' || (relative !== '..' && !relative.startsWith('..' + path.sep) && !path.isAbsolute(relative));
}

function projectedPhysicalPath(destination) {
  let existing = path.resolve(destination);
  const suffix = [];
  while (true) {
    try {
      fs.lstatSync(existing);
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

function assertExternalDestination(repositoryPath, destination, prefix = '', allowCarsRuntime = false) {
  const repository = fs.realpathSync(repositoryPath);
  const target = path.resolve(destination);
  const lexicalInside = isInsidePath(repository, target);
  const physicalTarget = projectedPhysicalPath(target);
  const physicalInside = isInsidePath(repository, physicalTarget);
  if (lexicalInside && !physicalInside) throw new Error('Pinned template export path escapes its repository through a link');
  if (!physicalInside) return;
  if (!allowCarsRuntime) throw new Error('Pinned template export must stay outside its authoritative repository');

  const physicalRelative = path.relative(repository, physicalTarget);
  const physicalFirst = physicalRelative.split(path.sep)[0]?.toLowerCase();
  const lexicalFirst = path.relative(repository, target).split(path.sep)[0]?.toLowerCase();
  if (physicalFirst !== 'runtime' || (lexicalInside && lexicalFirst !== 'runtime')) {
    throw new Error('Pinned template export inside Cars must stay under ignored runtime/');
  }
  const sourceTree = projectedPhysicalPath(path.resolve(repository, prefix || '.'));
  if (isInsidePath(sourceTree, physicalTarget)) {
    throw new Error('Pinned template export cannot be written inside its authoritative template subtree');
  }
}

/** Export exact commits from the registered template master without touching its index or worktree. */
export function exportPinnedTemplate({ repositoryPath, repository, revision, destination, expectedDigest, prefix = '' }) {
  const normalizedRepo = normalizedRepository(repository);
  if (normalizedRepo !== 'darkapoparka/cars' && !/^darkapoparka\/cars-template-[a-z0-9_.-]+$/i.test(normalizedRepo)) throw new Error('Expected a registered Cars template repository identity');
  if (normalizedRepo === 'darkapoparka/cars' && !/^templates\/(?:auto-best|modern|carwow|import)$/.test(prefix)) throw new Error('Cars monorepo exports require one exact templates/<key> subtree');
  if (normalizedRepo !== 'darkapoparka/cars' && prefix !== '') throw new Error('Standalone template exports must use the repository root');
  if (!/^[a-f0-9]{40}$/.test(revision || '')) throw new Error('Pinned template export requires an immutable commit SHA');
  if (expectedDigest !== undefined && !/^[a-f0-9]{64}$/.test(expectedDigest || '')) throw new Error('Expected release digest must be SHA-256');
  assertExternalDestination(repositoryPath, destination, prefix, normalizedRepo === 'darkapoparka/cars');
  const origin = normalizedRepository(git(repositoryPath, ['remote', 'get-url', 'origin']));
  if (origin !== normalizedRepo) throw new Error(`Template repository identity mismatch: expected ${repository}`);
  if (git(repositoryPath, ['rev-parse', `${revision}^{commit}`]) !== revision) throw new Error('Pinned template commit did not resolve exactly');
  const actual = exportCommit(repositoryPath, revision, destination, { prefix });
  if (expectedDigest && actual.digest !== expectedDigest) throw new Error(`Pinned template digest mismatch for ${revision}: ${actual.digest}`);
  return { directory: path.resolve(destination), repository: normalizedRepo, revision, path: prefix, digest: actual.digest, files: actual.files.length };
}

/** Read a pinned Git tree into memory; useful for provenance without another checkout/export. */
export function readRepositoryTreeMap({ repositoryPath, revision, prefix = '', filter }) {
  if (!/^[a-f0-9]{40}$/.test(revision || '')) throw new Error('Repository tree reads require an immutable commit SHA');
  const entries = gitFiles(repositoryPath, revision, { prefix, ...(filter ? { filter } : {}) });
  const files = new Map();
  for (let offset = 0; offset < entries.length; offset += 48) {
    const batch = entries.slice(offset, offset + 48);
    const bytes = git(repositoryPath, ['cat-file', '--batch'], {
      input: `${batch.map(item => item.blob).join('\n')}\n`,
      encoding: null
    });
    let cursor = 0;
    for (const entry of batch) {
      const newline = bytes.indexOf(10, cursor);
      const [objectId, type, sizeText] = bytes.subarray(cursor, newline).toString('utf8').split(' ');
      const size = Number(sizeText);
      if (objectId !== entry.blob || type !== 'blob' || !Number.isSafeInteger(size)) throw new Error(`Cannot read pinned blob: ${entry.path}`);
      const start = newline + 1, end = start + size;
      if (end > bytes.length || bytes[end] !== 10) throw new Error(`Truncated pinned blob: ${entry.path}`);
      files.set(entry.path, Buffer.from(bytes.subarray(start, end)));
      cursor = end + 1;
    }
  }
  return files;
}

/**
 * Resolve an immutable template tree from either its historical standalone
 * repository or the Cars monorepo. A monorepo locator must name the exact
 * `templates/<key>` subtree so a whole-repository digest cannot be mistaken
 * for the template digest.
 */
export function readPinnedTemplateTree({ key, repositoryPath, source, expectedDigest = source?.digest }) {
  if (!['auto-best', 'modern', 'carwow', 'import'].includes(key)) throw new Error(`Unknown template key: ${key}`);
  if (!source || typeof source !== 'object') throw new Error(`${key}: immutable source locator is required`);
  const repository = normalizedRepository(source.repository);
  const revision = source.revision || source.commit;
  const prefix = String(source.path ?? source.prefix ?? '').replaceAll('\\', '/').replace(/\/$/, '');
  const standaloneRepository = `darkapoparka/cars-template-${key}`;
  let kind;
  if (repository === standaloneRepository && prefix === '') kind = 'standalone';
  else if (repository === 'darkapoparka/cars' && prefix === `templates/${key}`) kind = 'cars-monorepo';
  else throw new Error(`${key}: source must be ${standaloneRepository} at root or darkapoparka/cars at templates/${key}`);
  if (!/^[a-f0-9]{40}$/.test(revision || '')) throw new Error(`${key}: immutable source requires an exact commit SHA`);
  if (expectedDigest !== undefined && expectedDigest !== null && !/^[a-f0-9]{64}$/.test(expectedDigest || '')) throw new Error(`${key}: expected source digest must be SHA-256`);

  const actualRepository = normalizedRepository(git(repositoryPath, ['remote', 'get-url', 'origin']));
  if (actualRepository !== repository) throw new Error(`${key}: source repository identity mismatch; expected ${repository}`);
  const files = readRepositoryTreeMap({ repositoryPath, revision, prefix });
  if (!files.size) throw new Error(`${key}: pinned source tree is empty`);
  const canonical = fingerprintCommit(repositoryPath, revision, { prefix });
  if (canonical.files.length !== files.size) throw new Error(`${key}: canonical fingerprint and loaded source tree differ`);
  const digest = canonical.digest;
  if (expectedDigest && digest !== expectedDigest) throw new Error(`${key}: source tree digest mismatch for ${revision}: ${digest}`);
  return {
    key,
    kind,
    repository,
    revision,
    path: prefix,
    digest,
    files: canonical.files.length,
    tree: files
  };
}

function sourceLocator(value, { repository, revision, digest, path: prefix = '' }, key, label) {
  const locator = value || { repository, revision, digest, path: prefix };
  const sourceRepository = normalizedRepository(locator.repository);
  const sourceRevision = locator.revision || locator.commit;
  const sourcePrefix = String(locator.path ?? locator.prefix ?? '').replaceAll('\\', '/').replace(/\/$/, '');
  const standalone = sourceRepository === `darkapoparka/cars-template-${key}` && sourcePrefix === '';
  const carsSubtree = sourceRepository === 'darkapoparka/cars' && sourcePrefix === `templates/${key}`;
  if ((!standalone && !carsSubtree) || !/^[a-f0-9]{40}$/.test(sourceRevision || '') ||
      (locator.digest !== undefined && !/^[a-f0-9]{64}$/.test(locator.digest || ''))) {
    throw new Error(`${key}: invalid ${label} immutable template source`);
  }
  return { repository: sourceRepository, revision: sourceRevision, path: sourcePrefix, ...(locator.digest ? { digest: locator.digest } : {}) };
}

function repositoryPathFor(locator, { repositoryPath, repositoryPaths, fallbackRepository }) {
  if (typeof repositoryPaths === 'function') return repositoryPaths(locator.repository);
  for (const [name, directory] of Object.entries(repositoryPaths || {})) {
    if (normalizedRepository(name) === locator.repository) return directory;
  }
  if (repositoryPath && locator.repository === fallbackRepository) return repositoryPath;
  throw new Error(`No local checkout is configured for pinned repository ${locator.repository}`);
}

/** Materialize the dealer's old base and exact approved target across standalone or Cars monorepo sources. */
export function exportPinnedTemplatePair({ pin, repositoryPath, repositoryPaths, runDirectory, key }) {
  if (!pin || !['auto-best', 'modern', 'carwow', 'import'].includes(key) ||
      !/^[a-f0-9]{40}$/.test(pin.from || '') || !/^[a-f0-9]{40}$/.test(pin.to || '')) {
    throw new Error(`${key}: invalid immutable old/new template pin pair`);
  }
  const oldSource = sourceLocator(pin.fromSource, {
    repository: pin.repository,
    revision: pin.from,
    digest: pin.fromDigest,
    path: pin.fromPath || ''
  }, key, 'old');
  const targetSource = sourceLocator(pin.targetSource, {
    repository: pin.repository,
    revision: pin.to,
    digest: pin.digest,
    path: pin.toPath || ''
  }, key, 'target');
  if (!/^[a-f0-9]{64}$/.test(targetSource.digest || '')) {
    throw new Error(`${key}: approved target source must include its exact SHA-256 subtree digest`);
  }
  if (oldSource.revision !== pin.from || targetSource.revision !== pin.to ||
      (pin.digest && targetSource.digest && pin.digest !== targetSource.digest)) {
    throw new Error(`${key}: source locator does not match the immutable old/new template pin pair`);
  }
  const root = path.resolve(runDirectory, 'template-bases', key);
  const materialize = (locator, label) => exportPinnedTemplate({
    repositoryPath: repositoryPathFor(locator, { repositoryPath, repositoryPaths, fallbackRepository: pin.repository }),
    repository: locator.repository,
    revision: locator.revision,
    prefix: locator.path,
    destination: path.join(root, label),
    expectedDigest: locator.digest
  });
  const oldBase = materialize(oldSource, 'old');
  const newBase = materialize(targetSource, 'new');
  return { key, oldBase, newBase };
}
