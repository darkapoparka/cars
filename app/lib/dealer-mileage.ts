export type MileageStock = {
  id?: string; slug?: string; mileage?: number; mileageValue?: number;
  mileageOnRequest?: boolean; mileageKnown?: boolean;
  mileageSourceValue?: number; mileageSourceUnit?: 'mi' | 'km';
};
type Fact = {value: number; unit: 'mi' | 'km'} | null;
const recorded: Record<string, Fact> = {
  "chrysler-sebring-2008-20722137": {
    "value": 100000,
    "unit": "mi"
  },
  "land-rover-discovery-sport-2018-21144493": {
    "value": 107000,
    "unit": "mi"
  },
  "mercedes-benz-r-class-2007-20977893": {
    "value": 97000,
    "unit": "mi"
  },
  "audi-a4-2009-21086505": {
    "value": 150000,
    "unit": "mi"
  },
  "renault-megane-2011-20877963": {
    "value": 72000,
    "unit": "mi"
  },
  "hyundai-santa-fe-2013-21180529": {
    "value": 171000,
    "unit": "mi"
  },
  "volvo-xc60-2010-21170923": {
    "value": 141000,
    "unit": "mi"
  },
  "mini-hatchback-2014-20562332": {
    "value": 123000,
    "unit": "mi"
  }
};
const milesToKm = 1.609344;
export const dealerDistanceUnit = 'mi' as const;
export function originalMileage(stock: MileageStock): Fact {
  if (stock.mileageOnRequest === true || stock.mileageKnown === false) return null;
  const key = stock.slug ?? stock.id;
  if (key && Object.hasOwn(recorded, key)) return recorded[key];
  if (Number.isFinite(stock.mileageSourceValue) && (stock.mileageSourceUnit === 'mi' || stock.mileageSourceUnit === 'km')) {
    return {value: stock.mileageSourceValue!, unit: stock.mileageSourceUnit};
  }
  const value = stock.mileage ?? stock.mileageValue;
  return typeof value === 'number' && Number.isFinite(value) && value >= 0 ? {value, unit: 'km'} : null;
}
export function canonicalMileage(stock: MileageStock): number {
  const fact = originalMileage(stock);
  return fact === null ? NaN : fact.unit === 'mi' ? fact.value * milesToKm : fact.value;
}
export const mileageLimitKm = (value: number): number => value * milesToKm;
export function dealerMileageValue(stock: MileageStock): number {
  const fact = originalMileage(stock);
  if (fact === null) return NaN;
  return fact.unit === 'mi' ? fact.value : Number((fact.value / milesToKm).toFixed(8));
}
export function formatStockMileage(stock: MileageStock, locale = 'en'): string {
  const fact = originalMileage(stock);
  if (fact === null) return locale.startsWith('bg') ? 'Пробег при запитване' : 'Mileage on request';
  return new Intl.NumberFormat(locale.startsWith('bg') ? 'bg-BG' : 'en-GB', {maximumFractionDigits: 3}).format(fact.value) + ' ' + fact.unit;
}
