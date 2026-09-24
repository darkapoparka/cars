import assert from 'node:assert/strict';
import { readFile, writeFile, mkdir, readdir } from 'node:fs/promises';
import { pathToFileURL } from 'node:url';
import path from 'node:path';
import ts from 'typescript';

// Compile the real pure domain modules, with the same TypeScript compiler as the app.
const out = path.resolve('artifacts/domain');
await mkdir(out, { recursive: true });
const modules = [["src/lib/config/lead-site.ts","lead-site"],["src/lib/data/inventory.ts","inventory"],["src/lib/data/listing.ts","listing"],["src/lib/data/listing-draft.ts","listing-draft"],["src/lib/data/journeys.ts","journeys"],["src/lib/config/brand.ts","brand"],["src/lib/locale/policy.ts","locale-policy"],["src/lib/locale/config.ts","locale-config"],["src/lib/config/locale.ts","dealer-locale-config"],["src/lib/locale/core.ts","locale-core"],["src/lib/locale/catalog.ts","locale-catalog"],["src/lib/locale/messages.ts","locale-messages"],["src/lib/i18n/presentation.ts","locale-presentation"]];
const moduleOutputs = new Map(modules.map(([file,name]) => [path.resolve(file), name]));
for (const [input,name] of modules) {
  let code = ts.transpileModule(await readFile(input,'utf8'), {compilerOptions:{target:ts.ScriptTarget.ES2022,module:ts.ModuleKind.ES2022}}).outputText;
  const tree=ts.createSourceFile(input,code,ts.ScriptTarget.Latest,true,ts.ScriptKind.JS);
  const edits=[];
  for(const statement of tree.statements)if((ts.isImportDeclaration(statement)||ts.isExportDeclaration(statement))&&statement.moduleSpecifier){
    const specifier=statement.moduleSpecifier.text;
    let target=specifier.startsWith('$lib/')?path.resolve('src/lib',specifier.slice(5)):specifier.startsWith('$config/')?path.resolve('src/lib/config',specifier.slice(8)):path.resolve(path.dirname(input),specifier);
    if(!target.endsWith('.ts'))target+='.ts';
    const output=moduleOutputs.get(target);if(!output)throw new Error('Unregistered pure-domain dependency: '+specifier+' in '+input);
    edits.push({start:statement.moduleSpecifier.getStart(tree),end:statement.moduleSpecifier.end,text:JSON.stringify('./'+output+'.mjs')});
  }
  for(const edit of edits.sort((a,b)=>b.start-a.start))code=code.slice(0,edit.start)+edit.text+code.slice(edit.end);
  await writeFile(out+'/'+name+'.mjs',code);
}
const inventory = await import(pathToFileURL(`${out}/inventory.mjs`));
const listing = await import(pathToFileURL(`${out}/listing.mjs`));
const listingDraft = await import(pathToFileURL(`${out}/listing-draft.mjs`));
const journeys = await import(pathToFileURL(`${out}/journeys.mjs`));
const records = inventory.featuredVehicles;
assert.equal(new Set(records.map(record => record.id)).size, records.length);
for (const record of records) {
  assert(Number.isSafeInteger(record.id) && record.id > 0);
  assert(record.yearNumber >= 1900 && Number.isSafeInteger(record.yearNumber));
  assert(record.priceEur > 0 && Number.isFinite(record.priceEur));
  assert(record.mileageKm >= 0 && Number.isSafeInteger(record.mileageKm));
  assert.equal(record.href, `/listing-detail-v1/${record.id}`);
  assert(['sample', 'verified'].includes(record.verification));
  assert(record.verification !== 'verified' || record.evidenceUrl);
}
const completeParams = new URLSearchParams([
  ['q', 'Audi'], ['make', 'Audi'], ['model', 'RS Q8'], ['body', 'SUV'],
  ['fuel', 'Бензин'], ['transmission', 'Автоматик'], ['version', 'RS'],
  ['equipment', '4x4'], ['equipment', 'Навигация'], ['condition', 'used'],
  ['year_min', '2019'], ['year_max', '2024'], ['price_min', '50000'],
  ['price_max', '100000'], ['mileage_max', '75000'], ['sort', 'mileage-asc']
]);
const completeFilters = listing.parseListingFilters(completeParams);
assert.deepEqual(listing.parseListingFilters(listing.listingParams(completeFilters)), completeFilters);
const completeDraft = listingDraft.listingDraftFromFilters(completeFilters);
assert.deepEqual(listingDraft.listingFiltersFromDraft(completeDraft), completeFilters);
assert.notEqual(completeDraft.equipment, completeFilters.equipment, 'Draft equipment must not alias applied URL state');

const filters = listing.parseListingFilters(new URLSearchParams('make=BMW&model=X6&sort=price-asc&equipment=4x4&equipment=4x4&equipment=unknown&price_min=0&price_max=80000&year_min=2019'));
assert.equal(filters.equipment.length, 1);
assert.deepEqual(listing.parseListingFilters(listing.listingParams(filters)), filters);
const draft = listingDraft.listingDraftFromFilters(filters);
assert.deepEqual(listingDraft.listingFiltersFromDraft(draft), filters);
assert.equal(listingDraft.withListingMake(draft, 'Audi').model, '');
assert.equal(listingDraft.withListingMake(draft, 'BMW').model, 'X6');
assert.equal(listingDraft.withListingMake(draft, ' bmw ').model, 'X6');
assert.equal(listingDraft.listingModelAfterMakeChange('BMW', 'Audi', 'X6'), '');
assert.equal(listingDraft.listingModelAfterMakeChange('BMW', 'BMW', 'X6'), 'X6');
const transitioned = listingDraft.normalizeListingMakeTransition(filters, { ...filters, make: 'Audi', model: 'RS Q8' });
assert.equal(transitioned.model, '');
const sameMake = listingDraft.normalizeListingMakeTransition(filters, { ...filters, model: 'X6 M Sport' });
assert.equal(sameMake.model, 'X6 M Sport');
for (const value of ['12oops', '-1', '1.5', 'Infinity', '999999999999999999']) {
  assert.equal(listingDraft.listingFiltersFromDraft({ ...draft, priceMax: value }).priceMax, null);
}
assert.equal(listingDraft.listingFiltersFromDraft({ ...draft, priceMax: '0' }).priceMax, 0);
assert.equal(listingDraft.listingFiltersFromDraft({ ...draft, priceMax: ' 80000 ' }).priceMax, 80000);
assert.equal(listingDraft.listingFiltersFromDraft({ ...draft, priceMax: String(Number.MAX_SAFE_INTEGER) }).priceMax, Number.MAX_SAFE_INTEGER);
const formData = new FormData();
formData.set('q', '   '); formData.set('make', 'BMW'); formData.set('price_max', '80000');
listingDraft.cleanListingFormData(formData);
assert.equal(formData.has('q'), false);
assert.equal(listingDraft.listingFiltersFromFormData(formData).priceMax, 80000);
const preserved = listingDraft.preservedListingFacetEntries(new URLSearchParams('make=BMW&model=X6&fuel=Дизел&sort=price-asc'), 'make', 'Audi');
assert.equal(new URLSearchParams(preserved).has('model'), false);
assert.equal(new URLSearchParams(preserved).get('fuel'), 'Дизел');
assert.equal(new URLSearchParams(preserved).get('sort'), 'price-asc');
const preservedSameMake = listingDraft.preservedListingFacetEntries(new URLSearchParams('make=BMW&model=X6&fuel=Дизел'), 'make', ' bmw ');
assert.equal(new URLSearchParams(preservedSameMake).get('model'), 'X6');
assert.equal(listing.removeListingFilter(filters, 'make', 'BMW').has('model'), false);
assert.equal(listing.removeListingFilter(filters, 'make', 'BMW').get('sort'), 'price-asc');
for (const value of ['12oops', '-1', '1.5', 'Infinity', '999999999999999999']) assert.equal(listing.parseListingFilters(new URLSearchParams({ price_max: value })).priceMax, null);
assert.equal(listing.filterListingVehicles(records, listing.parseListingFilters(new URLSearchParams('price_max=0'))).length, 0);
for (const value of ['//example.com/listing-grid', '/\\example.com', 'javascript:alert(1)', '/contact', '/listing-grid/evil', 'https://example.com/listing-grid']) assert.equal(journeys.listReturn(value, '/listing-grid'), '/listing-grid');
assert.equal(journeys.listReturn('/listing-grid?make=BMW#vehicle-4', '/listing-grid'), '/listing-grid?make=BMW#vehicle-4');
for (const value of ['0', '01', '1x', '999', 'BMW']) assert.equal(journeys.selectedVehicle(value), null);
assert.equal(journeys.selectedVehicle('4').id, 4);

async function sources(dir) {
  const entries = await readdir(dir, { withFileTypes: true });
  return (await Promise.all(entries.map(async entry => entry.isDirectory() ? sources(path.join(dir, entry.name)) : /\.(svelte|css|ts)$/.test(entry.name) ? await readFile(path.join(dir, entry.name), 'utf8') : ''))).flat().join('\n');
}
const source = await sources('src');
const defined = new Set([...source.matchAll(/(--[\w-]+)\s*[:=]/g)].map(match => match[1]));
const missing = [...new Set([...source.matchAll(/var\(\s*(--[\w-]+)\s*\)/g)].map(match => match[1]))].filter(name => !defined.has(name));
assert.deepEqual(missing, [], 'Every CSS variable without a fallback needs an owner');
await writeFile(`${out}/report.json`, JSON.stringify({ passed: true, records: records.length, checks: ['record validity', 'filter roundtrip', 'draft conversion', 'form cleanup', 'equipment deduplication', 'numeric boundaries', 'dependent reset', 'facet preservation', 'safe return destinations', 'known vehicle context', 'CSS token ownership'] }, null, 2));
console.log(`Domain checks passed for ${records.length} records, filter/context boundaries and CSS variables.`);
