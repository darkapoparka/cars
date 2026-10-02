import test from 'node:test';
import assert from 'node:assert/strict';
import './gallery.test.mjs';
import { defaultFilters } from '../.qa/domain/types.mjs';
import { vehicles } from '../.qa/domain/catalog.mjs';
import {
  normalizeFilters,
  filterVehicles,
  parseFilters,
  serializeFilters,
  sortVehicles,
  paymentEstimate,
} from '../.qa/domain/search.mjs';
import { answerLocally } from '../.qa/domain/assistant.mjs';
import { createInitialState, decodeState } from '../.qa/domain/persistence.mjs';
const filters = (patch) => ({ ...structuredClone(defaultFilters), ...patch });
test('default search returns the captured cars', () =>
  assert.equal(filterVehicles(vehicles, filters({})).length, 4));
test('search text matches multiple non-adjacent words', () =>
  assert.equal(filterVehicles(vehicles, filters({ query: ' BMW diesel ' })).length, 3));
test('make inclusion and exclusion are independent', () => {
  assert.equal(filterVehicles(vehicles, filters({ makes: ['Audi'] })).length, 0);
  assert.equal(filterVehicles(vehicles, filters({ excludedMakes: ['BMW'] })).length, 0);
});
test('BMW model families select the correct series', () => {
  assert.deepEqual(
    filterVehicles(vehicles, filters({ models: ['5 Series'] })).map((v) => v.id),
    ['bmw-540'],
  );
  assert.deepEqual(
    filterVehicles(vehicles, filters({ models: ['X3'] })).map((v) => v.id),
    ['bmw-x3'],
  );
});
test('budget, registration and mileage filters combine', () =>
  assert.deepEqual(
    filterVehicles(
      vehicles,
      filters({ maxPrice: '55000', minYear: '2024', maxMileage: '40000', fuel: ['Diesel'] }),
    ).map((v) => v.id),
    ['bmw-540'],
  ));
test('equipment, body, location and power work', () =>
  assert.deepEqual(
    filterVehicles(
      vehicles,
      filters({
        features: ['Heated seats'],
        body: ['Estate'],
        location: 'Münster',
        minPower: '300',
      }),
    ).map((v) => v.id),
    ['bmw-540'],
  ));
test('leasing and category filters are real', () => {
  assert.deepEqual(
    filterVehicles(vehicles, filters({ payment: 'lease' })).map((v) => v.id),
    ['bmw-120'],
  );
  assert.equal(filterVehicles(vehicles, filters({ category: 'bike' })).length, 0);
});
test('URL round-trip preserves unicode, booleans and arrays', () => {
  const input = filters({
    makes: ['BMW', 'Audi'],
    models: ['X3'],
    location: 'Münster',
    deal: true,
    excludeDamaged: false,
  });
  assert.deepEqual(parseFilters(serializeFilters(input)), input);
  assert.equal(serializeFilters(defaultFilters), '');
});
test('invalid URL values cannot poison filters', () => {
  const value = parseFilters('category=wrong&payment=no&maxPrice=NaN&minYear=-1&seller=bad');
  assert.deepEqual(value, defaultFilters);
});
test('corrupt filter shapes normalize without throwing', () => {
  const value = normalizeFilters({
    makes: ['BMW', 'BMW', 42],
    models: null,
    query: [],
    fuel: {},
    deal: 'yes',
  });
  assert.deepEqual(value.makes, ['BMW']);
  assert.deepEqual(value.models, []);
  assert.equal(value.query, '');
  assert.equal(value.deal, false);
});
test('sorting never mutates the source catalog', () => {
  const before = vehicles.map((v) => v.id);
  assert.equal(sortVehicles(vehicles, 'price-asc')[0].id, 'bmw-120');
  assert.equal(sortVehicles(vehicles, 'price-desc')[0].id, 'bmw-x6');
  assert.equal(sortVehicles(vehicles, 'power')[0].id, 'bmw-540');
  assert.deepEqual(
    vehicles.map((v) => v.id),
    before,
  );
});
test('loan arithmetic handles zero interest and full deposits', () => {
  assert.equal(paymentEstimate(12000, 0, 12, 0), 1000);
  assert.equal(paymentEstimate(12000, 12000, 12, 7.9), 0);
  assert.ok(Math.abs(paymentEstimate(10000, 0, 12, 12) - 888.4878868) < 0.001);
});
test('loan arithmetic never returns NaN for invalid input', () => {
  for (const args of [
    [NaN, 0, 12, 5],
    [100, Infinity, 12, 5],
    [100, 0, 0, 5],
    [100, 0, 12, NaN],
  ])
    assert.equal(paymentEstimate(...args), 0);
});
test('assistant respects budget even with cheapest wording', () => {
  assert.deepEqual(answerLocally('cheapest under 1000').ids, []);
  assert.deepEqual(answerLocally('cheapest diesel under 55k').ids, ['bmw-540']);
});
test('assistant does not invent missing electric inventory', () =>
  assert.deepEqual(answerLocally('electric under 80k').ids, []));
test('native lower and upper mileage, power and seat ranges combine', () => {
  assert.deepEqual(
    filterVehicles(
      vehicles,
      filters({
        minMileage: '15000',
        maxMileage: '25000',
        minPower: '200',
        maxPower: '290',
        seats: '5',
        maxSeats: '5',
      }),
    ).map((v) => v.id),
    ['bmw-x6'],
  );
  assert.equal(filterVehicles(vehicles, filters({ maxSeats: '4' })).length, 0);
});
test('purchase and leasing constraints remain independent', () => {
  assert.deepEqual(
    filterVehicles(vehicles, filters({ payment: 'lease', minPrice: '90000', maxLease: '300' })).map(
      (v) => v.id,
    ),
    ['bmw-120'],
  );
  assert.equal(filterVehicles(vehicles, filters({ payment: 'buy', minLease: '9999' })).length, 4);
});
test('native door group and case-normalized color/body selections work', () => {
  assert.deepEqual(
    filterVehicles(vehicles, filters({ doors: '4/5', color: ['black'] })).map((v) => v.id),
    ['bmw-x6', 'bmw-120'],
  );
  assert.equal(filterVehicles(vehicles, filters({ doors: '2/3' })).length, 0);
  assert.deepEqual(
    filterVehicles(vehicles, filters({ body: ['Estate Car'] })).map((v) => v.id),
    ['bmw-540'],
  );
});
test('damage and seller filters retain native semantics', () => {
  assert.equal(
    filterVehicles(vehicles, filters({ damagedOnly: true, excludeDamaged: false })).length,
    0,
  );
  assert.equal(normalizeFilters({ seller: 'Company vehicles' }).seller, 'Company vehicles');
  assert.equal(filterVehicles(vehicles, filters({ seller: 'Company vehicles' })).length, 0);
});
test('native detail ranges use base attributes and missing values do not match', () => {
  assert.deepEqual(
    filterVehicles(vehicles, filters({ details: ['capacityFrom=2800', 'capacityTo=3100'] })).map(
      (v) => v.id,
    ),
    ['bmw-x6', 'bmw-540'],
  );
  assert.equal(filterVehicles(vehicles, filters({ details: ['capacityFrom=4000'] })).length, 0);
});
test('captured equipment filters combine as requirements rather than alternatives', () => {
  assert.deepEqual(
    filterVehicles(vehicles, filters({ details: ['security=ABS', 'security=ESP'] })).map(
      (v) => v.id,
    ),
    ['bmw-x6', 'bmw-540', 'bmw-x3', 'bmw-120'],
  );
  assert.equal(
    filterVehicles(vehicles, filters({ details: ['security=ABS', 'security=Unknown feature'] }))
      .length,
    0,
  );
});

test('native BMW parent groups include their captured child models', () => {
  const ids = filterVehicles(vehicles, filters({ models: ['X Series'] })).map(
    (vehicle) => vehicle.id,
  );
  assert.deepEqual(ids, ['bmw-x6', 'bmw-x3']);
  assert.deepEqual(
    filterVehicles(vehicles, filters({ models: ['1 Series'] })).map((v) => v.id),
    ['bmw-120'],
  );
});
test('category filter snapshots decode independently and reject unknown categories', () => {
  const state = decodeState(
    JSON.stringify({
      categoryFilters: {
        car: { makes: ['BMW'], category: 'bike' },
        bike: { makes: ['Honda'], maxPrice: '9000' },
        unknown: { makes: ['Bad'] },
      },
    }),
  );
  assert.equal(state.categoryFilters.car.category, 'car');
  assert.deepEqual(state.categoryFilters.car.makes, ['BMW']);
  assert.deepEqual(state.categoryFilters.bike.makes, ['Honda']);
  assert.equal(state.categoryFilters.bike.maxPrice, '9000');
  assert.equal(state.categoryFilters.unknown, undefined);
});
test('photo state rejects invalid indexes and preserves read notification state', () => {
  const state = decodeState(
    JSON.stringify({
      readWelcome: true,
      photoIndexes: {
        'bmw-x6': 19,
        'bmw-x3': -1,
        'bmw-540': '2',
        'bmw-120': 1000,
      },
    }),
  );
  assert.deepEqual(state.photoIndexes, { 'bmw-x6': 19 });
  assert.equal(state.readWelcome, true);
});

import {
  applyMakeSelection,
  modelsForMake,
  removeMakeSelection,
} from '../.qa/domain/make-selection.mjs';
test('make-scoped model selections combine with OR across makes', () => {
  let f = filters({});
  f = { ...f, ...applyMakeSelection(f, 'BMW', ['X6'], false) };
  f = { ...f, ...applyMakeSelection(f, 'Audi', ['A3'], false) };
  const audi = { ...vehicles[0], id: 'test-audi', make: 'Audi', model: 'A3', variant: 'Sportback' };
  assert.deepEqual(
    filterVehicles([...vehicles, audi], f).map((v) => v.id),
    ['bmw-x6', 'test-audi'],
  );
  assert.deepEqual(modelsForMake(f, 'BMW'), ['X6']);
  assert.deepEqual(modelsForMake(f, 'Audi'), ['A3']);
  assert.deepEqual(parseFilters(serializeFilters(f)), f);
});
test('model exclusions do not exclude the whole make', () => {
  const f = { ...filters({}), ...applyMakeSelection(filters({}), 'BMW', ['X6'], true) };
  assert.equal(filterVehicles(vehicles, f).length, 3);
  assert.ok(filterVehicles(vehicles, f).every((v) => v.model !== 'X6'));
});
test('make-scoped variants do not overwrite free search', () => {
  const f = {
    ...filters({ query: 'diesel' }),
    ...applyMakeSelection(filters({ query: 'diesel' }), 'BMW', ['X6'], false, 'M Sport'),
  };
  assert.equal(f.query, 'diesel');
  assert.equal(filterVehicles(vehicles, f)[0]?.id, 'bmw-x6');
  assert.deepEqual(removeMakeSelection(f, 'BMW').makeVariants, {});
});
test('corrupt scoped model data normalizes safely', () => {
  const f = parseFilters('makeModels=%7B%22BMW%22%3A7%7D&excludedModels=not-json');
  assert.deepEqual(f.makeModels, {});
  assert.deepEqual(f.excludedModels, {});
  assert.deepEqual(normalizeFilters({ makeModels: { BMW: ['X6', 7, 'X6'] } }).makeModels, {
    BMW: ['X6'],
  });
});

import {
  isISODate,
  referenceDate,
  validTradeBasics,
  validTradeDetails,
  changeEnquiryField,
  visitTimes,
  validVisit,
  capturedTradeOptions,
} from '../.qa/domain/enquiry.mjs';
import { getFilterSections } from '../.qa/domain/native-filter-fields.mjs';
const trade = { brand: 'BMW', model: '120', year: '2024', month: 'January', mileage: '0' };
const today = '2026-09-27';
const hours =
  'Mon - Fri 08:00 h - 19:00 h\nSat 09:00 h - 14:00 h\nSun 10:00 h - 17:00 h (Viewing day)';
test('calendar rejects normalized invalid dates and formats native dates', () => {
  assert.equal(isISODate('2026-02-30'), false);
  assert.equal(isISODate('2024-02-29'), true);
  for (const date of ['2025-02-29', '2026-13-01', 'not-a-date', '2026-9-2'])
    assert.equal(isISODate(date), false);
  assert.equal(referenceDate('2026-09-28'), '28.09.2026');
  assert.equal(referenceDate('bad'), '');
});
test('trade basics accept zero mileage and reject future or malformed registrations', () => {
  assert.equal(validTradeBasics(trade, today), true);
  for (const patch of [
    { mileage: '-1' },
    { mileage: '1.5' },
    { mileage: '1e3' },
    { mileage: '1000000' },
    { year: '2027' },
    { year: '2026', month: 'October' },
    { month: 'Any' },
    { brand: ' ' },
    { model: '' },
  ])
    assert.equal(validTradeBasics({ ...trade, ...patch }, today), false, JSON.stringify(patch));
});
test('optional trade VIN must be empty or exactly 17 alphanumeric characters', () => {
  assert.equal(validTradeDetails(trade, today), true);
  assert.equal(validTradeDetails({ ...trade, vin: 'WBA12345678901234' }, today), true);
  assert.equal(validTradeDetails({ ...trade, vin: 'too short' }, today), false);
});
test('trade changes clear dependent engine and trim state without losing mileage', () => {
  const data = {
    ...trade,
    fuel: 'Petrol',
    transmission: 'Automatic',
    power: '170 HP (125 kW)',
    variant: 'Sport',
  };
  const changed = changeEnquiryField(data, 'fuel', 'Diesel');
  assert.equal(changed.transmission, '');
  assert.equal(changed.power, '');
  assert.equal(changed.variant, '');
  assert.equal(changed.mileage, '0');
  const brand = changeEnquiryField(data, 'brand', 'Audi');
  assert.equal(brand.model, '');
  assert.equal(brand.year, '');
  assert.equal(brand.fuel, '');
  assert.deepEqual(changeEnquiryField(data, 'fuel', 'Petrol'), data);
});
test('visit choices follow captured weekday/weekend hours and reject malformed values', () => {
  assert.equal(visitTimes('2026-09-28', hours).length, 22);
  assert.equal(visitTimes('2026-09-26', hours)[0], '09:00');
  assert.equal(visitTimes('2026-09-27', hours).at(-1), '16:30');
  assert.deepEqual(visitTimes('2026-02-30', hours), []);
  assert.deepEqual(visitTimes('2026-09-28', 'Mon - Fri 25:00 h - 26:00 h'), []);
});
test('changing an appointment date clears the old time and invalid appointments cannot apply', () => {
  assert.equal(
    changeEnquiryField({ date: '2026-09-28', time: '08:00' }, 'date', '2026-09-29').time,
    '',
  );
  assert.equal(validVisit({ date: '2026-09-28', time: '08:00' }, today, hours), true);
  assert.equal(validVisit({ date: '2026-09-26', time: '09:00' }, today, hours), false);
  assert.equal(validVisit({ date: '2026-09-28', time: '23:00' }, today, hours), false);
});
test('observed trade-in engine options retain the captured labels, not generic power guesses', () => {
  assert.deepEqual(
    capturedTradeOptions({ ...trade, fuel: 'Petrol', transmission: 'Automatic' }).power,
    ['170 HP (125 kW)', '178 HP (131 kW)'],
  );
  assert.equal(capturedTradeOptions({ ...trade, model: 'X6' }), undefined);
});
test('all native category and condition variants have unique control identifiers', () => {
  const categories = [
    { category: 'car' },
    { category: 'bike' },
    { category: 'electric-bike' },
    { category: 'motorhome' },
    ...[
      'Over 7.5 t',
      'Trailer',
      'Up to 7.5 t',
      'Semi-Trailer Truck',
      'Semi-trailer',
      'Buses',
      'Agriculture',
      'Construction',
      'Forklift',
    ].map((name) => ({ category: 'truck', details: ['truckCategory=' + name] })),
  ];
  for (const category of categories)
    for (const payment of ['buy', 'lease'])
      for (const condition of [[], ['New']])
        for (const fuel of [[], ['Electric']]) {
          const f = filters({ ...category, payment, condition, fuel });
          const fields = getFilterSections(f).flatMap((section) => section.fields);
          assert.ok(fields.length > 0);
          assert.equal(
            new Set(fields.map((field) => field.id)).size,
            fields.length,
            JSON.stringify(f),
          );
        }
});

import {
  modelDraftFor,
  toggleModelDraft,
  selectedModelVariants,
  setModelVariant,
  modelVariantFor,
} from '../.qa/domain/model-picker.mjs';
import { excludedMakeNames, makeSelectionSummary } from '../.qa/domain/make-selection.mjs';
import { modelGroupsFor, carModelGroups, modelNodeKey } from '../.qa/domain/native-taxonomy.mjs';
test('per-model variants combine with OR rather than leaking across sibling models', () => {
  const f = filters({
    makes: ['BMW'],
    makeModels: { BMW: ['X6', 'X3'] },
    modelVariants: { BMW: { X6: 'AHK', X3: 'not-in-captured-variant' } },
  });
  assert.deepEqual(
    filterVehicles(vehicles, f).map((v) => v.id),
    ['bmw-x6'],
  );
  assert.deepEqual(parseFilters(serializeFilters(f)), f);
});
test('model-specific exclusions preserve included models and use their own variant', () => {
  const f = filters({
    makes: ['BMW'],
    excludedModels: { BMW: ['X6', 'X3'] },
    excludedModelVariants: { BMW: { X6: 'AHK', X3: 'not-present' } },
  });
  assert.deepEqual(
    filterVehicles(vehicles, f).map((v) => v.id),
    ['bmw-540', 'bmw-x3', 'bmw-120'],
  );
  assert.deepEqual(excludedMakeNames(f), ['BMW']);
});
test('a partial family inherits its variant and preserves all remaining child selections', () => {
  const groups = modelGroupsFor('BMW'),
    family = groups.find((g) => g.name === '1 Series');
  let draft = { selected: ['1 Series'], variants: { '1 Series': 'Sport' } };
  draft = toggleModelDraft(draft, '114', false, groups);
  assert.deepEqual(
    draft.selected,
    family.children.filter((name) => name !== '114'),
  );
  assert(draft.selected.every((name) => draft.variants[name] === 'Sport'));
  draft = setModelVariant(draft, '1 Series', 'Automatic', family);
  assert(draft.selected.every((name) => selectedModelVariants(draft)[name] === 'Automatic'));
  assert.equal(modelVariantFor(draft, '1 Series', family), 'Automatic');
});
test('removing make criteria removes their nested variants without touching another make', () => {
  const f = filters({
    makes: ['BMW', 'Audi'],
    makeModels: { BMW: ['X6'], Audi: ['A3'] },
    modelVariants: { BMW: { X6: 'Sport' }, Audi: { A3: 'S line' } },
    excludedModels: { BMW: ['120'] },
    excludedModelVariants: { BMW: { 120: 'Sport' } },
  });
  const included = { ...f, ...removeMakeSelection(f, 'BMW') };
  assert.deepEqual(included.modelVariants, { Audi: { A3: 'S line' } });
  const excluded = { ...f, ...removeMakeSelection(f, 'BMW', true) };
  assert.deepEqual(excluded.excludedModelVariants, {});
  assert.deepEqual(excluded.makeModels, f.makeModels);
});
test('nested model maps reject malformed values and unsafe keys', () => {
  const f = normalizeFilters(
    JSON.parse(
      '{"modelVariants":{"BMW":{"X6":"  Sport  ","X3":false,"__proto__":"bad"},"Audi":null,"constructor":{"A3":"bad"}}}',
    ),
  );
  assert.deepEqual(f.modelVariants, { BMW: { X6: 'Sport' } });
});
test('legacy make variants open as selected-model variants and Any resets the model selection', () => {
  const draft = modelDraftFor(
    filters({ makes: ['BMW'], makeModels: { BMW: ['X6'] }, makeVariants: { BMW: 'Sport' } }),
    'BMW',
    false,
  );
  assert.equal(draft.variants.X6, 'Sport');
  assert.deepEqual(toggleModelDraft(draft, '', true, modelGroupsFor('BMW')).selected, []);
});
test('selected cards describe each model variant and keep exclusion semantics separate', () => {
  const f = filters({
    makes: ['BMW'],
    makeModels: { BMW: ['X6', 'X3'] },
    modelVariants: { BMW: { X6: 'Sport', X3: 'xDrive' } },
    excludedModels: { BMW: ['120'] },
    excludedModelVariants: { BMW: { 120: 'Automatic' } },
  });
  assert.equal(makeSelectionSummary(f, 'BMW'), 'X6 Sport, X3 xDrive');
  assert.equal(makeSelectionSummary(f, 'BMW', true), '120 Automatic');
});
test('native model catalogs retain unique rows, including legitimate same-name family leaves', () => {
  for (const [make, groups] of Object.entries(carModelGroups)) {
    assert.equal(new Set(groups.map((g) => modelNodeKey(g, groups))).size, groups.length, make);
    for (const group of groups) {
      assert.equal(new Set(group.children).size, group.children.length, make + ' ' + group.name);
    }
  }
});
test('same-name family and leaf selection are distinct and search never recurses', () => {
  const groups = modelGroupsFor('Bentley');
  const draft = toggleModelDraft(
    { selected: [], variants: {} },
    'Continental',
    true,
    groups,
    'Continental',
  );
  assert.deepEqual(draft.selected, ['@model:Continental']);
  const catalog = [
    { ...vehicles[0], id: 'base', make: 'Bentley', model: 'Continental', variant: '' },
    { ...vehicles[0], id: 'gt', make: 'Bentley', model: 'Continental GT', variant: '' },
  ];
  assert.deepEqual(
    filterVehicles(
      catalog,
      filters({ makes: ['Bentley'], makeModels: { Bentley: ['Continental'] } }),
    ).map((v) => v.id),
    ['base', 'gt'],
  );
  assert.deepEqual(
    filterVehicles(
      catalog,
      filters({ makes: ['Bentley'], makeModels: { Bentley: draft.selected } }),
    ).map((v) => v.id),
    ['base'],
  );
});
test('all captured model families can be evaluated without recursive loops', () => {
  for (const [make, groups] of Object.entries(carModelGroups))
    for (const group of groups) {
      const fixture = { ...vehicles[0], make, model: group.children[0] || group.name };
      assert.doesNotThrow(
        () =>
          filterVehicles(
            [fixture],
            filters({ makes: [make], makeModels: { [make]: [group.name] } }),
          ),
        make + ' ' + group.name,
      );
    }
});

import './native-listings.test.mjs';

import { serviceCategoriesFor, showroomServices } from '../.qa/domain/showroom-services.mjs';

test('service tabs omit categories the dealer does not offer', () => {
  const general = showroomServices.filter((service) => service.category === 'services');
  assert.deepEqual(serviceCategoriesFor(general), [{ value: 'services', label: 'All services' }]);
  assert.deepEqual(
    serviceCategoriesFor(showroomServices.filter((service) => service.category !== 'financing')),
    [
      { value: 'services', label: 'All services' },
      { value: 'parts', label: 'Parts' },
    ],
  );
  assert.deepEqual(serviceCategoriesFor([]), [{ value: 'services', label: 'All services' }]);
});
