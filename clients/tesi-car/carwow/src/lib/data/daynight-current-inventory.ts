import facts from './dealer-facts.json';

// Historical module name retained for compatibility; every record belongs to
// this client's explicit source snapshot, never to the template's dealer.
export type CurrentDayNightListing = {
  id: string; title: string; sourceUrl: string; priceEur: string; priceBgn: string;
  status: string; date: string; mileage: string; color: string; fuel: string;
  power: string; transmission: string; body: string; features: string[]; image: string;
};
const number = new Intl.NumberFormat('bg-BG');
const bodies: Record<string, string> = { suv: 'SUV', hatchback: 'Хечбек', van: 'Миниван', sedan: 'Седан', wagon: 'Комби', coupe: 'Купе' };
export const currentDayNightListings: CurrentDayNightListing[] = facts.vehicles.map(record => ({
  id: record.sourceId,
  title: record.title,
  sourceUrl: record.sourceUrl,
  priceEur: `${number.format(record.price)} €`,
  priceBgn: '',
  status: 'Публикувана обява',
  date: record.productionDate,
  mileage: `${number.format(record.mileageKm)} км`,
  color: record.color,
  fuel: record.fuel === 'diesel' ? 'Дизелов' : 'Бензинов',
  power: `${record.powerHp} к.с.`,
  transmission: record.transmission === 'automatic' ? 'Автоматична' : 'Ръчна',
  body: bodies[record.body] ?? record.body,
  features: [...record.features],
  image: record.photos[0].sourceUrl
}));
