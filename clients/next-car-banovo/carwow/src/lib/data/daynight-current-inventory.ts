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
};


import stock from './dealer-stock.json';
const number = (value: number) => new Intl.NumberFormat('bg-BG').format(value);
/** Dated public listing sample, not a live or independently verified feed. */
export const currentDayNightListings: CurrentDayNightListing[] = stock.vehicles.map((vehicle) => ({
 id: vehicle.sourceId, title: vehicle.title, sourceUrl: vehicle.sourceUrl,
 priceEur: vehicle.priceEur > 0 ? number(vehicle.priceEur) + ' €' : 'Цена при запитване',
 priceBgn: '', status: vehicle.availabilityLabel, date: String(vehicle.year) + ' г.',
 mileage: number(vehicle.mileageKm) + ' км', color: vehicle.color,
 fuel: vehicle.fuelType === 'electric' ? 'Електрически' : vehicle.fuel,
 power: vehicle.powerHp ? number(vehicle.powerHp) + ' к.с.' : 'По запитване',
 transmission: vehicle.transmission, body: vehicle.bodyLabel,
 features: vehicle.equipment, image: vehicle.image
}));
