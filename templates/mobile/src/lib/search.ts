import type { Filters, Vehicle } from './types';
import { modelGroupsFor } from './native-taxonomy';
import { defaultFilters } from './types';
import { normalizeFilters } from './filters';
import { translate } from './locale';
export { normalizeFilters } from './filters';
function matchesModel(vehicle: Vehicle, model: string): boolean {
  const literal = (name: string) =>
    vehicle.model.toLowerCase() === name.toLowerCase() ||
    vehicle.variant.toLowerCase().split(/\s+/).includes(name.toLowerCase());
  if (model.startsWith('@model:')) return literal(model.slice(7));
  const group = modelGroupsFor(vehicle.make).find(
    (item) => item.name === model && item.children.length > 0,
  );
  if (group) return group.children.some(literal);
  const series = model.match(/^(\d) series$/i);
  if (series) return vehicle.model.startsWith(series[1]) && /^\d/.test(vehicle.model);
  return literal(model);
}
function matchesMakeCriteria(vehicle: Vehicle, filters: Filters, excluded: boolean): boolean {
  const models = excluded
    ? filters.excludedModels[vehicle.make] || []
    : Object.keys(filters.makeModels).length
      ? filters.makeModels[vehicle.make] || []
      : filters.models;
  const generic =
    (excluded ? filters.excludedMakeVariants : filters.makeVariants)[vehicle.make] || '';
  const variants =
    (excluded ? filters.excludedModelVariants : filters.modelVariants)[vehicle.make] || {};
  const matchesVariant = (variant: string) =>
    variant
      .toLowerCase()
      .split(/\s+/)
      .filter(Boolean)
      .every((term) =>
        (filters.category === 'car' ? vehicle.variant : vehicle.model + ' ' + vehicle.variant)
          .toLowerCase()
          .includes(term),
      );
  if (excluded && !models.length && !generic) return false;
  return models.length
    ? models.some(
        (model) => matchesModel(vehicle, model) && matchesVariant(variants[model] ?? generic),
      )
    : matchesVariant(generic);
}
function canonical(value: string): string {
  const key = value.toLowerCase().trim();
  const aliases: Record<string, string> = {
    'manual gearbox': 'manual',
    'estate car': 'estate',
    'off-road vehicle/pickup truck/suv': 'suv',
    'convertible/roadster': 'convertible',
    'sports car/coupe': 'coupe',
    'van/minibus': 'van',
    camera: 'rear view camera',
    'automatic climatisation, 4 zones': 'automatic air conditioning, 4 zones',
    'automatic climatisation, 3 zones': 'automatic air conditioning, 3 zones',
    'automatic climatisation, 2 zones': 'automatic air conditioning, 2 zones',
  };
  return Object.hasOwn(aliases, key) ? aliases[key] : key;
}
function hasFeature(vehicle: Vehicle, feature: string): boolean {
  return vehicle.features.some((value) => canonical(value) === canonical(feature));
}
function matchesDetails(v: Vehicle, selections: string[]): boolean {
  const groups = new Map<string, string[]>();
  for (const token of selections) {
    const cut = token.indexOf('=');
    if (cut < 0) continue;
    const key = token.slice(0, cut);
    groups.set(key, [...(groups.get(key) || []), token.slice(cut + 1)]);
  }
  const featureGroups = new Set([
    'interior',
    'security',
    'other',
    'controls',
    'extras',
    'headlightExtras',
    'wheels',
    'parking',
    'seatFeatures',
    'maintenance',
  ]);
  return [...groups].every(([key, values]) => {
    const base = key.replace(/(?:From|To)$/, '');
    const suppliedAttribute =
      base === 'rating'
        ? String(v.rating)
        : v.attributes && Object.hasOwn(v.attributes, base)
          ? v.attributes[base]
          : undefined;
    const attr = typeof suppliedAttribute === 'string' ? suppliedAttribute : undefined;
    if (key === 'description')
      return values.every((x) =>
        (v.make + ' ' + v.model + ' ' + v.variant + ' ' + v.features.join(' '))
          .toLowerCase()
          .includes(x.toLowerCase()),
      );
    if (key.endsWith('From')) return attr !== undefined && Number(attr) >= Number(values[0]);
    if (key.endsWith('To')) return attr !== undefined && Number(attr) <= Number(values[0]);
    const match = (value: string) =>
      (attr || '').split('|').some((x) => canonical(x) === canonical(value)) ||
      hasFeature(v, value);
    return featureGroups.has(key) ? values.every(match) : values.some(match);
  });
}
export function filterVehicles(vehicles: Vehicle[], input: Filters): Vehicle[] {
  const f = normalizeFilters(input);
  const terms = f.query.toLowerCase().split(/\s+/).filter(Boolean);
  return vehicles.filter((v) => {
    const text =
      `${v.make} ${v.model} ${v.variant} ${v.fuel} ${v.body} ${translate(v.fuel, 'bg')} ${translate(v.body, 'bg')} ${translate(v.transmission, 'bg')}`.toLowerCase();
    return (
      v.category === f.category &&
      (!f.makes.length || f.makes.includes(v.make)) &&
      !f.excludedMakes.includes(v.make) &&
      matchesMakeCriteria(v, f, false) &&
      !matchesMakeCriteria(v, f, true) &&
      terms.every((term) => text.includes(term)) &&
      (f.payment === 'lease' || !f.minPrice || v.price >= Number(f.minPrice)) &&
      (f.payment === 'lease' || !f.maxPrice || v.price <= Number(f.maxPrice)) &&
      (!f.minYear || v.year >= Number(f.minYear)) &&
      (!f.maxYear || v.year <= Number(f.maxYear)) &&
      (!f.minMileage || v.mileage >= Number(f.minMileage)) &&
      (!f.maxMileage || v.mileage <= Number(f.maxMileage)) &&
      (!f.maxPower || v.power <= Number(f.maxPower)) &&
      (f.payment !== 'lease' ||
        !f.minLease ||
        Boolean(v.monthly && v.monthly >= Number(f.minLease))) &&
      (f.payment !== 'lease' ||
        !f.maxLease ||
        Boolean(v.monthly && v.monthly <= Number(f.maxLease))) &&
      (!f.country || (v.country || 'Germany') === f.country) &&
      (!f.condition.length ||
        f.condition.includes(v.mileage ? 'Used' : 'New') ||
        (v.mileage > 0 && f.condition.includes("Employee's Car"))) &&
      (!f.excludeDamaged || !v.damaged) &&
      (!f.damagedOnly || Boolean(v.damaged)) &&
      matchesDetails(v, f.details) &&
      (!f.minPower || v.power >= Number(f.minPower)) &&
      (!f.fuel.length || f.fuel.some((value) => canonical(value) === canonical(v.fuel))) &&
      (!f.transmission.length ||
        f.transmission.some((value) => canonical(value) === canonical(v.transmission))) &&
      (!f.body.length || f.body.some((value) => canonical(value) === canonical(v.body))) &&
      (!f.color.length || f.color.some((value) => canonical(value) === canonical(v.color))) &&
      (!f.seats || v.seats >= Number(f.seats)) &&
      (!f.maxSeats || v.seats <= Number(f.maxSeats)) &&
      (!f.doors || f.doors.split('/').includes(String(v.doors))) &&
      (!f.location || v.location.toLowerCase().includes(f.location.toLowerCase())) &&
      f.features.every((feature) => hasFeature(v, feature)) &&
      (!f.deal || v.deal) &&
      (f.payment !== 'lease' || Boolean(v.monthly)) &&
      f.seller !== 'Private seller' &&
      f.seller !== 'Company vehicles'
    );
  });
}
export function sortVehicles(vehicles: Vehicle[], sort: string): Vehicle[] {
  const comparators: Record<string, (a: Vehicle, b: Vehicle) => number> = {
    'price-asc': (a, b) => a.price - b.price,
    'price-desc': (a, b) => b.price - a.price,
    mileage: (a, b) => a.mileage - b.mileage,
    newest: (a, b) => b.year - a.year,
    oldest: (a, b) => a.year - b.year,
    'mileage-desc': (a, b) => b.mileage - a.mileage,
    'listing-oldest': (a, b) => vehicles.indexOf(a) - vehicles.indexOf(b),
    'listing-newest': (a, b) => vehicles.indexOf(b) - vehicles.indexOf(a),
    power: (a, b) => b.power - a.power,
    standard: (a, b) => Number(Boolean(b.sponsored)) - Number(Boolean(a.sponsored)),
  };
  return [...vehicles].sort(
    Object.hasOwn(comparators, sort) ? comparators[sort] : comparators.standard,
  );
}
export function serializeFilters(input: Filters): string {
  const filters = normalizeFilters(input);
  const params = new URLSearchParams();
  for (const [key, value] of Object.entries(filters)) {
    if (JSON.stringify(value) !== JSON.stringify(defaultFilters[key as keyof Filters]))
      params.set(
        key,
        Array.isArray(value)
          ? value.join('|')
          : typeof value === 'object'
            ? JSON.stringify(value)
            : String(value),
      );
  }
  return params.toString();
}
export function parseFilters(search: string): Filters {
  const params = new URLSearchParams(search);
  const input: Record<string, unknown> = {};
  for (const [key, fallback] of Object.entries(defaultFilters)) {
    const value = params.get(key);
    if (value !== null)
      input[key] = Array.isArray(fallback)
        ? value.split('|')
        : typeof fallback === 'boolean'
          ? value === 'true'
          : typeof fallback === 'object'
            ? (() => {
                try {
                  return JSON.parse(value);
                } catch {
                  return {};
                }
              })()
            : value;
  }
  return normalizeFilters(input);
}
/** Illustrative amortizing-loan arithmetic; not a lender quote. */
export function paymentEstimate(
  price: number,
  deposit: number,
  months: number,
  annualRate: number,
): number {
  if (![price, deposit, months, annualRate].every(Number.isFinite) || price < 0 || months < 1)
    return 0;
  const principal = Math.max(0, price - Math.max(0, deposit));
  const rate = Math.max(0, annualRate) / 1200;
  if (!principal) return 0;
  return rate ? (principal * rate) / -Math.expm1(-months * Math.log1p(rate)) : principal / months;
}
export const money = (amount: number) =>
  '€' + new Intl.NumberFormat('en-GB', { maximumFractionDigits: 0 }).format(amount);
export const number = (amount: number) => new Intl.NumberFormat('en-GB').format(amount);
