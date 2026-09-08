import source from './navara-data.json';

// Dated listing samples from Navara Car, observed 2026-09-08. Not a live feed or independently verified stock.
// The exact publisher photo URLs are retained; no local binary download or rights clearance is claimed here.
export type CurrentDayNightListing = {
  id: string; title: string; sourceUrl: string; priceEur: string; priceBgn: string;
  status: string; date: string; mileage: string; color: string; fuel: string; power: string;
  transmission: string; body: string; features: string[]; image: string; gallery: string[];
};
const formatPrice = (value: number | null | undefined) =>
  typeof value === 'number' && Number.isFinite(value) && value > 0
    ? `${new Intl.NumberFormat('bg-BG').format(value)} €` : 'Цена при запитване';
export const currentDayNightListings: CurrentDayNightListing[] = source.vehicles.map((vehicle) => ({
  id: vehicle.sourceId,
  title: vehicle.title,
  sourceUrl: vehicle.sourceUrl,
  priceEur: formatPrice(vehicle.priceEur),
  priceBgn: '',
  status: source.availabilityLabel,
  date: vehicle.dateLabel,
  mileage: `${new Intl.NumberFormat('bg-BG').format(vehicle.mileageKm)} км`,
  color: vehicle.color,
  fuel: vehicle.fuel,
  power: `${vehicle.powerHp} к.с.`,
  transmission: vehicle.transmission,
  body: vehicle.body,
  features: [...vehicle.features],
  image: vehicle.images[0],
  gallery: [...vehicle.images]
}));
