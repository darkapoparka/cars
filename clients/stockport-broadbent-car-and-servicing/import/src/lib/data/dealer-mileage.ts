// Dealer-owned units; visitor language/country never changes stock facts.
export type MileageFacts = { mileageKnown?: boolean; mileageValue?: number; mileageUnit?: 'km' | 'mi'; mileageKm?: number; mileage?: number | string };
export const dealerDistanceUnit = 'mi' as const;
const milesToKm = 1.609344;
export function canonicalMileage(facts: MileageFacts): number {
  if (facts.mileageKnown === false) return NaN;
  if (typeof facts.mileageValue === 'number' && Number.isFinite(facts.mileageValue) && facts.mileageValue >= 0 && (facts.mileageUnit === 'mi' || facts.mileageUnit === 'km'))
    return facts.mileageValue * (facts.mileageUnit === 'mi' ? milesToKm : 1);
  return facts.mileageKm ?? (typeof facts.mileage === 'number' ? facts.mileage : NaN);
}
export const mileageLimitKm = (value: number): number => value * milesToKm;
// Remove division noise at integer range boundaries; original stock facts stay untouched.
export const mileageForDealer = (facts: MileageFacts): number => Number((canonicalMileage(facts) / milesToKm).toFixed(8));
export function formatStockMileage(facts: MileageFacts, locale: string = 'en'): string {
  if (!Number.isFinite(canonicalMileage(facts))) return '—';
  const unit = facts.mileageUnit ?? 'km';
  const value = facts.mileageValue ?? canonicalMileage(facts);
  return new Intl.NumberFormat(locale === 'bg' ? 'bg-BG' : "en-GB", { style: 'unit', unit: unit === 'mi' ? 'mile' : 'kilometer', unitDisplay: 'short' }).format(value);
}
export const formatDealerMileage = (value: number, locale: string = 'en'): string => formatStockMileage({ mileageValue: value, mileageUnit: dealerDistanceUnit }, locale);
export const mileageSortValue = (facts: MileageFacts): number => Number.isFinite(canonicalMileage(facts)) ? canonicalMileage(facts) : Infinity;
