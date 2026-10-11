import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import test from 'node:test';
import { refreshAdapterInternals } from './lib/client-refresh-adapters.mjs';
import { assertTemplatePresentation, restoreTemplatePalette } from './lib/client-refresh-presentation.mjs';

const write = (root, relative, content) => {
  const file = path.join(root, relative);
  fs.mkdirSync(path.dirname(file), { recursive: true });
  fs.writeFileSync(file, content);
};
const paletteFixture = (t, key, native, dealer) => {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), 'cars-palette-'));
  const template = path.join(root, 'template'), candidate = path.join(root, 'candidate');
  const relative = key === 'modern' ? 'packages/marketplace/lead-site.ts' : 'src/lib/config/dealer.ts';
  write(template, relative, native); write(candidate, relative, dealer);
  if (key === 'modern') for (const base of [template,candidate]) write(base,'apps/web/public/lead-hero.jpg','same hero');
  t.after(() => {
    const real = fs.realpathSync(root), parent = fs.realpathSync(os.tmpdir()), scoped = path.relative(parent, real);
    assert(scoped.startsWith('cars-palette-') && !scoped.includes(path.sep) && !path.isAbsolute(scoped));
    fs.rmSync(real, { recursive: true, force: true });
  });
  return {key,template,candidate,relative,file:path.join(candidate,relative)};
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
  const real = fs.realpathSync(root);
  assert(path.dirname(real) === fs.realpathSync(os.tmpdir()) && path.basename(real).startsWith('cars-presentation-'));
  fs.rmSync(real, { recursive: true, force: true });
});

test('Modern palette drift is detected and exact template accent restores without changing facts', t => {
  const native = `export const leadSite: LeadSiteConfig = {\n  name: "Template",\n  accent: "#876543",\n};\n`;
  const dealer = `export const leadSite: LeadSiteConfig = {\n  name: "Автокъща Приселци",\n  phoneHref: "tel:+359888123456",\n  address: "Example showroom",\n  nested: {accent: "#123456"},\n  // accent: "#abcdef" is only a comment.\n  accent: '#176b43',\n};\n`;
  const f = paletteFixture(t,'modern',native,dealer);
  assert.throws(() => assertTemplatePresentation(f), /lead-site.ts \(accent\)/);
  const receipt = restoreTemplatePalette(f);
  assert.equal(receipt.changed,true); assert.equal(receipt.fields[0].after,'#876543');
  assert.equal(fs.readFileSync(f.file,'utf8'),dealer.replace("'#176b43'",'"#876543"'));
  assert.equal(fs.readFileSync(path.join(f.template,f.relative),'utf8'),native);
  assert.equal(assertTemplatePresentation(f),true);
});

test('Import restores all three exact theme fields while retaining contacts and locale content', t => {
  const native = `export const dealerTheme = {\n  accent: '#654321',\n  accentHover: '#123456',\n  accentContrast: '#fefefe'\n} as const;\n`;
  const dealer = `export const daynightContact = { phone: '+359888123456', address: 'Приселци', email: '' };\nexport const dealerTheme = {\n  accent: "#176b43",\n  accentHover: "#111111",\n  accentContrast: "#eeeeee"\n} as const;\nexport const locale = {currency: 'EUR', country: 'BG'};\n`;
  const f = paletteFixture(t,'import',native,dealer);
  assert.throws(() => assertTemplatePresentation(f), /dealer.ts \(accent\)/);
  const receipt = restoreTemplatePalette(f);
  assert.deepEqual(receipt.fields.map(row=>row.name),['accent','accentHover','accentContrast']);
  assert.equal(fs.readFileSync(f.file,'utf8'),dealer.replace('"#176b43"',"'#654321'").replace('"#111111"',"'#123456'").replace('"#eeeeee"',"'#fefefe'"));
  // The original protected Import hero boundary is independent of this config.
  write(f.template,'src/lib/components/home/HomeFiveHero.svelte','same hero');
  write(f.candidate,'src/lib/components/home/HomeFiveHero.svelte','same hero');
  write(f.template,'static/assets/daynight/hero/home-05-showroom-exterior.webp','same art');
  write(f.candidate,'static/assets/daynight/hero/home-05-showroom-exterior.webp','same art');
  assert.equal(assertTemplatePresentation(f),true);
});

test('matching palettes are read-only and correction refuses a master target', t => {
  const source = `export const leadSite = {accent: '#abcdef', name: 'Dealer'};\n`;
  const f = paletteFixture(t,'modern',source,source),before=fs.readFileSync(f.file);
  assert.equal(assertTemplatePresentation(f),true);
  assert.equal(restoreTemplatePalette(f).changed,false);
  assert(fs.readFileSync(f.file).equals(before));
  assert.throws(()=>restoreTemplatePalette({...f,candidate:f.template}),/derived candidate/);
});

test('exact pinned palette buffers restore without a master directory and reject ambiguous inputs', t => {
  const native = Buffer.from(`export const leadSite = {accent: '#876543'};\n`);
  const dealer = `export const leadSite = {accent: '#176b43', phoneHref: 'tel:+359888123456'};\n`;
  const f=paletteFixture(t,'modern',native,dealer);
  const receipt=restoreTemplatePalette({key:'modern',templateConfigBuffer:native,candidate:f.candidate});
  assert.equal(receipt.afterSha256.length,64);
  assert.equal(fs.readFileSync(f.file,'utf8'),dealer.replace("'#176b43'","'#876543'"));
  assert.throws(()=>restoreTemplatePalette({...f,templateConfigBuffer:native}),/one template path/);
  assert.throws(()=>restoreTemplatePalette({key:'modern',templateConfigBuffer:native.toString(),candidate:f.candidate}),/exact template config buffer/);
});

test('missing, duplicate or computed palette declarations fail without modifying source', t => {
  const native = `export const leadSite = {accent: '#abcdef'};\n`;
  for(const dealer of [
    `export const leadSite = {name: 'Dealer'};`,
    `export const leadSite = {accent: '#176b43', accent: '#123456'};`,
    `export const leadSite = {accent: dealerAccent};`,
    `export const leadSite = {accent: '#176b43', ...overrides};`,
    `export const leadSite = {accent: '#176b43', [field]: '#123456'};`,
    `export const leadSite = {accent: '#176b43', "accent": '#123456'};`,
    `export const leadSite = {accent: '#176b43'}; export const leadSite = {accent: '#123456'};`
  ]) {
    const f=paletteFixture(t,'modern',native,dealer);
    assert.throws(()=>restoreTemplatePalette(f),/palette/);
    assert.equal(fs.readFileSync(f.file,'utf8'),dealer);
  }
  const badNative=paletteFixture(t,'modern',`export const leadSite = {name: 'Template'};`,`export const leadSite = {accent: '#176b43'};`);
  assert.throws(()=>restoreTemplatePalette(badNative),/palette fields/);
});
