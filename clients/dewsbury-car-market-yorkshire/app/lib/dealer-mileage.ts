export type MileageStock = {
  id?: string; slug?: string; mileage?: number; mileageValue?: number;
  mileageOnRequest?: boolean; mileageKnown?: boolean;
  mileageSourceValue?: number; mileageSourceUnit?: 'mi' | 'km';
};
type Fact = {value: number; unit: 'mi' | 'km'} | null;
const recorded: Record<string, Fact> = {
  "nissan-gt-r-2010-at-sample-1": {
    "value": 71715,
    "unit": "mi"
  },
  "audi-a6-saloon-2022-at-sample-2": {
    "value": 34981,
    "unit": "mi"
  },
  "land-rover-range-rover-velar-2019-at-sample-3": {
    "value": 66313,
    "unit": "mi"
  },
  "mercedes-benz-glc-2018-at-sample-4": {
    "value": 120952,
    "unit": "mi"
  },
  "volkswagen-golf-2017-at-sample-5": {
    "value": 82391,
    "unit": "mi"
  },
  "mercedes-benz-citan-2018-at-sample-6": {
    "value": 105906,
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
