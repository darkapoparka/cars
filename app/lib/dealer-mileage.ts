export type MileageStock = {
  id?: string; slug?: string; mileage?: number; mileageValue?: number;
  mileageOnRequest?: boolean; mileageKnown?: boolean;
  mileageSourceValue?: number; mileageSourceUnit?: 'mi' | 'km';
};
type Fact = {value: number; unit: 'mi' | 'km'} | null;
const recorded: Record<string, Fact> = {
  "audi-a1-2013-800753431171": {
    "value": 119612,
    "unit": "mi"
  },
  "vauxhall-corsa-2021-800729940509": {
    "value": 32590,
    "unit": "mi"
  },
  "citroen-c3-2023-800722114749": {
    "value": 3441,
    "unit": "mi"
  },
  "renault-clio-2016-800696671424": {
    "value": 54322,
    "unit": "mi"
  },
  "vauxhall-corsa-2015-800682432068": {
    "value": 75185,
    "unit": "mi"
  },
  "audi-q5-2013-800637144674": {
    "value": 81414,
    "unit": "mi"
  },
  "nissan-qashqai-2016-800632116283": {
    "value": 109154,
    "unit": "mi"
  },
  "audi-a1-2016-800549423064": {
    "value": 91421,
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
