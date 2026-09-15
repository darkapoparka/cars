import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import test from 'node:test';
import { copyReferencedAssets, mirrorRefreshTree } from './refresh-client.mjs';

const write = (root, relative, value = relative) => {
  const file = path.join(root, relative);
  fs.mkdirSync(path.dirname(file), { recursive: true });
  fs.writeFileSync(file, value);
};

test('recursive refresh mirror removes stale nested source while preserving generated caches', () => {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), 'cars-refresh-mirror-'));
  const source = path.join(root, 'source');
  const target = path.join(root, 'target');
  write(source, 'src/lib/current.ts', 'fresh');
  write(source, 'src/routes/page.svelte', 'new route');
  write(source, 'static/dealer/logo.svg', '<svg/>');
  write(target, 'src/lib/current.ts', 'old');
  write(target, 'src/lib/utils/preview-paths.ts', 'stale packaging helper');
  write(target, 'src/routes/old-page.svelte', 'stale route');
  write(target, 'node_modules/keep.txt', 'cache');
  write(target, '.svelte-kit/keep.txt', 'cache');

  mirrorRefreshTree(source, target);

  assert.equal(fs.readFileSync(path.join(target, 'src/lib/current.ts'), 'utf8'), 'fresh');
  assert.equal(fs.readFileSync(path.join(target, 'src/routes/page.svelte'), 'utf8'), 'new route');
  assert.ok(fs.existsSync(path.join(target, 'static/dealer/logo.svg')));
  assert.ok(!fs.existsSync(path.join(target, 'src/lib/utils/preview-paths.ts')));
  assert.ok(!fs.existsSync(path.join(target, 'src/routes/old-page.svelte')));
  assert.equal(fs.readFileSync(path.join(target, 'node_modules/keep.txt'), 'utf8'), 'cache');
  assert.equal(fs.readFileSync(path.join(target, '.svelte-kit/keep.txt'), 'utf8'), 'cache');
  fs.rmSync(root, { recursive: true, force: true });
});


test('referenced dealer assets can come from the canonical client asset directory', () => {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), 'cars-refresh-assets-'));
  const client = path.join(root, 'dealer');
  const oldVariant = path.join(client, 'auto-best');
  const candidate = path.join(root, 'candidate');
  write(client, 'assets/refined-logo.webp', 'refined-logo-bytes');
  write(candidate, 'src/lib/config/brand.ts', "export const brand = { logo: '/assets/dealer/refined-logo.webp' };\n");

  const copied = copyReferencedAssets(
    oldVariant,
    candidate,
    'auto-best',
    ['src/lib/config/brand.ts']
  );

  assert.deepEqual(copied, ['assets/dealer/refined-logo.webp']);
  assert.equal(
    fs.readFileSync(path.join(candidate, 'static/assets/dealer/refined-logo.webp'), 'utf8'),
    'refined-logo-bytes'
  );
  fs.rmSync(root, { recursive: true, force: true });
});
