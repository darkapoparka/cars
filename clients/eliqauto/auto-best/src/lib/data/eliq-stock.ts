import snapshot from './eliq-source.json';

/** Saved ELIQ advert material, not a live feed or confirmed availability. */
export const inventoryCapturedAt = snapshot.fetchedAt;
export const inventoryNotice = 'Демонстрационна селекция по архивни обяви от 21.06.2026 г. Потвърдете цена и наличност с ELIQ AUTO.';

export function parseAdvertNumber(value: string): number | null {
  const cleaned = value.replace(/[\s\u00a0\u202f]/gu, '');
  const match = cleaned.match(/\d+(?:[.,]\d+)?/u);
  if (!match) return null;
  const result = Number(match[0].replace(',', '.'));
  return Number.isFinite(result) && result >= 0 ? result : null;
}

export type EliqSample = {
  id: string;
  title: string;
  make: string;
  model: string;
  year: number;
  priceEur: number;
  mileageKm: number;
  fuel: 'Бензин' | 'Дизел' | 'Хибрид' | 'Електрически';
  transmission: 'Автоматик' | 'Ръчна';
  body: 'Sedan' | 'Wagon' | 'SUV' | 'Coupe' | 'Hatchback' | 'Convertible' | 'Minivan';
  bodyLabel: string;
  color: string;
  power: string;
  powerHp: number | null;
  images: string[];
  sourceUrl: string;
  features: string[];
  description: string;
};

const fuels: Record<string, EliqSample['fuel']> = {
  'Бензинов': 'Бензин', 'Дизелов': 'Дизел', 'Хибриден': 'Хибрид', 'Електрически': 'Електрически'
};
const bodies: Record<string, EliqSample['body']> = {
  'Седан': 'Sedan', 'Стреч лимузина': 'Sedan', 'Лимузина': 'Sedan', 'Комби': 'Wagon',
  'Джип': 'SUV', 'SUV': 'SUV', 'Купе': 'Coupe', 'Хечбек': 'Hatchback', 'Кабрио': 'Convertible', 'Ван': 'Minivan'
};
const makes = ['Mercedes-Benz', 'Land Rover', 'Volkswagen', 'Porsche', 'Toyota', 'Audi', 'BMW', 'Ford', 'Mazda'];

/** One identical, bounded sample in each independent variant. Skip unknown-price records instead of displaying zero-price cars. */
export const eliqStock: EliqSample[] = snapshot.listings.flatMap((listing): EliqSample[] => {
  const priceEur = parseAdvertNumber(listing.price);
  const mileageKm = parseAdvertNumber(listing.mileage);
  const year = Number(listing.production.match(/\b(?:19|20)\d{2}\b/u)?.[0]);
  const make = makes.find(value => listing.title.startsWith(value));
  const fuel = fuels[listing.fuel];
  const body = bodies[listing.category];
  const transmission = listing.gearbox === 'Автоматична' ? 'Автоматик' : listing.gearbox === 'Ръчна' ? 'Ръчна' : null;
  const images = [...new Set([listing.image, ...(listing.images ?? [])])]
    .filter(value => /^\/assets\/eliqauto\/cars\/[0-9]+\/img-[0-9]+\.webp$/u.test(value));
  if (!make || !fuel || !body || !transmission || !images.length || !year || priceEur === null || priceEur <= 0 || mileageKm === null) return [];
  const title = listing.title.replace(/\s*ЛИЗИНГ\s*100%/giu, '').trim();
  const model = title.slice(make.length).trim().split(/\s/u).slice(0, make === 'Mercedes-Benz' ? 2 : 1).join(' ');
  const source = new URL(listing.href);
  if (source.protocol !== 'https:' || source.hostname !== 'eliqauto.mobile.bg') throw new Error('Unexpected ELIQ advert source');
  return [{
    id: listing.id, title, make, model, year, priceEur, mileageKm, fuel, transmission, body,
    bodyLabel: /лимузина/iu.test(listing.category) ? 'Седан' : listing.category,
    color: listing.color, power: listing.power, powerHp: parseAdvertNumber(listing.power),
    images, sourceUrl: source.href, features: [...listing.features],
    description: `${make} ${model}, ${year} г., ${fuel.toLocaleLowerCase('bg-BG')}, ${new Intl.NumberFormat('bg-BG').format(mileageKm)} км. ${inventoryNotice}`
  }];
}).slice(0, 12);

if (!eliqStock.length) throw new Error('ELIQ sample inventory is empty; inspect the saved source before previewing.');
