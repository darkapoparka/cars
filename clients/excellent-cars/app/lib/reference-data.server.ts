import {isDealer} from './dealer-config';
import snapshots from './captured-vehicle-details.json';
import type {ReferenceVehicleDetail} from './reference-types';
import {currencyText} from './currency';

// Imported by server routes only. Each page receives just its selected vehicle's snapshot.
const bySlug = snapshots as unknown as Record<string, ReferenceVehicleDetail>;
export function getReferenceVehicleDetail(slug: string): ReferenceVehicleDetail | undefined {
  if (isDealer || !Object.prototype.hasOwnProperty.call(bySlug, slug)) return undefined;
  const detail = bySlug[slug];
  return {...detail, highlights: detail.highlights.map(item => ({...item, description: currencyText(item.description)}))};
}
export function referenceInspectionSlugs(): string[] {
  if (isDealer) return [];
  return Object.keys(bySlug).filter(slug => bySlug[slug].inspection.length > 0);
}
