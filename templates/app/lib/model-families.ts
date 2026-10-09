import type {Filters} from './inventory-filters';

type FamilyDefinition = {name: string; match?: RegExp; aliases?: readonly string[]};
export type StockModel = {make: string; model: string; key: string; count: number};
export type ModelFamily = {make: string; name: string; count: number; models: StockModel[]; visibleModels?: StockModel[]};
export type ModelFamilyGroup = {make: string; count: number; families: ModelFamily[]};

const normalize = (value: string) => value.toLowerCase().replace(/[^a-z0-9]+/g, '');
const named = (...names: string[]): FamilyDefinition[] => names.map(name => ({name}));
const series = (number: number): FamilyDefinition => ({
  name: `${number} Series`,
  match: new RegExp(`^(?:${number}series|m?${number}\\d{2}${number === 1 ? '' : `|m${number}(?:$|[a-z])`})`),
  aliases: number === 1 ? [] : [`M${number}`],
});

// Curated family names, including used-car families. Unknown stock is always kept.
// This is an orientation catalog, not a claim of a manufacturer's complete range.
const catalog: Record<string, FamilyDefinition[]> = {
  BMW: [...[1, 2, 3, 4, 5, 6, 7, 8].map(series), ...named('X1', 'X2', 'X3', 'X4', 'X5', 'X6', 'X7', 'i3', 'i4', 'i5', 'i7', 'iX', 'Z4')],
  Nissan: named('Altima', 'Juke', 'Kicks', 'Leaf', 'Magnite', 'Patrol', 'Pathfinder', 'Qashqai', 'X-Trail', 'X-Terra', 'Z', 'Urvan'),
  'Mercedes-Benz': [
    ...['A', 'B', 'C', 'E', 'S', 'G', 'V'].map(letter => ({name: `${letter}-Class`, match: new RegExp(`^${letter.toLowerCase()}(?:class|\\d)`) })),
    ...named('CLA', 'CLE', 'GLA', 'GLB', 'GLC', 'GLE', 'GLS', 'EQA', 'EQB', 'EQE', 'EQS', 'SL', 'AMG GT'),
  ],
  Audi: [...[1, 3, 4, 5, 6, 7, 8].map(number => ({name: `A${number}`, match: new RegExp(`^(?:a|s|rs)${number}(?:$|[a-z])`), aliases: [`S${number}`, `RS${number}`]})), ...[2, 3, 4, 5, 6, 7, 8].map(number => ({name: `Q${number}`, match: new RegExp(`^(?:q|sq|rsq)${number}(?:$|[a-z])`)})), ...named('TT', 'R8', 'e-tron', 'e-tron GT')],
  Lexus: named('LBX', 'UX', 'NX', 'RZ', 'RX', 'ES', 'GX', 'LM', 'LX', 'IS', 'LS', 'RC'),
  'Land Rover': named('Defender', 'Discovery', 'Discovery Sport', 'Range Rover', 'Range Rover Sport', 'Range Rover Evoque', 'Range Rover Velar'),
  Toyota: named('Corolla', 'Fortuner', 'Land Cruiser', 'Veloz', 'Yaris'),
  Ford: named('Taurus', 'Territory'),
  Haval: named('H6'),
  Hyundai: named('Creta'),
  JAC: named('J7', 'S3'),
  Jeep: named('Grand Cherokee'),
  Kia: named('K8', 'Seltos'),
  Mazda: named('6'),
  MG: named('5', 'ZS'),
  Mitsubishi: named('ASX', 'Attrage', 'Outlander', 'Pajero', 'Xpander'),
  Suzuki: named('Baleno', 'Ciaz', 'Dzire', 'Grand Vitara'),
  Volkswagen: named('T-Roc'),
  Volvo: named('XC40'),
};
const definitions = new Map(Object.entries(catalog).map(([make, families]) => [normalize(make), families]));

function modelName(make: string, model: string) {
  const value = normalize(model), prefix = normalize(make);
  return value.startsWith(prefix) ? value.slice(prefix.length) : value;
}
function definitionFor(make: string, model: string) {
  const value = modelName(make, model);
  // Longest name first keeps Discovery Sport and Range Rover Sport separate.
  return definitions.get(normalize(make))?.slice().sort((a, b) => b.name.length - a.name.length)
    .find(family => family.match ? family.match.test(value) : value.startsWith(normalize(family.name)));
}

export function buildModelFamilyGroups(inventory: readonly {make: string; model: string}[], makes: readonly string[] = []): ModelFamilyGroup[] {
  const groups = new Map<string, ModelFamilyGroup>();
  const scope = new Set(makes.map(normalize));
  for (const vehicle of inventory) {
    const makeKey = normalize(vehicle.make);
    if (scope.size && !scope.has(makeKey)) continue;
    let group = groups.get(makeKey);
    if (!group) {
      group = {make: vehicle.make, count: 0, families: (definitions.get(makeKey) ?? []).map(family => ({make: vehicle.make, name: family.name, count: 0, models: []}))};
      groups.set(makeKey, group);
    }
    const familyName = definitionFor(vehicle.make, vehicle.model)?.name ?? vehicle.model;
    let family = group.families.find(item => normalize(item.name) === normalize(familyName));
    if (!family) {
      family = {make: group.make, name: familyName, count: 0, models: []};
      group.families.push(family);
    }
    let model = family.models.find(item => item.model.toLowerCase() === vehicle.model.toLowerCase());
    if (!model) {
      model = {make: group.make, model: vehicle.model, key: `${group.make}::${vehicle.model}`, count: 0};
      family.models.push(model);
    }
    model.count++; family.count++; group.count++;
  }
  // Retain prepared families even if a selected make has sold its final car.
  for (const make of makes) {
    if (groups.has(normalize(make))) continue;
    groups.set(normalize(make), {make, count: 0, families: (definitions.get(normalize(make)) ?? []).map(family => ({make, name: family.name, count: 0, models: []}))});
  }
  for (const group of groups.values()) for (const family of group.families) family.models.sort((a, b) => a.model.localeCompare(b.model));
  return [...groups.values()].sort((a, b) => a.make.localeCompare(b.make));
}

export function searchModelFamilyGroups(groups: readonly ModelFamilyGroup[], query: string, showEmpty: boolean): ModelFamilyGroup[] {
  const term = normalize(query);
  return groups.map(group => ({...group, families: group.families.flatMap(family => {
    if (!term) return family.count || showEmpty ? [family] : [];
    const definition = definitions.get(normalize(group.make))?.find(item => item.name === family.name);
    const familyMatch = normalize(`${group.make} ${family.name}`).includes(term);
    if (familyMatch) return [family];
    const models = family.models.filter(model => normalize(`${model.make} ${model.model}`).includes(term));
    if (models.length) return [{...family, visibleModels: models}];
    const emptyFamilyMatch = !family.count && (definitionFor(group.make, query)?.name === family.name
      || definition?.aliases?.some(alias => normalize(alias).includes(term)));
    return emptyFamilyMatch ? [family] : [];
  })})).filter(group => group.families.length);
}

export const isStockModelSelected = (models: readonly string[], key: string) => models.some(value => value.toLowerCase() === key.toLowerCase());

/** Families expand to existing model keys, preserving URL/history compatibility. */
export function toggleStockModels(filters: Filters, make: string, keys: readonly string[]): Filters {
  if (!keys.length) return filters;
  const targets = new Set(keys.map(key => key.toLowerCase()));
  const remove = keys.every(key => isStockModelSelected(filters.models, key));
  const models = remove ? filters.models.filter(key => !targets.has(key.toLowerCase()))
    : [...filters.models, ...keys.filter(key => !isStockModelSelected(filters.models, key))];
  const brands = filters.brands.filter(brand => normalize(brand) !== normalize(make));
  // Clearing the final refinement restores its make rather than all showroom stock.
  if (remove && !models.some(key => normalize(key.split('::')[0]) === normalize(make))) brands.push(make);
  return {...filters, brands, models};
}
