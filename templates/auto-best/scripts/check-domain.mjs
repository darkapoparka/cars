import assert from 'node:assert/strict';
import { readFile, writeFile, mkdir, readdir } from 'node:fs/promises';
import { pathToFileURL } from 'node:url';
import path from 'node:path';
import ts from 'typescript';

// Compile the real pure domain modules, with the same TypeScript compiler as the app.
const out = path.resolve('artifacts/domain');
await mkdir(out, { recursive: true });
const modules = [["src/lib/locale/formatters.ts","locale-formatters"],["src/lib/data/demo-content.ts","demo-content"],["src/lib/config/lead-site.ts","lead-site"],["src/lib/data/inventory.ts","inventory"],["src/lib/data/listing.ts","listing"],["src/lib/data/listing-draft.ts","listing-draft"],["src/lib/data/journeys.ts","journeys"],["src/lib/config/brand.ts","brand"],["src/lib/locale/policy.ts","locale-policy"],["src/lib/locale/config.ts","locale-config"],["src/lib/config/locale.ts","dealer-locale-config"],["src/lib/locale/core.ts","locale-core"],["src/lib/locale/catalog.ts","locale-catalog"],["src/lib/locale/messages.ts","locale-messages"],["src/lib/i18n/presentation.ts","locale-presentation"]];
modules.push(['src/lib/data/desktop-makes.ts', 'desktop-makes'], ['src/lib/data/make-artwork.ts', 'make-artwork']);
modules.push(['src/lib/data/model-catalogue-data.ts', 'model-catalogue-data'], ['src/lib/data/model-catalogue.ts', 'model-catalogue']);
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
const modelCatalogue = await import(pathToFileURL(`${out}/model-catalogue.mjs`));
const journeys = await import(pathToFileURL(`${out}/journeys.mjs`));
const records = inventory.featuredVehicles;
const bmwFamilies = modelCatalogue.modelMakes(records, ['BMW'], [], ['BMW'])[0].families;
assert.deepEqual(bmwFamilies.slice(0, 8).map(family => family.name), Array.from({ length: 8 }, (_, index) => `${index + 1} Series`));
assert.equal(bmwFamilies.find(family => family.name === 'X Series').count, 2);
assert.equal(bmwFamilies.find(family => family.name === '3 Series').count, 0, 'Empty familiar families remain browsable');
assert(bmwFamilies.find(family => family.name === '3 Series').choices.some(choice => choice.value === 'BMW 320'));
assert.equal(bmwFamilies.find(family => family.name === 'X Series').choices.find(choice => choice.value === 'BMW X6').count, 2);
assert.equal(bmwFamilies.find(family => family.name === 'X Series').choices.find(choice => choice.value === 'BMW X6 M').count, 0, 'M Sport is a trim, not an X6 M');
assert.equal(bmwFamilies.find(family => family.name === 'X Series').choices.find(choice => choice.value === 'X6 M Sport').count, 1, 'Legacy exact model values are retained');
const mercedesFamilies = modelCatalogue.modelMakes(records, ['Mercedes-Benz'], [], ['Mercedes-Benz'])[0].families;
assert.equal(mercedesFamilies[0].name, 'A-Class', 'Class families precede historical standalone model numbers');
assert.equal(mercedesFamilies.find(family => family.name === 'GLE-Class').count, 1);
assert.equal(mercedesFamilies.find(family => family.name === 'G-Class').count, 0, 'G-Class must not include GLE');
assert.equal(mercedesFamilies.find(family => family.name === 'GT-Class').count, 2, 'AMG titles retain their Mercedes-Benz owner');
const catalogueFilter = value => listing.parseListingFilters(new URLSearchParams({ model: value }));
assert.deepEqual(listing.filterListingVehicles(records, catalogueFilter('BMW X6')).map(vehicle => vehicle.id), [4, 7]);
assert.deepEqual(listing.filterListingVehicles(records, catalogueFilter('Audi RS6')).map(vehicle => vehicle.id), [1], 'Catalogues and titles may space model numbers differently');
assert.equal(listing.filterListingVehicles(records, catalogueFilter('BMW 320')).length, 0, 'A catalogue choice never fabricates inventory');
assert.equal(listingDraft.listingMakeForModel('BMW 320'), 'BMW', 'A zero-stock model retains a known make');
assert.deepEqual(listing.listingModelsAfterMakeChange(['BMW', 'Audi'], ['Audi'], ['BMW 320', 'Audi RS6']), ['Audi RS6']);
assert.equal(modelCatalogue.catalogueModelMatches({ make: 'BMW', title: 'BMW 118d' }, 'BMW 118'), true);
assert.equal(modelCatalogue.catalogueModelMatches({ make: 'BMW', title: 'BMW 1180' }, 'BMW 118'), false);
const futureStock = [...records, { ...records[0], make: 'Saab', title: 'Saab Dealer Special' }];
assert(modelCatalogue.modelMakes(futureStock, ['Saab'], [], ['Saab'])[0].families.some(family => family.choices.some(choice => choice.value === 'Dealer Special' && choice.count === 1)), 'New dealer models are retained even outside the pinned catalogue');
assert(modelCatalogue.modelMakes([], ['Saab'], ['9-3'], ['Saab'])[0].families.some(family => family.choices.some(choice => choice.value === '9-3')), 'Previously applied values survive empty stock');
for (const make of Object.keys((await import(pathToFileURL(`${out}/model-catalogue-data.mjs`))).modelCatalogueData)) {
  const families = modelCatalogue.modelMakes([], [make], [], [make])[0].families;
  assert.equal(new Set(families.map(family => family.name)).size, families.length, `${make}: stable unique disclosure keys`);
  for (const family of families) assert.equal(new Set(family.choices.map(choice => choice.value)).size, family.choices.length, `${make} ${family.name}: stable unique model choices`);
}
const desktopMakes = await import(pathToFileURL(`${out}/desktop-makes.mjs`));
assert.equal(desktopMakes.desktopMakeCatalogue.length, 179);
assert.equal(desktopMakes.desktopMakeCount(''), records.length);
assert.equal(desktopMakes.desktopMakeCount(' bMw '), 2, 'Stock and logo lookups ignore case and surrounding space');
assert.equal(desktopMakes.desktopMakeCount('Toyota'), 0);
assert.match(desktopMakes.desktopMakeArtwork(' volkswagen ').image, /volkswagen-badge-cardog\.svg$/);
for (const locale of ['bg', 'en']) {
  const options = desktopMakes.desktopMakeOptions(['bmw', 'Future Dealer Make', 'Future Dealer Make'], locale);
  assert.deepEqual(options.slice(0, 4), ['', 'Audi', 'BMW', 'Mercedes-Benz']);
  assert.deepEqual(options.slice(4, 10), ['Ford', 'Opel', 'Porsche', 'Skoda', 'Toyota', 'Volkswagen'], 'Familiar brands remain reachable before the alphabetical catalogue');
  assert.equal(options.length, 181, 'Outside-catalogue selections are retained once');
  assert.equal(options.filter(make => make.toLowerCase() === 'bmw').length, 1);
  assert(options.includes('Future Dealer Make'));
  assert.deepEqual(new Set(listing.listingFilterOptions.makes.filter(Boolean)), new Set(records.map(vehicle => vehicle.make)), 'The desktop catalogue never changes stock-derived model owners');
  assert.equal(listing.filterListingVehicles(records, listing.parseListingFilters(new URLSearchParams({ make: 'Toyota' })), locale).length, 0);
}
const demoContent = await import(pathToFileURL(out + '/demo-content.mjs'));
const formatters = await import(pathToFileURL(out + '/locale-formatters.mjs'));
const localeMessages = await import(pathToFileURL(out + '/locale-messages.mjs'));
const localeCore = await import(pathToFileURL(out + '/locale-core.mjs'));
for (let count = 0; count <= records.length; count++) {
  const stock = Object.freeze(records.slice(0, count));
  const showcases = demoContent.createDemoWorkflowShowcases(stock);
  for (const [topic, positions] of [['trade-in', [0, 3, 5]], ['import', [1, 2, 4]]]) {
    assert.deepEqual(showcases[topic].vehicles, positions.filter(position => position < count).map(position => stock[position]), 'Sparse dealer inventory never emits undefined cards');
    assert.notEqual(showcases[topic].vehicles, stock);
  }
}
assert.deepEqual(demoContent.demoWorkflowShowcases['trade-in'].vehicles.map(vehicle => vehicle.id), [1, 4, 7]);
assert.deepEqual(demoContent.demoWorkflowShowcases.import.vehicles.map(vehicle => vehicle.id), [2, 3, 6]);
for (const locale of ['en', 'bg']) {
  const first = formatters.localeFormatters(locale);
  assert.equal(formatters.localeFormatters(locale), first, 'Repeated rendering reuses formatters');
  assert.notEqual(formatters.localeFormatters(locale === 'en' ? 'bg' : 'en'), first, 'Locale formatter caches are separate');
  const formatLocale = localeCore.intlLocale(locale);
  for (const value of [-1, 0, 1, 2, 0.5, 1234, 9999999, NaN, Infinity]) {
    assert.equal(first.number.format(value), new Intl.NumberFormat(formatLocale).format(value));
    assert.equal(first.mileage.format(value), new Intl.NumberFormat(formatLocale, { style: 'unit', unit: 'kilometer', unitDisplay: 'short' }).format(value));
    assert.equal(first.compactMileage.format(value), new Intl.NumberFormat(formatLocale, { useGrouping: false }).format(value));
    assert.equal(first.plural.select(value), new Intl.PluralRules(formatLocale).select(value));
    const key = new Intl.PluralRules(formatLocale).select(value) === 'one' ? 'inventory.count.one' : 'inventory.count.other';
    assert.equal(localeMessages.vehicleCount(locale, value), localeMessages.message(locale, key, { count: new Intl.NumberFormat(formatLocale).format(value) }));
  }
}
assert.throws(() => formatters.localeFormatters('invalid'), /Language is not enabled/);

const presentation = await import(pathToFileURL(`${out}/locale-presentation.mjs`));
for (const source of ['Бензин/ЛПГ', 'Бензин / ЛПГ', 'Petrol/LPG', 'Petrol / LPG']) {
  assert.equal(presentation.specificationLabel(source, 'bg'), 'Бензин/ЛПГ');
  assert.equal(presentation.specificationLabel(source, 'en'), 'Petrol/LPG');
  assert.equal(presentation.compactSpecificationLabel(source, 'bg'), 'Б/ЛПГ');
  assert.equal(presentation.compactSpecificationLabel(source, 'en'), 'P/LPG');
}
assert.equal(presentation.compactSpecificationLabel('Hydrogen', 'en'), 'Hydrogen', 'Unknown vehicle data retains its source value');
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
  ['type', 'car'],
  ['q', 'Audi'], ['make', 'Audi'], ['model', 'RS Q8'], ['body', 'SUV'],
  ['fuel', 'Бензин'], ['transmission', 'Автоматик'], ['version', 'RS'],
  ['equipment', '4x4'], ['equipment', 'Навигация'], ['condition', 'used'],
  ['year_min', '2019'], ['year_max', '2024'], ['price_min', '50000'],
  ['price_max', '100000'], ['mileage_max', '75000'], ['sort', 'mileage-asc']
]);
const completeFilters = listing.parseListingFilters(completeParams);
const groupedEquipment = listing.listingEquipmentGroups();
assert.deepEqual(groupedEquipment.flatMap(group=>group.values).toSorted(), [...listing.listingFilterOptions.equipment].toSorted(), 'Each stock feature appears in exactly one equipment category');
const largeEquipmentCatalog = [...listing.listingFilterOptions.equipment, ...Array.from({length:60},(_,index)=>`Dealer feature ${index+1}`)];
const largeEquipmentGroups = listing.listingEquipmentGroups([...largeEquipmentCatalog,largeEquipmentCatalog[0],'']);
assert.equal(largeEquipmentGroups.flatMap(group=>group.values).length,68, 'A larger dealer catalog retains every feature and removes duplicates');
assert.equal(largeEquipmentGroups.find(group=>group.id==='other').values.length,60, 'Uncategorized features remain available rather than disappearing');
assert(largeEquipmentGroups.every(group=>group.values.length), 'Empty equipment categories are omitted');
assert.deepEqual(listing.parseListingFilters(listing.listingParams(completeFilters)), completeFilters);
const completeDraft = listingDraft.listingDraftFromFilters(completeFilters);
assert.deepEqual(listingDraft.listingFiltersFromDraft(completeDraft), completeFilters);
assert.deepEqual(listingDraft.listingFilterGroups.map(group => listingDraft.listingDraftGroupCount(completeDraft, group.id)), [7, 4, completeDraft.equipment.length], 'A two-ended range counts as one filter, while extras count selected features');
assert.deepEqual(listingDraft.listingFilterGroups.map(group => listingDraft.listingDraftGroupCount(listingDraft.emptyListingDraft('price-desc'), group.id)), [0, 0, 0], 'Sorting does not count as a selected filter category');
assert.notEqual(completeDraft.equipment, completeFilters.equipment, 'Draft equipment must not alias applied URL state');

const filters = listing.parseListingFilters(new URLSearchParams('make=BMW&model=X6&sort=price-asc&equipment=4x4&equipment=4x4&equipment=unknown&price_min=0&price_max=80000&year_min=2019'));
assert.equal(filters.equipment.length, 1);
assert.deepEqual(listing.parseListingFilters(listing.listingParams(filters)), filters);
const draft = listingDraft.listingDraftFromFilters(filters);
assert.deepEqual(listingDraft.listingFiltersFromDraft(draft), filters);
assert.deepEqual(listingDraft.withListingMake(draft, 'Audi').model, []);
assert.deepEqual(listingDraft.withListingMake(draft, 'BMW').model, ['X6']);
assert.deepEqual(listingDraft.withListingMake(draft, ' bmw ').model, ['X6']);
const inferredModel = listingDraft.withListingModel(draft, 'RS 6 Avant');
assert.deepEqual(inferredModel.make, ['BMW', 'Audi'], 'A model outside selected brands adds its owner without replacing existing brands');
assert.deepEqual(inferredModel.model, ['RS 6 Avant']);
assert.deepEqual(draft.make, ['BMW'], 'Model selection does not mutate the applied draft');
assert.deepEqual(listingDraft.withListingModel(draft, '').make, ['BMW'], 'Clearing a model preserves its make');
assert.deepEqual(listingDraft.withListingModel(draft, 'Dealer custom model'), { ...draft, model: ['Dealer custom model'] }, 'A model outside stock retains the selected make');
assert.equal(listingDraft.listingMakeForModel('Dealer custom model'), '');
assert.equal(listingDraft.listingMakeForModel(''), '', 'Clearing never infers a make from the All models option');
assert.equal(listingDraft.listingMakeForModel('rs q8'), 'Audi', 'Model ownership uses the same equality as filtering');
assert(listing.listingSelectionHas([' bmw '], 'BMW'));
assert(!listing.listingSelectionHas(['BMW'], 'Audi'));
assert.deepEqual(listingDraft.listingOptionsWithCurrent(['', 'BMW', 'Audi'], ['bmw', 'Saab', 'saab']), ['', 'BMW', 'Audi', 'Saab'], 'A known selection has one checked canonical option; unknown selections remain available');
assert.deepEqual(listingDraft.listingOptionsWithCurrent(['BMW'], ['bmw']), ['BMW'], 'Deduplication does not invent an All option');
assert.deepEqual(listingDraft.toggleListingIdentity({ ...draft, make: ['bmw'], model: ['x6 m sport'] }, 'make', 'BMW').make, [], 'Unchecking canonical text removes the existing differently-cased selection');
const matchesSuggestion = listingDraft.listingSuggestionMatcher('mercedes benz', 'en');
assert(matchesSuggestion('Mercedes-Benz'));
assert(!matchesSuggestion('Audi'));
assert(listingDraft.listingSuggestionMatcher('cOUpE', 'en')('Coupé'), 'Suggestion search tolerates accents and case');
assert(listingDraft.listingSuggestionMatcher('6 rs', 'bg')('RS 6 Avant'), 'Each term matches regardless of its order');
assert(!listingDraft.listingSuggestionMatcher('Audi BMW', 'bg')('Audi RS 6 Avant'));
assert(listingDraft.listingSuggestionMatcher('  ', 'bg')('Навигация'));
assert.deepEqual(listing.listingModelsAfterMakeChange(['BMW'], ['Audi'], ['X6']), []);
assert.deepEqual(listing.listingModelsAfterMakeChange(['BMW'], ['BMW'], ['X6']), ['X6']);
const transitioned = listingDraft.normalizeListingMakeTransition(filters, { ...filters, make: ['Audi'], model: ['X6', 'RS Q8'] });
assert.deepEqual(transitioned.model, ['RS Q8'], 'A brand transition removes only incompatible models');
const sameMake = listingDraft.normalizeListingMakeTransition(filters, { ...filters, model: ['X6 M Sport'] });
assert.deepEqual(sameMake.model, ['X6 M Sport']);
const multiple = listing.parseListingFilters(new URLSearchParams('make=Audi&make=BMW&make=+audi+&make=&model=RS+Q8&model=X6+M+Sport&model=RS+Q8'));
assert.deepEqual(multiple.make, ['Audi', 'BMW']);
assert.deepEqual(multiple.model, ['RS Q8', 'X6 M Sport']);
assert.deepEqual(listing.filterListingVehicles(records, multiple).map(vehicle => vehicle.id), [3, 4], 'OR within brands and models, AND across facets');
assert.deepEqual(listing.filterListingVehicles(records, { ...multiple, model: [] }).map(vehicle => vehicle.id), [1, 3, 4, 7]);
assert.deepEqual(listing.parseListingFilters(listing.listingParams(multiple)), multiple);
const multiDraft = listingDraft.listingDraftFromFilters(multiple);
assert.notEqual(multiDraft.make, multiple.make);
assert.notEqual(multiDraft.model, multiple.model);
assert.deepEqual(listingDraft.listingFiltersFromDraft(multiDraft), multiple);
assert.deepEqual(listingDraft.toggleListingIdentity(multiDraft, 'make', 'Audi').model, ['X6 M Sport']);
assert.deepEqual(listingDraft.toggleListingIdentity(multiDraft, 'make', '').model, []);
assert.deepEqual(listingDraft.toggleListingIdentity(multiDraft, 'model', '').make, ['Audi', 'BMW']);
const withoutAudi = listing.removeListingFilter(multiple, 'make', 'Audi');
assert.deepEqual(withoutAudi.getAll('make'), ['BMW']);
assert.deepEqual(withoutAudi.getAll('model'), ['X6 M Sport']);
const modelsAcrossAllBrands = listingDraft.withListingModel(listingDraft.emptyListingDraft(), ['RS Q8', 'X6 M Sport']);
assert.deepEqual(modelsAcrossAllBrands.make, [], 'Selecting models under All brands keeps other brands available');
assert.deepEqual(listing.filterListingVehicles(records, listingDraft.listingFiltersFromDraft(modelsAcrossAllBrands)).map(vehicle => vehicle.id), [3, 4]);
assert.equal(listingDraft.listingDraftHasFilters(listingDraft.emptyListingDraft()), false);
assert.equal(listingDraft.listingDraftFacetActive(listingDraft.emptyListingDraft(), 'make'), false);
assert.equal(listingDraft.listingDraftFacetActive(multiDraft, 'make'), true);
assert(listing.listingModelsForMake(['Audi', 'BMW']).includes('RS Q8'));
assert(listing.listingModelsForMake(['Audi', 'BMW']).includes('X6 M Sport'));
assert(!listing.listingModelsForMake(['Audi', 'BMW']).includes('GLE Coupé'));
const outsideStock = listingDraft.listingDraftFromFilters(listing.parseListingFilters(new URLSearchParams('make=Saab&model=9-3')));
assert.deepEqual(listingDraft.toggleListingIdentity(outsideStock, 'make', 'BMW').model, ['9-3'], 'Adding a brand preserves explicitly applied models outside current stock');
for (const value of ['12oops', '-1', '1.5', '1e-1', 'Infinity', '0x100', '999999999999999999']) {
  assert.equal(listingDraft.listingFiltersFromDraft({ ...draft, priceMax: value }).priceMax, null);
}
assert.equal(listingDraft.listingFiltersFromDraft({ ...draft, priceMax: '0' }).priceMax, 0);
assert.equal(listingDraft.listingFiltersFromDraft({ ...draft, priceMax: ' 80000 ' }).priceMax, 80000);
assert.equal(listingDraft.listingFiltersFromDraft({ ...draft, priceMax: String(Number.MAX_SAFE_INTEGER) }).priceMax, Number.MAX_SAFE_INTEGER);
for (const [value, expected] of [['8e4', 80000], ['8.001e4', 80010], ['80000.0', 80000], ['0e2', 0], ['1e+3', 1000]]) {
  assert.equal(listingDraft.listingFiltersFromDraft({ ...draft, priceMax: value }).priceMax, expected, 'A valid native integer input must not be silently dropped');
}
const numericForm = new FormData();
for (const [key, value] of [['price_min', '1e3'], ['price_max', '8e4'], ['year_min', '2.02e3'], ['year_max', '2024.0'], ['mileage_max', '1e5'], ['q', '8e4'], ['model', '8e4'], ['make', 'BMW'], ['make', 'Audi']]) numericForm.append(key, value);
assert.equal(listingDraft.listingFiltersFromFormData(numericForm).priceMax, 80000);
listingDraft.cleanListingFormData(numericForm);
for (const [key, value] of [['price_min', '1000'], ['price_max', '80000'], ['year_min', '2020'], ['year_max', '2024'], ['mileage_max', '100000'], ['q', '8e4'], ['model', '8e4']]) assert.equal(numericForm.get(key), value);
assert.deepEqual(numericForm.getAll('make'), ['BMW', 'Audi']);
const cleanedNumeric = [...numericForm];
listingDraft.cleanListingFormData(numericForm);
assert.deepEqual([...numericForm], cleanedNumeric, 'Form cleanup is idempotent');
assert.equal(listing.parseListingFilters(new URLSearchParams('price_max=8e4')).priceMax, null, 'URLs retain the canonical integer contract; native forms normalize before submission');
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
// Real category filtering, including the dealer's future non-car inventory.
const mixedInventory = inventory.vehicleTypes.map((type, index) => ({ ...records[0], id: index + 1, type, priceEur: (index + 1) * 9000 }));
for (const type of inventory.vehicleTypes) {
  const filters = listing.parseListingFilters(new URLSearchParams({ type }));
  assert.deepEqual(listing.filterListingVehicles(mixedInventory, filters).map(vehicle => vehicle.type), [type]);
  assert.equal(listingDraft.listingFiltersFromDraft(listingDraft.listingDraftFromFilters(filters)).type, type);
  assert.equal(listing.activeFilterCount(filters), 1);
  assert.equal(listing.removeListingFilter(filters, 'type', type).has('type'), false);
}
assert.equal(listing.parseListingFilters(new URLSearchParams('type=spaceship')).type, '');
assert.equal(listing.filterListingVehicles(records, listing.parseListingFilters(new URLSearchParams('type=motorbike'))).length, 0);
const preservedType = new URLSearchParams(listingDraft.preservedListingFacetEntries(new URLSearchParams('type=car&price_max=80000&sort=price-asc'), 'sort', 'newest'));
assert.equal(preservedType.get('type'), 'car');
assert.equal(preservedType.get('price_max'), '80000');
assert.deepEqual(listing.listingBudgetCaps(mixedInventory), [10000, 20000, 30000]);
assert.deepEqual(listing.listingBudgetCaps([]), []);
assert.equal(listing.listingBudgetLimit([]), 10000, 'An empty dealer catalog must not produce an infinite or reversed slider range');
assert.equal(listing.listingBudgetLimit([{ ...records[0], priceEur: 68750 }]), 70000);
assert.equal(listing.listingBudgetLimit([{ ...records[0], priceEur: NaN }]), 10000);
assert.deepEqual(listing.listingBudgetCaps(records), [60000, 80000, 100000]);
for (const cap of listing.listingBudgetCaps(records)) {
  assert(listing.filterListingVehicles(records, listing.parseListingFilters(new URLSearchParams({ price_max: String(cap) }))).length > 0);
}
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
