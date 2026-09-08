import { eliqStock } from './eliq-stock';
export type CurrentDayNightListing = {
  id: string; title: string; sourceUrl: string; priceEur: string; priceBgn: string;
  status: string; date: string; mileage: string; color: string; fuel: string;
  power: string; transmission: string; body: string; features: string[]; image: string;
};
// Legacy export name retained to avoid changing the source template's component contracts.
export const currentDayNightListings: CurrentDayNightListing[] = eliqStock.map(vehicle => ({
  id: vehicle.id, title: vehicle.title, sourceUrl: vehicle.sourceUrl,
  priceEur: `${new Intl.NumberFormat('bg-BG').format(vehicle.priceEur)} €`, priceBgn: '',
  status: 'Архивна обява', date: String(vehicle.year),
  mileage: `${new Intl.NumberFormat('bg-BG').format(vehicle.mileageKm)} км`, color: vehicle.color,
  fuel: vehicle.fuel, power: vehicle.power, transmission: vehicle.transmission,
  body: vehicle.bodyLabel, features: vehicle.features, image: vehicle.images[0]
}));
