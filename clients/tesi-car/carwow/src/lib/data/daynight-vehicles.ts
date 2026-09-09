import facts from './dealer-facts.json';

export type Car = {
  slug: string; title: string; shortTitle: string; brand: string; model: string;
  year: number; mileage: string; mileageValue: number; fuel: string;
  transmission: string; body: string; doors: string | number; engine: string;
  power: string; drive: string; color: string; price: number; priceEur: string;
  priceBgn: string; monthly: string; image: string; gallery: string[];
  badges: string[]; conditionLine: string; description: string; features: string[];
  highlights: string[]; lot: string; sourceUrl: string;
};

const number = new Intl.NumberFormat('bg-BG');
const fuels: Record<string, string> = { diesel: 'Дизел', gasoline: 'Бензин', hybrid: 'Хибрид', electric: 'Електрически' };
const bodies: Record<string, string> = { suv: 'SUV', hatchback: 'Хечбек', van: 'Миниван', sedan: 'Седан', wagon: 'Комби', coupe: 'Купе' };

// Retain the template API; identity, model and engine are explicit source fields,
// never parsed out of a title or inferred from the manufacturer.
export const cars: Car[] = facts.vehicles.map((record) => {
  const mileage = `${number.format(record.mileageKm)} км`;
  const fuel = fuels[record.fuel] ?? record.fuel;
  const transmission = record.transmission === 'automatic' ? 'Автоматик' : 'Ръчна';
  const power = `${record.powerHp} к.с.`;
  const drive = record.features.includes('4x4') ? '4x4' : '—';
  return {
    slug: record.slug, title: record.title, shortTitle: `${record.make} ${record.model}`,
    brand: record.make, model: record.model, year: record.year,
    mileage, mileageValue: record.mileageKm, fuel, transmission,
    body: bodies[record.body] ?? record.body, doors: record.doors,
    engine: `${number.format(record.engineCc)} см³`, power, drive, color: record.color,
    price: record.price, priceEur: `${number.format(record.price)} €`,
    priceBgn: '', monthly: 'Условията за финансиране се уточняват директно',
    // Exact source URLs are temporary until the local-asset transfer is committed.
    image: record.photos[0].sourceUrl,
    gallery: record.photos.map((photo) => photo.sourceUrl),
    badges: ['Публикувана обява', power],
    conditionLine: 'Наличността, цената и огледът се потвърждават по телефона.',
    description: `${record.title}, ${record.year} г., ${fuel.toLocaleLowerCase('bg-BG')}, ${mileage}, ${power}, ${transmission.toLocaleLowerCase('bg-BG')}. ${facts.availabilityNotice}`,
    features: [...record.features], highlights: ['Публикувана обява', power, drive],
    lot: record.sourceId, sourceUrl: record.sourceUrl
  };
});

export const daynightVehicles = cars;
export type DayNightVehicle = Car;
export type DayNightVehicleCondition = 'new' | 'used';
export type DayNightVehicleAvailability = 'available' | 'incoming' | 'unverified';
export const getDayNightVehicleCondition = (_vehicle: Pick<Car, 'mileageValue'>): DayNightVehicleCondition => 'used';
export const getDayNightVehicleAvailability = (_vehicle: Pick<Car, 'highlights'>): DayNightVehicleAvailability => 'unverified';
export const getDayNightVehicleBySlug = (slug: string) => daynightVehicles.find((car) => car.slug === slug);
export const placeholderImageSlugs = new Set<string>();
export const featuredDayNightVehicles = daynightVehicles.slice(0, 6);
