import test from 'node:test';
import assert from 'node:assert/strict';
import { translate, validLocale, defaultLocale, localeMoney } from '../.qa/domain/locale.mjs';
import { capturedVehicles as vehicles } from '../.qa/domain/catalog.mjs';
import { defaultFilters } from '../.qa/domain/types.mjs';
import { localizeVehicle } from '../.qa/domain/vehicle-copy.mjs';
import { filterVehicles } from '../.qa/domain/search.mjs';
import { showroomServices, searchShowroomServices } from '../.qa/domain/showroom-services.mjs';
import { emptyServiceRequest, serviceRequestMessage } from '../.qa/domain/service-requests.mjs';

test('Bulgarian is the default; only Bulgarian and English are selectable', () => {
  assert.equal(defaultLocale, 'bg');
  assert.ok(validLocale('bg') && validLocale('en'));
  for (const value of ['de', null, '', {}, 'BG']) assert.equal(validLocale(value), false);
  assert.equal(translate('Search make or model', 'bg'), 'Марка или модел');
  assert.equal(translate('Search make or model', 'en'), 'Search make or model');
  assert.equal(translate('BMW', 'bg'), 'BMW');
  assert.match(localeMoney(73937, 'bg'), /73\s937\s€/);
});

test('localized display copy removes German ads without modifying captured facts or filters', () => {
  const original = structuredClone(vehicles);
  for (const locale of ['bg', 'en']) {
    for (const vehicle of vehicles) {
      const display = localizeVehicle(vehicle, locale);
      assert.doesNotMatch(
        display.variant + display.attributes.description,
        /Aktionsmodell|Anzahlung|Sitz|Ausstattungen|Finanzierungs/,
      );
      for (const field of ['id', 'price', 'year', 'mileage', 'power', 'fuel', 'transmission'])
        assert.equal(display[field], vehicle[field]);
      assert.ok(display.images.length > 0);
      assert.ok(display.images.every((src) => vehicle.images.includes(src)));
      assert.ok(
        !display.images.some((src) =>
          /x6-gallery-0[1345]|bmw-540-gallery-0[48]|bmw-x3-gallery-0[15]/.test(src),
        ),
      );
      assert.deepEqual(display.features, vehicle.features);
      assert.match(display.attributes.description, new RegExp(vehicle.make));
    }
  }
  assert.deepEqual(vehicles, original);
});

test('dealer copy and photos survive localization even when a captured ID is reused', () => {
  const vehicle = {
    ...structuredClone(vehicles[0]),
    sample: false,
    variant: 'Dealer supplied trim',
    images: ['/images/x6-gallery-01.webp', '/dealer/interior.webp'],
    attributes: { description: 'Dealer-written service history and condition.' },
  };
  for (const locale of ['bg', 'en']) {
    const display = localizeVehicle(vehicle, locale);
    assert.equal(display.variant, vehicle.variant);
    assert.equal(display.attributes.description, vehicle.attributes.description);
    assert.deepEqual(display.images, vehicle.images);
  }
});

test('Bulgarian and English searches find the same showroom services', () => {
  for (const [bulgarian, english] of [
    ['внос', 'import'],
    ['части', 'parts'],
    ['оглед', 'viewing'],
    ['Германия', 'Germany'],
  ]) {
    const ids = (query) =>
      searchShowroomServices(showroomServices, query).map((service) => service.id);
    assert.deepEqual(ids(bulgarian), ids(english));
    assert.ok(ids(bulgarian).length > 0);
  }
});

test('translated vehicle search retains canonical fuel filter values', () => {
  const input = { ...structuredClone(defaultFilters), query: 'Дизел', fuel: ['Diesel'] };
  const matches = filterVehicles(vehicles, input);
  assert.equal(matches.length, 3);
  assert.ok(matches.every((vehicle) => vehicle.fuel === 'Diesel'));
  assert.deepEqual(input.fuel, ['Diesel']);
  assert.equal(
    filterVehicles(vehicles, { ...structuredClone(defaultFilters), query: 'Автоматик' }).length,
    4,
  );
});

test('service search finds the short mobile labels in both locales', () => {
  for (const query of ['Car search', 'Търсене на кола']) {
    assert.deepEqual(
      searchShowroomServices(showroomServices, query).map(({ id }) => id),
      ['sourcing'],
    );
  }
});

test('Bulgarian service drafts translate labels but preserve user text', () => {
  const values = {
    ...emptyServiceRequest(),
    make: 'BMW',
    model: 'X6',
    country: 'germany',
    budget: '50000',
    message: 'Please retain my own wording.',
  };
  const message = serviceRequestMessage('import', values, 'bg');
  assert.match(message, /Запитване за внос на автомобил/);
  assert.match(message, /Държава за внос: Германия/);
  assert.match(message, /Марка: BMW/);
  assert.match(message, /Please retain my own wording\./);
  assert.equal(values.country, 'germany');
});
