import { createReadStream } from 'node:fs';
import { constants as fsConstants } from 'node:fs';
import { lstat, realpath, unlink } from 'node:fs/promises';
import { createHash } from 'node:crypto';
import path from 'node:path';

export class StorageAssetError extends Error {
  constructor(code, message, cause) {
    super(message, cause === undefined ? undefined : { cause });
    this.name = 'StorageAssetError';
    this.code = code;
  }
}

function fail(code, message, cause) {
  return new StorageAssetError(code, message, cause);
}

function validateRoot(root) {
  if (typeof root !== 'string' || root.trim() === '') {
    throw fail('ERR_STORAGE_ROOT_REQUIRED', 'root must be an explicit absolute generated-output directory.');
  }
  if (!path.isAbsolute(root)) {
    throw fail('ERR_STORAGE_ROOT_NOT_ABSOLUTE', 'root must be an absolute path.');
  }
  return path.resolve(root);
}

function validateRelativeOutputPath(outputPath) {
  if (typeof outputPath !== 'string' || outputPath.length === 0) {
    throw fail('ERR_STORAGE_PATH_INVALID', 'Each outputPath must be a non-empty relative path.');
  }
  if (outputPath.includes('\\') || outputPath.includes('\0') || outputPath.startsWith('/')) {
    throw fail('ERR_STORAGE_PATH_INVALID', 'outputPath must use relative slash-separated path segments.');
  }
  const segments = outputPath.split('/');
  if (segments.some(segment => segment === '' || segment === '.' || segment === '..' || segment.includes(':') || /[. ]$/.test(segment))) {
    throw fail('ERR_STORAGE_PATH_INVALID', 'outputPath contains an unsafe or non-canonical path segment.');
  }
  return segments;
}

function validateSourceUrlPath(sourceUrlPath) {
  if (sourceUrlPath === undefined) return undefined;
  if (typeof sourceUrlPath !== 'string' || !sourceUrlPath.startsWith('/') || sourceUrlPath.startsWith('//') || /[\\?#\0]/.test(sourceUrlPath)) {
    throw fail('ERR_STORAGE_SOURCE_URL_INVALID', 'sourceUrlPath must be a same-origin absolute URL path without query or fragment.');
  }
  return sourceUrlPath;
}

function validateRemoteUrl(remoteUrl) {
  if (typeof remoteUrl !== 'string' || remoteUrl.length === 0) {
    throw fail('ERR_STORAGE_REMOTE_URL_INVALID', 'Each entry must include an immutable HTTPS remoteUrl.');
  }
  let parsed;
  try {
    parsed = new URL(remoteUrl);
  } catch (error) {
    throw fail('ERR_STORAGE_REMOTE_URL_INVALID', 'remoteUrl must be a valid absolute HTTPS URL.', error);
  }
  if (parsed.protocol !== 'https:' || !parsed.hostname || parsed.username || parsed.password || parsed.search || parsed.hash) {
    throw fail('ERR_STORAGE_REMOTE_URL_INVALID', 'remoteUrl must use HTTPS and must not contain credentials, a query, or a fragment.');
  }
  return parsed.href;
}

function validateEntry(entry) {
  if (entry === null || typeof entry !== 'object' || Array.isArray(entry)) {
    throw fail('ERR_STORAGE_ENTRY_INVALID', 'Each entry must be an object.');
  }
  const segments = validateRelativeOutputPath(entry.outputPath);
  if (!Number.isSafeInteger(entry.bytes) || entry.bytes < 0) {
    throw fail('ERR_STORAGE_SIZE_INVALID', 'Each entry bytes value must be a non-negative safe integer.');
  }
  if (typeof entry.sha256 !== 'string' || !/^[a-f0-9]{64}$/i.test(entry.sha256)) {
    throw fail('ERR_STORAGE_HASH_INVALID', 'Each entry sha256 value must contain exactly 64 hexadecimal characters.');
  }
  return {
    outputPath: entry.outputPath,
    segments,
    sha256: entry.sha256.toLowerCase(),
    bytes: entry.bytes,
    remoteUrl: validateRemoteUrl(entry.remoteUrl),
    sourceUrlPath: validateSourceUrlPath(entry.sourceUrlPath),
  };
}

function isPathWithin(rootPath, candidatePath) {
  const relative = path.relative(rootPath, candidatePath);
  return relative === '' || (relative !== '..' && !relative.startsWith('..' + path.sep) && !path.isAbsolute(relative));
}

async function hashFile(filePath) {
  const hash = createHash('sha256');
  let bytes = 0;
  for await (const chunk of createReadStream(filePath, { flags: fsConstants.O_RDONLY })) {
    bytes += chunk.length;
    hash.update(chunk);
  }
  return { bytes, sha256: hash.digest('hex') };
}

async function inspectOutputFile(rootRealPath, item) {
  let current = rootRealPath;
  let info;
  for (let index = 0; index < item.segments.length; index += 1) {
    current = path.join(current, item.segments[index]);
    try {
      info = await lstat(current);
    } catch (error) {
      throw fail('ERR_STORAGE_OUTPUT_MISSING', 'Expected generated output file is missing: ' + item.outputPath, error);
    }
    if (info.isSymbolicLink()) {
      throw fail('ERR_STORAGE_SYMLINK', 'Symlinks are not allowed in outputPath: ' + item.outputPath);
    }
    const isLast = index === item.segments.length - 1;
    if (!isLast && !info.isDirectory()) {
      throw fail('ERR_STORAGE_PATH_NOT_DIRECTORY', 'An outputPath parent is not a directory: ' + item.outputPath);
    }
    if (isLast && !info.isFile()) {
      throw fail('ERR_STORAGE_OUTPUT_NOT_FILE', 'Expected a regular generated output file: ' + item.outputPath);
    }
  }
  if (!isPathWithin(rootRealPath, current)) {
    throw fail('ERR_STORAGE_PATH_ESCAPE', 'outputPath resolves outside the generated root: ' + item.outputPath);
  }
  if (info.size !== item.bytes) {
    throw fail('ERR_STORAGE_SIZE_MISMATCH', 'Generated output size does not match manifest: ' + item.outputPath);
  }
  const actual = await hashFile(current);
  if (actual.bytes !== item.bytes) {
    throw fail('ERR_STORAGE_SIZE_MISMATCH', 'Generated output size changed while being checked: ' + item.outputPath);
  }
  if (actual.sha256 !== item.sha256) {
    throw fail('ERR_STORAGE_HASH_MISMATCH', 'Generated output hash does not match manifest: ' + item.outputPath);
  }
  return { absolutePath: current, outputPath: item.outputPath };
}

function resultFor(items, dryRun, action) {
  const bytes = items.reduce((sum, item) => sum + item.bytes, 0);
  const rewriteMap = {};
  for (const item of items) {
    if (item.sourceUrlPath !== undefined) rewriteMap[item.sourceUrlPath] = item.remoteUrl;
  }
  return {
    dryRun,
    checkedFiles: items.length,
    eligibleFiles: items.length,
    eligibleBytes: bytes,
    prunedFiles: dryRun ? 0 : items.length,
    prunedBytes: dryRun ? 0 : bytes,
    rewriteMap,
    entries: items.map(item => ({
      outputPath: item.outputPath,
      sha256: item.sha256,
      bytes: item.bytes,
      remoteUrl: item.remoteUrl,
      ...(item.sourceUrlPath === undefined ? {} : { sourceUrlPath: item.sourceUrlPath }),
      action,
    })),
  };
}

/**
 * Validate every externalization candidate beneath an explicit generated output root.
 * No file is removed until all manifest, path, size, and hash checks have passed.
 * The caller is responsible for pointing root at a generated package and for uploading
 * the exact bytes to each immutable remoteUrl before invoking with dryRun: false.
 */
export async function verifyAndPrune({ root, entries, dryRun = true } = {}) {
  const requestedRoot = validateRoot(root);
  if (!Array.isArray(entries)) {
    throw fail('ERR_STORAGE_ENTRIES_INVALID', 'entries must be an array.');
  }
  if (typeof dryRun !== 'boolean') {
    throw fail('ERR_STORAGE_DRY_RUN_INVALID', 'dryRun must be a boolean.');
  }

  let rootInfo;
  try {
    rootInfo = await lstat(requestedRoot);
  } catch (error) {
    throw fail('ERR_STORAGE_ROOT_MISSING', 'Generated output root does not exist: ' + requestedRoot, error);
  }
  if (rootInfo.isSymbolicLink()) {
    throw fail('ERR_STORAGE_ROOT_SYMLINK', 'Generated output root must not be a symlink.');
  }
  if (!rootInfo.isDirectory()) {
    throw fail('ERR_STORAGE_ROOT_NOT_DIRECTORY', 'Generated output root must be a directory.');
  }
  const rootRealPath = await realpath(requestedRoot);

  const checked = [];
  const outputPaths = new Set();
  const sourcePaths = new Set();
  let totalBytes = 0;
  for (const entry of entries) {
    const item = validateEntry(entry);
    const outputKey = item.outputPath.toLocaleLowerCase('en-US');
    if (outputPaths.has(outputKey)) {
      throw fail('ERR_STORAGE_DUPLICATE_OUTPUT_PATH', 'Manifest contains a duplicate outputPath: ' + item.outputPath);
    }
    outputPaths.add(outputKey);
    if (item.sourceUrlPath !== undefined) {
      if (sourcePaths.has(item.sourceUrlPath)) {
        throw fail('ERR_STORAGE_DUPLICATE_SOURCE_PATH', 'Manifest contains a duplicate sourceUrlPath: ' + item.sourceUrlPath);
      }
      sourcePaths.add(item.sourceUrlPath);
    }
    totalBytes += item.bytes;
    if (!Number.isSafeInteger(totalBytes)) {
      throw fail('ERR_STORAGE_TOTAL_SIZE_INVALID', 'Total manifest bytes exceed the safe integer range.');
    }
    const checkedPath = await inspectOutputFile(rootRealPath, item);
    checked.push({ ...item, absolutePath: checkedPath.absolutePath });
  }

  if (dryRun) return resultFor(checked, true, 'would-prune');

  // Recheck the full set immediately before the first mutation. This keeps a changed
  // candidate from causing a partially pruned package after the initial validation.
  for (const item of checked) {
    await inspectOutputFile(rootRealPath, item);
  }

  let prunedFiles = 0;
  let prunedBytes = 0;
  try {
    for (const item of checked) {
      await unlink(item.absolutePath);
      prunedFiles += 1;
      prunedBytes += item.bytes;
    }
  } catch (error) {
    error.prunedFiles = prunedFiles;
    error.prunedBytes = prunedBytes;
    throw fail('ERR_STORAGE_PRUNE_FAILED', 'Pruning stopped after ' + prunedFiles + ' file(s) and ' + prunedBytes + ' byte(s).', error);
  }

  return resultFor(checked, false, 'pruned');
}
