import { eliqStock } from './eliq-stock';
export type Car = {
  slug: string; title: string; shortTitle: string; brand: string; model: string; year: number;
  mileage: string; mileageValue: number; fuel: string; transmission: string; body: string;
  doors: number; engine: string; power: string; drive: string; color: string;
  price: number; priceEur: string; priceBgn: string; monthly: string; image: string;
  gallery: string[]; badges: string[]; conditionLine: string; description: string;
  features: string[]; highlights: string[]; lot: string; sourceUrl: string;
};
export const cars: Car[] = eliqStock.map(vehicle => ({
  slug: `eliq-${vehicle.id}`, title: `${vehicle.make} ${vehicle.model} ${vehicle.year}`,
  shortTitle: `${vehicle.make} ${vehicle.model}`, brand: vehicle.make, model: vehicle.model,
  year: vehicle.year, mileage: `${new Intl.NumberFormat('bg-BG').format(vehicle.mileageKm)} км`,
  mileageValue: vehicle.mileageKm, fuel: vehicle.fuel, transmission: vehicle.transmission,
  body: vehicle.bodyLabel, doors: 0, engine: '—', power: vehicle.power, drive: '—', color: vehicle.color,
  price: vehicle.priceEur, priceEur: `${new Intl.NumberFormat('bg-BG').format(vehicle.priceEur)} €`,
  priceBgn: '', monthly: '', image: vehicle.images[0], gallery: vehicle.images,
  badges: ['Архивна обява'], conditionLine: 'Потвърдете актуалната цена и наличност с ELIQ AUTO.',
  description: vehicle.description, features: vehicle.features,
  highlights: ['Архивна обява', vehicle.power].filter(Boolean),
  lot: `ELIQ-${vehicle.id}`, sourceUrl: vehicle.sourceUrl
}));
export const daynightVehicles = cars;
export type DayNightVehicle = Car;
export type DayNightVehicleCondition = 'new' | 'used';
export type DayNightVehicleAvailability = 'available' | 'incoming';
export const getDayNightVehicleCondition = (vehicle: Pick<Car, 'mileageValue'>): DayNightVehicleCondition => vehicle.mileageValue <= 100 ? 'new' : 'used';
// Retained filter vocabulary; the visible badge explicitly identifies archived demo stock.
export const getDayNightVehicleAvailability = (vehicle: Pick<Car, 'highlights'>): DayNightVehicleAvailability => vehicle.highlights.some(value => /очакван внос/iu.test(value)) ? 'incoming' : 'available';
export const getDayNightVehicleBySlug = (slug: string) => cars.find(car => car.slug === slug);
export const placeholderImageSlugs = new Set<string>();
export const featuredDayNightVehicles = cars.slice(0, 6);
