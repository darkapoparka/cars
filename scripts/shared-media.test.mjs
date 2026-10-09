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

test('shared media accepts already omitted Svelte output only with exact retention and source evidence', async t => {
  const packageRoot = await mkdtemp(path.join(os.tmpdir(), 'cars-shared-retention-'));
  t.after(() => rm(packageRoot, { recursive: true, force: true }));
  const digest = sha256(mediaBytes), relative = 'dealer/old.png';
  const sourceFile = path.join(packageRoot, 'carwow/static', relative);
  const proof = path.join(packageRoot, 'carwow/.svelte-kit/cars-public-assets/retention.json');
  await mkdir(path.dirname(sourceFile), { recursive: true });
  await mkdir(path.dirname(proof), { recursive: true });
  await mkdir(path.join(packageRoot, 'carwow/.vercel/output/static'), { recursive: true });
  await writeFile(sourceFile, mediaBytes);
  await writeFile(path.join(packageRoot, '.cars-package.json'), JSON.stringify({ manifest: { slug: 'review-fixture' } }));
  await writeFile(path.join(packageRoot, 'dealer.json'), JSON.stringify({ slug: 'review-fixture', variants: [{ key: 'carwow', base: '/variant-3' }] }));
  await writeFile(path.join(packageRoot, '.cars-shared-media.json'), JSON.stringify({ schemaVersion: 1, dealer: 'review-fixture', entries: [{ service: 'carwow', relative, sha256: digest, bytes: mediaBytes.length, remoteUrl: remoteUrl(digest) }] }));
  await assert.rejects(pruneService('carwow', { packageRoot }), /Missing expected/);
  await writeFile(proof, JSON.stringify({ omitted: [{ path: relative, sha256: digest, bytes: mediaBytes.length }] }));
  assert.equal((await pruneService('carwow', { packageRoot })).prunedFiles, 0);
  await writeFile(sourceFile, 'customized dealer artwork');
  await assert.rejects(pruneService('carwow', { packageRoot }), /differs from omission evidence/);
  assert.equal((await readFile(sourceFile)).toString(), 'customized dealer artwork');
});

test('reviewed unused files do not consume shared-media routes even when cataloged', () => {
  const files = packageFiles();
  const digest = sha256(mediaBytes);
  for (const key of ['auto-best', 'modern']) {
    files.set(`${key}/public-assets.policy.json`, Buffer.from(JSON.stringify({
      schemaVersion: 1, family: key, keepPrefixes: [],
      candidates: [{ path: 'dealer/shared.png', sha256: digest, reason: 'Reviewed obsolete sample artwork, source retained.' }],
    })));
  }
  const catalog = { [digest]: { sha256: digest, bytes: mediaBytes.length, url: remoteUrl(digest), contentType: 'image/png' } };
  const receipt = applySharedMedia(files, catalog);
  assert.equal(receipt.entries.length, 0);
  assert.deepEqual(files.get('auto-best/static/dealer/shared.png'), mediaBytes);
  assert.equal(JSON.parse(files.get('vercel.json')).rewrites.length, 3);
});

test('a new consumer protects cataloged media from an obsolete-asset policy', () => {
  const files = packageFiles(), digest = sha256(mediaBytes);
  files.set('modern/public-assets.policy.json', Buffer.from(JSON.stringify({ schemaVersion: 1, family: 'modern',
    candidates: [{ path: 'dealer/shared.png', sha256: digest, reason: 'Previously obsolete image; recheck consumers.' }] })));
  files.set('modern/apps/web/app/page.tsx', Buffer.from('const image = "/dealer/shared.png";'));
  const catalog = { [digest]: { sha256: digest, bytes: mediaBytes.length, url: remoteUrl(digest), contentType: 'image/png' } };
  assert.equal(applySharedMedia(files, catalog).entries.length, 2);
});

test('Mobile and Signature preserve shared media routing with framework-specific prune order', async t => {
  const variants=[{key:'mobile',base:'/variant-5',entry:'/variant-5/'},{key:'karento-best',base:'/variant-6',entry:'/variant-6/'}];
  const files=packageFiles(variants),config=JSON.parse(files.get('vercel.json'));
  config.services={mobile:{buildCommand:'build-mobile'},signature:{buildCommand:'build-signature'}};
  files.set('vercel.json',Buffer.from(JSON.stringify(config)));
  files.set('mobile/public/dealer/shared.png',Buffer.from(mediaBytes));
  files.set('karento-best/static/dealer/shared.png',Buffer.from(mediaBytes));
  const digest=sha256(mediaBytes);
  const receipt=applySharedMedia(files,{[digest]:{sha256:digest,bytes:mediaBytes.length,url:remoteUrl(digest),contentType:'image/png'}});
  const routed=JSON.parse(files.get('vercel.json'));
  assert.equal(routed.services.mobile.buildCommand,'node ../scripts/prune-shared-media.mjs mobile && build-mobile');
  assert.equal(routed.services.signature.buildCommand,'build-signature && node ../scripts/prune-shared-media.mjs karento-best');
  assert.deepEqual(receipt.entries.map(entry=>entry.sourceUrlPath),['/variant-5/dealer/shared.png','/variant-6/dealer/shared.png']);
  const packageRoot=await mkdtemp(path.join(os.tmpdir(),'cars-six-shared-media-'));
  t.after(async()=>{
    const relative=path.relative(path.resolve(os.tmpdir()),path.resolve(packageRoot));
    assert.ok(relative&&relative!=='..'&&!relative.startsWith('..'+path.sep)&&!path.isAbsolute(relative));
    await rm(packageRoot,{recursive:true,force:true});
  });
  await writeFile(path.join(packageRoot,'.cars-shared-media.json'),JSON.stringify(receipt));
  await writeFile(path.join(packageRoot,'.cars-package.json'),JSON.stringify({manifest:{slug:'review-fixture'}}));
  await writeFile(path.join(packageRoot,'dealer.json'),files.get('dealer.json'));
  for(const [service,output] of [['mobile','mobile/public/dealer/shared.png'],['karento-best','karento-best/.vercel/output/static/variant-6/dealer/shared.png']]){
    const file=path.join(packageRoot,output);
    await mkdir(path.dirname(file),{recursive:true});
    await writeFile(file,mediaBytes);
    assert.equal((await pruneService(service,{packageRoot})).prunedFiles,1);
    await assert.rejects(readFile(file),{code:'ENOENT'});
  }
});
