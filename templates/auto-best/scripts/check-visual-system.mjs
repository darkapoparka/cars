import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import {createHash} from 'node:crypto';

const read = file => readFile(file, 'utf8');
const hash = value => createHash('sha256').update(value).digest('hex');
const [font, symbols, tokens, renderer, iconSource, layout, pkg] = await Promise.all([
  read('provenance/inter.json').then(JSON.parse),
  read('provenance/material-symbols.json').then(JSON.parse),
  read('src/lib/styles/tokens.css'),
  read('src/lib/components/layout/MobileActionIcon.svelte'),
  read('src/lib/components/layout/material-symbols-mobile.ts'),
  read('src/routes/+layout.svelte'), read('package.json').then(JSON.parse)
]);
assert.equal(font.version, '4.1', 'Inter version changes require a reviewed visual-system update');
assert.equal(font.upstreamSha256, '693b77d4f32ee9b8bfc995589b5fad5e99adf2832738661f5402f9978429a8e3');
assert.equal(hash(await readFile(font.file)), font.sha256, 'Delivered Inter binary must match its reviewed manifest');
assert(tokens.includes("--dn-font: 'Inter Variable'"), 'The shared family must remain Inter');
assert(tokens.includes("font-family: 'Inter Variable'"), 'Inter must be locally registered');
assert(tokens.includes("url('./fonts/InterVariable-v4.1.woff2')"), 'The bundled Inter file must own the face');
assert(!/@fontsource|fonts\.googleapis/.test(layout), 'Do not reintroduce a second runtime font import');
assert(!Object.keys(pkg.dependencies ?? {}).some(name => /@fontsource-variable\/(?:manrope|onest|inter)/.test(name)));

assert.equal(symbols.family, 'Material Symbols Sharp');
assert.equal(symbols.upstreamCommit, 'bd8cb85bd4bad964fe6918f79665bb40c3a8efef');
assert.equal(symbols.weight, 400);
assert.equal(symbols.opticalSize, 24);
assert.equal(hash(iconSource), symbols.moduleSha256, 'Official icon paths must match their pinned manifest');
assert(renderer.includes("from './material-symbols-mobile'"), 'Mobile actions must use the reviewed icon family');
assert(!/hugeicons|phosphor|lucide|strokeWidth|@html/.test(renderer), 'Mobile geometry must retain its designed weight');
const data = JSON.parse(iconSource.match(/export const materialSymbolsMobile = ([\s\S]+?) as const;/)?.[1] ?? 'null');
assert.deepEqual(Object.keys(data).sort(), Object.keys(symbols.names).sort());
for (const [name, icon] of Object.entries(data)) {
  assert.equal(icon.symbol, symbols.names[name]);
  assert.equal(icon.viewBox, '0 -960 960 960');
  for (const [fill, variant] of ['outlined', 'filled'].entries()) {
    assert.equal(hash(JSON.stringify({viewBox: icon.viewBox, paths: icon[variant]})),
      symbols.sources[icon.symbol][fill].geometrySha256, `Unmodified official geometry: ${name}/${variant}`);
  }
}
console.log(`Visual system passed: pinned Inter v4.1 and ${Object.keys(data).length} official Material Symbols Sharp roles.`);
