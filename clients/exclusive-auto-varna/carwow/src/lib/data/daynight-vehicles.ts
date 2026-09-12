import stock from './dealer-stock.json';

/** Client adapter; the retained Carwow components, routes and filters are unchanged. */
export type Car = {
  slug: string;
  title: string;
  shortTitle: string;
  brand: string;
  model: string;
  year: number;
  mileage: string;
  mileageValue: number;
  fuel: string;
  transmission: string;
  body: string;
  doors: number | string;
  engine: string;
  power: string;
  drive: string;
  color: string;
  price: number;
  priceEur: string;
  /** Legacy presentation slot now carries the source's tax qualification, not a converted price. */
  priceBgn: string;
  monthly: string;
  image: string;
  gallery: string[];
  badges: string[];
  conditionLine: string;
  description: string;
  features: string[];
  highlights: string[];
  lot: string;
  sourceUrl: string;
};

const number = new Intl.NumberFormat(stock.facts.locale);
const money = new Intl.NumberFormat(stock.facts.locale, {
  style: 'currency', currency: stock.facts.currency, maximumFractionDigits: 0
});
const seen = new Set<string>();

export const cars: Car[] = stock.vehicles.map((record) => {
  if (seen.has(record.slug)) throw new Error(`Duplicate dealer vehicle: ${record.slug}`);
  seen.add(record.slug);
  // Every selected record has a published cash price. Never fabricate a zero price.
  if (!Number.isFinite(record.priceEur) || record.priceEur <= 0) {
    throw new Error(`A sourced cash price is required for selected record ${record.sourceId}`);
  }
  if (!record.gallery.length || !record.gallery.every((image) => image.startsWith('/inventory/'))) {
    throw new Error(`Missing local gallery for ${record.sourceId}`);
  }
  const availability = record.availabilityLabel;
  return {
    slug: record.slug,
    title: record.title,
    shortTitle: `${record.make} ${record.model}`,
    brand: record.make,
    model: record.model,
    year: record.year,
    mileage: `${number.format(record.mileageKm)} км`,
    mileageValue: record.mileageKm,
    fuel: record.fuel,
    transmission: record.transmission === 'Автоматична' ? 'Автоматик' : record.transmission,
    body: record.bodyLabel,
    doors: record.doorsLabel,
    engine: record.engineCc ? `${number.format(record.engineCc)} см³` : 'По запитване',
    power: record.powerHp ? `${number.format(record.powerHp)} к.с.` : 'По запитване',
    drive: record.equipment.includes('4x4') ? '4x4' : 'По запитване',
    color: record.color || 'По запитване',
    price: record.priceEur,
    priceEur: money.format(record.priceEur),
    priceBgn: record.priceNote,
    monthly: 'Условия за финансиране по запитване; няма изчислена оферта.',
    image: record.image,
    gallery: [...record.gallery],
    badges: [availability],
    conditionLine: `${availability}. ${record.conditionNote}`,
    description: record.description,
    features: [...record.equipment],
    highlights: [availability, record.priceNote],
    lot: record.sourceId,
    sourceUrl: record.sourceUrl
  };
});

export const daynightVehicles = cars;
export type DayNightVehicle = Car;
export type DayNightVehicleCondition = 'new' | 'used';
export type DayNightVehicleAvailability = 'available' | 'incoming';

export const getDayNightVehicleCondition = (
  _vehicle: Pick<Car, 'mileageValue'>
): DayNightVehicleCondition => 'used';

/** Retained filter grouping only. The displayed badge always states source availability. */
export const getDayNightVehicleAvailability = (
  vehicle: Pick<Car, 'highlights'>
): DayNightVehicleAvailability =>
  vehicle.highlights.some((text) => /очакван|внос по поръчка/i.test(text)) ? 'incoming' : 'available';

export const getDayNightVehicleBySlug = (slug: string) => cars.find((car) => car.slug === slug);
export const placeholderImageSlugs = new Set<string>();
export const featuredDayNightVehicles = cars.slice(0, 6);
