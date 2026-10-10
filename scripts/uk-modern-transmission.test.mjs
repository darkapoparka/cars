import assert from 'node:assert/strict';
import test from 'node:test';
import fs from 'node:fs';
import path from 'node:path';
import {execFileSync} from 'node:child_process';
import {createRequire, stripTypeScriptTypes} from 'node:module';
import {pathToFileURL} from 'node:url';
import {refreshAdapterInternals as adapters} from './lib/client-refresh-adapters.mjs';
import {loadDealerProfile} from './lib/client-refresh-normalize.mjs';
import {UK_MODERN_PATHS, UK_MODERN_TRANSMISSION_PATHS, personalizeModernUk,
  repairModernUkTransmission, modernUkTransmission} from './lib/client-refresh-uk-next.mjs';

const root = path.resolve(import.meta.dirname, '..');
const pin = '827d75b9a53666c6feb09f04e3f8e7f255e95a30';
const created = 'fabcc0704a8eea8646eee254af41f03947ce674c';
const slug = 'stockport-broadbent-car-and-servicing';
const env = {...process.env, GIT_NO_LAZY_FETCH:'1', GIT_TERMINAL_PROMPT:'0'};
const cache = new Map();
function at(commit, name) {
  const id = commit + ':' + name;
  if (!cache.has(id)) cache.set(id, execFileSync('git', ['-C', root, 'show', id],
    {encoding:'utf8', env, timeout:10000, maxBuffer:4194304}).replace(/\r\n/g, '\n'));
  return cache.get(id);
}
const batch = JSON.parse(fs.readFileSync(path.join(root, 'leads/uk-2026-10-10-build-manifest.json'), 'utf8'));
const profiles = batch.dealers.map(dealer => loadDealerProfile(path.join(root, dealer.brief), dealer.slug));
const broadbent = profiles.find(profile => profile.slug === slug);
assert.ok(broadbent, 'the actual Broadbent factual pack is required');
const original = () => new Map(UK_MODERN_PATHS.map(name => [name, at(pin, 'templates/modern/' + name)]));
const retained = () => new Map(UK_MODERN_TRANSMISSION_PATHS.map(name =>
  [name, Buffer.from(at(created, 'clients/' + slug + '/modern/' + name))]));
const txt = value => Buffer.isBuffer(value) ? value.toString('utf8') : value;
const inventory = files => {
  const matches = [...txt(files.get('packages/marketplace-domain/testing/mock-data.ts'))
    .matchAll(/^export const mockListings: VehicleListing\[\] = (\[\n[\s\S]*?\n\]);$/gm)];
  assert.equal(matches.length, 1);
  return JSON.parse(matches[0][1]);
};
const withoutImports = source => source.replace(/(?:import|export)\s+(?:type\s+)?[^;]*?\sfrom\s*['"][^'"]+['"];\s*/g, '');
const jsUrl = source => 'data:text/javascript;base64,' + Buffer.from(stripTypeScriptTypes(source)).toString('base64');
const tsImport = source => import(jsUrl(source));
const ts = createRequire(path.join(root, 'templates/mobile/package.json'))('typescript');
const zodPath = createRequire(path.join(root, 'templates/modern/packages/marketplace-domain/package.json')).resolve('zod');
function declarations(source, names) {
  const ast = ts.createSourceFile('actual.tsx', source, ts.ScriptTarget.Latest, true, ts.ScriptKind.TSX);
  const found = ast.statements.filter(statement => ts.isVariableStatement(statement) &&
    statement.declarationList.declarations.some(declaration => names.includes(declaration.name.getText(ast))));
  for (const name of names) assert.ok(found.some(statement => statement.declarationList.declarations
    .some(declaration => declaration.name.getText(ast) === name)), 'actual declaration ' + name);
  return found.map(statement => statement.getText(ast).replace(/^export\s+/, '')).join('\n');
}
const repaired = retained(), changed = repairModernUkTransmission(repaired, broadbent);
const initial = original(); personalizeModernUk(initial, broadbent);

test('all 71 actual UK records preserve published transmissions and one unpublished fact stays unknown', () => {
  const unsupported = [];
  let records = 0;
  for (const profile of profiles) for (const [index, item] of profile.listings.entries()) {
    const listing = adapters.modernListing(item, index, item.id, profile);
    assert.equal(listing.spec.transmission, modernUkTransmission(item));
    if (['manual', 'automatic', 'semi_automatic'].includes(item.transmissionType)) {
      assert.equal(listing.spec.transmission, item.transmissionType, profile.slug + '/' + item.id);
    } else unsupported.push({dealer:profile.slug, id:item.id, transmission:listing.spec.transmission});
    records++;
  }
  assert.equal(profiles.length, 10); assert.equal(records, 71);
  assert.deepEqual(unsupported, [{dealer:slug, id:'860026521888', transmission:'unknown'}]);
  const item = broadbent.listings[0];
  for (const value of ['manual', 'automatic', 'semi_automatic']) {
    assert.equal(adapters.modernListing({...item, transmissionType:value}, 0, item.id, broadbent).spec.transmission, value);
  }
  const nonUk = {...broadbent, business:{...broadbent.business, countryCode:'BG', distanceUnit:'km'}};
  assert.equal(adapters.modernListing({...item, transmissionType:'other'}, 0, item.id, nonUk).spec.transmission, 'semi_automatic');
  const unchanged = original(), snapshot = [...unchanged];
  assert.deepEqual(personalizeModernUk(unchanged, nonUk), []); assert.deepEqual([...unchanged], snapshot);
});

test('the actual canonical repair changes only the unpublished spec and exact reviewed contracts', () => {
  assert.deepEqual([...changed].sort(), [...UK_MODERN_TRANSMISSION_PATHS].sort());
  const before = inventory(retained()), after = inventory(repaired), expected = structuredClone(before);
  const unknown = expected.filter(item => item.slug === 'peugeot-partner-2017-860026521888');
  assert.deepEqual(unknown.map(item => item.id), ['am-1001','am-1006']);
  for (const item of unknown) { assert.equal(item.spec.transmission, 'semi_automatic'); item.spec.transmission = 'unknown'; }
  assert.deepEqual(after, expected);
  for (const name of UK_MODERN_TRANSMISSION_PATHS) {
    assert.ok(Buffer.isBuffer(repaired.get(name)), name + ' retains buffer type');
  }
  for (const source of initial.values()) assert.equal(typeof source, 'string');
  assert.throws(() => repairModernUkTransmission(repaired, broadbent), /boundary changed/);
});

test('repair refuses changed contract or factual inventory atomically', () => {
  for (const [name, replace] of [
    ['packages/marketplace-domain/types.ts', source => source.replace('export type Transmission', 'export type RenamedTransmission')],
    ['packages/marketplace-domain/testing/mock-data.ts', source => source.replace('"transmission": "semi_automatic"', '"transmission": "manual"')],
    ['packages/marketplace-domain/testing/mock-data.ts', source => source.replace('"amount": 3995', '"amount": 3996')],
  ]) {
    const files = retained(); files.set(name, Buffer.from(replace(txt(files.get(name)))));
    const before = [...files].map(([name, bytes]) => [name, Buffer.from(bytes)]);
    assert.throws(() => repairModernUkTransmission(files, broadbent), /boundary changed|unexpected transmission|factual inventory mismatch/);
    assert.deepEqual([...files], before);
  }
  assert.throws(() => repairModernUkTransmission(retained(), {...broadbent,
    business:{...broadbent.business, countryCode:'BG'}}), /requires a GB miles profile/);
});

test('actual card, PDP and structured-data formatter show Not published in English and Bulgarian', async () => {
  const format = txt(repaired.get('packages/marketplace/format.ts'));
  const mileage = at(created, 'clients/' + slug + '/modern/packages/marketplace-domain/dealer-mileage.ts');
  const head = 'import {formatStockMileage} from ' + JSON.stringify(jsUrl(mileage)) + ';\nconst leadSite={locale:"en-GB"};\n';
  const formatting = await tsImport(head + withoutImports(format));
  const policy = txt(repaired.get('packages/marketplace-ui/lib/vehicle-card-policy.ts'));
  const card = await tsImport('const formatFuelType=()=>""; const formatMileage=()=>"";\n' +
    declarations(policy, ['compactTransmissionLabels', 'compactFuelLabels', 'getVehicleCardSpecFacts']) +
    '\nexport {getVehicleCardSpecFacts};');
  const pdp = txt(repaired.get('packages/marketplace-ui/components/listing-specs.tsx'));
  const pdpLabels = await tsImport(declarations(pdp, ['compactTransmissionLabels']) +
    '\nexport {compactTransmissionLabels};');
  const current = inventory(repaired).find(item => item.id === 'am-1001');
  for (const [locale, label] of [['en','Not published'], ['bg','Не е посочена']]) {
    assert.equal(formatting.formatTransmission('unknown', locale), label);
    assert.equal(card.getVehicleCardSpecFacts(current, locale).find(fact => fact.id === 'transmission').value, label);
    assert.equal(pdpLabels.compactTransmissionLabels.unknown[locale], label);
  }
  assert.equal(formatting.formatTransmission('manual', 'en'), 'Manual');
  assert.equal(formatting.formatTransmission('automatic', 'en'), 'Automatic');
  assert.equal(formatting.formatTransmission('semi_automatic', 'en'), 'Semi-auto');
});

test('actual runtime and schema filters distinguish unknown from real semi-automatic', async () => {
  const source = txt(repaired.get('packages/marketplace-domain/testing/mock-data.ts'));
  const start = source.indexOf('const matchesText'), end = source.indexOf('const legacyListingSlugAliases');
  assert.ok(start >= 0 && end > start);
  const stock = inventory(repaired);
  const controls = await tsImport('const mockListings=' + JSON.stringify(stock) + ';\n' + source.slice(start, end));
  const filters = {category:'van', currency:'GBP', sort:'recommended'};
  assert.deepEqual(controls.getMockListings({...filters, transmission:'unknown'}).map(item => item.id), ['am-1001','am-1006']);
  assert.deepEqual(controls.getMockListings({...filters, transmission:'semi_automatic'}), []);
  assert.ok(controls.getMockListings({...filters, transmission:'manual'}).every(item => item.spec.transmission === 'manual'));
  const taxonomy = await tsImport('import {z} from ' + JSON.stringify(pathToFileURL(zodPath).href) + ';\n' +
    withoutImports(txt(repaired.get('packages/marketplace-domain/taxonomy.ts'))));
  assert.equal(taxonomy.transmissionSchema.parse('unknown'), 'unknown');
  assert.equal(taxonomy.transmissionSchema.parse('semi_automatic'), 'semi_automatic');
  assert.equal(taxonomy.transmissionSchema.safeParse('invented').success, false);
  for (const name of ['packages/marketplace-ui/lib/marketplace-filter-config.ts',
    'packages/marketplace-ui/components/marketplace-filter-options.tsx']) {
    assert.match(txt(repaired.get(name)), /"unknown"/);
  }
});

test('all transformed pinned consumers parse and every transmission label map covers the extended type', () => {
  for (const files of [initial, repaired]) for (const [name, bytes] of files) if (/\.tsx?$/.test(name)) {
    const result = ts.transpileModule(txt(bytes), {fileName:name, reportDiagnostics:true,
      compilerOptions:{target:ts.ScriptTarget.ES2022, module:ts.ModuleKind.ESNext, jsx:ts.JsxEmit.Preserve}});
    assert.deepEqual((result.diagnostics || []).filter(item => item.category === ts.DiagnosticCategory.Error)
      .map(item => ts.flattenDiagnosticMessageText(item.messageText, '\n')), [], name);
  }
  const types = txt(repaired.get('packages/marketplace-domain/types.ts'));
  const transmission = types.match(/^export type Transmission = .*;$/m)[0];
  const modules = new Map();
  const checks = [
    ['format', 'packages/marketplace/format.ts', ['transmissionLabels', 'transmissionLabelsBg']],
    ['card', 'packages/marketplace-ui/lib/vehicle-card-policy.ts', ['compactTransmissionLabels']],
    ['pdp', 'packages/marketplace-ui/components/listing-specs.tsx', ['compactTransmissionLabels']],
    ['filter', 'packages/marketplace-ui/lib/marketplace-filter-config.ts', ['marketplaceTransmissionLabelsBg']],
    ['form', 'apps/app/app/(authenticated)/sell/components/listing-form.tsx', ['transmissionLabels']],
  ];
  for (const [id, name, variables] of checks) {
    const source = declarations(txt(repaired.get(name)), variables);
    modules.set(path.join(root, 'runtime/uk-transmission-memory/' + id + '.ts'), transmission + '\n' + source +
      variables.map(variable => '\nconst ' + variable + 'Complete: Record<Transmission, unknown>=' + variable + ';').join(''));
  }
  const options = {strict:true, noEmit:true, target:ts.ScriptTarget.ES2022, module:ts.ModuleKind.ESNext, skipLibCheck:true};
  const host = ts.createCompilerHost(options), get = host.getSourceFile.bind(host);
  host.getSourceFile = (name, version, ...rest) => modules.has(path.resolve(name))
    ? ts.createSourceFile(name, modules.get(path.resolve(name)), version, true) : get(name, version, ...rest);
  const program = ts.createProgram([...modules.keys()], options, host);
  assert.deepEqual(ts.getPreEmitDiagnostics(program).filter(item => item.category === ts.DiagnosticCategory.Error)
    .map(item => ts.flattenDiagnosticMessageText(item.messageText, '\n')), []);
});

test('actual mobile filter subview renders and selects explicit unknown without a missing local variable', async () => {
  const actual = declarations(txt(repaired.get('packages/marketplace-ui/components/marketplace-filter-options.tsx')),
    ['MarketplaceFilterSubview']);
  const body = 'const h=(_type,props)=>props;const MarketplaceOptionGrid=()=>null;\n' +
    'const getMarketplaceControlCopy=()=>({options:{automatic:"Automatic",manual:"Manual",semiAutomatic:"Semi-auto"}});\n' +
    'const isBulgarianMarketplaceLocale=locale=>locale?.startsWith("bg") ?? false;\n' + actual +
    '\nexport {MarketplaceFilterSubview};';
  const javascript = ts.transpileModule(body, {fileName:'actual.tsx',
    compilerOptions:{target:ts.ScriptTarget.ES2022,module:ts.ModuleKind.ESNext,jsx:ts.JsxEmit.React,jsxFactory:'h'}}).outputText;
  const module = await import('data:text/javascript;base64,' + Buffer.from(javascript).toString('base64'));
  for (const [locale, label] of [['en','Not published'], ['bg','Не е посочена']]) {
    let selected;
    const view = module.MarketplaceFilterSubview({draft:{category:'van'},locale,
      setDraft:value=>{selected=value;},view:'transmission'});
    assert.deepEqual(view.options.map(option=>option[0]), ['automatic','manual','semi_automatic','unknown']);
    assert.equal(view.options.find(option=>option[0]==='unknown')[1], label);
    view.onSelect('unknown'); assert.deepEqual(selected, {category:'van',transmission:'unknown'});
  }
});
