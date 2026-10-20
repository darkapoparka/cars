import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import {createHash} from 'node:crypto';

const read = file => readFile(file, 'utf8');
const hash = value => createHash('sha256').update(value).digest('hex');
const [font, icons, tokens, renderer, iconSource, layout, pkg] = await Promise.all([
  read('provenance/inter.json').then(JSON.parse),
  read('provenance/fluent-icons.json').then(JSON.parse),
  read('src/lib/styles/tokens.css'),
  read('src/lib/components/layout/MobileActionIcon.svelte'),
  read('src/lib/components/layout/fluent-mobile.ts'),
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

assert.equal(icons.family, 'Microsoft Fluent System Icons');
assert.equal(icons.upstreamCommit, 'a563cf9166f4f91aa617557ed272612b7f0a2f72');
assert.equal(icons.style, 'Regular');
assert.equal(icons.opticalSize, 24);
assert.equal(hash(iconSource.replace(/\r\n/g, '\n')), icons.moduleSha256, 'Official icon paths must match their pinned manifest');
assert(renderer.includes("from './fluent-mobile'"), 'Mobile actions must use the reviewed icon family');
assert(renderer.includes('data-icon-state="regular"'), 'Selection must retain the same Regular geometry');
assert(!/hugeicons|phosphor|lucide|material-symbols|strokeWidth|@html/.test(renderer), 'Mobile geometry must retain its designed weight');
const data = JSON.parse(iconSource.match(/export const fluentMobile = ([\s\S]+?) as const;/)?.[1] ?? 'null');
assert.deepEqual(Object.keys(data).sort(), Object.keys(icons.names).sort());
for (const [name, icon] of Object.entries(data)) {
  assert.equal(icon.symbol, icons.names[name]);
  assert.equal(icon.viewBox, '0 0 24 24');
  assert.equal(hash(JSON.stringify({viewBox: icon.viewBox, paths: icon.paths})),
    icons.sources[icon.symbol].geometrySha256, `Unmodified official geometry: ${name}/Regular`);
}
const generatedNav = JSON.parse(await read('provenance/generated-bottom-nav.json'));
const navSource = await read('src/lib/components/layout/BottomNavIcon.svelte');
const navSprite = await readFile(generatedNav.file);
assert.equal(generatedNav.status, 'rejected', 'The generated navbar trial is retained as history');
assert.equal(hash(navSprite), generatedNav.sha256, 'Archived generated artwork must retain its original bytes');
assert.equal(navSprite.readUInt32BE(16), generatedNav.width, 'Navbar sprite width must match its mask coordinates');
assert.equal(navSprite.readUInt32BE(20), generatedNav.height, 'Navbar sprite height must match its mask coordinates');
assert.equal(navSprite[25], 6, 'Navbar sprite must retain RGBA transparency');
assert.deepEqual(Object.keys(generatedNav.roles).sort(), ['cars', 'home', 'import', 'menu', 'sell']);
assert(!/imagegen-generated-nav|mask-image|generated-bottom-nav-v3\.png|iconPreview/.test(navSource), 'Retired generated artwork must stay out of the live dock');
const dockArtwork = JSON.parse(await read('provenance/graphite-bottom-nav-2026-10-14.json'));
const dockMap = await read('src/lib/components/layout/dock-artwork.ts');
assert.equal(dockArtwork.version, 'graphite-v1');
assert.equal(dockArtwork.frame, 24, 'Dock artwork retains the existing 24px frame');
assert.deepEqual(Object.keys(dockArtwork.roles).sort(), ['cars', 'home', 'import', 'menu', 'sell']);
assert.equal(hash(await readFile(dockArtwork.source.file)), dockArtwork.source.sha256, 'Preserve the original generated source');
for (const [name, icon] of Object.entries(dockArtwork.roles)) {
  const bytes = await readFile(icon.file);
  assert.equal(hash(bytes), icon.sha256, `Pinned dock artwork: ${name}`);
  assert.equal(bytes.readUInt32BE(16), 96, `Four-times-resolution dock canvas: ${name}`);
  assert.equal(bytes.readUInt32BE(20), 96, `Square dock canvas: ${name}`);
  assert.equal(bytes[25], 6, `RGBA dock transparency: ${name}`);
  assert(dockMap.includes(`${name}: '${icon.publicPath}'`), `Explicit dock asset binding: ${name}`);
}
assert(navSource.includes("from './dock-artwork'"), 'Only the bottom dock uses the generated asset family');
assert(navSource.includes('asset(dockArtwork[name])'), 'Dock asset paths respect the mounted application base');
assert(navSource.includes('data-icon-active={active}') && navSource.includes('width={size}') && navSource.includes('height={size}'), 'Retain label-owned selection and frame size');
assert(navSource.includes('alt=""') && navSource.includes('aria-hidden="true"'), 'Dock artwork is decorative beside accessible labels');
console.log(`Visual system passed: pinned Inter v4.1, ${Object.keys(data).length} official Fluent Regular action roles and five graphite dock assets.`);
