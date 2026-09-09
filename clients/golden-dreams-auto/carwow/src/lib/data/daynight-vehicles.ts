import { currentDayNightListings, type CurrentDayNightListing } from './daynight-current-inventory';

export type Car = {
  slug: string; title: string; shortTitle: string; brand: string; model: string; year: number;
  mileage: string; mileageValue: number; fuel: string; transmission: string; body: string;
  doors: number | null; engine: string; power: string; drive: string; color: string; price: number;
  priceEur: string; priceBgn: string; monthly: string; image: string; gallery: string[]; badges: string[];
  conditionLine: string; description: string; features: string[]; highlights: string[]; lot: string; sourceUrl: string;
};

const parseLocalizedNumber = (value: string) => {
  const match = value.match(/\d[\d\s]*(?:[.,]\d+)?/);
  return match ? Number(match[0].replace(/\s+/g, '').replace(',', '.')) : 0;
};

const listingToVehicle = (listing: CurrentDayNightListing): Car => {
  const year = Number(listing.date.match(/\b(?:19|20)\d{2}\b/)?.[0] ?? 0);
  const mileageValue = Math.round(parseLocalizedNumber(listing.mileage));
  const price = parseLocalizedNumber(listing.priceEur);
  const conditionLine = 'Публична обява към 09.09.2026 г. — потвърдете наличността, адреса и часа за оглед с GoldenDreams AUTO.';
  return {
    slug: listing.canonicalSlug,
    title: `${listing.shortTitle} ${year} г., ${listing.fuel}, ${listing.mileage}`,
    shortTitle: listing.shortTitle,
    brand: listing.brand,
    model: listing.model,
    year,
    mileage: listing.mileage,
    mileageValue,
    fuel: listing.fuel,
    transmission: listing.transmission,
    body: listing.body,
    doors: null,
    engine: listing.engine,
    power: listing.power,
    drive: '—',
    color: listing.color,
    price,
    priceEur: listing.priceEur,
    priceBgn: listing.priceBgn,
    monthly: 'Финансиране по запитване',
    image: listing.image,
    gallery: listing.gallery,
    badges: ['По обява', listing.status],
    conditionLine,
    description: `${listing.shortTitle}, ${year} г., ${listing.mileage}, ${listing.power}. ${conditionLine} ${listing.notes}`,
    features: listing.features,
    highlights: ['Наличност за потвърждение', listing.power],
    lot: `GD-${listing.id}`,
    sourceUrl: listing.sourceUrl
  };
};

export const cars = currentDayNightListings.map(listingToVehicle);
export const daynightVehicles = cars;
export type DayNightVehicle = Car;
export type DayNightVehicleCondition = 'new' | 'used';
export type DayNightVehicleAvailability = 'available' | 'incoming';
export const getDayNightVehicleCondition = (vehicle: Pick<Car, 'mileageValue'>): DayNightVehicleCondition =>
  vehicle.mileageValue <= 100 ? 'new' : 'used';
export const getDayNightVehicleAvailability = (): DayNightVehicleAvailability => 'available';
export const getDayNightVehicleBySlug = (slug: string) => daynightVehicles.find((car) => car.slug === slug);
export const placeholderImageSlugs = new Set<string>();
export const featuredDayNightVehicles = daynightVehicles.slice(0, 6);
