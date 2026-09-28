import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import { mkdtemp, mkdir, readFile, rm, writeFile } from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import test from 'node:test';

const carsRoot = path.resolve(import.meta.dirname, '..');
const testRoot = path.dirname(fileURLToPath(import.meta.url));
const importCarsModule = relative => import(pathToFileURL(path.join(carsRoot, relative)).href);
const { applySharedMedia } = await importCarsModule('scripts/publishing/shared-media.mjs');
const { pruneService } = await importCarsModule('scripts/publishing/prune-shared-media.mjs');

const sha256 = bytes => createHash('sha256').update(bytes).digest('hex');
const remoteUrl = digest => 'https://storage.public.blob.vercel-storage.com/cars/v1/' + digest + '.png';
const mediaBytes = Buffer.from('unchanged frontend media bytes');

function packageFiles(variants = [
  { key: 'auto-best', base: '', entry: '/' },
  { key: 'modern', base: '/variant-2', entry: '/variant-2/cars' },
  { key: 'carwow', base: '/variant-3', entry: '/variant-3/' },
]) {
  return new Map([
    ['dealer.json', Buffer.from(JSON.stringify({ schemaVersion: 1, slug: 'review-fixture', packaging: { version: '2' }, variants }))],
    ['vercel.json', Buffer.from(JSON.stringify({
      services: {
        autobest: { buildCommand: 'node ../scripts/build-native-service.mjs auto-best' },
        modern: { buildCommand: 'node ../../../scripts/build-native-service.mjs modern' },
        carwow: { buildCommand: 'node ../scripts/build-native-service.mjs carwow' },
      },
      rewrites: [
        { source: '/variant-2/(.*)', destination: { service: 'modern' } },
        { source: '/variant-3/(.*)', destination: { service: 'carwow' } },
        { source: '/(.*)', destination: { service: 'autobest' } },
      ],
      redirects: [],
      headers: [],
    }, null, 2))],
    ['auto-best/static/dealer/shared.png', Buffer.from(mediaBytes)],
    ['modern/apps/web/public/dealer/shared.png', Buffer.from(mediaBytes)],
  ]);
}

test('shared media routes precede service catchalls and frontend source bytes stay intact', () => {
  const files = packageFiles();
  const originalMedia = new Map([...files].filter(([name]) => name.endsWith('.png')));
  const digest = sha256(mediaBytes);
  const catalog = { [digest]: { sha256: digest, bytes: mediaBytes.length, url: remoteUrl(digest), contentType: 'image/png' } };

  const receipt = applySharedMedia(files, catalog);
  const config = JSON.parse(files.get('vercel.json').toString());

  assert.equal(receipt.entries.length, 2);
  assert.deepEqual(config.rewrites.slice(0, 2).map(route => route.destination), [remoteUrl(digest), remoteUrl(digest)]);
  assert.equal(config.services.modern.buildCommand, 'node ../../../scripts/prune-shared-media.mjs modern && node ../../../scripts/build-native-service.mjs modern');
  assert.equal(config.services.autobest.buildCommand, 'node ../scripts/build-native-service.mjs auto-best && node ../scripts/prune-shared-media.mjs auto-best');


  for (const [name, bytes] of originalMedia) assert.deepEqual(files.get(name), bytes);
  assert.equal(files.has('.cars-shared-media.json'), true);
});

test('invalid later catalog entry leaves routing and media bytes unmodified', () => {
  const files = packageFiles();
  const beforeConfig = Buffer.from(files.get('vercel.json'));
  const digest = sha256(mediaBytes);
  const otherBytes = Buffer.from('different cataloged media');
  const otherDigest = sha256(otherBytes);
  files.set('modern/apps/web/public/dealer/shared.png', otherBytes);
  const catalog = {
    [digest]: { sha256: digest, bytes: mediaBytes.length, url: remoteUrl(digest), contentType: 'image/png' },
    [otherDigest]: { sha256: otherDigest, bytes: otherBytes.length, url: remoteUrl(otherDigest), contentType: 'image/jpeg' },
  };

  assert.throws(() => applySharedMedia(files, catalog), /MIME type/);
  assert.deepEqual(files.get('vercel.json'), beforeConfig);
  assert.equal(files.has('.cars-shared-media.json'), false);
  assert.deepEqual(files.get('auto-best/static/dealer/shared.png'), mediaBytes);
});

test('Svelte post-build pruning removes only hash-verified generated output', async t => {
  const temp = await mkdtemp(path.join(testRoot, '.fixture-'));
  t.after(() => rm(temp, { recursive: true, force: true }));
  const packageRoot = path.join(temp, 'generated-package');
  const digest = sha256(mediaBytes);
  const outputFile = path.join(packageRoot, 'auto-best/.vercel/output/static/dealer/shared.png');
  const sourceFile = path.join(packageRoot, 'auto-best/static/dealer/shared.png');
  await mkdir(path.dirname(outputFile), { recursive: true });
  await mkdir(path.dirname(sourceFile), { recursive: true });
  await writeFile(outputFile, mediaBytes);
  await writeFile(sourceFile, mediaBytes);
  await writeFile(path.join(packageRoot, '.cars-shared-media.json'), JSON.stringify({
    schemaVersion: 1,
    dealer: 'review-fixture',
    entries: [{ service: 'auto-best', relative: 'dealer/shared.png', sha256: digest, bytes: mediaBytes.length, remoteUrl: remoteUrl(digest) }],
  }));
  await writeFile(path.join(packageRoot, '.cars-package.json'), JSON.stringify({
    schemaVersion: 1, manifest: { slug: 'review-fixture', packaging: { version: '2' } },
  }));
  await writeFile(path.join(packageRoot, 'dealer.json'), JSON.stringify({
    slug: 'review-fixture', variants: [{ key: 'auto-best', base: '' }],
  }));

  const result = await pruneService('auto-best', { packageRoot });
  assert.equal(result.prunedFiles, 1);
  await assert.rejects(readFile(outputFile), { code: 'ENOENT' });
  assert.deepEqual(await readFile(sourceFile), mediaBytes);
});

test('pruner rejects a package identity mismatch before touching files', async t => {
  const temp = await mkdtemp(path.join(testRoot, '.fixture-'));
  t.after(() => rm(temp, { recursive: true, force: true }));
  const packageRoot = path.join(temp, 'generated-package');
  const sourceFile = path.join(packageRoot, 'auto-best/.vercel/output/static/dealer/shared.png');
  await mkdir(path.dirname(sourceFile), { recursive: true });
  await writeFile(sourceFile, mediaBytes);
  await writeFile(path.join(packageRoot, '.cars-shared-media.json'), JSON.stringify({
    schemaVersion: 1, dealer: 'other-dealer', entries: [],
  }));
  await writeFile(path.join(packageRoot, '.cars-package.json'), JSON.stringify({
    schemaVersion: 1, manifest: { slug: 'review-fixture', packaging: { version: '2' } },
  }));
  await writeFile(path.join(packageRoot, 'dealer.json'), JSON.stringify({
    slug: 'review-fixture', variants: [{ key: 'auto-best', base: '' }],
  }));

  await assert.rejects(pruneService('auto-best', { packageRoot }), /generated dealer media package/);
  assert.deepEqual(await readFile(sourceFile), mediaBytes);
});

