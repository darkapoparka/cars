import type { Vehicle } from './inventory';

export const budgetBands = [
  { label: 'До 60 000 €', minimum: null, maximum: 60000 },
  { label: '60–70 000 €', minimum: 60000, maximum: 70000 },
  { label: 'Над 70 000 €', minimum: 70000, maximum: null }
] as const;
export type BudgetBand = { label: string; minimum: number | null; maximum: number | null };

/** Lower bounds are exclusive, upper bounds inclusive: every price belongs once. */
export const budgetCount = (vehicles: readonly Vehicle[], band: BudgetBand) => vehicles.filter(vehicle =>
  (band.minimum === null || vehicle.priceEur > band.minimum) && (band.maximum === null || vehicle.priceEur <= band.maximum)
).length;

export function budgetHref(band: BudgetBand): `/listing-grid?${string}` {
  const params = new URLSearchParams();
  if (band.minimum !== null) { params.set('price_min', String(band.minimum)); params.set('price_min_exclusive', '1'); }
  if (band.maximum !== null) params.set('price_max', String(band.maximum));
  return `/listing-grid?${params}`;
}
