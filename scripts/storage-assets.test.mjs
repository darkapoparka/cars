import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import { mkdtemp, mkdir, readFile, rm, symlink, writeFile } from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import test from 'node:test';
import { StorageAssetError, verifyAndPrune } from './publishing/storage-assets.mjs';

const remoteUrl = 'https://assets.example.test/sha256/immutable-file.png';

function sha256(bytes) {
  return createHash('sha256').update(bytes).digest('hex');
}

async function withTempRoot(fn) {
  const parent = await mkdtemp(path.join(os.tmpdir(), 'storage-assets-'));
  const root = path.join(parent, 'package', 'public');
  await mkdir(root, { recursive: true });
  try {
    await fn({ parent, root });
  } finally {
    await rm(parent, { recursive: true, force: true });
  }
}

function entry(outputPath, bytes, extra = {}) {
  return {
    outputPath,
    sha256: sha256(bytes),
    bytes: bytes.length,
    remoteUrl,
    ...extra,
  };
}

test('dry run reports candidates and URL rewrites without removing generated or source files', async () => {
  await withTempRoot(async ({ parent, root }) => {
    const bytes = Buffer.from('immutable image bytes');
    const outputPath = path.join(root, 'assets', 'shared.png');
    const sourcePath = path.join(parent, 'source.png');
    await mkdir(path.dirname(outputPath), { recursive: true });
    await writeFile(outputPath, bytes);
    await writeFile(sourcePath, bytes);

    const result = await verifyAndPrune({
      root,
      entries: [entry('assets/shared.png', bytes, { sourceUrlPath: '/assets/shared.png' })],
    });

    assert.equal(result.dryRun, true);
    assert.equal(result.checkedFiles, 1);
    assert.equal(result.eligibleFiles, 1);
    assert.equal(result.eligibleBytes, bytes.length);
    assert.equal(result.prunedFiles, 0);
    assert.equal(result.prunedBytes, 0);
    assert.equal(result.rewriteMap['/assets/shared.png'], remoteUrl);
    assert.deepEqual(result.entries[0].action, 'would-prune');
    assert.deepEqual(await readFile(outputPath), bytes);
    assert.deepEqual(await readFile(sourcePath), bytes);
  });
});

test('prunes verified generated output and leaves original source untouched', async () => {
  await withTempRoot(async ({ parent, root }) => {
    const bytes = Buffer.from('verified shared bytes');
    const outputPath = path.join(root, 'media', 'logo.png');
    const sourcePath = path.join(parent, 'original', 'logo.png');
    await mkdir(path.dirname(outputPath), { recursive: true });
    await mkdir(path.dirname(sourcePath), { recursive: true });
    await writeFile(outputPath, bytes);
    await writeFile(sourcePath, bytes);

    const result = await verifyAndPrune({
      root,
      entries: [entry('media/logo.png', bytes, { sourceUrlPath: '/media/logo.png' })],
      dryRun: false,
    });

    assert.equal(result.dryRun, false);
    assert.equal(result.prunedFiles, 1);
    assert.equal(result.prunedBytes, bytes.length);
    assert.equal(result.entries[0].action, 'pruned');
    await assert.rejects(readFile(outputPath), { code: 'ENOENT' });
    assert.deepEqual(await readFile(sourcePath), bytes);
  });
});

test('validates all entries before mutation when a later candidate has a bad hash', async () => {
  await withTempRoot(async ({ root }) => {
    const good = Buffer.from('first valid file');
    const changed = Buffer.from('second file with different bytes');
    await writeFile(path.join(root, 'first.bin'), good);
    await writeFile(path.join(root, 'second.bin'), changed);

    await assert.rejects(
      verifyAndPrune({
        root,
        dryRun: false,
        entries: [
          entry('first.bin', good),
          { ...entry('second.bin', changed), sha256: sha256(Buffer.from('wrong expected content')) },
        ],
      }),
      error => error instanceof StorageAssetError && error.code === 'ERR_STORAGE_HASH_MISMATCH',
    );

    assert.deepEqual(await readFile(path.join(root, 'first.bin')), good);
    assert.deepEqual(await readFile(path.join(root, 'second.bin')), changed);
  });
});

test('rejects path traversal, duplicate mappings, and invalid remote URLs before mutation', async () => {
  await withTempRoot(async ({ root, parent }) => {
    const bytes = Buffer.from('candidate');
    const inside = path.join(root, 'safe.bin');
    const outside = path.join(parent, 'outside.bin');
    await writeFile(inside, bytes);
    await writeFile(outside, bytes);

    await assert.rejects(
      verifyAndPrune({ root, dryRun: false, entries: [entry('../outside.bin', bytes)] }),
      error => error instanceof StorageAssetError && error.code === 'ERR_STORAGE_PATH_INVALID',
    );
    await assert.rejects(
      verifyAndPrune({ root, dryRun: false, entries: [entry('safe.bin', bytes, { remoteUrl: 'http://assets.example.test/file.png' })] }),
      error => error instanceof StorageAssetError && error.code === 'ERR_STORAGE_REMOTE_URL_INVALID',
    );
    await assert.rejects(
      verifyAndPrune({
        root,
        dryRun: false,
        entries: [
          entry('safe.bin', bytes, { sourceUrlPath: '/same.png' }),
          entry('safe.bin', bytes, { sourceUrlPath: '/different.png' }),
        ],
      }),
      error => error instanceof StorageAssetError && error.code === 'ERR_STORAGE_DUPLICATE_OUTPUT_PATH',
    );
    await assert.rejects(
      verifyAndPrune({ root, dryRun: false, entries: [entry('safe.bin', bytes, { sourceUrlPath: '//other.example/path' })] }),
      error => error instanceof StorageAssetError && error.code === 'ERR_STORAGE_SOURCE_URL_INVALID',
    );

    assert.deepEqual(await readFile(inside), bytes);
    assert.deepEqual(await readFile(outside), bytes);
  });
});

test('rejects missing files and byte-count mismatches without pruning valid siblings', async () => {
  await withTempRoot(async ({ root }) => {
    const present = Buffer.from('present');
    await writeFile(path.join(root, 'present.bin'), present);

    await assert.rejects(
      verifyAndPrune({
        root,
        dryRun: false,
        entries: [entry('present.bin', present), entry('missing.bin', Buffer.from('missing'))],
      }),
      error => error instanceof StorageAssetError && error.code === 'ERR_STORAGE_OUTPUT_MISSING',
    );
    await assert.rejects(
      verifyAndPrune({
        root,
        dryRun: false,
        entries: [{ ...entry('present.bin', present), bytes: present.length + 1 }],
      }),
      error => error instanceof StorageAssetError && error.code === 'ERR_STORAGE_SIZE_MISMATCH',
    );
    assert.deepEqual(await readFile(path.join(root, 'present.bin')), present);
  });
});

test('rejects symlinked output files when the platform permits creating symlinks', async t => {
  await withTempRoot(async ({ root, parent }) => {
    const bytes = Buffer.from('outside target');
    const target = path.join(parent, 'target.bin');
    const link = path.join(root, 'linked.bin');
    await writeFile(target, bytes);
    try {
      await symlink(target, link, 'file');
    } catch (error) {
      if (['EPERM', 'EACCES', 'ENOTSUP'].includes(error.code)) {
        t.skip('This Windows environment does not permit test symlink creation.');
        return;
      }
      throw error;
    }

    await assert.rejects(
      verifyAndPrune({ root, dryRun: false, entries: [entry('linked.bin', bytes)] }),
      error => error instanceof StorageAssetError && error.code === 'ERR_STORAGE_SYMLINK',
    );
    assert.deepEqual(await readFile(target), bytes);
  });
});

test('requires an explicit absolute root and entries array', async () => {
  await assert.rejects(verifyAndPrune({ entries: [] }), { code: 'ERR_STORAGE_ROOT_REQUIRED' });
  await assert.rejects(verifyAndPrune({ root: 'relative/output', entries: [] }), { code: 'ERR_STORAGE_ROOT_NOT_ABSOLUTE' });
});


