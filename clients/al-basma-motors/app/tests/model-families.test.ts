import assert from 'node:assert/strict';
import {describe, it} from 'node:test';
import {emptyFilters, matchesInventory} from '../lib/inventory-filters';
import {vehicles} from '../lib/data';
import {buildModelFamilyGroups, searchModelFamilyGroups, toggleStockModels} from '../lib/model-families';

const stock = [
  {make: 'BMW', model: 'M3'}, {make: 'BMW', model: 'M3'},
  {make: 'BMW', model: '320d'}, {make: 'BMW', model: '430I'},
  {make: 'BMW', model: 'X3'}, {make: 'Nissan', model: 'PATROL'},
];

describe('desktop model families', () => {
  it('groups BMW variants into numbered families and counts cars rather than model names', () => {
    const [bmw] = buildModelFamilyGroups(stock, ['bmw']);
    const three = bmw.families.find(family => family.name === '3 Series')!;
    assert.equal(bmw.count, 5);
    assert.equal(three.count, 3);
    assert.deepEqual(three.models.map(model => [model.model, model.count]), [['320d', 1], ['M3', 2]]);
    assert.equal(bmw.families.find(family => family.name === '4 Series')?.count, 1);
    assert.equal(bmw.families.find(family => family.name === 'X3')?.count, 1);
  });
  it('keeps familiar empty families without creating unavailable model choices', () => {
    const [bmw] = buildModelFamilyGroups(stock, ['BMW']);
    const empty = bmw.families.find(family => family.name === '1 Series')!;
    assert.equal(empty.count, 0);
    assert.deepEqual(empty.models, []);
    assert.ok(searchModelFamilyGroups([bmw], '', true)[0].families.includes(empty));
    assert.ok(searchModelFamilyGroups([bmw], '', false)[0].families.every(family => family.count > 0));
    const [soldOut] = buildModelFamilyGroups([], ['Nissan']);
    assert.equal(soldOut.count, 0);
    assert.ok(soldOut.families.some(family => family.name === 'Patrol'));
  });
  it('finds M3 and family names across makes and keeps family selection complete during search', () => {
    const groups = buildModelFamilyGroups(stock);
    const m3 = searchModelFamilyGroups(groups, 'BMW M3', false);
    assert.equal(m3.length, 1);
    assert.equal(m3[0].families[0].name, '3 Series');
    assert.equal(m3[0].families[0].models.length, 2);
    assert.equal(searchModelFamilyGroups(groups, '4 series', false)[0].families[0].models[0].model, '430I');
    assert.deepEqual(m3[0].families[0].visibleModels?.map(model => model.model), ['M3']);
    assert.deepEqual(searchModelFamilyGroups(groups, 'm4', false), []);
    assert.equal(searchModelFamilyGroups(groups, 'm2', false)[0].families[0].count, 0);
    assert.deepEqual(searchModelFamilyGroups(groups, 'unlisted query', true), []);
  });
  it('normalizes spacing and case, separates named subfamilies, and retains unknown stock', () => {
    const groups = buildModelFamilyGroups([
      {make: 'Mercedes-Benz', model: 'C 200'}, {make: 'Audi', model: 'RS5 Sportback'},
      {make: 'Lexus', model: 'RX350'}, {make: 'Land Rover', model: 'Discovery Sport'},
      {make: 'Land Rover', model: 'Discovery'}, {make: 'New Make', model: 'Unlisted Model'},
    ]);
    assert.equal(groups.find(group => group.make === 'Mercedes-Benz')?.families.find(family => family.count)?.name, 'C-Class');
    assert.equal(groups.find(group => group.make === 'Audi')?.families.find(family => family.count)?.name, 'A5');
    assert.equal(groups.find(group => group.make === 'Lexus')?.families.find(family => family.count)?.name, 'RX');
    const rover = groups.find(group => group.make === 'Land Rover')!;
    assert.equal(rover.families.find(family => family.name === 'Discovery Sport')?.count, 1);
    assert.equal(rover.families.find(family => family.name === 'Discovery')?.count, 1);
    assert.equal(groups.find(group => group.make === 'New Make')?.families[0].name, 'Unlisted Model');
    assert.equal(searchModelFamilyGroups(groups, 'c200', false)[0].make, 'Mercedes-Benz');
  });
  it('keeps Audi model searches from showing unrelated Mercedes classes', () => {
    const groups = buildModelFamilyGroups([
      {make: 'Audi', model: 'A5 Sportback'}, {make: 'Mercedes-Benz', model: 'C 200'},
    ]);
    for (const query of ['A5', 'S3']) {
      assert.deepEqual(searchModelFamilyGroups(groups, query, false).map(group => group.make), ['Audi']);
    }
    assert.equal(searchModelFamilyGroups(groups, 'A5', false)[0].families[0].count, 1);
  });
  it('recognizes both two-digit AMG and three-digit Mercedes model names', () => {
    const [mercedes] = buildModelFamilyGroups([
      {make: 'Mercedes-Benz', model: 'A 35 AMG'}, {make: 'Mercedes-Benz', model: 'C 63 AMG'},
      {make: 'Mercedes-Benz', model: 'C 200'}, {make: 'Mercedes-Benz', model: 'E 53 AMG'},
      {make: 'Mercedes-Benz', model: 'S 500'},
    ]);
    assert.deepEqual(mercedes.families.filter(family => family.count).map(family => [family.name, family.count]), [
      ['A-Class', 1], ['C-Class', 2], ['E-Class', 1], ['S-Class', 1],
    ]);
    assert.equal(searchModelFamilyGroups([mercedes], 'C200', false)[0].families[0].name, 'C-Class');
  });
  it('selects every stocked model in a family without losing other makes or refinements', () => {
    const filters = {...emptyFilters(), brands: ['BMW', 'Nissan'], fuel: ['Petrol'], models: ['Audi::A5']};
    const selected = toggleStockModels(filters, 'BMW', ['BMW::320d', 'BMW::M3']);
    assert.deepEqual(selected.brands, ['Nissan']);
    assert.deepEqual(selected.models, ['Audi::A5', 'BMW::320d', 'BMW::M3']);
    assert.deepEqual(selected.fuel, ['Petrol']);
    const partial = toggleStockModels(selected, 'BMW', ['BMW::M3']);
    assert.deepEqual(partial.models, ['Audi::A5', 'BMW::320d']);
    assert.deepEqual(toggleStockModels(partial, 'BMW', ['BMW::320d', 'BMW::M3']).models, selected.models);
  });
  it('restores the make when its last model is cleared and ignores empty families', () => {
    const filters = {...emptyFilters(), models: ['bmw::m3', 'Nissan::PATROL']};
    const cleared = toggleStockModels(filters, 'BMW', ['BMW::M3']);
    assert.deepEqual(cleared.brands, ['BMW']);
    assert.deepEqual(cleared.models, ['Nissan::PATROL']);
    assert.equal(toggleStockModels(filters, 'BMW', []), filters);
  });
  it('accounts for every current car exactly once and filters real stock using existing model keys', () => {
    const groups = buildModelFamilyGroups(vehicles);
    assert.equal(groups.reduce((count, group) => count + group.count, 0), vehicles.length);
    assert.equal(groups.flatMap(group => group.families).reduce((count, family) => count + family.count, 0), vehicles.length);
    for (const group of groups) for (const family of group.families.filter(family => family.count)) {
      const selected = toggleStockModels(emptyFilters(), group.make, family.models.map(model => model.key));
      assert.equal(vehicles.filter(vehicle => matchesInventory(vehicle, selected, '')).length, family.count);
    }
  });
});
