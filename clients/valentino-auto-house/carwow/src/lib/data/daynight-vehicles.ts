import dealerPack from './dealer-pack.json';

export type Car = {
  slug: string; title: string; shortTitle: string; brand: string; model: string;
  year: number; mileage: string; mileageValue: number; fuel: string;
  transmission: string; body: string; doors: number | null; engine: string;
  power: string; drive: string; color: string; price: number; priceEur: string;
  priceBgn: string; monthly: string; image: string; gallery: string[];
  badges: string[]; conditionLine: string; description: string; features: string[];
  highlights: string[]; lot: string; sourceUrl: string;
};

const amount = new Intl.NumberFormat('bg-BG', { maximumFractionDigits: 2 });
const dealer = dealerPack.dealer;

/** One dated advertisement pack; no inherited inventory or availability guarantee. */
export const cars: Car[] = dealerPack.inventory.map((record) => ({
  slug: record.slug,
  title: record.title,
  shortTitle: record.title,
  brand: record.make,
  model: record.model,
  year: record.year,
  mileage: `${amount.format(record.mileage)} км`,
  mileageValue: record.mileage,
  fuel: record.fuelLabel,
  transmission: record.transmissionLabel,
  body: record.bodyLabel,
  doors: null,
  engine: record.engineCc === null ? '—' : `${amount.format(record.engineCc)} см³`,
  power: record.powerHp === null ? '—' : `${record.powerHp} к.с.`,
  drive: record.equipment.some((feature) => /4x4/i.test(feature)) ? '4x4' : '—',
  color: record.color || '—',
  price: record.price,
  priceEur: `${amount.format(record.price)} €`,
  // The seller's source currency is EUR; do not synthesize a BGN selling price.
  priceBgn: '',
  monthly: 'Финансиране по запитване',
  image: record.thumbnail,
  gallery: [...record.photos],
  badges: ['Наличност по телефона'],
  conditionLine: dealer.stockNotice,
  description: [
    record.title,
    dealer.stockNotice,
    record.vat === 'included' ? 'ДДС е включен в обявената цена.' : 'По обявата: ДДС не се начислява.',
    `Категория по източника: ${record.sourceCategory}.`,
    record.seats === null ? '' : `Места по обявата: ${record.seats}.`,
    ...record.notes,
    `Източник: ${record.sourceUrl}`
  ].filter(Boolean).join('\n\n'),
  features: [...record.equipment],
  highlights: ['Наличност по телефона', record.powerHp === null ? 'Данни по обявата' : `${record.powerHp} к.с.`],
  lot: record.sourceId,
  sourceUrl: record.sourceUrl
}));

export const daynightVehicles = cars;
export type DayNightVehicle = Car;
export type DayNightVehicleCondition = 'new' | 'used';
export type DayNightVehicleAvailability = 'available' | 'incoming';
export const getDayNightVehicleCondition = (_vehicle: Pick<Car, 'mileageValue'>): DayNightVehicleCondition => 'used';
// Retained filter bucket, not physical availability. Visible copy says to confirm by phone.
export const getDayNightVehicleAvailability = (_vehicle: Pick<Car, 'highlights'>): DayNightVehicleAvailability => 'available';
export const getDayNightVehicleBySlug = (slug: string) => cars.find((car) => car.slug === slug);
export const placeholderImageSlugs = new Set<string>();
export const featuredDayNightVehicles = cars.slice(0, 6);
