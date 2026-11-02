import assert from 'node:assert/strict';
import {test} from 'node:test';
import {appTabForPath, appTabs} from '../lib/app-navigation.ts';
import {vehicleCardModel} from '../lib/vehicle-card-label.ts';

test('every offered destination selects its own tab', () => {
  assert.equal(appTabs.length, 5);
  for (const tab of appTabs) assert.equal(appTabForPath(tab.href), tab.id);
});

test('nested journeys retain their parent tab', () => {
  assert.equal(appTabForPath('/?from=app'), 'home');
  for (const path of ['/cars/a-car', '/search?q=BMW']) assert.equal(appTabForPath(path), 'cars');
  for (const path of ['/sell', '/sell/details', '/finance', '/service/details', '/services/import']) assert.equal(appTabForPath(path), 'services');
  for (const path of ['/stores', '/stores#directions', '/more']) assert.equal(appTabForPath(path), 'contact');
});

test('a similarly named or unknown route does not activate a tab', () => {
  for (const path of ['/cars-other', '/services-old', '/unavailable']) assert.equal(appTabForPath(path), null);
});

test('compact labels keep the model before repeated identity and import notes', () => {
  assert.equal(vehicleCardModel('BMW', 'X6 BMW X6 M50i LASER 360'), 'X6');
  assert.equal(vehicleCardModel('Mercedes-Benz', 'GLA 45 AMG Очакван внос AMG EDITION'), 'GLA 45 AMG');
  assert.equal(vehicleCardModel('Mercedes-Benz', 'S 63 AMG Mercedes S63 E-PERFORMANCE'), 'S 63 AMG');
  assert.equal(vehicleCardModel('Land Rover', 'Range Rover Sport'), 'Range Rover Sport');
});
