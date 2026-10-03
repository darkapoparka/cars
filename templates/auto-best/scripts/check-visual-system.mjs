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
assert.equal(hash(navSprite), generatedNav.sha256, 'Generated navbar artwork must match the reviewed image');
assert.equal(navSprite.readUInt32BE(16), generatedNav.width, 'Navbar sprite width must match its mask coordinates');
assert.equal(navSprite.readUInt32BE(20), generatedNav.height, 'Navbar sprite height must match its mask coordinates');
assert.equal(navSprite[25], 6, 'Navbar sprite must retain RGBA transparency');
assert.deepEqual(Object.keys(generatedNav.roles).sort(), ['cars', 'home', 'import', 'menu', 'sell']);
assert(navSource.includes('data-icon-family="imagegen-generated-nav"'), 'The bottom dock must use the requested generated set');
assert(navSource.includes(generatedNav.publicPath), 'The bottom dock must load the recorded static asset');
assert(navSource.includes('mask-mode: alpha') && navSource.includes('background: currentColor'), 'Generated glyphs must inherit accessible destination colors');
assert(!/iconPreview|\$app\/environment/.test(navSource), 'Generated icons must render on ordinary routes');
console.log(`Visual system passed: pinned Inter v4.1, ${Object.keys(data).length} official Fluent action roles and five generated bottom-navbar glyphs.`);
