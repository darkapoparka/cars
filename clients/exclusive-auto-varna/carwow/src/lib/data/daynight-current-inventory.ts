import stock from './dealer-stock.json';

/** Compatibility export for retained consumers. All records come from the same dealer pack. */
export type CurrentDayNightListing = {
  id: string;
  title: string;
  sourceUrl: string;
  priceEur: string;
  priceBgn: string;
  status: string;
  date: string;
  mileage: string;
  color: string;
  fuel: string;
  power: string;
  transmission: string;
  body: string;
  features: string[];
  image: string;
  gallery: string[];
};

const number = new Intl.NumberFormat(stock.facts.locale);
const money = new Intl.NumberFormat(stock.facts.locale, {
  style: 'currency', currency: stock.facts.currency, maximumFractionDigits: 0
});

export const currentDayNightListings: CurrentDayNightListing[] = stock.vehicles.map((vehicle) => ({
  id: vehicle.sourceId,
  title: vehicle.title,
  sourceUrl: vehicle.sourceUrl,
  priceEur: money.format(vehicle.priceEur),
  priceBgn: vehicle.priceNote,
  status: vehicle.availabilityLabel,
  date: new Intl.DateTimeFormat(stock.facts.locale, { month: 'long', year: 'numeric', timeZone: 'UTC' })
    .format(new Date(Date.UTC(vehicle.year, vehicle.month - 1, 1))),
  mileage: `${number.format(vehicle.mileageKm)} км`,
  color: vehicle.color || 'По запитване',
  fuel: vehicle.fuel,
  power: vehicle.powerHp ? `${number.format(vehicle.powerHp)} к.с.` : 'По запитване',
  transmission: vehicle.transmission,
  body: vehicle.bodyLabel,
  features: [...vehicle.equipment],
  image: vehicle.image,
  gallery: [...vehicle.gallery]
}));
