import test from 'node:test';
import assert from 'node:assert/strict';
import { defaultFilters } from '../.qa/domain/types.mjs';
// Native-capture contracts remain pinned to the four original reference fixtures.
import {
  capturedVehicles as vehicles,
  vehicles as showroomVehicles,
  demoVehicles,
  getVehicle,
} from '../.qa/domain/catalog.mjs';
import { existsSync } from 'node:fs';
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
import { showroomMakeOptions } from '../.qa/domain/make-picker-options.mjs';
import {
  vehicleDetailSection,
  vehicleDetailHashSection,
  vehicleDetailSectionHref,
  vehicleGalleryHref,
  vehicleGalleryReturnHref,
  vehiclePhotoViewerState,
  vehiclePhotoViewerIndex,
} from '../.qa/domain/vehicle-detail-navigation.mjs';
const filters = (patch) => ({ ...structuredClone(defaultFilters), ...patch });

test('expanded demo stock has unique routable IDs and local photos', () => {
  assert.equal(showroomVehicles.length, 16);
  assert.equal(demoVehicles.length, 12);
  assert.equal(new Set(showroomVehicles.map((vehicle) => vehicle.id)).size, 16);
  assert.deepEqual(showroomVehicles.slice(0, 4), vehicles);
  for (const vehicle of demoVehicles) {
    assert.equal(getVehicle(vehicle.id), vehicle);
    assert.equal(vehicle.dealer, 'Demo showroom');
    assert.match(vehicle.attributes.description, /Sample vehicle/);
    assert.equal(vehicle.financeMonthly, undefined);
    for (const image of vehicle.images) {
      assert.ok(image.startsWith('/images/'));
      assert.ok(existsSync(new URL('../public' + image, import.meta.url)), image);
    }
  }
});

test('expanded stock supports make, fuel and budget filtering with price sorting', () => {
  assert.equal(filterVehicles(showroomVehicles, filters({ makes: ['Audi'] })).length, 3);
  assert.equal(filterVehicles(showroomVehicles, filters({ makes: ['Mercedes-Benz'] })).length, 4);
  assert.equal(filterVehicles(showroomVehicles, filters({ fuel: ['Diesel'] })).length, 9);
  const before = showroomVehicles.map((vehicle) => vehicle.id);
  const affordable = sortVehicles(
    filterVehicles(showroomVehicles, filters({ fuel: ['Diesel'], maxPrice: '35000' })),
    'price-asc',
  );
  assert.deepEqual(
    affordable.map((vehicle) => vehicle.id),
    ['demo-mercedes-gle-2018', 'demo-mercedes-gle-2019', 'demo-bmw-x6-2017'],
  );
  assert.equal(sortVehicles(showroomVehicles, 'price-asc')[0].id, 'demo-bmw-120-2025');
  assert.deepEqual(
    showroomVehicles.map((vehicle) => vehicle.id),
    before,
  );
  for (const vehicle of demoVehicles) {
    const modelMatches = filterVehicles(
      showroomVehicles,
      filters({
        makes: [vehicle.make],
        makeModels: { [vehicle.make]: [vehicle.model] },
      }),
    );
    assert.ok(modelMatches.includes(vehicle), vehicle.id + ' must be selectable by model');
  }
  assert.deepEqual(
    filterVehicles(
      showroomVehicles,
      filters({ makes: ['Audi'], makeModels: { Audi: ['RSQ8'] } }),
    ).map((vehicle) => vehicle.id),
    ['demo-audi-rs-q8-2020'],
  );
});

test('PDP sections accept only known views and unknown fragments show details', () => {
  for (const section of ['details', 'photos', 'features']) {
    assert.equal(vehicleDetailSection(section), section);
    assert.equal(vehicleDetailHashSection('#' + section), section);
  }
  for (const value of [null, undefined, {}, 'unknown', 'Photos', '#photos'])
    assert.equal(vehicleDetailSection(value), 'details');
  assert.equal(vehicleDetailHashSection('#unknown'), 'details');
});

test('PDP section links retain route and query context while replacing the fragment', () => {
  const original = 'http://127.0.0.1:6474/vehicle/bmw-x6?context=stock#features';
  assert.equal(
    vehicleDetailSectionHref(original, 'photos'),
    '/vehicle/bmw-x6?context=stock#photos',
  );
  assert.equal(vehicleDetailSectionHref(original, 'details'), '/vehicle/bmw-x6?context=stock');
});

test('Gallery links return to the selected PDP section and reject an external return target', () => {
  assert.equal(
    vehicleGalleryHref('bmw-x6', 'photos'),
    '/vehicle/bmw-x6/gallery?returnSection=photos',
  );
  assert.equal(vehicleGalleryHref('bmw-x6', 'details'), '/vehicle/bmw-x6/gallery');
  assert.equal(vehicleGalleryReturnHref('bmw-x6', 'photos'), '/vehicle/bmw-x6#photos');
  assert.equal(vehicleGalleryReturnHref('bmw-x6', 'https://example.com'), '/vehicle/bmw-x6');
  assert.equal(vehicleGalleryReturnHref('bmw/x 6', 'features'), '/vehicle/bmw%2Fx%206#features');
});

test('Photo history keeps router context without mutating the previous entry', () => {
  const before = { __NA: true, tree: ['vehicle'], scroll: 540 };
  const after = vehiclePhotoViewerState(before, 'bmw-x6', 2);
  assert.deepEqual(before, { __NA: true, tree: ['vehicle'], scroll: 540 });
  assert.equal(after.__NA, true);
  assert.equal(after.tree, before.tree);
  assert.equal(after.scroll, 540);
  assert.equal(vehiclePhotoViewerIndex(after, 'bmw-x6', 20), 2);
  assert.deepEqual(vehiclePhotoViewerState(null, 'bmw-x6', 0), {
    carsMobilePhotoViewer: { vehicleId: 'bmw-x6', index: 0 },
  });
});

test('Restored photo state rejects stale vehicles, invalid indices and invalid image counts', () => {
  const valid = vehiclePhotoViewerState({}, 'bmw-x6', 3);
  assert.equal(vehiclePhotoViewerIndex(valid, 'bmw-x6', 20), 3);
  assert.equal(vehiclePhotoViewerIndex(valid, 'bmw-x3', 20), null);
  for (const index of [-1, 20, 1.5, Infinity, NaN, '3', null])
    assert.equal(
      vehiclePhotoViewerIndex(
        { carsMobilePhotoViewer: { vehicleId: 'bmw-x6', index } },
        'bmw-x6',
        20,
      ),
      null,
    );
  for (const count of [0, -1, NaN, Infinity, 0.5])
    assert.equal(vehiclePhotoViewerIndex(valid, 'bmw-x6', count), null);
  for (const state of [
    null,
    {},
    [],
    { carsMobilePhotoViewer: null },
    { carsMobilePhotoViewer: '3' },
  ])
    assert.equal(vehiclePhotoViewerIndex(state, 'bmw-x6', 20), null);
});
test('default search returns the captured cars', () =>
  assert.equal(filterVehicles(vehicles, filters({})).length, 4));
test('search text matches multiple non-adjacent words', () =>
  assert.equal(filterVehicles(vehicles, filters({ query: ' BMW diesel ' })).length, 3));
test('make inclusion and exclusion are independent', () => {
  assert.equal(filterVehicles(vehicles, filters({ makes: ['Audi'] })).length, 0);
  assert.equal(filterVehicles(vehicles, filters({ excludedMakes: ['BMW'] })).length, 0);
});
test('choosing or excluding the only stocked make does not remove it from make choices', () => {
  const stockMakes = [...new Set(vehicles.map((vehicle) => vehicle.make))];
  for (const excluded of [false, true]) {
    const draft = filters({});
    const selected = { ...draft, ...applyMakeSelection(draft, 'BMW', [], excluded) };
    assert.deepEqual(
      showroomMakeOptions(stockMakes, [...selected.makes, ...excludedMakeNames(selected)]),
      ['Any', 'BMW'],
    );
  }
});
test('make choices retain removable criteria outside stock and search finds selected makes', () => {
  assert.deepEqual(showroomMakeOptions([], ['Audi', 'Audi']), ['Any', 'Audi']);
  assert.deepEqual(showroomMakeOptions(['BMW', 'Audi'], ['BMW'], ' bmw '), ['BMW']);
  assert.deepEqual(showroomMakeOptions(['BMW'], [], 'audi'), []);
  assert.deepEqual(showroomMakeOptions(['BMW'], [], 'any make'), ['Any']);
});
test('the optional make catalog fills the picker without duplicating stock or hiding selections', () => {
  const names = showroomMakeOptions(['BMW'], ['Unlisted make', 'Audi'], '', nativeCarMakes);
  assert.deepEqual(names.slice(0, 2), ['Any', 'BMW']);
  assert.equal(names.length, new Set(nativeCarMakes).size + 2);
  assert.equal(new Set(names).size, names.length);
  assert.ok(nativeCarMakes.every((make) => names.includes(make)));
  assert.equal(names.at(-1), 'Unlisted make');
  assert.deepEqual(showroomMakeOptions(['BMW'], [], ' audi ', nativeCarMakes), ['Audi']);
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
test('BMW families stay together and grouping electric models preserves every model key', () => {
  const groups = modelGroupsFor('BMW');
  assert.deepEqual(
    groups.filter((group) => group.children.length).map((group) => group.name),
    [
      '1 Series',
      '2 Series',
      '3 Series',
      '4 Series',
      '5 Series',
      '6 Series',
      '7 Series',
      'M Models',
      'X Series',
      'i Models',
      'Z Series',
    ],
  );
  const leaves = (catalog) =>
    catalog.flatMap((group) => (group.children.length ? group.children : [group.name])).sort();
  assert.deepEqual(leaves(groups), leaves(carModelGroups.BMW));
  assert.equal(new Set(groups.map((group) => group.name)).size, groups.length);
});
test('BMW electric family filters match its leaves and partial selection retains older leaf criteria', () => {
  const groups = modelGroupsFor('BMW');
  const electric = groups.find((group) => group.name === 'i Models');
  const catalog = [
    { ...vehicles[0], id: 'electric', model: 'i4', variant: '' },
    { ...vehicles[0], id: 'electric-suv', model: 'iX', variant: '' },
    { ...vehicles[0], id: 'suv', model: 'X3', variant: '' },
  ];
  const family = filters({ makes: ['BMW'], makeModels: { BMW: ['i Models'] } });
  assert.deepEqual(
    filterVehicles(catalog, family).map((vehicle) => vehicle.id),
    ['electric', 'electric-suv'],
  );
  assert.deepEqual(parseFilters(serializeFilters(family)), family);
  assert.deepEqual(
    filterVehicles(catalog, filters({ makes: ['BMW'], makeModels: { BMW: ['i4'] } })).map(
      (vehicle) => vehicle.id,
    ),
    ['electric'],
  );
  const partial = toggleModelDraft(
    { selected: ['i Models'], variants: {} },
    'i4',
    false,
    groups,
    'i Models',
  );
  assert.deepEqual(
    partial.selected,
    electric.children.filter((name) => name !== 'i4'),
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
  const results = answerLocally('cheapest diesel under 55k').ids.map(getVehicle);
  assert.equal(results.length, 3);
  assert.ok(results.every((vehicle) => vehicle.fuel === 'Diesel' && vehicle.price <= 55000));
  assert.equal(results[0].price, 31900);
  assert.ok(
    results.every((vehicle, index) => index === 0 || results[index - 1].price <= vehicle.price),
  );
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

test('contact details restore with a message draft and old storage remains compatible', () => {
  const old = decodeState(
    JSON.stringify({ messageDrafts: { 'showroom-general': 'Existing enquiry' } }),
  );
  assert.equal(old.messageDrafts['showroom-general'], 'Existing enquiry');
  assert.deepEqual(old.showroomContactDetails, {});
  const state = decodeState(
    JSON.stringify({
      messageDrafts: { 'showroom-general': 'Could we arrange a viewing?' },
      showroomContactDetails: {
        'showroom-general': {
          name: '  Alex  ',
          phone: '+359 888 000 000',
          email: 'alex@example.test',
          unknown: 'discard',
        },
      },
    }),
  );
  assert.equal(state.messageDrafts['showroom-general'], 'Could we arrange a viewing?');
  assert.deepEqual(state.showroomContactDetails['showroom-general'], {
    name: 'Alex',
    phone: '+359 888 000 000',
    email: 'alex@example.test',
  });
});

test('contact storage bounds text and rejects invalid fields and prototype keys', () => {
  const state = decodeState(
    '{"showroomContactDetails":{"__proto__":{"name":"bad"},"constructor":{"name":"bad"},"":{"name":"bad"},"good":{"name":"' +
      'a'.repeat(100) +
      '","phone":23,"email":null}}}',
  );
  assert.deepEqual(Object.keys(state.showroomContactDetails), ['good']);
  assert.deepEqual(state.showroomContactDetails.good, {
    name: 'a'.repeat(80),
    phone: '',
    email: '',
  });
  assert.deepEqual(decodeState('{"showroomContactDetails":[]}').showroomContactDetails, {});
});

import {
  applyMakeSelection,
  clearMakeSelections,
  clearModelSelections,
  modelsForMake,
  removeMakeSelection,
} from '../.qa/domain/make-selection.mjs';
test('Any make clears scoped model and exclusion criteria while retaining other filters', () => {
  const budget = filters({ minPrice: '20000', maxPrice: '50000', fuel: ['Diesel'] });
  let selected = {
    ...budget,
    ...applyMakeSelection(budget, 'BMW', ['X6'], false, 'M Sport', { X6: 'M Sport' }),
  };
  selected = {
    ...selected,
    ...applyMakeSelection(selected, 'Audi', ['A3'], true, 'Sportback', { A3: 'Sportback' }),
  };
  const cleared = { ...selected, ...clearMakeSelections() };
  assert.deepEqual(parseFilters(serializeFilters(cleared)), budget);
  assert.deepEqual(filterVehicles(vehicles, cleared), filterVehicles(vehicles, budget));
});
test('clearing models preserves makes, whole-make exclusions and unrelated filters', () => {
  const budget = filters({ minPrice: '20000', maxPrice: '80000', fuel: ['Diesel'] });
  let selected = {
    ...budget,
    ...applyMakeSelection(budget, 'BMW', ['X6'], false, 'M Sport', { X6: 'M Sport' }),
  };
  selected = { ...selected, ...applyMakeSelection(selected, 'Audi', ['RS6'], false) };
  selected = { ...selected, ...applyMakeSelection(selected, 'Mercedes-Benz', [], true) };
  selected = {
    ...selected,
    ...applyMakeSelection(selected, 'BMW', ['X5'], true, 'M', { X5: 'M' }),
  };
  const cleared = { ...selected, ...clearModelSelections(selected) };
  const expected = filters({
    ...budget,
    makes: ['BMW', 'Audi'],
    makeModels: { BMW: [], Audi: [] },
    excludedMakes: ['Mercedes-Benz'],
  });
  assert.deepEqual(parseFilters(serializeFilters(cleared)), normalizeFilters(expected));
  assert.deepEqual(
    filterVehicles(showroomVehicles, cleared),
    filterVehicles(showroomVehicles, expected),
  );
});
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
import {
  modelGroupsFor,
  carModelGroups,
  modelNodeKey,
  nativeCarMakes,
} from '../.qa/domain/native-taxonomy.mjs';
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

import {
  serviceCategoriesFor,
  showroomServices,
  searchShowroomServices,
  serviceCategoryHref,
  serviceSearchHref,
  serviceQuickFiltersFor,
  serviceQuickFilter,
  serviceQuickFilterHref,
  importCountries,
  importCountry,
  importCountryHref,
  importExamplesFor,
  saleEnquiryType,
  saleEnquiryHref,
} from '../.qa/domain/showroom-services.mjs';
import {
  emptyServiceRequest,
  normalizeServiceRequest,
  seedServiceRequest,
  parseServiceRequest,
  serializeServiceRequest,
  serviceRequestStorageKey,
  serviceRequestMessage,
  serviceRequestErrorStep,
  validateServiceRequest,
  validateServiceRequestStep,
} from '../.qa/domain/service-requests.mjs';
import {
  clearShowroomQuickFilter,
  showroomFilterTab,
  updateShowroomFilterDraft,
  resetShowroomFilterDraft,
} from '../.qa/domain/showroom-filter-editor.mjs';

test('removing Fuel restores matching cars without clearing Year, Price or Gearbox', () => {
  const applied = normalizeFilters(
    filters({
      minYear: '2025',
      maxYear: '2027',
      maxPrice: '80000',
      transmission: ['Automatic'],
      fuel: ['Diesel'],
    }),
  );
  const baseline = structuredClone(applied);
  const next = clearShowroomQuickFilter(applied, 'fuel');
  assert.deepEqual(applied, baseline);
  assert.equal(next.minYear, '2025');
  assert.equal(next.maxYear, '2027');
  assert.equal(next.maxPrice, '80000');
  assert.deepEqual(next.transmission, ['Automatic']);
  assert.deepEqual(
    filterVehicles(vehicles, applied).map((v) => v.id),
    ['bmw-x6', 'bmw-x3'],
  );
  assert.deepEqual(
    filterVehicles(vehicles, next).map((v) => v.id),
    ['bmw-x6', 'bmw-x3', 'bmw-120'],
  );
});

test('removing Make clears model exclusions and variant criteria while retaining budget and Fuel', () => {
  const applied = normalizeFilters(
    filters({
      makes: ['BMW'],
      models: ['X6'],
      makeModels: { BMW: ['X6'] },
      excludedMakes: ['Audi'],
      excludedModels: { BMW: ['X3'] },
      makeVariants: { BMW: 'M' },
      excludedMakeVariants: { Audi: 'RS' },
      modelVariants: { BMW: { X6: 'M' } },
      excludedModelVariants: { BMW: { X3: 'M' } },
      maxPrice: '80000',
      fuel: ['Diesel'],
    }),
  );
  const baseline = structuredClone(applied);
  const next = clearShowroomQuickFilter(applied, 'make');
  assert.deepEqual(applied, baseline);
  assert.equal(next.maxPrice, '80000');
  assert.deepEqual(next.fuel, ['Diesel']);
  const params = new URLSearchParams(serializeFilters(next));
  assert.deepEqual([...params.keys()], ['maxPrice', 'fuel']);
  assert.equal(filterVehicles(vehicles, next).length, 3);
});

test('removing Mileage clears both bounds and preserves vehicle category and other ranges', () => {
  const applied = normalizeFilters(
    filters({
      category: 'bike',
      minMileage: '1000',
      maxMileage: '20000',
      minYear: '2020',
      maxPrice: '10000',
    }),
  );
  const next = clearShowroomQuickFilter(applied, 'mileage');
  assert.equal(next.minMileage, '');
  assert.equal(next.maxMileage, '');
  assert.equal(next.category, 'bike');
  assert.equal(next.minYear, '2020');
  assert.equal(next.maxPrice, '10000');
  assert.equal(applied.minMileage, '1000');
  assert.equal(applied.maxMileage, '20000');
});

test('unified filter sections reject unknown editor URLs', () => {
  for (const value of ['search', 'make', 'price', 'year', 'fuel', 'condition', 'more'])
    assert.equal(showroomFilterTab(value), value);
  for (const value of [null, '', 'payment', 'location', 'unknown'])
    assert.equal(showroomFilterTab(value), null);
});

test('filter drafts combine sections without mutating the applied inventory or category', () => {
  const applied = filters({ category: 'car', query: 'BMW' });
  const baseline = structuredClone(applied);
  let draft = updateShowroomFilterDraft(applied, { maxPrice: '50000', category: 'bike' });
  draft = updateShowroomFilterDraft(draft, { condition: ['Used'] });
  draft = updateShowroomFilterDraft(draft, applyMakeSelection(draft, 'BMW', ['1 Series'], false));
  assert.deepEqual(applied, baseline);
  assert.equal(draft.category, 'car');
  assert.equal(draft.maxPrice, '50000');
  assert.deepEqual(draft.condition, ['Used']);
  assert.deepEqual(draft.makes, ['BMW']);
  assert.equal(draft.query, 'BMW');
});

test('editor Reset discards only the draft and preserves the current vehicle category', () => {
  const applied = filters({
    category: 'bike',
    makes: ['Honda'],
    makeVariants: { Honda: 'CBR' },
    maxPrice: '5000',
  });
  const baseline = structuredClone(applied);
  const reset = resetShowroomFilterDraft(applied);
  assert.deepEqual(applied, baseline);
  assert.equal(reset.category, 'bike');
  assert.deepEqual(reset.makes, []);
  assert.deepEqual(reset.makeVariants, {});
  assert.equal(reset.maxPrice, '');
  reset.condition.push('Used');
  assert.deepEqual(defaultFilters.condition, []);
});

test('search drafts combine with price filters without applying changes to inventory', () => {
  const applied = filters({ category: 'car', makes: ['BMW'] });
  const baseline = structuredClone(applied);
  let draft = updateShowroomFilterDraft(applied, { query: 'BMW X6', maxPrice: '1' });
  assert.deepEqual(filterVehicles(vehicles, draft), []);
  draft = updateShowroomFilterDraft(draft, { maxPrice: '' });
  assert.deepEqual(
    filterVehicles(vehicles, draft).map((vehicle) => vehicle.id),
    ['bmw-x6'],
  );
  assert.equal(draft.query, 'BMW X6');
  assert.deepEqual(draft.makes, ['BMW']);
  assert.deepEqual(applied, baseline);
  const reset = resetShowroomFilterDraft(draft);
  assert.equal(reset.query, '');
  assert.equal(filterVehicles(vehicles, reset).length, 4);
});

test('service tabs omit categories the dealer does not offer', () => {
  const general = showroomServices.filter((service) => service.category === 'services');
  assert.deepEqual(serviceCategoriesFor(general), [{ value: 'services', label: 'All' }]);
  assert.deepEqual(
    serviceCategoriesFor(showroomServices.filter((service) => service.category !== 'import')),
    [
      { value: 'services', label: 'All' },
      { value: 'sell', label: 'Sell' },
    ],
  );
  assert.deepEqual(serviceCategoriesFor([]), [{ value: 'services', label: 'All' }]);
  assert.deepEqual(serviceCategoriesFor(showroomServices), [
    { value: 'services', label: 'All' },
    { value: 'import', label: 'Import' },
    { value: 'sell', label: 'Sell' },
  ]);
});

test('service search finds buyout and import offerings and keeps financing and parts in All', () => {
  assert.deepEqual(
    searchShowroomServices(showroomServices, '  BUY OUT  ').map((service) => service.id),
    ['sell'],
  );
  assert.deepEqual(
    searchShowroomServices(showroomServices, 'overseas').map((service) => service.id),
    ['import'],
  );
  assert.deepEqual(
    searchShowroomServices(showroomServices, 'fínancing').map((service) => service.id),
    ['financing'],
  );
  assert.deepEqual(searchShowroomServices(showroomServices, 'absent service'), []);
  assert.deepEqual(searchShowroomServices(showroomServices, ''), showroomServices);
  assert.ok(showroomServices.some((service) => service.id === 'parts'));
});

test('service searches find concise card summaries and full service descriptions', () => {
  assert.deepEqual(
    searchShowroomServices(showroomServices, 'Explore').map(({ id }) => id),
    ['financing'],
  );
  assert.deepEqual(
    searchShowroomServices(showroomServices, 'Възможности').map(({ id }) => id),
    ['financing'],
  );
  assert.deepEqual(
    searchShowroomServices(showroomServices, 'Discuss').map(({ id }) => id),
    ['financing'],
  );
  assert.deepEqual(
    searchShowroomServices(showroomServices, 'следващата').map(({ id }) => id),
    ['trade-in', 'financing'],
  );
});

test('service search URLs encode text and retain existing finance/parts deep links', () => {
  assert.equal(serviceCategoryHref('import'), '/services?tab=import');
  assert.equal(serviceCategoryHref('sell'), '/services?tab=sell');
  assert.equal(serviceCategoryHref('financing'), '/services?tab=financing');
  assert.equal(serviceCategoryHref('parts'), '/services?tab=parts');
  assert.equal(serviceSearchHref('   '), '/services');
  const query = 'parts & accessories / въпрос';
  assert.equal(
    new URL(serviceSearchHref(query), 'https://example.test').searchParams.get('q'),
    query,
  );
});

test('service pills preserve search context, existing detail URLs and available offerings', () => {
  const query = 'test drive & viewing';
  const url = new URL(serviceQuickFilterHref('viewing', query), 'https://example.test');
  assert.equal(url.searchParams.get('topic'), 'viewing');
  assert.equal(url.searchParams.get('q'), query);
  assert.equal(serviceQuickFilterHref('financing', query), '/services?tab=financing');
  assert.equal(serviceQuickFilterHref('parts'), '/services?tab=parts');
  assert.equal(serviceQuickFilter('unavailable'), 'all');
  assert.deepEqual(
    serviceQuickFiltersFor(showroomServices.filter((service) => service.id === 'parts')).map(
      ({ value }) => value,
    ),
    ['all', 'parts'],
  );
  assert.deepEqual(
    serviceQuickFiltersFor([]).map(({ value }) => value),
    ['all'],
  );
  assert.deepEqual(
    searchShowroomServices(showroomServices, 'Canada').map(({ id }) => id),
    ['import'],
  );
});

test('country pills filter illustrative imports backed by local vehicle assets', () => {
  const examples = importExamplesFor('all');
  assert.equal(examples.length, 4);
  assert.equal(new Set(examples.map(({ vehicleId }) => vehicleId)).size, examples.length);
  for (const { value } of importCountries) {
    const countryExamples = importExamplesFor(value);
    assert(countryExamples.length > 0);
    assert(countryExamples.every((example) => value === 'all' || example.country === value));
    assert(
      countryExamples.every(
        (example) => vehicles.find((vehicle) => vehicle.id === example.vehicleId)?.images.length,
      ),
    );
    assert.equal(
      importCountry(
        new URL(importCountryHref(value), 'https://example.test').searchParams.get('country'),
      ),
      value,
    );
  }
  assert.equal(importCountry('unrecognized'), 'all');
  assert.deepEqual(
    importExamplesFor('canada').map(({ vehicleId }) => vehicleId),
    ['bmw-x3'],
  );
  assert.equal(
    saleEnquiryType(
      new URL(saleEnquiryHref('part-exchange'), 'https://example.test').searchParams.get(
        'saleType',
      ),
    ),
    'part-exchange',
  );
  assert.equal(saleEnquiryType('unrecognized'), 'buyout');
});

test('new enquiry context preserves car details and isolates country from sale purpose', () => {
  const values = {
    ...emptyServiceRequest(),
    make: 'BMW',
    model: 'X3',
    vin: 'wba12345678901234',
    country: 'germany',
    saleType: 'buyout',
    budget: '35000',
    mileage: '82000',
    email: 'owner@example.test',
  };
  const baseline = structuredClone(values);
  const imported = seedServiceRequest('import', values, { country: 'canada' });
  assert.deepEqual(values, baseline);
  assert.equal(imported.country, 'canada');
  assert.equal(imported.vin, 'WBA12345678901234');
  assert.equal(imported.model, 'X3');
  assert.equal(imported.budget, '35000');
  assert.equal(imported.saleType, '');
  assert.equal(imported.mileage, '');
  assert.deepEqual(
    parseServiceRequest('import', serializeServiceRequest('import', imported)),
    imported,
  );
  assert.equal(seedServiceRequest('import', imported, { country: 'all' }).country, 'canada');
  const sold = seedServiceRequest('sell', values, { saleType: 'part-exchange' });
  assert.equal(sold.saleType, 'part-exchange');
  assert.equal(sold.country, '');
  assert.equal(sold.budget, '');
  assert.equal(sold.email, 'owner@example.test');
  assert.deepEqual(parseServiceRequest('sell', serializeServiceRequest('sell', sold)), sold);
});

test('existing version-one drafts remain usable without new optional fields', () => {
  const restored = parseServiceRequest(
    'import',
    JSON.stringify({
      version: 1,
      kind: 'import',
      values: { make: 'BMW', model: 'X6', budget: '35000' },
    }),
  );
  assert.equal(restored.vin, '');
  assert.equal(restored.country, '');
  assert.equal(restored.saleType, '');
  assert.deepEqual(validateServiceRequest('import', restored, 2026), {});
});

test('optional VIN is validated on the car step without inventing decoded car details', () => {
  const values = {
    ...emptyServiceRequest(),
    vin: 'WBA12345678901234',
    make: 'BMW',
    model: 'X3',
    year: '2020',
    mileage: '0',
    budget: '35000',
  };
  for (const kind of ['import', 'sell']) {
    assert.deepEqual(validateServiceRequest(kind, values, 2026), {});
    assert.deepEqual(validateServiceRequestStep(kind, 0, { ...values, vin: '' }, 2026), {});
    const invalid = validateServiceRequest(kind, { ...values, vin: 'too-short' }, 2026);
    assert(invalid.vin);
    assert.equal(serviceRequestErrorStep(kind, invalid), 0);
    assert(validateServiceRequest(kind, { ...values, make: '' }, 2026).make);
  }
});

test('country and sale purpose reach only the matching enquiry and validate on Details', () => {
  const values = {
    ...emptyServiceRequest(),
    make: 'BMW',
    model: 'X3',
    vin: 'WBA12345678901234',
    country: 'canada',
    saleType: 'part-exchange',
    year: '2020',
    mileage: '0',
    budget: '35000',
  };
  const imported = serviceRequestMessage('import', values);
  const sold = serviceRequestMessage('sell', values);
  assert.match(imported, /Import country: Canada/);
  assert.match(imported, /VIN: WBA12345678901234/);
  assert.doesNotMatch(imported, /Sale type:/);
  assert.match(sold, /Sale type: Part exchange/);
  assert.doesNotMatch(sold, /Import country:|Maximum budget/);
  assert(
    validateServiceRequestStep('import', 1, { ...values, country: 'unrecognized' }, 2026).country,
  );
  assert(
    validateServiceRequestStep('sell', 1, { ...values, saleType: 'unrecognized' }, 2026).saleType,
  );
  assert.equal(serviceRequestErrorStep('import', { country: 'invalid' }), 1);
  assert.equal(serviceRequestErrorStep('sell', { saleType: 'invalid' }), 1);
});

test('import and sale drafts are isolated, normalized and round-trip independently', () => {
  const values = {
    ...emptyServiceRequest(),
    make: ' BMW ',
    model: ' 540i ',
    budget: '35000',
    mileage: '80000',
    price: '20000',
    name: ' Alex ',
  };
  const raw = serializeServiceRequest('import', values);
  const imported = parseServiceRequest('import', raw);
  assert.equal(imported.make, 'BMW');
  assert.equal(imported.name, 'Alex');
  assert.equal(imported.budget, '35000');
  assert.equal(imported.mileage, '');
  assert.equal(imported.price, '');
  assert.deepEqual(parseServiceRequest('sell', raw), emptyServiceRequest());
  assert.notEqual(serviceRequestStorageKey('import'), serviceRequestStorageKey('sell'));
  const sold = parseServiceRequest('sell', serializeServiceRequest('sell', values));
  assert.equal(sold.mileage, '80000');
  assert.equal(sold.budget, '');
});

test('malformed, outdated and unexpected service draft values fall back safely', () => {
  for (const raw of [null, '', '{bad', 'null', '[]', '{"version":2,"kind":"import"}']) {
    assert.deepEqual(parseServiceRequest('import', raw), emptyServiceRequest());
  }
  const input = {
    make: ['BMW'],
    model: 'x'.repeat(500),
    message: 'x'.repeat(5000),
    password: 'unexpected',
    year: 2020,
  };
  const values = normalizeServiceRequest('sell', input);
  assert.equal(values.make, '');
  assert.equal(values.year, '');
  assert.equal(values.model.length, 80);
  assert.equal(values.message.length, 2000);
  assert.equal(Object.hasOwn(values, 'password'), false);
});

test('import enquiries require car details and a positive budget and validate optional links', () => {
  const values = { ...emptyServiceRequest(), make: 'BMW', model: '540i', budget: '35000.50' };
  assert.deepEqual(validateServiceRequest('import', values, 2026), {});
  assert.ok(validateServiceRequest('import', { ...values, budget: '0' }, 2026).budget);
  assert.ok(validateServiceRequest('import', { ...values, budget: 'Infinity' }, 2026).budget);
  assert.ok(validateServiceRequest('import', { ...values, model: '' }, 2026).model);
  assert.ok(
    validateServiceRequest('import', { ...values, listing: 'javascript:alert(1)' }, 2026).listing,
  );
  assert.ok(validateServiceRequest('import', { ...values, email: 'incomplete' }, 2026).email);
  assert.deepEqual(
    validateServiceRequest(
      'import',
      { ...values, year: '2027', listing: 'https://example.test/car' },
      2026,
    ),
    {},
  );
});

test('sale enquiries validate year and whole-kilometre mileage without inventing a valuation', () => {
  const values = {
    ...emptyServiceRequest(),
    make: 'BMW',
    model: 'X3',
    year: '2020',
    mileage: '0',
    condition: 'Good',
  };
  assert.deepEqual(validateServiceRequest('sell', values, 2026), {});
  assert.ok(validateServiceRequest('sell', { ...values, year: '2028' }, 2026).year);
  assert.ok(validateServiceRequest('sell', { ...values, mileage: '-1' }, 2026).mileage);
  assert.ok(validateServiceRequest('sell', { ...values, mileage: '120.5' }, 2026).mileage);
  assert.ok(
    validateServiceRequest('sell', { ...values, condition: 'unrecognized' }, 2026).condition,
  );
  assert.equal(validateServiceRequest('sell', values, 2026).price, undefined);
});

test('service request summaries preserve the matching enquiry and omit unrelated fields', () => {
  const values = {
    ...emptyServiceRequest(),
    make: 'BMW',
    model: '540i',
    budget: '35000',
    mileage: '80000',
    price: '22000',
    message: 'Please discuss the options.',
  };
  const imported = serviceRequestMessage('import', values);
  assert.match(imported, /^Car import enquiry/);
  assert.match(imported, /Maximum budget \(EUR\): 35000/);
  assert.doesNotMatch(imported, /Mileage|Expected price/);
  const sold = serviceRequestMessage('sell', values);
  assert.match(sold, /^Car sale \/ buyout enquiry/);
  assert.match(sold, /Mileage \(km\): 80000/);
  assert.doesNotMatch(sold, /Maximum budget/);
});

test('car steps do not require fields from later steps and sale year belongs to the car', () => {
  const empty = emptyServiceRequest();
  assert.deepEqual(Object.keys(validateServiceRequestStep('import', 0, empty, 2026)), [
    'make',
    'model',
  ]);
  assert.deepEqual(Object.keys(validateServiceRequestStep('sell', 0, empty, 2026)), [
    'make',
    'model',
    'year',
  ]);
  const car = { ...empty, make: 'BMW', model: 'X3', email: 'not an email' };
  assert.deepEqual(validateServiceRequestStep('import', 0, car, 2026), {});
  assert.deepEqual(validateServiceRequestStep('sell', 0, { ...car, year: '2020' }, 2026), {});
});

test('detail steps validate the correct kind without trapping users on earlier or optional contact fields', () => {
  const values = { ...emptyServiceRequest(), budget: '35000', mileage: '82000', email: 'invalid' };
  assert.deepEqual(validateServiceRequestStep('import', 1, values, 2026), {});
  assert.deepEqual(validateServiceRequestStep('sell', 1, values, 2026), {});
  assert.ok(validateServiceRequestStep('import', 1, { ...values, budget: '0' }, 2026).budget);
  assert.ok(validateServiceRequestStep('import', 1, { ...values, year: '2028' }, 2026).year);
  assert.ok(
    validateServiceRequestStep('import', 1, { ...values, listing: 'file:///car' }, 2026).listing,
  );
  assert.ok(validateServiceRequestStep('sell', 1, { ...values, mileage: '-1' }, 2026).mileage);
  assert.ok(validateServiceRequestStep('sell', 1, { ...values, price: '-5' }, 2026).price);
  assert.deepEqual(validateServiceRequestStep('import', 2, values, 2026), {
    email: 'Enter a valid email address.',
  });
});

test('final validation returns users to the earliest invalid step for the matching kind', () => {
  assert.equal(
    serviceRequestErrorStep('import', { email: 'invalid', budget: 'missing', make: 'missing' }),
    0,
  );
  assert.equal(serviceRequestErrorStep('import', { year: 'invalid', email: 'invalid' }), 1);
  assert.equal(serviceRequestErrorStep('sell', { year: 'invalid', mileage: 'missing' }), 0);
  assert.equal(serviceRequestErrorStep('sell', { mileage: 'missing', email: 'invalid' }), 1);
  assert.equal(serviceRequestErrorStep('sell', { email: 'invalid' }), 2);
  assert.equal(serviceRequestErrorStep('import', {}), 0);
  const unfinished = {
    ...emptyServiceRequest(),
    make: 'Toyota',
    model: 'Corolla',
    email: 'invalid',
  };
  assert.ok(validateServiceRequest('sell', unfinished, 2026).year);
  assert.ok(validateServiceRequest('sell', unfinished, 2026).mileage);
});

test('unfinished drafts can be restored without being treated as completed enquiries', () => {
  const incomplete = { ...emptyServiceRequest(), make: 'Toyota', model: 'Corolla' };
  const restored = parseServiceRequest('sell', serializeServiceRequest('sell', incomplete));
  assert.deepEqual(restored, incomplete);
  assert.ok(validateServiceRequest('sell', restored, 2026).year);
  assert.ok(validateServiceRequest('sell', restored, 2026).mileage);
  assert.deepEqual(
    parseServiceRequest('import', serializeServiceRequest('sell', incomplete)),
    emptyServiceRequest(),
  );
});
