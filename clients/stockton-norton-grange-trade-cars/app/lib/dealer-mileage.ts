export type MileageStock = {
  id?: string; slug?: string; mileage?: number; mileageValue?: number;
  mileageOnRequest?: boolean; mileageKnown?: boolean;
  mileageSourceValue?: number; mileageSourceUnit?: 'mi' | 'km';
};
type Fact = {value: number; unit: 'mi' | 'km'} | null;
const recorded: Record<string, Fact> = {
  "peugeot-208-2016-820214219013": {
    "value": 80000,
    "unit": "mi"
  },
  "ford-grand-2016-820210366321": {
    "value": 103000,
    "unit": "mi"
  },
  "ford-focus-2016-820209853597": {
    "value": 103000,
    "unit": "mi"
  },
  "nissan-qashqai-2017-820206910321": {
    "value": 93000,
    "unit": "mi"
  },
  "vauxhall-corsa-2017-820199748020": {
    "value": 75401,
    "unit": "mi"
  },
  "audi-a1-2013-820174486495": {
    "value": 80000,
    "unit": "mi"
  },
  "nissan-qashqai-2018-820154120347": {
    "value": 92418,
    "unit": "mi"
  },
  "ford-fiesta-2014-820133361606": {
    "value": 51000,
    "unit": "mi"
  },
  "nissan-juke-2017-820133263757": {
    "value": 101000,
    "unit": "mi"
  },
  "nissan-juke-2015-820110031882": {
    "value": 83830,
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
