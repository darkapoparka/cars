import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import test from 'node:test';
import { refreshAdapterInternals, patchAutoBestLocale } from './lib/client-refresh-adapters.mjs';
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

test('unknown showroom coordinates stay unknown and map destinations use recorded facts', () => {
  const business = { name: 'Автокъща Приселци', address: 'бул. „Цар Освободител“ 285', city: 'Варна' };
  for (const coordinates of [null, { latitude: 0, longitude: 0 }, { latitude: 91, longitude: 23 }, { latitude: 43, longitude: NaN }]) {
    assert.equal(refreshAdapterInternals.dealerCoordinates({ ...business, coordinates }), null);
    assert.equal(refreshAdapterInternals.dealerMapDestination({ ...business, coordinates }), business.address + ', ' + business.city);
  }
  assert.equal(refreshAdapterInternals.dealerMapDestination({ ...business, coordinates: { latitude: 51.5, longitude: 0 } }), '51.5,0');
  assert.equal(refreshAdapterInternals.dealerMapDestination({ name: 'Recorded dealer' }), 'Recorded dealer');
  assert.throws(() => refreshAdapterInternals.dealerMapDestination({}), /recorded/);
  const profile = { business: { ...business, locale: 'bg-BG', services: [] } };
  assert.match(refreshAdapterInternals.autoBestBrand(profile, '/dealer/logo.png'), /showroomCoordinates: null/);
  assert.match(refreshAdapterInternals.autoBestCompany(profile), /export const showroomCoordinates = null;/);
});

test('current phone and desktop showroom maps use dealer destination without changing composition', t => {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), 'cars-map-'));
  t.after(() => {
    const real = fs.realpathSync(root), parent = fs.realpathSync(os.tmpdir());
    assert(path.dirname(real) === parent && path.basename(real).startsWith('cars-map-'));
    fs.rmSync(real, { recursive: true, force: true });
  });
  const binding = '  const coordinates = `${brand.showroomCoordinates.latitude},${brand.showroomCoordinates.longitude}`;';
  const source = '<script>\n' + binding + '\n  const mapUrl = $derived(`https://maps.google.com/maps?q=${encodeURIComponent(coordinates)}&hl=${i18n.locale}&output=embed`);\n</script>\n<iframe src={mapUrl}></iframe>\n<style>.map { background: red; }</style>\n';
  const paths = ['ShowroomMap.svelte', 'DesktopShowroom.svelte'].map(name => 'src/lib/components/company/' + name);
  const business = { name: 'Recorded dealer', address: 'Showroom 285', city: 'Varna', mapsEmbedUrl: 'https://maps.google.com/maps?q=Showroom%20285' };
  for (const relative of paths) write(root, relative, source);
  const files = refreshAdapterInternals.patchAutoBestMap(root, { business });
  assert.equal(files.length, 2);
  for (const relative of paths) assert.equal(fs.readFileSync(path.join(root, relative), 'utf8'), source.replace(binding, '  const coordinates = "Showroom 285, Varna";'));
  const drift = source.replace(binding, binding + '\n' + binding);
  write(root, paths[0], drift);
  assert.throws(() => refreshAdapterInternals.patchAutoBestMap(root, { business }), /map binding changed/);
  assert.equal(fs.readFileSync(path.join(root, paths[0]), 'utf8'), drift);
});

test('Modern preserves all supplied facts once instead of repeating or truncating native slots', t => {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), 'cars-modern-count-'));
  t.after(() => {
    const real = fs.realpathSync(root), parent = fs.realpathSync(os.tmpdir());
    assert(path.dirname(real) === parent && path.basename(real).startsWith('cars-modern-count-'));
    fs.rmSync(real, { recursive: true, force: true });
  });
  const file = path.join(root, 'mock-data.ts');
  const source = 'export const mockListings: VehicleListing[] = [\n' + Array.from({ length: 14 }, (_, index) => '  {\n    id: "am-' + (1001 + index) + '"\n  }').join(',\n') + '\n];\nconst retained = "native behavior";\n';
  const business = { slug: 'recorded-dealer', name: 'Recorded dealer', countryCode: 'BG', currency: 'EUR', city: 'Varna', region: 'Varna', country: 'Bulgaria' };
  const listings = Array.from({ length: 16 }, (_, index) => ({ id: 'source-' + index, slug: 'source-' + index, title: 'Car ' + index, priceAmount: 4100 + index, currency: 'EUR', images: ['/photo-' + index + '.webp'], features: [], mileageKm: 100000 + index, year: 2000 + index, make: 'Make', model: 'Model', bodyType: 'sedan', fuelType: 'diesel', transmissionType: 'manual', observedAt: '2026-09-07' }));
  const rows = () => {
    const value = fs.readFileSync(file, 'utf8');
    assert(value.endsWith(';\nconst retained = "native behavior";\n'));
    return JSON.parse(value.slice(value.indexOf('=') + 1, value.lastIndexOf(';\nconst retained')));
  };
  fs.writeFileSync(file, source);
  refreshAdapterInternals.replaceModernListings(file, { slug: business.slug, business, listings });
  const expanded = rows();
  assert.equal(expanded.length, 16);
  assert.deepEqual(expanded.map(row => row.slug), listings.map(row => row.slug));
  assert.deepEqual(expanded.map(row => row.price.amount), listings.map(row => row.priceAmount));
  assert(expanded.every(row => row.publishedAt.startsWith('2026-09-07')));
  assert.deepEqual(expanded.slice(0, 14).map(row => row.id), Array.from({ length: 14 }, (_, index) => 'am-' + (1001 + index)));
  assert.equal(new Set(expanded.map(row => row.id)).size, 16);
  fs.writeFileSync(file, source);
  refreshAdapterInternals.replaceModernListings(file, { slug: business.slug, business, listings });
  assert.deepEqual(rows(), expanded, 'Additional source IDs must be deterministic');
  fs.writeFileSync(file, source);
  refreshAdapterInternals.replaceModernListings(file, { slug: business.slug, business, listings: listings.slice(0, 6) });
  assert.deepEqual(rows().map(row => row.slug), listings.slice(0, 6).map(row => row.slug), 'A smaller source must not fill native slots with repeated cars');
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
test('Auto Best publishes only recorded social profiles, with missing profiles empty', () => {
  const profile = {business:{name:'Priselci',city:'Варна',address:'Recorded address',phoneE164:'+359886251705',socialLinks:{}}};
  const empty = refreshAdapterInternals.autoBestBrand(profile, '/dealer/logo.png');
  for (const platform of ['youtube','instagram','facebook']) assert.match(empty,new RegExp(platform+"Url: \"\""));
  assert.doesNotMatch(empty,/https:\/\/www\.(youtube|instagram|facebook)\.com\//);
  const recorded='https://www.youtube.com/@recorded-dealer';
  const configured=refreshAdapterInternals.autoBestBrand({business:{...profile.business,socialLinks:{youtube:recorded}}},'/dealer/logo.png');
  assert(configured.includes('youtubeUrl: '+JSON.stringify(recorded)));
  assert.match(configured,/instagramUrl: \`https:\/\/\$\{string\}\` \| ''/);
  assert.match(configured,/facebookUrl: \`https:\/\/\$\{string\}\` \| ''/);
});

test('Auto Best preserves native bilingual short address and hours consumers in config and catalog', t => {
  const root=fs.mkdtempSync(path.join(os.tmpdir(),'cars-native-dealer-text-'));
  t.after(()=>{const real=fs.realpathSync(root);assert(path.dirname(real)===fs.realpathSync(os.tmpdir())&&path.basename(real).startsWith('cars-native-dealer-text-'));fs.rmSync(real,{recursive:true,force:true});});
  const keys=['city','addressLine','address','appointment','addressShort','appointmentShort'];
  write(root,'localization/dealer.reviewed.json',JSON.stringify(keys.map(key=>({key:'dealer.'+key,source:'Old donor',en:'Old donor',bg:'Old donor'}))));
  write(root,'src/lib/config/locale.ts',"import {carsLocale} from './cars-locale';\nexport const dealerLocaleConfiguration = { formatLocales: { en: 'en-GB', bg: 'bg-BG' }, suggestedLanguages: { BG: 'bg' } };\nexport const dealerLocalizedText = {} as const;\n");
  const profile={business:{slug:'priselci',name:'Автокъща Приселци',shortName:'Priselci',city:'Варна',country:'България',countryCode:'BG',addressLine:'бул. „Цар Освободител“ 285',address:'бул. „Цар Освободител“ 285',hours:'Работното време се уточнява по телефона.'}};
  patchAutoBestLocale(root,profile);
  const source=fs.readFileSync(path.join(root,'src/lib/config/locale.ts'),'utf8');
  const text=JSON.parse(source.match(/export const dealerLocalizedText = ([\s\S]*?) as const;/)[1]);
  assert.equal(text.bg.addressShort,profile.business.addressLine);
  assert.equal(text.bg.appointmentShort,profile.business.hours);
  assert.equal(text.en.addressShort,'285 Tsar Osvoboditel Blvd.');
  assert.equal(text.en.appointmentShort,'Call to confirm opening hours.');
  const rows=JSON.parse(fs.readFileSync(path.join(root,'localization/dealer.reviewed.json')));
  for(const locale of ['en','bg']) for(const field of ['addressShort','appointmentShort']) assert.equal(rows.find(r=>r.key==='dealer.'+field)[locale],text[locale][field]);
  assert.doesNotMatch(source,/Old donor/);
});

test('Modern scalar refresh updates top-level facts while preserving nested copy and surrounding composition', () => {
  const source="// outside\n  address: 'Unrelated outside',\n// LEAD_SITE_CONFIG_START\nexport const leadSite = {\n  localizedCopy: {\n    bg: { address: 'Nested address', tagline: 'Nested tagline' },\n  },\n  address: 'Donor address',\n  tagline: 'Unsupported donor claim',\n  accent: '#30343b',\n};\n// LEAD_SITE_CONFIG_END\n";
  const withAddress=refreshAdapterInternals.replaceLeadScalar(source,'address','бул. „Цар Освободител“ 285');
  const refreshed=refreshAdapterInternals.replaceLeadScalar(withAddress,'tagline','Priselci — vehicles and dealer support in Varna.');
  assert.equal(refreshed,source.replace("  address: 'Donor address',",'  address: "бул. „Цар Освободител“ 285",').replace("  tagline: 'Unsupported donor claim',",'  tagline: "Priselci — vehicles and dealer support in Varna.",'));
  assert.throws(()=>refreshAdapterInternals.replaceLeadScalar(source.replace("  address: 'Donor address',","  address: 'One',\n  address: 'Two',"),'address','Dealer'),/Ambiguous top-level/);
});
