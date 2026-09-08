import { dealerStock } from './dealer-stock';

export type VehicleCondition = 'new' | 'used';
export type VehicleEquipment = '4x4' | '360° camera' | 'Panoramic roof' | 'Heated seats' | 'Navigation' | 'Parking sensors' | 'Keyless entry' | 'Adaptive cruise control';
export type Vehicle = {
  id: number; verification: 'sample' | 'verified'; evidenceUrl?: string;
  sourceId: string; sourceObservedAt: string; image: string; category: string; body: string;
  make: string; title: string; year: string; yearNumber: number; mileage: string;
  mileageMiles: number; priceUsd: number; currency: 'USD'; mileageUnit: 'mi';
  fuel: string; transmission: string; equipment: readonly VehicleEquipment[];
  condition: VehicleCondition; href: `/listing-detail-v1/${number}`;
  engine: string; drivetrain: string; availabilityLabel: string;
};

export const formatVehiclePrice = (value: number | null) =>
  value === null || !Number.isFinite(value)
    ? 'Price on request'
    : new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(value);
export const formatVehicleMileage = (value: number | null) =>
  value === null || !Number.isFinite(value) ? 'Mileage not published' : `${new Intl.NumberFormat('en-US').format(value)} mi`;

/** Legacy numeric aliases keep the existing source components connected during this in-progress skin.
 * Their remaining literal labels are listed as unfinished work; they are NOT a unit conversion.
 * DealerStockRecord above is the authoritative explicitly named USD/miles schema.
 */
export const featuredVehicles: Vehicle[] = dealerStock.map((record, index) => {
  const id = index + 1;
  return {
    id, verification: 'sample', evidenceUrl: record.sourceUrl, sourceId: record.sourceId,
    sourceObservedAt: record.observedAt, image: record.image, category: record.body, body: record.body,
    make: record.make, title: `${record.make} ${record.model}${record.trim ? ` ${record.trim}` : ''}`,
    year: String(record.year), yearNumber: record.year,
    mileage: formatVehicleMileage(record.mileageMiles), mileageMiles: record.mileageMiles,
    mileageUnit: 'mi', priceUsd: record.priceUsd,
    currency: 'USD', fuel: record.fuel ?? 'Not published',
    transmission: record.transmission, equipment: [], condition: 'used',
    href: `/listing-detail-v1/${id}`, engine: record.engine, drivetrain: record.drivetrain,
    availabilityLabel: 'Dated listing sample — confirm availability directly'
  };
});
