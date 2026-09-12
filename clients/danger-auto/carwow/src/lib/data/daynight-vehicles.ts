import stock from './dealer-stock.json';
import { localStockImages, stockGallery } from './dealer-stock-media';

export type Car = {
  slug: string; title: string; shortTitle: string; brand: string; model: string;
  year: number; mileage: string; mileageValue: number; fuel: string;
  transmission: string; body: string; doors: number | null; engine: string;
  power: string; drive: string; color: string; price: number; priceEur: string;
  priceBgn: string; monthly: string; image: string; gallery: string[];
  badges: string[]; conditionLine: string; description: string; features: string[];
  highlights: string[]; lot: string; sourceUrl: string;
  observedAt: string; availabilityNote: string; mediaStatus: string;
  condition: 'new' | 'used';
};
const number = new Intl.NumberFormat('bg-BG');
const availabilityNote = 'Обявен автомобил — потвърдете наличността, цената и огледа с дилъра.';

/** Cards, details and recommendations consume the same dated seller records.
 * Gallery paths come from that record, never from a different dealer or generated stock. */
export const cars: Car[] = stock.listings.map(record => {
  const slugBase = record.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
  const localImages = localStockImages(record.localImages);
  const gallery = stockGallery(localImages);
  return {
    slug: `${slugBase}-${record.sourceId}`,
    title: `${record.title} · ${record.yearNumber} г. · ${number.format(record.mileageKm)} км`,
    shortTitle: record.title,
    brand: record.make,
    model: record.title.slice(record.make.length).trim(),
    year: record.yearNumber,
    mileage: `${number.format(record.mileageKm)} км`,
    mileageValue: record.mileageKm,
    fuel: record.fuel,
    transmission: record.transmission,
    body: record.category,
    doors: null,
    engine: record.engineCc > 0 ? `${number.format(record.engineCc)} куб. см` : 'Не е посочен',
    power: record.powerHp === null ? 'Не е посочена' : `${record.powerHp} к.с.`,
    drive: 'Не е посочено',
    color: record.color,
    price: record.priceEur,
    priceEur: record.priceEur > 0 ? `${number.format(record.priceEur)} €` : 'Цена при запитване',
    priceBgn: '',
    monthly: 'Банково финансиране по запитване',
    image: gallery[0],
    gallery,
    badges: ['По обява', 'Наличността се потвърждава'],
    conditionLine: availabilityNote,
    description: `${record.description} ${availabilityNote} ${record.priceQualification}. Данни от обява към ${record.observedAt}.`,
    features: [...record.equipment],
    highlights: [record.category, record.fuel, record.transmission],
    lot: `DA-${record.sourceId}`,
    sourceUrl: record.evidenceUrl,
    observedAt: record.observedAt,
    availabilityNote,
    mediaStatus: localImages.length ? record.mediaStatus : 'pending-local-permitted-media',
    condition: record.condition === 'new' ? 'new' : 'used',
  };
});
export const daynightVehicles = cars;
export type DayNightVehicle = Car;
export type DayNightVehicleCondition = 'new' | 'used';
export type DayNightVehicleAvailability = 'available' | 'incoming';
/** A low odometer reading is not evidence that a seller-advertised used car is new. */
export const getDayNightVehicleCondition = (vehicle: Pick<Car, 'mileageValue'> & Partial<Pick<Car, 'condition'>>): DayNightVehicleCondition =>
  vehicle.condition === 'new' ? 'new' : 'used';
/** Retained template filter bucket only; visible availability text is qualified above. */
export const getDayNightVehicleAvailability = (_vehicle: Pick<Car, 'highlights'>): DayNightVehicleAvailability => 'available';
export const getDayNightVehicleBySlug = (slug: string) => cars.find(car => car.slug === slug);
export const placeholderImageSlugs = new Set(cars.filter(car => !localStockImages(car.gallery).length).map(car => car.slug));
export const featuredDayNightVehicles = cars.slice(0, 6);
