import source from './navara-data.json';

export type Car = {
  slug: string; title: string; shortTitle: string; brand: string; model: string; year: number;
  mileage: string; mileageValue: number; fuel: string; transmission: string; body: string;
  doors: string | number; engine: string; power: string; drive: string; color: string;
  price: number; priceEur: string; priceBgn: string; monthly: string; image: string;
  gallery: string[]; badges: string[]; conditionLine: string; description: string;
  features: string[]; highlights: string[]; lot: string; sourceUrl: string;
  observedAt: string; availabilityLabel: string;
};
export const formatCarPrice = (value: number | null | undefined): string =>
  typeof value === 'number' && Number.isFinite(value) && value > 0
    ? `${new Intl.NumberFormat('bg-BG').format(value)} €` : 'Цена при запитване';

export const cars: Car[] = source.vehicles.map((vehicle) => ({
  slug: vehicle.slug,
  title: vehicle.title,
  shortTitle: vehicle.title,
  brand: vehicle.make,
  model: vehicle.model,
  year: vehicle.year,
  mileage: `${new Intl.NumberFormat('bg-BG').format(vehicle.mileageKm)} км`,
  mileageValue: vehicle.mileageKm,
  fuel: vehicle.fuel,
  transmission: vehicle.transmission,
  body: vehicle.body,
  doors: vehicle.doorsLabel,
  engine: vehicle.engineCc ? `${new Intl.NumberFormat('bg-BG').format(vehicle.engineCc)} см³` : vehicle.batteryKwh ? `${vehicle.batteryKwh} kWh (по обявата)` : 'Не е посочено',
  power: `${vehicle.powerHp} к.с.`,
  drive: vehicle.drive ?? 'Не е посочено',
  color: vehicle.color,
  price: vehicle.priceEur,
  priceEur: formatCarPrice(vehicle.priceEur),
  priceBgn: '',
  monthly: 'Лизинг — условия по запитване',
  image: vehicle.images[0],
  gallery: [...vehicle.images],
  badges: [source.availabilityLabel],
  conditionLine: source.inventoryNotice,
  description: `${vehicle.title}, ${vehicle.dateLabel}, ${new Intl.NumberFormat('bg-BG').format(vehicle.mileageKm)} км, ${vehicle.fuel.toLocaleLowerCase('bg-BG')}, ${vehicle.powerHp} к.с., ${vehicle.transmission.toLocaleLowerCase('bg-BG')}. ${source.inventoryNotice}`,
  features: [...vehicle.features],
  highlights: [source.availabilityLabel, `${vehicle.powerHp} к.с.`, ...(vehicle.drive ? [vehicle.drive] : [])],
  lot: `NC-${vehicle.sourceId.slice(-6)}`,
  sourceUrl: vehicle.sourceUrl,
  observedAt: vehicle.observedAt,
  availabilityLabel: source.availabilityLabel
}));
export const daynightVehicles = cars;
export type DayNightVehicle = Car;
export type DayNightVehicleCondition = 'new' | 'used';
export type DayNightVehicleAvailability = 'available' | 'incoming';
export const getDayNightVehicleCondition = (vehicle: Pick<Car, 'mileageValue'>): DayNightVehicleCondition =>
  vehicle.mileageValue <= 100 ? 'new' : 'used';
// Existing filter value retained. Public labels explicitly describe dated advertisements, not stock verification.
export const getDayNightVehicleAvailability = (_vehicle: Pick<Car, 'highlights'>): DayNightVehicleAvailability => 'available';
export const getDayNightVehicleBySlug = (slug: string) => daynightVehicles.find((car) => car.slug === slug);
export const placeholderImageSlugs = new Set<string>();
export const featuredDayNightVehicles = daynightVehicles.slice(0, 6);
