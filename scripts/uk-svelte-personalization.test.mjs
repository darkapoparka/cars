import assert from 'node:assert/strict';
import test from 'node:test';
import { execFileSync } from 'node:child_process';
import { stripTypeScriptTypes } from 'node:module';
import path from 'node:path';
import { pathToFileURL } from 'node:url';
import { refreshAdapterInternals as adapters } from './lib/client-refresh-adapters.mjs';

const sources = {
  'auto-best': { revision: '14b3cbe71f7d84d0e16a0140467899319e00d4be', paths: [
    'src/lib/components/vehicles/VehicleCard.svelte', 'src/routes/listing-detail-v1/[id]/+page.svelte',
    'src/lib/data/listing.ts', 'localization/catalog.reviewed.json', 'localization/common.json'] },
  import: { revision: 'a51f329b0b9e8e4d21665e16abf2734505d02e07', paths: [
    'src/lib/data/daynight.ts', 'src/lib/data/vehicles.ts', 'src/lib/types/vehicle.ts',
    'src/lib/domain/vehicle-card.ts', 'src/lib/server/vehicle-detail.ts', 'src/lib/domain/vehicle-search.ts',
    'src/lib/server/inventory-options.ts', 'src/lib/server/inventory-options-mobile.ts'] }
};
const sourceCache = new Map();
const immutable = key => {
  if (!sourceCache.has(key)) sourceCache.set(key, new Map(sources[key].paths.map(name => [name,
    execFileSync('git', ['show', `${sources[key].revision}:templates/${key}/${name}`], { encoding: 'utf8' }).replace(/\r\n/g, '\n')])));
  return new Map(sourceCache.get(key));
};
const profile = { business: { countryCode: 'GB', distanceUnit: 'mi', locale: 'en-GB', currency: 'GBP', inventoryUrl: 'https://example.test/stock' }, listings: [] };
const tsImport = async source => import('data:text/javascript;base64,' + Buffer.from(stripTypeScriptTypes(source)).toString('base64'));
const withoutImports = source => source.replace(/(?:import|export)\s+(?:type\s+)?[^;]*?\sfrom\s*['"][^'"]+['"];\s*/g, '');
const helperImport = source => `import { canonicalMileage, mileageLimitKm, mileageSortValue, formatStockMileage, mileageForDealer } from 'data:text/javascript;base64,${Buffer.from(stripTypeScriptTypes(source)).toString('base64')}';\n`;
const changed = new Map();
for (const key of Object.keys(sources)) {
  const files = immutable(key);
  adapters.personalizeSvelteMileage(files, key, profile);
  changed.set(key, files);
}

test('immutable UK transforms preserve original units and exact canonical comparisons', async () => {
  for (const [key, files] of changed) {
    const helper = await tsImport(files.get('src/lib/data/dealer-mileage.ts'));
    const miles = { mileageKnown: true, mileageValue: 60000, mileageUnit: 'mi', mileageKm: 96561 };
    const km = { mileageKnown: true, mileageValue: 96560.64, mileageUnit: 'km' };
    assert.equal(helper.formatStockMileage(miles), '60,000 mi', key);
    assert.equal(helper.formatStockMileage({ mileageValue: 60000, mileageUnit: 'km' }), '60,000 km');
    assert.equal(helper.canonicalMileage(miles), 96560.64);
    assert.equal(helper.canonicalMileage(km), helper.canonicalMileage(miles));
    assert.equal(helper.mileageLimitKm(60000), helper.canonicalMileage(miles));
    assert.equal(helper.mileageForDealer(miles), 60000);
    assert.equal(helper.formatStockMileage({ mileageKnown: false, mileageKm: 0 }), '—');
    assert.ok(Number.isNaN(helper.canonicalMileage({ mileageKnown: false, mileageKm: 0 })));
    assert.equal(helper.mileageSortValue({ mileageKnown: false }), Infinity);
  }
});

test('actual transformed Auto Best filter converts UK thresholds exactly once and sorts canonical values', async () => {
  const files = changed.get('auto-best');
  const source = helperImport(files.get('src/lib/data/dealer-mileage.ts')) +
    'const featuredVehicles=[];const vehicleTypes=["car","motorbike","van","truck"];const catalogueModel=()=>"";const catalogueModelMatches=()=>null;const specificationLabel=value=>value;\n' +
    withoutImports(files.get('src/lib/data/listing.ts'));
  const module = await tsImport(source);
  const defaults = module.parseListingFilters(new URLSearchParams());
  const vehicles = [
    { id: 1, title: 'Synthetic mi', mileageKnown: true, mileageValue: 60000, mileageUnit: 'mi', mileageKm: 96561 },
    { id: 2, title: 'Synthetic km', mileageKnown: true, mileageValue: 90000, mileageUnit: 'km', mileageKm: 90000 },
    { id: 3, title: 'Unknown', mileageKnown: false, mileageKm: 0 }
  ];
  assert.deepEqual(module.filterListingVehicles(vehicles, { ...defaults, mileageMax: 60000 }).map(item => item.id), [1, 2]);
  assert.deepEqual(module.filterListingVehicles(vehicles, { ...defaults, mileageMax: 59999 }).map(item => item.id), [2]);
  assert.deepEqual(module.filterListingVehicles(vehicles, { ...defaults, sort: 'mileage-asc' }).map(item => item.id), [2, 1, 3]);
});

test('actual transformed Import filter and sorting preserve mixed units and exclude unknown ranges', async () => {
  const files = changed.get('import');
  const module = await tsImport(helperImport(files.get('src/lib/data/dealer-mileage.ts')) + withoutImports(files.get('src/lib/domain/vehicle-search.ts')));
  const base = { title: 'Synthetic fixture', brand: 'Audi', model: 'Test', year: 2020, bodyType: 'Car', location: 'Test', stockNumber: '', fuel: 'Petrol', transmission: 'Automatic', condition: 'Used', features: [], price: 12345 };
  const vehicles = [
    { ...base, slug: 'mi', mileage: 96560.64, mileageKnown: true, mileageValue: 60000, mileageUnit: 'mi' },
    { ...base, slug: 'km', mileage: 90000, mileageKnown: true, mileageValue: 90000, mileageUnit: 'km' },
    { ...base, slug: 'unknown', mileage: 0, mileageKnown: false }
  ];
  assert.deepEqual(module.filterVehicles(vehicles, { maxMileage: 60000 }).map(item => item.slug), ['mi', 'km']);
  assert.deepEqual(module.filterVehicles(vehicles, { maxMileage: 59999 }).map(item => item.slug), ['km']);
  assert.deepEqual(module.filterVehicles(vehicles, { minMileage: 60000 }).map(item => item.slug), ['mi']);
  assert.deepEqual(module.sortVehicles(vehicles, 'mileage').map(item => item.slug), ['km', 'mi', 'unknown']);
});

test('actual transformed Import native feed adapter retains mi and unknown state', async () => {
  const files = changed.get('import');
  const listing = { id: 'synthetic', title: 'Audi Test', price: '12345 GBP', production: '2020', mileage: '60 000 mi', mileageValue: 60000, mileageUnit: 'mi', mileageKnown: true, fuel: 'Petrol', gearbox: 'Automatic', category: 'Car', location: 'Test', features: [], shortDescription: '', badge: '' };
  const source = helperImport(files.get('src/lib/data/dealer-mileage.ts')) +
    `const mobileBgFeed=${JSON.stringify({ listings: [listing, { ...listing, id: 'unknown', mileage: '', mileageKnown: false, mileageValue: undefined, mileageUnit: undefined }] })};\n` +
    withoutImports(files.get('src/lib/data/daynight.ts'));
  const module = await tsImport(source);
  assert.equal(module.daynightVehicles[0].mileage, '60,000 mi');
  assert.equal(module.daynightVehicles[0].mileageValue, 60000);
  assert.equal(module.daynightVehicles[0].mileageUnit, 'mi');
  assert.equal(module.daynightVehicles[0].mileageKm, 96560.64);
  assert.equal(module.daynightVehicles[1].mileage, '—');
  assert.equal(module.daynightVehicles[1].mileageKnown, false);
});

test('stock projection refuses invented mileage and blanket verification', async () => {
  const listing = { id: 'fixture', title: 'Synthetic', type: 'car', bodyType: 'car', mileageValue: 60000, mileageUnit: 'mi', priceAmount: 12345, currency: 'GBP', raw: { mileage: { value: 60000, unit: 'mi' } }, images: [], features: [] };
  assert.deepEqual(adapters.originalMileageFacts(listing), { mileageKnown: true, mileageValue: 60000, mileageUnit: 'mi' });
  assert.deepEqual(adapters.originalMileageFacts({ ...listing, mileageValue: 0, raw: {} }), { mileageKnown: false });
  assert.deepEqual(adapters.originalMileageFacts({ ...listing, mileageOnRequest: true }), { mileageKnown: false });
  const generated = await tsImport(withoutImports(adapters.autoBestInventory({ ...profile, listings: [listing, { ...listing, raw: { ...listing.raw, verification: 'verified', ownerConfirmed: true } }] })) + '\nconst localeContract={defaultLocale:"en"};const formatPrice=value=>String(value);const templateText=(locale,text)=>text;');
  assert.equal(generated.featuredVehicles[0].verification, 'sample');
  assert.equal(generated.featuredVehicles[1].verification, 'verified');
  assert.equal(generated.featuredVehicles[0].mileage, '60,000 mi');
  const feed = adapters.importListingFeed({ ...profile, listings: [listing, { ...listing, raw: {}, mileageOnRequest: true }] });
  assert.equal(feed.listings[0].mileageKnown, true);
  assert.equal(feed.listings[0].mileageUnit, 'mi');
  assert.equal(feed.listings[1].mileage, '');
  assert.equal(feed.listings[1].mileageKnown, false);
});

test('UK controls use mi while default BG/km bytes remain unchanged', () => {
  for (const key of Object.keys(sources)) {
    const files = immutable(key);
    const snapshot = [...files];
    assert.deepEqual(adapters.personalizeSvelteMileage(files, key, { business: { countryCode: 'BG', distanceUnit: 'km' } }), []);
    assert.deepEqual([...files], snapshot);
  }
  const rows = JSON.parse(changed.get('auto-best').get('localization/catalog.reviewed.json'));
  assert.equal(rows.find(row => row.key === 'm_ac9577848c3a').en, 'Maximum mileage (mi)');
  assert.equal(JSON.parse(changed.get('auto-best').get('localization/common.json'))['inventory.search.kilometres'].en, 'mi');
  assert.match(changed.get('import').get('src/lib/server/inventory-options.ts'), /Up to 50,000 mi/);
});

test('changed source boundary refuses atomically without touching the supplied map', () => {
  for (const [key, file, from] of [
    ['auto-best', 'src/lib/data/listing.ts', 'vehicle.mileageKm > filters.mileageMax'],
    ['import', 'src/lib/domain/vehicle-search.ts', 'vehicle.mileage <= maxMileage']
  ]) {
    const files = immutable(key);
    files.set(file, files.get(file).replace(from, 'changedMileageBoundary'));
    const snapshot = [...files];
    assert.throws(() => adapters.personalizeSvelteMileage(files, key, profile), /UK mileage boundary changed/);
    assert.deepEqual([...files], snapshot);
  }
});

test('installed owner compiler checks transformed components and original-mileage types', { skip: !process.env.CARS_SVELTE_QA_DEPS }, async () => {
  const dependencyRoot = process.env.CARS_SVELTE_QA_DEPS;
  const compilerModule = await import(pathToFileURL(path.join(dependencyRoot, 'svelte/compiler/index.js')));
  const compile = compilerModule.compile ?? compilerModule.default?.compile;
  for (const [name, source] of changed.get('auto-best')) if (name.endsWith('.svelte')) {
    const result = compile(source, { filename: name, generate: 'server' });
    assert.ok(result.js.code.length > 0, name);
  }
  const { default: ts } = await import(pathToFileURL(path.join(dependencyRoot, 'typescript/lib/typescript.js')));
  for (const files of changed.values()) for (const [name, source] of files) if (name.endsWith('.ts')) {
    const result = ts.transpileModule(source, { fileName: name, reportDiagnostics: true, compilerOptions: { target: ts.ScriptTarget.ES2022, module: ts.ModuleKind.ESNext } });
    assert.deepEqual((result.diagnostics || []).filter(item => item.category === ts.DiagnosticCategory.Error), [], name);
  }
  const helperName = path.resolve('runtime/uk-svelte-memory/dealer-mileage.ts');
  const dataName = path.resolve('runtime/uk-svelte-memory/daynight.ts');
  const moduleFiles = new Map([
    [helperName, changed.get('import').get('src/lib/data/dealer-mileage.ts')],
    [dataName, `import { canonicalMileage, formatStockMileage } from './dealer-mileage';\nconst mobileBgFeed: unknown = {};\n` + withoutImports(changed.get('import').get('src/lib/data/daynight.ts'))]
  ]);
  const options = { strict: true, noEmit: true, target: ts.ScriptTarget.ES2022, module: ts.ModuleKind.ESNext, skipLibCheck: true };
  const host = ts.createCompilerHost(options);
  const originalGetSource = host.getSourceFile.bind(host);
  const originalFileExists = host.fileExists.bind(host);
  host.fileExists = file => moduleFiles.has(path.resolve(file)) || originalFileExists(file);
  host.getSourceFile = (file, languageVersion, ...rest) => moduleFiles.has(path.resolve(file))
    ? ts.createSourceFile(file, moduleFiles.get(path.resolve(file)), languageVersion, true)
    : originalGetSource(file, languageVersion, ...rest);
  host.resolveModuleNames = () => [{ resolvedFileName: helperName, extension: ts.Extension.Ts }];
  const program = ts.createProgram([...moduleFiles.keys()], options, host);
  const errors = ts.getPreEmitDiagnostics(program).filter(item => item.category === ts.DiagnosticCategory.Error);
  assert.deepEqual(errors.map(item => ts.flattenDiagnosticMessageText(item.messageText, '\n')), []);
});
