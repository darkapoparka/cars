import dealerPack from './dealer-pack.json';

export type CurrentDayNightListing = {
  id: string; title: string; sourceUrl: string; priceEur: string; priceBgn: string;
  status: string; date: string; mileage: string; color: string; fuel: string;
  power: string; transmission: string; body: string; features: string[]; image: string;
};
const number = new Intl.NumberFormat('bg-BG', { maximumFractionDigits: 2 });
export const currentDayNightListings: CurrentDayNightListing[] = dealerPack.inventory.map((record) => ({
  id: record.sourceId, title: record.title, sourceUrl: record.sourceUrl,
  priceEur: `${number.format(record.price)} €`, priceBgn: '',
  status: 'Наличност по телефона', date: record.productionDate,
  mileage: `${number.format(record.mileage)} км`, color: record.color || '—',
  fuel: record.fuelLabel, power: record.powerHp === null ? '—' : `${record.powerHp} к.с.`,
  transmission: record.transmissionLabel, body: record.bodyLabel,
  features: [...record.equipment], image: record.thumbnail
}));
