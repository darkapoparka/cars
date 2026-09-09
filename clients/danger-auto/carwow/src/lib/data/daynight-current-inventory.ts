import stock from './dealer-stock.json';

export type CurrentDayNightListing = {
  id: string; title: string; sourceUrl: string; priceEur: string; priceBgn: string;
  status: string; date: string; mileage: string; color: string; fuel: string;
  power: string; transmission: string; body: string; features: string[]; image: string;
};
const number = new Intl.NumberFormat('bg-BG');
/** Seller-advertised snapshot, not a live feed or independent verification. */
export const currentDayNightListings: CurrentDayNightListing[] = stock.listings.map(record => ({
  id: record.sourceId,
  title: record.title,
  sourceUrl: record.evidenceUrl,
  priceEur: record.priceEur > 0 ? `${number.format(record.priceEur)} €` : 'Цена при запитване',
  priceBgn: '',
  status: 'Наличността се потвърждава',
  date: `${record.productionMonth.toString().padStart(2, '0')}.${record.yearNumber}`,
  mileage: `${number.format(record.mileageKm)} км`,
  color: record.color,
  fuel: record.fuel,
  power: record.powerHp === null ? 'Не е посочена' : `${record.powerHp} к.с.`,
  transmission: record.transmission,
  body: record.category,
  features: [...record.equipment],
  image: '/assets/images/lead/stock-photo-pending.svg',
}));
