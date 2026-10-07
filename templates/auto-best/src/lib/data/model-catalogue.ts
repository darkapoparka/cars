import { modelCatalogueData, type CatalogueFamily } from './model-catalogue-data';

type ModelRecord = { make: string; title: string };
export type ModelChoice = { value: string; label: string; count: number };
export type ModelFamily = { name: string; choices: ModelChoice[]; count: number };
export type ModelMake = { make: string; families: ModelFamily[]; count: number };
const key = (value: string) => value.normalize('NFKD').replace(/\p{M}/gu, '').toLowerCase().replace(/[^a-z0-9+]/g, '');
const makeNames = Object.keys(modelCatalogueData);
const canonicalMake = (make: string) => makeNames.find(name => key(name) === key(make)) ?? make;

/** Preserve the source tree, with familiar numbered BMW and Audi families first. */
function buildCatalogueFamilies(make: string): readonly CatalogueFamily[] {
  const merged = new Map<string, CatalogueFamily>();
  for (const group of modelCatalogueData[canonicalMake(make)] ?? []) {
    const previous = merged.get(group.name);
    merged.set(group.name, { name: group.name, children: [...new Set(previous
      ? [...(previous.children.length ? previous.children : [previous.name]), ...(group.children.length ? group.children : [group.name])]
      : group.children)] });
  }
  const source = [...merged.values()];
  if (key(make) === 'bmw') {
    const numbered = source.filter(group => /^\d Series$/.test(group.name));
    const eight = source.filter(group => /^(840|850)$/.test(group.name));
    const electric = source.filter(group => /^i(?:\d|X)/.test(group.name));
    const special = ['X Series', 'M Models', 'Z Series'].flatMap(name => source.filter(group => group.name === name));
    const used = new Set([...numbered, ...eight, ...electric, ...special]);
    return [...numbered, ...(eight.length ? [{ name: '8 Series', children: eight.map(group => group.name) }] : []),
      ...special.slice(0, 2), ...(electric.length ? [{ name: 'i Models', children: electric.map(group => group.name) }] : []),
      ...special.slice(2), ...source.filter(group => !used.has(group))];
  }
  if (key(make) === 'audi') {
    const grouped = new Set<CatalogueFamily>();
    const families = source.filter(group => /^[AQ]\d$/.test(group.name)).map(group => {
      const number = group.name.slice(1);
      const expression = group.name.startsWith('A') ? new RegExp(`^(?:A|S|RS)${number}(?: |$)`)
        : new RegExp(`^(?:Q|SQ|RSQ)${number}(?: |$)`);
      const siblings = source.filter(item => expression.test(item.name));
      siblings.forEach(item => grouped.add(item));
      return { name: group.name, children: siblings.map(item => item.name) };
    });
    return [...families, ...source.filter(group => !grouped.has(group)).map(group => ({ ...group, name: group.name.replace(' (alle)', '') }))];
  }
  // Keep named model lines together where the source lists their body/powertrain variants separately.
  const used = new Set<CatalogueFamily>();
  const families = source.flatMap(group => {
    if (used.has(group)) return [];
    used.add(group);
    const variants = group.children.length ? [] : source.filter(other => !used.has(other) && !other.children.length && other.name.startsWith(group.name + ' '));
    variants.forEach(other => used.add(other));
    return [{ ...group, children: variants.length ? [group.name, ...variants.map(other => other.name)] : group.children }];
  });
  return key(make) === 'mercedesbenz' ? [...families.filter(group => group.children.length), ...families.filter(group => !group.children.length)] : families;
}

const familyCache = new Map<string, readonly CatalogueFamily[]>();
export function catalogueFamilies(make: string): readonly CatalogueFamily[] {
  const makeKey = key(make);
  let families = familyCache.get(makeKey);
  if (!families) { families = buildCatalogueFamilies(make); familyCache.set(makeKey, families); }
  return families;
}

const catalogue = new Map<string, { make: string; label: string }>();
for (const make of makeNames) for (const family of catalogueFamilies(make)) {
  for (const label of family.children.length ? family.children : [family.name]) {
    catalogue.set(key(`${make} ${label}`), { make, label });
  }
}

/** Readable brand-prefixed values disambiguate models shared by several makes. */
export function catalogueModel(value: string) { return catalogue.get(key(value)); }

function modelTitle(vehicle: ModelRecord): string {
  const title = key(vehicle.title), make = key(vehicle.make);
  if (title.startsWith(make)) return title.slice(make.length);
  if (make === 'mercedesbenz' && title.startsWith('mercedesamg')) return title.slice('mercedesamg'.length);
  return title;
}

function matchesLabel(vehicle: ModelRecord, label: string): boolean {
  const title = modelTitle(vehicle), model = key(label);
  if (!model || !title.startsWith(model)) return false;
  // An M Sport trim is not the dedicated X3/X4/X5/X6 M performance model.
  if (key(vehicle.make) === 'bmw' && /^X[3-6] M$/.test(label) && title.startsWith(model + 'sport')) return false;
  // 118 includes 118d; it must never include a different numeric model such as 1180.
  return !/\d$/.test(model) || !/^\d/.test(title.slice(model.length));
}

export function catalogueModelMatches(vehicle: ModelRecord, value: string): boolean | undefined {
  const model = catalogueModel(value);
  return model ? key(vehicle.make) === key(model.make) && matchesLabel(vehicle, model.label) : undefined;
}

function matchesFamily(vehicle: ModelRecord, family: CatalogueFamily): boolean {
  return (family.children.length ? family.children : [family.name]).some(label => matchesLabel(vehicle, label))
    || /-Class$/.test(family.name) && matchesLabel(vehicle, family.name.replace(/-Class$/, ''))
      && !catalogueFamilies(vehicle.make).some(other => /-Class$/.test(other.name) && other.name !== family.name
        && other.name.length > family.name.length && matchesLabel(vehicle, other.name.replace(/-Class$/, '')));
}

/** Availability comes exclusively from the supplied dealer records, including new/uncatalogued models. */
export function modelMakes(records: readonly ModelRecord[], makes: readonly string[], selected: readonly string[], availableMakes: readonly string[]): ModelMake[] {
  const names = makes.length ? makes.map(canonicalMake) : [...new Set([...records.map(vehicle => vehicle.make), ...availableMakes, ...selected.map(value => catalogueModel(value)?.make).filter((make): make is string => Boolean(make))])];
  return names.map(make => {
    const stock = records.filter(vehicle => key(vehicle.make) === key(make));
    const families = catalogueFamilies(make).map(family => {
      const members = stock.filter(vehicle => matchesFamily(vehicle, family));
      const choices = (family.children.length ? family.children : [family.name]).map(label => ({
        value: `${make} ${label}`, label, count: stock.filter(vehicle => matchesLabel(vehicle, label)).length
      }));
      // Retain existing exact model URLs and dealer trim names under their model family.
      for (const vehicle of members) {
        const value = vehicle.title.replace(`${vehicle.make} `, '');
        const exact = choices.find(choice => key(choice.label) === key(value));
        if (exact) exact.value = value;
        else if (!choices.some(choice => choice.value === value)) choices.push({ value, label: value, count: stock.filter(item => item.title === vehicle.title).length });
      }
      return { name: family.name, choices, count: members.length };
    });
    const known = new Set(families.flatMap(family => family.choices.map(choice => key(choice.value))));
    const additional = [...new Set([...stock.map(vehicle => vehicle.title.replace(`${vehicle.make} `, '')), ...selected.filter(value => {
      const owner = catalogueModel(value)?.make;
      return owner ? key(owner) === key(make) : stock.some(vehicle => key(vehicle.title).includes(key(value))) || names.length === 1;
    })])];
    for (const value of additional) if (!known.has(key(value))) {
      const label = catalogueModel(value)?.label ?? value;
      const existing = families.flatMap(family => family.choices).find(choice => key(choice.label) === key(label));
      const count = stock.filter(vehicle => vehicle.title.toLowerCase().includes(value.trim().toLowerCase())).length;
      if (existing) { existing.value = value; existing.count = count; known.add(key(value)); continue; }
      families.push({ name: label, choices: [{ value, label, count }], count });
    }
    return { make, families, count: stock.length };
  });
}
