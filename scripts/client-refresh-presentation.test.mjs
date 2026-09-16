import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import test from 'node:test';
import { refreshAdapterInternals } from './lib/client-refresh-adapters.mjs';
import { assertTemplatePresentation } from './lib/client-refresh-presentation.mjs';

const write = (root, relative, content) => {
  const file = path.join(root, relative);
  fs.mkdirSync(path.dirname(file), { recursive: true });
  fs.writeFileSync(file, content);
};

test('dealer logos must be committed PNG or WebP assets', () => {
  assert.equal(refreshAdapterInternals.isRasterLogo('/dealer/logo.png'), true);
  assert.equal(refreshAdapterInternals.isRasterLogo('/dealer/logo.WEBP?rev=2'), true);
  assert.equal(refreshAdapterInternals.isRasterLogo('/dealer/logo.svg'), false);
  assert.deepEqual(
    refreshAdapterInternals.rasterLogoCandidates('/dealer/wordmark.svg'),
    ['/dealer/wordmark.webp', '/dealer/wordmark.png']
  );
  assert.equal(refreshAdapterInternals.isRasterLogo(''), false);
});

test('dealer refresh rejects CSS and hero composition changes', () => {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), 'cars-presentation-'));
  const template = path.join(root, 'template');
  const candidate = path.join(root, 'candidate');
  for (const base of [template, candidate]) {
    write(base, 'src/lib/components/home/Hero.svelte', '<section>hero</section>');
    write(base, 'src/lib/styles/tokens.css', ':root { --accent: red; }');
    write(base, 'static/assets/home-hero.webp', 'same-image');
    for (const relative of [
      'src/lib/data/home.ts',
      'src/lib/data/feature-artwork.ts',
      'src/lib/data/service-artwork.ts',
      'src/lib/data/vehicle-artwork.ts'
    ]) write(base, relative, '// template-owned presentation fixture');
  }
  assert.equal(assertTemplatePresentation({ key: 'auto-best', template, candidate }), true);
  write(candidate, 'src/lib/styles/tokens.css', ':root { --accent: blue; }');
  assert.throws(
    () => assertTemplatePresentation({ key: 'auto-best', template, candidate }),
    /template-owned presentation/
  );
  fs.rmSync(root, { recursive: true, force: true });
});
